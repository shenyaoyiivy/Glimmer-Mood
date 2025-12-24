
import React, { useState } from 'react';
import { MoodEntry } from '../types';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface CalendarHomeProps {
  entries: MoodEntry[];
  onDateClick: (dateStr: string) => void;
}

const CalendarHome: React.FC<CalendarHomeProps> = ({ entries, onDateClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const getLocalDateString = (y: number, m: number, d: number) => {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);
  const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(year, month + offset, 1));
  };

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) {
    const dateStr = getLocalDateString(year, month, i);
    const entry = entries.find(e => {
        const d = new Date(e.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` === dateStr;
    });
    days.push({ day: i, dateStr, entry });
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-serif-sc font-medium text-stone-900 mb-2">
            {currentMonth.toLocaleString('zh-CN', { month: 'long', year: 'numeric' })}
          </h2>
          <p className="text-stone-400 font-light tracking-widest text-sm">点选任意日期，记录那天的微光</p>
        </div>

        <div className="flex items-center bg-white border border-stone-100 rounded-full px-6 py-3 shadow-sm gap-8">
          <button 
            onClick={() => changeMonth(-1)} 
            className="p-2 hover:bg-stone-50 rounded-full text-stone-300 hover:text-amber-500 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => setCurrentMonth(new Date())} 
            className="text-stone-600 font-medium font-serif-sc text-sm hover:text-amber-600 transition-colors"
          >
            返回今日
          </button>
          <button 
            onClick={() => changeMonth(1)} 
            className="p-2 hover:bg-stone-50 rounded-full text-stone-300 hover:text-amber-500 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-3 sm:gap-6">
        {['日', '一', '二', '三', '四', '五', '六'].map(d => (
          <div key={d} className="text-center text-[10px] text-stone-300 font-bold uppercase tracking-[0.2em] mb-2">{d}</div>
        ))}

        {days.map((item, idx) => {
          if (!item) return <div key={`empty-${idx}`} className="aspect-square opacity-0" />;
          
          const isToday = item.dateStr === todayStr;
          
          return (
            <div 
              key={item.dateStr}
              onClick={() => onDateClick(item.dateStr)}
              className={`
                group aspect-square relative rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500
                hover:-translate-y-2 hover:shadow-xl active:scale-95
                ${item.entry ? 'shadow-sm' : 'border border-stone-100 bg-white hover:border-amber-200'}
                ${isToday && !item.entry ? 'border-amber-300 border-2' : ''}
              `}
            >
              {item.entry ? (
                <>
                  <img src={item.entry.imageUrl} className="absolute inset-0 w-full h-full object-cover brightness-[0.85] transition-all group-hover:brightness-100 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                  
                  {/* Highlights Overlay (The core feature requested) */}
                  <div className="absolute inset-0 flex flex-col p-4 sm:p-5">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-lg sm:text-2xl font-serif-sc font-bold text-white drop-shadow-lg">{item.day}</span>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center gap-1.5 overflow-hidden">
                      {(item.entry.highlights || []).map((hl, i) => (
                        <div key={i} className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2.5 py-0.5 self-start animate-in fade-in slide-in-from-left duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                          <span className="text-[10px] sm:text-[11px] text-white font-serif-sc font-medium tracking-wide truncate max-w-full">
                            {hl}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-[9px] text-white/90 font-serif-sc italic line-clamp-1 border-t border-white/20 pt-1">
                        {item.entry.poeticQuote}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 group-hover:bg-amber-50/30 transition-colors">
                  <span className={`text-xl sm:text-2xl font-serif-sc font-medium ${isToday ? 'text-amber-600 font-bold' : 'text-stone-300 group-hover:text-stone-500'}`}>
                    {item.day}
                  </span>
                  <Plus size={16} className="text-stone-100 group-hover:text-amber-400 transition-colors" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarHome;
