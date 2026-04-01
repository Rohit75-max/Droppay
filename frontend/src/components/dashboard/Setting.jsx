"use client";
import React, { useState } from 'react';

export function SettingsProtocol() {
    const [profile, setProfile] = useState({
        username: '@IMRK14',
        name: 'ROHIT KUMAR',
        email: 'ROHIT@DROPE.IN',
        upi: 'ROHIT.PAY@UPI',
        bank: 'HDFC BANK // XXXX-9012'
    });

    return (
        <div className="bg-[#F9FAFB] text-zinc-900 px-4 md:px-8 py-8 md:py-12 pb-24 space-y-4 md:space-y-8">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 min-h-screen">

                {/* ── 01 // PROFILE IDENTITY ── */}
                <section className="lg:col-span-2">
                    <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden h-full flex flex-col">
                        <div className="px-6 md:px-10 py-5 border-b border-zinc-50 flex items-center bg-zinc-50/10">
                            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium">01 {'//'} PROFILE IDENTITY</p>
                        </div>

                        <div className="p-6 md:p-10 space-y-8 md:space-y-12">
                            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 border-b border-zinc-50 pb-8 md:pb-12">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-zinc-950 flex items-center justify-center text-white font-black text-3xl md:text-4xl shadow-2xl border-4 md:border-8 border-white overflow-hidden italic shrink-0">
                                    RK
                                </div>
                                <div className="flex-1 text-center md:text-left space-y-2">
                                    <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tighter text-zinc-900">{profile.name}</h3>
                                    <p className="font-mono text-[10px] md:text-xs text-zinc-400 uppercase tracking-widest">{profile.username} {'//'} NODE_ID: DR-9012-AX</p>
                                    <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
                                        <button className="px-5 py-2.5 bg-zinc-900 text-white font-mono text-[10px] uppercase font-black rounded-xl hover:bg-[#FF2D00] transition-colors shadow-lg">Change Avatar</button>
                                        <button className="px-5 py-2.5 bg-white border border-zinc-200 text-zinc-400 font-mono text-[10px] uppercase font-bold rounded-xl hover:text-zinc-900 transition-all">Remove</button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                <div className="space-y-4 md:space-y-6">
                                    <div>
                                        <label className="font-mono text-[9px] text-zinc-300 uppercase tracking-widest block mb-2">Display Name</label>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            className="w-full bg-zinc-50 border border-zinc-100 p-4 md:p-5 rounded-2xl font-mono text-[11px] md:text-xs text-zinc-900 focus:outline-none focus:border-[#FF2D00]/30 transition-colors uppercase font-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="font-mono text-[9px] text-zinc-300 uppercase tracking-widest block mb-2">Public ID</label>
                                        <input
                                            type="text"
                                            value={profile.username}
                                            readOnly
                                            className="w-full bg-zinc-100 border border-zinc-50 p-4 md:p-5 rounded-2xl font-mono text-[11px] md:text-xs text-zinc-400 focus:outline-none uppercase"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 md:space-y-6">
                                    <div>
                                        <label className="font-mono text-[9px] text-zinc-300 uppercase tracking-widest block mb-2">Email Node</label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="w-full bg-zinc-50 border border-zinc-100 p-4 md:p-5 rounded-2xl font-mono text-[11px] md:text-xs text-zinc-900 focus:outline-none focus:border-[#FF2D00]/30 transition-colors uppercase font-black"
                                        />
                                    </div>
                                    <div className="pt-4 md:pt-6">
                                        <button className="w-full py-4 md:py-6 bg-zinc-900 text-white font-sans font-black text-[12px] md:text-[13px] uppercase tracking-widest rounded-2xl shadow-xl hover:bg-[#FF2D00] transition-colors shadow-zinc-200">
                                            Sync Profile Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── 02 // PAYOUT PROTOCOLS ── */}
                <section className="lg:col-span-1">
                    <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden h-full flex flex-col">
                        <div className="px-6 md:px-10 py-5 border-b border-zinc-50 flex items-center bg-zinc-50/10">
                            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium">02 {'//'} PAYOUT PROTOCOLS</p>
                        </div>

                        <div className="p-6 md:p-10 space-y-6 md:space-y-8">
                            <div className="bg-zinc-50/50 border border-zinc-100 p-6 md:p-8 rounded-2xl space-y-6 md:space-y-8">
                                <div>
                                    <p className="font-mono text-[9px] text-zinc-300 uppercase tracking-widest mb-2">Primary UPI ID</p>
                                    <p className="font-sans font-black text-sm md:text-base text-zinc-900 uppercase tracking-tight italic">{profile.upi}</p>
                                </div>
                                <div>
                                    <p className="font-mono text-[9px] text-zinc-300 uppercase tracking-widest mb-2">Secondary Bank</p>
                                    <p className="font-sans font-black text-sm md:text-base text-zinc-900 uppercase tracking-tight italic">{profile.bank}</p>
                                </div>
                                <button className="w-full py-4 bg-white border border-zinc-200 text-zinc-400 font-mono text-[10px] uppercase font-bold rounded-xl hover:text-zinc-900 hover:border-zinc-900 transition-all">Update Methods</button>
                            </div>

                            <div className="p-6 md:p-8 border border-zinc-100 rounded-2xl relative overflow-hidden bg-zinc-50/10">
                                <div className="absolute top-0 right-0 p-3 font-mono text-[8px] text-zinc-100 uppercase tracking-widest">Protocol_Security</div>
                                <h4 className="font-sans font-black text-xs md:text-sm uppercase tracking-tight mb-2 md:mb-3 text-zinc-900">Overlay Protection</h4>
                                <p className="font-mono text-[8px] md:text-[9px] text-zinc-400 uppercase tracking-widest leading-relaxed">System-wide protection enabled. All manual payout requests require MFA validation via registered node device.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
