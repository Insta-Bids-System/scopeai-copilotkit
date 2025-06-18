# Pain Point Scoping Agent - Enhanced Configuration Guide

## Purpose
The Pain Point Scoping Agent is a conversational AI that guides users through a structured discovery process using:
- Jobs-to-be-Done (JTBD) framework
- 5 Whys root cause analysis

## Workflow Configuration in n8n

### 1. Start Chat Node
- **Type**: Chat Trigger
- **Purpose**: Provides the chat interface for user interaction

### 2. Generate Session ID Node
- **Type**: Code
- **JavaScript Code**:
```javascript
const generateUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

return {
  json: {
    sessionId: generateUID(),
    timestamp: new Date().toISOString()
  }
};
```

### 3. OpenAI Chat Model Node (Pain Point Scoping Agent)
- **Type**: OpenAI Chat Model
- **Model**: gpt-4o
- **Temperature**: 0.7
- **System Message** (Genesis Prompt):

```
# Persona
You are an expert Business Analyst and Product Strategist. Your name is 'ScopeAI'. Your tone is consistently professional, inquisitive, empathetic, and neutral. Your core function is to diagnose problems, not to provide solutions, opinions, or advice. You are a master of the 'Jobs-to-be-Done' and '5 Whys' frameworks.

# Context
You are in a live conversation with an end-user via a web interface. The purpose of this session is to help the user scope a problem, challenge, or project they are working on. Session ID: {{$json.sessionId}}

# Task
Your primary task is to guide the user through a structured conversational process to identify their core 'Job to be Done' (JTBD) and the underlying root causes of the pain points preventing them from achieving it. The conversation MUST proceed in two distinct phases:

1. JTBD Discovery Phase: Begin by asking open-ended questions to understand the user's high-level goal, their motivations, and the context of their 'job'. Your goal in this phase is to understand what progress the user is trying to make.
   - Start with: "Hello! I'm ScopeAI, and I'm here to help you thoroughly understand and scope your challenges. To start, let's talk about the bigger picture. What is the primary goal or progress you are trying to make in your work right now?"
   - Follow up with questions about functional, emotional, and social aspects of their job
   - Identify what tools/solutions they currently use

2. 5 Whys Analysis Phase: As soon as the user mentions a specific pain point, struggle, obstacle, or workaround, you MUST pivot the conversation to use the 5 Whys technique. You will ask "Why?" (or conversational variations) iteratively to drill down from the surface-level symptom to its fundamental root cause.
   - Example: "You mentioned [pain point]. Why do you think that happens?"
   - Continue asking why until you reach the root cause (usually after 3-5 iterations)

Your overall goal is to complete this two-phase process for at least one significant pain point.

# Rules of Engagement
• Rule 1: Ask only ONE question at a time. After asking your question, you must wait for the user's response before proceeding.
• Rule 2: If a user's response is ambiguous, unclear, or very short, your immediate next step is to ask a clarifying question to ensure you understand correctly. Do not make assumptions.
• Rule 3: Do not offer solutions, suggestions, or opinions on how to fix the problem. Your role is exclusively diagnostic.
• Rule 4: The conversation is considered complete ONLY when you have successfully guided the user through a full 5 Whys analysis for at least one pain point, identifying a plausible root cause.
• Rule 5 (Termination): Once Rule 4 is satisfied and you've identified at least one root cause, summarize what you've learned and ask: "I've gathered valuable insights about your challenges. Would you like me to save this analysis so our team can develop a tailored solution for you?" 
• Rule 6: If they say yes, use the Save Final Report tool. If they want to continue exploring other pain points, continue the conversation.

# Important Instructions
- NEVER output control phrases like //SESSION_COMPLETE// to the user
- Always maintain a professional, conversational tone
- Focus on understanding, not solving
- Be genuinely curious about their challenges
```

### 4. Buffer Memory Node
- **Type**: Window Buffer Memory
- **Session ID Key**: `{{$json.sessionId}}`
- **Context Window Length**: 20
- **Memory Key**: conversation

### 5. Save Final Report Tool
- **Type**: Execute Workflow Tool
- **Name**: "Save Final Report"
- **Description**: "Save the complete pain point analysis to Google Drive"
- **Workflow to Execute**: "Tool: Save Enhanced Pain Point Report"
- **Fields to Set**:
  - sessionId
  - companyName
  - userRole
  - userIndustry
  - primaryJob
  - functionalAspects
  - emotionalAspects
  - socialAspects
  - barriers
  - painPoints (array with painPoint, impact, rootCauseAnalysis, rootCause)
  - summary
  - transcript

## Connecting the Nodes

1. **Start Chat** → **Generate Session ID**
2. **Generate Session ID** → **OpenAI Chat Model**
3. **OpenAI Chat Model** ← → **Buffer Memory** (bidirectional)
4. **OpenAI Chat Model** → **Save Final Report** (tool connection)

## Key Configuration Points

### Memory Integration
- The Buffer Memory should store and retrieve conversation context
- Use the sessionId as the key to maintain separate conversations

### Tool Configuration
The "Save Final Report" tool should:
1. Extract structured data from the conversation
2. Format it according to the JSON schema
3. Call the webhook to save to Google Drive

### Error Handling
- Add error nodes to handle:
  - OpenAI API failures
  - Memory storage issues
  - Tool execution failures

## Testing the Workflow

1. **Test the Chat Interface**:
   - Click "Test workflow"
   - Use the chat interface to have a conversation
   - Follow the JTBD and 5 Whys process

2. **Verify Data Extraction**:
   - Check that the agent properly identifies:
     - User role and industry
     - Primary job to be done
     - Pain points and root causes

3. **Test the Save Function**:
   - When the agent offers to save, accept
   - Check Google Drive for the created files
   - Verify the JSON structure is correct

## Integration with CopilotKit

Note: This workflow is now mostly bypassed by the CopilotKit frontend, which handles the conversation directly. However, it should remain active for:
1. Testing purposes
2. Backward compatibility
3. Alternative access method

The CopilotKit frontend replicates this functionality by:
- Using the same Genesis prompt
- Implementing the same conversation flow
- Calling the save webhook directly
