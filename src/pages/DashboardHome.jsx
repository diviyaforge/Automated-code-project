import { useState, useRef } from "react";
import { s, ResultBox, ReviewBtn } from "./shared";

// ─── CODE INPUT CARD ─────────────────────────────────────────────────────────
// Used only on the Home page. Supports paste, drag-and-drop, and file upload.
function CodeInputCard({ code, setCode, title, subtitle, children }) {
  const fileRef = useRef(null);
  const [dragOver, setDragOver]     = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadError, setUploadError]   = useState("");

  const ALLOWED = [".js",".jsx",".ts",".tsx",".py",".java",".c",".cpp",".cs",".go",".rb",".php",".swift",".kt",".rs",".html",".css",".json",".xml",".sh",".txt",".md"];

  const readFile = (file) => {
    setUploadError("");
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!ALLOWED.includes(ext)) { setUploadError(`❌ Unsupported file type "${ext}".`); return; }
    if (file.size > 500000)     { setUploadError("❌ File too large. Max 500KB."); return; }
    const r = new FileReader();
    r.onload = (e) => { setCode(e.target.result); setUploadedFile(file.name); };
    r.readAsText(file);
  };

  const handleDrop  = (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) readFile(f); };
  const handleClear = () => { setCode(""); setUploadedFile(null); setUploadError(""); };

  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <h2 style={s.cardTitle}>{title}</h2>
        <p style={s.cardSubtitle}>{subtitle}</p>
      </div>

      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept={ALLOWED.join(",")}
        onChange={e => { const f = e.target.files[0]; if (f) readFile(f); e.target.value = ""; }}
        style={{ display: "none" }} />

      {/* Drop zone */}
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
            <textarea
              style={s.textarea}
              placeholder="Enter the code here..."
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

      {children}
    </div>
  );
}

// ─── DASHBOARD HOME ───────────────────────────────────────────────────────────
export function DashboardHome({ code, setCode, isAnalyzing, analysisResult, analysisLabel, onReview, onSave }) {
  return (
    <>
      <CodeInputCard code={code} setCode={setCode} title="Paste your code 😇" subtitle="Enter your source code below or upload a file for AI-powered analysis">
        {analysisResult && <ResultBox label={analysisLabel} result={analysisResult} onSave={onSave} />}
      </CodeInputCard>
      <ReviewBtn isAnalyzing={isAnalyzing} onClick={onReview} />
    </>
  );
}
