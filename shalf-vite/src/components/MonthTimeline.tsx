import React from 'react';
import { motion } from 'framer-motion';

interface TimelineProps {
  totalMonths: number;
  activeMonth: number;
  onMonthClick: (month: number) => void;
}

const MonthTimeline: React.FC<TimelineProps> = ({ 
  totalMonths, 
  activeMonth, 
  onMonthClick 
}) => {
  return (
    <div className="fixed top-5 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div className="relative w-4/5 md:w-2/3 lg:w-1/2 h-10 flex items-center pointer-events-auto">
        {/* The timeline line */}
        <div className="absolute h-0.5 bg-gray-400 bg-opacity-60 w-full"></div>
        
        {/* The timeline nodes */}
        {Array.from({ length: totalMonths }).map((_, index) => {
          const isActive = index === activeMonth;
          
          return (
            <motion.button
              key={index}
              className={`absolute w-4 h-4 rounded-full flex items-center justify-center -translate-x-1/2 cursor-pointer focus:outline-none`}
              style={{ left: `${(index / (totalMonths - 1)) * 100}%` }}
              onClick={() => onMonthClick(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              initial={false}
              animate={{
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(107, 114, 128, 0.8)',
                boxShadow: isActive ? '0 0 8px 2px rgba(255, 255, 255, 0.5)' : 'none'
              }}
            >
              {isActive && (
                <div className="absolute -bottom-7 whitespace-nowrap text-xs font-medium text-amber-100 bg-amber-800 bg-opacity-80 px-2 py-1 rounded-full">
                  Month {index + 1}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthTimeline; 