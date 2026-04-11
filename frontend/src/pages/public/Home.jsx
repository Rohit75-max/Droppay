import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { LayoutGroup, AnimatePresence } from 'framer-motion';

// Layout components
import { Preloader } from '../../components/layout/Preloader';

// Home sections
import Hero from '../../components/home/Hero';
import { TheVoidCore } from '../../components/home/TheVoidCore';
import { TheDrop } from '../../components/home/TheDrop';
import { InteractiveFeatures } from '../../components/features/InteractiveFeatures';
import { Footer } from '../../components/home/Footer';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    // Apply body lock class when marketing page is mounted
    document.body.classList.add('marketing-root-body-lock');
    return () => {
      document.body.classList.remove('marketing-root-body-lock');
    };
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
        <main
          ref={scrollRef}
          className="home-scroll-container bg-[#0A0A0A] relative z-10"
        >
          <div className="main-content-sheet relative z-10 w-full">
            <Hero />
            <TheVoidCore containerRef={scrollRef} />
            <TheDrop />
            <InteractiveFeatures />
            <Footer containerRef={scrollRef} />
          </div>
        </main>

      </LayoutGroup>
    </div>
  );
};

export default Home;

