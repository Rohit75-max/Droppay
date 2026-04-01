import React, { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DANGER_COLORS = ["#FF2D00", "#FF5533", "#CC2400", "#FF1A00", "#FF6644"];

export const DodgeGameOverlay = ({ isOpen, onClose }) => {
    const canvasRef = useRef(null);
    const shapesRef = useRef([]);
    const playerRef = useRef({ x: -999, y: -999, active: false });
    const gameStateRef = useRef("idle");
    const [gameState, setGameState] = useState("idle");
    const [countdown, setCountdown] = useState(3);
    const [displayTime, setDisplayTime] = useState(0);
    const [bestTime, setBestTime] = useState(0);
    const timerRef = useRef(0);
    const animFrameRef = useRef(0);
    const isRunningRef = useRef(false);
    const shapeIdRef = useRef(0);
    const spawnTimerRef = useRef(null);
    const gameTimerRef = useRef(null);
    const countdownTimerRef = useRef(null);
    const difficultyRef = useRef(1);

    // ─── Draw helpers ──────────────────────────────────────────────────────
    const drawShape = useCallback((ctx, shape) => {
        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);
        ctx.globalAlpha = shape.opacity;
        ctx.fillStyle = shape.color;
        ctx.shadowColor = shape.color;
        ctx.shadowBlur = 12;

        switch (shape.type) {
            case "circle":
                ctx.beginPath();
                ctx.arc(0, 0, shape.size, 0, Math.PI * 2);
                ctx.fill();
                break;
            case "square":
                ctx.fillRect(-shape.size, -shape.size, shape.size * 2, shape.size * 2);
                break;
            case "triangle":
                ctx.beginPath();
                ctx.moveTo(0, -shape.size);
                ctx.lineTo(shape.size, shape.size);
                ctx.lineTo(-shape.size, shape.size);
                ctx.closePath();
                ctx.fill();
                break;
            case "diamond":
                ctx.beginPath();
                ctx.moveTo(0, -shape.size);
                ctx.lineTo(shape.size * 0.7, 0);
                ctx.lineTo(0, shape.size);
                ctx.lineTo(-shape.size * 0.7, 0);
                ctx.closePath();
                ctx.fill();
                break;
            default:
                break;
        }
        ctx.restore();
    }, []);

    const drawPlayer = useCallback((ctx, x, y) => {
        if (x < 0) return;
        ctx.save();
        // Outer glow ring
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.stroke();
        // Crosshair lines
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "#FFFFFF";
        ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.moveTo(x - 18, y); ctx.lineTo(x - 6, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + 6, y); ctx.lineTo(x + 18, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y - 18); ctx.lineTo(x, y - 6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y + 6); ctx.lineTo(x, y + 18); ctx.stroke();
        // Center dot
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }, []);

    // ─── Collision ─────────────────────────────────────────────────────────
    const checkCollision = useCallback((shape) => {
        const { x: px, y: py, active } = playerRef.current;
        if (!active || px < 0) return false;
        const dx = px - shape.x;
        const dy = py - shape.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hitRadius = shape.type === "circle" ? shape.size : shape.size * 0.85;
        return dist < hitRadius + 7;
    }, []);

    // ─── Kill ───────────────────────────────────────────────────────────────
    const killPlayer = useCallback(() => {
        gameStateRef.current = "dead";
        setGameState("dead");
        isRunningRef.current = false;
        if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
        if (gameTimerRef.current) clearInterval(gameTimerRef.current);
        setBestTime(prev => Math.max(prev, timerRef.current));
    }, []);

    // ─── Spawn ──────────────────────────────────────────────────────────────
    const spawnShape = useCallback(() => {
        if (gameStateRef.current !== "playing") return;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const side = Math.floor(Math.random() * 4);
        let x = 0, y = 0;
        if (side === 0) { x = Math.random() * W; y = -40; }
        else if (side === 1) { x = W + 40; y = Math.random() * H; }
        else if (side === 2) { x = Math.random() * W; y = H + 40; }
        else { x = -40; y = Math.random() * H; }

        // Aim at player (or screen center if player inactive)
        const tx = playerRef.current.active ? playerRef.current.x : W / 2;
        const ty = playerRef.current.active ? playerRef.current.y : H / 2;
        const dx = tx - x;
        const dy = ty - y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const speed = (2.5 + Math.random() * 2.5) * difficultyRef.current;

        const types = ["circle", "triangle", "square", "diamond"];

        shapesRef.current.push({
            id: shapeIdRef.current++,
            x, y,
            vx: (dx / dist) * speed,
            vy: (dy / dist) * speed,
            size: 12 + Math.random() * 18,
            type: types[Math.floor(Math.random() * types.length)] ?? "circle",
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.07,
            color: DANGER_COLORS[Math.floor(Math.random() * DANGER_COLORS.length)] ?? "#FF2D00",
            opacity: 0.88,
        });
    }, []);

    // ─── Game loop ──────────────────────────────────────────────────────────
    const loop = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isRunningRef.current) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Subtle scan-line vignette
        const vignette = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, canvas.height * 0.3,
            canvas.width / 2, canvas.height / 2, canvas.height * 0.8
        );
        vignette.addColorStop(0, "rgba(0,0,0,0)");
        vignette.addColorStop(1, "rgba(0,0,0,0.4)");
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update + draw shapes
        for (const shape of shapesRef.current) {
            shape.x += shape.vx;
            shape.y += shape.vy;
            shape.rotation += shape.rotSpeed;
            if (checkCollision(shape)) { killPlayer(); return; }
            drawShape(ctx, shape);
        }

        // Cull off-screen
        const W = canvas.width + 120;
        const H = canvas.height + 120;
        shapesRef.current = shapesRef.current.filter(
            s => s.x > -120 && s.x < W && s.y > -120 && s.y < H
        );

        // Draw player
        drawPlayer(ctx, playerRef.current.x, playerRef.current.y);

        animFrameRef.current = requestAnimationFrame(loop);
    }, [drawShape, drawPlayer, checkCollision, killPlayer]);

    // ─── Start game (after countdown) ──────────────────────────────────────
    const startGame = useCallback(() => {
        shapesRef.current = [];
        timerRef.current = 0;
        difficultyRef.current = 1;
        setDisplayTime(0);
        gameStateRef.current = "playing";
        setGameState("playing");
        isRunningRef.current = true;

        // Spawn timer — starts slow, gets faster
        const startSpawn = () => {
            const interval = Math.max(300, 900 - (difficultyRef.current - 1) * 150);
            spawnTimerRef.current = setTimeout(() => {
                spawnShape();
                if (difficultyRef.current > 1.5) spawnShape(); // double-spawn at high diff
                if (gameStateRef.current === "playing") startSpawn();
            }, interval);
        };
        startSpawn();

        // Game timer
        gameTimerRef.current = setInterval(() => {
            if (gameStateRef.current !== "playing") return;
            timerRef.current += 1;
            setDisplayTime(timerRef.current);
            if (timerRef.current % 5 === 0) {
                difficultyRef.current = Math.min(3.5, difficultyRef.current + 0.2);
            }
        }, 1000);

        animFrameRef.current = requestAnimationFrame(loop);
    }, [spawnShape, loop]);

    // ─── Countdown then start ───────────────────────────────────────────────
    const beginCountdown = useCallback(() => {
        setGameState("countdown");
        gameStateRef.current = "countdown";
        setCountdown(3);
        let c = 3;
        countdownTimerRef.current = setInterval(() => {
            c -= 1;
            if (c <= 0) {
                if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
                startGame();
            } else {
                setCountdown(c);
            }
        }, 1000);
    }, [startGame]);

    // ─── Restart ────────────────────────────────────────────────────────────
    const restart = useCallback(() => {
        isRunningRef.current = false;
        cancelAnimationFrame(animFrameRef.current);
        if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
        if (gameTimerRef.current) clearInterval(gameTimerRef.current);
        shapesRef.current = [];
        beginCountdown();
    }, [beginCountdown]);

    // ─── Mount/unmount ──────────────────────────────────────────────────────
    useEffect(() => {
        if (isOpen) {
            const resize = () => {
                if (canvasRef.current) {
                    canvasRef.current.width = window.innerWidth;
                    canvasRef.current.height = window.innerHeight;
                }
            };
            resize();
            window.addEventListener("resize", resize);
            const onKey = (e) => { if (e.key === "Escape") onClose(); };
            window.addEventListener("keydown", onKey);

            return () => {
                isRunningRef.current = false;
                cancelAnimationFrame(animFrameRef.current);
                if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
                if (gameTimerRef.current) clearInterval(gameTimerRef.current);
                if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
                window.removeEventListener("resize", resize);
                window.removeEventListener("keydown", onKey);
                setGameState("idle");
                gameStateRef.current = "idle";
            };
        }
    }, [isOpen, onClose]);

    const handleMouseMove = useCallback((e) => {
        playerRef.current = { x: e.clientX, y: e.clientY, active: true };
    }, []);

    const handleClose = useCallback(() => {
        isRunningRef.current = false;
        cancelAnimationFrame(animFrameRef.current);
        if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
        if (gameTimerRef.current) clearInterval(gameTimerRef.current);
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        setGameState("idle");
        gameStateRef.current = "idle";
        shapesRef.current = [];
        onClose();
    }, [onClose]);

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
    };

    const difficultyLabel = () => {
        if (difficultyRef.current < 1.5) return { label: "NORMAL", color: "#22c55e" };
        if (difficultyRef.current < 2.2) return { label: "DANGER", color: "#f59e0b" };
        return { label: "CRITICAL", color: "#FF2D00" };
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[999]"
                    style={{ background: "rgba(4,4,4,0.95)", cursor: "none" }}
                    onMouseMove={handleMouseMove}
                >
                    {/* Canvas */}
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

                    {/* ── IDLE SCREEN ── */}
                    <AnimatePresence>
                        {gameState === "idle" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 flex flex-col items-center justify-center gap-8 select-none"
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-zinc-600">
                                        ● DROPE MODE — GAME 2
                                    </p>
                                    <h2 className="font-sans font-black text-[clamp(3rem,10vw,8rem)] leading-none uppercase text-white tracking-tight">
                                        Dodge
                                    </h2>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 text-center max-w-xs">
                                        Move your cursor to survive.<br />Don&apos;t let the shapes touch you.
                                    </p>
                                </div>
                                {bestTime > 0 && (
                                    <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                                        Best: {formatTime(bestTime)}
                                    </p>
                                )}
                                <motion.button
                                    onClick={beginCountdown}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    className="font-mono text-[11px] uppercase tracking-[0.3em] text-black bg-white px-8 py-3 hover:bg-[#FF2D00] hover:text-white transition-colors duration-200"
                                >
                                    [ START ]
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── COUNTDOWN ── */}
                    <AnimatePresence mode="wait">
                        {gameState === "countdown" && (
                            <motion.div
                                key={countdown}
                                initial={{ opacity: 0, scale: 1.4 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.7 }}
                                transition={{ duration: 0.35 }}
                                className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
                            >
                                <span className="font-sans font-black text-[20vw] leading-none text-white/10 tabular-nums">
                                    {countdown}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── PLAYING HUD ── */}
                    <AnimatePresence>
                        {gameState === "playing" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="pointer-events-none select-none"
                            >
                                {/* Top-left: timer */}
                                <div className="absolute top-6 left-[clamp(1.5rem,5vw,4rem)] flex flex-col gap-1">
                                    <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-zinc-600">Survived</span>
                                    <span className="font-mono text-[28px] font-black text-white leading-none tabular-nums">
                                        {formatTime(displayTime)}
                                    </span>
                                </div>
                                {/* Top-right: difficulty */}
                                <div className="absolute top-6 right-[clamp(1.5rem,5vw,4rem)] flex flex-col items-end gap-1">
                                    <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-zinc-600">Threat</span>
                                    <span
                                        className="font-mono text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-1000"
                                        style={{ color: difficultyLabel().color }}
                                    >
                                        {difficultyLabel().label}
                                    </span>
                                </div>
                                {/* Bottom-center: hint */}
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                                    <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-zinc-800">
                                        Keep moving
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── DEAD SCREEN ── */}
                    <AnimatePresence>
                        {gameState === "dead" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                                className="absolute inset-0 flex flex-col items-center justify-center gap-6 select-none"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#FF2D00]"
                                    >
                                        ● ELIMINATED
                                    </motion.p>
                                    <motion.h2
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="font-sans font-black text-[clamp(2.5rem,8vw,6rem)] leading-none uppercase text-white tracking-tight"
                                    >
                                        {formatTime(displayTime)}
                                    </motion.h2>
                                    {bestTime > displayTime && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500"
                                        >
                                            Best: {formatTime(bestTime)}
                                        </motion.p>
                                    )}
                                    {bestTime === displayTime && displayTime > 0 && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#FF2D00]"
                                        >
                                            ★ New Best
                                        </motion.p>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <motion.button
                                        onClick={restart}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.35 }}
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        className="font-mono text-[11px] uppercase tracking-[0.3em] text-black bg-white px-6 py-2.5 hover:bg-[#FF2D00] hover:text-white transition-colors duration-200"
                                    >
                                        [ RETRY ]
                                    </motion.button>
                                    <motion.button
                                        onClick={handleClose}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.45 }}
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#FF2D00] border border-[#FF2D00]/40 hover:border-[#FF2D00] px-6 py-2.5 transition-colors duration-200"
                                    >
                                        [ × EXIT ]
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Live EXIT (playing state only) ── */}
                    {gameState === "playing" && (
                        <motion.button
                            onClick={handleClose}
                            whileHover={{ scale: 1.05 }}
                            className="absolute bottom-8 right-[clamp(1.5rem,5vw,4rem)] font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF2D00] border border-[#FF2D00]/40 hover:border-[#FF2D00] px-3 py-1.5 transition-colors duration-200 z-10 pointer-events-auto"
                        >
                            [ × EXIT ]
                        </motion.button>
                    )}

                    {/* ── IDLE EXIT (idle state only) ── */}
                    {gameState === "idle" && (
                        <motion.button
                            onClick={handleClose}
                            whileHover={{ scale: 1.05 }}
                            className="absolute bottom-8 right-[clamp(1.5rem,5vw,4rem)] font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-300 transition-colors duration-200 z-10 pointer-events-auto"
                        >
                            [ × EXIT ]
                        </motion.button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
