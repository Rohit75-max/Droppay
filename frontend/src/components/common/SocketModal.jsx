import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, X, ArrowRight } from 'lucide-react';

const SocketModal = ({ isOpen, onClose, theme }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`absolute inset-0 backdrop-blur-md ${theme === 'dark' ? 'bg-black/40' : 'bg-slate-900/20'}`}
          />
          
          {/* Modal Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`w-full max-w-lg p-10 rounded-[3rem] border relative z-10 ${
              theme === 'dark' ? 'bg-[#0a0a0a] border-white/5 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'
            }`}
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2 text-[#10B981] mb-1">
                  <Cpu className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Support Request</span>
                </div>
                <h2 className={`text-3xl font-black italic uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Contact Us.
                </h2>
              </div>
              <button onClick={onClose} className="p-2 hover:rotate-90 transition-transform">
                <X className={`w-6 h-6 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 ml-2">Full Name</label>
                  <input type="text" placeholder="John Doe" className={`w-full p-4 rounded-xl border text-sm outline-none font-medium italic ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#10B981]' : 'bg-slate-50 border-slate-200 focus:border-[#10B981]'}`} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 ml-2">Username / Handle</label>
                  <input type="text" placeholder="@handle" className={`w-full p-4 rounded-xl border text-sm outline-none font-medium italic ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#10B981]' : 'bg-slate-50 border-slate-200 focus:border-[#10B981]'}`} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500 ml-2">Message</label>
                <textarea rows="4" placeholder="How can we help you?" className={`w-full p-4 rounded-xl border text-sm outline-none font-medium italic resize-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#10B981]' : 'bg-slate-50 border-slate-200 focus:border-[#10B981]'}`} />
              </div>

              <button type="submit" className="w-full bg-[#10B981] text-white py-4 rounded-xl font-black italic uppercase tracking-widest flex items-center justify-center gap-3 transition-all mt-4 hover:shadow-[0_0_20px_#10B981] active:scale-95">
                Submit Request <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SocketModal;