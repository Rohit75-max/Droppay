import React from 'react';
import { Code2, Server, Boxes } from 'lucide-react';

export const CreatorStack = () => {
    return (
        <section className="bg-[#111] text-white px-[clamp(1.5rem,5vw,4rem)] py-24 md:py-32 relative z-20 border-t border-b border-white/5">
            <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-16">
                
                {/* Left: Copy */}
                <div className="flex-1 max-w-lg">
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#afff00] mb-4 block">Developer Integration</span>
                    <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black tracking-tighter uppercase leading-none text-white mb-6">
                        Complete Control.
                    </h2>
                    <p className="text-sm font-mono text-zinc-400 tracking-wide leading-relaxed mb-10">
                        Integrate our settlement engine seamlessly into your existing stack. We provide modular APIs, real-time webhooks, and drop-in UI components for absolute flexibility.
                    </p>
                    
                    <div className="space-y-6 flex flex-col">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <Code2 className="w-4 h-4 text-zinc-300" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm uppercase tracking-tight text-white">REST API</h4>
                                <p className="font-mono text-[10px] text-zinc-500 mt-1">Full programmable access to transactions and routing.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <Server className="w-4 h-4 text-zinc-300" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm uppercase tracking-tight text-white">Webhooks</h4>
                                <p className="font-mono text-[10px] text-zinc-500 mt-1">Subscribe to asynchronous lifecycle events.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <Boxes className="w-4 h-4 text-zinc-300" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm uppercase tracking-tight text-white">Prebuilt UI</h4>
                                <p className="font-mono text-[10px] text-zinc-500 mt-1">Drop-in checkout modules for rapid deployment.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Code Block Visualizer */}
                <div className="flex-1 w-full bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 md:p-8 font-mono text-[11px] leading-[1.8] text-zinc-300 shadow-2xl relative overflow-hidden hidden md:block">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#afff00]/5 blur-[60px] pointer-events-none" />
                    
                    <pre className="relative z-10 w-full overflow-x-auto whitespace-pre">
<span className="text-zinc-500">{"// Initialize the Droppay Client"}</span>
<span className="text-blue-400">const</span> droppay = <span className="text-purple-400">new</span> <span className="text-emerald-300">Droppay</span>({'{'}
  apiKey: <span className="text-amber-300">'sk_live_...'</span>,
  environment: <span className="text-amber-300">'production'</span>
{'}'});

<span className="text-zinc-500">{"// Execute an instant settlement"}</span>
<span className="text-blue-400">const</span> response = <span className="text-blue-400">await</span> droppay.settlements.<span className="text-emerald-300">create</span>({'{'}
  amount: <span className="text-amber-400">4250000</span>, <span className="text-zinc-500">{"// In cents"}</span>
  currency: <span className="text-amber-300">'USD'</span>,
  destination: <span className="text-amber-300">'acc_xyz123'</span>,
  dynamicRouting: <span className="text-blue-400">true</span>
{'}'});

<span className="text-blue-400">if</span> (response.status === <span className="text-amber-300">'SETTLED'</span>) {'{'}
  <span className="text-zinc-500">console</span>.<span className="text-blue-400">log</span>(<span className="text-amber-300">'Funds cleared successfully.'</span>);
{'}'}
                    </pre>
                </div>
                
            </div>
        </section>
    );
};
