import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';

const Overlay = () => {
  const { obsKey } = useParams();
  const [drops, setDrops] = useState([]); // Use an array to handle multiple simultaneous drops

  useEffect(() => {
    // Connect to backend and join private room
    const socket = io('http://localhost:5001');

    socket.on('connect', () => {
      console.log('Overlay Linked to DropPay Engine');
      socket.emit('join-overlay', obsKey);
    });

    socket.on('new-drop', (data) => {
      const dropId = Date.now();
      const newDrop = { ...data, id: dropId };
      
      // Trigger Sound
      const audio = new Audio('/assets/drop-sound.mp3'); 
      audio.play().catch(() => console.log("Audio waiting for user interaction"));

      setDrops((prev) => [...prev, newDrop]);

      // Automatic removal after animation
      setTimeout(() => {
        setDrops((prev) => prev.filter(d => d.id !== dropId));
      }, 7000);
    });

    return () => socket.disconnect();
  }, [obsKey]);

  // Mapping sticker IDs to Large Animated Emojis (or PNGs)
  const stickerConfig = {
    zap: { emoji: '⚡', color: 'text-yellow-400' },
    fire: { emoji: '🔥', color: 'text-orange-500' },
    heart: { emoji: '💖', color: 'text-rose-500' },
    crown: { emoji: '👑', color: 'text-amber-400' },
    rocket: { emoji: '🚀', color: 'text-indigo-500' },
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-transparent pointer-events-none relative font-sans">
      <AnimatePresence>
        {drops.map((drop) => (
          <motion.div
            key={drop.id}
            initial={{ y: -400, opacity: 0, rotate: -15, scale: 0.5 }}
            animate={{ 
              y: 150, 
              opacity: 1, 
              rotate: 0, 
              scale: 1,
              transition: { type: "spring", bounce: 0.5, duration: 1.2 } 
            }}
            exit={{ y: 800, opacity: 0, rotate: 20, transition: { duration: 0.8 } }}
            className="absolute left-0 right-0 mx-auto w-fit z-50"
          >
            {/* Main Alert Container */}
            <div className="relative group">
              {/* Sticker Animation */}
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-[120px] text-center filter drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]"
              >
                {stickerConfig[drop.sticker]?.emoji || '💎'}
              </motion.div>

              {/* High-End Super Chat Banner */}
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1, transition: { delay: 0.5, duration: 0.5 } }}
                className="mt-6 bg-[#0a0a0a]/90 backdrop-blur-2xl border-2 border-white/10 p-6 rounded-[2rem] shadow-2xl min-w-[400px]"
              >
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                        {drop.donorName || 'Anonymous'}
                      </h2>
                      <span className="bg-indigo-600 text-white px-5 py-1.5 rounded-full font-black italic text-2xl shadow-lg shadow-indigo-600/30">
                        ₹{drop.amount}
                      </span>
                    </div>
                    {/* User Message */}
                    <p className="text-indigo-200 font-bold text-xl italic tracking-tight opacity-90 leading-tight">
                      "{drop.message || 'Dropped some love!'}"
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                    <Zap className="w-8 h-8 text-indigo-500 fill-indigo-500" />
                  </div>
                </div>
              </motion.div>

              {/* Particle Effects (Sparkles) */}
              <div className="absolute -top-10 -left-10 w-full h-full pointer-events-none">
                <motion.div 
                   animate={{ scale: [1, 1.5, 0], opacity: [1, 1, 0] }}
                   transition={{ duration: 1, repeat: Infinity }}
                   className="absolute top-0 right-0"
                >
                    <Sparkles className="text-yellow-400 w-12 h-12" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Overlay;