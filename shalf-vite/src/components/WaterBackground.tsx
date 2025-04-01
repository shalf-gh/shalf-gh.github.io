import { useState, useEffect } from 'react';
import WaterRipple from './WaterRipple';

const WaterBackground = () => {
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

  return (
    <div className="fixed inset-0 pointer-events-none">
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

export default WaterBackground; 