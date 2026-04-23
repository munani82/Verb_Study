import React from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';

interface ProfileSelectorProps {
  profiles: UserProfile[];
  onSelect: (id: string) => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({ profiles, onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-4xl font-black mb-4 tracking-tighter">누구의 모험인가요?</h2>
        <p className="text-text-dim">프로필을 선택하여 학습을 시작하세요</p>
      </motion.div>

      <div className="flex gap-8">
        {profiles.map((profile) => (
          <motion.button
            key={profile.id}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(profile.id)}
            className="flex flex-col items-center gap-4 group"
          >
            <div className="w-24 h-24 rounded-3xl bg-surface border-2 border-white/5 flex items-center justify-center text-4xl group-hover:border-primary transition-all shadow-xl shadow-black/20">
              {profile.avatar}
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold">{profile.name}</h3>
              <div className="mt-2 rank-tag text-[10px]">{profile.progress.exp} XP</div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
