import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
import { io } from 'socket.io-client';
import {
  LayoutDashboard, Settings, UserCircle, Trophy, HelpCircle,
  MessageSquare, Zap, ChevronRight, LogOut,
  ShieldAlert, Activity, X, Play, Loader2, IndianRupee
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Component Imports
import DashboardSummary from '../components/DashboardSummary';
import ControlCenter from '../components/ControlCenter';
import AccountsHub from '../components/AccountsHub';
import GrowthMissions from '../components/GrowthMissions';
import HelpCenter from '../components/HelpCenter';
import FeedbackStation from '../components/FeedbackStation';
import DashboardStore from './DashboardStore';
import MobileBottomNav from '../components/navigation/MobileBottomNav';

const navItems = [
  { id: 'dashboard', label: 'Nexus', icon: LayoutDashboard },
  { id: 'settings', label: 'Control', icon: Settings },
  { id: 'store', label: 'Store', icon: Zap },
  { id: 'accounts', label: 'Identity', icon: UserCircle },
  { id: 'growth', label: 'Growth', icon: Trophy },
  { id: 'help', label: 'Support', icon: HelpCircle },
  { id: 'feedback', label: 'Signal', icon: MessageSquare },
];

// --- DYNAMIC INFRASTRUCTURE (Fixes Mobile Persistence) ---
// API_BASE is now handled by the centralized axios configuration in src/api/axios.js

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('dropPayActiveSection') || 'dashboard';
  });
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dropPayTheme') || 'light';
  });

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
  const [editForm, setEditForm] = useState({ fullName: '', username: '', bio: '', streamerId: '' });
  const [alertConfig, setAlertConfig] = useState({ ttsEnabled: false, volume: 50 });
  const [partnerStickers, setPartnerStickers] = useState([]);
  const [isSavingStickers, setIsSavingStickers] = useState(false);

  // PROFILE MUTATION & OTP STATES
  const [isEditing, setIsEditing] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);
  const [isLinkingBank, setIsLinkingBank] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState(1000);

  // AVATAR UPLOAD STATES
  const fileInputRef = useRef(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [avatarBase64, setAvatarBase64] = useState(null);

  // SHARED STATES FOR CONTROL & COPY
  const [isUpdatingGoal, setIsUpdatingGoal] = useState(false);
  const [copiedType, setCopiedType] = useState(null);

  // NEW: FEEDBACK PROTOCOL STATES
  const [feedbackType, setFeedbackType] = useState('general');
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
      if (res.data.nexusTheme) {
        setNexusTheme(res.data.nexusTheme);
        localStorage.setItem('nexusTheme', res.data.nexusTheme);
      }

      // --- FORCE LIGHT THEME MIGRATION ---
      const currentThemeMode = res.data.nexusThemeMode || 'dark';
      if (currentThemeMode === 'dark') {
        setTheme('light');
        localStorage.setItem('dropPayTheme', 'light');
        // Update profile on server to persist light mode
        axios.post(`/api/user/update-profile`,
          { nexusThemeMode: 'light' },
          { headers: { Authorization: `Bearer ${token}` } }
        ).catch(e => console.error("Failed to persist light theme", e));
      } else {
        setTheme(currentThemeMode);
        localStorage.setItem('dropPayTheme', currentThemeMode);
      }
      setGoalForm({
        title: res.data.goalSettings?.title || "New Mission",
        targetAmount: res.data.goalSettings?.targetAmount || 0,
        showOnDashboard: res.data.goalSettings?.showOnDashboard ?? true,
        stylePreference: res.data.goalSettings?.stylePreference || "glass_jar"
      });
      setEditForm({
        fullName: res.data.fullName || "",
        username: res.data.username || "",
        bio: res.data.bio || "",
        streamerId: res.data.streamerId || ""
      });
      if (res.data.avatar) setProfilePreview(res.data.avatar);
      if (res.data.overlaySettings) setAlertConfig(res.data.overlaySettings);
      if (res.data.partnerPack) setPartnerStickers(res.data.partnerPack);

      const [recent, top, stats] = await Promise.all([
        axios.get(`/api/payment/recent/${res.data.streamerId}`),
        axios.get(`/api/payment/top/${res.data.streamerId}`),
        axios.get(`/api/payment/analytics/${res.data.streamerId}?range=${timeRange}`)
      ]);

      setRecentDrops(recent.data);
      setTopDonors(top.data);
      setChartData(stats.data.points);
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

      setError("Uplink Failure: Node connection lost.");
      setLoading(false);
    }
  }, [navigate, timeRange]);

  const handleLogoClick = () => {
    fetchProfileData(); // Standardized Refresh Handshake
  };

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // SOCKET LIVE DATA STREAM
  useEffect(() => {
    if (!user?.obsKey) return;

    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5001');

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

    socket.on('settings-update', (updatedSettings) => {
      setUser(prev => ({ ...prev, overlaySettings: updatedSettings }));
      setAlertConfig(updatedSettings);
    });

    return () => socket.disconnect();
  }, [user?.obsKey]);

  const updateGoalSettings = async (overrideData) => {
    setIsUpdatingGoal(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/user/update-goal', overrideData || goalForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchProfileData();
      if (!overrideData) {
        alert("Mission Deployed Successfully");
      }
    } catch (err) {
      console.error("Goal update failed", err);
    } finally {
      setIsUpdatingGoal(false);
    }
  };

  const saveAlertSettings = async (newConfig) => {
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
  };

  const saveNexusTheme = async (newTheme) => {
    try {
      // Logic to determine if the Nexus theme is Light-based or Dark-based
      const lightThemes = ['aero-light', 'alabaster-pulse', 'kawaii', 'live_kawaii'];
      const newMode = lightThemes.includes(newTheme) ? 'light' : 'dark';

      // Optimistic Update
      setNexusTheme(newTheme);
      setTheme(newMode);
      localStorage.setItem('nexusTheme', newTheme);
      localStorage.setItem('dropPayTheme', newMode);

      setUser(prev => ({ ...prev, nexusTheme: newTheme, nexusThemeMode: newMode }));

      // Update DOM immediately
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(newMode);

      window.dispatchEvent(new CustomEvent('nexus-theme-change', { detail: { theme: newTheme } }));

      const token = localStorage.getItem('token');
      await axios.post(`/api/user/update-profile`,
        { nexusTheme: newTheme, nexusThemeMode: newMode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to sync nexus theme", err);
    }
  };

  const equipAsset = async (category, assetId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/user/equip-asset',
        { category, assetId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update the right slice of user state based on category
      if (category === 'theme') {
        setNexusTheme(assetId);
        localStorage.setItem('nexusTheme', assetId);
        setUser(prev => ({ ...prev, nexusTheme: assetId }));
        window.dispatchEvent(new CustomEvent('nexus-theme-change', { detail: { theme: assetId } }));
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
      alert("Partner Pack Synchronized");
    } catch (err) {
      console.error("Failed to sync partner pack", err);
    } finally {
      setIsSavingStickers(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return alert("Image exceeds 5MB limit.");
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
        setAvatarBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfileUpdates = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = { ...editForm };
      if (avatarBase64) payload.avatar = avatarBase64;

      const res = await axios.post('/api/user/update-profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 206) {
        setShowOtpModal(true); // Failsafe, though main edit form shouldn't hit this anymore
      } else {
        await fetchProfileData();
        setIsEditing(false);
        setAvatarBase64(null);
        alert("Node Identity Synchronized");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Update Sequence Failed.");
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
      alert(err.response?.data?.msg || `Failed to verify ${type}.`);
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
      setIsEditing(false);
      setOtpInput('');
      alert("Security Clear: Identity Synchronized");
    } catch (err) {
      alert(err.response?.data?.msg || "Invalid Authorization Key.");
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
        alert("Bank linkage initialization failed.");
      }
    } catch (err) {
      alert("Failed to connect banking interface.");
    } finally {
      setIsLinkingBank(false);
    }
  };

  const handleWithdrawRequest = async (amount) => {
    setIsProcessingWithdraw(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/user/withdraw', { amount }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.msg || "Withdrawal sequence initiated.");
      setShowWithdrawModal(false);
      await fetchProfileData(); // Refresh wallet UI instantly
    } catch (err) {
      alert(err.response?.data?.msg || "Payout sequence failed.");
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
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#10B981] animate-pulse">Syncing Network</span>
    </div>
  );

  if (error) return (
    <div className="h-screen bg-[var(--nexus-bg)] flex flex-col items-center justify-center p-6 text-center">
      <ShieldAlert className="w-16 h-16 text-rose-500 mb-6 animate-bounce" />
      <h2 className="text-xl font-black uppercase italic text-[var(--nexus-text)] mb-2">{error}</h2>
      <button onClick={() => window.location.reload()} className="bg-[#10B981] text-black px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
        Restart Handshake
      </button>
    </div>
  );

  return (
    <div className={`h-screen flex flex-col md:flex-row overflow-hidden transition-all duration-500 bg-[var(--nexus-bg)]/40 text-[var(--nexus-text)] relative`}>
      {/* Background layer is now handled globally by LiveThemeEngine in App.js */}

      <div className="flex flex-col md:flex-row w-full h-full relative z-10 overflow-hidden">
        {/* SIDEBAR — Theme-Aware Control Pillar */}
        <aside className={`md:flex hidden w-20 hover:w-64 group transition-all duration-500 flex-col py-8 border-r basis-auto shrink-0 overflow-y-auto custom-scrollbar bg-[var(--nexus-sidebar-bg)] border-[var(--nexus-sidebar-border)] z-[120] ${theme === 'dark' ? 'shadow-2xl' : 'shadow-sm'}`}>
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
            <span className="font-black italic uppercase text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">Exit</span>
          </button>
        </aside>


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
                }} className={`w-full py-3 md:py-4 font-black italic uppercase text-base md:text-lg flex items-center gap-4 ${theme === 'light' ? 'text-rose-600' : 'text-rose-500'}`}><LogOut className="w-5 h-5 md:w-6 md:h-6" /> Exit Protocol</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 flex flex-col relative overflow-hidden pt-0">
          <header className="px-6 py-3 md:px-12 md:py-4 flex justify-between items-center z-40">
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-[0.3em] text-[var(--nexus-accent)] opacity-50 uppercase mb-1">Control Hub</span>
              <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none text-[var(--nexus-text)]`}>
                {activeSection} <span className="text-[var(--nexus-accent)]">NEXUS.</span>
              </h1>
            </div>
            {/* Dark mode toggle removed per user request */}
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-8 pb-24 md:pb-12">
            <AnimatePresence mode="wait">
              <motion.div key={activeSection} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }} className="max-w-7xl mx-auto w-full flex flex-col items-center transition-all duration-500">
                <div className="w-full">
                  {activeSection === 'dashboard' && (
                    <DashboardSummary {...{
                      theme, user, chartData, timeRange, setTimeRange,
                      recentDrops, topDonors, getProgressPercentage,
                      handleWithdrawRequest, isProcessingWithdraw,
                      nexusTheme, setShowWithdrawModal,
                      Play
                    }} />
                  )}
                  {activeSection === 'settings' && (
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
                      copyToClipboard={copyToClipboard}
                      copiedType={copiedType}
                      triggerTestSignal={triggerTestSignal}
                      setActiveSection={setActiveSection}
                    />
                  )}
                  {activeSection === 'accounts' && <AccountsHub theme={theme} user={user} editForm={editForm} setEditForm={setEditForm} isEditing={isEditing} setIsEditing={setIsEditing} saveProfileUpdates={saveProfileUpdates} saveContactUpdate={saveContactUpdate} profilePreview={profilePreview} handleImageChange={handleImageChange} fileInputRef={fileInputRef} handleBankLink={handleBankLink} isLinkingBank={isLinkingBank} setActiveSection={setActiveSection} copyToClipboard={copyToClipboard} copiedType={copiedType} />}
                  {activeSection === 'growth' && <GrowthMissions theme={theme} user={user} copyToClipboard={copyToClipboard} copiedType={copiedType} />}
                  {activeSection === 'help' && <HelpCenter theme={theme} user={user} />}
                  {activeSection === 'store' && <DashboardStore theme={theme} user={user} setUser={setUser} fetchProfileData={fetchProfileData} />}
                  {activeSection === 'feedback' && (
                    <FeedbackStation
                      theme={theme} user={user}
                      feedbackType={feedbackType} setFeedbackType={setFeedbackType}
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

      {/* WITHDRAWAL MODAL */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={`w-full max-w-md p-8 rounded-[2.5rem] border shadow-2xl relative overflow-hidden ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-[var(--nexus-accent)]" />
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-[var(--nexus-accent)]/10 flex items-center justify-center border-2 border-[var(--nexus-accent)]/20 shadow-inner">
                  <IndianRupee className="w-8 h-8 text-[var(--nexus-accent)]" />
                </div>
                <div>
                  <h3 className={`text-2xl font-black uppercase italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Withdraw Funds</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-accent)] mt-1">Initiating Payout Sequence</p>
                </div>
                <div className="w-full space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-[10px] uppercase font-black tracking-widest text-[var(--nexus-text-muted)]">Wallet Balance</span>
                      <span className="text-xs font-mono font-bold text-[var(--nexus-text)]">₹{user.walletBalance?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--nexus-accent)]" />
                      <input
                        type="number"
                        min={1000}
                        max={user.walletBalance}
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
                        className={`w-full text-center text-3xl font-black p-5 pl-10 rounded-2xl outline-none border transition-all ${theme === 'dark' ? 'bg-black/40 border-white/5 text-white focus:border-[var(--nexus-accent)]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[var(--nexus-accent)]'}`}
                      />
                    </div>
                    <p className={`text-[9px] font-bold italic ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Minimum withdrawal: ₹1,000</p>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-hide">
                    {[1000, 2500, 5000, user.walletBalance].map(amt => (
                      <button
                        key={amt}
                        onClick={() => setWithdrawalAmount(Math.floor(amt))}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all whitespace-nowrap ${withdrawalAmount === Math.floor(amt) ? 'bg-[var(--nexus-accent)] text-black border-[var(--nexus-accent)]' : 'bg-white/5 text-[var(--nexus-text-muted)] border-[var(--nexus-border)] hover:border-[var(--nexus-accent)]/50'}`}
                      >
                        ₹{Math.floor(amt).toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowWithdrawModal(false)}
                      className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-colors border shadow-sm ${theme === 'dark' ? 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleWithdrawRequest(withdrawalAmount)}
                      disabled={isProcessingWithdraw || withdrawalAmount < 1000 || withdrawalAmount > user.walletBalance}
                      className="flex-[2] py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-[var(--nexus-accent)] text-black hover:brightness-110 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[var(--nexus-accent)]/20"
                    >
                      {isProcessingWithdraw ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Payout'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OTP SECURITY MODAL */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={`w-full max-w-md p-8 rounded-[2.5rem] border shadow-2xl relative overflow-hidden ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-slate-200'}`}>

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#10B981] to-transparent" />

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center border-2 border-[#10B981]/20">
                  <ShieldAlert className="w-8 h-8 text-[#10B981]" />
                </div>

                <div>
                  <h3 className={`text-2xl font-black uppercase italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Security Gateway</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#10B981] mt-1">Identity Migration Engaged</p>
                </div>

                <p className={`text-sm italic ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  We detected a change to sensitive communication nodes. Please enter the 6-digit key transmitted to your current email.
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
                      Abort
                    </button>
                    <button
                      onClick={verifyProfileOtp}
                      disabled={isVerifyingOtp || otpInput.length !== 6}
                      className="flex-[2] py-4 rounded-2xl font-black uppercase text-[10px] bg-[#10B981] text-black hover:bg-[#0fa672] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#10B981]/20"
                    >
                      {isVerifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authorize Override'}
                    </button>
                  </div>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }` }} />

      {/* MOBILE BOTTOM NAV — hidden on lg+ */}
      <MobileBottomNav
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        user={user}
        theme={theme}
        onLogout={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('nexusTheme');
          localStorage.removeItem('dropPayTheme');
          navigate('/login');
        }}
      />
    </div >
  );
};

export default Dashboard;