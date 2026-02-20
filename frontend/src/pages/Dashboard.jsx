import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Wallet, Link as LinkIcon, Copy, 
  CheckCircle, ShieldAlert, LogOut, Settings, 
  UserCircle, HelpCircle, Zap, ChevronRight,
  Play, Loader2, Trophy, TrendingUp, Target, RefreshCw,
  Mail, Info, MessageSquare, BarChart3, Camera, Save, Edit3, User, Hash, Phone, Mail as MailIcon,
  CreditCard, Plus, BadgeCheck, BellRing, X, Landmark, ShieldCheck
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

  // --- Live Notification State ---
  const [notification, setNotification] = useState(null);

  // --- Analytics States ---
  const [timeRange, setTimeRange] = useState('7D'); 
  const [chartData, setChartData] = useState([40, 70, 45, 90, 65, 85, 100]); // Demo data

  // --- Account Edit State ---
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: "", phone: "", streamerId: "" });
  const [profilePreview, setProfilePreview] = useState(null);

  // --- Bank & Settlement State ---
  const [isLinkingBank, setIsLinkingBank] = useState(false);
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);

  const [isUpdatingGoal, setIsUpdatingGoal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [goalForm, setGoalForm] = useState({ title: "", targetAmount: 0 });

  const stickerMap = { zap: '⚡', fire: '🔥', heart: '💖', crown: '👑', rocket: '🚀' };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");
        const res = await axios.get('http://localhost:5001/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setEditForm({ 
          username: res.data.username, 
          phone: res.data.phone || "", 
          streamerId: res.data.streamerId 
        });
        setGoalForm({
          title: res.data.goalSettings?.title || "New Stream Equipment",
          targetAmount: res.data.goalSettings?.targetAmount || 5000
        });
        fetchAnalytics(res.data.streamerId);
        fetchChartData(res.data.streamerId, timeRange);
      } catch (err) { setError(true); }
    };
    fetchProfile();
  }, [timeRange]);

  // --- Logic to check for new drops and show notification ---
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
      await axios.put('http://localhost:5001/api/user/update-goal', goalForm, {
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

  // --- Start Razorpay Route Onboarding ---
  const handleBankLink = async () => {
    setIsLinkingBank(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5001/api/payment/create-payout-account', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.onboardingUrl) {
        window.open(res.data.onboardingUrl, '_blank'); // Opens Razorpay portal in new tab
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
      setIsEditing(false);
      alert("Profile successfully updated!");
    } catch (err) { alert("Failed to save profile."); }
  };

  if (error) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-6 text-center font-sans">
      <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
      <button onClick={() => navigate('/login')} className="mt-6 bg-indigo-600 px-8 py-3 rounded-2xl font-bold font-sans">Return to Login</button>
    </div>
  );

  if (!user) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-slate-500 font-black animate-pulse font-sans uppercase tracking-widest">Syncing Hub...</div>;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'accounts', label: 'Accounts', icon: UserCircle },
    { id: 'settings', label: 'Control Center', icon: Settings },
    { id: 'help', label: 'Help Center', icon: HelpCircle },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
      
      {/* LIVE NOTIFICATION TOAST */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="fixed top-8 right-8 z-[200] w-80 bg-[#111]/90 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-5 shadow-[0_0_40px_rgba(99,102,241,0.2)] flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40">
              <BellRing className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-0.5">New Drop Received</p>
              <p className="text-sm font-black text-white truncate italic">{notification.donorName} dropped ₹{notification.amount}</p>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-500 hover:text-white p-1"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR (DESKTOP) */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] hidden lg:flex flex-col p-6 fixed h-full z-50">
        <div className="flex items-center gap-3 mb-10 px-2">
          <Zap className="w-7 h-7 text-indigo-500 fill-indigo-500" />
          <span className="text-xl font-black italic tracking-tighter italic">DropPay</span>
        </div>
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              className={`w-full group flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${activeSection === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
              <div className="flex items-center gap-3"><item.icon className="w-4 h-4" />{item.label}</div>
              <ChevronRight className={`w-3 h-3 ${activeSection === item.id ? 'opacity-100' : 'opacity-0'}`} />
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 text-red-500/70 hover:text-red-500 font-bold mt-auto transition-colors font-sans"><LogOut className="w-4 h-4" /> Logout</button>
      </aside>

      {/* MOBILE NAV */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-2xl border-t border-white/5 z-[100] px-4 py-2.5">
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

      <main className="flex-1 lg:ml-64 p-6 lg:p-10 mb-20 lg:mb-0">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 font-sans">
          <div><h1 className="text-2xl font-black tracking-tight mb-0.5 uppercase italic">{activeSection}</h1>
          <p className="text-slate-500 text-[11px] font-medium italic">Active Streamer: <span className="text-indigo-400 font-mono font-bold tracking-wider">@{user.streamerId}</span></p></div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button onClick={triggerTestDrop} disabled={isTesting} className="flex-1 sm:flex-none bg-indigo-600 text-white px-4 py-2 rounded-lg font-black italic flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all text-xs shadow-lg font-sans">
               {isTesting ? <Loader2 className="animate-spin w-3 h-3" /> : <Play className="w-3 h-3 fill-white" />} TEST DROP
            </button>
            <div className="bg-[#111] px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" /><span className="text-[9px] font-black uppercase text-green-500 tracking-widest font-sans">Live</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={activeSection} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}>
            
            {activeSection === 'dashboard' && (
              <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8 space-y-6">
                  {/* Revenue Balance Card */}
                  <motion.div whileHover={{ y: -4 }} className="bg-[#111] border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2 mb-4"><Wallet className="w-4 h-4 text-green-500" /><span className="text-[10px] uppercase font-black tracking-widest text-slate-500 font-sans">Withdrawable Balance</span></div>
                      {user.walletBalance > 0 && (
                        <button onClick={handleWithdrawRequest} disabled={isProcessingWithdraw} className="bg-indigo-600/10 text-indigo-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all">
                          {isProcessingWithdraw ? <Loader2 className="animate-spin w-3 h-3" /> : 'Payout'}
                        </button>
                      )}
                    </div>
                    <h2 className="text-5xl lg:text-7xl font-black italic tracking-tighter">₹{user.walletBalance || '0.00'}</h2>
                    <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-indigo-600/5 rounded-full blur-[90px]" />
                  </motion.div>

                  {/* MODERN ANALYTICS CHART */}
                  <div className="bg-[#111] border border-white/5 rounded-[2rem] p-6 lg:p-8 shadow-2xl overflow-hidden group relative">
                    <div className="flex justify-between items-center mb-10 relative z-20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg"><BarChart3 className="w-5 h-5 text-indigo-500" /></div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans">Revenue Stream</h3>
                      </div>
                      <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 backdrop-blur-sm">
                        {['7D', '1M', '1Y'].map((range) => (
                          <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black transition-all ${timeRange === range ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-600 hover:text-slate-300'}`}>
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="h-48 w-full flex items-end justify-between gap-2 relative px-2">
                      <div className="absolute inset-0 flex flex-col justify-between opacity-5 pointer-events-none border-b border-white/10">
                        {[1, 2, 3].map(i => <div key={i} className="w-full border-t border-white" />)}
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
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[8px] font-black px-2 py-1 rounded-md opacity-0 group-hover/bar:opacity-100 transition-all transform translate-y-2 group-hover/bar:translate-y-0 whitespace-nowrap z-30 shadow-xl border border-white/20">
                            ₹{val.toLocaleString()}
                          </div>
                          
                          <motion.div 
                            initial={{ height: 0 }} 
                            animate={{ height: `${Math.max(val / 20, 10)}%` }} 
                            className="w-full max-w-[32px] bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg shadow-[0_0_20px_rgba(99,102,241,0.15)] group-hover/bar:shadow-[0_0_25px_rgba(99,102,241,0.4)] group-hover/bar:from-indigo-400 group-hover/bar:to-pink-500 transition-all duration-300 relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-white/10 -translate-y-full group-hover/bar:animate-[scan_1.5s_infinite] pointer-events-none" />
                          </motion.div>
                          <span className="text-[7px] font-black text-slate-600 group-hover/bar:text-slate-400 transition-colors uppercase tracking-widest">
                            {timeRange === '7D' ? `Day ${i+1}` : `P${i+1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Goal Card */}
                  <div className="bg-[#111] border border-white/5 rounded-[2rem] p-6 lg:p-8 shadow-2xl font-sans">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3"><Target className="w-4 h-4 text-amber-500" /><h3 className="text-[10px] font-black italic uppercase tracking-widest text-slate-500">Goal Status</h3></div>
                        <span className="text-xs font-black italic text-indigo-400">{getProgressPercentage().toFixed(1)}%</span>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-end gap-3"><span className="text-sm font-black italic uppercase text-white truncate">{user.goalSettings?.title}</span> <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">₹{user.goalSettings?.currentProgress} / ₹{user.goalSettings?.targetAmount}</span></div>
                        <div className="w-full bg-white/5 h-2 rounded-full border border-white/5 overflow-hidden"><motion.div animate={{ width: `${getProgressPercentage()}%` }} className="h-full bg-gradient-to-r from-indigo-600 to-amber-500" /></div>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-6">
                  <div className="bg-[#111] border border-white/5 rounded-[2rem] p-6 shadow-2xl flex flex-col max-h-[400px]">
                      <h3 className="text-[10px] font-black italic mb-6 uppercase flex items-center gap-2 font-sans"><Trophy className="w-4 h-4 text-amber-400" /> Hall of Fame</h3>
                      <div className="space-y-5 overflow-y-auto pr-2 custom-scrollbar font-sans">
                          {topDonors.map((donor, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black italic text-[9px] ${idx === 0 ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20' : 'bg-white/5 text-slate-500'}`}>#{idx + 1}</div>
                                  <div className="flex-1 min-w-0"><div className="flex justify-between items-end mb-1"><p className="font-black text-[9px] uppercase tracking-widest text-white truncate">{donor._id}</p><p className="font-black text-indigo-400 italic text-[9px]">₹{donor.total}</p></div>
                                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden shadow-inner"><motion.div initial={{ width: 0 }} animate={{ width: topDonors[0]?.total > 0 ? `${(donor.total / topDonors[0].total) * 100}%` : '0%' }} className="h-full bg-indigo-500" /></div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 shadow-2xl flex flex-col h-[350px]">
                      <h3 className="text-[10px] font-black italic mb-6 uppercase flex items-center gap-2 text-slate-500 font-sans"><TrendingUp className="w-4 h-4 text-indigo-500" /> Recent Drops</h3>
                      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar font-sans">
                          {recentDrops.length > 0 ? recentDrops.map((drop, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                  <div className="flex items-center gap-3"><div className="text-lg">{stickerMap[drop.sticker] || '💎'}</div>
                                      <div className="min-w-0"><p className="font-black text-white italic text-[10px] truncate">{drop.donorName}</p><p className="text-[8px] text-slate-500 truncate italic truncate font-sans">"{drop.message}"</p></div>
                                  </div><p className="font-black text-indigo-400 italic text-[10px]">₹{drop.amount}</p>
                              </div>
                          )) : <div className="text-center py-10 opacity-20 font-black text-[9px] uppercase italic font-sans">No Drops...</div>}
                      </div>
                  </div>
                </div>
              </div>
            )}

            {/* IDENTITY HUB & RAZORPAY SETTLEMENT */}
            {activeSection === 'accounts' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
                <div className="lg:col-span-8 bg-[#111] border border-white/5 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
                    <div className="relative group/avatar">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-500/10 border-2 border-dashed border-indigo-500/30 flex items-center justify-center overflow-hidden transition-all group-hover/avatar:border-indigo-500">
                          {profilePreview ? <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-indigo-500/50" />}
                          <button onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                            <Camera className="w-6 h-6 text-white" />
                          </button>
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} accept="image/*" />
                    </div>
                    <div className="flex-1 space-y-4 font-sans">
                      <div className="flex items-center justify-between">
                         <h2 className="text-2xl font-black uppercase italic tracking-widest text-white">Identity Hub</h2>
                         <button onClick={() => isEditing ? saveProfileUpdates() : setIsEditing(true)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-white transition-all font-sans">
                            {isEditing ? <><Save className="w-3 h-3" /> Save Hub</> : <><Edit3 className="w-3 h-3" /> Update Profile</>}
                         </button>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[9px] font-black uppercase w-fit border border-green-500/20"><BadgeCheck className="w-3 h-3" /> Verified Creator</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-8 border-t border-white/5 font-sans">
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-600 ml-1"><User className="w-3 h-3" /> Full Name</label>
                      {isEditing ? <input value={editForm.username} onChange={(e) => setEditForm({...editForm, username: e.target.value})} className="w-full bg-black/50 border border-white/5 rounded-xl p-3 text-xs font-bold text-white outline-none" /> : <p className="text-sm font-black italic text-slate-200 ml-1">{user.username}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-600 ml-1"><Hash className="w-3 h-3" /> Streamer ID</label>
                      {isEditing ? <input value={editForm.streamerId} onChange={(e) => setEditForm({...editForm, streamerId: e.target.value})} className="w-full bg-black/50 border border-white/5 rounded-xl p-3 text-xs font-bold text-white outline-none" /> : <p className="text-sm font-mono font-bold text-indigo-400 ml-1">@{user.streamerId}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-600 ml-1"><MailIcon className="w-3 h-3" /> Email</label>
                      <p className="text-sm font-bold text-slate-400 ml-1">{user.email}</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-600 ml-1"><Phone className="w-3 h-3" /> Contact</label>
                      {isEditing ? <input value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="w-full bg-black/50 border border-white/5 rounded-xl p-3 text-xs font-bold text-white outline-none" /> : <p className="text-sm font-bold text-slate-200 ml-1">{user.phone || "Not linked"}</p>}
                    </div>
                  </div>
                </div>

                {/* BANKING HUB - RAZORPAY ONBOARDING */}
                <div className="lg:col-span-4 bg-[#111] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl flex flex-col font-sans relative overflow-hidden group">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500"><Landmark className="w-6 h-6" /></div>
                    <h3 className="text-sm font-black uppercase italic tracking-widest">Banking Hub</h3>
                  </div>
                  
                  <div className="space-y-6 flex-1 z-10">
                    {user.razorpayAccountId ? (
                      <div className="space-y-4">
                        <div className="bg-green-500/5 border border-green-500/20 p-5 rounded-2xl flex items-center gap-4">
                           <ShieldCheck className="w-8 h-8 text-green-500" />
                           <div>
                              <p className="text-[10px] font-black uppercase text-green-500">Verified Account</p>
                              <p className="text-xs font-bold text-slate-400">{user.razorpayAccountId.slice(0, 8)}***</p>
                           </div>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed italic">Your account is ready. Revenue is split automatically (90/10) via Razorpay Route.</p>
                      </div>
                    ) : (
                      <>
                        <div className="bg-black/40 border border-white/10 p-5 rounded-2xl border-dashed">
                          <div className="flex items-center gap-3 mb-2"><CreditCard className="w-4 h-4 text-slate-500" /><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Payout Security</p></div>
                          <p className="text-xs text-slate-600 italic">Account verification required.</p>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed italic">Link your account via Razorpay Route to enable safe, automatic revenue settlements.</p>
                        <button onClick={handleBankLink} disabled={isLinkingBank} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase italic text-[11px] mt-4 hover:bg-slate-200 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
                           {isLinkingBank ? <Loader2 className="animate-spin w-4 h-4" /> : <><Plus className="w-4 h-4" /> Connect Bank Account</>}
                        </button>
                      </>
                    )}
                  </div>
                  <Landmark className="absolute -bottom-10 -right-10 w-32 h-32 text-white/[0.02] -rotate-12" />
                </div>
              </div>
            )}

            {/* CONTROL CENTER */}
            {activeSection === 'settings' && (
              <div className="space-y-6 max-w-4xl mx-auto font-sans">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#111] p-8 lg:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="flex justify-between items-center mb-8"><div className="flex items-center gap-4"><Target className="w-5 h-5 text-indigo-500" /><h3 className="text-lg font-black uppercase italic tracking-widest">Goal Hub</h3></div>
                        <button onClick={resetGoalProgress} disabled={isResetting} className="text-[9px] font-black text-red-500/50 hover:text-red-500 flex items-center gap-1 uppercase disabled:opacity-50">
                            {isResetting ? <Loader2 className="animate-spin w-3 h-3" /> : <RefreshCw className="w-3 h-3" />} Reset
                        </button>
                    </div>
                    <form onSubmit={updateGoalSettings} className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-1.5"><label className="text-[8px] font-black uppercase text-slate-600 ml-2">Mission Title</label><input type="text" value={goalForm.title} onChange={(e) => setGoalForm({...goalForm, title: e.target.value})} className="w-full bg-black/50 border border-white/5 rounded-xl p-3.5 text-white font-bold text-xs" /></div><div className="space-y-1.5"><label className="text-[8px] font-black uppercase text-slate-600 ml-2">Target Amount</label><input type="number" value={goalForm.targetAmount} onChange={(e) => setGoalForm({...goalForm, targetAmount: e.target.value})} className="w-full bg-black/50 border border-white/5 rounded-xl p-3.5 text-white font-bold text-xs" /></div><button type="submit" disabled={isUpdatingGoal} className="md:col-span-2 bg-indigo-600 py-4 rounded-xl font-black uppercase italic hover:bg-indigo-500 transition-all text-xs font-sans">{isUpdatingGoal ? <Loader2 className="animate-spin mx-auto w-4 h-4" /> : "Deploy mission"}</button></form>
                </motion.div>
                <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl space-y-6">
                    <div className="flex items-center gap-3 text-slate-400 font-black uppercase tracking-widest text-[10px]"><LinkIcon className="w-4 h-4" /> Setup URLs</div>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { id: 'public', label: 'Payment Hub', color: 'text-indigo-500', url: `/pay/${user.streamerId}` },
                        { id: 'overlay', label: 'Alert Overlay', color: 'text-purple-500', url: `/overlay/${user.obsKey}` },
                        { id: 'goal', label: 'Goal Bar', color: 'text-amber-500', url: `/goal/${user.streamerId}` }
                      ].map((link) => (
                        <div key={link.id} className="bg-[#050505] border border-white/5 rounded-xl p-5 flex items-center justify-between group">
                          <div className="flex flex-col min-w-0"><span className={`text-[8px] ${link.color} font-black uppercase tracking-widest mb-1`}>{link.label}</span><code className="text-[11px] text-slate-400 font-bold truncate pr-4 font-sans">{window.location.origin}{link.url}</code></div>
                          <button onClick={(e) => copyToClipboard(e, `${window.location.origin}${link.url}`, link.id)} className={`p-2 rounded-lg transition-all ${copiedType === link.id ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-slate-400 hover:text-white'}`}>{copiedType === link.id ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
                        </div>
                      ))}
                    </div>
                </div>
              </div>
            )}
            
            {/* HELP & FEEDBACK SECTION */}
            {activeSection === 'help' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto font-sans">
                {[{ icon: Mail, title: "Support" }, { icon: Info, title: "Docs" }, { icon: Zap, title: "Status" }].map((h, i) => (
                  <div key={i} className="bg-[#111] p-8 rounded-[2rem] border border-white/5 text-center shadow-xl hover:scale-105 transition-transform cursor-pointer"><div className={`w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-6 text-indigo-500`}><h.icon className="w-6 h-6" /></div><h4 className="font-black text-[10px] uppercase italic tracking-wider font-sans">{h.title}</h4></div>
                ))}
              </div>
            )}

            {activeSection === 'feedback' && (
              <div className="bg-[#111] p-10 rounded-[2.5rem] border border-white/5 max-w-2xl mx-auto shadow-2xl text-center font-sans">
                <h3 className="text-xl font-black mb-4 uppercase italic">Feedback Hub</h3><div className="space-y-6"><textarea placeholder="Insights..." className="w-full bg-black/50 border border-white/5 rounded-2xl p-6 focus:border-indigo-500 outline-none min-h-[150px] resize-none text-[11px] italic font-sans"></textarea><button className="w-full bg-indigo-600 py-4 rounded-2xl font-black text-xs uppercase italic font-sans">Submit</button></div>
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