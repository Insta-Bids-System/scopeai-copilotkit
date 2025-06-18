# n8n Backend and Google Drive Verification Guide

## How the Frontend Triggers n8n

### 1. Frontend to n8n Flow

The CopilotKit frontend communicates with n8n through the `saveFinalReport` action in `components/App.tsx`:

```javascript
// When the AI calls saveFinalReport, this code executes:
const response = await fetch('https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    sessionId: finalData.uid,
    companyName: 'ScopeAI Session',
    userRole: finalData.userPersona.role,
    userIndustry: finalData.userPersona.industry,
    primaryJob: finalData.jobToBeDone.primaryJob,
    painPoints: finalData.identifiedPainPoints,
    summary: finalData.conversationSummary,
    transcript: finalData.fullTranscript,
  }),
});
```

### 2. Data Flow
1. User converses with CopilotKit AI
2. AI calls actions to update session data:
   - `updateUserPersona` - captures role/industry
   - `updateJobToBeDone` - captures JTBD framework data
   - `addPainPointAnalysis` - captures pain points and 5 Whys
3. AI calls `saveFinalReport` when complete
4. Frontend sends POST request to n8n webhook
5. n8n workflow processes and saves to Google Drive

## How to Verify Everything is Working

### Step 1: Test the Frontend Connection

1. **Open Developer Console**
   ```
   npm run dev
   ```
   Open http://localhost:3000 and press F12 for Developer Tools

2. **Monitor Network Tab**
   - Go to Network tab
   - Filter by "Fetch/XHR"
   - Complete a conversation with the AI
   - Look for POST request to `save-pain-point-report`

3. **Check Request Details**
   - Status should be 200 OK
   - Request payload should contain all session data
   - Response should indicate success

### Step 2: Verify n8n Webhook

1. **Test with cURL or Postman**
   ```bash
   curl -X POST https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report \
     -H "Content-Type: application/json" \
     -d '{
       "sessionId": "test-123",
       "companyName": "Test Company",
       "userRole": "Developer",
       "userIndustry": "Technology",
       "primaryJob": "Build better software",
       "painPoints": [{
         "painPoint": "Slow deployment",
         "impact": "Delays releases",
         "rootCauseAnalysis": [
           {"why": 1, "cause": "Manual processes"},
           {"why": 2, "cause": "No automation"},
           {"why": 3, "cause": "Lack of tools"},
           {"why": 4, "cause": "Budget constraints"},
           {"why": 5, "cause": "Low priority"}
         ],
         "rootCause": "Organizational priorities"
       }],
       "summary": "Test summary",
       "transcript": "Test transcript"
     }'
   ```

2. **Check n8n Execution History**
   - Log into n8n.cloud
   - Go to your workflow: "Tool: Save Enhanced Pain Point Report"
   - Click "Executions" tab
   - Look for recent executions
   - Check if status is "Success"

### Step 3: Verify Google Drive Operations

1. **Check Google Drive Folder**
   - Open Google Drive
   - Navigate to "Ai Company Blue Print" folder
   - Look for files with pattern:
     - `{uid}-PainPointScope-{date}.json`
     - Google Docs with session summaries

2. **Verify File Contents**
   - JSON file should contain structured data:
     ```json
     {
       "uid": "test-123",
       "sessionTimestamp": "2025-06-18T...",
       "userPersona": {
         "role": "Developer",
         "industry": "Technology"
       },
       "jobToBeDone": {...},
       "identifiedPainPoints": [...],
       "conversationSummary": "...",
       "fullTranscript": "..."
     }
     ```

3. **Check Google Doc Format**
   - Should have formatted summary
   - Headers for each section
   - Readable pain point analysis

### Step 4: Debug Common Issues

#### Issue: Webhook Returns 404
- **Cause**: Wrong URL or webhook not active
- **Fix**: 
  1. Log into n8n
  2. Open "Tool: Save Enhanced Pain Point Report" workflow
  3. Ensure it's Active (toggle switch ON)
  4. Check webhook URL matches exactly

#### Issue: No Files in Google Drive
- **Cause**: Google OAuth expired or permissions issue
- **Fix**:
  1. In n8n, go to Credentials
  2. Find Google Drive OAuth2
  3. Click "Reconnect"
  4. Re-authorize access
  5. Test the workflow manually

#### Issue: CORS Errors
- **Cause**: Browser blocking cross-origin requests
- **Fix**: n8n webhooks should have CORS enabled by default
- **Verify**: Check n8n webhook node settings

### Step 5: Monitor the Complete Flow

1. **End-to-End Test**
   - Start a new conversation
   - Provide your role and industry
   - Describe a job to be done
   - Mention a specific pain point
   - Complete the 5 Whys analysis
   - Let AI save the report

2. **Verification Points**
   - Frontend shows "✓ Saved" status
   - n8n execution shows success
   - Google Drive has new files
   - Auditor workflow triggers (if enabled)

### Step 6: Check Auditor Workflow

If the Auditor Agent is active:
1. Check for `{uid}-ValidationReport.json` in Google Drive
2. Review validation scores
3. Check n8n "Auditor Agent - LLM Judge" executions

## Troubleshooting Commands

### Check n8n Logs
In n8n workflow editor:
1. Click on any node
2. Check "Input Data" and "Output Data"
3. Look for error messages

### Test Individual Components
```javascript
// Test UID generation
console.log(generateUID());

// Test session data structure
console.log(JSON.stringify(sessionData, null, 2));

// Test webhook manually
fetch('https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({/* test data */})
}).then(r => console.log('Status:', r.status));
```

## Success Indicators

✅ Frontend shows success message after saving
✅ Network tab shows 200 OK response
✅ n8n execution history shows successful runs
✅ Google Drive contains JSON and Doc files
✅ File names follow pattern: `{uid}-PainPointScope-{date}`
✅ JSON structure matches schema
✅ Auditor creates validation reports (if enabled)

## Next Steps

1. Set up monitoring dashboard in Google Sheets
2. Configure email alerts for failed executions
3. Implement retry logic for network failures
4. Add user feedback collection
