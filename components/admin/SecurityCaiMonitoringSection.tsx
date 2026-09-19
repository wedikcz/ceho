'use client';

import React, { useState } from 'react';
import {
  Shield,
  RefreshCw,
  CheckCircle2,
  Activity,
  Server,
  Zap,
} from 'lucide-react';
import { SecurityCaiTelemetry } from '@/lib/types';
import {
  runSecurityCaiDeepScan,
  runSecurityCaiHealthCheck,
  createSelfHealingSnapshot,
  recordSimulatedSecurityThreat,
  generate24hTelemetryTimeline,
} from '@/lib/store';
import SecurityTrendD3Chart from './SecurityTrendD3Chart';
import SecurityHealthCheckTable from './SecurityHealthCheckTable';

interface SecurityCaiMonitoringSectionProps {
  telemetry: SecurityCaiTelemetry;
  onRefresh: () => void;
}

export default function SecurityCaiMonitoringSection({
  telemetry,
  onRefresh,
}: SecurityCaiMonitoringSectionProps) {
  const [scanning, setScanning] = useState(false);
  const [healthChecking, setHealthChecking] = useState(false);
  const [snapshotting, setSnapshotting] = useState(false);
  const [simulatingThreat, setSimulatingThreat] = useState(false);

  const handleDeepScan = () => {
    setScanning(true);
    setTimeout(() => {
      runSecurityCaiDeepScan();
      setScanning(false);
      onRefresh();
    }, 1200);
  };

  const handleHealthCheck = () => {
    setHealthChecking(true);
    setTimeout(() => {
      runSecurityCaiHealthCheck();
      setHealthChecking(false);
      onRefresh();
    }, 800);
  };

  const handleSnapshot = () => {
    setSnapshotting(true);
    setTimeout(() => {
      createSelfHealingSnapshot('Manuální snapshot konfigurace před schvalováním vyhlášky');
      setSnapshotting(false);
      onRefresh();
    }, 1000);
  };

  const handleSimulateThreat = () => {
    setSimulatingThreat(true);
    const threats = [
      'WAF pokus o injekci (SQLi/XSS)',
      'Brute-force scan hesla administrátora',
      'Agresivní web scraper bot',
      'Pokus o přístup k neautorizovaným PII datům',
    ];
    const picked = threats[Math.floor(Math.random() * threats.length)];

    setTimeout(() => {
      recordSimulatedSecurityThreat(picked);
      setSimulatingThreat(false);
      onRefresh();
    }, 600);
  };

  const timelineData =
    telemetry.timeline24h && telemetry.timeline24h.length > 0
      ? telemetry.timeline24h
      : generate24hTelemetryTimeline();

  return (
    <div className="space-y-4 pt-2 text-xs">
      {/* Agent Status Callout */}
      <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm font-serif">
                Security-CAI Agent & Titan Core v3.8
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                GODMODE ACTIVE
              </span>
            </div>
            <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">
              {telemetry.securityAgentMessage}
            </p>
          </div>
        </div>

        {/* Action triggers */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={handleSimulateThreat}
            disabled={simulatingThreat}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-bold transition-all flex items-center gap-1.5"
            title="Simulovat zachycení hrozby a prověřit okamžitou reakci grafu D3.js"
          >
            <Zap className={`w-3.5 h-3.5 ${simulatingThreat ? 'animate-bounce text-amber-400' : 'text-amber-400'}`} />
            <span>{simulatingThreat ? 'Zachycuji...' : 'Testovat hrozbu'}</span>
          </button>

          <button
            onClick={handleDeepScan}
            disabled={scanning}
            className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-500/40 font-bold transition-all flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'Skenuji...' : 'Hloubkový scan'}</span>
          </button>

          <button
            id="btn-header-instant-health-check"
            onClick={handleHealthCheck}
            disabled={healthChecking}
            className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-500/40 font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Okamžitě otestovat ISDS datovou schránku, SSL certifikát a integritu databázového snapshotu"
          >
            <Activity className={`w-3.5 h-3.5 ${healthChecking ? 'animate-spin text-sky-400' : 'text-sky-400'}`} />
            <span>{healthChecking ? 'Testuji systémy...' : 'Spustit okamžitý Health-Check'}</span>
          </button>

          <button
            onClick={handleSnapshot}
            disabled={snapshotting}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 font-bold transition-all flex items-center gap-1.5"
          >
            <Server className="w-3.5 h-3.5" />
            <span>{snapshotting ? 'Zálohuji...' : 'Snapshot'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Zero-Trust Skóre</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
            {telemetry.zeroTrustScore}/100
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">NIS2 Soulad</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
            {telemetry.nis2ComplianceScore}%
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">WAF Pravidel</span>
          <div className="text-xl font-bold font-mono text-sky-400 mt-0.5">
            {telemetry.activeFirewallRules}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Blokováno hrozeb</span>
          <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
            {telemetry.blockedThreatsCount}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Odezva brány</span>
          <div className="text-xl font-bold font-mono text-slate-200 mt-0.5">
            {telemetry.gatewayLatencyMs} ms
          </div>
        </div>
      </div>

      {/* Table: Immediate Health-Check Results (ISDS, SSL, Database Snapshot) */}
      <SecurityHealthCheckTable
        report={telemetry.lastHealthCheckReport}
        onRunHealthCheck={handleHealthCheck}
        isRunning={healthChecking}
      />

      {/* D3.js Visualization: 24h Trend of Zero-Trust Score and Blocked Threats */}
      <SecurityTrendD3Chart
        timeline={timelineData}
        currentScore={telemetry.zeroTrustScore}
        blockedCount={telemetry.blockedThreatsCount}
      />

      {/* Recent Security CAI Findings */}
      <div className="space-y-2">
        <span className="font-bold text-white text-xs block">
          Poslední telemetrická hlášení Security-CAI agenta:
        </span>
        <div className="space-y-2">
          {telemetry.recentFindings.map((finding) => (
            <div
              key={finding.id}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <strong className="text-white text-xs">{finding.service}</strong>
                  <span className="text-[10px] font-mono text-slate-500">({finding.timestamp})</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{finding.message}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 shrink-0">
                OK
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

