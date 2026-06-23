import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ImageUpload({ onUploadComplete, currentImage }) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return toast.error('Please select a valid image file');
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('File size must be less than 5MB');
    }

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    const tId = toast.loading('Uploading image...');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        // Note: DO NOT set Content-Type header here; browser sets it automatically with boundary for FormData
        body: formData
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setPreview(data.url);
        onUploadComplete(data.url);
        toast.success('Image uploaded successfully!', { id: tId });
      } else {
        toast.error(data.error || 'Failed to upload', { id: tId });
      }
    } catch (err) {
      toast.error('Network Error during upload', { id: tId });
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setPreview('');
    onUploadComplete('');
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Image Upload</label>
      
      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 group h-48">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl"
              title="Change Image"
            >
              <UploadCloud size={20} />
            </button>
            <button
              type="button"
              onClick={removeImage}
              className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-xl"
              title="Remove Image"
            >
              <X size={20} />
            </button>
          </div>
          <div className="absolute top-2 right-2 bg-emerald-500/90 text-white p-1 rounded-full shadow-lg">
            <CheckCircle2 size={16} />
          </div>
        </div>
      ) : (
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
            isUploading ? 'border-slate-600 bg-slate-800/50' : 'border-indigo-500/50 hover:border-indigo-400 bg-slate-900/50 hover:bg-slate-800'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center text-slate-400">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-bold">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mb-3 text-indigo-400">
                <ImageIcon size={24} />
              </div>
              <p className="font-bold text-white mb-1">Click to upload an image</p>
              <p className="text-xs">JPEG, PNG, WEBP (Max 5MB)</p>
            </div>
          )}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg, image/png, image/webp, image/gif"
        className="hidden"
      />
    </div>
  );
}
