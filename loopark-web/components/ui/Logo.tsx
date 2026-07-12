import React from 'react';
import Image from 'next/image';

interface LogoProps {
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <div className={`relative flex items-center ${className ?? ''}`}>
            <div className="relative h-7 w-24">
                <Image
                    src="/logo.png"
                    alt="Loopark"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    );
};
