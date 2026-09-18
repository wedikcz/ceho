'use client';

import React, { useState, useEffect } from 'react';
import { Search, FileText, Calendar, AlertCircle, Phone, ArrowRight, X, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchItem {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  icon: 'file' | 'event' | 'contact' | 'alert' | 'ai';
}

const SEARCHABLE_ITEMS: SearchItem[] = [
  {
    id: 'p1',
    title: 'Úřední deska a vyhlášky obce',
    category: 'Úřad',
    description: 'Zveřejněné záměry, rozpočty a obecně závazné vyhlášky',
    url: '/urad',
    icon: 'file',
  },
  {
    id: 'p2',
    title: 'Nahlásit závadu (rozbitá lampa, výtluk)',
    category: 'Služby občanům',
    description: 'Elektronické hlášení závad s GPS a sledováním stavu vyřízení',
    url: '/nahlasit-zavadu',
    icon: 'alert',
  },
  {
    id: 'p3',
    title: 'Digitální e-podatelna',
    category: 'Podatelna',
    description: 'Podání žádosti, žádost o informace 106/1999 Sb., sledování podání',
    url: '/podatelna',
    icon: 'file',
  },
  {
    id: 'p4',
    title: 'Svoz odpadu a popelnice (žluté, hnědé, černé)',
    category: 'Odpady',
    description: 'Harmonogram svozu, kalendář a poplatky za komunální odpad',
    url: '/zivotni-situace#odpady',
    icon: 'event',
  },
  {
    id: 'p5',
    title: 'Místní poplatky (pes, odpad) a kalkulačka',
    category: 'Poplatky',
    description: 'Výpočet poplatků, variabilní symbol a bankovní spojení',
    url: '/zivotni-situace',
    icon: 'file',
  },
  {
    id: 'p6',
    title: 'Kontakty na obecní úřad a starostu Milana Smékala',
    category: 'Kontakty',
    description: 'Telefon, e-mail, datová schránka 3vgb2y3, úřední hodiny',
    url: '/kontakty',
    icon: 'contact',
  },
  {
    id: 'p7',
    title: 'Krizové informace a tísňové linky (112, 150, 155, 158)',
    category: 'Krizové řízení',
    description: 'Poruchy vody, plynu, elektřiny a povodňový plán Vřesovky',
    url: '/krizove-info',
    icon: 'alert',
  },
  {
    id: 'p8',
    title: 'Historie obce Čehovice a Kostel sv. Prokopa',
    category: 'O obci',
    description: 'První zmínka 1299, barokní památky a rodáci',
    url: '/obec',
    icon: 'file',
  },
  {
    id: 'p9',
    title: 'Notifikační brána: Přihlášení odběru SMS a e-mailů',
    category: 'Varování',
    description: 'Dvojí opt-in, krizové zprávy, výpadky a hlášení rozhlasu',
    url: '/varovani',
    icon: 'alert',
  },
  {
    id: 'p10',
    title: 'Zeptat se asistentky Aničky (AI pomocník)',
    category: 'Asistentka Anička',
    description: 'Odpovědi na otázky k obci v reálném čase',
    url: '/#anicka',
    icon: 'ai',
  },
];

export default function CommandBar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>(SEARCHABLE_ITEMS.slice(0, 5));

  useEffect(() => {
    if (!query.trim()) {
      setResults(SEARCHABLE_ITEMS.slice(0, 5));
    } else {
      const q = query.toLowerCase();
      const filtered = SEARCHABLE_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
      setResults(filtered);
    }
  }, [query]);

  // Handle keyboard shortcut Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (url: string) => {
    onClose();
    if (url.startsWith('/#')) {
      const elem = document.querySelector(url.replace('/', ''));
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    router.push(url);
  };

  const getItemIcon = (type: SearchItem['icon']) => {
    switch (type) {
      case 'file':
        return <FileText className="w-4 h-4 text-sky-400" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-emerald-400" />;
      case 'contact':
        return <Phone className="w-4 h-4 text-amber-400" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      case 'ai':
        return <Sparkles className="w-4 h-4 text-amber-300" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Rychlé vyhledávání a příkazový řádek"
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-[#081220] border border-sky-400/40 shadow-2xl overflow-hidden animate-slide-down"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-sky-400 shrink-0 mr-3" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Co hledáte v Čehovicích? (poplatky, odpad, starosta, vyhláška...)"
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white mr-2"
              aria-label="Vymazat dotaz"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 no-scrollbar">
          {results.length > 0 ? (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.url)}
                className="w-full p-3 rounded-xl flex items-center justify-between text-left group hover:bg-sky-500/10 cursor-pointer transition-colors border border-transparent hover:border-sky-500/20"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSelect(item.url);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-sky-500/40 transition-colors">
                    {getItemIcon(item.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{item.description}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors shrink-0 ml-2" />
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              Nenalezeny žádné výsledky pro „{query}“. Můžete se zkusit zeptat naší asistentky Aničky.
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Stisknutím klávesy Enter přejdete na vybranou stránku</span>
          <span>Portál Čehovice 2027</span>
        </div>
      </div>
    </div>
  );
}
