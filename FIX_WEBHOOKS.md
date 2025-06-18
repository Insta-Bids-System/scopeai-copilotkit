# Quick Fix Guide for n8n Webhooks

## Fix "Tool: Save Enhanced Pain Point Report" Workflow

### Step 1: Activate the Workflow
1. Open workflow: https://instabidssystem.app.n8n.cloud/workflow/NHrptzFZAmU9XPEr
2. Click the toggle in top-right to turn it ON (should be green)

### Step 2: Check Webhook Node
1. Click on the first node (should be "Webhook")
2. Verify these settings:
   - **Webhook URLs**: Should show production URL
   - **Path**: `/save-pain-point-report` (no `/webhook/` prefix in the path field)
   - **Method**: `POST`
   - **Response Code**: `200`
   - **Response Mode**: `On Received` or `When Last Node Finishes`

### Step 3: Save and Test
1. Click "Save" (Ctrl+S)
2. Make sure workflow is still Active
3. The full webhook URL should be: `https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report`

## Fix "Orchestrator Agent" Workflow

### Step 1: Activate the Workflow
1. Open workflow: https://instabidssystem.app.n8n.cloud/workflow/YUKAPKxWcWNuQxYj
2. Click the toggle in top-right to turn it ON

### Step 2: Check Webhook Node
1. Click on the first node (should be "Webhook")
2. Verify these settings:
   - **Path**: `/api/start-scoping` (no `/webhook/` prefix)
   - **Method**: `POST`

## Common Issues:

### Issue: "Not registered for POST requests"
This usually means:
- Workflow is inactive
- Webhook path has a typo
- Method is set to GET instead of POST

### Issue: Path confusion
In n8n webhook node:
- You enter just the path: `/save-pain-point-report`
- n8n automatically creates the full URL: `https://[instance]/webhook/[path]`
- Don't include `/webhook/` in the path field

## Test After Fixing:

Run this command again:
```bash
node verify-n8n-workflows.js
```

Or test individual webhook:
```bash
curl -X POST https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "fix-test", "companyName": "Test", "userRole": "Dev", "userIndustry": "Tech", "primaryJob": "Test", "painPoints": [], "summary": "Test", "transcript": "Test"}'
```

## Expected Result:
- Should return 200 OK
- Check Google Drive for new files
- No more 404 errors
