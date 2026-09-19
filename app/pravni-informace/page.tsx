'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, FileText, ArrowLeft, Lock } from 'lucide-react';
import { getStoredPolicies } from '@/lib/store';

export default function PravniInformacePage() {
  const policies = getStoredPolicies();

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
          <Scale className="w-3.5 h-3.5 text-amber-400" />
          <span>Právní rámec portálu pro rok 2027 • NIS2 & ePrivacy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
          Právní informace a kybernetická bezpečnost
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Tento oficiální portál obce Čehovice je koncipován s předstihem pro legislativní standardy platné v roce 2027 se zohledněním evropské směrnice NIS2 a zákona o právu na digitální služby.
        </p>
      </div>

      {/* NIS2 Policies */}
      <div className="glass-card rounded-2xl p-6 border border-sky-400/20 space-y-4">
        <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-400" />
          <span>Bezpečnostní politiky dle čl. 21 odst. 2 směrnice NIS2</span>
        </h2>
        <p className="text-xs text-slate-300">
          Obec Čehovice implementuje technická a organizační opatření k řízení kybernetických rizik:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {policies.map((pol) => (
            <div
              key={pol.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-amber-400 font-bold text-[11px]">{pol.article}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {pol.status === 'aktivni' ? 'Aktivní • V souladu' : 'V revizi'}
                </span>
              </div>
              <h3 className="font-bold text-sm text-white">{pol.name}</h3>
              <p className="text-slate-300 leading-relaxed">{pol.description}</p>
              <span className="text-[11px] text-slate-400 block pt-1 font-mono">
                Odpovědná osoba: {pol.officerResponsible}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legislative Acts */}
      <div className="glass-panel rounded-2xl p-6 border border-sky-500/20 space-y-4 text-xs text-slate-300">
        <h2 className="text-base font-bold text-white font-serif flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-400" />
          <span>Klíčové české a evropské právní předpisy</span>
        </h2>
        <ul className="space-y-2 list-disc list-inside leading-relaxed">
          <li><strong>Zákon č. 12/2020 Sb., o právu na digitální služby:</strong> Zaručuje občanům právo komunikovat s obcí plně digitální cestou (e-podatelna, hlášení závad).</li>
          <li><strong>Zákon č. 500/2004 Sb., správní řád:</strong> Úprava elektronické úřední desky (§ 26) a běhu správních lhůt.</li>
          <li><strong>Zákon č. 99/2019 Sb., o přístupnosti internetových stránek:</strong> Plná shoda s normou EN 301 549 a WCAG 2.2 na úrovni AA.</li>
          <li><strong>Směrnice Evropského parlamentu a Rady (EU) 2022/2555 (NIS2):</strong> Opatření k zajištění vysoké společné úrovně kybernetické bezpečnosti.</li>
          <li><strong>Směrnice 2002/58/ES (ePrivacy):</strong> Ochrana soukromí v odvětví elektronických komunikací – portál nepoužívá žádné sledovací ani reklamní cookies.</li>
        </ul>
      </div>
    </div>
  );
}
