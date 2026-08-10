import React, { useState, useEffect } from 'react';
import { BackgroundBlobs } from './BackgroundBlobs';

interface IntroLoaderProps {
  onComplete: () => void;
}

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const [titleText, setTitleText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'completed'>('typing');
  const [isExiting, setIsExiting] = useState(false);

  const titleTarget = "MindSync";

  // Phase 1: Typing Title
  useEffect(() => {
    if (phase !== 'typing') return;

    let index = 0;
    const interval = setInterval(() => {
      setTitleText(titleTarget.slice(0, index + 1));
      index++;
      if (index >= titleTarget.length) {
        clearInterval(interval);
        setTimeout(() => {
          setPhase('completed');
        }, 800); // Gentle pause after typing the title completes
      }
    }, 120); // Calm speed for typing "MindSync"

    return () => clearInterval(interval);
  }, [phase]);

  // Phase 2: Auto-exit transition
  useEffect(() => {
    if (phase !== 'completed') return;

    const timeout = setTimeout(() => {
      handleExit();
    }, 500); // Hold for 500ms before initiating the smooth fade out

    return () => clearTimeout(timeout);
  }, [phase]);

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 1000); // Matches the CSS duration-1000 opacity transition
  };

  return (
    <div 
      onClick={handleExit}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#F4F8FF] via-[#FFF7FB] to-[#F8F5FF] cursor-pointer transition-all duration-1000 ease-out select-none
        ${isExiting ? 'opacity-0 scale-98 pointer-events-none' : 'opacity-100 scale-100'}
      `}
    >
      {/* Calm floating backdrop blobs */}
      <BackgroundBlobs />
      
      {/* Centered logo container */}
      <div className="relative text-center z-10 flex flex-col items-center justify-center -translate-y-12 md:-translate-y-16">
        {/* Soft breathing aura background ring */}
        <div className="absolute w-[280px] h-[280px] md:w-[400px] md:h-[400px] rounded-full bg-accent-lavender/5 blur-[80px] animate-breathe -z-10" />

        {/* Title logo text */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-accent-sky via-accent-lavender to-accent-peach bg-clip-text text-transparent font-sans drop-shadow-xs flex items-center justify-center">
          {titleText}
          <span 
            className={`inline-block w-[3px] h-[2.6rem] md:h-[4.0rem] ml-1.5 bg-accent-sky align-middle transition-opacity duration-300
              ${phase === 'typing' ? 'animate-pulse opacity-100' : 'opacity-0'}
            `} 
          />
        </h1>
      </div>
    </div>
  );
};
