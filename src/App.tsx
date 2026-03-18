import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Info, RefreshCw } from 'lucide-react';
import { FileUploader } from './components/FileUploader';
import { LanguageSelector } from './components/LanguageSelector';
import { AnalysisView } from './components/AnalysisView';
import { ImageCropper } from './components/ImageCropper';
import { analyzeQuestion } from './services/gemini';

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [language, setLanguage] = useState<'English' | 'Nepali' | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setAnswer(null);
    setError(null);
    setLanguage(null);
    setCroppedImage(null);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDFs, skip cropping
      setPreviewUrl(null);
      setShowCropper(false);
    }
  };

  const handleCropComplete = (cropped: string) => {
    setCroppedImage(cropped);
    setShowCropper(false);
  };

  const handleLanguageSelect = async (lang: 'English' | 'Nepali') => {
    if (!selectedFile && !croppedImage) return;
    
    setLanguage(lang);
    setIsAnalyzing(true);
    setError(null);

    try {
      const finalImage = croppedImage || previewUrl;
      if (finalImage) {
        const result = await analyzeQuestion(finalImage, 'image/jpeg', lang);
        setAnswer(result || "No solution found.");
      } else if (selectedFile) {
        // Handle PDF or non-image files
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = async () => {
          const base64 = reader.result as string;
          try {
            const result = await analyzeQuestion(base64, selectedFile.type, lang);
            setAnswer(result || "No solution found.");
          } catch (err: any) {
            setError("Failed to solve the question. Please ensure the photo is clear.");
          } finally {
            setIsAnalyzing(false);
          }
        };
        return;
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to solve the question. Please ensure the photo is clear.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCroppedImage(null);
    setShowCropper(false);
    setLanguage(null);
    setAnswer(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF8]">
      {/* Cropper Modal */}
      {showCropper && previewUrl && (
        <ImageCropper
          image={previewUrl}
          onCropComplete={handleCropComplete}
          onCancel={() => setShowCropper(false)}
        />
      )}

      {/* Header */}
      <header className="py-6 px-4 sticky top-0 bg-[#FDFCF8]/80 backdrop-blur-md z-10 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
              <Book className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-slate-900 leading-none">Open Book</h1>
              <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest mt-1">TU BBS 4th Year</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {(selectedFile || croppedImage) && (
              <button 
                onClick={reset}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-all"
              >
                <RefreshCw size={18} />
              </button>
            )}
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Info size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {!selectedFile ? (
              <motion.section
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center"
              >
                <div className="text-center mb-10 px-4">
                  <h2 className="text-3xl font-serif font-bold text-slate-900 mb-3 leading-tight">
                    Expert Solutions for BBS 4th Year
                  </h2>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto">
                    Get accurate answers for all subjects including mathematical problems.
                  </p>
                </div>
                <FileUploader 
                  onFileSelect={handleFileSelect} 
                  selectedFile={selectedFile}
                  onClear={reset}
                />
              </motion.section>
            ) : !language ? (
              <motion.section
                key="language"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="flex flex-col items-center gap-6">
                  <LanguageSelector onSelect={handleLanguageSelect} />
                </div>
              </motion.section>
            ) : (
              <motion.section
                key="analysis"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AnalysisView 
                  isLoading={isAnalyzing} 
                  answer={answer} 
                  error={error} 
                />
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-slate-100 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-bold">
            Made By Kamal Belbase 🇳🇵
          </p>
        </div>
      </footer>
    </div>
  );
}
