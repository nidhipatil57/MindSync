import React from 'react';

export const BackgroundBlobs: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-55 overflow-hidden pointer-events-none">
      {/* Top Left Blob */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-blue/40 blur-[120px] animate-blob"
        style={{ animationDelay: '0s' }}
      />
      {/* Bottom Right Blob */}
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-brand-pink/50 blur-[130px] animate-blob-reverse"
        style={{ animationDelay: '4s' }}
      />
      {/* Middle Floating Blob */}
      <div 
        className="absolute top-[30%] left-[60%] w-[35vw] h-[35vw] rounded-full bg-brand-lavender/50 blur-[100px] animate-blob"
        style={{ animationDelay: '2s' }}
      />
    </div>
  );
};
