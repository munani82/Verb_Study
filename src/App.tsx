/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  BookMarked, 
  LayoutDashboard, 
  GraduationCap, 
  Award,
  ChevronLeft
} from 'lucide-react';
import { useProgress } from './hooks/useProgress';
import { verbsData } from './data/verbs';
import { Dashboard } from './components/Dashboard';
import { WordCard } from './components/WordCard';
import { QuizView } from './components/QuizView';
import { VocabularyBook } from './components/VocabularyBook';

import { ProfileSelector } from './components/ProfileSelector';
import { LogOut, RefreshCw, Settings, UserCircle, ShieldCheck } from 'lucide-react';
import { signInWithGoogle, logout, auth } from './lib/firebase';
import { ParentDashboard } from './components/ParentDashboard';

type View = 'dashboard' | 'words' | 'vocabulary' | 'quiz' | 'admin';

export default function App() {
  const { 
    progress, 
    activeProfile, 
    profiles, 
    setActiveProfileId, 
    markWordCompleted, 
    addBadge, 
    addIncorrectWord, 
    removeIncorrectWord, 
    getRank 
  } = useProgress();
  
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    return auth.onAuthStateChanged(setUser);
  }, []);

  const levelVerbs = useMemo(() => {
    if (activeLevel === null) return [];
    return verbsData.filter(v => v.level === activeLevel);
  }, [activeLevel]);

  const handleLevelSelect = (level: number) => {
    setActiveLevel(level);
    setCurrentView('words');
  };

  const handleStartQuiz = () => {
    setCurrentView('quiz');
  };

  const handleQuizFinish = (score: number, missedIds: string[]) => {
    if (score === 5 && activeLevel) {
      addBadge(`레벨 ${activeLevel} 챔피언`);
    }
    
    missedIds.forEach(id => addIncorrectWord(id));
    setCurrentView('dashboard');
    setActiveLevel(null);
  };

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, omit alert for better UX
        console.log("로그인 팝업이 닫혔습니다.");
      } else if (error.code === 'auth/cancelled-by-user') {
        console.log("로그인이 취소되었습니다.");
      } else {
        alert("로그인 중 오류가 발생했습니다. 다시 시도해 주세요.");
        console.error("Login error:", error);
      }
    }
  };

  if (!activeProfile && currentView !== 'admin') {
    return (
      <div className="min-h-screen bg-bg p-8 flex flex-col items-center">
        <div className="w-full max-w-lg mb-8 flex justify-end">
          {user ? (
            <div className="flex items-center gap-3 glass p-2 px-4 rounded-full max-w-[280px] sm:max-w-none">
              <span className="text-xs font-bold text-text-dim whitespace-nowrap overflow-hidden text-ellipsis">
                {user.displayName} <span className="hidden sm:inline">(실시간 동기화)</span>
              </span>
              <button 
                onClick={() => setCurrentView('admin')}
                className="p-2 hover:bg-white/10 rounded-full text-secondary"
                title="관리자 설정"
              >
                <ShieldCheck className="w-5 h-5" />
              </button>
              <button onClick={logout} className="p-2 hover:bg-white/10 rounded-full text-text-dim">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="flex items-center gap-2 glass px-4 py-2 rounded-full hover:bg-white/10 transition-all text-xs font-bold"
            >
              <UserCircle className="w-4 h-4" /> 부모님 로그인 (클라우드 동기화)
            </button>
          )}
        </div>
        <ProfileSelector profiles={profiles} onSelect={setActiveProfileId} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-20 md:h-screen sticky top-0 bg-surface border-b md:border-b-0 md:border-r border-white/5 flex md:flex-col items-center py-4 md:py-8 px-4 gap-6 md:gap-10 z-50">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className={`nav-icon ${currentView === 'dashboard' ? 'active' : ''}`}
          title="대시보드"
        >
          <LayoutDashboard className="w-6 h-6" />
        </button>
        
        <button 
          onClick={() => {
            if (activeLevel) setCurrentView('words');
            else setCurrentView('dashboard');
          }}
          disabled={!activeLevel}
          className={`nav-icon ${currentView === 'words' ? 'active' : ''} ${!activeLevel ? 'opacity-20' : ''}`}
          title="현재 미션"
        >
          <Compass className="w-6 h-6" />
        </button>

        <button 
          onClick={() => setCurrentView('vocabulary')}
          className={`nav-icon ${currentView === 'vocabulary' ? 'active' : ''}`}
          title="나의 단어장"
        >
          <BookMarked className="w-6 h-6" />
        </button>

        <div className="md:mt-auto flex md:flex-col gap-4">
          {user && (
            <button 
              onClick={() => setCurrentView('admin')}
              className={`nav-icon ${currentView === 'admin' ? 'active' : ''}`}
              title="관리자 통계"
            >
              <ShieldCheck className="w-6 h-6" />
            </button>
          )}
          
          <button 
            onClick={() => {
              setActiveProfileId(null);
              setActiveLevel(null);
              setCurrentView('dashboard');
            }}
            className="nav-icon hover:text-secondary group"
            title="프로필 전환"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          
          {activeProfile && (
            <div className="flex flex-col items-center gap-1 group shrink-0">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-xl shadow-inner hidden md:flex">
                {activeProfile.avatar}
              </div>
              <span className="text-[10px] font-black text-text-dim group-hover:text-white transition-colors block md:hidden lg:block whitespace-nowrap">
                {activeProfile.name}
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-8 md:p-12 w-full">
        <AnimatePresence mode="wait">
          {currentView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ParentDashboard 
                profiles={profiles} 
                onClose={() => setCurrentView('dashboard')} 
              />
            </motion.div>
          )}

          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Dashboard 
                exp={progress.exp}
                rank={getRank()}
                unlockedLevels={progress.unlockedLevels}
                activeLevel={activeLevel}
                onSelectLevel={handleLevelSelect}
              />
              
              {/* Badges Section */}
              <div className="mt-16 bg-surface p-8 rounded-[2rem]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Award className="text-accent w-6 h-6" />
                    <h2 className="text-xl font-black uppercase tracking-tight">오늘의 업적</h2>
                  </div>
                  <span className="text-secondary text-xs font-black uppercase tracking-widest cursor-pointer">전체 보기</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {progress.badges.length === 0 ? (
                    <p className="text-text-dim text-sm italic">퀴즈에서 만점을 받아 멋진 배지를 획득해보세요!</p>
                  ) : (
                    progress.badges.map(badge => (
                      <motion.div 
                        key={badge}
                        whileHover={{ scale: 1.1, translateY: -5 }}
                        className="w-12 h-12 rounded-full bg-accent text-black flex items-center justify-center shadow-lg shadow-accent/20 cursor-help"
                        title={badge}
                      >
                        <Award className="w-6 h-6" />
                      </motion.div>
                    ))
                  )}
                </div>
                
                <div className="mt-8 p-4 bg-secondary/5 rounded-2xl border border-secondary/10 text-center">
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                    복습이 필요한 단어들: <strong>{progress.incorrectWords.length}개</strong>
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'words' && activeLevel && (
            <motion.div
              key="words"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="space-y-10"
            >
              <header className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-black text-secondary tracking-tighter">단계 0{activeLevel}</h2>
                  <p className="text-text-dim text-sm uppercase font-black tracking-widest mt-1">필수 동사 마스터하기</p>
                </div>
                <div className="bg-primary/20 px-6 py-3 rounded-2xl border border-primary/20 text-primary font-black">
                  {levelVerbs.filter(v => progress.completedWords.includes(v.id)).length} / {levelVerbs.length} 완료
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {levelVerbs.map(verb => (
                  <WordCard 
                    key={verb.id}
                    verb={verb}
                    isCompleted={progress.completedWords.includes(verb.id)}
                    onComplete={() => markWordCompleted(verb.id)}
                  />
                ))}
              </div>

              <div className="fixed bottom-10 left-0 right-0 md:left-20 flex justify-center z-40">
                <button 
                  onClick={handleStartQuiz}
                  className="btn-secondary px-12 py-5 shadow-2xl shadow-secondary/40 text-xl font-black uppercase tracking-widest"
                >
                  <GraduationCap className="w-6 h-6" /> 퀴즈 시작하기
                </button>
              </div>
            </motion.div>
          )}

          {currentView === 'quiz' && activeLevel && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
            >
              <QuizView 
                level={activeLevel}
                verbs={verbsData}
                onFinish={handleQuizFinish}
                onClose={() => setCurrentView('words')}
              />
            </motion.div>
          )}

          {currentView === 'vocabulary' && (
            <motion.div
              key="vocabulary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <VocabularyBook 
                completedWords={progress.completedWords}
                incorrectWords={progress.incorrectWords}
                verbs={verbsData}
                onRemoveIncorrect={removeIncorrectWord}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
