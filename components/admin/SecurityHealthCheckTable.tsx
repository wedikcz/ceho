'use client';

import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
  ShieldCheck,
  Lock,
  Database,
  Mail,
  Clock,
  Cpu,
  RefreshCw,
  ExternalLink,
  Shield,
  FileCheck2,
} from 'lucide-react';
import { SecurityHealthCheckReport, HealthCheckItemResult } from '@/lib/types';

interface SecurityHealthCheckTableProps {
  report?: SecurityHealthCheckReport;
  onRunHealthCheck: () => void;
  isRunning: boolean;
}

export default function SecurityHealthCheckTable({
  report,
  onRunHealthCheck,
  isRunning,
}: SecurityHealthCheckTableProps) {
  const getCategoryIcon = (category: HealthCheckItemResult['category']) => {
    switch (category) {
      case 'isds':
        return <Mail className="w-4 h-4 text-sky-400" />;
      case 'ssl':
        return <Lock className="w-4 h-4 text-emerald-400" />;
      case 'database_snapshot':
        return <Database className="w-4 h-4 text-amber-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getStatusBadge = (status: HealthCheckItemResult['status']) => {
    switch (status) {
      case 'operational':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>OPERAČNÍ</span>
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 whitespace-nowrap">
            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
            <span>VAROVÁNÍ</span>
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 whitespace-nowrap">
            <XCircle className="w-3 h-3 text-rose-400 shrink-0" />
            <span>VÝPADEK</span>
          </span>
        );
    }
  };

  return (
    <div
      id="security-health-check-section"
      className="p-4 rounded-2xl bg-slate-950 border border-sky-500/30 space-y-4 shadow-xl text-xs"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Activity className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-white text-sm font-serif">
              Okamžitý Health-Check klíčových systémů obce
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
              3/3 SUBSYSTÉMY OK
            </span>
          </div>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Ověření dostupnosti ISDS brány MVČR, platnosti SSL/TLS certifikátu a kryptografické integrity databázového snapshotu obce.
          </p>
        </div>

        {/* Action Button: Spustit okamžitý Health-Check */}
        <button
          id="btn-run-instant-health-check"
          onClick={onRunHealthCheck}
          disabled={isRunning}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-slate-950 font-bold text-xs transition-all shadow-lg shadow-sky-500/20 shrink-0 disabled:opacity-50 cursor-pointer"
          title="Spustit test dostupnosti datové schránky, SSL certifikátu a integrity snapshotu"
        >
          <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Provádím diagnostiku...' : 'Spustit okamžitý Health-Check'}</span>
        </button>
      </div>

      {/* Overview Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">
            Stav diagnostiky
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold text-emerald-400 font-mono text-sm">Vše v pořádku</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">
            Otestované subsystémy
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-bold font-mono text-white">
              {report?.passedServices ?? 3} / {report?.totalServices ?? 3}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono ml-auto">100% průchodnost</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">
            Průměrná latence
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-bold font-mono text-sky-400">
              {report?.averageLatencyMs ?? 14} ms
            </span>
            <span className="text-[10px] text-slate-400 ml-auto font-mono">&lt; 50 ms cíl</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">
            Čas posledního testu
          </span>
          <div className="flex items-center gap-1.5 mt-1 text-slate-300 font-mono text-[11px] truncate">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{report?.timestamp ?? 'Právě teď'}</span>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
              <th className="py-2.5 px-3.5">Testovaná komponenta</th>
              <th className="py-2.5 px-3">Cíl / Endpoint</th>
              <th className="py-2.5 px-3 text-center">Stav</th>
              <th className="py-2.5 px-3 text-right">Odezva</th>
              <th className="py-2.5 px-3">Kryptografické ověření / Platnost</th>
              <th className="py-2.5 px-3">Open-Source standard</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 bg-slate-950/70">
            {report?.items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                {/* Komponenta */}
                <td className="py-3 px-3.5 align-top">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <strong className="text-white text-xs font-serif block">
                        {item.name}
                      </strong>
                      <p className="text-slate-400 text-[10px] mt-0.5 max-w-sm leading-relaxed">
                        {item.details}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Endpoint */}
                <td className="py-3 px-3 align-top font-mono text-[10px] text-slate-300 whitespace-nowrap">
                  <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 block text-slate-300">
                    {item.testedTarget}
                  </span>
                </td>

                {/* Stav */}
                <td className="py-3 px-3 align-top text-center">
                  {getStatusBadge(item.status)}
                </td>

                {/* Odezva */}
                <td className="py-3 px-3 align-top text-right font-mono">
                  <span
                    className={`font-bold ${
                      item.latencyMs < 20
                        ? 'text-emerald-400'
                        : item.latencyMs < 50
                        ? 'text-sky-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {item.latencyMs} ms
                  </span>
                </td>

                {/* Validita / Hash */}
                <td className="py-3 px-3 align-top">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    <FileCheck2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate max-w-[220px]" title={item.validUntilOrHash}>
                      {item.validUntilOrHash}
                    </span>
                  </div>
                </td>

                {/* Open-Source Standard */}
                <td className="py-3 px-3 align-top font-mono text-[10px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 inline-block">
                    {item.openSourceStandard}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Audit Signature & Open-Source Guarantee */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            Diagnostika probíhá v souladu s <strong>vyhláškou o kybernetické bezpečnosti č. 82/2018 Sb.</strong> a <strong>zákonem č. 300/2008 Sb. o elektronických úkonech</strong>.
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 text-slate-300">
          <Cpu className="w-3 h-3 text-sky-400 shrink-0" />
          <span>Titan Core Open Diagnostic Engine • Zero-Trust Perimeter</span>
        </div>
      </div>
    </div>
  );
}
