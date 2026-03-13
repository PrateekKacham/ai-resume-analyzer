import { useState, useEffect, useRef } from "react";

const SAMPLE_RESUME = `John Smith
john.smith@email.com | linkedin.com/in/johnsmith | github.com/johnsmith | Boston, MA

SUMMARY
Software engineer with 3 years of experience building web applications. Familiar with React and Node.js. Worked on various projects involving databases and APIs.

EXPERIENCE
Software Developer — TechCorp Inc. | Jan 2022 – Present
- Worked on the frontend team
- Fixed bugs and added new features
- Participated in code reviews
- Helped with deployment sometimes

Junior Developer — StartupXYZ | Jun 2020 – Dec 2021
- Built some React components
- Wrote backend code in Node.js
- Worked with the team on various tasks

EDUCATION
B.S. Computer Science — State University | 2020

SKILLS
JavaScript, React, Node.js, HTML, CSS, Git, MongoDB, SQL`;

const SAMPLE_JD = `Senior Software Engineer — FinTech Startup

We are looking for a Senior Software Engineer to join our growing team. You will be responsible for building and scaling our core payment infrastructure serving 2M+ users.

Requirements:
- 4+ years of experience in software engineering
- Strong proficiency in React, TypeScript, and Node.js
- Experience with AWS (Lambda, EC2, S3, RDS)
- Proficiency with PostgreSQL and Redis
- Experience with microservices architecture and Docker/Kubernetes
- Strong understanding of RESTful APIs and GraphQL
- Experience with CI/CD pipelines (GitHub Actions, Jenkins)
- Excellent problem-solving skills and ability to mentor junior engineers

Nice to have:
- Experience in fintech or payments domain
- Knowledge of system design and distributed systems
- Contributions to open-source projects`;

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) and technical resume analyst. Analyze the provided resume against the job description with precision and depth.

Return ONLY a valid JSON object with this exact structure (no markdown, no preamble):
{
  "matchScore": <number 0-100>,
  "scoreExplanation": "<2-3 sentence explanation of the score>",
  "matchedSkills": ["skill1", "skill2", ...],
  "missingSkills": ["skill1", "skill2", ...],
  "atsCompatibility": {
    "score": <number 0-100>,
    "issues": ["issue1", "issue2", ...],
    "passing": ["passing1", "passing2", ...]
  },
  "improvements": [
    {"title": "<short title>", "detail": "<specific actionable suggestion>"},
    ...
  ],
  "toneAnalysis": {
    "score": <number 0-100>,
    "feedback": "<overall tone and impact feedback in 2-3 sentences>",
    "weakBullets": ["<exact weak bullet>", ...],
    "strongBullets": ["<exact strong bullet>", ...]
  },
  "summary": "<1 sentence overall assessment>"
}`;

function ScoreMeter({ score, size = "large" }) {
  const [animated, setAnimated] = useState(0);
  const r = size === "large" ? 80 : 50;
  const strokeWidth = size === "large" ? 10 : 7;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (animated / 100) * circumference;
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  const fontSize = size === "large" ? 28 : 18;
  const svgSize = (r + strokeWidth) * 2 + 4;

  useEffect(() => {
    let start = 0;
    const step = score / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= score) { setAnimated(score); clearInterval(timer); }
      else setAnimated(Math.round(start));
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <svg width={svgSize} height={svgSize} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={svgSize / 2} cy={svgSize / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} />
      <circle cx={svgSize / 2} cy={svgSize / 2} r={r} fill="none" stroke={color}
        strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.05s linear" }} />
      <text x={svgSize / 2} y={svgSize / 2} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize={fontSize} fontWeight="700"
        style={{ transform: `rotate(90deg) translate(0px, -${svgSize}px)`, transformOrigin: "50% 50%" }}>
        {animated}%
      </text>
    </svg>
  );
}

function Badge({ children, type }) {
  const colors = {
    green: { bg: "#052e16", text: "#86efac", border: "#166534" },
    red:   { bg: "#450a0a", text: "#fca5a5", border: "#991b1b" },
    yellow:{ bg: "#422006", text: "#fcd34d", border: "#92400e" },
    blue:  { bg: "#0c1a4a", text: "#93c5fd", border: "#1e40af" },
  };
  const c = colors[type] || colors.blue;
  return (
    <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 500 }}>
      {children}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: "#0f172a", borderRadius: 12, border: "1px solid #1e293b", padding: "1.5rem", marginBottom: "1rem" }}>
      <h3 style={{ margin: "0 0 1rem", fontSize: 15, fontWeight: 600, color: "#e2e8f0", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function App() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const resultsRef = useRef(null);

  async function analyze() {
    if (!resume.trim() || !jd.trim()) {
      setError("Please provide both resume and job description.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `RESUME:\n${resume}\n\nJOB DESCRIPTION:\n${jd}` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) {
      setError("Analysis failed. Check your API key or try again.");
    } finally {
      setLoading(false);
    }
  }

  const tabs = ["overview", "skills", "ats", "suggestions", "tone"];

  return (
    <div className="app-wrapper">
      <div className="container">

        {/* Header */}
        <div className="header">
          <div className="powered-badge">
            <span className="dot"></span>
            <span>Powered by Claude AI</span>
          </div>
          <h1 className="title">AI Resume Analyzer</h1>
          <p className="subtitle">Real AI analysis. ATS scoring. Actionable feedback.</p>
        </div>

        {/* Inputs */}
        <div className="input-grid">
          {[
            { label: "Resume", value: resume, set: setResume, placeholder: "Paste your resume here...", sample: SAMPLE_RESUME },
            { label: "Job Description", value: jd, set: setJd, placeholder: "Paste the job description here...", sample: SAMPLE_JD },
          ].map(({ label, value, set, placeholder, sample }) => (
            <div key={label}>
              <div className="input-header">
                <label className="input-label">{label}</label>
                <button className="sample-btn" onClick={() => set(sample)}>Load Sample</button>
              </div>
              <textarea
                value={value}
                onChange={e => set(e.target.value)}
                placeholder={placeholder}
                className="textarea"
              />
            </div>
          ))}
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button className="analyze-btn" onClick={analyze} disabled={loading}>
          {loading ? (
            <span className="loading-inner">
              <svg className="spinner" width="16" height="16" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
              </svg>
              Analyzing with Claude AI...
            </span>
          ) : "Analyze Resume →"}
        </button>

        {/* Results */}
        {result && (
          <div ref={resultsRef} className="results">

            {/* Score Header */}
            <div className="score-header">
              <p className="score-label">Overall Match Score</p>
              <div className="score-meters">
                <ScoreMeter score={result.matchScore} size="large" />
                <div className="mini-meters">
                  <div className="mini-meter-item">
                    <ScoreMeter score={result.atsCompatibility?.score || 0} size="small" />
                    <p className="mini-label">ATS Score</p>
                  </div>
                  <div className="mini-meter-item">
                    <ScoreMeter score={result.toneAnalysis?.score || 0} size="small" />
                    <p className="mini-label">Tone Score</p>
                  </div>
                </div>
              </div>
              <p className="score-explanation">{result.scoreExplanation}</p>
            </div>

            {/* Tabs */}
            <div className="tabs">
              {tabs.map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`tab-btn ${activeTab === t ? "tab-active" : ""}`}>
                  {t}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {activeTab === "overview" && (
              <Section title="Summary">
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{result.summary}</p>
                <div className="badge-row">
                  <Badge type={result.matchScore >= 70 ? "green" : result.matchScore >= 40 ? "yellow" : "red"}>Match: {result.matchScore}%</Badge>
                  <Badge type={result.atsCompatibility?.score >= 70 ? "green" : "yellow"}>ATS: {result.atsCompatibility?.score}%</Badge>
                  <Badge type={result.toneAnalysis?.score >= 70 ? "green" : "yellow"}>Tone: {result.toneAnalysis?.score}%</Badge>
                  <Badge type="blue">{result.matchedSkills?.length || 0} skills matched</Badge>
                  <Badge type="red">{result.missingSkills?.length || 0} skills missing</Badge>
                </div>
              </Section>
            )}

            {/* Tab: Skills */}
            {activeTab === "skills" && (
              <div className="two-col">
                <Section title={`✓ Matched Skills (${result.matchedSkills?.length || 0})`}>
                  <div className="badge-row">{result.matchedSkills?.map(s => <Badge key={s} type="green">{s}</Badge>)}</div>
                </Section>
                <Section title={`✗ Missing Skills (${result.missingSkills?.length || 0})`}>
                  <div className="badge-row">{result.missingSkills?.map(s => <Badge key={s} type="red">{s}</Badge>)}</div>
                </Section>
              </div>
            )}

            {/* Tab: ATS */}
            {activeTab === "ats" && (
              <Section title="ATS Compatibility Check">
                <div className="two-col">
                  <div>
                    <p className="col-label green-label">Passing</p>
                    {result.atsCompatibility?.passing?.map((p, i) => (
                      <div key={i} className="check-row">
                        <span className="check green-check">✓</span>
                        <p className="check-text">{p}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="col-label red-label">Issues</p>
                    {result.atsCompatibility?.issues?.map((p, i) => (
                      <div key={i} className="check-row">
                        <span className="check red-check">✗</span>
                        <p className="check-text">{p}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>
            )}

            {/* Tab: Suggestions */}
            {activeTab === "suggestions" && (
              <Section title="Tailored Improvement Suggestions">
                {result.improvements?.map((imp, i) => (
                  <div key={i} className="suggestion-item">
                    <p className="suggestion-title">{imp.title}</p>
                    <p className="suggestion-detail">{imp.detail}</p>
                  </div>
                ))}
              </Section>
            )}

            {/* Tab: Tone */}
            {activeTab === "tone" && (
              <Section title="Tone & Impact Analysis">
                <p className="tone-feedback">{result.toneAnalysis?.feedback}</p>
                {result.toneAnalysis?.weakBullets?.length > 0 && (
                  <div style={{ marginBottom: "1.5rem" }}>
                    <p className="col-label yellow-label">Weak Bullets — Needs Work</p>
                    {result.toneAnalysis.weakBullets.map((b, i) => (
                      <div key={i} className="bullet-card weak-bullet">{b}</div>
                    ))}
                  </div>
                )}
                {result.toneAnalysis?.strongBullets?.length > 0 && (
                  <div>
                    <p className="col-label green-label">Strong Bullets</p>
                    {result.toneAnalysis.strongBullets.map((b, i) => (
                      <div key={i} className="bullet-card strong-bullet">{b}</div>
                    ))}
                  </div>
                )}
              </Section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}