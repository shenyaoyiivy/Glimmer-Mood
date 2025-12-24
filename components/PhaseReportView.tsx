
import React from 'react';
import { PhaseReport } from '../types';
import { X, Share2, Sparkles, Quote, MapPin, Heart } from 'lucide-react';

interface PhaseReportViewProps {
  report: PhaseReport;
  onClose: () => void;
}

const PhaseReportView: React.FC<PhaseReportViewProps> = ({ report, onClose }) => {
  const getThemeColor = (theme: string) => {
    const t = theme.toLowerCase();
    if (t.includes('sunset') || t.includes('amber')) return 'from-orange-50 via-amber-100 to-rose-100';
    if (t.includes('forest') || t.includes('mist')) return 'from-emerald-50 via-teal-100 to-stone-100';
    if (t.includes('ocean') || t.includes('breeze')) return 'from-blue-50 via-cyan-100 to-indigo-50';
    return 'from-stone-50 via-amber-50 to-orange-50';
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-stone-900/60 backdrop-blur-xl animate-in fade-in duration-500 overflow-hidden">
      {/* Scrollable container for the modal itself, but the poster inside is fixed-height */}
      <div className="relative flex flex-col items-center max-h-full max-w-full overflow-y-auto no-scrollbar py-8">
        
        {/* Close Button - Floats above */}
        <button 
          onClick={onClose} 
          className="absolute top-0 right-0 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-all z-30 mb-4"
        >
          <X size={24} />
        </button>

        {/* The Poster Area - Forced 9:16 Aspect Ratio */}
        <div 
          id="report-poster"
          className={`
            relative aspect-[9/16] w-[calc(100vw-2rem)] max-w-[420px] h-auto
            bg-gradient-to-b ${getThemeColor(report.visualTheme)} 
            shadow-2xl rounded-[2.5rem] flex flex-col overflow-hidden animate-in zoom-in-95 duration-700
            border border-white/50 shrink-0
          `}
        >
          {/* Header Decoration */}
          <div className="pt-8 px-6 text-center shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/30 backdrop-blur-md border border-white/40 rounded-full mb-3 text-[9px] text-stone-500 tracking-[0.3em] uppercase font-bold">
              <Sparkles size={10} className="text-amber-500" /> Phase Report
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-sc font-bold text-stone-900 leading-tight mb-1 px-4">{report.title}</h1>
            <p className="text-stone-500 font-serif-sc italic text-[10px] sm:text-xs tracking-wider">「 {report.moodVibe} 」</p>
          </div>

          {/* Main Content Area - Optimized for one-page fit */}
          <div className="flex-1 flex flex-col justify-between px-6 pb-6 pt-2 gap-3 overflow-hidden">
            
            {/* Stats Row - Compact */}
            <div className="grid grid-cols-3 gap-2 shrink-0">
              <div className="bg-white/40 backdrop-blur-md rounded-2xl p-2.5 text-center border border-white/30">
                <span className="text-lg sm:text-xl font-serif-sc font-bold text-stone-900 block">{report.stats.recordedDays}</span>
                <p className="text-[7px] text-stone-400 tracking-widest uppercase">有光天数</p>
              </div>
              <div className="bg-white/40 backdrop-blur-md rounded-2xl p-2.5 text-center border border-white/30">
                <span className="text-lg sm:text-xl font-serif-sc font-bold text-stone-900 block">{report.stats.highLightCount}</span>
                <p className="text-[7px] text-stone-400 tracking-widest uppercase">心动瞬间</p>
              </div>
              <div className="bg-white/40 backdrop-blur-md rounded-2xl p-2.5 text-center border border-white/30">
                <span className="text-lg sm:text-xl font-serif-sc font-bold text-stone-900 block">100%</span>
                <p className="text-[7px] text-stone-400 tracking-widest uppercase">治愈比例</p>
              </div>
            </div>

            {/* Keyword Bubbles - Floating effect */}
            <div className="shrink-0 py-2">
              <div className="flex flex-wrap justify-center gap-2">
                {report.topKeywords.slice(0, 5).map((kw, i) => (
                  <div 
                    key={kw.text} 
                    className={`
                      px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm border border-white/30 font-serif-sc text-stone-700 shadow-sm
                      ${i === 0 ? 'text-sm font-bold scale-110 bg-white/80' : 'text-[10px]'}
                    `}
                  >
                    {kw.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary - Centered Quote - NO LINE CLAMP */}
            <div className="relative shrink-0 flex-grow-0">
              <Quote className="absolute -top-3 -left-1 text-white/40 w-6 h-6 -z-10" />
              <div className="bg-white/30 backdrop-blur-xl rounded-[1.5rem] p-4 border border-white/30">
                <p className="text-stone-700 font-serif-sc text-[11px] sm:text-xs leading-relaxed text-center">
                  {report.summary}
                </p>
              </div>
            </div>

            {/* Personal Narratives - Limited to top 3 - NO LINE CLAMP */}
            <div className="flex flex-col gap-3 shrink overflow-hidden">
              {report.personalNarratives.slice(0, 3).map((nar, i) => (
                <div key={i} className="flex gap-2 items-start bg-white/10 rounded-xl p-2 border border-white/10">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-white/60 flex items-center justify-center text-amber-500 shadow-sm">
                    {i % 2 === 0 ? <Heart size={12} /> : <Sparkles size={12} />}
                  </div>
                  <p className="text-stone-700 font-serif-sc text-[10px] sm:text-[11px] leading-snug flex-1">
                    {nar}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Branding Section */}
            <div className="text-center mt-auto pt-3 border-t border-stone-200/20 shrink-0">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-200 to-orange-100 flex items-center justify-center mx-auto mb-1">
                <Sparkles size={12} className="text-amber-600" />
              </div>
              <p className="text-[7px] font-bold text-stone-400 tracking-[0.4em] uppercase">Glimmer Mood · 记录微光</p>
              <p className="text-[6px] text-stone-300 mt-0.5 uppercase tracking-widest">Captured on {new Date().toLocaleDateString('en-US')}</p>
            </div>
          </div>
        </div>

        {/* Floating Share Button at the bottom */}
        <button className="mt-6 flex items-center gap-2 px-8 py-3 rounded-full bg-stone-900 text-white text-sm font-serif-sc shadow-2xl hover:scale-105 active:scale-95 transition-all shrink-0">
          <Share2 size={16} /> 截图分享此瞬间
        </button>
      </div>
    </div>
  );
};

export default PhaseReportView;
