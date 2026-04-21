import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useVelocity,
  useSpring,
  useAnimationFrame,
  useMotionValue,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

// ─────────────────────────────────────────
// VELOCITY MARQUEE (Background Layer)
// ─────────────────────────────────────────
const VelocityMarquee = () => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const directionFactor = useRef(-1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * 0.005 * delta;
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    let newX = baseX.get() + moveBy;
    if (newX <= -50) newX += 50;
    else if (newX > 0) newX -= 50;
    baseX.set(newX);
  });

  const x = useTransform(baseX, (v) => `${v}%`);

  return (
    <div className="absolute inset-x-0 top-[38%] -translate-y-1/2 flex items-center overflow-hidden opacity-[0.06] z-0 pointer-events-none select-none">
      <motion.div
        className="flex font-black uppercase tracking-tighter w-max leading-none"
        style={{
          x,
          WebkitTextStroke: '2px rgba(175,255,0,1)',
          color: 'transparent',
          fontSize: '18vw',
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className="block pr-12 whitespace-nowrap">
            DROPPAY // 2.5% // INSTANT ALERTS // GET PAID //
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────
// ALWAYS-VISIBLE EMAIL SUBSCRIBE BOX
// ─────────────────────────────────────────
const EmailBox = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | success

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 3500);
  };

  return (
    <div className="w-full max-w-sm">
      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-500 mb-3">
        Get early access & stream tips
      </p>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="h-[52px] flex items-center gap-3 px-4 border border-[#afff00]/40 bg-[#afff00]/5 rounded-lg"
          >
            <CheckCircle className="w-4 h-4 text-[#afff00] shrink-0" />
            <span className="font-mono text-[10px] text-[#afff00] uppercase tracking-widest">
              You're in — check your inbox
            </span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="flex w-full h-[52px] border border-white/15 hover:border-white/30 transition-colors rounded-lg overflow-hidden focus-within:border-[#afff00]/50"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-transparent outline-none font-mono text-[11px] text-white placeholder:text-zinc-600 px-4 uppercase tracking-widest h-full"
            />
            <button
              type="submit"
              className="h-full px-5 bg-[#afff00]/10 border-l border-white/10 hover:bg-[#afff00]/20 transition-colors flex items-center justify-center group"
            >
              <ArrowRight className="w-4 h-4 text-[#afff00] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────
// MAGNETIC SOCIAL ICON
// ─────────────────────────────────────────
const MagneticIcon = ({ href = '#', label, children, accentColor = '#afff00' }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 350, damping: 20, mass: 0.5 });
  const [hovered, setHovered] = useState(false);

  const handleMouse = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.45);
    y.set((e.clientY - cy) * 0.45);
    setHovered(true);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="relative p-5 -m-5 flex items-center justify-center cursor-pointer"
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
    >
      <motion.div
        ref={ref}
        style={{ x: springX, y: springY }}
        className="relative w-10 h-10 rounded-xl border flex items-center justify-center transition-colors duration-300"
        animate={{
          borderColor: hovered ? `${accentColor}40` : 'rgba(255,255,255,0.08)',
          backgroundColor: hovered ? `${accentColor}12` : 'rgba(255,255,255,0.02)',
          color: hovered ? accentColor : 'rgba(255,255,255,0.5)',
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
        {/* Glow bloom on hover */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-xl blur-md -z-10"
            style={{ background: `${accentColor}20` }}
          />
        )}
      </motion.div>
    </a>
  );
};

// ─────────────────────────────────────────
// SOCIAL ICONS CONFIG
// ─────────────────────────────────────────
const SOCIALS = [
  {
    label: 'X / Twitter',
    href: 'https://x.com/droppay',
    accent: '#1d9bf0',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/droppay',
    accent: '#e1306c',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/droppay',
    accent: '#5865f2',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.112 18.1.12 18.12a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@droppay',
    accent: '#ff0000',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/droppay',
    accent: '#afff00',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
];

// ─────────────────────────────────────────
// NAV LINKS
// ─────────────────────────────────────────
const NAV_COLS = [
  {
    heading: 'Product',
    links: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
    hrefs: ['/features', '/pricing', '#', '#'],
  },
  {
    heading: 'Developers',
    links: ['Docs', 'API Reference', 'Webhooks', 'SDKs'],
    hrefs: ['#', '#', '#', '#'],
  },
  {
    heading: 'Company',
    links: ['About', 'Blog', 'Careers', 'Contact'],
    hrefs: ['#', '/blog', '#', '#'],
  },
  {
    heading: 'Legal',
    links: ['Privacy', 'Terms', 'Security', 'Cookies'],
    hrefs: ['#', '#', '#', '#'],
  },
];

// ─────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────
export const Footer = () => {
  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      data-navbar-theme="dark"
      className="bg-[#030303] relative overflow-hidden border-t border-white/5"
    >
      {/* Velocity Marquee Background */}
      <VelocityMarquee />

      {/* ── TOP CTA SECTION ── */}
      <div className="relative z-10 w-full pt-24 pb-16 px-[clamp(1.5rem,5vw,4rem)] border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 justify-between items-start lg:items-end">

          {/* Big Headline */}
          <div className="max-w-2xl">
            <div className="flex flex-col space-y-[-0.2em] mb-8">
              <h2 className="font-black text-white text-[clamp(3rem,8vw,8vw)] uppercase leading-none tracking-tighter italic flex flex-wrap overflow-hidden">
                {'OWN YOUR'.split(' ').map((word, wordIdx) => (
                  <span key={wordIdx} className="flex no-wrap mr-[0.2em] last:mr-0">
                    {word.split('').map((char, charIdx) => (
                      <motion.span
                        key={charIdx}
                        whileHover={{ y: -10, color: '#afff00' }}
                        variants={{
                          hidden: { y: -60, opacity: 0 },
                          visible: {
                            y: 0, opacity: 1,
                            transition: { duration: 0.8, delay: (wordIdx * 4 + charIdx) * 0.04, ease: [0.16, 1, 0.3, 1] },
                          },
                        }}
                        className="cursor-default"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </h2>
              <h2 className="font-black text-[#afff00] text-[clamp(3rem,8vw,8vw)] uppercase leading-none tracking-tighter italic flex flex-wrap overflow-hidden">
                {'REVENUE.'.split(' ').map((word, wordIdx) => (
                  <span key={wordIdx} className="flex no-wrap">
                    {word.split('').map((char, charIdx) => (
                      <motion.span
                        key={charIdx}
                        whileHover={{ y: -10, color: '#ffffff' }}
                        variants={{
                          hidden: { y: 60, opacity: 0 },
                          visible: {
                            y: 0, opacity: 1,
                            transition: { duration: 0.8, delay: 0.4 + charIdx * 0.04, ease: [0.16, 1, 0.3, 1] },
                          },
                        }}
                        className="cursor-default"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </h2>
            </div>

            {/* Glowing rule */}
            <div className="relative w-full h-[2px] mb-8">
              <motion.div
                variants={{
                  hidden: { scaleX: 0 },
                  visible: { scaleX: 1, transition: { delay: 1.4, duration: 0.8, ease: 'easeInOut' } },
                }}
                className="absolute inset-0 bg-[#afff00] origin-left shadow-[0_0_20px_rgba(175,255,0,0.8)]"
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="font-mono text-zinc-400 text-xs uppercase tracking-[0.2em] leading-relaxed max-w-md"
            >
              Join 12,000+ streamers already earning with the lowest commission and fastest alerts in the game.
            </motion.p>
          </div>

          {/* RIGHT: Email + Primary CTA */}
          <div className="flex flex-col gap-5 w-full lg:w-auto min-w-[320px]">
            <EmailBox />
            <Link
              to="/signup"
              id="footer-cta-signup"
              className="group w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#afff00] text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-xl hover:scale-[1.02] shadow-[0_0_30px_rgba(175,255,0,0.15)] active:scale-95 transition-all"
            >
              Start Earning Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── NAVIGATION LINKS ── */}
      <div className="relative z-10 w-full py-16 px-[clamp(1.5rem,5vw,4rem)] border-b border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          {NAV_COLS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#afff00]">{col.heading}</h4>
              <ul className="space-y-3">
                {col.links.map((link, i) => (
                  <li key={link}>
                    <a
                      href={col.hrefs[i]}
                      className="font-mono text-[11px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="relative z-10 w-full px-[clamp(1.5rem,5vw,4rem)] py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left: brand + legal */}
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="font-sans font-black text-sm uppercase tracking-widest text-white">Droppay</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
              © {new Date().getFullYear()} — India — Built for Creators
            </span>
          </div>

          {/* Center: social icons with magnetic effect */}
          <div className="flex items-center gap-2">
            {SOCIALS.map((social) => (
              <MagneticIcon
                key={social.label}
                href={social.href}
                label={social.label}
                accentColor={social.accent}
              >
                {social.icon}
              </MagneticIcon>
            ))}
          </div>

          {/* Right: legal links */}
          <div className="flex items-center gap-5">
            {['Privacy', 'Terms', 'Security'].map((lnk) => (
              <button
                key={lnk}
                type="button"
                className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer bg-transparent border-0 p-0"
              >
                {lnk}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
