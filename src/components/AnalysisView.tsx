import React from 'react';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';
import { BookOpen, Loader2, Download, Share2 } from 'lucide-react';

interface AnalysisViewProps {
  isLoading: boolean;
  answer: string | null;
  error: string | null;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ isLoading, answer, error }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-6"
        >
          <Loader2 className="w-12 h-12 text-emerald-500" />
        </motion.div>
        <h3 className="text-xl font-serif font-bold text-slate-800 mb-2">Solving Question...</h3>
        <p className="text-slate-500 text-sm">Checking TU BBS 4th Year Syllabus</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 p-6 rounded-3xl text-center mx-4">
        <p className="text-red-600 font-medium text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-xs font-bold text-red-700 underline uppercase tracking-wider"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!answer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto mt-6 px-4"
    >
      <div className="bg-white rounded-[2rem] p-6 md:p-12 border border-slate-100 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Solution</span>
          </div>
          <div className="flex gap-1">
            <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
              <Download size={18} />
            </button>
            <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        <div className="markdown-body">
          <Markdown>{answer}</Markdown>
        </div>
        
        <div className="mt-12 pt-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <span>TU BBS 4th Year Curriculum</span>
          <span>Open Book Engine</span>
        </div>
      </div>
    </motion.div>
  );
};
