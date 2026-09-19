'use client';

import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { VILLAGE_DATA } from '@/lib/village-data';

export default function TownClock() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Zjišťuji stav úřadu...');
  const [nextOpenText, setNextOpenText] = useState('');

  useEffect(() => {
    // Initial mount and dynamic tick every second
    const updateTimeAndStatus = () => {
      const now = new Date();
      setCurrentTime(now);

      const day = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const timeInMinutes = currentHour * 60 + currentMinute;

      const openMinutes = 16 * 60; // 16:00
      const closeMinutes = 18 * 60; // 18:00

      // Monday (1) or Wednesday (3) between 16:00 and 18:00
      const isOfficeDay = day === 1 || day === 3;
      const isWithinHours = timeInMinutes >= openMinutes && timeInMinutes < closeMinutes;

      if (isOfficeDay && isWithinHours) {
        setIsOpen(true);
        const minutesLeft = closeMinutes - timeInMinutes;
        setStatusMessage(`Úřad je právě otevřen (zbývá ${minutesLeft} min)`);
        setNextOpenText('Dnes do 18:00');
      } else {
        setIsOpen(false);
        setStatusMessage('Úřad je nyní zavřen pro veřejnost');

        // Calculate next opening
        if (day === 1 && timeInMinutes < openMinutes) {
          setNextOpenText('Dnes v 16:00 – 18:00');
        } else if (day === 1 || day === 2) {
          setNextOpenText('Ve středu 16:00 – 18:00');
        } else if (day === 3 && timeInMinutes < openMinutes) {
          setNextOpenText('Dnes v 16:00 – 18:00');
        } else {
          setNextOpenText('V pondělí 16:00 – 18:00');
        }
      }
    };

    updateTimeAndStatus();
    const interval = setInterval(updateTimeAndStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = currentTime
    ? currentTime.toLocaleDateString('cs-CZ', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const formattedTime = currentTime
    ? currentTime.toLocaleTimeString('cs-CZ', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '--:--:--';

  return (
    <div
      id="town-clock-widget"
      className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden border border-sky-400/20 text-slate-100"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Time and date column */}
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
              isOpen
                ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-400'
                : 'bg-slate-800/80 border-slate-700/60 text-slate-300'
            }`}
          >
            <Clock className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight font-mono text-white">
                {formattedTime}
              </span>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">SEČ</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 capitalize">{formattedDate}</p>
          </div>
        </div>

        {/* Status badge and next opening */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              isOpen
                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-900/50'
                : 'bg-amber-950/50 text-amber-300 border-amber-500/40'
            }`}
            role="status"
            aria-live="polite"
          >
            <span
              className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400 animate-live-dot' : 'bg-amber-400'}`}
              aria-hidden="true"
            />
            <span>{statusMessage}</span>
          </div>

          <div className="text-xs text-slate-300">
            <span className="text-slate-400">Příští úřední hodiny:</span>{' '}
            <strong className="text-white font-medium">{nextOpenText}</strong>
          </div>

          <Link
            href="/urad"
            id="town-clock-urad-link"
            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300 underline underline-offset-4 ml-auto sm:ml-0"
          >
            Všechny hodiny <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
