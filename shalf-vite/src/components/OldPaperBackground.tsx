import React from 'react';
import { motion } from 'framer-motion';

const OldPaperBackground: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 w-full h-full -z-10 bg-amber-50"
      style={{
        background: 'linear-gradient(to bottom right, #f5f5dc, #f0e6d2, #e8dcc8)',
        overflow: 'hidden'
      }}
    >
      {/* Paper texture overlay */}
      <div 
        className="absolute inset-0 opacity-70" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Coffee stain effects */}
      <motion.div 
        className="absolute w-32 h-32 rounded-full bg-amber-800 opacity-5"
        style={{ top: '15%', right: '10%', filter: 'blur(10px)' }}
        animate={{ 
          scale: [1, 1.02, 1],
          opacity: [0.05, 0.08, 0.05]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 8,
          repeatType: 'reverse' 
        }}
      />

      <motion.div 
        className="absolute w-24 h-24 rounded-full bg-amber-900 opacity-5"
        style={{ bottom: '20%', left: '15%', filter: 'blur(8px)' }}
        animate={{ 
          scale: [1, 1.03, 1],
          opacity: [0.05, 0.07, 0.05]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 10,
          repeatType: 'reverse',
          delay: 2
        }}
      />

      {/* Fold lines */}
      <div 
        className="absolute h-full w-px bg-amber-800 opacity-5 left-1/2 transform -translate-x-1/2"
      />
      <div 
        className="absolute w-full h-px bg-amber-800 opacity-5 top-1/2 transform -translate-y-1/2"
      />
    </div>
  );
};

export default OldPaperBackground; 