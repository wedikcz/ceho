'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Send,
  Search,
  FileText,
  CheckCircle2,
  ArrowLeft,
  Key,
  AlertCircle,
} from 'lucide-react';
import { DigitalSubmission, SubmissionType } from '@/lib/types';
import { getStoredSubmissions, saveSubmission } from '@/lib/store';

export default function PodatelnaPage() {
  const [submissions, setSubmissions] = useState<DigitalSubmission[]>([]);
  const [trackingQuery, setTrackingQuery] = useState('');
  const [trackedItem, setTrackedItem] = useState<DigitalSubmission | null>(null);
  const [searchNotFound, setSearchNotFound] = useState(false);

  // Form State
  const [type, setType] = useState<SubmissionType>('obecne_podani');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'datova_schranka' | 'email' | 'osobne'>('email');
  const [dataBoxId, setDataBoxId] = useState('');
  const [createdSubmission, setCreatedSubmission] = useState<DigitalSubmission | null>(null);

  useEffect(() => {
    setSubmissions(getStoredSubmissions());
  }, []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingQuery.trim()) return;
    const q = trackingQuery.trim().toUpperCase();
    const found = submissions.find((s) => s.trackingCode.toUpperCase() === q);
    if (found) {
      setTrackedItem(found);
      setSearchNotFound(false);
    } else {
      setTrackedItem(null);
      setSearchNotFound(true);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim() || !applicantName.trim()) return;

    // Generate unique code CEH-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `CEH-2026-${randomSuffix}`;

    const now = new Date();
    const deadline = new Date();
    deadline.setDate(now.getDate() + 30); // 30-day statutory deadline

    const newSub: DigitalSubmission = {
      id: `sub-${Date.now().toString(36)}`,
      trackingCode,
      type,
      subject: subject.trim(),
      content: content.trim(),
      applicantName: applicantName.trim(),
      applicantEmail: applicantEmail.trim(),
      applicantPhone: applicantPhone.trim() || undefined,
      deliveryMethod,
      dataBoxId: deliveryMethod === 'datova_schranka' ? dataBoxId.trim() : undefined,
      status: 'prijato',
      createdAt: now.toISOString(),
      deadlineDate: deadline.toISOString(),
      assignedOfficer: 'Podatelna obecního úřadu Čehovice',
      auditTrail: [
        {
          timestamp: `${now.toLocaleDateString('cs-CZ')} ${now.toLocaleTimeString('cs-CZ', {
            hour: '2-digit',
            minute: '2-digit',
          })}`,
          action: 'Elektronické podání úspěšně přijato a zaevidováno',
          actor: 'E-Podatelna systém',
        },
      ],
    };

    const updated = saveSubmission(newSub);
    if (updated) setSubmissions(updated);
    setCreatedSubmission(newSub);

    // Reset Form
    setSubject('');
    setContent('');
    setApplicantName('');
    setApplicantEmail('');
    setApplicantPhone('');
    setDataBoxId('');
  };

  const getStatusLabel = (status: DigitalSubmission['status']) => {
    switch (status) {
      case 'prijato':
        return <span className="text-amber-400 font-bold">Přijato v evidenci</span>;
      case 've_zpracovani':
        return <span className="text-sky-400 font-bold">Ve zpracování úředníkem</span>;
      case 'vyrizeno':
        return <span className="text-emerald-400 font-bold">Vyřízeno a odesláno</span>;
      case 'zamitnuto':
        return <span className="text-rose-400 font-bold">Zamítnuto</span>;
    }
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
          <Send className="w-3.5 h-3.5 text-amber-400" />
          <span>Digitální e-podatelna • Zákon č. 500/2004 Sb.</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
          Elektronická podatelna obce Čehovice
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Podejte oficiální žádost, dotaz podle zákona o svobodném přístupu k informacím (106/1999 Sb.) nebo podnět přímo z pohodlí domova se zákonnou 30denní lhůtou pro vyřízení.
        </p>
      </div>

      {/* Tracking Card: Sledování stavu podání */}
      <div className="glass-card rounded-2xl p-6 border border-sky-400/30 space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white font-serif">
            Sledování stavu dříve podané žádosti
          </h2>
        </div>
        <p className="text-xs text-slate-300">
          Zadejte trasovací kód podání, který jste obdrželi při odeslání (např.{' '}
          <strong className="text-sky-300 font-mono">CEH-2026-7812</strong>):
        </p>

        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={trackingQuery}
              onChange={(e) => setTrackingQuery(e.target.value)}
              placeholder="Zadejte kód např. CEH-2026-7812"
              className="w-full bg-slate-900 border border-sky-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 font-mono uppercase focus:outline-none focus:border-amber-400"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 text-xs font-bold transition-colors shrink-0"
          >
            Vyhledat stav podání
          </button>
        </form>

        {searchNotFound && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Podání s kódem „{trackingQuery}“ nebylo nalezeno. Zkontrolujte prosím správnost formátu.</span>
          </div>
        )}

        {/* Tracked Submission Result Card */}
        {trackedItem && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-sky-400/40 space-y-3 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-slate-400 block">Identifikační kód podání</span>
                <span className="text-base font-bold font-mono text-amber-400">
                  {trackedItem.trackingCode}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block sm:text-right">Aktuální stav</span>
                <div className="sm:text-right">{getStatusLabel(trackedItem.status)}</div>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <p>
                <strong className="text-slate-300">Věc:</strong>{' '}
                <span className="text-white">{trackedItem.subject}</span>
              </p>
              <p>
                <strong className="text-slate-300">Žadatel:</strong>{' '}
                <span className="text-slate-200">{trackedItem.applicantName}</span>
              </p>
              <p>
                <strong className="text-slate-300">Přidělený úředník:</strong>{' '}
                <span className="text-sky-300">{trackedItem.assignedOfficer}</span>
              </p>
              <p>
                <strong className="text-slate-300">Zákonná lhůta do:</strong>{' '}
                <span className="text-amber-300 font-mono">
                  {new Date(trackedItem.deadlineDate).toLocaleDateString('cs-CZ')}
                </span>
              </p>
              {trackedItem.resolutionNote && (
                <div className="p-2.5 mt-2 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-200">
                  <strong>Výsledek vyřízení:</strong> {trackedItem.resolutionNote}
                </div>
              )}
            </div>

            {/* Audit Trail Timeline */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Časová osa zpracování
              </span>
              <div className="space-y-2 text-xs">
                {trackedItem.auditTrail.map((trail, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-sky-400 mt-1 shrink-0" />
                    <div>
                      <span className="text-slate-400 font-mono text-[11px]">{trail.timestamp}</span>
                      <p className="text-slate-200">{trail.action} <span className="text-slate-400 font-mono text-[11px]">({trail.actor})</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation of newly created submission */}
      {createdSubmission && (
        <div className="p-5 sm:p-6 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 space-y-3 shadow-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-white">Podání bylo úspěšně odesláno na úřad!</h3>
              <p className="text-xs text-emerald-300">
                Vaše podání bylo zaevidováno v elektronické spisové službě obce Čehovice.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/40 font-mono flex flex-wrap gap-3 items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-sans">Váš trasovací kód podání:</span>
              <strong className="text-xl text-amber-400">{createdSubmission.trackingCode}</strong>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setTrackingQuery(createdSubmission.trackingCode);
                  setTrackedItem(createdSubmission);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-200 text-xs font-sans font-semibold hover:bg-emerald-500/30 border border-emerald-500/40"
              >
                Zobrazit podrobnosti
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/pdf/generate', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(createdSubmission),
                    });
                    const htmlText = await response.text();
                    const win = window.open('', '_blank');
                    if (win) {
                      win.document.write(htmlText);
                      win.document.close();
                    } else {
                      // Fallback download
                      const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', `Potvrzeni_podani_${createdSubmission.trackingCode}.html`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  } catch (e) {
                    console.error('Error generating PDF:', e);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-sans font-bold shadow-md transition-colors"
                title="Stáhnout úřední potvrzení podle správního řádu (POD-2027)"
              >
                Uložit potvrzení (POD-2027)
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            Kód si uschovejte. O vyřízení vás budeme informovat na e-mail {createdSubmission.applicantEmail}.
          </p>
        </div>
      )}

      {/* New Submission Form */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-sky-400/20 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Formulář nového podání na obecní úřad</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Všechna pole označená hvězdičkou (*) jsou povinná.
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Submission Type Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              Typ podání *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {[
                { id: 'obecne_podani', label: 'Obecné podání / Dotaz' },
                { id: 'zadost_informace_106', label: 'Žádost o informace (106/1999 Sb.)' },
                { id: 'zadost_kaceni', label: 'Žádost o kácení dřevin' },
                { id: 'stiznost', label: 'Stížnost / Podnět' },
                { id: 'poplatky', label: 'Místní poplatky (pes / odpad)' },
                { id: 'zivotni_prostredi', label: 'Životní prostředí & zeleň' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setType(t.id as SubmissionType)}
                  className={`p-3 rounded-xl text-xs font-semibold text-left border transition-all ${
                    type === t.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-md'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-sky-500/40'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subject & Content */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Věc (Předmět žádosti) *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Např. Žádost o poskytnutí informací k opravě komunikace"
                className="w-full bg-slate-900 border border-sky-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Text podání / Odůvodnění žádosti *
              </label>
              <textarea
                required
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Uveďte podrobnosti žádosti, specifikaci pozemku nebo dotazu..."
                className="w-full bg-slate-900 border border-sky-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Applicant details */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block">
              Údaje o žadateli (Fyzická / Právnická osoba)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Jméno a příjmení / Název *</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="Jan Novák"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Kontaktní E-mail *</label>
                <input
                  type="email"
                  required
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  placeholder="novak@email.cz"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Telefon (volitelné)</label>
                <input
                  type="tel"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  placeholder="+420 777 000 000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Delivery method selection */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Způsob doručení odpovědi úřadu:</label>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'email', label: 'E-mailem (doporučeno)' },
                  { id: 'datova_schranka', label: 'Do datové schránky (ISDS)' },
                  { id: 'osobne', label: 'Osobní převzetí na úřadě' },
                ].map((m) => (
                  <label key={m.id} className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === m.id}
                      onChange={() => setDeliveryMethod(m.id as any)}
                      className="text-amber-500 focus:ring-amber-400"
                    />
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>

              {deliveryMethod === 'datova_schranka' && (
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    value={dataBoxId}
                    onChange={(e) => setDataBoxId(e.target.value)}
                    placeholder="Zadejte ID vaší datové schránky (7 znaků)"
                    className="w-full sm:w-64 bg-slate-900 border border-sky-400/40 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Odeslat podání do spisové služby obce</span>
          </button>
        </form>
      </div>
    </div>
  );
}
