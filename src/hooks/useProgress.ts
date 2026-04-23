import { useState, useEffect } from 'react';
import { UserProgress, UserProfile, Rank, RANKS } from '../types';

const STORAGE_KEY = 'verb_voyage_profiles';
const ACTIVE_PROFILE_KEY = 'verb_voyage_active_id';

const initialProgress: UserProgress = {
  unlockedLevels: [1],
  completedWords: [],
  incorrectWords: [],
  exp: 0,
  badges: []
};

const defaultProfiles: UserProfile[] = [
  { id: 'child-1', name: '루미소율', avatar: '👧', progress: { ...initialProgress } },
  { id: 'child-2', name: '조이소원', avatar: '👩‍🦰', progress: { ...initialProgress } }
];

export const useProgress = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: UserProfile[] = JSON.parse(saved);
      // 구 버전 이름 감지 시 강제 업데이트 로직 추가
      return parsed.map(p => {
        if (p.id === 'child-1' && p.name === '첫째 탐험가') return { ...p, name: '루미소율', avatar: '👧' };
        if (p.id === 'child-2' && p.name === '둘째 탐험가') return { ...p, name: '조이소원', avatar: '👩‍🦰' };
        return p;
      });
    }
    return defaultProfiles;
  });

  const [activeProfileId, setActiveProfileId] = useState<string | null>(() => {
    return localStorage.getItem(ACTIVE_PROFILE_KEY);
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    if (activeProfileId) {
      localStorage.setItem(ACTIVE_PROFILE_KEY, activeProfileId);
    }
  }, [activeProfileId]);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || null;
  const progress = activeProfile?.progress || initialProgress;

  const updateActiveProgress = (updater: (prev: UserProgress) => UserProgress) => {
    if (!activeProfileId) return;
    setProfiles(prevProfiles => prevProfiles.map(p => 
      p.id === activeProfileId ? { ...p, progress: updater(p.progress) } : p
    ));
  };

  const markWordCompleted = (id: string) => {
    if (progress.completedWords.includes(id)) return;
    
    updateActiveProgress(prev => {
      const newCompleted = [...prev.completedWords, id];
      const newExp = prev.exp + 10;
      const updatedLevels = [...prev.unlockedLevels];
      
      const counts = [1, 2, 3].map(lvl => newCompleted.filter(wid => wid.startsWith(`v${lvl}-`)).length);
      if (counts[0] >= 10 && !updatedLevels.includes(2)) updatedLevels.push(2);
      if (counts[1] >= 10 && !updatedLevels.includes(3)) updatedLevels.push(3);
      if (counts[2] >= 10 && !updatedLevels.includes(4)) updatedLevels.push(4);

      return { ...prev, completedWords: newCompleted, exp: newExp, unlockedLevels: updatedLevels };
    });
  };

  const addBadge = (badge: string) => {
    if (progress.badges.includes(badge)) return;
    updateActiveProgress(prev => ({ ...prev, badges: [...prev.badges, badge] }));
  };

  const addIncorrectWord = (id: string) => {
    if (progress.incorrectWords.includes(id)) return;
    updateActiveProgress(prev => ({ ...prev, incorrectWords: [...prev.incorrectWords, id] }));
  };

  const removeIncorrectWord = (id: string) => {
    updateActiveProgress(prev => ({ ...prev, incorrectWords: prev.incorrectWords.filter(wid => wid !== id) }));
  };

  const getRank = (): Rank => {
    if (progress.exp < 200) return RANKS[0];
    if (progress.exp < 500) return RANKS[1];
    if (progress.exp < 1000) return RANKS[2];
    return RANKS[3];
  };

  return { 
    progress, 
    activeProfile, 
    profiles, 
    setActiveProfileId, 
    markWordCompleted, 
    addBadge, 
    addIncorrectWord, 
    removeIncorrectWord, 
    getRank 
  };
};
