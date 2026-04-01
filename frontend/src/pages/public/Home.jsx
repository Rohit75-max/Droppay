import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { LayoutGroup, AnimatePresence } from 'framer-motion';

// Layout components
import { Navbar } from '../../components/layout/Navbar';
import { Preloader } from '../../components/layout/Preloader';

// Home sections
import Hero from '../../components/home/Hero';
import { TheBridge } from '../../components/home/TheBridge';
import { TheDrop } from '../../components/home/TheDrop';
import { HorizontalGallery } from '../../components/home/HorizontalGallery';
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
              onComplete={() => setLoading(false)}
            />
          )}
        </AnimatePresence>

        {/* NAVBAR — fixed above everything */}
        <Navbar showLogo={!loading} />

        {/* BOUTIQUE BACKGROUND — Fixed perspective grid */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 0, background: '#000', perspective: '1200px' }}
        >
          <div
            className="absolute inset-0"
            style={{
              opacity: 0.4,
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23FF2D00' stroke-opacity='0.2' stroke-width='0.5'/%3E%3Ccircle cx='0' cy='0' r='1' fill='%23FF2D00' fill-opacity='0.3'/%3E%3C/svg%3E\")",
            }}
          />
          <div
            className="absolute rounded-full animate-pulse"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              width: '80vw',
              height: '80vw',
              background: 'rgba(255,45,0,0.10)',
              filter: 'blur(180px)',
            }}
          />
        </div>

        {/* MAIN SCROLL CONTAINER */}
        <main 
          ref={scrollRef} 
          className="home-scroll-container bg-[#0A0A0A] relative z-10"
        >
          <div className="main-content-sheet">
            <Hero />
            <TheBridge />
            <TheDrop />
            <HorizontalGallery containerRef={scrollRef} />
            <Footer containerRef={scrollRef} />
          </div>
        </main>

      </LayoutGroup>
    </div>
  );
};

export default Home;

