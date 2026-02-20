import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Trophy } from 'lucide-react';
import axios from 'axios';

const Overlay = () => {
  const { obsKey } = useParams();
  const [drops, setDrops] = useState([]);
  
  // --- Enhanced Settings State ---
  const [settings, setSettings] = useState({
    primaryColor: '#6366f1',
    fontFamily: 'Orbitron',
    customSoundUrl: null,
    ttsEnabled: true, 
    ttsVoice: 'female',
    animationType: 'slide-left',
    alertDuration: 7
  });

  useEffect(() => {
    // 1. Fetch Initial Theme Settings
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/payment/overlay-settings/${obsKey}`);
        if (res.data) setSettings(prev => ({ ...prev, ...res.data }));
      } catch (err) {
        console.error("Failed to load overlay theme");
      }
    };
    fetchSettings();

    // 2. Connect to Socket for Drops & Live Updates
    const socket = io('http://localhost:5001');

    socket.on('connect', () => {
      console.log('Overlay Linked to DropPay Engine');
      socket.emit('join-overlay', obsKey);
    });

    socket.on('settings-update', (updatedSettings) => {
      setSettings(prev => ({ ...prev, ...updatedSettings }));
    });

    socket.on('new-drop', (data) => {
      const dropId = Date.now();
      
      // Tier Logic
      let tier = 'standard';
      if (data.amount >= 2000) tier = 'legendary';
      else if (data.amount >= 500) tier = 'epic';

      const newDrop = { ...data, id: dropId, tier };
      
      // Audio Engine
      const soundSource = settings.customSoundUrl || '/assets/drop-sound.mp3';
      const audio = new Audio(soundSource); 
      audio.play().catch(() => console.log("Audio interaction required"));

      // TTS Engine
      if (settings.ttsEnabled) {
        const speech = new SpeechSynthesisUtterance();
        speech.text = `${data.donorName} dropped ${data.amount} rupees. ${data.message}`;
        speech.rate = 1;
        speech.pitch = 1.2;
        window.speechSynthesis.speak(speech);
      }

      setDrops((prev) => [...prev, newDrop]);

      setTimeout(() => {
        setDrops((prev) => prev.filter(d => d.id !== dropId));
      }, (settings.alertDuration || 7) * 1000);
    });

    return () => socket.disconnect();
  }, [obsKey, settings.customSoundUrl, settings.ttsEnabled, settings.alertDuration]);

  const stickerConfig = {
    zap: { emoji: '⚡' },
    fire: { emoji: '🔥' },
    heart: { emoji: '💖' },
    crown: { emoji: '👑' },
    rocket: { emoji: '🚀' },
  };

  const getTierStyles = (tier) => {
    switch(tier) {
      case 'legendary': return { 
        border: 'border-amber-400', 
        bg: 'bg-amber-950/95', 
        glow: 'shadow-[0_0_50px_rgba(251,191,36,0.5)]',
        text: 'text-amber-400',
        accent: '#fbbf24'
      };
      case 'epic': return { 
        border: 'border-purple-500', 
        bg: 'bg-purple-950/95', 
        glow: 'shadow-[0_0_40px_rgba(168,85,247,0.4)]',
        text: 'text-purple-400',
        accent: '#a855f7'
      };
      default: return { 
        border: 'border-white/20', 
        bg: 'bg-[#0a0a0a]/95', 
        glow: 'shadow-2xl',
        text: 'text-white',
        accent: settings.primaryColor
      };
    }
  };

  return (
    <div 
      className="w-screen h-screen overflow-hidden bg-transparent pointer-events-none relative"
      style={{ fontFamily: settings.fontFamily || 'sans-serif' }}
    >
      <AnimatePresence>
        {drops.map((drop) => {
          const style = getTierStyles(drop.tier);
          return (
            <motion.div
              key={drop.id}
              initial={settings.animationType === 'slide-left' ? { x: -1000, opacity: 0 } : { y: -400, opacity: 0, scale: 0.5 }}
              animate={{ 
                x: 0, y: 150, opacity: 1, scale: 1,
                transition: { type: "spring", bounce: 0.4, duration: 1.2 } 
              }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.5 } }}
              className="absolute left-0 right-0 mx-auto w-fit z-50"
            >
              <div className="relative group flex flex-col items-center">
                
                <motion.div 
                  animate={drop.tier === 'legendary' ? { rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] } : { scale: [1, 1.1, 1] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-[140px] text-center filter mb-[-20px] z-20"
                  style={{ filter: `drop-shadow(0 0 40px ${style.accent}88)` }}
                >
                  {drop.tier === 'legendary' ? '👑' : (stickerConfig[drop.sticker]?.emoji || '💎')}
                </motion.div>

                <motion.div 
                  className={`backdrop-blur-3xl border-2 p-8 rounded-[3rem] min-w-[500px] ${style.bg} ${style.border} ${style.glow}`}
                >
                  <div className="flex items-center gap-8">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-3">
                        <h2 className={`text-4xl font-black italic tracking-tighter uppercase ${style.text}`}>
                          {drop.donorName || 'Anonymous'}
                        </h2>
                        <span 
                          className="text-white px-6 py-2 rounded-2xl font-black italic text-3xl shadow-xl border border-white/20"
                          style={{ backgroundColor: style.accent }}
                        >
                          ₹{drop.amount}
                        </span>
                      </div>
                      
                      <p className={`font-bold text-2xl italic tracking-tight leading-tight ${drop.tier === 'standard' ? 'text-white/90' : 'text-white'}`}>
                        "{drop.message || 'Dropped some love!'}"
                      </p>
                    </div>

                    <div className="p-4 rounded-3xl border border-white/10 bg-white/5 shadow-inner">
                      {drop.tier === 'legendary' ? <Trophy className="w-10 h-10 text-amber-400" /> : <Zap className="w-10 h-10" style={{ color: style.accent }} />}
                    </div>
                  </div>
                </motion.div>

                {drop.tier === 'legendary' && (
                  <div className="absolute inset-0 w-full h-full pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <motion.div 
                         key={i}
                         animate={{ 
                           y: [-20, -100], 
                           x: [0, (i % 2 === 0 ? 50 : -50)], 
                           opacity: [0, 1, 0],
                           scale: [0, 1.5, 0]
                         }}
                         transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                         className="absolute top-0 left-1/2"
                      >
                          <Sparkles className="w-8 h-8 text-amber-400" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Overlay;