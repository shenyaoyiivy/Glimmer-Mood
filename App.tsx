
import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Plus, ChevronRight, LayoutGrid, X } from 'lucide-react';
import { MoodEntry, ViewType } from './types';
import MoodInput from './components/MoodInput';
import CalendarHome from './components/CalendarHome';
import WeeklyView from './components/WeeklyView';
import GlimmerCollection from './components/WeeklySpread'; 
import { processMoodText, generateMoodImage } from './geminiService';

const STORAGE_KEY = 'glimmer_mood_entries_v3';

const App: React.FC = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('today');
  const [isUpdating, setIsUpdating] = useState(false);
  const [writingDate, setWritingDate] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const migrated = parsed.map(e => ({
            ...e,
            highlights: e.highlights || []
          }));
          setEntries(migrated);
        }
      } catch (e) {
        console.error("Failed to load entries", e);
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        alert("存储空间已满。为了继续记录，请尝试删除一些旧的记录（图片占用了大量空间）。");
      }
      console.error("Storage failed", e);
    }
  }, [entries]);

  const toLocal = (iso: string) => {
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return "unknown";
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    } catch {
      return "unknown";
    }
  };

  const handleAddEntry = (entry: MoodEntry) => {
    setEntries(prev => {
      const entryDateKey = toLocal(entry.date);
      const existingIndex = prev.findIndex(e => toLocal(e.date) === entryDateKey);

      let newEntries;
      if (existingIndex > -1) {
        newEntries = [...prev];
        newEntries[existingIndex] = entry;
      } else {
        newEntries = [entry, ...prev];
      }
      return newEntries.sort((a, b) => {
        const timeA = new Date(a.date).getTime() || 0;
        const timeB = new Date(b.date).getTime() || 0;
        return timeB - timeA;
      });
    });
    setWritingDate(null);
  };

  const handleUpdateText = async (id: string, newFullText: string) => {
    setIsUpdating(true);
    try {
      const processed = await processMoodText(newFullText);
      const imageUrl = await generateMoodImage(processed.imagePrompt);
      
      setEntries(prev => prev.map(e => e.id === id ? {
        ...e,
        rawText: newFullText,
        poeticQuote: processed.poeticQuote,
        imageUrl,
        keywords: processed.keywords,
        highlights: processed.highlights || []
      } : e));
    } catch (e) {
      console.error(e);
      alert("更新失败，请稍后再试");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm("确定要删除这一天的记忆吗？删除后会释放存储空间。")) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcf9] text-stone-800 pb-24 selection:bg-amber-100 selection:text-amber-900">
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-stone-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => { setCurrentView('today'); setWritingDate(null); }}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-200 to-orange-100 flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
            <Sparkles size={16} className="text-amber-600" />
          </div>
          <h1 className="text-xl font-medium tracking-tight font-serif-sc">微光日记</h1>
        </div>
        
        <nav className="flex gap-1 sm:gap-4">
          <button onClick={() => { setCurrentView('today'); setWritingDate(null); }} className={`p-2.5 rounded-full transition-all ${currentView === 'today' ? 'bg-amber-50 text-amber-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`} title="首页日历"><Calendar size={22} /></button>
          <button onClick={() => setCurrentView('week')} className={`p-2.5 rounded-full transition-all ${currentView === 'week' ? 'bg-amber-50 text-amber-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`} title="拾光集锦"><LayoutGrid size={22} /></button>
          <button onClick={() => setCurrentView('history')} className={`p-2.5 rounded-full transition-all ${currentView === 'history' ? 'bg-amber-50 text-amber-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`} title="档案库"><ChevronRight size={22} className="rotate-90" /></button>
        </nav>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-12 pt-28">
        {currentView === 'today' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
             <CalendarHome entries={entries} onDateClick={(dateStr) => setWritingDate(dateStr)} />
          </div>
        )}

        {currentView === 'week' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <GlimmerCollection entries={entries} onEntryClick={() => setCurrentView('history')} />
          </div>
        )}

        {currentView === 'history' && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-right-4 duration-700">
            <WeeklyView entries={entries} onDelete={handleDeleteEntry} onUpdate={handleUpdateText} isUpdating={isUpdating} />
          </div>
        )}
      </main>

      {writingDate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/10 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
            <button 
              onClick={() => setWritingDate(null)}
              className="absolute top-8 right-8 p-2 rounded-full hover:bg-stone-50 text-stone-400 transition-colors z-10"
            >
              <X size={24} />
            </button>
            <div className="p-10 md:p-14">
              <div className="mb-8">
                <h3 className="text-3xl font-serif-sc font-medium mb-2">记录此刻</h3>
                <p className="text-stone-400 font-light">{writingDate} 的微光瞬间</p>
              </div>
              <MoodInput 
                entries={entries} 
                onEntryAdded={handleAddEntry} 
                initialDate={writingDate}
                onCancel={() => setWritingDate(null)}
              />
            </div>
          </div>
        </div>
      )}

      {currentView !== 'today' && (
        <button onClick={() => setCurrentView('today')} className="fixed bottom-10 right-10 w-16 h-16 bg-stone-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:-rotate-12 active:scale-95 transition-all z-40"><Plus size={32} /></button>
      )}
    </div>
  );
};

export default App;
