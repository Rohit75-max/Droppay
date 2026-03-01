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
                    className={`relative w-full max-w-md border rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-300 ${theme === 'light'
                        ? 'bg-white border-slate-200'
                        : 'bg-[var(--nexus-panel)] border-[var(--nexus-border)]'
                        }`}
                >
                    {/* Header Decoration */}
                    <div className="h-2 bg-gradient-to-r from-emerald-500 to-[#10B981]" />

                    <div className="p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className={`text-2xl font-black italic uppercase tracking-tighter ${theme === 'light' ? 'text-emerald-950' : 'text-white'
                                    }`}>Acquire Asset</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mt-1">Authorization Protocol Required</p>
                            </div>
                            <button onClick={onClose} className={`p-2 rounded-full transition-colors ${theme === 'light' ? 'hover:bg-emerald-100/50' : 'hover:bg-black/5'}`}>
                                <X className={`w-5 h-5 ${theme === 'light' ? 'text-emerald-900/40' : 'text-slate-500'}`} />
                            </button>
                        </div>

                        <div className={`mb-10 text-center p-6 rounded-2xl border ${theme === 'light'
                            ? 'bg-emerald-50/50 border-emerald-100'
                            : 'bg-[var(--nexus-bg)]/40 border-[var(--nexus-border)]'
                            }`}>
                            <span className={`text-xs uppercase font-bold tracking-widest ${theme === 'light' ? 'text-emerald-900/40' : 'text-slate-500'}`}>Asset Identified</span>
                            <h3 className="text-xl font-black uppercase text-emerald-600 mt-1">{itemName}</h3>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <IndianRupee className={`w-4 h-4 opacity-50 ${theme === 'light' ? 'text-emerald-950' : 'text-white'}`} />
                                <span className={`text-2xl font-black ${theme === 'light' ? 'text-emerald-950' : 'text-white'}`}>{priceNum.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Wallet Option */}
                            <button
                                onClick={() => canAfford && onSelect('wallet')}
                                disabled={!canAfford}
                                className={`w-full group relative p-6 rounded-3xl border transition-all flex items-center justify-between ${canAfford
                                    ? (theme === 'light'
                                        ? 'bg-emerald-50 border-emerald-100 hover:border-emerald-500'
                                        : 'bg-[#10B981]/5 border-[#10B981]/20 hover:border-[#10B981] hover:bg-[#10B981]/10')
                                    : (theme === 'light'
                                        ? 'opacity-50 cursor-not-allowed border-slate-100 bg-slate-50'
                                        : 'opacity-50 cursor-not-allowed border-[var(--nexus-border)] bg-[var(--nexus-bg)]/40')
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl border ${canAfford
                                        ? 'bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]'
                                        : (theme === 'light' ? 'bg-white border-slate-100 text-slate-300' : 'bg-slate-800 border-white/5 text-slate-500')
                                        }`}>
                                        <Wallet className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className={`text-xs font-black uppercase ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Node Balance</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5 tracking-wider">
                                            Current: ₹{balance.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {!canAfford && <span className="text-[8px] font-black uppercase bg-red-500/20 text-red-500 px-2 py-1 rounded">Insufficient</span>}
                                    {canAfford && <ShieldCheck className="w-4 h-4 text-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity" />}
                                </div>
                            </button>

                            {/* Razorpay Option */}
                            <button
                                onClick={() => onSelect('razorpay')}
                                className={`w-full group relative p-6 rounded-3xl border transition-all flex items-center justify-between ${theme === 'light'
                                    ? 'border-slate-100 bg-white hover:bg-slate-50 hover:border-emerald-500/50'
                                    : 'border-[var(--nexus-border)] bg-[var(--nexus-bg)]/40 hover:bg-[var(--nexus-bg)]/60 hover:border-emerald-500/50'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className={`text-xs font-black uppercase ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Razorpay</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5 tracking-wider">Cards, UPI, Banking</p>
                                    </div>
                                </div>
                                <ShieldCheck className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>

                        <p className="text-center text-[9px] text-slate-400 uppercase font-black tracking-[0.2em] mt-10">
                            Secure P2P Transaction Hub
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentChoiceModal;
