import { Rewind, FastForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SeekIndicatorProps {
  direction: 'left' | 'right';
  isVisible: boolean;
}

export function SeekIndicator({ direction, isVisible }: SeekIndicatorProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.3 }}
          className={`absolute top-1/2 -translate-y-1/2 ${
            direction === 'left' ? 'left-8' : 'right-8'
          } bg-black/80 rounded-full p-8 flex flex-col items-center justify-center`}
        >
          {direction === 'left' ? (
            <Rewind className="w-8 h-8 text-white" />
          ) : (
            <FastForward className="w-8 h-8 text-white" />
          )}
          <span className="text-white font-bold mt-2">10 seconds</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}