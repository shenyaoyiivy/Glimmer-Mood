
import React from 'react';
import MoodCard from './MoodCard';
import { MoodEntry } from '../types';

interface WeeklyViewProps {
  entries: MoodEntry[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  isUpdating: boolean;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ entries, onDelete, onUpdate, isUpdating }) => {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-stone-300 space-y-4">
        <div className="w-16 h-16 rounded-full border-2 border-stone-100 flex items-center justify-center opacity-50">
          <span className="text-2xl">☁️</span>
        </div>
        <p className="text-sm font-light">还没有收集到微光，去记一笔吧</p>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h3 className="text-2xl font-serif-sc font-medium">拾光档案</h3>
          <p className="text-stone-400 text-sm font-light mt-1">每一张卡片都是一整天的温柔总和</p>
        </div>
        <div className="text-right">
          <span className="text-4xl font-serif-sc text-stone-100 font-bold block leading-none">{entries.length}</span>
          <span className="text-[10px] text-stone-300 uppercase tracking-widest">Days Logged</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
        {entries.map((entry) => (
          <MoodCard key={entry.id} entry={entry} onDelete={onDelete} onUpdate={onUpdate} isUpdating={isUpdating} compact />
        ))}
      </div>
    </div>
  );
};

export default WeeklyView;
