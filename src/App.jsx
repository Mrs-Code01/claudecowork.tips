import { useForm, ValidationError } from "@formspree/react";
import { useState } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --lime:    #b8ff3c;
  --cyan:    #38eeff;
  --pink:    #ff4d94;
  --gold:    #ffd166;
  --dark:    #07080f;
  --darker:  #04050a;
  --surface: rgba(255,255,255,0.045);
  --border:  rgba(255,255,255,0.09);
  --text:    #ffffff;
  --muted:   rgba(255,255,255,0.45);
  --subtle:  rgba(255,255,255,0.22);
}

html, body { height: 100%; background: var(--darker); }

/* ═══════════════════════
   PAGE SHELL
═══════════════════════ */
.page {
  min-height: 100vh;
  background: var(--darker);
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}

/* ═══════════════════════
   BACKGROUND
═══════════════════════ */
.bg-noise {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.028;
  animation: noiseAnim 0.5s steps(1) infinite;
}
@keyframes noiseAnim {
  0%  { transform: translate(0,0); }
  25% { transform: translate(-3%,-2%); }
  50% { transform: translate(2%, 3%); }
  75% { transform: translate(-1%,-3%); }
}

.bg-glow { position: fixed; pointer-events: none; border-radius: 50%; z-index: 0; }
.glow-a {
  width: 800px; height: 800px;
  background: radial-gradient(circle, rgba(184,255,60,0.10) 0%, transparent 65%);
  top: -300px; left: -200px;
  animation: driftA 16s ease-in-out infinite alternate;
}
.glow-b {
  width: 650px; height: 650px;
  background: radial-gradient(circle, rgba(56,238,255,0.09) 0%, transparent 65%);
  bottom: -200px; right: -150px;
  animation: driftB 20s ease-in-out infinite alternate;
}
.glow-c {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(255,77,148,0.07) 0%, transparent 65%);
  top: 40%; left: 40%;
  animation: driftC 25s ease-in-out infinite alternate;
}
@keyframes driftA { to { transform: translate(80px, 120px); } }
@keyframes driftB { to { transform: translate(-60px, -80px); } }
@keyframes driftC { to { transform: translate(-80px, 60px) scale(1.3); } }

/* ═══════════════════════
   TOPBAR (mobile only)
═══════════════════════ */
.topbar {
  display: none;
  position: relative; z-index: 10;
  align-items: center; justify-content: space-between;
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  background: rgba(4,5,10,0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.topbar-logo {
  display: flex; align-items: center; gap: 9px;
}
.logo-mark {
  width: 32px; height: 32px; border-radius: 9px;
  background: var(--lime);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 13px;
  color: var(--darker); flex-shrink: 0;
  font-family: 'Clash Display', sans-serif;
  letter-spacing: 0.02em;
}
.logo-label {
  font-family: 'Clash Display', sans-serif;
  font-size: 14px; font-weight: 700;
  color: var(--text); letter-spacing: 0.01em;
}
.logo-label span { color: var(--lime); }
.topbar-pill {
  font-size: 10px; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--lime);
  background: rgba(184,255,60,0.08);
  border: 1px solid rgba(184,255,60,0.22);
  padding: 4px 11px; border-radius: 999px;
}

/* ═══════════════════════
   TWO-PANEL GRID
═══════════════════════ */
.panels {
  position: relative; z-index: 2;
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: calc(100vh);
}

/* ═══════════════════════
   LEFT PANEL
═══════════════════════ */
.left-panel {
  display: flex; flex-direction: column; justify-content: center;
  padding: 4rem 3.5rem 4rem 4rem;
  border-right: 1px solid var(--border);
  background: rgba(0,0,0,0.15);
}

/* brand row */
.brand {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 3rem;
  animation: fadeSlide 0.7s 0.05s both;
}
.brand-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--lime);
  box-shadow: 0 0 12px var(--lime);
  animation: glowPulse 2s ease-in-out infinite;
}
@keyframes glowPulse {
  0%,100% { box-shadow: 0 0 12px var(--lime); }
  50%      { box-shadow: 0 0 24px var(--lime), 0 0 40px var(--lime); }
}
.brand-name {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700; font-size: 13px;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--lime);
}

/* headline */
.left-headline {
  font-family: 'Clash Display', sans-serif;
  font-weight: 700;
  font-size: clamp(2.4rem, 3.8vw, 3.5rem);
  line-height: 1.06;
  color: var(--text);
  margin-bottom: 1.4rem;
  animation: fadeSlide 0.7s 0.1s both;
}
.left-headline .acc-lime { color: var(--lime); }
.left-headline .acc-cyan { color: var(--cyan); }
.left-headline .acc-gold { color: var(--gold); }

/* sub */
.left-sub {
  font-size: 1rem; font-weight: 300;
  color: var(--muted); line-height: 1.78;
  margin-bottom: 2.5rem; max-width: 390px;
  animation: fadeSlide 0.7s 0.15s both;
}
.left-sub strong { color: rgba(255,255,255,0.85); font-weight: 500; }

/* stats */
.stats {
  display: flex; gap: 0;
  margin-bottom: 2.5rem;
  border: 1px solid var(--border);
  border-radius: 16px; overflow: hidden;
  animation: fadeSlide 0.7s 0.2s both;
}
.stat {
  flex: 1; padding: 16px 14px;
  border-right: 1px solid var(--border);
  background: rgba(255,255,255,0.02);
}
.stat:last-child { border-right: none; }
.stat-num {
  font-family: 'Clash Display', sans-serif;
  font-size: 1.85rem; font-weight: 700;
  color: var(--text); line-height: 1; margin-bottom: 4px;
}
.stat-num .unit { font-size: 1.1rem; color: var(--lime); }
.stat-label {
  font-size: 10px; letter-spacing: 0.09em;
  text-transform: uppercase; color: var(--subtle);
}

/* features */
.features {
  display: flex; flex-direction: column; gap: 12px;
  animation: fadeSlide 0.7s 0.25s both;
}
.feature {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 14px 16px;
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  transition: background 0.2s, border-color 0.2s;
}
.feature:hover {
  background: rgba(184,255,60,0.04);
  border-color: rgba(184,255,60,0.18);
}
.feature-badge {
  width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.feature-badge.lime { background: rgba(184,255,60,0.12); border: 1px solid rgba(184,255,60,0.2); }
.feature-badge.cyan { background: rgba(56,238,255,0.10); border: 1px solid rgba(56,238,255,0.18); }
.feature-badge.pink { background: rgba(255,77,148,0.10); border: 1px solid rgba(255,77,148,0.18); }
.feature-text { padding-top: 2px; }
.feature-title { font-size: 13.5px; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 3px; }
.feature-desc  { font-size: 12px; color: var(--muted); line-height: 1.55; }

/* ═══════════════════════
   RIGHT PANEL
═══════════════════════ */
.right-panel {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 4rem 3rem;
}

/* form card */
.form-card {
  width: 100%; max-width: 420px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 24px;
  padding: 2.5rem 2.25rem;
  position: relative;
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  animation: riseCard 0.8s 0.1s cubic-bezier(0.22,1,0.36,1) both;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.05),
    0 40px 80px rgba(0,0,0,0.5),
    0 0 60px rgba(184,255,60,0.06);
}
@keyframes riseCard {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
.form-card::before {
  content: '';
  position: absolute;
  top: 0; left: 8%; right: 8%; height: 1.5px;
  background: linear-gradient(90deg, transparent, var(--lime) 40%, var(--cyan) 60%, transparent);
  border-radius: 999px; opacity: 0.65;
}

/* eyebrow */
.form-eyebrow {
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.15em; text-transform: uppercase;
  color: var(--lime); margin-bottom: 0.6rem;
  display: flex; align-items: center; gap: 6px;
  animation: fadeSlide 0.7s 0.25s both;
}
.form-eyebrow::before {
  content: '';
  display: inline-block; width: 16px; height: 1.5px;
  background: var(--lime); border-radius: 999px;
}

/* title */
.form-title {
  font-family: 'Clash Display', sans-serif;
  font-size: 1.7rem; font-weight: 700;
  color: var(--text); line-height: 1.2;
  margin-bottom: 0.55rem;
  animation: fadeSlide 0.7s 0.3s both;
}

/* desc */
.form-desc {
  font-size: 13px; font-weight: 300;
  color: var(--muted); line-height: 1.68;
  margin-bottom: 1.75rem;
  animation: fadeSlide 0.7s 0.35s both;
}
.form-desc strong { color: rgba(255,255,255,0.78); font-weight: 600; }

/* fields */
.form-fields { animation: fadeSlide 0.7s 0.4s both; }

.field { margin-bottom: 12px; }
.field label {
  display: flex; align-items: center; gap: 5px;
  font-size: 10.5px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: rgba(255,255,255,0.28); margin-bottom: 7px;
}
.field input {
  width: 100%;
  background: rgba(255,255,255,0.06);
  border: 1.5px solid rgba(255,255,255,0.09);
  border-radius: 12px;
  padding: 13px 16px;
  font-size: 16px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--text); outline: none;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}
.field input::placeholder { color: rgba(255,255,255,0.2); }
.field input:focus {
  border-color: var(--lime);
  background: rgba(184,255,60,0.05);
  box-shadow: 0 0 0 4px rgba(184,255,60,0.08);
}
.field input.err {
  border-color: var(--pink);
  background: rgba(255,77,148,0.04);
  box-shadow: 0 0 0 4px rgba(255,77,148,0.08);
}
.err-msg {
  font-size: 11px; color: var(--pink);
  margin-top: 5px; padding-left: 2px;
  display: flex; align-items: center; gap: 4px;
}

/* submit */
.submit-btn {
  margin-top: 18px;
  width: 100%; padding: 15px 20px;
  background: var(--lime);
  border: none; border-radius: 13px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 15px; font-weight: 700;
  color: var(--darker); cursor: pointer;
  position: relative; overflow: hidden;
  transition: transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 0 30px rgba(184,255,60,0.32), 0 4px 20px rgba(0,0,0,0.3);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  letter-spacing: 0.01em;
}
.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 0 55px rgba(184,255,60,0.52), 0 8px 30px rgba(0,0,0,0.3);
}
.submit-btn:active:not(:disabled) { transform: scale(0.985); }
.submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.submit-btn::after {
  content: '';
  position: absolute; top: 0; left: -100%;
  width: 55%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.32), transparent);
  transform: skewX(-18deg);
  animation: sweep 3s 1.5s ease-in-out infinite;
}
@keyframes sweep { 0%,70%,100% { left: -100%; } 40% { left: 180%; } }
.submit-icon { font-size: 17px; }

/* fine print */
.fine-print {
  text-align: center; font-size: 11px;
  color: var(--subtle); margin-top: 14px; line-height: 1.65;
}

/* social proof */
.social-proof {
  display: flex; align-items: center; gap: 10px;
  margin-top: 1.75rem; padding-top: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.07);
  animation: fadeSlide 0.7s 0.5s both;
}
.avatars { display: flex; }
.avatar {
  width: 28px; height: 28px; border-radius: 50%;
  border: 2px solid var(--darker);
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 800; margin-left: -9px;
}
.avatar:first-child { margin-left: 0; }
.av1 { background: linear-gradient(135deg, var(--lime), #8ccf00); color: var(--darker); }
.av2 { background: linear-gradient(135deg, var(--cyan), #00b8d4); color: var(--darker); }
.av3 { background: linear-gradient(135deg, var(--pink), #cc0066); color: #fff; }
.av4 { background: linear-gradient(135deg, #a78bfa, #6d28d9); color: #fff; }
.proof-text { font-size: 12px; color: var(--muted); line-height: 1.5; }
.proof-text strong { color: rgba(255,255,255,0.82); font-weight: 600; display: block; }
.stars { color: #fbbf24; font-size: 11px; letter-spacing: 1px; }

/* success */
.success-wrap {
  text-align: center; padding: 0.5rem 0;
  animation: riseCard 0.6s cubic-bezier(0.22,1,0.36,1) both;
}
.success-emoji {
  font-size: 3.5rem; display: block; margin-bottom: 1rem;
  animation: popBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
}
@keyframes popBounce {
  from { transform: scale(0) rotate(-20deg); opacity: 0; }
  to   { transform: scale(1) rotate(0deg); opacity: 1; }
}
.success-title {
  font-family: 'Clash Display', sans-serif;
  font-size: 2.2rem; font-weight: 700;
  color: var(--lime); margin-bottom: 0.6rem; line-height: 1.1;
}
.success-sub {
  font-size: 14px; color: var(--muted);
  line-height: 1.72; max-width: 300px; margin: 0 auto 1.5rem;
}
.success-sub strong { color: rgba(255,255,255,0.85); font-weight: 500; }
.success-tag {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(184,255,60,0.1);
  border: 1px solid rgba(184,255,60,0.25);
  color: var(--lime); font-size: 12px; font-weight: 700;
  padding: 7px 16px; border-radius: 999px;
}

/* shared keyframe */
@keyframes fadeSlide {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* footer */
.footer {
  position: relative; z-index: 2;
  text-align: center; padding: 1.25rem 2rem;
  font-size: 11px; color: var(--subtle);
  border-top: 1px solid var(--border);
}

/* ═══════════════════════
   RESPONSIVE — TABLET
═══════════════════════ */
@media (max-width: 900px) {
  .panels { grid-template-columns: 1fr; min-height: auto; }

  .topbar { display: flex; }

  .left-panel {
    border-right: none;
    border-bottom: 1px solid var(--border);
    padding: 2.5rem 2rem;
    background: rgba(0,0,0,0.12);
  }
  .brand { margin-bottom: 2rem; }
  .left-headline { font-size: clamp(2.2rem, 6vw, 3rem); margin-bottom: 1rem; }
  .left-sub { font-size: 0.95rem; margin-bottom: 2rem; max-width: 100%; }
  .stats { margin-bottom: 2rem; }
  .features { gap: 10px; }

  .right-panel { padding: 2.5rem 2rem; align-items: stretch; }
  .form-card { max-width: 100%; }
}

/* ═══════════════════════
   RESPONSIVE — MOBILE
═══════════════════════ */
@media (max-width: 600px) {
  .left-panel { padding: 2rem 1.25rem; }
  .left-headline { font-size: clamp(1.9rem, 8.5vw, 2.6rem); }

  .stats { flex-direction: column; border-radius: 14px; }
  .stat { border-right: none; border-bottom: 1px solid var(--border); padding: 13px 14px; }
  .stat:last-child { border-bottom: none; }
  .stat-num { font-size: 1.6rem; }

  .features { gap: 9px; }
  .feat { padding: 11px 12px; }
  .feature-badge { width: 34px; height: 34px; font-size: 16px; }
  .feature-title { font-size: 12.5px; }
  .feature-desc  { font-size: 11.5px; }

  .right-panel { padding: 2rem 1.25rem; }
  .form-card { padding: 2rem 1.5rem; border-radius: 20px; }
  .form-title { font-size: 1.45rem; }
  .submit-btn { font-size: 14px; padding: 14px; }

  .footer { font-size: 10.5px; }
}

@media (max-width: 380px) {
  .left-headline { font-size: 1.8rem; }
  .topbar { padding: 0.9rem 1.1rem; }
  .logo-label { font-size: 13px; }
}
`;

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [localErrors, setLocalErrors] = useState({});
  const [state, handleFsSubmit] = useForm("mdajgvqj");

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Please tell us your name";
    if (!email.trim()) e.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "That doesn't look like a valid email";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setLocalErrors(e);
      return;
    }
    setLocalErrors({});
    handleFsSubmit(ev);
  };

  const errors = localErrors;
  const done = state.succeeded;
  // ── END OF CHANGE ──

  const firstName = name.trim().split(" ")[0];

  return (
    <>
      <style>{css}</style>
      <div className="page">
        {/* ── BG ── */}
        <div className="bg-noise" />
        <div className="bg-glow glow-a" />
        <div className="bg-glow glow-b" />
        <div className="bg-glow glow-c" />

        {/* ── MOBILE TOPBAR ── */}
        <nav className="topbar">
          <div className="topbar-logo">
            <span className="logo-label">
              Claude <span>Cowork</span>
            </span>
          </div>
          <span className="topbar-pill">Daily Tips · Free</span>
        </nav>

        {/* ── TWO PANELS ── */}
        <div className="panels">
          {/* LEFT */}
          <div className="left-panel">
            <div className="brand">
              <span className="brand-dot" />
              <span className="brand-name">Claude Cowork Tips</span>
            </div>

            <h1 className="left-headline">
              Get Daily
              <br />
              <span className="acc-lime">Claude Cowork</span>
              <br />
              <span className="acc-gold">Tips</span> That Actually
              <br />
              <span className="acc-cyan">Change How You Work</span>
            </h1>

            <p className="left-sub">
              Most people use Claude at 10% of its potential.{" "}
              <strong>
                Join freelancers and creators who receive powerful daily Claude
                Cowork tips
              </strong>{" "}
              — real workflows, hidden tricks, and pro knowledge — delivered
              free to your inbox every morning.
            </p>

            <div className="stats">
              <div className="stat">
                <span className="stat-num">
                  840<span className="unit">+</span>
                </span>
                <span className="stat-label">Subscribers</span>
              </div>
              <div className="stat">
                <span className="stat-num">
                  1<span className="unit">×</span>
                </span>
                <span className="stat-label">Tip per day</span>
              </div>
              <div className="stat">
                <span className="stat-num">
                  100<span className="unit">%</span>
                </span>
                <span className="stat-label">Free always</span>
              </div>
            </div>

            <div className="features">
              <div className="feature">
                <div className="feature-badge lime">⚡</div>
                <div className="feature-text">
                  <div className="feature-title">
                    Real Claude Cowork workflows
                  </div>
                  <div className="feature-desc">
                    Copy-paste prompts and strategies you can use the moment the
                    email arrives — zero fluff, pure results.
                  </div>
                </div>
              </div>
              <div className="feature">
                <div className="feature-badge cyan">🧠</div>
                <div className="feature-text">
                  <div className="feature-title">
                    Insider Claude Cowork knowledge
                  </div>
                  <div className="feature-desc">
                    Hidden features, advanced tricks, and deep techniques most
                    Claude users will never discover on their own.
                  </div>
                </div>
              </div>
              <div className="feature">
                <div className="feature-badge pink">🚀</div>
                <div className="feature-text">
                  <div className="feature-title">
                    Grow your freelance income
                  </div>
                  <div className="feature-desc">
                    Deliver exceptional client results in half the time — and
                    charge the premium rates you deserve.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="right-panel">
            <div className="form-card">
              {!done ? (
                <>
                  <p className="form-eyebrow">
                    Free Claude Cowork daily newsletter
                  </p>
                  <h2 className="form-title">
                    Start getting Claude Cowork tips today
                  </h2>
                  <p className="form-desc">
                    Enter your email and get{" "}
                    <strong>
                      one powerful Claude Cowork tip delivered every morning.
                    </strong>{" "}
                    Practical. Actionable. Free forever. No fluff — only
                    knowledge that moves the needle.
                  </p>

                  <form className="form-fields" onSubmit={submit} noValidate>
                    <div className="field">
                      <label htmlFor="f-name">Your name</label>
                      <input
                        id="f-name"
                        type="text"
                        placeholder="e.g. Jordan Smith"
                        value={name}
                        name="name"
                        className={errors.name ? "err" : ""}
                        onChange={(ev) => {
                          setName(ev.target.value);
                          setLocalErrors((p) => ({ ...p, name: "" }));
                        }}
                      />
                      {errors.name && (
                        <div className="err-msg">⚠ {errors.name}</div>
                      )}
                    </div>

                    <div className="field">
                      <label htmlFor="f-email">Email address</label>
                      <input
                        id="f-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        name="email"
                        className={errors.email ? "err" : ""}
                        onChange={(ev) => {
                          setEmail(ev.target.value);
                          setLocalErrors((p) => ({ ...p, email: "" }));
                        }}
                      />
                      {errors.email && (
                        <div className="err-msg">⚠ {errors.email}</div>
                      )}
                    </div>

                    <button
                      className="submit-btn"
                      type="submit"
                      disabled={state.submitting}
                    >
                      <span className="submit-icon">
                        {state.submitting ? "⏳" : "⚡"}
                      </span>
                      {state.submitting
                        ? "Signing you up…"
                        : "Send Me The Claude Cowork Tips — Free"}
                    </button>

                    <p className="fine-print">
                      No spam, ever. Unsubscribe instantly at any time.
                      <br />
                      Your email stays safe — we hate spam too.
                    </p>
                  </form>

                  <div className="social-proof">
                    <div className="avatars">
                      <div className="avatar av1">AJ</div>
                      <div className="avatar av2">TK</div>
                      <div className="avatar av3">MR</div>
                      <div className="avatar av4">SL</div>
                    </div>
                    <div className="proof-text">
                      <span className="stars">★★★★★</span>
                      <strong>840+ freelancers</strong> already leveling up
                      daily
                    </div>
                  </div>
                </>
              ) : (
                <div className="success-wrap">
                  <span className="success-emoji">🎉</span>
                  <div className="success-title">
                    You're in,
                    <br />
                    {firstName}!
                  </div>
                  <p className="success-sub">
                    Your first <strong>Claude Cowork tip</strong> is already
                    heading to <strong>{email}</strong>. Check your inbox — it's
                    a good one.
                  </p>
                  <span className="success-tag">
                    ✦ Welcome to the Claude Cowork crew
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="footer">
          © {new Date().getFullYear()} Claude Cowork Tips · Free daily
          newsletter · No spam, ever
        </footer>
      </div>
    </>
  );
}
