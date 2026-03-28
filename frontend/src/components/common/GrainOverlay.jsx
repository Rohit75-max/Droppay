import React from 'react';

const GrainOverlay = () => {
    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden opacity-[0.04]">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-[300%] h-[300%] absolute -top-full -left-full animate-grain">
                <filter id="noiseFilter">
                    <feTurbulence 
                        type="fractalNoise" 
                        baseFrequency="0.65" 
                        numOctaves="3" 
                        stitchTiles="stitch" 
                    />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>
            <style jsx>{`
                @keyframes grain {
                    0%, 100% { transform: translate(0, 0); }
                    10% { transform: translate(-5%, -10%); }
                    20% { transform: translate(-15%, 5%); }
                    30% { transform: translate(7%, -25%); }
                    40% { transform: translate(-5%, 25%); }
                    50% { transform: translate(-15%, 10%); }
                    60% { transform: translate(15%, 0%); }
                    70% { transform: translate(0%, 15%); }
                    80% { transform: translate(3%, 35%); }
                    90% { transform: translate(-10%, 10%); }
                }
                .animate-grain {
                    animation: grain 8s steps(10) infinite;
                }
            `}</style>
        </div>
    );
};

export default GrainOverlay;
