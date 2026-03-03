import React from 'react';
import { motion } from 'framer-motion';

const NeuralProfile = () => {
    return (
        <div style={{ perspective: '1000px' }} className="w-full flex justify-center">
            <motion.div
                whileHover={{ rotateY: 15, rotateX: 5, z: 50 }}
                className="aero-widget neural-card w-[320px] h-[400px] flex flex-col items-center justify-center relative p-8 group cursor-pointer"
                style={{
                    backdropFilter: 'blur(35px) saturate(200%)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    clipPath: 'polygon(0 0, 90% 0, 100% 10%, 100% 100%, 10% 100%, 0 90%)'
                }}
            >
                {/* Scanner Beam */}
                <div className="scanner-beam"></div>

                {/* Identity Ring */}
                <div className="relative mb-8">
                    {/* Heartbeat pulse glow */}
                    <div className="absolute -inset-2 rounded-full border-2 border-[#3b82f6]/40 animate-pulse bg-[#3b82f6]/10 blur-md"></div>

                    {/* Glass frame */}
                    <div className="w-28 h-28 rounded-full border-2 border-[#3b82f6] p-1.5 relative z-10 bg-black/40 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                        <img
                            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop"
                            alt="Neural ID Avatar"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                </div>

                {/* Node Data */}
                <h3 className="text-2xl font-black tracking-widest text-white mb-2 uppercase group-hover:text-[#3b82f6] transition-colors">
                    Astra Node
                </h3>
                <p className="font-mono text-[10px] tracking-widest text-slate-400 mb-6">
                    CID: DROP-9X2F
                </p>

                {/* Hidden Secure Status */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-6 text-center w-full">
                    <p className="font-mono text-[11px] tracking-widest text-[#3b82f6] drop-shadow-[0_0_8px_rgba(59,130,246,0.9)]">
                        NODE STATUS: SECURE
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default NeuralProfile;
