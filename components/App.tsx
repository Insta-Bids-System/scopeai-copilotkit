import React, { useState } from 'react';
import {
  CopilotKit,
  useCopilotAction,
  useCopilotReadable,
} from '@copilotkit/react-core';
import {
  CopilotSidebar,
  CopilotPopup,
} from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';

// Types for our structured data
interface UserPersona {
  role: string;
  industry: string;
}

interface JobToBeDone {
  primaryJob: string;
  functionalAspects: string[];
  emotionalAspects: string[];
  socialAspects: string[];
  barriers: string[];
}

interface RootCauseStep {
  why: number;
  cause: string;
}

interface PainPoint {
  painPoint: string;
  impact: string;
  rootCauseAnalysis: RootCauseStep[];
  rootCause: string;
}

interface SessionData {
  uid: string;
  sessionTimestamp: string;
  userPersona: UserPersona;
  jobToBeDone: JobToBeDone;
  identifiedPainPoints: PainPoint[];
  conversationSummary: string;
  fullTranscript: string;
}

function ScopeAIApp() {
  const [sessionData, setSessionData] = useState<SessionData>({
    uid: generateUID(),
    sessionTimestamp: new Date().toISOString(),
    userPersona: { role: '', industry: '' },
    jobToBeDone: {
      primaryJob: '',
      functionalAspects: [],
      emotionalAspects: [],
      socialAspects: [],
      barriers: [],
    },
    identifiedPainPoints: [],
    conversationSummary: '',
    fullTranscript: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Make session data readable to Copilot
  useCopilotReadable({
    description: "Current session data for the pain point scoping conversation",
    value: sessionData,
  });

  // Action: Update User Persona
  useCopilotAction({
    name: "updateUserPersona",
    description: "Update the user's role and industry information",
    parameters: [
      {
        name: "role",
        type: "string",
        description: "The user's job role or title",
        required: true,
      },
      {
        name: "industry",
        type: "string",
        description: "The industry the user works in",
        required: true,
      },
    ],
    handler: async ({ role, industry }) => {
      setSessionData(prev => ({
        ...prev,
        userPersona: { role, industry },
      }));
      return `Updated user persona: ${role} in ${industry}`;
    },
  });

  // Action: Update Job To Be Done
  useCopilotAction({
    name: "updateJobToBeDone",
    description: "Update the Job-to-be-Done framework data",
    parameters: [
      {
        name: "primaryJob",
        type: "string",
        description: "The primary job or goal the user is trying to achieve",
        required: true,
      },
      {
        name: "functionalAspects",
        type: "string[]",
        description: "Functional aspects of the job",
        required: false,
      },
      {
        name: "emotionalAspects",
        type: "string[]",
        description: "Emotional aspects of the job",
        required: false,
      },
      {
        name: "socialAspects",
        type: "string[]",
        description: "Social aspects of the job",
        required: false,
      },
      {
        name: "barriers",
        type: "string[]",
        description: "Barriers preventing job completion",
        required: false,
      },
    ],
    handler: async ({ primaryJob, functionalAspects = [], emotionalAspects = [], socialAspects = [], barriers = [] }) => {
      setSessionData(prev => ({
        ...prev,
        jobToBeDone: {
          primaryJob,
          functionalAspects,
          emotionalAspects,
          socialAspects,
          barriers,
        },
      }));
      return `Updated Job-to-be-Done: ${primaryJob}`;
    },
  });

  // Action: Add Pain Point Analysis
  useCopilotAction({
    name: "addPainPointAnalysis",
    description: "Add a pain point with its 5 Whys analysis",
    parameters: [
      {
        name: "painPoint",
        type: "string",
        description: "The identified pain point",
        required: true,
      },
      {
        name: "impact",
        type: "string",
        description: "The impact of this pain point",
        required: true,
      },
      {
        name: "rootCauseAnalysis",
        type: "object[]",
        description: "The 5 Whys analysis steps",
        required: true,
      },
      {
        name: "rootCause",
        type: "string",
        description: "The identified root cause",
        required: true,
      },
    ],
    handler: async ({ painPoint, impact, rootCauseAnalysis, rootCause }) => {
      const newPainPoint: PainPoint = {
        painPoint,
        impact,
        rootCauseAnalysis,
        rootCause,
      };
      
      setSessionData(prev => ({
        ...prev,
        identifiedPainPoints: [...prev.identifiedPainPoints, newPainPoint],
      }));
      
      return `Added pain point analysis for: ${painPoint}`;
    },
  });

  // Action: Save Final Report
  useCopilotAction({
    name: "saveFinalReport",
    description: "Save the final pain point scoping report",
    parameters: [
      {
        name: "summary",
        type: "string",
        description: "A summary of the conversation and findings",
        required: true,
      },
      {
        name: "transcript",
        type: "string",
        description: "The full conversation transcript",
        required: false,
      },
    ],
    handler: async ({ summary, transcript = '' }) => {
      setIsSaving(true);
      setSaveStatus('idle');
      
      const finalData = {
        ...sessionData,
        conversationSummary: summary,
        fullTranscript: transcript,
      };

      try {
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

        if (response.ok) {
          setSaveStatus('success');
          return "Report saved successfully! The team will review your pain points and develop a tailored solution.";
        } else {
          throw new Error('Failed to save report');
        }
      } catch (error) {
        setSaveStatus('error');
        return "Failed to save report. Please try again.";
      } finally {
        setIsSaving(false);
      }
    },
  });

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>ScopeAI</h1>
        <p>AI-Powered Pain Point Discovery</p>
      </header>
      
      <main className="app-main">
        <div className="session-info">
          <span>Session ID: {sessionData.uid.slice(0, 8)}...</span>
          {saveStatus === 'success' && (
            <span className="save-status success">✓ Saved</span>
          )}
          {saveStatus === 'error' && (
            <span className="save-status error">✗ Error</span>
          )}
        </div>

        <div className="data-preview">
          {sessionData.userPersona.role && (
            <div className="data-card">
              <h3>User Profile</h3>
              <p><strong>Role:</strong> {sessionData.userPersona.role}</p>
              <p><strong>Industry:</strong> {sessionData.userPersona.industry}</p>
            </div>
          )}
          
          {sessionData.jobToBeDone.primaryJob && (
            <div className="data-card">
              <h3>Job to be Done</h3>
              <p><strong>Primary Goal:</strong> {sessionData.jobToBeDone.primaryJob}</p>
            </div>
          )}
          
          {sessionData.identifiedPainPoints.length > 0 && (
            <div className="data-card">
              <h3>Identified Pain Points</h3>
              <ul>
                {sessionData.identifiedPainPoints.map((pp, index) => (
                  <li key={index}>
                    <strong>{pp.painPoint}</strong>
                    <br />
                    Root Cause: {pp.rootCause}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function generateUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function App() {
  // Use CopilotKit Cloud instead of local runtime
  const publicApiKey = "ck_pub_64075c460b15d61634dcfa491b116a20";

  return (
    <CopilotKit publicApiKey={publicApiKey}>
      <CopilotSidebar
        instructions={`You are ScopeAI, an expert Business Analyst and Product Strategist. 
            Your tone is professional, inquisitive, empathetic, and neutral. 
            Your core function is to diagnose problems using the Jobs-to-be-Done (JTBD) and 5 Whys frameworks.

            IMPORTANT: You have access to these actions:
            1. updateUserPersona(role, industry) - Call this when you learn about the user's role and industry
            2. updateJobToBeDone(primaryJob, functionalAspects, emotionalAspects, socialAspects, barriers) - Call this when you understand their JTBD
            3. addPainPointAnalysis(painPoint, impact, rootCauseAnalysis, rootCause) - Call this after completing a 5 Whys analysis
            4. saveFinalReport(summary) - Call this when ready to save the complete analysis

            CONVERSATION FLOW:
            1. Start by greeting the user and asking about their role and industry, then call updateUserPersona
            2. JTBD Discovery Phase: Understand their high-level goal and context, then call updateJobToBeDone
            3. 5 Whys Analysis Phase: When a pain point is mentioned, drill down to find root causes
            4. After each 5 Whys completion, call addPainPointAnalysis
            5. When analysis is complete, offer to save and call saveFinalReport

            RULES:
            - Ask only ONE question at a time
            - Never provide solutions, only diagnose
            - Be genuinely curious about their challenges
            - Always use the provided actions to update the session data
            - Ensure you complete at least one full 5 Whys analysis before offering to save
            
            Start with: "Hello! I'm ScopeAI, and I'm here to help you thoroughly understand and scope your challenges. To start, could you tell me about your role and the industry you work in?"`}
        defaultOpen={true}
        clickOutsideToClose={false}
      >
        <ScopeAIApp />
      </CopilotSidebar>
    </CopilotKit>
  );
}

export default App;
