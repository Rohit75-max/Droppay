import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, User } from 'lucide-react';
import BlogFooter from '../../components/home/BlogFooter';
import ReadingRing from '../../components/ui/ReadingRing';
import { PatchNotesHub } from '../../components/features/PatchNotesHub';
import { RepellingText } from '../../components/ui/RepellingText';

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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white text-black selection:bg-[#afff00] selection:text-black home-scroll-container"
        >

            {/* --- SECTION 01: STREAM HERO --- */}
            <section data-navbar-theme="dark" className="min-h-screen relative flex flex-col justify-center items-center overflow-hidden snap-start bg-black">
                {/* DYNAMIC BACKGROUND */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#afff00]/20 via-transparent to-transparent" />
                    <img
                        src={BLOG_POSTS[0].image}
                        className="w-full h-full object-cover grayscale brightness-50"
                        alt="Featured"
                    />
                    {/* SCANLINES OVERLAY */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
                </div>

                {/* LIVE STATUS BAR */}
                <div className="absolute top-24 left-6 md:left-12 lg:left-16 flex items-center gap-4 z-20">
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-600 rounded-sm text-[10px] font-black uppercase tracking-widest text-white">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        LIVE
                    </div>
                </div>

                <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-[14vw] md:text-[10vw] font-black tracking-tighter uppercase leading-[0.8] text-white flex flex-col items-center">
                            <RepellingText text="Alert" className="text-white" />
                            <RepellingText text="Center" className="text-[#afff00] -mt-[0.2em]" />
                        </h1>
                    </motion.div>
                </div>

                {/* FEATURED ALERT CARD */}
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute bottom-12 right-6 md:right-12 lg:right-16 max-w-sm w-[90%] bg-white p-1 border-2 border-[#afff00] shadow-[10px_10px_0px_#afff00] hidden md:block"
                >
                    <div className="bg-black p-4 space-y-4">
                        <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                            <span className="text-[#afff00]">New_Notification</span>
                            <span className="text-white/20">Ref: 01-X</span>
                        </div>
                        <h2 className="text-lg font-black text-white uppercase leading-none tracking-tight">
                            {BLOG_POSTS[0].title}
                        </h2>
                        <button
                            onClick={() => navigate(`/blog/${BLOG_POSTS[0].id}`)}
                            className="w-full py-2 bg-[#afff00] text-black text-[9px] font-black uppercase tracking-widest hover:bg-white transition-colors"
                        >
                            Open_Payload
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* --- SECTION 01.5: PATCH NOTES HUB (NEW) --- */}
            <PatchNotesHub />

            {/* --- SECTION 02: CONSOLIDATED ALERTS + FOOTER --- */}
            <div data-navbar-theme="light" className="min-h-[100dvh] flex flex-col justify-between snap-start bg-white">
                {/* --- ALERT FEED: OBS STYLE --- */}
                <section className="py-24 px-6 md:px-12 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {BLOG_POSTS.slice(1).map((post, i) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="group relative flex flex-col bg-white border-2 border-black hover:border-[#afff00] transition-colors p-1"
                        >
                            <div className="relative aspect-video overflow-hidden bg-black">
                                <img
                                    src={post.image}
                                    className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                    alt={post.title}
                                />
                                {/* RECT DOT OVERLAY */}
                                <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 bg-black/80 border border-white/10 text-[8px] font-black text-white uppercase">
                                    <div className="w-1 h-1 rounded-full bg-red-600 animate-pulse" />
                                    REC
                                  </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                            </div>

                            <div className="p-4 bg-white flex-1 flex flex-col justify-between space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-black/40">Category: {post.category}</span>
                                        <span className="text-[8px] font-black uppercase tracking-widest text-red-600 font-mono">[Status: Hot]</span>
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-black tracking-tighter uppercase leading-[0.9]">
                                        {post.title}
                                    </h2>
                                </div>

                                <div className="pt-4 flex items-center justify-between border-t border-black/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[#afff00] border border-black flex items-center justify-center">
                                            <User className="w-4 h-4 text-black" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black uppercase tracking-widest">{post.author}</span>
                                            <span className="text-[8px] font-mono uppercase opacity-40">{post.date}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/blog/${post.id}`)}
                                        className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-[#afff00] transition-all group"
                                    >
                                        <ArrowUpRight className="w-4 h-4 group-hover:scale-125 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </section>

                <BlogFooter />
            </div>

            <ReadingRing />
        </motion.main>
    );
};

export default BlogPage;
