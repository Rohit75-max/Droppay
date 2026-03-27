import { Cpu, Zap, Terminal } from 'lucide-react';

export const TIERS = [
  {
    tier: "Starter",
    price: 999,
    icon: Cpu,
    tagline: "For New Creators",
    fee: "15%",
    features: ["15% Commission Rate", "Weekly Payouts", "Secure Transactions", "Priority Processing", "Standard Support"]
  },
  {
    tier: "Pro",
    price: 1999,
    icon: Zap,
    tagline: "For Growing Professionals",
    fee: "10%",
    features: ["10% Commission Rate", "48hr Settlements", "Advanced Security", "High-Speed Processing", "Priority Support"]
  },
  {
    tier: "Legend",
    price: 2999,
    icon: Terminal,
    tagline: "For Agencies & Studios",
    fee: "5%",
    features: ["5% Commission Rate*", "Instant Payouts", "Enterprise Security", "Ultra-Low Latency", "24/7 Dedicated Support"]
  }
];
