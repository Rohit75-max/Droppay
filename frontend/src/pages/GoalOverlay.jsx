import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';

const GoalOverlay = () => {
  const { streamerId } = useParams();
  const [goal, setGoal] = useState({ title: "Loading Goal...", currentProgress: 0, targetAmount: 100 });

  useEffect(() => {
    // 1. Initial Fetch of Goal Data
    const fetchInitialData = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/payment/goal/${streamerId}`);
        setGoal(res.data);
      } catch (err) {
        console.error("Error loading goal overlay:", err);
      }
    };

    fetchInitialData();

    // 2. Real-Time Socket Connection
    const socket = io('http://localhost:5001');

    // Join the room using streamerId to receive live updates
    socket.emit('join-room', streamerId); 

    // Listen for live goal updates from the backend
    socket.on('goal-update', (updatedGoal) => {
      setGoal(updatedGoal);
    });

    return () => socket.disconnect();
  }, [streamerId]);

  const percentage = Math.min((goal.currentProgress / goal.targetAmount) * 100, 100);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-transparent p-10 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-[500px] bg-black/90 border border-white/10 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-2xl">
              <Target className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] italic">Current Mission</p>
              <h2 className="text-white text-xl font-black italic uppercase tracking-tighter">{goal.title}</h2>
            </div>
          </div>
          <div className="text-right">
             <p className="text-indigo-400 text-lg font-black italic tracking-tighter">₹{goal.currentProgress.toLocaleString()}</p>
             <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Target: ₹{goal.targetAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* --- THE PROGRESS BAR --- */}
        <div className="relative w-full h-6 bg-white/5 rounded-full border border-white/5 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 2, ease: "circOut" }}
            className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 relative"
          >
            <div className="absolute inset-0 bg-white/10 animate-pulse" />
          </motion.div>
        </div>

        <div className="flex justify-between mt-4">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
            {percentage.toFixed(1)}% Completed
          </span>
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic animate-pulse">
            Live Drops Syncing...
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default GoalOverlay;