import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Swords, Timer, Save, Rocket, Zap, ShieldAlert, Flame } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from '../../api/axios';
import TugOfWarWidget from '../widgets/TugOfWarWidget';

const TugOfWarControl = ({ user, nexusTheme, streamerId, theme }) => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: "DODGE OR DROP?",
        teamAName: "POCHINKI",
        teamBName: "SCHOOL",
        durationMinutes: 5
    });
    const [isStarting, setIsStarting] = useState(false);

    const fetchActiveEvent = useCallback(async () => {
        try {
            const res = await axios.get(`/api/tug-of-war/active/${streamerId}`);
            setEvent(res.data);
        } catch (err) {
            setEvent(null);
        } finally {
            setLoading(false);
        }
    }, [streamerId]);

    useEffect(() => {
        if (!streamerId) return;
        fetchActiveEvent();

        const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5001');

        // Join the streamer room for real-time updates
        socket.emit('join-room', streamerId);

        socket.on('tug-of-war-update', (updatedEvent) => {
            setEvent(updatedEvent);
        });

        socket.on('tug-of-war-start', (newEvent) => {
            setEvent(newEvent);
        });

        socket.on('tug-of-war-stop', () => {
            setEvent(null);
        });

        return () => {
            socket.disconnect();
        };
    }, [streamerId, fetchActiveEvent]);

    const handleStart = async () => {
        setIsStarting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/tug-of-war/start', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvent(res.data);
        } catch (err) {
            toast.error("Uplink Failure: Failed to start event.");
        } finally {
            setIsStarting(false);
        }
    };

    const handleStop = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/tug-of-war/stop', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvent(null);
        } catch (err) {
            toast.error("Uplink Failure: Failed to stop event.");
        }
    };

    if (loading) {
        return (
            <div className="w-full bg-[var(--nexus-panel)] border border-[var(--nexus-border)] rounded-[2.5rem] p-12 nexus-card flex flex-col items-center justify-center gap-4">
                <Rocket className="w-8 h-8 text-[var(--nexus-accent)] animate-bounce" />
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)]">Connecting to War Grid...</p>
            </div>
        );
    }

    return (
        <>
        <div className="w-full bg-[var(--nexus-panel)] border border-[var(--nexus-border)] rounded-[2.5rem] p-8 nexus-card overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--nexus-accent)]/10 flex items-center justify-center border-2 border-[var(--nexus-accent)]/20 text-[var(--nexus-accent)]">
                        <Swords className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-[var(--nexus-text)]">Live Tug-of-War Engine</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--nexus-accent)]">Live Wallet Voting System</p>
                    </div>
                </div>

                {event && (
                    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-6 py-3 rounded-2xl">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Event Hot: Live on Stream</span>
                    </div>
                )}
            </div>

            {!event ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] ml-2">War Objective</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-[var(--nexus-panel)] border border-[var(--nexus-border)] p-4 rounded-2xl outline-none focus:border-[var(--nexus-accent)] text-[var(--nexus-text)] font-bold italic placeholder:text-[var(--nexus-text-muted)]/50"
                                placeholder="e.g. POCHINKI OR MILITARY?"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] ml-2 text-red-400">Team A</label>
                                <input
                                    type="text"
                                    value={formData.teamAName}
                                    onChange={(e) => setFormData({ ...formData, teamAName: e.target.value })}
                                    className="w-full bg-[var(--nexus-panel)] border border-red-500/20 p-4 rounded-2xl outline-none focus:border-red-500/50 text-[var(--nexus-text)] font-bold italic"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] ml-2 text-blue-400">Team B</label>
                                <input
                                    type="text"
                                    value={formData.teamBName}
                                    onChange={(e) => setFormData({ ...formData, teamBName: e.target.value })}
                                    className="w-full bg-[var(--nexus-panel)] border border-blue-500/20 p-4 rounded-2xl outline-none focus:border-blue-500/50 text-[var(--nexus-text)] font-bold italic"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] ml-2 flex items-center gap-2">
                                <Timer className="w-3 h-3 text-[var(--nexus-accent)]" /> War Duration (Minutes)
                            </label>
                            <div className="flex items-center gap-4">
                                {[5, 10, 15, 30].map(m => (
                                    <button
                                        key={m}
                                        onClick={() => setFormData({ ...formData, durationMinutes: m })}
                                        className={`flex-1 py-3 rounded-xl font-black text-xs transition-all border ${formData.durationMinutes === m ? 'bg-[var(--nexus-accent)] text-black border-[var(--nexus-accent)] shadow-[0_0_15px_var(--nexus-accent-glow)]' : 'bg-[var(--nexus-panel)] text-[var(--nexus-text-muted)] border-[var(--nexus-border)] hover:border-[var(--nexus-accent)]/40'}`}
                                    >
                                        {m}m
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--nexus-panel)] border border-[var(--nexus-border)] rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6 shadow-inner">
                        <Rocket className="w-12 h-12 text-[var(--nexus-text-muted)] opacity-20" />
                        <div>
                            <p className="text-sm font-bold italic text-[var(--nexus-text-muted)] mb-2">Configure your voting parameters.</p>
                            <p className="text-[10px] font-medium text-[var(--nexus-text-muted)] opacity-60">Once started, viewers can donate to pull the rope on stream. Voting ends automatically after the duration.</p>
                        </div>
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={handleStart}
                            disabled={isStarting}
                            className="w-full bg-[var(--nexus-accent)] text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] italic text-xs shadow-lg shadow-[var(--nexus-accent)]/30 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isStarting ? <Zap className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                            {isStarting ? "Initializing Challenge..." : "START CHALLENGE"}
                        </motion.button>
                    </div>
                </div>
            ) : (
                <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                            <Flame className="w-10 h-10 text-red-500" />
                        </div>
                        <div className="text-left">
                            <h4 className="text-xl font-black uppercase text-[var(--nexus-text)] mb-1">{event.title}</h4>
                            <p className="text-sm font-bold italic text-[var(--nexus-text-muted)]">{event.teamAName} vs {event.teamBName}</p>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs font-black text-red-400">₹{event.teamAAmount.toLocaleString()}</span>
                                <div className="w-1 h-1 rounded-full bg-[var(--nexus-border)]" />
                                <span className="text-xs font-black text-blue-400">₹{event.teamBAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        layout
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStop}
                        className={`w-full md:w-auto px-12 py-5 border-2 border-red-600/50 text-red-500 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-black hover:bg-red-600 hover:text-white' : 'bg-white hover:bg-red-500 hover:text-white'}`}
                    >
                        <ShieldAlert className="w-4 h-4" />
                        ABORT WAR EARLY
                    </motion.button>
                </div>
            )}
        </div>

        {/* ── LIVE WIDGET PREVIEW ── */}
        <div className="w-full mt-6 bg-[var(--nexus-panel)] border border-[var(--nexus-border)] rounded-[2.5rem] p-8 nexus-card overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-[var(--nexus-accent)] animate-pulse shadow-[0_0_10px_var(--nexus-accent-glow)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--nexus-text-muted)]">
                    {event ? 'Live Stream Preview' : 'Widget Preview (Mock Data)'}
                </span>
            </div>

            {/* Dark OBS-like preview container */}
            <div className="bg-black rounded-2xl overflow-hidden border border-white/5 p-4">
                <TugOfWarWidget
                    title={event ? event.title : formData.title}
                    timeRemaining={event ? "LIVE" : `${formData.durationMinutes}:00`}
                    teamA={{
                        name: event ? event.teamAName : formData.teamAName,
                        amount: event ? event.teamAAmount : 12500,
                        color: "from-red-600 to-red-400",
                        shadow: "shadow-[0_0_20px_rgba(220,38,38,0.6)]"
                    }}
                    teamB={{
                        name: event ? event.teamBName : formData.teamBName,
                        amount: event ? event.teamBAmount : 8400,
                        color: "from-blue-600 to-blue-400",
                        shadow: "shadow-[0_0_20px_rgba(37,99,235,0.6)]"
                    }}
                    lastStrike={event?.lastStrike || null}
                />
            </div>

            {!event && (
                <p className="text-center text-[9px] font-black uppercase tracking-[0.3em] text-[var(--nexus-text-muted)]/40 mt-4">
                    Preview updates as you type · Amounts shown are illustrative
                </p>
            )}
        </div>
        </>
    );
};

export default TugOfWarControl;
