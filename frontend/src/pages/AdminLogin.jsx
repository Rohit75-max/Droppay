import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
    ShieldAlert, Terminal, Lock, Eye, EyeOff,
    Loader2, ArrowRight, ArrowLeft, Key, Cpu,
    Activity, Shield, AlertTriangle, CheckCircle, Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────
// ANIMATED NEURAL GRID BACKGROUND
// ─────────────────────────────────────────────────────────────
const NeuralGrid = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);
        const pts = Array.from({ length: 60 }, () => ({
            x: Math.random() * w, y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 1.5 + 0.5,
        }));
        let raf;
        const tick = () => {
            ctx.clearRect(0, 0, w, h);
            pts.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(220, 38, 38, 0.35)';
                ctx.fill();
            });
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
                    if (d < 130) {
                        ctx.beginPath();
                        ctx.moveTo(pts[i].x, pts[i].y);
                        ctx.lineTo(pts[j].x, pts[j].y);
                        ctx.strokeStyle = `rgba(220,38,38,${0.07 * (1 - d / 130)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            raf = requestAnimationFrame(tick);
        };
        tick();
        const onResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', onResize);
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
    }, []);
    return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-60" />;
};

// ─────────────────────────────────────────────────────────────
// TERMINAL TYPING TEXT
// ─────────────────────────────────────────────────────────────
const TerminalLine = ({ text, delay = 0, color = 'text-rose-500/60' }) => {
    const [typed, setTyped] = useState('');
    const [done, setDone] = useState(false);
    useEffect(() => {
        let i = 0;
        const t = setTimeout(() => {
            const iv = setInterval(() => {
                setTyped(text.slice(0, ++i));
                if (i >= text.length) { clearInterval(iv); setDone(true); }
            }, 30);
            return () => clearInterval(iv);
        }, delay);
        return () => clearTimeout(t);
    }, [text, delay]);
    return (
        <span className={`font-mono text-[10px] ${color}`}>
            {typed}{!done && <span className="animate-pulse">▮</span>}
        </span>
    );
};

// ─────────────────────────────────────────────────────────────
// PASSWORD STRENGTH METER
// ─────────────────────────────────────────────────────────────
const StrengthBar = ({ password }) => {
    const score = Math.min(
        (password.length >= 8 ? 1 : 0) +
        (/[A-Z]/.test(password) ? 1 : 0) +
        (/[0-9]/.test(password) ? 1 : 0) +
        (/[^A-Za-z0-9]/.test(password) ? 1 : 0),
        4
    );
    if (!password) return null;
    const labels = ['', 'Weak', 'Fair', 'Strong', 'Excellent'];
    const colors = ['', 'bg-rose-600', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];
    const textColors = ['', 'text-rose-500', 'text-amber-400', 'text-blue-400', 'text-emerald-400'];
    return (
        <div className="mt-2">
            <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : 'bg-slate-800'}`} />
                ))}
            </div>
            <p className={`text-[9px] font-bold uppercase tracking-widest ${textColors[score]}`}>
                {score > 0 ? `${labels[score]} passphrase` : ''}
            </p>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [authState, setAuthState] = useState('idle'); // idle | loading | success | error
    const [emailTouched, setEmailTouched] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const navigate = useNavigate();

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isLocked = attempts >= 5;

    // ── Auth handler ─────────────────────────────────────────
    const handleAdminAuth = async (e) => {
        e.preventDefault();
        if (isLocked) return;
        setLoading(true);
        setErrorMsg('');
        setAuthState('loading');

        try {
            const res = await axios.post('http://localhost:5001/api/auth/admin-login', { email, password });
            setAuthState('success');
            localStorage.setItem('token', res.data.token);
            setTimeout(() => navigate('/admin/secure-portal'), 1200);
        } catch (err) {
            const msg = err.response?.data?.msg || 'Authentication Sequence Failed.';
            setErrorMsg(msg);
            setAuthState('error');
            setAttempts(a => a + 1);
            setTimeout(() => setAuthState('idle'), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030509] flex items-center justify-center relative overflow-hidden font-mono selection:bg-rose-500/30">

            {/* ── Background layers ── */}
            <NeuralGrid />

            {/* Dot grid */}
            <div className="fixed inset-0 z-0 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(220,38,38,0.08) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            {/* CRT scanlines */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-30"
                style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)' }} />

            {/* Top glow line */}
            <div className="fixed top-0 w-full z-20">
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-rose-600 to-transparent" />
                <div className="h-8 w-full bg-gradient-to-b from-rose-600/10 to-transparent" />
            </div>

            {/* Corner brackets */}
            {[
                'top-6 left-6 border-t border-l',
                'top-6 right-6 border-t border-r',
                'bottom-6 left-6 border-b border-l',
                'bottom-6 right-6 border-b border-r',
            ].map((cls, i) => (
                <motion.div key={i} className={`fixed ${cls} w-10 h-10 border-rose-600/30 z-20`}
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.7 }} />
            ))}

            {/* ── Abort button ── */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                className="fixed top-7 left-8 z-50">
                <Link to="/" className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-500/15 bg-black/40 hover:bg-rose-500/10 hover:border-rose-500/35 text-rose-500/50 hover:text-rose-400 transition-all backdrop-blur-sm">
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.25em]">Abort Protocol</span>
                </Link>
            </motion.div>

            {/* ── System status strip (top right) ── */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="fixed top-6 right-8 z-50 flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-white/5 backdrop-blur-sm">
                    <Wifi className="w-3 h-3 text-emerald-500" />
                    <span className="text-[9px] text-emerald-500/80 font-bold uppercase tracking-widest">Secure Line</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-white/5 backdrop-blur-sm">
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-rose-500"
                        animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    <span className="text-[9px] text-rose-500/70 font-bold uppercase tracking-widest">
                        {authState === 'loading' ? 'Verifying' : authState === 'success' ? 'Authorized' : authState === 'error' ? 'Rejected' : 'Standby'}
                    </span>
                </div>
            </motion.div>

            {/* ── LEFT PANEL — Decorative information column ── */}
            <div className="hidden xl:flex flex-col gap-6 fixed left-12 top-1/2 -translate-y-1/2 z-10 w-64">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}
                    className="bg-black/50 border border-rose-500/10 rounded-2xl p-5 backdrop-blur-sm space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                        <Cpu className="w-4 h-4 text-rose-500/60" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-rose-500/60">System Telemetry</span>
                    </div>
                    {[
                        { label: 'ARES Version', value: 'v3.7.1' },
                        { label: 'Encryption', value: 'AES-256' },
                        { label: 'Protocol', value: 'TLS 1.3' },
                        { label: 'Region', value: 'IN-MUM-01' },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between">
                            <span className="text-[9px] text-slate-600 uppercase tracking-widest">{label}</span>
                            <span className="text-[9px] text-slate-400 font-bold font-mono">{value}</span>
                        </div>
                    ))}
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}
                    className="bg-black/50 border border-rose-500/10 rounded-2xl p-5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <Activity className="w-4 h-4 text-rose-500/60" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-rose-500/60">Live Feed</span>
                    </div>
                    <div className="space-y-2">
                        <TerminalLine text="> Node auth gateway active..." delay={1000} color="text-slate-600" />
                        <TerminalLine text="> Biometric scan idle..." delay={2000} color="text-slate-600" />
                        <TerminalLine text="> Waiting for credentials..." delay={3500} color="text-rose-500/50" />
                    </div>
                </motion.div>
            </div>

            {/* ── RIGHT PANEL — Security alerts ── */}
            <div className="hidden xl:flex flex-col gap-4 fixed right-12 top-1/2 -translate-y-1/2 z-10 w-56">
                {[
                    { icon: Shield, text: 'End-to-end encrypted session', color: 'text-emerald-500/60', border: 'border-emerald-500/10' },
                    { icon: AlertTriangle, text: 'All access attempts are logged', color: 'text-amber-500/60', border: 'border-amber-500/10' },
                    { icon: Lock, text: 'Multi-factor enforcement active', color: 'text-blue-500/60', border: 'border-blue-500/10' },
                    { icon: ShieldAlert, text: 'Zero-trust network policy', color: 'text-rose-500/60', border: 'border-rose-500/10' },
                ].map(({ icon: Icon, text, color, border }, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.15 }}
                        className={`flex items-start gap-3 p-4 bg-black/50 border ${border} rounded-xl backdrop-blur-sm`}>
                        <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${color}`} />
                        <p className={`text-[9px] font-bold uppercase tracking-wider leading-relaxed ${color}`}>{text}</p>
                    </motion.div>
                ))}
            </div>

            {/* ── MAIN CARD ── */}
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-[430px] px-4"
            >

                {/* Header */}
                <div className="text-center mb-8">
                    {/* Animated logo */}
                    <div className="relative inline-flex items-center justify-center mb-7">
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            className="absolute w-24 h-24 rounded-full border border-dashed border-rose-600/20"
                        />
                        <motion.div
                            animate={{ rotate: [360, 0] }}
                            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                            className="absolute w-32 h-32 rounded-full border border-dashed border-rose-600/10"
                        />
                        <div className="relative w-[72px] h-[72px] rounded-2xl flex items-center justify-center bg-gradient-to-br from-rose-950 to-[#1a0508] border border-rose-600/30 shadow-[0_0_40px_rgba(220,38,38,0.25)]">
                            <Terminal className="w-9 h-9 text-rose-500" />
                            {/* scan line */}
                            <motion.div className="absolute w-full h-[1px] bg-rose-500/40"
                                animate={{ y: [-36, 36, -36] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
                        </div>
                        {/* Pulsing ring */}
                        <motion.div className="absolute inset-0 rounded-2xl border-2 border-rose-500/20"
                            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ duration: 2.5, repeat: Infinity }} />
                    </div>

                    <motion.h1
                        className="text-[2.6rem] font-black tracking-tighter text-white italic flex items-center justify-center gap-3 leading-none mb-2"
                        animate={{ opacity: [0.85, 1, 0.85] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <ShieldAlert className="w-7 h-7 text-rose-600" />
                        Drop<span className="text-rose-500">Pay</span>
                    </motion.h1>

                    <p className="text-rose-600/60 text-[11px] font-bold uppercase tracking-[0.35em] mb-1">
                        Admin Control Center
                    </p>
                    <p className="text-slate-700 text-[9px] uppercase tracking-widest">
                        Authorized Personnel Only
                    </p>
                </div>

                {/* Card */}
                <div className="relative">
                    {/* Outer gradient border */}
                    <AnimatePresence>
                        {authState === 'success' && (
                            <motion.div key="success-ring"
                                className="absolute -inset-px rounded-3xl bg-gradient-to-br from-emerald-500/50 via-emerald-500/20 to-transparent"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                        )}
                        {authState === 'error' && (
                            <motion.div key="error-ring"
                                initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.5] }}
                                className="absolute -inset-px rounded-3xl bg-gradient-to-br from-rose-600/40 to-transparent" />
                        )}
                    </AnimatePresence>
                    <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-rose-700/20 via-transparent to-rose-900/10 pointer-events-none" />

                    <div className="relative bg-[#090c14]/95 border border-rose-500/12 rounded-3xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8),0_0_80px_rgba(220,38,38,0.06)] backdrop-blur-2xl">

                        {/* Top border line */}
                        <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-600 to-transparent" />

                        {/* Terminal top bar */}
                        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/[0.04]">
                            <motion.div className="w-3 h-3 rounded-full bg-rose-600/80 shadow-[0_0_8px_#dc2626]"
                                animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} />
                            <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/25" />
                            <div className="flex-1 mx-3 flex items-center">
                                <div className="bg-black/50 border border-white/5 rounded-md px-3 py-1 flex-1 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-600/80" />
                                    <span className="text-[9px] text-slate-600 font-mono">ares://admin.droppay.com/secure-auth</span>
                                </div>
                            </div>
                            <Key className="w-3.5 h-3.5 text-rose-500/40" />
                        </div>

                        <div className="p-8">

                            {/* ── Error / Success banners ── */}
                            <AnimatePresence>
                                {authState === 'error' && errorMsg && (
                                    <motion.div
                                        key="error"
                                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        className="bg-rose-950/60 border border-rose-600/40 rounded-2xl p-4 flex gap-3 overflow-hidden"
                                    >
                                        <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[9px] text-rose-400/60 uppercase tracking-wider font-bold mb-0.5">
                                                ⚠ Access Denied {attempts > 1 ? `— Attempt ${attempts}/5` : ''}
                                            </p>
                                            <p className="text-[11px] text-rose-300 font-bold">{errorMsg}</p>
                                        </div>
                                    </motion.div>
                                )}
                                {authState === 'success' && (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                                        className="bg-emerald-950/60 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3"
                                    >
                                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                                        <p className="text-[11px] text-emerald-300 font-bold">Clearance Granted — Redirecting to Secure Portal...</p>
                                    </motion.div>
                                )}
                                {isLocked && (
                                    <motion.div
                                        key="locked"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="bg-rose-950/80 border-2 border-rose-600/50 rounded-2xl p-5 text-center mb-5"
                                    >
                                        <Shield className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                                        <p className="text-rose-400 font-black text-sm uppercase tracking-widest mb-1">Account Locked</p>
                                        <p className="text-rose-500/60 text-[10px] font-bold uppercase tracking-wider">Too many failed attempts. Contact system administrator.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleAdminAuth} className="space-y-5">
                                {/* Email Field */}
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-rose-500/70">
                                        <Lock className="w-3 h-3" /> Clearance Key (Email)
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-rose-500 transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            onBlur={() => setEmailTouched(true)}
                                            disabled={isLocked || authState === 'success'}
                                            className="w-full bg-black/60 border border-slate-800/80 group-focus-within:border-rose-500/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl py-4 px-12 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-500/15 transition-all"
                                            placeholder="system.admin@droppay.com"
                                        />
                                        {/* Valid indicator */}
                                        {emailTouched && isEmailValid && (
                                            <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/70" />
                                        )}
                                        {emailTouched && email && !isEmailValid && (
                                            <AlertTriangle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500/70" />
                                        )}
                                        <div className="absolute inset-0 rounded-2xl bg-rose-500/[0.03] opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                                    </div>
                                    {emailTouched && email && !isEmailValid && (
                                        <p className="text-[9px] text-rose-500/60 font-bold pl-1">Invalid email format</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-rose-500/70">
                                        <Key className="w-3 h-3" /> Master Passphrase
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-rose-500 transition-colors" />
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            disabled={isLocked || authState === 'success'}
                                            className="w-full bg-black/60 border border-slate-800/80 group-focus-within:border-rose-500/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl py-4 px-12 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-500/15 transition-all"
                                            placeholder="••••••••••••••••"
                                        />
                                        <button type="button" onClick={() => setShowPass(v => !v)} tabIndex={-1}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 hover:text-rose-400 transition-colors p-1">
                                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <div className="absolute inset-0 rounded-2xl bg-rose-500/[0.03] opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                                    </div>
                                    <StrengthBar password={password} />
                                </div>

                                {/* Attempt indicator */}
                                {attempts > 0 && attempts < 5 && (
                                    <p className="text-[9px] text-amber-500/60 font-bold uppercase tracking-widest text-center">
                                        ⚠ {5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining before lockout
                                    </p>
                                )}

                                {/* Submit */}
                                <motion.button
                                    type="submit"
                                    disabled={loading || isLocked || !email || !password || authState === 'success' || !isEmailValid}
                                    whileHover={{ scale: 1.01, boxShadow: '0 12px 40px rgba(220,38,38,0.4)' }}
                                    whileTap={{ scale: 0.99 }}
                                    className="relative w-full overflow-hidden py-4 rounded-2xl font-black uppercase tracking-widest text-[13px] transition-all flex items-center justify-center gap-3 mt-2
                    bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white shadow-[0_8px_30px_rgba(220,38,38,0.25)]
                    disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 disabled:shadow-none disabled:cursor-not-allowed"
                                >
                                    {/* Shimmer sweep */}
                                    <motion.div
                                        className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/12 to-transparent"
                                        animate={{ x: ['-200%', '200%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                                    />
                                    {authState === 'success'
                                        ? <><CheckCircle className="w-5 h-5 text-emerald-300" /> Access Granted</>
                                        : loading
                                            ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying Identity...</>
                                            : <>Establish Uplink <ArrowRight className="w-4 h-4" /></>
                                    }
                                </motion.button>
                            </form>

                            {/* Divider */}
                            <div className="flex items-center gap-3 my-6">
                                <div className="flex-1 h-[1px] bg-white/[0.04]" />
                                <span className="text-[9px] text-slate-700 uppercase tracking-widest">Or</span>
                                <div className="flex-1 h-[1px] bg-white/[0.04]" />
                            </div>

                            {/* Escape link */}
                            <div className="text-center">
                                <Link to="/login"
                                    className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-600 hover:text-rose-400 uppercase tracking-[0.2em] transition-colors group">
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-rose-500">&gt;</span>
                                    Return to Citizen Auth Portal
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-rose-500">&lt;</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
                    className="mt-7 text-center space-y-1.5">
                    <p className="text-[9px] text-slate-700 uppercase tracking-[0.25em] font-bold">Unauthorized access strictly prohibited.</p>
                    <p className="text-[9px] text-slate-700 uppercase tracking-[0.25em] font-bold">All login attempts are permanently logged and traced.</p>
                    <div className="flex items-center justify-center gap-3 mt-3 text-[8px] text-slate-800 uppercase tracking-widest">
                        <span>DropPay ARES</span>
                        <span className="text-slate-800">·</span>
                        <span>AES-256 Encrypted</span>
                        <span className="text-slate-800">·</span>
                        <span>Zero Trust</span>
                        <span className="text-slate-800">·</span>
                        <span>TLS 1.3</span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
