'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  AlertTriangle,
  Send,
  Calendar,
  Trash2,
  Users,
  Building2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Download,
  ThumbsUp,
  MapPin,
  ExternalLink,
  ChevronRight,
  Phone,
  Radio,
} from 'lucide-react';
import TownClock from '@/components/TownClock';
import ExpandableSection from '@/components/ExpandableSection';
import { VILLAGE_DATA } from '@/lib/village-data';

export default function HomePage() {
  // Participatory budgeting votes state
  const [projects, setProjects] = useState(VILLAGE_DATA.participatoryProjects);
  const [votedProjects, setVotedProjects] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cehovice_voted_projects');
      if (saved) setVotedProjects(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const handleVote = (projId: string) => {
    if (votedProjects.includes(projId)) return;
    const updated = projects.map((p) => (p.id === projId ? { ...p, votes: p.votes + 1 } : p));
    const newVoted = [...votedProjects, projId];
    setProjects(updated);
    setVotedProjects(newVoted);
    try {
      localStorage.setItem('cehovice_voted_projects', JSON.stringify(newVoted));
    } catch {
      // ignore
    }
  };

  // Download .ics calendar for waste collection
  const handleDownloadWasteIcs = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Obec Cehovice//Svoz Odpadu 2026//CS
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Svoz plastů - Čehovice
DTSTART:20260922T060000Z
DTEND:20260922T080000Z
DESCRIPTION:Svoz žlutých popelnic a pytlů s plasty.
LOCATION:Čehovice
END:VEVENT
BEGIN:VEVENT
SUMMARY:Svoz bioodpadu - Čehovice
DTSTART:20260921T060000Z
DTEND:20260921T080000Z
DESCRIPTION:Pravidelný svoz hnědých nádob na bioodpad.
LOCATION:Čehovice
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'svoz_odpadu_cehovice_2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Aurora Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 aurora-glow pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-8 sm:pt-14 pb-10 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-live-dot" />
            <span>Oficiální portál obce • 520 obyvatel • Založeno 1299</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-serif leading-tight">
            Vítejte v <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-amber-300">Čehovicích</span> online
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 leading-relaxed font-sans">
            Rychlé vyřízení úředních záležitostí, živá úřední deska, hlášení závad a krizová varování s podporou AI asistentky Aničky a bezpečnosti Titan 2027.
          </p>

          {/* Core Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/nahlasit-zavadu"
              id="hero-cta-report"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-white"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Nahlásit závadu</span>
            </Link>

            <Link
              href="/podatelna"
              id="hero-cta-podatelna"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-sky-400/30 font-semibold text-sm transition-all hover:border-sky-400/60 focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span>Elektronická podatelna</span>
            </Link>

            <Link
              href="/urad"
              id="hero-cta-urad"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 font-medium text-sm transition-all"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Úřední deska</span>
            </Link>
          </div>
        </div>

        {/* Town Clock live widget */}
        <div className="mt-8 sm:mt-10 max-w-4xl mx-auto">
          <TownClock />
        </div>
      </section>

      {/* Interactive Expandable Cards Grid (Quick Actions & Smart Modules) */}
      <section className="py-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
              Služby pro občany a obecní agendy
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Klepnutím na kartu rozbalíte podrobnosti, termíny a akční formuláře
            </p>
          </div>
        </div>

        {/* Card 1: Svoz odpadu s odpočtem */}
        <ExpandableSection
          id="card-svoz-odpadu"
          icon={Trash2}
          title="Svoz odpadu a sběrný dvůr"
          subtitle="Harmonogram popelnic, kalendář svozů a tříděný odpad"
          badge={{ text: 'Nejbližší: Bioodpad (za 3 dny)', variant: 'live' }}
          kpiSummary={
            <span className="text-amber-400 font-mono text-xs">Příští svoz: Pondělí 21. 9.</span>
          }
          defaultOpen={true}
        >
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {VILLAGE_DATA.wasteSchedule.map((item) => (
                <div
                  key={item.type}
                  className={`p-3.5 rounded-xl border ${item.bgClass} ${item.borderClass} flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold uppercase tracking-wider ${item.accentClass}`}>
                        {item.name}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-200">
                        Za {item.daysUntil} {item.daysUntil === 1 ? 'den' : 'dny'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{item.scheduleDescription}</p>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 font-mono">
                    Datum: {new Date(item.nextDate).toLocaleDateString('cs-CZ')}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <div className="text-xs text-slate-300">
                <span>Poplatek za odpad: </span>
                <strong className="text-white font-mono">650 Kč / osoba / rok</strong>
                <span className="text-slate-500"> (splatnost do 31. března)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadWasteIcs}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-medium border border-sky-500/20 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Stáhnout .ics kalendář</span>
                </button>
                <Link
                  href="/zivotni-situace#odpady"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:underline px-2 py-1"
                >
                  Podrobnosti o platbě <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </ExpandableSection>

        {/* Card 2: Úřední deska a vyhlášky */}
        <ExpandableSection
          id="card-uredni-deska"
          icon={FileText}
          title="Úřední deska a vyhlášky obce"
          subtitle="Záměry, rozpočty, usnesení a obecně závazné vyhlášky"
          badge={{ text: '4 aktivní dokumenty', variant: 'azure' }}
          kpiSummary={<span className="text-sky-300 font-mono text-xs">Aktualizováno: 12. 9. 2026</span>}
        >
          <div className="space-y-3 pt-2">
            <div className="divide-y divide-slate-800/80">
              {VILLAGE_DATA.noticesSeed.slice(0, 3).map((notice) => (
                <div key={notice.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-sky-950/80 text-sky-400 border border-sky-500/30">
                        {notice.fileNumber}
                      </span>
                      <span className="text-xs text-slate-400">Vyvěšeno: {notice.publishedDate}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mt-1 hover:text-amber-300 transition-colors">
                      {notice.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{notice.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-400 font-mono">{notice.fileSize}</span>
                    <Link
                      href="/urad"
                      className="px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-200 text-xs font-semibold"
                    >
                      Zobrazit
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <Link
                href="/urad"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 underline"
              >
                Přejít na kompletní elektronickou úřední desku <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </ExpandableSection>

        {/* Card 3: Obyvatelstvo a vedení obce */}
        <ExpandableSection
          id="card-obec-vedeni"
          icon={Building2}
          title="Obyvatelstvo a správa obce"
          subtitle="Základní údaje, vedení, kontakty a IČO"
          badge={{ text: '520 obyvatel', variant: 'neutral' }}
          kpiSummary={<span className="text-slate-300 text-xs font-medium">Starosta: Milan Smékal</span>}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[11px]">
                Vedení obce
              </span>
              <p className="text-sm font-bold text-white">Milan Smékal (starosta)</p>
              <p className="text-slate-300">Ing. Radim Kovář (místostarosta)</p>
              <p className="text-slate-400 pt-1">Mobil starosty: +420 724 182 455</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[11px]">
                Sídlo & Rejstřík
              </span>
              <p className="text-white">Čehovice 80, 798 17 Čehovice</p>
              <p className="font-mono text-slate-300">IČO: 00288101 • DIČ: CZ00288101</p>
              <p className="text-sky-400 font-mono">Datová schránka: 3vgb2y3</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[11px]">
                Historie & Kultura
              </span>
              <p className="text-white">První písemná zmínka: rok 1299</p>
              <p className="text-slate-300">Kostel sv. Prokopa (baroko 1787)</p>
              <p className="text-slate-400">Pískovcová socha sv. Jana Nepomuckého (1742)</p>
            </div>
          </div>
        </ExpandableSection>
      </section>

      {/* Participatory Budgeting & Citizen Voting Section */}
      <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Participativní rozpočet 2026/2027</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
                Rozhodněte o investicích v obci
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Každý občan může podpořit 1 obecní projekt. Zastupitelstvo podpoří vítězný návrh.
              </p>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Zbývá do ukončení hlasování: <strong className="text-amber-400">12 dní</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((proj) => {
              const hasVoted = votedProjects.includes(proj.id);
              return (
                <div
                  key={proj.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    hasVoted
                      ? 'bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/80 border-slate-800 hover:border-sky-400/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30">
                        Rozpočet: {proj.budget}
                      </span>
                      <span className="text-xs font-mono font-semibold text-slate-300">
                        {proj.votes} hlasů
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-white font-serif mb-2 leading-snug">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                  </div>

                  <button
                    onClick={() => handleVote(proj.id)}
                    disabled={hasVoted}
                    className={`mt-4 w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      hasVoted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                    }`}
                  >
                    {hasVoted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Hlas započítán!</span>
                      </>
                    ) : (
                      <>
                        <ThumbsUp className="w-4 h-4" />
                        <span>Hlasovat pro projekt</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section (Limit 3) */}
      <section className="py-6 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
              Nejbližší akce a život v obci
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Kulturní akce, hasičská cvičení a dětské rybářské závody
            </p>
          </div>
          <Link
            href="/kalendar"
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1"
          >
            Celý kalendář <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {VILLAGE_DATA.eventsSeed.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="glass-card rounded-2xl p-5 border border-sky-400/20 flex flex-col justify-between hover:border-sky-400/50 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-amber-400 mb-2 font-mono">
                  <span>{event.date}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                    {event.time}
                  </span>
                </div>
                <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors font-serif mb-2">
                  {event.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                  {event.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span className="truncate max-w-[160px]">{event.location}</span>
                </span>
                <span className="text-amber-300 font-semibold">{event.admission}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Spolky v obci promo bar */}
      <section className="py-6 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="glass-panel rounded-2xl p-5 border border-sky-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-serif">
                Aktivní spolky: Hasiči SDH (zal. 1891), Rybáři Čehovice a Zahrádkáři
              </h3>
              <p className="text-xs text-slate-400">
                Péče o obecní rybník, moštárna ovoce a výchova mladých hasičů
              </p>
            </div>
          </div>
          <Link
            href="/spolky"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold border border-sky-500/30 shrink-0 transition-colors"
          >
            Poznat naše spolky
          </Link>
        </div>
      </section>
    </div>
  );
}
