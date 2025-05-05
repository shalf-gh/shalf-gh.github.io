import { useState, useEffect } from 'react';
import WaterRipple from './WaterRipple';

interface ThemeBackgroundProps {
  theme?: 'water' | 'space';
}

const ThemeBackground = ({ theme = 'water' }: ThemeBackgroundProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(window.scrollY / totalHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      background: 'bg-gradient-to-b from-gray-900 to-black',
      rippleColors: [
        'rgba(107, 114, 128, 0.3)',  // gray
        'rgba(75, 85, 99, 0.2)',      // darker gray
        'rgba(31, 41, 55, 0.4)'       // darkest gray
      ]
    }
  };

  const currentTheme = themeColors[theme];

  return (
    <div className={`fixed inset-0 pointer-events-none ${currentTheme.background}`}>
      {/* Base gradient that gets darker with scroll */}
      <div 
        className="absolute inset-0 transition-colors duration-300"
        style={{
          background: `linear-gradient(180deg, 
            rgba(0, 40, 80, ${0.8 + scrollProgress * 0.2}) 0%,
            rgba(0, 20, 60, ${0.9 + scrollProgress * 0.1}) 50%,
            rgba(0, 10, 40, ${1.0}) 100%)`
        }}
      />

      {/* Water ripple effect */}
      <div className="absolute inset-0 pointer-events-auto">
        <WaterRipple />
      </div>
    </div>
  );
};

export default ThemeBackground; 