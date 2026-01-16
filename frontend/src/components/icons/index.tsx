import React from 'react';

// Custom SVG icons for HyPrism - replacing emojis with proper vector icons

interface IconProps {
  size?: number;
  className?: string;
}

// Body/Physical icons
export const BodyIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2a3 3 0 0 0-3 3v2a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
    <path d="M12 10v4"/>
    <path d="M12 14l-3 6"/>
    <path d="M12 14l3 6"/>
    <path d="M8 12l-2 3"/>
    <path d="M16 12l2 3"/>
  </svg>
);

export const FaceIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
    <line x1="9" y1="9" x2="9.01" y2="9"/>
    <line x1="15" y1="9" x2="15.01" y2="9"/>
  </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export const HairIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2C8.13 2 5 5.13 5 9v3c0 3.87 3.13 7 7 7s7-3.13 7-7V9c0-3.87-3.13-7-7-7z"/>
    <path d="M5 9c0-2 1-4 3-5"/>
    <path d="M19 9c0-2-1-4-3-5"/>
    <path d="M12 2c1.5 1 2.5 3 2.5 5"/>
    <path d="M12 2c-1.5 1-2.5 3-2.5 5"/>
  </svg>
);

export const BeardIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 12c-4 0-6 2-6 4 0 3 2 6 6 6s6-3 6-6c0-2-2-4-6-4z"/>
    <path d="M8 12v-1"/>
    <path d="M16 12v-1"/>
    <path d="M12 14v4"/>
  </svg>
);

export const EyebrowIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 8c2-2 4-3 6-3s4 1 6 3"/>
    <path d="M4 16c2-2 4-3 6-3s4 1 6 3"/>
  </svg>
);

// Clothing icons
export const ShirtIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
  </svg>
);

export const JacketIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6l4-2 5 2 5-2 4 2v14l-4 2-5-2-5 2-4-2V6z"/>
    <path d="M12 6v14"/>
    <path d="M7 4v18"/>
    <path d="M17 4v18"/>
  </svg>
);

export const PantsIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2h12l1 20h-4l-1-12h-4l-1 12H5l1-20z"/>
  </svg>
);

export const ShoeIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 16h18a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z"/>
    <path d="M5 16V8a4 4 0 0 1 4-4h2c2 0 4 1 6 3l4 4v5"/>
  </svg>
);

// Accessory icons
export const CrownIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/>
    <path d="M5 16h14"/>
    <path d="M6 20h12"/>
  </svg>
);

export const GlassesIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="6" cy="12" r="4"/>
    <circle cx="18" cy="12" r="4"/>
    <path d="M10 12h4"/>
    <path d="M2 12h2"/>
    <path d="M20 12h2"/>
  </svg>
);

export const GloveIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2"/>
    <path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6"/>
    <path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8"/>
    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
  </svg>
);

export const CapeIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 4c0 0 1-2 6-2s6 2 6 2"/>
    <path d="M6 4v16c0 0 2-2 6-2s6 2 6 2V4"/>
    <path d="M12 4v14"/>
  </svg>
);

// UI icons
export const GamepadIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="6" x2="10" y1="12" y2="12"/>
    <line x1="8" x2="8" y1="10" y2="14"/>
    <line x1="15" x2="15.01" y1="13" y2="13"/>
    <line x1="18" x2="18.01" y1="11" y2="11"/>
    <rect width="20" height="12" x="2" y="6" rx="2"/>
  </svg>
);

export const LightbulbIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
  </svg>
);

// Hytale Logo SVG
export const HytaleLogo: React.FC<IconProps & { showText?: boolean }> = ({ size = 48, className = '', showText = false }) => (
  <svg width={showText ? size * 4 : size} height={size} viewBox={showText ? "0 0 400 100" : "0 0 100 100"} className={className}>
    {/* Hytale-inspired geometric logo */}
    <defs>
      <linearGradient id="hytaleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFA845"/>
        <stop offset="50%" stopColor="#FF8C3A"/>
        <stop offset="100%" stopColor="#FF6B35"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Main logo shape - stylized H */}
    <g filter="url(#glow)">
      <path 
        d="M20 15 L20 85 L35 85 L35 55 L65 55 L65 85 L80 85 L80 15 L65 15 L65 40 L35 40 L35 15 Z"
        fill="url(#hytaleGradient)"
      />
      {/* Decorative elements */}
      <rect x="15" y="10" width="10" height="5" fill="url(#hytaleGradient)" opacity="0.6"/>
      <rect x="75" y="10" width="10" height="5" fill="url(#hytaleGradient)" opacity="0.6"/>
      <polygon points="50,5 55,15 45,15" fill="url(#hytaleGradient)" opacity="0.8"/>
    </g>
    
    {showText && (
      <text x="120" y="65" fontSize="42" fontWeight="bold" fill="url(#hytaleGradient)" fontFamily="system-ui, -apple-system, sans-serif">
        HYPRISM
      </text>
    )}
  </svg>
);

// 3D Cube icon for skin viewer
export const Cube3DIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

// Refresh/Update icon
export const RefreshIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path d="M8 16H3v5"/>
  </svg>
);
