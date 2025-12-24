
import React, { useState } from 'react';
import { MoodEntry } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  entries: MoodEntry[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ entries }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const days = [];
  const startDay = firstDayOfMonth(year, month);
  const totalDays = daysInMonth(year, month);

  // Padding for start of month
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Days with potential entries
  for (let i = 1; i <= totalDays; i++) {
    const dateStr = new Date(year, month, i).toDateString();
    const entry = entries.find(e => new Date(e.date).toDateString() === dateStr);
    days.push({ day: i, entry });
  }

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(year, month + offset, 1));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-serif-sc font-medium">
          {currentMonth.toLocaleString('zh-CN', { year: 'numeric', month: 'long' })}
        </h3>
        <div className="flex gap-2">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-stone-50 rounded-full text-stone-400">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-stone-50 rounded-full text-stone-400">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {['日', '一', '二', '三', '四', '五', '六'].map(d => (
          <div key={d} className="text-center text-[10px] text-stone-300 font-bold uppercase py-2">{d}</div>
        ))}
        
        {days.map((item, idx) => (
          <div key={idx} className="aspect-square relative group">
            {item ? (
              <div className="w-full h-full flex items-center justify-center">
                <span className={`text-sm ${item.entry ? 'text-white z-10 font-bold' : 'text-stone-400'}`}>
                  {item.day}
                </span>
                {item.entry && (
                  <div className="absolute inset-0 rounded-xl overflow-hidden shadow-sm">
                    <img src={item.entry.imageUrl} className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all" />
                  </div>
                )}
                {!item.entry && (
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-100 group-hover:bg-amber-200 transition-colors"></div>
                )}
              </div>
            ) : (
              <div className="w-full h-full opacity-0" />
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-stone-50 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-200"></div>
          <span className="text-[10px] text-stone-400 uppercase tracking-widest">有光时刻</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-stone-100"></div>
          <span className="text-[10px] text-stone-400 uppercase tracking-widest">静谧时光</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
