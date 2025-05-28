import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  active: boolean;
}

const TypewriterText = ({ text, speed = 50, className = '', active }: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Reset if we change the active state or text
    if (!active) {
      setDisplayedText('');
      setCurrentIndex(0);
      setIsDone(false);
      return;
    }

    // If we're not done typing and the component is active
    if (!isDone && active) {
      const timer = setTimeout(() => {
        if (currentIndex < text.length) {
          setDisplayedText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        } else {
          setIsDone(true);
        }
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [text, speed, currentIndex, isDone, active]);

  return (
    <div className={`font-mono ${className}`}>
      {displayedText}
      {active && !isDone && (
        <span className="inline-block w-2 h-4 bg-amber-800 ml-1 animate-blink"></span>
      )}
    </div>
  );
};

export default TypewriterText; 