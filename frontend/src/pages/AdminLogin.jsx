import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Terminal, Lock, Star, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleAdminAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const res = await axios.post('http://localhost:5001/api/auth/admin-login', {
                email,
                password
            });

            localStorage.setItem('token', res.data.token);
            navigate('/admin/secure-portal');
        } catch (err) {
            setErrorMsg(err.response?.data?.msg || "Authentication Sequence Failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center relative overflow-hidden font-mono selection:bg-rose-500/30">
            {/* GRID BACKGROUND (Cyberpunk/Terminal Aesthetic) */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
                backgroundImage: `linear-gradient(rgba(225, 29, 72, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(225, 29, 72, 0.1) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }} />

            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_20px_#f43f5e] z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* HEADER */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-950/50 rounded-2xl border border-rose-500/30 mb-6 relative">
                        <Terminal className="w-10 h-10 text-rose-500 relative z-10" />
                        <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-2xl" />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2 flex items-center justify-center gap-3">
                        <ShieldAlert className="w-6 h-6 text-rose-500" />
                        A.R.E.S.
                    </h1>
                    <p className="text-rose-500/80 font-bold text-xs uppercase tracking-[0.3em]">
                        Administrative Protocol Node
                    </p>
                </div>

                {/* LOGIN TERMINAL */}
                <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-rose-500/20 shadow-[0_0_50px_rgba(225,29,72,0.1)] rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-900 via-rose-500 to-rose-900" />

                    <form onSubmit={handleAdminAuth} className="space-y-6">
                        <AnimatePresence>
                            {errorMsg && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-rose-950/50 border border-rose-500/50 text-rose-400 p-4 rounded-xl text-xs font-bold flex items-center gap-3"
                                >
                                    <ShieldAlert className="w-4 h-4 shrink-0" />
                                    <span>{errorMsg}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-2 block">Clearance Key (Email)</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#020617] border border-slate-800 rounded-xl py-4 px-12 text-sm text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all outline-none"
                                        placeholder="system.admin@droppay.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-2 block">Master Access Phassphrase</label>
                                <div className="relative">
                                    <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[#020617] border border-slate-800 rounded-xl py-4 px-12 text-sm text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all outline-none"
                                        placeholder="••••••••••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)]"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Establish Uplink <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* FOOTER */}
                <div className="mt-8 text-center text-slate-600 text-[10px] uppercase font-bold tracking-widest">
                    <p>UNAUTHORIZED ACCESS STRICTLY PROHIBITED.</p>
                    <p className="mt-1">ALL ATTEMPTS ARE LOGGED AND TRACED.</p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
