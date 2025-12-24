
import React from 'react';
import { PhaseReport } from '../types';
import { X, Share2, Sparkles, Quote, Heart } from 'lucide-react';

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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-stone-900/70 backdrop-blur-2xl animate-in fade-in duration-500 overflow-hidden">
      <div className="relative flex flex-col items-center max-h-full max-w-full">
        
        <button 
          onClick={onClose} 
          className="absolute -top-12 right-0 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-all z-30"
        >
          <X size={24} />
        </button>

        <div 
          id="report-poster"
          className={`
            relative aspect-[9/16] w-[calc(100vh*(9/16)-2rem)] max-w-[420px] h-[calc(100vh-6rem)]
            bg-gradient-to-b ${getThemeColor(report.visualTheme)} 
            shadow-2xl rounded-[3rem] flex flex-col overflow-hidden animate-in zoom-in-95 duration-700
            border border-white/60 shrink-0
          `}
        >
          {/* Header */}
          <div className="pt-10 px-8 text-center shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/40 backdrop-blur-md border border-white/50 rounded-full mb-4 text-[9px] text-stone-500 tracking-[0.3em] uppercase font-bold">
              <Sparkles size={10} className="text-amber-500" /> Phase Report
            </div>
            <h1 className="text-3xl font-serif-sc font-bold text-stone-900 leading-tight mb-2 px-2">{report.title}</h1>
            <p className="text-stone-500 font-serif-sc italic text-xs tracking-wider">「 {report.moodVibe} 」</p>
          </div>

          <div className="flex-1 flex flex-col justify-between px-8 pb-10 pt-4 gap-4 overflow-hidden">
            
            {/* Stats - Grid layout */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              {[
                { val: report.stats.recordedDays, label: '有光天数' },
                { val: report.stats.highLightCount, label: '心动瞬间' },
                { val: '100%', label: '治愈比例' }
              ].map((s, i) => (
                <div key={i} className="bg-white/40 backdrop-blur-md rounded-2xl p-3 text-center border border-white/30 shadow-sm">
                  <span className="text-xl font-serif-sc font-bold text-stone-900 block">{s.val}</span>
                  <p className="text-[8px] text-stone-400 tracking-widest uppercase font-bold">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Keyword Bubbles */}
            <div className="shrink-0 flex flex-wrap justify-center gap-2 py-2">
              {report.topKeywords.slice(0, 5).map((kw, i) => (
                <div 
                  key={kw.text} 
                  className={`
                    px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-white/30 font-serif-sc text-stone-700 shadow-sm
                    ${i === 0 ? 'text-sm font-bold scale-110 bg-white/80' : 'text-[10px]'}
                  `}
                >
                  {kw.text}
                </div>
              ))}
            </div>

            {/* Summary Text - Fully dynamic height, no ellipses */}
            <div className="relative shrink min-h-0 flex items-center">
              <Quote className="absolute -top-4 -left-3 text-white/50 w-10 h-10 -z-10" />
              <div className="bg-white/30 backdrop-blur-xl rounded-[2rem] p-5 border border-white/40 shadow-inner">
                <p className="text-stone-700 font-serif-sc text-[13px] leading-relaxed text-center italic">
                  {report.summary}
                </p>
              </div>
            </div>

            {/* Personalized Narratives - Stacked gracefully */}
            <div className="flex flex-col gap-4 shrink-0">
              {report.personalNarratives.slice(0, 3).map((nar, i) => (
                <div key={i} className="flex gap-3 items-start bg-white/15 rounded-2xl p-3 border border-white/10">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-amber-500 shadow-sm">
                    {i % 2 === 0 ? <Heart size={14} /> : <Sparkles size={14} />}
                  </div>
                  <p className="text-stone-800 font-serif-sc text-[11px] leading-snug pt-1">
                    {nar}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-stone-400/10 shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-200 to-orange-100 flex items-center justify-center mx-auto mb-2 shadow-sm">
                <Sparkles size={14} className="text-amber-600" />
              </div>
              <p className="text-[9px] font-bold text-stone-400 tracking-[0.4em] uppercase">Glimmer Mood · 拾光报告</p>
              <p className="text-[7px] text-stone-300 mt-1 tracking-widest uppercase">Captured on {new Date().toLocaleDateString('zh-CN')}</p>
            </div>
          </div>
        </div>

        <button className="mt-8 flex items-center gap-3 px-10 py-4 rounded-full bg-stone-900 text-white text-sm font-serif-sc shadow-2xl hover:scale-105 active:scale-95 transition-all">
          <Share2 size={18} /> 截图分享这份微光
        </button>
      </div>
    </div>
  );
};

export default PhaseReportView;
