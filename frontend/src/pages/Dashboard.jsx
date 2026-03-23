import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
import { io } from 'socket.io-client';
import {
  LayoutDashboard, Settings, Trophy, HelpCircle,
  MessageSquare, Zap, ChevronRight, LogOut,
  ShieldAlert, Activity, X, Play, Loader2, IndianRupee, User,
  Copy, ExternalLink, Bell, Target, ChevronDown, ShoppingBag,
  History, AlertCircle, Trash2, Plus, ArrowRight, ArrowLeft, RotateCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Component Imports
import { syncTheme } from '../api/themeSync';
import { useTheme } from '../context/ThemeContext';
import DashboardSummary from '../components/DashboardSummary';
import ControlCenter from '../components/ControlCenter';
import AccountsHub from '../components/AccountsHub';
import GrowthMissions from '../components/GrowthMissions';
import HelpCenter from '../components/HelpCenter';
import FeedbackStation from '../components/FeedbackStation';
import DashboardStore from './DashboardStore';
import MobileBottomNav from '../components/navigation/MobileBottomNav';

const navItems = [
  { id: 'summary', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'control', icon: Settings, label: 'Settings' },
  { id: 'store', icon: ShoppingBag, label: 'Store' },
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'growth', icon: Trophy, label: 'Growth' },
  { id: 'help', icon: HelpCircle, label: 'Help' },
  { id: 'feedback', icon: MessageSquare, label: 'Feedback' },
];

// --- DYNAMIC INFRASTRUCTURE (Fixes Mobile Persistence) ---
// API_BASE is now handled by the centralized axios configuration in src/api/axios.js

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('dropPayActiveSection') || 'summary';
  });
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuExpanded, setIsMobileMenuExpanded] = useState(false);
  const socketRef = useRef(null);

  const { theme, setTheme } = useTheme();
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(false);
  const BASE_URL = window.location.origin;

  const [nexusTheme, setNexusTheme] = useState(() => {
    return localStorage.getItem('nexusTheme') || 'void';
  });

  useEffect(() => {
    localStorage.setItem('dropPayActiveSection', activeSection);
  }, [activeSection]);

  useEffect(() => {
    localStorage.setItem('dropPayTheme', theme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);

    // Apply Nexus Theme
    const body = document.body;
    body.className = body.className.replace(/theme-\S+/g, '').trim();
    if (nexusTheme !== 'void') {
      body.classList.add(`theme-${nexusTheme}`);
    }

    // Sync with global engine in App.js
    window.dispatchEvent(new CustomEvent('nexus-theme-change', { detail: { theme: nexusTheme } }));
  }, [theme, nexusTheme]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentDrops, setRecentDrops] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState('7D');

  const [goalForm, setGoalForm] = useState({ title: '', targetAmount: 0, showOnDashboard: true, stylePreference: 'modern' });
  const [alertConfig, setAlertConfig] = useState({ ttsEnabled: false, volume: 50 });
  const [partnerStickers, setPartnerStickers] = useState([]);
  const [isSavingStickers, setIsSavingStickers] = useState(false);

  // PROFILE MUTATION & OTP STATES
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);
  const [isLinkingBank, setIsLinkingBank] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState(1000);
  const [withdrawalStep, setWithdrawalStep] = useState(0); // 0: Setup, 1: MFA
  const [mfaCode, setMfaCode] = useState('');
  const [activeModalTab, setActiveModalTab] = useState('Withdraw');

  const [withdrawals, setWithdrawals] = useState([]);
  const [isFetchingWithdrawals, setIsFetchingWithdrawals] = useState(false);

  const fetchWithdrawals = useCallback(async () => {
    try {
      setIsFetchingWithdrawals(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/user/withdrawals', { headers: { Authorization: `Bearer ${token}` } });
      setWithdrawals(res.data);
    } catch (err) {
      console.error("Failed to fetch withdrawals:", err);
    } finally {
      setIsFetchingWithdrawals(false);
    }
  }, []);

  useEffect(() => {
    if (showWithdrawModal) {
      fetchWithdrawals();
      setWithdrawalStep(0);
      setMfaCode('');
      setActiveModalTab('Withdraw');
    }
  }, [showWithdrawModal, fetchWithdrawals]);

  const handleCancelWithdrawal = async (id) => {
    if (isCancellingId === id) return;
    setIsCancellingId(id);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/user/cancel-withdrawal', { withdrawalId: id }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(res.data.msg || "Withdrawal Cancelled", { position: 'bottom-center', theme: 'dark' });
      await Promise.all([fetchProfileData(), fetchWithdrawals()]);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to cancel withdrawal.", { position: 'bottom-center', theme: 'dark' });
    } finally {
      setIsCancellingId(null);
    }
  };

  // SHARED STATES FOR CONTROL & COPY
  const [isUpdatingGoal, setIsUpdatingGoal] = useState(false);
  const [copiedType, setCopiedType] = useState(null);
  const [isCancellingId, setIsCancellingId] = useState(null);

  // NEW: FEEDBACK PROTOCOL STATES
  const [feedbackType, setFeedbackType] = useState('general');
  const [priority, setPriority] = useState('medium');
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);


  const fetchProfileData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }

      const res = await axios.get(`/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(res.data);

      // --- SUBSCRIPTION GUARD: Must be ACTIVE to access Nexus ---
      if (res.data.subscription?.status !== 'active') {
        navigate('/subscription');
        return;
      }

      if (res.data.nexusTheme) {
        syncTheme(res.data);
      }

      // --- FORCE DARK THEME MIGRATION (Streamer Preference) ---
      const currentThemeMode = res.data.nexusThemeMode || 'light';
      if (currentThemeMode === 'light') {
        syncTheme({ ...res.data, nexusThemeMode: 'dark' });
        // Update profile on server to persist dark mode
        const token = localStorage.getItem('token');
        axios.post(`/api/user/update-profile`,
          { nexusThemeMode: 'dark' },
          { headers: { Authorization: `Bearer ${token}` } }
        ).catch(e => console.error("Failed to persist dark theme", e));
      } else {
        syncTheme(res.data);
      }
      setGoalForm({
        title: res.data.goalSettings?.title || "New Goal",
        targetAmount: res.data.goalSettings?.targetAmount || 0,
        isActive: res.data.goalSettings?.isActive ?? true,
        stylePreference: res.data.goalSettings?.stylePreference || "glass_jar"
      });

      if (res.data.overlaySettings) setAlertConfig(res.data.overlaySettings);
      if (res.data.partnerPack) setPartnerStickers(res.data.partnerPack);

      const [recent, top, stats] = await Promise.all([
        axios.get(`/api/payment/recent/${res.data.streamerId}`).catch(() => ({ data: [] })),
        axios.get(`/api/payment/top/${res.data.streamerId}`).catch(() => ({ data: [] })),
        axios.get(`/api/payment/analytics/${res.data.streamerId}?range=${timeRange}`).catch(() => ({ data: { points: [] } }))
      ]);

      setRecentDrops(recent.data || []);
      setTopDonors(top.data || []);
      setChartData(stats.data?.points || []);
      setError(null);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 429) {
        console.warn("Rate limited, keeping UI active without kicking the user.");
        // Give a temporary soft warning without triggering the fatal disconnect UI
        setLoading(false);
        // Soft toast or silent bypass
        return;
      }

      if (err.response?.status === 401 || err.response?.status === 404) {
        console.warn("Auth failure in profile fetch, navigating to login.");
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      setError("Connection Error: Service unreachable.");
      setLoading(false);
    }
  }, [navigate, timeRange]);

  // --- TARGETED ANALYTICS FETCH (Prevents Full-Page Flicker) ---
  const fetchAnalyticsData = useCallback(async () => {
    if (!user?.streamerId) return;
    try {
      const stats = await axios.get(`/api/payment/analytics/${user.streamerId}?range=${timeRange}`);
      setChartData(stats.data?.points || []);
    } catch (err) {
      console.error("Analytics fetch failed", err);
    }
  }, [user?.streamerId, timeRange]);

  const handleLogoClick = () => {
    fetchProfileData(); // Standardized Refresh Handshake
  };

  useEffect(() => {
    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on initial mount

  useEffect(() => {
    if (user?.streamerId) {
      fetchAnalyticsData();
    }
  }, [timeRange, fetchAnalyticsData, user?.streamerId]);

  // SOCKET LIVE DATA STREAM
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

        // Dynamically increment the specific donor, else add them
        if (existingIdx >= 0) {
          const currentTotal = updated[existingIdx].totalAmount || updated[existingIdx].total || 0;
          updated[existingIdx].totalAmount = currentTotal + Number(data.amount);
        } else {
          updated.push({ _id: data.donorName, totalAmount: Number(data.amount) });
        }

        // Push the dynamic change up the array hierarchy 
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
        // Instantly surge the bar on the final (today's) point
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
  }, [user?.obsKey, fetchProfileData]);

  const updateGoalSettings = useCallback(async (overrideData) => {
    setIsUpdatingGoal(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/user/update-goal', overrideData || goalForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchProfileData();
      if (!overrideData) {
        toast.success("Mission Deployed Successfully");
      }
    } catch (err) {
      console.error("Goal update failed", err);
    } finally {
      setIsUpdatingGoal(false);
    }
  }, [fetchProfileData, goalForm]);

  const saveAlertSettings = useCallback(async (newConfig) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/user/update-profile',
        { overlaySettings: newConfig },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlertConfig(newConfig);
    } catch (err) {
      console.error("Failed to sync overlay settings", err);
    }
  }, []);

  const saveNexusTheme = useCallback(async (newTheme) => {
    try {
      const { mode } = syncTheme({ nexusTheme: newTheme });
      setNexusTheme(newTheme);
      setTheme(mode);
      setUser(prev => ({ ...prev, nexusTheme: newTheme, nexusThemeMode: mode }));
      const token = localStorage.getItem('token');
      await axios.post(`/api/user/update-profile`,
        { nexusTheme: newTheme, nexusThemeMode: mode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to sync nexus theme", err);
    }
  }, [setTheme]);

  const equipAsset = async (category, assetId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/user/equip-asset',
        { category, assetId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update the right slice of user state based on category
      if (category === 'theme') {
        syncTheme({ nexusTheme: assetId });
        setNexusTheme(assetId);
        setUser(prev => ({ ...prev, nexusTheme: assetId }));
      } else if (category === 'alert') {
        setAlertConfig(res.data.overlaySettings);
        setUser(prev => ({ ...prev, overlaySettings: res.data.overlaySettings }));
      } else if (category === 'goal') {
        setGoalForm(prev => ({ ...prev, stylePreference: assetId }));
        setUser(prev => ({ ...prev, goalSettings: { ...prev.goalSettings, stylePreference: assetId } }));
      } else if (category === 'widget') {
        setUser(prev => ({ ...prev, activeRevenueWidget: assetId }));
      }
    } catch (err) {
      console.error(`Failed to equip ${category} asset`, err);
    }
  };


  const triggerTestSignal = async (sticker = 'zap') => {
    try {
      if (!user?.streamerId) return;
      await axios.post('/api/payment/test-drop', {
        streamerId: user.streamerId,
        donorName: "Top_Supporter_77",
        amount: 500,
        message: "This is a real-time signal test! 🚀",
        sticker: sticker
      });
    } catch (err) {
      console.error("Test signal failed", err);
    }
  };

  const addStickerSlot = () => {
    setPartnerStickers([...partnerStickers, { emoji: '✨', lottieUrl: 'https://lottie.host/81a5330a-20d0-4ddf-ba5d-e0a5bd7ea3d7/vYvO4f9W5a.json', minAmount: 100 }]);
  };

  const removeStickerSlot = (idx) => {
    setPartnerStickers(partnerStickers.filter((_, i) => i !== idx));
  };

  const savePartnerPack = async () => {
    setIsSavingStickers(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/user/update-profile',
        { partnerPack: partnerStickers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchProfileData();
      toast.success("Stickers Updated");
    } catch (err) {
      console.error("Failed to sync partner pack", err);
    } finally {
      setIsSavingStickers(false);
    }
  };


  // ISOLATED OTP PIPELINE FOR EMAIL/PHONE
  const saveContactUpdate = async (type, value) => {
    try {
      const token = localStorage.getItem('token');
      const payload = { [type]: value };
      const res = await axios.post('/api/user/update-profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 206) {
        setShowOtpModal(true);
        return true; // Indicate success flag to AccountsHub
      } else {
        await fetchProfileData();
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || `Failed to verify ${type}.`);
      return false;
    }
  };

  const verifyProfileOtp = async () => {
    setIsVerifyingOtp(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/user/verify-profile-update', { otp: otpInput }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchProfileData();
      setShowOtpModal(false);
      setOtpInput('');
      toast.success("Identity Verified & Updated");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Invalid Security Code.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleBankLink = async () => {
    setIsLinkingBank(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/user/link-bank', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Bank linkage initialization failed.");
      }
    } catch (err) {
      toast.error("Failed to connect payout settings.");
    } finally {
      setIsLinkingBank(false);
    }
  };

  const handleWithdrawRequest = async (amount) => {
    setIsProcessingWithdraw(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/user/withdraw', { amount }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWithdrawalStep(2); // SUCCESS SCREEN
      await fetchProfileData(); // Refresh wallet UI instantly
    } catch (err) {
      toast.error(err.response?.data?.msg || "Withdrawal failed.");
    } finally {
      setIsProcessingWithdraw(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const getProgressPercentage = () => {
    if (!user?.goalSettings?.targetAmount) return 0;
    return Math.min((user.goalSettings.currentProgress / user.goalSettings.targetAmount) * 100, 100);
  };

  if (loading) return (
    <div className="h-screen bg-[var(--nexus-bg)] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-[#10B981] animate-spin" />
        <Activity className="w-6 h-6 text-[#10B981] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#10B981] animate-pulse">Loading Dashboard</span>
    </div>
  );

  if (error) return (
    <div className="h-screen bg-[var(--nexus-bg)] flex flex-col items-center justify-center p-6 text-center">
      <ShieldAlert className="w-16 h-16 text-rose-500 mb-6 animate-bounce" />
      <h2 className="text-xl font-black uppercase italic text-[var(--nexus-text)] mb-2">{error}</h2>
      <button onClick={() => window.location.reload()} className="bg-[#10B981] text-black px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
        Try Again
      </button>
    </div>
  );

  return (
    <div className={`h-screen flex flex-col md:flex-row overflow-hidden transition-all duration-500 bg-transparent text-[var(--nexus-text)] relative`}>
      {/* Background layer is now handled globally by LiveThemeEngine in App.js */}

      <div className="flex flex-col md:flex-row w-full h-full relative z-10 overflow-hidden">
        {/* SIDEBAR — Theme-Aware Control Pillar */}
        <aside className={`md:flex hidden w-20 hover:w-64 group transition-all duration-500 flex-col py-8 border-r basis-auto shrink-0 overflow-y-auto custom-scrollbar bg-[var(--nexus-panel)] backdrop-blur-3xl border-[var(--nexus-border)] z-[120] ${theme === 'dark' ? 'shadow-2xl shadow-black/50' : 'shadow-none'}`}>
          <div
            className="flex items-center px-6 mb-12 gap-4 cursor-pointer"
            onClick={handleLogoClick}
          >
            <Zap className="w-8 h-8 text-[var(--nexus-accent)] flex-shrink-0" />
            <span className="text-xl font-black italic tracking-tighter opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap text-[var(--nexus-text)]">DropPay</span>
          </div>
          <nav className="flex-1 space-y-2 px-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between gap-4 p-3 rounded-[var(--nexus-radius)] transition-all theme-btn ${activeSection === item.id
                  ? 'bg-[var(--nexus-accent)] text-[var(--nexus-bg)] shadow-lg'
                  : 'text-[var(--nexus-text-muted)] hover:bg-[var(--nexus-accent)]/10'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-6 h-6 flex-shrink-0" />
                  <span className="font-black italic uppercase text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">{item.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-all ${activeSection === item.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
              </button>
            ))}
          </nav>

          {/* SECURE ADMIN ENTRY */}
          {user?.role === 'admin' && (
            <button onClick={() => navigate('/admin/secure-portal')} className={`px-7 py-4 mt-auto mb-2 flex items-center gap-4 transition-colors border-t ${theme === 'light' ? 'text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-emerald-100' : 'text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 border-rose-500/20'}`}>
              <ShieldAlert className="w-6 h-6 flex-shrink-0 animate-pulse" />
              <span className="font-black italic uppercase text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">Admin Portal</span>
            </button>
          )}

          <button onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('nexusTheme');
            localStorage.removeItem('dropPayTheme');
            navigate('/login');
          }} className={`px-7 py-4 flex items-center gap-4 transition-colors ${user?.role !== 'admin' ? 'mt-auto' : ''} text-rose-500 hover:text-rose-400 hover:bg-rose-500/10`}>
            <LogOut className="w-6 h-6 flex-shrink-0" />
            <span className="font-black italic uppercase text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">Logout</span>
          </button>

        </aside>


        {/* PROTOCOL CONTROLS OVERLAY (Shared Mobile/Desktop) */}
        <MobileBottomNav
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onLogout={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('nexusTheme');
            localStorage.removeItem('dropPayTheme');
            navigate('/login');
          }}
          user={user}
          theme={theme}
          isMenuExpanded={isMobileMenuExpanded}
          setIsMenuExpanded={setIsMobileMenuExpanded}
        />

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.25 }}
              className={`fixed inset-0 z-[150] p-6 flex flex-col lg:hidden bg-[var(--nexus-bg)] text-[var(--nexus-text)]`}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => { handleLogoClick(); setIsMobileMenuOpen(false); }}>
                  <Zap className="w-8 h-8 text-[var(--nexus-accent)]" />
                  <span className={`text-xl font-black italic tracking-tighter text-[var(--nexus-text)]`}>DropPay</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2 rounded-xl border border-[var(--nexus-border)] text-[var(--nexus-text)]`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2 flex-1 overflow-y-auto scrollbar-hide pr-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveSection(item.id); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center justify-between py-3 md:py-4 text-base md:text-lg font-black italic uppercase border-b transition-all ${activeSection === item.id
                      ? (theme === 'light' ? 'text-emerald-700 bg-emerald-50 px-3 rounded-xl border-b-transparent shadow-sm' : 'text-[var(--nexus-accent)] border-[var(--nexus-border)]')
                      : (theme === 'light' ? 'text-emerald-950/60 border-emerald-100' : 'text-[var(--nexus-text-muted)] border-[var(--nexus-border)]')
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className={`w-5 h-5 md:w-6 md:h-6 ${activeSection === item.id && theme === 'light' ? 'text-emerald-600' : ''}`} />
                      {item.label}
                    </div>
                    <ChevronRight className={`w-5 h-5 ${activeSection === item.id ? 'opacity-100 text-current' : 'opacity-0'}`} />
                  </button>
                ))}
              </div>

              <div className="pt-2 shrink-0 border-t border-[var(--nexus-border)] mt-2">
                {/* MOBILE SECURE ADMIN ENTRY */}
                {user?.role === 'admin' && (
                  <button onClick={() => { navigate('/admin/secure-portal'); setIsMobileMenuOpen(false); }} className={`w-full mb-2 py-3 md:py-4 font-black italic uppercase text-base md:text-lg flex items-center gap-4 border-b ${theme === 'light' ? 'text-rose-600 border-emerald-100' : 'text-rose-500 border-rose-500/20'}`}>
                    <ShieldAlert className="w-5 h-5 md:w-6 md:h-6 animate-pulse" /> Admin Portal
                  </button>
                )}

                <button onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('nexusTheme');
                  localStorage.removeItem('dropPayTheme');
                  navigate('/login');
                }} className={`w-full py-3 md:py-4 font-black italic uppercase text-base md:text-lg flex items-center gap-4 ${theme === 'light' ? 'text-rose-600' : 'text-rose-500'}`}><LogOut className="w-5 h-5 md:w-6 md:h-6" /> Logout</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 flex flex-col relative overflow-hidden pt-0 bg-transparent">
          <header className="px-6 py-2 md:px-12 md:py-2.5 flex justify-between items-center z-40 bg-[var(--nexus-panel)] backdrop-blur-3xl border-b border-[var(--nexus-border)]">
            <div className="flex flex-col">
              <span className="text-[7px] font-black uppercase tracking-[0.4em] text-[var(--nexus-accent)] drop-shadow-[0_0_8px_var(--nexus-accent-glow)]">DropPay</span>
              <div className="flex items-center gap-4">
                <h1 className={`text-xl md:text-2xl font-black italic tracking-tighter ${nexusTheme === 'neon_relic' ? 'relic-text-glow' : 'text-[var(--nexus-text)]'}`}>
                  {(navItems.find(item => item.id === activeSection)?.label || 'DASHBOARD').toUpperCase()}.
                </h1>

              </div>
            </div>

            {/* Profile Pill & Quick Links */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsQuickLinksOpen(!isQuickLinksOpen)}
                className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-[var(--nexus-panel)] border border-[var(--nexus-border)] shadow-lg hover:shadow-[var(--nexus-glow)] transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--nexus-accent)] flex items-center justify-center text-[var(--nexus-bg)] font-black text-xs shadow-[0_0_10px_var(--nexus-accent-glow)]">
                  {user?.fullName?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col items-start hidden sm:flex">
                  <span className="text-[10px] font-black text-[var(--nexus-text)] tracking-wider">{user?.username || 'User'}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[var(--nexus-text-muted)] transition-transform duration-300 ${isQuickLinksOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {isQuickLinksOpen && (
                  <>
                    {/* Overlay Backdrop for closing on click outside */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsQuickLinksOpen(false)}
                      className="fixed inset-0 z-40"
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className={`absolute right-1 sm:right-6 mt-6 w-[92vw] max-w-[calc(100vw-32px)] sm:w-[450px] md:w-[800px] lg:w-[950px] border rounded-[2.5rem] z-50 overflow-hidden max-h-[90vh] flex flex-col ${theme === 'light'
                        ? 'bg-white border-slate-200 shadow-[0_30px_70px_-10px_rgba(0,0,0,0.15)]'
                        : 'bg-[var(--nexus-bg)] border-[var(--nexus-border)] shadow-[0_50px_100px_-15px_rgba(0,0,0,0.7)] backdrop-blur-3xl'
                        }`}
                    >
                      <div className="p-4 sm:p-6 pb-4 space-y-4 overflow-y-hidden flex flex-col">
                        <div className="flex border-b border-[var(--nexus-border)] pb-3 mb-1 items-center justify-between">
                          <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-[var(--nexus-accent)]">Quick Links</h4>
                          <span className="text-[8px] font-bold text-[var(--nexus-text-muted)] uppercase tracking-widest opacity-30 italic">Zero-Scroll Hub</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {[
                            { label: 'Donation Page', icon: IndianRupee, value: `${BASE_URL}/pay/${user?.username}`, color: 'var(--nexus-accent)' },
                            { label: 'Overlay Link', icon: Bell, value: `${BASE_URL}/overlay/${user?.obsKey}`, color: '#f43f5e' },
                            { label: 'Goal Link', icon: Target, value: `${BASE_URL}/goal/${user?.username}`, color: '#f59e0b' },
                            { label: 'Master Link', icon: Activity, value: `${BASE_URL}/overlay/master/${user?.obsKey}`, color: '#8b5cf6' }
                          ].map((item, idx) => (
                            <div key={idx} className="group/item flex flex-col gap-2 p-3 sm:p-4 rounded-2xl bg-[var(--nexus-panel)] border border-[var(--nexus-border)] hover:border-[var(--nexus-accent)]/40 transition-all shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <div className={`p-1.5 rounded-lg ${theme === 'light' ? 'bg-slate-100' : 'bg-black/40'} border border-white/5`} style={{ color: item.color }}>
                                    <item.icon className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-[var(--nexus-text)]">{item.label}</span>
                                </div>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(item.value);
                                    toast.success(`${item.label} Copied!`, {
                                      position: "top-center",
                                      autoClose: 2000,
                                      hideProgressBar: true,
                                      theme: theme === 'dark' ? 'dark' : 'light'
                                    });
                                  }}
                                  className="p-1 rounded-lg hover:bg-[var(--nexus-accent)]/10 text-[var(--nexus-text-muted)] hover:text-[var(--nexus-accent)] transition-all"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                              <div className={`flex items-center gap-2 px-1.5 py-1 rounded-lg border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-black/20 border-white/5'
                                }`}>
                                <span className="text-[8px] font-mono text-[var(--nexus-text-muted)] truncate flex-1">{item.value}</span>
                                <a href={item.value} target="_blank" rel="noopener noreferrer" className="shrink-0 opacity-40 hover:opacity-100 transition-opacity">
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => setIsQuickLinksOpen(false)}
                          className={`w-full py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] mt-2 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xl ${theme === 'light'
                            ? 'bg-slate-900 text-white shadow-slate-200'
                            : 'bg-[var(--nexus-accent)] text-black shadow-[var(--nexus-accent)]/20 hover:brightness-110'
                            }`}
                        >
                          Close Quick Links
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </header>

          <div className={`flex-1 overflow-y-auto custom-scrollbar px-4 md:px-8 pb-32 md:pb-12 transition-all duration-300 ${isQuickLinksOpen ? 'blur-[8px] opacity-50 border-white/5 saturate-[0.5]' : ''}`}>
            <AnimatePresence mode="wait">
              <motion.div key={activeSection} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }} className="max-w-7xl mx-auto w-full flex flex-col items-center">
                <div className="w-full">
                  {activeSection === 'summary' && (
                    <DashboardSummary {...{
                      theme, user, chartData, timeRange, setTimeRange,
                      recentDrops, topDonors, getProgressPercentage,
                      handleWithdrawRequest, isProcessingWithdraw,
                      nexusTheme, setShowWithdrawModal,
                      Play
                    }} />
                  )}
                  {activeSection === 'control' && (
                    <ControlCenter
                      theme={theme} user={user}
                      goalForm={goalForm} setGoalForm={setGoalForm}
                      updateGoalSettings={updateGoalSettings}
                      isUpdatingGoal={isUpdatingGoal}
                      alertConfig={alertConfig} setAlertConfig={setAlertConfig}
                      saveAlertSettings={saveAlertSettings}
                      nexusTheme={nexusTheme}
                      saveNexusTheme={saveNexusTheme}
                      equipAsset={equipAsset}
                      partnerStickers={partnerStickers}
                      addStickerSlot={addStickerSlot}
                      removeStickerSlot={removeStickerSlot}
                      savePartnerPack={savePartnerPack}
                      isSavingStickers={isSavingStickers}
                      updatePartnerPack={setPartnerStickers}
                      copyToClipboard={copyToClipboard}
                      copiedType={copiedType}
                      triggerTestSignal={triggerTestSignal}
                      setActiveSection={setActiveSection}
                    />
                  )}
                  {activeSection === 'profile' && <AccountsHub theme={theme} user={user} saveContactUpdate={saveContactUpdate} handleBankLink={handleBankLink} isLinkingBank={isLinkingBank} setActiveSection={setActiveSection} fetchProfileData={fetchProfileData} copyToClipboard={copyToClipboard} copiedType={copiedType} />}
                  {activeSection === 'growth' && <GrowthMissions theme={theme} user={user} copyToClipboard={copyToClipboard} copiedType={copiedType} />}
                  {activeSection === 'help' && <HelpCenter theme={theme} user={user} />}
                  {activeSection === 'store' && <DashboardStore theme={theme} user={user} setUser={setUser} fetchProfileData={fetchProfileData} />}
                  {activeSection === 'feedback' && (
                    <FeedbackStation
                      theme={theme} user={user}
                      feedbackType={feedbackType} setFeedbackType={setFeedbackType}
                      priority={priority} setPriority={setPriority}
                      rating={rating} setRating={setRating}
                      feedbackText={feedbackText} setFeedbackText={setFeedbackText}
                      isSubmittingFeedback={isSubmittingFeedback}
                      setIsSubmittingFeedback={setIsSubmittingFeedback}
                    />
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>


      {/* WITHDRAWAL MODAL (PROFESSIONAL REDESIGN) */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center pt-20 pb-24 px-4 md:p-8 bg-black/40"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`w-full max-w-4xl max-h-full md:max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col ${theme === 'light' ? 'bg-white' : 'bg-[#121212] border border-white/5'
                }`}
            >
              {/* MODAL HEADER: BALANCE & TABS */}
              <div className={`p-4 md:p-6 pb-0 ${theme === 'light' ? 'bg-slate-50/50' : 'bg-white/[0.02]'}`}>
                <div className="flex items-start md:items-center justify-between mb-4 md:mb-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                    <span className={`text-[10px] md:text-sm font-bold uppercase tracking-widest md:normal-case md:tracking-normal ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Current Balance:</span>
                    <span className={`text-lg md:text-xl font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                      ₹{(Number(user.walletBalance) || 0).toLocaleString('en-IN')} <span className="text-[10px] font-bold opacity-60">INR</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    className={`p-2 rounded-full transition-colors ${theme === 'light' ? 'hover:bg-slate-200 text-slate-400' : 'hover:bg-white/10 text-slate-500'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* TABS */}
                <div className="flex items-center gap-4 md:gap-8 border-b border-slate-200 dark:border-white/5">
                  {['Withdraw', 'History'].map((tab) => {
                    const isActive = activeModalTab === tab;
                    const isHistory = tab === 'History';
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveModalTab(tab)}
                        className={`pb-4 text-[10px] md:text-xs font-black uppercase tracking-widest relative transition-all flex items-center gap-2 ${isActive
                          ? (theme === 'light' ? 'text-slate-900' : 'text-white')
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                          }`}
                      >
                        {isHistory && <History className="w-3.5 h-3.5" />}
                        {tab}
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--nexus-accent)]"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MODAL CONTENT */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 md:p-8">
                <AnimatePresence mode="wait">
                  {activeModalTab === 'History' ? (
                    <motion.div
                      key="history"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Recent Node Disbursals</h4>
                        <span className="text-[10px] font-mono text-slate-500 font-bold">NODE LOGS: 50</span>
                      </div>

                      {isFetchingWithdrawals ? (
                        <div className="flex justify-center py-20">
                          <Loader2 className="w-8 h-8 animate-spin text-[var(--nexus-accent)]" />
                        </div>
                      ) : withdrawals.length === 0 ? (
                        <div className={`py-20 text-center rounded-2xl border border-dashed ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/10'}`}>
                          <History className="w-8 h-8 mx-auto mb-4 opacity-20" />
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No Recent Activity Found</p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                          {withdrawals.map((wd) => {
                            const amt = Math.abs(wd.amount);
                            const statusColors = {
                              pending: 'border-amber-500/30 text-amber-500 bg-amber-500/5',
                              processing: 'border-blue-500/30 text-blue-400 bg-blue-500/5',
                              completed: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5',
                              cancelled: 'border-red-500/30 text-red-400 bg-red-500/5'
                            };

                            return (
                              <div
                                key={wd._id}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${theme === 'light'
                                  ? 'bg-slate-50 border-slate-100 hover:border-slate-200'
                                  : 'bg-white/[0.03] border-white/5 hover:border-white/10'
                                  }`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'light' ? 'bg-white shadow-sm' : 'bg-white/5'}`}>
                                    <IndianRupee className="w-4 h-4 text-[var(--nexus-accent)]" />
                                  </div>
                                  <div>
                                    <h5 className={`text-xs font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Bank Withdrawal</h5>
                                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{new Date(wd.createdAt).toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <h5 className={`text-xs font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>₹{amt.toLocaleString()}</h5>
                                    <span className={`px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest ${statusColors[wd.status] || 'border-slate-500 text-slate-400'}`}>
                                      {wd.status}
                                    </span>
                                  </div>
                                  {wd.status === 'pending' && (
                                    <button
                                      onClick={() => handleCancelWithdrawal(wd._id)}
                                      disabled={isCancellingId === wd._id}
                                      className={`p-2 rounded-lg border transition-all ${isCancellingId === wd._id ? 'opacity-50 cursor-not-allowed border-slate-700' :
                                        theme === 'light'
                                          ? 'border-red-200 text-red-500 hover:bg-red-50'
                                          : 'border-red-500/20 text-red-400 hover:bg-red-500/10'
                                        }`}
                                    >
                                      {isCancellingId === wd._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  ) : withdrawalStep === 0 ? (
                    <motion.div
                      key="step0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
                    >
                      {/* LEFT: ORDER DETAILS */}
                      <div className="space-y-8">
                        <h4 className={`text-sm font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Bank Transfer</h4>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Withdrawal Amount</label>
                            <div className="relative group">
                              <input
                                type="number"
                                value={withdrawalAmount}
                                onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
                                className={`w-full p-4 md:p-6 pr-24 rounded-xl md:rounded-2xl border text-xl md:text-2xl font-black transition-all outline-none ${theme === 'light'
                                  ? 'bg-slate-50 border-slate-200 focus:border-slate-400 text-slate-900 group-hover:border-slate-300'
                                  : 'bg-white/5 border-white/10 focus:border-white/20 text-white group-hover:border-white/15'
                                  }`}
                                placeholder="1000"
                              />
                              <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                <button
                                  onClick={() => setWithdrawalAmount(Number(user.walletBalance) || 0)}
                                  className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-accent)] hover:brightness-110"
                                >
                                  MAX
                                </button>
                                <span className="text-xs font-bold text-slate-500">INR</span>
                              </div>
                            </div>
                            <p className="text-[10px] font-bold text-slate-500">Remaining Daily Withdrawal: ₹{(Number(user.walletBalance) || 0).toLocaleString('en-IN')}</p>
                          </div>

                          <div className="space-y-4">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Summary:</span>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-slate-500">Transaction Fee (Razorpay 2%)</span>
                                <span className={theme === 'light' ? 'text-slate-900' : 'text-white'}>₹{(withdrawalAmount * 0.02).toFixed(2)} INR</span>
                              </div>
                              <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-slate-500">You Will Get</span>
                                <span className="text-[var(--nexus-accent)] font-black text-sm">₹{(withdrawalAmount * 0.98).toFixed(2)} INR</span>
                              </div>
                            </div>
                          </div>

                          <div className={`p-4 rounded-xl border flex gap-3 ${theme === 'light' ? 'bg-amber-50/50 border-amber-100' : 'bg-amber-500/5 border-amber-500/20'}`}>
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] font-medium leading-relaxed text-amber-700 dark:text-amber-500/80">A processing log fee might be applicable for settlements below ₹1,000.00. Funds typically arrive in 1-2 business days.</p>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT: PAYMENT DETAILS */}
                      <div className="space-y-8">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Payment Details</span>
                        <div className="space-y-4">
                          {user.payoutSettings?.bankDetailsLinked ? (
                            <div className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${theme === 'light'
                              ? 'bg-slate-50 border-pink-100 shadow-[0_4px_20px_rgba(244,114,182,0.1)]'
                              : 'bg-white/[0.03] border-pink-500/30'
                              }`}>
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center p-[1px]">
                                  <div className={`w-full h-full rounded-2xl flex items-center justify-center ${theme === 'light' ? 'bg-white' : 'bg-[#1a1a1a]'}`}>
                                    <div className="w-4 h-4 rounded-full bg-[var(--nexus-accent)] shadow-[0_0_10px_var(--nexus-accent)]" />
                                  </div>
                                </div>
                                <div>
                                  <h5 className={`text-sm font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Primary Bank Account</h5>
                                  <div className="flex items-center gap-4 mt-1 text-[10px] font-mono font-bold text-slate-500">
                                    <span>IFSC: {user.bankDetails?.ifsc || 'N/A'}</span>
                                    <span>ACC: {user.bankDetails?.masked_account || '**** 0000'}</span>
                                  </div>
                                </div>
                              </div>
                              <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors cursor-pointer" />
                            </div>
                          ) : (
                            <div className={`p-6 rounded-2xl border border-dashed flex flex-col items-center text-center gap-3 ${theme === 'light' ? 'bg-amber-50/30 border-amber-200' : 'bg-white/[0.02] border-white/10'
                              }`}>
                              <AlertCircle className="w-8 h-8 text-amber-500 opacity-50" />
                              <div className="space-y-1">
                                <h5 className={`text-xs font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>No Bank Account Linked</h5>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">Complete onboarding to enable withdrawals</p>
                              </div>
                              <button
                                onClick={() => {
                                  setShowWithdrawModal(false);
                                  setActiveSection('profile');
                                }}
                                className="px-4 py-2 bg-amber-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 transition-colors"
                              >
                                Link Bank Now
                              </button>
                            </div>
                          )}

                          <button
                            disabled={!user.payoutSettings?.bankDetailsLinked}
                            onClick={handleBankLink}
                            className={`w-full p-4 rounded-2xl border border-dashed flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed ${theme === 'light' ? 'border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600' : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
                              }`}
                          >
                            <Plus className="w-4 h-4" />
                            Add New Payment Detail
                          </button>
                        </div>

                        <div className="pt-8">
                          <button
                            disabled={!user.payoutSettings?.bankDetailsLinked || withdrawalAmount < 1000 || withdrawalAmount > (Number(user.walletBalance) || 0)}
                            onClick={() => setWithdrawalStep(1)}
                            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale ${theme === 'light'
                              ? 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200'
                              : 'bg-[var(--nexus-accent)] text-black hover:brightness-110 shadow-lg shadow-[var(--nexus-accent)]/20'
                              }`}
                          >
                            {user.payoutSettings?.bankDetailsLinked ? 'Withdraw' : 'Account Required'}
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : withdrawalStep === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
                    >
                      {/* LEFT: WITHDRAWAL SUMMARY */}
                      <div className="space-y-8">
                        <div>
                          <button
                            onClick={() => setWithdrawalStep(0)}
                            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-4 transition-colors ${theme === 'light' ? 'text-slate-400 hover:text-slate-900' : 'text-slate-500 hover:text-white'}`}
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back
                          </button>
                          <h4 className={`text-sm font-black uppercase tracking-widest mb-4 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Withdrawal Summary</h4>
                          <p className="text-[10px] font-bold text-slate-500">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>

                        <div className={`p-6 rounded-2xl border ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/[0.02] border-white/5'}`}>
                          <div className="space-y-4">
                            {[
                              { label: 'You Receive', value: `₹${(withdrawalAmount * 0.98).toFixed(2)} INR`, highlight: true },
                              { label: 'Transaction Fee (Razorpay)', value: `₹${(withdrawalAmount * 0.02).toFixed(2)} INR` },
                              { label: 'Acc Name', value: user.bankDetails?.account_holder_name || user.fullName || 'User' },
                              { label: 'IFSC', value: user.bankDetails?.ifsc || 'N/A' },
                              { label: 'Acc Number', value: user.bankDetails?.masked_account || '**** 0000' }
                            ].map((item, i) => (
                              <div key={i} className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-500">{item.label}</span>
                                <span className={`text-[11px] font-black ${item.highlight ? 'text-[var(--nexus-accent)]' : (theme === 'light' ? 'text-slate-900' : 'text-white')}`}>
                                  {item.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <p className="text-[9px] font-medium leading-relaxed text-slate-400 italic">*Some banks might release funds with a delay for first-time payments. In this case, your deposit will be available between 1-2 business days.</p>
                      </div>

                      {/* RIGHT: MFA AUTHENTICATION */}
                      <div className="space-y-8">
                        <h4 className={`text-sm font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Multi-Factor Authentification</h4>
                        <div className="space-y-6">
                          <p className={`text-[10px] font-medium leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                            We've sent you a SMS verification code to <span className="font-bold text-[var(--nexus-text)]">{user.phone ? `${user.phone.slice(0, 4)} XXX ${user.phone.slice(-2)}` : 'XXXX-XX-XX'}</span>. Please, enter this code here to verify.
                          </p>

                          <div className="space-y-4">
                            <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Code</label>
                            <input
                              type="text"
                              value={mfaCode}
                              onChange={(e) => setMfaCode(e.target.value)}
                              className={`w-full p-4 rounded-xl border text-xl font-black tracking-[1em] text-center transition-all outline-none ${theme === 'light'
                                ? 'bg-slate-50 border-slate-200 focus:border-slate-400 text-slate-900'
                                : 'bg-white/5 border-white/10 focus:border-white/20 text-white'
                                }`}
                              placeholder="000000"
                              maxLength={6}
                            />
                            <div className="flex items-center justify-between text-[10px] font-bold">
                              <span className="text-slate-500">Resend available in 10 sec</span>
                              <button className="text-[var(--nexus-accent)] flex items-center gap-1 opacity-50 cursor-not-allowed">
                                <RotateCw className="w-3 h-3" />
                                Resend
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                          <button
                            onClick={() => setShowWithdrawModal(false)}
                            className={`flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-colors ${theme === 'light' ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                              }`}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleWithdrawRequest(withdrawalAmount)}
                            disabled={isProcessingWithdraw || mfaCode.length < 6}
                            className={`flex-[2] py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-lg ${theme === 'light'
                              ? 'bg-slate-900 text-white hover:bg-black shadow-slate-200'
                              : 'bg-[var(--nexus-accent)] text-black hover:brightness-110 shadow-[var(--nexus-accent)]/20'
                              }`}
                          >
                            {isProcessingWithdraw ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 relative">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                          className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40"
                        >
                          <Zap className="w-6 h-6 text-white" />
                        </motion.div>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 border-2 border-emerald-500 rounded-full"
                        />
                      </div>

                      <h3 className={`text-xl font-black uppercase tracking-widest mb-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Request Transmission Successful</h3>
                      <p className={`text-xs font-bold uppercase tracking-tight mb-8 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>₹{(withdrawalAmount * 0.98).toFixed(2)} INR will reach your node shortly</p>

                      <div className={`w-full max-w-sm p-4 rounded-xl border border-dashed mb-8 text-[10px] font-mono font-bold ${theme === 'light' ? 'border-slate-200 text-slate-500 bg-slate-50' : 'border-white/10 text-slate-400 bg-white/[0.01]'}`}>
                        TRANSACTION_ID: {Math.random().toString(36).substring(2, 15).toUpperCase()} <br />
                        TIMESTAMP: {new Date().toISOString()}
                      </div>

                      <button
                        onClick={() => setShowWithdrawModal(false)}
                        className={`px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${theme === 'light' ? 'bg-slate-900 text-white' : 'bg-white text-black hover:bg-slate-200'
                          }`}
                      >
                        Back to Command Center
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* OTP SECURITY MODAL */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={`w-full max-w-md p-8 rounded-[2.5rem] border shadow-2xl relative overflow-hidden ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-slate-200'}`}>

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#10B981] to-transparent" />

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center border-2 border-[#10B981]/20">
                  <ShieldAlert className="w-8 h-8 text-[#10B981]" />
                </div>

                <div>
                  <h3 className={`text-2xl font-black uppercase italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Security Verification</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#10B981] mt-1">Verification Required</p>
                </div>

                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  We sent a <strong>6-digit verification code</strong> to your current email address. Enter it below to confirm the change.
                </p>

                <div className="w-full space-y-4 pt-4">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className={`w-full text-center text-3xl tracking-[0.5em] font-black p-4 rounded-2xl outline-none border transition-all ${theme === 'dark' ? 'bg-black/40 border-white/5 text-white focus:border-[#10B981]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#10B981]'}`}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowOtpModal(false)}
                      className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] transition-colors border ${theme === 'dark' ? 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={verifyProfileOtp}
                      disabled={isVerifyingOtp || otpInput.length !== 6}
                      className="flex-[2] py-4 rounded-2xl font-black uppercase text-[10px] bg-[#10B981] text-black hover:bg-[#0fa672] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#10B981]/20"
                    >
                      {isVerifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Changes'}
                    </button>
                  </div>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar { display: none; } .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; overscroll-behavior: none; }` }} />

    </div>
  );
};

export default Dashboard;