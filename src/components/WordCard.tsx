import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, CheckCircle2 } from 'lucide-react';
import { Verb } from '../data/verbs';

interface WordCardProps {
  verb: Verb;
  isCompleted: boolean;
  onComplete: () => void;
}

export const WordCard: React.FC<WordCardProps> = ({ verb, isCompleted, onComplete }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && !isCompleted) {
      // Small delay to mark as completed after flipping to see the back
    }
  };

  const speak = (e: React.MouseEvent) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(verb.word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const getFontSize = (word: string, isFront: boolean) => {
    const len = word.length;
    if (isFront) {
      if (len <= 6) return 'text-6xl md:text-7xl';
      if (len <= 10) return 'text-4xl md:text-5xl';
      return 'text-2xl md:text-3xl';
    } else {
      if (len <= 8) return 'text-3xl';
      if (len <= 12) return 'text-xl';
      return 'text-lg';
    }
  };

  return (
    <div 
      className="card-flip-container h-96 w-full cursor-pointer"
      onClick={handleFlip}
    >
      <div 
        className={`card-flip-inner relative h-full w-full ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* Front */}
        <div className="card-flip-front glass absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#23272F] to-[#1A1D23]">
          <div className="absolute top-4 right-4 animate-pulse">
            {isCompleted && <CheckCircle2 className="text-secondary w-6 h-6" />}
          </div>
          <h3 className={`font-black text-secondary tracking-tighter mb-4 ${getFontSize(verb.word, true)}`}>
            {verb.word}
          </h3>
          <p className="text-text-dim text-xs font-bold uppercase tracking-widest opacity-50">카드를 눌러 뜻과 예문을 확인하세요</p>
        </div>

        {/* Back */}
        <div className="card-flip-back glass absolute inset-0 flex flex-col items-center p-6 text-center bg-surface overflow-hidden">
          <div className="mt-2 flex flex-col items-center gap-4 w-full">
            <div className="flex items-center gap-4">
              <h3 className={`font-black text-primary tracking-tight ${getFontSize(verb.word, false)}`}>{verb.word}</h3>
              <button 
                onClick={speak}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-90"
                title="발음 듣기"
              >
                <Volume2 className="text-secondary w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 w-full text-left">
              <div className="bg-white/5 p-3 rounded-xl border-l-4 border-secondary">
                <p className="text-[9px] uppercase tracking-widest text-text-dim font-black mb-1">의미 (Meaning)</p>
                <p className="text-xl font-bold text-text">{verb.meaning}</p>
              </div>
              
              <div className="bg-white/3 p-3 rounded-xl">
                <p className="text-[9px] uppercase tracking-widest text-text-dim font-black mb-1">예문 (Example)</p>
                <p className="text-sm italic text-text leading-tight tracking-tight">"{verb.example}"</p>
              </div>

              {!isCompleted && isFlipped && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onComplete();
                  }}
                  className="w-full py-3.5 bg-secondary text-black font-black uppercase text-[10px] tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-secondary/20 mt-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  학습 완료 표시
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
