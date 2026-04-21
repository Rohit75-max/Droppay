import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { LayoutGroup, AnimatePresence } from 'framer-motion';

// Layout components
import { Preloader } from '../../components/layout/Preloader';

// Home sections
import Hero from '../../components/home/Hero';
import { TheDrop } from '../../components/home/TheDrop';
import { TrustStrip } from '../../components/home/TrustStrip';
import { CommissionStrip } from '../../components/home/CommissionStrip';
import { InteractiveFeatures } from '../../components/features/InteractiveFeatures';
import { Footer } from '../../components/home/Footer';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || loading) return;
    const tl = gsap.timeline();
    tl.from('.hero-content', {
      y: 60,
      opacity: 0,
      duration: 1.2,
      delay: 0.2,
      ease: 'power4.out',
    });
  }, [mounted, loading]);

  if (!mounted) return <div style={{ background: '#000', height: '100vh', width: '100%' }} />;

  return (
    <div className="marketing-root bg-black text-white antialiased">
      <LayoutGroup id="site-reveal">

        {/* PRELOADER */}
        <AnimatePresence>
          {loading && (
            <Preloader
              key="boot-preloader"
              onComplete={() => {
                setLoading(false);
                window.dispatchEvent(new Event('drope-boot-complete'));
              }}
            />
          )}
        </AnimatePresence>

        {/* MAIN SCROLL CONTAINER */}
        {/* Section order: Hero → Trust → How It Works → Commission → Features → Footer */}
        <main
          ref={scrollRef}
          className="bg-[#0A0A0A] relative z-10"
        >
          <div className="main-content-sheet relative z-10 w-full">

            {/* 1. HERO — First impression. Creator-first headline + OBS alert demo */}
            <Hero />

            {/* 2. TRUST STRIP — Platform logos + social proof stats */}
            <TrustStrip />

            {/* 3. HOW IT WORKS — Live stream donation feed, instant alert story */}
            <TheDrop />

            {/* 4. COMMISSION COMPARISON — "We cost less. We move faster." */}
            <CommissionStrip />

            {/* 5. PLATFORM FEATURES — Interactive bento grid */}
            <InteractiveFeatures />

            {/* 6. FOOTER */}
            <Footer containerRef={scrollRef} />
          </div>
        </main>

      </LayoutGroup>
    </div>
  );
};

export default Home;
