import React, { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

// Global specific components
import { SimplePricingBento } from '../components/SimplePricingBento';

// Extracted Home modules
import HomeNavbar from '../components/home/HomeNavbar';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import TestimonialsWall from '../components/home/TestimonialsWall';
import PremiumFooter from '../components/home/PremiumFooter';

const Home = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Activate Magnetic Snap Scrolling Exclusively on Homepage
  useEffect(() => {
    document.documentElement.style.scrollSnapType = 'y mandatory';
    return () => {
      document.documentElement.style.scrollSnapType = '';
    };
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="min-h-screen font-sans overflow-x-hidden relative"
      style={{ background: 'var(--arc-cream)', color: 'var(--arc-text-dark)' }}
    >
      {/* Refactored Navigation & Mobile Overlay */}
      <HomeNavbar scaleX={scaleX} />

      {/* Refactored Hero Banner */}
      <div className="snap-start" style={{ scrollSnapStop: 'always' }}><HeroSection /></div>

      {/* Refactored Feature Hub */}
      <div className="snap-start" style={{ scrollSnapStop: 'always' }}><FeaturesSection /></div>

      {/* Pricing Data */}
      <div className="snap-start" style={{ scrollSnapStop: 'always' }}><SimplePricingBento /></div>

      {/* Refactored Testimonial Scroller */}
      <div className="snap-start" style={{ scrollSnapStop: 'always' }}><TestimonialsWall /></div>

      {/* Refactored Newsletter Footer */}
      <div className="snap-start" style={{ scrollSnapStop: 'always' }}><PremiumFooter /></div>
    </motion.main>
  );
};

export default Home;