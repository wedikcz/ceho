'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Flame, Fish, Sprout, ArrowLeft, Mail, Award, CheckCircle2 } from 'lucide-react';
import { VILLAGE_DATA } from '@/lib/village-data';

export default function SpolkyPage() {
  const { clubs } = VILLAGE_DATA;

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
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>Komunitní život • Spolky a sdružení obce</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
          Spolky a organizace v Čehovicích
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Spolkový život v naší obci má bohatou tradici sahající až do 19. století. Seznamte se s činností dobrovolných hasičů, moravských rybářů a zahrádkářů pečujících o obecní moštárnu.
        </p>
      </div>

      <div className="space-y-6">
        {clubs.map((club) => {
          let Icon = Users;
          let colorClass = 'text-amber-400';
          if (club.id === 'sdh') {
            Icon = Flame;
            colorClass = 'text-rose-400';
          } else if (club.id === 'rybari') {
            Icon = Fish;
            colorClass = 'text-sky-400';
          } else if (club.id === 'zahradkari') {
            Icon = Sprout;
            colorClass = 'text-emerald-400';
          }

          return (
            <div
              key={club.id}
              className="glass-card rounded-2xl p-6 sm:p-7 border border-sky-400/20 space-y-4 hover:border-sky-400/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                    <Icon className={`w-6 h-6 ${colorClass}`} />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white font-serif">{club.name}</h2>
                    <span className="text-xs text-slate-400 font-mono">
                      Založeno: {club.foundedYear} • {club.membersCount} aktivních členů
                    </span>
                  </div>
                </div>

                <div className="text-xs sm:text-right font-mono text-slate-300">
                  <span className="text-slate-400 block text-[11px] font-sans">Vedení spolku:</span>
                  <strong className="text-white">{club.leader}</strong>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{club.description}</p>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
                  Hlavní činnosti a akce:
                </span>
                <div className="flex flex-wrap gap-2">
                  {club.activities.map((act, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-xs text-slate-200"
                    >
                      {act}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-mono text-sky-300">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {club.contact}
                </span>
                <span className="text-slate-500">Čehovice u Prostějova</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
