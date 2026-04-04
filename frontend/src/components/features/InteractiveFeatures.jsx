import React, { useEffect, useRef, forwardRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

const featuresList = [
  { id: "01", title: "Instant Alerts", desc: "Low-latency Socket.io delivery.", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80" },
  { id: "02", title: "Custom Overlays", desc: "High-end GSAP powered visuals.", img: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&w=800&q=80" },
  { id: "03", title: "Instant Payouts", desc: "Seamless Razorpay integration.", img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80" },
  { id: "04", title: "Your Control", desc: "Unified platform management.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" },
];

export const InteractiveFeatures = forwardRef(({ disableTheme, ...props }, ref) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    // MOUSE MOVE LOGIC FOR IMAGE HOVER
    const moveImage = (e) => {
      gsap.to(imageRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", moveImage);
    return () => window.removeEventListener("mousemove", moveImage);
  }, []);

  const handleMouseEnter = (imgUrl) => {
    if (imageRef.current) {
      imageRef.current.style.backgroundImage = `url(${imgUrl})`;
      gsap.to(imageRef.current, { opacity: 1, scale: 1, duration: 0.3 });
    }
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, { opacity: 0, scale: 0.8, duration: 0.3 });
  };

  return (
    <section 
      id="capabilities"
      ref={ref} 
      {...(!disableTheme ? { "data-navbar-theme": "dark" } : {})}
      className="home-section-panel bg-[#0A0A0A] text-white flex flex-col justify-center px-[clamp(1.5rem,5vw,4rem)] relative z-20 selection:bg-[#afff00]"
    >
      <div className="grain-layer absolute inset-0 pointer-events-none z-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* FLOATING HOVER IMAGE */}
      <div 
        ref={imageRef}
        className="fixed top-0 left-0 w-[400px] h-[250px] pointer-events-none z-50 opacity-0 scale-50 bg-cover bg-center grayscale contrast-125"
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      <div className="relative z-10 w-full flex flex-col pt-10">
        <header className="mb-16 flex flex-col items-center text-center">
          <h2 className="text-[clamp(2.2rem,11vw,7vw)] font-black italic tracking-tighter uppercase leading-[0.85] text-white flex flex-wrap justify-center gap-x-[0.3em] gap-y-2">
            {"PROTOCOL_TERMINAL".split(" ").map((word, wIdx) => (
              <span key={wIdx} className="flex whitespace-nowrap">
                {word.split("").map((char, cIdx) => (
                  <motion.span
                    key={cIdx}
                    whileHover={{ 
                      scale: 1.2, 
                      y: -15, 
                      color: '#afff00',
                      textShadow: '0 0 30px rgba(175,255,0,0.5)' 
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 10 
                    }}
                    className="inline-block cursor-default select-none"
                  >
                    {char === "_" ? <span className="opacity-20 mx-1">{char}</span> : char}
                  </motion.span>
                ))}
              </span>
            ))}
          </h2>
          <div className="w-24 h-[1px] bg-[#afff00]/30 mt-6" />
        </header>

        {/* FEATURE LIST */}
        <div className="flex flex-col w-full" ref={containerRef}>
          {featuresList.map((f) => (
            <div 
              key={f.id}
              onMouseEnter={() => handleMouseEnter(f.img)}
              onMouseLeave={handleMouseLeave}
              className="group relative flex items-center justify-between py-8 border-b border-white/10 cursor-pointer transition-colors duration-300 hover:bg-white/5 px-4 w-full"
            >
              <div className="flex items-center gap-12">
                <h3 className="font-heading text-[3.5vw] leading-none uppercase group-hover:italic transition-all">
                  {f.title}
                </h3>
              </div>
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

InteractiveFeatures.displayName = 'InteractiveFeatures';
