'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ArrowLeft, Download, Search, Bell, CheckCircle2, X, Mail } from 'lucide-react';
import { VILLAGE_DATA } from '@/lib/village-data';
import { saveEventReminder } from '@/lib/store';

export default function KalendarPage() {
  const [category, setCategory] = useState<string>('vse');
  const [search, setSearch] = useState<string>('');
  const [selectedEventForReminder, setSelectedEventForReminder] = useState<any | null>(null);
  const [reminderEmail, setReminderEmail] = useState('');
  const [reminderDaysBefore, setReminderDaysBefore] = useState(1);
  const [reminderSuccess, setReminderSuccess] = useState(false);

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

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderEmail || !selectedEventForReminder) return;

    saveEventReminder({
      id: `rem-${Date.now()}`,
      eventId: selectedEventForReminder.id,
      eventTitle: selectedEventForReminder.title,
      eventDate: selectedEventForReminder.date,
      userEmail: reminderEmail,
      scheduledNotificationDate: reminderDaysBefore === 1 ? '1 den před akcí (08:00)' : `${reminderDaysBefore} dny před akcí (08:00)`,
      status: 'naplanovano',
      createdAt: new Date().toISOString(),
    });

    setReminderSuccess(true);
    setTimeout(() => {
      setReminderSuccess(false);
      setSelectedEventForReminder(null);
      setReminderEmail('');
    }, 2200);
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
                <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
                  <button
                    onClick={() => setSelectedEventForReminder(event)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-colors"
                    title="Nastavit automatické e-mailové upozornění 1 den předem"
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upozornit e-mailem (1 den předem)</span>
                  </button>
                  <button
                    onClick={() => handleDownloadEventIcs(event)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
                    title="Přidat do kalendáře Google / Apple / Outlook"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Přidat do kalendáře (.ics)</span>
                  </button>
                </div>
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

      {/* Email Notification Modal (1 day before) */}
      {selectedEventForReminder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 text-xs sm:text-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base font-serif">
                  E-mailové upozornění na akci
                </h3>
              </div>
              <button
                onClick={() => setSelectedEventForReminder(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reminderSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-base">Upozornění úspěšně nastaveno!</h4>
                <p className="text-slate-300 text-xs">
                  Na e-mail <strong>{reminderEmail}</strong> vám zašleme připomínku{' '}
                  {reminderDaysBefore === 1 ? '1 den před konáním akce' : `${reminderDaysBefore} dny před akcí`} v 8:00 ráno.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveReminder} className="space-y-4">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[11px] font-mono text-amber-400 font-bold block">
                    {selectedEventForReminder.date} • {selectedEventForReminder.time}
                  </span>
                  <strong className="text-white text-sm block">
                    {selectedEventForReminder.title}
                  </strong>
                  <span className="text-slate-400 text-xs block">
                    {selectedEventForReminder.location}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-200 block">
                    Váš e-mail pro doručení připomínky:
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={reminderEmail}
                      onChange={(e) => setReminderEmail(e.target.value)}
                      placeholder="např. jan.novak@email.cz"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-200 block">
                    Kdy si přejete upozornění obdržet:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setReminderDaysBefore(1)}
                      className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                        reminderDaysBefore === 1
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      1 den předem (Doporučeno)
                    </button>
                    <button
                      type="button"
                      onClick={() => setReminderDaysBefore(3)}
                      className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                        reminderDaysBefore === 3
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      3 dny předem
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Zadáním e-mailu souhlasíte se zasláním jednorázové notifikace o této konkrétní kulturní akci obce Čehovice dle zásad GDPR.
                </p>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEventForReminder(null)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                  >
                    Zrušit
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Nastavit upozornění</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
