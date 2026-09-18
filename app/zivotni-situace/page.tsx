'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Dog,
  Trash2,
  FileCheck,
  TreePine,
  Building,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Calculator,
  QrCode,
} from 'lucide-react';
import { VILLAGE_DATA } from '@/lib/village-data';

export default function ZivotniSituacePage() {
  const [openCardId, setOpenCardId] = useState<string>('poplatek-pes');

  // Interactive Fee Calculator State
  const [dogCount, setDogCount] = useState<number>(1);
  const [isSenior, setIsSenior] = useState<boolean>(false);
  const [wastePersons, setWastePersons] = useState<number>(3);
  const [houseNumber, setHouseNumber] = useState<string>('45');

  const dogFee = dogCount * (isSenior ? 100 : 200);
  const wasteFee = wastePersons * 650;

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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Průvodce životními situacemi • Chci vyřídit...</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
          Jak vyřídit úřední záležitosti
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Jednoduché návody krok za krokem pro nejčastější životní situace, kalkulačka místních poplatků a pokyny k bezhotovostním platbám.
        </p>
      </div>

      {/* Interactive Fee Calculator Widget */}
      <div className="glass-card rounded-2xl p-6 sm:p-7 border border-amber-500/30 space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-serif">
              Interaktivní kalkulačka místních poplatků obce Čehovice
            </h2>
            <p className="text-xs text-slate-300">
              Spočítejte si celkovou výši poplatků za vaši domácnost pro rok 2026/2027
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Controls */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Počet psů v rodinném domě:
              </label>
              <div className="flex items-center gap-3">
                {[0, 1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => setDogCount(num)}
                    className={`px-3 py-1.5 rounded-lg border font-bold ${
                      dogCount === num
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={isSenior}
                onChange={(e) => setIsSenior(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-400"
              />
              <span>Jsem poživatelem důchodu nad 65 let (sleva 50 % na psa)</span>
            </label>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Počet osob v domácnosti (poplatek za odpad):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={wastePersons}
                  onChange={(e) => setWastePersons(Math.max(1, Number(e.target.value)))}
                  className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-center font-bold"
                />
                <span className="text-slate-400">osob (650 Kč / osoba / rok)</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Číslo popisné vašeho domu (Variabilní symbol):
              </label>
              <input
                type="text"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                placeholder="Např. 80"
                className="w-28 bg-slate-900 border border-sky-400/40 rounded-lg px-3 py-1.5 text-white font-mono font-bold"
              />
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs uppercase font-mono text-slate-400 block mb-2">
                Rekapitulace platby
              </span>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Poplatek ze psů ({dogCount} ks):</span>
                  <span className="font-mono text-white font-bold">{dogFee} Kč</span>
                </div>
                <div className="flex justify-between">
                  <span>Komunální odpad ({wastePersons} osob):</span>
                  <span className="font-mono text-white font-bold">{wasteFee} Kč</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm">
                  <strong className="text-white">Celkem k úhradě:</strong>
                  <strong className="text-amber-400 text-lg font-mono">{dogFee + wasteFee} Kč</strong>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono space-y-1 text-slate-300">
              <p>Číslo účtu: <strong className="text-white">15024761/0100</strong></p>
              <p>Variabilní symbol: <strong className="text-sky-300">{houseNumber || 'Číslo popisné'}</strong></p>
              <p className="text-slate-400 font-sans">Splatnost: do 31. března daného roku</p>
            </div>
          </div>
        </div>
      </div>

      {/* Situations Guide Cards */}
      <div className="space-y-4">
        {VILLAGE_DATA.lifeSituations.map((sit) => {
          const isOpen = openCardId === sit.id;
          return (
            <div
              key={sit.id}
              className={`glass-card rounded-2xl overflow-hidden border transition-all ${
                isOpen ? 'border-sky-400/50 shadow-xl' : 'border-sky-500/20'
              }`}
            >
              <div
                onClick={() => setOpenCardId(isOpen ? '' : sit.id)}
                className="w-full p-5 flex items-center justify-between text-left cursor-pointer group hover:bg-sky-500/5 transition-colors"
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-sky-400/30 flex items-center justify-center text-amber-400 shrink-0">
                    {sit.id.includes('pes') && <Dog className="w-5 h-5" />}
                    {sit.id.includes('odpad') && <Trash2 className="w-5 h-5" />}
                    {sit.id.includes('overovani') && <FileCheck className="w-5 h-5" />}
                    {sit.id.includes('kaceni') && <TreePine className="w-5 h-5" />}
                    {sit.id.includes('pronajem') && <Building className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors font-serif">
                      {sit.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{sit.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-block text-xs font-mono font-semibold text-amber-400 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30">
                    {sit.fee}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-white transition-transform ${
                      isOpen ? 'transform rotate-180 text-amber-400' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {isOpen && (
                <div className="p-5 pt-0 border-t border-slate-800/80 space-y-4 text-xs animate-fade-in">
                  <p className="text-slate-300 leading-relaxed">{sit.description}</p>

                  <div className="space-y-2">
                    <span className="font-bold uppercase tracking-wider text-amber-400 block text-[11px]">
                      Postup vyřízení krok za krokem:
                    </span>
                    <ol className="space-y-2 list-decimal list-inside text-slate-200">
                      {sit.steps.map((st, i) => (
                        <li key={i} className="leading-relaxed">
                          {st}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-400">
                    <div>
                      <span>Poplatek: </span>
                      <strong className="text-white">{sit.fee}</strong>
                      <span className="mx-2">•</span>
                      <span>Právní předpis: </span>
                      <span className="text-sky-300 font-mono">{sit.legalBasis}</span>
                    </div>

                    <Link
                      href="/podatelna"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 font-bold border border-sky-400/40 transition-colors self-start sm:self-auto"
                    >
                      <span>Podat žádost online</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
