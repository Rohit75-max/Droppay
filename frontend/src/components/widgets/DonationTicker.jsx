import React, { useState, useEffect, useRef } from 'react';
import { Zap, IndianRupee } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';

const LOTTIE_STICKER_MAP = {
    // Legacy IDs
    zap: 'https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/lottie.json',
    fire: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/lottie.json',
    heart: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f496/lottie.json',
    crown: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f451/lottie.json',
    rocket: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/lottie.json',
    party_popper: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/lottie.json',
    star: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2b50/lottie.json',
    diamond: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f48e/lottie.json',
    gold_bar: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f237/lottie.json',
    coins: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1fa99/lottie.json',
    trophy: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3c6/lottie.json',

    // New Synchronized IDs
    hype_zap: 'https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/lottie.json',
    fire_rocket: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/lottie.json',
    super_heart: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2764_fe0f/lottie.json',
    alien_visit: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f47d/lottie.json',
    driving_car: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f697/lottie.json',
    football_goal: 'https://fonts.gstatic.com/s/e/notoemoji/latest/26bd/lottie.json',
    flying_bird: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f426/lottie.json',
    gold_trophy: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3c6/lottie.json',
    diamond_gem: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f48e/lottie.json'
};

const stickerFallback = {
    zap: '⚡', fire: '🔥', heart: '💖', crown: '👑', rocket: '🚀',
    party_popper: '🎉', star: '⭐', diamond: '💎', gold_bar: '🪙',
    hype_zap: '⚡', fire_rocket: '🚀', super_heart: '💖', alien_visit: '👽',
    driving_car: '🚗', football_goal: '⚽', flying_bird: '🐦', gold_trophy: '🏆',
    diamond_gem: '💎', coins: '🪙'
};

const TickerItem = ({ donation, isOriginal }) => {
    const lottieUrl = LOTTIE_STICKER_MAP[donation.sticker]
        || (typeof donation.sticker === 'string' && donation.sticker.startsWith('http') ? donation.sticker : null)
        || donation.stickerUrl;

    return (
        <div className="flex items-center gap-4 px-10 shrink-0 whitespace-nowrap">
            <div className="w-9 h-9 shrink-0 flex items-center justify-center pointer-events-none drop-shadow-md">
                {/* Lottie only for originals — emoji for the 3× scroll duplicates (perf) */}
                {isOriginal && lottieUrl ? (
                    <Player autoplay loop src={lottieUrl} style={{ width: '36px', height: '36px' }} />
                ) : (
                    <span className="text-xl drop-shadow-sm">{stickerFallback[donation.sticker] || stickerFallback[donation.stickerUrl] || '💎'}</span>
                )}
            </div>

            <span className="text-[var(--nexus-accent)] font-black text-[10px] uppercase tracking-[0.2em] shrink-0">{donation.donorName}</span>
            <span className="text-[var(--nexus-text-muted)] opacity-30 shrink-0">·</span>
            <span className="text-[var(--nexus-text)] font-mono font-black text-xs flex items-center gap-0.5 shrink-0"><IndianRupee className="w-3 h-3" />{donation.amount}</span>
            {donation.message && (
                <>
                    <span className="text-[var(--nexus-text-muted)] opacity-30 shrink-0">·</span>
                    <span className="text-[var(--nexus-text-muted)] italic text-[11px] font-medium shrink-0">"{donation.message}"</span>
                </>
            )}

            <span className="text-white/15 ml-6 shrink-0">⬥</span>
        </div>
    );
};

const DonationTicker = ({ recentDrops = [], goalPercentage = 0 }) => {
    const [supernova, setSupernova] = useState(false);
    const prevPercentRef = useRef(goalPercentage);

    useEffect(() => {
        if (goalPercentage >= 100 && prevPercentRef.current < 100) {
            setSupernova(true);
            setTimeout(() => setSupernova(false), 5000); // 5-second burst
        }
        prevPercentRef.current = goalPercentage;
    }, [goalPercentage]);

    // Duplicate for smooth infinite scroll — Lottie only for originals (index < recentDrops.length)
    const displayDrops = [...recentDrops, ...recentDrops, ...recentDrops, ...recentDrops];
    const originalCount = recentDrops.length;

    return (
        <div className={`ticker-shell h-12 w-full flex items-center overflow-hidden transition-all duration-500 border-b border-[var(--nexus-border)] relative ${supernova ? 'ticker-celebration-active celebration-ignite' : ''}`}>

            {/* SUPERNOVA CELEBRATION EFFECT */}
            {supernova && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="absolute inset-0 bg-[var(--nexus-accent)]/20 animate-pulse" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-80 animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-0 border-y-2 border-[var(--nexus-accent)] drop-shadow-[0_0_15px_var(--nexus-accent)]" />
                </div>
            )}

            {recentDrops.length === 0 ? (
                /* IDLE STATE */
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[var(--nexus-text-muted)] opacity-60 relative z-20 w-full justify-center whitespace-nowrap">
                    <Zap className="w-3.5 h-3.5 text-[var(--nexus-accent)] animate-pulse shrink-0" />
                    WAITING FOR NEXT DROP... SUPPORT THE STREAM TO APPEAR HERE!
                </div>
            ) : (
                /* ACTIVE CONTINUOUS QUEUE */
                <div className="w-full h-full relative z-20 flex items-center overflow-hidden">
                    <div className="ticker-move flex items-center h-full">
                        {displayDrops.map((drop, i) => (
                            <TickerItem
                                key={`${drop.id || drop._id}-${i}`}
                                donation={drop}
                                isOriginal={i < originalCount}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationTicker;
