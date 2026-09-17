import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export const GalaxyBackground: React.FC = () => {
  const { resolvedTheme } = useApp();

  // Generate 280 deterministic stars with realistic astronomical spectral colors & coordinates
  const { stars, clusterStars } = useMemo(() => {
    const starList = [];
    const count = 240;
    
    // Spectral colors: Diamond White, Electric Cyan, Azure Blue, Violet, Soft Golden
    const spectralColors = [
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#e0e7ff', // Soft Ice Blue
      '#c7d2fe', // Periwinkle
      '#bae6fd', // Sky Blue
      '#f5d0fe', // Nebula Pink
      '#fef08a', // Warm Gold
      '#ddd6fe', // Lavender
    ];

    for (let i = 0; i < count; i++) {
      const seed1 = Math.sin(i * 37.19 + 11.23) * 43758.5453;
      const seed2 = Math.cos(i * 19.87 + 43.19) * 23421.631;
      const seed3 = Math.sin(i * 73.41 + 89.23) * 10000;
      
      const x = Math.abs(seed1 - Math.floor(seed1)) * 100;
      const y = Math.abs(seed2 - Math.floor(seed2)) * 100;
      const mod = Math.abs(seed3 - Math.floor(seed3));
      
      let size = 1;
      let opacity = 0.5 + mod * 0.5;
      let duration = 2.2 + (i % 6) * 1.0;
      let delay = (i % 8) * 0.6;
      let isSuperBright = i % 28 === 0;
      let isMajor = !isSuperBright && i % 12 === 0;

      if (isSuperBright) {
        size = 2.4;
        opacity = 1;
      } else if (isMajor) {
        size = 1.7;
        opacity = 0.92;
      } else if (mod > 0.7) {
        size = 1.25;
      } else if (mod > 0.3) {
        size = 0.95;
      } else {
        size = 0.7;
      }

      const color = spectralColors[i % spectralColors.length];
      starList.push({ id: i, x, y, size, opacity, duration, delay, isMajor, isSuperBright, color });
    }

    // Concentrated stardust along the diagonal Milky Way band
    const clusterList = [];
    for (let j = 0; j < 65; j++) {
      // Linear path along diagonal: x: 10% to 90%, y: 85% to 15%
      const t = j / 65;
      const spreadX = (Math.sin(j * 4.7) * 9);
      const spreadY = (Math.cos(j * 3.3) * 8);
      const x = Math.max(2, Math.min(98, (15 + t * 70) + spreadX));
      const y = Math.max(2, Math.min(98, (85 - t * 70) + spreadY));
      clusterList.push({
        id: `c_${j}`,
        x,
        y,
        size: 0.6 + (j % 4) * 0.3,
        opacity: 0.55 + (j % 5) * 0.1,
        color: j % 2 === 0 ? '#ffffff' : j % 3 === 0 ? '#fbcfe8' : '#c7d2fe',
      });
    }

    return { stars: starList, clusterStars: clusterList };
  }, []);

  if (resolvedTheme !== 'dark') {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* 1. Deep Space Void Foundation */}
      <div className="absolute inset-0 bg-[#020512]" />

      {/* 2. Majestic Milky Way Galactic Diagonal Plane & Cosmic Dust Cloud */}
      <div
        className="absolute -inset-[20%] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 35% at 50% 50%, rgba(254, 215, 170, 0.28) 0%, rgba(236, 72, 153, 0.42) 22%, rgba(147, 51, 234, 0.55) 45%, rgba(59, 130, 246, 0.45) 65%, rgba(15, 23, 42, 0) 85%),
            linear-gradient(135deg, 
              transparent 0%, 
              rgba(10, 15, 45, 0) 15%, 
              rgba(67, 56, 202, 0.45) 30%, 
              rgba(147, 51, 234, 0.65) 45%, 
              rgba(244, 114, 182, 0.5) 50%, 
              rgba(99, 102, 241, 0.6) 55%, 
              rgba(6, 182, 212, 0.45) 70%, 
              transparent 88%
            )
          `,
          transform: 'rotate(-28deg) scale(1.15)',
        }}
      />

      {/* 3. Luminous Galactic Core (Center Radiance) */}
      <div
        className="absolute top-[28%] right-[18%] w-[55vw] h-[45vw] rounded-full filter blur-[80px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 241, 214, 0.7) 0%, rgba(244, 114, 182, 0.5) 28%, rgba(147, 51, 234, 0.42) 55%, transparent 75%)',
        }}
      />

      {/* 4. Deep Electric Sapphire & Cyan Nebula (Bottom-Left) */}
      <div
        className="absolute bottom-[-8%] left-[-8%] w-[65vw] h-[60vw] rounded-full filter blur-[90px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.65) 0%, rgba(99, 102, 241, 0.5) 38%, rgba(14, 165, 233, 0.3) 65%, transparent 80%)',
        }}
      />

      {/* 5. Radiant Violet / Purple Stardust Rift (Top-Left) */}
      <div
        className="absolute top-[-5%] left-[8%] w-[50vw] h-[50vw] rounded-full filter blur-[85px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, rgba(99, 102, 241, 0.4) 45%, rgba(217, 70, 239, 0.25) 70%, transparent 80%)',
        }}
      />

      {/* 6. Dark Silhouette Interstellar Cosmic Dust Lanes (Creates Authentic Milky Way Depth) */}
      <div
        className="absolute -inset-[15%] pointer-events-none opacity-50 mix-blend-multiply"
        style={{
          background: `
            radial-gradient(ellipse 65% 15% at 50% 50%, rgba(1, 3, 10, 0.98) 0%, rgba(3, 7, 25, 0.75) 45%, transparent 80%)
          `,
          transform: 'rotate(-28deg)',
        }}
      />

      {/* 7. SVG Rendered Starfield & Clusters */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Soft Starlight Corona Glow Filter */}
          <filter id="galaxy-star-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="galaxy-bright-flare" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.0" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dense Milky Way Galactic Band Stardust */}
        {clusterStars.map((cs) => (
          <circle
            key={cs.id}
            cx={`${cs.x}%`}
            cy={`${cs.y}%`}
            r={cs.size}
            fill={cs.color}
            opacity={cs.opacity}
          />
        ))}

        {/* Natural Twinkling Stars */}
        {stars.map((star) => (
          <g
            key={star.id}
            className="animate-star-twinkle"
            style={{
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          >
            {star.isSuperBright ? (
              <>
                {/* 4-point telescope cross diffraction flare for brilliant landmark stars */}
                <line
                  x1={`${star.x}%`}
                  y1={`calc(${star.y}% - 11px)`}
                  x2={`${star.x}%`}
                  y2={`calc(${star.y}% + 11px)`}
                  stroke="rgba(255, 255, 255, 0.95)"
                  strokeWidth="0.9"
                />
                <line
                  x1={`calc(${star.x}% - 11px)`}
                  y1={`${star.y}%`}
                  x2={`calc(${star.x}% + 11px)`}
                  y2={`${star.y}%`}
                  stroke="rgba(255, 255, 255, 0.95)"
                  strokeWidth="0.9"
                />
                <line
                  x1={`calc(${star.x}% - 5px)`}
                  y1={`calc(${star.y}% - 5px)`}
                  x2={`calc(${star.x}% + 5px)`}
                  y2={`calc(${star.y}% + 5px)`}
                  stroke="rgba(224, 231, 255, 0.65)"
                  strokeWidth="0.6"
                />
                <line
                  x1={`calc(${star.x}% + 5px)`}
                  y1={`calc(${star.y}% - 5px)`}
                  x2={`calc(${star.x}% - 5px)`}
                  y2={`calc(${star.y}% + 5px)`}
                  stroke="rgba(224, 231, 255, 0.65)"
                  strokeWidth="0.6"
                />
                {/* Core Halo */}
                <circle
                  cx={`${star.x}%`}
                  cy={`${star.y}%`}
                  r={star.size * 2.2}
                  fill={star.color}
                  opacity={0.45}
                  filter="url(#galaxy-bright-flare)"
                />
                <circle
                  cx={`${star.x}%`}
                  cy={`${star.y}%`}
                  r={star.size}
                  fill="#ffffff"
                  filter="url(#galaxy-star-glow)"
                />
              </>
            ) : star.isMajor ? (
              <>
                <line
                  x1={`${star.x}%`}
                  y1={`calc(${star.y}% - 5px)`}
                  x2={`${star.x}%`}
                  y2={`calc(${star.y}% + 5px)`}
                  stroke="rgba(255, 255, 255, 0.8)"
                  strokeWidth="0.7"
                />
                <line
                  x1={`calc(${star.x}% - 5px)`}
                  y1={`${star.y}%`}
                  x2={`calc(${star.x}% + 5px)`}
                  y2={`${star.y}%`}
                  stroke="rgba(255, 255, 255, 0.8)"
                  strokeWidth="0.7"
                />
                <circle
                  cx={`${star.x}%`}
                  cy={`${star.y}%`}
                  r={star.size}
                  fill={star.color}
                  opacity={star.opacity}
                  filter="url(#galaxy-star-glow)"
                />
              </>
            ) : (
              <circle
                cx={`${star.x}%`}
                cy={`${star.y}%`}
                r={star.size}
                fill={star.color}
                opacity={star.opacity}
              />
            )}
          </g>
        ))}
      </svg>

      {/* 8. Shooting Stars / Meteors across the night sky */}
      <div className="shooting-star shooting-star-1" />
      <div className="shooting-star shooting-star-2" />
      <div className="shooting-star shooting-star-3" />

      {/* 9. Soft cosmic perimeter vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(1,3,10,0.65)_100%)] pointer-events-none" />
    </div>
  );
};
