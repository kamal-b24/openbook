import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Check, X, Scissors, ZoomIn, ZoomOut } from 'lucide-react';
import { motion } from 'motion/react';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number | undefined
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect || 1,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, undefined));
  }

  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: PixelCrop
  ): Promise<string | null> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL('image/jpeg');
  };

  const handleDone = async () => {
    if (completedCrop && imgRef.current) {
      const croppedImage = await getCroppedImg(imgRef.current, completedCrop);
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      <div className="flex items-center justify-between p-4 bg-slate-900 text-white border-b border-white/10">
        <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={24} />
        </button>
        <div className="flex items-center gap-2">
          <Scissors size={20} className="text-emerald-400" />
          <span className="font-bold text-sm tracking-tight">Focus on Question</span>
        </div>
        <button 
          onClick={handleDone} 
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-full font-bold text-sm transition-all active:scale-95 flex items-center gap-2"
        >
          <Check size={20} /> Done
        </button>
      </div>

      <div className="relative flex-1 bg-black overflow-auto flex items-center justify-center p-4">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          className="max-h-full"
        >
          <img
            ref={imgRef}
            src={image}
            onLoad={onImageLoad}
            alt="Crop me"
            className="max-w-full max-h-[70vh] object-contain"
          />
        </ReactCrop>
      </div>
    </motion.div>
  );
};
