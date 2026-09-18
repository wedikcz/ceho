'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Camera,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Sparkles,
  Shield,
  EyeOff,
} from 'lucide-react';
import { FaultReport, ReportCategory } from '@/lib/types';
import { getStoredReports, saveReport } from '@/lib/store';

export default function NahlasitZavaduPage() {
  const [reports, setReports] = useState<FaultReport[]>([]);
  const [category, setCategory] = useState<ReportCategory>('osvetleni');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [imageAttached, setImageAttached] = useState<boolean>(false);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

  useEffect(() => {
    setReports(getStoredReports());
  }, []);

  const handleDetectGps = () => {
    setGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoordinates({
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5)),
          });
          setLocation((prev) => (prev ? prev : `GPS: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E (Čehovice)`));
          setGpsLoading(false);
        },
        () => {
          // Default village center fallback
          setGpsCoordinates({ lat: 49.4312, lng: 17.1895 });
          setLocation((prev) => (prev ? prev : 'Čehovice náves (střed obce u kostela)'));
          setGpsLoading(false);
        },
        { timeout: 5000 }
      );
    } else {
      setGpsCoordinates({ lat: 49.4312, lng: 17.1895 });
      setLocation('Čehovice náves (střed obce)');
      setGpsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newReport: FaultReport = {
      id: `rep-${Date.now().toString(36)}`,
      category,
      title: title.trim(),
      description: description.trim(),
      location: location.trim() || 'Čehovice (nespecifikováno)',
      latitude: gpsCoordinates?.lat,
      longitude: gpsCoordinates?.lng,
      imageUrl: imageAttached ? 'https://picsum.photos/seed/cehovice-rep/800/600' : undefined,
      status: 'nove',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contactEmail: contactEmail.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
      isAnonymized: false,
    };

    const updated = saveReport(newReport);
    if (updated) setReports(updated);
    setSubmittedReportId(newReport.id);

    // Reset form
    setTitle('');
    setDescription('');
    setLocation('');
    setContactEmail('');
    setContactPhone('');
    setImageAttached(false);
  };

  const getStatusBadge = (status: FaultReport['status']) => {
    switch (status) {
      case 'nove':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Nové hlášení
          </span>
        );
      case 'reseni':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
            <Clock className="w-3 h-3 text-sky-400" />
            V řešení úřadem
          </span>
        );
      case 'hotovo':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Opraveno / Vyřešeno
          </span>
        );
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Rychlé hlášení závad občanem • FOTO + GPS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
          Nahlásit závadu v obci
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Vidíte nesvítící lampu veřejného osvětlení, výtluk na silnici, spadlou větev nebo černou skládku? Vyplňte rychlé hlášení a technická četa obce se postará o nápravu.
        </p>
      </div>

      {submittedReportId && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 flex items-start gap-3 shadow-xl animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-base text-white">Závada byla úspěšně zaevidována!</h4>
            <p className="text-xs text-emerald-300 leading-relaxed">
              Děkujeme za pomoc s péčí o naši obec. Vaše hlášení bylo předáno starostovi a technickým pracovníkům. Můžete sledovat průběh řešení v seznamu níže.
            </p>
          </div>
        </div>
      )}

      {/* Main Report Submission Form */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-sky-400/25 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              Kategorie závady *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'osvetleni', label: 'Veřejné osvětlení' },
                { id: 'komunikace', label: 'Silnice a chodníky' },
                { id: 'zelen', label: 'Veřejná zeleň & parky' },
                { id: 'odpady', label: 'Kontejnery & skládky' },
                { id: 'voda', label: 'Voda a kanalizace' },
                { id: 'jine', label: 'Jiné / mobiliář' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id as ReportCategory)}
                  className={`p-3 rounded-xl text-xs font-semibold text-left border transition-all ${
                    category === c.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-md'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-sky-500/40'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Description */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Stručný název závady *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Např. Nesvítící lampa č. 45 naproti obchodu"
                className="w-full bg-slate-900 border border-sky-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Podrobný popis závady *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Popište, co přesně je rozbité, jaké je nebezpečí a jak dlouho stav trvá..."
                className="w-full bg-slate-900 border border-sky-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Location & GPS */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Přesné místo v obci (Lokalita) *
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Např. U mostku přes Vřesovku, ulice za humny..."
                className="flex-1 bg-slate-900 border border-sky-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleDetectGps}
                disabled={gpsLoading}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-400/40 text-sky-200 text-xs font-semibold transition-colors shrink-0"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{gpsLoading ? 'Zjišťuji GPS...' : 'Určit moji GPS polohu'}</span>
              </button>
            </div>
            {gpsCoordinates && (
              <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
                ✓ GPS zaměřeno: {gpsCoordinates.lat}° N, {gpsCoordinates.lng}° E
              </span>
            )}
          </div>

          {/* Simulated Photo Attachment */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Fotografie závady (volitelné)
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setImageAttached(!imageAttached)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                  imageAttached
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-sky-400/40'
                }`}
              >
                <Camera className="w-4 h-4 text-sky-400" />
                <span>{imageAttached ? '✓ Foto připojeno (simulace snímku)' : 'Připojit fotografii z mobilu'}</span>
              </button>
              {imageAttached && (
                <span className="text-xs text-slate-400">Náhled: foto_zavada_01.jpg (1.4 MB)</span>
              )}
            </div>
          </div>

          {/* Contact details & GDPR Notice */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
              <Shield className="w-4 h-4 text-sky-400" />
              <span>Kontaktní údaje pro informování o vyřešení (zcela volitelné)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Pokud uvedete e-mail, pošleme vám zprávu při opravě. Vaše údaje nepředáváme třetím stranám a v administraci lze kdykoliv uplatnit okamžitý GDPR anonymizační výmaz.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Váš e-mail (volitelné)"
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500"
              />
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Váš telefon (volitelné)"
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Odeslat hlášení na obecní úřad</span>
          </button>
        </form>
      </div>

      {/* Public List of Reported Faults */}
      <div className="glass-card rounded-2xl p-6 border border-sky-400/20 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>Přehled hlášených závad v obci ({reports.length})</span>
          </h2>
          <span className="text-xs text-slate-400">Aktualizováno v reálném čase</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {reports.map((rep) => (
            <div key={rep.id} className="py-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 font-medium">#{rep.id}</span>
                  {getStatusBadge(rep.status)}
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(rep.createdAt).toLocaleDateString('cs-CZ')}
                  </span>
                </div>
                <span className="text-xs text-sky-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {rep.location}
                </span>
              </div>

              <h4 className="font-bold text-sm text-white">{rep.title}</h4>
              <p className="text-xs text-slate-300">{rep.description}</p>

              {rep.officialResolutionNote && (
                <div className="p-2.5 rounded-lg bg-sky-950/60 border border-sky-500/30 text-xs text-sky-200 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Vyjádření úřadu:</strong> {rep.officialResolutionNote}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
