import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AnimatePresence, motion } from 'framer-motion';
import axios from '../api/axios';

// --- MODULAR IMPORT ---
import AlertPreview from '../components/AlertPreview';

const Overlay = () => {
  const { obsKey } = useParams();
  const [drops, setDrops] = useState([]);

  const [settings, setSettings] = useState({
    primaryColor: '#6366f1',
    fontFamily: 'Orbitron',
    customSoundUrl: null,
    ttsEnabled: true,
    ttsVoice: 'female',
    animationType: 'slide-left',
    alertDuration: 7
  });

  // A mutable ref to hold the latest settings without triggering re-renders
  const settingsRef = React.useRef(settings);
  React.useEffect(() => { settingsRef.current = settings; }, [settings]);

  useEffect(() => {
    // 1. Fetch Initial Settings
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`/api/payment/overlay-settings/${obsKey}`);
        if (res.data) setSettings(prev => ({ ...prev, ...res.data }));
      } catch (err) { console.error("Overlay sync offline"); }
    };
    fetchSettings();

    // 2. Connect to DropPay Engine
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5001');

    socket.on('connect', () => {
      socket.emit('join-overlay', obsKey);
    });

    socket.on('settings-update', (updated) => {
      setSettings(prev => ({ ...prev, ...updated }));
    });

    socket.on('new-drop', (data) => {
      const dropId = Date.now();
      const currentSettings = settingsRef.current;

      const newDrop = { ...data, id: dropId };

      // Audio Engine logic preserved
      const soundSource = currentSettings.customSoundUrl || '/assets/drop-sound.mp3';
      new Audio(soundSource).play().catch(() => { });

      // TTS Engine logic preserved
      if (currentSettings.ttsEnabled) {
        const speech = new SpeechSynthesisUtterance(`${data.donorName} dropped ${data.amount} rupees. ${data.message}`);
        speech.rate = 1;
        speech.pitch = 1.2;
        window.speechSynthesis.speak(speech);
      }

      // OVERWRITE PREVIOUS ALERTS: Force only 1 alert on screen at a time
      setDrops([newDrop]);

      // Automatic Cleanup based on streamer's preferred duration
      setTimeout(() => {
        setDrops((prev) => prev.filter(d => d.id !== dropId));
      }, (currentSettings.alertDuration || 7) * 1000);
    });

    return () => socket.disconnect();
  }, [obsKey]);

  return (
    <div
      className="overlay-content w-screen h-screen overflow-hidden bg-transparent pointer-events-none relative flex items-center justify-center"
      style={{ fontFamily: settings.fontFamily || 'sans-serif' }}
    >
      <AnimatePresence>
        {drops.map((drop) => (
          <motion.div
            key={drop.id}
            initial={settings.animationType === 'slide-left' ? { x: -1000, opacity: 0 } : { y: -400, opacity: 0, scale: 0.5 }}
            animate={{
              x: 0, y: 0, opacity: 1, scale: 1,
              transition: { type: "spring", bounce: 0.4, duration: 1.2 }
            }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.5 } }}
            className="absolute z-50"
          >
            {/* --- THE SYNCED PILL --- */}
            {/* This ensures OBS alerts look identical to the Dashboard & Donation Page */}
            <AlertPreview
              donorName={drop.donorName}
              amount={drop.amount}
              message={drop.message}
              sticker={drop.sticker}
              tier={drop.tier}
              stylePreference={settings.stylePreference || 'modern'}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Overlay;