import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const PAGE_CSS = `
  :root{
    --paper:#FAF8F4;
    --paper-2:#F1ECE3;
    --ink:#2B2E33;
    --ink-soft:#6E7278;
    --teal:#6B968C;
    --teal-deep:#48685F;
    --teal-pale:#E7F0EC;
    --amber:#C9A468;
    --amber-pale:#F5ECD9;
    --coral:#C08A7B;
    --coral-pale:#F3E4DE;
    --line:#E6E0D3;
    --radius:16px;
    --shadow: 0 10px 30px rgba(43,46,51,0.06);
  }

  *{box-sizing:border-box;}
  html{scroll-behavior:smooth;}

  body{
    margin:0;
    background:var(--paper);
    color:var(--ink);
    font-family:'Inter',sans-serif;
    -webkit-font-smoothing:antialiased;
  }

  h1,h2,h3,.display{
    font-family:'Fraunces',serif;
    font-weight:600;
    letter-spacing:-0.01em;
    margin:0;
  }

  .mono{
    font-family:'IBM Plex Mono',monospace;
    letter-spacing:0.06em;
    text-transform:uppercase;
  }

  .csd-app{
    min-height:100vh;
    display:flex;
    flex-direction:column;
    background:var(--paper);
  }

  /* HEADER */

  .csd-header{
    position:sticky;
    top:0;
    z-index:50;
    background:rgba(24,26,29,0.9);
    backdrop-filter:blur(14px);
    border-bottom:1px solid rgba(255,255,255,0.08);
  }

  .csd-header-inner{
    max-width:1280px;
    margin:0 auto;
    padding:14px 28px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:16px;
  }

  .csd-brand{
    display:flex;
    align-items:center;
    gap:12px;
  }

  .csd-brand-mark{
    width:36px;
    height:36px;
    border-radius:10px;
    background:linear-gradient(145deg,var(--teal),var(--teal-deep));
    display:flex;
    align-items:center;
    justify-content:center;
    flex-shrink:0;
  }

  .csd-brand-mark svg{
    width:19px;
    height:19px;
    stroke:#fff;
  }

  .csd-brand-name{
    font-family:'Fraunces',serif;
    font-weight:600;
    font-size:17.5px;
    color:#fff;
  }

  .csd-brand-name span{
    color:var(--teal);
  }

  .csd-brand-sub{
    font-size:10px;
    color:rgba(255,255,255,0.55);
  }

  .csd-header-right{
    display:flex;
    align-items:center;
    gap:8px;
    flex-wrap:wrap;
    justify-content:flex-end;
  }

  .csd-privacy-badge{
    display:flex;
    align-items:center;
    gap:7px;
    font-size:11.5px;
    color:#DCEAE6;
    background:rgba(255,255,255,0.07);
    border:1px solid rgba(255,255,255,0.14);
    padding:7px 13px;
    border-radius:999px;
  }

  .csd-privacy-badge svg{
    width:13px;
    height:13px;
    stroke:#AECDC4;
  }

  .csd-exit{
    font-size:13px;
    font-weight:600;
    color:rgba(255,255,255,0.75);
    border:1.5px solid rgba(255,255,255,0.28);
    padding:8px 14px;
    border-radius:999px;
    background:transparent;
    cursor:pointer;
    transition:all .25s ease;
    display:flex;
    align-items:center;
    gap:6px;
  }

  .csd-exit:hover{
    border-color:#fff;
    color:#fff;
    background:rgba(255,255,255,0.1);
  }

  .csd-exit svg{
    width:14px;
    height:14px;
  }

  /* SHELL */

  .csd-shell{
    flex:1;
    max-width:1280px;
    margin:0 auto;
    width:100%;
    padding:26px 28px 0;
    display:grid;
    grid-template-columns:300px 1fr;
    gap:22px;
    align-items:start;
  }

  /* SIDEBAR */

  .csd-sidebar{
    display:flex;
    flex-direction:column;
    gap:16px;
    position:sticky;
    top:88px;
  }

  .csd-card{
    background:#fff;
    border:1px solid var(--line);
    border-radius:18px;
    padding:20px;
    box-shadow:var(--shadow);
  }

  .csd-card-title{
    font-size:11px;
    color:var(--ink-soft);
    margin-bottom:14px;
    display:flex;
    align-items:center;
    justify-content:space-between;
  }

  .csd-live{
    display:flex;
    align-items:center;
    gap:6px;
    font-size:10.5px;
    color:var(--teal-deep);
  }

  .csd-live .d{
    width:6px;
    height:6px;
    border-radius:50%;
    background:var(--teal);
  }

  .csd-gauge-wrap{
    position:relative;
    display:flex;
    justify-content:center;
    padding:6px 0 0;
  }

  .csd-gauge-value{
    position:absolute;
    top:64%;
    left:50%;
    transform:translate(-50%,-50%);
    text-align:center;
  }

  .csd-gauge-value .num{
    font-family:'Fraunces',serif;
    font-size:30px;
    font-weight:600;
    color:var(--ink);
    line-height:1;
  }

  .csd-gauge-value .lbl{
    font-size:10px;
    color:var(--ink-soft);
    margin-top:2px;
  }

  .csd-risk-row{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:6px;
    margin-top:14px;
  }

  .csd-risk-chip{
    text-align:center;
    padding:7px 2px;
    border-radius:9px;
    font-size:9.5px;
    font-weight:700;
    border:1.5px solid var(--line);
    color:var(--ink-soft);
  }

  .csd-risk-chip[data-r="low"].active{
    background:#EAF1EA;
    border-color:#9DBBA8;
    color:#4A6B4E;
  }

  .csd-risk-chip[data-r="mod"].active{
    background:var(--amber-pale);
    border-color:#D3B579;
    color:#8C6E36;
  }

  .csd-risk-chip[data-r="high"].active{
    background:#F6E7D4;
    border-color:#CB9868;
    color:#8F6234;
  }

  .csd-risk-chip[data-r="crit"].active{
    background:var(--coral-pale);
    border-color:#C0897A;
    color:#8A4A3B;
  }

  .csd-lang-row{
    display:flex;
    flex-wrap:wrap;
    gap:7px;
  }

  .csd-lang-chip{
    font-size:11.5px;
    padding:6px 12px;
    border-radius:999px;
    border:1.5px solid var(--line);
    color:var(--ink-soft);
    cursor:pointer;
    background:#fff;
  }

  .csd-lang-chip.active{
    background:var(--teal);
    border-color:var(--teal);
    color:#fff;
  }

  .csd-quick-list{
    display:flex;
    flex-direction:column;
    gap:8px;
  }

  .csd-quick-btn{
    display:flex;
    align-items:center;
    gap:10px;
    text-align:left;
    font-size:12.5px;
    color:var(--ink);
    background:var(--paper-2);
    border:1px solid var(--line);
    border-radius:12px;
    padding:10px 12px;
    cursor:pointer;
  }

  .csd-quick-btn svg{
    width:15px;
    height:15px;
    stroke:var(--teal-deep);
  }

  .csd-helpline-card{
    background:var(--ink);
    color:#fff;
    border:none;
  }

  .csd-helpline-card .csd-card-title{
    color:#B9C6C6;
  }

  .csd-helpline-num{
    font-family:'IBM Plex Mono',monospace;
    font-size:26px;
    font-weight:600;
    margin:2px 0 10px;
  }

  .csd-helpline-call{
    width:100%;
    background:#fff;
    color:var(--ink);
    font-weight:700;
    font-size:13px;
    padding:11px;
    border-radius:999px;
    border:none;
    cursor:pointer;
  }

  .csd-reco-list{
    display:flex;
    flex-wrap:wrap;
    gap:7px;
  }

  .csd-reco-pill{
    font-size:10.5px;
    background:var(--teal-pale);
    color:var(--teal-deep);
    padding:5px 11px;
    border-radius:999px;
    font-weight:600;
  }

  .csd-reco-empty{
    font-size:11.5px;
    color:var(--ink-soft);
    line-height:1.6;
  }

  /* MAIN */

  .csd-main{
    display:flex;
    flex-direction:column;
    height:calc(100vh - 114px);
    background:#fff;
    border:1px solid var(--line);
    border-radius:20px;
    box-shadow:var(--shadow);
    overflow:hidden;
  }

  .csd-chat-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding:16px 22px;
    border-bottom:1px solid var(--line);
    background:var(--paper-2);
  }

  .csd-chat-head-left{
    display:flex;
    align-items:center;
    gap:12px;
  }

  .csd-bot-avatar{
    width:38px;
    height:38px;
    border-radius:11px;
    background:linear-gradient(145deg,var(--teal),var(--teal-deep));
    display:flex;
    align-items:center;
    justify-content:center;
  }

  .csd-bot-avatar svg{
    width:19px;
    height:19px;
    stroke:#fff;
  }

  .csd-chat-head h3{
    font-size:15.5px;
  }

  .csd-chat-head p{
    font-size:11.5px;
    color:var(--ink-soft);
    margin:2px 0 0;
  }

  .csd-consent-pill{
    font-size:10.5px;
    display:flex;
    align-items:center;
    gap:6px;
    color:var(--teal-deep);
    background:var(--teal-pale);
    padding:6px 12px;
    border-radius:999px;
  }

  .csd-consent-pill svg{
    width:12px;
    height:12px;
    stroke:var(--teal-deep);
  }

  .csd-chat-scroll{
    flex:1;
    overflow-y:auto;
    padding:24px;
    display:flex;
    flex-direction:column;
    gap:16px;
  }

  .csd-msg-row{
    display:flex;
    gap:10px;
    max-width:78%;
  }

  .csd-msg-row.bot{
    align-self:flex-start;
  }

  .csd-msg-row.user{
    align-self:flex-end;
    flex-direction:row-reverse;
  }

  .csd-msg-avatar{
    width:30px;
    height:30px;
    border-radius:9px;
    flex-shrink:0;
    display:flex;
    align-items:center;
    justify-content:center;
  }

  .csd-msg-row.bot .csd-msg-avatar{
    background:var(--teal-pale);
  }

  .csd-msg-row.user .csd-msg-avatar{
    background:var(--ink);
  }

  .csd-msg-bubble{
    border-radius:16px;
    padding:12px 15px;
    font-size:14px;
    line-height:1.6;
  }

  .csd-msg-row.bot .csd-msg-bubble{
    background:var(--paper-2);
    color:var(--ink);
    border-top-left-radius:4px;
  }

  .csd-msg-row.user .csd-msg-bubble{
    background:var(--teal);
    color:#fff;
    border-top-right-radius:4px;
  }

  .csd-msg-meta{
    display:flex;
    align-items:center;
    gap:8px;
    margin-top:5px;
  }

  .csd-msg-time{
    font-size:10px;
    color:var(--ink-soft);
  }

  .csd-speak-btn{
    background:none;
    border:none;
    cursor:pointer;
  }

  .csd-typing{
    display:flex;
    gap:4px;
    align-items:center;
    padding:12px 15px;
    background:var(--paper-2);
    border-radius:16px;
  }

  .csd-typing span{
    width:6px;
    height:6px;
    border-radius:50%;
    background:var(--ink-soft);
  }

  .csd-crisis-card{
    background:var(--coral-pale);
    border:1.5px solid #D9A594;
    border-radius:16px;
    padding:16px 18px;
  }

  .csd-quick-chips{
    display:flex;
    gap:8px;
    flex-wrap:wrap;
    padding:0 24px 14px;
  }

  .csd-chip-btn{
    font-size:12.5px;
    color:var(--teal-deep);
    background:var(--teal-pale);
    border:none;
    padding:8px 14px;
    border-radius:999px;
    cursor:pointer;
  }

  .csd-composer{
    border-top:1px solid var(--line);
    padding:14px 18px;
    display:flex;
    align-items:flex-end;
    gap:10px;
    background:#fff;
  }

  .csd-input-wrap{
    flex:1;
    display:flex;
    align-items:center;
    background:var(--paper-2);
    border:1.5px solid var(--line);
    border-radius:16px;
    padding:6px 8px 6px 16px;
  }

  .csd-input{
    flex:1;
    border:none;
    background:transparent;
    outline:none;
    font-family:'Inter',sans-serif;
    font-size:14px;
    color:var(--ink);
    padding:8px 0;
  }

  .csd-mic-btn{
    width:38px;
    height:38px;
    border-radius:12px;
    border:none;
    background:transparent;
    cursor:pointer;
  }

  .csd-send-btn{
    width:44px;
    height:44px;
    border-radius:13px;
    border:none;
    background:var(--teal);
    color:#fff;
    cursor:pointer;
  }

  .csd-consent-gate{
    align-self:center;
    max-width:520px;
    background:var(--paper-2);
    border:1px solid var(--line);
    border-radius:18px;
    padding:22px 24px;
    text-align:center;
  }

  .csd-consent-gate p{
    font-size:13px;
    color:var(--ink-soft);
    line-height:1.65;
  }

  .csd-consent-accept{
    background:var(--teal);
    color:#fff;
    font-weight:700;
    font-size:13px;
    padding:10px 22px;
    border-radius:999px;
    border:none;
    cursor:pointer;
  }

  @media (max-width:960px){
    .csd-shell{
      grid-template-columns:1fr;
      padding:18px 16px 0;
    }

    .csd-sidebar{
      position:static;
      flex-direction:row;
      flex-wrap:wrap;
    }

    .csd-sidebar .csd-card{
      flex:1 1 220px;
    }

    .csd-main{
      height:calc(100vh - 240px);
    }

    .csd-msg-row{
      max-width:92%;
    }
  }
`;

const LANGUAGES = [
  "English",
  "हिन्दी",
  "తెలుగు",
  "தமிழ்",
  "मराठी",
  "ಕನ್ನಡ",
];

const QUICK_ACTIONS = [
  { key: "counsellor", label: "Talk to a counsellor", icon: "chat" },
  { key: "legal", label: "Understand my legal options", icon: "scale" },
  { key: "unsafe", label: "I don't feel safe right now", icon: "shield" },
  { key: "unsure", label: "I'm not sure where to start", icon: "compass" },
];

const CRISIS_PATTERNS = [
  "suicide",
  "kill myself",
  "end my life",
  "end it all",
  "not want to live",
  "no reason to live",
  "hurt myself",
  "self harm",
  "want to die",
];

const DISTRESS_WORDS = [
  "afraid",
  "scared",
  "threat",
  "threatened",
  "unsafe",
  "alone",
  "isolated",
  "hopeless",
  "crying",
  "hurt",
  "pain",
  "beaten",
  "assault",
  "assaulted",
  "displaced",
  "can't sleep",
  "nightmares",
  "panic",
];

const RELIEF_WORDS = [
  "better",
  "safe now",
  "calmer",
  "thank you",
  "helped",
  "okay now",
];

function scoreLevel(score) {
  if (score >= 76) return "crit";
  if (score >= 55) return "high";
  if (score >= 30) return "mod";
  return "low";
}

const LEVEL_ANGLE = {
  low: -55,
  mod: -10,
  high: 35,
  crit: 68,
};

function assessMessage(text, prevScore) {
  const lower = text.toLowerCase();

  const isCrisis = CRISIS_PATTERNS.some((p) =>
    lower.includes(p)
  );

  if (isCrisis) {
    return {
      score: 96,
      crisis: true,
    };
  }

  let delta = 0;

  DISTRESS_WORDS.forEach((word) => {
    if (lower.includes(word)) delta += 9;
  });

  RELIEF_WORDS.forEach((word) => {
    if (lower.includes(word)) delta -= 12;
  });

  const next = Math.max(
    8,
    Math.min(
      94,
      prevScore + delta + (delta === 0 ? -2 : 0)
    )
  );

  return {
    score: Math.round(next),
    crisis: false,
  };
}

function botReplyFor(actionKeyOrText, level, isCrisis) {
  if (isCrisis) {
    return "I'm really glad you told me. What you're feeling matters, and you don't have to carry it alone. I'd like to connect you with someone right now — is that okay?";
  }

  const templates = {
    counsellor:
      "I can arrange a callback from a counsellor. Would you prefer a call today, or would you rather write to me a bit more first?",

    legal:
      "I can walk you through what usually happens next. Would you like that in simple steps?",

    unsafe:
      "Thank you for telling me that directly. Your safety comes first. Can you tell me whether you're safe at this exact moment?",

    unsure:
      "That's alright. We can go one small step at a time. Would it help if I asked a few gentle questions to understand your situation?",
  };

  if (templates[actionKeyOrText]) {
    return templates[actionKeyOrText];
  }

  if (level === "crit" || level === "high") {
    return "I hear how hard this has been for you. What you've shared sounds serious, and I want to make sure you get real support quickly.";
  }

  if (level === "mod") {
    return "Thank you for sharing that with me. Would you like to talk a bit more first?";
  }

  return "I'm here, and I'm listening. Take whatever time you need.";
}

function recommendationsFor(level) {
  if (level === "crit") {
    return [
      "Emergency support",
      "Police intervention",
      "Witness protection",
    ];
  }

  if (level === "high") {
    return [
      "Priority counselling",
      "Legal aid",
      "Medical assistance",
    ];
  }

  if (level === "mod") {
    return [
      "Counselling",
      "Legal information",
    ];
  }

  return [];
}

const Icon = {
  back: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  ),

  lock: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),

  heartHands: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" {...p}>
      <path d="M12 21c-4-2.5-7-6-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 4-3 7.5-7 10z" />
      <path d="M9 12h1.5l1-2 2 4 1-2H16" />
    </svg>
  ),

  send: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),

  mic: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
    </svg>
  ),

  phone: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7" />
    </svg>
  ),

  chat: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),

  scale: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M12 3v18M5 8h14" />
    </svg>
  ),

  shield: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
    </svg>
  ),

  compass: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="m16 8-2 6-6 2 2-6z" />
    </svg>
  ),

  warn: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    </svg>
  ),

  speaker: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    </svg>
  ),
};

const ICON_MAP = {
  chat: Icon.chat,
  scale: Icon.scale,
  shield: Icon.shield,
  compass: Icon.compass,
};

export default function Complaint() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  const [consentGiven, setConsentGiven] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [language, setLanguage] = useState("English");
  const [sviScore, setSviScore] = useState(18);
  const [riskLevel, setRiskLevel] = useState("low");
  const [recommendations, setRecommendations] = useState([]);
  const [crisisActive, setCrisisActive] = useState(false);

  useEffect(() => {
    const SR =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    setSpeechSupported(!!SR);
  }, []);

  useEffect(() => {
    if (consentGiven && messages.length === 0) {
      pushBotMessage(
        "I'm Sahaya. I'm here to listen, at whatever pace works for you."
      );
    }
  }, [consentGiven]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const timeNow = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const pushBotMessage = (text) => {
    setMessages((m) => [
      ...m,
      {
        id: `${Date.now()}-b`,
        sender: "bot",
        text,
        time: timeNow(),
      },
    ]);
  };

  const pushUserMessage = (text) => {
    setMessages((m) => [
      ...m,
      {
        id: `${Date.now()}-u`,
        sender: "user",
        text,
        time: timeNow(),
      },
    ]);
  };

  const applyAssessment = useCallback(
    (text) => {
      const { score, crisis } =
        assessMessage(text, sviScore);

      setSviScore(score);

      const level = crisis
        ? "crit"
        : scoreLevel(score);

      setRiskLevel(level);
      setRecommendations(
        recommendationsFor(level)
      );

      if (crisis) {
        setCrisisActive(true);
      }

      return { level, crisis };
    },
    [sviScore]
  );

  const sendMessage = useCallback(
    (rawText, actionKey) => {
      const text = (rawText || "").trim();

      if (!text) return;

      pushUserMessage(text);
      setInput("");

      const { level, crisis } =
        applyAssessment(text);

      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);

        pushBotMessage(
          botReplyFor(
            actionKey || text,
            level,
            crisis
          )
        );
      }, 1000);
    },
    [applyAssessment]
  );

  const handleQuickAction = (key, label) =>
    sendMessage(label, key);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const toggleListening = () => {
    const SR =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SR) return;

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SR();

    recognition.lang =
      language === "हिन्दी"
        ? "hi-IN"
        : language === "తెలుగు"
        ? "te-IN"
        : language === "தமிழ்"
        ? "ta-IN"
        : "en-IN";

    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      let transcript = "";

      for (
        let i = 0;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript;
      }

      setInput(transcript);
    };

    recognition.onerror = () =>
      setIsListening(false);

    recognition.onend = () => {
      setIsListening(false);

      setInput((current) => {
        if (current.trim()) {
          sendMessage(current);
        }

        return "";
      });
    };

    recognitionRef.current = recognition;

    setIsListening(true);
    recognition.start();
  };

  const speakMessage = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utter =
      new SpeechSynthesisUtterance(text);

    utter.rate = 0.98;

    window.speechSynthesis.speak(utter);
  };

  const callHelpline = () => {
    window.location.href = "tel:14566";
  };

  return (
    <>
      <style>{PAGE_CSS}</style>

      <div className="csd-app">

        <header className="csd-header">

          <div className="csd-header-inner">

            <div className="csd-brand">

              <div className="csd-brand-mark">
                <Icon.heartHands />
              </div>

              <div>
                <div className="csd-brand-name">
                  SAHAYA <span>AI</span>
                </div>

                <div className="csd-brand-sub mono">
                  Client Support · NHAA 14566
                </div>
              </div>

            </div>

            {/* ONLY NAVIGATION BUTTONS ADDED HERE */}

            <div className="csd-header-right">

              <div className="csd-privacy-badge">
                <Icon.lock />
                Confidential &amp; encrypted
              </div>

              <button
                className="csd-exit"
                onClick={() => navigate("/assessment")}
              >
                Assessment
              </button>

              <button
                className="csd-exit"
                onClick={() => navigate("/support")}
              >
                Support
              </button>

              <button
                className="csd-exit"
                onClick={() => navigate("/status")}
              >
                Status
              </button>

              <button
                className="csd-exit"
                onClick={() => navigate("/")}
              >
                <Icon.back />
                Back home
              </button>

            </div>

          </div>

        </header>

        <div className="csd-shell">

          <aside className="csd-sidebar">

            <div className="csd-card">

              <div className="csd-card-title mono">
                Stress Vulnerability Index

                <span className="csd-live">
                  <span className="d" />
                  LIVE
                </span>
              </div>

              <div className="csd-gauge-wrap">

                <svg
                  width="220"
                  height="132"
                  viewBox="0 0 220 132"
                >
                  <path
                    d="M22 110 A88 88 0 0 1 198 110"
                    fill="none"
                    stroke="#E9E3D6"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />

                  <g
                    style={{
                      transformOrigin: "110px 110px",
                      transform: `rotate(${LEVEL_ANGLE[riskLevel]}deg)`,
                    }}
                  >
                    <line
                      x1="110"
                      y1="110"
                      x2="110"
                      y2="34"
                      stroke="#2B2E33"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    <circle
                      cx="110"
                      cy="110"
                      r="6"
                      fill="#2B2E33"
                    />
                  </g>
                </svg>

                <div className="csd-gauge-value">
                  <div className="num">
                    {sviScore}
                  </div>

                  <div className="lbl">
                    SVI / 100
                  </div>
                </div>

              </div>

              <div className="csd-risk-row">

                <div
                  className={`csd-risk-chip${
                    riskLevel === "low"
                      ? " active"
                      : ""
                  }`}
                  data-r="low"
                >
                  LOW
                </div>

                <div
                  className={`csd-risk-chip${
                    riskLevel === "mod"
                      ? " active"
                      : ""
                  }`}
                  data-r="mod"
                >
                  MOD
                </div>

                <div
                  className={`csd-risk-chip${
                    riskLevel === "high"
                      ? " active"
                      : ""
                  }`}
                  data-r="high"
                >
                  HIGH
                </div>

                <div
                  className={`csd-risk-chip${
                    riskLevel === "crit"
                      ? " active"
                      : ""
                  }`}
                  data-r="crit"
                >
                  CRIT
                </div>

              </div>

            </div>

            <div className="csd-card">

              <div className="csd-card-title mono">
                Recommended support
              </div>

              {recommendations.length ? (

                <div className="csd-reco-list">

                  {recommendations.map((r) => (
                    <span
                      className="csd-reco-pill"
                      key={r}
                    >
                      {r}
                    </span>
                  ))}

                </div>

              ) : (

                <p className="csd-reco-empty">
                  Nothing to flag yet — this updates as we talk.
                </p>

              )}

            </div>

            <div className="csd-card">

              <div className="csd-card-title mono">
                Language
              </div>

              <div className="csd-lang-row">

                {LANGUAGES.map((l) => (

                  <button
                    key={l}
                    className={`csd-lang-chip${
                      language === l
                        ? " active"
                        : ""
                    }`}
                    onClick={() => setLanguage(l)}
                  >
                    {l}
                  </button>

                ))}

              </div>

            </div>

            <div className="csd-card">

              <div className="csd-card-title mono">
                Quick start
              </div>

              <div className="csd-quick-list">

                {QUICK_ACTIONS.map((a) => {

                  const ActionIcon =
                    ICON_MAP[a.icon];

                  return (

                    <button
                      key={a.key}
                      className="csd-quick-btn"
                      disabled={!consentGiven}
                      onClick={() =>
                        handleQuickAction(
                          a.key,
                          a.label
                        )
                      }
                    >
                      <ActionIcon />
                      {a.label}
                    </button>

                  );
                })}

              </div>

            </div>

            <div className="csd-card csd-helpline-card">

              <div className="csd-card-title mono">
                National helpline
              </div>

              <div className="csd-helpline-num">
                14566
              </div>

              <button
                className="csd-helpline-call"
                onClick={callHelpline}
              >
                <Icon.phone />
                Call now
              </button>

            </div>

          </aside>

          <main className="csd-main">

            <div className="csd-chat-head">

              <div className="csd-chat-head-left">

                <div className="csd-bot-avatar">
                  <Icon.heartHands />
                </div>

                <div>
                  <h3>Sahaya</h3>
                  <p>
                    Usually replies in a few seconds
                  </p>
                </div>

              </div>

              <div className="csd-consent-pill">
                <Icon.lock />
                Consent-based
              </div>

            </div>

            <div
              className="csd-chat-scroll"
              ref={scrollRef}
            >

              {!consentGiven && (

                <div className="csd-consent-gate">

                  <h4>
                    Before we begin
                  </h4>

                  <p>
                    Anything you type or say here is used only
                    to understand how you're doing right now,
                    so we can connect you with the right kind
                    of support.
                  </p>

                  <button
                    className="csd-consent-accept"
                    onClick={() =>
                      setConsentGiven(true)
                    }
                  >
                    I understand — continue
                  </button>

                </div>

              )}

              {messages.map((m) => (

                <div
                  className={`csd-msg-row ${m.sender}`}
                  key={m.id}
                >

                  <div className="csd-msg-avatar">
                    {m.sender === "bot"
                      ? <Icon.heartHands />
                      : "You"}
                  </div>

                  <div>

                    <div className="csd-msg-bubble">
                      {m.text}
                    </div>

                    <div className="csd-msg-meta">

                      <span className="csd-msg-time">
                        {m.time}
                      </span>

                      {m.sender === "bot" && (

                        <button
                          className="csd-speak-btn"
                          onClick={() =>
                            speakMessage(m.text)
                          }
                        >
                          <Icon.speaker />
                        </button>

                      )}

                    </div>

                  </div>

                </div>

              ))}

              {isTyping && (

                <div className="csd-msg-row bot">

                  <div className="csd-msg-avatar">
                    <Icon.heartHands />
                  </div>

                  <div className="csd-typing">
                    <span />
                    <span />
                    <span />
                  </div>

                </div>

              )}

              {crisisActive && (

                <div className="csd-crisis-card">

                  <h4>
                    You don't have to face this alone
                  </h4>

                  <p>
                    Immediate support is available right now.
                  </p>

                  <button
                    className="csd-helpline-call"
                    onClick={callHelpline}
                  >
                    Call 14566 now
                  </button>

                </div>

              )}

            </div>

            {consentGiven && (

              <div className="csd-quick-chips">

                {QUICK_ACTIONS.map((a) => (

                  <button
                    key={a.key}
                    className="csd-chip-btn"
                    onClick={() =>
                      handleQuickAction(
                        a.key,
                        a.label
                      )
                    }
                  >
                    {a.label}
                  </button>

                ))}

              </div>

            )}

            <form
              className="csd-composer"
              onSubmit={handleFormSubmit}
            >

              <div className="csd-input-wrap">

                <input
                  className="csd-input"
                  placeholder={
                    consentGiven
                      ? "Type here, or use the microphone…"
                      : "Please confirm consent above to begin"
                  }
                  value={input}
                  disabled={!consentGiven}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="csd-mic-btn"
                  disabled={
                    !consentGiven ||
                    !speechSupported
                  }
                  onClick={toggleListening}
                >
                  <Icon.mic />
                </button>

              </div>

              <button
                type="submit"
                className="csd-send-btn"
                disabled={
                  !consentGiven ||
                  !input.trim()
                }
              >
                <Icon.send />
              </button>

            </form>

          </main>

        </div>

      </div>
    </>
  );
}