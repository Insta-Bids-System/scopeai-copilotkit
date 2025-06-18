'use client';
import React, { useState } from 'react';
import {
  CopilotKit,
  useCopilotAction,
  useCopilotReadable,
} from '@copilotkit/react-core';
import {
  CopilotSidebar,
} from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';

function SimpleScopeAI() {
  const [userData, setUserData] = useState({
    role: '',
    industry: '',
  });

  // Make data readable
  useCopilotReadable({
    description: "User data",
    value: userData,
  });

  // Simple action
  useCopilotAction({
    name: "updateUser",
    description: "Update user information",
    parameters: [
      {
        name: "role",
        type: "string",
        description: "User's role",
        required: true,
      },
      {
        name: "industry",
        type: "string", 
        description: "User's industry",
        required: true,
      },
    ],
    handler: async ({ role, industry }) => {
      console.log('Action called:', { role, industry });
      setUserData({ role, industry });
      return "Updated user information";
    },
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple ScopeAI Test</h1>
      <div>
        <p>Role: {userData.role || 'Not set'}</p>
        <p>Industry: {userData.industry || 'Not set'}</p>
      </div>
    </div>
  );
}

export default function SimpleApp() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotSidebar
        instructions="You are ScopeAI. When the user says hello, greet them and ask about their role and industry. When they tell you, use the updateUser action to save this information."
        defaultOpen={true}
      >
        <SimpleScopeAI />
      </CopilotSidebar>
    </CopilotKit>
  );
}
