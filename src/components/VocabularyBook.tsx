import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, AlertCircle, Trash2, CheckCircle } from 'lucide-react';
import { Verb } from '../data/verbs';

interface VocabularyBookProps {
  completedWords: string[];
  incorrectWords: string[];
  verbs: Verb[];
  onRemoveIncorrect: (id: string) => void;
}

export const VocabularyBook: React.FC<VocabularyBookProps> = ({ completedWords, incorrectWords, verbs, onRemoveIncorrect }) => {
  const learned = verbs.filter(v => completedWords.includes(v.id));
  const missed = verbs.filter(v => incorrectWords.includes(v.id));

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Learned Section */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3">
            <BookOpen className="text-primary w-6 h-6" />
            <h2 className="text-2xl font-bold">나의 단어 상자 ({learned.length})</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {learned.length === 0 ? (
              <p className="text-slate-500 italic p-8 glass rounded-2xl text-center">아직 학습한 단어가 없습니다. 모험을 시작해보세요!</p>
            ) : (
              learned.map(v => (
                <motion.div 
                  layout
                  key={v.id} 
                  className="glass p-4 rounded-xl flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {v.level}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{v.word}</h4>
                      <p className="text-slate-400 text-sm">{v.meaning}</p>
                    </div>
                  </div>
                  <CheckCircle className="text-accent w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Incorrect Section */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3 text-secondary">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-2xl font-bold">복습이 필요해요 ({missed.length})</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {missed.length === 0 ? (
              <p className="text-slate-500 italic p-8 glass rounded-2xl text-center">참 잘했어요! 복습할 단어가 없습니다.</p>
            ) : (
              missed.map(v => (
                <motion.div 
                  layout
                  key={v.id} 
                  className="glass p-4 rounded-xl flex items-center justify-between border-secondary/20 bg-secondary/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">
                      !
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-secondary">{v.word}</h4>
                      <p className="text-slate-400 text-sm">{v.meaning}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemoveIncorrect(v.id)}
                    className="p-2 hover:bg-red-500/20 text-slate-500 hover:text-red-500 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
