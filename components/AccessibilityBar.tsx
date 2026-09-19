'use client';

import React, { useEffect, useState } from 'react';
import { Eye, Type, Volume2, ShieldCheck } from 'lucide-react';

export default function AccessibilityBar() {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<0 | 1 | 2>(0); // 0 = normal, 1 = lg, 2 = xl

  useEffect(() => {
    // Check saved preferences
    const savedHc = localStorage.getItem('cehovice_hc') === 'true';
    const savedFs = Number(localStorage.getItem('cehovice_fs') || 0);
    if (savedHc) {
      setHighContrast(true);
      document.documentElement.classList.add('high-contrast');
    }
    if (savedFs === 1) {
      setFontSizeLevel(1);
      document.documentElement.classList.add('font-lg');
    } else if (savedFs === 2) {
      setFontSizeLevel(2);
      document.documentElement.classList.add('font-xl');
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

  const handleReadAloudIntro = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        'Vítejte na oficiálním portálu obce Čehovice. Můžete využít navigaci pro zobrazení úřední desky, hlášení závad nebo se zeptat naší asistentky Aničky.'
      );
      utterance.lang = 'cs-CZ';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Předčítání textu není ve vašem prohlížeči podporováno.');
    }
  };

  return (
    <div
      id="accessibility-bar"
      className="bg-slate-950/80 border-b border-sky-900/30 text-xs text-slate-300 py-1.5 px-4 backdrop-blur-md"
      role="region"
      aria-label="Nastavení přístupnosti portálu pro seniory a slabozraké"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-medium text-sky-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            WCAG 2.2 AA shoda
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400">Zákon č. 99/2019 Sb. o přístupnosti</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Contrast Mode Toggle */}
          <button
            id="toggle-contrast-btn"
            onClick={toggleHighContrast}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-amber-400 ${
              highContrast
                ? 'bg-yellow-400 text-black border border-yellow-300'
                : 'bg-slate-900/90 text-slate-200 border border-slate-700/60 hover:border-sky-400/50 hover:text-white'
            }`}
            title="Přepnout vysoký kontrast pro slabozraké (černobílé + žluté akcenty)"
            aria-pressed={highContrast}
          >
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Vysoký kontrast</span>
          </button>

          {/* Font Size Toggle */}
          <button
            id="toggle-font-size-btn"
            onClick={cycleFontSize}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-slate-900/90 text-slate-200 border border-slate-700/60 hover:border-amber-400/50 hover:text-white transition-all focus-visible:ring-2 focus-visible:ring-amber-400"
            title="Zvětšit velikost textu (Normální / Větší / Největší)"
            aria-label={`Velikost písma: ${fontSizeLevel === 0 ? 'Normální' : fontSizeLevel === 1 ? 'Větší (+12%)' : 'Největší (+25%)'}`}
          >
            <Type className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>
              Písmo: <strong className="text-amber-400">{fontSizeLevel === 0 ? 'A' : fontSizeLevel === 1 ? 'A+' : 'A++'}</strong>
            </span>
          </button>

          {/* Screen Reader Voice trigger */}
          <button
            id="read-aloud-btn"
            onClick={handleReadAloudIntro}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-slate-300 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 transition-colors"
            title="Přečíst úvod stránky hlasem"
          >
            <Volume2 className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
            <span>Hlasový asistent</span>
          </button>
        </div>
      </div>
    </div>
  );
}
