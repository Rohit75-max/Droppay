import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const ComicBackLink = ({ to = "/login", text = "Back to Login" }) => {
  return (
    <div className="relative z-50">
      <Link 
        to={to}
        className="group flex items-center gap-4 bg-white border-[5px] border-black px-6 py-3 shadow-[8px_8px_0px_#000] rotate-[-1deg] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_#000]"
      >
        <ArrowLeft className="w-5 h-5 text-black group-hover:-translate-x-1 transition-transform" />
        <span className="font-black uppercase tracking-widest text-[11px] text-black">
          {text}
        </span>
      </Link>
    </div>
  );
};
