import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../api/axios';
import {
  ShieldAlert, Lock, Eye, EyeOff, Loader2,
  ArrowRight, Key, Shield,
  Activity, Globe, Terminal, Cpu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ComicBackLink } from '../../components/common/BackLink';

// ─── Stat Card (Premium Admin Style) ────────────────────────────
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col gap-1.5 group">
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
        <Icon className="w-3 h-3 text-white/40" />
      </div>
      <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20">{label}</p>
    </div>
    <p className="text-2xl font-black text-white italic tracking-tighter pl-7">{value}</p>
  </div>
);

// ─── Architectural Input (Premium Admin Style - Boxed) ──────────
const ArchitecturalInput = ({ icon: Icon, label, type, name, value, onChange, placeholder, rightEl, autoComplete, disabled }) => {
  const [focused, setFocused] = useState(false);
  const inputId = `admin-${name}`;
  
  return (
    <div className="space-y-3">
      <label htmlFor={inputId} className={`text-[9px] font-black uppercase tracking-[0.4em] ml-1 transition-colors ${focused ? 'text-black' : 'text-black/40'}`}>
        {label}
      </label>
      <div className="relative group">
        <Icon className={`absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors duration-200 ${focused ? 'text-black' : 'text-black/20'}`} />
        <input
          id={inputId}
          type={type} 
          name={name} 
          value={value} 
          onChange={onChange}
          onFocus={() => setFocused(true)} 
          onBlur={() => setFocused(false)}
          placeholder={placeholder} 
          required
          disabled={disabled}
          autoComplete={autoComplete}
          className="w-full bg-white border-2 border-black/5 p-5 pl-14 text-sm font-bold text-black placeholder:text-black/10 focus:border-black focus:outline-none transition-all shadow-sm"
        />
        {rightEl && <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightEl}</div>}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT (ARCHITECTURAL / 50-50 SPLIT REDESIGN)
// ─────────────────────────────────────────────────────────────
const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [authState, setAuthState] = useState('idle');
    const [attempts, setAttempts] = useState(0);

    const isLocked = attempts >= 5;

    // --- Logic Handlers (Preserved) ---
    const handleAdminAuth = async (e) => {
        e.preventDefault();
        if (isLocked) return;
        setLoading(true); setErrorMsg(''); setAuthState('loading');

        try {
            const res = await axios.post('/api/auth/admin-login', { email, password });
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

    // --- Styles ---
    const georgiaFont = { fontFamily: "Georgia, serif" };
    const interFont = { fontFamily: "'Inter', sans-serif" };

    return (
        <div className="min-h-screen bg-[#f5f4e2] flex flex-col lg:flex-row overflow-hidden relative selection:bg-sky-500/30">
            
            {/* ── LEFT SECTION (50% Deep Midnight - System Pillar) ── */}
            <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-full lg:w-1/2 bg-[#020617] p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[500px] lg:h-auto z-20"
            >
                {/* Cinematic Background Assets */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                
                {/* Floating Infrastructure Assets */}
                <motion.div animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-20 right-20 text-white/5 hidden lg:block">
                  <Cpu size={120} strokeWidth={0.5} />
                </motion.div>
                <motion.div animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, delay: 1 }} className="absolute bottom-40 left-10 text-white/5 hidden lg:block">
                  <Terminal size={180} strokeWidth={0.5} />
                </motion.div>

                {/* Relocated Navigation */}
                <div className="relative z-30 mb-8">
                   <ComicBackLink text="Exit Core" />
                </div>

                <div className="relative z-10 w-full max-w-lg">
                    {/* Console Activity Log */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="mb-12 bg-white/[0.02] backdrop-blur-md p-8 border border-white/5 shadow-2xl relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <Terminal className="w-4 h-4 text-sky-400" />
                                <p className="text-[10px] uppercase tracking-[0.5em] font-black text-sky-400">Security Terminal</p>
                            </div>
                            <div className="flex gap-1.5 opacity-50">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-4 font-mono">
                            {[
                                { time: '04:15:22', msg: 'System.AUTH_GATEWAY: [ ACTIVE ]', color: 'text-sky-300' },
                                { time: '04:14:08', msg: 'Admin.SECURE_TUNNEL: [ ENCRYPTED ]', color: 'text-white' },
                                { time: '04:12:41', msg: 'Clearance.LEVEL_1: [ REQUIRED ]', color: 'text-white/40' }
                            ].map((log, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + i * 0.1 }} className="flex gap-6 items-baseline">
                                    <span className="text-[9px] text-white/20 shrink-0 font-black tracking-widest">{log.time}</span>
                                    <span className={`text-[10px] uppercase tracking-[0.1em] font-black ${log.color}`}>{log.msg}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Elevated Glitch Brand Footer */}
                    <div className="space-y-2 mb-10">
                        <p className="text-[10px] uppercase tracking-[0.8em] font-black text-white/10 pl-2">System Authority</p>
                        <h1 className="text-[clamp(4.5rem,11vw,11rem)] font-black text-white leading-[0.85] tracking-tighter" style={interFont}>
                            <span className="flex overflow-hidden whitespace-nowrap glitch-text" data-text="ADMIN">
                                {"ADMIN".split("").map((letter, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        transition={{ duration: 1, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                                        className="inline-block"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        </h1>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-10 sm:gap-4">
                        <div className="flex gap-10 sm:gap-14">
                            <StatCard icon={Shield} label="Protocol" value="AES-256" />
                            <StatCard icon={Cpu} label="System" value="NODE-44" />
                            <StatCard icon={Activity} label="Latency" value="18ms" />
                        </div>
                        <div className="opacity-20 hover:opacity-100 transition-opacity">
                            <Globe className="w-6 h-6 text-white cursor-help" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── RIGHT SECTION (50% Cream Canvas - Auth Interface) ── */}
            <div className="w-full lg:w-1/2 relative flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 z-30 py-10 lg:h-full">
                
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full max-w-md relative"
                >
                    <AnimatePresence mode="wait">
                        <motion.div key="admin-auth" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                            <div className="flex items-end mb-12 sm:mb-16">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-[2px] bg-black/10 rounded-full" />
                                        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/30">
                                            Admin Entrance
                                        </p>
                                    </div>
                                    <h2 className="text-5xl sm:text-6xl font-black text-[#111111] tracking-tighter mb-2 whitespace-nowrap" style={georgiaFont}>
                                        Auth Gateway.
                                    </h2>
                                </div>
                            </div>

                            {errorMsg && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 p-5 bg-rose-500/5 border-l-4 border-rose-500 text-rose-600 text-[10px] font-black uppercase tracking-widest italic">
                                   {errorMsg} {attempts > 1 && <span className="opacity-50 ml-2">Attempt {attempts}/5</span>}
                                </motion.div>
                            )}

                            {authState === 'success' && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 p-5 bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-600 text-[10px] font-black uppercase tracking-widest italic">
                                    Authorization Granted — Opening Command Center...
                                </motion.div>
                            )}

                            {isLocked && (
                                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mb-10 p-10 bg-rose-500 text-white shadow-[12px_12px_0px_rgba(0,0,0,0.1)] text-center relative overflow-hidden">
                                    <div className="relative z-10">
                                        <ShieldAlert className="w-12 h-12 mx-auto mb-6" />
                                        <h3 className="text-xl font-black uppercase tracking-[0.3em] mb-4">Account Locked</h3>
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 leading-relaxed">
                                            Security protocol triggered due to excessive failures. Contact system root.
                                        </p>
                                    </div>
                                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none mix-blend-overlay">
                                        <Terminal size={200} className="absolute -bottom-10 -right-10" />
                                    </div>
                                </motion.div>
                            )}

                            <form onSubmit={handleAdminAuth} className="space-y-10">
                                <ArchitecturalInput 
                                    icon={Key} 
                                    label="Administrative ID" 
                                    type="email" 
                                    name="email" 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)} 
                                    placeholder="root@drope.system" 
                                    autoComplete="email" 
                                    disabled={isLocked || authState === 'success'}
                                />
                                <div className="space-y-3">
                                    <ArchitecturalInput 
                                        icon={Lock} 
                                        label="Security Key" 
                                        type={showPass ? 'text' : 'password'} 
                                        name="password" 
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)} 
                                        placeholder="••••••••••••" 
                                        autoComplete="current-password"
                                        disabled={isLocked || authState === 'success'}
                                        rightEl={
                                            <button type="button" onClick={() => setShowPass(!showPass)} className="text-black/10 hover:text-black transition-all p-2">
                                                {showPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                                            </button>
                                        }
                                    />
                                    <div className="flex justify-end">
                                        <button type="button" className="text-[9px] font-black uppercase tracking-widest text-black/20 hover:text-black transition-all italic border-b border-transparent hover:border-black/20">Emergency Recovery</button>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading || isLocked || authState === 'success' || !email || !password}
                                    className="w-full bg-[#111111] text-white py-6 font-black uppercase tracking-[0.4em] text-[13px] italic flex items-center justify-center gap-4 transition-all hover:bg-[#075985] hover:shadow-[8px_8px_0px_#000] disabled:opacity-30 group shadow-2xl shadow-black/10"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            Initialize Session <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-16 text-center">
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/10 leading-relaxed max-w-[320px] mx-auto">
                                    Secure node authorization strictly for verified Drope personnel. 
                                    All packets traced via <span className="text-black underline decoration-black/10">TR-44/HUB</span>.
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Technical Metadata Footer */}
                    <div className="mt-20 pt-10 border-t border-black/5 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.3em] text-black/20">
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1.5"><Shield size={10} /> ENC_256</span>
                            <span className="flex items-center gap-1.5"><Globe size={10} /> REMOTE_SYNC</span>
                        </div>
                        <span>v2.0.26 / ADMIN_GATE</span>
                    </div>
                </motion.div>
            </div>

            {/* Global Aesthetics */}
            <div className="fixed inset-0 pointer-events-none z-50">
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
            </div>
        </div>
    );
};

export default AdminLogin;
