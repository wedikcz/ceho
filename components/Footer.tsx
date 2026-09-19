'use client';

import React from 'react';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import { VILLAGE_DATA } from '@/lib/village-data';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-sky-900/40 text-slate-300 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Obec Čehovice */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-amber-400 font-bold font-serif">
                Č
              </div>
              <span className="font-bold text-base text-white font-serif">Obec Čehovice</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Oficiální digitální portál obce Čehovice u Prostějova. Založeno roku 1299, 520 obyvatel. Moderní samospráva podle standardů NIS2 a zákona č. 99/2019 Sb.
            </p>
            <div className="text-xs text-slate-300 space-y-1 font-mono">
              <p>IČO: {VILLAGE_DATA.registry.ico} • DIČ: {VILLAGE_DATA.registry.dic}</p>
              <p>Datová schránka: <strong className="text-sky-300">{VILLAGE_DATA.registry.dataBoxId}</strong></p>
              <p>Účet: {VILLAGE_DATA.registry.bankAccount}</p>
            </div>
          </div>

          {/* Col 2: Rychlé odkazy */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              Rychlé služby
            </h4>
            <ul className="text-xs space-y-2">
              <li>
                <Link href="/urad" className="hover:text-white transition-colors">
                  Úřední deska a vyhlášky
                </Link>
              </li>
              <li>
                <Link href="/nahlasit-zavadu" className="hover:text-white transition-colors">
                  Hlášení závad (FOTO + GPS)
                </Link>
              </li>
              <li>
                <Link href="/podatelna" className="hover:text-white transition-colors">
                  Digitální e-podatelna
                </Link>
              </li>
              <li>
                <Link href="/zivotni-situace" className="hover:text-white transition-colors">
                  Průvodce životními situacemi
                </Link>
              </li>
              <li>
                <Link href="/varovani" className="hover:text-white transition-colors">
                  Odběr krizových SMS / E-mailů
                </Link>
              </li>
              <li>
                <Link href="/krizove-info" className="hover:text-white transition-colors text-amber-300">
                  Tísňová volání & Krizové linky
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Spolky a život */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3">
              Spolky a komunita
            </h4>
            <ul className="text-xs space-y-2">
              <li>
                <Link href="/spolky" className="hover:text-white transition-colors">
                  SDH Čehovice (založeno 1891)
                </Link>
              </li>
              <li>
                <Link href="/spolky" className="hover:text-white transition-colors">
                  Moravský rybářský svaz Čehovice
                </Link>
              </li>
              <li>
                <Link href="/spolky" className="hover:text-white transition-colors">
                  Český zahrádkářský svaz & Moštárna
                </Link>
              </li>
              <li>
                <Link href="/kalendar" className="hover:text-white transition-colors">
                  Kalendář kulturních a sportovních akcí
                </Link>
              </li>
              <li>
                <Link href="/napoveda" className="hover:text-white transition-colors flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                  <span>Nápověda a klávesové zkratky</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Dotace a partneři */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Dotace a partneři obce
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-semibold text-slate-200 block">Olomoucký kraj</span>
                <span className="text-[11px] text-slate-500">Program obnovy venkova a podpora spolků</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-semibold text-slate-200 block">MAS Prostějov venkov o.p.s.</span>
                <span className="text-[11px] text-slate-500">Místní akční skupina rozvoje regionu</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-semibold text-slate-200 block">Národní plán obnovy ČR</span>
                <span className="text-[11px] text-slate-500">Financováno Evropskou unií NextGenerationEU</span>
              </div>
            </div>
          </div>
        </div>

        {/* Combined One-Floor Legal & Compliance Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-2 flex-wrap text-center md:text-left">
            <span>© 2027 Obec Čehovice. Všechna práva vyhrazena.</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-sky-300">Poháněno jádrem Titan & AI Aničkou</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center font-medium">
            <Link href="/gdpr" className="hover:text-amber-300 transition-colors">
              GDPR
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/edpb" className="hover:text-amber-300 transition-colors">
              EDPB
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/informacni-povinnost" className="hover:text-amber-300 transition-colors">
              Informační povinnost
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/ik" className="hover:text-amber-300 transition-colors">
              IK ÚOOÚ/OVS
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/obchodni-podminky" className="hover:text-amber-300 transition-colors">
              Podmínky
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/metakognitivni-licence" className="hover:text-amber-300 transition-colors">
              Licence ML-2.1
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/pravni-informace" className="hover:text-amber-300 transition-colors">
              NIS2 & Legislativa 2027
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
