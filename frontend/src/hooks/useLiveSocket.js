import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useLiveSocket = ({
  user,
  setUser,
  setRecentDrops,
  setTopDonors,
  setChartData,
  setGoalForm,
  setAlertConfig,
  fetchProfileData
}) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user?.obsKey) return;

    if (socketRef.current) socketRef.current.disconnect();

    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5001');
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join-overlay', user.obsKey);
    });

    socket.on('new-drop', (data) => {
      // 1. LIVE NODE BALANCE UPDATE
      setUser(prev => ({ ...prev, walletBalance: (prev.walletBalance || 0) + Number(data.amount) }));

      // 2. LIVE SIGNAL FEED 
      setRecentDrops(prev => {
        const newFeed = [{ ...data, createdAt: new Date() }, ...prev];
        return newFeed.slice(0, 50); // Keep max 50 for performance
      });

      // 3. SECURE LEADERBOARD UPDATE
      setTopDonors(prev => {
        const updated = [...prev];
        const existingIdx = updated.findIndex(d => d._id?.toLowerCase() === data.donorName?.toLowerCase());

        if (existingIdx >= 0) {
          const currentTotal = updated[existingIdx].totalAmount || updated[existingIdx].total || 0;
          updated[existingIdx].totalAmount = currentTotal + Number(data.amount);
        } else {
          updated.push({ _id: data.donorName, totalAmount: Number(data.amount) });
        }

        return updated.sort((a, b) => {
          const totalA = a.totalAmount || a.total || 0;
          const totalB = b.totalAmount || b.total || 0;
          return totalB - totalA;
        }).slice(0, 10);
      });

      // 4. ANIMATED TELEMETRY CHART
      setChartData(prev => {
        if (!prev || prev.length === 0) return prev;
        const newChart = [...prev];
        newChart[newChart.length - 1] += Number(data.amount);
        return newChart;
      });
    });

    socket.on('goal-update', (updatedGoal) => {
      setUser(prev => ({ ...prev, goalSettings: updatedGoal }));
      setGoalForm(prev => ({ ...prev, ...updatedGoal }));
    });

    socket.on('bank_verified', () => {
      if (typeof fetchProfileData === 'function') fetchProfileData();
    });

    socket.on('settings-update', (updatedSettings) => {
      setUser(prev => ({ ...prev, overlaySettings: updatedSettings }));
      setAlertConfig(updatedSettings);
    });

    return () => {
      socket.off('new-drop');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.obsKey, fetchProfileData, setUser, setRecentDrops, setTopDonors, setChartData, setGoalForm, setAlertConfig]);

  return socketRef.current;
};
