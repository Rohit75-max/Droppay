import React, { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MAX_AMMO = 6;
const RELOAD_TIME = 1600;

export const ZombieShooterGame = ({ isOpen, onClose }) => {
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState("idle");
    const [ammo, setAmmo] = useState(MAX_AMMO);
    const [score, setScore] = useState(0);
    const [wave, setWave] = useState(1);
    const [bestScore, setBestScore] = useState(0);
    const [reloadPct, setReloadPct] = useState(0);
    const [waveAnnounce, setWaveAnnounce] = useState(false);
    const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 });

    const gStateRef = useRef("idle");
    const zombiesRef = useRef([]);
    const particlesRef = useRef([]);
    const floatingTextsRef = useRef([]);
    const ammoRef = useRef(MAX_AMMO);
    const livesRef = useRef(5);
    const scoreRef = useRef(0);
    const waveRef = useRef(1);
    const waveKillsRef = useRef(0);
    const waveNeededRef = useRef(6);
    const animRef = useRef(0);
    const isRunRef = useRef(false);
    const idRef = useRef(0);
    const spawnTimerRef = useRef(null);
    const reloadTimerRef = useRef(null);
    const reloadStartRef = useRef(0);
    const reloadAnimRef = useRef(0);
    const basePulseRef = useRef(0);
    const baseFlashRef = useRef(0);
    const mouseRef = useRef({ x: 0, y: 0 });

    // ── Audio (Web Audio API) ──────────────────────────────────────────────
    const audioCtxRef = useRef(null);
    const getAudio = useCallback(() => {
        if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
        return audioCtxRef.current;
    }, []);

    const playShot = useCallback(() => {
        try {
            const ctx = getAudio();
            const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
            const d = buf.getChannelData(0);
            for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
            const src = ctx.createBufferSource();
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            src.buffer = buf; src.connect(gain); gain.connect(ctx.destination);
            src.start();
        } catch { /* silent */ }
    }, [getAudio]);

    const playReload = useCallback(() => {
        try {
            const ctx = getAudio();
            for (const t of [0, 0.1]) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.frequency.value = 180 + t * 100;
                gain.gain.setValueAtTime(0.08, ctx.currentTime + t);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.08);
                osc.connect(gain); gain.connect(ctx.destination);
                osc.start(ctx.currentTime + t); osc.stop(ctx.currentTime + t + 0.1);
            }
        } catch { /* silent */ }
    }, [getAudio]);

    const playHit = useCallback(() => {
        try {
            const ctx = getAudio();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.value = 80;
            osc.type = "sawtooth";
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(); osc.stop(ctx.currentTime + 0.15);
        } catch { /* silent */ }
    }, [getAudio]);

    // ── Particles ────────────────────────────────────────────────────────────
    const spawnBlood = useCallback((x, y, count = 8) => {
        for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2;
            const spd = 1 + Math.random() * 5;
            particlesRef.current.push({
                id: idRef.current++, x, y,
                vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
                alpha: 1, size: 2 + Math.random() * 4,
                color: Math.random() > 0.5 ? "#3AFF3A" : "#1A8C1A",
                decay: 0.018 + Math.random() * 0.015,
            });
        }
    }, []);

    const addFloating = useCallback((x, y, text, color = "#FFF") => {
        floatingTextsRef.current.push({
            id: idRef.current++, x, y, vy: -1.2, alpha: 1, text, color,
        });
    }, []);

    // ── Draw zombie ───────────────────────────────────────────────────────────
    const drawZombie = (ctx, z) => {
        ctx.save();
        ctx.translate(z.x, z.y);
        const s = z.size;

        // Green glow beneath
        ctx.shadowColor = z.color;
        ctx.shadowBlur = 12;

        // Body (rounded rect)
        const bodyColor = z.type === "boss" ? "#6B1A00" : z.type === "fat" ? "#1A5A10" : z.type === "runner" ? "#4A8A2A" : "#2A6A1A";
        ctx.fillStyle = bodyColor;
        ctx.strokeStyle = z.type === "boss" ? "#FF4400" : "rgba(80,220,80,0.3)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-s * 0.38, -s * 0.1, s * 0.76, s * 0.95, 5);
        ctx.fill();
        ctx.stroke();

        // Neck
        ctx.fillStyle = bodyColor;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.roundRect(-s * 0.14, -s * 0.22, s * 0.28, s * 0.18, 2);
        ctx.fill();

        // Head
        const headColor = z.type === "boss" ? "#5A1500" : z.type === "fat" ? "#2A7020" : "#3A7A2A";
        ctx.shadowColor = z.color; ctx.shadowBlur = 10;
        ctx.fillStyle = headColor;
        ctx.strokeStyle = z.type === "boss" ? "#FF4400" : "rgba(80,220,80,0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, -s * 0.62, s * 0.38, s * 0.36, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();

        // Eyes
        ctx.shadowColor = z.eyeFlash > 0 ? "#FFAA00" : "#FF0000";
        ctx.shadowBlur = 14;
        ctx.fillStyle = z.eyeFlash > 0 ? "#FFAA00" : "#FF2D00";
        ctx.beginPath(); ctx.ellipse(-s * 0.13, -s * 0.66, s * 0.09, s * 0.07, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(s * 0.13, -s * 0.66, s * 0.09, s * 0.07, 0, 0, Math.PI * 2); ctx.fill();
        // Pupils
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#000";
        ctx.beginPath(); ctx.arc(-s * 0.13, -s * 0.65, s * 0.04, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(s * 0.13, -s * 0.65, s * 0.04, 0, Math.PI * 2); ctx.fill();

        // Mouth (jagged grimace)
        ctx.strokeStyle = "rgba(0,0,0,0.6)";
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(-s * 0.18, -s * 0.46);
        ctx.lineTo(-s * 0.09, -s * 0.5);
        ctx.lineTo(0, -s * 0.46);
        ctx.lineTo(s * 0.09, -s * 0.5);
        ctx.lineTo(s * 0.18, -s * 0.46);
        ctx.stroke();

        // Arms (raised, reaching)
        ctx.shadowColor = z.color; ctx.shadowBlur = 6;
        ctx.strokeStyle = bodyColor;
        ctx.lineWidth = s * 0.2;
        ctx.lineCap = "round";
        const arm = z.armAngle;
        ctx.beginPath();
        ctx.moveTo(-s * 0.38, s * 0.15);
        ctx.lineTo(-s * 0.38 - Math.cos(arm + 0.3) * s * 0.65, s * 0.15 - Math.sin(arm + 0.3) * s * 0.35);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(s * 0.38, s * 0.15);
        ctx.lineTo(s * 0.38 + Math.cos(Math.PI - arm - 0.3) * s * 0.65, s * 0.15 - Math.sin(Math.PI - arm - 0.3) * s * 0.35);
        ctx.stroke();

        // Legs
        ctx.lineWidth = s * 0.22;
        const legSwing = Math.sin(z.armAngle * 2) * 0.2;
        ctx.beginPath(); ctx.moveTo(-s * 0.18, s * 0.85); ctx.lineTo(-s * 0.22 + legSwing * s, s * 1.32); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(s * 0.18, s * 0.85); ctx.lineTo(s * 0.22 - legSwing * s, s * 1.32); ctx.stroke();

        // HP bar (fat + boss)
        if (z.maxHp > 1) {
            const bw = s * 1.4; const bx = -bw / 2; const by = -s * 1.3;
            ctx.shadowBlur = 0;
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(bx, by, bw, 5);
            const pct = z.hp / z.maxHp;
            const barColor = pct > 0.5 ? "#4AFF4A" : pct > 0.25 ? "#FFAA00" : "#FF2D00";
            ctx.fillStyle = barColor;
            ctx.shadowColor = barColor; ctx.shadowBlur = 6;
            ctx.fillRect(bx, by, bw * pct, 5);
        }
        if (z.type === "boss") {
            ctx.shadowColor = "#FF4400"; ctx.shadowBlur = 10;
            ctx.fillStyle = "#FF4400"; ctx.font = `bold ${Math.round(s * 0.32)}px monospace`; ctx.textAlign = "center";
            ctx.fillText("BOSS", 0, -s * 1.5);
        }
        ctx.restore();
    };

    // ── Draw base ─────────────────────────────────────────────────────────────
    const drawBase = (ctx, cx, cy) => {
        basePulseRef.current += 0.025;
        const pulse = Math.sin(basePulseRef.current) * 5;
        const flash = baseFlashRef.current > 0;
        if (baseFlashRef.current > 0) baseFlashRef.current--;

        const baseColor = flash ? "#FF2D00" : "#00BFFF";
        ctx.save();

        // Outer rotating radar sweep
        const sweepA = basePulseRef.current * 0.8;
        ctx.strokeStyle = flash ? "rgba(255,45,0,0.08)" : "rgba(0,191,255,0.06)";
        ctx.lineWidth = 1;
        // Concentric radar rings
        for (const r of [70, 110, 160, 220]) {
            ctx.globalAlpha = 0.5 - r * 0.001;
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
        }
        // 4 diagonal tick marks on outer ring
        ctx.strokeStyle = flash ? "rgba(255,45,0,0.15)" : "rgba(0,191,255,0.1)";
        ctx.globalAlpha = 0.8;
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2 + sweepA * 0.1;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(a) * 62, cy + Math.sin(a) * 62);
            ctx.lineTo(cx + Math.cos(a) * 70, cy + Math.sin(a) * 70);
            ctx.stroke();
        }

        ctx.globalAlpha = 1;
        ctx.shadowColor = baseColor;

        // Outer animated glow ring
        ctx.shadowBlur = 18 + pulse;
        ctx.strokeStyle = flash ? "rgba(255,45,0,0.5)" : "rgba(0,191,255,0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(cx, cy, 50 + pulse * 0.5, 0, Math.PI * 2); ctx.stroke();

        // Main protection ring
        ctx.shadowBlur = 24;
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 0.85;
        ctx.beginPath(); ctx.arc(cx, cy, 36, 0, Math.PI * 2); ctx.stroke();

        // Core gradient fill
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 40;
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 32);
        if (flash) {
            coreGrad.addColorStop(0, "rgba(255,45,0,0.7)");
            coreGrad.addColorStop(0.6, "rgba(255,45,0,0.2)");
            coreGrad.addColorStop(1, "rgba(255,45,0,0.0)");
        } else {
            coreGrad.addColorStop(0, "rgba(0,191,255,0.55)");
            coreGrad.addColorStop(0.6, "rgba(0,191,255,0.12)");
            coreGrad.addColorStop(1, "rgba(0,191,255,0.0)");
        }
        ctx.fillStyle = coreGrad;
        ctx.beginPath(); ctx.arc(cx, cy, 32, 0, Math.PI * 2); ctx.fill();

        // Center dot
        ctx.shadowBlur = 20;
        ctx.fillStyle = baseColor;
        ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill();
        // Inner ring on center dot
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(cx, cy, 11, 0, Math.PI * 2); ctx.stroke();

        // Lives as orbital pips around the base
        const totalLives = 5;
        for (let i = 0; i < totalLives; i++) {
            const a = (i / totalLives) * Math.PI * 2 - Math.PI / 2;
            const rx = cx + Math.cos(a) * 56;
            const ry = cy + Math.sin(a) * 56;
            const alive = i < livesRef.current;
            ctx.shadowColor = alive ? "#FF2D00" : "transparent";
            ctx.shadowBlur = alive ? 10 : 0;
            ctx.fillStyle = alive ? "#FF2D00" : "rgba(255,255,255,0.08)";
            ctx.beginPath(); ctx.arc(rx, ry, alive ? 5 : 4, 0, Math.PI * 2); ctx.fill();
            if (alive) {
                ctx.strokeStyle = "rgba(255,100,0,0.4)";
                ctx.lineWidth = 1;
                ctx.shadowBlur = 0;
                ctx.beginPath(); ctx.arc(rx, ry, 8, 0, Math.PI * 2); ctx.stroke();
            }
        }

        ctx.restore();
    };

    // ── Spawn zombie ──────────────────────────────────────────────────────────
    const spawnZombie = useCallback((type = "walker") => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const W = canvas.width; const H = canvas.height;
        const side = Math.floor(Math.random() * 4);
        let x = 0, y = 0;
        if (side === 0) { x = Math.random() * W; y = -50; }
        else if (side === 1) { x = W + 50; y = Math.random() * H; }
        else if (side === 2) { x = Math.random() * W; y = H + 50; }
        else { x = -50; y = Math.random() * H; }

        const cx = W / 2; const cy = H / 2;
        const dx = cx - x; const dy = cy - y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const w = waveRef.current;

        const configs = {
            walker: { hp: 1, size: 22, color: "#3A7A2A", speed: 0.8 + w * 0.08, pts: 100 },
            runner: { hp: 1, size: 16, color: "#6ABB4A", speed: 1.8 + w * 0.12, pts: 150 },
            fat: { hp: 3, size: 32, color: "#1A5A10", speed: 0.45 + w * 0.04, pts: 300 },
            boss: { hp: 10 + w * 3, size: 44, color: "#8B1A00", speed: 0.35, pts: 1200 },
        };
        const cfg = configs[type];

        zombiesRef.current.push({
            id: idRef.current++,
            x, y,
            vx: (dx / dist) * cfg.speed,
            vy: (dy / dist) * cfg.speed,
            hp: cfg.hp, maxHp: cfg.hp,
            size: cfg.size, type,
            color: cfg.color, pts: cfg.pts,
            armAngle: 0.5, armDir: 1, eyeFlash: 0,
        });
    }, []);

    // ── Next wave ─────────────────────────────────────────────────────────────
    const nextWave = useCallback(() => {
        waveRef.current++;
        setWave(waveRef.current);
        waveKillsRef.current = 0;
        setWaveAnnounce(true);
        setTimeout(() => setWaveAnnounce(false), 1800);

        const w = waveRef.current;
        const isBoss = w % 5 === 0;
        const types = isBoss
            ? ["boss", ...Array(w).fill("walker")]
            : w % 3 === 0
                ? [...Array(3 + w).fill("walker"), ...Array(1 + Math.floor(w / 3)).fill("fat")]
                : [...Array(4 + w).fill("walker"), ...Array(Math.floor(w / 2)).fill("runner")];

        waveNeededRef.current = types.length;

        if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
        let idx = 0;
        spawnTimerRef.current = setInterval(() => {
            if (idx >= types.length || gStateRef.current !== "playing") {
                if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
                return;
            }
            spawnZombie(types[idx++]);
        }, isBoss ? 1400 : 700);
    }, [spawnZombie]);

    // ── Reload ────────────────────────────────────────────────────────────────
    const startReload = useCallback(() => {
        if (gStateRef.current === "reloading") return;
        gStateRef.current = "reloading";
        setGameState("reloading");
        playReload();
        reloadStartRef.current = Date.now();
        const tick = () => {
            const pct = Math.min(1, (Date.now() - reloadStartRef.current) / RELOAD_TIME);
            setReloadPct(pct);
            if (pct < 1) { reloadAnimRef.current = requestAnimationFrame(tick); }
            else {
                ammoRef.current = MAX_AMMO;
                setAmmo(MAX_AMMO);
                gStateRef.current = "playing";
                setGameState("playing");
                setReloadPct(0);
            }
        };
        reloadAnimRef.current = requestAnimationFrame(tick);
    }, [playReload]);

    // ── Shoot click ───────────────────────────────────────────────────────────
    const handleShoot = useCallback((e) => {
        if (gStateRef.current !== "playing" && gStateRef.current !== "reloading") return;
        if (gStateRef.current === "reloading") return; // can't shoot while reloading
        if (ammoRef.current <= 0) { startReload(); return; }

        ammoRef.current--;
        setAmmo(ammoRef.current);
        playShot();

        const cx = e.clientX; const cy = e.clientY;
        // Muzzle flash particle burst
        for (let i = 0; i < 4; i++) {
            const a = Math.random() * Math.PI * 2;
            particlesRef.current.push({
                id: idRef.current++, x: cx, y: cy,
                vx: Math.cos(a) * (1 + Math.random() * 3), vy: Math.sin(a) * (1 + Math.random() * 3),
                alpha: 0.8, size: 2 + Math.random() * 2, color: "#FFDD00", decay: 0.08,
            });
        }

        // Hit detection
        let hit = false;
        for (let i = zombiesRef.current.length - 1; i >= 0; i--) {
            const z = zombiesRef.current[i];
            const dx = cx - z.x; const dy = cy - z.y;
            if (Math.sqrt(dx * dx + dy * dy) < z.size * 1.3) {
                z.hp--;
                z.eyeFlash = 8;
                spawnBlood(cx, cy, z.type === "boss" ? 18 : 10);
                playHit();
                if (z.hp <= 0) {
                    addFloating(z.x, z.y - 20, `+${z.pts}`, z.type === "boss" ? "#FFD700" : "#4AFF4A");
                    spawnBlood(z.x, z.y, z.type === "boss" ? 30 : z.type === "fat" ? 20 : 14);
                    scoreRef.current += z.pts;
                    setScore(scoreRef.current);
                    waveKillsRef.current++;
                    zombiesRef.current.splice(i, 1);
                    if (waveKillsRef.current >= waveNeededRef.current) nextWave();
                }
                hit = true;
                break;
            }
        }
        if (!hit) {
            // Miss — bullet hole effect on ground
            particlesRef.current.push({
                id: idRef.current++, x: cx, y: cy,
                vx: 0, vy: 0, alpha: 0.5, size: 3, color: "#666", decay: 0.005,
            });
        }
    }, [spawnBlood, addFloating, playShot, playHit, nextWave, startReload]);

    // ── Main loop ─────────────────────────────────────────────────────────────
    const loop = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isRunRef.current) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const W = canvas.width; const H = canvas.height;
        const cx = W / 2; const cy = H / 2;

        // Ground
        ctx.fillStyle = "#0A0A0A";
        ctx.fillRect(0, 0, W, H);

        // Ground grid (subtle)
        ctx.strokeStyle = "rgba(255,255,255,0.018)";
        ctx.lineWidth = 1;
        const gridSize = 70;
        for (let x = 0; x < W; x += gridSize) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
        for (let y = 0; y < H; y += gridSize) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

        // Draw base (no danger ring — base itself has radar rings now)
        drawBase(ctx, cx, cy);

        // Update + draw zombies
        for (const z of zombiesRef.current) {
            const dx = cx - z.x; const dy = cy - z.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            // Increase sizes — walkers bigger, runners smaller but clear, fat huge
            const spdMap = { boss: 0.35, fat: 0.45 + waveRef.current * 0.04, runner: 1.8 + waveRef.current * 0.12, walker: 0.8 + waveRef.current * 0.08 };
            const spd = spdMap[z.type] ?? 0.8;
            z.vx = (dx / dist) * spd; z.vy = (dy / dist) * spd;
            z.x += z.vx; z.y += z.vy;
            z.armAngle += 0.06 * z.armDir;
            if (Math.abs(z.armAngle) > 0.8) z.armDir *= -1;
            if (z.eyeFlash > 0) z.eyeFlash--;

            // Reached base
            if (dist < 32) {
                spawnBlood(z.x, z.y, 6);
                baseFlashRef.current = 18;
                livesRef.current = Math.max(0, livesRef.current - 1);
                zombiesRef.current = zombiesRef.current.filter(zz => zz.id !== z.id);
                // Count as processed for wave progression
                waveKillsRef.current++;
                if (livesRef.current <= 0) {
                    gStateRef.current = "dead";
                    setGameState("dead");
                    isRunRef.current = false;
                    setBestScore(prev => Math.max(prev, scoreRef.current));
                    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
                    cancelAnimationFrame(reloadAnimRef.current);
                    return;
                }
                if (waveKillsRef.current >= waveNeededRef.current) nextWave();
                continue;
            }
            drawZombie(ctx, z);
        }

        // Crosshair at mouse
        const { x: mx, y: my } = mouseRef.current;
        ctx.save();
        ctx.strokeStyle = ammoRef.current > 0 ? "#FFFFFF" : "#FF2D00";
        ctx.lineWidth = 1.5; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.moveTo(mx - 16, my); ctx.lineTo(mx - 5, my); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx + 5, my); ctx.lineTo(mx + 16, my); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx, my - 16); ctx.lineTo(mx, my - 5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx, my + 5); ctx.lineTo(mx, my + 16); ctx.stroke();
        ctx.beginPath(); ctx.arc(mx, my, 3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // Particles
        particlesRef.current = particlesRef.current.filter(p => p.alpha > 0.02);
        for (const p of particlesRef.current) {
            p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.alpha -= p.decay;
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.shadowColor = p.color; ctx.shadowBlur = 6;
            ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        }

        // Floating texts
        floatingTextsRef.current = floatingTextsRef.current.filter(t => t.alpha > 0.02);
        for (const t of floatingTextsRef.current) {
            ctx.save();
            ctx.globalAlpha = t.alpha;
            ctx.fillStyle = t.color;
            ctx.font = "bold 13px monospace"; ctx.textAlign = "center";
            ctx.shadowColor = t.color; ctx.shadowBlur = 8;
            ctx.fillText(t.text, t.x, t.y);
            ctx.restore();
            t.y += t.vy; t.alpha -= 0.016;
        }

        // Score HUD — centered at top
        ctx.globalAlpha = 1;
        ctx.textAlign = "center";
        ctx.shadowColor = "#4AFF4A"; ctx.shadowBlur = 8;
        ctx.fillStyle = "#FFFFFF"; ctx.font = "bold 13px 'Courier New', monospace";
        ctx.fillText(`SCORE  ${String(scoreRef.current).padStart(7, "0")}`, W / 2, 36);
        ctx.shadowBlur = 0; ctx.fillStyle = "#555"; ctx.font = "9px 'Courier New', monospace";
        ctx.fillText(`WAVE ${waveRef.current}  ·  KILLS ${waveKillsRef.current}/${waveNeededRef.current}`, W / 2, 52);

        animRef.current = requestAnimationFrame(loop);
    }, [spawnBlood, nextWave]);

    // ── Start game ────────────────────────────────────────────────────────────
    const startGame = useCallback(() => {
        zombiesRef.current = []; particlesRef.current = []; floatingTextsRef.current = [];
        scoreRef.current = 0; waveRef.current = 1; waveKillsRef.current = 0; waveNeededRef.current = 6;
        ammoRef.current = MAX_AMMO; livesRef.current = 5; basePulseRef.current = 0; baseFlashRef.current = 0;
        setScore(0); setWave(1); setAmmo(MAX_AMMO); setWaveAnnounce(false); setReloadPct(0);
        gStateRef.current = "playing";
        setGameState("playing");
        isRunRef.current = true;

        let idx = 0;
        const first = Array(6).fill("walker");
        spawnTimerRef.current = setInterval(() => {
            if (idx >= first.length || gStateRef.current !== "playing") { if (spawnTimerRef.current) clearInterval(spawnTimerRef.current); return; }
            spawnZombie(first[idx++]);
        }, 700);
        animRef.current = requestAnimationFrame(loop);
    }, [spawnZombie, loop]);

    const restart = useCallback(() => {
        isRunRef.current = false;
        cancelAnimationFrame(animRef.current);
        cancelAnimationFrame(reloadAnimRef.current);
        if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
        setTimeout(() => startGame(), 50);
    }, [startGame]);

    const handleClose = useCallback(() => {
        isRunRef.current = false;
        cancelAnimationFrame(animRef.current);
        cancelAnimationFrame(reloadAnimRef.current);
        if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
        if (reloadTimerRef.current) clearTimeout(reloadTimerRef.current);
        setGameState("idle");
        gStateRef.current = "idle";
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;
        const resize = () => {
            if (canvasRef.current) { canvasRef.current.width = window.innerWidth; canvasRef.current.height = window.innerHeight; }
        };
        resize();
        window.addEventListener("resize", resize);
        const onKey = (e) => {
            if (e.key === "Escape") { handleClose(); return; }
            if ((e.key === "r" || e.key === "R") && gStateRef.current === "playing" && ammoRef.current < MAX_AMMO) startReload();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            isRunRef.current = false;
            cancelAnimationFrame(animRef.current);
            cancelAnimationFrame(reloadAnimRef.current);
            if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
            window.removeEventListener("resize", resize);
            window.removeEventListener("keydown", onKey);
            setGameState("idle"); gStateRef.current = "idle";
        };
    }, [isOpen, handleClose, startReload]);

    const handleMouseMove = useCallback((e) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
        setCursorPos({ x: e.clientX, y: e.clientY });
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-[999]"
                    style={{ background: "#0A0A0A", cursor: "none" }}
                    onMouseMove={handleMouseMove}
                    onClick={gameState === "playing" ? handleShoot : undefined}
                >
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

                    {/* ── Always-visible CSS crosshair ── */}
                    <div
                        className="fixed pointer-events-none z-[1001] select-none"
                        style={{ left: cursorPos.x, top: cursorPos.y, transform: "translate(-50%, -50%)" }}
                    >
                        {/* Horizontal left */}
                        <div className="absolute" style={{ left: -16, top: -0.75, width: 10, height: 1.5, background: ammo > 0 ? "#fff" : "#FF2D00", boxShadow: `0 0 4px ${ammo > 0 ? "#fff" : "#FF2D00"}` }} />
                        {/* Horizontal right */}
                        <div className="absolute" style={{ left: 6, top: -0.75, width: 10, height: 1.5, background: ammo > 0 ? "#fff" : "#FF2D00", boxShadow: `0 0 4px ${ammo > 0 ? "#fff" : "#FF2D00"}` }} />
                        {/* Vertical top */}
                        <div className="absolute" style={{ top: -16, left: -0.75, width: 1.5, height: 10, background: ammo > 0 ? "#fff" : "#FF2D00", boxShadow: `0 0 4px ${ammo > 0 ? "#fff" : "#FF2D00"}` }} />
                        {/* Vertical bottom */}
                        <div className="absolute" style={{ top: 6, left: -0.75, width: 1.5, height: 10, background: ammo > 0 ? "#fff" : "#FF2D00", boxShadow: `0 0 4px ${ammo > 0 ? "#fff" : "#FF2D00"}` }} />
                        {/* Center dot */}
                        <div className="absolute rounded-full" style={{ left: -2.5, top: -2.5, width: 5, height: 5, background: ammo > 0 ? "#fff" : "#FF2D00", boxShadow: `0 0 6px ${ammo > 0 ? "#fff" : "#FF2D00"}` }} />
                    </div>

                    {/* ── Wave Announcement ── */}
                    <AnimatePresence>
                        {waveAnnounce && (
                            <motion.div key={wave} initial={{ opacity: 0, scale: 1.3 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.4 }}
                                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                                <p className="font-sans font-black text-[clamp(2rem,8vw,5rem)] leading-none text-[#4AFF4A]"
                                    style={{ textShadow: "0 0 40px rgba(74,255,74,0.6)" }}>
                                    WAVE {wave}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── IDLE screen ── */}
                    <AnimatePresence>
                        {gameState === "idle" && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="absolute inset-0 flex flex-col items-center justify-center gap-8 select-none pointer-events-auto">
                                <div className="flex flex-col items-center gap-3">
                                    <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-zinc-600">● DROPE MODE — ARCADE</p>
                                    <h2 className="font-sans font-black text-[clamp(3rem,12vw,10rem)] leading-none uppercase tracking-tight"
                                        style={{ color: "#4AFF4A", textShadow: "0 0 40px rgba(74,255,74,0.4)" }}>ZOMBIES</h2>
                                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 text-center space-y-1">
                                        <p><span className="text-zinc-300">Click</span> zombies to shoot &nbsp;|&nbsp; <span className="text-zinc-300">R</span> to reload</p>
                                        <p>Protect the base. Don&apos;t let them reach it.</p>
                                        <p className="text-zinc-600">6 shots · auto-aim off · real reload</p>
                                    </div>
                                </div>
                                {bestScore > 0 && <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">Best: {bestScore.toLocaleString()}</p>}
                                <motion.button onClick={startGame} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                    className="font-mono text-[11px] uppercase tracking-[0.3em] text-black bg-[#4AFF4A] px-8 py-3 hover:bg-white transition-colors duration-200">
                                    [ SURVIVE ]
                                </motion.button>
                                <motion.button onClick={handleClose} whileHover={{ scale: 1.05 }}
                                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-300 transition-colors duration-200">
                                    [ × EXIT ]
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Reload bar ── */}
                    <AnimatePresence>
                        {gameState === "reloading" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none">
                                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#FF2D00] animate-pulse">RELOADING...</p>
                                <div className="w-48 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div className="h-full bg-[#FF2D00] rounded-full" style={{ width: `${reloadPct * 100}%` }} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Ammo HUD (bottom center) ── */}
                    {(gameState === "playing" || gameState === "reloading") && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none">
                            <div className="flex items-center gap-1.5">
                                {Array.from({ length: MAX_AMMO }).map((_, i) => (
                                    <div key={i} className={`w-2 h-5 rounded-sm transition-all duration-100 ${i < ammo ? "bg-[#FFDD00] shadow-[0_0_6px_#FFDD00]" : "bg-zinc-800"}`} />
                                ))}
                            </div>
                            <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-zinc-600">
                                {ammo === 0 ? "PRESS R TO RELOAD" : `${ammo} / ${MAX_AMMO}`}
                            </p>
                        </div>
                    )}

                    {/* ── Live EXIT ── */}
                    {(gameState === "playing" || gameState === "reloading") && (
                        <motion.button onClick={handleClose} whileHover={{ scale: 1.05 }}
                            className="absolute bottom-8 right-[clamp(1.5rem,5vw,4rem)] font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-700 hover:text-[#FF2D00] transition-colors duration-200 z-10 pointer-events-auto">
                            [ × EXIT ]
                        </motion.button>
                    )}

                    {/* ── DEAD screen ── */}
                    <AnimatePresence>
                        {gameState === "dead" && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                                className="absolute inset-0 flex flex-col items-center justify-center gap-6 select-none pointer-events-auto">
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                                    className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#FF2D00]">● BASE OVERRUN</motion.p>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center space-y-1">
                                    <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">Final Score</p>
                                    <p className="font-sans font-black text-[clamp(2.5rem,8vw,6rem)] leading-none text-white tabular-nums"
                                        style={{ textShadow: "0 0 30px rgba(74,255,74,0.3)" }}>{score.toLocaleString()}</p>
                                    {score >= bestScore && score > 0 && <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#4AFF4A]">★ New Best</p>}
                                    <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">Survived to Wave {wave}</p>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                                    className="flex items-center gap-4">
                                    <motion.button onClick={restart} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                        className="font-mono text-[11px] uppercase tracking-[0.3em] text-black bg-[#4AFF4A] px-6 py-2.5 hover:bg-white transition-colors duration-200">
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
                </motion.div>
            )}
        </AnimatePresence>
    );
};
