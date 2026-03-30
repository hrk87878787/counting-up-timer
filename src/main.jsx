import { useState, useEffect, useRef, useCallback } from "react";

// ─── Utility ─────────────────────────────────────────────────────────────────

function parseInput(str) {
  const match = str.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const mm = parseInt(match[1], 10);
  const ss = parseInt(match[2], 10);
  if (ss > 59) return null;
  return mm * 60 + ss;
}

function formatTime(totalSeconds) {
  const abs = Math.abs(totalSeconds);
  const mm = String(Math.floor(abs / 60)).padStart(2, "0");
  const ss = String(abs % 60).padStart(2, "0");
  const prefix = totalSeconds < 0 ? "+" : "";
  return `${prefix}${mm}:${ss}`;
}

// ─── States: "idle" | "running" | "paused" ───────────────────────────────────

export default function PresentationTimer() {
  const [inputVal, setInputVal] = useState("05:00");
  const [inputError, setInputError] = useState(false);
  const [duration, setDuration] = useState(null);   // last confirmed seconds
  const [remaining, setRemaining] = useState(null); // positive=countdown, negative=overtime
  const [status, setStatus] = useState("idle");
  const intervalRef = useRef(null);

  const isOvertime = remaining !== null && remaining < 0;

  // ─── Tick ──────────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    setRemaining((prev) => (prev === null ? null : prev - 1));
  }, []);

  useEffect(() => {
    if (status === "running") {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [status, tick]);

  // ─── Display value ─────────────────────────────────────────────────────────
  const displayTime =
    remaining !== null ? formatTime(remaining) : inputVal || "00:00";

  // ─── Handlers ─────────────────────────────────────────────────────────────
  function handleInputChange(e) {
    setInputVal(e.target.value);
    setInputError(false);
  }

  function handleStart() {
    if (status !== "idle") return;
    const secs = parseInput(inputVal);
    if (!secs || secs === 0) { setInputError(true); return; }
    setDuration(secs);
    setRemaining(secs);
    setStatus("running");
  }

  function handlePause() {
    if (status === "running") setStatus("paused");
  }

  function handleResume() {
    if (status === "paused") setStatus("running");
  }

  function handleReset() {
    clearInterval(intervalRef.current);
    setStatus("idle");
    setRemaining(null);
    if (duration !== null) {
      const mm = String(Math.floor(duration / 60)).padStart(2, "0");
      const ss = String(duration % 60).padStart(2, "0");
      setInputVal(`${mm}:${ss}`);
    }
  }

  function handleClear() {
    clearInterval(intervalRef.current);
    setStatus("idle");
    setDuration(null);
    setRemaining(null);
    setInputVal("00:00");
    setInputError(false);
  }

  const isEditable = status === "idle";

  // ─── Status label ─────────────────────────────────────────────────────────
  const statusLabel =
    status === "idle"   ? "STANDBY" :
    status === "paused" ? "PAUSED"  :
    isOvertime          ? "OVERTIME": "RUNNING";

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@300;500;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:       #0a0c0f;
          --panel:    #111318;
          --border:   #1e2530;
          --accent:   #00e5ff;
          --overtime: #ff3b5c;
          --muted:    #3a4558;
          --text:     #cdd6e8;
          --mono:     'Share Tech Mono', monospace;
          --ui:       'Rajdhani', sans-serif;
          --glow:     0 0 28px rgba(0,229,255,.4);
          --glow-red: 0 0 28px rgba(255,59,92,.5);
        }

        body {
          background: var(--bg);
          font-family: var(--ui);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .app-root {
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(ellipse 60% 45% at 50% 0%, rgba(0,229,255,.07) 0%, transparent 70%),
            var(--bg);
        }

        .card {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 48px 56px;
          width: 440px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        /* ── Header ── */
        .header {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .header-title {
          font-weight: 700;
          font-size: 11px;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--muted);
          transition: background .3s, box-shadow .3s;
        }
        .dot.live     { background: var(--accent);   box-shadow: 0 0 8px var(--accent);   animation: blink 1.4s infinite; }
        .dot.overtime { background: var(--overtime); box-shadow: 0 0 8px var(--overtime); animation: blink  .9s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

        /* ── Input ── */
        .input-section { display: flex; flex-direction: column; gap: 6px; }
        .input-label { font-size: 10px; letter-spacing: .18em; text-transform: uppercase; color: var(--muted); }
        .time-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--border);
          color: var(--text);
          font-family: var(--mono);
          font-size: 22px;
          padding: 4px 0 8px;
          width: 100%;
          outline: none;
          transition: border-color .2s, color .2s;
          letter-spacing: .08em;
        }
        .time-input:focus { border-color: var(--accent); color: #fff; }
        .time-input:disabled { color: var(--muted); cursor: not-allowed; }
        .error-msg { font-size: 11px; color: var(--overtime); letter-spacing: .06em; min-height: 14px; }

        /* ── Display ── */
        .display { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 20px 0; }
        .rule { width: 100%; height: 1px; background: linear-gradient(90deg, transparent, var(--border), transparent); }
        .time-display {
          font-family: var(--mono);
          font-size: 84px;
          line-height: 1;
          letter-spacing: .04em;
          color: var(--accent);
          text-shadow: var(--glow);
          transition: color .4s, text-shadow .4s;
          user-select: none;
        }
        .time-display.overtime { color: var(--overtime); text-shadow: var(--glow-red); }
        .status-label {
          font-size: 10px;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: var(--muted);
          transition: color .3s;
        }
        .status-label.running  { color: var(--accent); }
        .status-label.overtime { color: var(--overtime); }

        /* ── Overtime strip ── */
        .ot-strip {
          height: 2px;
          border-radius: 1px;
          background: linear-gradient(90deg, transparent, var(--overtime), transparent);
          opacity: 0;
          transition: opacity .5s;
        }
        .ot-strip.visible { opacity: 1; }

        /* ── Buttons ── */
        .btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .btn {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text);
          font-family: var(--ui);
          font-weight: 500;
          font-size: 13px;
          letter-spacing: .12em;
          text-transform: uppercase;
          padding: 13px 0;
          border-radius: 2px;
          cursor: pointer;
          transition: background .15s, border-color .15s, color .15s, box-shadow .15s;
        }
        .btn:hover:not(:disabled) { background: rgba(255,255,255,.04); border-color: var(--text); }
        .btn:disabled { opacity: .25; cursor: not-allowed; }
        .btn.primary { border-color: var(--accent); color: var(--accent); }
        .btn.primary:hover:not(:disabled) { background: rgba(0,229,255,.08); box-shadow: var(--glow); }
        .btn.danger  { border-color: var(--overtime); color: var(--overtime); }
        .btn.danger:hover:not(:disabled)  { background: rgba(255,59,92,.08);  box-shadow: var(--glow-red); }
      `}</style>

      <div className="card">
        {/* Header */}
        <div className="header">
          <span className="header-title">Presentation Timer</span>
          <div className={`dot ${status === "running" ? (isOvertime ? "overtime" : "live") : ""}`} />
        </div>

        {/* Input */}
        <div className="input-section">
          <span className="input-label">持ち時間 (mm:ss)</span>
          <input
            className="time-input"
            type="text"
            value={inputVal}
            onChange={handleInputChange}
            disabled={!isEditable}
            placeholder="mm:ss"
            spellCheck={false}
          />
          <span className="error-msg">
            {inputError ? "有効な時間を入力してください（例: 05:00）" : ""}
          </span>
        </div>

        {/* Main display */}
        <div className="display">
          <div className="rule" />
          <div className={`time-display${isOvertime ? " overtime" : ""}`}>
            {displayTime}
          </div>
          <div className={`status-label ${status === "running" ? (isOvertime ? "overtime" : "running") : ""}`}>
            {statusLabel}
          </div>
          <div className="rule" />
        </div>

        {/* Overtime strip */}
        <div className={`ot-strip${isOvertime ? " visible" : ""}`} />

        {/* Controls */}
        <div className="btn-grid">
          {status === "idle"   && <button className="btn primary" onClick={handleStart}>Start</button>}
          {status === "running"&& <button className="btn"         onClick={handlePause}>Pause</button>}
          {status === "paused" && <button className="btn primary" onClick={handleResume}>Resume</button>}

          <button className="btn" onClick={handleReset} disabled={status === "idle" && duration === null}>
            Reset
          </button>

          <button className="btn danger" onClick={handleClear}>Clear</button>

          {/* Grid spacer when only 3 real buttons are showing */}
          {status !== "idle" && <div />}
        </div>
      </div>
    </div>
  );
}
