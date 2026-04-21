import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports
import AlertPreview from '../../components/dashboard/AlertPreview';
import TugOfWarWidget from '../../components/widgets/TugOfWarWidget';
import EventList from '../../components/widgets/EventList';
import TheDrop from '../../components/widgets/TheDrop';

const MasterOverlay = () => {
    const { obsKey } = useParams();
    const [streamer, setStreamer] = useState(null);
    const [activeScene, setActiveScene] = useState('primary');

    // Alert State
    const [activeAlert, setActiveAlert] = useState(null);
    const [alertQueue, setAlertQueue] = useState([]);
    
    // Recent Events Feed (Sync with Dashboard)
    const [recentEvents, setRecentEvents] = useState([]);

    // Tug-of-War State
    const [towEvent, setTowEvent] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState("00:00");

    const fetchInitialData = useCallback(async () => {
        try {
            const res = await axios.get(`/api/payment/goal-by-key/${obsKey}`);
            setStreamer(res.data);
            if (res.data.streamingSuite?.activeScene) {
                setActiveScene(res.data.streamingSuite.activeScene);
            }

            const towRes = await axios.get(`/api/tug-of-war/active/${res.data.streamerId}`).catch(() => ({ data: null }));
            if (towRes.data) setTowEvent(towRes.data);

        } catch (err) {
            console.error("Overlay initialization failed:", err);
        }
    }, [obsKey]);

    useEffect(() => {
        fetchInitialData();

        const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5001');
        socket.on('connect', () => {
             socket.emit('join-overlay', obsKey);
        });

        // Scene Change Listener
        socket.on('scene-change', (sceneId) => {
            setActiveScene(sceneId);
        });

        // Listen for new donations
        socket.on('new-drop', (data) => {
            setAlertQueue(prev => [...prev, data]);
            setRecentEvents(prev => [data, ...prev].slice(0, 10));
        });

        // Listen for Tug-of-War updates
        socket.on('tug-of-war-update', (updatedEvent) => {
            setTowEvent(updatedEvent);
        });

        socket.on('tug-of-war-start', (newEvent) => {
            setTowEvent(newEvent);
        });

        socket.on('tug-of-war-stop', () => {
            setTowEvent(null);
        });

        return () => socket.disconnect();
    }, [obsKey, fetchInitialData]);

    // Alert Queue Management
    useEffect(() => {
        if (alertQueue.length > 0 && !activeAlert) {
            const nextAlert = alertQueue[0];
            setActiveAlert(nextAlert);
            setAlertQueue(prev => prev.slice(1));

            setTimeout(() => {
                setActiveAlert(null);
            }, 6000);
        }
    }, [alertQueue, activeAlert]);

    // Tow Timer Logic
    useEffect(() => {
        if (!towEvent || !towEvent.expiresAt) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(towEvent.expiresAt).getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeRemaining("00:00");
                return;
            }

            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setTimeRemaining(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [towEvent]);

    return (
        <div className="overlay-content w-screen h-screen relative bg-transparent overflow-hidden">
            
            {/* ─── SCENE LAYOUT: PRIMARY (Gaming Mode) ─── */}
            <AnimatePresence mode="wait">
                {activeScene === 'primary' && (
                    <motion.div 
                        key="primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 p-12 flex flex-col items-center justify-between"
                    >
                        {/* Top: Minimal Info */}
                        <div className="w-full flex justify-end">
                            <EventList events={recentEvents} />
                        </div>

                        {/* Center: Alerts */}
                        <div className="flex-1 flex items-center justify-center">
                            <AnimatePresence>
                                {activeAlert && (
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0, y: 50 }}
                                        animate={{ scale: 1, opacity: 1, y: 0 }}
                                        exit={{ scale: 1.2, opacity: 0, filter: 'blur(10px)' }}
                                    >
                                        <AlertPreview
                                            donorName={activeAlert.donorName}
                                            amount={activeAlert.amount}
                                            message={activeAlert.message}
                                            sticker={activeAlert.sticker}
                                            tier={activeAlert.tier}
                                            stylePreference={streamer?.overlaySettings?.stylePreference || 'modern'}
                                            theme={streamer?.nexusThemeMode || 'dark'}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Bottom: Tug of War */}
                        <div className="w-full h-48 flex items-end justify-center">
                            {towEvent && towEvent.isActive && (
                                <TugOfWarWidget
                                    title={towEvent.title}
                                    timeRemaining={timeRemaining}
                                    teamA={{ name: towEvent.teamAName, amount: towEvent.teamAAmount, color: "from-red-600 to-red-400" }}
                                    teamB={{ name: towEvent.teamBName, amount: towEvent.teamBAmount, color: "from-blue-600 to-blue-400" }}
                                />
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ─── SCENE LAYOUT: CHATTING (Community Mode) ─── */}
                {activeScene === 'chatting' && (
                    <motion.div 
                        key="chatting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 p-12 flex items-center justify-between"
                    >
                        <div className="w-1/3 h-full flex flex-col justify-center">
                             <TheDrop lastEvent={recentEvents[0]} />
                        </div>

                        <div className="w-1/3 flex flex-col items-center gap-8">
                             <AnimatePresence>
                                {activeAlert && (
                                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
                                        <AlertPreview {...activeAlert} stylePreference="casual" />
                                    </motion.div>
                                )}
                             </AnimatePresence>
                        </div>

                        <div className="w-1/3 flex justify-end">
                             <EventList events={recentEvents} />
                        </div>
                    </motion.div>
                )}

                {/* ─── SCENE LAYOUT: STARTING/BRB (Ambient Mode) ─── */}
                {(activeScene === 'starting' || activeScene === 'brb') && (
                    <motion.div 
                        key="ambient"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm"
                    >
                        <div className="text-center">
                            <motion.h1 
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="text-8xl font-black text-white italic tracking-tighter uppercase mb-4"
                            >
                                {activeScene === 'starting' ? 'Initializing...' : 'Stand By'}
                            </motion.h1>
                            <p className="text-emerald-500 font-mono tracking-[1em] uppercase text-sm">Protocol Underway</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`hidden theme-${streamer?.nexusTheme || 'void'} ${streamer?.nexusThemeMode || 'dark'}`} />
        </div>
    );
};

export default MasterOverlay;

