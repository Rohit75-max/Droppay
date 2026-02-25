import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    Users, Activity, ShieldAlert, ChevronLeft, ChevronRight,
    Search, Shield, ShieldOff, ArrowUpRight, Sun, Moon, Zap, Star,
    Wallet, Banknote, TrendingUp, Landmark, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminSecurePortal = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState(() => localStorage.getItem('dropPayTheme') || 'dark');
    const [metrics, setMetrics] = useState({
        totalUsers: 0, activeSubscriptions: 0, totalVolume: 0,
        totalUnsettledDebt: 0, platformCommission: 0, platformSubscriptions: 0, platformPayouts: 0
    });
    const [activeTab, setActiveTab] = useState('directory');
    const [payoutQueue, setPayoutQueue] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => { localStorage.setItem('dropPayTheme', theme); }, [theme]);
    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    const fetchMetrics = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/admin/metrics', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMetrics(res.data);
        } catch (err) {
            if (err.response?.status === 403 || err.response?.status === 401) navigate('/dashboard');
        }
    };

    const fetchNodes = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5001/api/admin/users?page=${page}&limit=50&search=${search}&role=${roleFilter}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNodes(res.data.nodes);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPayoutQueue = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/admin/payouts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPayoutQueue(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchMetrics();
        if (activeTab === 'directory') fetchNodes();
        if (activeTab === 'economy') fetchPayoutQueue();
    }, [page, search, roleFilter, activeTab]);

    const toggleBan = async (id, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'REINSTATE' : 'SUSPEND'} this node?`)) return;
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5001/api/admin/users/${id}/ban`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNodes(); // Refresh
        } catch (err) {
            alert(err.response?.data?.msg || "Moderation override failed.");
        }
    };

    const overrideTier = async (id, targetTier) => {
        if (!window.confirm(`Escalate node to ${targetTier.toUpperCase()}?`)) return;
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5001/api/admin/users/${id}/tier`, { targetTier }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNodes();
        } catch (err) {
            alert("Tier Override Failed");
        }
    };

    const overrideRole = async (id, targetRole) => {
        if (!window.confirm(`Are you certain you want to grant ${targetRole.toUpperCase()} clearance to this node?`)) return;
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5001/api/admin/users/${id}/role`, { targetRole }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNodes();
        } catch (err) {
            alert(err.response?.data?.msg || "Clearance Override Failed");
        }
    };

    const executeSettlement = async (id, amount) => {
        if (!window.confirm(`Mark ₹${amount} as officially SETTLED for this node?`)) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5001/api/admin/payouts/${id}/settle`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPayoutQueue();
            fetchMetrics();
        } catch (err) { alert("Settlement execution failed."); }
    };

    return (
        <div className={`min-h-screen w-full transition-colors duration-700 font-sans ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'}`}>

            {/* HEADER NAV */}
            <div className={`sticky top-0 z-50 w-full backdrop-blur-3xl border-b transition-colors ${theme === 'dark' ? 'border-white/5 bg-[#0a0a0a]/80' : 'border-slate-200 bg-white/80'}`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Zap className="w-8 h-8 text-[#10B981] fill-[#10B981]" />
                        <div>
                            <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Admin <span className="text-[#10B981]">Portal</span></h1>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Global Database Access</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={toggleTheme} className={`p-3 rounded-2xl border transition-all ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-white hover:bg-slate-50 shadow-sm'}`}>
                            {theme === 'dark' ? <Sun className="w-5 h-5 text-emerald-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
                        </button>
                        <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-[#10B981] hover:shadow-[0_0_20px_#10B981] text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all">
                            Exit Portal
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* TELEMETRY CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <div className={`p-6 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="flex items-center gap-3 mb-4 text-emerald-500">
                            <Users className="w-5 h-5" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Total Nodes</h2>
                        </div>
                        <p className="text-4xl font-black">{metrics.totalUsers.toLocaleString()}</p>
                    </div>
                    <div className={`p-6 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="flex items-center gap-3 mb-4 text-emerald-500">
                            <ArrowUpRight className="w-5 h-5" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Creator Gross (TPV)</h2>
                        </div>
                        <p className="text-4xl font-black">₹{metrics.totalVolume.toLocaleString()}</p>
                    </div>
                    <div className={`relative overflow-hidden p-6 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-[#10B981]/10 border-[#10B981]/20' : 'bg-emerald-50 border-emerald-100 shadow-sm'}`}>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4 text-emerald-600">
                                <TrendingUp className="w-5 h-5" />
                                <h2 className="text-xs font-black uppercase tracking-widest text-emerald-600/70">Master Commission Income</h2>
                            </div>
                            <p className="text-4xl font-black text-emerald-600">₹{metrics.platformCommission.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className={`p-6 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="flex items-center gap-3 mb-4 text-blue-500">
                            <Activity className="w-5 h-5" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Active Node Subscriptions</h2>
                        </div>
                        <p className="text-4xl font-black">{metrics.activeSubscriptions.toLocaleString()}</p>
                    </div>
                    <div className={`p-6 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100 shadow-sm'}`}>
                        <div className="flex items-center gap-3 mb-4 text-blue-600">
                            <Landmark className="w-5 h-5" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-blue-600/70">Master Subscription MRR</h2>
                        </div>
                        <p className="text-4xl font-black text-blue-600">₹{metrics.platformSubscriptions.toLocaleString()}</p>
                    </div>
                    <div className={`p-6 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-100 shadow-sm'}`}>
                        <div className="flex flex-col gap-1 mb-4 text-rose-600">
                            <div className="flex items-center gap-3">
                                <Wallet className="w-5 h-5" />
                                <h2 className="text-xs font-black uppercase tracking-widest text-rose-600/70">System Unsettled Debt</h2>
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <p className="text-4xl font-black text-rose-600">₹{metrics.totalUnsettledDebt.toLocaleString()}</p>
                            <p className="text-xs font-black uppercase tracking-widest text-rose-600/50 mb-1 absolute right-6">Settled: ₹{metrics.platformPayouts.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* TAB TOGGLES */}
                <div className={`flex items-center gap-4 mb-8 border-b pb-4 transition-colors ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'}`}>
                    <button onClick={() => setActiveTab('directory')} className={`px-6 py-2 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'directory' ? 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/20' : 'text-slate-500 hover:bg-slate-500/10'}`}>Global Directory</button>
                    <button onClick={() => setActiveTab('economy')} className={`px-6 py-2 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'economy' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-500/10'}`}>Financial Nexus</button>
                </div>

                {/* DATA VIEWER */}
                <AnimatePresence mode="wait">
                    {activeTab === 'directory' ? (
                        <motion.div key="directory" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`rounded-3xl border overflow-hidden transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className={`p-6 border-b flex flex-col gap-6 ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <h2 className="text-xl font-black italic uppercase tracking-tighter">Node Directory</h2>
                                    <div className="flex bg-slate-500/10 p-1 rounded-xl">
                                        {['all', 'admin', 'user'].map(r => (
                                            <button
                                                key={r}
                                                onClick={() => { setRoleFilter(r); setPage(1); }}
                                                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${roleFilter === r ? 'bg-[#10B981] text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                                            >
                                                {r === 'all' ? 'All Data' : r === 'admin' ? 'Admins' : 'Users'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative w-full">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search Alias, StreamerID, or Email..."
                                        value={search}
                                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                        className={`w-full py-3 pl-10 pr-4 rounded-xl text-sm font-bold outline-none border transition-all ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10 focus:border-[#10B981] text-white' : 'bg-slate-50 border-slate-200 focus:border-[#10B981] text-slate-900'}`}
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className={`text-[10px] uppercase font-black tracking-widest ${theme === 'dark' ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                                        <tr>
                                            <th className="px-6 py-4">Streamer Alias</th>
                                            <th className="px-6 py-4">Contact Node</th>
                                            <th className="px-6 py-4">TPV (₹)</th>
                                            <th className="px-6 py-4">Network Tier</th>
                                            <th className="px-6 py-4">Node Clearance</th>
                                            <th className="px-6 py-4 text-right">Moderation overrides</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="5" className="p-10 text-center text-slate-500 font-bold animate-pulse">Scanning Global Database...</td></tr>
                                        ) : nodes.map(node => {
                                            const isBanned = node.security?.accountStatus?.isBanned;
                                            return (
                                                <tr key={node._id} className={`border-b transition-colors ${theme === 'dark' ? 'border-white/5 hover:bg-white/[0.02]' : 'border-slate-100 hover:bg-slate-50'} ${isBanned ? (theme === 'dark' ? 'bg-rose-500/5' : 'bg-rose-50') : ''}`}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-base">{node.username}</span>
                                                                {node.role === 'admin' && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                                                            </div>
                                                            <span className="text-xs text-slate-500 font-mono">@{node.streamerId}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold">{node.email}</span>
                                                            <span className="text-xs text-slate-500">Refs: {node.referralCount || 0}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-mono font-bold text-[#10B981]">
                                                        {node.financialMetrics?.totalLifetimeEarnings?.toLocaleString() || 0}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <select
                                                            value={node.tier || 'none'}
                                                            onChange={(e) => overrideTier(node._id, e.target.value)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider outline-none border transition-colors cursor-pointer ${theme === 'dark' ? 'bg-white/10 text-white border-white/20' : 'bg-slate-100 text-slate-900 border-slate-200'}`}
                                                        >
                                                            <option value="none">Ghost</option>
                                                            <option value="starter">Starter (85%)</option>
                                                            <option value="pro">Pro (90%)</option>
                                                            <option value="legend">Legend (95%)</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <select
                                                            value={node.role || 'user'}
                                                            onChange={(e) => overrideRole(node._id, e.target.value)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider outline-none border transition-colors cursor-pointer ${theme === 'dark' ? (node.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-white/10 text-white border-white/20') : (node.role === 'admin' ? 'bg-amber-100 text-amber-600 border-amber-200' : 'bg-slate-100 text-slate-900 border-slate-200')}`}
                                                        >
                                                            <option value="user">Standard User</option>
                                                            <option value="admin">Administrator</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => toggleBan(node._id, isBanned)}
                                                            className={`px-4 py-2 flex items-center gap-2 ml-auto rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isBanned ? 'bg-slate-500 text-white hover:bg-slate-600' : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white'}`}
                                                        >
                                                            {isBanned ? <ShieldOff className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                                            {isBanned ? 'Reinstate' : 'Suspend'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* PAGINATION */}
                            <div className={`p-4 border-t flex items-center justify-between ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 rounded-xl border border-transparent hover:border-slate-500/20 disabled:opacity-50 transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-2 rounded-xl border border-transparent hover:border-slate-500/20 disabled:opacity-50 transition-all"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="economy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`rounded-3xl border overflow-hidden transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className={`p-6 border-b flex items-center justify-between ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                                <h2 className="text-xl font-black italic uppercase tracking-tighter text-rose-500">Pending Settlements Matrix</h2>
                                <span className="text-xs font-black uppercase tracking-widest text-slate-500">{payoutQueue.length} Nodes in Queue</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className={`text-[10px] uppercase font-black tracking-widest ${theme === 'dark' ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                                        <tr>
                                            <th className="px-6 py-4">Node Alias</th>
                                            <th className="px-6 py-4">Network Tier</th>
                                            <th className="px-6 py-4">Total Settled (Lifetime)</th>
                                            <th className="px-6 py-4 text-rose-500">Requested Payout (Pending)</th>
                                            <th className="px-6 py-4 text-right">Execution Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payoutQueue.length === 0 ? (
                                            <tr><td colSpan="5" className="p-10 text-center text-slate-500 font-bold">No nodes currently awaiting settlement.</td></tr>
                                        ) : payoutQueue.map(node => (
                                            <tr key={node._id} className={`border-b transition-colors ${theme === 'dark' ? 'border-white/5 hover:bg-white/[0.02]' : 'border-slate-100 hover:bg-slate-50'}`}>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-base">{node.username}</span>
                                                        <span className="text-xs text-slate-500 font-mono">@{node.streamerId}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`}>{node.tier || 'Ghost'}</span>
                                                </td>
                                                <td className="px-6 py-4 font-mono font-bold text-emerald-500">
                                                    ₹{node.financialMetrics?.totalSettled?.toLocaleString() || 0}
                                                </td>
                                                <td className="px-6 py-4 font-mono font-bold text-rose-500">
                                                    ₹{node.financialMetrics?.pendingPayouts?.toLocaleString() || 0}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => executeSettlement(node._id, node.financialMetrics?.pendingPayouts || 0)}
                                                        className="px-4 py-2 flex items-center gap-2 ml-auto rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-[#10B981] hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Execute & Mark Settled
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default AdminSecurePortal;
