import React, { useState, useEffect } from 'react';

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

export const ScrambleText = ({ text, isHovered, className = "", onComplete }) => {
    const [display, setDisplay] = useState(text);

    useEffect(() => {
        if (!isHovered) {
            setDisplay(text);
            return;
        }

        let iteration = 0;
        const interval = setInterval(() => {
            setDisplay(prev => 
                prev.split("").map((char, index) => {
                    if (index < iteration) return text[index];
                    return characters[Math.floor(Math.random() * characters.length)];
                }).join("")
            );
            
            if (iteration >= text.length) {
                clearInterval(interval);
                onComplete?.();
            }
            iteration += 1/3;
        }, 30);

        return () => clearInterval(interval);
    }, [isHovered, text, onComplete]);

    return (
        <span className={`${className} inline-block font-mono tracking-widest`}>
            {display}
        </span>
    );
};
