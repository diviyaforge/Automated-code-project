import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardHome } from './DashboardHome'

// AI Analysis
import AIAnalysis from './Ai-analysis/AIAnalysis'
import AIChatAssistant from './Ai-analysis/AIChatAssistant'
import BugDetection from './Ai-analysis/BugDetection'
import CodeExplanation from './Ai-analysis/CodeExplanation'
import SemanticSearch from './Ai-analysis/SemanticSearch'

// DevSecOps
import DevsecOps from './devsecops/DevsecOps'
import SecurityScanner from './devsecops/SecurityScanner'
import VulnerabilityAnalysis from './devsecops/VulnerabilityAnalysis'

// History
import AnalysisHistory from './History/AnalysisHistory'
import History from './History/History'
import SavedSessions from './History/SavedSessions'

// Visualization
import CodeHealth from './Visualization/CodeHealth'
import Visualization from './Visualization/Visualization'

const NAV = [
  {
    label: 'AI Analysis', color: '#a78bfa', icon: '🤖',
    items: [
      { key: 'code-explanation', label: 'Code Explanation', icon: '📄', color: '#60a5fa' },
      { key: 'bug-detection',    label: 'Bug Detection',    icon: '🐛', color: '#4ade80' },
      { key: 'semantic-search',  label: 'Semantic Search',  icon: '🔍', color: '#f472b6' },
      { key: 'chat-assistant',   label: 'AI Chat Assistant',icon: '💬', color: '#e2e8f0' },
    ]
  },
  {
    label: 'DevSecOps', color: '#f472b6', icon: '🛡️',
    items: [
      { key: 'security-scanner', label: 'Security Scanner',      icon: '🔒', color: '#fbbf24' },
      { key: 'vulnerability',    label: 'Vulnerability Analysis', icon: '⚠️', color: '#fb923c' },
    ]
  },
  {
    label: 'Visualization', color: '#f97316', icon: '📊',
    items: [
     
      { key: 'code-health',   label: 'Code Health',    icon: '💡', color: '#a3e635' },
    ]
  },
  {
    label: 'History', color: '#fb923c', icon: '🕐',
    items: [
      { key: 'analysis-history', label: 'Analysis History', icon: '📊', color: '#c084fc' },
      { key: 'saved-sessions',   label: 'Saved Sessions',   icon: '🔖', color: '#f87171' },
    ]
  },
]

function Dashboard({ onLogout }) {
  const [activeComponent, setActiveComponent] = useState('home')
  const [code, setCode]                       = useState('')
  const [isAnalyzing, setIsAnalyzing]         = useState(false)
  const [analysisResult, setAnalysisResult]   = useState('')
  const [analysisLabel, setAnalysisLabel]     = useState('')
  const [openGroups, setOpenGroups]           = useState(['AI Analysis','DevSecOps','Visualization','History'])
  const [showProfile, setShowProfile]         = useState(false)
  const [successMsg, setSuccessMsg]           = useState('')
  const [showLogout, setShowLogout]           = useState(false)
  const [profile, setProfile]                 = useState({ name: 'User', email: 'user@email.com', phone: ' ' })
  const [editProfile, setEditProfile]         = useState({ ...profile })

  const toggleGroup = (label) => setOpenGroups(p => p.includes(label) ? p.filter(g => g !== label) : [...p, label])

  // Load profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("acr_token");
      if (!token) {
        onLogout();
        return;
      }
      try {
        const res = await fetch("/api/auth/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const userProfile = {
            name: `${data.first_name} ${data.last_name}`,
            email: data.email,
            phone: data.phone || '',
            dob: data.dob || ''
          };
          setProfile(userProfile);
          setEditProfile(userProfile);
        } else {
          onLogout();
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, [onLogout]);

  // Handle code review calling FastAPI backend
  const handleReview = async (customCode, featureLabel = 'Code Review', customPrompt = null) => {
    const targetCode = typeof customCode === "string" ? customCode : code;
    if (!targetCode.trim()) return;
    
    setIsAnalyzing(true);
    setAnalysisLabel(featureLabel);
    setAnalysisResult('');
    
    const token = localStorage.getItem("acr_token");
    try {
      const res = await fetch("/api/analysis/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          code: targetCode,
          prompt: customPrompt,
          label: featureLabel
        })
      });
      const data = await res.json();
      if (res.ok) {
        setAnalysisResult(data.result);
      } else {
        const errorDetail = typeof data.detail === "string" ? data.detail : "Failed to analyze code.";
        setAnalysisResult(`⚠️ Error: ${errorDetail}`);
      }
    } catch (err) {
      setAnalysisResult('⚠️ Connection to backend failed. Is the backend server running?');
    }
    setIsAnalyzing(false);
  };

  // Handle save session calling FastAPI backend
  const handleSave = async () => {
    const token = localStorage.getItem("acr_token");
    try {
      const res = await fetch("/api/saved-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          code,
          result: analysisResult,
          label: analysisLabel
        })
      });
      if (res.ok) {
        setSuccessMsg('💾 Session saved successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        const data = await res.json();
        const errorDetail = typeof data.detail === "string" ? data.detail : "Error saving session.";
        setSuccessMsg(`❌ Save failed: ${errorDetail}`);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setSuccessMsg('❌ Connection error');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // Handle update profile calling FastAPI backend
  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("acr_token");
    const names = editProfile.name.trim().split(" ");
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ") || " ";
    
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: editProfile.email,
          phone: editProfile.phone,
          dob: editProfile.dob
        })
      });
      if (res.ok) {
        const data = await res.json();
        const updated = {
          name: `${data.first_name} ${data.last_name}`,
          email: data.email,
          phone: data.phone || '',
          dob: data.dob || ''
        };
        setProfile(updated);
        setEditProfile(updated);
        setShowProfile(false);
        setSuccessMsg('✅ Profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        const data = await res.json();
        const errorDetail = typeof data.detail === "string" ? data.detail : "Error updating profile.";
        setSuccessMsg(`❌ Update failed: ${errorDetail}`);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setSuccessMsg('❌ Connection error');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };
  

  const renderComponent = () => {
    // Shared props for analysis tool subpages
    const toolProps = {
      code,
      isAnalyzing,
      analysisResult,
      analysisLabel,
      onSave: handleSave
    };

    switch (activeComponent) {
      case 'ai-analysis':      return <AIAnalysis />
      case 'chat-assistant':   return <AIChatAssistant />
      case 'bug-detection':    
        return <BugDetection {...toolProps} onReview={(c) => handleReview(c, 'Bug Detection', 'Analyse this code for bugs, errors, and logical issues. List each bug with its line number, severity (critical/warning/minor), and a short fix suggestion. Be concise.')} />
      case 'code-explanation': 
        return <CodeExplanation {...toolProps} onReview={(c) => handleReview(c, 'Code Explanation', 'Explain what this code does in plain English. Give a 2-sentence summary, then list the key functions/logic in bullet points. Be concise.')} />
      case 'semantic-search':  
        return <SemanticSearch {...toolProps} onReview={(c) => handleReview(c, 'Semantic Search', 'Map the semantic structure of this code. List the main functions, classes, and patterns found. Keep it brief and structured.')} />
      case 'devsecops':        return <DevsecOps />
      case 'security-scanner': 
        return <SecurityScanner {...toolProps} onReview={(c) => handleReview(c, 'Security Scanner', 'Scan this code for security vulnerabilities and unsafe practices. List each issue with severity and a one-line fix. Be direct and concise.')} />
      case 'vulnerability':    
        return <VulnerabilityAnalysis {...toolProps} onReview={(c) => handleReview(c, 'Vulnerability Analysis', 'Perform a deep vulnerability analysis on this code. Identify CVEs, injection risks, and exploitable weaknesses. List each with a severity rating.')} />
      case 'history':          return <History />
      case 'analysis-history': return <AnalysisHistory />
      case 'saved-sessions':   return <SavedSessions />
      case 'visualization':    return <Visualization />
      case 'code-health':      
        return <CodeHealth {...toolProps} onReview={(c) => handleReview(c, 'Code Health', 'Give a code health report. Score maintainability, readability, and test coverage out of 100. List the top 3 quality issues. Format: Score: X/100, then bullet points.')} />
      default: return (
        <DashboardHome code={code} setCode={setCode} onNavigate={setActiveComponent} />
      )
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0a0f1a' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: '220px', minWidth: '220px', background: '#0d1117', borderRight: '1px solid #1e2535', display: 'flex', flexDirection: 'column', height: '100vh' }}>

        {/* DASHBOARD label + Home button */}
        <div style={{ padding: '16px 12px', borderBottom: '1px solid #1e2535' }}>
  {/* Home button - top */}
  <button onClick={() => setActiveComponent('home')}
    style={{ width: '100%', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', marginBottom: '12px' }}>
    <span style={{ fontSize: '18px' }}>🏠</span>
    <span style={{ fontSize: '13px', fontWeight: '700', color: '#c4b5fd' }}>Home</span>
  </button>

  {/* Dashboard label - no icon */}
  <div style={{ padding: '2px 4px' }}>
    <span style={{ fontSize: '11px', fontWeight: '800', color: '#4b5563', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Dashboard</span>
  </div>
</div>
        {/* NAV GROUPS */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
          {NAV.map(group => (
  <div key={group.label} style={{ marginBottom: '8px' }}>
    {/* Group header - label only */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px' }}>
      <span style={{ fontSize: '15px' }}>{group.icon}</span>
      <span style={{ fontSize: '13px', fontWeight: '700', color: group.color }}>{group.label}</span>
    </div>

    {/* Group items - always visible */}
    {(
                <div style={{ paddingLeft: '8px', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {group.items.map(item => (
                    <button key={item.key} onClick={() => setActiveComponent(item.key)}
                      style={{ background: activeComponent === item.key ? 'rgba(124,58,237,0.15)' : 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 10px', borderRadius: '8px', width: '100%', textAlign: 'left', transition: 'all 0.2s' }}>
                      <span style={{ fontSize: '14px' }}>{item.icon}</span>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: activeComponent === item.key ? '#c4b5fd' : '#e2e8f0' }}>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* BOTTOM — Settings + Logout */}
        <div style={{ borderTop: '1px solid #1e2535', padding: '12px 8px' }}>
        
          <button onClick={() => setShowLogout(true)}
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '8px' }}>
            <span style={{ fontSize: '16px' }}>↪️</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#f87171' }}>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* TOP BAR */}
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid #1e2535', background: '#0d1117', flexShrink: 0 }}>
  <h1 style={{ fontSize: '20px', fontWeight: '900', margin: 0 }}>
    ⚡ Automated Code Review{' '}
    <span style={{ color: '#7c3aed' }}>with LLM</span>{' '}
    <span style={{ color: '#4ECDC4' }}>&lt;/&gt;</span>
  </h1>
        {successMsg && (
      <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '8px', padding: '7px 16px', color: '#4ade80', fontSize: '13px', fontWeight: '600', marginRight: '12px' }}>
        {successMsg}
  </div>
)}
{/* Profile button */}
         {/* Profile button */}
          <button onClick={() => setShowProfile(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px', padding: '7px 14px', cursor: 'pointer' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', color: '#fff' }}>
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0' }}>{profile.name}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{profile.phone || 'Add phone number'}</div>
            </div>
          </button>
        </div>

        {/* PAGE CONTENT */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
          {renderComponent()}
        </main>
      </div>

      {/* ── PROFILE MODAL ── */}
      {showLogout && (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
    <div style={{ background: '#111827', border: '1px solid #1e2535', borderRadius: '16px', padding: '28px', width: '320px', textAlign: 'center' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>👋</div>
      <h3 style={{ color: '#f1f5f9', fontWeight: '800', marginBottom: '8px', fontSize: '18px' }}>Logout?</h3>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Are you sure you want to exit?</p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => setShowLogout(false)}
          style={{ flex: 1, padding: '10px', background: '#1e2535', border: 'none', borderRadius: '8px', color: '#94a3b8', fontWeight: '700', cursor: 'pointer' }}>
          Cancel
        </button>
        <button onClick={onLogout}
          style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg,#ef4444,#dc2626)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </div>
  </div>
)}

      {showProfile && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#111827', border: '1px solid #1e2535', borderRadius: '16px', padding: '28px', width: '360px' }}>
            <h3 style={{ color: '#f1f5f9', fontWeight: '800', marginBottom: '20px', fontSize: '16px' }}>👤 Edit Profile</h3>

            {['name','email','phone'].map(field => (
              <div key={field} style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{field}</label>
                <input value={editProfile[field]}
                  onChange={e => setEditProfile(p => ({ ...p, [field]: e.target.value }))}
                  style={{ width: '100%', background: '#0d1117', border: '1px solid #1e2535', borderRadius: '8px', padding: '9px 12px', color: '#e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={handleUpdateProfile}
                style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                Save
              </button>
              <button onClick={() => { setEditProfile({ ...profile }); setShowProfile(false) }}
                style={{ flex: 1, padding: '10px', background: '#1e2535', border: 'none', borderRadius: '8px', color: '#94a3b8', fontWeight: '700', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard