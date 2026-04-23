import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, ChevronRight } from 'lucide-react';

interface AdminAuthProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onSuccess, onCancel }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const correctPin = '2930';

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      if (newPin === correctPin) {
        setTimeout(onSuccess, 300);
      } else if (newPin.length === 4) {
        setError(true);
        setTimeout(() => setPin(''), 500);
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm glass p-8 rounded-[2.5rem] flex flex-col items-center border-t-2 border-white/10"
      >
        <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center mb-6">
          <Lock className="text-primary w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-black mb-2 tracking-tight">부모님 인증</h2>
        <p className="text-text-dim text-xs font-bold uppercase tracking-widest mb-8">4자리 관리자 암호를 입력하세요</p>

        <div className="flex gap-4 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                error ? 'bg-red-500 border-red-500 animate-shake' : 
                pin.length > i ? 'bg-primary border-primary scale-110' : 'border-white/10'
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'].map((key, idx) => {
            if (key === '') return <div key={idx} />;
            if (key === 'back') {
              return (
                <button
                  key={idx}
                  onClick={handleBackspace}
                  className="h-16 rounded-2xl bg-white/3 flex items-center justify-center hover:bg-white/10 transition-all font-black text-xs uppercase tracking-widest"
                >
                  지우기
                </button>
              );
            }
            return (
              <button
                key={idx}
                onClick={() => handleNumberClick(key)}
                className="h-16 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-2xl font-black"
              >
                {key}
              </button>
            );
          })}
        </div>

        <button 
          onClick={onCancel}
          className="mt-8 text-text-dim hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors"
        >
          <X className="w-4 h-4" /> 취소하고 돌아가기
        </button>
      </motion.div>
    </div>
  );
};
