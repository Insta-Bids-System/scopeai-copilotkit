import React, { useState, useEffect } from 'react';
import {
  CopilotKit,
  useCopilotAction,
  useCopilotReadable,
} from '@copilotkit/react-core';
import {
  CopilotSidebar,
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
  const [transcript, setTranscript] = useState<string[]>([]);

  // Track conversation messages
  const addToTranscript = (message: string) => {
    setTranscript(prev => [...prev, message]);
  };

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
      addToTranscript(`User Role: ${role}, Industry: ${industry}`);
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
      addToTranscript(`Primary Job: ${primaryJob}`);
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
      
      addToTranscript(`Pain Point Identified: ${painPoint} - Root Cause: ${rootCause}`);
      return `Added pain point analysis for: ${painPoint}`;
    },
  });

  // Action: Save Final Report
  useCopilotAction({
    name: "saveFinalReport",
    description: "Save the final pain point scoping report to n8n",
    parameters: [
      {
        name: "summary",
        type: "string",
        description: "A summary of the conversation and findings",
        required: true,
      },
    ],
    handler: async ({ summary }) => {
      setIsSaving(true);
      setSaveStatus('idle');
      
      const fullTranscript = transcript.join('\n\n');
      
      const reportData = {
        uid: sessionData.uid,
        sessionTimestamp: sessionData.sessionTimestamp,
        userPersona: sessionData.userPersona,
        jobToBeDone: sessionData.jobToBeDone,
        identifiedPainPoints: sessionData.identifiedPainPoints,
        conversationSummary: summary,
        fullTranscript: fullTranscript,
      };

      try {
        console.log('Sending report to n8n:', reportData);
        
        const response = await fetch('https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: reportData.uid,
            companyName: `ScopeAI Session - ${new Date().toLocaleDateString()}`,
            userRole: reportData.userPersona.role || 'Not specified',
            userIndustry: reportData.userPersona.industry || 'Not specified',
            primaryJob: reportData.jobToBeDone.primaryJob || 'Not specified',
            functionalAspects: reportData.jobToBeDone.functionalAspects,
            emotionalAspects: reportData.jobToBeDone.emotionalAspects,
            socialAspects: reportData.jobToBeDone.socialAspects,
            barriers: reportData.jobToBeDone.barriers,
            painPoints: reportData.identifiedPainPoints,
            summary: reportData.conversationSummary,
            transcript: reportData.fullTranscript,
          }),
        });

        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response:', responseText);

        if (response.ok) {
          setSaveStatus('success');
          
          // Update session data with the summary and transcript
          setSessionData(prev => ({
            ...prev,
            conversationSummary: summary,
            fullTranscript: fullTranscript,
          }));
          
          return "✅ Report saved successfully! The team will review your pain points and develop a tailored solution. Your session ID is: " + sessionData.uid;
        } else {
          throw new Error(`Server responded with ${response.status}: ${responseText}`);
        }
      } catch (error) {
        console.error('Error saving report:', error);
        setSaveStatus('error');
        return `❌ Failed to save report. Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact support.`;
      } finally {
        setIsSaving(false);
      }
    },
  });

  return (
    <div className="main-layout">
      <div className="content-area">
        <div className="app-container">
          <header className="app-header">
            <h1>ScopeAI</h1>
            <p>AI-Powered Pain Point Discovery System</p>
          </header>
          
          <main className="app-main">
            <div className="session-info">
              <span>Session ID: {sessionData.uid.slice(0, 8)}...</span>
              {isSaving && (
                <span className="save-status">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  Saving...
                </span>
              )}
              {!isSaving && saveStatus === 'success' && (
                <span className="save-status success">✓ Saved to Google Drive</span>
              )}
              {!isSaving && saveStatus === 'error' && (
                <span className="save-status error">✗ Save Failed</span>
              )}
            </div>

            <div className="data-preview">
              {!sessionData.userPersona.role && !sessionData.jobToBeDone.primaryJob && sessionData.identifiedPainPoints.length === 0 ? (
                <div className="empty-state">
                  <h2>Welcome to ScopeAI</h2>
                  <p>
                    Start a conversation with our AI assistant to discover and analyze 
                    your business pain points using proven frameworks.
                  </p>
                </div>
              ) : (
                <>
                  {sessionData.userPersona.role && (
                    <div className="data-card">
                      <h3>👤 User Profile</h3>
                      <p><strong>Role:</strong> {sessionData.userPersona.role}</p>
                      <p><strong>Industry:</strong> {sessionData.userPersona.industry}</p>
                    </div>
                  )}
                  
                  {sessionData.jobToBeDone.primaryJob && (
                    <div className="data-card">
                      <h3>🎯 Job to be Done</h3>
                      <p><strong>Primary Goal:</strong> {sessionData.jobToBeDone.primaryJob}</p>
                      {sessionData.jobToBeDone.functionalAspects.length > 0 && (
                        <p><strong>Functional Aspects:</strong> {sessionData.jobToBeDone.functionalAspects.join(', ')}</p>
                      )}
                      {sessionData.jobToBeDone.emotionalAspects.length > 0 && (
                        <p><strong>Emotional Drivers:</strong> {sessionData.jobToBeDone.emotionalAspects.join(', ')}</p>
                      )}
                      {sessionData.jobToBeDone.barriers.length > 0 && (
                        <p><strong>Barriers:</strong> {sessionData.jobToBeDone.barriers.join(', ')}</p>
                      )}
                    </div>
                  )}
                  
                  {sessionData.identifiedPainPoints.length > 0 && (
                    <div className="data-card">
                      <h3>🔍 Identified Pain Points</h3>
                      <ul>
                        {sessionData.identifiedPainPoints.map((pp, index) => (
                          <li key={index}>
                            <strong>{pp.painPoint}</strong>
                            <br />
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                              Impact: {pp.impact}
                            </span>
                            <br />
                            <span style={{ color: 'var(--accent-bright)', fontSize: '0.9rem' }}>
                              Root Cause: {pp.rootCause}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
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
  // Use CopilotKit Cloud
  const publicApiKey = "ck_pub_64075c460b15d61634dcfa491b116a20";

  return (
    <CopilotKit publicApiKey={publicApiKey}>
      <CopilotSidebar
        instructions={`You are ScopeAI, an expert Business Analyst and Product Strategist specializing in the Jobs-to-be-Done (JTBD) and 5 Whys frameworks.

IMPORTANT ACTIONS YOU MUST USE:
1. updateUserPersona(role, industry) - ALWAYS call this when you learn the user's role
2. updateJobToBeDone(primaryJob, functionalAspects, emotionalAspects, socialAspects, barriers) - Call after JTBD discovery
3. addPainPointAnalysis(painPoint, impact, rootCauseAnalysis, rootCause) - Call after each 5 Whys completion
4. saveFinalReport(summary) - Call when analysis is complete

CONVERSATION FLOW:
Phase 1: Introduction
- Greet the user professionally
- Ask about their role and industry
- Call updateUserPersona immediately after they respond

Phase 2: JTBD Discovery
- Ask: "What is the primary goal or progress you're trying to make in your work?"
- Explore functional, emotional, and social aspects
- Identify current tools/solutions and barriers
- Call updateJobToBeDone with all discovered information

Phase 3: 5 Whys Analysis
- When user mentions a pain point, pivot immediately
- Ask "Why does that happen?" iteratively (5 times)
- Track each why and its answer
- Call addPainPointAnalysis with complete analysis

Phase 4: Completion
- After identifying at least one root cause
- Summarize findings
- Ask if they want to save the analysis
- Call saveFinalReport with a comprehensive summary

RULES:
- One question at a time
- Never provide solutions
- Always use the actions to save data
- Be genuinely curious and empathetic
- Ensure data is captured before offering to save

Start with: "Hello! I'm ScopeAI, your AI Business Analyst. I'm here to help you thoroughly understand and scope your business challenges using proven frameworks. To begin, could you tell me about your role and the industry you work in?"`}
        defaultOpen={true}
        clickOutsideToClose={false}
      >
        <ScopeAIApp />
      </CopilotSidebar>
    </CopilotKit>
  );
}

export default App;
