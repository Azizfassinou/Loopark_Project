import React from 'react';

interface LogoProps {
    className?: string;
    showText?: boolean;
    dark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-10", showText = true, dark = false }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="relative flex items-center justify-center">
                {/* Infinity Symbol Shape */}
                <svg
                    viewBox="0 0 100 50"
                    className="h-full w-auto drop-shadow-sm"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Background Gradient Circle left */}
                    <circle cx="25" cy="25" r="20" className="fill-brand-green/20" />
                    {/* Background Gradient Circle right */}
                    <circle cx="75" cy="25" r="20" className="fill-brand-purple/20" />

                    {/* Infinity Path */}
                    <path
                        d="M25 10C16.7157 10 10 16.7157 10 25C10 33.2843 16.7157 40 25 40C29.1421 40 32.8921 38.3209 35.6067 35.6067L64.3933 14.3933C67.1079 11.6791 70.8579 10 75 10C83.2843 10 90 16.7157 90 25C90 33.2843 83.2843 40 75 40C70.8579 40 67.1079 38.3209 64.3933 35.6067L35.6067 14.3933C32.8921 11.6791 29.1421 10 25 10Z"
                        stroke="url(#infinity-gradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                    />

                    {/* Pin icon inside the right loop (as seen in logo) */}
                    <path
                        d="M75 18C72.2386 18 70 20.2386 70 23C70 24.5 71 27.5 75 32C79 27.5 80 24.5 80 23C80 20.2386 77.7614 18 75 18ZM75 25C73.8954 25 73 24.1046 73 23C73 21.8954 73.8954 21 75 21C76.1046 21 77 21.8954 77 23C77 24.1046 76.1046 25 75 25Z"
                        fill="white"
                        className="drop-shadow-md"
                    />

                    <defs>
                        <linearGradient id="infinity-gradient" x1="0" y1="25" x2="100" y2="25" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#4ade80" />
                            <stop offset="0.5" stopColor="#22d3ee" />
                            <stop offset="1" stopColor="#7c3aed" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {showText && (
                <div className="flex flex-col leading-none">
                    <span className={`text-2xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        L<span className="text-brand-green">oo</span>park
                    </span>
                    <span className={`text-[9px] font-medium tracking-widest uppercase opacity-60 ${dark ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                        Loupe pas ton parking
                    </span>
                </div>
            )}
        </div>
    );
};
