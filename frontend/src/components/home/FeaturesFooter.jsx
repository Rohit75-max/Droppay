import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Terminal } from 'lucide-react';

const FeaturesFooter = () => {
    const navigate = useNavigate();

    return (
        <footer 
            className="bg-[#1a1a2e] text-white pt-[80px] md:pt-24 pb-0 px-0 flex flex-col border-t border-white/5 overflow-hidden min-h-screen md:h-screen justify-between shrink-0 snap-start"
            style={{ scrollSnapStop: 'always' }}
        >
            <div className="px-6 md:px-12 lg:px-16 w-full flex flex-col lg:flex-row justify-between items-start gap-10 md:gap-16 mb-4 md:mb-12 flex-1">
                <div className="max-w-md flex flex-col items-start">
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#afff00] flex items-center justify-center">
                            <Terminal className="w-3 h-3 md:w-4 md:h-4 text-black" />
                        </div>
                        <span className="text-sm md:text-lg font-black uppercase tracking-tighter">System Output</span>
                    </div>
                    <h2 className="text-2xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9] mb-4 md:mb-6">
                        The <br />
                        Infrastructure <br />
                        <span className="text-[#afff00]">for Evolution.</span>
                    </h2>
                    <p className="text-white/40 text-[10px] md:text-sm leading-relaxed mb-6 md:mb-8 max-w-xs">
                        Our nodes are strategically distributed globally to ensure
                        sub-10ms localized latency. Zero compromise on integrity.
                    </p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-6 py-3 md:px-8 md:py-4 bg-white text-black font-black uppercase tracking-widest text-[8px] md:text-[9px] rounded-full hover:scale-105 transition-all"
                    >
                        Create Account
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 md:gap-x-12 gap-y-6 md:gap-y-8 w-full mt-8 lg:mt-0">
                    {[
                        { label: "Core", links: ["Features", "Network", "Nodes"] },
                        { label: "Security", links: ["TLS 1.3", "AES-256", "VPC"] },
                        { label: "Developer", links: ["API Docs", "Webhooks", "SDKs"] },
                        { label: "Legal", links: ["Privacy", "Terms", "SLA"] }
                    ].map((group, i) => (
                        <div key={i} className="space-y-3 md:space-y-4">
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#afff00]">{group.label}</span>
                            <div className="flex flex-col gap-1.5 md:gap-2">
                                {group.links.map(link => (
                                    <span key={link} className="text-[10px] md:text-xs font-bold uppercase tracking-tight opacity-40 hover:opacity-100 cursor-pointer transition-opacity">{link}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Group Section */}
            <div className="flex flex-col w-full">

                {/* Massive Brand Marquee */}
                <div className="w-full overflow-hidden flex relative pt-0 pb-0">
                    <motion.div
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 22 }}
                        className="flex whitespace-nowrap items-center w-fit"
                    >
                        {Array(6).fill("drope.in").map((text, i) => (
                            <div key={i} className="flex items-center">
                                <span className="text-[100px] md:text-[180px] font-black uppercase tracking-tighter text-white leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                                    {text}
                                </span>
                                <div className="w-[3vw] h-[3vw] max-w-[20px] max-h-[20px] bg-white rounded-full mx-8 md:mx-12" />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </footer>
    );
};

export default FeaturesFooter;
