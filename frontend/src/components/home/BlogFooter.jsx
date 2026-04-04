import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { ArrowRight } from 'lucide-react';

const BlogFooter = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, sending, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.error("All identity fields required.");
            return;
        }

        setStatus('sending');
        try {
            await API.post('/api/inquiry/send', formData);
            setStatus('success');
            toast.success("Inquiry Transmitted Successfully.");
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        } catch (err) {
            console.error(err);
            setStatus('error');
            toast.error("Transmission Failure. Please try again.");
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <footer className="bg-black text-white pt-8 pb-0 px-0 flex flex-col overflow-hidden">
            {/* --- PRIMARY CONNECTION LAYER --- */}
            <div className="px-6 md:px-12 lg:px-24 w-full flex flex-col lg:flex-row justify-between items-start gap-12 mb-4">
                {/* LEFT: IDENTITY DATA */}
                <div className="flex-1 space-y-6">
                    <div className="space-y-6">
                        <div className="group">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#afff00] mb-2 block">Location</span>
                            <p className="text-xl md:text-2xl font-medium tracking-tighter uppercase">123 New Delhi, India</p>
                        </div>
                        <div className="group">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#afff00] mb-2 block">Contact</span>
                            <p className="text-xl md:text-2xl font-medium tracking-tighter uppercase">+91 0000000000</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT: INQUIRY CARD (TACTICAL REDESIGN) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="w-full lg:w-[500px] bg-black/40 backdrop-blur-xl border border-white/5 p-6 md:p-8 rounded-lg relative group overflow-hidden"
                >
                    {/* ACCENT CORNERS */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#afff00]" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#afff00]" />

                    {/* TACTICAL HEADER */}
                    <div className="mb-6">
                        <div className="flex justify-end items-center mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#afff00] animate-pulse" />
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#afff00] mb-1">Let's Connect</h3>
                        <p className="text-[10px] font-mono text-white tracking-widest uppercase">We'd Love to Hear From You</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* NAME INPUT */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[9px] font-mono font-bold tracking-widest uppercase">
                                <span className="text-white/40">Name</span>
                                <span className="text-[#afff00]">[Required]</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:border-[#afff00]/50 outline-none transition-all placeholder:text-white/5"
                                    placeholder="YOUR NAME"
                                />
                            </div>
                        </div>

                        {/* EMAIL INPUT */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[9px] font-mono font-bold tracking-widest uppercase">
                                <span className="text-white/40">Email</span>
                                <span className="text-[#afff00]">[Required]</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:border-[#afff00]/50 outline-none transition-all placeholder:text-white/5"
                                    placeholder="YOUR EMAIL"
                                />
                            </div>
                        </div>

                        {/* MESSAGE INPUT */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[9px] font-mono font-bold tracking-widest uppercase">
                                <span className="text-white/40">Message</span>
                                <span className="text-[#afff00]">[Required]</span>
                            </div>
                            <div className="relative">
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={2}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:border-[#afff00]/50 outline-none transition-all resize-none placeholder:text-white/5"
                                    placeholder="I'm interested in..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'sending'}
                            className="group relative w-full py-4 bg-transparent border border-white/20 hover:border-[#afff00] overflow-hidden rounded-xl transition-all"
                        >
                            <div className="absolute inset-0 bg-[#afff00] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <div className="relative z-10 flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] text-white group-hover:text-black">
                                {status === 'sending' ? 'Sending...' : 'Send'}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>

                        <AnimatePresence>
                            {status === 'success' && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[9px] font-mono text-[#afff00] uppercase tracking-widest text-center"
                                >
                                    Message Received. We'll Get Back to You Soon.
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </form>
                </motion.div>
            </div>

            {/* --- MASSIVE MARQUEE: LET'S TALK --- */}
            <div className="w-full overflow-hidden flex relative pt-4 md:pt-6 pb-2 md:pb-4">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
                    className="flex whitespace-nowrap items-center w-fit"
                >
                    {Array(4).fill("LET'S CONNECT").map((text, i) => (
                        <div key={i} className="flex items-center">
                            <span className="text-[14vw] md:text-[8vw] font-black uppercase tracking-tighter text-white leading-none">
                                {text}
                            </span>
                            <div className="w-[3vw] h-[3vw] md:w-[2.5vw] md:h-[2.5vw] bg-white rounded-full mx-[4vw] md:mx-[3vw]" />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* LOWER METADATA */}
            <div className="px-6 md:px-12 lg:px-24 py-6 md:py-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 opacity-20">
                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">@ 2026 DROPE.IN ALL RIGHTS RESERVED</p>
            </div>
        </footer >
    );
};

export default BlogFooter;
