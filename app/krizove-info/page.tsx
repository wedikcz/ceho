'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  PhoneCall,
  Flame,
  Shield,
  Zap,
  Droplets,
  Radio,
  ArrowLeft,
  LifeBuoy,
} from 'lucide-react';
import { VILLAGE_DATA } from '@/lib/village-data';

export default function KrizoveInfoPage() {
  const { emergency } = VILLAGE_DATA;

  const emergencyServices = [
    { number: emergency.sos, name: 'Jednotné evropské číslo tísňového volání', short: 'SOS' },
    { number: emergency.fire, name: 'Hasičský záchranný sbor ČR / JSDH Čehovice', short: 'Hasiči' },
    { number: emergency.ambulance, name: 'Zdravotnická záchranná služba', short: 'Záchranka' },
    { number: emergency.police, name: 'Policie České republiky', short: 'Policie' },
  ];

  const utilityBreakdowns = [
    {
      name: 'Havárie vody a kanalizace',
      phone: '+420 582 332 444',
      provider: 'Vodovody a kanalizace Prostějov, a.s.',
    },
    {
      name: 'Poruchy a únik plynu (pohotovost)',
      phone: '1239',
      provider: 'GasNet, s.r.o.',
    },
    {
      name: 'Poruchy dodávky elektřiny',
      phone: '800 22 55 77',
      provider: 'ČEZ Distribuce, a.s.',
    },
  ];

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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>Krizové řízení a ochrana obyvatelstva</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
          Krizové informace a tísňové linky
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Důležitá telefonní čísla pro případ požáru, úrazu, havárie plynu, vody nebo povodňové bdělosti na toku Vřesovka.
        </p>
      </div>

      {/* Emergency numbers cards (112, 150, 155, 158) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {emergencyServices.map((em) => (
          <a
            key={em.number}
            href={`tel:${em.number}`}
            className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 hover:border-rose-400 transition-all text-center group flex flex-col justify-between"
          >
            <div>
              <span className="text-xs text-rose-300 font-semibold block">{em.short}</span>
              <span className="text-3xl font-extrabold text-white font-mono block my-1 group-hover:scale-105 transition-transform">
                {em.number}
              </span>
            </div>
            <span className="text-[11px] text-rose-400 font-medium">Volat zdarma (24/7)</span>
          </a>
        ))}
      </div>

      {/* Utility breakdowns */}
      <div className="glass-card rounded-2xl p-6 border border-sky-400/20 space-y-4">
        <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-amber-400" />
          <span>Havarijní linky dodavatelů energií a vody</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {utilityBreakdowns.map((em) => (
            <div key={em.name} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[11px] font-semibold">{em.name}</span>
              <a
                href={`tel:${em.phone.replace(/\s+/g, '')}`}
                className="text-base font-bold text-amber-400 font-mono block hover:underline"
              >
                {em.phone}
              </a>
              <span className="text-slate-500 text-[11px] block">{em.provider}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Flood Plan for Vřesovka */}
      <div className="glass-panel rounded-2xl p-6 border border-sky-500/20 space-y-4">
        <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
          <Droplets className="w-5 h-5 text-sky-400" />
          <span>Povodňový plán obce Čehovice (potok Vřesovka)</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Katastrem obce protéká vodní tok Vřesovka. V případě vyhlášení stupňů povodňové aktivity (SPA) řídí zásah a stavbu protipovodňových hrází povodňová komise obce ve spolupráci s jednotkou SDH Čehovice.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30">
            <span className="text-amber-400 font-bold block mb-1">1. SPA • Bdělost</span>
            <p className="text-slate-300">
              Vizuální kontrola průtoku pod mostky, stálá pohotovost povodňové hlídky obce.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-600/50">
            <span className="text-amber-500 font-bold block mb-1">2. SPA • Pohotovost</span>
            <p className="text-slate-300">
              Zasedá povodňová komise, příprava pytlů s pískem u hasičské zbrojnice.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/50">
            <span className="text-rose-400 font-bold block mb-1">3. SPA • Ohrožení</span>
            <p className="text-slate-300">
              Spuštění sirén, řízené záchranné práce, případná evakuace ohrožených objektů.
            </p>
          </div>
        </div>
      </div>

      {/* Siren guidelines */}
      <div className="glass-card rounded-2xl p-6 border border-sky-400/20 space-y-3 text-xs text-slate-300">
        <h3 className="font-bold text-sm text-white font-serif flex items-center gap-2">
          <Radio className="w-4 h-4 text-amber-400" />
          <span>Co dělat při zaznění varovného signálu sirény</span>
        </h3>
        <p className="leading-relaxed">
          <strong>Všeobecná výstraha:</strong> Kolísavý tón sirény po dobu 140 vteřin. Neprodleně se ukryjte v nejbližší budově, zavřete okna a dveře, poslouchejte hlášení obecního rozhlasu a sledujte SMS notifikace obce. (Zkouška sirén probíhá každou 1. středu v měsíci ve 12:00 nepřerušovaným tónem 140 s).
        </p>
      </div>
    </div>
  );
}
