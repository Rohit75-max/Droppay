/**
 * DROP PAY TIER PROTOCOL
 * * Base Fees: Starter (15%), Pro (10%), Legend (5%)
 * Referral Fees: Starter (12%), Pro (7%), Legend (3%) - Unlocks at 5 Referrals
 */

export const TIER_CONFIG = {
  starter: { 
    baseFee: 15, 
    referralFee: 12, 
    label: 'Starter Node', 
    color: 'text-slate-400', 
    accent: '#94a3b8' 
  },
  pro: { 
    baseFee: 10, 
    referralFee: 7, 
    label: 'Pro Protocol', 
    color: 'text-indigo-400', 
    accent: '#818cf8' 
  },
  legend: { 
    baseFee: 5, 
    referralFee: 3, 
    label: 'Legend Status', 
    color: 'text-amber-500', 
    accent: '#fbbf24' 
  }
};

/**
 * MILESTONE BADGES
 * These start at 10, 30, and 50 referrals as we discussed.
 */
export const MILESTONES = [
  { 
    threshold: 10, 
    name: 'Network Scout', 
    flair: 'border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]', 
    color: 'text-cyan-400',
    icon: 'Target'
  },
  { 
    threshold: 30, 
    name: 'Node Commander', 
    flair: 'border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.4)]', 
    color: 'text-indigo-400',
    icon: 'Crosshair'
  },
  { 
    threshold: 50, 
    name: 'Protocol Legend', 
    flair: 'border-amber-500/50 shadow-[0_0_25px_rgba(251,191,36,0.5)] animate-pulse', 
    color: 'text-amber-400',
    icon: 'Sparkles'
  }
];

/**
 * CORE LOGIC ENGINE
 * Calculates the exact fee and active badge for any user.
 */
export const calculateTierStatus = (tier, referralCount) => {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.starter;
  
  // Rule: 5 referrals unlocks the -3% fee discount
  const isDiscountActive = referralCount >= 5;
  const currentFee = isDiscountActive ? config.referralFee : config.baseFee;

  // Rule: Find the highest reached badge milestone (10, 30, 50)
  const activeMilestone = [...MILESTONES]
    .reverse()
    .find(m => referralCount >= m.threshold);

  return {
    fee: currentFee,
    isDiscountActive,
    badge: activeMilestone || null,
    tierDetails: config
  };
};