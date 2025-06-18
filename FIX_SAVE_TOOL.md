# Direct Google Drive Save Configuration for Pain Point Scoping Agent

## Replace the "Save Final Report" Tool with Direct Google Drive Save

### Step 1: Delete the Current Tool
Remove the existing "Save Final Report" Execute Workflow tool

### Step 2: Add New Nodes for Direct Save

#### 1. Code Node - "Format Report Data"
**Type**: Code
**Language**: JavaScript
**Code**:
```javascript
// Extract conversation data and format for saving
const sessionId = $input.first().json.sessionId || generateUID();
const timestamp = new Date().toISOString();
const date = new Date().toISOString().split('T')[0];

// Parse the conversation to extract structured data
// This is a simplified version - you may need to adjust based on actual data
const reportData = {
  uid: sessionId,
  sessionTimestamp: timestamp,
  userPersona: {
    role: $input.first().json.userRole || "Not specified",
    industry: $input.first().json.userIndustry || "Not specified"
  },
  jobToBeDone: {
    primaryJob: $input.first().json.primaryJob || "Not specified",
    functionalAspects: $input.first().json.functionalAspects || [],
    emotionalAspects: $input.first().json.emotionalAspects || [],
    socialAspects: $input.first().json.socialAspects || [],
    barriers: $input.first().json.barriers || []
  },
  identifiedPainPoints: $input.first().json.painPoints || [],
  conversationSummary: $input.first().json.summary || "No summary provided",
  fullTranscript: $input.first().json.transcript || "No transcript available"
};

function generateUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

return {
  json: {
    reportData: reportData,
    fileName: `${sessionId}-PainPointScope-${date}.json`,
    sessionId: sessionId
  }
};
```

#### 2. Google Drive Node - "Save JSON Report"
**Type**: Google Drive
**Resource**: File
**Operation**: Upload
**Configuration**:
- **File Name**: `={{$json.fileName}}`
- **File Content**: 
  ```
  {{JSON.stringify($json.reportData, null, 2)}}
  ```
- **Resolve Data**: true
- **Parents**: Add the folder ID for "Ai Company Blue Print"
- **Options**:
  - Convert to Google Docs: No
  - File Name Conflict Action: Rename

#### 3. Set Node - "Prepare Response"
**Type**: Set
**Configuration**:
```javascript
{
  "success": true,
  "message": "Report saved successfully",
  "sessionId": "={{$json.sessionId}}",
  "fileName": "={{$json.fileName}}",
  "fileId": "={{$json.id}}"
}
```

### Step 3: Connect the Nodes

Connect the nodes in this order:
1. AI Agent → Format Report Data (Code)
2. Format Report Data → Save JSON Report (Google Drive)
3. Save JSON Report → Prepare Response (Set)

### Alternative: Create a Simpler Tool

If you want to keep using the Execute Workflow approach but fix it:

1. Change the Workflow ID to: `NHrptzFZAmU9XPEr`
2. Make sure the "Tool: Save Enhanced Pain Point Report" workflow is active
3. Update the tool configuration to pass the correct parameters

## Why This Matters

The Pain Point Scoping Agent needs to save data in the correct format so that:
1. The Auditor Agent can find and validate it
2. The data structure matches what CopilotKit sends
3. Files are saved with consistent naming

## Recommendation

I recommend fixing the Execute Workflow tool to point to the correct workflow (`NHrptzFZAmU9XPEr`) because:
1. It maintains consistency with the overall architecture
2. The Save Report workflow already handles all the formatting
3. It triggers the Auditor Agent automatically
4. Less duplication of logic

Would you like me to provide more specific configuration details for either approach?
