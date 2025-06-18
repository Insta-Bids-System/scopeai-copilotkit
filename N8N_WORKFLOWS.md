# n8n Workflows Documentation

## Active Workflows in the Multi-Agent Pain Point Scoping System

### 1. Tool: Save Enhanced Pain Point Report ✅
**Workflow ID**: `NHrptzFZAmU9XPEr`
**Webhook URL**: `https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report`
**Purpose**: Receives pain point data from the frontend and saves it to Google Drive

**Workflow Steps**:
1. **Webhook Trigger**: Receives POST request with session data
2. **Data Processing**: Formats the received JSON data
3. **Google Drive - Create JSON**: Saves structured data as `{uid}-PainPointScope-{date}.json`
4. **Google Drive - Create Doc**: Creates human-readable summary document
5. **Response**: Returns success/failure status to frontend

**Expected Input**:
```json
{
  "sessionId": "uuid",
  "companyName": "string",
  "userRole": "string",
  "userIndustry": "string",
  "primaryJob": "string",
  "functionalAspects": ["array"],
  "emotionalAspects": ["array"],
  "socialAspects": ["array"],
  "barriers": ["array"],
  "painPoints": [{
    "painPoint": "string",
    "impact": "string",
    "rootCauseAnalysis": [{"why": 1, "cause": "string"}],
    "rootCause": "string"
  }],
  "summary": "string",
  "transcript": "string"
}
```

### 2. Pain Point Scoping Agent - Enhanced ✅
**Workflow ID**: `5xvebcIlIWqAjfpf`
**Purpose**: Original conversational agent (now bypassed by CopilotKit frontend)
**Status**: Can be triggered by Orchestrator or run standalone

### 3. Auditor Agent - LLM Judge ✅
**Workflow ID**: `rmDfd1WAo8yEvDai`
**Webhook URL**: `https://instabidssystem.app.n8n.cloud/webhook/validation-required`
**Purpose**: Validates the quality of scoping sessions using Claude

**Workflow Steps**:
1. **Webhook Trigger**: Receives `sessionUID` 
2. **Google Drive Search**: Finds `{uid}-PainPointScope-{date}.json`
3. **Claude Evaluation**: Evaluates against 6 criteria
4. **Generate Report**: Creates validation scores
5. **Google Drive Save**: Saves `{uid}-ValidationReport.json`
6. **Webhook Call**: Publishes `validation_completed` event

### 4. Orchestrator Agent ✅
**Workflow ID**: `YUKAPKxWcWNuQxYj`
**Webhook URL**: `https://instabidssystem.app.n8n.cloud/webhook/api/start-scoping`
**Purpose**: Master controller for the entire system
**Note**: Currently bypassed when using CopilotKit direct integration

## Workflow Communication Flow

```
CopilotKit Frontend
    │
    ├──[Direct POST]──► Tool: Save Enhanced Pain Point Report
    │                           │
    │                           ├── Saves to Google Drive
    │                           │
    │                           └──[Webhook]──► Auditor Agent
    │                                                │
    │                                                └── Validates & Saves Report
    │
    └──[Alternative Path]──► Orchestrator Agent
                                   │
                                   ├──► Pain Point Scoping Agent
                                   │
                                   └──► Triggers other workflows
```

## How to Monitor Workflows

### 1. Access n8n Dashboard
- URL: https://instabidssystem.app.n8n.cloud
- Login with your credentials

### 2. Check Workflow Status
- Each workflow has an ON/OFF toggle
- Green = Active, Gray = Inactive
- Ensure all workflows are Active

### 3. Monitor Executions
- Click on any workflow
- Go to "Executions" tab
- View recent runs:
  - ✅ Success (green)
  - ❌ Error (red)
  - ⏸️ Waiting (yellow)

### 4. Debug Failed Executions
- Click on failed execution
- Check each node for errors
- Common issues:
  - Google Drive authentication expired
  - Webhook data format mismatch
  - API rate limits

### 5. Test Webhooks
Use Postman or cURL to test each webhook:

```bash
# Test Save Report Webhook
curl -X POST https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "test-123", "companyName": "Test", ...}'

# Test Validation Webhook
curl -X POST https://instabidssystem.app.n8n.cloud/webhook/validation-required \
  -H "Content-Type: application/json" \
  -d '{"sessionUID": "test-123"}'
```

## Google Drive Structure

All files are saved to: **"Ai Company Blue Print"** folder

File naming conventions:
- Pain Point Reports: `{uid}-PainPointScope-YYYY-MM-DD.json`
- Human Summaries: `Pain Point Analysis - {companyName} - YYYY-MM-DD`
- Validation Reports: `{uid}-ValidationReport.json`

## Troubleshooting

### Webhook Not Responding
1. Check workflow is Active
2. Verify webhook URL is correct
3. Check n8n execution logs

### No Files in Google Drive
1. Check Google OAuth credentials
2. Verify "Ai Company Blue Print" folder exists
3. Check workflow execution for errors

### Validation Not Running
1. Ensure Auditor workflow is Active
2. Check if Save Report workflow calls validation webhook
3. Verify sessionUID is passed correctly
