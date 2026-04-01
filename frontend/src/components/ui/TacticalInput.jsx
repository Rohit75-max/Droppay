import React from 'react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export const TacticalInput = ({
    label,
    error,
    statusText,
    className,
    ...props
}) => {
    return (
        <div className="flex flex-col space-y-2 w-full group">
            <div className="flex justify-between items-end">
                <label className="font-mono text-[10px] uppercase tracking-widest text-white/50 group-focus-within:text-[#FF2D00] transition-colors">
                    [ {label} ]
                </label>
                {statusText && (
                    <span className="font-mono text-[8px] uppercase tracking-widest text-[#FF2D00]/50">
                        {statusText}
                    </span>
                )}
            </div>

            <div className="relative">
                <input
                    className={cn(
                        "w-full bg-white/5 border border-white/10 px-4 py-3 font-body text-sm text-white",
                        "focus:outline-none focus:border-[#FF2D00] focus:bg-white/10 transition-all",
                        "placeholder:text-white/20",
                        error && "border-red-500",
                        className
                    )}
                    {...props}
                />

                {/* Tactical Corner accents on focus */}
                <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-[#FF2D00] opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-[#FF2D00] opacity-0 group-focus-within:opacity-100 transition-opacity" />
            </div>

            {error && (
                <span className="font-mono text-[9px] uppercase text-red-500 tracking-tighter">
                    ! ERROR: {error}
                </span>
            )}
        </div>
    );
};
