# 🤖 AI Resume Analyzer

An AI-powered resume analyzer built with React and the Claude API (Anthropic). Get instant ATS scores, skill gap analysis, and tailored improvement suggestions for any job description.

🔗 **Live Demo:** [ai-resume-analyzer-rho-seven.vercel.app](https://ai-resume-analyzer-rho-seven.vercel.app/)

[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Claude API](https://img.shields.io/badge/Claude-Sonnet-7c3aed?style=flat-square)](https://www.anthropic.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)

---

## ✨ Features

- **Real AI Analysis** — Powered by Claude (Anthropic), not keyword matching
- **Match Score (0–100%)** — Animated score meter with detailed explanation
- **Skills Breakdown** — Matched vs. missing skills against the job description
- **ATS Compatibility Check** — Know if your resume passes automated screening
- **Improvement Suggestions** — Specific, job-tailored recommendations
- **Tone & Impact Analysis** — Identifies weak vs. strong bullet points
- **Dark Theme UI** — Clean, premium design with animated score meters
- **Mobile Responsive** — Works on all screen sizes
- **Load Sample** — Demo mode with pre-filled resume + JD

---

## 🏗️ Architecture

```
React Frontend → /api/analyze (Vercel Serverless Function) → Claude API
```

The API key is securely handled server-side via a Vercel serverless function — never exposed to the client.

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18 + Vite 5 |
| AI Model | Anthropic Claude (claude-sonnet-4-20250514) |
| Backend | Vercel Serverless Functions |
| Styling | Pure CSS (no UI library) |
| Deployment | Vercel |

---

## 📁 Project Structure

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

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/PrateekKacham/ai-resume-analyzer.git
cd ai-resume-analyzer

# 2. Install dependencies
npm install

# 3. Add your API key
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" > .env.local

# 4. Run with Vercel CLI (required for serverless function)
npm install -g vercel
vercel dev
```

> ⚠️ Use `vercel dev` instead of `npm run dev` to run the serverless function locally.

---

## ☁️ Deployment

This project is deployed on **Vercel** with a single command:

```bash
vercel --prod
```

Add `ANTHROPIC_API_KEY` in your Vercel project → **Settings → Environment Variables**.

---

## 💡 How It Works

1. User pastes their resume + a target job description
2. Frontend sends a POST request to `/api/analyze`
3. The serverless function securely calls the Claude API
4. Claude returns a structured JSON analysis
5. The app renders results across 5 tabs: Score, Skills, ATS, Suggestions, Tone

---

## 👤 Author

**Sai Vinayaka Venkata Prateek Kacham**  
MS Information Systems, Northeastern University  
[LinkedIn](https://linkedin.com/in/prateek-kacham-32ba5a338) · [GitHub](https://github.com/PrateekKacham) · kacham.sai@northeastern.edu