import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../api/axios';
import { useLiveSocket } from '../../hooks/useLiveSocket';
import {
  Zap,
  ShieldAlert, X, Play, Loader2, IndianRupee,
  Clock, ShieldCheck, ArrowUpRight,
  History, AlertCircle, Trash2, ArrowRight, ArrowLeft
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

// Component Imports
import { syncTheme } from '../../api/themeSync';
import { useTheme } from '../../context/ThemeContext';
import DashboardSummary from '../../components/dashboard/Summary';
import ControlCenter from '../../components/dashboard/ControlCenter';
import AccountsHub from '../../components/dashboard/AccountsHub';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar';
import GrowthMissions from '../../components/dashboard/GrowthMissions';
import HelpCenter from '../../components/dashboard/HelpCenter';
import FeedbackStation from '../../components/dashboard/FeedbackStation';
import DashboardStore from './Store';
import { MobileBottomNav } from '../../components/navigation/MobileBottomNav';
import { MetricsPulse } from '../../components/dashboard/Metrics';
import { EarningsIntel } from '../../components/dashboard/Earnings';
import { DashboardPageContainer } from '../../components/dashboard/DashboardPageContainer';
import { SettingsProtocol } from '../../components/dashboard/Setting';


// --- DYNAMIC INFRASTRUCTURE (Fixes Mobile Persistence) ---
// API_BASE is now handled by the centralized axios configuration in src/api/axios.js

// ─── SUBSCRIPTION HARD-LOCK OVERLAY ─────────────────────────
const SubscriptionLockOverlay = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 z-[1000] flex items-center justify-center p-6"
  >
    {/* Blurry Backdrop Filter */}
    <div className="absolute inset-0 bg-[#0a0a0b]/80 backdrop-blur-3xl" />
    <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />
    <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
    
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      className="relative z-50 max-w-lg w-full bg-[#111111]/80 border border-white/10 p-10 text-center rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] backdrop-blur_md"
    >
      <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-rose-500/20">
        <ShieldAlert className="w-10 h-10 text-rose-500 animate-pulse" />
      </div>

      <h2 className="text-4xl font-black text-white italic tracking-tighter mb-4 uppercase" style={{ fontFamily: 'Georgia, serif' }}>
        Access Suspended
      </h2>
      
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-loose mb-10 max-w-sm mx-auto">
        Your creator node has been de-authenticated from the high-throughput network. Trial access has expired or the subscription handshake failed.
      </p>

      <div className="flex flex-col gap-4">
        <button 
           onClick={() => window.location.href = '/subscription'}
           className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-[11px] hover:bg-emerald-500 transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] shadow-[10px_10px_0px_rgba(255,255,255,0.1)]"
        >
          Secure Access Key
        </button>
        <button 
           onClick={() => window.location.href = '/login'}
           className="text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors py-4"
        >
          Disconnect Session
        </button>
      </div>

      {/* Security Telemetry */}
      <div className="absolute bottom-6 left-0 w-full flex justify-center gap-6 opacity-20">
        <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-rose-500 rounded-full" />
            <span className="text-[8px] font-mono tracking-widest text-white">LOCKED</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-slate-500 rounded-full" />
            <span className="text-[8px] font-mono tracking-widest text-white">OFFLINE</span>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathMap = {
    '/dashboard': 'summary',
    '/dashboard/metrics': 'metrics',
    '/dashboard/controlcenter': 'control',
    '/dashboard/control': 'control',
    '/dashboard/store': 'store',
    '/dashboard/earnings': 'earnings',
    '/dashboard/growth': 'growth',
    '/dashboard/help': 'help',
    '/dashboard/feedback': 'feedback',
    '/dashboard/profile': 'profile',
    '/dashboard/settings': 'settings'
  };
  const currentPath = location.pathname.toLowerCase().replace(/\/$/, "");
  const activeSection = pathMap[currentPath] || 'summary';
  
  const setActiveSection = (id) => {
    const routeId = id === 'summary' ? '' : id;
    navigate('/dashboard' + (routeId ? `/${routeId}` : ''));
  };

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

  // Removed duplicate theme DOM manipulation. Let ThemeContext handle this.

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

  // SHARED STATES FOR CONTROL & COPY
  const [isUpdatingGoal, setIsUpdatingGoal] = useState(false);
  const [copiedType, setCopiedType] = useState(null);
  const [isCancellingId, setIsCancellingId] = useState(null);

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

      if (res.data.role === 'admin') {
        navigate('/admin/secure-portal');
        return;
      }

      if (res.data.nexusTheme) {
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
        setLoading(false);
        return;
      }
      if (err.response?.status === 401 || err.response?.status === 404) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      setError("Connection Error: Service unreachable.");
      setLoading(false);
    }
  }, [navigate, timeRange]);

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
    fetchProfileData();
  };

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  useEffect(() => {
    if (user?.streamerId) {
      fetchAnalyticsData();
    }
  }, [timeRange, fetchAnalyticsData, user?.streamerId]);

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

  const saveContactUpdate = async (type, value) => {
    try {
      const token = localStorage.getItem('token');
      const payload = { [type]: value };
      const res = await axios.post('/api/user/update-profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 206) {
        setShowOtpModal(true);
        return true;
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
      setWithdrawalStep(2);
      await fetchProfileData();
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


  // MissionGate in App.js already verified auth and showed the BootSequence loader.
  // This guard is kept as a silent null to prevent a flash of broken UI during
  // the brief moment between mount and first data fetch — no second loader needed.
  if (loading && !user) return null;

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
    <div className={`h-screen flex flex-col overflow-hidden transition-all duration-500 relative`} style={{ background: 'var(--nexus-bg)', color: 'var(--nexus-text)' }}>
      <div className="flex flex-col w-full h-full relative z-10 overflow-hidden">
        
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

        <main className="flex-1 flex flex-col relative overflow-hidden pt-0 bg-transparent">
          <DashboardNavbar 
            user={user} 
            isProfileOpen={isProfileOpen} 
            setIsProfileOpen={setIsProfileOpen} 
            setActiveSection={setActiveSection} 
            handleLogoClick={handleLogoClick} 
          />

          <div className="flex-1 overflow-y-auto custom-scrollbar pt-[70px] pb-24 md:pb-12 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full min-h-full flex flex-col">
              
              <DashboardPageContainer noPadding className="mt-4">
                <div className="p-4 space-y-4">
                  {/* --- NEURAL TRIAL / EXPIRY HUD --- */}
                  {user?.subscription?.status === 'active' && ['earnings', 'profile'].includes(activeSection) && (
                    <div className="mb-2">
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
                        <div className="p-4 rounded-2xl flex items-center justify-between group relative overflow-hidden border" style={{ background: 'var(--nexus-panel)', borderColor: 'var(--nexus-border)' }}>
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border" style={{ background: 'var(--nexus-panel)', borderColor: 'var(--nexus-border)' }}>
                              <ShieldCheck className="w-5 h-5 text-indigo-500" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: 'var(--nexus-text-muted)' }}>
                                Subscription Active Until
                              </span>
                              <h3 className="text-sm font-black italic uppercase tracking-tighter" style={{ color: 'var(--nexus-text)' }}>
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

                  {/* --- ACTIVE SECTION RENDER --- */}
                  <AnimatePresence mode="wait">
                    <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="w-full">
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
                        {activeSection === 'metrics' && <MetricsPulse />}
                        {activeSection === 'earnings' && <EarningsIntel />}
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
                        {activeSection === 'settings' && <SettingsProtocol theme={theme} user={user} />}
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
              </DashboardPageContainer>
            </div>
          </div>
        </main>

        {/* WITHDRAWAL MODAL */}
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
                className={`w-full max-w-4xl max-h-full md:max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col ${theme === 'light' ? 'bg-white' : 'bg-[#121212] border border-white/5'}`}
              >
                <div className={`p-4 md:p-6 pb-0 ${theme === 'light' ? 'bg-slate-50/50' : 'bg-white/[0.02]'}`}>
                  <div className="flex items-start md:items-center justify-between mb-4 md:mb-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                      <span className={`text-[10px] md:text-sm font-bold uppercase tracking-widest md:normal-case md:tracking-normal ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Current Balance:</span>
                      <span className={`text-lg md:text-xl font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                        ₹{(Number(user.walletBalance) || 0).toLocaleString('en-IN')} <span className="text-[10px] font-bold opacity-60">INR</span>
                      </span>
                    </div>
                    <button onClick={() => setShowWithdrawModal(false)} className={`p-2 rounded-full transition-colors ${theme === 'light' ? 'hover:bg-slate-200 text-slate-400' : 'hover:bg-white/10 text-slate-500'}`}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 md:gap-8 border-b border-slate-200 dark:border-white/5">
                    {['Withdraw', 'History'].map((tab) => {
                      const isActive = activeModalTab === tab;
                      return (
                        <button key={tab} onClick={() => setActiveModalTab(tab)} className={`pb-4 text-[10px] md:text-xs font-black uppercase tracking-widest relative transition-all flex items-center gap-2 ${isActive ? (theme === 'light' ? 'text-slate-900' : 'text-white') : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                          {tab === 'History' && <History className="w-3.5 h-3.5" />}
                          {tab}
                          {isActive && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--nexus-accent)]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 md:p-8">
                  <AnimatePresence mode="wait">
                    {activeModalTab === 'History' ? (
                      <motion.div key="history" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Recent Node Disbursals</h4>
                          <span className="text-[10px] font-mono text-slate-500 font-bold">NODE LOGS: 50</span>
                        </div>
                        {isFetchingWithdrawals ? (
                          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--nexus-accent)]" /></div>
                        ) : withdrawals.length === 0 ? (
                          <div className={`py-20 text-center rounded-2xl border border-dashed ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/10'}`}>
                            <History className="w-8 h-8 mx-auto mb-4 opacity-20" />
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No Recent Activity Found</p>
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {withdrawals.map((wd) => {
                              const amt = Math.abs(wd.amount);
                              const statusColors = { pending: 'amber', processing: 'blue', completed: 'emerald', cancelled: 'red' };
                              const color = statusColors[wd.status] || 'slate';
                              return (
                                <div key={wd._id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${theme === 'light' ? 'bg-slate-50 border-slate-100 hover:border-slate-200' : 'bg-white/[0.03] border-white/5 hover:border-white/10'}`}>
                                  <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'light' ? 'bg-white shadow-sm' : 'bg-white/5'}`}><IndianRupee className="w-4 h-4 text-[var(--nexus-accent)]" /></div>
                                    <div>
                                      <h5 className={`text-xs font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Bank Withdrawal</h5>
                                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{new Date(wd.createdAt).toLocaleString()}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="text-right">
                                      <h5 className={`text-xs font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>₹{amt.toLocaleString()}</h5>
                                      <span className={`px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest border-${color}-500/30 text-${color}-500 bg-${color}-500/5`}>{wd.status}</span>
                                    </div>
                                    {wd.status === 'pending' && (
                                      <button onClick={() => handleCancelWithdrawal(wd._id)} className="p-2 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all">
                                        <Trash2 className="w-3.5 h-3.5" />
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
                      <motion.div key="step0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        <div className="space-y-8">
                          <h4 className={`text-sm font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Bank Transfer</h4>
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Withdrawal Amount</label>
                              <div className="relative group">
                                <input type="number" value={withdrawalAmount} onChange={(e) => setWithdrawalAmount(Number(e.target.value))} className={`w-full p-4 md:p-6 pr-24 rounded-2xl border text-xl md:text-2xl font-black transition-all outline-none ${theme === 'light' ? 'bg-slate-50 border-slate-200 focus:border-slate-400 text-slate-900' : 'bg-white/5 border-white/10 focus:border-white/20 text-white'}`} placeholder="1000" />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                  <button onClick={() => setWithdrawalAmount(Number(user.walletBalance) || 0)} className="text-[10px] font-black uppercase tracking-widest text-[var(--nexus-accent)]">MAX</button>
                                  <span className="text-xs font-bold text-slate-500">INR</span>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-xs font-bold"><span className="text-slate-500">Fee (2%)</span><span className={theme === 'light' ? 'text-slate-900' : 'text-white'}>₹{(withdrawalAmount * 0.02).toFixed(2)}</span></div>
                              <div className="flex justify-between items-center text-xs font-bold"><span className="text-slate-500">You Get</span><span className="text-[var(--nexus-accent)] font-black text-sm">₹{(withdrawalAmount * 0.98).toFixed(2)}</span></div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-8">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Payment Details</span>
                          {user.payoutSettings?.bankDetailsLinked ? (
                            <div className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${theme === 'light' ? 'bg-slate-50 border-pink-100' : 'bg-white/[0.03] border-pink-500/30'}`}>
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 p-[1px]"><div className={`w-full h-full rounded-2xl flex items-center justify-center ${theme === 'light' ? 'bg-white' : 'bg-[#1a1a1a]'}`}><div className="w-4 h-4 rounded-full bg-[var(--nexus-accent)] shadow-[0_0_10px_var(--nexus-accent)]" /></div></div>
                                <div><h5 className={`text-sm font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Primary Account</h5><div className="flex gap-4 text-[10px] font-mono font-bold text-slate-500"><span>IFSC: {user.bankDetails?.ifsc}</span><span>ACC: {user.bankDetails?.masked_account}</span></div></div>
                              </div>
                              <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500 cursor-pointer" />
                            </div>
                          ) : (
                            <div className="p-6 rounded-2xl border border-dashed text-center space-y-3"><AlertCircle className="w-8 h-8 mx-auto opacity-50" /><p className="text-[9px] font-bold text-slate-500">No Bank Linked</p><button onClick={() => { setShowWithdrawModal(false); setActiveSection('profile'); }} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">Link Now</button></div>
                          )}
                          <button disabled={!user.payoutSettings?.bankDetailsLinked || withdrawalAmount < 1000 || withdrawalAmount > (Number(user.walletBalance) || 0)} onClick={() => setWithdrawalStep(1)} className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${theme === 'light' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-[var(--nexus-accent)] text-black shadow-lg shadow-[var(--nexus-accent)]/20'}`}>Withdraw <ArrowRight className="w-4 h-4" /></button>
                        </div>
                      </motion.div>
                    ) : withdrawalStep === 1 ? (
                      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                         <div className="space-y-8">
                          <button onClick={() => setWithdrawalStep(0)} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                          <h4 className={`text-sm font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Summary</h4>
                          <div className={`p-6 rounded-2xl border ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/[0.02] border-white/5'}`}>
                            {[{ l: 'You Receive', v: `₹${(withdrawalAmount * 0.98).toFixed(2)}`, h: true }, { l: 'Fee', v: `₹${(withdrawalAmount * 0.02).toFixed(2)}` }, { l: 'Name', v: user.bankDetails?.account_holder_name }, { l: 'IFSC', v: user.bankDetails?.ifsc }, { l: 'Acc', v: user.bankDetails?.masked_account }].map((item, i) => (
                              <div key={i} className="flex justify-between items-center py-1"><span className="text-[10px] font-bold text-slate-500">{item.l}</span><span className={`text-[11px] font-black ${item.h ? 'text-[var(--nexus-accent)]' : (theme === 'light' ? 'text-slate-900' : 'text-white')}`}>{item.v}</span></div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-8">
                          <h4 className={`text-sm font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>MFA Verification</h4>
                          <div className="space-y-6">
                            <p className="text-[10px] font-medium text-slate-500">Sent code to {user.phone ? `${user.phone.slice(0, 4)} XXX ${user.phone.slice(-2)}` : 'XXXX'}.</p>
                            <input type="text" value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} className={`w-full p-4 rounded-xl border text-xl font-black tracking-[1em] text-center ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10 text-white'}`} placeholder="000000" maxLength={6} />
                          </div>
                          <div className="flex gap-4">
                            <button onClick={() => setShowWithdrawModal(false)} className={`flex-1 py-4 rounded-xl font-black uppercase text-[10px] ${theme === 'light' ? 'bg-slate-100 text-slate-500' : 'bg-white/5 text-slate-400'}`}>Cancel</button>
                            <button onClick={() => handleWithdrawRequest(withdrawalAmount)} disabled={isProcessingWithdraw || mfaCode.length < 6} className={`flex-[2] py-4 rounded-xl font-black uppercase text-[10px] ${theme === 'light' ? 'bg-slate-900 text-white shadow-slate-200' : 'bg-[var(--nexus-accent)] text-black shadow-[var(--nexus-accent)]/20'}`}>{isProcessingWithdraw ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}</button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="step2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 relative"><div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg"><Zap className="w-6 h-6 text-white" /></div></div>
                        <h3 className={`text-xl font-black uppercase tracking-widest mb-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Success</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-8">₹{(withdrawalAmount * 0.98).toFixed(2)} INR Transmitted.</p>
                        <button onClick={() => setShowWithdrawModal(false)} className={`px-12 py-4 rounded-2xl font-black uppercase text-xs ${theme === 'light' ? 'bg-slate-900 text-white' : 'bg-white text-black'}`}>Back to Dashboard</button>
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
                  <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center border-2 border-[#10B981]/20"><ShieldAlert className="w-8 h-8 text-[#10B981]" /></div>
                  <div><h3 className={`text-2xl font-black uppercase italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Verification</h3><p className="text-[10px] font-black uppercase tracking-widest text-[#10B981] mt-1">Code Required</p></div>
                  <input type="text" maxLength={6} value={otpInput} onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))} placeholder="000000" className={`w-full text-center text-3xl tracking-[0.5em] font-black p-4 rounded-2xl outline-none border transition-all ${theme === 'dark' ? 'bg-black/40 border-white/5 text-white focus:border-[#10B981]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#10B981]'}`} />
                  <div className="flex gap-3 w-full">
                    <button onClick={() => setShowOtpModal(false)} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] border ${theme === 'dark' ? 'bg-white/5 text-slate-300 border-white/5' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>Cancel</button>
                    <button onClick={verifyProfileOtp} disabled={isVerifyingOtp || otpInput.length !== 6} className="flex-[2] py-4 rounded-2xl font-black uppercase text-[10px] bg-[#10B981] text-black hover:bg-[#0fa672] shadow-lg shadow-[#10B981]/20">{isVerifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STYLE ENFORCEMENT */}
        <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar { display: none; } .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; overscroll-behavior: none; }` }} />

        {/* SUBSCRIPTION LOCK */}
        {user?.subscription?.status !== 'active' && <SubscriptionLockOverlay />}

      </div>
    </div>
  );
};

export default Dashboard;