import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap } from 'lucide-react';

const EventItem = ({ event, index }) => {
  const isTip = event.type === 'donation';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.9 }}
      layout
      className="flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-white/10 p-3 rounded-2xl w-[320px] shadow-2xl relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Icon Wrapper */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${isTip ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
        {isTip ? <Heart className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center gap-2">
          <h4 className="text-[12px] font-black uppercase text-white truncate italic tracking-tight">
            {event.donorName}
          </h4>
          <span className="text-[14px] font-black text-emerald-400 italic tracking-tighter shrink-0">
            ₹{event.amount}
          </span>
        </div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">
          {event.type} Received
        </p>
      </div>

      {/* Kinetic Accent */}
      <motion.div 
        animate={{ opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-0 right-0 w-12 h-12 bg-emerald-500/10 blur-xl pointer-events-none"
      />
    </motion.div>
  );
};

const EventList = ({ events = [] }) => {
  // Keep only last 5 events
  const displayEvents = events.slice(0, 5);

  return (
    <div className="flex flex-col gap-3 p-4">
      <AnimatePresence mode="popLayout">
        {displayEvents.map((event, idx) => (
          <EventItem key={event._id || idx} event={event} index={idx} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default EventList;
