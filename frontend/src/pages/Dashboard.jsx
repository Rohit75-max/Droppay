import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  LayoutDashboard, Settings, UserCircle, Trophy, HelpCircle, 
  MessageSquare, Zap, ChevronRight, LogOut, Sun, Moon, 
  ShieldAlert, Activity, Menu, X, Play, Loader2 
} from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

// Component Imports
import DashboardSummary from '../components/DashboardSummary';
import ControlCenter from '../components/ControlCenter';
import AccountsHub from '../components/AccountsHub';
import GrowthMissions from '../components/GrowthMissions';
import HelpCenter from '../components/HelpCenter';
import FeedbackStation from '../components/FeedbackStation';

const navItems = [
  { id: 'dashboard', label: 'Nexus', icon: LayoutDashboard },
  { id: 'settings', label: 'Control', icon: Settings },
  { id: 'accounts', label: 'Identity', icon: UserCircle },
  { id: 'growth', label: 'Growth', icon: Trophy },
  { id: 'help', label: 'Support', icon: HelpCircle },
  { id: 'feedback', label: 'Signal', icon: MessageSquare },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dropPayTheme') || 'dark';
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [recentDrops, setRecentDrops] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState('7D');
  const [isTesting, setIsTesting] = useState(false);
  
  const [goalForm, setGoalForm] = useState({ title: '', targetAmount: 0, showOnDashboard: true });
  const [editForm, setEditForm] = useState({ username: '', bio: '', streamerId: '' });
  const [alertConfig, setAlertConfig] = useState({ ttsEnabled: false });

  // SHARED STATES FOR CONTROL & COPY
  const [isUpdatingGoal, setIsUpdatingGoal] = useState(false);
  const [copiedType, setCopiedType] = useState(null);

  // NEW: FEEDBACK PROTOCOL STATES
  const [feedbackType, setFeedbackType] = useState('general');
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    localStorage.setItem('dropPayTheme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const fetchProfileData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      
      const res = await axios.get('http://localhost:5001/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(res.data);
      setGoalForm({
        title: res.data.goalSettings?.title || "New Mission",
        targetAmount: res.data.goalSettings?.targetAmount || 0,
        showOnDashboard: res.data.goalSettings?.showOnDashboard ?? true
      });
      setEditForm({
        username: res.data.username || "",
        bio: res.data.bio || "",
        streamerId: res.data.streamerId || ""
      });
      if (res.data.overlaySettings) setAlertConfig(res.data.overlaySettings);

      const [recent, top, stats] = await Promise.all([
        axios.get(`http://localhost:5001/api/payment/recent/${res.data.streamerId}`),
        axios.get(`http://localhost:5001/api/payment/top/${res.data.streamerId}`),
        axios.get(`http://localhost:5001/api/payment/analytics/${res.data.streamerId}?range=${timeRange}`)
      ]);

      setRecentDrops(recent.data);
      setTopDonors(top.data);
      setChartData(stats.data.points || [10, 20, 15, 30, 25, 40, 35]);
      setError(null);
      setLoading(false);
    } catch (err) { 
      setError("Uplink Failure: Node connection lost.");
      setLoading(false);
    }
  }, [navigate, timeRange]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const updateGoalSettings = async () => {
    setIsUpdatingGoal(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/user/update-goal', goalForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchProfileData();
      alert("Mission Deployed Successfully");
    } catch (err) {
      console.error("Goal update failed", err);
    } finally {
      setIsUpdatingGoal(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const triggerTestDrop = async () => {
    setIsTesting(true);
    try {
      await axios.post('http://localhost:5001/api/payment/test-drop', { 
        streamerId: user.streamerId, amount: 500, donorName: "DropPay Tester", sticker: "zap"
      });
      await fetchProfileData();
    } catch (err) { console.error("Test failed"); } 
    finally { setIsTesting(false); }
  };

  const getProgressPercentage = () => {
    if (!user?.goalSettings?.targetAmount) return 0;
    return Math.min((user.goalSettings.currentProgress / user.goalSettings.targetAmount) * 100, 100);
  };

  if (loading) return (
    <div className="h-screen bg-[#050505] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-[#10B981] animate-spin" />
        <Activity className="w-6 h-6 text-[#10B981] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#10B981] animate-pulse">Syncing Network</span>
    </div>
  );

  if (error) return (
    <div className="h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
      <ShieldAlert className="w-16 h-16 text-rose-500 mb-6 animate-bounce" />
      <h2 className="text-xl font-black uppercase italic text-white mb-2">{error}</h2>
      <button onClick={() => window.location.reload()} className="bg-[#10B981] text-black px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
        Restart Handshake
      </button>
    </div>
  );

  return (
    <div className={`h-screen flex flex-col lg:flex-row overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* SIDEBAR */}
      <aside className={`hidden lg:flex w-20 hover:w-64 group transition-all duration-500 flex-col py-8 border-r ${theme === 'dark' ? 'border-white/5 bg-[#080808]' : 'border-slate-200 bg-white'} z-50`}>
        <div className="flex items-center px-6 mb-12 gap-4">
          <Zap className="w-8 h-8 text-[#10B981] flex-shrink-0" />
          <span className="text-xl font-black italic tracking-tighter opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">DropPay</span>
        </div>
        <nav className="flex-1 space-y-2 px-4">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveSection(item.id)} className={`w-full flex items-center justify-between gap-4 p-3 rounded-2xl transition-all ${activeSection === item.id ? 'bg-[#10B981] text-black shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}>
              <div className="flex items-center gap-4">
                <item.icon className="w-6 h-6 flex-shrink-0" />
                <span className="font-black italic uppercase text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">{item.label}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-all ${activeSection === item.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
            </button>
          ))}
        </nav>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="px-7 py-4 text-rose-500 flex items-center gap-4 hover:text-rose-400 transition-colors">
          <LogOut className="w-6 h-6 flex-shrink-0" />
          <span className="font-black italic uppercase text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">Exit</span>
        </button>
      </aside>

      {/* MOBILE HEADER */}
      <header className={`lg:hidden fixed top-0 left-0 right-0 h-20 px-6 flex justify-between items-center z-[100] backdrop-blur-xl border-b transition-colors ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'}`}>
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-[#10B981]" />
          <span className={`text-xl font-black italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>DropPay</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-3 rounded-2xl bg-[#10B981] text-black shadow-lg">
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className={`fixed inset-0 z-[150] p-10 flex flex-col lg:hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-white text-slate-900'}`}>
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-2">
                <Zap className="w-10 h-10 text-[#10B981]" />
                <span className={`text-2xl font-black italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>DropPay</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className={theme === 'dark' ? 'text-white' : 'text-slate-900'}><X className="w-8 h-8" /></button>
            </div>
            <div className="space-y-4">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => { setActiveSection(item.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center justify-between py-5 text-2xl font-black italic uppercase border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'} transition-all ${activeSection === item.id ? 'text-[#10B981]' : 'text-slate-500'}`}>
                  <div className="flex items-center gap-6"><item.icon className="w-8 h-8" /> {item.label}</div>
                  <ChevronRight className={`w-6 h-6 ${activeSection === item.id ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              ))}
            </div>
            <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className={`mt-auto py-5 text-rose-500 font-black italic uppercase text-xl flex items-center gap-4 border-t ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}><LogOut className="w-8 h-8" /> Exit Protocol</button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col relative overflow-hidden pt-20 lg:pt-0">
        <header className="px-6 py-6 md:px-12 md:py-8 flex justify-between items-center z-40">
          <h1 className={`text-2xl md:text-3xl font-black italic uppercase tracking-tighter leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {activeSection} <span className="text-[#10B981]">Nexus.</span>
          </h1>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-3 rounded-2xl border border-white/5 bg-white/5 text-slate-500 hover:text-[#10B981] transition-all">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-12 pb-12">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="max-w-6xl mx-auto w-full flex flex-col items-center">
              <div className={`w-full ${activeSection === 'dashboard' ? '' : 'max-w-4xl'}`}>
                {activeSection === 'dashboard' && (
                  <DashboardSummary {...{ 
                    theme, user, chartData, timeRange, setTimeRange, 
                    recentDrops, topDonors, getProgressPercentage, 
                    handleWithdrawRequest: () => {}, isProcessingWithdraw: false,
                    triggerTestDrop, isTesting, Play 
                  }} />
                )}
                {activeSection === 'settings' && (
                  <ControlCenter 
                    theme={theme} user={user} 
                    goalForm={goalForm} setGoalForm={setGoalForm} 
                    updateGoalSettings={updateGoalSettings} 
                    isUpdatingGoal={isUpdatingGoal}
                    alertConfig={alertConfig} setAlertConfig={setAlertConfig} 
                    partnerStickers={[]} 
                    copyToClipboard={copyToClipboard} 
                    copiedType={copiedType}
                    triggerTestDrop={triggerTestDrop} 
                    isTesting={isTesting}
                  />
                )}
                {activeSection === 'accounts' && <AccountsHub theme={theme} user={user} editForm={editForm} setEditForm={setEditForm} setIsEditing={() => {}} />}
                {activeSection === 'growth' && <GrowthMissions theme={theme} user={user} copyToClipboard={copyToClipboard} copiedType={copiedType} />}
                {activeSection === 'help' && <HelpCenter theme={theme} user={user} />}
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
      <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }` }} />
    </div>
  );
};

export default Dashboard;