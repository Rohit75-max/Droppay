import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Clock, User, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BLOG_POSTS = [
  {
    id: 1,
    category: "Insights",
    title: "The Future of Creator Monetization in 2026",
    excerpt: "Explore how modern platform and direct-to-creator subscriptions are reshaping the digital landscape.",
    author: "Rohit S.",
    date: "March 24, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    category: "Product",
    title: "Introducing Drope: The Ultimate Infrastructure for Streamers",
    excerpt: "A deep dive into the technology powering the world's most responsive creator platform.",
    author: "Admin Team",
    date: "March 22, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    category: "Guides",
    title: "Maximizing Your Revenue with Drope Multi-Tier Subscriptions",
    excerpt: "Learn the strategies top creators use to convert viewers into long-term subscribers using our Legend tier.",
    author: "Growth Lead",
    date: "March 20, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800"
  }
];

const footerWords = ["in", "pay", "alert"];

const BlogPage = () => {
  const navigate = useNavigate();
  const [hideLogo, setHideLogo] = useState(false);
  const [footerWordIdx, setFooterWordIdx] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setInterval(() => {
      setFooterWordIdx((prev) => (prev + 1) % footerWords.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      // High-precision trigger: hide when footer area enters viewport significantly
      if (scrollY + windowHeight > fullHeight - 500) {
        setHideLogo(true);
      } else {
        setHideLogo(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#f5f4e2] text-[#111111] selection:bg-emerald-500/30 font-sans"
    >
      {/* Navbar Overlay */}
      <nav className="fixed top-0 left-0 right-0 h-24 flex items-center justify-between px-6 md:px-12 z-50">
        <button onClick={() => navigate('/')} className="group flex items-center gap-3 font-black uppercase tracking-widest text-[10px] text-black">
          <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all backdrop-blur-md">
            <ArrowLeft className="w-3 h-3" />
          </div>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">Return</span>
        </button>
        
        <motion.div 
          animate={{ 
            opacity: hideLogo ? 0 : 1, 
            y: hideLogo ? -10 : 0,
            pointerEvents: hideLogo ? 'none' : 'auto'
          }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="text-4xl font-black tracking-tighter cursor-pointer text-black" 
          style={{ fontFamily: 'Georgia, serif' }}
          onClick={() => navigate('/')}
        >
          drope.
        </motion.div>

        <div className="flex items-center gap-8">
           <Search className="w-5 h-5 opacity-40 cursor-pointer hover:opacity-100 transition-opacity" />
           <button onClick={() => navigate('/signup')} className="px-6 py-2 border-2 border-black/20 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all">Join</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-48 pb-32 px-6 border-b border-black/5">
        <div className="max-w-6xl mx-auto text-center md:text-left">
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-block px-4 py-1.5 rounded-full border border-black/10 text-[9px] font-black uppercase tracking-[0.4em] mb-8 opacity-60"
          >
            Insights & Engineering
          </motion.div>
          <motion.h1 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.85] mb-12"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Thoughts for the<br />
            <span className="italic">Modern Creator.</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl text-lg md:text-xl text-slate-500 font-medium leading-relaxed"
          >
            Deep dives into platform architecture, creator economics, and the future of digital engagement.
          </motion.p>
        </div>
      </header>

      {/* Main Feed */}
      <main className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20">
          {BLOG_POSTS.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden border border-black/5 bg-[#1a1c1e] shadow-2xl shadow-black/10 mb-10 transition-all duration-500 group-hover:shadow-black/20">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-60 transition-all duration-1000 ease-out" 
                />
                
                {/* Abstract UI Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60 pointer-events-none" />
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                
                <div className="absolute top-8 left-8">
                  <span className="px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full text-[9px] font-black uppercase tracking-widest text-white border border-white/10">
                    {post.category}
                  </span>
                </div>

                <div className="absolute bottom-8 left-8 right-8 text-white">
                   <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2 flex items-center gap-2">
                     <Clock className="w-3 h-3" /> {post.readTime}
                   </div>
                </div>
              </div>

              <div className="px-4">
                <h2 className="text-3xl font-bold tracking-tight mb-6 group-hover:italic transition-all duration-500 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                  {post.title}
                </h2>
                <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest opacity-40 mb-6 group-hover:opacity-60 transition-opacity">
                   <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {post.author}</span>
                   <span className="w-1 h-1 rounded-full bg-black/20" />
                   <span>{post.date}</span>
                </div>
                <div className="h-px w-12 bg-black/10 mb-6 group-hover:w-full transition-all duration-700" />
                <p className="text-slate-500 text-base leading-relaxed mb-8 font-medium line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest group-hover:text-emerald-600 transition-colors duration-300">
                  Dive Deeper <ArrowUpRight className="w-4 h-4 bg-black/5 rounded-full p-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-all" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>

      {/* Final Bottom Section: CTA + Footer */}
      <div className="min-h-screen flex flex-col bg-white overflow-hidden">
        {/* Final CTA - Join the Network */}
        <section className="flex-grow flex flex-col justify-center px-6 py-20">
          <div className="max-w-4xl mx-auto rounded-[3.5rem] p-12 md:p-20 text-center relative overflow-hidden bg-slate-50 border border-black/5">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>Join the Network?</h2>
              <p className="text-slate-500 mb-10 max-w-md mx-auto text-sm font-medium">Be the first to know when we deploy new units and network upgrades.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input 
                  type="email" 
                  placeholder="creators@drope.in" 
                  className="px-8 py-4 rounded-full bg-white border border-black/10 focus:outline-none focus:ring-2 focus:ring-black/5 w-full sm:w-64 text-sm font-medium"
                />
                <button className="px-10 py-4 bg-black text-white rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">
                  Join
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Simple Footer - Compacted */}
        <footer className="py-16 px-6 text-center border-t border-black/5">
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
            <div className="h-[1.2em] flex items-center justify-center">
              <span className="text-4xl md:text-6xl font-black tracking-tight cursor-default text-black" style={{ fontFamily: 'Georgia, serif' }}>drope.</span>
              <div className="relative inline-flex items-center text-left min-w-[1.5em] md:min-w-[2em]">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={footerWords[footerWordIdx]}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-4xl md:text-6xl font-black tracking-tight cursor-default text-black" 
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {footerWords[footerWordIdx]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[8px] font-black uppercase tracking-[0.3em] opacity-30">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">Twitter</a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">Discord</a>
              <a href="/" className="hover:opacity-100 transition-opacity">Network</a>
              <a href="/" className="hover:opacity-100 transition-opacity">Privacy</a>
            </div>
            <p className="text-[7px] font-bold opacity-20 uppercase tracking-widest mt-2">@ 2026 drope.in all rights reserved</p>
          </div>
        </footer>
      </div>
    </motion.div>
  );
};

export default BlogPage;
