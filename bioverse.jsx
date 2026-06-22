import { useState, useEffect, useRef } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const SYLLABUS = {
  "1st PU": {
    color: "#0A5C36",
    accent: "#10B981",
    icon: "🌱",
    units: [
      {
        id: "u1", title: "Unit I – Diversity in the Living World",
        chapters: [
          { id: "c1", title: "The Living World", concepts: 8, videos: 5, notes: 3 },
          { id: "c2", title: "Biological Classification", concepts: 12, videos: 8, notes: 4 },
          { id: "c3", title: "Plant Kingdom", concepts: 15, videos: 10, notes: 5 },
          { id: "c4", title: "Animal Kingdom", concepts: 14, videos: 9, notes: 5 },
        ]
      },
      {
        id: "u2", title: "Unit II – Structural Organisation in Plants and Animals",
        chapters: [
          { id: "c5", title: "Morphology of Flowering Plants", concepts: 11, videos: 7, notes: 4 },
          { id: "c6", title: "Anatomy of Flowering Plants", concepts: 9, videos: 6, notes: 3 },
          { id: "c7", title: "Structural Organisation in Animals", concepts: 10, videos: 6, notes: 4 },
        ]
      },
      {
        id: "u3", title: "Unit III – Cell: Structure and Functions",
        chapters: [
          { id: "c8", title: "Cell: The Unit of Life", concepts: 13, videos: 8, notes: 5 },
          { id: "c9", title: "Biomolecules", concepts: 11, videos: 7, notes: 4 },
          { id: "c10", title: "Cell Cycle and Cell Division", concepts: 9, videos: 6, notes: 3 },
        ]
      },
      {
        id: "u4", title: "Unit IV – Plant Physiology",
        chapters: [
          { id: "c11", title: "Photosynthesis in Higher Plants", concepts: 12, videos: 8, notes: 4 },
          { id: "c12", title: "Respiration in Plants", concepts: 10, videos: 6, notes: 3 },
          { id: "c13", title: "Plant Growth and Development", concepts: 8, videos: 5, notes: 3 },
        ]
      },
      {
        id: "u5", title: "Unit V – Human Physiology",
        chapters: [
          { id: "c14", title: "Breathing and Exchange of Gases", concepts: 10, videos: 7, notes: 4 },
          { id: "c15", title: "Body Fluids and Circulation", concepts: 12, videos: 8, notes: 4 },
          { id: "c16", title: "Excretory Products and Elimination", concepts: 9, videos: 6, notes: 3 },
          { id: "c17", title: "Locomotion and Movement", concepts: 8, videos: 5, notes: 3 },
          { id: "c18", title: "Neural Control and Coordination", concepts: 11, videos: 7, notes: 4 },
          { id: "c19", title: "Chemical Coordination and Integration", concepts: 10, videos: 6, notes: 4 },
        ]
      }
    ]
  },
  "2nd PU": {
    color: "#065F46",
    accent: "#059669",
    icon: "🧬",
    units: [
      {
        id: "u6", title: "Unit VI – Reproduction",
        chapters: [
          { id: "c20", title: "Sexual Reproduction in Flowering Plants", concepts: 13, videos: 9, notes: 5 },
          { id: "c21", title: "Human Reproduction", concepts: 12, videos: 8, notes: 5 },
          { id: "c22", title: "Reproductive Health", concepts: 8, videos: 5, notes: 3 },
        ]
      },
      {
        id: "u7", title: "Unit VII – Genetics and Evolution",
        chapters: [
          { id: "c23", title: "Principles of Inheritance and Variation", concepts: 14, videos: 10, notes: 6 },
          { id: "c24", title: "Molecular Basis of Inheritance", concepts: 16, videos: 11, notes: 6 },
          { id: "c25", title: "Evolution", concepts: 11, videos: 7, notes: 4 },
        ]
      },
      {
        id: "u8", title: "Unit VIII – Biology in Human Welfare",
        chapters: [
          { id: "c26", title: "Human Health and Disease", concepts: 13, videos: 9, notes: 5 },
          { id: "c27", title: "Microbes in Human Welfare", concepts: 9, videos: 6, notes: 4 },
        ]
      },
      {
        id: "u9", title: "Unit IX – Biotechnology",
        chapters: [
          { id: "c28", title: "Biotechnology: Principles and Processes", concepts: 14, videos: 10, notes: 5 },
          { id: "c29", title: "Biotechnology and its Applications", concepts: 11, videos: 8, notes: 4 },
        ]
      },
      {
        id: "u10", title: "Unit X – Ecology and Environment",
        chapters: [
          { id: "c30", title: "Organisms and Populations", concepts: 10, videos: 7, notes: 4 },
          { id: "c31", title: "Ecosystem", concepts: 11, videos: 7, notes: 4 },
          { id: "c32", title: "Biodiversity and Conservation", concepts: 9, videos: 6, notes: 3 },
        ]
      }
    ]
  }
};

const MOCK_QUESTIONS = [
  { id: 1, text: "Which organelle is known as the 'powerhouse of the cell'?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"], correct: 1, difficulty: "Easy", type: "KCET", explanation: "Mitochondria produce ATP through cellular respiration, earning the 'powerhouse' title." },
  { id: 2, text: "The process of photosynthesis occurs in which organelle?", options: ["Mitochondria", "Nucleus", "Chloroplast", "Endoplasmic Reticulum"], correct: 2, difficulty: "Easy", type: "NEET", explanation: "Chloroplasts contain chlorophyll and are the site of photosynthesis in plant cells." },
  { id: 3, text: "Which of the following is NOT a type of RNA?", options: ["mRNA", "tRNA", "rRNA", "dRNA"], correct: 3, difficulty: "Medium", type: "KCET", explanation: "dRNA does not exist. The three main types of RNA are mRNA, tRNA, and rRNA." },
  { id: 4, text: "The functional unit of kidney is called:", options: ["Neuron", "Nephron", "Axon", "Glomerulus"], correct: 1, difficulty: "Easy", type: "PU", explanation: "Nephron is the structural and functional unit of the kidney responsible for filtration." },
  { id: 5, text: "During which phase of mitosis do chromosomes align at the cell's equator?", options: ["Prophase", "Anaphase", "Metaphase", "Telophase"], correct: 2, difficulty: "Medium", type: "NEET", explanation: "During Metaphase, chromosomes align along the metaphase plate (cell's equator)." },
];

const MOCK_VIDEOS = [
  { id: 1, title: "Introduction to Cell Biology", youtubeId: "URUJD5NEXC8", duration: "18:32" },
  { id: 2, title: "Photosynthesis - Light Reactions", youtubeId: "g78utcLQrJ4", duration: "22:14" },
  { id: 3, title: "DNA Structure & Replication", youtubeId: "8kK2zwjRV0M", duration: "25:47" },
];

// ─── ICONS ───────────────────────────────────────────────────────────────────

const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    book: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    notes: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    question: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    test: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    play: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    fire: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none"><path d="M12 2C12 2 8 6 8 10C8 12.2 9.2 14.1 11 15C10.4 13.9 10 12.5 10 11C10 11 14 14 14 18C14 20.2 12.8 22 11 23C11.8 23 12.5 23 13 23C17.4 23 21 19.4 21 15C21 10.5 12 2 12 2Z"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    dna: "🧬",
    crown: "👑",
    trophy: "🏆",
    target: "🎯",
    video: "🎥",
    flask: "🧪",
    pin: "📌",
    lock: "🔒",
    bulb: "💡",
  };
  return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{icons[name]}</span>;
};

// ─── STYLES ──────────────────────────────────────────────────────────────────

const S = {
  app: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    minHeight: "100vh",
    background: "#F8FFFE",
    color: "#0D1F17",
  },
  // Auth styles
  authWrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0A5C36 0%, #065F46 40%, #064E3B 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  },
  authCard: {
    background: "#fff",
    borderRadius: "24px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "440px",
    boxShadow: "0 25px 80px rgba(0,0,0,0.3)",
    position: "relative",
    zIndex: 2,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1.5px solid #D1FAE5",
    fontSize: "15px",
    outline: "none",
    background: "#F0FDF4",
    color: "#0D1F17",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    marginBottom: "16px",
  },
  btn: {
    padding: "14px 28px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.2s",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },
  btnPrimary: {
    background: "linear-gradient(135deg, #0A5C36, #10B981)",
    color: "#fff",
    width: "100%",
    justifyContent: "center",
  },
  btnOutline: {
    background: "transparent",
    color: "#0A5C36",
    border: "2px solid #0A5C36",
  },
  btnGhost: {
    background: "transparent",
    color: "#6B7280",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    display: "block",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  // Dashboard layout
  layout: {
    display: "flex",
    minHeight: "100vh",
  },
  sidebar: {
    width: "260px",
    background: "linear-gradient(180deg, #0A5C36 0%, #064E3B 100%)",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    zIndex: 100,
    overflowY: "auto",
    transition: "transform 0.3s ease",
  },
  sidebarLogo: {
    padding: "28px 24px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  sidebarNav: {
    flex: 1,
    padding: "16px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "11px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    color: "rgba(255,255,255,0.7)",
    fontSize: "14px",
    fontWeight: "500",
    border: "none",
    background: "transparent",
    width: "100%",
    textAlign: "left",
  },
  navItemActive: {
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
  },
  mainContent: {
    marginLeft: "260px",
    flex: 1,
    minHeight: "100vh",
  },
  topbar: {
    background: "#fff",
    borderBottom: "1px solid #E5F7EF",
    padding: "16px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  page: {
    padding: "32px",
    maxWidth: "1200px",
  },
  // Cards
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid #E5F7EF",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    transition: "all 0.2s",
  },
  statCard: {
    background: "linear-gradient(135deg, #0A5C36, #10B981)",
    borderRadius: "16px",
    padding: "24px",
    color: "#fff",
  },
  chapterCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    border: "1.5px solid #E5F7EF",
    cursor: "pointer",
    transition: "all 0.25s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  progressBar: (pct, color = "#10B981") => ({
    height: "6px",
    background: "#E5F7EF",
    borderRadius: "99px",
    overflow: "hidden",
    position: "relative",
  }),
  progressFill: (pct, color = "#10B981") => ({
    height: "100%",
    width: `${pct}%`,
    background: `linear-gradient(90deg, ${color}, #34D399)`,
    borderRadius: "99px",
    transition: "width 0.6s ease",
  }),
  badge: (color = "#10B981", bg = "#ECFDF5") => ({
    background: bg,
    color,
    padding: "4px 10px",
    borderRadius: "99px",
    fontSize: "12px",
    fontWeight: "600",
  }),
  grid2: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" },
  grid3: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
  grid4: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" },
  flex: (gap = 12) => ({ display: "flex", alignItems: "center", gap }),
  flexBetween: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  heading1: { fontSize: "28px", fontWeight: "800", color: "#0D1F17", margin: "0 0 4px" },
  heading2: { fontSize: "22px", fontWeight: "700", color: "#0D1F17", margin: "0 0 4px" },
  heading3: { fontSize: "17px", fontWeight: "700", color: "#0D1F17", margin: 0 },
  subtitle: { fontSize: "15px", color: "#6B7280", margin: 0 },
  sectionTitle: { fontSize: "18px", fontWeight: "700", color: "#0D1F17", margin: "0 0 16px" },
  tag: (type) => {
    const map = {
      KCET: { bg: "#EEF2FF", color: "#6366F1" },
      NEET: { bg: "#FEF3C7", color: "#D97706" },
      PU: { bg: "#ECFDF5", color: "#059669" },
      Easy: { bg: "#ECFDF5", color: "#059669" },
      Medium: { bg: "#FEF3C7", color: "#D97706" },
      Hard: { bg: "#FEF2F2", color: "#DC2626" },
    };
    const t = map[type] || map.PU;
    return { background: t.bg, color: t.color, padding: "3px 10px", borderRadius: "99px", fontSize: "12px", fontWeight: "600" };
  },
};

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────

function Landing({ onAuth }) {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const stats = [
    { num: "25", label: "Chapters", icon: "📚" },
    { num: "250+", label: "Concepts", icon: "💡" },
    { num: "1000+", label: "Questions", icon: "❓" },
    { num: "50+", label: "Mock Tests", icon: "📝" },
  ];

  const features = [
    { icon: "🎥", title: "HD Video Lectures", desc: "Expert-curated videos for every concept in Karnataka PU syllabus" },
    { icon: "📖", title: "Detailed Notes", desc: "Comprehensive notes with diagrams and quick revision summaries" },
    { icon: "🎯", title: "KCET & NEET PYQs", desc: "Previous year questions with detailed explanations and analysis" },
    { icon: "🧪", title: "Mock Tests", desc: "Chapter, unit, and full mock tests with instant performance analytics" },
    { icon: "📈", title: "Progress Tracking", desc: "Real-time tracking of your learning journey across all chapters" },
    { icon: "🤖", title: "AI Tutor", desc: "Intelligent doubt clearing powered by AI — coming soon!" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 100, background: scrollY > 20 ? "rgba(255,255,255,0.95)" : "transparent", backdropFilter: scrollY > 20 ? "blur(12px)" : "none", borderBottom: scrollY > 20 ? "1px solid #E5F7EF" : "none", transition: "all 0.3s", padding: "0 32px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", ...S.flexBetween, padding: "16px 0" }}>
          <div style={S.flex(10)}>
            <span style={{ fontSize: "28px" }}>🧬</span>
            <span style={{ fontSize: "22px", fontWeight: "800", color: scrollY > 20 ? "#0A5C36" : "#fff" }}>BioVerse</span>
          </div>
          <div style={S.flex(16)}>
            <span style={{ color: scrollY > 20 ? "#374151" : "rgba(255,255,255,0.85)", fontSize: "14px", cursor: "pointer", fontWeight: "500" }}>About</span>
            <span style={{ color: scrollY > 20 ? "#374151" : "rgba(255,255,255,0.85)", fontSize: "14px", cursor: "pointer", fontWeight: "500" }}>Pricing</span>
            <button onClick={() => onAuth("login")} style={{ ...S.btn, padding: "10px 20px", background: scrollY > 20 ? "transparent" : "rgba(255,255,255,0.15)", color: scrollY > 20 ? "#0A5C36" : "#fff", border: scrollY > 20 ? "2px solid #0A5C36" : "2px solid rgba(255,255,255,0.5)", fontSize: "14px" }}>Login</button>
            <button onClick={() => onAuth("signup")} style={{ ...S.btn, padding: "10px 20px", background: "#fff", color: "#0A5C36", fontSize: "14px" }}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #0A5C36 0%, #064E3B 50%, #022C22 100%)", minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        {/* DNA animated blobs */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ position: "absolute", borderRadius: "50%", background: `rgba(16,185,129,${0.03 + i * 0.02})`, width: `${200 + i * 80}px`, height: `${200 + i * 80}px`, top: `${10 + i * 12}%`, left: `${60 + (i % 3) * 10}%`, animation: `float ${4 + i}s ease-in-out infinite alternate`, }} />
          ))}
          {/* DNA helix dots */}
          {[...Array(12)].map((_, i) => (
            <div key={`d${i}`} style={{ position: "absolute", width: "8px", height: "8px", borderRadius: "50%", background: i % 2 === 0 ? "rgba(52,211,153,0.6)" : "rgba(16,185,129,0.4)", right: `${15 + Math.sin(i * 0.8) * 8}%`, top: `${8 + i * 7}%`, animation: `pulse ${2 + (i % 3) * 0.5}s ease-in-out infinite alternate` }} />
          ))}
        </div>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "120px 32px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center", width: "100%" }}>
          <div>
            <div style={{ ...S.badge("#34D399", "rgba(52,211,153,0.15)"), display: "inline-block", marginBottom: "20px", fontSize: "13px" }}>
              Karnataka PU Biology Platform
            </div>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 58px)", fontWeight: "900", color: "#fff", lineHeight: "1.1", margin: "0 0 20px", letterSpacing: "-0.02em" }}>
              Master Biology.<br />
              <span style={{ color: "#34D399" }}>Crack KCET</span><br />& NEET.
            </h1>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.75)", lineHeight: "1.6", margin: "0 0 36px", maxWidth: "480px" }}>
              Complete Karnataka PU Biology learning platform — from 1st PU basics to NEET advanced. Structured, comprehensive, and exam-focused.
            </p>
            <div style={S.flex(16)}>
              <button onClick={() => onAuth("signup")} style={{ ...S.btn, ...S.btnPrimary, padding: "16px 32px", fontSize: "16px", background: "#fff", color: "#0A5C36" }}>
                Start Learning Free <Icon name="arrow" size={18} />
              </button>
              <button style={{ ...S.btn, ...S.btnGhost, color: "rgba(255,255,255,0.85)", padding: "16px 24px", fontSize: "16px", border: "2px solid rgba(255,255,255,0.3)" }}>
                <Icon name="play" size={16} color="#fff" /> Watch Demo
              </button>
            </div>
            <div style={{ ...S.flex(24), marginTop: "40px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#fff" }}>25</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>Chapters</div>
              </div>
              <div style={{ width: "1px", height: "40px", background: "rgba(255,255,255,0.2)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#fff" }}>250+</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>Concepts</div>
              </div>
              <div style={{ width: "1px", height: "40px", background: "rgba(255,255,255,0.2)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#fff" }}>1000+</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>Questions</div>
              </div>
            </div>
          </div>
          {/* Hero visual card */}
          <div style={{ position: "relative" }}>
            <div style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "24px", padding: "28px", boxShadow: "0 40px 80px rgba(0,0,0,0.3)" }}>
              <div style={{ ...S.flexBetween, marginBottom: "20px" }}>
                <span style={{ color: "#fff", fontWeight: "700", fontSize: "15px" }}>🧬 Today's Study Plan</span>
                <span style={{ ...S.badge("#34D399", "rgba(52,211,153,0.2)"), fontSize: "12px" }}>Day 12 🔥</span>
              </div>
              {[
                { title: "Cell: Unit of Life", progress: 100, icon: "✅" },
                { title: "Biomolecules", progress: 65, icon: "⏳" },
                { title: "Cell Division", progress: 0, icon: "🔒" },
              ].map((item, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px 16px", marginBottom: "10px" }}>
                  <div style={{ ...S.flexBetween, marginBottom: "8px" }}>
                    <span style={{ color: "#fff", fontSize: "14px", fontWeight: "500" }}>{item.icon} {item.title}</span>
                    <span style={{ color: item.progress === 100 ? "#34D399" : "rgba(255,255,255,0.5)", fontSize: "13px" }}>{item.progress}%</span>
                  </div>
                  <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "99px" }}>
                    <div style={{ height: "100%", width: `${item.progress}%`, background: item.progress === 100 ? "#34D399" : "#10B981", borderRadius: "99px" }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: "16px", background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "12px", padding: "12px 16px", display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ fontSize: "20px" }}>🤖</span>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px" }}><strong style={{ color: "#34D399" }}>AI Tutor:</strong> "You're doing great! Revise Krebs cycle today."</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "80px 32px", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#10B981", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Why BioVerse</p>
          <h2 style={{ fontSize: "36px", fontWeight: "800", color: "#0D1F17", marginBottom: "8px" }}>Everything You Need to Score 180/180</h2>
          <p style={{ color: "#6B7280", fontSize: "17px", marginBottom: "52px" }}>Built specifically for Karnataka PU Biology students targeting KCET & NEET</p>
          <div style={S.grid3}>
            {features.map((f, i) => (
              <div key={i} style={{ ...S.card, textAlign: "left", padding: "28px" }}>
                <span style={{ fontSize: "36px", display: "block", marginBottom: "16px" }}>{f.icon}</span>
                <h3 style={{ ...S.heading3, marginBottom: "8px" }}>{f.title}</h3>
                <p style={{ ...S.subtitle, lineHeight: "1.6" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: "80px 32px", background: "#F0FDF4" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#10B981", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Pricing</p>
          <h2 style={{ fontSize: "36px", fontWeight: "800", color: "#0D1F17", marginBottom: "8px" }}>Simple, Transparent Pricing</h2>
          <p style={{ color: "#6B7280", fontSize: "17px", marginBottom: "52px" }}>Start free, upgrade when you're ready</p>
          <div style={S.grid2}>
            <div style={{ ...S.card, textAlign: "left" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#6B7280", textTransform: "uppercase", marginBottom: "12px" }}>Free</div>
              <div style={{ fontSize: "40px", fontWeight: "900", color: "#0D1F17", marginBottom: "4px" }}>₹0</div>
              <div style={{ color: "#6B7280", fontSize: "14px", marginBottom: "24px" }}>Forever free</div>
              {["Sample videos (3 per chapter)", "Basic notes", "10 practice questions", "Chapter overview"].map((f, i) => (
                <div key={i} style={{ ...S.flex(10), marginBottom: "10px" }}>
                  <span style={{ color: "#10B981" }}>✓</span>
                  <span style={{ fontSize: "14px", color: "#374151" }}>{f}</span>
                </div>
              ))}
              <button onClick={() => onAuth("signup")} style={{ ...S.btn, ...S.btnOutline, width: "100%", justifyContent: "center", marginTop: "24px" }}>Get Started Free</button>
            </div>
            <div style={{ background: "linear-gradient(135deg, #0A5C36, #065F46)", borderRadius: "16px", padding: "24px", textAlign: "left", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "16px", right: "16px", background: "#FCD34D", color: "#78350F", padding: "4px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: "700" }}>
                👑 MOST POPULAR
              </div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginBottom: "12px" }}>Premium</div>
              <div style={{ fontSize: "40px", fontWeight: "900", color: "#fff", marginBottom: "4px" }}>₹999<span style={{ fontSize: "18px", fontWeight: "500" }}>/year</span></div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginBottom: "24px" }}>₹83/month billed annually</div>
              {["All video lectures (HD)", "Complete notes & PDFs", "1000+ practice questions", "KCET & NEET PYQs", "50+ Mock tests", "Progress analytics", "AI Tutor access (coming soon)"].map((f, i) => (
                <div key={i} style={{ ...S.flex(10), marginBottom: "10px" }}>
                  <span style={{ color: "#34D399" }}>✓</span>
                  <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>{f}</span>
                </div>
              ))}
              <button onClick={() => onAuth("signup")} style={{ ...S.btn, background: "#fff", color: "#0A5C36", width: "100%", justifyContent: "center", marginTop: "24px" }}>Start Premium Trial</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#0D1F17", padding: "48px 32px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ ...S.flexBetween, marginBottom: "32px", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ ...S.flex(10), marginBottom: "8px" }}>
                <span style={{ fontSize: "24px" }}>🧬</span>
                <span style={{ fontSize: "20px", fontWeight: "800", color: "#fff" }}>BioVerse</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Karnataka PU Biology Learning Platform</p>
            </div>
            <div style={S.flex(24)}>
              {["About", "Contact", "Privacy Policy", "Terms"].map(l => (
                <span key={l} style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", cursor: "pointer" }}>{l}</span>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
            © 2025 BioVerse. All rights reserved.
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float { 0% { transform: translateY(0px) scale(1); } 100% { transform: translateY(-20px) scale(1.05); } }
        @keyframes pulse { 0% { opacity: 0.4; transform: scale(1); } 100% { opacity: 1; transform: scale(1.3); } }
      `}</style>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

function Auth({ mode, onSuccess, onToggle }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", class: "1st PU" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  const handle = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      if (!form.email || !form.password) { setError("Please fill in all fields."); setLoading(false); return; }
      if (mode === "signup" && !form.name) { setError("Name is required."); setLoading(false); return; }
      setLoading(false);
      onSuccess({ name: form.name || "Student", email: form.email, class: form.class, streak: 0, progress: 0 });
    }, 900);
  };

  return (
    <div style={S.authWrapper}>
      {/* Background circles */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ position: "absolute", borderRadius: "50%", border: `1px solid rgba(52,211,153,${0.1 + i * 0.05})`, width: `${250 + i * 100}px`, height: `${250 + i * 100}px`, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
        ))}
      </div>
      <div style={S.authCard}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <span style={{ fontSize: "40px" }}>🧬</span>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#0D1F17", margin: "8px 0 4px" }}>BioVerse</h1>
          <p style={{ color: "#6B7280", fontSize: "14px" }}>
            {forgotMode ? "Reset your password" : mode === "login" ? "Welcome back! Ready to study?" : "Start your KCET/NEET journey"}
          </p>
        </div>

        {error && <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "10px", padding: "12px 16px", color: "#DC2626", fontSize: "14px", marginBottom: "16px" }}>{error}</div>}

        {forgotMode ? (
          <>
            <label style={S.label}>Email Address</label>
            <input style={S.input} type="email" placeholder="you@email.com" value={form.email} onChange={handle("email")} />
            <button style={{ ...S.btn, ...S.btnPrimary }} onClick={() => { setForgotMode(false); setError(""); }}>
              Send Reset Link
            </button>
            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <span style={{ color: "#0A5C36", fontSize: "14px", cursor: "pointer", fontWeight: "600" }} onClick={() => setForgotMode(false)}>← Back to Login</span>
            </div>
          </>
        ) : (
          <>
            {mode === "signup" && (
              <>
                <label style={S.label}>Full Name</label>
                <input style={S.input} placeholder="Your full name" value={form.name} onChange={handle("name")} />
                <label style={S.label}>Phone Number</label>
                <input style={S.input} placeholder="+91 98765 43210" value={form.phone} onChange={handle("phone")} />
                <label style={S.label}>Class</label>
                <select style={{ ...S.input }} value={form.class} onChange={handle("class")}>
                  <option>1st PU</option>
                  <option>2nd PU</option>
                </select>
              </>
            )}
            <label style={S.label}>Email Address</label>
            <input style={S.input} type="email" placeholder="you@email.com" value={form.email} onChange={handle("email")} />
            <label style={S.label}>Password</label>
            <input style={S.input} type="password" placeholder="••••••••" value={form.password} onChange={handle("password")} />
            {mode === "login" && (
              <div style={{ textAlign: "right", marginTop: "-8px", marginBottom: "16px" }}>
                <span onClick={() => setForgotMode(true)} style={{ fontSize: "13px", color: "#0A5C36", cursor: "pointer", fontWeight: "600" }}>Forgot password?</span>
              </div>
            )}
            <button onClick={submit} disabled={loading} style={{ ...S.btn, ...S.btnPrimary, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Please wait…" : mode === "login" ? "Login to BioVerse" : "Create Account"}
            </button>
            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#6B7280" }}>
              {mode === "login" ? "New here? " : "Already have an account? "}
              <span onClick={onToggle} style={{ color: "#0A5C36", fontWeight: "700", cursor: "pointer" }}>
                {mode === "login" ? "Create account" : "Login"}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

function Sidebar({ active, onNav, user, isMobile, open, onClose }) {
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: "home" },
    { key: "1stPU", label: "1st PU Biology", icon: "book" },
    { key: "2ndPU", label: "2nd PU Biology", icon: "book" },
    { key: "notes", label: "Notes", icon: "notes" },
    { key: "questions", label: "Question Bank", icon: "question" },
    { key: "tests", label: "Tests", icon: "test" },
    { key: "progress", label: "Progress", icon: "chart" },
    { key: "profile", label: "Profile", icon: "user" },
  ];

  const sidebarStyle = {
    ...S.sidebar,
    ...(isMobile ? {
      transform: open ? "translateX(0)" : "translateX(-100%)",
      boxShadow: open ? "4px 0 24px rgba(0,0,0,0.3)" : "none",
    } : {})
  };

  return (
    <>
      {isMobile && open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99 }} />}
      <div style={sidebarStyle}>
        <div style={S.sidebarLogo}>
          <span style={{ fontSize: "26px" }}>🧬</span>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "#fff" }}>BioVerse</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "1px" }}>Karnataka PU Biology</div>
          </div>
          {isMobile && <button onClick={onClose} style={{ marginLeft: "auto", ...S.btn, ...S.btnGhost, color: "#fff", padding: "6px" }}><Icon name="close" size={20} color="#fff" /></button>}
        </div>

        {/* User mini-profile */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={S.flex(10)}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #34D399, #10B981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", color: "#fff", flexShrink: 0 }}>
              {user.name?.[0]?.toUpperCase() || "S"}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{user.class || "1st PU"}</div>
            </div>
          </div>
        </div>

        <nav style={S.sidebarNav}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => { onNav(item.key); if (isMobile) onClose(); }}
              style={{ ...S.navItem, ...(active === item.key ? S.navItemActive : {}) }}>
              <Icon name={item.icon} size={18} color={active === item.key ? "#fff" : "rgba(255,255,255,0.7)"} />
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <button onClick={() => onNav("logout")} style={{ ...S.navItem, color: "rgba(255,100,100,0.8)" }}>
            <Icon name="logout" size={18} color="rgba(255,100,100,0.8)" /> Logout
          </button>
        </div>
      </div>
    </>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

function Dashboard({ user, onNav }) {
  const recentChapters = [
    { title: "Cell: The Unit of Life", unit: "Unit III", progress: 72, pctColor: "#10B981" },
    { title: "Photosynthesis", unit: "Unit IV", progress: 45, pctColor: "#F59E0B" },
    { title: "Human Reproduction", unit: "Unit VI", progress: 20, pctColor: "#EF4444" },
  ];

  const quickCards = [
    { key: "1stPU", title: "1st PU Biology", icon: "🌱", chapters: 19, progress: 32, color: "#0A5C36", light: "#ECFDF5" },
    { key: "2ndPU", title: "2nd PU Biology", icon: "🧬", chapters: 13, progress: 8, color: "#065F46", light: "#D1FAE5" },
    { key: "questions", title: "KCET Prep", icon: "🎯", chapters: "1000+ Qs", progress: 15, color: "#7C3AED", light: "#EDE9FE" },
    { key: "tests", title: "NEET Prep", icon: "🏆", chapters: "50+ Tests", progress: 5, color: "#DC2626", light: "#FEE2E2" },
  ];

  return (
    <div style={S.page}>
      {/* Welcome */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={S.heading1}>Welcome back, {user.name?.split(" ")[0]} 👋</h1>
        <p style={S.subtitle}>Keep up the momentum — you're doing great!</p>
      </div>

      {/* Stats row */}
      <div style={{ ...S.grid4, marginBottom: "32px" }}>
        {[
          { label: "Study Streak", value: "12 days", icon: "🔥", grad: "linear-gradient(135deg, #F97316, #EF4444)" },
          { label: "Overall Progress", value: "24%", icon: "📈", grad: "linear-gradient(135deg, #0A5C36, #10B981)" },
          { label: "Tests Taken", value: "8", icon: "🧪", grad: "linear-gradient(135deg, #7C3AED, #6366F1)" },
          { label: "Questions Solved", value: "342", icon: "❓", grad: "linear-gradient(135deg, #0EA5E9, #2563EB)" },
        ].map((s, i) => (
          <div key={i} style={{ background: s.grad, borderRadius: "16px", padding: "20px", color: "#fff" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{s.icon}</div>
            <div style={{ fontSize: "26px", fontWeight: "800" }}>{s.value}</div>
            <div style={{ fontSize: "13px", opacity: 0.8, marginTop: "2px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick access */}
      <h2 style={{ ...S.sectionTitle, marginBottom: "16px" }}>Your Courses</h2>
      <div style={{ ...S.grid2, marginBottom: "32px" }}>
        {quickCards.map(c => (
          <div key={c.key} onClick={() => onNav(c.key)}
            style={{ ...S.card, cursor: "pointer", display: "flex", gap: "16px", alignItems: "flex-start", padding: "20px" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = c.color; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#E5F7EF"; }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: c.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>{c.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ ...S.heading3, marginBottom: "2px" }}>{c.title}</div>
              <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "10px" }}>{c.chapters} {typeof c.chapters === "number" ? "chapters" : ""}</div>
              <div style={S.progressBar(c.progress, c.color)}>
                <div style={S.progressFill(c.progress, c.color)} />
              </div>
              <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>{c.progress}% complete</div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue + Recommended */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <div>
          <h2 style={S.sectionTitle}>Continue Learning</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {recentChapters.map((c, i) => (
              <div key={i} style={{ ...S.card, padding: "16px" }}>
                <div style={S.flexBetween}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#0D1F17" }}>{c.title}</div>
                    <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>{c.unit}</div>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: c.pctColor }}>{c.progress}%</div>
                </div>
                <div style={{ ...S.progressBar(c.progress), marginTop: "10px" }}>
                  <div style={S.progressFill(c.progress)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 style={S.sectionTitle}>Today's Goals</h2>
          <div style={{ ...S.card, padding: "20px" }}>
            {[
              { text: "Watch 2 videos on Biomolecules", done: true },
              { text: "Solve 20 KCET practice questions", done: true },
              { text: "Read notes on Cell Cycle", done: false },
              { text: "Take chapter mini test", done: false },
            ].map((g, i) => (
              <div key={i} style={{ ...S.flex(12), padding: "10px 0", borderBottom: i < 3 ? "1px solid #F3FAF7" : "none" }}>
                <div style={{ width: "22px", height: "22px", borderRadius: "50%", border: `2px solid ${g.done ? "#10B981" : "#D1D5DB"}`, background: g.done ? "#10B981" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {g.done && <Icon name="check" size={12} color="#fff" />}
                </div>
                <span style={{ fontSize: "14px", color: g.done ? "#9CA3AF" : "#374151", textDecoration: g.done ? "line-through" : "none" }}>{g.text}</span>
              </div>
            ))}
            <div style={{ ...S.flex(8), marginTop: "16px", background: "#F0FDF4", borderRadius: "10px", padding: "12px 14px" }}>
              <span style={{ fontSize: "20px" }}>🔥</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#0A5C36" }}>2 of 4 goals done!</div>
                <div style={{ fontSize: "12px", color: "#6B7280" }}>Keep going to maintain your streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SYLLABUS VIEW ────────────────────────────────────────────────────────────

function SyllabusView({ level, onChapter }) {
  const data = SYLLABUS[level];
  const [expandedUnit, setExpandedUnit] = useState(null);

  const mockProgress = { c1: 100, c2: 72, c3: 45, c8: 60, c14: 20 };

  return (
    <div style={S.page}>
      <div style={{ marginBottom: "28px" }}>
        <div style={{ ...S.flex(12), marginBottom: "8px" }}>
          <span style={{ fontSize: "32px" }}>{data.icon}</span>
          <h1 style={S.heading1}>{level} Biology</h1>
        </div>
        <p style={S.subtitle}>Karnataka PU Syllabus — {data.units.reduce((a, u) => a + u.chapters.length, 0)} chapters across {data.units.length} units</p>
        <div style={{ ...S.flex(16), marginTop: "16px" }}>
          <div style={{ ...S.badge("#10B981", "#ECFDF5") }}>📊 Overall: 24% complete</div>
          <div style={{ ...S.badge("#6366F1", "#EEF2FF") }}>🎯 KCET Ready: 3 chapters</div>
        </div>
      </div>

      {data.units.map((unit, ui) => (
        <div key={unit.id} style={{ marginBottom: "16px" }}>
          <div onClick={() => setExpandedUnit(expandedUnit === unit.id ? null : unit.id)}
            style={{ ...S.card, cursor: "pointer", padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", background: expandedUnit === unit.id ? "#ECFDF5" : "#fff", borderColor: expandedUnit === unit.id ? "#10B981" : "#E5F7EF" }}>
            <div style={S.flex(14)}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `linear-gradient(135deg, ${data.color}, ${data.accent})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "14px", fontWeight: "700" }}>
                {ui + 1}
              </div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#0D1F17" }}>{unit.title}</div>
                <div style={{ fontSize: "13px", color: "#6B7280", marginTop: "2px" }}>{unit.chapters.length} chapters</div>
              </div>
            </div>
            <div style={{ fontSize: "18px", color: "#6B7280", transition: "transform 0.2s", transform: expandedUnit === unit.id ? "rotate(180deg)" : "none" }}>▾</div>
          </div>

          {expandedUnit === unit.id && (
            <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "8px", paddingLeft: "16px" }}>
              {unit.chapters.map((chapter, ci) => {
                const prog = mockProgress[chapter.id] || 0;
                return (
                  <div key={chapter.id} onClick={() => onChapter(chapter, level)}
                    style={{ ...S.card, padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: "16px" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = data.color; e.currentTarget.style.transform = "translateX(4px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5F7EF"; e.currentTarget.style.transform = ""; }}>
                    <div style={{ fontSize: "20px" }}>📖</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...S.flexBetween, marginBottom: "6px" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#0D1F17" }}>{chapter.title}</span>
                        <span style={{ fontSize: "12px", color: prog >= 100 ? "#10B981" : "#9CA3AF", fontWeight: "600" }}>
                          {prog >= 100 ? "✅ Done" : prog > 0 ? `${prog}%` : "Not started"}
                        </span>
                      </div>
                      <div style={S.progressBar(prog)}>
                        <div style={S.progressFill(prog)} />
                      </div>
                      <div style={{ ...S.flex(12), marginTop: "8px" }}>
                        <span style={{ fontSize: "12px", color: "#9CA3AF" }}>🎥 {chapter.videos} videos</span>
                        <span style={{ fontSize: "12px", color: "#9CA3AF" }}>📝 {chapter.notes} notes</span>
                        <span style={{ fontSize: "12px", color: "#9CA3AF" }}>💡 {chapter.concepts} concepts</span>
                      </div>
                    </div>
                    <Icon name="arrow" size={16} color="#9CA3AF" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── CHAPTER PAGE ─────────────────────────────────────────────────────────────

function ChapterPage({ chapter, level, onBack }) {
  const [activeTab, setActiveTab] = useState("videos");

  const tabs = [
    { key: "videos", label: "🎥 Videos" },
    { key: "notes", label: "📝 Notes" },
    { key: "questions", label: "❓ Questions" },
    { key: "test", label: "🧪 Mini Test" },
  ];

  return (
    <div style={S.page}>
      <button onClick={onBack} style={{ ...S.btn, ...S.btnGhost, color: "#6B7280", padding: "8px 0", marginBottom: "16px", fontSize: "14px" }}>
        ← Back to Syllabus
      </button>

      <div style={{ ...S.card, padding: "24px 28px", marginBottom: "24px", background: "linear-gradient(135deg, #0A5C36, #065F46)" }}>
        <div style={{ ...S.flexBetween, marginBottom: "12px" }}>
          <h1 style={{ ...S.heading2, color: "#fff", margin: 0 }}>{chapter.title}</h1>
          <span style={{ ...S.badge("#34D399", "rgba(52,211,153,0.15)"), fontSize: "12px" }}>{level}</span>
        </div>
        <div style={{ ...S.flex(20), marginBottom: "16px" }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>🎥 {chapter.videos} videos</span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>📝 {chapter.notes} notes</span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>💡 {chapter.concepts} concepts</span>
        </div>
        <div style={{ height: "6px", background: "rgba(255,255,255,0.2)", borderRadius: "99px" }}>
          <div style={{ height: "100%", width: "45%", background: "#34D399", borderRadius: "99px" }} />
        </div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", marginTop: "6px" }}>45% complete</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ ...S.btn, padding: "10px 20px", fontSize: "14px", background: activeTab === t.key ? "#0A5C36" : "#fff", color: activeTab === t.key ? "#fff" : "#374151", border: "1.5px solid", borderColor: activeTab === t.key ? "#0A5C36" : "#E5F7EF" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "videos" && <VideosTab chapter={chapter} />}
      {activeTab === "notes" && <NotesTab chapter={chapter} />}
      {activeTab === "questions" && <QuestionsTab />}
      {activeTab === "test" && <MiniTestTab />}
    </div>
  );
}

function VideosTab({ chapter }) {
  const [playing, setPlaying] = useState(null);
  return (
    <div>
      <h2 style={S.sectionTitle}>Video Lectures</h2>
      <p style={{ ...S.subtitle, marginBottom: "20px" }}>Watch HD video lectures by expert Biology teachers</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {MOCK_VIDEOS.map((v, i) => (
          <div key={v.id} style={S.card}>
            {playing === v.id ? (
              <div style={{ borderRadius: "12px", overflow: "hidden", aspectRatio: "16/9", background: "#000" }}>
                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${v.youtubeId}?autoplay=1`}
                  frameBorder="0" allow="autoplay; fullscreen" allowFullScreen title={v.title} style={{ display: "block" }} />
              </div>
            ) : (
              <div onClick={() => setPlaying(v.id)}
                style={{ borderRadius: "12px", overflow: "hidden", aspectRatio: "16/9", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", backgroundImage: `url(https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg)`, backgroundSize: "cover", backgroundPosition: "center" }}>
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
                <div style={{ position: "relative", width: "64px", height: "64px", borderRadius: "50%", background: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
                  <Icon name="play" size={24} color="#0A5C36" />
                </div>
              </div>
            )}
            <div style={{ ...S.flexBetween, marginTop: "14px" }}>
              <div>
                <div style={{ fontSize: "15px", fontWeight: "600", color: "#0D1F17" }}>{v.title}</div>
                <div style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "2px" }}>⏱ {v.duration}</div>
              </div>
              <span style={{ ...S.badge("#10B981", "#ECFDF5"), fontSize: "11px" }}>HD</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotesTab({ chapter }) {
  return (
    <div>
      <h2 style={S.sectionTitle}>Study Notes</h2>
      <div style={{ ...S.grid2, marginBottom: "24px" }}>
        {[
          { icon: "📄", title: "Complete Notes", desc: "Detailed chapter notes with diagrams", tag: "PDF", color: "#DC2626", bg: "#FEF2F2" },
          { icon: "⚡", title: "Quick Revision", desc: "Key points for last-minute revision", tag: "PDF", color: "#7C3AED", bg: "#EDE9FE" },
          { icon: "🗺", title: "Mind Maps", desc: "Visual mind maps for easy recall", tag: "PDF", color: "#0EA5E9", bg: "#E0F2FE" },
          { icon: "📊", title: "Diagrams & Tables", desc: "All important diagrams with labels", tag: "PDF", color: "#D97706", bg: "#FEF3C7" },
        ].map((n, i) => (
          <div key={i} style={{ ...S.card, cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = n.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5F7EF"; e.currentTarget.style.transform = ""; }}>
            <div style={{ ...S.flex(12), marginBottom: "10px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: n.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{n.icon}</div>
              <span style={{ ...S.badge(n.color, n.bg), fontSize: "11px" }}>{n.tag}</span>
            </div>
            <div style={{ fontSize: "15px", fontWeight: "600", color: "#0D1F17", marginBottom: "4px" }}>{n.title}</div>
            <div style={{ fontSize: "13px", color: "#6B7280" }}>{n.desc}</div>
            <button style={{ ...S.btn, background: n.bg, color: n.color, fontSize: "13px", padding: "8px 16px", marginTop: "14px" }}>
              📥 Download PDF
            </button>
          </div>
        ))}
      </div>

      {/* Inline quick notes */}
      <div style={S.card}>
        <h3 style={{ ...S.heading3, marginBottom: "16px" }}>📌 Quick Key Points</h3>
        {[
          "The cell is the basic structural and functional unit of life.",
          "Prokaryotic cells lack a membrane-bound nucleus; eukaryotic cells have one.",
          "Mitochondria are called the 'powerhouse of the cell' — site of ATP production.",
          "The cell membrane is selectively permeable (fluid mosaic model by Singer & Nicolson).",
          "Ribosomes are sites of protein synthesis — 70S in prokaryotes, 80S in eukaryotes.",
        ].map((point, i) => (
          <div key={i} style={{ ...S.flex(12), padding: "10px 0", borderBottom: i < 4 ? "1px dashed #E5F7EF" : "none" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981", flexShrink: 0 }} />
            <span style={{ fontSize: "14px", color: "#374151", lineHeight: "1.5" }}>{point}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionsTab() {
  const [filter, setFilter] = useState("All");
  const [showAnswer, setShowAnswer] = useState({});

  const filtered = filter === "All" ? MOCK_QUESTIONS : MOCK_QUESTIONS.filter(q => q.type === filter);

  return (
    <div>
      <div style={S.flexBetween}>
        <h2 style={S.sectionTitle}>Question Bank</h2>
        <div style={S.flex(8)}>
          {["All", "PU", "KCET", "NEET"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ ...S.btn, padding: "8px 16px", fontSize: "13px", background: filter === f ? "#0A5C36" : "#fff", color: filter === f ? "#fff" : "#374151", border: "1.5px solid", borderColor: filter === f ? "#0A5C36" : "#E5F7EF" }}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "16px" }}>
        {filtered.map((q, qi) => (
          <div key={q.id} style={S.card}>
            <div style={{ ...S.flexBetween, marginBottom: "12px" }}>
              <div style={S.flex(8)}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#6B7280" }}>Q{qi + 1}.</span>
                <span style={S.tag(q.type)}>{q.type}</span>
                <span style={S.tag(q.difficulty)}>{q.difficulty}</span>
              </div>
            </div>
            <p style={{ fontSize: "15px", color: "#0D1F17", fontWeight: "500", marginBottom: "14px", lineHeight: "1.5" }}>{q.text}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" }}>
              {q.options.map((opt, oi) => {
                const revealed = showAnswer[q.id];
                const isCorrect = oi === q.correct;
                const bg = revealed ? (isCorrect ? "#ECFDF5" : "#F9FAFB") : "#F9FAFB";
                const border = revealed ? (isCorrect ? "#10B981" : "#E5E7EB") : "#E5E7EB";
                return (
                  <div key={oi} style={{ padding: "10px 14px", borderRadius: "10px", border: `1.5px solid ${border}`, background: bg, fontSize: "14px", color: "#374151", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: "700", color: "#9CA3AF" }}>{String.fromCharCode(65 + oi)}.</span>
                    <span>{opt}</span>
                    {revealed && isCorrect && <span style={{ marginLeft: "auto", color: "#10B981" }}>✓</span>}
                  </div>
                );
              })}
            </div>
            {showAnswer[q.id] && (
              <div style={{ background: "#ECFDF5", borderRadius: "10px", padding: "12px 14px", marginBottom: "12px", fontSize: "14px", color: "#065F46" }}>
                💡 <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
            <button onClick={() => setShowAnswer(s => ({ ...s, [q.id]: !s[q.id] }))}
              style={{ ...S.btn, ...S.btnOutline, padding: "8px 16px", fontSize: "13px" }}>
              {showAnswer[q.id] ? "Hide Answer" : "Show Answer"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniTestTab() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => setTimeLeft(tl => tl > 0 ? tl - 1 : 0), 1000);
    return () => clearInterval(t);
  }, [submitted]);

  const score = submitted ? MOCK_QUESTIONS.filter(q => answers[q.id] === q.correct).length : 0;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div>
      <div style={{ ...S.flexBetween, marginBottom: "20px" }}>
        <h2 style={S.sectionTitle}>Mini Test (5 Questions)</h2>
        {!submitted && (
          <div style={{ ...S.badge(timeLeft < 60 ? "#DC2626" : "#374151", timeLeft < 60 ? "#FEF2F2" : "#F3F4F6"), fontSize: "14px", fontWeight: "700" }}>
            ⏱ {mins}:{secs.toString().padStart(2, "0")}
          </div>
        )}
      </div>

      {submitted ? (
        <div style={{ ...S.card, textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "60px", marginBottom: "16px" }}>{score >= 4 ? "🏆" : score >= 3 ? "😊" : "📚"}</div>
          <div style={{ fontSize: "48px", fontWeight: "900", color: score >= 4 ? "#10B981" : score >= 3 ? "#F59E0B" : "#EF4444" }}>{score}/5</div>
          <div style={{ fontSize: "18px", color: "#374151", marginTop: "8px" }}>{score >= 4 ? "Excellent!" : score >= 3 ? "Good job!" : "Keep practicing!"}</div>
          <div style={{ ...S.flex(24), justifyContent: "center", marginTop: "24px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#0D1F17" }}>{Math.round(score / 5 * 100)}%</div>
              <div style={{ fontSize: "12px", color: "#6B7280" }}>Accuracy</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#0D1F17" }}>{score}</div>
              <div style={{ fontSize: "12px", color: "#6B7280" }}>Correct</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#0D1F17" }}>{5 - score}</div>
              <div style={{ fontSize: "12px", color: "#6B7280" }}>Wrong</div>
            </div>
          </div>
          <button onClick={() => { setAnswers({}); setSubmitted(false); setTimeLeft(300); }} style={{ ...S.btn, ...S.btnPrimary, marginTop: "24px", padding: "12px 32px" }}>
            Retry Test
          </button>
        </div>
      ) : (
        <>
          {MOCK_QUESTIONS.map((q, qi) => (
            <div key={q.id} style={{ ...S.card, marginBottom: "16px" }}>
              <p style={{ fontSize: "15px", fontWeight: "600", color: "#0D1F17", marginBottom: "14px" }}>
                <span style={{ color: "#6B7280", marginRight: "6px" }}>Q{qi + 1}.</span>{q.text}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {q.options.map((opt, oi) => (
                  <div key={oi} onClick={() => setAnswers(a => ({ ...a, [q.id]: oi }))}
                    style={{ padding: "10px 14px", borderRadius: "10px", border: `2px solid ${answers[q.id] === oi ? "#0A5C36" : "#E5E7EB"}`, background: answers[q.id] === oi ? "#ECFDF5" : "#F9FAFB", cursor: "pointer", fontSize: "14px", color: "#374151", display: "flex", gap: "8px", alignItems: "center", transition: "all 0.15s" }}>
                    <span style={{ fontWeight: "700", color: answers[q.id] === oi ? "#0A5C36" : "#9CA3AF" }}>{String.fromCharCode(65 + oi)}.</span>
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < MOCK_QUESTIONS.length}
            style={{ ...S.btn, ...S.btnPrimary, padding: "14px 32px", fontSize: "15px", opacity: Object.keys(answers).length < MOCK_QUESTIONS.length ? 0.5 : 1 }}>
            Submit Test ({Object.keys(answers).length}/{MOCK_QUESTIONS.length} answered)
          </button>
        </>
      )}
    </div>
  );
}

// ─── NOTES VIEW ──────────────────────────────────────────────────────────────

function NotesView() {
  return (
    <div style={S.page}>
      <h1 style={{ ...S.heading1, marginBottom: "4px" }}>Notes Library</h1>
      <p style={{ ...S.subtitle, marginBottom: "28px" }}>All study materials in one place</p>
      <div style={S.grid3}>
        {[
          { title: "Cell Biology", subject: "1st PU Unit III", type: "PDF", pages: 24, icon: "🔬" },
          { title: "Genetics & Inheritance", subject: "2nd PU Unit VII", type: "PDF", pages: 32, icon: "🧬" },
          { title: "Photosynthesis", subject: "1st PU Unit IV", type: "PDF", pages: 18, icon: "🌿" },
          { title: "Ecosystem", subject: "2nd PU Unit X", type: "PDF", pages: 22, icon: "🌍" },
          { title: "Human Physiology", subject: "1st PU Unit V", type: "PDF", pages: 40, icon: "🫀" },
          { title: "Biotechnology", subject: "2nd PU Unit IX", type: "PDF", pages: 28, icon: "⚗️" },
        ].map((n, i) => (
          <div key={i} style={{ ...S.card, cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
            <div style={{ fontSize: "36px", marginBottom: "14px" }}>{n.icon}</div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#0D1F17", marginBottom: "4px" }}>{n.title}</div>
            <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "12px" }}>{n.subject}</div>
            <div style={S.flex(8)}>
              <span style={{ ...S.badge("#DC2626", "#FEF2F2"), fontSize: "11px" }}>PDF</span>
              <span style={{ fontSize: "12px", color: "#9CA3AF" }}>{n.pages} pages</span>
            </div>
            <button style={{ ...S.btn, width: "100%", justifyContent: "center", marginTop: "16px", background: "#F0FDF4", color: "#0A5C36", fontWeight: "600", fontSize: "14px" }}>
              📥 Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── QUESTIONS VIEW ───────────────────────────────────────────────────────────

function QuestionsView() {
  return (
    <div style={S.page}>
      <h1 style={{ ...S.heading1, marginBottom: "4px" }}>Question Bank</h1>
      <p style={{ ...S.subtitle, marginBottom: "28px" }}>1000+ curated questions for KCET & NEET</p>
      <div style={S.grid3}>
        {[
          { title: "PU Board Questions", count: "300+", icon: "📚", color: "#0A5C36", bg: "#ECFDF5" },
          { title: "KCET Previous Years", count: "400+", icon: "🎯", color: "#7C3AED", bg: "#EDE9FE" },
          { title: "NEET Previous Years", count: "500+", icon: "🏆", color: "#DC2626", bg: "#FEF2F2" },
        ].map((c, i) => (
          <div key={i} style={{ background: c.bg, borderRadius: "16px", padding: "28px", border: `1.5px solid ${c.color}20`, cursor: "pointer" }}>
            <span style={{ fontSize: "40px", display: "block", marginBottom: "16px" }}>{c.icon}</span>
            <div style={{ fontSize: "22px", fontWeight: "800", color: c.color }}>{c.count}</div>
            <div style={{ fontSize: "15px", fontWeight: "600", color: "#0D1F17", marginTop: "4px" }}>{c.title}</div>
            <button style={{ ...S.btn, background: c.color, color: "#fff", fontSize: "14px", padding: "10px 20px", marginTop: "18px" }}>
              Practice Now
            </button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "32px" }}>
        <h2 style={S.sectionTitle}>Sample Questions</h2>
        <QuestionsTab />
      </div>
    </div>
  );
}

// ─── TESTS VIEW ───────────────────────────────────────────────────────────────

function TestsView() {
  return (
    <div style={S.page}>
      <h1 style={{ ...S.heading1, marginBottom: "4px" }}>Tests & Mock Exams</h1>
      <p style={{ ...S.subtitle, marginBottom: "28px" }}>Practice with exam-pattern tests</p>
      {[
        { label: "Chapter Tests", tests: [
          { title: "Cell Biology Test", questions: 15, time: "20 min", difficulty: "Medium" },
          { title: "Photosynthesis Test", questions: 10, time: "15 min", difficulty: "Easy" },
          { title: "Genetics Fundamentals", questions: 20, time: "25 min", difficulty: "Hard" },
        ]},
        { label: "Unit Tests", tests: [
          { title: "Unit I – Diversity", questions: 40, time: "50 min", difficulty: "Medium" },
          { title: "Unit III – Cell", questions: 35, time: "45 min", difficulty: "Medium" },
        ]},
        { label: "Full Mock Tests", tests: [
          { title: "KCET Full Mock 1", questions: 60, time: "80 min", difficulty: "Hard", premium: true },
          { title: "NEET Full Mock 1", questions: 90, time: "180 min", difficulty: "Hard", premium: true },
        ]},
      ].map((section, si) => (
        <div key={si} style={{ marginBottom: "32px" }}>
          <h2 style={S.sectionTitle}>{section.label}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {section.tests.map((t, ti) => (
              <div key={ti} style={{ ...S.card, ...S.flexBetween, padding: "18px 22px" }}>
                <div style={S.flex(14)}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🧪</div>
                  <div>
                    <div style={{ ...S.flex(8) }}>
                      <span style={{ fontSize: "15px", fontWeight: "600", color: "#0D1F17" }}>{t.title}</span>
                      {t.premium && <span style={{ ...S.badge("#D97706", "#FEF3C7"), fontSize: "11px" }}>👑 Premium</span>}
                    </div>
                    <div style={{ ...S.flex(16), marginTop: "4px" }}>
                      <span style={{ fontSize: "13px", color: "#9CA3AF" }}>❓ {t.questions} Qs</span>
                      <span style={{ fontSize: "13px", color: "#9CA3AF" }}>⏱ {t.time}</span>
                      <span style={S.tag(t.difficulty)}>{t.difficulty}</span>
                    </div>
                  </div>
                </div>
                <button style={{ ...S.btn, background: t.premium ? "#FEF3C7" : "linear-gradient(135deg, #0A5C36, #10B981)", color: t.premium ? "#D97706" : "#fff", padding: "10px 20px", fontSize: "14px" }}>
                  {t.premium ? "🔒 Unlock" : "Start Test"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── PROGRESS VIEW ────────────────────────────────────────────────────────────

function ProgressView() {
  const chapterProgress = [
    { name: "The Living World", progress: 100, color: "#10B981" },
    { name: "Biological Classification", progress: 72, color: "#10B981" },
    { name: "Plant Kingdom", progress: 45, color: "#F59E0B" },
    { name: "Animal Kingdom", progress: 30, color: "#F59E0B" },
    { name: "Cell: The Unit of Life", progress: 60, color: "#10B981" },
    { name: "Biomolecules", progress: 20, color: "#EF4444" },
    { name: "Photosynthesis", progress: 15, color: "#EF4444" },
    { name: "Human Reproduction", progress: 8, color: "#EF4444" },
  ];

  return (
    <div style={S.page}>
      <h1 style={{ ...S.heading1, marginBottom: "4px" }}>Learning Progress</h1>
      <p style={{ ...S.subtitle, marginBottom: "28px" }}>Track your journey to KCET & NEET success</p>

      <div style={{ ...S.grid4, marginBottom: "28px" }}>
        {[
          { label: "Videos Watched", value: 23, total: 80, icon: "🎥", color: "#7C3AED" },
          { label: "Notes Read", value: 12, total: 40, icon: "📖", color: "#0EA5E9" },
          { label: "Tests Taken", value: 8, total: 50, icon: "🧪", color: "#10B981" },
          { label: "Questions Solved", value: 342, total: 1000, icon: "❓", color: "#F59E0B" },
        ].map((s, i) => (
          <div key={i} style={S.card}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{s.icon}</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "10px" }}>/ {s.total} {s.label}</div>
            <div style={S.progressBar(Math.round(s.value / s.total * 100), s.color)}>
              <div style={S.progressFill(Math.round(s.value / s.total * 100), s.color)} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...S.card, marginBottom: "24px" }}>
        <h2 style={{ ...S.sectionTitle }}>Chapter-wise Progress</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {chapterProgress.map((c, i) => (
            <div key={i}>
              <div style={{ ...S.flexBetween, marginBottom: "6px" }}>
                <span style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>{c.name}</span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: c.color }}>{c.progress}%</span>
              </div>
              <div style={S.progressBar(c.progress, c.color)}>
                <div style={S.progressFill(c.progress, c.color)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.card}>
        <h2 style={S.sectionTitle}>Study Streak Calendar</h2>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {[...Array(28)].map((_, i) => {
            const active = [0,1,2,3,5,6,7,8,9,11,12,14,15,16,17,18,20,21,22,23,24,25,26,27].includes(i);
            return (
              <div key={i} style={{ width: "32px", height: "32px", borderRadius: "6px", background: active ? "linear-gradient(135deg, #0A5C36, #10B981)" : "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: active ? "#fff" : "#9CA3AF", fontWeight: active ? "600" : "400" }}>
                {i + 1}
              </div>
            );
          })}
        </div>
        <div style={{ ...S.flex(16), marginTop: "16px" }}>
          <div style={S.flex(6)}>
            <div style={{ width: "14px", height: "14px", borderRadius: "3px", background: "linear-gradient(135deg, #0A5C36, #10B981)" }} />
            <span style={{ fontSize: "12px", color: "#6B7280" }}>Study day</span>
          </div>
          <div style={S.flex(6)}>
            <div style={{ width: "14px", height: "14px", borderRadius: "3px", background: "#F3F4F6" }} />
            <span style={{ fontSize: "12px", color: "#6B7280" }}>No study</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE VIEW ─────────────────────────────────────────────────────────────

function ProfileView({ user }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: "9876543210", class: user.class || "1st PU" });

  return (
    <div style={S.page}>
      <h1 style={{ ...S.heading1, marginBottom: "28px" }}>My Profile</h1>
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "24px" }}>
        <div>
          <div style={{ ...S.card, textAlign: "center", padding: "32px 24px" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #0A5C36, #10B981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", fontWeight: "800", color: "#fff", margin: "0 auto 16px" }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#0D1F17" }}>{user.name}</div>
            <div style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px" }}>{form.class} Student</div>
            <div style={{ marginTop: "16px", ...S.badge("#D97706", "#FEF3C7"), display: "inline-block" }}>
              Free Plan
            </div>
            <button style={{ ...S.btn, background: "linear-gradient(135deg, #0A5C36, #10B981)", color: "#fff", width: "100%", justifyContent: "center", marginTop: "20px", fontSize: "14px" }}>
              👑 Upgrade to Premium
            </button>
          </div>
          <div style={{ ...S.card, marginTop: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#0D1F17", marginBottom: "12px" }}>🏆 Achievements</div>
            {["🔥 12-Day Streak", "🎯 First Test Completed", "📖 5 Chapters Studied"].map((a, i) => (
              <div key={i} style={{ fontSize: "13px", color: "#374151", padding: "8px 0", borderBottom: i < 2 ? "1px solid #F3F4F6" : "none" }}>{a}</div>
            ))}
          </div>
        </div>

        <div style={S.card}>
          <div style={{ ...S.flexBetween, marginBottom: "24px" }}>
            <h2 style={S.heading3}>Personal Information</h2>
            <button onClick={() => setEditing(!editing)} style={{ ...S.btn, ...S.btnOutline, padding: "8px 16px", fontSize: "13px" }}>
              {editing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>
          {[
            { label: "Full Name", key: "name", type: "text" },
            { label: "Email Address", key: "email", type: "email" },
            { label: "Phone Number", key: "phone", type: "tel" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: "20px" }}>
              <label style={S.label}>{f.label}</label>
              {editing ? (
                <input style={S.input} type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              ) : (
                <div style={{ padding: "12px 16px", background: "#F9FAFB", borderRadius: "10px", fontSize: "15px", color: "#374151" }}>{form[f.key]}</div>
              )}
            </div>
          ))}
          <div style={{ marginBottom: "20px" }}>
            <label style={S.label}>Class</label>
            {editing ? (
              <select style={{ ...S.input }} value={form.class} onChange={e => setForm(p => ({ ...p, class: e.target.value }))}>
                <option>1st PU</option>
                <option>2nd PU</option>
              </select>
            ) : (
              <div style={{ padding: "12px 16px", background: "#F9FAFB", borderRadius: "10px", fontSize: "15px", color: "#374151" }}>{form.class}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ─────────────────────────────────────────────────────────────

function AdminPanel({ onBack }) {
  const [tab, setTab] = useState("overview");
  const adminTabs = ["overview", "chapters", "videos", "questions", "students"];

  return (
    <div style={{ ...S.page, maxWidth: "100%" }}>
      <div style={{ ...S.flexBetween, marginBottom: "24px" }}>
        <div>
          <h1 style={S.heading1}>Admin Panel</h1>
          <p style={S.subtitle}>Manage BioVerse content and users</p>
        </div>
        <button onClick={onBack} style={{ ...S.btn, ...S.btnOutline, padding: "10px 20px", fontSize: "14px" }}>
          ← Exit Admin
        </button>
      </div>
      <div style={{ ...S.flex(8), marginBottom: "24px" }}>
        {adminTabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ ...S.btn, padding: "10px 18px", fontSize: "13px", background: tab === t ? "#0A5C36" : "#fff", color: tab === t ? "#fff" : "#374151", border: "1.5px solid", borderColor: tab === t ? "#0A5C36" : "#E5E7EB", textTransform: "capitalize" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          <div style={S.grid4}>
            {[
              { label: "Total Students", value: "1,247", icon: "👥", color: "#0A5C36" },
              { label: "Chapters", value: "32", icon: "📚", color: "#7C3AED" },
              { label: "Videos", value: "256", icon: "🎥", color: "#0EA5E9" },
              { label: "Questions", value: "1,089", icon: "❓", color: "#F59E0B" },
            ].map((s, i) => (
              <div key={i} style={{ ...S.card, textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>{s.icon}</div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: s.color }}>{s.value}</div>
                <div style={{ fontSize: "13px", color: "#6B7280" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "videos" && (
        <div>
          <div style={{ ...S.flexBetween, marginBottom: "16px" }}>
            <h2 style={S.heading3}>Manage Videos</h2>
            <button style={{ ...S.btn, ...S.btnPrimary, padding: "10px 20px", fontSize: "14px" }}>+ Add Video</button>
          </div>
          <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr 120px", gap: "0", borderBottom: "1px solid #E5F7EF", padding: "14px 20px", background: "#F8FFFE" }}>
              {["Chapter", "Title", "Duration", "Type", "Actions"].map(h => (
                <div key={h} style={{ fontSize: "12px", fontWeight: "700", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</div>
              ))}
            </div>
            {MOCK_VIDEOS.map((v, i) => (
              <div key={v.id} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr 120px", gap: "0", padding: "14px 20px", borderBottom: i < MOCK_VIDEOS.length - 1 ? "1px solid #F3F4F6" : "none", alignItems: "center" }}>
                <div style={{ fontSize: "13px", color: "#6B7280" }}>Cell Biology</div>
                <div style={{ fontSize: "14px", fontWeight: "500", color: "#0D1F17" }}>{v.title}</div>
                <div style={{ fontSize: "13px", color: "#6B7280" }}>{v.duration}</div>
                <span style={{ ...S.badge("#10B981", "#ECFDF5"), fontSize: "11px" }}>YouTube</span>
                <div style={S.flex(8)}>
                  <button style={{ ...S.btn, background: "#EEF2FF", color: "#6366F1", padding: "6px 12px", fontSize: "12px" }}>Edit</button>
                  <button style={{ ...S.btn, background: "#FEF2F2", color: "#DC2626", padding: "6px 12px", fontSize: "12px" }}>Del</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ ...S.card, marginTop: "20px" }}>
            <h3 style={{ ...S.heading3, marginBottom: "16px" }}>Add YouTube Video</h3>
            <label style={S.label}>Chapter</label>
            <select style={{ ...S.input }}>
              <option>Cell: The Unit of Life</option>
              <option>Biomolecules</option>
              <option>Photosynthesis in Higher Plants</option>
            </select>
            <label style={S.label}>Video Title</label>
            <input style={S.input} placeholder="Enter video title..." />
            <label style={S.label}>YouTube URL</label>
            <input style={S.input} placeholder="https://www.youtube.com/watch?v=..." />
            <button style={{ ...S.btn, ...S.btnPrimary, padding: "12px 24px" }}>Save Video</button>
          </div>
        </div>
      )}

      {tab === "questions" && (
        <div>
          <div style={{ ...S.flexBetween, marginBottom: "16px" }}>
            <h2 style={S.heading3}>Question Bank Management</h2>
            <button style={{ ...S.btn, ...S.btnPrimary, padding: "10px 20px", fontSize: "14px" }}>+ Add Question</button>
          </div>
          <div style={{ ...S.card }}>
            <h3 style={{ ...S.heading3, marginBottom: "16px" }}>Add MCQ Question</h3>
            <label style={S.label}>Chapter</label>
            <select style={S.input}><option>Cell: The Unit of Life</option></select>
            <label style={S.label}>Question Type</label>
            <select style={S.input}><option>KCET</option><option>NEET</option><option>PU</option></select>
            <label style={S.label}>Difficulty</label>
            <select style={S.input}><option>Easy</option><option>Medium</option><option>Hard</option></select>
            <label style={S.label}>Question Text</label>
            <textarea style={{ ...S.input, minHeight: "80px", resize: "vertical" }} placeholder="Enter the question..." />
            {["A", "B", "C", "D"].map(opt => (
              <div key={opt}>
                <label style={S.label}>Option {opt}</label>
                <input style={S.input} placeholder={`Option ${opt}...`} />
              </div>
            ))}
            <label style={S.label}>Correct Answer</label>
            <select style={S.input}><option>A</option><option>B</option><option>C</option><option>D</option></select>
            <label style={S.label}>Explanation</label>
            <textarea style={{ ...S.input, minHeight: "60px" }} placeholder="Explain the correct answer..." />
            <button style={{ ...S.btn, ...S.btnPrimary, padding: "12px 24px" }}>Save Question</button>
          </div>
        </div>
      )}

      {tab === "students" && (
        <div>
          <h2 style={{ ...S.heading3, marginBottom: "16px" }}>Student Management</h2>
          <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
            {[
              { name: "Priya Sharma", email: "priya@email.com", class: "2nd PU", plan: "Premium", progress: 67 },
              { name: "Rahul Kumar", email: "rahul@email.com", class: "1st PU", plan: "Free", progress: 23 },
              { name: "Ananya Reddy", email: "ananya@email.com", class: "2nd PU", plan: "Premium", progress: 89 },
              { name: "Suresh Patil", email: "suresh@email.com", class: "1st PU", plan: "Free", progress: 12 },
            ].map((s, i) => (
              <div key={i} style={{ ...S.flexBetween, padding: "16px 20px", borderBottom: "1px solid #F3F4F6" }}>
                <div style={S.flex(12)}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #0A5C36, #10B981)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700" }}>
                    {s.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#0D1F17" }}>{s.name}</div>
                    <div style={{ fontSize: "12px", color: "#9CA3AF" }}>{s.email}</div>
                  </div>
                </div>
                <div style={{ fontSize: "13px", color: "#6B7280" }}>{s.class}</div>
                <span style={{ ...S.badge(s.plan === "Premium" ? "#D97706" : "#6B7280", s.plan === "Premium" ? "#FEF3C7" : "#F3F4F6"), fontSize: "11px" }}>
                  {s.plan === "Premium" ? "👑 " : ""}{s.plan}
                </span>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#0A5C36" }}>{s.progress}%</div>
                  <div style={{ fontSize: "11px", color: "#9CA3AF" }}>progress</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "chapters" && (
        <div>
          <div style={{ ...S.flexBetween, marginBottom: "16px" }}>
            <h2 style={S.heading3}>Chapter Management</h2>
            <button style={{ ...S.btn, ...S.btnPrimary, padding: "10px 20px", fontSize: "14px" }}>+ Add Chapter</button>
          </div>
          {Object.entries(SYLLABUS).map(([level, data]) => (
            <div key={level} style={{ marginBottom: "24px" }}>
              <h3 style={{ ...S.heading3, color: data.color, marginBottom: "12px" }}>{data.icon} {level} Biology</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {data.units.flatMap(u => u.chapters).map((c, i) => (
                  <div key={c.id} style={{ ...S.card, ...S.flexBetween, padding: "14px 18px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "500", color: "#0D1F17" }}>{c.title}</span>
                    <div style={S.flex(8)}>
                      <span style={{ fontSize: "12px", color: "#9CA3AF" }}>🎥 {c.videos} | 📝 {c.notes}</span>
                      <button style={{ ...S.btn, background: "#EEF2FF", color: "#6366F1", padding: "6px 12px", fontSize: "12px" }}>Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("landing"); // landing, auth, dashboard
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [syllabusLevel, setSyllabusLevel] = useState("1st PU");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const handleAuth = (mode) => { setAuthMode(mode); setScreen("auth"); };
  const handleLogin = (userData) => { setUser(userData); setScreen("dashboard"); };
  const handleNav = (key) => {
    if (key === "logout") { setUser(null); setScreen("landing"); setActivePage("dashboard"); return; }
    if (key === "1stPU") { setSyllabusLevel("1st PU"); setSelectedChapter(null); setActivePage("syllabus"); return; }
    if (key === "2ndPU") { setSyllabusLevel("2nd PU"); setSelectedChapter(null); setActivePage("syllabus"); return; }
    setSelectedChapter(null);
    setActivePage(key);
  };
  const handleChapter = (chapter, level) => { setSelectedChapter(chapter); setSyllabusLevel(level); };

  if (screen === "landing") return <Landing onAuth={handleAuth} />;
  if (screen === "auth") return (
    <Auth mode={authMode} onSuccess={handleLogin} onToggle={() => setAuthMode(m => m === "login" ? "signup" : "login")} />
  );

  const mainPadding = isMobile ? "0" : "0 0 0 260px";

  return (
    <div style={{ ...S.app, display: "flex" }}>
      <Sidebar active={activePage === "syllabus" ? (syllabusLevel === "1st PU" ? "1stPU" : "2ndPU") : activePage} onNav={handleNav} user={user || {}} isMobile={isMobile} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ flex: 1, paddingLeft: isMobile ? 0 : "260px", minHeight: "100vh" }}>
        {/* Topbar */}
        <div style={{ ...S.topbar, paddingLeft: isMobile ? "16px" : "32px", paddingRight: "32px" }}>
          <div style={S.flex(12)}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)} style={{ ...S.btn, ...S.btnGhost, padding: "6px", marginRight: "4px" }}>
                <Icon name="menu" size={22} color="#374151" />
              </button>
            )}
            <div>
              <div style={{ fontSize: "15px", fontWeight: "600", color: "#0D1F17" }}>
                {activePage === "dashboard" ? "Dashboard" : activePage === "syllabus" ? `${syllabusLevel} Biology` : activePage.charAt(0).toUpperCase() + activePage.slice(1)}
              </div>
              <div style={{ fontSize: "12px", color: "#9CA3AF" }}>Karnataka PU Biology</div>
            </div>
          </div>
          <div style={S.flex(12)}>
            <div style={{ ...S.badge("#D97706", "#FEF3C7"), fontSize: "12px", cursor: "pointer" }} onClick={() => setActivePage("admin")}>
              ⚙️ Admin
            </div>
            <div style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}>🔥 12 days</div>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #0A5C36, #10B981)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", cursor: "pointer" }} onClick={() => setActivePage("profile")}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Pages */}
        {activePage === "admin" ? (
          <AdminPanel onBack={() => setActivePage("dashboard")} />
        ) : activePage === "dashboard" ? (
          <Dashboard user={user || {}} onNav={handleNav} />
        ) : activePage === "syllabus" ? (
          selectedChapter ? (
            <ChapterPage chapter={selectedChapter} level={syllabusLevel} onBack={() => setSelectedChapter(null)} />
          ) : (
            <SyllabusView level={syllabusLevel} onChapter={handleChapter} />
          )
        ) : activePage === "notes" ? (
          <NotesView />
        ) : activePage === "questions" ? (
          <QuestionsView />
        ) : activePage === "tests" ? (
          <TestsView />
        ) : activePage === "progress" ? (
          <ProgressView />
        ) : activePage === "profile" ? (
          <ProfileView user={user || {}} />
        ) : null}
      </div>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        input:focus, select:focus, textarea:focus { border-color: #10B981 !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
        button:hover { filter: brightness(0.95); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F0FDF4; }
        ::-webkit-scrollbar-thumb { background: #A7F3D0; border-radius: 99px; }
      `}</style>
    </div>
  );
}
