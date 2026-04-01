import React, { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, User } from 'lucide-react';
import HomeNavbar from '../../components/home/HomeNavbar';
import BlogFooter from '../../components/home/BlogFooter';

const BLOG_POSTS = [
    {
        id: 1,
        category: "Insights",
        title: "The Future of Creator Monetization in 2026",
        excerpt: "Explore how modern platform and direct-to-creator subscriptions are reshaping the digital landscape, moving beyond generic ad-revenue models.",
        author: "Rohit S.",
        date: "March 24, 2026",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 2,
        category: "Product",
        title: "Introducing Drope: The Ultimate Infrastructure for Streamers",
        excerpt: "A deep dive into the technology powering the world's most responsive creator platform, from edge-rendering to micro-settlement rails.",
        author: "Admin Team",
        date: "March 22, 2026",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 3,
        category: "Guides",
        title: "Maximizing Your Revenue with Drope Multi-Tier Subscriptions",
        excerpt: "Learn the strategies top creators use to convert viewers into long-term subscribers using our Legend tier architecture and custom shaders.",
        author: "Growth Lead",
        date: "March 20, 2026",
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2070&auto=format&fit=crop"
    }
];

const BlogPage = () => {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.main 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#f5f0e8] text-[#1a1a2e] selection:bg-[#3d44f5] selection:text-white"
        >
            <HomeNavbar scaleX={scaleX} />

            {/* --- BLOG HERO: FULL-BLEED EDITORIAL --- */}
            <section className="min-h-screen relative flex flex-col justify-end overflow-hidden snap-start">
                <div className="absolute inset-0 z-0">
                    <motion.img 
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5 }}
                        src={BLOG_POSTS[0].image} 
                        className="w-full h-full object-cover grayscale brightness-50"
                        alt="Featured Post" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent" />
                </div>

                <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 pb-24">
                   <motion.div
                       initial={{ y: 50, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       transition={{ delay: 0.5, duration: 1 }}
                   >
                       <span className="inline-block px-4 py-1.5 bg-[#afff00] text-black text-[10px] font-black uppercase tracking-widest rounded-full mb-8">
                           Featured Journal 01
                       </span>
                       <h1 className="text-[10vw] md:text-[8vw] font-black tracking-tighter uppercase leading-[0.8] text-white max-w-5xl mb-12">
                           Monetization <br />
                           <span className="font-serif italic normal-case tracking-tight text-[#afff00]">Strategies.</span>
                       </h1>
                       
                       <div className="flex flex-col md:flex-row justify-between items-end gap-12">
                            <p className="text-white/60 text-lg md:text-xl max-w-xl leading-relaxed">
                                {BLOG_POSTS[0].excerpt}
                            </p>
                            <button 
                                onClick={() => navigate(`/blog/${BLOG_POSTS[0].id}`)}
                                className="group flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl"
                            >
                                Read Entry <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                       </div>
                   </motion.div>
                </div>
            </section>

            {/* --- JOURNAL FEED: ALTERNATING 50/50 --- */}
            <section className="py-48 px-6 md:px-12 lg:px-16 space-y-48">
                {BLOG_POSTS.slice(1).map((post, i) => (
                    <motion.article 
                        key={post.id}
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-32 items-center`}
                    >
                        <div className="flex-1 w-full box-border border border-black/5 rounded-[4rem] overflow-hidden group">
                            <div className="aspect-[4/3] overflow-hidden">
                                <img 
                                    src={post.image} 
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                                    alt={post.title}
                                />
                            </div>
                        </div>

                        <div className="flex-1 space-y-8">
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
                                <span>{post.category}</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-[#3d44f5]" />
                                <span>{post.readTime}</span>
                            </div>
                            
                            <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                                {post.title}
                            </h2>

                            <p className="text-xl opacity-60 leading-relaxed max-w-lg">
                                {post.excerpt}
                            </p>

                            <div className="pt-12 flex items-center justify-between border-t border-black/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 opacity-20" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest">{post.author}</span>
                                        <span className="text-[10px] font-serif italic opacity-40">{post.date}</span>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => navigate(`/blog/${post.id}`)}
                                    className="w-16 h-16 border-2 border-black/10 rounded-full flex items-center justify-center hover:bg-[#3d44f5] hover:border-[#3d44f5] hover:text-white transition-all group"
                                >
                                    <ArrowUpRight className="w-6 h-6 group-hover:scale-125 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </section>

            <BlogFooter />
        </motion.main>
    );
};

export default BlogPage;
