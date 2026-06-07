import { useState, useEffect } from "react";

const langColors = {
  JavaScript: { bg: "rgba(247,223,30,0.1)", border: "#f7df1e", text: "#f7df1e" },
  Python:     { bg: "rgba(55,118,171,0.15)", border: "#60a5fa", text: "#60a5fa" },
  Go:         { bg: "rgba(0,173,216,0.1)", border: "#4ade80", text: "#4ade80" },
  TypeScript: { bg: "rgba(49,120,198,0.1)", border: "#60a5fa", text: "#60a5fa" },
  Java:       { bg: "rgba(248,152,29,0.1)", border: "#fbbf24", text: "#fbbf24" },
  Rust:       { bg: "rgba(206,65,43,0.1)", border: "#fb923c", text: "#fb923c" },
};

const issueColors = {
  critical: "#f87171",
  security: "#fb923c",
  bug:      "#fbbf24",
  minor:    "#c084fc",
  smell:    "#64748b",
};

function ScoreRing({ score, size = 52 }) {
  const color = score >= 90 ? "#4ade80" : score >= 75 ? "#60a5fa" : "#fb923c";
  const r = size / 2 - 5;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e2535" strokeWidth="4"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)" }}/>
      <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize={size*0.2} fontWeight="700" fontFamily="monospace"
        style={{ transform:"rotate(90deg)", transformOrigin:`${size/2}px ${size/2}px` }}>
        {score}%
      </text>
    </svg>
  );
}

function IssueBadge({ type, count }) {
  if (!count) return null;
  const c = issueColors[type] || "#64748b";
  return (
    <span style={{
      display:"inline-flex", alignItems:"center",
      background: c+"22", border:`1px solid ${c}44`, color: c,
      borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600,
    }}>{count} {type}</span>
  );
}

function MetricBar({ label, value, color }) {
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontSize:11, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</span>
        <span style={{ fontSize:11, color:"#e2e8f0", fontFamily:"monospace", fontWeight:600 }}>{value}%</span>
      </div>
      <div style={{ height:4, background:"#1e2535", borderRadius:4 }}>
        <div style={{ height:"100%", borderRadius:4, background:color, width:`${value}%`, transition:"width 0.9s ease" }}/>
      </div>
    </div>
  );
}

function DetailPanel({ session, onClose, onSave }) {
  const lang = langColors[session.language] || { border:"#7c3aed", text:"#c4b5fd" };
  const scoreColor = session.healthScore >= 90 ? "#4ade80" : session.healthScore >= 75 ? "#60a5fa" : "#fb923c";
  const suggestions = session.details?.suggestions || [];
  const metrics = session.details?.metrics || {};
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(session);
    setSaving(false);
    setSaved(true);
  };

  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.7)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:1000, padding:20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background:"#111827", border:"1px solid #1e2535",
        borderRadius:16, width:"100%", maxWidth:760,
        maxHeight:"90vh", overflowY:"auto",
        boxShadow:"0 40px 120px rgba(0,0,0,0.8)",
      }}>
        {/* Header */}
        <div style={{ padding:"22px 26px 18px", borderBottom:"1px solid #1e2535", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:5 }}>
              <span style={{ fontFamily:"monospace", fontSize:17, fontWeight:700, color:"#e2e8f0" }}>{session.fileName}</span>
              <span style={{ fontSize:11, fontWeight:600, padding:"3px 9px", background:lang.border+"22", border:`1px solid ${lang.border}44`, color:lang.text, borderRadius:20 }}>
                {session.language}
              </span>
            </div>
            <div style={{ fontSize:12, color:"#475569" }}>{session.date} · {session.time}</div>
          </div>
          <button onClick={onClose} style={{ background:"#1e2535", border:"none", color:"#64748b", width:32, height:32, borderRadius:8, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>

        <div style={{ padding:"22px 26px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {/* Left */}
          <div>
            <div style={{ background:"#0d1117", border:"1px solid #1e2535", borderRadius:12, padding:18, marginBottom:14, display:"flex", gap:18, alignItems:"center" }}>
              <ScoreRing score={session.healthScore} size={72}/>
              <div>
                <div style={{ fontSize:11, color:"#475569", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.08em" }}>Health Score</div>
                <div style={{ fontSize:20, fontWeight:800, color:scoreColor }}>{session.grade}</div>
              </div>
            </div>

            {session.details?.summary && (
              <div style={{ background:"#0d1117", border:"1px solid #1e2535", borderRadius:12, padding:16, marginBottom:14 }}>
                <div style={{ fontSize:11, color:"#475569", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Summary</div>
                <p style={{ fontSize:13, color:"#94a3b8", lineHeight:1.7, margin:0 }}>{session.details.summary}</p>
              </div>
            )}

            {Object.keys(metrics).length > 0 && (
              <div style={{ background:"#0d1117", border:"1px solid #1e2535", borderRadius:12, padding:16 }}>
                <div style={{ fontSize:11, color:"#475569", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>Code Metrics</div>
                {metrics.maintainability != null && <MetricBar label="Maintainability" value={metrics.maintainability} color="#7c3aed"/>}
                {metrics.coverage != null && <MetricBar label="Test Coverage" value={metrics.coverage} color="#4ade80"/>}
                {metrics.complexity != null && <MetricBar label="Complexity Score" value={Math.max(0,100-metrics.complexity*2)} color="#fbbf24"/>}
              </div>
            )}
          </div>

          {/* Right */}
          <div style={{ background:"#0d1117", border:"1px solid #1e2535", borderRadius:12, padding:16 }}>
            <div style={{ fontSize:11, color:"#475569", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>
              Issues Found · {suggestions.length}
            </div>
            {suggestions.length === 0 ? (
              <div style={{ fontSize:13, color:"#334155", textAlign:"center", marginTop:32 }}>No issues found</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {suggestions.map((issue, i) => {
                  const c = issueColors[issue.type] || "#64748b";
                  return (
                    <div key={i} style={{ background:c+"11", border:`1px solid ${c}33`, borderLeft:`3px solid ${c}`, borderRadius:8, padding:"10px 12px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                        <span style={{ fontSize:10, fontWeight:700, color:c, textTransform:"uppercase", letterSpacing:"0.1em" }}>{issue.type}</span>
                        {issue.line && <span style={{ fontSize:10, color:"#475569", fontFamily:"monospace" }}>L{issue.line}</span>}
                      </div>
                      <div style={{ fontSize:12, color:"#94a3b8", lineHeight:1.5 }}>{issue.message}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding:"14px 26px", borderTop:"1px solid #1e2535", display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button style={{ background:"#1e2535", border:"1px solid #2a3548", color:"#94a3b8", padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:13 }}>
            ↺ Re-run
          </button>
          <button onClick={handleSave} disabled={saved||saving} style={{
            background: saved ? "rgba(124,58,237,0.15)" : "#1e2535",
            border: `1px solid ${saved ? "rgba(196,181,253,0.3)" : "#2a3548"}`,
            color: saved ? "#c4b5fd" : "#94a3b8",
            padding:"8px 16px", borderRadius:8, cursor: saved?"default":"pointer", fontSize:13, transition:"all 0.2s",
          }}>
            {saved ? "📌 Saved!" : saving ? "Saving..." : "📌 Save Session"}
          </button>
          <button style={{ background:"linear-gradient(135deg,#7c3aed,#4f46e5)", border:"none", color:"#fff", padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:700 }}>
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AnalysisHistory() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    // TODO: Backend ready ஆனா uncomment பண்ணு
    // fetch("/api/analysis-history")
    //   .then(res => { if (!res.ok) throw new Error("Failed to fetch"); return res.json(); })
    //   .then(data => { setSessions(data); setLoading(false); })
    //   .catch(err => { setError(err.message); setLoading(false); });
    setLoading(false);
    setSessions([]);
  }, []);

  const handleSave = async (session) => {
    // TODO: Backend ready ஆனா uncomment பண்ணு
    // await fetch("/api/saved-sessions", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({...session, savedAt: new Date().toLocaleDateString()}) });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div style={{ color:"#e2e8f0" }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color:"#475569", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:5 }}>History</div>
        <h2 style={{ margin:0, fontSize:22, fontWeight:900, color:"#f1f5f9" }}>📊 Analysis History</h2>
      </div>

      {loading && (
        <div style={{ textAlign:"center", padding:"60px 0", color:"#475569" }}>
          <div style={{ width:28, height:28, border:"3px solid #1e2535", borderTop:"3px solid #7c3aed", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 12px" }}/>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          Loading...
        </div>
      )}

      {error && (
        <div style={{ background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.3)", borderRadius:12, padding:"16px 20px", color:"#f87171", fontSize:13 }}>
          Failed to load: {error}
        </div>
      )}

      {!loading && !error && sessions.length === 0 && (
        <div style={{ background:"#0d1117", border:"1px dashed #1e2535", borderRadius:16, padding:"60px 32px", textAlign:"center", animation:"fadeIn 0.4s ease" }}>
          <div style={{ fontSize:40, marginBottom:14 }}>📂</div>
          <div style={{ fontSize:15, fontWeight:700, color:"#475569", marginBottom:6 }}>No analysis sessions yet</div>
          <div style={{ fontSize:13, color:"#334155" }}>Run a code review from the Dashboard to see history here</div>
        </div>
      )}

      {!loading && !error && sessions.length > 0 && (
        <>
          {/* Column headers */}
          <div style={{ display:"grid", gridTemplateColumns:"150px 1fr 110px 70px 1fr", gap:14, padding:"0 18px 10px", fontSize:10, color:"#334155", textTransform:"uppercase", letterSpacing:"0.12em" }}>
            <span>Date & Time</span><span>File</span><span>Language</span><span style={{textAlign:"center"}}>Score</span><span>Issues</span>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {sessions.map((session, i) => {
              const lang = langColors[session.language] || { bg:"rgba(124,58,237,0.1)", border:"#7c3aed", text:"#c4b5fd" };
              const scoreColor = session.healthScore >= 90 ? "#4ade80" : session.healthScore >= 75 ? "#60a5fa" : "#fb923c";
              const isHov = hovered === session.id;
              const issueList = Object.entries(session.issues||{}).filter(([,v])=>v>0);
              return (
                <div key={session.id}
                  onClick={() => setSelected(session)}
                  onMouseEnter={() => setHovered(session.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display:"grid", gridTemplateColumns:"150px 1fr 110px 70px 1fr",
                    gap:14, alignItems:"center",
                    background: isHov ? "rgba(124,58,237,0.08)" : "#0d1117",
                    border: `1px solid ${isHov ? "rgba(124,58,237,0.3)" : "#1e2535"}`,
                    borderRadius:12, padding:"14px 18px", cursor:"pointer",
                    transition:"all 0.18s ease",
                    animation:`fadeIn 0.4s ease ${i*0.05}s both`,
                  }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>{session.date}</div>
                    <div style={{ fontSize:11, color:"#334155", fontFamily:"monospace", marginTop:2 }}>{session.time}</div>
                  </div>
                  <div style={{ fontFamily:"monospace", fontSize:13, fontWeight:600, color: isHov ? "#f1f5f9" : "#94a3b8", transition:"color 0.18s" }}>{session.fileName}</div>
                  <div>
                    <span style={{ fontSize:11, fontWeight:600, padding:"3px 10px", background:lang.bg, border:`1px solid ${lang.border}44`, color:lang.text, borderRadius:20 }}>
                      {session.language}
                    </span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"center" }}>
                    <ScoreRing score={session.healthScore} size={48}/>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                    {issueList.map(([type,count]) => <IssueBadge key={type} type={type} count={count}/>)}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign:"center", marginTop:20, fontSize:11, color:"#1e2535" }}>Click any row to view full report</div>
        </>
      )}

      {/* Toast */}
      {saveToast && (
        <div style={{ position:"fixed", bottom:24, right:24, background:"rgba(124,58,237,0.15)", border:"1px solid rgba(196,181,253,0.3)", borderRadius:10, padding:"11px 18px", fontSize:13, color:"#c4b5fd", boxShadow:"0 8px 32px rgba(0,0,0,0.5)" }}>
          📌 Session saved successfully!
        </div>
      )}

      {selected && <DetailPanel session={selected} onClose={() => setSelected(null)} onSave={handleSave}/>}
    </div>
  );
}
export default CodeHealth ;


