'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  Building,
  UserCheck,
  Download,
  Filter,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import TownClock from '@/components/TownClock';
import { VILLAGE_DATA } from '@/lib/village-data';

export default function UradPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('vse');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const notices = VILLAGE_DATA.noticesSeed;

  const filteredNotices =
    selectedCategory === 'vse'
      ? notices
      : notices.filter((n) => n.category === selectedCategory);

  const handleSimulateDownload = (noticeId: string, title: string) => {
    setDownloadSuccess(title);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const forms = [
    { title: 'Přihlášení psa k místnímu poplatku', format: 'PDF formulář', size: '142 kB' },
    { title: 'Žádost o povolení kácení dřevin mimo les', format: 'DOCX / PDF', size: '180 kB' },
    { title: 'Žádost o poskytnutí informace dle zákona 106/1999 Sb.', format: 'PDF vzor', size: '120 kB' },
    { title: 'Žádost o krátkodobý nájem prostor Kulturního domu', format: 'PDF formulář', size: '195 kB' },
    { title: 'Evidenční lístek poplatníka komunálního odpadu', format: 'PDF', size: '110 kB' },
  ];

  return (
    <div className="py-10 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
      {/* Back link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Zpět na úvod</span>
        </Link>
      </div>

      {/* Hero */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-semibold">
          <Building className="w-3.5 h-3.5 text-amber-400" />
          <span>Obecní úřad Čehovice • IČO 00288101</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
          Úřad, úřední deska a vedení obce
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Oficiální elektronická úřední deska, úřední hodiny, přehled zasedání zastupitelstva a dokumenty ke stažení.
        </p>
      </div>

      {/* Town Clock Widget */}
      <TownClock />

      {/* Office Hours Details */}
      <div className="glass-card rounded-2xl p-6 border border-sky-400/20 space-y-4">
        <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <span>Přehled úředních hodin pro veřejnost</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {VILLAGE_DATA.officeHours.map((oh) => (
            <div
              key={oh.day}
              className={`p-4 rounded-xl border ${
                oh.openTime
                  ? 'bg-sky-500/10 border-sky-400/30 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm">{oh.day}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-mono ${
                    oh.openTime ? 'bg-amber-500/20 text-amber-300 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {oh.hours}
                </span>
              </div>
              <p className="text-xs text-slate-300">{oh.note}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 italic">
          Mimo úřední hodiny jsou schůzky se starostou možné po předchozí telefonické domluvě na čísle +420 724 182 455.
        </p>
      </div>

      {/* Official Board (Úřední deska) */}
      <div className="glass-card rounded-2xl p-6 border border-sky-400/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Elektronická úřední deska</span>
            </h2>
            <p className="text-xs text-slate-400">
              V souladu se zákonem č. 500/2004 Sb., správní řád (§ 26)
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'vse', label: 'Vše' },
              { id: 'vyhlaska', label: 'Vyhlášky' },
              { id: 'zamer', label: 'Záměry' },
              { id: 'rozpocet', label: 'Rozpočty' },
              { id: 'usneseni', label: 'Usnesení' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedCategory(f.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === f.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Dokument „{downloadSuccess}“ byl úspěšně připraven ke stažení.</span>
          </div>
        )}

        {/* Notices list */}
        <div className="divide-y divide-slate-800/80">
          {filteredNotices.map((n) => (
            <div key={n.id} className="py-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-950/80 border border-sky-500/30">
                    {n.fileNumber}
                  </span>
                  <span className="text-xs text-slate-400">Vyvěšeno: {n.publishedDate}</span>
                  <span className="text-xs text-amber-400">Snětí do: {n.expirationDate}</span>
                </div>
                <button
                  onClick={() => handleSimulateDownload(n.id, n.title)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 text-xs font-semibold transition-colors self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Stáhnout ({n.fileSize})</span>
                </button>
              </div>

              <h3 className="font-bold text-base text-white">{n.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{n.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Forms to download */}
      <div className="glass-panel rounded-2xl p-6 border border-sky-500/20 space-y-4">
        <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
          <Download className="w-5 h-5 text-amber-400" />
          <span>Formuláře a žádosti ke stažení</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {forms.map((f, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 hover:border-sky-500/40 transition-colors"
            >
              <div>
                <h4 className="text-xs font-semibold text-white">{f.title}</h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  {f.format} • {f.size}
                </span>
              </div>
              <button
                onClick={() => handleSimulateDownload(`f-${idx}`, f.title)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white transition-colors shrink-0"
                title="Stáhnout formulář"
                aria-label={`Stáhnout formulář ${f.title}`}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Elected Representatives */}
      <div className="glass-card rounded-2xl p-6 border border-sky-400/20 space-y-4">
        <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-amber-400" />
          <span>Vedení obce Čehovice (Volební období 2022–2026/2027)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] block">Starosta obce</span>
            <p className="text-sm font-bold text-white">Milan Smékal</p>
            <p className="text-slate-300">Statutární zástupce, krizové řízení, rozpočet</p>
            <p className="text-sky-300 font-mono pt-1">Tel: +420 724 182 455</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-sky-400 font-bold uppercase tracking-wider text-[11px] block">Místostarosta</span>
            <p className="text-sm font-bold text-white">Ing. Radim Kovář</p>
            <p className="text-slate-300">Investiční výstavba, životní prostředí, dotace</p>
            <p className="text-slate-400 pt-1">E-mail: mistostarosta@cehovice.cz</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] block">Kontrolní & Finanční výbor</span>
            <p className="text-sm font-bold text-white">Předseda finančního výboru: Pavel Marek</p>
            <p className="text-slate-300">Předseda kontrolního výboru: Bc. Tomáš Horák</p>
            <p className="text-slate-400 pt-1">Zastupitelstvo má celkem 7 členů</p>
          </div>
        </div>
      </div>
    </div>
  );
}
