import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/*
  SAHAYA AI — Client Dashboard
  ----------------------------
  A private, chat-first space for a victim/complainant to talk (by typing or
  speaking) with "Sahaya". Reuses the exact design tokens from Home.jsx so the
  product feels like one system, not two.

  IMPLEMENTATION NOTES FOR BACKEND INTEGRATION
  - Voice capture uses the browser's SpeechRecognition API purely for
    speech-to-text in this prototype. In production, raw audio should also be
    streamed to the Speech Analytics service (pitch/pace/pause detection),
    not just the transcript — see `// TODO(api)` markers below.
  - The SVI score / risk band / bot replies here are a local, keyword-based
    SIMULATION so the UI is demonstrable without a backend. Replace
    `assessMessage()` with a call to POST /api/assess (NLP + Emotion AI +
    Speech Analytics fusion) that returns { sviScore, riskLevel, reply,
    recommendations }.
  - Nothing here should be mistaken for a diagnosis. Copy is deliberately
    supportive and non-clinical; risk language is written for routing to a
    human, not for labelling the person.
*/

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
  body{margin:0;background:var(--paper);color:var(--ink);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;}
  h1,h2,h3,.display{font-family:'Fraunces',serif;font-weight:600;letter-spacing:-0.01em;margin:0;}
  .mono{font-family:'IBM Plex Mono',monospace;letter-spacing:0.06em;text-transform:uppercase;}
  a{color:inherit;text-decoration:none;}
  ::selection{background:var(--teal-pale);color:var(--teal-deep);}

  .csd-app{min-height:100vh;display:flex;flex-direction:column;background:var(--paper);}

  /* HEADER */
  .csd-header{
    position:sticky;top:0;z-index:50;background:rgba(24,26,29,0.9);
    backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,0.08);
  }
  .csd-header-inner{max-width:1280px;margin:0 auto;padding:14px 28px;display:flex;align-items:center;justify-content:space-between;gap:16px;}
  .csd-brand{display:flex;align-items:center;gap:12px;}
  .csd-brand-mark{width:36px;height:36px;border-radius:10px;background:linear-gradient(145deg,var(--teal),var(--teal-deep));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(107,150,140,0.35);flex-shrink:0;}
  .csd-brand-mark svg{width:19px;height:19px;stroke:#fff;}
  .csd-brand-name{font-family:'Fraunces',serif;font-weight:600;font-size:17.5px;color:#fff;}
  .csd-brand-name span{color:var(--teal);}
  .csd-brand-sub{font-size:10px;color:rgba(255,255,255,0.55);}
  .csd-header-right{display:flex;align-items:center;gap:12px;}
  .csd-privacy-badge{
    display:flex;align-items:center;gap:7px;font-size:11.5px;color:#DCEAE6;
    background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.14);
    padding:7px 13px;border-radius:999px;
  }
  .csd-privacy-badge svg{width:13px;height:13px;stroke:#AECDC4;}
  .csd-exit{
    font-size:13px;font-weight:600;color:rgba(255,255,255,0.75);border:1.5px solid rgba(255,255,255,0.28);
    padding:8px 16px;border-radius:999px;background:transparent;cursor:pointer;transition:all .25s ease;
    display:flex;align-items:center;gap:6px;
  }
  .csd-exit:hover{border-color:#fff;color:#fff;background:rgba(255,255,255,0.1);}
  .csd-exit svg{width:14px;height:14px;}

  /* SHELL */
  .csd-shell{flex:1;max-width:1280px;margin:0 auto;width:100%;padding:26px 28px 0;display:grid;grid-template-columns:300px 1fr;gap:22px;align-items:start;}

  /* SIDEBAR */
  .csd-sidebar{display:flex;flex-direction:column;gap:16px;position:sticky;top:88px;}
  .csd-card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:20px;box-shadow:var(--shadow);}
  .csd-card-title{font-size:11px;color:var(--ink-soft);margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;}
  .csd-live{display:flex;align-items:center;gap:6px;font-size:10.5px;color:var(--teal-deep);}
  .csd-live .d{width:6px;height:6px;border-radius:50%;background:var(--teal);animation:csdPulse 1.8s infinite;}
  @keyframes csdPulse{0%,100%{opacity:1;}50%{opacity:.3;}}

  .csd-gauge-wrap{position:relative;display:flex;justify-content:center;padding:6px 0 0;}
  .csd-gauge-value{position:absolute;top:64%;left:50%;transform:translate(-50%,-50%);text-align:center;}
  .csd-gauge-value .num{font-family:'Fraunces',serif;font-size:30px;font-weight:600;color:var(--ink);line-height:1;}
  .csd-gauge-value .lbl{font-size:10px;color:var(--ink-soft);margin-top:2px;}
  #csdNeedle{transform-origin:110px 110px;transition:transform 1s cubic-bezier(.65,0,.35,1);}
  .csd-risk-row{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:14px;}
  .csd-risk-chip{text-align:center;padding:7px 2px;border-radius:9px;font-size:9.5px;font-weight:700;border:1.5px solid var(--line);color:var(--ink-soft);transition:all .3s ease;letter-spacing:0.02em;}
  .csd-risk-chip.active{transform:translateY(-1px);}
  .csd-risk-chip[data-r="low"].active{background:#EAF1EA;border-color:#9DBBA8;color:#4A6B4E;}
  .csd-risk-chip[data-r="mod"].active{background:var(--amber-pale);border-color:#D3B579;color:#8C6E36;}
  .csd-risk-chip[data-r="high"].active{background:#F6E7D4;border-color:#CB9868;color:#8F6234;}
  .csd-risk-chip[data-r="crit"].active{background:var(--coral-pale);border-color:#C0897A;color:#8A4A3B;}

  .csd-lang-row{display:flex;flex-wrap:wrap;gap:7px;}
  .csd-lang-chip{font-size:11.5px;padding:6px 12px;border-radius:999px;border:1.5px solid var(--line);color:var(--ink-soft);cursor:pointer;background:#fff;transition:all .2s ease;}
  .csd-lang-chip:hover{border-color:var(--teal);color:var(--teal-deep);}
  .csd-lang-chip.active{background:var(--teal);border-color:var(--teal);color:#fff;}

  .csd-quick-list{display:flex;flex-direction:column;gap:8px;}
  .csd-quick-btn{
    display:flex;align-items:center;gap:10px;text-align:left;font-size:12.5px;color:var(--ink);
    background:var(--paper-2);border:1px solid var(--line);border-radius:12px;padding:10px 12px;
    cursor:pointer;transition:all .2s ease;font-family:'Inter',sans-serif;
  }
  .csd-quick-btn:hover{border-color:var(--teal);background:var(--teal-pale);}
  .csd-quick-btn svg{width:15px;height:15px;stroke:var(--teal-deep);flex-shrink:0;}

  .csd-helpline-card{background:var(--ink);color:#fff;border:none;}
  .csd-helpline-card .csd-card-title{color:#B9C6C6;}
  .csd-helpline-num{font-family:'IBM Plex Mono',monospace;font-size:26px;font-weight:600;letter-spacing:0.02em;margin:2px 0 10px;}
  .csd-helpline-call{
    display:flex;align-items:center;justify-content:center;gap:8px;width:100%;
    background:#fff;color:var(--ink);font-weight:700;font-size:13px;padding:11px;border-radius:999px;
    border:none;cursor:pointer;transition:transform .2s ease;
  }
  .csd-helpline-call:hover{transform:translateY(-1px);}
  .csd-helpline-call svg{width:14px;height:14px;}
  .csd-helpline-note{font-size:10.5px;color:#9DAAA9;margin-top:10px;line-height:1.5;}

  .csd-reco-list{display:flex;flex-wrap:wrap;gap:7px;}
  .csd-reco-pill{font-size:10.5px;background:var(--teal-pale);color:var(--teal-deep);padding:5px 11px;border-radius:999px;font-weight:600;}
  .csd-reco-empty{font-size:11.5px;color:var(--ink-soft);line-height:1.6;}

  /* MAIN / CHAT */
  .csd-main{display:flex;flex-direction:column;height:calc(100vh - 114px);background:#fff;border:1px solid var(--line);border-radius:20px;box-shadow:var(--shadow);overflow:hidden;}
  .csd-chat-head{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid var(--line);background:var(--paper-2);}
  .csd-chat-head-left{display:flex;align-items:center;gap:12px;}
  .csd-bot-avatar{width:38px;height:38px;border-radius:11px;background:linear-gradient(145deg,var(--teal),var(--teal-deep));display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .csd-bot-avatar svg{width:19px;height:19px;stroke:#fff;}
  .csd-chat-head h3{font-size:15.5px;}
  .csd-chat-head p{font-size:11.5px;color:var(--ink-soft);margin:2px 0 0;}
  .csd-consent-pill{font-size:10.5px;display:flex;align-items:center;gap:6px;color:var(--teal-deep);background:var(--teal-pale);padding:6px 12px;border-radius:999px;}
  .csd-consent-pill svg{width:12px;height:12px;stroke:var(--teal-deep);}

  .csd-chat-scroll{flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:16px;}
  .csd-chat-scroll::-webkit-scrollbar{width:6px;}
  .csd-chat-scroll::-webkit-scrollbar-thumb{background:var(--line);border-radius:6px;}

  .csd-msg-row{display:flex;gap:10px;max-width:78%;animation:csdRise .4s ease both;}
  @keyframes csdRise{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
  .csd-msg-row.bot{align-self:flex-start;}
  .csd-msg-row.user{align-self:flex-end;flex-direction:row-reverse;}
  .csd-msg-avatar{width:30px;height:30px;border-radius:9px;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
  .csd-msg-row.bot .csd-msg-avatar{background:var(--teal-pale);}
  .csd-msg-row.bot .csd-msg-avatar svg{width:15px;height:15px;stroke:var(--teal-deep);}
  .csd-msg-row.user .csd-msg-avatar{background:var(--ink);}
  .csd-msg-row.user .csd-msg-avatar svg{width:14px;height:14px;stroke:#fff;}
  .csd-msg-bubble{border-radius:16px;padding:12px 15px;font-size:14px;line-height:1.6;position:relative;}
  .csd-msg-row.bot .csd-msg-bubble{background:var(--paper-2);color:var(--ink);border-top-left-radius:4px;}
  .csd-msg-row.user .csd-msg-bubble{background:var(--teal);color:#fff;border-top-right-radius:4px;}
  .csd-msg-meta{display:flex;align-items:center;gap:8px;margin-top:5px;}
  .csd-msg-time{font-size:10px;color:var(--ink-soft);font-family:'IBM Plex Mono',monospace;}
  .csd-msg-row.user .csd-msg-time{text-align:right;}
  .csd-speak-btn{background:none;border:none;cursor:pointer;padding:0;display:flex;color:var(--teal-deep);opacity:.6;transition:opacity .2s ease;}
  .csd-speak-btn:hover{opacity:1;}
  .csd-speak-btn svg{width:12px;height:12px;}

  .csd-typing{display:flex;gap:4px;align-items:center;padding:12px 15px;background:var(--paper-2);border-radius:16px;border-top-left-radius:4px;width:fit-content;}
  .csd-typing span{width:6px;height:6px;border-radius:50%;background:var(--ink-soft);animation:csdBounce 1.2s infinite;}
  .csd-typing span:nth-child(2){animation-delay:.15s;}
  .csd-typing span:nth-child(3){animation-delay:.3s;}
  @keyframes csdBounce{0%,60%,100%{transform:translateY(0);opacity:.5;}30%{transform:translateY(-4px);opacity:1;}}

  .csd-crisis-card{
    align-self:stretch;max-width:100%;background:var(--coral-pale);border:1.5px solid #D9A594;
    border-radius:16px;padding:16px 18px;display:flex;flex-direction:column;gap:10px;
  }
  .csd-crisis-title{display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:700;color:#8A4A3B;}
  .csd-crisis-title svg{width:16px;height:16px;stroke:#8A4A3B;}
  .csd-crisis-text{font-size:13px;color:#7A4335;line-height:1.6;}
  .csd-crisis-actions{display:flex;gap:10px;flex-wrap:wrap;}
  .csd-crisis-call{display:flex;align-items:center;gap:7px;background:#8A4A3B;color:#fff;font-weight:700;font-size:12.5px;padding:9px 16px;border-radius:999px;border:none;cursor:pointer;}
  .csd-crisis-call svg{width:13px;height:13px;}
  .csd-crisis-secondary{font-size:12.5px;color:#8A4A3B;padding:9px 14px;border-radius:999px;border:1.5px solid #C0897A;background:transparent;cursor:pointer;}

  .csd-quick-chips{display:flex;gap:8px;flex-wrap:wrap;padding:0 24px 14px;}
  .csd-chip-btn{font-size:12.5px;color:var(--teal-deep);background:var(--teal-pale);border:1px solid transparent;padding:8px 14px;border-radius:999px;cursor:pointer;transition:all .2s ease;}
  .csd-chip-btn:hover{background:var(--teal);color:#fff;}

  /* COMPOSER */
  .csd-composer{border-top:1px solid var(--line);padding:14px 18px;display:flex;align-items:flex-end;gap:10px;background:#fff;}
  .csd-input-wrap{flex:1;display:flex;align-items:center;background:var(--paper-2);border:1.5px solid var(--line);border-radius:16px;padding:6px 8px 6px 16px;transition:border-color .2s ease;}
  .csd-input-wrap:focus-within{border-color:var(--teal);}
  .csd-input{flex:1;border:none;background:transparent;outline:none;font-family:'Inter',sans-serif;font-size:14px;color:var(--ink);padding:8px 0;resize:none;max-height:120px;}
  .csd-input::placeholder{color:var(--ink-soft);}
  .csd-mic-btn{
    width:38px;height:38px;border-radius:12px;border:none;background:transparent;color:var(--ink-soft);
    cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;transition:all .2s ease;
  }
  .csd-mic-btn svg{width:18px;height:18px;stroke:currentColor;}
  .csd-mic-btn:hover{background:var(--paper);color:var(--teal-deep);}
  .csd-mic-btn.listening{background:var(--coral);color:#fff;}
  .csd-mic-btn.listening::before{
    content:'';position:absolute;inset:-5px;border-radius:16px;border:2px solid var(--coral);
    opacity:.5;animation:csdRing 1.4s ease-out infinite;
  }
  @keyframes csdRing{0%{transform:scale(0.9);opacity:.6;}100%{transform:scale(1.3);opacity:0;}}
  .csd-mic-btn:disabled{opacity:.35;cursor:not-allowed;}
  .csd-send-btn{
    width:44px;height:44px;border-radius:13px;border:none;background:var(--teal);color:#fff;
    display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:all .2s ease;
    box-shadow:0 6px 16px rgba(107,150,140,0.28);
  }
  .csd-send-btn svg{width:17px;height:17px;}
  .csd-send-btn:hover{background:var(--teal-deep);transform:translateY(-1px);}
  .csd-send-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none;}

  .csd-waveform{display:flex;align-items:center;gap:2px;height:18px;margin:0 6px;}
  .csd-waveform span{width:2.5px;background:var(--coral);border-radius:2px;animation:csdWave 0.9s ease-in-out infinite;}
  @keyframes csdWave{0%,100%{height:4px;}50%{height:16px;}}

  .csd-consent-gate{
    align-self:center;max-width:520px;background:var(--paper-2);border:1px solid var(--line);
    border-radius:18px;padding:22px 24px;text-align:center;
  }
  .csd-consent-gate h4{font-size:15.5px;margin-bottom:8px;}
  .csd-consent-gate p{font-size:13px;color:var(--ink-soft);line-height:1.65;margin:0 0 16px;}
  .csd-consent-accept{background:var(--teal);color:#fff;font-weight:700;font-size:13px;padding:10px 22px;border-radius:999px;border:none;cursor:pointer;}
  .csd-consent-accept:hover{background:var(--teal-deep);}

  @media (max-width:960px){
    .csd-shell{grid-template-columns:1fr;padding:18px 16px 0;}
    .csd-sidebar{position:static;flex-direction:row;flex-wrap:wrap;}
    .csd-sidebar .csd-card{flex:1 1 220px;}
    .csd-main{height:calc(100vh - 240px);}
    .csd-msg-row{max-width:92%;}
  }
`;

/* ---------- content config (kept out of JSX for easy editing) ---------- */

const LANGUAGES = ["English", "हिन्दी", "తెలుగు", "தமிழ்", "मराठी", "ಕನ್ನಡ"];

const QUICK_ACTIONS = [
  { key: "counsellor", label: "Talk to a counsellor", icon: "chat" },
  { key: "legal", label: "Understand my legal options", icon: "scale" },
  { key: "unsafe", label: "I don't feel safe right now", icon: "shield" },
  { key: "unsure", label: "I'm not sure where to start", icon: "compass" },
];

// Words that should never be scored quietly — they route straight to a human.
const CRISIS_PATTERNS = [
  "suicide", "kill myself", "end my life", "end it all", "not want to live",
  "no reason to live", "hurt myself", "self harm", "want to die",
];

// Lightweight demo signal words. Replace with the real NLP/Emotion AI service.
const DISTRESS_WORDS = [
  "afraid", "scared", "threat", "threatened", "unsafe", "alone", "isolated",
  "hopeless", "crying", "hurt", "pain", "beaten", "assault", "assaulted",
  "boycott", "displaced", "can't sleep", "nightmares", "panic",
];
const RELIEF_WORDS = ["better", "safe now", "calmer", "thank you", "helped", "okay now"];

function scoreLevel(score) {
  if (score >= 76) return "crit";
  if (score >= 55) return "high";
  if (score >= 30) return "mod";
  return "low";
}
const LEVEL_LABEL = { low: "LOW", mod: "MODERATE", high: "HIGH", crit: "CRITICAL" };
const LEVEL_ANGLE = { low: -55, mod: -10, high: 35, crit: 68 };

function assessMessage(text, prevScore) {
  // TODO(api): replace this whole function with a POST to /api/assess that
  // runs NLP + Emotion AI + Speech Analytics fusion and returns a real SVI.
  const lower = text.toLowerCase();
  const isCrisis = CRISIS_PATTERNS.some((p) => lower.includes(p));
  if (isCrisis) return { score: 96, crisis: true };

  let delta = 0;
  DISTRESS_WORDS.forEach((w) => { if (lower.includes(w)) delta += 9; });
  RELIEF_WORDS.forEach((w) => { if (lower.includes(w)) delta -= 12; });
  if (text.trim().endsWith("?")) delta -= 2;

  const next = Math.max(8, Math.min(94, prevScore + delta + (delta === 0 ? -2 : 0)));
  return { score: Math.round(next), crisis: false };
}

function botReplyFor(actionKeyOrText, level, isCrisis) {
  if (isCrisis) {
    return "I'm really glad you told me. What you're feeling matters, and you don't have to carry it alone. I'd like to connect you with someone right now — is that okay?";
  }
  const templates = {
    counsellor: "I can arrange a callback from a counsellor who works with cases like yours. Would you prefer a call today, or would you rather write to me a bit more first?",
    legal: "I can walk you through what usually happens next — filing a complaint, what protection is available, and what to expect from the process. Would you like that in simple steps?",
    unsafe: "Thank you for telling me that directly. Your safety comes first. Can you tell me, in a word or two, whether you're safe at this exact moment?",
    unsure: "That's alright — most people who reach out feel this way at first. We can go one small step at a time. Would it help if I asked a few gentle questions to understand your situation?",
  };
  if (templates[actionKeyOrText]) return templates[actionKeyOrText];

  if (level === "crit" || level === "high") {
    return "I hear how hard this has been for you. What you've shared sounds serious, and I want to make sure you get real support quickly — I'm noting this as higher priority for a counsellor to reach out.";
  }
  if (level === "mod") {
    return "Thank you for sharing that with me. It sounds like this has been weighing on you. Would you like me to note this for a counsellor to follow up, or would you like to talk a bit more first?";
  }
  return "I'm here, and I'm listening. Take whatever time you need — there's no wrong way to say this.";
}

function recommendationsFor(level) {
  if (level === "crit") return ["Emergency support", "Police intervention", "Witness protection"];
  if (level === "high") return ["Priority counselling", "Legal aid", "Medical assistance"];
  if (level === "mod") return ["Counselling", "Legal information"];
  return [];
}

/* ---------- small inline icon set (matches Home.jsx line-icon style) ---------- */

const Icon = {
  back: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>),
  lock: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>),
  heartHands: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 21c-4-2.5-7-6-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 4-3 7.5-7 10z" /><path d="M9 12h1.5l1-2 2 4 1-2H16" /></svg>),
  send: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>),
  mic: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" /></svg>),
  phone: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2.1z" /></svg>),
  chat: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>),
  scale: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v18M5 8l-3 6a4 4 0 0 0 8 0zM19 8l-3 6a4 4 0 0 0 8 0zM5 8h14M8 3h8" /></svg>),
  shield: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" /></svg>),
  compass: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9" /><path d="m16 8-2 6-6 2 2-6z" /></svg>),
  warn: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></svg>),
  speaker: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 5 6 9H2v6h4l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /></svg>),
};

const ICON_MAP = { chat: Icon.chat, scale: Icon.scale, shield: Icon.shield, compass: Icon.compass };

/* ---------------------------------- component ---------------------------------- */

export default function ClientDashboard() {
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

  // fonts + speech-recognition feature detect
  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap";
    document.head.appendChild(fontLink);
    document.title = "Client Support — SAHAYA AI";

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SR);

    return () => { if (fontLink.parentNode) fontLink.parentNode.removeChild(fontLink); };
  }, []);

  // seed the conversation once consent is given
  useEffect(() => {
    if (consentGiven && messages.length === 0) {
      pushBotMessage("I'm Sahaya. I'm here to listen, at whatever pace works for you. You can type, or press the microphone to speak instead — nothing is shared beyond this conversation without your say-so.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consentGiven]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const timeNow = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const pushBotMessage = (text) => {
    setMessages((m) => [...m, { id: `${Date.now()}-b`, sender: "bot", text, time: timeNow() }]);
  };
  const pushUserMessage = (text) => {
    setMessages((m) => [...m, { id: `${Date.now()}-u`, sender: "user", text, time: timeNow() }]);
  };

  const applyAssessment = useCallback((text) => {
    const { score, crisis } = assessMessage(text, sviScore);
    setSviScore(score);
    const level = crisis ? "crit" : scoreLevel(score);
    setRiskLevel(level);
    setRecommendations(recommendationsFor(level));
    if (crisis) setCrisisActive(true);
    return { level, crisis };
  }, [sviScore]);

  const sendMessage = useCallback((rawText, actionKey) => {
    const text = (rawText || "").trim();
    if (!text) return;
    pushUserMessage(text);
    setInput("");

    const { level, crisis } = applyAssessment(text);

    setIsTyping(true);
    // TODO(api): swap this timeout for the real backend response.
    setTimeout(() => {
      setIsTyping(false);
      pushBotMessage(botReplyFor(actionKey || text, level, crisis));
    }, 900 + Math.random() * 500);
  }, [applyAssessment]);

  const handleQuickAction = (key, label) => sendMessage(label, key);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const toggleListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    if (isListening) {
      recognitionRef.current && recognitionRef.current.stop();
      return;
    }

    // TODO(api): also start streaming raw audio to the Speech Analytics
    // service here (pitch/pace/pause/vocal-strain), independent of transcript.
    const recognition = new SR();
    recognition.lang = language === "हिन्दी" ? "hi-IN" : language === "తెలుగు" ? "te-IN" : language === "தமிழ்" ? "ta-IN" : "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) transcript += event.results[i][0].transcript;
      setInput(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => {
      setIsListening(false);
      setInput((current) => {
        if (current.trim()) sendMessage(current);
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
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.rate = 0.98;
    window.speechSynthesis.speak(utter);
  };

  const callHelpline = () => { window.location.href = "tel:14566"; };

  return (
    <>
      <style>{PAGE_CSS}</style>
      <div className="csd-app">
        <header className="csd-header">
          <div className="csd-header-inner">
            <div className="csd-brand">
              <div className="csd-brand-mark"><Icon.heartHands /></div>
              <div>
                <div className="csd-brand-name">SAHAYA <span>AI</span></div>
                <div className="csd-brand-sub mono">Client Support · NHAA 14566</div>
              </div>
            </div>
            <div className="csd-header-right">
              <div className="csd-privacy-badge"><Icon.lock /> Confidential &amp; encrypted</div>
              <button className="csd-exit" onClick={() => navigate("/")}> <Icon.back /> Back home</button>
            </div>
          </div>
        </header>

        <div className="csd-shell">
          <aside className="csd-sidebar">
            <div className="csd-card">
              <div className="csd-card-title mono">
                Stress Vulnerability Index
                <span className="csd-live"><span className="d" /> LIVE</span>
              </div>
              <div className="csd-gauge-wrap">
                <svg width="220" height="132" viewBox="0 0 220 132">
                  <path d="M22 110 A88 88 0 0 1 198 110" fill="none" stroke="#E9E3D6" strokeWidth="14" strokeLinecap="round" />
                  <path d="M22 110 A88 88 0 0 1 72 32" fill="none" stroke="#9DBBA8" strokeWidth="14" strokeLinecap="round" />
                  <path d="M72 32 A88 88 0 0 1 130 24" fill="none" stroke="#D3B579" strokeWidth="14" strokeLinecap="round" />
                  <path d="M130 24 A88 88 0 0 1 177 56" fill="none" stroke="#CB9868" strokeWidth="14" strokeLinecap="round" />
                  <path d="M177 56 A88 88 0 0 1 198 110" fill="none" stroke="#C0897A" strokeWidth="14" strokeLinecap="round" />
                  <g id="csdNeedle" style={{ transform: `rotate(${LEVEL_ANGLE[riskLevel]}deg)` }}>
                    <line x1="110" y1="110" x2="110" y2="34" stroke="#2B2E33" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="110" cy="110" r="6" fill="#2B2E33" />
                  </g>
                </svg>
                <div className="csd-gauge-value">
                  <div className="num">{sviScore}</div>
                  <div className="lbl">SVI / 100</div>
                </div>
              </div>
              <div className="csd-risk-row">
                <div className={`csd-risk-chip${riskLevel === "low" ? " active" : ""}`} data-r="low">LOW</div>
                <div className={`csd-risk-chip${riskLevel === "mod" ? " active" : ""}`} data-r="mod">MOD</div>
                <div className={`csd-risk-chip${riskLevel === "high" ? " active" : ""}`} data-r="high">HIGH</div>
                <div className={`csd-risk-chip${riskLevel === "crit" ? " active" : ""}`} data-r="crit">CRIT</div>
              </div>
            </div>

            <div className="csd-card">
              <div className="csd-card-title mono">Recommended support</div>
              {recommendations.length ? (
                <div className="csd-reco-list">
                  {recommendations.map((r) => (<span className="csd-reco-pill" key={r}>{r}</span>))}
                </div>
              ) : (
                <p className="csd-reco-empty">Nothing to flag yet — this updates as we talk.</p>
              )}
            </div>

            <div className="csd-card">
              <div className="csd-card-title mono">Language</div>
              <div className="csd-lang-row">
                {LANGUAGES.map((l) => (
                  <button key={l} className={`csd-lang-chip${language === l ? " active" : ""}`} onClick={() => setLanguage(l)}>{l}</button>
                ))}
              </div>
            </div>

            <div className="csd-card">
              <div className="csd-card-title mono">Quick start</div>
              <div className="csd-quick-list">
                {QUICK_ACTIONS.map((a) => {
                  const ActionIcon = ICON_MAP[a.icon];
                  return (
                    <button key={a.key} className="csd-quick-btn" disabled={!consentGiven}
                      onClick={() => handleQuickAction(a.key, a.label)}>
                      <ActionIcon /> {a.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="csd-card csd-helpline-card">
              <div className="csd-card-title mono">National helpline</div>
              <div className="csd-helpline-num">14566</div>
              <button className="csd-helpline-call" onClick={callHelpline}><Icon.phone /> Call now</button>
              <div className="csd-helpline-note">Toll-free, 24×7. Available any time, even if you never send another message here.</div>
            </div>
          </aside>

          <main className="csd-main">
            <div className="csd-chat-head">
              <div className="csd-chat-head-left">
                <div className="csd-bot-avatar"><Icon.heartHands /></div>
                <div>
                  <h3>Sahaya</h3>
                  <p>Usually replies in a few seconds</p>
                </div>
              </div>
              <div className="csd-consent-pill"><Icon.lock /> Consent-based</div>
            </div>

            <div className="csd-chat-scroll" ref={scrollRef}>
              {!consentGiven && (
                <div className="csd-consent-gate">
                  <h4>Before we begin</h4>
                  <p>
                    Anything you type or say here is used only to understand how you're doing right now, so we
                    can connect you with the right kind of support — counselling, legal information, medical help,
                    or the police, based on what you choose. You can stop at any time, and you decide what to share.
                  </p>
                  <button className="csd-consent-accept" onClick={() => setConsentGiven(true)}>I understand — continue</button>
                </div>
              )}

              {messages.map((m) => (
                <div className={`csd-msg-row ${m.sender}`} key={m.id}>
                  <div className="csd-msg-avatar">{m.sender === "bot" ? <Icon.heartHands stroke="#48685F" /> : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
                  )}</div>
                  <div>
                    <div className="csd-msg-bubble">{m.text}</div>
                    <div className="csd-msg-meta">
                      <span className="csd-msg-time">{m.time}</span>
                      {m.sender === "bot" && (
                        <button className="csd-speak-btn" onClick={() => speakMessage(m.text)} title="Hear this message aloud">
                          <Icon.speaker />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="csd-msg-row bot">
                  <div className="csd-msg-avatar"><Icon.heartHands stroke="#48685F" /></div>
                  <div className="csd-typing"><span /><span /><span /></div>
                </div>
              )}

              {crisisActive && (
                <div className="csd-crisis-card">
                  <div className="csd-crisis-title"><Icon.warn /> You don't have to face this alone</div>
                  <div className="csd-crisis-text">
                    What you've shared matters, and immediate, real support is available right now — the
                    helpline is staffed 24×7 by people trained for exactly this.
                  </div>
                  <div className="csd-crisis-actions">
                    <button className="csd-crisis-call" onClick={callHelpline}><Icon.phone /> Call 14566 now</button>
                    <button className="csd-crisis-secondary" onClick={() => handleQuickAction("counsellor", "Please connect me with a counsellor")}>Request a callback instead</button>
                  </div>
                </div>
              )}
            </div>

            {consentGiven && (
              <div className="csd-quick-chips">
                {QUICK_ACTIONS.map((a) => (
                  <button key={a.key} className="csd-chip-btn" onClick={() => handleQuickAction(a.key, a.label)}>{a.label}</button>
                ))}
              </div>
            )}

            <form className="csd-composer" onSubmit={handleFormSubmit}>
              <div className="csd-input-wrap">
                <input
                  className="csd-input"
                  placeholder={consentGiven ? "Type here, or use the microphone…" : "Please confirm consent above to begin"}
                  value={input}
                  disabled={!consentGiven}
                  onChange={(e) => setInput(e.target.value)}
                />
                {isListening && (
                  <div className="csd-waveform" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((i) => (<span key={i} style={{ animationDelay: `${i * 0.1}s` }} />))}
                  </div>
                )}
                <button
                  type="button"
                  className={`csd-mic-btn${isListening ? " listening" : ""}`}
                  disabled={!consentGiven || !speechSupported}
                  title={speechSupported ? "Speak instead of typing" : "Voice input isn't supported in this browser"}
                  onClick={toggleListening}
                >
                  <Icon.mic />
                </button>
              </div>
              <button type="submit" className="csd-send-btn" disabled={!consentGiven || !input.trim()}>
                <Icon.send />
              </button>
            </form>
          </main>
        </div>
      </div>
    </>
  );
}