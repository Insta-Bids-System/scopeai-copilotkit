# ScopeAI - AI-Powered Pain Point Discovery System

An intelligent conversational AI system that helps businesses identify and analyze their pain points using the Jobs-to-be-Done (JTBD) and 5 Whys frameworks.

## 🚀 Features

- **Structured Discovery Process**: Guided conversation using proven methodologies
- **Real-time Data Capture**: Actions update UI as conversation progresses
- **Automated Analysis**: 5 Whys root cause analysis for each pain point
- **Cloud Integration**: Saves reports to n8n workflow system
- **Self-Validating**: Integrates with auditor workflow for quality assurance

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **AI Integration**: CopilotKit (Cloud)
- **Backend**: n8n workflows
- **Storage**: Google Drive via n8n
- **Deployment**: Vercel/Netlify ready

## 📋 Prerequisites

- Node.js 18+ and npm
- CopilotKit Cloud account
- OpenAI API key
- Access to n8n webhook endpoints

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/Insta-Bids-System/scopeai-copilotkit.git
cd scopeai-copilotkit
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local file
OPENAI_API_KEY=your-openai-api-key-here
```

4. Configure CopilotKit Cloud:
- Go to https://cloud.copilotkit.ai
- Add your OpenAI API key in settings
- Verify your public API key matches: `ck_pub_64075c460b15d61634dcfa491b116a20`

## 🚀 Running the Application

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

## 📖 Usage

1. Open http://localhost:3000
2. The CopilotKit sidebar will open automatically
3. Follow the AI's prompts:
   - Introduce yourself (role and industry)
   - Describe your business goals
   - Discuss pain points
   - Complete 5 Whys analysis
   - Save the final report

## 🏗️ Architecture

### Frontend Components
- `components/App.tsx` - Main application with CopilotKit integration
- Custom actions for structured data collection
- Real-time UI updates based on conversation state

### CopilotKit Actions
1. `updateUserPersona` - Captures user role and industry
2. `updateJobToBeDone` - Records JTBD framework data
3. `addPainPointAnalysis` - Stores 5 Whys analysis
4. `saveFinalReport` - Sends data to n8n webhook

### Backend Integration
- Webhook endpoint: `https://instabidssystem.app.n8n.cloud/webhook/save-pain-point-report`
- Saves structured data to Google Drive
- Triggers validation workflow

## 🚨 Troubleshooting

### CopilotKit not responding?
1. Check browser console for errors
2. Verify OpenAI API key in CopilotKit Cloud dashboard
3. Clear browser cache and restart

### Build errors?
```bash
npm run clean  # Clears node_modules and reinstalls
```

### Network errors?
- Ensure you're using CopilotKit Cloud (not local runtime)
- Check firewall/proxy settings

## 📝 Environment Variables

For production deployment:
```env
NEXT_PUBLIC_COPILOT_CLOUD_API_KEY=ck_pub_64075c460b15d61634dcfa491b116a20
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary to Insta-Bids-System.

## 🙏 Acknowledgments

- CopilotKit for the AI integration framework
- n8n for workflow automation
- OpenAI for GPT models

## 📧 Contact

Project Link: https://github.com/Insta-Bids-System/scopeai-copilotkit
