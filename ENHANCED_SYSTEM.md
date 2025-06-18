# ScopeAI CopilotKit - Enhanced Multi-Agent System

## Overview
This is the enhanced implementation of ScopeAI that integrates the new Orchestrator Agent and Pain Point Scoping Agent workflows with the existing CopilotKit frontend.

## Architecture Update

### System Components

1. **Frontend Application (React + CopilotKit)**
   - Two modes: CopilotKit Mode and Direct Conversation Mode
   - Structured data collection with real-time UI updates
   - Integration with n8n webhooks

2. **n8n Workflows**
   - **Orchestrator Agent**: Master controller (Workflow ID: `YUKAPKxWcWNuQxYj`)
   - **Pain Point Scoping Agent - Enhanced**: Conversational AI (Workflow ID: `5xvebcIlIWqAjfpf`)
   - **Save Report Tool**: Data persistence (Workflow ID: `NHrptzFZAmU9XPEr`)
   - **Auditor Agent**: Quality validation (Workflow ID: `rmDfd1WAo8yEvDai`)

### New Features

1. **Dual Mode Operation**
   - **CopilotKit Mode**: Uses CopilotKit's structured actions for data collection
   - **Direct Conversation Mode**: Connects directly to the Orchestrator webhook for real-time conversation

2. **Enhanced Integration**
   - Automatic validation triggering after report save
   - Session ID tracking across all components
   - Error handling and status feedback

## How to Use

### CopilotKit Mode (Default)
1. Start the application
2. Use the CopilotKit sidebar to interact with the AI
3. The AI will guide you through JTBD and 5 Whys frameworks
4. Data is automatically saved when analysis is complete

### Direct Conversation Mode
1. Click "Direct Conversation" in the mode toggle
2. Chat directly with the enhanced Pain Point Scoping Agent
3. The conversation flows through the Orchestrator to the n8n workflow
4. Session completes when root cause is identified

## Webhook Endpoints

All webhooks are configured in `config/webhooks.ts`:

```typescript
{
  SAVE_REPORT: 'https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report',
  START_SCOPING: 'https://instabidssystem.app.n8n.cloud/webhook/api/start-scoping',
  VALIDATION: 'https://instabidssystem.app.n8n.cloud/webhook/validation-required'
}
```

## Data Flow

### CopilotKit Mode:
```
User → CopilotKit UI → Structured Actions → Save Report Webhook → Google Drive → Auditor
```

### Direct Conversation Mode:
```
User → Chat UI → Orchestrator Webhook → Pain Point Scoping Agent → Save Report → Auditor
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure CopilotKit**
   - Ensure your OpenAI API key is set in CopilotKit Cloud dashboard
   - Public key is already configured: `ck_pub_64075c460b15d61634dcfa491b116a20`

3. **Verify n8n Workflows**
   - All workflows should be active in n8n
   - Check webhook URLs match the configuration

4. **Run the Application**
   ```bash
   npm run dev
   ```

## Testing Both Modes

### Test CopilotKit Mode:
1. Open http://localhost:3000
2. Start chatting in the sidebar
3. Follow the AI's prompts
4. Check if data saves to Google Drive

### Test Direct Conversation Mode:
1. Toggle to "Direct Conversation"
2. Send a message
3. Verify response from n8n workflow
4. Complete a full session

## Troubleshooting

### Common Issues:
- **No response in Direct Mode**: Check Orchestrator workflow is active
- **Save fails**: Verify Google Drive credentials in n8n
- **Validation doesn't run**: Check Auditor workflow is active

### Debug Steps:
1. Check browser console for errors
2. Monitor n8n workflow executions
3. Verify webhook URLs are accessible
4. Check network tab for API calls

## Deployment

The application is ready for deployment with both modes:

```bash
npm run build
```

Deploy to Vercel/Netlify with these environment variables:
- `NEXT_PUBLIC_COPILOT_CLOUD_API_KEY` (optional, defaults to hardcoded value)

## Next Steps

1. Test both conversation modes thoroughly
2. Monitor n8n workflow performance
3. Review validation reports in Google Drive
4. Fine-tune the AI prompts based on results
