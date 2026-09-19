'use client';

import React from 'react';
import Link from 'next/link';
import { Award, ArrowLeft, Cpu } from 'lucide-react';

export default function MetakognitivniLicencePage() {
  return (
    <div className="py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Zpět na úvod</span>
        </Link>
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Meta-Cognitive License 2.1 (ML-2.1)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
          Licence ML-2.1 pro AI ve veřejné správě
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Pravidla etického, deterministického a bezpečného provozu virtuální obecní asistentky Aničky na portálu obce Čehovice.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-7 border border-sky-400/20 space-y-5 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-serif">
              Principy licence ML-2.1 v podmínkách samosprávy
            </h2>
            <p className="text-[11px] text-slate-400">
              Vydáno: 1. 1. 2026 • Verze 2.1.4 • Správce: Obec Čehovice
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <strong className="text-white text-sm block">1. Princip Human-In-The-Loop (HITL)</strong>
            <p>
              Žádný výstup generativní AI nesmí samostatně nabýt účinnosti úředního rozhodnutí, správního aktu nebo vyhlášky bez předchozího vědomého schválení oprávněnou úřední osobou (starosta, tajemník, rada obce).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <strong className="text-white text-sm block">2. Deterministický RAG fallback</strong>
            <p>
              Při dotazech na závazná data (termíny svozu odpadu, úřední hodiny, telefonní čísla) má absolutní přednost deterministická databáze obce. Tím je zcela eliminováno riziko halucinací nebo zkreslení faktů.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <strong className="text-white text-sm block">3. Zákaz trénování na občanských datech</strong>
            <p>
              Konverzace s asistentkou Aničkou nejsou používány k trénování komerčních jazykových modelů a jsou anonymizovány v souladu s minimalizací PII.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
