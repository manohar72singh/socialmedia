import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Download, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminImageGen() {
  const [prompt, setPrompt] = useState('');
  const [format, setFormat] = useState('landscape'); // landscape or square
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return toast.error('Please enter a prompt');
    
    setIsGenerating(true);
    const loadingToast = toast.loading('Generating marketing banner...');
    
    // Simulate generation delay for UX
    setTimeout(() => {
      const encodedPrompt = encodeURIComponent(prompt + " professional digital marketing ad banner, high quality, textless background");
      const width = format === 'landscape' ? 1200 : 1080;
      const height = format === 'landscape' ? 630 : 1080;
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${Math.random()}`;
      
      setGeneratedImage(url);
      setIsGenerating(false);
      toast.success('Image generated!', { id: loadingToast });
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">AI Banner Generator</h2>
        <p className="text-slate-400 text-sm">Generate stunning, royalty-free images and ad banners for your campaigns.</p>
      </div>

      <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Describe the Image</label>
            <input 
              type="text" 
              placeholder="e.g., A futuristic laptop with glowing neon SEO charts..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Format</label>
              <select 
                value={format}
                onChange={e => setFormat(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="landscape">Landscape (1200x630) - Best for Facebook/LinkedIn/Blogs</option>
                <option value="square">Square (1080x1080) - Best for Instagram</option>
              </select>
            </div>
            <div className="flex items-end">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] disabled:opacity-50 flex items-center gap-2"
              >
                <Sparkles size={18} /> {isGenerating ? 'Generating...' : 'Generate Image'}
              </button>
            </div>
          </div>
        </div>

        {generatedImage && (
          <div className="pt-6 border-t border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Layers size={18} className="text-indigo-400" /> Result
              </h3>
              <a 
                href={generatedImage} 
                target="_blank" 
                rel="noreferrer"
                download="ai-banner.jpg"
                className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium"
              >
                <Download size={16} /> Download Full Quality
              </a>
            </div>
            <div className="bg-slate-900 rounded-xl p-2 border border-slate-700 flex justify-center">
              <img 
                src={generatedImage} 
                alt="AI Generated Banner" 
                className={`rounded-lg object-contain ${format === 'landscape' ? 'w-full max-h-[400px]' : 'h-[500px] w-[500px]'}`} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
