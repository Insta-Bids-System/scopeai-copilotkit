'use client';
import React from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotChat } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';

// Force cloud configuration
export default function TestCloud() {
  console.log('Using CopilotKit Cloud configuration');
  
  return (
    <CopilotKit 
      publicApiKey="ck_pub_64075c460b15d61634dcfa491b116a20"
      // Explicitly disable runtime URL
      runtimeUrl={undefined}
    >
      <div style={{ height: '100vh', padding: '20px' }}>
        <h1>CopilotKit Cloud Test</h1>
        <p>This should work without any local API endpoint</p>
        <div style={{ height: 'calc(100% - 100px)' }}>
          <CopilotChat 
            instructions="You are a helpful assistant. Just say hello and confirm you're working."
          />
        </div>
      </div>
    </CopilotKit>
  );
}
