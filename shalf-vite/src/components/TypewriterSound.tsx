import { useEffect, useRef } from 'react';

interface TypewriterSoundProps {
  active: boolean;
  typingSpeed: number;
}

const TypewriterSound: React.FC<TypewriterSoundProps> = ({ active, typingSpeed }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const returnSoundRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const lastCharPlayedRef = useRef<number>(0);
  const isInitializedRef = useRef<boolean>(false);

  // Create typewriter key sound effect data URL
  // This is a short, simple typewriter key sound encoded as base64
  const keySound = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADmADt7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAAwOYIERiFgAAAAAAAAAAAAAAAAAAAP/7UGQAAAI1D8O0NQBCIQGI9o4gAkMPQ7Q3gEJIfhz2n5AAv///////////////rb7VdOHTrG/n/pf/3Pvul27d7uF//+uVohC8AwEQ7AcUBAEgShMAwf8EAQBA//8QBEAwf/BACAX//y5/EAQBA//+CAIAgA4CAIAgA4Ph+/+CAEAQBAIA/BZLoT//+f//+RBoSBoOCY1enuYgYQJmEFyDKBguH4WEwPHgDJ0OFsEAYCzYuFgYeAMBgTNFwGAwIFwEDx0ewYDQUEwMlhgIFQE5i8PAGDBomGoQKhYTCIGo+AUBgmMDxSEQUt5BgDAI1nGKyJnQUAYKREAkYK0UGCwQM6JjAqeaQXAYEBwJGtpBgcCGYACxhQPGaAYXAZgQMGEAaYXBAQqmJwEUATDAIDSgZUBRgIBmFgYYSAhgsBmCAwHEAMBkuAy8JTBQDAgPEa0gEAZTJwAoBBMBTAwLMFAEIUAZhQCGBACPBQwAABRKGJQkYLCIEGQ+AQZGHwGYKB5iULGIweQARgAFGCASCARgENLJDwJMDgUEAIwABjBAQAT4BIMMA4wCDTBgWMABUwMCTAIMEAsUgGFQmGC4YAA5HACTGcGCKhGAAsYjDBgQDl8AIBhFcqAD5kAMqQAtA0EjAoCMAgQCAEgQhcLgjj0CIUFAMgIBAC7HrFLTQhgAJJwCcJgaGCQHDEGp3CgNmPAgABgAAgBAGWABcBgwO9R/NjgyGIBoUgUYqGYWBYEAdVsehyME4MBiDK0DSXCQEDFoBwKAMYTgGBABGBwJCACqWP/7UmRPgAVRV1v9jYAKnkqrP7GwAU/FW2f2NgAqnSrs/sbAAAIAJAAxeBosApfB9LiACMPAYwYATBADMAgyLA6BQBTBgEsEDCKDQDAGYBAwBgDvgKHAIwkCTAYME4F39AmYAAFgmtAJV0GF6AaMtQFj6tDAwwqQEFYFB8BAGJAaYYB4cAEPKCCoGFBYLMJiAKA1qCmAYEGAxEAoHGAgAYCAQYAowAJgaEUABQFGCwEMCYRB4w2AgYDRkCDDwQKAsYDAJgsDmDQWYPC4tAYvSNCIHGEgIlgCDph4AGAQEYNAQDAs+CoDEAMMMgtQ8CZM3AmKgCrQNCBhQCDFwGWEAOYTAphIBgMBABDQNCQpCQhZC+C76WJgDJoBZgkAmBwQQADq2BAGxQChYAyYUAZXwfAEHA1MhgCmBQILQHvgJBhlYBmFAQYLBJgQAtCmCweYIAC7JoADAYNWSgCR4IggBgwIKALcgQZGAQWYEBJgICGFgCYIBq/rBACTQYBhYJGBAMYNAi6BlICmAAsYOAQKJcFAIuQFmQDA4JmBgSDgCAgB9MwYDTKQPMvQRWYOAzC4BDgBgkGT7GAgGYTAJiIELbAwPAMBDBwDMvAJQYAKAFzIJC8DuIDRgCHHbhgDmAgEmIYDACoQAGTAATpRYMAoAYRARgkAA==';
  
  // Return carriage sound for line breaks
  const returnSound = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAADAAAHgwB+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAABwOD3CsvZgAAAAAAAAAAAAAAAAAAAP/7UGQAAAnIV1X1BAABiwr7H5moAAAAGkHAACAwAAAASAAABwAYE4PgwfB8Hg+DAMEAQBMD4MD4MEAD8MP+BAEAQiIQwwQMAYD9w/EAQP+D8EBAR+8QCCg/cHwQBA//AIAQDfEAgQQN/ggAQOfggQDgvggBAGc/8IgDBPgZJ4fggQA/cP8QEBgYB8DgPwYIAYEf/5wfBAEf+CAMEWZTm4YeQdBwWIHdDhYODH1nAYVGUFBE8DCKBQaRoaHDQMdGhh0UmVxoCJJh0amJRcYgEoYAMGARgYYFDFkwOCDKkVOAigx2ITAgbMGBYwYHgIXDBwnNMjQwOIQECEcQYYHZiAjmGAYYMIJhgNGIROYYDhgIIGCgKYKAZgUPmGgQYcFpg0AGoNqZEBRkTIDQaAg0YOEJhwNmBgQBQ6ZV4wgCTDwLMHAIwOGTBQMMKBkwMCDGAPMHgMAAEBoTDRQMMWHkCBQBCYGAIZHYxIIwYJmXE8YUBAEFDDo5MLjcwIPh4mmHgACASXoDAEwiFQIGAIMBwHDQYDxYMDgsw2IwkDwIGAEABIKGDASCQSYNDICDYYEDEKMFBAPAEYCBYDAswiHTFY4MEBAEAIweHQAGTG4sMUBcCiABBgBD4BBZhQjmMw2YgBwQFTDIFMFjwwcFDIYXMHhIwAOxRmT/+1JkT4AlnlTXfmKgAbhKqu/MFABZcU9h+YqABvGrrL8pMAr60Q0ADCYlMGhUwYHDCIXGwOFwCGAgUGCYVQQBQYEJgYPGEwiYUBgEJQRsAQXMcCEw6FzFAlMTAsxAIgGGwIGkCCRgQDkDPg1CRlwngYOECIGQqVoMBzCoPMCAAFAGEhMGhECAMLhIrCqHAkAgYLhgRAQJCIVLULAMBgoBCMCBINDC6YDCxYRDQFAACBRWgYCmBgAYLCxg8CBgYEDgCAgGAgEAQeDgQFhIjwIAQIEgMEQmFRABAIYDBJgkMGMAoYBAQKA6HBl4BQqYBAZhQbGCQIYzD5iYYAoAGAwIYHBZgQJGKwQYPBYCEAQFGBQkYZAhhQDmYQcEBgwYQDBAIDwUMBwYABoVyBgcgYAGARAYGCplENGDQWfyYIAQ0DIEDgAHgAJAKLGOQeBAKYXABgUYGCQYWALZAiClmHQ8YFAAPFKMRhcAhMFQEYtBARBJicCmGwMYFBgFQWBwAAgdAwRXoGAhhEFmKAIYACZlZOAQFMCgcweEAOFgAA';

  // Function to initialize and play a sound
  const initializeAndPlaySound = () => {
    try {
      // Create audio elements if they don't exist
      if (!audioRef.current) {
        audioRef.current = new Audio(keySound);
        audioRef.current.volume = 0.2;
      }
      
      if (!returnSoundRef.current) {
        returnSoundRef.current = new Audio(returnSound);
        returnSoundRef.current.volume = 0.25;
      }

      // Play a sound to initialize audio context (needed for some browsers)
      const sound = audioRef.current.cloneNode() as HTMLAudioElement;
      sound.volume = 0.1;
      
      // Play and catch errors - this unlocks audio on user interaction
      const playPromise = sound.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio initialized successfully");
            isInitializedRef.current = true;
          })
          .catch(e => {
            console.log("Audio initialization failed:", e);
          });
      }
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
  };

  // Function to play the typewriter sound with variations
  const playTypewriterSound = () => {
    if (!audioRef.current || !isInitializedRef.current) return;
    
    const now = Date.now();
    // Add a small debounce to prevent sounds from overlapping too much
    if (now - lastCharPlayedRef.current < typingSpeed * 0.8) return;
    
    lastCharPlayedRef.current = now;
    
    // Randomly determine if this is a "return" sound (for line breaks)
    // Roughly 1 in 20 characters will be a return sound
    const isReturnSound = Math.random() < 0.05;
    
    try {
      if (isReturnSound && returnSoundRef.current) {
        const sound = returnSoundRef.current.cloneNode() as HTMLAudioElement;
        sound.volume = 0.15 + Math.random() * 0.1;
        sound.playbackRate = 0.85 + Math.random() * 0.3;
        sound.play().catch(e => console.log("Error playing return sound:", e));
        
        // Add a longer pause after a return sound
        lastCharPlayedRef.current += typingSpeed * 2;
      } else {
        // Regular key sound
        const sound = audioRef.current.cloneNode() as HTMLAudioElement;
        sound.volume = 0.05 + Math.random() * 0.1; // Quieter regular keys
        sound.playbackRate = 0.85 + Math.random() * 0.3; // More variation in speed
        sound.play().catch(e => console.log("Error playing key sound:", e));
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  // Add document-level event listener to initialize audio
  useEffect(() => {
    const initAudio = () => {
      if (!isInitializedRef.current) {
        initializeAndPlaySound();
      }
    };

    // These events help unlock audio on iOS and other mobile browsers
    document.addEventListener('click', initAudio);
    document.addEventListener('touchstart', initAudio);
    
    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };
  }, []);

  useEffect(() => {
    // Initialize audio on mount and when active state changes
    if (active && !isInitializedRef.current) {
      initializeAndPlaySound();
    }

    // Start or stop the sound interval based on active state
    if (active) {
      // Try to play a sound immediately when becoming active
      if (isInitializedRef.current) {
        playTypewriterSound();
      }
      
      // Adjust interval to be slightly faster than typing speed for natural sound
      const soundInterval = Math.max(typingSpeed * 0.85, 20);
      intervalRef.current = window.setInterval(playTypewriterSound, soundInterval);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Clean up the interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [active, typingSpeed]);

  // This component doesn't render anything visible
  return null;
};

export default TypewriterSound; 