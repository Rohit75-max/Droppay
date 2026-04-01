import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Gamepad2,
    ShoppingBag,
    DollarSign,
    Settings,
    Activity,
    User
} from 'lucide-react';

const mobileNavItems = [
    { label: 'Overview', href: '/dashboard/metrics', icon: Activity },
    { label: 'Control', href: '/dashboard/control', icon: Gamepad2 },
    { label: 'DASHBOARD', href: '/dashboard', icon: null }, // Special Central Branding
    { label: 'Store', href: '/dashboard/store', icon: ShoppingBag },
    { label: 'Earnings', href: '/dashboard/earnings', icon: DollarSign },
];

export function MobileBottomNav() {
    const { pathname } = useLocation();

    return (
        <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-16 bg-gradient-to-t from-theme-base via-theme-base/90 to-transparent pointer-events-none"
        >
            <div className="bg-theme-surface/90 backdrop-blur-xl border border-theme-accent flex items-center justify-between px-6 py-4 rounded-[calc(var(--theme-radius)*0.8)] shadow-2xl relative overflow-hidden pointer-events-auto">

                {/* Animated Glow effect behind nav */}   {mobileNavItems.map((item, idx) => {
                    const active = pathname === item.href;
                    const isCenter = idx === 2;
                    const Icon = item.icon;

                    if (isCenter) {
                        return (
                            <Link key="mobile-home" to={item.href} className="flex-1 flex flex-col items-center justify-center -translate-y-1">
                                <motion.span
                                    initial="rest"
                                    whileHover="hover"
                                    whileTap={{ scale: 0.9 }}
                                    className="relative flex cursor-pointer font-sans font-black text-4xl px-2"
                                    style={{ perspective: 600 }}
                                >
                                    {/* Default white/black letter */}
                                    <motion.span
                                        variants={{
                                            rest: { rotateY: 0, x: "0%", opacity: 1 },
                                            hover: { rotateY: -90, x: "-50%", opacity: 0 },
                                        }}
                                        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                                        className="inline-block origin-left text-zinc-900 dark:text-white leading-none"
                                    >
                                        D
                                    </motion.span>

                                    {/* Hover accent letter */}
                                    <motion.span
                                        variants={{
                                            rest: { rotateY: 90, x: "50%", opacity: 0 },
                                            hover: { rotateY: 0, x: "0%", opacity: 1 },
                                        }}
                                        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                                        className="absolute inset-0 flex items-center justify-center origin-right pointer-events-none text-theme-accent leading-none"
                                        aria-hidden="true"
                                    >
                                        D
                                    </motion.span>
                                </motion.span>
                            </Link>
                        );
                    }

                    return (
                        <Link key={item.href} to={item.href} className="flex-1 flex flex-col items-center justify-center">
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className={`flex flex-col items-center transition-colors duration-300 ${active ? 'text-theme-accent' : 'text-zinc-400'}`}
                            >
                                <div className="relative">
                                    {Icon && <Icon size={22} strokeWidth={active ? 2.5 : 2} />}
                                    {active && (
                                        <motion.div
                                            layoutId="mobile-nav-active"
                                            className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-theme-accent rounded-full"
                                        />
                                    )}
                                </div>
                                <span className="font-mono text-[8px] uppercase tracking-tighter mt-1 font-bold">
                                    {item.label}
                                </span>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </motion.nav>
    );
}
