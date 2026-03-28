import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Trophy, Zap, ChevronUp, ChevronDown, Copy,
  ShieldAlert, CheckCircle2, LogOut, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProfileDropdown = ({ user, setIsProfileOpen, setActiveSection }) => {
  const navigate = useNavigate();
  const [isQuickLinksExpanded, setIsQuickLinksExpanded] = useState(false);

  const handleCopy = (linkLabel, value) => {
    navigator.clipboard.writeText(value);
    toast.success(`${linkLabel} Copied!`);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nexusTheme');
    localStorage.removeItem('dropeTheme');
    navigate('/login');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsProfileOpen(false)}
        className="fixed inset-0 z-40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="absolute right-0 mt-4 w-72 bg-white border border-black/10 rounded-none shadow-[var(--nexus-glow)] z-50 overflow-hidden"
      >
        {/* Blyss Header: Centered Identity */}
        <div className="p-6 pb-4 flex flex-col items-center border-b border-[var(--nexus-border)]/50">
          <div className="w-20 h-20 rounded-full bg-black/5 p-1 border border-[var(--nexus-border)] shadow-sm relative group overflow-hidden mb-3">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full bg-[#111111] flex items-center justify-center text-white font-black text-2xl italic tracking-tighter rounded-full">
                {(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors pointer-events-none" />
          </div>

          <h4 className="text-[14px] font-black uppercase italic tracking-tighter text-[#111111] leading-none mb-1">
            {user?.fullName || user?.username || 'User Identity'}
          </h4>
          <span className="text-[9px] font-mono font-bold text-black/40 uppercase tracking-widest">
            ID: @{user?.username || 'SYSTEM_NODE'}
          </span>
        </div>

        {/* Quick Stats: Balance & Tier */}
        <div className="grid grid-cols-2 border-b border-[var(--nexus-border)]/50 divide-x divide-[var(--nexus-border)]/50">
          <div className="p-3 text-center flex flex-col items-center">
            <span className="text-[8px] font-black uppercase tracking-widest text-black/30 mb-0.5">Balance</span>
            <span className="text-[10px] font-mono font-black text-[#111111]">
              ₹{(Number(user?.walletBalance) || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="p-3 text-center flex flex-col items-center">
            <span className="text-[8px] font-black uppercase tracking-widest text-black/30 mb-0.5">Node_Tier</span>
            <div className="flex items-center gap-1">
              <Trophy className={`w-2.5 h-2.5 ${user?.tier === 'legend' ? 'text-amber-500' : user?.tier === 'pro' ? 'text-indigo-500' : 'text-emerald-500'}`} />
              <span className="text-[10px] font-black uppercase italic tracking-tighter text-[#111111]">
                {user?.tier || 'Starter'}
              </span>
            </div>
          </div>
        </div>

        {/* Tactical Action Button (Expandable Toggle) */}
        <div className="p-4 border-b border-[var(--nexus-border)]/50">
          <button
            onClick={() => setIsQuickLinksExpanded(!isQuickLinksExpanded)}
            className="mx-auto block w-[85%] py-2.5 rounded-none bg-[#111111] text-white text-[10px] font-black uppercase italic tracking-[0.3em] flex flex-row items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98] shadow-lg"
          >
            <Zap className={`w-3 h-3 ${isQuickLinksExpanded ? 'text-amber-500' : 'text-[var(--nexus-accent)]'}`} />
            {isQuickLinksExpanded ? 'Hide Links' : 'Quick Links'}
            {isQuickLinksExpanded ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
          </button>

          <AnimatePresence>
            {isQuickLinksExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-2">
                  {[
                    { label: 'Donation Page', value: `${window.location.origin}/pay/${user?.username}` },
                    { label: 'Overlay Link', value: `${window.location.origin}/overlay/${user?.obsKey}` },
                    { label: 'Goal Link', value: `${window.location.origin}/goal/${user?.username}` },
                    { label: 'Master Link', value: `${window.location.origin}/overlay/master/${user?.obsKey}` }
                  ].map((link, idx) => (
                    <div key={idx} className="p-2 border border-black/5 bg-black/[0.02] flex items-center justify-between group">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[8px] font-black uppercase tracking-widest text-black/30 mb-0.5">{link.label}</span>
                        <span className="text-[9px] font-mono font-bold text-black/60 truncate pr-2">
                          {link.value.replace(/^https?:\/\//, '')}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(link.label, link.value)}
                        className="p-1.5 hover:bg-black hover:text-white transition-all border border-transparent hover:border-black active:scale-95"
                        title="Copy Link"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Menu Navigation */}
        <div className="p-1 space-y-0.5">
          {[
            ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Admin', icon: ShieldAlert, color: 'text-rose-500' }] : []),
            { id: 'profile', label: 'Profile', icon: User }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'admin') navigate('/admin/secure-portal');
                else setActiveSection(item.id);
                setIsProfileOpen(false);
              }}
              className="w-full p-2.5 rounded-none flex items-center justify-between group hover:bg-black/5 transition-all border border-transparent hover:border-black/5"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-none bg-black/5 border border-black/5 group-hover:border-black/10 transition-all">
                  <item.icon className="w-3 h-3 text-black/40 group-hover:text-black transition-colors" />
                </div>
                <span className={`text-[10px] font-black uppercase italic tracking-widest ${item.color || 'text-black/60'} group-hover:text-black transition-colors`}>
                  {item.label}
                </span>
              </div>
              <ArrowRight className="w-2.5 h-2.5 text-black/20 group-hover:text-black transition-all group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>

        {/* Payout Status Indicator */}
        <div className="px-4 py-2 border-t border-[var(--nexus-border)]/50 flex items-center justify-between bg-black/5">
          <span className="text-[8px] font-black uppercase tracking-widest text-black/30">Payout_Node</span>
          <div className="flex items-center gap-1">
            {user?.payoutSettings?.bankVerificationStatus === 'verified' ? (
              <>
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                <span className="text-[9px] font-black uppercase italic tracking-widest text-emerald-600">Active</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-2.5 h-2.5 text-amber-500" />
                <span className="text-[9px] font-black uppercase italic tracking-widest text-amber-600">Action</span>
              </>
            )}
          </div>
        </div>

        {/* Sign Out (Final Bottom Action) */}
        <div className="p-1 border-t border-[var(--nexus-border)]/50 bg-rose-500/5">
          <button
            onClick={handleSignOut}
            className="w-full p-2.5 rounded-none flex items-center gap-3 hover:bg-rose-500/10 transition-all text-rose-500 group border border-transparent hover:border-rose-500/20"
          >
            <div className="p-1.5 rounded-none bg-rose-500/10 border border-rose-500/10 group-hover:border-rose-500/20 transition-all">
              <LogOut className="w-3 h-3" />
            </div>
            <span className="text-[10px] font-black uppercase italic tracking-widest leading-none">
              Sign Out Node
            </span>
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default ProfileDropdown;
