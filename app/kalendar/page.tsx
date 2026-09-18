'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowLeft, Download, Filter, Search } from 'lucide-react';
import { VILLAGE_DATA } from '@/lib/village-data';

export default function KalendarPage() {
  const [category, setCategory] = useState<string>('vse');
  const [search, setSearch] = useState<string>('');

  const events = VILLAGE_DATA.eventsSeed;

  const filteredEvents = events.filter((ev) => {
    const matchesCat = category === 'vse' || ev.category === category;
    const matchesSearch =
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.description.toLowerCase().includes(search.toLowerCase()) ||
      ev.location.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownloadEventIcs = (event: (typeof events)[0]) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Obec Cehovice//Akce//CS
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>Kulturní a společenský kalendář obce Čehovice</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
          Kalendář událostí 2026/2027
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Plánované obecní slavnosti, vinařská setkání, rybářské závody pro děti, výstavy zahrádkářů a cvičení hasičů.
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'vse', label: 'Všechny akce' },
            { id: 'kultura', label: 'Kultura & Zábava' },
            { id: 'sport', label: 'Sport & Rybaření' },
            { id: 'spolky', label: 'Hasiči & Spolky' },
            { id: 'pro-deti', label: 'Pro děti & Rodiny' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                category === c.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hledat akci..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="glass-card rounded-2xl p-6 border border-sky-400/20 hover:border-sky-400/50 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30">
                    {event.date}
                  </span>
                  <span className="text-xs font-mono text-slate-300 px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                    {event.time}
                  </span>
                </div>
                <button
                  onClick={() => handleDownloadEventIcs(event)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 self-start sm:self-auto"
                  title="Přidat do kalendáře Google / Apple / Outlook"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Přidat do kalendáře (.ics)</span>
                </button>
              </div>

              <h3 className="font-bold text-lg text-white font-serif">{event.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{event.description}</p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    {event.location}
                  </span>
                  <span>Pořadatel: <strong className="text-white">{event.organizer}</strong></span>
                </div>
                <span className="text-amber-300 font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                  {event.admission}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-400 glass-card rounded-2xl">
            Žádné akce neodpovídají zadanému filtru.
          </div>
        )}
      </div>
    </div>
  );
}
