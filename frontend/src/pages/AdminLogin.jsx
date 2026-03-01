import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
    ShieldAlert, Lock, Eye, EyeOff, Loader2,
    ArrowRight, ArrowLeft, Key, Shield,
    AlertTriangle, CheckCircle, Activity,
    TrendingUp, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Floating Orb ────────────────────────────────────────────
const Orb = ({ size, x, y, duration, color, delay }) => (
    <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: size, height: size, left: x, top: y, background: color, filter: 'blur(60px)' }}
        animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    />
);

// ─── Animated Stat Card ───────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm"
    >
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-4 h-4" />
        </div>
        <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{label}</p>
            <p className="text-sm font-black text-white leading-none">{value}</p>
        </div>
    </motion.div>
);

// ─── Strength Bar ─────────────────────────────────────────────
const StrengthBar = ({ password }) => {
    const score = Math.min(
        (password.length >= 8 ? 1 : 0) + (/[A-Z]/.test(password) ? 1 : 0) +
        (/[0-9]/.test(password) ? 1 : 0) + (/[^A-Za-z0-9]/.test(password) ? 1 : 0), 4);
    if (!password) return null;
    const colors = ['', 'bg-rose-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-400'];
    const labels = ['', 'Weak', 'Fair', 'Strong', 'Excellent'];
    const textC = ['', 'text-rose-400', 'text-amber-400', 'text-blue-400', 'text-emerald-400'];
    return (
        <div className="mt-2 space-y-1">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => (
                    <motion.div key={i}
                        className={`h-0.5 flex-1 rounded-full ${i <= score ? colors[score] : 'bg-slate-200'}`}
                        initial={{ scaleX: 0 }} animate={{ scaleX: i <= score ? 1 : 1 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }} />
                ))}
            </div>
            <p className={`text-[9px] font-bold uppercase tracking-widest ${textC[score]}`}>
                {labels[score]} passphrase
            </p>
        </div>
    );
};

// ─── Premium Input ────────────────────────────────────────────
const PremiumInput = ({ icon: Icon, label, type, value, onChange, onBlur, disabled, placeholder, rightEl }) => {
    const [focused, setFocused] = useState(false);
    return (
        <div className="space-y-2">
            <label className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] transition-colors ${focused ? 'text-emerald-600' : 'text-slate-400'}`}>
                <Icon className="w-3 h-3" /> {label}
            </label>
            <div className="relative group">
                <motion.div
                    className="absolute -inset-px rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 opacity-0 pointer-events-none"
                    animate={{ opacity: focused ? 0.6 : 0, backgroundPosition: focused ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%' }}
                    transition={{ opacity: { duration: 0.2 }, backgroundPosition: { duration: 3, repeat: Infinity } }}
                    style={{ backgroundSize: '200% 200%' }}
                />
                <div className="relative">
                    <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focused ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <input
                        type={type}
                        value={value}
                        onChange={onChange}
                        onBlur={e => { setFocused(false); onBlur && onBlur(e); }}
                        onFocus={() => setFocused(true)}
                        disabled={disabled}
                        placeholder={placeholder}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-12 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-transparent focus:ring-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {rightEl && <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightEl}</div>}
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [authState, setAuthState] = useState('idle');
    const [emailTouched, setEmailTouched] = useState(false);
    const [attempts, setAttempts] = useState(0);

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isLocked = attempts >= 5;

    const handleAdminAuth = async (e) => {
        e.preventDefault();
        if (isLocked) return;
        setLoading(true); setErrorMsg(''); setAuthState('loading');

        try {
            // ─── NEW DYNAMIC API URL ───────────────────────────────────────
            const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

            const res = await axios.post(`${API_BASE_URL}/api/auth/admin-login`,
                { email, password },
                { withCredentials: true } // ESSENTIAL: Allows the browser to store the secure cookie
            );
            // ───────────────────────────────────────────────────────────────

            setAuthState('success');
            localStorage.setItem('token', res.data.token);
            setTimeout(() => {
                navigate('/admin/secure-portal');
            }, 1200);
        } catch (err) {
            const msg = err.response?.data?.msg || 'Authentication failed.';
            setErrorMsg(msg); setAuthState('error'); setAttempts(a => a + 1);
            setTimeout(() => setAuthState('idle'), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans overflow-hidden">

            {/* Soft background blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-100/60 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-100/50 blur-[100px]" />
            </div>

            {/* ── MAIN SHELL ─────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-[960px] rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row border border-white/80 bg-white"
                style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.8)' }}
            >
                {/* ── LEFT — Dark emerald branding panel ── */}
                <div className="relative lg:w-[380px] shrink-0 bg-[#061a12] overflow-hidden flex flex-col justify-between p-6 lg:p-8 min-h-[260px] lg:min-h-0">

                    {/* Floating orbs */}
                    <Orb size={260} x="-60px" y="-60px" color="rgba(16,185,129,0.22)" duration={7} delay={0} />
                    <Orb size={180} x="60%" y="55%" color="rgba(6,182,212,0.18)" duration={9} delay={2} />
                    <Orb size={120} x="10%" y="70%" color="rgba(129,140,248,0.14)" duration={6} delay={1} />

                    {/* Animated dot grid */}
                    <div className="absolute inset-0 pointer-events-none opacity-20"
                        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

                    {/* Scan line sweep */}
                    <motion.div
                        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent pointer-events-none"
                        animate={{ top: ['-2%', '102%'] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                    />

                    {/* Brand */}
                    <div className="relative z-10">
                        {/* Back button — inside panel, no fixed overlay */}
                        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                            className="mb-4">
                            <Link to="/" className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.06] hover:bg-white/10 text-white/50 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest">
                                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                                Back
                            </Link>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                            className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                                <ShieldAlert className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <span className="text-white font-black text-xl italic tracking-tight">Drop<span className="text-emerald-400">Pay</span></span>
                                <p className="text-white/30 text-[9px] uppercase tracking-[0.25em] font-bold">Admin Console</p>
                            </div>
                        </motion.div>

                        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                            className="text-3xl lg:text-4xl font-black italic text-white leading-[1] tracking-tighter mb-2">
                            Zero-Trust.<br />
                            <span className="text-transparent bg-clip-text"
                                style={{ backgroundImage: 'linear-gradient(135deg, #10B981, #06b6d4, #818cf8)', WebkitBackgroundClip: 'text' }}>
                                Full Control.
                            </span><br />
                            Always.
                        </motion.h2>

                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                            className="text-white/40 text-xs font-medium leading-relaxed max-w-xs mb-4">
                            Every access attempt is encrypted, fingerprinted, and permanently logged. No exceptions.
                        </motion.p>

                        {/* System health stats */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <StatCard icon={Shield} label="Threat Level" value="GREEN" color="bg-emerald-500/20 text-emerald-400" delay={0.7} />
                            <StatCard icon={Activity} label="Auth Latency" value="18ms" color="bg-cyan-500/20 text-cyan-400" delay={0.8} />
                            <StatCard icon={Globe} label="Encryption" value="AES-256" color="bg-indigo-500/20 text-indigo-400" delay={0.9} />
                            <StatCard icon={TrendingUp} label="Sessions Today" value="1,204" color="bg-amber-500/20 text-amber-400" delay={1.0} />
                        </div>

                        {/* Live access log */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}
                            className="rounded-xl bg-white/[0.04] border border-white/8 p-3 space-y-1.5">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
                                Live Access Log
                            </p>
                            {[
                                { time: '14:16:02', msg: '> Auth gateway: node sync active', color: 'text-emerald-400/70' },
                                { time: '14:15:58', msg: '> Session encrypted: TLS 1.3', color: 'text-cyan-400/60' },
                                { time: '14:15:41', msg: '> MFA challenge issued', color: 'text-amber-400/60' },
                                { time: '14:15:30', msg: '> IP flagged: 0 anomalies', color: 'text-white/30' },
                            ].map(({ time, msg, color }, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.1 + i * 0.12 }}
                                    className="flex items-start gap-2">
                                    <span className="text-[8px] text-white/20 font-mono mt-0.5 shrink-0">{time}</span>
                                    <span className={`text-[9px] font-mono ${color}`}>{msg}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Bottom security badges */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
                        className="relative z-10 flex flex-wrap gap-1.5 mt-4">
                        {[
                            { icon: Shield, text: 'AES-256', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                            { icon: ShieldAlert, text: 'Zero Trust', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
                            { icon: AlertTriangle, text: 'MFA Enforced', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                        ].map(({ icon: Icon, text, color }) => (
                            <div key={text} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${color}`}>
                                <Icon className="w-3 h-3" /> {text}
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* ── RIGHT — Login form ── */}
                <div className="flex-1 flex flex-col justify-center p-6 lg:p-10 bg-white">

                    {/* Status strip */}
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className="flex items-center justify-between mb-5">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Admin Gateway</p>
                            <p className="text-[10px] text-slate-300 uppercase tracking-widest">Authorized Personnel Only</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-100 bg-slate-50">
                            <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                {authState === 'loading' ? 'Verifying' : authState === 'success' ? 'Authorized' : authState === 'error' ? 'Rejected' : 'Standby'}
                            </span>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
                        <h3 className="text-2xl font-black italic tracking-tighter text-slate-900 mb-1">Welcome back.</h3>
                        <p className="text-slate-400 text-sm font-medium mb-5">Enter your clearance credentials to access the control center.</p>
                    </motion.div>

                    {/* ── Banners ── */}
                    <AnimatePresence>
                        {authState === 'error' && errorMsg && (
                            <motion.div key="error"
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex gap-3 overflow-hidden">
                                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[9px] text-rose-400 uppercase tracking-wider font-black mb-0.5">
                                        Access Denied {attempts > 1 ? `— ${attempts}/5 attempts` : ''}
                                    </p>
                                    <p className="text-[12px] text-rose-600 font-bold">{errorMsg}</p>
                                </div>
                            </motion.div>
                        )}
                        {authState === 'success' && (
                            <motion.div key="success"
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                                className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <p className="text-[12px] text-emerald-700 font-bold">Clearance Granted — Redirecting...</p>
                            </motion.div>
                        )}
                        {isLocked && (
                            <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 text-center mb-5">
                                <Shield className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                                <p className="text-rose-600 font-black text-base uppercase tracking-widest mb-1">Account Locked</p>
                                <p className="text-rose-400 text-[11px] font-bold">Contact system administrator.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Form ── */}
                    <form onSubmit={handleAdminAuth} className="space-y-5">
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                            <PremiumInput
                                icon={Lock} label="Clearance Key (Email)"
                                type="email" value={email}
                                onChange={e => setEmail(e.target.value)}
                                onBlur={() => setEmailTouched(true)}
                                disabled={isLocked || authState === 'success'}
                                placeholder="system.admin@droppay.com"
                                rightEl={emailTouched && email ? (
                                    isEmailValid
                                        ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        : <AlertTriangle className="w-4 h-4 text-rose-400" />
                                ) : null}
                            />
                            {emailTouched && email && !isEmailValid && (
                                <p className="text-[9px] text-rose-400 font-bold mt-1 pl-1">Invalid email format</p>
                            )}
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                            <PremiumInput
                                icon={Key} label="Master Passphrase"
                                type={showPass ? 'text' : 'password'} value={password}
                                onChange={e => setPassword(e.target.value)}
                                disabled={isLocked || authState === 'success'}
                                placeholder="••••••••••••••••"
                                rightEl={
                                    <button type="button" onClick={() => setShowPass(v => !v)} tabIndex={-1}
                                        className="text-slate-300 hover:text-emerald-500 transition-colors">
                                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                }
                            />
                            <StrengthBar password={password} />
                        </motion.div>

                        {attempts > 0 && attempts < 5 && (
                            <p className="text-[9px] text-amber-500 font-black uppercase tracking-widest text-center">
                                ⚠ {5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining
                            </p>
                        )}

                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                            <motion.button type="submit"
                                disabled={loading || isLocked || !email || !password || authState === 'success' || !isEmailValid}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.985 }}
                                className="relative w-full overflow-hidden py-4 rounded-2xl font-black uppercase tracking-widest text-[13px] flex items-center justify-center gap-3 transition-all
                                bg-gradient-to-r from-emerald-600 to-emerald-500 text-white
                                disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed"
                            >
                                {/* Shimmer sweep */}
                                <motion.div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                    animate={{ x: ['-200%', '200%'] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 3 }} />
                                {authState === 'success' ? <><CheckCircle className="w-5 h-5" /> Access Granted</>
                                    : loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying Identity...</>
                                        : <>Establish Uplink <ArrowRight className="w-4 h-4" /></>}
                            </motion.button>
                        </motion.div>
                    </form>

                    {/* Divider + link */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-slate-100" />
                        <span className="text-[9px] text-slate-300 uppercase tracking-widest">or</span>
                        <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    <div className="text-center">
                        <Link to="/login"
                            className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-[0.2em] transition-colors group">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500 font-mono">&gt;</span>
                            Return to Citizen Auth Portal
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500 font-mono">&lt;</span>
                        </Link>
                    </div>

                    {/* Footer note */}
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                        className="mt-8 text-center text-[9px] text-slate-300 uppercase tracking-[0.2em] font-bold">
                        Unauthorized access strictly prohibited. All attempts are permanently traced.
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
