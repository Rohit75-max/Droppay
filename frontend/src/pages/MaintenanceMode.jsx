import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const MaintenanceMode = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-[999] bg-[#030303] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center max-w-sm">
                <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
                    <ShieldAlert className="w-8 h-8 text-rose-500 animate-pulse" />
                </div>
                
                <h1 className="text-xl font-black text-white uppercase tracking-wider mb-2">
                    System Lock Active
                </h1>
                
                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8">
                    The platform has triggered an automated circuit breaker to preserve asset safety. Operations will restore momentarily.
                </p>

                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full">
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500 animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Synchronizing Relays...
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default MaintenanceMode;
