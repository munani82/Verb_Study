import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, ChevronRight, Lock } from 'lucide-react';
import { Rank } from '../types';

interface DashboardProps {
  exp: number;
  rank: Rank;
  unlockedLevels: number[];
  onSelectLevel: (level: number) => void;
  activeLevel: number | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ exp, rank, unlockedLevels, onSelectLevel, activeLevel }) => {
  const expToNext = 1000;
  const progressPercent = (exp % expToNext) / 10;

  return (
    <div className="space-y-10">
      <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-center gap-3">
        <span className="text-2xl">👋</span>
        <p className="text-sm font-bold text-primary">반가워요, <span className="text-white text-base">{rank === '대현자' ? '존경하는 ' : ''}{rank}</span>님! 오늘도 즐겁게 공부해볼까요?</p>
      </div>

      {/* Header with Rank and XP */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black tracking-tight">동사 마스터 원정대</h1>
          <p className="text-text-dim text-sm mt-1">목표: 10개 단어를 학습하여 다음 단계를 해제하세요!</p>
        </div>
        
        <div className="flex-1 max-w-md w-full px-4">
          <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest mb-1.5">
            <span className="text-secondary">레벨 1 모험가</span>
            <span className="text-text-dim">{exp} / {expToNext} XP</span>
          </div>
          <div className="xp-bar-bg">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercent, 100)}%` }}
              className="xp-bar-fill"
            />
          </div>
        </div>

        <div className="rank-tag shrink-0">{rank}</div>
      </header>

      {/* Main Grid: Level Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((level) => {
          const isUnlocked = unlockedLevels.includes(level);
          const isActive = activeLevel === level;
          
          let stepName = "";
          let icon = "🔒";

          switch(level) {
            case 1: stepName = "일상 생활 (Daily)"; icon = isUnlocked ? "🏃" : "🔒"; break;
            case 2: stepName = "생각과 감정 (Cognitive)"; icon = isUnlocked ? "🧠" : "🔒"; break;
            case 3: stepName = "사회 활동 (Social)"; icon = isUnlocked ? "🤝" : "🔒"; break;
            case 4: stepName = "고급 표현 (Advanced)"; icon = isUnlocked ? "🎓" : "🔒"; break;
          }
          
          return (
            <motion.button
              key={level}
              whileHover={isUnlocked ? { y: -5, borderColor: 'var(--color-secondary)' } : {}}
              whileTap={isUnlocked ? { scale: 0.98 } : {}}
              onClick={() => isUnlocked && onSelectLevel(level)}
              disabled={!isUnlocked}
              className={`text-left p-6 rounded-3xl border-2 transition-all relative
                ${isUnlocked 
                  ? isActive 
                    ? 'bg-primary/20 border-primary shadow-xl shadow-primary/10' 
                    : 'bg-surface border-white/5 hover:bg-surface/80' 
                  : 'bg-surface/40 border-white/5 opacity-50 cursor-not-allowed'
                }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`text-[10px] font-black uppercase tracking-widest ${isUnlocked ? 'text-secondary' : 'text-text-dim'}`}>
                  단계 0{level}
                </div>
                <div className="text-2xl">{icon}</div>
              </div>
              
              <h3 className="text-lg font-black leading-tight mb-2">{stepName}</h3>
              <p className="text-xs text-text-dim font-medium">
                {isUnlocked ? "모험 가능" : "레벨 " + (level-1) + "를 먼저 완료하세요"}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
