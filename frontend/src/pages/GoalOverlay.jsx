import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

// --- MODULAR IMPORTS ---
import CyberGoalBar from '../components/CyberGoalBar';

const runnerMap = {
  star: 'https://lottie.host/246e382d-1144-48f1-8fbd-7ebc24f2b1d3/gYtH5RkIfL.json',
  car: 'https://lottie.host/23c683ee-c0a4-443b-ab5e-b9b596255d64/vN43wP2rRk.json',
  rocket: 'https://lottie.host/b0dc5e70-2216-43dd-b883-fa4c038d1033/D1d51tK2rO.json',
  fire: 'https://lottie.host/c02f7415-3733-4f51-b8ef-f15599026402/1A5Xz2P99Q.json'
};

const GoalOverlay = () => {
  const { streamerId } = useParams();
  const [goal, setGoal] = useState({ title: "Establishing Uplink...", currentProgress: 0, targetAmount: 100 });
  const [tier, setTier] = useState('starter');
  const [runnerUrl, setRunnerUrl] = useState(runnerMap.star); 
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/payment/goal/${streamerId}`);
        const settings = res.data.goalSettings || res.data.goal || res.data;
        
        setGoal({
          title: settings.title || "Active Objective",
          currentProgress: settings.currentProgress || 0,
          targetAmount: settings.targetAmount || 100
        });
        
        setTier(res.data.tier || 'starter');
        setIsActive(settings.isActive ?? true);
        
        const rType = settings.runnerType || 'star';
        setRunnerUrl(rType === 'custom' ? settings.customRunnerUrl : (runnerMap[rType] || runnerMap.star));
      } catch (err) { console.error("Overlay Uplink Offline"); }
    };

    fetchInitialData();

    const socket = io('http://localhost:5001');
    socket.emit('join-room', streamerId); 

    socket.on('goal-update', (updatedGoal) => {
      setGoal(updatedGoal);
      if (updatedGoal.isActive !== undefined) setIsActive(updatedGoal.isActive);
      if (updatedGoal.runnerType) {
         setRunnerUrl(updatedGoal.runnerType === 'custom' ? updatedGoal.customRunnerUrl : (runnerMap[updatedGoal.runnerType] || runnerMap.star));
      }
    });

    return () => socket.disconnect();
  }, [streamerId]);

  const percentage = Math.min((goal.currentProgress / goal.targetAmount) * 100, 100);
  const isComplete = percentage >= 100;

  if (!isActive) return null;

  return (
    <div className="w-screen h-screen flex items-start justify-center bg-transparent pointer-events-none p-8 font-sans">
      <CyberGoalBar 
        goal={goal}
        tier={tier}
        runnerUrl={runnerUrl}
        percentage={percentage}
        isComplete={isComplete}
      />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan { 0% { transform: translateX(-100%) skewX(-15deg); } 50% { transform: translateX(200%) skewX(-15deg); } 100% { transform: translateX(200%) skewX(-15deg); } }
      `}} />
    </div>
  );
};

export default GoalOverlay;