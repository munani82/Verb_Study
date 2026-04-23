import React from 'react';
import { motion } from 'motion/react';
import { UserProfile, RANKS } from '../types';
import { Trophy, BookOpen, AlertCircle, Award, ArrowLeft, TrendingUp } from 'lucide-react';

interface ParentDashboardProps {
  profiles: UserProfile[];
  onClose: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ profiles, onClose }) => {
  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white/5 rounded-xl text-text-dim transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight mt-1">부모님 관리 센터</h1>
            <p className="text-text-dim text-sm">실시간으로 우리 아이들의 성취도를 확인하세요</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {profiles.map((profile) => {
          const { progress, name, avatar } = profile;
          const learnedCount = progress.completedWords.length;
          const levelMax = progress.unlockedLevels.length;
          
          return (
            <motion.div 
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl shadow-inner border border-white/5">
                  {avatar}
                </div>
                <div>
                  <h3 className="text-2xl font-black">{name}</h3>
                  <div className="rank-tag mt-1 text-[10px] inline-block">
                    {progress.exp < 200 ? RANKS[0] : (progress.exp < 500 ? RANKS[1] : (progress.exp < 1000 ? RANKS[2] : RANKS[3]))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/3 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-text-dim text-[10px] font-black uppercase tracking-widest mb-1">
                    <TrendingUp className="w-3 h-3 text-secondary" /> 경험치
                  </div>
                  <div className="text-2xl font-black text-secondary">{progress.exp} <span className="text-xs opacity-50">XP</span></div>
                </div>
                <div className="bg-white/3 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-text-dim text-[10px] font-black uppercase tracking-widest mb-1">
                    <BookOpen className="w-3 h-3 text-primary" /> 단어 학습
                  </div>
                  <div className="text-2xl font-black text-primary">{learnedCount} <span className="text-xs opacity-50">개</span></div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">학습 단계 달성도</span>
                    <span className="text-xs font-bold text-white">{levelMax} / 4 단계 해제</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000" 
                      style={{ width: `${(levelMax / 4) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {progress.badges.length === 0 ? (
                    <span className="text-[10px] text-text-dim italic">아직 획득한 배지가 없습니다.</span>
                  ) : (
                    progress.badges.map(badge => (
                      <div key={badge} className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[9px] font-bold text-accent flex items-center gap-1">
                        <Award className="w-3 h-3" /> {badge}
                      </div>
                    ))
                  )}
                </div>

                {progress.incorrectWords.length > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-[11px] font-bold">오답 노트에 {progress.incorrectWords.length}개의 단어가 대기 중입니다.</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
