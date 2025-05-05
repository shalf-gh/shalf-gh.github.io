import React, { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  opacity: number;
}

const WaterRipple: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rippleRef = useRef<Ripple[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ensure full window coverage
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Mouse move event to create ripples
    const createRipple = (x: number, y: number) => {
      rippleRef.current.push({
        x,
        y,
        radius: 0,
        opacity: 0.3 // More visible
      });
    };

    // Animation loop for ripples
    const animateRipples = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Soft blue background
      ctx.fillStyle = 'rgba(0, 40, 80, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw ripples
      rippleRef.current = rippleRef.current.filter(ripple => {
        // Draw ripple
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(59, 130, 246, ${ripple.opacity})`;
        ctx.lineWidth = 2; // Slightly thicker line
        ctx.stroke();

        // Update ripple
        ripple.radius += 2; // Faster expansion
        ripple.opacity = Math.max(0, ripple.opacity - 0.01);

        // Remove ripple when it's too faint
        return ripple.opacity > 0.01;
      });

      requestAnimationFrame(animateRipples);
    };

    // Event listeners
    const handleMouseMove = (e: MouseEvent) => {
      createRipple(e.clientX, e.clientY);
    };

    // Start animation
    animateRipples();

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        width: '100vw', 
        height: '100vh', 
        opacity: 0.8,
        zIndex: 10 
      }}
    />
  );
};

export default WaterRipple;