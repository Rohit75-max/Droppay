import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, CreditCard, ShieldCheck, IndianRupee } from 'lucide-react';

const PaymentChoiceModal = ({ isOpen, onClose, onSelect, balance, price, itemName, theme }) => {
    if (!isOpen) return null;

    const isLight = theme === 'light' || (typeof document !== 'undefined' && document.documentElement.classList.contains('light'));

    const priceNum = parseInt(price.replace(/[^0-9]/g, '')) || 0;
    const canAfford = balance >= priceNum;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className={`absolute inset-0 backdrop-blur-sm ${isLight ? 'bg-emerald-50/80' : 'bg-black/80'}`}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className={`relative w-full max-w-lg border rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] transition-all duration-500 ${theme === 'light'
                        ? 'bg-white border-slate-200'
                        : 'bg-[#020403]/95 border-white/10 backdrop-blur-3xl'
                        }`}
                >
                    {/* Immersive Background Glow */}
                    {theme === 'dark' && (
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
                    )}
                    {/* Header Decoration */}
                    <div className="h-2 bg-gradient-to-r from-emerald-500 to-[#10B981]" />

                    <div className="p-5 sm:p-8">
                        <div className="flex justify-between items-start mb-8 sm:mb-10">
                            <div className="space-y-1">
                                <h2 className={`text-2xl sm:text-3xl font-black italic uppercase tracking-tighter ${theme === 'light' ? 'text-emerald-950' : 'text-white'
                                    }`}>Checkout</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60">Authorization Protocol Active</p>
                            </div>
                            <button onClick={onClose} className={`p-3 rounded-full transition-all duration-300 border shadow-xl ${theme === 'light' ? 'bg-white/80 hover:bg-emerald-500 hover:text-white border-emerald-100' : 'bg-black/40 hover:bg-red-500/20 text-white/40 hover:text-red-400 border-white/5 hover:border-red-500/30'}`}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className={`mb-8 sm:mb-12 text-center p-6 sm:p-10 rounded-3xl border relative overflow-hidden transition-all group/asset ${theme === 'light'
                            ? 'bg-emerald-50/50 border-emerald-100'
                            : 'bg-[#050505] border-white/5'
                            }`}>
                            {theme === 'dark' && <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />}
                            <span className={`text-[10px] uppercase font-black tracking-[0.4em] opacity-40 ${theme === 'light' ? 'text-emerald-900' : 'text-slate-400'}`}>Target Asset</span>
                            <h3 className="text-xl sm:text-3xl font-black uppercase italic tracking-tighter text-emerald-500 mt-2 mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">{itemName}</h3>
                            <div className="flex items-center justify-center gap-2 group-hover/asset:scale-110 transition-transform duration-500">
                                <IndianRupee className={`w-5 h-5 opacity-40 ${theme === 'light' ? 'text-emerald-950' : 'text-white'}`} />
                                <span className={`text-3xl sm:text-4xl font-black italic tracking-tighter ${theme === 'light' ? 'text-emerald-950' : 'text-white'}`}>{priceNum.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {/* Wallet Option */}
                            <button
                                onClick={() => canAfford && onSelect('wallet')}
                                disabled={!canAfford}
                                className={`w-full group relative p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border transition-all duration-500 flex items-center justify-between overflow-hidden ${canAfford
                                    ? (theme === 'light'
                                        ? 'bg-emerald-50 border-emerald-100 hover:border-emerald-500'
                                        : 'bg-white/[0.02] border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/[0.03]')
                                    : (theme === 'light'
                                        ? 'opacity-50 cursor-not-allowed border-slate-100 bg-slate-50'
                                        : 'opacity-40 cursor-not-allowed border-white/5 bg-black/20')
                                    }`}
                            >
                                {canAfford && theme === 'dark' && (
                                    <div className="absolute -inset-10 bg-emerald-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                                <div className="flex items-center gap-4 sm:gap-6 relative z-10">
                                    <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-500 ${canAfford
                                        ? 'bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                                        : (theme === 'light' ? 'bg-white border-slate-100 text-slate-300' : 'bg-slate-900/50 border-white/5 text-slate-500')
                                        }`}>
                                        <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <div className="text-left space-y-1">
                                        <p className={`text-[12px] sm:text-sm font-black uppercase tracking-[0.1em] ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Internal Wallet</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                                            Balance: ₹{balance.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right relative z-10">
                                    {!canAfford && <span className="text-[10px] font-black uppercase bg-red-500/20 text-red-500 px-3 py-1.5 rounded-lg border border-red-500/20 tracking-widest">Insufficient</span>}
                                    {canAfford && <ShieldCheck className="w-6 h-6 text-[#10B981] drop-shadow-[0_0_10px_var(--nexus-accent-glow)] opacity-40 group-hover:opacity-100 transition-all duration-500" />}
                                </div>
                            </button>

                            {/* Razorpay Option */}
                            <button
                                onClick={() => onSelect('razorpay')}
                                className={`w-full group relative p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border transition-all duration-500 flex items-center justify-between overflow-hidden ${theme === 'light'
                                    ? 'border-slate-100 bg-white hover:bg-slate-50 hover:border-emerald-500/50'
                                    : 'border-white/5 bg-white/[0.01] hover:bg-blue-500/[0.03] hover:border-blue-500/30'
                                    }`}
                            >
                                {theme === 'dark' && (
                                    <div className="absolute -inset-10 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                                <div className="flex items-center gap-4 sm:gap-6 relative z-10">
                                    <div className="p-4 sm:p-5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl transition-all group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                                        <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <div className="text-left space-y-1">
                                        <p className={`text-[12px] sm:text-sm font-black uppercase tracking-[0.1em] ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>External Billing</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">UPI • Cards • NetBanking</p>
                                    </div>
                                </div>
                                <ShieldCheck className="w-6 h-6 text-blue-500 opacity-40 group-hover:opacity-100 transition-all duration-500" />
                            </button>
                        </div>

                        <p className="text-center text-[10px] text-slate-500 uppercase font-black tracking-[0.4em] mt-12 opacity-30">
                            Secure P2P Transaction Hub
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentChoiceModal;
