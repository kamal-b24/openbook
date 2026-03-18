import React, { useRef } from 'react';
import { Upload, Camera, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, selectedFile, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-4"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,application/pdf"
              className="hidden"
            />
            <input
              type="file"
              ref={cameraInputRef}
              onChange={handleFileChange}
              accept="image/*"
              capture="environment"
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-4 bg-white border-2 border-slate-100 p-6 rounded-3xl shadow-sm hover:border-emerald-500 hover:shadow-md transition-all active:scale-95"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                <Upload size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-800">Upload Photo/File</h3>
                <p className="text-xs text-slate-500">Select Image or PDF</p>
              </div>
            </button>

            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center gap-4 bg-emerald-600 p-6 rounded-3xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
            >
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                <Camera size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white">Click Photo</h3>
                <p className="text-xs text-white/80">Use your camera</p>
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xl flex items-center gap-4"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 shrink-0">
              {selectedFile.type.startsWith('image/') ? (
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <FileText className="w-8 h-8 text-slate-400" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-800 truncate text-sm">{selectedFile.name}</h4>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                Ready to solve
              </p>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
