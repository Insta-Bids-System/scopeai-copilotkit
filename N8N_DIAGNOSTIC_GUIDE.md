# n8n Workflow Diagnostic Guide

## Checking the "Tool: Save Enhanced Pain Point Report" Workflow

### Workflow Details
- **Workflow ID**: `NHrptzFZAmU9XPEr`
- **Webhook Path**: `/webhook/save-pain-point-report`
- **Full URL**: `https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report`

### Step 1: Verify Workflow Structure

The workflow should have these nodes in order:

1. **Webhook Node**
   - Name: "Webhook"
   - HTTP Method: POST
   - Path: `/save-pain-point-report`
   - Response Mode: "On Received"
   - Response Data: "First Entry JSON"
   - Response Code: 200

2. **Set Node** (Data Formatting)
   - Should extract and format the incoming data
   - Map webhook data to Google Drive format

3. **Google Drive Node 1** (Create JSON)
   - Resource: File
   - Operation: Create From Text
   - File Name Expression: `{{$json.sessionId}}-PainPointScope-{{$now.format('yyyy-MM-dd')}}.json`
   - File Content: The complete JSON data
   - Parent Folder: "Ai Company Blue Print"

4. **Google Drive Node 2** (Create Doc)
   - Resource: File
   - Operation: Create From Text
   - File Name: `Pain Point Analysis - {{$json.companyName}} - {{$now.format('yyyy-MM-dd')}}`
   - Convert to Google Doc: Yes
   - Parent Folder: "Ai Company Blue Print"

5. **Webhook Response Node** (Optional)
   - Return success message

### Step 2: Common Issues and Fixes

#### Issue 1: Webhook Not Receiving Data
**Check**:
- Is the workflow Active? (toggle switch should be ON)
- Is the webhook path correct?
- Any typos in the URL?

**Fix**:
1. Click on the Webhook node
2. Verify the path is exactly: `/save-pain-point-report`
3. Ensure "HTTP Method" is POST
4. Save and activate the workflow

#### Issue 2: Data Not Formatting Correctly
**Check**:
- Click on a failed execution
- Check the output of each node
- Look for undefined or null values

**Fix in Set Node**:
```javascript
// Set node configuration
{
  "sessionId": "={{$json.body.sessionId}}",
  "companyName": "={{$json.body.companyName}}",
  "userRole": "={{$json.body.userRole}}",
  "userIndustry": "={{$json.body.userIndustry}}",
  "primaryJob": "={{$json.body.primaryJob}}",
  "functionalAspects": "={{$json.body.functionalAspects || []}}",
  "emotionalAspects": "={{$json.body.emotionalAspects || []}}",
  "socialAspects": "={{$json.body.socialAspects || []}}",
  "barriers": "={{$json.body.barriers || []}}",
  "painPoints": "={{$json.body.painPoints || []}}",
  "summary": "={{$json.body.summary}}",
  "transcript": "={{$json.body.transcript}}"
}
```

#### Issue 3: Google Drive Authentication
**Check**:
- Go to Credentials in n8n
- Find "Google Drive OAuth2"
- Is it connected?

**Fix**:
1. Click "Reconnect"
2. Authorize access to Google Drive
3. Make sure you have access to "Ai Company Blue Print" folder

#### Issue 4: Folder Not Found
**Check**:
- Does "Ai Company Blue Print" folder exist in your Google Drive?
- Is it spelled exactly like that?

**Fix**:
1. Create the folder in Google Drive if missing
2. Or update the folder name in both Google Drive nodes

### Step 3: Test the Webhook

1. **From Browser Console**:
```javascript
// Copy and paste this in browser console
fetch('https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    sessionId: 'browser-test-123',
    companyName: 'Browser Test',
    userRole: 'Developer',
    userIndustry: 'Tech',
    primaryJob: 'Testing',
    painPoints: [],
    summary: 'Test from browser',
    transcript: 'Test'
  })
}).then(r => r.text()).then(console.log).catch(console.error);
```

2. **From Command Line**:
```bash
curl -X POST https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"curl-test-123","companyName":"Curl Test","userRole":"Dev","userIndustry":"Tech","primaryJob":"Test","painPoints":[],"summary":"Test","transcript":"Test"}'
```

### Step 4: Debug in n8n

1. **Enable Test Mode**:
   - Open the workflow
   - Click "Execute Workflow" button
   - This runs in test mode showing data flow

2. **Check Each Node**:
   - Click on each node after execution
   - Check "Input Data" and "Output Data"
   - Look for errors in red

3. **Common Error Messages**:
   - "Cannot read property 'sessionId' of undefined" → Data path issue
   - "Folder not found" → Google Drive folder missing
   - "Unauthorized" → OAuth token expired
   - "Invalid JSON" → Data formatting issue

### Step 5: Update Workflow for CopilotKit

The workflow might need updates to handle the data structure from CopilotKit:

1. **Webhook Node**: No changes needed

2. **Set Node** might need to access data differently:
```javascript
// If data comes directly (not nested in body)
{
  "sessionId": "={{$json.sessionId}}",
  "companyName": "={{$json.companyName}}",
  // ... rest of fields
}
```

3. **Google Drive JSON Content**:
```javascript
// Ensure proper JSON structure
{
  "uid": "={{$json.sessionId}}",
  "sessionTimestamp": "={{$now.toISO()}}",
  "userPersona": {
    "role": "={{$json.userRole}}",
    "industry": "={{$json.userIndustry}}"
  },
  "jobToBeDone": {
    "primaryJob": "={{$json.primaryJob}}",
    "functionalAspects": {{$json.functionalAspects}},
    "emotionalAspects": {{$json.emotionalAspects}},
    "socialAspects": {{$json.socialAspects}},
    "barriers": {{$json.barriers}}
  },
  "identifiedPainPoints": {{$json.painPoints}},
  "conversationSummary": "={{$json.summary}}",
  "fullTranscript": "={{$json.transcript}}"
}
```

### Step 6: Add Validation Trigger

After saving files, add a webhook node to trigger the Auditor:

1. **Add HTTP Request Node** after Google Drive nodes
2. **Configure**:
   - URL: `https://instabidssystem.app.n8n.cloud/webhook/validation-required`
   - Method: POST
   - Body: `{"sessionUID": "={{$json.sessionId}}"}`
   - Headers: `Content-Type: application/json`

### Testing Script

Run `node test-webhook.js` from the project folder to test the webhook with proper data.

### Need More Help?

1. Share the execution error details
2. Export the workflow JSON and share it
3. Check the browser console for any CORS errors
4. Verify all workflows are Active in n8n dashboard
