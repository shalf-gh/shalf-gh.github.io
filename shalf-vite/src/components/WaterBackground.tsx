import { useCallback, useEffect, useState } from 'react';
import Particles from '@tsparticles/react';
import type { Engine } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
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

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
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

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <Particles
          id="water-particles"
          init={particlesInit}
          options={{
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 120,
            particles: {
              color: {
                value: "#aaddff",
              },
              move: {
                direction: "top",
                enable: true,
                outModes: {
                  default: "out",
                  top: "destroy",
                  bottom: "none",
                },
                random: false,
                speed: { min: 0.2, max: 1 },
                straight: false,
                gravity: {
                  enable: false,
                },
              },
              number: {
                density: {
                  enable: true,
                  value_area: 800,
                },
                value: 40,
              },
              opacity: {
                value: 0.2,
                animation: {
                  enable: true,
                  speed: 0.2,
                  opacity_min: 0.1,
                },
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 4 },
                animation: {
                  enable: true,
                  speed: 0.5,
                  size_min: 0.1,
                },
              },
            },
            detectRetina: true,
          }}
        />
      </div>
    </div>
  );
};

export default WaterBackground; 