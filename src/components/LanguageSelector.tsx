import React from 'react';
import { motion } from 'motion/react';
import { Languages } from 'lucide-react';

interface LanguageSelectorProps {
  onSelect: (lang: 'English' | 'Nepali') => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto mt-12 text-center"
    >
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-6">
        <Languages size={16} />
        Choose Answer Language
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onSelect('English')}
          className="group relative bg-white border border-slate-200 p-8 rounded-3xl hover:border-emerald-500 hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl font-serif">A</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">English</h3>
          <p className="text-sm text-slate-500">Standard Academic</p>
        </button>
        
        <button
          onClick={() => onSelect('Nepali')}
          className="group relative bg-white border border-slate-200 p-8 rounded-3xl hover:border-emerald-500 hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl font-serif">क</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">Nepali</h3>
          <p className="text-sm text-slate-500">नेपाली माध्यम</p>
        </button>
      </div>
    </motion.div>
  );
};
