
import React, { useState } from 'react';
import { Share2, Trash2, Edit2, Check, X, Loader2 } from 'lucide-react';
import { MoodEntry } from '../types';

interface MoodCardProps {
  entry: MoodEntry;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, text: string) => void;
  compact?: boolean;
  isUpdating?: boolean;
}

const MoodCard: React.FC<MoodCardProps> = ({ entry, onDelete, onUpdate, compact = false, isUpdating = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(entry.rawText);
  
  const date = new Date(entry.date);
  const day = date.getDate();
  const year = date.getFullYear();
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const month = monthNames[date.getMonth()];

  const handleSave = () => {
    if (onUpdate && editText !== entry.rawText) {
      onUpdate(entry.id, editText);
    }
    setIsEditing(false);
  };

  return (
    <div className={`group relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 flex flex-col ${compact ? 'w-full' : 'max-w-md mx-auto'}`} style={{ aspectRatio: '3/4.5' }}>
      {/* Background Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <img src={entry.imageUrl} alt="" className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105" />
        <div className="absolute inset-0 bg-white/10"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative flex-1 flex flex-col items-center justify-between p-10 text-center">
        {/* Date Header */}
        <div className="flex flex-col items-center opacity-40 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] tracking-[0.3em] font-bold text-stone-500">{month} {year}</span>
          <span className="text-3xl font-serif-sc font-bold text-stone-800 mt-1">{day}</span>
        </div>

        {/* Main Content: User's recorded happy moments (The Focus) */}
        <div className="flex-1 flex items-center justify-center py-6 w-full">
          {isEditing ? (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl w-full">
              <textarea 
                value={editText} 
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-base text-stone-700 font-serif-sc leading-relaxed resize-none min-h-[120px]"
                autoFocus
              />
              <div className="flex justify-end gap-3 mt-3 border-t border-stone-100 pt-3">
                <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-xs text-stone-400 hover:text-stone-600 transition-colors">取消</button>
                <button onClick={handleSave} className="px-4 py-1 bg-stone-900 text-white text-xs rounded-full hover:bg-stone-800 transition-colors">保存修改</button>
              </div>
            </div>
          ) : (
            <div className="max-h-[220px] overflow-y-auto no-scrollbar w-full px-2">
              {entry.rawText.split('\n').map((line, i) => (
                <p key={i} className="text-xl md:text-2xl font-serif-sc font-medium text-stone-800 leading-relaxed mb-3 drop-shadow-sm">
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Secondary Content: Poetic Quote (Small, healing subtitle) */}
        <div className="mt-auto pt-4 flex flex-col items-center">
          {!isEditing && (
            <div className="px-6 py-2 bg-white/40 backdrop-blur-sm rounded-full border border-white/40 mb-4">
              <span className="text-sm font-serif-sc text-stone-600 tracking-wider">
                {entry.poeticQuote}
              </span>
            </div>
          )}
          
          {/* Footer Brand */}
          <div className="pt-4 border-t border-stone-200/20 w-full min-w-[180px] flex justify-between items-center text-[8px] text-stone-400 tracking-[0.2em] font-medium uppercase">
            <span>GLIMMER DAILY</span>
            <span>@{entry.keywords.join(' · ')}</span>
          </div>
        </div>
      </div>

      {/* Action Sidebar */}
      <div className="absolute top-6 right-6 flex flex-col gap-3 translate-x-12 group-hover:translate-x-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
        {isUpdating ? (
          <div className="p-2.5 bg-white/90 rounded-full text-amber-600 shadow-md animate-spin"><Loader2 size={16} /></div>
        ) : (
          <>
            <button onClick={() => setIsEditing(!isEditing)} className="p-2.5 bg-white/90 backdrop-blur-md rounded-full text-stone-500 hover:bg-stone-900 hover:text-white transition-all shadow-md"><Edit2 size={16} /></button>
            <button className="p-2.5 bg-white/90 backdrop-blur-md rounded-full text-stone-500 hover:bg-stone-900 hover:text-white transition-all shadow-md"><Share2 size={16} /></button>
            {onDelete && <button onClick={() => onDelete(entry.id)} className="p-2.5 bg-white/90 backdrop-blur-md rounded-full text-stone-500 hover:bg-red-500 hover:text-white transition-all shadow-md"><Trash2 size={16} /></button>}
          </>
        )}
      </div>
    </div>
  );
};

export default MoodCard;
