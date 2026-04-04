import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import PremiumAlertPreview from '../dashboard/AlertPreview';
import StandardAlert from '../widgets/StandardAlert';
import CyberGoalBar from '../widgets/GoalBar';

export const LootCard = ({ 
    item, 
    containerRef, 
    isDimmed, 
    onHover, 
    onHoverEnd 
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const pointerStart = useRef({ x: 0, y: 0 });

    // Drag vs Click Guardrail
    const handlePointerDown = (e) => {
        pointerStart.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e) => {
        const dx = e.clientX - pointerStart.current.x;
        const dy = e.clientY - pointerStart.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5) {
            triggerClickAction();
        }
    };

    const triggerClickAction = () => {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 800);
    };

    const handleHoverStart = () => {
        setIsHovered(true);
        if (onHover) onHover(item.id);
    };

    const handleHoverEnd = () => {
        setIsHovered(false);
        if (onHoverEnd) onHoverEnd();
    };

    // Calculate dynamic styles
    const dimOpacity = isDimmed ? 0.4 : 1; // Slightly increased from 0.3 for better legibility
    const dimZIndex = isHovered ? 100 : item.zIndex;

    // --- Production Component Adapters ---

    const renderPremiumAlert = () => (
        <div className="scale-[0.45] origin-center w-[576px] h-auto flex items-center justify-center">
            <PremiumAlertPreview 
                donorName={item.name}
                amount={Number(item.amount.replace(/,/g, ''))}
                message={item.message}
                stylePreference={item.stylePreference || 'subway_dash'}
                isSandbox={true}
            />
        </div>
    );

    const renderFreeAlert = () => (
        <div className="scale-[0.8] origin-center">
            <StandardAlert 
                donorName={item.name}
                amount={item.amount}
                message={item.message}
                sticker={item.sticker || 'hype_zap'}
                isSandbox={true}
            />
        </div>
    );

    const renderGoalBar = () => {
        const percentage = (item.currentProgress / item.targetAmount) * 100;
        return (
            <div className="scale-[0.6] origin-center w-[600px] flex items-center justify-center">
                <CyberGoalBar 
                    goal={{ title: item.name, currentProgress: item.currentProgress, targetAmount: item.targetAmount }}
                    tier="pro"
                    runnerUrl="https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/lottie.json" // Default Rocket Runner
                    percentage={percentage}
                    isComplete={percentage >= 100}
                    goalStylePreference={item.goalStyle || 'glass_jar'}
                    isSandbox={true}
                />
            </div>
        );
    };

    // Dynamic classes and hover mechanics based on component type
    let hoverMechanics = { 
        scale: 1.1, 
        rotate: 0, 
        rotateX: 5, 
        rotateY: -5
    };
    
    let cardDimensions = "w-[300px] h-[100px]"; 
    let centerOffsets = { ml: -150, mt: -50 };

    if (item.type === 'premium_alert') {
        cardDimensions = "w-[280px] h-[180px]";
        centerOffsets = { ml: -140, mt: -90 };
        hoverMechanics.scale = 1.25;
    } else if (item.type === 'free_alert') {
        cardDimensions = "w-[260px] h-[60px]";
        centerOffsets = { ml: -130, mt: -30 };
    } else if (item.type === 'goal_bar') {
        cardDimensions = "w-[340px] h-[100px]";
        centerOffsets = { ml: -170, mt: -50 };
        hoverMechanics.scale = 1.15;
    }

    return (
        <motion.div
            drag
            dragConstraints={containerRef}
            dragElastic={0.1}
            initial={{ 
                x: item.initialPos.x, 
                y: item.initialPos.y, 
                rotate: item.initialPos.rotate,
                opacity: 0,
                scale: 0.5
            }}
            animate={{ 
                opacity: dimOpacity,
                scale: isDimmed ? 0.9 : 1,
                zIndex: dimZIndex
            }}
            whileHover={hoverMechanics}
            whileTap={{ scale: 0.95, cursor: "grabbing" }}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`absolute top-1/2 left-1/2 ${cardDimensions} cursor-grab perspective-1000 transform-style-3d flex items-center justify-center`}
            style={{ 
                marginLeft: centerOffsets.ml,
                marginTop: centerOffsets.mt
            }}
        >
            {/* Component Mounting Point */}
            <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
                {item.type === 'premium_alert' && renderPremiumAlert()}
                {item.type === 'free_alert' && renderFreeAlert()}
                {item.type === 'goal_bar' && renderGoalBar()}
            </div>

            {/* Click Protocol Feedback Overlay */}
            {isClicked && (
                <motion.div 
                    initial={{ opacity: 0.5, scale: 0.8 }}
                    animate={{ opacity: 0, scale: 1.2 }}
                    className="absolute inset-0 bg-[#afff00]/5 rounded-2xl pointer-events-none"
                />
            )}
        </motion.div>
    );
};
