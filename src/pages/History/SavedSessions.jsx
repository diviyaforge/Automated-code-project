import { useState, useEffect } from "react";

const langColors = {
  JavaScript: { bg: "#f7df1e22", border: "#f7df1e", text: "#c9a800" },
  Python: { bg: "#3776ab22", border: "#3776ab", text: "#4a9ede" },
  Go: { bg: "#00add822", border: "#00add8", text: "#00add8" },
  TypeScript: { bg: "#3178c622", border: "#3178c6", text: "#3178c6" },
  Java: { bg: "#f8981d22", border: "#f8981d", text: "#f8981d" },
  Rust: { bg: "#ce412b22", border: "#ce412b", text: "#ce412b" },
};

const issueColors = {
  critical: "#ff4455",
  security: "#ff6b35",
  bug: "#ff9500",
  minor: "#8b5cf6",
  smell: "#6b7280",
};

function ScoreRing({ score, size = 52 }) {
  const color = score >= 90 ? "#22d3a0" : score >= 75 ? "#60a5fa" : "#ff6b35";
  const r = size / 2 - 5;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e2535" strokeWidth="4" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)" }}
      />
      <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize={size * 0.22} fontWeight="700"
        fontFamily="'JetBrains Mono', monospace"
        style={{ transform: "rotate(90deg)", transformOrigin: `${size/2}px ${size/2}px` }}
      >
        {score}%
      </text>
    </svg>
  );
}

function IssueBadge({ type, count }) {
  if (!count) return null;
  const c = issueColors[type] || "#6b7280";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      background: c + "18", border: `1px solid ${c}44`, color: c,
      borderRadius: 6, padding: "2px 8px",
      fontSize: 11, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace",
    }}>
      {count} {type}
    </span>
  );
}

function MetricBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: "#6b7a99", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
        <span style={{ fontSize: 11, color: "#c8d0e7", fontFamily: "'JetBrains Mono', monospace" }}>{value}%</span>
      </div>
      <div style={{ height: 4, background: "#1e2535", borderRadius: 4 }}>
        <div style={{ height: "100%", borderRadius: 4, background: color, width: `${value}%`, transition: "width 0.9s ease" }} />
      </div>
    </div>
  );
}

function DetailPanel({ session, onClose, onDelete }) {
  const lang = langColors[session.language] || { border: "#8b5cf6", text: "#8b5cf6" };
  const scoreColor = session.healthScore >= 90 ? "#22d3a0" : session.healthScore >= 75 ? "#60a5fa" : "#ff6b35";
  const suggestions = session.details?.suggestions || [];
  const metrics = session.details?.metrics || {};
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "#000000cc",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 100, padding: 20, animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#0d1117", border: "1px solid #1e2d45", borderRadius: 16,
          width: "100%", maxWidth: 760, maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 40px 120px #000a",
          animation: "slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "24px 28px 20px", borderBottom: "1px solid #1e2d45",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color: "#e8edf5" }}>
                {session.fileName}
              </span>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "3px 9px",
                background: lang.border + "20", border: `1px solid ${lang.border}55`,
                color: lang.text, borderRadius: 20,
              }}>
                {session.language}
              </span>
              <span style={{
                fontSize: 10, padding: "3px 9px",
                background: "#22d3a018", border: "1px solid #22d3a033",
                color: "#22d3a0", borderRadius: 20, letterSpacing: "0.05em",
              }}>
                📌 Saved
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#4a5568" }}>
              Saved on {session.savedAt} · Originally run {session.date}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "#1e2535", border: "none", color: "#6b7a99",
            width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        <div style={{ padding: "24px 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Left */}
          <div>
            <div style={{
              background: "#0a0e17", border: "1px solid #1e2d45", borderRadius: 12,
              padding: 20, marginBottom: 16, display: "flex", gap: 20, alignItems: "center",
            }}>
              <ScoreRing score={session.healthScore} size={72} />
              <div>
                <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>Health Score</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: scoreColor }}>{session.grade}</div>
              </div>
            </div>

            {session.details?.summary && (
              <div style={{ background: "#0a0e17", border: "1px solid #1e2d45", borderRadius: 12, padding: 18, marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Summary</div>
                <pre style={{ fontSize: 13, color: "#8892a4", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap", fontFamily: "sans-serif" }}>{session.details.summary}</pre>
              </div>
            )}

            {Object.keys(metrics).length > 0 && (
              <div style={{ background: "#0a0e17", border: "1px solid #1e2d45", borderRadius: 12, padding: 18 }}>
                <div style={{ fontSize: 11, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Code Metrics</div>
                {metrics.maintainability != null && <MetricBar label="Maintainability" value={metrics.maintainability} color="#22d3a0" />}
                {metrics.coverage != null && <MetricBar label="Test Coverage" value={metrics.coverage} color="#60a5fa" />}
                {metrics.complexity != null && <MetricBar label="Complexity Score" value={Math.max(0, 100 - metrics.complexity * 2)} color="#f59e0b" />}
              </div>
            )}
          </div>

          {/* Right */}
          <div>
            <div style={{ background: "#0a0e17", border: "1px solid #1e2d45", borderRadius: 12, padding: 18, height: "100%" }}>
              <div style={{ fontSize: 11, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                Issues Found · {suggestions.length}
              </div>
              {suggestions.length === 0 ? (
                <div style={{ fontSize: 13, color: "#3a4a66", textAlign: "center", marginTop: 32 }}>No issues found</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {suggestions.map((issue, i) => {
                    const c = issueColors[issue.type] || "#6b7280";
                    return (
                      <div key={i} style={{
                        background: c + "0d", border: `1px solid ${c}33`,
                        borderLeft: `3px solid ${c}`, borderRadius: 8, padding: "10px 14px",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: c, textTransform: "uppercase", letterSpacing: "0.1em" }}>{issue.type}</span>
                          {issue.line && <span style={{ fontSize: 10, color: "#4a5568", fontFamily: "'JetBrains Mono', monospace" }}>L{issue.line}</span>}
                        </div>
                        <div style={{ fontSize: 12, color: "#8892a4", lineHeight: 1.5 }}>{issue.message}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          padding: "16px 28px", borderTop: "1px solid #1e2d45",
          display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                style={{
                  background: "#ff445518", border: "1px solid #ff445533", color: "#ff4455",
                  padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13,
                }}
              >
                🗑 Remove from Saved
              </button>
            ) : (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#ff4455" }}>Confirm delete?</span>
                <button
                  onClick={() => onDelete(session.id)}
                  style={{
                    background: "#ff4455", border: "none", color: "#fff",
                    padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700,
                  }}
                >Yes</button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  style={{
                    background: "#1e2535", border: "1px solid #2a3548", color: "#8892a4",
                    padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12,
                  }}
                >Cancel</button>
              </div>
            )}
          </div>
          <button style={{
            background: scoreColor, border: "none", color: "#0d1117",
            padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700,
          }}>
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}

function mapSessionFromBackend(s) {
  // Try to parse health score from result text
  let score = 85;
  const scoreMatch = s.result ? s.result.match(/(?:score|health|rating)\s*:\s*(\d+)\s*\/\s*100/i) : null;
  const scorePercentMatch = s.result ? s.result.match(/(\d+)\s*%/ ) : null;
  if (scoreMatch && scoreMatch[1]) {
    score = parseInt(scoreMatch[1]);
  } else if (scorePercentMatch && scorePercentMatch[1]) {
    score = parseInt(scorePercentMatch[1]);
  }
  
  // Grade
  let grade = "B";
  if (score >= 90) grade = "A+";
  else if (score >= 80) grade = "A";
  else if (score >= 70) grade = "B";
  else if (score >= 60) grade = "C";
  else grade = "D";

  // Parse issues count
  const resultLower = s.result ? s.result.toLowerCase() : "";
  const criticalCount = (resultLower.match(/critical/g) || []).length;
  const bugCount = (resultLower.match(/bug|error|incorrect/g) || []).length;
  const securityCount = (resultLower.match(/security|vuln|unsafe|cve/g) || []).length;
  const minorCount = (resultLower.match(/minor|warning|suggest/g) || []).length;

  // Language detection
  let language = "JavaScript";
  const codeLower = s.code ? s.code.toLowerCase() : "";
  if (codeLower.includes("def ") || codeLower.includes("import pandas") || codeLower.includes("print(")) {
    language = "Python";
  } else if (codeLower.includes("package main") || codeLower.includes("func ")) {
    language = "Go";
  } else if (codeLower.includes("public class ") || codeLower.includes("system.out.print")) {
    language = "Java";
  } else if (codeLower.includes("fn main()") || codeLower.includes("let mut ")) {
    language = "Rust";
  } else if (codeLower.includes("interface ") || codeLower.includes("type ")) {
    language = "TypeScript";
  }

  // Parse date
  let dateStr = "";
  let timeStr = "";
  try {
    const d = new Date(s.date);
    dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    timeStr = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  } catch (err) {
    dateStr = s.date || "Unknown";
    timeStr = "";
  }

  return {
    id: s.id,
    fileName: s.label || "Code Review",
    language: language,
    healthScore: score,
    grade: grade,
    date: dateStr,
    time: timeStr,
    savedAt: dateStr,
    issues: {
      critical: criticalCount,
      bug: bugCount,
      security: securityCount,
      minor: minorCount,
      smell: 0
    },
    details: {
      summary: s.result || "No review output.",
      suggestions: [],
      metrics: {
        maintainability: score,
        coverage: 0,
        complexity: Math.max(0, 100 - score)
      }
    },
    rawCode: s.code || ""
  };
}

export default function SavedSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [deleteToast, setDeleteToast] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("acr_token");
    fetch("/api/saved-sessions", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => { if (!res.ok) throw new Error("Failed to fetch saved sessions"); return res.json(); })
      .then(data => { 
        setSessions(data.map(mapSessionFromBackend)); 
        setLoading(false); 
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("acr_token");
    try {
      const res = await fetch(`/api/saved-sessions/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setSessions(prev => prev.filter(s => s.id !== id));
        setSelected(null);
        setDeleteToast(true);
        setTimeout(() => setDeleteToast(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@400;600;700;800&display=swap');
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes rowIn { from { opacity: 0; transform: translateX(-12px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        ::-webkit-scrollbar { width: 6px }
        ::-webkit-scrollbar-track { background: #0d1117 }
        ::-webkit-scrollbar-thumb { background: #1e2d45; border-radius: 3px }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#080c12",
        fontFamily: "'Syne', sans-serif", padding: "32px 24px", color: "#c8d0e7",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: 11, color: "#3a4a66", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>
                Automated Code Review
              </div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#e8edf5", letterSpacing: "-0.03em" }}>
                Saved Sessions
              </h1>
            </div>
            {!loading && !error && (
              <div style={{
                background: "#0d1117", border: "1px solid #1e2d45",
                borderRadius: 10, padding: "8px 16px",
                fontSize: 12, color: "#4a5568", fontFamily: "'JetBrains Mono', monospace",
              }}>
                {sessions.length} saved
              </div>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{
                width: 32, height: 32, border: "3px solid #1e2d45",
                borderTop: "3px solid #60a5fa", borderRadius: "50%",
                animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
              }} />
              <div style={{ fontSize: 13, color: "#3a4a66" }}>Loading saved sessions...</div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: "#ff445518", border: "1px solid #ff445544",
              borderRadius: 12, padding: "20px 24px",
              color: "#ff4455", fontSize: 13, textAlign: "center",
            }}>
              Failed to load: {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && sessions.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📌</div>
              <div style={{ fontSize: 15, color: "#3a4a66" }}>No saved sessions yet</div>
              <div style={{ fontSize: 12, color: "#2a3548", marginTop: 6 }}>
                Click "Save" on any analysis result to pin it here
              </div>
            </div>
          )}

          {/* Sessions grid */}
          {!loading && !error && sessions.length > 0 && (
            <>
              {/* Column headers */}
              <div style={{
                display: "grid", gridTemplateColumns: "160px 1fr 110px 80px 1fr",
                gap: 16, padding: "0 20px 10px",
                fontSize: 10, color: "#3a4a66", textTransform: "uppercase", letterSpacing: "0.12em",
              }}>
                <span>Saved On</span>
                <span>File</span>
                <span>Language</span>
                <span style={{ textAlign: "center" }}>Score</span>
                <span>Issues</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sessions.map((session, i) => {
                  const lang = langColors[session.language] || { bg: "#8b5cf622", border: "#8b5cf6", text: "#8b5cf6" };
                  const scoreColor = session.healthScore >= 90 ? "#22d3a0" : session.healthScore >= 75 ? "#60a5fa" : "#ff6b35";
                  const isHovered = hovered === session.id;
                  const issueList = Object.entries(session.issues || {}).filter(([, v]) => v > 0);

                  return (
                    <div
                      key={session.id}
                      onClick={() => setSelected(session)}
                      onMouseEnter={() => setHovered(session.id)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        display: "grid", gridTemplateColumns: "160px 1fr 110px 80px 1fr",
                        gap: 16, alignItems: "center",
                        background: isHovered ? "#0f1620" : "#0a0e17",
                        border: `1px solid ${isHovered ? "#2a3d5a" : "#151e2e"}`,
                        borderRadius: 12, padding: "16px 20px", cursor: "pointer",
                        transition: "all 0.18s ease",
                        animation: `rowIn 0.4s ease ${i * 0.06}s both`,
                        boxShadow: isHovered ? `0 0 0 1px ${scoreColor}22, 0 8px 32px #00000066` : "none",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#c8d0e7" }}>{session.savedAt}</div>
                        <div style={{ fontSize: 11, color: "#3a4a66", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                          {session.date}
                        </div>
                      </div>

                      <div style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600,
                        color: isHovered ? "#e8edf5" : "#a0aec0", transition: "color 0.18s",
                      }}>
                        {session.fileName}
                      </div>

                      <div>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: "4px 10px",
                          background: lang.bg, border: `1px solid ${lang.border}44`,
                          color: lang.text, borderRadius: 20,
                        }}>
                          {session.language}
                        </span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <ScoreRing score={session.healthScore} size={52} />
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {issueList.map(([type, count]) => (
                          <IssueBadge key={type} type={type} count={count} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#2a3548", letterSpacing: "0.08em" }}>
                Click any row to view full report
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete toast */}
      {deleteToast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24,
          background: "#1e2535", border: "1px solid #2a3548",
          borderRadius: 10, padding: "12px 20px",
          fontSize: 13, color: "#c8d0e7",
          animation: "toastIn 0.3s ease",
          boxShadow: "0 8px 32px #000a",
        }}>
          ✅ Session removed from saved
        </div>
      )}

      {selected && (
        <DetailPanel
          session={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}

