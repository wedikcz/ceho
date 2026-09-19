'use client';

import React from 'react';
import Link from 'next/link';
import { Landmark, TreePine, Church, ArrowLeft } from 'lucide-react';
import { VILLAGE_DATA } from '@/lib/village-data';

export default function ObecPage() {
  const { historyAndMonuments } = VILLAGE_DATA;

  return (
    <div className="py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
      {/* Back link & breadcrumb */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Zpět na hlavní stránku</span>
        </Link>
      </div>

      {/* Hero header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-semibold">
          <Landmark className="w-3.5 h-3.5 text-amber-400" />
          <span>Historie a pamětihodnosti • Založeno 1299</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
          O obci Čehovice
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          {historyAndMonuments.summary}
        </p>
      </div>

      {/* Key stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card rounded-2xl p-4 text-center border border-sky-400/20">
          <span className="text-xs text-slate-400 uppercase font-mono block">První zmínka</span>
          <span className="text-2xl font-bold text-amber-400 font-serif">1299</span>
          <span className="text-[11px] text-slate-500 block">před více než 725 lety</span>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center border border-sky-400/20">
          <span className="text-xs text-slate-400 uppercase font-mono block">Počet obyvatel</span>
          <span className="text-2xl font-bold text-white font-serif">520</span>
          <span className="text-[11px] text-slate-500 block">k 1. 1. 2026</span>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center border border-sky-400/20">
          <span className="text-xs text-slate-400 uppercase font-mono block">Katastrální kód</span>
          <span className="text-2xl font-bold text-sky-400 font-mono">619175</span>
          <span className="text-[11px] text-slate-500 block">výměra 711 ha</span>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center border border-sky-400/20">
          <span className="text-xs text-slate-400 uppercase font-mono block">Nadmořská výška</span>
          <span className="text-2xl font-bold text-emerald-400 font-serif">212 m</span>
          <span className="text-[11px] text-slate-500 block">úrodná Haná</span>
        </div>
      </div>

      {/* Cultural & Historical Monuments */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
          <Church className="w-5 h-5 text-amber-400" />
          <span>Kulturní památky a významná místa</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {historyAndMonuments.monuments.map((mon, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-5 border border-sky-400/20 hover:border-sky-400/50 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-white font-serif">{mon.name}</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-400">
                  {mon.era}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{mon.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nature & Geography */}
      <div className="glass-panel rounded-2xl p-6 border border-sky-500/20 space-y-3">
        <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
          <TreePine className="w-4 h-4 text-emerald-400" />
          <span>Příroda, potok Vřesovka a rybník Pod Hrází</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Okolí obce tvoří pestrá hanácká krajina s remízky, polními cestami a revitalizovaným biokoridorem podél potoka Vřesovka. Obecní rybník Pod Hrází slouží nejen k chovu ryb místním rybářským spolkem, ale také jako klidová zóna s workoutovým cvičištěm a místem pro procházky občanů a rodin s dětmi.
        </p>
      </div>
    </div>
  );
}
