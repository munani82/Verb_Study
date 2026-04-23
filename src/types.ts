
export interface Verb {
  id: string;
  word: string;
  meaning: string;
  example: string;
  level: 1 | 2 | 3 | 4;
}

export type Rank = '초보 모험가' | '숙련된 탐험가' | '동사 마스터' | '대현자';

export interface UserProgress {
  unlockedLevels: number[];
  completedWords: string[];
  incorrectWords: string[];
  exp: number;
  badges: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  progress: UserProgress;
}

export const RANKS: Rank[] = ['초보 모험가', '숙련된 탐험가', '동사 마스터', '대현자'];
