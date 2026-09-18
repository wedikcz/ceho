'use client';

import React from 'react';
import Link from 'next/link';
import { HelpCircle, Keyboard, Eye, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function NapovedaPage() {
  const faqs = [
    {
      q: 'Kdy a kde mohu zaplatit poplatek za komunální odpad a psa?',
      a: 'Poplatky se hradí do 31. března daného roku. Platbu lze provést bezhotovostně převodem na účet 15024761/0100 (jako variabilní symbol uveďte číslo popisné vašeho domu), nebo hotově / kartou v úředních hodinách na obecním úřadě.',
    },
    {
      q: 'Jak funguje AI asistentka Anička a jsou mé dotazy ukládány?',
      a: 'Anička je digitální asistentka provozovaná pod bezpečnostním rámcem Titan a licencí ML-2.1. Využívá zabezpečené serverové rozhraní bez ukládání jakýchkoliv osobních identifikačních údajů (PII). Běžné dotazy na úřední hodiny a svoz odpadu zodpovídá deterministicky ihned.',
    },
    {
      q: 'Jak mohu podat oficiální žádost podle zákona 106/1999 Sb.?',
      a: 'Využijte naši elektronickou podatelnu na stránce /podatelna. Vyplňte formulář, obdržíte unikátní trasovací kód a obecní úřad vám v zákonné 15denní lhůtě zašle odpověď do e-mailu nebo datové schránky.',
    },
    {
      q: 'Co mám dělat, když v noci nesvítí lampa veřejného osvětlení?',
      a: 'Přejděte na stránku /nahlasit-zavadu, vyberte kategorii Veřejné osvětlení, stiskněte tlačítko Určit moji GPS polohu a odešlete hlášení. Závada je ihned zařazena do plánu oprav.',
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Nápověda a podpora pro občany</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
          Nápověda k portálu a přístupnost
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Často kladené dotazy, klávesové zkratky pro rychlé ovládání a prohlášení o přístupnosti dle zákona č. 99/2019 Sb.
        </p>
      </div>

      {/* Keyboard shortcuts */}
      <div className="glass-card rounded-2xl p-6 border border-sky-400/20 space-y-4">
        <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-amber-400" />
          <span>Klávesové zkratky pro rychlou navigaci</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-300">Globální vyhledávání:</span>
            <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-amber-400 font-mono font-bold">
              Ctrl + K
            </kbd>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-300">Zavřít okno / dialog:</span>
            <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono font-bold">
              Esc
            </kbd>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-300">Spustit AI Aničku:</span>
            <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sky-300 font-mono font-bold">
              Klik na widget
            </kbd>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="glass-card rounded-2xl p-6 border border-sky-400/20 space-y-4">
        <h2 className="text-lg font-bold text-white font-serif">
          Často kladené dotazy občanů (FAQ)
        </h2>
        <div className="space-y-4 text-xs divide-y divide-slate-800">
          {faqs.map((f, i) => (
            <div key={i} className={i > 0 ? 'pt-4 space-y-1.5' : 'space-y-1.5'}>
              <h3 className="font-bold text-sm text-white">{f.q}</h3>
              <p className="text-slate-300 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WCAG 2.2 AA Accessibility declaration */}
      <div className="glass-panel rounded-2xl p-6 border border-sky-500/20 space-y-3 text-xs text-slate-300">
        <h2 className="text-base font-bold text-white font-serif flex items-center gap-2">
          <Eye className="w-5 h-5 text-amber-400" />
          <span>Prohlášení o přístupnosti dle Zákona č. 99/2019 Sb.</span>
        </h2>
        <p className="leading-relaxed">
          Tento oficiální portál obce Čehovice splňuje standardy přístupnosti webových stránek a mobilních aplikací veřejného sektoru (WCAG 2.2 AA) a standard EN 301 549. V horní liště si můžete přepnout režim vysokého kontrastu (černé pozadí se žlutým textem) a zvětšit písmo až na 125 % bez deformace rozvržení.
        </p>
        <p className="text-slate-400 pt-1">
          Případné podněty k přístupnosti můžete směřovat na správce portálu: obec@cehovice.cz.
        </p>
      </div>
    </div>
  );
}
