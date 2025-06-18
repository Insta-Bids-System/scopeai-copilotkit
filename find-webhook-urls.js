// Webhook Path Diagnostic Script
// This will help identify the correct webhook URLs

const testUrls = [
  // Different possible URL patterns for Save Report webhook
  {
    name: 'Save Report - Standard Pattern',
    url: 'https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report',
    method: 'POST'
  },
  {
    name: 'Save Report - Without webhook prefix',
    url: 'https://instabidssystem.app.n8n.cloud/save-pain-point-report',
    method: 'POST'
  },
  {
    name: 'Save Report - With webhook-test',
    url: 'https://instabidssystem.app.n8n.cloud/webhook-test/save-pain-point-report',
    method: 'POST'
  },
  // Different possible URL patterns for Orchestrator
  {
    name: 'Orchestrator - Standard Pattern',
    url: 'https://instabidssystem.app.n8n.cloud/webhook/api/start-scoping',
    method: 'POST'
  },
  {
    name: 'Orchestrator - Without webhook prefix',
    url: 'https://instabidssystem.app.n8n.cloud/api/start-scoping',
    method: 'POST'
  }
];

const testData = {
  sessionId: 'path-test-123',
  companyName: 'Path Test',
  userRole: 'Developer',
  userIndustry: 'Tech',
  primaryJob: 'Testing webhook paths',
  painPoints: [],
  summary: 'Testing different webhook URL patterns',
  transcript: 'Test'
};

async function findCorrectWebhookUrl() {
  console.log('=== n8n Webhook Path Discovery ===\n');
  console.log('Testing different URL patterns to find the correct webhook endpoints...\n');
  
  const results = [];
  
  for (const test of testUrls) {
    console.log(`Testing: ${test.name}`);
    console.log(`URL: ${test.url}`);
    
    try {
      const response = await fetch(test.url, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });
      
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        console.log('✅ SUCCESS! This is the correct URL\n');
        results.push({ ...test, status: 'SUCCESS', code: response.status });
      } else {
        const text = await response.text();
        console.log(`❌ Failed: ${text.substring(0, 100)}...\n`);
        results.push({ ...test, status: 'FAILED', code: response.status, error: text });
      }
    } catch (error) {
      console.log(`❌ Network Error: ${error.message}\n`);
      results.push({ ...test, status: 'ERROR', error: error.message });
    }
  }
  
  console.log('\n=== RESULTS SUMMARY ===\n');
  
  const successful = results.filter(r => r.status === 'SUCCESS');
  
  if (successful.length > 0) {
    console.log('✅ Found working webhook URLs:\n');
    successful.forEach(result => {
      console.log(`${result.name}: ${result.url}`);
    });
    
    console.log('\n📝 Update your code with these URLs:');
    console.log('```javascript');
    if (successful.find(r => r.name.includes('Save Report'))) {
      const saveUrl = successful.find(r => r.name.includes('Save Report')).url;
      console.log(`// In components/App.tsx`);
      console.log(`const response = await fetch('${saveUrl}', {`);
    }
    if (successful.find(r => r.name.includes('Orchestrator'))) {
      const orchUrl = successful.find(r => r.name.includes('Orchestrator')).url;
      console.log(`\n// For Orchestrator`);
      console.log(`const response = await fetch('${orchUrl}', {`);
    }
    console.log('```');
  } else {
    console.log('❌ No working webhook URLs found!\n');
    console.log('Possible issues:');
    console.log('1. Webhook paths in n8n are configured differently');
    console.log('2. n8n instance might be using custom webhook prefix');
    console.log('3. Authentication might be required');
    console.log('\nPlease check in n8n:');
    console.log('1. Open the "Tool: Save Enhanced Pain Point Report" workflow');
    console.log('2. Click on the Webhook node');
    console.log('3. Look for "Webhook URLs" section - copy the Production URL');
    console.log('4. That\'s the exact URL you should use');
  }
}

// Also test GET requests to see if webhooks exist but with wrong method
async function testGetRequests() {
  console.log('\n\n=== Testing GET Requests ===\n');
  console.log('(The error mentioned "Did you mean to make a GET request?")\n');
  
  const getTests = [
    'https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report',
    'https://instabidssystem.app.n8n.cloud/webhook/api/start-scoping'
  ];
  
  for (const url of getTests) {
    try {
      const response = await fetch(url, { method: 'GET' });
      console.log(`GET ${url}`);
      console.log(`Status: ${response.status}`);
      if (response.ok) {
        console.log('✅ GET request works - webhook might be configured for GET instead of POST!\n');
      } else {
        console.log('❌ GET also returns error\n');
      }
    } catch (error) {
      console.log(`Network error: ${error.message}\n`);
    }
  }
}

// Run the discovery
findCorrectWebhookUrl()
  .then(() => testGetRequests())
  .catch(console.error);
