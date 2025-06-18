# Quick Start Guide for Local Development

## Prerequisites
1. Make sure you have Node.js 18+ installed
2. Get your OpenAI API key from https://platform.openai.com/api-keys

## Setup Instructions

### 1. Install Dependencies
Open a terminal in the project directory and run:
```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- CopilotKit
- OpenAI SDK

### 2. Configure Environment Variables
Edit the `.env.local` file and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-openai-key-here
```

### 3. Run the Development Server
```bash
npm run dev
```

The application will start at http://localhost:3000

### 4. Test the Application
1. Open http://localhost:3000 in your browser
2. The CopilotKit sidebar should appear on the right
3. Start chatting with ScopeAI
4. Test the conversation flow:
   - It should ask about your goals (JTBD phase)
   - When you mention a problem, it should drill down with "why" questions
   - Data should appear in the main UI as you progress

## Troubleshooting

### If npm install fails:
1. Delete `node_modules` folder and `package-lock.json`
2. Run `npm cache clean --force`
3. Try `npm install` again

### If CopilotKit doesn't connect:
1. Check that your OpenAI API key is correctly set in `.env.local`
2. Make sure the key has GPT-4o access
3. Check browser console for errors

### If the UI looks broken:
1. Make sure all CSS is loading correctly
2. Try clearing browser cache
3. Check that you're using a modern browser (Chrome, Firefox, Edge)

## GitHub Setup

### 1. Create Repository
1. Go to https://github.com/new
2. Name: `scopeai-copilotkit`
3. Set as private (if desired)
4. Don't initialize with README (we already have one)

### 2. Push to GitHub
```bash
git remote add origin https://github.com/Insta-Bids-System/scopeai-copilotkit.git
git branch -M main
git push -u origin main
```

### 3. Check for Issues
- No merge conflicts expected (new repository)
- All files should upload successfully

## Next Steps

Once running locally:
1. Test the complete flow end-to-end
2. Verify webhook calls to n8n are working
3. Check that data saves to Google Drive
4. Prepare for Vercel deployment

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure n8n workflows are active
4. Contact: instabidssystem@gmail.com
