import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const PricingFooter = () => {
    const navigate = useNavigate();

    return (
        <footer className="bg-[#f2f0e8] text-[#1a1a2e] pt-12 md:pt-32 pb-0 px-0 flex flex-col border-t border-[#1a1a2e]/5 overflow-hidden justify-between min-h-screen-fit">
            <div className="px-6 md:px-12 lg:px-16 w-full flex flex-col md:flex-row justify-between items-start gap-12 md:gap-16 mb-12 md:mb-20 flex-1">
                <div className="max-w-2xl text-left">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8] mb-12">
                        Transparent <br />
                        <span className="font-serif italic text-[#3d44f5] normal-case tracking-tight">Investment.</span>
                    </h2>
                    <p className="text-lg opacity-60 leading-relaxed max-w-xl">
                        A commitment to zero-latency performance. Whether you're a standard
                        creator or an enterprise-grade studio, we provide the financial rails
                        you need to scale.
                    </p>
                </div>

                <div className="flex flex-col items-start gap-6">
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-12 py-6 bg-black text-white font-black uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-all shadow-2xl flex items-center gap-4"
                    >
                        Create Account <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Bottom Group Section */}
            <div className="flex flex-col w-full justify-end">
                {/* Policy Links Grouped at the extreme base */}
                <div className="px-6 md:px-12 lg:px-16 pt-0 pb-12 flex flex-col items-start gap-8 bg-[#f2f0e8]">
                    <div className="flex flex-wrap gap-4 md:gap-8">
                        {['Billing Policy', 'Privacy Policy', 'Service SLA', 'Legal Notice'].map(s => (
                            <span key={s} className="text-[10px] font-black uppercase tracking-[0.2em] opacity-20 hover:opacity-100 cursor-pointer transition-opacity underline-offset-4 hover:underline">{s}</span>
                        ))}
                    </div>
                </div>

                {/* Massive Brand Marquee */}
                <div className="w-full overflow-hidden flex relative pt-0 pb-0">
                    <motion.div
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
                        className="flex whitespace-nowrap items-center w-fit"
                    >
                        {Array(6).fill("drope.in").map((text, i) => (
                            <span key={i} className="text-[100px] md:text-[180px] font-black uppercase tracking-tighter text-black px-8 md:px-12 leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                                {text}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </div>
        </footer>
    );
};

export default PricingFooter;
