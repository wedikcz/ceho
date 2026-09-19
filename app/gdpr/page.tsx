'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, FileText, ArrowLeft, UserCheck } from 'lucide-react';
import { getStoredRopa } from '@/lib/store';

export default function GdprPage() {
  const ropaRecords = getStoredRopa();

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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>GDPR • Nařízení (EU) 2016/679 • Evidence ROPA</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
          Zásady ochrany osobních údajů obce Čehovice
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Obec Čehovice jako správce osobních údajů důsledně dbá na zákonnost, transparentnost a minimalizaci zpracovávaných údajů v souladu s evropským a českým právem.
        </p>
      </div>

      {/* ROPA Evidence Table */}
      <div className="glass-card rounded-2xl p-6 border border-sky-400/20 space-y-4">
        <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-400" />
          <span>Záznamy o činnostech zpracování (ROPA dle čl. 30 GDPR)</span>
        </h2>
        <p className="text-xs text-slate-300">
          Oficiální přehled účelů zpracování, právních základů a retenčních lhůt uplatňovaných na obecním úřadě:
        </p>

        <div className="space-y-3 pt-2">
          {ropaRecords.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-bold text-sm text-white">{rec.purpose}</span>
                <span className="text-[11px] font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  Lhůta: {rec.retentionPeriod}
                </span>
              </div>
              <p className="text-slate-300">
                <strong className="text-slate-400">Právní titul:</strong> {rec.legalBasis}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                <span>Subjekty údajů: <strong className="text-sky-300">{rec.dataSubjects}</strong></span>
                <span>•</span>
                <span>Kategorie: {rec.dataCategories.join(', ')}</span>
                <span>•</span>
                <span>Zabezpečení: <strong className="text-emerald-300">{rec.securityMeasures}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Citizens Rights */}
      <div className="glass-panel rounded-2xl p-6 border border-sky-500/20 space-y-3 text-xs text-slate-300">
        <h2 className="text-base font-bold text-white font-serif flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-amber-400" />
          <span>Vaše práva jako subjektu údajů</span>
        </h2>
        <ul className="list-disc list-inside space-y-1.5 pl-1">
          <li><strong>Právo na přístup (čl. 15 GDPR):</strong> Máte právo vědět, zda a jaké vaše údaje zpracováváme.</li>
          <li><strong>Právo na opravu (čl. 16 GDPR):</strong> Právo na bezodkladnou opravu nepřesných údajů.</li>
          <li><strong>Právo na výmaz / být zapomenut (čl. 17 GDPR):</strong> U hlášení závad provádíme výmaz na vyžádání jedním kliknutím v administraci.</li>
          <li><strong>Právo na odvolání souhlasu:</strong> U odběru SMS a e-mailů můžete odběr kdykoliv okamžitě zrušit.</li>
        </ul>
      </div>

      {/* DPO Contact */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
        <Lock className="w-5 h-5 text-sky-400 shrink-0" />
        <div>
          <strong className="text-white">Pověřenec pro ochranu osobních údajů (DPO):</strong>
          <p>Mgr. Klára Svobodová, e-mail: dpo@cehovice.cz, telefon: +420 582 365 211</p>
        </div>
      </div>
    </div>
  );
}
