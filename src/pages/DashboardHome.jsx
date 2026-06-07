import { useState, useRef } from "react";
import { s, ResultBox } from "./shared";

// ─── FEATURE REGISTRY ─────────────────────────────────────────────────────────
const FEATURES = [
  {
    id: "bug-detection",
    label: "Bug Detection",
    icon: "🐛",
    description: "Bugs, errors and logical issues",
    color: "#7C6FCD",
    prompt: "Analyse this code for bugs, errors, and logical issues. List each bug with its line number, severity (critical/warning/minor), and a short fix suggestion. Be concise.",
  },
  {
    id: "code-explanation",
    label: "Code Explanation",
    icon: "📄",
    description: "Plain-English explanation",
    color: "#7C6FCD",
    prompt: "Explain what this code does in plain English. Give a 2-sentence summary, then list the key functions/logic in bullet points. Be concise.",
  },
  {
    id: "semantic-search",
    label: "Semantic Search",
    icon: "🔍",
    description: "Patterns and structure map",
    color: "#7C6FCD",
    prompt: "Map the semantic structure of this code. List the main functions, classes, and patterns found. Keep it brief and structured.",
  },
  {
    id: "security-scanner",
    label: "Security Scanner",
    icon: "🔒",
    description: "Vulnerabilities and unsafe practices",
    color: "#4ECDC4",
    prompt: "Scan this code for security vulnerabilities and unsafe practices. List each issue with severity and a one-line fix. Be direct and concise.",
  },
  {
    id: "vulnerability",
    label: "Vulnerability Analysis",
    icon: "⚠️",
    description: "CVEs and exploitable weaknesses",
    color: "#4ECDC4",
    prompt: "Perform a deep vulnerability analysis on this code. Identify CVEs, injection risks, and exploitable weaknesses. List each with a severity rating.",
  },
  {
    id: "code-health",
    label: "Code Health",
    icon: "📊",
    description: "Maintainability and quality score",
    color: "#4ade80",
    prompt: "Give a code health report. Score maintainability, readability, and test coverage out of 100. List the top 3 quality issues. Format: Score: X/100, then bullet points.",
  },
  {
    id: "ai-chat",
    label: "AI Chat Assistant",
    icon: "💬",
    description: "Ask anything about your code",
    color: "#7c3aed",
    isChat: true,
  },
];

// ─── CLAUDE API CALL ──────────────────────────────────────────────────────────
async function callClaude(prompt, code) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      system: "You are a senior code reviewer. Be concise, structured, and direct. Never include preambles.",
      messages: [{ role: "user", content: `${prompt}\n\n\`\`\`\n${code}\n\`\`\`` }],
    }),
  });
  const data = await res.json();
  return data.content?.map((b) => b.text || "").join("\n") || "No response.";
}

// ─── STATUS PILL ──────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const map = {
    idle:    { label: "Ready",      bg: "#1e2535",                 color: "#475569" },
    loading: { label: "Analysing…", bg: "rgba(124,58,237,0.15)",  color: "#a78bfa" },
    done:    { label: "Done ✓",     bg: "rgba(74,222,128,0.12)",  color: "#4ade80" },
    error:   { label: "Error",      bg: "rgba(248,113,113,0.12)", color: "#f87171" },
  };
  const st = map[status] || map.idle;
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
      background: st.bg, color: st.color, letterSpacing: "0.06em", textTransform: "uppercase",
    }}>
      {st.label}
    </span>
  );
}

// ─── SHIMMER LOADING LINES ────────────────────────────────────────────────────
function LoadingLines() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {[80, 60, 72].map((w, i) => (
        <div key={i} style={{
          height: 9, borderRadius: 4,
          background: "linear-gradient(90deg,#1e2535,#2a3548,#1e2535)",
          backgroundSize: "200% 100%",
          animation: `shimmer 1.4s ease ${i * 0.15}s infinite`,
          width: `${w}%`,
        }} />
      ))}
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

// ─── RESULT CARD ──────────────────────────────────────────────────────────────
function ResultCard({ feature, result, status, onNavigate }) {
  const isDone    = status === "done";
  const isLoading = status === "loading";
  const isError   = status === "error";

  return (
    <div
      onClick={() => isDone && onNavigate(feature.id)}
      style={{
        background: "#0d1117",
        border: `1px solid ${isDone ? feature.color + "44" : "#1e2535"}`,
        borderRadius: 14, padding: "18px 20px",
        display: "flex", flexDirection: "column", gap: 12,
        cursor: isDone ? "pointer" : "default",
        transition: "border-color 0.2s, transform 0.15s",
        position: "relative", overflow: "hidden",
      }}
      onMouseEnter={e => { if (isDone) e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {isDone && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg,${feature.color}00,${feature.color},${feature.color}00)`,
        }} />
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{feature.icon}</span>
          <span style={{ fontWeight: 800, fontSize: 14, color: feature.color }}>{feature.label}</span>
        </div>
        <StatusPill status={status} />
      </div>
      <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>{feature.description}</p>
      {isLoading && <LoadingLines />}
      {isError && <p style={{ fontSize: 12, color: "#f87171", margin: 0 }}>⚠️ Analysis failed. Please try again.</p>}
      {isDone && result && (
        <div style={{
          background: "#070b12", border: "1px solid #1e2535",
          borderRadius: 8, padding: "10px 12px",
          maxHeight: 110, overflowY: "auto",
          fontSize: 12, color: "#94a3b8", lineHeight: 1.7,
          whiteSpace: "pre-wrap", wordBreak: "break-word",
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {result.slice(0, 400)}{result.length > 400 ? "…" : ""}
        </div>
      )}
      {isDone && (
        <span style={{ fontSize: 11, color: feature.color, fontWeight: 700 }}>
          View full analysis →
        </span>
      )}
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ done, total }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 4, background: "#1e2535", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 4,
          background: "linear-gradient(90deg,#7c3aed,#4ECDC4)",
          width: `${pct}%`, transition: "width 0.4s ease",
        }} />
      </div>
      <span style={{ fontSize: 11, color: "#475569", fontFamily: "monospace", minWidth: 36 }}>
        {done}/{total}
      </span>
    </div>
  );
}

// ─── CODE INPUT CARD ──────────────────────────────────────────────────────────
function CodeInputCard({ code, setCode, fileName, setFileName }) {
  const fileRef = useRef(null);
  const [dragOver,     setDragOver]     = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadError,  setUploadError]  = useState("");

  const ALLOWED = [".js",".jsx",".ts",".tsx",".py",".java",".c",".cpp",".cs",".go",".rb",".php",".swift",".kt",".rs",".html",".css",".json",".xml",".sh",".txt",".md"];

  const readFile = (file) => {
    setUploadError("");
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!ALLOWED.includes(ext)) { setUploadError(`❌ Unsupported file type "${ext}".`); return; }
    if (file.size > 500000)     { setUploadError("❌ File too large. Max 500KB."); return; }
    const r = new FileReader();
    r.onload = (e) => { setCode(e.target.result); setUploadedFile(file.name); setFileName(file.name); };
    r.readAsText(file);
  };

  const handleDrop  = (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) readFile(f); };
  const handleClear = () => { setCode(""); setUploadedFile(null); setUploadError(""); setFileName(""); };

  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <h2 style={s.cardTitle}>Paste your code 😇</h2>
        <p style={s.cardSubtitle}>Enter your source code below or upload a file for AI-powered analysis</p>
      </div>

      <input ref={fileRef} type="file" accept={ALLOWED.join(",")}
        onChange={e => { const f = e.target.files[0]; if (f) readFile(f); e.target.value = ""; }}
        style={{ display: "none" }} />

      <div style={{ ...s.dropZone, ...(dragOver ? s.dropZoneActive : {}) }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}>

        {dragOver ? (
          <div style={s.dropOverlay}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <p style={{ color: "#c4b5fd", fontWeight: "700", fontSize: "15px", marginTop: "10px" }}>Drop your file here</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* macOS-style toolbar */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderBottom: "1px solid #1e2535", background: "#070b12" }}>
              {["#f87171","#fbbf24","#4ade80"].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
              ))}
              <span style={{ fontSize: 12, color: "#334155", fontFamily: "monospace", marginLeft: 4 }}>
                {fileName || "untitled"}
              </span>
              {code && <span style={{ marginLeft: "auto", fontSize: 11, color: "#334155", fontFamily: "monospace" }}>{code.split("\n").length} lines</span>}
            </div>

            <textarea
              style={s.textarea}
              placeholder={"// Paste your code here…\nfunction hello() {\n  console.log('Hello, World!');\n}"}
              value={code}
              onChange={e => { setCode(e.target.value); setUploadedFile(null); }}
              spellCheck={false}
            />
            <div style={s.uploadStrip}>
              <div style={s.uploadStripLeft}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {uploadedFile
                  ? <span style={{ color: "#4ECDC4", fontWeight: "600", fontSize: "11px", display: "flex", alignItems: "center", gap: "5px" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4ECDC4" strokeWidth="2.5"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                      {uploadedFile}
                      <button onClick={handleClear} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 0, fontSize: "12px" }}>✕</button>
                    </span>
                  : <span style={{ color: "#4b5563", fontSize: "11px" }}>Supports: JS, TS, PY, JAVA, C, C++, GO, PHP, HTML, CSS and more</span>
                }
              </div>
              <button style={s.uploadBtnInner} onClick={() => fileRef.current.click()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload File
              </button>
            </div>
            {uploadError && <div style={{ ...s.uploadError, margin: "0 12px 10px" }}>{uploadError}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DASHBOARD HOME ───────────────────────────────────────────────────────────
export function DashboardHome({ code, setCode, onNavigate }) {
  const [results,  setResults]  = useState({});
  const [statuses, setStatuses] = useState({});
  const [running,  setRunning]  = useState(false);
  const [fileName, setFileName] = useState("");

  const runnableFeatures = FEATURES.filter(f => !f.isChat);
  const doneCount  = runnableFeatures.filter(f => statuses[f.id] === "done").length;
  const hasCode    = !!(code && code.trim().length > 0);
  const hasResults = doneCount > 0;

  const runAll = async () => {
    if (!hasCode || running) return;
    setRunning(true);
    const loadingState = {};
    runnableFeatures.forEach(f => { loadingState[f.id] = "loading"; });
    setStatuses(loadingState);
    setResults({});

    await Promise.all(
      runnableFeatures.map(async (feature) => {
        try {
          const result = await callClaude(feature.prompt, code);
          setResults(prev => ({ ...prev, [feature.id]: result }));
          setStatuses(prev => ({ ...prev, [feature.id]: "done" }));
        } catch {
          setStatuses(prev => ({ ...prev, [feature.id]: "error" }));
        }
      })
    );
    setRunning(false);
  };

  return (
    <div style={{ color: "#e2e8f0", fontFamily: "'Syne', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: "#475569", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 5 }}>Dashboard</div>
        <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 900, color: "#f1f5f9" }}>Automated Code Review</h1>
        <p style={{ margin: 0, fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
          Paste or upload code, then hit <strong style={{ color: "#c4b5fd" }}>Run All</strong> to analyse with all tools at once.
          Click any result card to open the full detailed page.
        </p>
      </div>

      {/* Code input */}
      <CodeInputCard code={code} setCode={setCode} fileName={fileName} setFileName={setFileName} />

      {/* Run All + progress */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "20px 0 32px" }}>
        <button
          onClick={runAll}
          disabled={!hasCode || running}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "13px 32px", border: "none", borderRadius: 50,
            fontSize: 14, fontWeight: 800, fontFamily: "'Syne',sans-serif",
            color: "#fff", cursor: !hasCode || running ? "not-allowed" : "pointer",
            opacity: !hasCode || running ? 0.6 : 1,
            background: running ? "linear-gradient(135deg,#5b21b6,#3730a3)" : "linear-gradient(135deg,#7c3aed,#4f46e5)",
            boxShadow: !hasCode || running ? "none" : "0 8px 24px rgba(124,58,237,0.45)",
            transition: "all 0.2s",
          }}>
          {running ? (
            <>
              <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
              Analysing all…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Run All ({runnableFeatures.length} tools)
            </>
          )}
        </button>

        {(running || hasResults) && (
          <div style={{ flex: 1 }}>
            <ProgressBar done={doneCount} total={runnableFeatures.length} />
          </div>
        )}
        {hasResults && !running && (
          <span style={{ fontSize: 12, color: "#4ade80", fontWeight: 700, whiteSpace: "nowrap" }}>✓ All done</span>
        )}
      </div>

      {/* Feature result grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {FEATURES.map((feature, i) => {
          if (feature.isChat) {
            return (
              <div
                key={feature.id}
                onClick={() => onNavigate(feature.id)}
                style={{
                  background: "#0d1117", border: "1px solid #1e2535",
                  borderRadius: 14, padding: "18px 20px",
                  display: "flex", flexDirection: "column", gap: 12,
                  cursor: "pointer", transition: "border-color 0.2s, transform 0.15s",
                  animation: `fadeUp 0.4s ease ${i * 0.06}s both`,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = feature.color + "55"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2535"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{feature.icon}</span>
                  <span style={{ fontWeight: 800, fontSize: 14, color: feature.color }}>{feature.label}</span>
                  <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: "#4ECDC4", background: "rgba(78,205,196,0.1)", padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.06em" }}>Live</span>
                </div>
                <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>{feature.description}</p>
                <span style={{ fontSize: 11, color: feature.color, fontWeight: 700 }}>Open chat →</span>
              </div>
            );
          }

          return (
            <div key={feature.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}>
              <ResultCard
                feature={feature}
                result={results[feature.id]}
                status={statuses[feature.id] || "idle"}
                onNavigate={onNavigate}
              />
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {!hasCode && (
        <div style={{ marginTop: 28, background: "#070b12", border: "1px dashed #1e2535", borderRadius: 14, padding: "40px 32px", textAlign: "center", animation: "fadeUp 0.5s ease" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>👆</div>
          <p style={{ fontSize: 14, color: "#334155", margin: 0, lineHeight: 1.7 }}>
            Paste your code or upload a file above,<br/>
            then click <strong style={{ color: "#c4b5fd" }}>Run All</strong> to see results from all 6 tools at once.
          </p>
        </div>
      )}
    </div>
  );
}

