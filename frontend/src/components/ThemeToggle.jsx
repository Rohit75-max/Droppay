import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * Animated Sun/Moon toggle — drop into any nav or header.
 * Size variants: 'sm' (32px) | 'md' (38px, default) | 'lg' (44px)
 */
const ThemeToggle = ({ size = 'md', className = '' }) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    const sizeMap = {
        sm: 'w-8 h-8',
        md: 'w-9 h-9',
        lg: 'w-11 h-11',
    };
    const iconMap = { sm: 14, md: 16, lg: 18 };

    return (
        <motion.button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className={`relative ${sizeMap[size]} rounded-xl flex items-center justify-center transition-colors duration-300 border
                ${isDark
                    ? 'bg-white/5 border-white/10 text-amber-300 hover:bg-amber-400/10 hover:border-amber-400/30'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:border-slate-300'
                } ${className}`}
        >
            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.span
                        key="moon"
                        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        <Moon size={iconMap[size]} />
                    </motion.span>
                ) : (
                    <motion.span
                        key="sun"
                        initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        <Sun size={iconMap[size]} />
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

export default ThemeToggle;
