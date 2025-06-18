'use client';
import React from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotChat } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';

export default function MinimalTest() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div style={{ height: '100vh' }}>
        <CopilotChat />
      </div>
    </CopilotKit>
  );
}
