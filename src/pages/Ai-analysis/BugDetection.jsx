// ─── BUG DETECTION ────────────────────────────────────────────────────────────
import { s, ResultBox } from "../shared";

const FEATURE = {
  id: "bug-detection",
  label: "Bug Detection",
  icon: "🐛",
  description: "Scans your code for bugs, errors, and logical issues.",
  color: "#7C6FCD",
};

export default function BugDetection({ code, isAnalyzing, analysisResult, analysisLabel, onReview, onSave }) {
  return (
    <div style={{ width: "100%", maxWidth: "800px", display: "flex", flexDirection: "column", gap: "20px" }}>

      <div style={s.featureBadge}>
        <span style={{ fontSize: "26px", flexShrink: 0 }}>{FEATURE.icon}</span>
        <span style={{ fontWeight: "800", fontSize: "20px", color: FEATURE.color, whiteSpace: "nowrap" }}>{FEATURE.label}</span>
        <span style={{ color: "#64748b", fontSize: "13px", borderLeft: "1px solid #1e2535", paddingLeft: "12px" }}>{FEATURE.description}</span>
      </div>

      {code && code.trim() ? (
        <div style={s.card}>
          <div style={s.cardHeader}>
            <h2 style={s.cardTitle}>{FEATURE.icon} Code Preview</h2>
            <p style={s.cardSubtitle}>Code loaded from Home · {code.split("\n").length} lines</p>
          </div>
          <div style={{ borderRadius: "10px", border: "1px solid #1e2535", background: "#0d0f1a", overflow: "hidden" }}>
            <pre style={{ margin: 0, padding: "16px", color: "#a5f3fc", fontSize: "13px", fontFamily: "'JetBrains Mono',monospace", lineHeight: "1.7", overflowX: "auto", maxHeight: "260px", overflowY: "auto" }}>{code}</pre>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderTop: "1px solid #1e2535", background: "#0a0c18" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ECDC4" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
              <span style={{ color: "#4ECDC4", fontSize: "11px", fontWeight: "600" }}>Loaded from Home</span>
              <span style={{ color: "#4b5563", fontSize: "11px" }}>— To change the code, go back to Home</span>
            </div>
          </div>
          <button
            style={{ display: "flex", alignItems: "center", gap: "10px", alignSelf: "flex-start", padding: "12px 28px", border: "none", borderRadius: "50px", color: "#fff", fontSize: "14px", fontWeight: "800", fontFamily: "'Syne',sans-serif", background: isAnalyzing ? "linear-gradient(135deg,#5b21b6,#3730a3)" : `linear-gradient(135deg,${FEATURE.color}dd,${FEATURE.color}99)`, cursor: isAnalyzing ? "not-allowed" : "pointer", opacity: isAnalyzing ? 0.75 : 1, boxShadow: `0 6px 20px ${FEATURE.color}44` }}
            onClick={() => onReview(code)} disabled={isAnalyzing}>
            {isAnalyzing && analysisLabel === FEATURE.label
              ? <><div style={s.spinner}/> Analysing...</>
              : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Run {FEATURE.label}</>
            }
          </button>
          {analysisResult && analysisLabel === FEATURE.label && (
            <ResultBox label={analysisLabel} result={analysisResult} onSave={onSave} />
          )}
        </div>
      ) : (
        <div style={{ ...s.card, alignItems: "center", justifyContent: "center", minHeight: "280px", gap: "14px" }}>
          <span style={{ fontSize: "52px" }}>🏠</span>
          <p style={{ color: "#f1f5f9", fontWeight: "700", fontSize: "17px" }}>No code loaded yet</p>
          <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center", maxWidth: "320px", lineHeight: "1.6" }}>
            Go to <strong style={{ color: "#c4b5fd" }}>Home</strong>, paste or upload your code, then come back here.
          </p>
        </div>
      )}
    </div>
  );
}
