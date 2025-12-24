
import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { processMoodText, generateMoodImage } from '../geminiService';
import { MoodEntry } from '../types';

interface MoodInputProps {
  entries: MoodEntry[];
  onEntryAdded: (entry: MoodEntry) => void;
  initialDate: string;
  onCancel: () => void;
}

const MoodInput: React.FC<MoodInputProps> = ({ entries, onEntryAdded, initialDate, onCancel }) => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setIsProcessing(true);
    setLoadingStep('正在感应微光...');
    
    try {
      const existingEntry = entries.find(e => {
        const d = new Date(e.date);
        const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return dStr === initialDate;
      });

      const fullText = existingEntry ? `${existingEntry.rawText}\n${text}` : text;

      const processed = await processMoodText(fullText);
      setLoadingStep('正在重绘背景...');
      
      const imageUrl = await generateMoodImage(processed.imagePrompt);

      const [year, month, day] = initialDate.split('-').map(Number);
      const finalDate = new Date();
      finalDate.setFullYear(year, month - 1, day);
      finalDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone shift issues

      const newEntry: MoodEntry = {
        id: existingEntry?.id || Date.now().toString(),
        date: finalDate.toISOString(),
        rawText: fullText,
        poeticQuote: processed.poeticQuote,
        imageUrl: imageUrl,
        keywords: processed.keywords,
        highlights: processed.highlights || [] // Ensure it's never undefined
      };

      onEntryAdded(newEntry);
      setText('');
    } catch (error) {
      console.error("Generation failed:", error);
      alert('转化失败，请重试。');
    } finally {
      setIsProcessing(false);
      setLoadingStep('');
    }
  };

  const hasExisting = entries.some(e => {
    const d = new Date(e.date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` === initialDate;
  });

  return (
    <div className="w-full">
      <div className="relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="那些闪闪发光的瞬间，都值得被定格..."
          className="w-full min-h-[300px] p-0 text-2xl bg-transparent border-none outline-none transition-all resize-none font-serif-sc leading-relaxed placeholder:text-stone-200"
          disabled={isProcessing}
          autoFocus
        />
        
        <div className="mt-12 flex items-center justify-between">
          <button 
            onClick={onCancel}
            disabled={isProcessing}
            className="text-stone-400 font-serif-sc hover:text-stone-600 transition-colors"
          >
            稍后再记
          </button>

          <button
            onClick={handleGenerate}
            disabled={!text.trim() || isProcessing}
            className={`
              flex items-center gap-4 px-12 py-5 rounded-full bg-stone-900 text-white font-medium 
              shadow-2xl hover:bg-stone-800 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all 
              disabled:opacity-10 disabled:pointer-events-none
            `}
          >
            {isProcessing ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
            <span className="text-xl font-serif-sc tracking-wide">
              {hasExisting ? '追加瞬间' : '生成记忆'}
            </span>
          </button>
        </div>
      </div>

      {isProcessing && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-[3rem] animate-in fade-in duration-300">
           <div className="w-16 h-16 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin mb-6"></div>
           <p className="text-amber-800 font-serif-sc text-lg tracking-[0.4em] font-medium animate-pulse">
            {loadingStep}
          </p>
        </div>
      )}
    </div>
  );
};

export default MoodInput;
