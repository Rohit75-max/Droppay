import React from 'react';
import { motion } from 'framer-motion';

/**
 * DashboardPageContainer
 * The outer themed card that wraps every dashboard section.
 * Uses nexus CSS variables so it theme-cascades perfectly.
 * Matches the repo design: rounded card, accent-tinted border, panel bg.
 *
 * Props:
 *  - noPadding: pass true when the child section manages its own internal padding
 *               (e.g. ControlCenter, Summary, Store which have px-6/p-8 etc)
 *  - className: extra classes to merge
 */
export function DashboardPageContainer({ children, className = '', noPadding = false }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full flex-1 min-h-full nexus-card border overflow-hidden mt-6 ${noPadding ? '' : 'p-4 md:p-6'} ${className}`}
            style={{
                opacity: 1,
            }}
        >
            {children}
        </motion.div>
    );
}

export default DashboardPageContainer;
