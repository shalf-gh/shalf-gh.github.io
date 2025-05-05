import { useState, useEffect, useMemo } from 'react';
import WaterRipple from './WaterRipple';

// Improved seeded random number generator with better distribution
function seededRandom(seed: number) {
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

// Type definition for star positions
type StarPosition = {
  size: number;
  left: number;
  top: number;
  color: string;
};

interface ThemeBackgroundProps {
  theme?: 'water' | 'space';
}

const ThemeBackground = ({ theme = 'space' }: ThemeBackgroundProps) => {
  const [sceneSeed, setSceneSeed] = useState(Math.floor(Math.random() * 1000));

  useEffect(() => {
    // Update scene seed periodically based on time
    const intervalId = setInterval(() => {
      setSceneSeed(Math.floor(Math.random() * 1000));
    }, 30000); // Change every 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  const themeColors = {
    water: {
      background: 'bg-gradient-to-b from-blue-900 to-blue-600',
      rippleColors: [
        'rgba(59, 130, 246, 0.3)',  // blue
        'rgba(96, 165, 250, 0.2)',  // lighter blue
        'rgba(37, 99, 235, 0.4)'    // darker blue
      ]
    },
    space: {
      background: 'bg-black',
      rippleColors: [
        'rgba(255, 255, 255, 0.1)',  // white
        'rgba(255, 255, 255, 0.05)', // lighter white
        'rgba(255, 255, 255, 0.2)'   // brighter white
      ]
    }
  };

  const currentTheme = themeColors[theme];

  const starPositions = useMemo(() => {
    const positions: StarPosition[] = [];
    for (let i = 0; i < 300; i++) {
      const randomFunc1 = seededRandom(i * 17);
      const randomFunc2 = seededRandom(i * 31);
      const randomFunc3 = seededRandom(i * 47);

      positions.push({
        size: randomFunc1 * 2,
        left: (randomFunc2 * randomFunc3) * 100,
        top: (randomFunc3 * randomFunc1) * 100,
        color: randomFunc1 > 0.9 ? 'bg-blue-200' : 'bg-white'
      });
    }
    return positions;
  }, []);

  const renderStars = useMemo(() => {
    const stars = starPositions.map((star, i) => {
      // Use scene seed for twinkling to keep it consistent
      const randomFunc1 = seededRandom(sceneSeed + i * 17);
      const randomFunc2 = seededRandom(sceneSeed + i * 31);

      // Create a dynamic twinkling animation
      const twinkleKeyframes = `
        @keyframes twinkle-${i} {
          0%, 100% { opacity: ${0.1 + randomFunc2 * 0.3}; }
          50% { opacity: ${0.5 + randomFunc1 * 0.4}; }
        }
      `;

      return (
        <>
          <style>{twinkleKeyframes}</style>
          <div
            key={i}
            className={`absolute ${star.color} rounded-full`}
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.left}%`,
              top: `${star.top}%`,
              animation: `twinkle-${i} ${3 + randomFunc1 * 4}s infinite`,
              animationTimingFunction: 'ease-in-out'
            }}
          />
        </>
      );
    });

    return stars;
  }, [sceneSeed, starPositions]);

  return (
    <div className={`fixed inset-0 pointer-events-none ${currentTheme.background}`}>
      {/* Base gradient that gets darker with scroll */}
      <div 
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: theme === 'water' ? 'linear-gradient(180deg, rgba(0, 40, 80, 0.8) 0%, rgba(0, 20, 60, 0.9) 50%, rgba(0, 10, 40, 1.0) 100%)' : 'transparent'
        }}
      />

      {theme === 'space' && (
        <div className="absolute inset-0 pointer-events-auto">
          {renderStars}
        </div>
      )}

      {theme === 'water' && (
        <div className="absolute inset-0 pointer-events-auto">
          <WaterRipple />
        </div>
      )}
    </div>
  );
};

export default ThemeBackground; 