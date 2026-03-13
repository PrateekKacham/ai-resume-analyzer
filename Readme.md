# AI Resume Analyzer 🤖

An AI-powered resume analyzer built with React and the Claude API (Anthropic). Get instant ATS scores, skill gap analysis, and tailored improvement suggestions for any job description.

![Dark Theme UI](https://img.shields.io/badge/Theme-Dark-1e293b?style=flat-square)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)
![Claude API](https://img.shields.io/badge/Claude-Sonnet-7c3aed?style=flat-square)

## Features

- **Real AI Analysis** — Powered by Claude (Anthropic), not keyword matching
- **Match Score (0–100%)** — Animated score meter with detailed explanation
- **Skills Breakdown** — Matched vs. missing skills against the job description
- **ATS Compatibility Check** — Know if your resume passes automated screening
- **Improvement Suggestions** — Specific, job-tailored recommendations
- **Tone & Impact Analysis** — Identifies weak vs. strong bullet points
- **Dark Theme UI** — Clean, premium design with animated score meters
- **Mobile Responsive** — Works on all screen sizes
- **Load Sample** — Demo mode with pre-filled resume + JD

## Tech Stack

- React 18 + Vite 5
- Anthropic Claude API (`claude-sonnet-4-20250514`)
- Vercel Serverless Functions (for secure API key handling)
- Pure CSS (no UI library)

## Project Structure

```
ai-resume-analyzer/
├── api/
│   └── analyze.js        # Vercel serverless function (proxies Claude API)
├── src/
│   ├── App.jsx            # Main app + all components
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)
- A [Vercel account](https://vercel.com/) (for deployment)

### Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/ai-resume-analyzer.git
cd ai-resume-analyzer

# 2. Install dependencies
npm install

# 3. Create a local environment file
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" > .env.local

# 4. Run the dev server
npm run dev
```

> ⚠️ The `/api/analyze.js` serverless function won't run with plain `vite dev`.  
> For local testing with the real API, use the Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

This spins up both the Vite frontend and the serverless function locally on `http://localhost:3000`.

## Vercel Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-resume-analyzer.git
git push -u origin main
```

### 2. Deploy to Vercel

```bash
vercel
```

Or connect your GitHub repo directly in the [Vercel dashboard](https://vercel.com/new).

### 3. Add Environment Variable

In your Vercel project → **Settings** → **Environment Variables**:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` |

Click **Save**, then **Redeploy**.

## How It Works

1. User pastes resume + job description
2. Frontend sends a POST to `/api/analyze` (the Vercel serverless function)
3. The serverless function injects the API key and forwards the request to the Claude API
4. Claude returns a structured JSON analysis
5. The app parses and renders the results across 5 tabs

## License

MIT