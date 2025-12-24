
import React, { useState, useMemo } from 'react';
import { MoodEntry, PhaseReport } from '../types';
import { RotateCcw, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { generatePhaseReport } from '../geminiService';
import PhaseReportView from './PhaseReportView';

interface GlimmerCollectionProps {
  entries: MoodEntry[];
  onEntryClick: () => void;
}

const GlimmerCollection: React.FC<GlimmerCollectionProps> = ({ entries, onEntryClick }) => {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 19);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [activeReport, setActiveReport] = useState<PhaseReport | null>(null);
  const [customInstruction, setCustomInstruction] = useState('');
  const [showInstruction, setShowInstruction] = useState(false);

  const getLocalDateString = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const collectionDays = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = [];
    
    const actualStart = start < end ? start : end;
    const actualEnd = start < end ? end : start;

    const current = new Date(actualStart);
    while (current <= actualEnd) {
      const dateStr = getLocalDateString(current);
      const entry = entries.find(e => {
        const ed = new Date(e.date);
        return getLocalDateString(ed) === dateStr;
      });

      days.push({
        date: new Date(current),
        dateStr,
        entry,
        dayLabel: current.toLocaleDateString('zh-CN', { weekday: 'short' }),
        dateLabel: current.getDate(),
        monthLabel: current.toLocaleDateString('zh-CN', { month: 'short' }),
      });
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [startDate, endDate, entries]);

  const resetToRecent = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 19);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const handleGenerateReport = async () => {
    const filteredEntries = entries.filter(e => {
      const dStr = getLocalDateString(new Date(e.date));
      return collectionDays.some(cd => cd.dateStr === dStr);
    });

    if (filteredEntries.length === 0) {
      alert("这段时间似乎还没有微光被记录下来...");
      return;
    }

    setIsGeneratingReport(true);
    try {
      const report = await generatePhaseReport(filteredEntries, startDate, endDate, customInstruction);
      setActiveReport(report);
    } catch (e) {
      console.error(e);
      alert("生成报告失败，请稍后再试");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-[calc(100vh-140px)]">
      {/* Header Area */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 mb-8 shrink-0">
        <div className="text-left">
          <h3 className="text-3xl font-serif-sc font-medium flex items-center gap-3">
            拾光锦集
            <span className="text-stone-300 text-[10px] font-light tracking-[0.4em] ml-1 uppercase hidden sm:inline">Collection</span>
          </h3>
          <p className="text-stone-400 text-sm font-light mt-1 tracking-wide">纵览时光长廊，发现散落在岁月里的微光</p>
        </div>

        <div className="flex flex-col xl:flex-row items-end gap-4 w-full xl:w-auto">
          {/* Custom Instruction Box - Animated Toggle */}
          <div className={`flex flex-col items-end gap-2 transition-all duration-300 ${showInstruction ? 'w-full xl:w-80' : 'w-10 overflow-hidden'}`}>
             {showInstruction ? (
               <div className="w-full relative group">
                  <textarea 
                    value={customInstruction}
                    onChange={(e) => setCustomInstruction(e.target.value)}
                    placeholder="例如：侧重分析我这段时间的进步，或者让语气更幽默一些..."
                    className="w-full h-24 p-4 text-sm font-serif-sc bg-amber-50/50 border border-amber-100 rounded-3xl outline-none focus:border-amber-300 transition-all resize-none shadow-inner"
                  />
                  <button 
                    onClick={() => { setShowInstruction(false); setCustomInstruction(''); }}
                    className="absolute top-2 right-2 p-1 text-amber-300 hover:text-amber-500 transition-colors"
                  >
                    <RotateCcw size={14} />
                  </button>
               </div>
             ) : (
               <button 
                onClick={() => setShowInstruction(true)}
                className="p-2.5 rounded-full bg-amber-50 text-amber-400 hover:text-amber-600 hover:bg-amber-100 transition-all shadow-sm"
                title="添加个性化生成指令"
               >
                <Wand2 size={20} />
               </button>
             )}
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-end">
            <button 
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-200 to-orange-200 text-amber-900 font-serif-sc font-bold shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {isGeneratingReport ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {isGeneratingReport ? '正在编撰报告...' : '生成阶段报告'}
            </button>

            <div className="flex items-center bg-white border border-stone-100 rounded-full px-5 py-2 shadow-sm gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">From</span>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-sm font-serif-sc outline-none text-stone-600 cursor-pointer"
                />
              </div>
              <div className="w-px h-4 bg-stone-100"></div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">To</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-sm font-serif-sc outline-none text-stone-600 cursor-pointer"
                />
              </div>
              <div className="w-px h-4 bg-stone-100"></div>
              <button 
                onClick={resetToRecent}
                className="p-1 hover:text-amber-500 text-stone-300 transition-colors"
                title="最近20天"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Grid Container */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-4 pb-12"
        >
          {collectionDays.map((item) => (
            <div 
              key={item.dateStr}
              onClick={item.entry ? onEntryClick : undefined}
              className={`
                relative aspect-[3/4.5] rounded-[2rem] overflow-hidden transition-all duration-500
                ${item.entry ? 'cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-2' : 'bg-stone-50 border border-dashed border-stone-200/60 opacity-50'}
              `}
            >
              {item.entry ? (
                <>
                  <img src={item.entry.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover brightness-[0.7]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80"></div>
                  <div className="relative h-full flex flex-col justify-between p-4 text-white">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col items-start">
                         <span className="text-[8px] font-bold tracking-widest uppercase opacity-80">{item.monthLabel}</span>
                         <span className="text-lg font-serif-sc font-bold leading-none">{item.dateLabel}</span>
                      </div>
                      <span className="text-[8px] font-medium tracking-widest uppercase opacity-60">{item.dayLabel}</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center py-2 overflow-hidden">
                      <p className="text-[10px] sm:text-xs font-serif-sc leading-relaxed whitespace-pre-wrap line-clamp-6 drop-shadow-md">
                        {item.entry.rawText}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/20">
                      <p className="text-[9px] font-serif-sc italic tracking-wide opacity-90 truncate">
                        {item.entry.poeticQuote}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-stone-300 p-4">
                  <span className="text-[8px] font-bold tracking-widest uppercase mb-1">{item.dayLabel}</span>
                  <span className="text-xl font-serif-sc font-bold opacity-30">{item.dateLabel}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Report Modal */}
      {activeReport && <PhaseReportView report={activeReport} onClose={() => setActiveReport(null)} />}

      {/* Footer Label */}
      <div className="mt-4 flex items-center justify-center text-stone-300 text-[10px] tracking-[0.4em] font-light uppercase shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-px bg-stone-100"></div>
          <span>上下滑动浏览时光长廊</span>
          <div className="w-12 h-px bg-stone-100"></div>
        </div>
      </div>
    </div>
  );
};

export default GlimmerCollection;
