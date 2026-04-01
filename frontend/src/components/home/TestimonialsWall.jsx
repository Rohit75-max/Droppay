import React, { useState } from 'react';
import { motion } from 'framer-motion';

const customerTestimonials = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Technical Architect",
    content: "Drope's API is a breath of fresh air. The documentation is pristine and the integration was seamless.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    bg: "#fef9c3",
    text: "#0f766e"
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Content Strategist",
    content: "The real-time analytics and automated payouts have completely transformed our workflow.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    bg: "#dbeafe",
    text: "#1d4ed8"
  },
  {
    id: 3,
    name: "Marcus Thorne",
    role: "Infrastructure Engineer",
    content: "Security was our top priority. Drope gave us the confidence to scale globally.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    bg: "#ffedd5",
    text: "#c2410c"
  },
  {
    id: 4,
    name: "Jordan Lee",
    role: "E-sports Director",
    content: "The latency is virtually non-existent. Our live tournaments have never run smoother.",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
    bg: "#f3e8ff",
    text: "#6b21a8"
  },
  {
    id: 5,
    name: "Elena Rossi",
    role: "Creative Director",
    content: "Aesthetic meet performance. The branding customization is best-in-class.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    bg: "#d1fae5",
    text: "#065f46"
  },
  {
    id: 6,
    name: "Xavier Wright",
    role: "Growth Lead",
    content: "Integrating Drope was the single biggest driver of our conversion rates this quarter.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    bg: "#fee2e2",
    text: "#991b1b"
  }
];

const MarqueeRow = ({ items, reverse = false, offset = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex overflow-hidden whitespace-nowrap py-0 select-none group border-y border-black/5 bg-white/5 cursor-default"
    >
      <motion.div
        initial={{ x: offset }}
        animate={{ x: reverse ? ['-33.33%', '0%'] : ['0%', '-33.33%'] }}
        transition={{
          duration: isHovered ? 80 : 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="flex gap-0"
        style={{ width: "max-content" }}
      >
        {duplicatedItems.map((testimonial, idx) => (
          <div
            key={`${testimonial.id}-${idx}`}
            className="w-[clamp(280px,80vw,340px)] h-[148px] shrink-0 p-4 border-r border-b border-black/10 bg-white/60 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:bg-white/90 hover:z-20 flex flex-col justify-between"
          >
            <div
              className="absolute inset-x-0 bottom-0 h-10 opacity-10 blur-xl pointer-events-none"
              style={{ background: testimonial.bg }}
            />
            <p className="relative z-10 text-[12px] font-bold font-serif italic mb-2 leading-snug whitespace-normal tracking-tight opacity-75" style={{ color: testimonial.text }}>
              "{testimonial.content}"
            </p>
            <div className="relative z-10 flex items-center gap-2 mt-auto border-t border-black/5 pt-1.5">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-black/10 shadow-sm">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-[8px] font-black uppercase tracking-tight" style={{ color: '#111111' }}>
                  {testimonial.name}
                </h4>
                <p className="text-[6.5px] font-bold uppercase tracking-widest opacity-40" style={{ color: '#111111' }}>
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const TestimonialsWall = () => {
  return (
    <section id="customers" className="relative h-full w-full flex flex-col px-0 overflow-hidden pt-[calc(var(--nav-height)+1rem)] pb-0" style={{ background: 'var(--arc-cream-alt)' }}>
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--arc-cream-alt)] to-transparent z-40 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--arc-cream-alt)] to-transparent z-40 pointer-events-none" />

      <div className="flex-1 flex flex-col justify-center items-center w-full gap-10 md:gap-16 relative z-30 py-8 pb-[10vh] md:pb-[15vh]">
        {/* Unified Title */}
        <div className="max-w-[1280px] w-full mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="arc-hero-text text-[clamp(2.8rem,7vw,5.5rem)] font-black mb-4" style={{ color: 'var(--arc-text-dark)' }}>
              Wall of Love
            </h2>
            <p className="text-[#4a4a68] text-[clamp(0.6rem,1.2vw,0.85rem)] font-black uppercase tracking-[0.5em] opacity-40">
              Trusted by <span style={{ color: '#111111' }}>Industry Leaders.</span>
            </p>
          </motion.div>
        </div>

        {/* Edge-to-Edge Marquee */}
        <div className="w-full flex flex-col gap-6 md:gap-8 relative shadow-2xl shadow-black/5 rotate-[-1deg] scale-[1.02] md:scale-105 z-10">
          <MarqueeRow items={customerTestimonials.slice(0, 3)} />
          <MarqueeRow items={customerTestimonials.slice(3, 6)} reverse={true} offset={-160} />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsWall;
