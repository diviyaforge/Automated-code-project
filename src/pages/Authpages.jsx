import { useState } from "react";

// ── Floating code snippets that drift across the background ──────────────────
const CODE_SNIPPETS = [
  "const ai = review(code)\n  .analyze()\n  .suggest();",
  "def analyze_security():\n  scan()\n  detect_issues()\n  improve_quality()",
  "function review(code){\n  return ai\n    .analyze(code)\n    .report();\n}",
  "if(memoryLeak){\n  fix();\n  optimize();\n}",
  "async function lint(src){\n  const issues = await\n    ai.scan(src);\n  return issues;\n}",
  "class CodeReview:\n  def run(self):\n    return llm\n      .audit(self.code)",
];

function FloatingCode() {
  return (
    <div className="floating-code-container" aria-hidden="true">
      {CODE_SNIPPETS.map((snippet, i) => (
        <pre
          key={i}
          className="floating-code"
          style={{
            "--delay": `${i * 3.2}s`,
            "--duration": `${22 + i * 4}s`,
            "--start-x": `${(i * 17 + 5) % 90}%`,
            "--start-y": `${(i * 13 + 10) % 80}%`,
            "--drift-x": `${(i % 2 === 0 ? 1 : -1) * (30 + i * 8)}px`,
            "--drift-y": `${(i % 3 === 0 ? 1 : -1) * (20 + i * 5)}px`,
            color: i % 2 === 0 ? "#39ff14" : "#a855f7",
            fontSize: "11px",
          }}
        >
          {snippet}
        </pre>
      ))}
    </div>
  );
}

function StarField() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 2,
  }));
  return (
    <div className="starfield" aria-hidden="true">
      {stars.map((s) => (
        <div key={s.id} className="star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, "--delay": `${s.delay}s`, "--duration": `${s.duration}s` }} />
      ))}
    </div>
  );
}

function CornerBracket({ pos }) {
  const styles = {
    "top-left": { top: 8, left: 8 },
    "top-right": { top: 8, right: 8, transform: "scaleX(-1)" },
    "bottom-left": { bottom: 8, left: 8, transform: "scaleY(-1)" },
    "bottom-right": { bottom: 8, right: 8, transform: "scale(-1,-1)" },
  };
  return (
    <svg className="corner-bracket" style={styles[pos]} width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M0 20 L0 0 L20 0" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const EyeIcon = ({ off }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    {off ? (<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>) : (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>)}
  </svg>
);
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 8 8l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const BoltIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const ArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

function RobotHead() {
  return (
    <div className="robot-head-wrap">
      <svg width="72" height="72" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
        <line x1="28" y1="8" x2="28" y2="2" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="28" cy="2" r="2.5" fill="#c084fc" />
        <line x1="44" y1="8" x2="44" y2="2" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="44" cy="2" r="2.5" fill="#c084fc" />
        <rect x="12" y="10" width="48" height="42" rx="12" fill="#1a1a2e" stroke="#7c3aed" strokeWidth="2" />
        <rect x="18" y="18" width="36" height="26" rx="8" fill="#0d0d1a" stroke="#4f46e5" strokeWidth="1.5" />
        <circle cx="27" cy="31" r="5" fill="#06b6d4" opacity="0.9" />
        <circle cx="45" cy="31" r="5" fill="#06b6d4" opacity="0.9" />
        <circle cx="27" cy="31" r="2.5" fill="#fff" />
        <circle cx="45" cy="31" r="2.5" fill="#fff" />
        <rect x="26" y="39" width="20" height="3" rx="1.5" fill="#4f46e5" opacity="0.8" />
        <rect x="7" y="22" width="5" height="10" rx="2.5" fill="#7c3aed" />
        <rect x="60" y="22" width="5" height="10" rx="2.5" fill="#7c3aed" />
      </svg>
    </div>
  );
}

function RobotFull() {
  return (
    <div className="robot-full-wrap">
      <div className="robot-glow-ring">
        <svg width="90" height="110" viewBox="0 0 90 110" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="2" width="40" height="32" rx="10" fill="#1e1e3f" stroke="#7c3aed" strokeWidth="2" />
          <circle cx="35" cy="18" r="5" fill="#06b6d4" />
          <circle cx="55" cy="18" r="5" fill="#06b6d4" />
          <circle cx="35" cy="18" r="2" fill="#fff" />
          <circle cx="55" cy="18" r="2" fill="#fff" />
          <rect x="33" y="27" width="24" height="3" rx="1.5" fill="#4f46e5" />
          <rect x="40" y="34" width="10" height="6" rx="2" fill="#7c3aed" />
          <rect x="18" y="40" width="54" height="40" rx="10" fill="#1a1a3e" stroke="#7c3aed" strokeWidth="2" />
          <circle cx="45" cy="60" r="10" fill="#0d0d2e" stroke="#a855f7" strokeWidth="1.5" />
          <circle cx="45" cy="60" r="5" fill="#7c3aed" opacity="0.8" />
          <rect x="3" y="42" width="15" height="30" rx="7" fill="#1e1e3f" stroke="#7c3aed" strokeWidth="1.5" />
          <rect x="72" y="42" width="15" height="30" rx="7" fill="#1e1e3f" stroke="#7c3aed" strokeWidth="1.5" />
          <rect x="25" y="80" width="14" height="26" rx="7" fill="#1e1e3f" stroke="#7c3aed" strokeWidth="1.5" />
          <rect x="51" y="80" width="14" height="26" rx="7" fill="#1e1e3f" stroke="#7c3aed" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}

function RadarRings() {
  return (
    <div className="radar-rings" aria-hidden="true">
      {[1, 2, 3, 4].map((i) => (<div key={i} className="radar-ring" style={{ "--i": i }} />))}
      <div className="radar-dot" />
    </div>
  );
}

function NetworkNodes() {
  return (
    <svg className="network-nodes" width="160" height="160" viewBox="0 0 160 160" aria-hidden="true">
      {[[30, 80], [70, 40], [110, 70], [90, 120], [50, 130], [140, 30]].map(([x, y], i, arr) => (
        <g key={i}>
          {arr.slice(i + 1).map(([x2, y2], j) =>
            Math.hypot(x2 - x, y2 - y) < 90 ? (<line key={j} x1={x} y1={y} x2={x2} y2={y2} stroke="#a855f7" strokeWidth="0.5" opacity="0.3" />) : null
          )}
          <circle cx={x} cy={y} r="3.5" fill="#a855f7" opacity="0.6" />
        </g>
      ))}
    </svg>
  );
}

function InputField({ icon, type = "text", placeholder, value, onChange, rightEl }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={`input-wrap ${focused ? "focused" : ""}`}>
      <span className="input-icon">{icon}</span>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} autoComplete="off" />
      {rightEl}
    </div>
  );
}

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div className={`toast toast-${type}`}>
      {type === "success" ? "✅" : "⚠️"} {msg}
    </div>
  );
}

// ── SIGN IN PAGE ─────────────────────────────────────────────────────────────
function SignInPage({ onGoSignUp, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [msg, setMsg] = useState(null);
  const [msgType, setMsgType] = useState("error");

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setMsg("Please fill in all fields.");
      setMsgType("error");
      setTimeout(() => setMsg(null), 3000);
      return;
    }
    const users = JSON.parse(localStorage.getItem("acr_users") || "[]");
    const found = users.find(
      (u) => (u.email === username || u.username === username) && u.password === password
    );
    if (found) {
      setMsg(`Welcome back, ${found.firstName}! 🎉 Redirecting...`);
      setMsgType("success");
      // ✅ THIS is the key fix — redirect to dashboard after 1.5s
      setTimeout(() => onLogin(), 1500);
    } else {
      setMsg("Invalid credentials. Please try again.");
      setMsgType("error");
      setTimeout(() => setMsg(null), 3500);
    }
  };

  return (
    <div className="page signin-page">
      <StarField />
      <FloatingCode />
      <RadarRings />
      <NetworkNodes />
      <div className="sparkle-br" aria-hidden="true">✦</div>
      <div className="card-wrapper">
        <div className="robot-above"><RobotHead /></div>
        <div className="card signin-card">
          <CornerBracket pos="top-left" />
          <CornerBracket pos="top-right" />
          <CornerBracket pos="bottom-left" />
          <CornerBracket pos="bottom-right" />
          <h1 className="card-title">
            Automated Code Review<br />
            <span>with <span className="llm-text">LLM</span></span>
          </h1>
          <p className="card-sub">AI-Powered Code Quality Analysis</p>
          <Toast msg={msg} type={msgType} />
          <div className="fields">
            <InputField icon={<UserIcon />} placeholder="Username or Mail ID" value={username} onChange={(e) => setUsername(e.target.value)} />
            <InputField icon={<LockIcon />} type={showPw ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              rightEl={<button className="eye-btn" onClick={() => setShowPw(!showPw)} tabIndex={-1}><EyeIcon off={showPw} /></button>}
            />
          </div>
          <div className="forgot-row">
            <button className="forgot-btn">Forgot password?</button>
          </div>
          <button className="primary-btn" onClick={handleLogin}>
            <BoltIcon /> Login
          </button>
          <div className="signup-prompt">
            <p>New to automated code review?</p>
            <button className="link-btn" onClick={onGoSignUp}>Create an account <ArrowRight /></button>
          </div>
          <p className="signin-welcome">Welcome 😎</p>
        </div>
      </div>
    </div>
  );
}

// ── SIGN UP PAGE ─────────────────────────────────────────────────────────────
function SignUpPage({ onGoSignIn }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", dob: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [msg, setMsg] = useState(null);
  const [msgType, setMsgType] = useState("success");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleCreate = () => {
    const { firstName, lastName, email, phone, dob, password } = form;
    if (!firstName || !lastName || !email || !phone || !dob || !password) {
      setMsg("Please fill in all fields.");
      setMsgType("error");
      setTimeout(() => setMsg(null), 3000);
      return;
    }
    const users = JSON.parse(localStorage.getItem("acr_users") || "[]");
    const exists = users.find((u) => u.email === email);
    if (exists) {
      setMsg("An account with this email already exists.");
      setMsgType("error");
      setTimeout(() => setMsg(null), 3500);
      return;
    }
    users.push({ ...form, username: email });
    localStorage.setItem("acr_users", JSON.stringify(users));
    setMsg("Account created! Please sign in. 🚀");
    setMsgType("success");
    setForm({ firstName: "", lastName: "", email: "", phone: "", dob: "", password: "" });
    setTimeout(() => { setMsg(null); onGoSignIn(); }, 2000);
  };

  return (
    <div className="page signup-page">
      <StarField />
      <FloatingCode />
      <RadarRings />
      <NetworkNodes />
      <div className="sparkle-br" aria-hidden="true">✦</div>
      <div className="card-wrapper">
        <div className="robot-above robot-above-full"><RobotFull /></div>
        <div className="card signup-card">
          <CornerBracket pos="top-left" />
          <CornerBracket pos="top-right" />
          <CornerBracket pos="bottom-left" />
          <CornerBracket pos="bottom-right" />
          <h1 className="card-title" style={{ marginTop: "0.5rem" }}>User Details</h1>
          <p className="card-sub">Provide your profile details</p>
          <Toast msg={msg} type={msgType} />
          <div className="fields">
            <div className="row-2">
              <InputField icon={<UserIcon />} placeholder="First Name" value={form.firstName} onChange={set("firstName")} />
              <InputField icon={<UserIcon />} placeholder="Last Name" value={form.lastName} onChange={set("lastName")} />
            </div>
            <InputField icon={<MailIcon />} type="email" placeholder="Email" value={form.email} onChange={set("email")} />
            <InputField icon={<PhoneIcon />} type="tel" placeholder="Phone Number" value={form.phone} onChange={set("phone")} />
            <div className="input-wrap dob-wrap">
              <span className="input-icon"><CalendarIcon /></span>
              <input type="date" value={form.dob} onChange={set("dob")} max={new Date().toISOString().split("T")[0]} />
            </div>
            <InputField icon={<LockIcon />} type={showPw ? "text" : "password"} placeholder="Password" value={form.password} onChange={set("password")}
              rightEl={<button className="eye-btn" onClick={() => setShowPw(!showPw)} tabIndex={-1}><EyeIcon off={showPw} /></button>}
            />
          </div>
          <button className="primary-btn" onClick={handleCreate}>Create account</button>
          <div className="back-row">
            <p className="welcome-txt">Welcome 😎</p>
            <button className="link-btn" onClick={onGoSignIn}><ArrowLeft /> Back to Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ROOT EXPORT ───────────────────────────────────────────────────────────────
export default function Authpages({ onLogin }) {
  const [page, setPage] = useState("signin");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Rajdhani', sans-serif; background: #020212; min-height: 100vh; overflow-x: hidden; }
        .page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; background: radial-gradient(ellipse 80% 60% at 50% 0%, #1a0a3e 0%, #020212 60%), radial-gradient(ellipse 40% 40% at 80% 80%, #0d0d3e 0%, transparent 70%); padding: 2rem 1rem; }
        .starfield { position: absolute; inset: 0; pointer-events: none; }
        .star { position: absolute; background: #fff; border-radius: 50%; animation: twinkle var(--duration, 3s) var(--delay, 0s) ease-in-out infinite alternate; }
        @keyframes twinkle { from { opacity: 0.15; transform: scale(1); } to { opacity: 0.9; transform: scale(1.4); } }
        .floating-code-container { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .floating-code { position: absolute; left: var(--start-x); top: var(--start-y); font-family: 'Courier New', monospace; opacity: 0.18; white-space: pre; animation: floatCode var(--duration, 20s) var(--delay, 0s) ease-in-out infinite alternate; border-left: 1.5px solid currentColor; padding-left: 6px; filter: blur(0.3px); }
        @keyframes floatCode { from { transform: translate(0, 0); opacity: 0.12; } to { transform: translate(var(--drift-x, 20px), var(--drift-y, 20px)); opacity: 0.22; } }
        .radar-rings { position: absolute; top: 10px; right: 10px; width: 120px; height: 120px; pointer-events: none; }
        .radar-ring { position: absolute; border: 1px solid #06b6d4; border-radius: 50%; opacity: calc(0.5 - var(--i) * 0.1); width: calc(var(--i) * 28px); height: calc(var(--i) * 28px); top: 50%; left: 50%; transform: translate(-50%, -50%); animation: radarPulse 3s calc(var(--i) * 0.4s) ease-in-out infinite; }
        .radar-dot { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; background: #06b6d4; border-radius: 50%; box-shadow: 0 0 10px #06b6d4, 0 0 20px #06b6d4; animation: radarPulse 3s ease-in-out infinite; }
        @keyframes radarPulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 0.2; } }
        .network-nodes { position: absolute; bottom: 20px; left: 0; pointer-events: none; opacity: 0.6; }
        .sparkle-br { position: absolute; bottom: 24px; right: 24px; font-size: 28px; color: #fff; opacity: 0.7; animation: sparkleAnim 2.5s ease-in-out infinite; text-shadow: 0 0 10px #fff, 0 0 20px #a855f7; }
        @keyframes sparkleAnim { 0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.7; } 50% { transform: scale(1.3) rotate(15deg); opacity: 1; } }
        .card { position: relative; background: rgba(10, 10, 30, 0.82); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 20px; padding: 2rem 2rem 1.8rem; width: 100%; max-width: 420px; padding-top: 2.5rem; backdrop-filter: blur(18px); box-shadow: 0 0 40px rgba(124, 58, 237, 0.15), 0 0 0 0.5px rgba(255,255,255,0.05) inset; animation: cardIn 0.5s cubic-bezier(.22,1,.36,1) both; z-index: 10; }
        @keyframes cardIn { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: none; } }
        .corner-bracket { position: absolute; pointer-events: none; }
        .card-wrapper { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 420px; position: relative; z-index: 10; }
        .robot-above { position: relative; z-index: 20; margin-bottom: -38px; animation: robotFloat 3s ease-in-out infinite; filter: drop-shadow(0 0 18px rgba(124,58,237,0.7)); }
        .robot-above-full { margin-bottom: -50px; }
        @keyframes robotFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .robot-head-wrap { background: rgba(10,10,30,0.92); border-radius: 50%; padding: 6px; box-shadow: 0 0 0 2px rgba(124,58,237,0.5), 0 0 30px rgba(124,58,237,0.6), 0 0 60px rgba(124,58,237,0.2); }
        .robot-full-wrap { display: flex; justify-content: center; }
        .robot-glow-ring { background: radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%); border: 2px solid rgba(124,58,237,0.55); border-radius: 50%; padding: 10px; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 4px rgba(124,58,237,0.15), 0 0 40px rgba(124,58,237,0.4), 0 0 80px rgba(124,58,237,0.15); }
        .card-title { font-family: 'Orbitron', sans-serif; font-size: 1.35rem; font-weight: 700; color: #f1f5f9; text-align: center; line-height: 1.3; margin-bottom: 0.35rem; }
        .llm-text { background: linear-gradient(90deg, #a855f7, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-style: italic; }
        .card-sub { color: #94a3b8; text-align: center; font-size: 0.9rem; letter-spacing: 0.03em; margin-bottom: 1.2rem; }
        .fields { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 0.5rem; width: 100%; }
        .row-2 { display: flex; gap: 0.6rem; width: 100%; min-width: 0; }
        .row-2 .input-wrap { flex: 1 1 0; min-width: 0; max-width: 50%; overflow: hidden; }
        .input-wrap { display: flex; align-items: center; gap: 0.6rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(124,58,237,0.25); border-radius: 12px; padding: 0 0.9rem; height: 48px; transition: border-color 0.25s, box-shadow 0.25s, background 0.25s; position: relative; }
        .input-wrap.focused { border-color: #7c3aed; background: rgba(124,58,237,0.07); box-shadow: 0 0 0 2px rgba(124,58,237,0.18); }
        .input-icon { color: #64748b; flex-shrink: 0; display: flex; }
        .input-wrap input { flex: 1; background: none; border: none; outline: none; color: #e2e8f0; font-family: 'Rajdhani', sans-serif; font-size: 0.95rem; font-weight: 500; min-width: 0; }
        .input-wrap input::placeholder { color: #475569; }
        .eye-btn { background: none; border: none; cursor: pointer; color: #64748b; display: flex; padding: 0; transition: color 0.2s; }
        .eye-btn:hover { color: #a855f7; }
        .forgot-row { display: flex; justify-content: flex-end; margin-bottom: 1rem; }
        .forgot-btn { background: none; border: none; cursor: pointer; color: #06b6d4; font-family: 'Rajdhani', sans-serif; font-size: 0.9rem; font-weight: 600; transition: opacity 0.2s; }
        .forgot-btn:hover { opacity: 0.7; }
        .primary-btn { width: 100%; height: 52px; border: none; border-radius: 12px; background: linear-gradient(90deg, #6d28d9, #7c3aed, #8b5cf6); color: #fff; font-family: 'Orbitron', sans-serif; font-size: 1rem; font-weight: 600; letter-spacing: 0.05em; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; position: relative; overflow: hidden; transition: box-shadow 0.25s, transform 0.15s; box-shadow: 0 0 20px rgba(124,58,237,0.4); margin-top: 0.4rem; }
        .primary-btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent); transform: translateX(-100%); transition: transform 0.5s; }
        .primary-btn:hover::after { transform: translateX(100%); }
        .primary-btn:hover { box-shadow: 0 0 35px rgba(124,58,237,0.65); transform: translateY(-1px); }
        .primary-btn:active { transform: translateY(1px); }
        .signup-prompt { margin-top: 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(124,58,237,0.2); border-radius: 12px; padding: 0.9rem; text-align: center; }
        .signup-prompt p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 0.3rem; }
        .link-btn { background: none; border: none; cursor: pointer; color: #a855f7; font-family: 'Rajdhani', sans-serif; font-size: 0.95rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.35rem; transition: color 0.2s, gap 0.2s; }
        .link-btn:hover { color: #c084fc; gap: 0.55rem; }
        .back-row { margin-top: 1rem; display: flex; align-items: center; justify-content: space-between; }
        .welcome-txt { color: #06b6d4; font-size: 0.95rem; font-weight: 600; }
        .toast { border-radius: 10px; padding: 0.65rem 1rem; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.8rem; text-align: center; animation: toastIn 0.3s ease both; }
        .toast-success { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16,185,129,0.4); color: #6ee7b7; }
        .toast-error { background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239,68,68,0.35); color: #fca5a5; }
        @keyframes toastIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        .signin-welcome { text-align: center; color: #06b6d4; font-size: 0.95rem; font-weight: 600; margin-top: 0.9rem; letter-spacing: 0.03em; }
        .dob-wrap input[type="date"] { flex: 1; background: none; border: none; outline: none; color: #e2e8f0; font-family: 'Rajdhani', sans-serif; font-size: 0.95rem; font-weight: 500; min-width: 0; cursor: pointer; }
        .dob-wrap input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.7) sepia(1) saturate(3) hue-rotate(220deg); cursor: pointer; opacity: 0.8; width: 18px; height: 18px; }
        .dob-wrap input[type="date"]::-webkit-datetime-edit { color: #94a3b8; }
        @media (max-width: 480px) { .card { padding: 1.5rem 1.25rem; max-width: 95vw; } .card-title { font-size: 1.1rem; } .row-2 { flex-direction: column; } }
      `}</style>

      {page === "signin" ? (
        <SignInPage onGoSignUp={() => setPage("signup")} onLogin={onLogin} />
      ) : (
        <SignUpPage onGoSignIn={() => setPage("signin")} />
      )}
    </>
  );
}
