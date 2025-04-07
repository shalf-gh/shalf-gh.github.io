import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Clue {
  emoji: string;
  answer: string;
  type: string;
}

const EmojiClueGame = () => {
  const [currentClue, setCurrentClue] = useState<Clue | null>(null);
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get the current week number (0-51)
    const weekNumber = Math.floor((new Date().getTime() / (7 * 24 * 60 * 60 * 1000)) % 36);
    // Load the clue for this week
    fetch('/src/assets/cluemoji.txt')
      .then(response => response.text())
      .then(text => {
        const lines = text.split('\n');
        const clues = lines.filter(line => line.trim().startsWith('Clues:'));
        const answers = lines.filter(line => line.trim().startsWith('Answers:'));
        
        if (clues.length > 0 && answers.length > 0) {
          const clueLine = clues[0].split('\t')[1].trim();
          const answerLine = answers[0].split('\t')[1].trim();
          
          setCurrentClue({
            emoji: clueLine,
            answer: answerLine,
            type: clueLine.split(':')[0].trim()
          });
        }
      });
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/50 backdrop-blur-sm p-6 rounded-lg"
    >
      <h3 className="text-xl font-bold mb-4 text-white">Cluemoji</h3>
      
      {currentClue ? (
        <>
          <div className="mb-4">
            <p className="text-gray-300 mb-2">Type: {currentClue.type}</p>
            <p className="text-4xl mb-4">{currentClue.emoji}</p>
          </div>

          {!gameOver && (
            <div className="mb-4">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Enter your guess"
                className="w-full p-2 rounded bg-gray-800 text-white mb-2"
              />
              <button
                onClick={handleGuess}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
              >
                Submit Guess
              </button>
            </div>
          )}

          {message && (
            <p className={`mb-4 ${message.includes('Correct') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}

          {guesses.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-300 mb-2">Previous guesses:</p>
              <ul className="text-gray-400">
                {guesses.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-300">Loading this week's clue...</p>
      )}
    </motion.div>
  );
};

export default EmojiClueGame; 