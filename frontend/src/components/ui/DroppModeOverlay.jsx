import React, { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
    "#FF2D00",
    "#FF5533",
    "#FF1A00",
    "rgba(255,45,0,0.7)",
    "#FFFFFF",
    "rgba(255,255,255,0.5)",
    "#CC2400",
];

export const DroppModeOverlay = ({ isOpen, onClose }) => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const settledBlobsRef = useRef([]);
    const splashTextsRef = useRef([]);
    const dropCountRef = useRef(0);
    const dropCountDisplayRef = useRef(null);
    const animFrameRef = useRef(0);
    const mouseRef = useRef({ x: -999, y: -999 });
    const isRunningRef = useRef(false);

    const getScrollOffset = useCallback(() => {
        const container = document.querySelector('.home-scroll-container');
        if (container) {
            return { x: container.scrollLeft, y: container.scrollTop };
        }
        return { x: window.scrollX, y: window.scrollY };
    }, []);

    const drawBlob = useCallback(
        (ctx, x, y, r, color, alpha) => {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = color;
            ctx.beginPath();
            const points = 8;
            for (let i = 0; i <= points; i++) {
                const angle = (i / points) * Math.PI * 2;
                const jitter = r * (0.6 + Math.random() * 0.7);
                const px = x + Math.cos(angle) * jitter;
                const py = y + Math.sin(angle) * jitter;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        },
        []
    );

    const spawnSplash = useCallback((x, y) => {
        const count = 18 + Math.floor(Math.random() * 14);
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 8;
            particlesRef.current.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - Math.random() * 3,
                radius: 4 + Math.random() * 12,
                color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? "#FF2D00",
                alpha: 0.85 + Math.random() * 0.15,
                gravity: 0.18 + Math.random() * 0.12,
                decay: 0.012 + Math.random() * 0.008,
                settled: false,
            });
        }
        // Big central blob (stays)
        settledBlobsRef.current.push({
            x,
            y,
            radius: 14 + Math.random() * 10,
            color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? "#FF2D00",
        });

        // Floating 💧 text
        splashTextsRef.current.push({ x, y, alpha: 1, vy: -1.5 - Math.random() });

        dropCountRef.current += 1;
        if (dropCountDisplayRef.current) {
            dropCountDisplayRef.current.textContent = String(dropCountRef.current).padStart(3, "0");
        }
    }, []);

    const loop = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isRunningRef.current) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const offset = getScrollOffset();

        // Draw settled blobs (permanent)
        for (const blob of settledBlobsRef.current) {
            drawBlob(ctx, blob.x - offset.x, blob.y - offset.y, blob.radius, blob.color, 0.9);
        }

        // Update + draw live particles
        particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.02);
        for (const p of particlesRef.current) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.97;
            p.alpha -= p.decay;
            drawBlob(ctx, p.x - offset.x, p.y - offset.y, p.radius, p.color, Math.max(0, p.alpha));
        }

        // Draw + update splash emojis
        splashTextsRef.current = splashTextsRef.current.filter((t) => t.alpha > 0.02);
        for (const t of splashTextsRef.current) {
            ctx.save();
            ctx.globalAlpha = t.alpha;
            ctx.font = "22px serif";
            ctx.textAlign = "center";
            ctx.fillText("💧", t.x - offset.x, t.y - offset.y);
            ctx.restore();
            t.y += t.vy;
            t.alpha -= 0.018;
        }

        // Draw custom crosshair dot at mouse (screen-space)
        const { x: mx, y: my } = mouseRef.current;
        if (mx > -100) {
            ctx.save();
            ctx.strokeStyle = "#FF2D00";
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = 0.9;
            // Horizontal
            ctx.beginPath();
            ctx.moveTo(mx - 12, my);
            ctx.lineTo(mx + 12, my);
            ctx.stroke();
            // Vertical
            ctx.beginPath();
            ctx.moveTo(mx, my - 12);
            ctx.lineTo(mx, my + 12);
            ctx.stroke();
            // Center dot
            ctx.fillStyle = "#FF2D00";
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        animFrameRef.current = requestAnimationFrame(loop);
    }, [drawBlob, getScrollOffset]);

    // Start / stop loop on open
    useEffect(() => {
        if (isOpen) {
            isRunningRef.current = true;
            particlesRef.current = [];
            settledBlobsRef.current = [];
            splashTextsRef.current = [];
            dropCountRef.current = 0;
            if (dropCountDisplayRef.current) dropCountDisplayRef.current.textContent = "000";

            // Resize canvas
            const resize = () => {
                if (canvasRef.current) {
                    canvasRef.current.width = window.innerWidth;
                    canvasRef.current.height = window.innerHeight;
                }
            };
            resize();
            window.addEventListener("resize", resize);

            animFrameRef.current = requestAnimationFrame(loop);

            // ESC key
            const onKey = (e) => { if (e.key === "Escape") onClose(); };
            window.addEventListener("keydown", onKey);

            return () => {
                isRunningRef.current = false;
                cancelAnimationFrame(animFrameRef.current);
                window.removeEventListener("resize", resize);
                window.removeEventListener("keydown", onKey);
            };
        }
    }, [isOpen, loop, onClose]);

    useEffect(() => {
        if (!isOpen) return;
        
        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        const handleMouseLeave = () => {
            mouseRef.current = { x: -999, y: -999 };
        };
        const handleGlobalClick = (e) => {
            // Prevent spawning if clicking the exit/clear buttons
            if (e.target.tagName === 'BUTTON') return;
            const offset = getScrollOffset();
            spawnSplash(e.clientX + offset.x, e.clientY + offset.y);
        };

        // Attach globally so it works while pointer-events are none on the overlay
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.documentElement.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('click', handleGlobalClick);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('click', handleGlobalClick);
            mouseRef.current = { x: -999, y: -999 };
        };
    }, [isOpen, spawnSplash, getScrollOffset]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[999] pointer-events-none"
                    style={{
                        background: "transparent",
                    }}
                >
                    {/* Hide default cursor globally when active */}
                    <style>{`body { cursor: crosshair !important; }`}</style>

                    {/* Canvas */}
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                    />

                    {/* Top center — Drop counter */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none select-none">
                        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500">Drops</span>
                        <span
                            ref={dropCountDisplayRef}
                            className="font-mono text-[28px] font-black text-[#FF2D00] leading-none tabular-nums"
                        >
                            000
                        </span>
                    </div>

                    {/* Top-left — Mode label */}
                    <div className="absolute top-6 left-[clamp(1.5rem,5vw,4rem)] pointer-events-none select-none">
                        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                            ● DROPE MODE
                        </span>
                    </div>

                    {/* Bottom-right — Controls: CLEAR + EXIT */}
                    <div className="absolute bottom-8 right-[clamp(1.5rem,5vw,4rem)] flex items-center gap-4 pointer-events-auto z-10">
                        <motion.button
                            onClick={(e) => { e.stopPropagation(); particlesRef.current = []; settledBlobsRef.current = []; splashTextsRef.current = []; dropCountRef.current = 0; if(dropCountDisplayRef.current) dropCountDisplayRef.current.textContent = "000"; }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-300 transition-colors duration-200 pointer-events-auto bg-black/50 backdrop-blur-sm px-3 py-1.5"
                        >
                            [ CLEAR ]
                        </motion.button>
                        <motion.button
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF2D00] hover:text-white transition-colors duration-200 border border-[#FF2D00]/40 hover:border-white/40 px-3 py-1.5 pointer-events-auto bg-black/50 backdrop-blur-sm"
                        >
                            [ × EXIT ]
                        </motion.button>
                    </div>

                    {/* Bottom-center — Hint */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none select-none">
                        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-700">
                            Click anywhere to drop
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
