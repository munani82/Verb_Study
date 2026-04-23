import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Award, RefreshCcw, Home } from 'lucide-react';
import { Verb } from '../data/verbs';

interface QuizViewProps {
  level: number;
  verbs: Verb[];
  onFinish: (score: number, missedIds: string[]) => void;
  onClose: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ level, verbs, onFinish, onClose }) => {
  const levelVerbs = useMemo(() => {
    return [...verbs].filter(v => v.level === level).sort(() => Math.random() - 0.5).slice(0, 5);
  }, [level, verbs]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [missedIds, setMissedIds] = useState<string[]>([]);

  const currentVerb = levelVerbs[currentIdx];

  // Generate options including the correct one and 3 random ones
  const options = useMemo(() => {
    if (!currentVerb) return [];
    const wrong = verbs
      .filter(v => v.id !== currentVerb.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(v => v.meaning);
    return [currentVerb.meaning, ...wrong].sort(() => Math.random() - 0.5);
  }, [currentVerb, verbs]);

  const handleSelect = (option: string) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);
    const correct = option === currentVerb.meaning;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
    } else {
      setMissedIds(prev => [...prev, currentVerb.id]);
    }

    setTimeout(() => {
      if (currentIdx < levelVerbs.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  if (showResult) {
    const perfect = score === 5;
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-3xl p-10 text-center max-w-lg mx-auto"
      >
        <div className="mb-6 flex justify-center">
          {perfect ? (
            <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce shadow-xl shadow-yellow-500/40">
              <Award className="text-white w-12 h-12" />
            </div>
          ) : (
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-4xl font-black text-white">{score}/5</motion.div>
            </div>
          )}
        </div>
        
        <h2 className="text-3xl font-extrabold mb-2">
          {perfect ? "레벨 마스터 달성!" : "조금만 더 힘내세요!"}
        </h2>
        <p className="text-slate-400 mb-8">
          {perfect ? "레벨 " + level + " 황금 배지를 획득하셨습니다!" : "레벨 " + level + " 마스터를 위해 복습해볼까요?"}
        </p>

        <div className="flex gap-4">
          <button onClick={() => onFinish(score, missedIds)} className="btn-primary flex-1">
            <Home className="w-5 h-5" /> 메인 메뉴로
          </button>
          {!perfect && (
            <button onClick={() => {
              setCurrentIdx(0);
              setScore(0);
              setShowResult(false);
              setSelectedOption(null);
              setIsCorrect(null);
              setMissedIds([]);
            }} className="btn-secondary flex-1">
              <RefreshCcw className="w-5 h-5" /> 다시 시도
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">퀴즈: 레벨 {level}</h2>
        <div className="flex gap-1">
          {levelVerbs.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 w-8 rounded-full transition-all ${i === currentIdx ? 'bg-primary' : i < currentIdx ? 'bg-accent' : 'bg-slate-700'}`}
            />
          ))}
        </div>
      </div>

      <motion.div 
        key={currentIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="glass rounded-2xl p-10 text-center"
      >
        <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">다음 단어의 뜻은 무엇일까요?</p>
        <h3 className="text-5xl font-black text-white mb-10 tracking-tight">{currentVerb.word}</h3>

        <div className="grid grid-cols-1 gap-4">
          {options.map((option) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = option === currentVerb.meaning;
            
            let btnClass = "bg-slate-800/50 hover:bg-slate-800 border-white/10";
            if (isSelected) {
              btnClass = isCorrect ? "bg-accent border-accent text-white" : "bg-red-500 border-red-500 text-white";
            } else if (selectedOption !== null && isCorrectOption) {
              btnClass = "bg-accent/40 border-accent text-white";
            }

            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                disabled={selectedOption !== null}
                className={`p-5 rounded-2xl border-2 text-xl font-black transition-all flex items-center justify-between shadow-lg ${btnClass}`}
              >
                {option}
                {isSelected && (
                  isCorrect ? <CheckCircle2 className="w-6 h-6 text-black" /> : <XCircle className="w-6 h-6 text-white" />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors block mx-auto text-sm font-bold uppercase tracking-widest">
        Cancel Quiz
      </button>
    </div>
  );
};
