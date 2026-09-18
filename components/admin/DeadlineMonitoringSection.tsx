'use client';

import React from 'react';
import { Clock, AlertTriangle, CheckCircle2, FileText, UserCheck, Calendar, ArrowRight } from 'lucide-react';
import { DeadlineMonitoringItem } from '@/lib/types';

interface DeadlineMonitoringSectionProps {
  items: DeadlineMonitoringItem[];
  onUpdateStatus?: (id: string, status: any) => void;
}

export default function DeadlineMonitoringSection({
  items,
  onUpdateStatus,
}: DeadlineMonitoringSectionProps) {
  const criticalCount = items.filter((i) => i.urgency === 'critical').length;
  const warningCount = items.filter((i) => i.urgency === 'warning').length;
  const normalCount = items.filter((i) => i.urgency === 'normal').length;
  const resolvedCount = items.filter((i) => i.urgency === 'resolved').length;

  return (
    <div className="space-y-4 pt-2 text-xs">
      {/* Statutory overview notice */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-300">
        <div>
          <strong className="text-white text-xs block">
            Zákonné lhůty dle správního řádu (č. 500/2004 Sb. § 71) a z. č. 106/1999 Sb.
          </strong>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Automatické hlídání lhůty 30 dnů od přijetí podání v podatelně obce Čehovice. Žádné podání nesmí překročit limit bez úředního přerušení.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            SLA: 100% včas
          </span>
        </div>
      </div>

      {/* Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-rose-300">Kritické (&lt; 5 dnů)</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">{criticalCount}</div>
        </div>

        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-amber-300">Výstraha (6–15 dnů)</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">{warningCount}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400">V normě (16–30 dnů)</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">{normalCount}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400">Vyřízeno</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">{resolvedCount}</div>
        </div>
      </div>

      {/* Deadline Items Table */}
      <div className="divide-y divide-slate-800">
        {items.map((item) => (
          <div key={item.id} className="py-3.5 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sky-400 font-bold">{item.trackingCode}</span>
                <span className="text-slate-500">•</span>
                <span className="text-white font-semibold">{item.subject}</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                    item.urgency === 'critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                      : item.urgency === 'warning'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : item.urgency === 'resolved'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-sky-500/20 text-sky-300'
                  }`}
                >
                  {item.status === 'vyrizeno'
                    ? 'Vyřízeno'
                    : item.daysRemaining > 0
                    ? `Zbývá ${item.daysRemaining} dnů`
                    : 'Lhůta vypršela'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-slate-400 text-[11px]">
              <div>
                Žadatel: <strong className="text-slate-200">{item.applicantName}</strong> • Přijato:{' '}
                {new Date(item.createdAt).toLocaleDateString('cs-CZ')} • Zákonný limit do:{' '}
                <strong className="text-amber-300 font-mono">
                  {new Date(item.deadlineDate).toLocaleDateString('cs-CZ')}
                </strong>
              </div>

              <div className="flex items-center gap-3">
                <span>
                  Referent: <strong className="text-white">{item.assignedOfficer}</strong>
                </span>
                <span className="text-slate-500 font-mono">Kanál: {item.deliveryMethod}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
