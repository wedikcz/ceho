'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  Lock,
} from 'lucide-react';
import CommandBar from './CommandBar';
import A11yToggle from './A11yToggle';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandBarOpen, setCommandBarOpen] = useState(false);

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandBarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { href: '/', label: 'Domů' },
    { href: '/urad', label: 'Úřad & Deska' },
    { href: '/nahlasit-zavadu', label: 'Závady' },
    { href: '/podatelna', label: 'E-Podatelna' },
    { href: '/zivotni-situace', label: 'Životní situace' },
    { href: '/kalendar', label: 'Kalendář' },
    { href: '/spolky', label: 'Spolky' },
    { href: '/obec', label: 'O obci' },
    { href: '/varovani', label: 'Varování' },
    { href: '/kontakty', label: 'Kontakty' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-sky-400/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo and Municipality title */}
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg p-1"
              id="header-brand-logo"
            >
              {/* Crest Badge */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-sky-500/20 via-sky-600/30 to-amber-500/20 border border-sky-400/30 flex items-center justify-center text-amber-400 font-bold shadow-lg shadow-sky-500/10 group-hover:border-amber-400/50 transition-colors">
                <span className="font-serif text-lg tracking-wider">Č</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base sm:text-lg text-white group-hover:text-sky-300 transition-colors tracking-tight font-serif">
                    Obec Čehovice
                  </span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-500/30 hidden sm:inline-block">
                    1299
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans tracking-wide">
                  Okres Prostějov • Olomoucký kraj
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 text-sm font-medium" aria-label="Hlavní navigace portálu">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      isActive
                        ? 'bg-sky-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons: CommandBar + Admin Button + Mobile Menu */}
            <div className="flex items-center gap-2">
              {/* Search Bar / Ctrl+K trigger */}
              <button
                id="open-command-bar-btn"
                onClick={() => setCommandBarOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-sky-500/20 text-slate-300 hover:border-sky-400/50 hover:text-white text-xs transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                aria-label="Otevřít rychlé vyhledávání (klávesová zkratka Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
                <span className="hidden md:inline">Hledat...</span>
                <kbd className="hidden sm:inline-block text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                  Ctrl+K
                </kbd>
              </button>

              {/* Accessibility toggler */}
              <A11yToggle />

              {/* Admin Panel button */}
              <Link
                href="/admin"
                id="nav-admin-link"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  pathname.startsWith('/admin')
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                    : 'bg-slate-900/90 text-amber-300 border-amber-500/30 hover:bg-amber-500/15'
                }`}
                title="Kontrolní panel vedení obce (NIS2, hlášení, podatelna, ČDP)"
              >
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Admin</span>
              </Link>

              {/* Mobile hamburger button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800"
                aria-label={mobileMenuOpen ? 'Zavřít menu' : 'Otevřít navigační menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-slate-950/95 border-b border-sky-500/20 px-4 py-4 space-y-1 backdrop-blur-2xl animate-fade-down">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-sky-500/20 text-amber-300 font-semibold border border-amber-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-semibold hover:bg-amber-500/30 transition-colors"
              >
                Kontrolní panel vedení (Admin)
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* CommandBar Modal */}
      <CommandBar isOpen={commandBarOpen} onClose={() => setCommandBarOpen(false)} />
    </>
  );
}
