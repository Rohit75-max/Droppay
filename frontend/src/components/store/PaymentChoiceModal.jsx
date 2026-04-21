import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, CreditCard, IndianRupee, Zap, ArrowUpRight } from 'lucide-react';

const PaymentChoiceModal = ({ isOpen, onClose, onSelect, balance, price, itemName, theme }) => {
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const isLight = theme === 'light' || (typeof document !== 'undefined' && document.documentElement.classList.contains('light'));

    const priceNum = parseInt(price.replace(/[^0-9]/g, '')) || 0;
    const canAfford = balance >= priceNum;

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className={`absolute inset-0 backdrop-blur-sm ${isLight ? 'bg-emerald-50/80' : 'bg-black/80'}`}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className={`relative w-full max-w-lg border rounded-[2rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)] transition-all duration-500 flex flex-col ${theme === 'light'
                        ? 'bg-white border-slate-200'
                        : 'bg-[#020403]/95 border-white/10 backdrop-blur-3xl'
                        }`}
                >
                    {/* Immersive Background Glow */}
                    {theme === 'dark' && (
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
                    )}
                    {/* Header Decoration */}
                    <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-[#10B981] shrink-0" />

                    <div className="p-4 sm:p-5 flex flex-col">
                        <div className="flex justify-between items-center mb-4 sm:mb-5">
                            <h2 className={`text-xl sm:text-2xl font-black italic uppercase tracking-tighter ${theme === 'light' ? 'text-emerald-950' : 'text-white'}`}>Checkout</h2>
                            <button onClick={onClose} className={`p-1.5 rounded-full transition-all duration-300 border ${theme === 'light' ? 'bg-white/80 hover:bg-emerald-500 hover:text-white border-emerald-100 text-emerald-950/40' : 'bg-black/40 hover:bg-red-500/20 text-white/40 hover:text-red-400 border-white/5 hover:border-red-500/30'}`}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className={`mb-4 sm:mb-5 text-center p-4 sm:p-6 rounded-2xl border relative overflow-hidden transition-all group/asset ${theme === 'light'
                            ? 'bg-emerald-50/50 border-emerald-100'
                            : 'bg-[#050505] border-white/5'
                            }`}>
                            {theme === 'dark' && (
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />
                            )}
                            <h3 className="text-lg sm:text-xl font-black uppercase italic tracking-tighter text-emerald-500 mb-3 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">{itemName}</h3>
                            <div className="flex items-center justify-center">
                                <div className={`px-4 py-1.5 rounded-xl border flex items-center gap-2 ${theme === 'light' ? 'bg-white border-emerald-100' : 'bg-black/60 border-white/10'}`}>
                                    <IndianRupee className={`w-3.5 h-3.5 opacity-40 ${theme === 'light' ? 'text-emerald-950' : 'text-white'}`} />
                                    <span className={`text-2xl sm:text-3xl font-black italic tracking-tighter ${theme === 'light' ? 'text-emerald-950' : 'text-white'}`}>{priceNum.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            {/* Wallet Option */}
                            <button
                                onClick={() => canAfford && onSelect('wallet')}
                                disabled={!canAfford}
                                className={`w-full group relative p-4 sm:p-5 rounded-2xl border transition-all duration-700 flex items-center justify-between overflow-hidden ${canAfford
                                    ? (theme === 'light'
                                        ? 'bg-emerald-50 border-emerald-100 hover:border-emerald-500 shadow-sm hover:shadow-emerald-500/10'
                                        : 'bg-white/[0.02] border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/[0.04]')
                                    : (theme === 'light'
                                        ? 'opacity-50 cursor-not-allowed border-slate-100 bg-slate-50'
                                        : 'opacity-40 cursor-not-allowed border-white/5 bg-black/20')
                                    }`}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={`p-3 rounded-xl border transition-all ${canAfford
                                        ? (theme === 'light' ? 'bg-white border-emerald-100 text-emerald-600' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black')
                                        : (theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-white/5 border-white/10 text-slate-600')
                                        }`}>
                                        <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <div className="text-left">
                                        <p className={`text-sm sm:text-base font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Internal Wallet</p>
                                        <p className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                            Balance: ₹{balance.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right relative z-10">
                                    {!canAfford && <span className="text-[9px] font-black uppercase bg-red-500/20 text-red-500 px-3 py-1.5 rounded-lg border border-red-500/20 tracking-widest">Insufficient</span>}
                                    {canAfford && (
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 opacity-60">Verify Payment</span>
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300">
                                                <Zap className="w-4 h-4" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </button>

                            {/* Razorpay Option */}
                            <button
                                onClick={() => onSelect('razorpay')}
                                className={`w-full group relative p-4 sm:p-5 rounded-2xl border transition-all duration-700 flex items-center justify-between overflow-hidden ${theme === 'light'
                                    ? 'border-slate-100 bg-white hover:bg-slate-50 hover:border-blue-500 shadow-sm hover:shadow-blue-500/5'
                                    : 'border-white/5 bg-white/[0.01] hover:bg-blue-500/[0.04] hover:border-blue-500/40'
                                    }`}
                            >
                                {theme === 'dark' && (
                                    <div className="absolute -inset-10 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={`p-3 rounded-xl border transition-all ${theme === 'light'
                                        ? 'bg-white border-blue-100 text-blue-600'
                                        : 'bg-blue-500/10 border-blue-500/30 text-blue-400 group-hover:bg-blue-50 group-hover:text-black'
                                        }`}>
                                        <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <div className="text-left">
                                        <p className={`text-sm sm:text-base font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>External Uplink</p>
                                        <p className="text-[9px] font-black text-blue-500/60 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                                            <span className="w-1 h-1 rounded-full bg-blue-500" />
                                            Universal Gateway
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 relative z-10">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-blue-400 opacity-60">Initialize</span>
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-black transition-all duration-300">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};

export default PaymentChoiceModal;
