import React from 'react';

export const BackgroundImage: React.FC = () => {
  return (
    <>
      {/* Multi-layer Hytale-themed animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base layer - Deep blue/teal gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0a1628 0%, #0d2137 25%, #0f2847 50%, #0d2137 75%, #0a1628 100%)',
          }}
        />
        
        {/* Animated aurora layer 1 - Teal */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(45, 212, 191, 0.4) 0%, transparent 60%)',
            animation: 'aurora1 15s ease-in-out infinite',
          }}
        />
        
        {/* Animated aurora layer 2 - Cyan */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 60% 40% at 70% 60%, rgba(34, 211, 238, 0.3) 0%, transparent 50%)',
            animation: 'aurora2 20s ease-in-out infinite',
          }}
        />
        
        {/* Animated aurora layer 3 - Orange accent */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse 40% 30% at 80% 20%, rgba(251, 146, 60, 0.3) 0%, transparent 50%)',
            animation: 'aurora3 12s ease-in-out infinite',
          }}
        />
        
        {/* Starfield layer */}
        <div className="absolute inset-0 opacity-60">
          <div className="stars-layer-1" />
          <div className="stars-layer-2" />
          <div className="stars-layer-3" />
        </div>
        
        {/* Subtle noise texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Vignette effect */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 100%)',
          }}
        />
      </div>

      {/* Light overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
      
      {/* CSS for animations */}
      <style>{`
        @keyframes aurora1 {
          0%, 100% {
            transform: translateX(0%) translateY(0%) scale(1);
            opacity: 0.4;
          }
          25% {
            transform: translateX(5%) translateY(-5%) scale(1.1);
            opacity: 0.5;
          }
          50% {
            transform: translateX(10%) translateY(5%) scale(1);
            opacity: 0.3;
          }
          75% {
            transform: translateX(-5%) translateY(0%) scale(1.05);
            opacity: 0.45;
          }
        }
        
        @keyframes aurora2 {
          0%, 100% {
            transform: translateX(0%) translateY(0%) scale(1);
            opacity: 0.3;
          }
          33% {
            transform: translateX(-10%) translateY(10%) scale(1.15);
            opacity: 0.4;
          }
          66% {
            transform: translateX(5%) translateY(-5%) scale(0.95);
            opacity: 0.25;
          }
        }
        
        @keyframes aurora3 {
          0%, 100% {
            transform: translateX(0%) translateY(0%) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translateX(-15%) translateY(10%) scale(1.2);
            opacity: 0.35;
          }
        }
        
        .stars-layer-1, .stars-layer-2, .stars-layer-3 {
          position: absolute;
          inset: 0;
          background-repeat: repeat;
        }
        
        .stars-layer-1 {
          background-image: radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.8), transparent),
                           radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.6), transparent),
                           radial-gradient(1px 1px at 50% 10%, rgba(255,255,255,0.7), transparent),
                           radial-gradient(1px 1px at 70% 80%, rgba(255,255,255,0.5), transparent),
                           radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.6), transparent),
                           radial-gradient(1px 1px at 15% 90%, rgba(255,255,255,0.4), transparent),
                           radial-gradient(1px 1px at 85% 15%, rgba(255,255,255,0.7), transparent);
          background-size: 250px 250px;
          animation: twinkle1 8s ease-in-out infinite;
        }
        
        .stars-layer-2 {
          background-image: radial-gradient(1.5px 1.5px at 25% 35%, rgba(255,255,255,0.6), transparent),
                           radial-gradient(1.5px 1.5px at 55% 75%, rgba(255,255,255,0.5), transparent),
                           radial-gradient(1.5px 1.5px at 75% 25%, rgba(255,255,255,0.7), transparent),
                           radial-gradient(1.5px 1.5px at 5% 55%, rgba(255,255,255,0.4), transparent),
                           radial-gradient(1.5px 1.5px at 95% 85%, rgba(255,255,255,0.6), transparent);
          background-size: 350px 350px;
          animation: twinkle2 12s ease-in-out infinite;
        }
        
        .stars-layer-3 {
          background-image: radial-gradient(2px 2px at 40% 45%, rgba(255,255,255,0.5), transparent),
                           radial-gradient(2px 2px at 80% 55%, rgba(255,255,255,0.4), transparent),
                           radial-gradient(2px 2px at 20% 85%, rgba(255,255,255,0.6), transparent);
          background-size: 500px 500px;
          animation: twinkle3 15s ease-in-out infinite;
        }
        
        @keyframes twinkle1 {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        @keyframes twinkle2 {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.9; }
        }
        
        @keyframes twinkle3 {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </>
  );
};
