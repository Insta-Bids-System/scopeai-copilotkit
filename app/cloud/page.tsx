'use client';
import React, { useState } from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';

// Simple working example using CopilotKit Cloud
export default function CloudExample() {
  const [message, setMessage] = useState('');

  // Use CopilotKit Cloud API
  const publicApiKey = "ck_pub_64075c460b15d61634dcfa491b116a20";

  return (
    <CopilotKit publicApiKey={publicApiKey}>
      <CopilotSidebar
        instructions="You are a helpful assistant. Help the user with their questions."
        defaultOpen={true}
        clickOutsideToClose={false}
      >
        <div style={{ padding: '20px' }}>
          <h1>CopilotKit Cloud Test</h1>
          <p>This uses CopilotKit Cloud instead of local runtime.</p>
          <p>Status: {message || 'Ready'}</p>
        </div>
      </CopilotSidebar>
    </CopilotKit>
  );
}
