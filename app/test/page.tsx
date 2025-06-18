'use client';
import React from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotChat } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';

export default function TestPage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ padding: '20px', margin: 0 }}>CopilotKit Test</h1>
        <div style={{ flex: 1, display: 'flex' }}>
          <CopilotChat 
            instructions="You are a helpful assistant. Respond to the user's messages."
            labels={{
              title: "Test Chat",
              initial: "Hello! How can I help you today?",
              placeholder: "Type a message..."
            }}
          />
        </div>
      </div>
    </CopilotKit>
  );
}
