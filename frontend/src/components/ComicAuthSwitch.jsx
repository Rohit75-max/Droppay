import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ComicAuthSwitch = ({ active, brandColor = "#111111" }) => {
  const navigate = useNavigate();

  return (
    <div className="relative z-50">
      <div className="flex border-[5px] border-black p-1 bg-white shadow-[8px_8px_0px_#000]">
        <button 
          onClick={() => navigate('/login')}
          className={`w-[140px] py-3 font-black uppercase tracking-widest text-[11px] transition-all duration-300 ${active === 'login' ? 'text-white' : 'text-black hover:bg-black/5'}`}
          style={active === 'login' ? { backgroundColor: brandColor } : {}}
        >
          Login
        </button>
        <button 
          onClick={() => navigate('/signup')}
          className={`w-[140px] py-3 font-black uppercase tracking-widest text-[11px] transition-all duration-300 ${active === 'signup' ? 'text-white' : 'text-black hover:bg-black/5'}`}
          style={active === 'signup' ? { backgroundColor: brandColor } : {}}
        >
          Signup
        </button>
      </div>
    </div>
  );
};
