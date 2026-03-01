import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports
import AlertPreview from '../components/AlertPreview';
import TugOfWarWidget from '../components/widgets/TugOfWarWidget';

const MasterOverlay = () => {
    const { obsKey } = useParams();
    const [streamer, setStreamer] = useState(null);

    // Alert State
    const [activeAlert, setActiveAlert] = useState(null);
    const [alertQueue, setAlertQueue] = useState([]);

    // Tug-of-War State
    const [towEvent, setTowEvent] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState("00:00");

    const fetchInitialData = useCallback(async () => {
        try {
            // Fetch streamer public profile via obsKey
            const res = await axios.get(`/api/payment/goal-by-key/${obsKey}`);
            setStreamer(res.data);

            // Fetch active Tug-of-War event
            const towRes = await axios.get(`/api/tug-of-war/active/${res.data.streamerId}`).catch(() => ({ data: null }));
            if (towRes.data) setTowEvent(towRes.data);

        } catch (err) {
            console.error("Overlay initialization failed:", err);
        }
    }, [obsKey]);

    useEffect(() => {
        fetchInitialData();

        const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5001');
        socket.emit('join-overlay', obsKey);

        // Listen for new donations
        socket.on('new-drop', (data) => {
            setAlertQueue(prev => [...prev, data]);
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

            // Auto-clear alert after duration
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
        <div className="overlay-content w-screen h-screen relative bg-transparent overflow-hidden flex flex-col items-center justify-between p-12">

            {/* 1. TOP SECTION (Future Hype Train Banners) */}
            <div className="w-full h-32 flex justify-center items-start">
                {/* <HypeTrainBanner /> logic goes here */}
            </div>

            {/* 2. CENTER SECTION (Donation Alerts) */}
            <div className="flex-1 w-full flex items-center justify-center relative">
                <AnimatePresence>
                    {activeAlert && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 1.2, opacity: 0, filter: 'blur(10px)' }}
                            className="z-50"
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

            {/* 3. BOTTOM SECTION (Widgets like Tug-of-War) */}
            <div className="w-full h-48 flex items-end justify-center">
                <AnimatePresence>
                    {towEvent && towEvent.isActive && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="w-full max-w-4xl"
                        >
                            <TugOfWarWidget
                                title={towEvent.title}
                                timeRemaining={timeRemaining}
                                teamA={{
                                    name: towEvent.teamAName,
                                    amount: towEvent.teamAAmount,
                                    color: "from-red-600 to-red-400",
                                    shadow: "shadow-[0_0_20px_rgba(220,38,38,0.6)]"
                                }}
                                teamB={{
                                    name: towEvent.teamBName,
                                    amount: towEvent.teamBAmount,
                                    color: "from-blue-600 to-blue-400",
                                    shadow: "shadow-[0_0_20px_rgba(37,99,235,0.6)]"
                                }}
                                lastStrike={towEvent.lastStrike}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* GLOBAL VARIABLE INJECTION BASED ON THEME */}
            <div className={`hidden theme-${streamer?.nexusTheme || 'void'} ${streamer?.nexusThemeMode || 'dark'}`} />
        </div>
    );
};

export default MasterOverlay;
