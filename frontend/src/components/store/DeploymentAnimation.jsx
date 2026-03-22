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

                <div className={`relative z-10 w-32 h-32 border-2 rounded-full flex items-center justify-center transition-all duration-700 ${theme === 'light' ? 'bg-white border-emerald-100 shadow-sm' : 'bg-[#0a0a0a] border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]'
                    }`}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/10 via-transparent to-blue-500/10 animate-pulse" />
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

                <div className={`h-2 w-full rounded-full overflow-hidden border ${theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-black border-white/5 shadow-inner'
                    }`}>
                    <motion.div
                        className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 bg-[length:200%_100%]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%`, backgroundPosition: ['0% 0%', '200% 0%'] }}
                        transition={{ width: { ease: 'linear' }, backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' } }}
                        style={{
                            boxShadow: '0 0 25px rgba(16,185,129,0.4)'
                        }}
                    />
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { icon: Cpu, stage: 30, color: 'text-blue-500', name: 'CORE' },
                        { icon: Database, stage: 60, color: 'text-purple-500', name: 'SYNC' },
                        { icon: Download, stage: 90, color: 'text-emerald-500', name: 'LIVE' }
                    ].map((item, idx) => (
                        <div key={idx} className={`p-4 rounded-2xl border transition-all duration-500 relative overflow-hidden group/stage ${progress > item.stage ? `bg-white/[0.03] border-white/10 ${item.color}` : 'bg-black/20 border-white/5 text-slate-600 opacity-30'}`}>
                            {progress > item.stage && <div className={`absolute inset-0 ${item.color.replace('text', 'bg')}/10 animate-pulse`} />}
                            <item.icon className={`w-5 h-5 mx-auto relative z-10 transition-transform duration-500 ${progress > item.stage ? 'scale-110' : 'scale-90'}`} />
                            <div className="text-[7px] font-black uppercase tracking-widest mt-2 relative z-10 opacity-60">{item.name}</div>
                        </div>
                    ))}
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
