// Comprehensive n8n Workflow Verification Script
// This script tests all 4 workflows in your Multi-Agent Pain Point Scoping System

const workflows = {
  orchestrator: {
    id: 'YUKAPKxWcWNuQxYj',
    name: 'Orchestrator Agent',
    webhook: 'https://instabidssystem.app.n8n.cloud/webhook/api/start-scoping',
    description: 'Master controller for the entire system'
  },
  saveReport: {
    id: 'NHrptzFZAmU9XPEr',
    name: 'Tool: Save Enhanced Pain Point Report',
    webhook: 'https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report',
    description: 'Receives pain point data and saves to Google Drive'
  },
  auditor: {
    id: 'rmDfd1WAo8yEvDai',
    name: 'Auditor Agent - LLM Judge',
    webhook: 'https://instabidssystem.app.n8n.cloud/webhook/validation-required',
    description: 'Validates scoping session quality using Claude'
  },
  scopingAgent: {
    id: '5xvebcIlIWqAjfpf',
    name: 'Pain Point Scoping Agent - Enhanced',
    webhook: null, // This is triggered internally, not via webhook
    description: 'Conversational agent for pain point discovery'
  }
};

// Test data for each workflow
const testData = {
  orchestrator: {
    message: "I need help with my deployment process",
    context: {
      userId: "test-user-123",
      source: "copilotkit-test"
    }
  },
  saveReport: {
    sessionId: `test-${Date.now()}`,
    companyName: 'Workflow Test Company',
    userRole: 'Software Developer',
    userIndustry: 'Technology',
    primaryJob: 'Improve deployment pipeline',
    functionalAspects: ['Automate deployments', 'Reduce errors'],
    emotionalAspects: ['Reduce stress', 'Increase confidence'],
    socialAspects: ['Better team collaboration'],
    barriers: ['Manual processes', 'Limited budget'],
    painPoints: [{
      painPoint: 'Slow manual deployments',
      impact: 'Delays releases by hours',
      rootCauseAnalysis: [
        { why: 1, cause: 'Takes 3 hours per deployment' },
        { why: 2, cause: 'Everything is manual' },
        { why: 3, cause: 'No automation tools' },
        { why: 4, cause: 'No budget allocated' },
        { why: 5, cause: 'Not seen as priority' }
      ],
      rootCause: 'Leadership doesn\'t prioritize DevOps'
    }],
    summary: 'Developer struggling with manual deployment processes due to lack of organizational support for automation.',
    transcript: 'Full conversation transcript here...'
  },
  auditor: {
    sessionUID: 'test-session-for-validation'
  }
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test individual workflow
async function testWorkflow(key) {
  const workflow = workflows[key];
  const data = testData[key];
  
  console.log(`\n${colors.blue}=== Testing ${workflow.name} ===${colors.reset}`);
  console.log(`Workflow ID: ${workflow.id}`);
  console.log(`Description: ${workflow.description}`);
  
  if (!workflow.webhook) {
    console.log(`${colors.yellow}⚠️  This workflow doesn't have a direct webhook endpoint${colors.reset}`);
    console.log('It is triggered internally by other workflows\n');
    return { workflow: workflow.name, status: 'SKIPPED', message: 'No webhook endpoint' };
  }
  
  console.log(`Webhook URL: ${workflow.webhook}`);
  console.log('Test data:', JSON.stringify(data, null, 2));
  
  try {
    const startTime = Date.now();
    const response = await fetch(workflow.webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    const responseTime = Date.now() - startTime;
    const responseText = await response.text();
    
    console.log(`\nResponse Status: ${response.status} ${response.statusText}`);
    console.log(`Response Time: ${responseTime}ms`);
    console.log(`Response Body: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
    
    if (response.ok) {
      console.log(`${colors.green}✅ SUCCESS: Workflow is active and responding${colors.reset}`);
      return {
        workflow: workflow.name,
        status: 'SUCCESS',
        statusCode: response.status,
        responseTime: responseTime,
        message: 'Workflow is active'
      };
    } else {
      console.log(`${colors.red}❌ ERROR: Workflow returned an error${colors.reset}`);
      return {
        workflow: workflow.name,
        status: 'ERROR',
        statusCode: response.status,
        responseTime: responseTime,
        message: responseText
      };
    }
  } catch (error) {
    console.log(`${colors.red}❌ FAILED: ${error.message}${colors.reset}`);
    return {
      workflow: workflow.name,
      status: 'FAILED',
      error: error.message,
      message: 'Could not reach webhook'
    };
  }
}

// Test workflow dependencies
async function testWorkflowChain() {
  console.log(`\n${colors.cyan}=== Testing Workflow Chain ===${colors.reset}`);
  console.log('Testing the complete flow: Frontend → Save Report → Auditor');
  
  // First, save a report
  console.log('\n1. Saving a test report...');
  const saveResult = await testWorkflow('saveReport');
  
  if (saveResult.status === 'SUCCESS') {
    console.log(`${colors.green}✓ Report saved successfully${colors.reset}`);
    
    // Wait a bit for Google Drive operations
    console.log('\n2. Waiting 3 seconds for Google Drive operations...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Then trigger validation
    console.log('\n3. Triggering validation...');
    const auditResult = await testWorkflow('auditor');
    
    if (auditResult.status === 'SUCCESS') {
      console.log(`${colors.green}✓ Validation triggered successfully${colors.reset}`);
      console.log('\n🎉 Complete workflow chain is functional!');
    } else {
      console.log(`${colors.red}✗ Validation failed${colors.reset}`);
    }
  } else {
    console.log(`${colors.red}✗ Save report failed, cannot test validation${colors.reset}`);
  }
}

// Main verification function
async function verifyAllWorkflows() {
  console.log(`${colors.cyan}╔═══════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║     n8n Multi-Agent System Verification Tool          ║${colors.reset}`);
  console.log(`${colors.cyan}╚═══════════════════════════════════════════════════════╝${colors.reset}`);
  console.log(`\nTimestamp: ${new Date().toISOString()}`);
  console.log('Testing all workflows in your n8n instance...\n');
  
  const results = [];
  
  // Test each workflow
  for (const key of Object.keys(workflows)) {
    const result = await testWorkflow(key);
    results.push(result);
    console.log('---');
  }
  
  // Test workflow chain
  await testWorkflowChain();
  
  // Summary report
  console.log(`\n${colors.cyan}=== VERIFICATION SUMMARY ===${colors.reset}`);
  console.log('\nWorkflow Status:');
  
  results.forEach(result => {
    const statusIcon = result.status === 'SUCCESS' ? '✅' : 
                      result.status === 'SKIPPED' ? '⏭️' : '❌';
    const statusColor = result.status === 'SUCCESS' ? colors.green : 
                       result.status === 'SKIPPED' ? colors.yellow : colors.red;
    
    console.log(`${statusIcon} ${result.workflow}: ${statusColor}${result.status}${colors.reset}`);
    if (result.message) {
      console.log(`   └─ ${result.message}`);
    }
  });
  
  // Recommendations
  console.log(`\n${colors.cyan}=== RECOMMENDATIONS ===${colors.reset}`);
  
  const failedWorkflows = results.filter(r => r.status === 'ERROR' || r.status === 'FAILED');
  
  if (failedWorkflows.length === 0) {
    console.log(`${colors.green}✅ All webhooks are functional!${colors.reset}`);
    console.log('\nNext steps:');
    console.log('1. Test the complete flow from CopilotKit frontend');
    console.log('2. Check Google Drive for created files');
    console.log('3. Monitor n8n execution logs for any warnings');
  } else {
    console.log(`${colors.red}⚠️  ${failedWorkflows.length} workflow(s) need attention:${colors.reset}`);
    
    failedWorkflows.forEach(workflow => {
      console.log(`\n${workflow.workflow}:`);
      if (workflow.statusCode === 404) {
        console.log('- Webhook not found. Check if the workflow is active');
        console.log('- Verify the webhook path is correct');
      } else if (workflow.statusCode === 500) {
        console.log('- Internal error in the workflow');
        console.log('- Check n8n execution logs for details');
        console.log('- Verify Google Drive authentication');
      } else if (workflow.status === 'FAILED') {
        console.log('- Cannot reach n8n instance');
        console.log('- Check if n8n is running');
        console.log('- Verify network connectivity');
      }
    });
  }
  
  // Check for Google Drive
  console.log(`\n${colors.cyan}=== MANUAL CHECKS REQUIRED ===${colors.reset}`);
  console.log('\n1. Google Drive:');
  console.log('   - Verify "Ai Company Blue Print" folder exists');
  console.log('   - Check for test files created by this script');
  console.log(`   - Look for: test-*-PainPointScope-${new Date().toISOString().split('T')[0]}.json`);
  
  console.log('\n2. n8n Dashboard:');
  console.log('   - Login to https://instabidssystem.app.n8n.cloud');
  console.log('   - Check "Executions" tab for each workflow');
  console.log('   - Look for any error messages');
  
  console.log('\n3. Workflow Configurations:');
  console.log('   - Ensure all workflows are Active (toggle ON)');
  console.log('   - Check Google Drive OAuth is connected');
  console.log('   - Verify webhook paths match documentation');
  
  console.log(`\n${colors.cyan}=== END OF VERIFICATION ===${colors.reset}\n`);
}

// Run verification
if (typeof window === 'undefined') {
  // Running in Node.js
  verifyAllWorkflows().catch(console.error);
} else {
  // Running in browser
  console.log('Running in browser environment...');
  verifyAllWorkflows().catch(console.error);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { verifyAllWorkflows, testWorkflow, workflows };
}
