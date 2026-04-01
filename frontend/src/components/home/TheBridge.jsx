import React, { forwardRef } from 'react';

export const TheBridge = forwardRef((props, ref) => {
    return (
        <section ref={ref} data-navbar-theme="light" className="home-section-panel bg-white text-black justify-start px-[clamp(1.5rem,5vw,4rem)] pb-0 pt-0 relative z-20">
            {/* 70px Navbar Protection & Spacer */}
            <div className="h-[70px] w-full shrink-0" />

            <div className="w-full border-t border-black/10 pt-5">
                <h2 className="font-heading text-[clamp(3.5rem,15vw,20vw)] leading-[0.8] uppercase tracking-tighter">The Bridge<span className="text-[#FF2D00]">.</span></h2>
                <p className="mt-8 font-mono text-[clamp(10px,1.2vw,14px)] uppercase tracking-widest text-zinc-500 max-w-sm">
                    A seamless flow from donor to creator. Minimalist, technical, and high-fidelity.
                </p>
            </div>

            <div className="flex-grow" />

            {/* 70px Footer Spacer */}
            <div className="h-[70px] w-full shrink-0" />
        </section>
    );
});

TheBridge.displayName = 'TheBridge';
