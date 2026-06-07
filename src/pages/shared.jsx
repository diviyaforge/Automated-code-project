import React from "react";

// Common styles
export const s = {
  container: { padding: "20px", fontFamily: "sans-serif" },
  heading: { fontSize: "1.5rem", fontWeight: "bold", marginBottom: "12px" },
  textarea: { width: "100%", minHeight: "180px", padding: "12px", borderRadius: "8px", border: "1px solid #1e2535", background: "#0d1117", color: "#e2e8f0", fontSize: "14px", fontFamily: "monospace", resize: "vertical", outline: "none", boxSizing: "border-box" },
  button: { padding: "8px 16px", backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  resultBox: { marginTop: "16px", padding: "12px", backgroundColor: "#f3f4f6", borderRadius: "6px", whiteSpace: "pre-wrap" },
  card: { background: "#111827", border: "1px solid #1e2535", borderRadius: "16px", padding: "24px", marginBottom: "20px" },
  cardHeader: { marginBottom: "16px" },
  cardTitle: { fontSize: "18px", fontWeight: "800", color: "#f1f5f9", margin: "0 0 4px 0" },
  cardSubtitle: { fontSize: "13px", color: "#64748b", margin: 0 },
  dropZone: { border: "2px dashed #1e2535", borderRadius: "12px", overflow: "hidden", transition: "border-color .2s" },
  dropZoneActive: { borderColor: "#7c3aed", background: "rgba(124,58,237,.05)" },
  dropOverlay: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "180px" },
  uploadStrip: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderTop: "1px solid #1e2535", background: "#0d1117" },
  uploadStripLeft: { display: "flex", alignItems: "center", gap: "6px" },
  uploadBtnInner: { display: "flex", alignItems: "center", gap: "6px", background: "rgba(124,58,237,.15)", border: "1px solid rgba(124,58,237,.3)", color: "#c4b5fd", borderRadius: "8px", padding: "5px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer" },
  uploadError: { color: "#f87171", fontSize: "12px", marginTop: "6px" },
  loadBtn: { background: "rgba(255,255,255,.05)", border: "1px solid #1e2535", color: "#94a3b8", borderRadius: "8px", padding: "6px 14px", fontSize: "12px", fontWeight: "600", cursor: "pointer" },
  spinner: { width: "16px", height: "16px", border: "2px solid rgba(255,255,255,.2)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" },
}

// Result display component
export const ResultBox = ({ label, result, onSave }) => {
  if (!result) return null
  return (
    <div style={{ margin: "16px 0", padding: "16px", background: "#0d1117", border: "1px solid #1e2535", borderRadius: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <span style={{ fontSize: "13px", fontWeight: "700", color: "#7c3aed", textTransform: "uppercase" }}>{label}</span>
        {onSave && (
          <button onClick={onSave} style={{ ...s.loadBtn, color: "#4ECDC4", borderColor: "rgba(78,205,196,.3)", background: "rgba(78,205,196,.08)" }}>
            💾 Save
          </button>
        )}
      </div>
      <pre style={{ color: "#e2e8f0", fontSize: "13px", lineHeight: "1.7", whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>{result}</pre>
    </div>
  )
}

// Review button component
export const ReviewBtn = ({ isAnalyzing, onClick }) => (
  <button
    onClick={onClick}
    disabled={isAnalyzing}
    style={{
      width: "100%", padding: "14px", borderRadius: "12px", border: "none",
      background: isAnalyzing ? "#1e2535" : "linear-gradient(135deg,#7c3aed,#4f46e5)",
      color: isAnalyzing ? "#64748b" : "#fff", fontSize: "15px", fontWeight: "700",
      cursor: isAnalyzing ? "not-allowed" : "pointer", display: "flex",
      alignItems: "center", justifyContent: "center", gap: "10px",
      transition: "all .2s", boxShadow: isAnalyzing ? "none" : "0 4px 20px rgba(124,58,237,.4)"
    }}>
    {isAnalyzing
      ? <><div style={s.spinner} /> Analyzing...</>
      : <> Review Code</>}
  </button>
)