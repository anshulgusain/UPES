import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

/* ── Animated Background ── */
function BgCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId, t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const pts = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth * 0.65,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.7 + 0.2,
    }));

    const shapes = Array.from({ length: 18 }, () => ({
      x: Math.random() * window.innerWidth * 0.62,
      y: Math.random() * window.innerHeight,
      sz: Math.random() * 20 + 9,
      tri: Math.random() > 0.5,
      a: Math.random() * 0.12 + 0.04,
      vx: (Math.random() - 0.5) * 0.09,
      vy: (Math.random() - 0.5) * 0.09,
      rot: Math.random() * Math.PI * 2,
      rv: (Math.random() - 0.5) * 0.004,
    }));

    const drawSwirl = () => {
      const cx = canvas.width * 0.30;
      const cy = canvas.height * 0.50;
      const time = t * 0.008;

      // Outer glow
      const gO = ctx.createRadialGradient(cx, cy, 0, cx, cy, 240);
      gO.addColorStop(0, 'rgba(0,195,255,0.12)');
      gO.addColorStop(0.55, 'rgba(0,160,255,0.05)');
      gO.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gO;
      ctx.beginPath(); ctx.arc(cx, cy, 240, 0, Math.PI * 2); ctx.fill();

      // Rotating ellipse rings
      for (let r = 0; r < 5; r++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * (r % 2 === 0 ? 1 : -0.75) + r * 0.55);
        ctx.beginPath();
        ctx.ellipse(0, 0, 78 + r * 29, 52 + r * 18, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,215,255,${0.17 - r * 0.024})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      // Dense dot cloud
      for (let i = 0; i < 270; i++) {
        const a = (i / 270) * Math.PI * 2;
        const sp = Math.sin(i * 0.14 + time * 2) * 0.5 + 0.5;
        const dist = 38 + sp * 158 + Math.sin(a * 3 + time) * 19;
        const wb = Math.cos(a * 2 - time * 1.4) * 29;
        const px = cx + Math.cos(a) * dist + Math.sin(a * 2 + time) * wb * 0.4;
        const py = cy + Math.sin(a) * dist * 0.63 + Math.cos(a * 2 + time) * wb * 0.3;
        const al = 0.28 + sp * 0.48;
        const rd = 0.75 + sp * 1.35;
        const g = ctx.createRadialGradient(px, py, 0, px, py, rd * 3);
        g.addColorStop(0, `rgba(0,228,255,${al})`);
        g.addColorStop(1, 'rgba(0,200,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(px, py, rd * 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(155,242,255,${al * 0.88})`;
        ctx.beginPath(); ctx.arc(px, py, rd * 0.65, 0, Math.PI * 2); ctx.fill();
      }

      // Comet tails
      for (let tail = 0; tail < 3; tail++) {
        const ta = time * (1.2 + tail * 0.28) + tail * 2.1;
        const tx1 = cx + Math.cos(ta) * 145, ty1 = cy + Math.sin(ta) * 92;
        const tx2 = cx + Math.cos(ta + 0.58) * 62, ty2 = cy + Math.sin(ta + 0.58) * 40;
        const gt = ctx.createLinearGradient(tx2, ty2, tx1, ty1);
        gt.addColorStop(0, 'rgba(0,215,255,0)');
        gt.addColorStop(1, `rgba(0,238,255,${0.48 - tail * 0.1})`);
        ctx.strokeStyle = gt;
        ctx.lineWidth = 1.8 - tail * 0.35;
        ctx.beginPath(); ctx.moveTo(tx2, ty2); ctx.lineTo(tx1, ty1); ctx.stroke();
      }
    };

    const draw = () => {
      t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lines between particles
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 92) {
            ctx.strokeStyle = `rgba(0,205,255,${0.1 * (1 - d / 92)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
      }

      // Particles
      pts.forEach(p => {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(0,225,255,${p.a * 0.5})`);
        g.addColorStop(1, 'rgba(0,225,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(175,242,255,${p.a})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width * 0.65;
        if (p.x > canvas.width * 0.65) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      // Shapes
      shapes.forEach(s => {
        ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.rot);
        ctx.strokeStyle = `rgba(85,215,255,${s.a})`; ctx.lineWidth = 1;
        if (s.tri) {
          ctx.beginPath(); ctx.moveTo(0, -s.sz); ctx.lineTo(s.sz * .866, s.sz * .5); ctx.lineTo(-s.sz * .866, s.sz * .5); ctx.closePath(); ctx.stroke();
        } else {
          ctx.beginPath(); ctx.arc(0, 0, s.sz, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.restore();
        s.x += s.vx; s.y += s.vy; s.rot += s.rv;
        if (s.x < -60) s.x = canvas.width * 0.65 + 60;
        if (s.x > canvas.width * 0.65 + 60) s.x = -60;
        if (s.y < -60) s.y = canvas.height + 60;
        if (s.y > canvas.height + 60) s.y = -60;
      });

      drawSwirl();
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

/* ── Login Page ── */
export default function LoginPage() {
  const [sapId, setSapId] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [captcha, setCaptcha] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captcha) { setError('Please verify you are not a robot.'); return; }
    setError(''); setLoading(true);
    try { await login(sapId, password); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Invalid credentials.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={s.root}>
      {/* Base background: navy left → purple-magenta right — matching UPES exactly */}
      <div style={s.bg} />
      <BgCanvas />

      {/* Centered layout: flex row, card floats on right */}
      <div style={s.layout}>

        {/* Left empty area — canvas shows through */}
        <div style={s.leftGap} />

        {/* RIGHT: floating card — NOT a full-height panel */}
        <div style={s.cardOuter}>
          {/* 
            The card itself matches the UPES card exactly:
            - light sky-blue at top
            - medium purple at bottom
            - rounded corners all around
            - white inputs
            - floating, not edge-to-edge
          */}
          <div style={s.card}>

            {/* Logo area — centered stacked */}
            <div style={s.logoWrap}>
              <svg width="62" height="64" viewBox="0 0 70 72" fill="none">
                {/* Outer shield */}
                <path d="M35 3L65 16V40C65 56 35 69 35 69C35 69 5 56 5 40V16Z"
                  fill="white" stroke="rgba(0,0,0,0.07)" strokeWidth="1"/>
                {/* Orange segment */}
                <path d="M35 7L35 36L14 25C16 12 26 7 35 7Z" fill="#F97316"/>
                {/* Blue segment */}
                <path d="M35 7L56 25L35 36Z" fill="#3B82F6"/>
                {/* Purple segment */}
                <path d="M35 36L56 25L55 42C52 54 44 61 35 65Z" fill="#8B5CF6"/>
                {/* Pink segment */}
                <path d="M35 36L35 65C26 61 18 54 15 42L14 25Z" fill="#EC4899"/>
                {/* White dividers */}
                <line x1="35" y1="7" x2="35" y2="65" stroke="white" strokeWidth="1.6" opacity="0.9"/>
                <line x1="14" y1="25" x2="56" y2="25" stroke="white" strokeWidth="1.6" opacity="0.9"/>
                <line x1="14" y1="25" x2="35" y2="65" stroke="white" strokeWidth="1.1" opacity="0.65"/>
                <line x1="56" y1="25" x2="35" y2="65" stroke="white" strokeWidth="1.1" opacity="0.65"/>
              </svg>

              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start' }}>
                <div style={s.upesWord}>
                  <span style={{ color: '#F97316' }}>U</span>
                  <span style={{ color: '#1a1a2e' }}>PES</span>
                </div>
                <div style={s.univWord}>UNIVERSITY OF TOMORROW</div>
              </div>
            </div>

            <h2 style={s.title}>Welcome to MyUPES</h2>

            <form onSubmit={handleSubmit} style={s.form}>

              <div style={s.field}>
                <label style={s.label}>User Name</label>
                <input
                  type="text"
                  placeholder="Enter a valid user name"
                  value={sapId}
                  onChange={e => setSapId(e.target.value)}
                  style={s.input}
                  required
                />
              </div>

              <div style={s.field}>
                <label style={s.label}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ ...s.input, paddingRight: '44px' }}
                    required
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)} style={s.eyeBtn}>
                    {showPass
                      ? <EyeOff size={17} color="#94a3b8" />
                      : <Eye size={17} color="#94a3b8" />}
                  </button>
                </div>
              </div>

              {/* reCAPTCHA */}
              <div style={s.captchaBox}>
                <div style={s.captchaL}>
                  <div
                    onClick={() => setCaptcha(v => !v)}
                    style={{
                      ...s.checkbox,
                      background: captcha ? '#4f46e5' : 'white',
                      borderColor: captcha ? '#4f46e5' : '#bbb',
                    }}
                  >
                    {captcha && (
                      <svg viewBox="0 0 12 10" width="12" height="10" fill="none">
                        <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span style={s.robotTxt}>I'm not a robot</span>
                </div>
                <div style={s.captchaR}>
                  <svg width="36" height="36" viewBox="0 0 64 64" fill="none">
                    <path d="M32 6C18 6 8 18 8 32" stroke="#4285F4" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <path d="M8 32C8 46 18 58 32 58" stroke="#34A853" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <path d="M32 58C46 58 56 46 56 32" stroke="#FBBC05" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <path d="M56 32C56 18 46 6 32 6" stroke="#EA4335" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <circle cx="32" cy="32" r="8" fill="#4285F4" />
                  </svg>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#5f6368', letterSpacing: '0.4px' }}>reCAPTCHA</span>
                  <span style={{ fontSize: '8px', color: '#9ca3af' }}>Privacy · Terms</span>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div style={s.remRow}>
                <label style={s.remLabel}>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    style={{ width: 14, height: 14, accentColor: '#4f46e5', cursor: 'pointer' }}
                  />
                  <span style={s.remTxt}>Remember me</span>
                </label>
                <button type="button" style={s.forgotBtn}>Forgot Password?</button>
              </div>

              {error && <div style={s.errBox}>{error}</div>}

              <button type="submit" disabled={loading} style={s.loginBtn}>
                {loading ? <span style={s.spin} /> : 'LOGIN'}
              </button>

            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        input::placeholder { color: rgba(150, 160, 200, 0.8); }
        input:focus {
          outline: none;
          border-color: rgba(100, 130, 220, 0.6) !important;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
        }

        /* ── MOBILE: card becomes full-width, vertically centered ── */
        @media (max-width: 768px) {
          .upes-layout { justify-content: center !important; align-items: center !important; padding: 24px 0 !important; }
          .upes-left  { display: none !important; }
          .upes-card-outer {
            width: 100% !important;
            padding: 20px 16px !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .upes-card {
            max-width: 360px !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ────────────────────────────────
   Styles — matching UPES exactly
──────────────────────────────── */
const s = {
  root: {
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
  },

  /* Full-page background: dark navy-blue left → rich purple-magenta right */
  bg: {
    position: 'fixed', inset: 0, zIndex: 0,
    background: `linear-gradient(115deg,
      #040c28 0%,
      #060e38 20%,
      #0e0430 45%,
      #2a0848 72%,
      #3d0555 88%,
      #2a0440 100%)`,
  },

  /* Full-screen flex row */
  layout: {
    position: 'relative', zIndex: 1,
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',        /* vertically center the card */
    padding: '40px 60px 40px 0', /* right padding so card doesn't touch edge */
    className: 'upes-layout',
  },

  /* Left spacer — canvas shows through */
  leftGap: {
    flex: 1,
    className: 'upes-left',
  },

  /* Outer wrapper for the card — controls right-side position */
  cardOuter: {
    className: 'upes-card-outer',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* 
   * THE CARD — matches UPES exactly:
   * • ~410px wide, floating
   * • light sky-blue (#7ec8e3 / #a8d8ea) at top
   * • medium purple (#6b46b1 / #7c3aed) at bottom
   * • white rounded box
   * • rounded corners ~16px all around
   */
  card: {
    className: 'upes-card',
    width: '410px',
    background: 'transparent linear-gradient(90deg, #1fbcee 0%, #661c8e 100%) 0 0 no-repeat padding-box',
    borderRadius: '16px',
    padding: '36px 32px 30px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.25)',
  },

  /* Logo */
  logoWrap: {
    display: 'flex', flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  upesWord: {
    fontSize: '36px', fontWeight: 900,
    lineHeight: 1, letterSpacing: '-0.5px',
  },
  univWord: {
    fontSize: '8.5px', letterSpacing: '2.5px',
    color: 'rgba(20,20,60,0.65)', fontWeight: 700,
    marginTop: '3px',
  },

  title: {
    textAlign: 'center',
    color: 'white',
    fontSize: '20px', fontWeight: 700,
    margin: '0 0 22px',
    textShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },

  form: { display: 'flex', flexDirection: 'column', gap: '13px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },

  label: {
    fontSize: '13px', fontWeight: 700,
    color: 'white',
    textShadow: '0 1px 2px rgba(0,0,0,0.15)',
  },

  /* WHITE inputs — exactly like the UPES site */
  input: {
    padding: '11px 14px',
    background: 'white',
    border: '1.5px solid rgba(200,210,240,0.7)',
    borderRadius: '7px',
    fontSize: '14px', color: '#1e293b',
    fontFamily: 'inherit',
    width: '100%', boxSizing: 'border-box',
    outline: 'none',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },

  eyeBtn: {
    position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', padding: '3px',
  },

  /* White reCAPTCHA box */
  captchaBox: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'white', borderRadius: '7px', padding: '10px 13px',
    border: '1.5px solid rgba(200,210,240,0.7)',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
  },
  captchaL: { display: 'flex', alignItems: 'center', gap: '11px' },
  checkbox: {
    width: '20px', height: '20px', borderRadius: '3px', border: '1.5px solid',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s', flexShrink: 0,
  },
  robotTxt: { fontSize: '13.5px', color: '#374151', fontWeight: 500 },
  captchaR: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' },

  remRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  remLabel: { display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' },
  remTxt: { fontSize: '13px', fontWeight: 600, color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.15)' },
  forgotBtn: {
    background: 'none', border: 'none',
    color: 'white', fontSize: '13px',
    cursor: 'pointer', fontWeight: 600,
    textShadow: '0 1px 2px rgba(0,0,0,0.15)',
  },

  errBox: {
    background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)',
    color: '#fee2e2', borderRadius: '7px', padding: '9px 12px',
    fontSize: '13px', textAlign: 'center',
  },

  /* LOGIN button — teal/steel blue matching UPES */
  loginBtn: {
    padding: '13px', width: '100%',
    background: 'linear-gradient(90deg, #1a9fd4 0%, #1e7fc0 50%, #2060aa 100%)',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '14px', fontWeight: 800, letterSpacing: '3px',
    cursor: 'pointer', marginTop: '4px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 18px rgba(20,60,180,0.5)',
    transition: 'opacity 0.2s, transform 0.1s',
  },

  spin: {
    width: '20px', height: '20px',
    border: '2px solid rgba(255,255,255,0.35)',
    borderTopColor: 'white', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    display: 'inline-block',
  },
};