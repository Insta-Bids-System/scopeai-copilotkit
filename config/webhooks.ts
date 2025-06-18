// Webhook configuration for n8n
// UPDATE THESE WITH YOUR ACTUAL PRODUCTION URLs FROM N8N!

export const N8N_WEBHOOKS = {
  // Get these URLs from your n8n webhook nodes:
  // 1. Open the workflow in n8n
  // 2. Click on the Webhook node
  // 3. Look for "Webhook URLs" section
  // 4. Copy the "Production URL" (NOT the test URL)
  
  SAVE_REPORT: process.env.REACT_APP_N8N_SAVE_WEBHOOK || 'https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report',
  START_SCOPING: process.env.REACT_APP_N8N_START_WEBHOOK || 'https://instabidssystem.app.n8n.cloud/webhook/api/start-scoping',
  VALIDATION: process.env.REACT_APP_N8N_VALIDATION_WEBHOOK || 'https://instabidssystem.app.n8n.cloud/webhook/validation-required'
};

// Instructions:
// 1. Go to each workflow in n8n
// 2. Click the Webhook node
// 3. Find the "Production URL" in the "Webhook URLs" section
// 4. Replace the URLs above with your actual Production URLs
// 
// The URL might look like:
// - https://instabidssystem.app.n8n.cloud/webhook/abc123/save-pain-point-report
// - https://instabidssystem.app.n8n.cloud/webhook-prod/save-pain-point-report
// - Or some other pattern - use exactly what n8n shows you!
