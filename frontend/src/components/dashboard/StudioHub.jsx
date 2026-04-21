import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, RotateCcw, Monitor, 
  Layers, ArrowRight,
  ShieldCheck, Activity, Terminal, ExternalLink,
  Volume2, Trash2, Heart, Trophy
} from 'lucide-react';
import { toast } from 'react-toastify';

// --- ATOMIC STUDIO COMPONENTS ---

const StudioPanel = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`relative bg-[#050505] border border-white/5 rounded-3xl overflow-hidden group/panel ${className}`}>
    <div className="absolute inset-0 blueprint-grid opacity-5 pointer-events-none" />
    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02] backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-emerald-500" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</span>
      </div>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
      </div>
    </div>
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

const EventActionBtn = ({ icon: Icon, onClick, color = "emerald", label }) => (
  <button 
    onClick={onClick}
    className={`p-2 rounded-xl border transition-all duration-300 flex items-center gap-2 group/btn
      ${color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 
        color === 'rose' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]' :
        'bg-white/5 border-white/10 text-white hover:bg-white/10'}
    `}
  >
    <Icon className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
    {label && <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>}
  </button>
);

const StudioHub = ({ user, recentDrops, socket }) => {
  const [activeScene, setActiveScene] = useState(user?.streamingSuite?.activeScene || 'primary');
  const [localEvents, setLocalEvents] = useState([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // Synchronize local events with prop events
    if (recentDrops) {
      setLocalEvents(recentDrops);
    }
  }, [recentDrops]);

  const handleReplay = (drop) => {
    socket.emit('trigger-alert', { 
      obsKey: user.obsKey, 
      eventData: {
        ...drop,
        isReplay: true,
        triggerTime: Date.now()
      }
    });
    toast.success(`Replaying ${drop.donorName}'s alert`, {
      style: { background: '#050505', color: '#10b981', border: '1px solid #10b98120' }
    });
  };

  const handleSwitchScene = (sceneId) => {
    setActiveScene(sceneId);
    socket.emit('switch-scene', { obsKey: user.obsKey, sceneId });
    toast.info(`Switched to scene: ${sceneId.toUpperCase()}`, {
      style: { background: '#050505', color: '#3b82f6', border: '1px solid #3b82f620' }
    });
  };

  const toggleLiveStatus = () => {
    setIsLive(!isLive);
    toast[isLive ? 'warning' : 'success'](isLive ? 'Live Session Terminated' : 'Streaming Suite Synchronized', {
      position: "top-center"
    });
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* --- STUDIO HEADER & STATUS --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-slate-700'}`} />
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isLive ? 'text-emerald-500' : 'text-slate-500'}`}>
                {isLive ? 'Session Active' : 'Offline Mode'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-600">ID: DROPE-HUB-{user?.streamerId?.slice(-6).toUpperCase()}</span>
          </div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
            Creator <span className="text-emerald-500">Studio</span>
          </h1>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={toggleLiveStatus}
            className={`px-8 py-4 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-500 border
              ${isLive ? 'bg-rose-500 border-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.3)] scale-105' : 'bg-white text-black border-white hover:bg-emerald-500 hover:border-emerald-500 hover:text-white'}
            `}
          >
            {isLive ? 'End Session' : 'Start Session'}
          </button>
          
          <button 
            onClick={() => window.open(`/overlay/${user.obsKey}`, '_blank')}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all group"
          >
            <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT: BROADCAST CONSOLE (EVENTS) --- */}
        <div className="lg:col-span-8 space-y-8">
          
          <StudioPanel title="Live Activity Feed" icon={Activity}>
            <div className="h-[600px] overflow-y-auto p-6 space-y-4 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {localEvents.length > 0 ? (
                  localEvents.map((drop, idx) => (
                    <motion.div
                      key={drop._id || idx}
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group/event"
                    >
                      <div className="flex justify-between items-center gap-4">
                        <div className="flex items-center gap-5">
                          {/* Event Icon/Sticker */}
                          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative">
                             <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover/event:opacity-50 transition-opacity" />
                             <Heart className="w-6 h-6 text-emerald-500" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-base font-black text-white italic uppercase tracking-tight">{drop.donorName}</h4>
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">
                                Tip
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium italic mt-0.5 line-clamp-1 opacity-80">
                              "{drop.message || 'No message attached'}"
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                             <span className="text-2xl font-black text-emerald-500 italic tracking-tighter">₹{drop.amount}</span>
                             <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-1">
                               {new Date(drop.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </p>
                          </div>

                          <div className="flex gap-2">
                            <EventActionBtn 
                              icon={RotateCcw} 
                              onClick={() => handleReplay(drop)} 
                              label="Replay" 
                            />
                            <EventActionBtn 
                              icon={Trophy} 
                              onClick={() => toast.info("Shoutout queued!")} 
                              color="rose"
                              label="Hype"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <Terminal className="w-16 h-16 text-slate-500 mb-6" />
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Waiting for live signals...</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="p-4 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest uppercase">
                Showing {localEvents.length} Recent Interactions
              </span>
              <button 
                onClick={() => setLocalEvents([])}
                className="text-[9px] font-black uppercase tracking-widest text-rose-500/50 hover:text-rose-500 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear Console
              </button>
            </div>
          </StudioPanel>
        </div>

        {/* --- RIGHT: CONTROL & PREVIEW --- */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Scene Orchestration */}
          <StudioPanel title="Scene Orchestration" icon={Layers}>
            <div className="p-6 grid grid-cols-1 gap-4">
              {[
                { id: 'primary', name: 'Main Gameplay', desc: 'Alerts + Goal Bar' },
                { id: 'chatting', name: 'Just Chatting', desc: 'Large Chat + Recent Tips' },
                { id: 'starting', name: 'Starting Soon', desc: 'Ambient Music + Hype' },
                { id: 'brb', name: 'Be Right Back', desc: 'Mini-Game + Status' }
              ].map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => handleSwitchScene(scene.id)}
                  className={`p-5 rounded-3xl border text-left transition-all duration-500 relative overflow-hidden group/scene
                    ${activeScene === scene.id ? 'bg-white border-white text-black translate-x-3 shadow-[0_20px_50px_rgba(255,255,255,0.1)]' : 'bg-white/[0.03] border-white/5 text-white hover:border-white/20'}
                  `}
                >
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-tighter mb-1">{scene.name}</h4>
                      <p className={`text-[9px] font-bold uppercase tracking-widest opacity-60 ${activeScene === scene.id ? 'text-black' : 'text-slate-400'}`}>
                        {scene.desc}
                      </p>
                    </div>
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover/scene:translate-x-1 ${activeScene === scene.id ? 'text-black' : 'text-emerald-500'}`} />
                  </div>
                  {activeScene === scene.id && (
                    <motion.div 
                      layoutId="scene-glow"
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent pointer-events-none" 
                    />
                  )}
                </button>
              ))}
            </div>
          </StudioPanel>

          {/* Rapid Action Pad */}
          <StudioPanel title="Rapid Action Pad" icon={Zap}>
            <div className="p-6 grid grid-cols-2 gap-4">
              <button 
                onClick={() => toast.info("Panic Mode Engaged - Hiding Overlays")}
                className="flex flex-col items-center justify-center p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all gap-2"
              >
                <ShieldCheck className="w-6 h-6" />
                <span className="text-[8px] font-black uppercase tracking-widest">Panic</span>
              </button>
              <button 
                onClick={() => toast.info("Hype Train Initiated!")}
                className="flex flex-col items-center justify-center p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all gap-2"
              >
                <Zap className="w-6 h-6" />
                <span className="text-[8px] font-black uppercase tracking-widest">Hype</span>
              </button>
              <button className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all gap-2">
                <Volume2 className="w-6 h-6" />
                <span className="text-[8px] font-black uppercase tracking-widest">Mute</span>
              </button>
              <button className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all gap-2">
                <RotateCcw className="w-6 h-6" />
                <span className="text-[8px] font-black uppercase tracking-widest">Reset</span>
              </button>
            </div>
          </StudioPanel>

          {/* Quick Monitoring */}
          <div className="p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent relative overflow-hidden group">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                 <Monitor className="w-5 h-5 text-emerald-500" />
               </div>
               <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">Stream Integrity</h4>
                  <p className="text-[8px] font-mono text-emerald-500/70 uppercase tracking-widest">Sync Grade: A+</p>
               </div>
             </div>
             <div className="space-y-3">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div animate={{ width: ['0%', '100%'] }} transition={{ duration: 2, repeat: Infinity }} className="h-full bg-emerald-500" />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-slate-500 uppercase tracking-tighter">
                   <span>Latency: 14ms</span>
                   <span>Uptime: 04:22:11</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudioHub;
