# CopilotKit Troubleshooting - Complete Guide

## Issue
CopilotKit is not responding to messages despite proper setup.

## Diagnostic Steps

### 1. Test OpenAI API Directly
Navigate to: `http://localhost:3000/api/test-openai`

This will test if your OpenAI API key is working. You should see:
```json
{
  "status": "success",
  "response": "OpenAI is working!",
  "model": "gpt-3.5-turbo-0125"
}
```

If you see an error, your API key is the problem.

### 2. Test Minimal CopilotKit
Navigate to: `http://localhost:3000/minimal`

This is the absolute minimal CopilotKit setup. If this doesn't work, the issue is with CopilotKit configuration.

### 3. Common Issues and Solutions

#### Issue: Invalid API Key
**Symptoms**: 
- Error 401 or "Incorrect API key provided"
- No response from chat

**Solution**:
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Update `.env.local` with the new key
4. Restart your Next.js server

#### Issue: No Credits/Quota Exceeded
**Symptoms**:
- Error 429 or "You exceeded your current quota"
- Chat stops working suddenly

**Solution**:
1. Check your OpenAI usage at https://platform.openai.com/usage
2. Add credits to your account
3. Wait for rate limits to reset

#### Issue: Environment Variables Not Loading
**Symptoms**:
- API key not found errors
- undefined values in console

**Solution**:
1. Make sure `.env.local` file is in the root directory
2. Restart the Next.js development server
3. Don't use quotes around the API key in `.env.local`

#### Issue: CORS or Network Errors
**Symptoms**:
- Network errors in browser console
- CORS policy errors

**Solution**:
1. Make sure you're accessing via `localhost` not `127.0.0.1`
2. Clear browser cache and cookies
3. Try in incognito mode

### 4. Alternative Approach - Use CopilotKit Cloud

If local runtime continues to fail, try CopilotKit Cloud:

1. Update `.env.local`:
```
NEXT_PUBLIC_COPILOT_CLOUD_API_KEY="ck_pub_64075c460b15d61634dcfa491b116a20"
OPENAI_API_KEY="your-openai-key"
```

2. Update your component to use cloud:
```typescript
<CopilotKit publicApiKey={process.env.NEXT_PUBLIC_COPILOT_CLOUD_API_KEY}>
  {/* Your app */}
</CopilotKit>
```

### 5. Debug Logging

Add this to your `/app/api/copilotkit/route.ts`:

```typescript
export const POST = async (req: NextRequest) => {
  const body = await req.text();
  console.log("=== CopilotKit Request ===");
  console.log("Body length:", body.length);
  console.log("API Key exists:", !!process.env.OPENAI_API_KEY);
  console.log("API Key prefix:", process.env.OPENAI_API_KEY?.substring(0, 7));
  
  try {
    // ... rest of your code
  } catch (error) {
    console.error("=== CopilotKit Error ===");
    console.error(error);
    throw error;
  }
};
```

### 6. Check Browser Console

Open DevTools (F12) and look for:
1. Any red errors
2. Network tab - check the `/api/copilotkit` request
3. Response details - what's the actual error?

### 7. Verify Package Versions

Run:
```bash
npm list @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime
```

Make sure all versions match (currently 1.3.15).

### 8. Complete Reset

If nothing works:
```bash
# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Clear Next.js cache
rm -rf .next

# Reinstall
npm install

# Start fresh
npm run dev
```

## Quick Test Checklist

- [ ] OpenAI API test works (`/api/test-openai`)
- [ ] Minimal CopilotKit works (`/minimal`)
- [ ] No errors in browser console
- [ ] No errors in terminal
- [ ] Environment variables loaded correctly
- [ ] API key has credits

## If Still Not Working

The issue might be:
1. **Firewall/Proxy**: Corporate networks might block OpenAI
2. **Region Restrictions**: Some regions can't access OpenAI
3. **Browser Extensions**: Ad blockers might interfere
4. **Node Version**: Try Node 18 or 20

## Contact Support

If none of this works:
1. CopilotKit Discord: https://discord.gg/copilotkit
2. Create issue: https://github.com/CopilotKit/CopilotKit/issues
3. Check their docs: https://docs.copilotkit.ai
