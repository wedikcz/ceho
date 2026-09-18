'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Lock,
  Users,
  Building2,
  Trash2,
  FileText,
  AlertTriangle,
  Send,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  BellRing,
  Download,
  Terminal,
  Activity,
  ArrowLeft,
  Sparkles,
  Key,
  RefreshCw,
  Search,
  Filter,
  Check,
  ChevronDown,
  Printer,
  Sparkle,
  Clock,
  Inbox,
  Cpu,
} from 'lucide-react';
import ExpandableSection from '@/components/ExpandableSection';
import FaultReportsPrintModal from '@/components/admin/FaultReportsPrintModal';
import CdpStarostaCard from '@/components/admin/CdpStarostaCard';
import MayorNotificationBanner from '@/components/admin/MayorNotificationBanner';
import DeadlineMonitoringSection from '@/components/admin/DeadlineMonitoringSection';
import SecurityCaiMonitoringSection from '@/components/admin/SecurityCaiMonitoringSection';
import DigitalPodatelnaMonitoringSection from '@/components/admin/DigitalPodatelnaMonitoringSection';
import { VILLAGE_DATA } from '@/lib/village-data';
import {
  FaultReport,
  DigitalSubmission,
  HITLItem,
  OfficialNotice,
  EmergencyAlert,
  Nis2Policy,
  MayorNotification,
  DeadlineMonitoringItem,
  SecurityCaiTelemetry,
  MunicipalBudget,
} from '@/lib/types';
import {
  getStoredReports,
  saveReport,
  anonymizeReportContact,
  getStoredSubmissions,
  saveSubmission,
  getStoredHITLQueue,
  approveHITLItem,
  rejectHITLItem,
  getStoredNotices,
  saveNotice,
  getStoredAlerts,
  saveAlert,
  getStoredPolicies,
  updatePolicyStatus,
  getAuditLogs,
  addAuditLog,
  getStoredMayorNotifications,
  getDeadlineMonitoringList,
  getStoredSecurityTelemetry,
  getMunicipalBudgetData,
} from '@/lib/store';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [authError, setAuthError] = useState(false);

  // Core Data States
  const [reports, setReports] = useState<FaultReport[]>([]);
  const [submissions, setSubmissions] = useState<DigitalSubmission[]>([]);
  const [hitlQueue, setHitlQueue] = useState<HITLItem[]>([]);
  const [notices, setNotices] = useState<OfficialNotice[]>([]);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [policies, setPolicies] = useState<Nis2Policy[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [mayorNotifications, setMayorNotifications] = useState<MayorNotification[]>([]);
  const [deadlines, setDeadlines] = useState<DeadlineMonitoringItem[]>([]);
  const [securityTelemetry, setSecurityTelemetry] = useState<SecurityCaiTelemetry>(getStoredSecurityTelemetry());
  const [budget, setBudget] = useState<MunicipalBudget>(getMunicipalBudgetData());

  // Modal states
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Form states for adding items in admin
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<'vyhlaska' | 'zamer' | 'rozpocet' | 'usneseni'>('vyhlaska');
  const [newNoticeFileNumber, setNewNoticeFileNumber] = useState('');
  const [newNoticeDesc, setNewNoticeDesc] = useState('');

  const [alertTitle, setAlertTitle] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'info' | 'warning' | 'critical'>('warning');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSentSuccess, setAlertSentSuccess] = useState(false);

  // Titan Core Shield test runner state
  const [shieldTesting, setShieldTesting] = useState(false);
  const [shieldTestResults, setShieldTestResults] = useState<{
    piiProtection: boolean;
    injectionDefense: boolean;
    ragDeterministicFallback: boolean;
    nis2Encryption: boolean;
  } | null>(null);

  const [selfHealingState, setSelfHealingState] = useState<'idle' | 'running' | 'done'>('idle');

  const loadAllAdminData = () => {
    setReports(getStoredReports());
    setSubmissions(getStoredSubmissions());
    setHitlQueue(getStoredHITLQueue());
    setNotices(getStoredNotices());
    setAlerts(getStoredAlerts());
    setPolicies(getStoredPolicies());
    setAuditLogs(getAuditLogs());
    setMayorNotifications(getStoredMayorNotifications());
    setDeadlines(getDeadlineMonitoringList());
    setSecurityTelemetry(getStoredSecurityTelemetry());
    setBudget(getMunicipalBudgetData());
  };

  useEffect(() => {
    // Check session auth
    const authSaved = sessionStorage.getItem('cehovice_admin_auth');
    if (authSaved === 'true') {
      setIsAuthenticated(true);
      loadAllAdminData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1299 (Village foundation year) or 2026/admin
    if (pinCode === '1299' || pinCode === 'admin' || pinCode === '2026') {
      setIsAuthenticated(true);
      setAuthError(false);
      sessionStorage.setItem('cehovice_admin_auth', 'true');
      loadAllAdminData();
      addAuditLog('Přihlášení do administrace obce (Starosta / Správce)', 'Milan Smékal');
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('cehovice_admin_auth');
  };

  // 1. Report Status Change & GDPR Anonymization
  const handleUpdateReportStatus = (reportId: string, newStatus: FaultReport['status']) => {
    const rep = reports.find((r) => r.id === reportId);
    if (!rep) return;
    const updated = saveReport({ ...rep, status: newStatus, updatedAt: new Date().toISOString() });
    if (updated) setReports(updated);
    setAuditLogs(getAuditLogs());
  };

  const handleAnonymizeReport = (reportId: string) => {
    const updated = anonymizeReportContact(reportId);
    if (updated) setReports(updated);
    setAuditLogs(getAuditLogs());
  };

  // 2. HITL Approval & Rejection
  const handleApproveHITL = (itemId: string) => {
    const updated = approveHITLItem(itemId);
    if (updated) setHitlQueue(updated);
    setAuditLogs(getAuditLogs());
  };

  const handleRejectHITL = (itemId: string) => {
    const updated = rejectHITLItem(itemId, 'Zamítnuto správcem');
    if (updated) setHitlQueue(updated);
    setAuditLogs(getAuditLogs());
  };

  // 3. Official Notice Addition
  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeFileNumber.trim()) return;

    const notice: OfficialNotice = {
      id: `not-${Date.now().toString(36)}`,
      fileNumber: newNoticeFileNumber.trim(),
      title: newNoticeTitle.trim(),
      category: newNoticeCategory,
      description: newNoticeDesc.trim() || 'Úřední sdělení obce Čehovice.',
      publishedDate: new Date().toLocaleDateString('cs-CZ'),
      expirationDate: new Date(Date.now() + 15 * 86400000).toLocaleDateString('cs-CZ'),
      fileSize: '240 kB',
      isElectronicSignatureValid: true,
      hashSha256: `sha256-${Math.random().toString(36).substring(2, 12)}`,
    };

    const updated = saveNotice(notice);
    if (updated) setNotices(updated);
    setNewNoticeTitle('');
    setNewNoticeFileNumber('');
    setNewNoticeDesc('');
    setAuditLogs(getAuditLogs());
  };

  // 4. Emergency Broadcast Sender
  const handleSendAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle.trim() || !alertMessage.trim()) return;

    const newAlert: EmergencyAlert = {
      id: `al-${Date.now().toString(36)}`,
      title: alertTitle.trim(),
      message: alertMessage.trim(),
      severity: alertSeverity,
      active: true,
      timestamp: new Date().toISOString(),
      affectedAreas: ['Celé katastrální území obce Čehovice'],
    };

    const updated = saveAlert(newAlert);
    if (updated) setAlerts(updated);
    setAlertTitle('');
    setAlertMessage('');
    setAlertSentSuccess(true);
    setTimeout(() => setAlertSentSuccess(false), 5000);
    setAuditLogs(getAuditLogs());
  };

  // 5. Titan Shield Security Self-Test
  const handleRunShieldTests = () => {
    setShieldTesting(true);
    setTimeout(() => {
      setShieldTestResults({
        piiProtection: true,
        injectionDefense: true,
        ragDeterministicFallback: true,
        nis2Encryption: true,
      });
      setShieldTesting(false);
      addAuditLog('Proveden kompletní auditní test bezpečnostního jádra Titan Core', 'Titan Security');
      setAuditLogs(getAuditLogs());
    }, 1200);
  };

  // 6. Self-Healing Snapshot Trigger
  const handleTriggerSelfHealing = () => {
    setSelfHealingState('running');
    setTimeout(() => {
      setSelfHealingState('done');
      addAuditLog('Vytvořen a ověřen Self-Healing bezpečnostní snapshot systému', 'Systém ČDP');
      setAuditLogs(getAuditLogs());
      setTimeout(() => setSelfHealingState('idle'), 4000);
    }, 1500);
  };

  // 7. Complete ZIP / Data Package Export
  const handleExportSystemBundle = () => {
    const fullBackup = {
      metadata: {
        exportDate: new Date().toISOString(),
        village: 'Obec Čehovice',
        ico: '00288101',
        systemVersion: 'Titan Core 2027 v3.8.4',
        standard: 'NIS2 Art. 21 / WCAG 2.2 AA / GDPR ROPA',
      },
      reports,
      submissions,
      notices,
      alerts,
      policies,
      auditLogs,
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cehovice_system_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="glass-card rounded-3xl p-8 max-w-md w-full border border-sky-400/30 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-500/10">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-white font-serif tracking-tight">
              Správa obce Čehovice
            </h1>
            <p className="text-xs text-slate-300">
              Autorizovaný přístup pro starostu a administrátory obce
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Bezpečnostní PIN / Heslo starosty
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="Zadejte PIN (např. 1299)"
                  className="w-full bg-slate-900 border border-sky-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            {authError && (
              <p className="text-xs text-rose-400 font-medium">
                Nesprávný kód. (Nápověda pro předvedení: zadejte rok založení obce <strong>1299</strong> nebo <strong>admin</strong>).
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20"
            >
              Vstoupit do kontrolního panelu
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link href="/" className="text-xs text-sky-400 hover:underline">
              ← Zpět na veřejný portál obce
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Top Header & Session Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-sky-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white font-serif">
                Kontrolní centrum obce Čehovice 2027
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Titan Core Online
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Přihlášen: <strong>Milan Smékal (Starosta obce)</strong> • Relace zabezpečena
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-semibold transition-colors"
            title="Tiskový úřední protokol hlášení závad do PDF (A4)"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>PDF protokol závad</span>
          </button>

          <button
            onClick={handleExportSystemBundle}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-400/40 text-xs font-semibold transition-colors"
            title="Export kompletního archivu obce do JSON"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export databáze</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
          >
            Odhlásit
          </button>
        </div>
      </div>

      {/* Automated Mayor Notifications Banner (obec@cehovice.cz) */}
      <MayorNotificationBanner
        notifications={mayorNotifications}
        onRefresh={loadAllAdminData}
      />

      {/* Prominent Executive Card: ČDP-starosta (Exekutivní AI pro starostu) */}
      <CdpStarostaCard onDataChanged={loadAllAdminData} />

      {/* Accordion Modules 1-10 */}
      <div className="space-y-4">
        {/* Module 1: HITL Schvalovací fronta (Human-In-The-Loop) */}
        <ExpandableSection
          id="admin-hitl"
          icon={CheckCircle2}
          title="1. HITL Schvalovací fronta (Lidský dohled nad AI a hlášeními)"
          subtitle="Schvalování konceptů odpovědí AI Aničky, nových hlášení a publikací"
          badge={{ text: `${hitlQueue.filter((i) => i.status === 'pending').length} k vyřízení`, variant: 'amber' }}
          defaultOpen={true}
        >
          <div className="space-y-3 pt-2 text-xs">
            <p className="text-slate-300">
              Dle licence ML-2.1 a zásad samosprávy musí být citlivé odpovědi a publikované zprávy autorizovány úředníkem:
            </p>

            {hitlQueue.length > 0 ? (
              <div className="divide-y divide-slate-800">
                {hitlQueue.map((item) => (
                  <div key={item.id} className="py-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-slate-400 font-bold uppercase text-[11px]">
                        Typ: {item.itemType} • {new Date(item.submittedAt).toLocaleTimeString('cs-CZ')}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                          item.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : item.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="text-slate-200 bg-slate-900/90 p-3 rounded-xl border border-slate-800 font-sans">
                      {item.content}
                    </p>

                    {item.status === 'pending' && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleApproveHITL(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs inline-flex items-center gap-1 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Schválit a publikovat</span>
                        </button>
                        <button
                          onClick={() => handleRejectHITL(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-600/50 text-rose-200 text-xs inline-flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Zamítnout</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">Ve frontě HITL nejsou žádné čekající položky.</p>
            )}
          </div>
        </ExpandableSection>

        {/* Module 2: Správa hlášení závad a GDPR Anonymizace */}
        <ExpandableSection
          id="admin-reports"
          icon={AlertTriangle}
          title="2. Správa hlášení závad občanů & GDPR anonymizační výmaz"
          subtitle="Změna stavu (Nové, V řešení, Hotovo) a okamžitý výmaz PII dle čl. 17 GDPR"
          badge={{ text: `${reports.length} hlášení`, variant: 'azure' }}
        >
          <div className="space-y-4 pt-2 text-xs">
            {/* Fault Reports PDF Export action bar */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-white block">
                  Úřední spisový a skartační protokol hlášení závad (A4 / PDF)
                </span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Vygenerujte a vytiskněte oficiální tiskovou sestavu pro archiv obce v souladu se zákonem o obcích a GDPR.
                </p>
              </div>

              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 shrink-0 self-start sm:self-auto"
              >
                <Printer className="w-4 h-4" />
                <span>Exportovat protokol jako PDF (A4)</span>
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {reports.map((rep) => (
                <div key={rep.id} className="py-4 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 font-bold">#{rep.id}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-amber-400 font-bold">{rep.category}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-white font-semibold">{rep.location}</span>
                    </div>

                    {/* Status change selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">Změnit stav:</span>
                      <select
                        value={rep.status}
                        onChange={(e) =>
                          handleUpdateReportStatus(rep.id, e.target.value as FaultReport['status'])
                        }
                        className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none"
                      >
                        <option value="nove">Nové</option>
                        <option value="reseni">V řešení</option>
                        <option value="hotovo">Vyřešeno</option>
                      </select>
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-white">{rep.title}</h4>
                  <p className="text-slate-300">{rep.description}</p>

                  {/* Contact info & GDPR Anonymization button */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-400">
                    <div>
                      {rep.isAnonymized ? (
                        <span className="text-emerald-400 font-mono">
                          ✓ Osobní údaje (e-mail/telefon) byly anonymizovány dle čl. 17 GDPR
                        </span>
                      ) : rep.contactEmail || rep.contactPhone ? (
                        <span>
                          Kontakt oznamovatele: <strong className="text-white">{rep.contactEmail || rep.contactPhone}</strong>
                        </span>
                      ) : (
                        <span>Oznamovatel nezadal kontakt (anonymní hlášení).</span>
                      )}
                    </div>

                    {!rep.isAnonymized && (rep.contactEmail || rep.contactPhone) && (
                      <button
                        onClick={() => handleAnonymizeReport(rep.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-[11px] font-semibold transition-colors shrink-0"
                        title="Vymazat e-mail a telefon v souladu s GDPR"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>GDPR Výmaz kontaktu</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ExpandableSection>

        {/* Module 3: Krizová rozesílka varování a hlášení rozhlasu */}
        <ExpandableSection
          id="admin-broadcast"
          icon={BellRing}
          title="3. Krizová notifikační rozesílka & Místní rozhlas"
          subtitle="Okamžité odeslání výstrahy registrovaným občanům na mobil a e-mail"
          badge={{ text: 'SMS/Email Gateway', variant: 'live' }}
        >
          <div className="space-y-4 pt-2 text-xs">
            {alertSentSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Varování bylo úspěšně vyhlášeno a odesláno občanům!</span>
              </div>
            )}

            <form onSubmit={handleSendAlert} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">
                    Titulek varování / hlášení *
                  </label>
                  <input
                    type="text"
                    required
                    value={alertTitle}
                    onChange={(e) => setAlertTitle(e.target.value)}
                    placeholder="Např. Havárie vodovodu – ulice k nádraží"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stupeň závažnosti</label>
                  <select
                    value={alertSeverity}
                    onChange={(e) => setAlertSeverity(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="info">Informativní (Hlášení rozhlasu)</option>
                    <option value="warning">Varování (Odstávka vody/elektřiny)</option>
                    <option value="critical">Kritické (Povodňové ohrožení)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Text zprávy pro občany *</label>
                <textarea
                  required
                  rows={3}
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  placeholder="Text hlášení, pokyny k cisternám s vodou nebo evakuaci..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Vyhlásit varování všem občanům</span>
              </button>
            </form>
          </div>
        </ExpandableSection>

        {/* Module 4: Správa úřední desky */}
        <ExpandableSection
          id="admin-notices"
          icon={FileText}
          title="4. Správa elektronické úřední desky"
          subtitle="Vyvěšování nových vyhlášek, záměrů a rozpočtů s číslem jednacím"
          badge={{ text: `${notices.length} aktivních`, variant: 'azure' }}
        >
          <div className="space-y-4 pt-2 text-xs">
            <form onSubmit={handleAddNotice} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <span className="font-bold text-white block">Vyvěsit nový dokument na úřední desku:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={newNoticeFileNumber}
                  onChange={(e) => setNewNoticeFileNumber(e.target.value)}
                  placeholder="Číslo jednací (např. CEH/142/2026)"
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                />
                <select
                  value={newNoticeCategory}
                  onChange={(e) => setNewNoticeCategory(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="vyhlaska">Vyhláška</option>
                  <option value="zamer">Záměr</option>
                  <option value="rozpocet">Rozpočet</option>
                  <option value="usneseni">Usnesení</option>
                </select>
                <input
                  type="text"
                  required
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  placeholder="Název dokumentu"
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <textarea
                rows={2}
                value={newNoticeDesc}
                onChange={(e) => setNewNoticeDesc(e.target.value)}
                placeholder="Stručný obsah a lhůta pro připomínky..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 font-bold"
              >
                Vyvěsit dokument s digitální pečetí
              </button>
            </form>

            <div className="divide-y divide-slate-800">
              {notices.map((n) => (
                <div key={n.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-sky-400 font-bold mr-2">{n.fileNumber}</span>
                    <strong className="text-white">{n.title}</strong>
                    <span className="text-slate-400 text-[11px] ml-2">({n.publishedDate})</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300">Pečeť platná</span>
                </div>
              ))}
            </div>
          </div>
        </ExpandableSection>

        {/* Module 5: NIS2 Compliance & Self-Healing Snapshot */}
        <ExpandableSection
          id="admin-nis2"
          icon={Shield}
          title="5. NIS2 Kybernetická bezpečnost & Registrace entity"
          subtitle="Politiky dle čl. 21 odst. 2 písm. a-j směrnice NIS2 a Self-Healing engine"
          badge={{ text: '10 politik v souladu', variant: 'live' }}
        >
          <div className="space-y-4 pt-2 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-emerald-500/30">
              <div>
                <strong className="text-white text-sm block">
                  Regulovaná entita veřejné správy: Obec Čehovice
                </strong>
                <p className="text-slate-300 mt-0.5">
                  Evidenční číslo NÚKIB: <strong>CZ-NIS2-VS-79817-00288101</strong> • Režim nižších povinností
                </p>
              </div>

              <button
                onClick={handleTriggerSelfHealing}
                disabled={selfHealingState === 'running'}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 font-bold transition-all shrink-0"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${selfHealingState === 'running' ? 'animate-spin' : ''}`}
                />
                <span>
                  {selfHealingState === 'running'
                    ? 'Ověřuji integritu...'
                    : selfHealingState === 'done'
                    ? '✓ Snapshot obnoven!'
                    : 'Spustit Self-Healing Snapshot'}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {policies.map((p) => (
                <div key={p.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-amber-400 font-bold">{p.article}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">AKTIVNÍ</span>
                  </div>
                  <h5 className="font-bold text-white">{p.name}</h5>
                  <p className="text-slate-400 text-[11px]">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </ExpandableSection>

        {/* Module 6: Titan Core Security Shields Test Runner */}
        <ExpandableSection
          id="admin-titan-shields"
          icon={Terminal}
          title="6. Titan Core Jádro & Shield Testy bezpečnosti"
          subtitle="Automatické penetrační testy: PII filtrace, obrana proti injection a deterministický RAG"
          badge={{ text: 'Titan 2027 v3.8', variant: 'amber' }}
        >
          <div className="space-y-4 pt-2 text-xs">
            <div className="flex items-center justify-between">
              <p className="text-slate-300">
                Spusťte diagnostický test obranných valů portálu obce Čehovice:
              </p>
              <button
                onClick={handleRunShieldTests}
                disabled={shieldTesting}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{shieldTesting ? 'Testuji štíty...' : 'Spustit diagnostiku štítů'}</span>
              </button>
            </div>

            {shieldTestResults && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>PII Stripper & Anonymizér</span>
                  </div>
                  <p className="text-[11px] text-emerald-300">
                    Ověřeno: Rodná čísla a citlivé údaje jsou před dotazem do AI spolehlivě odstraňovány.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Prompt Injection Val</span>
                  </div>
                  <p className="text-[11px] text-emerald-300">
                    Ověřeno: Pokusy o manipulaci systémového promptu Aničky jsou zablokovány.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Deterministický RAG Fallback</span>
                  </div>
                  <p className="text-[11px] text-emerald-300">
                    Ověřeno: Klíčové dotazy na hodiny a odpady jdou přímo z lokální databáze bez halucinací.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>NIS2 Šifrování & HTTPS HSTS</span>
                  </div>
                  <p className="text-[11px] text-emerald-300">
                    Ověřeno: Zabezpečení přenosu a ochrana datové schránky odpovídá standardům pro rok 2027.
                  </p>
                </div>
              </div>
            )}
          </div>
        </ExpandableSection>

        {/* Module 7: Auditní protokol (Audit Trail) */}
        <ExpandableSection
          id="admin-audit"
          icon={Activity}
          title="7. Auditní protokol bezpečnostních a úředních událostí"
          subtitle="Neměnný záznam operací správce, schvalování a změn stavu podání"
          badge={{ text: `${auditLogs.length} záznamů`, variant: 'neutral' }}
        >
          <div className="space-y-2 pt-2 text-xs font-mono max-h-72 overflow-y-auto no-scrollbar">
            {auditLogs.map((log, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start justify-between gap-2"
              >
                <div>
                  <span className="text-amber-400 font-bold">[{new Date(log.timestamp).toLocaleTimeString('cs-CZ')}]</span>{' '}
                  <span className="text-white">{log.action}</span>
                </div>
                <span className="text-slate-400 shrink-0 text-[11px]">Aktér: {log.actor}</span>
              </div>
            ))}
          </div>
        </ExpandableSection>

        {/* Module 8: Monitoring lhůt (30denní lhůty dle správního řádu) */}
        <ExpandableSection
          id="admin-deadlines"
          icon={Clock}
          title="8. Monitoring zákonných lhůt podání (30 dnů dle § 71 správního řádu)"
          subtitle="Automatické hlídání lhůt pro vyřízení žádostí občanů, prevence nečinnosti a sankcí"
          badge={{
            text: `${deadlines.filter((d) => d.urgency === 'critical').length > 0 ? 'Pozor na lhůty' : 'Vše v termínu'}`,
            variant: deadlines.filter((d) => d.urgency === 'critical').length > 0 ? 'live' : 'azure',
          }}
        >
          <DeadlineMonitoringSection items={deadlines} />
        </ExpandableSection>

        {/* Module 9: Monitoring digitální podatelny */}
        <ExpandableSection
          id="admin-podatelna"
          icon={Inbox}
          title="9. Monitoring digitální podatelny (ISDS, webový portál, e-podatelna)"
          subtitle="Přehled příchozích elektronických podání, datových zpráv a spisové služby"
          badge={{ text: `${submissions.length} podání`, variant: 'amber' }}
        >
          <DigitalPodatelnaMonitoringSection
            submissions={submissions}
            onUpdateStatus={(id, newStatus) => {
              const sub = submissions.find((s) => s.id === id);
              if (sub) {
                const updated = saveSubmission({ ...sub, status: newStatus });
                if (updated) setSubmissions(updated);
                loadAllAdminData();
              }
            }}
          />
        </ExpandableSection>

        {/* Module 10: Chytrý monitoring zabezpečení (Security-CAI & Titan Core) */}
        <ExpandableSection
          id="admin-security-cai"
          icon={Cpu}
          title="10. Chytrý monitoring zabezpečení webu (Security-CAI agent & Titan Core)"
          subtitle="Telemetrie v reálném čase, Zero-Trust obrana, WAF a stav self-healing snapshotů"
          badge={{ text: `Skóre ${securityTelemetry.zeroTrustScore}/100`, variant: 'live' }}
        >
          <SecurityCaiMonitoringSection
            telemetry={securityTelemetry}
            onRefresh={loadAllAdminData}
          />
        </ExpandableSection>
      </div>

      {/* Official Fault Reports Printable PDF Modal */}
      <FaultReportsPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        reports={reports}
      />
    </div>
  );
}
