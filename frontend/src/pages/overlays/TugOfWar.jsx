import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import { io } from 'socket.io-client';
import TugOfWarWidget from '../../components/widgets/TugOfWarWidget';

const TugOfWarOverlay = () => {
    const { obsKey } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState("00:00");

    const fetchActiveEvent = useCallback(async () => {
        try {
            const res = await axios.get(`/api/tug-of-war/overlay/${obsKey}`);
            setEvent(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch Tug-of-War event:", err);
            setLoading(false);
        }
    }, [obsKey]);

    useEffect(() => {
        fetchActiveEvent();

        const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5001');
        socket.emit('join-overlay', obsKey);

        socket.on('tug-of-war-update', (updatedEvent) => {
            setEvent(updatedEvent);
        });

        // Listen for new events if the current one expires or none was active
        socket.on('tug-of-war-start', (newEvent) => {
            setEvent(newEvent);
        });

        return () => socket.disconnect();
    }, [obsKey, fetchActiveEvent]);

    // Timer logic
    useEffect(() => {
        if (!event || !event.expiresAt) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(event.expiresAt).getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeRemaining("00:00");
                // Optionally refetch or set event to inactive
                return;
            }

            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeRemaining(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [event]);

    if (loading) return null; // Keep it transparent while loading
    if (!event) return null; // Nothing to show if no active event

    return (
        <div className="overlay-content w-screen h-screen flex items-center justify-center bg-transparent overflow-hidden">
            <TugOfWarWidget
                title={event.title}
                timeRemaining={timeRemaining}
                teamA={{
                    name: event.teamAName,
                    amount: event.teamAAmount,
                    color: "from-red-600 to-red-400",
                    shadow: "shadow-[0_0_20px_rgba(220,38,38,0.6)]"
                }}
                teamB={{
                    name: event.teamBName,
                    amount: event.teamBAmount,
                    color: "from-blue-600 to-blue-400",
                    shadow: "shadow-[0_0_20px_rgba(37,99,235,0.6)]"
                }}
                lastStrike={event.lastStrike}
            />
        </div>
    );
};

export default TugOfWarOverlay;
