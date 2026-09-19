'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { DigitalSubmission } from '@/lib/types';

interface DigitalPodatelnaMonitoringSectionProps {
  submissions: DigitalSubmission[];
  onUpdateStatus: (id: string, status: DigitalSubmission['status']) => void;
}

export default function DigitalPodatelnaMonitoringSection({
  submissions,
  onUpdateStatus,
}: DigitalPodatelnaMonitoringSectionProps) {
  const isdsCount = submissions.filter((s) => s.deliveryMethod === 'datova_schranka').length;
  const webCount = submissions.filter((s) => s.deliveryMethod === 'email').length;
  const inPersonCount = submissions.filter((s) => s.deliveryMethod === 'osobne').length;

  return (
    <div className="space-y-4 pt-2 text-xs">
      {/* Channels overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-sky-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs">ISDS Datová schránka</span>
            <span className="font-mono text-[10px] text-sky-400 font-bold">3vgb2y3</span>
          </div>
          <p className="text-[11px] text-slate-400">Přímé doručení z národního systému ISDS</p>
          <div className="text-lg font-bold font-mono text-sky-300 pt-1">{isdsCount} podání</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs">Webový portál Čehovic</span>
            <span className="font-mono text-[10px] text-emerald-400 font-bold">SSL 2027</span>
          </div>
          <p className="text-[11px] text-slate-400">Podání přes formulář podatelny s trasovacím kódem</p>
          <div className="text-lg font-bold font-mono text-emerald-300 pt-1">{webCount} podání</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs">Elektronická podatelna</span>
            <span className="font-mono text-[10px] text-slate-400">podatelna@cehovice.cz</span>
          </div>
          <p className="text-[11px] text-slate-400">Ověření kvalifikovaného el. podpisu (eIDAS)</p>
          <div className="text-lg font-bold font-mono text-slate-200 pt-1">
            {inPersonCount} listinných / e-mail
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="divide-y divide-slate-800">
        {submissions.map((sub) => (
          <div key={sub.id} className="py-3.5 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-amber-400 font-bold">{sub.trackingCode}</span>
                <span className="text-slate-500">•</span>
                <span className="text-white font-semibold">{sub.subject}</span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sub.status}
                  onChange={(e) => onUpdateStatus(sub.id, e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs"
                >
                  <option value="prijato">Přijato</option>
                  <option value="ve_zpracovani">Ve zpracování</option>
                  <option value="vyrizeno">Vyřízeno</option>
                  <option value="zamitnuto">Zamítnuto</option>
                </select>
              </div>
            </div>

            <p className="text-slate-300 text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
              {sub.content}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 text-slate-400 text-[11px]">
              <div>
                Žadatel: <strong className="text-white">{sub.applicantName}</strong> ({sub.applicantEmail}) • Lhůta do:{' '}
                <strong className="text-sky-300 font-mono">{sub.deadlineDate}</strong>
              </div>
              <div className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Digitální časové razítko ověřeno</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
