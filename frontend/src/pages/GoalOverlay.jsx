import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import io from 'socket.io-client';

// --- MODULAR IMPORTS ---
import CyberGoalBar from '../components/CyberGoalBar';
import PremiumGoalOverlays from '../components/PremiumGoalOverlays';

const PREMIUM_GOAL_STYLES = [
  'black_hole', 'hex_core', 'rune_monolith', 'hologram_glitch',
  'alchemist_flask', 'redline_dash', 'loot_dispenser', 'mecha_lens'
];

const runnerMap = {
  star: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2b50/lottie.json',
  car: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f697/lottie.json',
  rocket: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/lottie.json',
  fire: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/lottie.json'
};

const GoalOverlay = () => {
  const { streamerId } = useParams();
  const [goal, setGoal] = useState({ title: "Establishing Uplink...", currentProgress: 0, targetAmount: 100 });
  const [tier, setTier] = useState('starter');
  const [runnerUrl, setRunnerUrl] = useState(runnerMap.star);
  const [isActive, setIsActive] = useState(true);
  const [trueStreamerId, setTrueStreamerId] = useState(null); // Resolved backend identity

  // 1. Fetch initial synchronized data based on URL alias
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await axios.get(`/api/payment/goal/${streamerId}`);
        const settings = res.data.goalSettings || res.data.goal || res.data;

        setGoal({
          title: settings.title || "Active Objective",
          currentProgress: settings.currentProgress || 0,
          targetAmount: settings.targetAmount || 100,
          stylePreference: settings.stylePreference || "modern"
        });

        setTier(res.data.tier || 'starter');
        setIsActive(settings.isActive ?? true);

        const rType = settings.runnerType || 'star';
        setRunnerUrl(rType === 'custom' ? settings.customRunnerUrl : (runnerMap[rType] || runnerMap.star));

        // Save the true backend ID to establish the real-time link
        setTrueStreamerId(res.data.streamerId);
      } catch (err) { console.error("Overlay Uplink Offline"); }
    };

    fetchInitialData();
  }, [streamerId]);

  // 2. Establish Real-Time Telemetry using the true internal ID
  useEffect(() => {
    if (!trueStreamerId) return;

    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5001');
    socket.emit('join-room', trueStreamerId);

    socket.on('goal-update', (updatedGoal) => {
      setGoal(prev => ({ ...prev, ...updatedGoal }));
      if (updatedGoal.isActive !== undefined) setIsActive(updatedGoal.isActive);
      if (updatedGoal.runnerType) {
        setRunnerUrl(updatedGoal.runnerType === 'custom' ? updatedGoal.customRunnerUrl : (runnerMap[updatedGoal.runnerType] || runnerMap.star));
      }
    });

    return () => socket.disconnect();
  }, [trueStreamerId]);

  const percentage = Math.min((goal.currentProgress / goal.targetAmount) * 100, 100);
  const isComplete = percentage >= 100;

  if (!isActive) return null;

  return (
    <div className="overlay-content w-screen h-screen flex items-start justify-center bg-transparent pointer-events-none p-8 font-sans">
      {PREMIUM_GOAL_STYLES.includes(goal.stylePreference) ? (
        <PremiumGoalOverlays
          goal={goal}
          percentage={percentage}
          isComplete={isComplete}
        />
      ) : (
        <CyberGoalBar
          goal={goal}
          tier={tier}
          runnerUrl={runnerUrl}
          percentage={percentage}
          isComplete={isComplete}
          goalStylePreference={goal.stylePreference || 'modern'}
        />
      )}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan { 0% { transform: translateX(-100%) skewX(-15deg); } 50% { transform: translateX(200%) skewX(-15deg); } 100% { transform: translateX(200%) skewX(-15deg); } }
      `}} />
    </div>
  );
};

export default GoalOverlay;