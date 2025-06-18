# How to Find Your Correct Webhook URLs in n8n

Since all workflows are ACTIVE but webhooks return 404, the issue is likely the webhook URL format.

## Step-by-Step Guide to Find Correct URLs:

### 1. For "Tool: Save Enhanced Pain Point Report"

1. Open the workflow: https://instabidssystem.app.n8n.cloud/workflow/NHrptzFZAmU9XPEr
2. Click on the **Webhook** node (first node)
3. Look for the **"Webhook URLs"** section
4. You'll see two URLs:
   - **Test URL**: Used when testing in n8n editor
   - **Production URL**: This is what you need! ✅

5. Copy the **Production URL** - it might look like:
   - `https://instabidssystem.app.n8n.cloud/webhook/[some-id]/save-pain-point-report`
   - `https://instabidssystem.app.n8n.cloud/webhook-prod/save-pain-point-report`
   - Or some other pattern

### 2. For "Orchestrator Agent"

1. Open the workflow: https://instabidssystem.app.n8n.cloud/workflow/YUKAPKxWcWNuQxYj
2. Click on the **Webhook** node
3. Copy the **Production URL** from "Webhook URLs" section

## Common n8n Webhook URL Patterns:

Depending on your n8n version and configuration, the URL might be:

1. **Standard Pattern**: 
   ```
   https://[instance]/webhook/[path]
   ```

2. **With Workflow ID**:
   ```
   https://[instance]/webhook/[workflow-id]/[path]
   ```

3. **Production vs Test**:
   ```
   https://[instance]/webhook-prod/[path]  (production)
   https://[instance]/webhook-test/[path]  (test)
   ```

## Quick Check in n8n:

### Visual Guide:
```
┌─────────────────────────────────────┐
│         Webhook Node                 │
├─────────────────────────────────────┤
│ Parameters                          │
│ └─ Path: /save-pain-point-report   │
│ └─ Method: POST                    │
│                                     │
│ Webhook URLs ← LOOK HERE!          │
│ ├─ Test URL: https://...           │
│ └─ Production URL: https://... ← COPY THIS │
└─────────────────────────────────────┘
```

## Update Your Code:

Once you find the correct URLs, update your code:

### In `components/App.tsx`:
```javascript
// Replace this line:
const response = await fetch('https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report', {

// With the actual Production URL from n8n:
const response = await fetch('YOUR_ACTUAL_PRODUCTION_URL_HERE', {
```

### In `verify-n8n-workflows.js`:
Update the webhook URLs in the workflows object with the actual Production URLs.

## Test the Correct URL:

Run this to find working URLs:
```bash
node find-webhook-urls.js
```

Or manually test with curl using the Production URL from n8n:
```bash
curl -X POST [YOUR_PRODUCTION_URL] \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "test", "companyName": "Test"}'
```

## If Still Having Issues:

1. **Check Webhook Node Settings**:
   - Path should NOT include `/webhook/` 
   - Just put: `/save-pain-point-report`
   - Method: POST
   - Response Mode: "On Received"

2. **Check for Typos**:
   - Path is case-sensitive
   - No extra spaces
   - No special characters

3. **Try Recreating the Webhook**:
   - Delete the webhook node
   - Add a new one
   - Set path to: `/save-pain-point-report`
   - Save and activate

4. **Check n8n Logs**:
   - In n8n, go to Executions
   - Look for any failed webhook attempts
   - This will show if requests are reaching n8n

Remember: The URL shown in this guide might not match your actual URL. You MUST check in your n8n instance!
