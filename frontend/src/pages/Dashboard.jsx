import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
import { useLiveSocket } from '../hooks/useLiveSocket';
import {
  LayoutDashboard, Settings, Trophy, HelpCircle,
  MessageSquare, Zap,
  ShieldAlert, Activity, X, Play, Loader2, IndianRupee, User,
  ShoppingBag, Clock, ShieldCheck, ArrowUpRight,
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
import ProfileDropdown from '../components/dashboard/ProfileDropdown';
const navItems = [
  { id: 'summary', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'control', icon: Settings, label: 'Settings' },
  { id: 'store', icon: ShoppingBag, label: 'Store' },
  { id: 'growth', icon: Trophy, label: 'Growth' },
  { id: 'help', icon: HelpCircle, label: 'Help' },
  { id: 'feedback', icon: MessageSquare, label: 'Feedback' },
];

// --- DYNAMIC INFRASTRUCTURE (Fixes Mobile Persistence) ---
// API_BASE is now handled by the centralized axios configuration in src/api/axios.js

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('dropeActiveSection') || 'summary';
  });
  const [user, setUser] = useState(null);
  const [isMobileMenuExpanded, setIsMobileMenuExpanded] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);


  const { theme, setTheme } = useTheme();

  const [nexusTheme, setNexusTheme] = useState(() => {
    return localStorage.getItem('nexusTheme') || 'void';
  });

  useEffect(() => {
    localStorage.setItem('dropeActiveSection', activeSection);
  }, [activeSection]);

  useEffect(() => {
    localStorage.setItem('dropeTheme', theme);
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

  // --- Scroll Lock Protocol ---

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

      // --- ADMIN EXTRACTION: Officials must stay in the Admin Portal ---
      if (res.data.role === 'admin') {
        navigate('/admin/secure-portal');
        return;
      }

      // --- SUBSCRIPTION GUARD: Must be ACTIVE to access Nexus ---
      if (res.data.subscription?.status !== 'active') {
        navigate('/subscription');
        return;
      }

      if (res.data.nexusTheme) {
        syncTheme(res.data);
      }

      // --- REMOVED: FORCED DARK MODE MIGRATION ---
      // We are now using a High-Contrast Cream & Black Rebrand
      syncTheme(res.data);
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
  useLiveSocket({
    user,
    setUser,
    setRecentDrops,
    setTopDonors,
    setChartData,
    setGoalForm,
    setAlertConfig,
    fetchProfileData
  });

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
    <div className="h-screen bg-[#f5f4e2] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background Elements */}
      <div className="absolute inset-0 blueprint-grid opacity-[0.03]" />
      <div className="scanning-line opacity-10" />
      <div className="loader-scanline" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="mb-8 relative">
           <div className="w-16 h-16 border-2 border-black/5 rounded-full flex items-center justify-center">
             <Loader2 className="w-8 h-8 text-[#111111] animate-spin opacity-20" />
           </div>
           <Activity className="w-6 h-6 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#111111] animate-pulse">
            Synchronizing_Nexus_Dashboard
          </span>
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.div 
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                className="w-1 h-1 bg-emerald-500"
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Technical Metadata */}
      <div className="absolute bottom-10 left-10 text-[8px] font-black uppercase tracking-[0.4em] text-black/20">
        DASHBOARD_LIVE_RELAY_v4
      </div>
      <div className="absolute top-10 right-10 text-[8px] font-black uppercase tracking-[0.4em] text-black/20">
        SECURE_UPLINK_ESTABLISHED
      </div>
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
    <div className={`h-screen flex flex-col overflow-hidden transition-all duration-500 bg-[#f5f4e2] text-[#111111] relative`}>
      {/* Background layer is now handled globally by LiveThemeEngine in App.js */}

      <div className="flex flex-col w-full h-full relative z-10 overflow-hidden">


        {/* PROTOCOL CONTROLS OVERLAY (Shared Mobile/Desktop) */}
        <MobileBottomNav
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onLogout={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('nexusTheme');
            localStorage.removeItem('dropeTheme');
            navigate('/login');
          }}
          user={user}
          theme={theme}
          isMenuExpanded={isMobileMenuExpanded}
          setIsMenuExpanded={setIsMobileMenuExpanded}
        />

        <AnimatePresence>
        </AnimatePresence>

        <main className="flex-1 flex flex-col relative overflow-hidden pt-0 bg-transparent">
          <header className="px-6 py-2 md:px-12 md:py-2.5 flex justify-between items-center z-40 bg-white/40 backdrop-blur-3xl border-b border-black/5">
            <div className="flex items-center gap-4 md:gap-8">
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={handleLogoClick}
              >
                <span className="text-xl font-black tracking-tight" style={{ fontFamily: 'Georgia, serif', color: '#111111' }}>drope.in</span>
              </div>

              <div className="h-4 w-px bg-black/10 hidden md:block" />

              <nav className="hidden md:flex items-center gap-6">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`text-[10px] font-black italic uppercase tracking-widest transition-all ${activeSection === item.id
                      ? 'text-[#111111] underline underline-offset-8 decoration-2'
                      : 'text-black/40 hover:text-black/60'
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
                


              </nav>
            </div>

              {/* NEW PREMIUM PROFILE HUB TRIGGER */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-8 h-8 rounded-xl bg-white border border-black/5 shadow-sm flex items-center justify-center overflow-hidden group"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-black/40 group-hover:text-black transition-colors" />
                  )}
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <ProfileDropdown 
                      user={user} 
                      setIsProfileOpen={setIsProfileOpen} 
                      setActiveSection={setActiveSection} 
                    />
                  )}
                </AnimatePresence>
              </div>
          </header>

          <div className={`flex-1 overflow-y-auto custom-scrollbar px-4 md:px-8 pb-32 md:pb-12 transition-all duration-300`}>
            
            {/* --- NEW: NEURAL TRIAL / EXPIRY HUD --- */}
            {user?.subscription?.status === 'active' && (
              <div className="mb-6 mt-4">
                {user.subscription.isTrial ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between group overflow-hidden relative shadow-sm">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all duration-1000" />
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-white/60 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                        <Clock className="w-5 h-5 text-emerald-600 animate-pulse" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 opacity-80 mb-0.5 flex items-center gap-1.5">
                          <Zap className="w-2 h-2 fill-emerald-600" /> Active Free Trial Protocol
                        </span>
                        <h3 className="text-sm font-black italic uppercase tracking-tighter text-[#111111] flex items-center gap-2">
                          {Math.max(0, Math.ceil(user.subscription.trialRemainingMs / (1000 * 60 * 60 * 24)))} Days Remaining
                          <div className="h-1 w-24 bg-black/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(user.subscription.trialRemainingMs / (7 * 24 * 60 * 60 * 1000)) * 100}%` }}
                              className="h-full bg-emerald-500"
                            />
                          </div>
                        </h3>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate('/subscription')}
                      className="relative z-10 hidden sm:flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                    >
                      Unlock Legend Tier <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : user.subscription.expiryDate && (
                  <div className="bg-white/40 border border-black/5 p-4 rounded-2xl flex items-center justify-between group relative overflow-hidden">
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center shadow-sm">
                        <ShieldCheck className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#111111]/40 mb-0.5">
                          Subscription Active Until
                        </span>
                        <h3 className="text-sm font-black italic uppercase tracking-tighter text-[#111111]">
                          {new Date(user.subscription.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </h3>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-6 pr-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-20">Current Tier</span>
                            <span className="text-[10px] font-black italic uppercase tracking-tighter text-indigo-500">{user.subscription.plan}</span>
                        </div>
                    </div>
                  </div>
                )}
              </div>
            )}

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
                        Back to Admin Panel
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