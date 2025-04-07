import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Clue {
  id: number;
  type: string;
  emoji: string;
  answer: string;
  year: string | null;
}

const CluemojiGame = () => {
  const [currentClue, setCurrentClue] = useState<Clue | null>(null);
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [timeUntilNextClue, setTimeUntilNextClue] = useState('');

  useEffect(() => {
    // Get the current week number (0-35)
    const weekNumber = Math.floor((new Date().getTime() / (7 * 24 * 60 * 60 * 1000)) % 36);
    
    // Import the clues from the JSON file
    import('../assets/clues.json')
      .then(module => {
        const clues = module.default.clues;
        setCurrentClue(clues[weekNumber]);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading clues:', error);
        setLoading(false);
      });

    // Update timer every second
    const updateTimer = () => {
      const now = new Date();
      
      // Create a date for next Sunday 12 AM PST
      const nextSunday = new Date(now);
      const daysUntilSunday = (7 - now.getDay()) % 7;
      nextSunday.setDate(now.getDate() + daysUntilSunday);
      
      // Set to 12 AM PST (8 AM UTC)
      nextSunday.setUTCHours(8, 0, 0, 0);
      
      // If we're already past this week's Sunday, set to next week
      if (nextSunday.getTime() <= now.getTime()) {
        nextSunday.setDate(nextSunday.getDate() + 7);
      }
      
      const diff = nextSunday.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeUntilNextClue(`${days}d ${hours}h ${minutes}m`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const handleGuess = () => {
    if (!currentClue || gameOver) return;

    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedAnswer = currentClue.answer.toLowerCase().trim();

    if (normalizedGuess === normalizedAnswer) {
      setMessage('Correct! Well done!');
      setGameOver(true);
    } else {
      const newGuesses = [...guesses, guess];
      setGuesses(newGuesses);
      
      if (newGuesses.length >= 6) {
        setMessage(`Game Over! The answer was: ${currentClue.answer}`);
        setGameOver(true);
      } else {
        setMessage(`Incorrect! You have ${6 - newGuesses.length} guesses remaining.`);
      }
    }
    
    setGuess('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  const showClueType = guesses.length >= 5 || gameOver;

  const highlightCorrectWords = (guess: string): React.ReactNode => {
    if (!currentClue) return guess;
    
    const guessWords = guess.toLowerCase().split(' ');
    const answerWords = currentClue.answer.toLowerCase().split(' ');
    
    return (
      <>
        {guess.split(' ').map((word, index) => (
          <span key={index}>
            {index > 0 && ' '}
            {guessWords[index] === answerWords[index] ? (
              <span className="text-[#6aaa64] font-bold">{word}</span>
            ) : (
              word
            )}
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#121213] text-white flex flex-col items-center justify-center p-4 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Cluemoji</h1>
          <div className="text-sm bg-[#3a3a3c] px-3 py-1 rounded">
            Next clue in: {timeUntilNextClue}
          </div>
        </div>
        
        {loading ? (
          <p className="text-center text-white/80">Loading this week's clue...</p>
        ) : currentClue ? (
          <div className="space-y-6">
            <div className="bg-[#1a365d] rounded-lg p-6 text-center">
              <div className="text-4xl whitespace-nowrap overflow-x-auto pb-2 text-white">
                {currentClue.emoji}
              </div>
              {showClueType && (
                <p className="text-white/90 mt-2">
                  {currentClue.type}
                  {currentClue.year && ` • ${currentClue.year}`}
                </p>
              )}
            </div>

            {!gameOver && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your guess"
                  className="w-full p-3 rounded bg-[#3a3a3c] text-white text-center text-xl focus:outline-none focus:ring-2 focus:ring-[#6aaa64]"
                />
                <button
                  onClick={handleGuess}
                  className="w-full bg-[#6aaa64] hover:bg-[#5a9a54] text-white py-3 rounded font-bold transition-colors"
                >
                  Submit
                </button>
              </div>
            )}

            {message && (
              <p className={`text-center text-lg ${message.includes('Correct') ? 'text-[#6aaa64]' : 'text-white/80'}`}>
                {message}
              </p>
            )}

            {guesses.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4 text-center">Previous Guesses</h2>
                <div className="space-y-2">
                  {guesses.map((g, i) => (
                    <div
                      key={i}
                      className="p-3 bg-[#3a3a3c] rounded text-center text-lg"
                    >
                      {highlightCorrectWords(g)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-white/80">Error loading clue. Please try again later.</p>
        )}
      </motion.div>
    </div>
  );
};

export default CluemojiGame; 