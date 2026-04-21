import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, Sparkles } from 'lucide-react';

const Coin = ({ id, x, amount }) => {
  // Random horizontal variance for pile effect
  const finalX = x + (Math.random() * 40 - 20);
  const finalRotate = Math.random() * 360;

  return (
    <motion.div
      initial={{ y: -500, x: x, rotate: 0, opacity: 0 }}
      animate={{ 
        y: 0, 
        x: finalX, 
        rotate: finalRotate,
        opacity: 1
      }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 10,
        mass: 1
      }}
      className="absolute bottom-4 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border border-amber-300 shadow-lg flex items-center justify-center pointer-events-none"
    >
      <IndianRupee className="w-4 h-4 text-amber-900" strokeWidth={3} />
      {amount > 500 && (
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute -inset-2 bg-amber-400/30 blur-md rounded-full"
        />
      )}
    </motion.div>
  );
};

const TheDrop = ({ lastEvent }) => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    if (lastEvent && lastEvent.type === 'donation') {
      const newCoin = {
        id: Date.now(),
        x: Math.random() * 160 + 20, // Center it in the jar
        amount: lastEvent.amount
      };
      setCoins(prev => [...prev.slice(-20), newCoin]); // Keep last 20 visually
    }
  }, [lastEvent]);

  return (
    <div className="relative w-64 h-80 flex flex-col items-center justify-end">
      {/* Jar Container */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-md border-x-2 border-b-2 border-white/20 rounded-b-[4rem] rounded-t-xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 blueprint-grid opacity-10" />
        <div className="absolute top-0 w-full h-4 bg-white/10 border-b border-white/10" />
        
        {/* Fill Level Indicator */}
        <motion.div 
          animate={{ height: `${Math.min(coins.length * 5, 100)}%` }}
          className="absolute bottom-0 left-0 right-0 bg-emerald-500/5 backdrop-blur-sm transition-all duration-1000"
        />

        {/* Coins Container */}
        <div className="relative w-full h-full">
           <AnimatePresence>
             {coins.map((coin) => (
               <Coin key={coin.id} {...coin} />
             ))}
           </AnimatePresence>
        </div>
      </div>

      {/* Label */}
      <div className="absolute -bottom-10 flex flex-col items-center">
         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 flex items-center gap-2">
           <Sparkles className="w-3 h-3" /> The Vault
         </span>
         <div className="h-0.5 w-12 bg-emerald-500/40 mt-1" />
      </div>
    </div>
  );
};

export default TheDrop;
