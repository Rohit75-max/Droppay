import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useAnimationFrame } from 'framer-motion';

export const RepellingText = ({ text, className }) => {
    const mouseX = useMotionValue(-1000);
    const mouseY = useMotionValue(-1000);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        const handleMouseLeave = () => {
            mouseX.set(-1000);
            mouseY.set(-1000);
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [mouseX, mouseY]);

    return (
        <div className={`flex justify-center ${className}`}>
            {text.split('').map((char, i) => (
                <RepellingChar key={i} char={char} mouseX={mouseX} mouseY={mouseY} />
            ))}
        </div>
    );
};

const RepellingChar = ({ char, mouseX, mouseY }) => {
    const wrapperRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const autoX = useSpring(x, { stiffness: 200, damping: 12, mass: 0.8 });
    const autoY = useSpring(y, { stiffness: 200, damping: 12, mass: 0.8 });
    const rotate = useSpring(0, { stiffness: 200, damping: 12 });
    const opacity = useSpring(1, { stiffness: 200, damping: 12 });

    const rotMod = useRef((Math.random() - 0.5) * 180).current;
    
    useAnimationFrame(() => {
        if (!wrapperRef.current) return;
        const mx = mouseX.get();
        const my = mouseY.get();
        
        if (mx === -1000) {
            x.set(0); y.set(0); rotate.set(0); opacity.set(1);
            return;
        }

        const rect = wrapperRef.current.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height / 2;
        
        const dx = originX - mx;
        const dy = originY - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const radius = 200; // Interaction radius (tighter for 'light jumping')
        if (dist < radius) {
            const force = (radius - dist) / radius; 
            const easeForce = force * force; // exponential curve for smoother trigger
            
            const safeDist = Math.max(dist, 1);
            x.set((dx / safeDist) * easeForce * 35); // significantly reduced spread
            y.set((dy / safeDist) * easeForce * 35);
            rotate.set(easeForce * (rotMod * 0.2)); // gentle rotation
            opacity.set(1 - easeForce * 0.3); // minimal fade
        } else {
            x.set(0); y.set(0); rotate.set(0); opacity.set(1);
        }
    });

    return (
        <span ref={wrapperRef} className="relative inline-block whitespace-pre">
            <motion.span
                style={{ x: autoX, y: autoY, rotate, opacity }}
                className="inline-block pointer-events-none"
            >
                {char}
            </motion.span>
        </span>
    );
};
