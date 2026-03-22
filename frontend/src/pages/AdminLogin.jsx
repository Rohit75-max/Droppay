import React, { useState } from 'react';
import axios from '../api/axios';
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
const StatCard = ({ icon: Icon, label, value, color, delay, isDark }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-sm ${isDark ? 'bg-white/[0.06] border-white/10' : 'bg-slate-900/[0.04] border-slate-900/10'}`}
    >
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-4 h-4" />
        </div>
        <div>
            <p className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{label}</p>
            <p className={`text-sm font-black leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
        </div>
    </motion.div>
);

// ─── Strength Bar ─────────────────────────────────────────────
const StrengthBar = ({ password, isDark }) => {
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
                        className={`h-0.5 flex-1 rounded-full ${i <= score ? colors[score] : isDark ? 'bg-white/10' : 'bg-slate-200'}`}
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
const PremiumInput = ({ icon: Icon, label, type, value, onChange, onBlur, disabled, placeholder, rightEl, isDark }) => {
    const [focused, setFocused] = useState(false);
    return (
        <div className="space-y-2">
            <label className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] transition-colors ${focused ? 'text-[#10B981]' : isDark ? 'text-white/40' : 'text-slate-400'}`}>
                <Icon className="w-3 h-3" /> {label}
            </label>
            <div className="relative group">
                <div className="relative">
                    <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focused ? 'text-[#10B981]' : isDark ? 'text-white/30' : 'text-slate-300'}`} />
                    <input
                        type={type}
                        value={value}
                        onChange={onChange}
                        onBlur={e => { setFocused(false); onBlur && onBlur(e); }}
                        onFocus={() => setFocused(true)}
                        disabled={disabled}
                        placeholder={placeholder}
                        className={`w-full rounded-2xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:ring-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isDark
                                ? `bg-white/[0.05] border ${focused ? 'border-[#10B981]' : 'border-white/10'} text-white placeholder:text-white/20`
                                : `bg-slate-50 border ${focused ? 'border-[#10B981]' : 'border-slate-200'} text-slate-800 placeholder:text-slate-300`
                            }`}
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
    const theme = 'dark';
    const isDark = theme === 'dark';
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
            const res = await axios.post('/api/auth/admin-login',
                { email, password }
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
        <div className={`relative min-h-screen w-full flex flex-col lg:flex-row font-sans overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#030a06]' : 'bg-slate-50'}`}>

            {/* FULL IMMERSIVE BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {isDark ? (
                    <>
                        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-20%] right-[-10%] w-[550px] h-[550px] rounded-full bg-emerald-900/40 blur-[120px]" />
                        <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, -5, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[-20%] left-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-900/30 blur-[100px]" />
                    </>
                ) : (
                    <>
                        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-20%] right-[-10%] w-[550px] h-[550px] rounded-full bg-emerald-100/60 blur-[120px]" />
                        <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, -5, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[-20%] left-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-100/50 blur-[100px]" />
                    </>
                )}

                {/* Global Immersive Elements */}
                {isDark && (
                    <div className="absolute inset-0">
                        {/* Holographic Moving Gradients */}
                        <Orb size={500} x="10%" y="-10%" color="rgba(16,185,129,0.15)" duration={9} delay={0} />
                        <Orb size={350} x="70%" y="50%" color="rgba(6,182,212,0.12)" duration={14} delay={2} />
                        <Orb size={300} x="20%" y="80%" color="rgba(244,114,182,0.1)" duration={11} delay={1} />

                        {/* Dynamic Cyber Grid */}
                        <motion.div 
                            className="absolute inset-0 pointer-events-none opacity-[0.05]"
                            style={{ backgroundImage: 'linear-gradient(to right, #10B981 1px, transparent 1px), linear-gradient(to bottom, #10B981 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                            animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        />

                        {/* Rotating Geometric Data Rings */}
                        <motion.div 
                            className="absolute top-[15%] right-[5%] w-[600px] h-[600px] rounded-full border border-[#10B981]/15 border-dashed pointer-events-none"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div 
                            className="absolute top-[25%] left-[5%] w-[350px] h-[350px] rounded-full border border-[#06b6d4]/15 pointer-events-none"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                        />

                        {/* Active Data Streams */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[...Array(10)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-[1px] h-64 bg-gradient-to-b from-transparent via-[#10B981]/50 to-transparent"
                                    style={{ left: `${(i + 1) * 10}%` }}
                                    animate={{ top: ['-20%', '120%'] }}
                                    transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
                                />
                            ))}
                        </div>

                        {/* Scan line sweep */}
                        <motion.div
                            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent pointer-events-none blur-[1px]"
                            animate={{ top: ['-5%', '105%'] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                        />
                    </div>
                )}
            </div>

            {/* ── LEFT — Holographic Branding Pillar ── */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex-1 lg:flex-[1.2] flex flex-col justify-center px-6 py-12 sm:px-12 sm:py-16 mx-auto lg:p-24 min-h-[50vh] lg:min-h-screen z-10 max-w-2xl lg:max-w-none"
            >
                {/* Brand */}
                <div className="relative z-20">
                    {/* Back button */}
                    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                        className="mb-4">
                        <Link to="/" className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-[9px] font-black uppercase tracking-widest ${isDark ? 'border-white/10 bg-white/[0.06] hover:bg-white/10 text-white/50 hover:text-white' : 'border-slate-900/10 bg-slate-900/[0.04] hover:bg-slate-900/[0.08] text-slate-500 hover:text-slate-900'}`}>
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
                            <span className={`font-black text-xl italic tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Drop<span className="text-emerald-400">Pay</span></span>
                            <p className={`text-[9px] uppercase tracking-[0.25em] font-bold ${isDark ? 'text-white/30' : 'text-slate-400'}`}>Admin Console</p>
                        </div>
                    </motion.div>

                    <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className={`text-3xl lg:text-4xl font-black italic leading-[1] tracking-tighter mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Secure.<br />
                        <span className="text-transparent bg-clip-text"
                            style={{ backgroundImage: 'linear-gradient(135deg, #10B981, #06b6d4, #818cf8)', WebkitBackgroundClip: 'text' }}>
                            Powerful.
                        </span><br />
                        Admin Access.
                    </motion.h2>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                        className={`text-xs font-medium leading-relaxed max-w-xs mb-4 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                        All access is strictly monitored and limited to authorized dropPay personnel.
                    </motion.p>

                    {/* System health stats */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        <StatCard icon={Shield} label="System Status" value="Online" color={isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-500/10 text-emerald-600"} delay={0.7} isDark={isDark} />
                        <StatCard icon={Activity} label="Auth Latency" value="18ms" color={isDark ? "bg-cyan-500/20 text-cyan-400" : "bg-cyan-500/10 text-cyan-600"} delay={0.8} isDark={isDark} />
                        <StatCard icon={Globe} label="Encryption" value="AES-256" color={isDark ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-500/10 text-indigo-600"} delay={0.9} isDark={isDark} />
                        <StatCard icon={TrendingUp} label="Sessions Today" value="1,204" color={isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-500/10 text-amber-600"} delay={1.0} isDark={isDark} />
                    </div>

                    {/* Live access log */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}
                        className={`rounded-xl border p-3 space-y-1.5 ${isDark ? 'bg-white/[0.04] border-white/8' : 'bg-slate-900/[0.03] border-slate-900/10'}`}>
                        <p className={`text-[9px] font-black uppercase tracking-widest mb-2 flex items-center gap-2 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
                            Recent Activity
                        </p>
                        {[
                            { time: '14:16:02', msg: '> Gateway operational', darkColor: 'text-emerald-400/70', lightColor: 'text-emerald-600/80' },
                            { time: '14:15:58', msg: '> Secure session established', darkColor: 'text-cyan-400/60', lightColor: 'text-cyan-600/80' },
                            { time: '14:15:41', msg: '> Admin identity verified', darkColor: 'text-amber-400/60', lightColor: 'text-amber-600/80' },
                            { time: '14:15:30', msg: '> Systems normal', darkColor: 'text-white/30', lightColor: 'text-slate-400' },
                        ].map(({ time, msg, darkColor, lightColor }, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.1 + i * 0.12 }}
                                className="flex items-start gap-2">
                                <span className={`text-[8px] font-mono mt-0.5 shrink-0 ${isDark ? 'text-white/20' : 'text-slate-400'}`}>{time}</span>
                                <span className={`text-[9px] font-mono ${isDark ? darkColor : lightColor}`}>{msg}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Bottom security badges */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
                    className="relative z-10 flex flex-wrap gap-1.5 mt-4">
                    {[
                        { icon: Shield, text: 'AES-256', darkColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', lightColor: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                        { icon: ShieldAlert, text: 'Zero Trust', darkColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', lightColor: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
                        { icon: AlertTriangle, text: 'MFA Enforced', darkColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20', lightColor: 'text-amber-600 bg-amber-50 border-amber-200' },
                    ].map(({ icon: Icon, text, darkColor, lightColor }) => (
                        <div key={text} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${isDark ? darkColor : lightColor}`}>
                            <Icon className="w-3 h-3" /> {text}
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* ── RIGHT — Login form ── */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 sm:py-16 lg:px-24 lg:py-12 z-10 min-h-screen lg:border-l overflow-y-auto transition-colors duration-500 ${isDark ? 'border-white/5 bg-black/40 lg:backdrop-blur-2xl' : 'border-slate-200 bg-white/60 lg:backdrop-blur-2xl'}`}
            >

                    {/* Status strip */}
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className="flex items-center justify-between mb-5">
                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Admin Login</p>
                            <p className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-white/20' : 'text-slate-300'}`}>Authorized Personnel Only</p>
                        </div>
                        <div className="flex items-center gap-2">

                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-slate-100 bg-slate-50'}`}>
                                <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                    animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                                <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                                    {authState === 'loading' ? 'Verifying' : authState === 'success' ? 'Authorized' : authState === 'error' ? 'Rejected' : 'Standby'}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
                        <h3 className={`text-2xl font-black italic tracking-tighter mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Welcome back.</h3>
                        <p className={`text-sm font-medium mb-5 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>Enter your admin credentials to access the dashboard.</p>
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
                                icon={Lock} label="Admin Email" isDark={isDark}
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
                                icon={Key} label="Password" isDark={isDark}
                                type={showPass ? 'text' : 'password'} value={password}
                                onChange={e => setPassword(e.target.value)}
                                disabled={isLocked || authState === 'success'}
                                placeholder="••••••••••••••••"
                                rightEl={
                                    <button type="button" onClick={() => setShowPass(v => !v)} tabIndex={-1}
                                        className={`transition-colors ${isDark ? 'text-white/30 hover:text-emerald-400' : 'text-slate-300 hover:text-emerald-500'}`}>
                                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                }
                            />
                            <StrengthBar password={password} isDark={isDark} />
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
                                    : loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Logging in...</>
                                        : <>Log In <ArrowRight className="w-4 h-4" /></>}
                            </motion.button>
                        </motion.div>
                    </form>

                    {/* Divider + link */}
                    <div className="flex items-center gap-3 my-6">
                        <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-slate-100'}`} />
                        <span className={`text-[9px] uppercase tracking-widest ${isDark ? 'text-white/20' : 'text-slate-300'}`}>or</span>
                        <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-slate-100'}`} />
                    </div>

                    <div className="text-center">
                        <Link to="/login"
                            className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors group hover:text-emerald-500 ${isDark ? 'text-white/30' : 'text-slate-400 hover:text-emerald-600'}`}>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500 font-mono">&gt;</span>
                            Return to User Login
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500 font-mono">&lt;</span>
                        </Link>
                    </div>

                    {/* Footer note */}
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                        className={`mt-8 text-center text-[9px] uppercase tracking-[0.2em] font-bold ${isDark ? 'text-white/20' : 'text-slate-300'}`}>
                        Unauthorized access strictly prohibited. All attempts are permanently traced.
                    </motion.p>
                </motion.div>
        </div >
    );
};

export default AdminLogin;
