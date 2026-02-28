import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Loader2, Sparkles, Download, Database, Cpu } from 'lucide-react';

const DeploymentAnimation = ({ onComplete, theme }) => {
    const [status, setStatus] = useState('DECRYPTING ASSET...');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const stages = [
            { text: 'DECRYPTING ASSET...', time: 1000 },
            { text: 'SYNCING TO NODE...', time: 2000 },
            { text: 'DEPLOYMENT COMPLETE', time: 3000 }
        ];

        let currentStage = 0;
        const interval = setInterval(() => {
            if (currentStage < stages.length) {
                setStatus(stages[currentStage].text);
                currentStage++;
            }
        }, 1200);

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 1;
            });
        }, 30);

        const timeout = setTimeout(() => {
            // Wait a bit after complete before calling onComplete
            setTimeout(onComplete, 1000);
        }, 4000);

        return () => {
            clearInterval(interval);
            clearInterval(progressInterval);
            clearTimeout(timeout);
        };
    }, [onComplete]);

    return (
        <div className="p-10 text-center flex flex-col items-center justify-center min-h-[350px]">
            <div className="relative mb-12">
                {/* Holographic Burst Circle */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.3, 0.1],
                        rotate: [0, 90, 180, 270, 360]
                    }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"
                />

                <div className={`relative z-10 w-24 h-24 border-2 border-emerald-500/30 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] ${theme === 'light' ? 'bg-white' : 'bg-black'
                    }`}>
                    <AnimatePresence mode="wait">
                        {progress < 100 ? (
                            <motion.div
                                key="loader"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="complete"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <ShieldCheck className="w-12 h-12 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="space-y-6 w-full max-w-xs mx-auto">
                <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black uppercase text-[#10B981] tracking-[0.3em] animate-pulse">
                        {status}
                    </span>
                    <span className={`text-[10px] font-black italic ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{progress}%</span>
                </div>

                <div className={`h-1.5 w-full rounded-full overflow-hidden border ${theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/5'
                    }`}>
                    <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: 'linear' }}
                        style={{
                            boxShadow: '0 0 20px rgba(16,185,129,0.5)'
                        }}
                    />
                </div>

                <div className="grid grid-cols-3 gap-2 opacity-30">
                    <div className={`p-3 rounded-lg border transition-colors ${progress > 30 ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500' : (theme === 'light' ? 'border-slate-200 text-slate-400' : 'border-white/5 text-slate-500')}`}>
                        <Cpu className="w-4 h-4 mx-auto" />
                    </div>
                    <div className={`p-3 rounded-lg border transition-colors ${progress > 60 ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500' : (theme === 'light' ? 'border-slate-200 text-slate-400' : 'border-white/5 text-slate-500')}`}>
                        <Database className="w-4 h-4 mx-auto" />
                    </div>
                    <div className={`p-3 rounded-lg border transition-colors ${progress > 90 ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500' : (theme === 'light' ? 'border-slate-200 text-slate-400' : 'border-white/5 text-slate-500')}`}>
                        <Download className="w-4 h-4 mx-auto" />
                    </div>
                </div>
            </div>

            {progress === 100 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-2"
                >
                    <div className="flex gap-4 items-center">
                        <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                        <p className={`text-[9px] font-black uppercase tracking-[0.4em] ${theme === 'light' ? 'text-slate-400' : 'text-white/40'}`}>Holographic Burst Synchronized</p>
                        <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default DeploymentAnimation;
