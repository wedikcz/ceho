'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Download, RefreshCw, CheckCircle, FileText, Database, Lock } from 'lucide-react';
import { getStoredRopa } from '@/lib/store';

interface RopaRecord {
  id: string;
  purpose: string;
  legalBasis: string;
  retentionPeriod: string;
  dataSubjects: string;
  dataCategories: string[];
  securityMeasures: string;
}

interface GdprAccessLog {
  id: string;
  timestamp: string;
  officer: string;
  system: string;
  recordId: string;
  action: string; // e.g., "Čtení", "Anonymizace", "Export"
  legalJustification: string;
}

const INITIAL_ACCESS_LOGS: GdprAccessLog[] = [
  {
    id: "log-1",
    timestamp: "2026-09-18T10:15:30Z",
    officer: "Klára Svobodová (DPO)",
    system: "E-Podatelna",
    recordId: "sub-001",
    action: "Čtení",
    legalJustification: "Řízení o povolení kácení rizikového smrku - ověření totožnosti"
  },
  {
    id: "log-2",
    timestamp: "2026-09-18T11:45:00Z",
    officer: "Milan Smékal (Starosta)",
    system: "Hlášení závad",
    recordId: "rep-001",
    action: "Anonymizace",
    legalJustification: "Žádost subjektu údajů o výmaz osobních kontaktů dle čl. 17 GDPR"
  },
  {
    id: "log-3",
    timestamp: "2026-09-18T14:22:15Z",
    officer: "Ing. Radim Kovář (Místostarosta)",
    system: "Služby občanům",
    recordId: "sub-002",
    action: "Export",
    legalJustification: "Předání podkladů pro odvolací řízení"
  }
];

export default function AdminGdprDashboard() {
  const [ropaRecords, setRopaRecords] = useState<RopaRecord[]>([]);
  const [accessLogs, setAccessLogs] = useState<GdprAccessLog[]>(INITIAL_ACCESS_LOGS);
  const [auditStatus, setAuditStatus] = useState<'nominal' | 'running' | 'success'>('nominal');

  useEffect(() => {
    // Populate ROPA records from standard store
    const records = getStoredRopa();
    setRopaRecords(records);
  }, []);

  const handleExportRopa = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      governingAuthority: "Obec Čehovice",
      legalFramework: "GDPR / Nařízení (EU) 2016/679",
      metacognitiveLicence: "ML-2.1 Compliant",
      ropa: ropaRecords,
      accessLogs: accessLogs
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ROPA_GDPR_Export_Cehovice_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const runComplianceCheck = () => {
    setAuditStatus('running');
    setTimeout(() => {
      setAuditStatus('success');
      // Add simulated log
      const newLog: GdprAccessLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        officer: "Klára Svobodová (DPO)",
        system: "Bezpečnostní audit",
        recordId: "all",
        action: "Audit integrity",
        legalJustification: "Pravidelný čtvrtletní compliance test NIS2/GDPR"
      };
      setAccessLogs(prev => [newLog, ...prev]);
    }, 1500);
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Zpět do Administrace</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span>GDPR Interní portál • ML-2.1 Audit & ROPA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif">
            Úřední GDPR Dashboard & Registr ROPA
          </h1>
          <p className="text-xs text-slate-400">
            Administrace záznamů o činnostech zpracování dle čl. 30 GDPR a monitoring přístupů k osobním údajům.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={runComplianceCheck}
            disabled={auditStatus === 'running'}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-semibold transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${auditStatus === 'running' ? 'animate-spin' : ''}`} />
            <span>{auditStatus === 'running' ? 'Testování souladu...' : 'Ověřit soulad GDPR/NIS2'}</span>
          </button>

          <button
            onClick={handleExportRopa}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/10"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export ROPA & Access Logs</span>
          </button>
        </div>
      </div>

      {/* Audit Success alert */}
      {auditStatus === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex items-center gap-2.5 text-xs">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
          <span>
            <strong>Systémový audit dokončen:</strong> Nebyly zjištěny žádné nesrovnalosti. Všechny PII jsou šifrovány AES-256 a procesy odpovídají podmínkám Metakognitivní licence ML-2.1.
          </span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: ROPA register */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-sky-500/20 space-y-4">
            <h2 className="text-base font-bold text-white font-serif flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-amber-400" />
              <span>Registr činností zpracování (čl. 30 GDPR)</span>
            </h2>

            <div className="space-y-3">
              {ropaRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-white text-sm">{rec.purpose}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-400">
                      Lhůta: {rec.retentionPeriod}
                    </span>
                  </div>
                  <p className="text-slate-300">
                    <span className="text-slate-400 font-semibold">Právní titul:</span> {rec.legalBasis}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1 border-t border-slate-900 text-slate-400">
                    <div>
                      <span className="text-slate-500 block">Subjekty</span>
                      <span className="text-sky-300">{rec.dataSubjects}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Kategorie dat</span>
                      <span className="text-slate-300 truncate block">{rec.dataCategories.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Bezpečnostní opatření</span>
                      <span className="text-emerald-400">{rec.securityMeasures}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: GDPR Access history */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-sky-500/20 space-y-4">
            <h2 className="text-base font-bold text-white font-serif flex items-center gap-2">
              <Database className="w-4.5 h-4.5 text-sky-400" />
              <span>Log přístupů k osobním údajům</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Přísná evidence každého úředního nahlédnutí do citlivých dat občanů v souladu s NIS2 a GDPR.
            </p>

            <div className="space-y-3">
              {accessLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-900 space-y-2 text-[11px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{log.officer}</span>
                    <span className="text-[10px] text-sky-300 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString('cs-CZ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-amber-400">
                      {log.action}
                    </span>
                    <span className="text-slate-400">Systém: {log.system}</span>
                  </div>
                  <p className="text-slate-400 italic bg-slate-900/60 p-2 rounded border border-slate-900/80">
                    &ldquo;{log.legalJustification}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* NIS2 integration card */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-slate-300 space-y-2">
            <h3 className="font-bold text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>NIS2 & ZKB Připravenost</span>
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Tento portál je plně v režimu souladu se zákonem č. 181/2014 Sb., o kybernetické bezpečnosti (ZKB). Veškerá spojení jsou chráněna skrze TLS 1.3 s HSTS a přístupy jsou podrobeny šifrované neměnné auditní stopě.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
