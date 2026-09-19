'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Type, Volume2 } from 'lucide-react';

export default function A11yToggle() {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHc = localStorage.getItem('cehovice_hc') === 'true';
      const savedFs = Number(localStorage.getItem('cehovice_fs') || 0) as 0 | 1 | 2;
      setHighContrast(savedHc);
      setFontSizeLevel(savedFs);
    }
  }, []);

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    localStorage.setItem('cehovice_hc', next ? 'true' : 'false');
    if (next) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const cycleFontSize = () => {
    const next = ((fontSizeLevel + 1) % 3) as 0 | 1 | 2;
    setFontSizeLevel(next);
    localStorage.setItem('cehovice_fs', next.toString());
    document.documentElement.classList.remove('font-lg', 'font-xl');
    if (next === 1) document.documentElement.classList.add('font-lg');
    if (next === 2) document.documentElement.classList.add('font-xl');
  };

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl shadow-lg">
      <button
        onClick={toggleHighContrast}
        className={`p-2 rounded-lg transition-all ${
          highContrast
            ? 'bg-amber-500 text-slate-950 font-bold'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
        title="Přepnout vysoký kontrast pro slabozraké"
        aria-pressed={highContrast}
      >
        <Eye className="w-4 h-4" />
      </button>

      <button
        onClick={cycleFontSize}
        className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1 transition-all"
        title="Změnit velikost písma (A / A+ / A++)"
      >
        <Type className="w-4 h-4 text-amber-400" />
        <span className="font-mono">
          {fontSizeLevel === 0 ? 'A' : fontSizeLevel === 1 ? 'A+' : 'A++'}
        </span>
      </button>
    </div>
  );
}
