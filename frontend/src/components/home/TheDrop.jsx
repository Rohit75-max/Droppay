import React from 'react';

export const TheDrop = () => {
    return (
        <section data-navbar-theme="dark" className="home-section-panel bg-black text-white justify-start px-[clamp(1.5rem,5vw,4rem)] pb-0 pt-0 relative z-30">
            {/* 70px Navbar Protection & Spacer */}
            <div className="h-[70px] w-full shrink-0" />

            <div className="w-full border-t border-white/10 pt-5">
                <h2 className="font-heading text-[clamp(3.5rem,15vw,20vw)] leading-[0.8] uppercase tracking-tighter">The Drop<span className="text-[#FF2D00]">.</span></h2>
            </div>

            <div className="flex-grow" />

            {/* 70px Footer Spacer */}
            <div className="h-[70px] w-full shrink-0" />
        </section>
    );
};
