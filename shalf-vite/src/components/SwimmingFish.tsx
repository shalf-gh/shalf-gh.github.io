import React, { useState, useEffect } from 'react';

const SwimmingFish: React.FC = () => {
  const [fish, setFish] = useState<{ x: number, y: number, speed: number, depth: number }[]>([]);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Generate initial fish
    const initialFish = Array.from({ length: 10 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speed: 0.5 + Math.random() * 1.5,
      depth: 0.5 + Math.random() * 0.5 // Parallax depth
    }));
    setFish(initialFish);

    // Handle scroll for parallax effect
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Animate fish movement
    const animateFish = () => {
      setFish(prevFish => prevFish.map(f => {
        let newX = f.x + f.speed;
        
        // Reset fish position when it goes off-screen
        if (newX > window.innerWidth) {
          newX = -50; // Start a bit before the screen
          f.y = Math.random() * window.innerHeight;
        }

        return { ...f, x: newX };
      }));
    };

    window.addEventListener('scroll', handleScroll);
    const animationFrame = setInterval(animateFish, 50);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(animationFrame);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(0, 40, 80, 0.1), rgba(0, 20, 60, 0.2))',
        backgroundAttachment: 'fixed',
        transform: 'translateY(0)' // Ensure background moves with scroll
      }}
    >
      {fish.map((f, i) => (
        <div 
          key={i} 
          className="absolute text-4xl opacity-30 transform -scale-x-100"
          style={{ 
            left: `${f.x}px`, 
            top: `${f.y - scrollY * (0.2 * f.depth)}px`, // Parallax scroll effect
            transition: 'transform 0.05s linear'
          }}
        >
          🐟
        </div>
      ))}
    </div>
  );
};

export default SwimmingFish;
