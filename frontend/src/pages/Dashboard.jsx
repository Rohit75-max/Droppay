import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player'; // Surgical Import for 3D Previews
import { 
  LayoutDashboard, Wallet, Copy, 
  CheckCircle, ShieldAlert, LogOut, Settings, 
  UserCircle, HelpCircle, Zap, ChevronRight,
  Play, Loader2, Trophy, TrendingUp, Target, RefreshCw,
  MessageSquare, BarChart3, Save, Edit3, User, Hash, Phone, Mail as MailIcon,
  CreditCard, Plus, BadgeCheck, BellRing, X, Landmark, ShieldCheck, Search,
  Star, Monitor, Send, UploadCloud, Users, Gift, Award, Globe, Settings2,
  Sun, Moon, Wand2, Volume2, Type, Image as ImageIcon, Sparkles, Layers, Sliders, Crown,
  Trash2, Info, Lock, Car, Rocket, Flame // Surgical Import for Runner Protocol
} from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [recentDrops, setRecentDrops] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [copiedType, setCopiedType] = useState(null); 
  const [error, setError] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // --- Theme Engine (Default Dark) ---
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  // --- NEW: Partner Pack Protocol State ---
  const [partnerStickers, setPartnerStickers] = useState([]);
  const [isSavingStickers, setIsSavingStickers] = useState(false);

  // --- Alert Studio State ---
  const [activeAlertTier, setActiveAlertTier] = useState('standard');
  const [alertConfig, setAlertConfig] = useState({
    ttsEnabled: false,
    ttsMinAmount: 500,
    ttsVoice: 'female',
    layout: 'icon-left',
    font: 'font-sans',
    animation: 'slide-left',
    duration: 5,
    media: '💎' // Default media
  });
  
  const [previewKey, setPreviewKey] = useState(0); // Forces animation replay
  const [isSavingAlerts, setIsSavingAlerts] = useState(false);

  // --- Live Notification State ---
  const [notification, setNotification] = useState(null);

  // --- Analytics States ---
  const [timeRange, setTimeRange] = useState('7D'); 
  const [chartData, setChartData] = useState([40, 70, 45, 90, 65, 85, 100]); // Demo data

  // --- Account Edit State ---
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: "", phone: "", streamerId: "", bio: "" });
  const [profilePreview, setProfilePreview] = useState(null);

  // --- Bank & Settlement State ---
  const [isLinkingBank, setIsLinkingBank] = useState(false);
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);

  const [isUpdatingGoal, setIsUpdatingGoal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  // --- SURGICALLY UPDATED GOAL FORM STATE ---
  const [goalForm, setGoalForm] = useState({ 
    title: "", 
    targetAmount: 0,
    runnerType: "star",
    customRunnerUrl: ""
  });

  // --- Feedback Logic States ---
  const [feedbackType, setFeedbackType] = useState('feature'); 
  const [rating, setRating] = useState(5);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const stickerMap = { zap: '⚡', fire: '🔥', heart: '💖', crown: '👑', rocket: '🚀' };

  useEffect(() => {
    if (user) console.log("🔍 DEBUG - User Tier is:", user.tier);
  }, [user]);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");
        const res = await axios.get('http://localhost:5001/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        
        // Load Partner Pack data surgically
        setPartnerStickers(res.data.partnerPack || []);

        setEditForm({ 
          username: res.data.username, 
          phone: res.data.phone || "", 
          streamerId: res.data.streamerId,
          bio: res.data.bio || "" 
        });

        // Load Goal Settings Surgically (including Runner Protocol)
        setGoalForm({
          title: res.data.goalSettings?.title || "New Stream Equipment",
          targetAmount: res.data.goalSettings?.targetAmount || 5000,
          runnerType: res.data.goalSettings?.runnerType || "star",
          customRunnerUrl: res.data.goalSettings?.customRunnerUrl || ""
        });

        // Load saved Alert Studio settings
        if (res.data.overlaySettings) {
          setAlertConfig(prev => ({
            ...prev,
            ttsEnabled: res.data.overlaySettings.ttsEnabled ?? prev.ttsEnabled,
            ttsMinAmount: res.data.overlaySettings.ttsMinAmount ?? prev.ttsMinAmount,
            ttsVoice: res.data.overlaySettings.ttsVoice || prev.ttsVoice,
            layout: res.data.overlaySettings.layout || prev.layout,
            font: res.data.overlaySettings.fontFamily || prev.font,
            animation: res.data.overlaySettings.animationType || prev.animation,
            duration: res.data.overlaySettings.alertDuration || prev.duration
          }));
        }

        fetchAnalytics(res.data.streamerId);
        fetchChartData(res.data.streamerId, timeRange);
      } catch (err) { setError(true); }
    };
    fetchProfile();
  }, [timeRange]);

  // --- NEW: PARTNER STICKER PROTOCOL LOGIC ---
  const addStickerSlot = () => {
    if (partnerStickers.length >= 10) return alert("Protocol Restricted: Max 10 custom stickers allowed.");
    setPartnerStickers([...partnerStickers, { name: '', lottieUrl: '', minAmount: 100, isActive: true }]);
  };

  const updateStickerSlot = (index, field, value) => {
    const updated = [...partnerStickers];
    updated[index][field] = value;
    setPartnerStickers(updated);
  };

  const removeStickerSlot = (index) => {
    setPartnerStickers(partnerStickers.filter((_, i) => i !== index));
  };

  const savePartnerPack = async () => {
    setIsSavingStickers(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5001/api/user/update-stickers', partnerStickers, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({ ...user, partnerPack: res.data });
      alert("Partner Protocol Updated: Custom Stickers are now live on your node!");
    } catch (err) {
      alert(err.response?.data?.msg || "Update failed.");
    } finally { setIsSavingStickers(false); }
  };

  const saveAlertSettings = async () => {
    setIsSavingAlerts(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ttsEnabled: alertConfig.ttsEnabled,
        ttsMinAmount: alertConfig.ttsMinAmount,
        ttsVoice: alertConfig.ttsVoice,
        layout: alertConfig.layout,
        fontFamily: alertConfig.font,
        animationType: alertConfig.animation,
        alertDuration: alertConfig.duration,
      };

      await axios.put('http://localhost:5001/api/user/update-overlay', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Alert Studio configuration saved successfully! OBS will now use these settings.");
    } catch (err) {
      console.error("Failed to save alert settings", err);
      alert("Failed to save configuration. Please try again.");
    } finally {
      setIsSavingAlerts(false);
    }
  };

  useEffect(() => {
    if (recentDrops.length > 0 && user) {
      const latestDrop = recentDrops[0];
      const dropTime = new Date(latestDrop.createdAt).getTime();
      const now = new Date().getTime();
      
      if (now - dropTime < 10000) {
        setNotification(latestDrop);
        const timer = setTimeout(() => setNotification(null), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [recentDrops, user]);

  const fetchChartData = async (id, range) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/payment/analytics/${id}?range=${range}`);
      if (res.data && Array.isArray(res.data.points)) {
        setChartData(res.data.points);
      }
    } catch (err) { console.error("Chart fetch failed - using mock"); }
  };

  const fetchAnalytics = async (id) => {
    try {
      const [recent, top] = await Promise.all([
        axios.get(`http://localhost:5001/api/payment/recent/${id}`),
        axios.get(`http://localhost:5001/api/payment/top/${id}`)
      ]);
      setRecentDrops(recent.data);
      setTopDonors(top.data);
    } catch (err) { console.error("Analytics fetch failed"); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const updateGoalSettings = async (e) => {
    e.preventDefault();
    setIsUpdatingGoal(true);
    try {
      const token = localStorage.getItem('token');
      // Updated payload to include runner protocols
      const payload = {
        title: goalForm.title,
        targetAmount: Number(goalForm.targetAmount),
        runnerType: goalForm.runnerType,
        customRunnerUrl: goalForm.customRunnerUrl
      };
      await axios.put('http://localhost:5001/api/user/update-goal', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Goal settings updated!");
    } catch (err) { alert("Update failed."); }
    finally { setIsUpdatingGoal(false); }
  };

  const resetGoalProgress = async () => {
    if (!window.confirm("Reset progress to ₹0?")) return;
    setIsResetting(true); 
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5001/api/user/update-goal', { ...goalForm, resetProgress: true }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload(); 
    } catch (err) { alert("Reset failed."); setIsResetting(false); }
  };

  const triggerTestDrop = async (e) => {
    if (e) e.stopPropagation(); 
    setIsTesting(true);
    try {
      await axios.post('http://localhost:5001/api/payment/test-drop', {
        streamerId: user.streamerId,
        donorName: "Test Supporter",
        amount: 500,
        message: "Test Drop Successful! 🚀",
        sticker: "rocket"
      });
      fetchAnalytics(user.streamerId);
    } catch (err) { alert("Test failed."); } 
    finally { setIsTesting(false); }
  };

  const handleBankLink = async () => {
    setIsLinkingBank(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5001/api/payment/create-payout-account', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.onboardingUrl) {
        window.open(res.data.onboardingUrl, '_blank'); 
      } else {
        alert("Verification portal is currently being synchronized. Please try again in 60 seconds.");
      }
    } catch (err) {
      alert("Payout service temporarily unavailable.");
    } finally {
      setIsLinkingBank(false);
    }
  };

  const handleWithdrawRequest = async () => {
    if (user.walletBalance < 100) return alert("Minimum withdrawal is ₹100");
    setIsProcessingWithdraw(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/payment/withdraw', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Withdrawal request sent to bank!");
    } catch (err) { alert("Request failed."); }
    finally { setIsProcessingWithdraw(false); }
  };

  const copyToClipboard = (e, text, type) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const getProgressPercentage = () => {
    if (!user?.goalSettings?.targetAmount) return 0;
    return Math.min((user.goalSettings.currentProgress / user.goalSettings.targetAmount) * 100, 100);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePreview(URL.createObjectURL(file));
  };

  const saveProfileUpdates = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5001/api/user/update-profile', editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      alert("Identity Hub successfully updated!");
    } catch (err) { alert("Failed to update profile."); }
  };

  // Eligibility Check Surgical Injection
  const isTierEligible = user?.tier === 'pro' || user?.tier === 'legend';

  if (error) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-6 text-center font-sans">
      <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
      <button onClick={() => navigate('/login')} className="mt-6 bg-indigo-600 px-8 py-3 rounded-2xl font-bold font-sans">Return to Login</button>
    </div>
  );

  if (!user) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-slate-500 font-black animate-pulse font-sans uppercase tracking-widest">Syncing Hub...</div>;


  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'settings', label: 'Control Center', icon: Settings },
    { id: 'accounts', label: 'Accounts', icon: UserCircle },
    { id: 'growth', label: 'Growth Missions', icon: Trophy },
    { id: 'help', label: 'Help Center', icon: HelpCircle },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  ];

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-[#050505] text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans selection:bg-indigo-500/30 overflow-x-hidden relative`}>
      
      {/* LIVE NOTIFICATION TOAST */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={`fixed top-8 right-8 z-[200] w-80 backdrop-blur-xl border rounded-3xl p-5 shadow-2xl flex items-center gap-4 transition-colors ${theme === 'dark' ? 'bg-[#111]/90 border-indigo-500/30' : 'bg-white/90 border-slate-200'}`}
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40">
              <BellRing className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-0.5">New Drop Received</p>
              <p className={`text-sm font-black truncate italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{notification.donorName} dropped ₹{notification.amount}</p>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-500 hover:text-indigo-500 p-1"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR (DESKTOP) */}
      <aside className={`w-64 border-r transition-colors duration-500 ${theme === 'dark' ? 'border-white/5 bg-[#0a0a0a]' : 'border-slate-200 bg-white'} hidden lg:flex flex-col p-6 fixed h-full z-50`}>
        <div className="flex items-center gap-3 mb-10 px-2">
          <Zap className="w-7 h-7 text-indigo-500 fill-indigo-500" />
          <span className={`text-xl font-black italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>DropPay</span>
        </div>
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              className={`w-full group flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${activeSection === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-indigo-600 dark:hover:text-white hover:bg-indigo-600/5 dark:hover:bg-white/5'}`}>
              <div className="flex items-center gap-3"><item.icon className="w-4 h-4" />{item.label}</div>
              <ChevronRight className={`w-3 h-3 ${activeSection === item.id ? 'opacity-100' : 'opacity-0'}`} />
            </button>
          ))}
        </nav>
        
        {/* THEME TOGGLE SWITCH */}
        <button 
          onClick={toggleTheme} 
          className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all mb-2 mx-2 border ${theme === 'dark' ? 'bg-white/5 border-white/5 text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-indigo-600'}`}
        >
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Zap className="w-4 h-4 text-indigo-400" /> : <Play className="w-4 h-4 text-amber-500 rotate-90" />}
            <span className="text-[11px] uppercase tracking-wider">{theme === 'dark' ? 'Stealth' : 'Protocol'}</span>
          </div>
          {theme === 'dark' ? <Sun className="w-3 h-3 text-white" /> : <Moon className="w-3 h-3 text-indigo-500" />}
        </button>

        <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 text-red-500/70 hover:text-red-500 font-bold mt-auto transition-colors font-sans"><LogOut className="w-4 h-4" /> Logout</button>
      </aside>

      {/* MOBILE NAV */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 border-t z-[100] px-4 py-2.5 backdrop-blur-2xl transition-colors ${theme === 'dark' ? 'bg-[#0a0a0a]/95 border-white/5' : 'bg-white/95 border-slate-200'}`}>
        <div className="flex justify-around items-center max-w-lg mx-auto">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-1 transition-all ${activeSection === item.id ? 'text-indigo-500 scale-105' : 'text-slate-500'}`}>
              <item.icon className="w-5 h-5" />
              <span className="text-[8px] font-black uppercase font-sans">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 lg:ml-64 p-6 lg:p-10 w-full overflow-x-hidden">
        
        {/* HEADER SECTION WITH MOBILE ACTIONS */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 font-sans w-full">
          <div className="flex justify-between items-center w-full sm:w-auto">
            <div>
              <h1 className={`text-2xl font-black tracking-tight mb-0.5 uppercase italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{activeSection}</h1>
              <div className="flex items-center gap-3">
                <p className="text-slate-500 text-[11px] font-medium italic">Active Streamer: <span className="text-indigo-400 font-mono font-bold tracking-wider">@{user.streamerId}</span></p>
                
                {/* GLOBAL TIER BADGE IN HEADER */}
                {user?.tier && user.tier !== 'none' && (
                  <span className={`px-2 py-0.5 rounded flex items-center gap-1 text-[8px] font-black uppercase tracking-widest ${
                    user.tier === 'legend' ? 'bg-amber-500/20 text-amber-500' :
                    user.tier === 'pro' ? 'bg-indigo-500/20 text-indigo-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {user.tier === 'legend' && <Crown className="w-2.5 h-2.5" />}
                    {user.tier === 'pro' && <Zap className="w-2.5 h-2.5" />}
                    {user.tier === 'starter' && <ShieldCheck className="w-2.5 h-2.5" />}
                    {user.tier}
                  </span>
                )}
              </div>
            </div>
            
            {/* MOBILE ONLY THEME/LOGOUT BUTTONS */}
            <div className="flex sm:hidden items-center gap-2">
              <button onClick={toggleTheme} className={`p-2 rounded-xl border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5 text-amber-400' : 'bg-slate-100 border-slate-200 text-indigo-600'}`}>
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button onClick={handleLogout} className={`p-2 rounded-xl border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5 text-red-500' : 'bg-red-50 border-red-100 text-red-600'}`}>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CONDITIONAL TEST DROP & LIVE INDICATOR */}
          {(activeSection === 'dashboard' || activeSection === 'settings') && (
            <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
              <button onClick={triggerTestDrop} disabled={isTesting} className="flex-1 sm:flex-none bg-indigo-600 text-white px-4 py-2 rounded-lg font-black italic flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all text-xs shadow-lg font-sans">
                 {isTesting ? <Loader2 className="animate-spin w-3 h-3" /> : <Play className="w-3 h-3 fill-white" />} TEST DROP
              </button>
              <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-colors ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" /><span className="text-[9px] font-black uppercase text-green-500 tracking-widest font-sans">Live</span>
              </div>
            </div>
          )}
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={activeSection} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}>
            
            {activeSection === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                <div className="w-full col-span-1 lg:col-span-8 space-y-6">
                  {/* Revenue Balance Card */}
                  <motion.div whileHover={{ y: -4 }} className={`border rounded-[2rem] p-8 shadow-2xl relative overflow-hidden transition-colors ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2 mb-4"><Wallet className="w-4 h-4 text-green-500" /><span className="text-[10px] uppercase font-black tracking-widest text-slate-500 font-sans">Withdrawable Balance</span></div>
                      {user.walletBalance > 0 && (
                        <button onClick={handleWithdrawRequest} disabled={isProcessingWithdraw} className="bg-indigo-600/10 text-indigo-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all">
                          {isProcessingWithdraw ? <Loader2 className="animate-spin w-3 h-3" /> : 'Payout'}
                        </button>
                      )}
                    </div>
                    <h2 className={`text-5xl lg:text-7xl font-black italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₹{user.walletBalance || '0.00'}</h2>
                    <div className={`absolute -bottom-16 -right-16 w-64 h-64 rounded-full blur-[90px] ${theme === 'dark' ? 'bg-indigo-600/5' : 'bg-indigo-600/10'}`} />
                  </motion.div>

                  {/* MODERN ANALYTICS CHART */}
                  <div className={`border rounded-[2rem] p-6 lg:p-8 shadow-2xl overflow-hidden group relative transition-colors ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-10 relative z-20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg"><BarChart3 className="w-5 h-5 text-indigo-500" /></div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans">Revenue Stream</h3>
                      </div>
                      <div className={`flex p-1 rounded-xl border backdrop-blur-sm ${theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                        {['7D', '1M', '1Y'].map((range) => (
                          <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black transition-all ${timeRange === range ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-900'}`}>
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="h-48 w-full flex items-end justify-between gap-2 relative px-2">
                      <div className={`absolute inset-0 flex flex-col justify-between opacity-5 pointer-events-none border-b ${theme === 'dark' ? 'border-white/10' : 'border-slate-400'}`}>
                        {[1, 2, 3].map(i => <div key={i} className={`w-full border-t ${theme === 'dark' ? 'border-white' : 'border-slate-800'}`} />)}
                      </div>

                      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 1000 100" preserveAspectRatio="none">
                        <motion.path 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2 }}
                          d="M0,80 C150,20 350,90 500,40 S850,10 1000,60" 
                          fill="none" 
                          stroke="url(#gradient)" 
                          strokeWidth="3" 
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#a855f7" />
                          </linearGradient>
                        </defs>
                      </svg>

                      {chartData.map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-4 relative z-10 group/bar">
                          <div className={`absolute -top-10 left-1/2 -translate-x-1/2 text-[8px] font-black px-2 py-1 rounded-md opacity-0 group-hover/bar:opacity-100 transition-all transform translate-y-2 group-hover/bar:translate-y-0 whitespace-nowrap z-30 shadow-xl border ${theme === 'dark' ? 'bg-indigo-600 text-white border-white/20' : 'bg-slate-900 text-white border-slate-700'}`}>
                            ₹{val.toLocaleString()}
                          </div>
                          
                          <motion.div 
                            initial={{ height: 0 }} 
                            animate={{ height: `${Math.max(val / 20, 10)}%` }} 
                            className="w-full max-w-[32px] bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg shadow-lg group-hover/bar:from-indigo-400 transition-all duration-300 relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-white/10 -translate-y-full group-hover/bar:animate-[scan_1.5s_infinite] pointer-events-none" />
                          </motion.div>
                          <span className="text-[7px] font-black text-slate-600 group-hover/bar:text-slate-400 transition-colors uppercase tracking-widest font-sans">
                            {timeRange === '7D' ? `Day ${i+1}` : `P${i+1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Goal Card */}
                  <div className={`border rounded-[2rem] p-6 lg:p-8 shadow-2xl font-sans transition-colors ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3"><Target className="w-4 h-4 text-amber-500" /><h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Goal Status</h3></div>
                        <span className="text-xs font-black italic text-indigo-400">{getProgressPercentage().toFixed(1)}%</span>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-end gap-3"><span className={`text-sm font-black uppercase truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{user.goalSettings?.title}</span> <span className="text-[10px] font-bold text-slate-500">₹{user.goalSettings?.currentProgress} / ₹{user.goalSettings?.targetAmount}</span></div>
                        <div className={`w-full h-2 rounded-full border overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'}`}><motion.div animate={{ width: `${getProgressPercentage()}%` }} className="h-full bg-gradient-to-r from-indigo-600 to-amber-500" /></div>
                    </div>
                  </div>
                </div>

                <div className="w-full col-span-1 lg:col-span-4 space-y-6">
                  <div className={`border rounded-[2rem] p-6 shadow-2xl flex flex-col max-h-[400px] transition-colors ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-slate-200'}`}>
                      <h3 className="text-[10px] font-black italic mb-6 uppercase flex items-center gap-2 font-sans"><Trophy className="w-4 h-4 text-amber-400" /> Hall of Fame</h3>
                      <div className="space-y-5 overflow-y-auto pr-2 custom-scrollbar font-sans">
                          {topDonors.map((donor, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black italic text-[9px] ${idx === 0 ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20' : theme === 'dark' ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-600'}`}>#{idx + 1}</div>
                                  <div className="flex-1 min-w-0"><div className="flex justify-between items-end mb-1"><p className={`font-black text-[9px] uppercase tracking-widest truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{donor._id}</p><p className="font-black text-indigo-400 italic text-[9px]">₹{donor.total}</p></div>
                                      <div className={`w-full h-1.5 rounded-full overflow-hidden shadow-inner ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}><motion.div initial={{ width: 0 }} animate={{ width: topDonors[0]?.total > 0 ? `${(donor.total / topDonors[0].total) * 100}%` : '0%' }} className="h-full bg-indigo-500" /></div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className={`border rounded-[2rem] p-6 shadow-2xl flex flex-col h-[350px] transition-colors ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <h3 className="text-[10px] font-black italic mb-6 uppercase flex items-center gap-2 text-slate-500 font-sans"><TrendingUp className="w-4 h-4 text-indigo-500" /> Recent Drops</h3>
                      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar font-sans">
                          {recentDrops.length > 0 ? recentDrops.map((drop, i) => (
                              <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                  <div className="flex items-center gap-3"><div className="text-lg">{stickerMap[drop.sticker] || '💎'}</div>
                                      <div className="min-w-0"><p className={`font-black italic text-[10px] truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{drop.donorName}</p><p className="text-[8px] text-slate-500 truncate italic font-sans">"{drop.message}"</p></div>
                                  </div><p className="font-black text-indigo-400 italic text-[10px]">₹{drop.amount}</p>
                              </div>
                          )) : <div className="text-center py-10 opacity-20 font-black text-[9px] uppercase italic font-sans">No Drops...</div>}
                      </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODERN CONTROL CENTER (SETTINGS) */}
            {activeSection === 'settings' && (
              <div className="max-w-6xl mx-auto space-y-10 font-sans pb-20 w-full">
                
                {/* --- MISSION HUB & STREAM PROTOCOLS --- */}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
                  <div className={`w-full h-full lg:col-span-7 border rounded-[3rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden group transition-colors flex flex-col ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -mr-32 -mt-32 ${theme === 'dark' ? 'bg-indigo-600/5' : 'bg-indigo-600/10'}`} />
                    <div className="flex justify-between items-center mb-10 relative z-10">
                      <div className="space-y-1">
                        <h2 className={`text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          <Target className="w-8 h-8 text-indigo-500" /> Mission Hub
                        </h2>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Configure stream objectives</p>
                      </div>
                      <button onClick={resetGoalProgress} disabled={isResetting} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-black uppercase hover:bg-red-500 hover:text-white transition-all disabled:opacity-50">
                        {isResetting ? <Loader2 className="animate-spin w-3 h-3" /> : <RefreshCw className="w-3 h-3" />} Reset Tech
                      </button>
                    </div>

                    <form onSubmit={updateGoalSettings} className="space-y-8 relative z-10 flex-1 flex flex-col">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-6">
                        <div className="space-y-3 w-full">
                          <label className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Mission Title</label>
                          <input type="text" value={goalForm.title} onChange={(e) => setGoalForm({...goalForm, title: e.target.value})} className={`w-full border-2 rounded-2xl p-5 text-sm font-bold focus:border-indigo-500 outline-none transition-all shadow-inner ${theme === 'dark' ? 'bg-black border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} placeholder="e.g. New GPU Build" />
                        </div>
                        <div className="space-y-3 w-full">
                          <label className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Target Credits (₹)</label>
                          <input type="number" value={goalForm.targetAmount} onChange={(e) => setGoalForm({...goalForm, targetAmount: e.target.value})} className={`w-full border-2 rounded-2xl p-5 text-sm font-bold focus:border-indigo-500 outline-none transition-all shadow-inner ${theme === 'dark' ? 'bg-black border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                        </div>
                      </div>

                      {/* SURGICAL INJECTION: RUNNER PROTOCOL SELECTOR */}
                      <div className="space-y-4 mb-6">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                          Visual Protocol: Progress Runner
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                          {[
                            { id: 'star', label: 'Classic Star', icon: Star, tier: 'starter' },
                            { id: 'car', label: 'Drift Car', icon: Car, tier: 'pro' },
                            { id: 'rocket', label: 'X-Rocket', icon: Rocket, tier: 'pro' },
                            { id: 'fire', label: 'Inferno', icon: Flame, tier: 'pro' }
                          ].map((runner) => {
                            const isLocked = (runner.tier === 'pro' && user?.tier === 'starter') || (runner.tier === 'pro' && user?.tier === 'none');
                            return (
                              <button
                                key={runner.id}
                                type="button"
                                disabled={isLocked}
                                onClick={() => setGoalForm({...goalForm, runnerType: runner.id})}
                                className={`relative p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                                  goalForm.runnerType === runner.id 
                                  ? 'bg-indigo-500/10 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                                  : 'bg-black/20 border-white/5 hover:border-white/20'
                                } ${isLocked ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
                              >
                                <runner.icon className={`w-5 h-5 ${goalForm.runnerType === runner.id ? 'text-indigo-400' : 'text-slate-500'}`} />
                                <span className="text-[8px] font-black uppercase tracking-tighter">{runner.label}</span>
                                {isLocked && <Lock className="absolute top-1.5 right-1.5 w-2.5 h-2.5 text-slate-600" />}
                              </button>
                            );
                          })}
                        </div>
                        {user?.tier === 'legend' && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
                             <div className="relative">
                               <UploadCloud className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                               <input 
                                 placeholder="Legendary Protocol: Custom Lottie URL..." 
                                 value={goalForm.customRunnerUrl}
                                 onChange={(e) => setGoalForm({...goalForm, customRunnerUrl: e.target.value, runnerType: 'custom'})}
                                 className="w-full bg-black/40 border border-amber-500/20 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-mono text-amber-400 focus:border-amber-500/50 outline-none placeholder:text-amber-900"
                               />
                             </div>
                          </motion.div>
                        )}
                      </div>

                      <button type="submit" disabled={isUpdatingGoal} className="w-full bg-indigo-600 py-5 rounded-2xl font-black uppercase italic text-xs text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                        {isUpdatingGoal ? <Loader2 className="animate-spin w-5 h-5" /> : <><Settings2 className="w-5 h-5" /> Deploy Mission Setup</>}
                      </button>
                    </form>
                  </div>

                  <div className={`w-full h-full lg:col-span-5 border rounded-[3rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden group transition-colors flex flex-col ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center gap-4 mb-10">
                      <div className="p-3.5 bg-indigo-500/10 rounded-2xl text-indigo-500 border border-indigo-500/20 shadow-lg">
                        <Globe className="w-6 h-6" />
                      </div>
                      <h3 className={`text-sm font-black uppercase italic tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Stream Protocols</h3>
                    </div>
                    <div className="space-y-4 w-full flex-1 flex flex-col justify-center">
                      {[
                        { id: 'public', label: 'Payment Node', color: 'text-indigo-400', bg: theme === 'dark' ? 'bg-indigo-500/5' : 'bg-indigo-50', url: `/pay/${user.streamerId}` },
                        { id: 'overlay', label: 'Alert Protocol', color: 'text-purple-400', bg: theme === 'dark' ? 'bg-purple-500/5' : 'bg-purple-50', url: `/overlay/${user.obsKey}` },
                        { id: 'goal', label: 'Goal Monitor', color: 'text-amber-400', bg: theme === 'dark' ? 'bg-amber-500/5' : 'bg-amber-50', url: `/goal/${user.streamerId}` }
                      ].map((link) => (
                        <div key={link.id} className={`${link.bg} border border-slate-200 dark:border-white/5 rounded-2xl p-5 flex items-center justify-between group/link hover:border-slate-300 dark:hover:border-white/10 transition-all w-full`}>
                          <div className="flex flex-col min-w-0 pr-4">
                            <span className={`text-[8px] ${link.color} font-black uppercase tracking-[0.2em] mb-1.5`}>{link.label}</span>
                            <code className={`text-[10px] font-mono font-bold truncate italic ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{window.location.origin}{link.url}</code>
                          </div>
                          <button onClick={(e) => copyToClipboard(e, `${window.location.origin}${link.url}`, link.id)} className={`p-3 rounded-xl transition-all shrink-0 ${copiedType === link.id ? 'bg-green-500 text-white' : theme === 'dark' ? 'bg-black/50 text-slate-500 hover:text-white' : 'bg-white text-slate-500 border border-slate-200 hover:text-indigo-600'}`}>
                            {copiedType === link.id ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* --- PARTNER PACK STUDIO --- */}
                <div className={`mt-10 border rounded-[3rem] p-8 lg:p-12 shadow-2xl relative overflow-hidden transition-colors ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-slate-200'}`}>
                  <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none ${theme === 'dark' ? 'bg-amber-600/5' : 'bg-amber-600/10'}`} />
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10 gap-4">
                    <div className="space-y-1">
                      <h2 className={`text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        <Crown className="w-8 h-8 text-amber-500" /> Partner Pack Studio
                      </h2>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Deploy Community Specific 3D Assets</p>
                    </div>
                    {isTierEligible && (
                      <button 
                        onClick={savePartnerPack} 
                        disabled={isSavingStickers}
                        className="bg-amber-500 text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2"
                      >
                        {isSavingStickers ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} 
                        {isSavingStickers ? "Deploying..." : "Save Sticker Protocol"}
                      </button>
                    )}
                  </div>

                  {!isTierEligible ? (
                    <div className="bg-black/20 border-2 border-dashed border-white/5 rounded-[3rem] p-16 text-center flex flex-col items-center">
                      <ShieldAlert className="w-12 h-12 text-amber-500/20 mb-4" />
                      <h4 className="text-white font-black uppercase tracking-widest text-sm italic mb-2">Protocol Restricted</h4>
                      <p className="text-slate-500 text-[10px] uppercase font-bold max-w-sm leading-relaxed">Partner Packs are exclusive to <span className="text-indigo-400">PRO</span> and <span className="text-amber-500">LEGEND</span> tiers. Upgrade to unlock 3D custom sticker uploads.</p>
                      <button onClick={() => setActiveSection('accounts')} className="mt-8 bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase transition-all">Go to Tier Management</button>
                    </div>
                  ) : (
                    <div className="space-y-8 relative z-10 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {partnerStickers.map((stk, index) => (
                          <div key={index} className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6 flex gap-6 group relative shadow-inner">
                            <div className="w-24 h-24 bg-black rounded-[1.5rem] flex items-center justify-center overflow-hidden border border-white/5 shrink-0">
                              {stk.lottieUrl ? (
                                <Player autoplay loop src={stk.lottieUrl} style={{ height: '70px', width: '70px' }} />
                              ) : (
                                <Sparkles className="w-6 h-6 text-slate-800" />
                              )}
                            </div>
                            <div className="flex-1 space-y-3 min-w-0">
                              <input placeholder="Sticker Name" value={stk.name} onChange={(e) => updateStickerSlot(index, 'name', e.target.value)} className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-indigo-500" />
                              <input placeholder="Lottie JSON URL" value={stk.lottieUrl} onChange={(e) => updateStickerSlot(index, 'lottieUrl', e.target.value)} className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-2 text-[9px] font-mono text-indigo-400 outline-none focus:border-indigo-500" />
                              <div className="flex items-center gap-3">
                                <span className="text-[9px] font-black text-slate-500 uppercase">Min Price: ₹</span>
                                <input type="number" value={stk.minAmount} onChange={(e) => updateStickerSlot(index, 'minAmount', e.target.value)} className="w-24 bg-black/50 border border-white/5 rounded-xl px-3 py-1.5 text-xs font-black text-white outline-none focus:border-indigo-500" />
                              </div>
                            </div>
                            <button onClick={() => removeStickerSlot(index)} className="absolute top-4 right-4 p-2 text-slate-700 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        {partnerStickers.length < 10 && (
                          <button onClick={addStickerSlot} className="border-2 border-dashed border-white/5 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-3 hover:border-indigo-500/30 hover:bg-white/[0.02] transition-all group">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg">
                              <Plus className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest group-hover:text-white transition-colors">Add Sticker Slot</span>
                          </button>
                        )}
                      </div>

                      <div className="bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-[2rem] flex items-start gap-4">
                        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic uppercase tracking-wider">
                            Streamer Advisory: Paste the "Lottie JSON URL" from LottieFiles.com into the slot. 
                            Custom stickers will appear in the <span className="text-indigo-400">"Partner Pack"</span> tab on your public donation node instantly.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* --- ALERT STUDIO --- */}
                <div className={`mt-10 border rounded-[3rem] p-8 lg:p-12 shadow-2xl relative overflow-hidden transition-colors ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none ${theme === 'dark' ? 'bg-purple-600/5' : 'bg-purple-600/10'}`} />
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10 gap-4">
                        <div className="space-y-1">
                            <h2 className={`text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                <Wand2 className="w-8 h-8 text-purple-500" /> Alert Studio
                            </h2>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Advanced Drop Physics & Styling</p>
                        </div>
                        <button 
                          onClick={saveAlertSettings} 
                          disabled={isSavingAlerts} 
                          className="bg-purple-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-purple-600/20 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSavingAlerts ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} 
                            {isSavingAlerts ? "Saving..." : "Save Configuration"}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10 w-full">
                      {/* LEFT: CONTROLS */}
                        <div className="lg:col-span-7 space-y-8">

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2"><Layers className="w-3 h-3"/> 1. Amount-Based Tiers</label>
                                <div className={`flex p-1.5 rounded-2xl border ${theme === 'dark' ? 'bg-black/50 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                                    {['standard', 'epic', 'legendary'].map(tier => (
                                        <button key={tier} onClick={() => setActiveAlertTier(tier)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeAlertTier === tier ? (tier === 'legendary' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : theme === 'dark' ? 'bg-[#18181b] text-white shadow-lg border border-white/5' : 'bg-white text-indigo-600 shadow-lg border border-slate-200') : 'text-slate-500 hover:text-slate-400'}`}>
                                            {tier} {tier === 'standard' && '(₹100+)'}
                                            {tier === 'epic' && '(₹500+)'}
                                            {tier === 'legendary' && '(₹2000+)'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* TTS */}
                                <div className={`p-6 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2"><Volume2 className="w-3 h-3"/> Text-To-Speech</label>
                                        <button onClick={() => setAlertConfig({...alertConfig, ttsEnabled: !alertConfig.ttsEnabled})} className={`w-8 h-4 rounded-full transition-colors flex items-center px-0.5 ${alertConfig.ttsEnabled ? 'bg-green-500' : 'bg-slate-600'}`}>
                                            <div className={`w-3 h-3 rounded-full bg-white transition-transform ${alertConfig.ttsEnabled ? 'translate-x-4' : 'translate-x-0'}`}/>
                                        </button>
                                    </div>
                                    <select disabled={!alertConfig.ttsEnabled} value={alertConfig.ttsVoice} onChange={(e)=>setAlertConfig({...alertConfig, ttsVoice: e.target.value})} className={`w-full text-xs font-bold p-3 rounded-xl outline-none mb-3 border ${theme === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'} disabled:opacity-50`}>
                                        <option value="female">AI Female (Smooth)</option>
                                        <option value="male">AI Male (Deep)</option>
                                        <option value="cyborg">Cyborg (Glitch)</option>
                                    </select>
                                    <input disabled={!alertConfig.ttsEnabled} type="number" placeholder="Min Amount (e.g. 500)" value={alertConfig.ttsMinAmount} onChange={(e)=>setAlertConfig({...alertConfig, ttsMinAmount: e.target.value})} className={`w-full text-xs font-bold p-3 rounded-xl outline-none border ${theme === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'} disabled:opacity-50`} />
                                </div>

                                {/* Layout & Typography */}
                                <div className={`p-6 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2 mb-4"><Type className="w-3 h-3"/> Typography</label>
                                    <select value={alertConfig.layout} onChange={(e)=>setAlertConfig({...alertConfig, layout: e.target.value})} className={`w-full text-xs font-bold p-3 rounded-xl outline-none mb-3 border ${theme === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                                        <option value="icon-left">Icon Left, Text Right</option>
                                        <option value="icon-top">Icon Top, Text Bottom</option>
                                        <option value="compact">Compact Overlay</option>
                                    </select>
                                    <select value={alertConfig.font} onChange={(e)=>setAlertConfig({...alertConfig, font: e.target.value})} className={`w-full text-xs font-bold p-3 rounded-xl outline-none border ${theme === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                                        <option value="font-sans">Inter (Modern)</option>
                                        <option value="font-mono">Fira Code (Hacker)</option>
                                        <option value="font-serif">Merriweather (Classic)</option>
                                    </select>
                                </div>

                                {/* Media Injection (Now Interactive) */}
                                <div className={`p-6 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2 mb-4"><ImageIcon className="w-3 h-3"/> Media Injection</label>
                                    <div className="grid grid-cols-4 gap-2 mb-3">
                                        {['⚡', '🔥', '🚀', '💎'].map(sticker => (
                                            <button 
                                                key={sticker} 
                                                onClick={() => setAlertConfig({...alertConfig, media: sticker})}
                                                className={`p-2 rounded-xl text-lg border transition-all ${alertConfig.media === sticker ? 'border-indigo-500 bg-indigo-500/10 scale-105 shadow-lg shadow-indigo-500/20' : theme === 'dark' ? 'bg-black border-white/5 hover:border-indigo-500/50' : 'bg-white border-slate-200 hover:border-indigo-500/50'}`}
                                            >
                                                {sticker}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => alert("Custom Video/GIF uploads unlock at Legend Tier.")} className={`w-full text-[9px] font-black uppercase tracking-widest p-3 rounded-xl border border-dashed flex items-center justify-center gap-2 transition-colors ${theme === 'dark' ? 'border-white/20 text-slate-400 hover:text-white hover:border-white/50' : 'border-slate-300 text-slate-500 hover:text-slate-800 hover:border-slate-500'}`}>
                                        <UploadCloud className="w-3 h-3" /> Custom GIF/WebM
                                    </button>
                                </div>

                                {/* Animation Physics */}
                                <div className={`p-6 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2 mb-4"><Sliders className="w-3 h-3"/> Physics</label>
                                    <select value={alertConfig.animation} onChange={(e)=>setAlertConfig({...alertConfig, animation: e.target.value})} className={`w-full text-xs font-bold p-3 rounded-xl outline-none mb-3 border ${theme === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                                        <option value="slide-left">Slide from Left</option>
                                        <option value="bounce-bottom">Bounce from Bottom</option>
                                        <option value="glitch">Glitch Reveal</option>
                                    </select>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center"><span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Duration</span><span className={`text-[9px] font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{alertConfig.duration}s</span></div>
                                        <input type="range" min="3" max="15" value={alertConfig.duration} onChange={(e)=>setAlertConfig({...alertConfig, duration: parseInt(e.target.value)})} className="w-full accent-purple-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: LIVE PREVIEW (Fully hooked up) */}
                        <div className="lg:col-span-5 w-full">
                            <div className="bg-[#050505] rounded-[2.5rem] border-[8px] border-[#18181b] overflow-hidden relative shadow-2xl flex flex-col h-full min-h-[400px]">
                                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0a0a0a]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-500 uppercase">OBS Studio Preview</span>
                                    <Sparkles className="w-3 h-3 text-slate-600" />
                                </div>
                                <div className="flex-1 p-6 relative flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-20 overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        <motion.div 
                                            key={`${activeAlertTier}-${previewKey}`}
                                            initial={{ x: -100, opacity: 0, scale: 0.9 }}
                                            animate={{ x: 0, opacity: 1, scale: 1 }}
                                            transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
                                            className={`relative z-10 w-full max-w-sm backdrop-blur-xl border-2 rounded-3xl p-6 flex gap-5 shadow-2xl ${activeAlertTier === 'legendary' ? 'bg-amber-500/10 border-amber-500 shadow-amber-500/20' : 'bg-[#111]/80 border-white/10 shadow-white/5'}`}
                                        >
                                            <div className="text-5xl drop-shadow-2xl">{alertConfig.media}</div>
                                            <div className={`flex-1 ${alertConfig.font}`}>
                                                <h4 className={`text-lg font-black uppercase italic tracking-tighter ${activeAlertTier === 'legendary' ? 'text-amber-400' : 'text-white'}`}>TEST SUPPORTER</h4>
                                                <p className="text-xs text-slate-300 italic font-medium">"This UI goes incredibly hard. Keep it up! ⚡"</p>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                                <div className="p-4 bg-[#0a0a0a] border-t border-white/5 flex justify-center">
                                     <button onClick={() => setPreviewKey(prev => prev + 1)} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all active:scale-95">
                                         <Play className="w-3 h-3 fill-slate-400" /> Replay Animation
                                     </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* PROFESSIONAL IDENTITY HUB */}
            {activeSection === 'accounts' && (
              <div className="max-w-6xl mx-auto space-y-8 font-sans pb-20 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
                  <div className={`w-full lg:col-span-8 border rounded-[2.5rem] p-8 lg:p-12 shadow-2xl relative overflow-hidden group transition-colors ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -mr-32 -mt-32 ${theme === 'dark' ? 'bg-indigo-500/5' : 'bg-indigo-500/10'}`} />
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
                      <div className="relative group/avatar shrink-0">
                        <div className={`w-36 h-36 rounded-[2.5rem] border-2 border-dashed flex items-center justify-center overflow-hidden transition-all group-hover/avatar:border-indigo-500 shadow-2xl ${theme === 'dark' ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                          {profilePreview ? (
                            <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <User className={`w-14 h-14 ${theme === 'dark' ? 'text-white/20' : 'text-slate-300'}`} />
                          )}
                          <button 
                            onClick={() => fileInputRef.current.click()}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-sm"
                          >
                            <UploadCloud className="w-6 h-6 text-white mb-1" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-white">Change Avatar</span>
                          </button>
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} accept="image/*" />
                        <div className={`absolute -bottom-2 -right-2 p-1.5 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-[#050505] border-white/5' : 'bg-white border-slate-200'}`}>
                          <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        </div>
                      </div>

                      <div className="flex-1 space-y-6 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h2 className={`text-3xl font-black uppercase italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Identity Hub</h2>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Manage your streamer presence</p>
                          </div>
                          <button 
                            onClick={() => isEditing ? saveProfileUpdates() : setIsEditing(true)} 
                            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                              isEditing 
                              ? 'bg-green-500 text-white border-green-400 shadow-lg shadow-green-500/20' 
                              : theme === 'dark' ? 'bg-white/5 text-indigo-400 border-white/5 hover:bg-indigo-600 hover:text-white' : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-indigo-600'
                            }`}
                          >
                            {isEditing ? <><Save className="w-3.5 h-3.5" /> Save Node</> : <><Edit3 className="w-3.5 h-3.5" /> Update Core</>}
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                            <BadgeCheck className="w-3 h-3" /> Droppay Verified
                          </div>
                          
                          {/* --- DYNAMIC TIER BADGE REPLACEMENT --- */}
                          {user?.tier && user.tier !== 'none' ? (
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                              user.tier === 'legend' 
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-amber-500/10' 
                                : user.tier === 'pro'
                                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                                  : 'bg-slate-500/10 border-slate-500/30 text-slate-400'
                            }`}>
                              {user.tier === 'legend' && <Crown className="w-3.5 h-3.5 fill-amber-500" />}
                              {user.tier === 'pro' && <Zap className="w-3.5 h-3.5 fill-indigo-400" />}
                              {user.tier === 'starter' && <ShieldCheck className="w-3.5 h-3.5" />}
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">
                                {user.tier} Protocol
                              </span>
                            </div>
                          ) : (
                            <div className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors bg-red-500/10 border-red-500/20 text-red-500">
                              No Active Plan
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-200 dark:border-white/5 relative z-10 w-full">
                      <div className="space-y-2 w-full">
                        <label className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">
                          <UserCircle className="w-3 h-3" /> Full Name
                        </label>
                        {isEditing ? (
                          <input 
                            value={editForm.username} 
                            onChange={(e) => setEditForm({...editForm, username: e.target.value})} 
                            className={`w-full border-2 rounded-2xl p-4 text-xs font-bold focus:border-indigo-500 outline-none transition-all shadow-inner ${theme === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} 
                          />
                        ) : (
                          <div className={`w-full border rounded-2xl p-4 transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                            <p className={`text-sm font-black italic ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>{user.username}</p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 w-full">
                        <label className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">
                          <Hash className="w-3 h-3" /> Streamer ID
                        </label>
                        {isEditing ? (
                          <input 
                            value={editForm.streamerId} 
                            onChange={(e) => setEditForm({...editForm, streamerId: e.target.value})} 
                            className={`w-full border-2 rounded-2xl p-4 text-xs font-mono font-bold focus:border-indigo-500 outline-none transition-all shadow-inner ${theme === 'dark' ? 'bg-black border-white/10 text-indigo-400' : 'bg-slate-50 border-slate-200 text-indigo-600'}`} 
                          />
                        ) : (
                          <div className={`w-full border rounded-2xl p-4 transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                            <p className={`text-sm font-mono font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>@{user.streamerId}</p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 w-full">
                        <label className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">
                          <MailIcon className="w-3 h-3" /> Registered Email
                        </label>
                        <div className={`w-full border rounded-2xl p-4 opacity-60 transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="space-y-2 w-full">
                        <label className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">
                          <Phone className="w-3 h-3" /> Secure Contact
                        </label>
                        {isEditing ? (
                          <input 
                            value={editForm.phone} 
                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})} 
                            className={`w-full border-2 rounded-2xl p-4 text-xs font-bold focus:border-indigo-500 outline-none transition-all shadow-inner ${theme === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} 
                          />
                        ) : (
                          <div className={`w-full border rounded-2xl p-4 transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                            <p className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>{user.phone || "No secure contact linked"}</p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 w-full md:col-span-2 mt-4">
                        <label className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">
                          <MessageSquare className="w-3 h-3" /> Streamer Bio / Page Message
                        </label>
                        {isEditing ? (
                          <textarea 
                            value={editForm.bio} 
                            onChange={(e) => setEditForm({...editForm, bio: e.target.value})} 
                            maxLength={150}
                            className={`w-full border-2 rounded-2xl p-4 text-xs font-bold focus:border-indigo-500 outline-none transition-all shadow-inner resize-none min-h-[80px] ${theme === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} 
                          />
                        ) : (
                          <div className={`w-full border rounded-2xl p-4 transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                            <p className={`text-sm font-medium italic ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>"{user.bio || editForm.bio || 'Support the stream, trigger custom on-screen alerts, and join the Hall of Fame.'}"</p>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  <div className="w-full lg:col-span-4 space-y-6">
                    <div className={`w-full border rounded-[2.5rem] p-8 shadow-2xl flex flex-col font-sans relative overflow-hidden group min-h-[300px] transition-colors ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-slate-200'}`}>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3.5 bg-indigo-500/10 rounded-2xl text-indigo-500 shadow-lg shadow-indigo-500/10 border border-indigo-500/20">
                          <Landmark className="w-6 h-6" />
                        </div>
                        <h3 className={`text-sm font-black uppercase italic tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Banking Node</h3>
                      </div>
                      <div className="space-y-6 flex-1 z-10 w-full">
                        {user.razorpayAccountId ? (
                          <div className="space-y-6 w-full">
                            <div className={`border p-6 rounded-3xl flex items-center gap-5 transition-colors ${theme === 'dark' ? 'bg-green-500/5 border-green-500/20' : 'bg-green-50 border-green-100'}`}>
                              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center shrink-0 border border-green-200 dark:border-green-500/30">
                                <ShieldCheck className="w-6 h-6 text-green-500" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase text-green-600 dark:text-green-500 tracking-widest">Active Settlement</p>
                                <p className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mt-0.5 truncate">{user.razorpayAccountId.slice(0, 8)}***</p>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed italic font-bold">Revenue is auto-settled via Razorpay Route protocols.</p>
                          </div>
                        ) : (
                          <div className="space-y-6 w-full">
                            <div className={`border p-6 rounded-3xl border-dashed transition-colors ${theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                              <div className="flex items-center gap-3 mb-3">
                                <CreditCard className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Payout Security</p>
                              </div>
                              <p className="text-xs text-slate-600 italic font-bold uppercase">Manual Link Required.</p>
                            </div>
                            <button 
                              onClick={handleBankLink} 
                              disabled={isLinkingBank} 
                              className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-black uppercase italic text-[11px] shadow-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                              {isLinkingBank ? <Loader2 className="animate-spin w-4 h-4" /> : <><Plus className="w-4 h-4" /> Link Account</>}
                            </button>
                          </div>
                        )}
                      </div>
                      <Landmark className="absolute -bottom-10 -right-10 w-40 h-40 text-slate-100 dark:text-white/[0.02] -rotate-12 pointer-events-none" />
                    </div>
                    <div className="w-full bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 flex items-center justify-between transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/20">
                            <Trophy className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                          </div>
                          <p className="text-[10px] font-black uppercase italic text-slate-900 dark:text-white">Upgrade Tier Status</p>
                       </div>
                       <ChevronRight className="w-4 h-4 text-indigo-500 shrink-0" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HIGH-END GROWTH HUB */}
            {activeSection === 'growth' && (
              <div className="max-w-6xl mx-auto space-y-10 font-sans pb-20 pt-4 w-full">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 w-full">
                  <div className="space-y-1 w-full md:w-auto">
                    <h2 className={`text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      <Award className="w-8 h-8 text-indigo-500" /> Growth Missions
                    </h2>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Recruit streamers to unlock elite protocols</p>
                  </div>
                  <div className={`border px-6 py-3 rounded-2xl transition-colors w-full md:w-auto ${theme === 'dark' ? 'bg-indigo-600/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                    <p className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1 text-center">Total Recruits</p>
                    <p className={`text-2xl font-black italic text-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>00</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
                  <div className={`w-full lg:col-span-8 border rounded-[2.5rem] p-8 lg:p-10 shadow-2xl space-y-10 relative overflow-hidden transition-colors ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -mr-32 -mt-32 ${theme === 'dark' ? 'bg-green-500/5' : 'bg-green-500/10'}`} />
                    <div className="flex items-center justify-between relative z-10 w-full">
                      <h3 className="text-xs font-black uppercase italic tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-3">
                        <TrendingUp className="w-4 h-4 text-green-500" /> Reward Milestones
                      </h3>
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full uppercase border border-indigo-100 dark:border-transparent">Lv. 1 Scout</span>
                    </div>

                    <div className="space-y-8 relative z-10 w-full">
                      {[
                        { goal: 3, reward: "Premium Themes", desc: "Unlock 5 new visual styles for your drop page.", icon: Zap },
                        { goal: 5, reward: "Custom Alerts", desc: "Upload your own sound effects for every drop.", icon: BellRing },
                        { goal: 10, reward: "Partner Fee (7%)", desc: "Permanent reduction in platform commission.", icon: ShieldCheck }
                      ].map((m, i) => (
                        <div key={i} className="relative pl-10 border-l-2 border-slate-200 dark:border-white/5 py-2 group w-full">
                          <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-50 dark:bg-[#050505] border-2 border-slate-300 dark:border-white/10 group-hover:border-indigo-500 transition-colors`} />
                          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                            <div className="space-y-1">
                              <h4 className={`text-sm font-black uppercase italic flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                <m.icon className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> {m.reward}
                              </h4>
                              <p className="text-[11px] text-slate-500 font-medium italic">{m.desc}</p>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter shrink-0">Goal: {m.goal}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full lg:col-span-4 space-y-6">
                    <div className="w-full bg-indigo-600 border border-indigo-500 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                      <div className="relative z-10 space-y-6 w-full">
                        <div className="p-3 bg-white/10 w-fit rounded-2xl"><Users className="w-6 h-6 text-white" /></div>
                        <h3 className="text-lg font-black uppercase italic text-white leading-tight">Expand the Elite Network</h3>
                        <p className="text-white/60 text-[11px] font-medium leading-relaxed italic">Share your unique link. When a streamer joins, you both level up your status.</p>
                        
                        <div className="space-y-2 w-full">
                          <label className="text-[8px] font-black uppercase text-white/50 tracking-widest ml-1">Invite URL</label>
                          <div className="w-full bg-black/20 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-white/5">
                            <code className="text-[10px] font-mono font-bold text-white truncate pr-4 italic">
                              droppay.com/join/{user.streamerId}
                            </code>
                            <button onClick={(e) => copyToClipboard(e, `droppay.com/join/${user.streamerId}`, 'referral')} className="p-2 hover:bg-white/10 rounded-lg transition-all shrink-0">
                              {copiedType === 'referral' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <Users className="absolute -bottom-10 -right-10 w-48 h-48 text-white/[0.05] -rotate-12" />
                    </div>

                    <div className={`w-full border rounded-[2rem] p-6 flex items-start gap-4 transition-colors ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-slate-200'}`}>
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-500/20">
                        <Gift className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className={`text-[10px] font-black uppercase mb-1 tracking-widest italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Recruiter Tip</p>
                        <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">Post your link in your Discord's 'Streamer Chat' to reach recruits instantly.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* KNOWLEDGE HUB */}
            {activeSection === 'help' && (
              <div className="max-w-5xl mx-auto space-y-10 font-sans pb-20 w-full">
                <div className="text-center space-y-4 w-full">
                  <h2 className={`text-3xl font-black uppercase italic tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Knowledge Hub</h2>
                  <p className="text-slate-500 text-sm italic font-medium">Find quick solutions or step-by-step guides for your stream setup.</p>
                  <div className="relative max-w-xl mx-auto mt-8 w-full">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                      <Search className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Search for 'OBS Setup', 'Withdrawals'..." 
                      className={`w-full border rounded-2xl py-4 pl-12 pr-6 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-all shadow-2xl font-bold ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-slate-200'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  {[
                    { icon: Zap, title: "OBS Integration", desc: "How to add alerts, goal bars, and browser sources to OBS Studio.", color: "text-indigo-500" },
                    { icon: Wallet, title: "Payouts & Banks", desc: "Understanding settlements, Razorpay Route, and bank links.", color: "text-green-500" },
                    { icon: ShieldAlert, title: "Account Safety", desc: "Best practices for keeping your streaming keys and data secure.", color: "text-red-500" }
                  ].map((item, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }} className={`w-full p-8 rounded-[2.5rem] border shadow-xl hover:border-indigo-500/30 transition-all cursor-pointer group ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-slate-200'}`}>
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                        <item.icon className={`w-6 h-6 ${item.color} group-hover:text-white transition-colors`} />
                      </div>
                      <h4 className={`font-black text-xs uppercase italic tracking-wider mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <div className={`w-full border rounded-[2.5rem] overflow-hidden shadow-2xl transition-colors ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`p-8 border-b ${theme === 'dark' ? 'border-white/5 bg-[#111]/30' : 'border-slate-200 bg-white/50'}`}>
                    <h3 className="text-xs font-black uppercase italic tracking-widest flex items-center gap-3 text-slate-500 dark:text-slate-400">
                      <MessageSquare className="w-4 h-4 text-indigo-500" /> Frequently Asked Questions
                    </h3>
                  </div>
                  <div className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-200'} w-full`}>
                    {[
                      { q: "How long do payouts take?", a: "Revenue is settled via Razorpay Route. Typically, funds reach your linked bank account within T+2 business days after the drop is verified." },
                      { q: "Why isn't my OBS overlay showing?", a: "Ensure you are using the 'Browser Source' in OBS and that your specific OBS Key is copied correctly. Check that 'Shutdown source when not visible' is unchecked." },
                      { q: "Is there a platform fee?", a: "Droppay takes a standard commission to cover server costs and payment gateway fees. Check your tier details in the 'Accounts' section for your specific split." }
                    ].map((faq, idx) => (
                      <details key={idx} className="group outline-none border-none w-full">
                        <summary className="flex justify-between items-center p-6 cursor-pointer list-none hover:bg-black/5 dark:hover:bg-white/[0.02] transition-all outline-none">
                          <span className={`text-[11px] font-black uppercase italic pr-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{faq.q}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-open:rotate-90 transition-transform shrink-0" />
                        </summary>
                        <div className="px-8 pb-6 text-[11px] text-slate-500 leading-relaxed italic max-w-3xl">
                          {faq.a}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>

                <div className="w-full bg-indigo-50 dark:bg-gradient-to-r dark:from-indigo-900/20 dark:to-transparent border border-indigo-100 dark:border-indigo-500/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1 text-center md:text-left">
                    <h4 className={`font-black text-sm uppercase italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Still need human assistance?</h4>
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-300/70 font-medium">Our support team is active 24/7 for legend tier members.</p>
                  </div>
                  <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black uppercase italic text-[10px] shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all flex items-center gap-2">
                    <MailIcon className="w-3.5 h-3.5" /> Email Engineers
                  </button>
                </div>
              </div>
            )}

            {/* FEEDBACK STATION */}
            {activeSection === 'feedback' && (
              <div className="max-w-3xl mx-auto space-y-12 font-sans pb-20 pt-4 w-full">
                <div className="text-center space-y-2 w-full">
                  <h3 className={`text-3xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    <Monitor className="w-8 h-8 text-indigo-500" /> Feedback Station
                  </h3>
                  <p className="text-slate-500 text-[10px] font-bold italic uppercase tracking-[0.3em]">Direct link to Droppay Engineering</p>
                </div>

                <div className="relative group w-full">
                  <div className="absolute -inset-1 bg-indigo-500/20 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className={`relative border-[12px] rounded-[3rem] shadow-2xl overflow-hidden transition-colors ${theme === 'dark' ? 'bg-[#18181b] border-[#09090b]' : 'bg-slate-200 border-slate-300'}`}>
                    <div className={`p-8 lg:p-12 space-y-10 font-sans transition-colors ${theme === 'dark' ? 'bg-[#050505]' : 'bg-white'}`}>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-3 bg-indigo-500 rounded-full" />
                          <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">Select Protocol</label>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {[
                            { id: 'bug', label: 'Bug Report', color: 'border-red-500/50 text-red-500' },
                            { id: 'feature', label: 'Feature Request', color: 'border-indigo-500/50 text-indigo-500' },
                            { id: 'general', label: 'General Praise', color: 'border-green-500/50 text-green-500' }
                          ].map((type) => (
                            <button
                              key={type.id}
                              onClick={() => setFeedbackType(type.id)}
                              className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all border-2 ${
                                feedbackType === type.id 
                                ? theme === 'dark' ? 'bg-white text-black border-white shadow-lg scale-105' : 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105'
                                : theme === 'dark' ? `bg-transparent ${type.color} opacity-40 hover:opacity-100 border-white/5` : `bg-slate-50 border-slate-200 text-slate-500 hover:border-indigo-300`
                              }`}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-3 bg-indigo-500 rounded-full" />
                          <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">Experience Rating</label>
                        </div>
                        <div className={`flex gap-3 w-fit p-3 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button key={num} onClick={() => setRating(num)} className="transition-transform active:scale-110">
                              <Star 
                                className={`w-6 h-6 transition-all ${
                                  num <= rating 
                                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' 
                                  : 'text-slate-300 dark:text-white/10'
                                }`} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4 w-full">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-3 bg-indigo-500 rounded-full" />
                          <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">Transmission Details</label>
                        </div>
                        <div className="relative w-full">
                          <textarea 
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Type your insights here..." 
                            className={`w-full border-2 rounded-3xl p-6 focus:border-indigo-500/50 outline-none min-h-[160px] resize-none text-sm italic font-medium transition-all shadow-inner ${theme === 'dark' ? 'bg-black border-white/5 text-slate-300 placeholder:text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                          ></textarea>
                          <div className="absolute bottom-4 right-6 text-[8px] font-mono text-slate-400 dark:text-slate-700 uppercase">Input Terminal v1.0</div>
                        </div>
                      </div>

                      <button 
                        disabled={isSubmittingFeedback || !feedbackText}
                        onClick={async () => {
                          setIsSubmittingFeedback(true);
                          setTimeout(() => {
                            alert("Insight Received. Data Synced.");
                            setFeedbackText("");
                            setIsSubmittingFeedback(false);
                          }, 1500);
                        }}
                        className="w-full relative group/btn overflow-hidden bg-indigo-600 py-5 rounded-2xl font-black text-xs uppercase italic text-white shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[scan_2s_infinite] pointer-events-none" />
                        {isSubmittingFeedback ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> Syncing with Hub...</>
                        ) : (
                          <><Send className="w-4 h-4" /> Deploy Insight</>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="w-32 h-4 mx-auto rounded-b-xl transition-colors bg-slate-300 dark:bg-[#09090b]" />
                  <div className="w-48 h-2 mx-auto rounded-full mt-1 opacity-50 transition-colors bg-slate-300 dark:bg-[#09090b]" />
                </div>
                <p className="text-center text-[9px] text-slate-500 dark:text-slate-600 font-bold uppercase tracking-[0.3em] opacity-40">Encrypted Connection Secured by Droppay Core</p>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
      @keyframes scan { 0% { transform: translateY(100%); } 100% { transform: translateY(-100%); } }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.01); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #6366f1, #a855f7); border-radius: 10px; }
      `}} />
    </div>
  );
};

export default Dashboard;