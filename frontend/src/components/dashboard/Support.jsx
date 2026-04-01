import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import Lottie from 'lottie-react';

// ─── LOTTIE ASSETS ───────────────────────────────────────────────────────────
const LOTTIE_STICKERS = {
    fire: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/lottie.json",
    heart: "https://fonts.gstatic.com/s/e/notoemoji/latest/2764_fe0f/lottie.json",
    hype: "https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/lottie.json",
    cool: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f60e/lottie.json",
    rocket: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/lottie.json",
    gem: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f48e/lottie.json",
};

// ─── animation variants ───────────────────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

// ─── Streamer Profile Card Component ──────────────────────────────────────────
function StreamerProfile({ username }) {
    return (
        <motion.div
            variants={fadeUp}
            className="w-full nexus-card border-2 p-6 md:p-10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden"
            style={{ background: 'var(--nexus-panel)', borderColor: 'var(--nexus-border)' }}
        >
            <div className="absolute top-0 right-0 p-2 font-mono text-[6px] text-[var(--nexus-text-muted)] uppercase tracking-widest border-l border-b" style={{ borderColor: 'var(--nexus-border)' }}>IDENTITY_PULSE_01</div>
            {/* Avatar */}
            <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-none flex items-center justify-center p-1.5 shadow-[4px_4px_0px_#FF2D00]" style={{ background: 'var(--nexus-bg)', border: '2px solid var(--nexus-text)' }}>
                    <div className="w-full h-full rounded-none flex items-center justify-center text-[var(--nexus-bg)] font-black text-4xl" style={{ background: 'var(--nexus-text)' }}>
                        {username[0]}
                    </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FF2D00] border-2 rounded-none flex items-center justify-center" style={{ borderColor: 'var(--nexus-text)' }}>
                    <span className="w-2 h-2 bg-white animate-pulse" />
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                    <h2 className="font-sans font-black text-2xl uppercase tracking-tighter leading-none" style={{ color: 'var(--nexus-text)' }}>{username}</h2>
                    <span className="font-mono text-[7px] text-white uppercase tracking-widest font-black px-2 py-0.5 bg-[#FF2D00] border-2 rounded-none self-center md:self-auto" style={{ borderColor: 'var(--nexus-text)' }}>VERIFIED</span>
                </div>
                <p className="font-mono text-[9px] uppercase tracking-widest leading-relaxed mb-6 line-clamp-2" style={{ color: 'var(--nexus-text-muted)' }}>
                    Streaming // Tech & Design Enthusiast // Drope Network // <span className="opacity-50">PROTO_ENGAGED</span>
                </p>
                <div className="flex justify-center md:justify-start gap-2">
                    {['X', 'DISCORD', 'YT'].map((plat) => (
                        <div key={plat} className="px-3 py-1.5 border rounded-none font-mono text-[7px] uppercase tracking-widest font-bold" style={{ background: 'var(--nexus-bg)', color: 'var(--nexus-text)', borderColor: 'var(--nexus-border)' }}>
                            {plat}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

// ─── Lottie Sticker Component ───────────────────────────────────────────────
function LottieSticker({ url, isSelected }) {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(err => console.error("Lottie load failed:", err));
    }, [url]);

    if (!animationData) return <div className="w-12 h-12 animate-pulse" style={{ background: 'var(--nexus-border)' }} />;

    return (
        <div className={`w-14 h-14 flex items-center justify-center transition-transform duration-500 ${isSelected ? 'scale-110' : 'scale-100'}`}>
            <Lottie
                animationData={animationData}
                loop={true}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
}

// ─── Main Support Terminal Page ───────────────────────────────────────────────
export default function SupportTerminalPage() {
    const { id } = useParams();
    const [amount, setAmount] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [sticker, setSticker] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const username = id?.toUpperCase() || "CREATOR";

    const stickers = [
        { id: 'fire', url: LOTTIE_STICKERS.fire },
        { id: 'heart', url: LOTTIE_STICKERS.heart },
        { id: 'hype', url: LOTTIE_STICKERS.hype },
        { id: 'cool', url: LOTTIE_STICKERS.cool },
        { id: 'rocket', url: LOTTIE_STICKERS.rocket },
        { id: 'gem', url: LOTTIE_STICKERS.gem },
    ];

    const handleSupport = () => {
        if (!amount || !name) return;
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setSuccess(true);
        }, 2500);
    };

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center py-12 px-4 sm:px-6 overflow-hidden" 
             style={{ background: 'var(--nexus-bg)', color: 'var(--nexus-text)' }}>

            {/* ── TECHNICAL BACKGROUND ── */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(var(--nexus-text) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

            {/* ── LOGO / HEADER ── */}
            <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 flex flex-col items-center text-center"
            >
                <Logo size="1.8rem" accentColor="#FF2D00" className="mb-6" />
                <div className="flex items-center gap-3">
                    <div className="w-8 h-[2px]" style={{ background: 'var(--nexus-text)' }} />
                    <p className="font-mono text-[9px] uppercase tracking-[0.6em] font-black" style={{ color: 'var(--nexus-text)' }}>Sync Terminal Protocol</p>
                    <div className="w-8 h-[2px]" style={{ background: 'var(--nexus-text)' }} />
                </div>
            </motion.header>

            <motion.main
                initial="hidden"
                animate="show"
                variants={stagger}
                className="w-full max-w-2xl relative z-10"
            >
                {/* ── MASTER CONTAINER ── */}
                <div className="nexus-card border-4 shadow-[16px_16px_0px_#FF2D00] overflow-hidden" 
                     style={{ background: 'var(--nexus-panel)', borderColor: 'var(--nexus-text)' }}>

                    {/* Internal Content Header: Technical Status */}
                    <div className="py-8 px-8 flex items-center justify-between border-b-2" style={{ borderColor: 'var(--nexus-text)', background: 'rgba(255,255,255,0.02)' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-[#FF2D00] animate-pulse" />
                            <p className="font-mono text-[8px] uppercase tracking-[0.4em] font-black">SYSTEM_LIVE // ENCRYPTED_SYNC</p>
                        </div>
                        <p className="font-mono text-[7px] uppercase tracking-widest leading-none" style={{ color: 'var(--nexus-text-muted)' }}>NODE_ID: {id?.slice(0, 8) || '0x0000'}</p>
                    </div>

                    <div className="p-4 sm:p-5 space-y-5">
                        <AnimatePresence mode="wait">
                            {!success ? (
                                <motion.div key="terminal" exit={{ opacity: 0, scale: 0.98, y: -5 }} className="space-y-5">

                                    {/* Profile Section */}
                                    <StreamerProfile username={username} />

                                    {/* Donation Section */}
                                    <motion.div
                                        variants={fadeUp}
                                        className="nexus-card border-2 overflow-hidden"
                                        style={{ background: 'rgba(0,0,0,0.1)', borderColor: 'var(--nexus-text)' }}
                                    >
                                        <div className="px-6 md:px-10 py-5 border-b-2 flex items-center justify-between relative" style={{ borderColor: 'var(--nexus-text)', background: 'rgba(255,255,255,0.02)' }}>
                                            <p className="font-mono text-[8px] font-black uppercase tracking-[0.4em]">Execute Support</p>
                                            <div className="flex gap-2 items-center">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
                                                <span className="font-mono text-[8px] text-emerald-500 uppercase tracking-widest font-black">SYNC_ONLINE</span>
                                            </div>
                                        </div>

                                        <div className="p-6 md:p-10 space-y-10">
                                            <section>
                                                <p className="font-mono text-[8px] uppercase tracking-widest mb-4 font-black" style={{ color: 'var(--nexus-text-muted)' }}>01 // SELECT AMOUNT</p>
                                                <div className="grid grid-cols-3 gap-3 mb-4">
                                                    {['100', '500', '2000'].map((val) => (
                                                        <button
                                                            key={val}
                                                            onClick={() => setAmount(val)}
                                                            className={`py-3.5 rounded-none font-sans font-black text-xl transition-all border-2 
                                ${amount === val ? 'text-[var(--nexus-bg)] shadow-[4px_4px_0px_#FF2D00]' : 'bg-transparent text-[var(--nexus-text-muted)]'}`}
                                                            style={{ 
                                                                background: amount === val ? 'var(--nexus-text)' : 'transparent',
                                                                borderColor: 'var(--nexus-text)'
                                                            }}
                                                        >
                                                            ₹{val}
                                                        </button>
                                                    ))}
                                                </div>
                                                <input
                                                    type="number"
                                                    placeholder="CUSTOM AMOUNT"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    className="w-full border-2 rounded-none p-4 font-mono text-[10px] uppercase tracking-widest outline-none transition-colors"
                                                    style={{ background: 'var(--nexus-bg)', borderColor: 'var(--nexus-text)', color: 'var(--nexus-text)' }}
                                                />
                                            </section>

                                            {/* 2. STICKER PROTOCOL */}
                                            <section>
                                                <p className="font-mono text-[8px] uppercase tracking-widest mb-4 font-black" style={{ color: 'var(--nexus-text-muted)' }}>02 // STICKER PROTOCOL</p>
                                                <div className="grid grid-cols-6 gap-2">
                                                    {stickers.map((s) => (
                                                        <button
                                                            key={s.id}
                                                            onClick={() => setSticker(sticker === s.id ? null : s.id)}
                                                            className={`aspect-square flex items-center justify-center border-2 transition-all overflow-hidden relative
                                ${sticker === s.id ? 'shadow-[4px_4px_0px_#FF2D00]' : 'opacity-50 hover:opacity-100'}`}
                                                            style={{ 
                                                                background: 'var(--nexus-bg)',
                                                                borderColor: sticker === s.id ? 'var(--nexus-text)' : 'var(--nexus-border)'
                                                            }}
                                                        >
                                                            <LottieSticker url={s.url} isSelected={sticker === s.id} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </section>

                                            {/* 3. IDENTITY & MESSAGE */}
                                            <div className="space-y-4">
                                                <p className="font-mono text-[8px] uppercase tracking-widest mb-1 font-black" style={{ color: 'var(--nexus-text-muted)' }}>03 // TRIGGER PARAMS</p>
                                                <input
                                                    placeholder="YOUR NICKNAME"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full border-2 rounded-none p-4 font-mono text-[10px] uppercase tracking-widest outline-none"
                                                    style={{ background: 'var(--nexus-bg)', borderColor: 'var(--nexus-text)', color: 'var(--nexus-text)' }}
                                                />
                                                <textarea
                                                    placeholder="TRIGGER MESSAGE"
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    rows={2}
                                                    className="w-full border-2 rounded-none p-4 font-mono text-[10px] uppercase tracking-widest outline-none resize-none"
                                                    style={{ background: 'var(--nexus-bg)', borderColor: 'var(--nexus-text)', color: 'var(--nexus-text)' }}
                                                />
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.01, x: 2, y: -2 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={handleSupport}
                                                disabled={isProcessing || !amount || !name}
                                                className={`w-full py-5 rounded-none font-sans font-black text-[12px] uppercase tracking-[0.3em] transition-all relative border-2
                                ${isProcessing ? 'opacity-50' : 'bg-[#FF2D00] text-white shadow-[6px_6px_0px_var(--nexus-text)]'}`}
                                                style={{ borderColor: 'var(--nexus-text)' }}
                                            >
                                                {isProcessing ? 'SYNCHRONIZING...' : 'EXECUTE SUPPORT'}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-16 text-center border rounded-[2.5rem]"
                                    style={{ background: 'var(--nexus-panel)', borderColor: 'var(--nexus-border)' }}
                                >
                                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-10 shadow-lg shadow-emerald-500/20">✓</div>
                                    <h2 className="font-sans font-black text-3xl uppercase tracking-tighter mb-4" style={{ color: 'var(--nexus-text)' }}>Support Sent</h2>
                                    <p className="font-mono text-[10px] uppercase tracking-widest mb-10" style={{ color: 'var(--nexus-text-muted)' }}>Successfully triggered on {username}&apos;s stream.</p>
                                    <button
                                        onClick={() => { setSuccess(false); setAmount(''); setName(''); setMessage(''); setSticker(null); }}
                                        className="font-mono text-[9px] uppercase tracking-widest text-[#FF2D00] hover:underline"
                                    >
                                        ← SEND ANOTHER
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.main>

            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 text-center"
            >
                <p className="font-mono text-[8px] uppercase tracking-[0.5em] opacity-30">Drope Real-time Sync Architecture</p>
            </motion.footer>
        </div>
    );
}
