import React, { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PLAYER_SPEED = 4.5;
const BULLET_SPEED = 10;
const SHOOT_INTERVAL = 180; // ms

export const SpaceShooterGame = ({ isOpen, onClose }) => {
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState("idle");
    const [score, setScore] = useState(0);
    const [wave, setWave] = useState(1);
    const [bestScore, setBestScore] = useState(0);

    const gStateRef = useRef("idle");
    const playerRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, angle: -Math.PI / 2, hp: 3, maxHp: 3, invincible: 0, size: 14, shootCd: 0 });
    const bulletsRef = useRef([]);
    const enemiesRef = useRef([]);
    const particlesRef = useRef([]);
    const starsRef = useRef([]);
    const scoreRef = useRef(0);
    const waveRef = useRef(1);
    const livesRef = useRef(3);
    const keysRef = useRef({});
    const mouseRef = useRef({ x: 0, y: 0 });
    const animRef = useRef(0);
    const isRunRef = useRef(false);
    const idRef = useRef(0);
    const spawnTimerRef = useRef(null);
    const lastShootRef = useRef(0);
    const waveKillsRef = useRef(0);
    const waveKillsNeededRef = useRef(5);

    // ── Draw helpers ────────────────────────────────────────────────────────
    const drawShip = (ctx, p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle + Math.PI / 2);
        const flash = p.invincible > 0 && Math.floor(p.invincible / 4) % 2 === 0;
        ctx.globalAlpha = flash ? 0.3 : 1;
        ctx.shadowColor = "#00BFFF";
        ctx.shadowBlur = 18;
        ctx.strokeStyle = "#00BFFF";
        ctx.fillStyle = "rgba(0,191,255,0.15)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size * 0.65, p.size * 0.8);
        ctx.lineTo(0, p.size * 0.4);
        ctx.lineTo(-p.size * 0.65, p.size * 0.8);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        // Engine glow
        ctx.shadowColor = "#FF6600";
        ctx.fillStyle = "rgba(255,100,0,0.6)";
        ctx.beginPath();
        ctx.ellipse(0, p.size * 0.45, p.size * 0.18, p.size * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    };

    const drawEnemy = (ctx, e) => {
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.rotate(e.rotation);
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 16;
        ctx.fillStyle = e.color;
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.9;
        if (e.type === "scout") {
            ctx.beginPath(); ctx.arc(0, 0, e.size, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 0.4; ctx.stroke();
        } else if (e.type === "tank") {
            // Hexagon
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const a = (i / 6) * Math.PI * 2;
                if (i === 0) ctx.moveTo(Math.cos(a) * e.size, Math.sin(a) * e.size);
                else ctx.lineTo(Math.cos(a) * e.size, Math.sin(a) * e.size);
            }
            ctx.closePath(); ctx.fill(); ctx.globalAlpha = 0.5; ctx.stroke();
            // HP bar
            ctx.globalAlpha = 1;
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(-e.size, -e.size - 10, e.size * 2, 4);
            ctx.fillStyle = "#FF2D00";
            ctx.fillRect(-e.size, -e.size - 10, (e.hp / e.maxHp) * e.size * 2, 4);
        } else {
            // Boss — octagon
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                const a = (i / 8) * Math.PI * 2;
                if (i === 0) ctx.moveTo(Math.cos(a) * e.size, Math.sin(a) * e.size);
                else ctx.lineTo(Math.cos(a) * e.size, Math.sin(a) * e.size);
            }
            ctx.closePath(); ctx.fill(); ctx.globalAlpha = 0.6; ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(-e.size, -e.size - 14, e.size * 2, 6);
            ctx.fillStyle = "#FF2D00";
            ctx.fillRect(-e.size, -e.size - 14, (e.hp / e.maxHp) * e.size * 2, 6);
            ctx.fillStyle = "#FFF"; ctx.font = "bold 9px monospace"; ctx.textAlign = "center";
            ctx.fillText("BOSS", 0, -e.size - 18);
        }
        ctx.restore();
    };

    const drawBullet = (ctx, b) => {
        ctx.save();
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 12;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    };

    const spawnParticles = useCallback((x, y, color, count = 10) => {
        for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2;
            const spd = 1.5 + Math.random() * 4;
            particlesRef.current.push({
                id: idRef.current++,
                x, y,
                vx: Math.cos(a) * spd,
                vy: Math.sin(a) * spd,
                alpha: 1,
                size: 2 + Math.random() * 4,
                color,
                decay: 0.02 + Math.random() * 0.02,
            });
        }
    }, []);

    const initStars = useCallback((W, H) => {
        starsRef.current = Array.from({ length: 120 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            size: Math.random() * 1.8,
            speed: 0.3 + Math.random() * 0.8,
            alpha: 0.2 + Math.random() * 0.6,
        }));
    }, []);

    const spawnEnemy = useCallback((type) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const W = canvas.width; const H = canvas.height;
        const side = Math.floor(Math.random() * 4);
        let x = 0, y = 0;
        if (side === 0) { x = Math.random() * W; y = -60; }
        else if (side === 1) { x = W + 60; y = Math.random() * H; }
        else if (side === 2) { x = Math.random() * W; y = H + 60; }
        else { x = -60; y = Math.random() * H; }

        const configs = {
            scout: { hp: 1, size: 10, color: "#FF2D00", speed: 1.8 + waveRef.current * 0.1, rotSpeed: 0.03, pts: 100 },
            tank: { hp: 4, size: 20, color: "#FF8800", speed: 0.9 + waveRef.current * 0.05, rotSpeed: 0.01, pts: 300 },
            boss: { hp: 20 + waveRef.current * 5, size: 38, color: "#CC00FF", speed: 0.6, rotSpeed: 0.008, pts: 1500 },
        };
        const cfg = configs[type];

        const px = playerRef.current.x; const py = playerRef.current.y;
        const dx = px - x; const dy = py - y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        enemiesRef.current.push({
            id: idRef.current++,
            x, y,
            vx: (dx / dist) * cfg.speed,
            vy: (dy / dist) * cfg.speed,
            hp: cfg.hp, maxHp: cfg.hp,
            size: cfg.size, type,
            color: cfg.color,
            shootCd: type === "boss" ? 60 : type === "tank" ? 120 : 9999,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: cfg.rotSpeed,
            pts: cfg.pts,
        });
    }, []);

    const nextWave = useCallback(() => {
        waveRef.current += 1;
        setWave(waveRef.current);
        waveKillsRef.current = 0;
        const w = waveRef.current;
        const isBossWave = w % 5 === 0;
        waveKillsNeededRef.current = isBossWave ? 1 + Math.floor(w / 2) : 5 + w * 2;

        if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
        const toSpawn = isBossWave ? [{ type: "boss", count: 1 }, { type: "scout", count: w }]
            : w % 3 === 0 ? [{ type: "scout", count: 4 + w }, { type: "tank", count: 1 + Math.floor(w / 3) }]
                : [{ type: "scout", count: 5 + w }];
        
        const flat = toSpawn.flatMap(e => Array(e.count).fill(e.type));
        let idx = 0;
        spawnTimerRef.current = setInterval(() => {
            if (gStateRef.current !== "playing" || idx >= flat.length) {
                if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
                return;
            }
            spawnEnemy(flat[idx++]);
        }, isBossWave ? 1200 : 600);
    }, [spawnEnemy]);

    // ── Main Loop ────────────────────────────────────────────────────────────
    const loop = useCallback((timestamp) => {
        const canvas = canvasRef.current;
        if (!canvas || !isRunRef.current) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const W = canvas.width; const H = canvas.height;

        // Background
        ctx.fillStyle = "rgba(4,4,12,0.88)";
        ctx.fillRect(0, 0, W, H);

        // Stars
        for (const s of starsRef.current) {
            s.y += s.speed;
            if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
            ctx.globalAlpha = s.alpha;
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;

        // ── Player movement ──
        const p = playerRef.current;
        const keys = keysRef.current;
        if (keys["w"] || keys["arrowup"]) p.vy -= 0.5;
        if (keys["s"] || keys["arrowdown"]) p.vy += 0.5;
        if (keys["a"] || keys["arrowleft"]) p.vx -= 0.5;
        if (keys["d"] || keys["arrowright"]) p.vx += 0.5;
        p.vx *= 0.88; p.vy *= 0.88;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > PLAYER_SPEED) { p.vx = (p.vx / speed) * PLAYER_SPEED; p.vy = (p.vy / speed) * PLAYER_SPEED; }
        p.x = Math.max(p.size, Math.min(W - p.size, p.x + p.vx));
        p.y = Math.max(p.size, Math.min(H - p.size, p.y + p.vy));
        p.angle = Math.atan2(mouseRef.current.y - p.y, mouseRef.current.x - p.x) - Math.PI / 2;
        if (p.invincible > 0) p.invincible--;

        // ── Auto shoot ──
        if (timestamp - lastShootRef.current > SHOOT_INTERVAL) {
            lastShootRef.current = timestamp;
            const a = Math.atan2(mouseRef.current.y - p.y, mouseRef.current.x - p.x);
            bulletsRef.current.push({ id: idRef.current++, x: p.x, y: p.y, vx: Math.cos(a) * BULLET_SPEED, vy: Math.sin(a) * BULLET_SPEED, size: 4, owner: "player", color: "#00DDFF" });
        }

        // ── Bullets ──
        bulletsRef.current = bulletsRef.current.filter(b => b.x > -20 && b.x < W + 20 && b.y > -20 && b.y < H + 20);
        for (const b of bulletsRef.current) {
            b.x += b.vx; b.y += b.vy;
            drawBullet(ctx, b);

            if (b.owner === "player") {
                // Hit enemies
                for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
                    const e = enemiesRef.current[i];
                    const dx = b.x - e.x; const dy = b.y - e.y;
                    if (Math.sqrt(dx * dx + dy * dy) < e.size + b.size) {
                        e.hp -= 1;
                        spawnParticles(b.x, b.y, e.color, 5);
                        bulletsRef.current = bulletsRef.current.filter(bb => bb.id !== b.id);
                        if (e.hp <= 0) {
                            spawnParticles(e.x, e.y, e.color, e.type === "boss" ? 25 : e.type === "tank" ? 15 : 8);
                            scoreRef.current += e.pts;
                            setScore(scoreRef.current);
                            waveKillsRef.current++;
                            enemiesRef.current.splice(i, 1);
                            if (waveKillsRef.current >= waveKillsNeededRef.current) nextWave();
                        }
                        break;
                    }
                }
            } else {
                // Enemy bullet hits player
                if (p.invincible === 0) {
                    const dx = b.x - p.x; const dy = b.y - p.y;
                    if (Math.sqrt(dx * dx + dy * dy) < p.size + b.size) {
                        p.hp -= 1;
                        p.invincible = 80;
                        spawnParticles(p.x, p.y, "#00BFFF", 12);
                        bulletsRef.current = bulletsRef.current.filter(bb => bb.id !== b.id);
                        livesRef.current = p.hp;
                        if (p.hp <= 0) {
                            spawnParticles(p.x, p.y, "#00BFFF", 30);
                            gStateRef.current = "dead";
                            setGameState("dead");
                            isRunRef.current = false;
                            setBestScore(prev => Math.max(prev, scoreRef.current));
                            if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
                            return;
                        }
                    }
                }
            }
        }

        // ── Enemies ──
        for (const e of enemiesRef.current) {
            // Home toward player
            const dx = p.x - e.x; const dy = p.y - e.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const baseSpd = e.type === "boss" ? 0.6 : e.type === "tank" ? 1 : 1.8 + waveRef.current * 0.08;
            e.vx = (e.vx * 0.95) + (dx / dist) * baseSpd * 0.08;
            e.vy = (e.vy * 0.95) + (dy / dist) * baseSpd * 0.08;
            const spd = Math.sqrt(e.vx * e.vx + e.vy * e.vy);
            if (spd > baseSpd) { e.vx = (e.vx / spd) * baseSpd; e.vy = (e.vy / spd) * baseSpd; }
            e.x += e.vx; e.y += e.vy;
            e.rotation += e.rotSpeed;

            // Enemy shoot (tank + boss)
            if (e.type !== "scout") {
                e.shootCd--;
                if (e.shootCd <= 0) {
                    const a = Math.atan2(p.y - e.y, p.x - e.x);
                    const bSpd = e.type === "boss" ? 5 : 3.5;
                    bulletsRef.current.push({ id: idRef.current++, x: e.x, y: e.y, vx: Math.cos(a) * bSpd, vy: Math.sin(a) * bSpd, size: 5, owner: "enemy", color: e.type === "boss" ? "#CC00FF" : "#FF8800" });
                    if (e.type === "boss") {
                        // Triple shot
                        for (const offset of [-0.3, 0.3]) {
                            bulletsRef.current.push({ id: idRef.current++, x: e.x, y: e.y, vx: Math.cos(a + offset) * bSpd, vy: Math.sin(a + offset) * bSpd, size: 5, owner: "enemy", color: "#CC00FF" });
                        }
                    }
                    e.shootCd = e.type === "boss" ? 50 : 90;
                }
            }

            // Ramming damage
            if (p.invincible === 0 && Math.sqrt((p.x - e.x) ** 2 + (p.y - e.y) ** 2) < p.size + e.size) {
                p.hp -= 1;
                p.invincible = 80;
                livesRef.current = p.hp;
                spawnParticles(p.x, p.y, "#00BFFF", 10);
                if (p.hp <= 0) {
                    spawnParticles(p.x, p.y, "#00BFFF", 30);
                    gStateRef.current = "dead";
                    setGameState("dead");
                    isRunRef.current = false;
                    setBestScore(prev => Math.max(prev, scoreRef.current));
                    livesRef.current = Math.max(0, livesRef.current - 1); clearInterval(spawnTimerRef.current);
                    return;
                }
            }

            drawEnemy(ctx, e);
        }

        // ── Particles ──
        particlesRef.current = particlesRef.current.filter(p => p.alpha > 0.02);
        for (const pt of particlesRef.current) {
            pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.05; pt.alpha -= pt.decay;
            ctx.save();
            ctx.globalAlpha = pt.alpha;
            ctx.shadowColor = pt.color;
            ctx.shadowBlur = 8;
            ctx.fillStyle = pt.color;
            ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        }

        // ── Draw player ──
        drawShip(ctx, p);

        // ── HUD ──
        ctx.globalAlpha = 1;
        // Score
        ctx.shadowColor = "#00BFFF"; ctx.shadowBlur = 6;
        ctx.fillStyle = "#FFFFFF"; ctx.font = "bold 11px 'Courier New', monospace";
        ctx.textAlign = "left";
        ctx.fillText(`SCORE  ${String(scoreRef.current).padStart(7, "0")}`, 24, 30);
        // Wave
        ctx.textAlign = "center";
        ctx.fillStyle = "#AAAAAA";
        ctx.shadowBlur = 0;
        ctx.font = "9px 'Courier New', monospace";
        ctx.fillText(`WAVE ${waveRef.current}  ·  KILLS ${waveKillsRef.current}/${waveKillsNeededRef.current}`, W / 2, 28);
        // Lives (hearts)
        ctx.textAlign = "right";
        ctx.font = "14px serif";
        ctx.shadowBlur = 0;
        const hearts = "♥".repeat(Math.max(0, livesRef.current)) + "♡".repeat(Math.max(0, 3 - livesRef.current));
        ctx.fillStyle = "#FF2D00";
        ctx.fillText(hearts, W - 24, 30);

        // Health bar under player
        const barW = 50; const barH = 3;
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(p.x - barW / 2, p.y + p.size + 6, barW, barH);
        ctx.fillStyle = p.hp > 1 ? "#00BFFF" : "#FF2D00";
        ctx.fillRect(p.x - barW / 2, p.y + p.size + 6, (p.hp / p.maxHp) * barW, barH);

        animRef.current = requestAnimationFrame(loop);
    }, [spawnParticles, nextWave]);

    // ── Start game ───────────────────────────────────────────────────────────
    const startGame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const W = canvas.width; const H = canvas.height;
        bulletsRef.current = [];
        enemiesRef.current = [];
        particlesRef.current = [];
        scoreRef.current = 0; waveRef.current = 1; livesRef.current = 3; waveKillsRef.current = 0;
        setScore(0); setWave(1);
        playerRef.current = { x: W / 2, y: H / 2, vx: 0, vy: 0, angle: -Math.PI / 2, hp: 3, maxHp: 3, invincible: 0, size: 14, shootCd: 0 };
        mouseRef.current = { x: W / 2, y: H / 4 };
        initStars(W, H);
        gStateRef.current = "playing";
        setGameState("playing");
        isRunRef.current = true;

        // First wave spawn
        let idx = 0;
        const first = Array(5).fill("scout");
        spawnTimerRef.current = setInterval(() => {
            if (idx >= first.length || gStateRef.current !== "playing") { if (spawnTimerRef.current) clearInterval(spawnTimerRef.current); return; }
            spawnEnemy(first[idx++]);
        }, 700);

        animRef.current = requestAnimationFrame(loop);
    }, [initStars, spawnEnemy, loop]);

    const restart = useCallback(() => {
        isRunRef.current = false;
        cancelAnimationFrame(animRef.current);
        if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
        setTimeout(() => startGame(), 50);
    }, [startGame]);

    const handleClose = useCallback(() => {
        isRunRef.current = false;
        cancelAnimationFrame(animRef.current);
        if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
        setGameState("idle");
        gStateRef.current = "idle";
        onClose();
    }, [onClose]);

    // ── Effects ──────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!isOpen) return;
        const resize = () => {
            if (canvasRef.current) { canvasRef.current.width = window.innerWidth; canvasRef.current.height = window.innerHeight; }
        };
        resize();
        window.addEventListener("resize", resize);
        const onKey = (e) => {
            if (e.key === "Escape") { handleClose(); return; }
            keysRef.current[e.key.toLowerCase()] = e.type === "keydown";
        };
        window.addEventListener("keydown", onKey);
        window.addEventListener("keyup", onKey);
        return () => {
            isRunRef.current = false;
            cancelAnimationFrame(animRef.current);
            if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
            window.removeEventListener("resize", resize);
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("keyup", onKey);
            setGameState("idle");
            gStateRef.current = "idle";
        };
    }, [isOpen, handleClose]);

    const handleMouseMove = useCallback((e) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-[999]"
                    style={{ background: "#04040C", cursor: "crosshair" }}
                    onMouseMove={handleMouseMove}
                >
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

                    {/* ── IDLE ── */}
                    <AnimatePresence>
                        {gameState === "idle" && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="absolute inset-0 flex flex-col items-center justify-center gap-8 select-none">
                                <div className="flex flex-col items-center gap-3">
                                    <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-zinc-600">● DROPE MODE — ARCADE</p>
                                    <h2 className="font-sans font-black text-[clamp(3rem,12vw,10rem)] leading-none uppercase tracking-tight"
                                        style={{ color: "#00BFFF", textShadow: "0 0 40px rgba(0,191,255,0.5)" }}>
                                        SPACE
                                    </h2>
                                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 text-center space-y-1">
                                        <p><span className="text-zinc-300">WASD</span> — Move &nbsp;|&nbsp; <span className="text-zinc-300">Mouse</span> — Aim &nbsp;|&nbsp; <span className="text-zinc-300">Auto-fire</span></p>
                                        <p>Survive the waves. Kill the boss.</p>
                                    </div>
                                </div>
                                {bestScore > 0 && <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">Best: {bestScore.toLocaleString()}</p>}
                                <motion.button onClick={startGame} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                    className="font-mono text-[11px] uppercase tracking-[0.3em] text-black bg-[#00BFFF] px-8 py-3 hover:bg-white transition-colors duration-200">
                                    [ LAUNCH ]
                                </motion.button>
                                <motion.button onClick={handleClose} whileHover={{ scale: 1.05 }}
                                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-300 transition-colors duration-200">
                                    [ × EXIT ]
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── DEAD ── */}
                    <AnimatePresence>
                        {gameState === "dead" && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                                className="absolute inset-0 flex flex-col items-center justify-center gap-6 select-none">
                                <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                    className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#FF2D00]">● SHIP DESTROYED</motion.p>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center">
                                    <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600 mb-1">Final Score</p>
                                    <p className="font-sans font-black text-[clamp(2.5rem,8vw,6rem)] leading-none text-white tabular-nums"
                                        style={{ textShadow: "0 0 30px rgba(0,191,255,0.4)" }}>{score.toLocaleString()}</p>
                                    {score >= bestScore && score > 0 && <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#00BFFF] mt-1">★ New Best</p>}
                                    <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600 mt-1">Wave {wave}</p>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                                    className="flex items-center gap-4">
                                    <motion.button onClick={restart} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                        className="font-mono text-[11px] uppercase tracking-[0.3em] text-black bg-[#00BFFF] px-6 py-2.5 hover:bg-white transition-colors duration-200">
                                        [ RETRY ]
                                    </motion.button>
                                    <motion.button onClick={handleClose} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                        className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#FF2D00] border border-[#FF2D00]/40 hover:border-[#FF2D00] px-6 py-2.5 transition-colors duration-200">
                                        [ × EXIT ]
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Live EXIT ── */}
                    {gameState === "playing" && (
                        <motion.button onClick={handleClose} whileHover={{ scale: 1.05 }}
                            className="absolute bottom-8 right-[clamp(1.5rem,5vw,4rem)] font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-700 hover:text-[#FF2D00] transition-colors duration-200 z-10">
                            [ × EXIT ]
                        </motion.button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
