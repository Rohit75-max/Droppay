import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Copy, CheckCircle2 } from 'lucide-react';

const mockLogs = [
    { uid: 'init-1', time: '14:02:45', method: 'POST', endpoint: '/v1/routing/analyze', status: 200, ms: 14 },
    { uid: 'init-2', time: '14:02:46', method: 'GET', endpoint: '/v1/liquidity/pools', status: 200, ms: 8 },
    { uid: 'init-3', time: '14:02:48', method: 'POST', endpoint: '/v1/settlements/execute', status: 201, ms: 22 },
];

export const StreamEngineDemo = () => {
    const [copied, setCopied] = useState(false);
    const [logs, setLogs] = useState(mockLogs);

    useEffect(() => {
        const interval = setInterval(() => {
            setLogs(prev => {
                const newLogs = [...prev];
                const newLog = {
                    uid: `log-${Date.now()}`,
                    time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                    method: Math.random() > 0.5 ? 'POST' : 'GET',
                    endpoint: Math.random() > 0.5 ? '/v1/telemetry/digest' : '/v1/events/webhook',
                    status: 200,
                    ms: Math.floor(Math.random() * 30) + 5
                };
                newLogs.push(newLog);
                if (newLogs.length > 5) newLogs.shift();
                return newLogs;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const copyCode = () => {
        navigator.clipboard.writeText("npm install @droppay/node-sdk");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative w-full max-w-lg mx-auto rounded-xl border border-white/10 bg-[#111] overflow-hidden flex flex-col shadow-2xl">
            {/* Window Header */}
            <div className="h-10 border-b border-white/10 bg-white/[0.02] flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 opacity-50">
                    <Terminal className="w-3.5 h-3.5" />
                    <span className="font-mono text-[9px] uppercase tracking-widest">Droppay_Core_SDK</span>
                </div>
            </div>
            
            {/* Terminal Body */}
            <div className="p-6 flex flex-col gap-6">
                
                {/* SDK Install Block */}
                <div className="bg-black border border-white/5 rounded-lg p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-3 font-mono text-xs text-zinc-300">
                        <span className="text-[#afff00]">$</span>
                        npm install @droppay/node-sdk
                    </div>
                    <button 
                        onClick={copyCode}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-md"
                    >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-[#afff00]" /> : <Copy className="w-4 h-4 text-zinc-500" />}
                    </button>
                </div>

                {/* Live Traffic Feed */}
                <div className="flex flex-col gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#afff00] mb-2">Live Telemetry</span>
                    
                    <div className="flex flex-col font-mono text-[10px] leading-relaxed">
                        <AnimatePresence>
                            {logs.map((log, i) => (
                                <motion.div 
                                    key={log.uid}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-600">{log.time}</span>
                                        <span className={`${log.method === 'POST' ? 'text-blue-400' : 'text-purple-400'} w-8`}>{log.method}</span>
                                        <span className="text-zinc-300">{log.endpoint}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-emerald-400">{log.status}</span>
                                        <span className="text-zinc-500 w-8 text-right">{log.ms}ms</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </div>
    );
};
