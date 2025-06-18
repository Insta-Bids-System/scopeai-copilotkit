# n8n Workflows Manual Verification Checklist

## Prerequisites
- Access to n8n dashboard: https://instabidssystem.app.n8n.cloud
- Google Drive access with "Ai Company Blue Print" folder
- Browser developer tools for testing

## Workflow 1: Orchestrator Agent (YUKAPKxWcWNuQxYj)

### Check in n8n:
- [ ] Workflow is Active (toggle is ON)
- [ ] Webhook node path: `/api/start-scoping`
- [ ] HTTP Method: POST
- [ ] Response Mode: "On Received"

### Nodes to verify:
1. **Webhook Trigger**
   - Path: `/api/start-scoping`
   - Authentication: None

2. **Execute Workflow Node**
   - Target Workflow: "Pain Point Scoping Agent - Enhanced"
   - Should pass initial context

3. **Response Node**
   - Should return session info

### Test:
```bash
curl -X POST https://instabidssystem.app.n8n.cloud/webhook/api/start-scoping \
  -H "Content-Type: application/json" \
  -d '{"message": "Test", "context": {"userId": "test"}}'
```

---

## Workflow 2: Tool: Save Enhanced Pain Point Report (NHrptzFZAmU9XPEr)

### Check in n8n:
- [ ] Workflow is Active (toggle is ON)
- [ ] Webhook node path: `/save-pain-point-report`
- [ ] Google Drive credential is connected
- [ ] "Ai Company Blue Print" folder exists in Drive

### Nodes to verify:
1. **Webhook Trigger**
   - Path: `/save-pain-point-report`
   - HTTP Method: POST

2. **Set/Format Data Node** (if exists)
   - Maps incoming data correctly
   - Handles arrays properly

3. **Google Drive Node 1** (JSON File)
   - Operation: Create From Text
   - File Name: `{{$json.sessionId}}-PainPointScope-{{$now.format('yyyy-MM-dd')}}.json`
   - Folder: "Ai Company Blue Print"

4. **Google Drive Node 2** (Google Doc)
   - Operation: Create From Text
   - Convert to Google Doc: Yes
   - Folder: "Ai Company Blue Print"

5. **HTTP Request Node** (Trigger Auditor)
   - URL: `https://instabidssystem.app.n8n.cloud/webhook/validation-required`
   - Method: POST
   - Body: `{"sessionUID": "{{$json.sessionId}}"}`

### Test:
Run `node verify-n8n-workflows.js` or use the test in the checklist

---

## Workflow 3: Auditor Agent - LLM Judge (rmDfd1WAo8yEvDai)

### Check in n8n:
- [ ] Workflow is Active (toggle is ON)
- [ ] Webhook node path: `/validation-required`
- [ ] Claude/Anthropic credentials configured
- [ ] Google Drive credential connected

### Nodes to verify:
1. **Webhook Trigger**
   - Path: `/validation-required`
   - Expects: `{"sessionUID": "string"}`

2. **Google Drive Search**
   - Search for: `{{$json.sessionUID}}-PainPointScope-*.json`
   - In folder: "Ai Company Blue Print"

3. **Google Drive Download**
   - Downloads the found JSON file

4. **Claude/AI Node** (Multiple)
   - Evaluates each criterion
   - Returns scores and reasoning

5. **Aggregate Results**
   - Combines all scores
   - Creates validation report

6. **Google Drive Save**
   - Saves: `{{$json.sessionUID}}-ValidationReport.json`

### Test:
```bash
curl -X POST https://instabidssystem.app.n8n.cloud/webhook/validation-required \
  -H "Content-Type: application/json" \
  -d '{"sessionUID": "existing-session-id"}'
```

---

## Workflow 4: Pain Point Scoping Agent - Enhanced (5xvebcIlIWqAjfpf)

### Check in n8n:
- [ ] Workflow is Active (toggle is ON)
- [ ] OpenAI credentials configured
- [ ] Memory nodes configured (if used)

### Nodes to verify:
1. **Trigger** (Chat or Execute Workflow)
   - Can be triggered by Orchestrator
   - Or runs standalone with Chat interface

2. **AI Agent Node**
   - Model: GPT-4o
   - Has Genesis Prompt configured
   - Memory enabled

3. **Tool Nodes**
   - Connected to Save Report workflow

### Note:
This workflow is now mostly bypassed by CopilotKit frontend but should remain active for backward compatibility.

---

## System-Wide Checks

### 1. Credentials
- [ ] Google Drive OAuth2 - Connected and not expired
- [ ] OpenAI API - Valid key with credits
- [ ] Anthropic API - Valid key (for Auditor)

### 2. Google Drive
- [ ] "Ai Company Blue Print" folder exists
- [ ] You have write permissions
- [ ] Recent test files are visible

### 3. Execution History
For each workflow:
- [ ] Check last 10 executions
- [ ] No repeated failures
- [ ] Average execution time < 30 seconds

### 4. Integration Test
1. [ ] Run the complete test script: `node verify-n8n-workflows.js`
2. [ ] Check Google Drive for new files
3. [ ] Verify validation report is created
4. [ ] Test from CopilotKit frontend

---

## Common Issues & Solutions

### Issue: 404 Not Found
- Workflow is inactive → Turn it ON
- Wrong webhook path → Check exact path
- Typo in URL → Verify character by character

### Issue: 500 Internal Server Error
- Check execution logs in n8n
- Usually data format mismatch
- Or Google Drive auth expired

### Issue: No Files Created
- Check Google Drive permissions
- Verify folder name exactly matches
- Check if OAuth needs reauthorization

### Issue: Validation Not Running
- Save Report workflow must call validation webhook
- Check if HTTP Request node exists
- Verify sessionUID is passed correctly

---

## Quick Test Commands

```bash
# Test all workflows
node verify-n8n-workflows.js

# Test individual webhook
node test-webhook.js

# Check from browser console
fetch('https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({sessionId: 'test-123', companyName: 'Test', userRole: 'Dev', userIndustry: 'Tech', primaryJob: 'Test', painPoints: [], summary: 'Test', transcript: 'Test'})
}).then(r => console.log(r.status));
```

---

## Expected Results

When all workflows are functioning:
1. ✅ All webhooks return 200 OK
2. ✅ Files appear in Google Drive within 5 seconds
3. ✅ Validation report generated within 30 seconds
4. ✅ No errors in n8n execution logs
5. ✅ CopilotKit can save reports successfully
