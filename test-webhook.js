// Test script for n8n webhook debugging
// Run this in your browser console or as a Node.js script

async function testN8nWebhook() {
  console.log('=== Testing n8n Save Report Webhook ===\n');
  
  // Test data matching the expected schema
  const testData = {
    sessionId: `test-${Date.now()}`,
    companyName: 'Test Company - Debug Session',
    userRole: 'Software Developer',
    userIndustry: 'Technology',
    primaryJob: 'Build better software deployment pipelines',
    functionalAspects: ['Automate deployment', 'Reduce errors', 'Speed up releases'],
    emotionalAspects: ['Reduce stress', 'Feel confident about releases'],
    socialAspects: ['Better team collaboration', 'Improve reputation'],
    barriers: ['Manual processes', 'Lack of automation tools', 'Limited budget'],
    painPoints: [{
      painPoint: 'Slow deployment process',
      impact: 'Delays product releases and frustrates customers',
      rootCauseAnalysis: [
        { why: 1, cause: 'Deployments take 2-3 hours' },
        { why: 2, cause: 'Everything is done manually' },
        { why: 3, cause: 'No automation tools in place' },
        { why: 4, cause: 'Budget not allocated for tools' },
        { why: 5, cause: 'Leadership doesn\'t see it as priority' }
      ],
      rootCause: 'Organizational priorities don\'t include DevOps improvements'
    }],
    summary: 'User is a software developer struggling with slow, manual deployment processes. Root cause identified as organizational priority misalignment.',
    transcript: 'Test conversation transcript...'
  };

  console.log('Sending test data:', JSON.stringify(testData, null, 2));
  console.log('\nWebhook URL: https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report');
  
  try {
    const response = await fetch('https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('\n=== Response Details ===');
    console.log('Status:', response.status, response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response Body:', responseText);
    
    if (response.ok) {
      console.log('\n✅ SUCCESS: Webhook responded successfully!');
      console.log('Check your Google Drive "Ai Company Blue Print" folder for:');
      console.log(`- ${testData.sessionId}-PainPointScope-${new Date().toISOString().split('T')[0]}.json`);
      console.log(`- Pain Point Analysis - ${testData.companyName} document`);
    } else {
      console.log('\n❌ ERROR: Webhook returned an error');
      console.log('Possible issues:');
      console.log('1. Workflow is not active');
      console.log('2. Webhook URL has changed');
      console.log('3. Data format mismatch');
      console.log('4. Google Drive authentication expired');
    }
    
  } catch (error) {
    console.error('\n❌ NETWORK ERROR:', error);
    console.log('Possible issues:');
    console.log('1. CORS blocking the request (if running from browser)');
    console.log('2. Network connectivity issues');
    console.log('3. n8n server is down');
  }
  
  console.log('\n=== Test Complete ===');
}

// Alternative: Test with minimal data
async function testMinimalWebhook() {
  console.log('\n=== Testing with Minimal Data ===');
  
  const minimalData = {
    sessionId: 'minimal-test-123',
    companyName: 'Minimal Test',
    userRole: 'Tester',
    userIndustry: 'Testing',
    primaryJob: 'Test the webhook',
    painPoints: [],
    summary: 'Minimal test',
    transcript: 'Test'
  };
  
  try {
    const response = await fetch('https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(minimalData)
    });
    
    console.log('Minimal test response:', response.status);
    console.log('Response:', await response.text());
  } catch (error) {
    console.error('Minimal test error:', error);
  }
}

// Run the tests
console.log('Starting webhook tests...\n');
testN8nWebhook().then(() => testMinimalWebhook());
