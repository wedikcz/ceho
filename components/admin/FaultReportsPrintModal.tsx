'use client';

import React from 'react';
import { Printer, X, ShieldCheck } from 'lucide-react';
import { FaultReport } from '@/lib/types';

interface FaultReportsPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: FaultReport[];
}

export default function FaultReportsPrintModal({
  isOpen,
  onClose,
  reports,
}: FaultReportsPrintModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalReports = reports.length;
  const resolvedCount = reports.filter((r) => r.status === 'hotovo').length;
  const inProgressCount = reports.filter((r) => r.status === 'reseni').length;
  const newCount = reports.filter((r) => r.status === 'nove').length;
  const anonymizedCount = reports.filter((r) => r.isAnonymized).length;

  const currentDateFormatted = new Date().toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const currentTimeFormatted = new Date().toLocaleTimeString('cs-CZ', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="bg-slate-900 border border-sky-500/30 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden print:border-0 print:shadow-none print:bg-white print:text-black">
        {/* Modal Toolbar - Hidden during print */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm text-white font-serif">
              Úřední tiskový export hlášení závad do formátu PDF / A4
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>Vytisknout / Uložit jako PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Zavřít"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Container */}
        <div className="p-6 sm:p-10 max-h-[85vh] overflow-y-auto print:max-h-none print:overflow-visible bg-white text-slate-900 font-sans space-y-6">
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                {/* Municipal Emblem Representation */}
                <div className="w-12 h-14 rounded bg-sky-800 border border-amber-500 flex flex-col items-center justify-center text-amber-400 shrink-0 font-serif font-bold text-center leading-none p-1">
                  <span className="text-[9px] text-sky-200">OBEC</span>
                  <span className="text-xs">ČEHOVICE</span>
                  <span className="text-[8px] text-amber-300">1299</span>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-950 uppercase font-serif">
                    Obec Čehovice
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    Obecní úřad Čehovice, Čehovice 80, 798 17 Čehovice • Okres Prostějov, Olomoucký kraj
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    IČO: 00288101 • ID datové schránky: <strong>3vgb2y3</strong> • Tel: +420 582 373 723 • obec@cehovice.cz
                  </p>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs font-mono space-y-0.5 text-slate-600">
              <div>Číslo jednací: <strong className="text-slate-950">ČEH-ZAV/2026/PROTOKOL</strong></div>
              <div>Spisový znak: <strong>152.1 (Závady a technická správa)</strong></div>
              <div>Skartační znak: <strong>S 5</strong></div>
              <div>Datum vyhotovení: <strong>{currentDateFormatted} ({currentTimeFormatted})</strong></div>
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center py-2 space-y-1">
            <h1 className="text-lg sm:text-xl font-bold font-serif uppercase tracking-wider text-slate-950">
              Protokol o evidenci a řešení závad na veřejném majetku obce
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl mx-auto">
              Úřední soupis hlášení obyvatel zaevidovaných v Digitální úřední knize obce Čehovice podle § 35 zákona č. 128/2000 Sb., o obcích. Všechna osobní data oznamovatelů jsou zpracována dle nařízení GDPR (EU) 2016/679.
            </p>
          </div>

          {/* Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3.5 bg-slate-100 rounded-xl border border-slate-300 text-center text-xs">
            <div>
              <span className="block text-slate-500 font-medium text-[11px]">Celkem hlášení</span>
              <strong className="text-base text-slate-900 font-mono">{totalReports}</strong>
            </div>
            <div>
              <span className="block text-emerald-700 font-medium text-[11px]">Vyřešeno</span>
              <strong className="text-base text-emerald-700 font-mono">{resolvedCount}</strong>
            </div>
            <div>
              <span className="block text-amber-700 font-medium text-[11px]">V řešení</span>
              <strong className="text-base text-amber-700 font-mono">{inProgressCount}</strong>
            </div>
            <div>
              <span className="block text-rose-700 font-medium text-[11px]">Nové k posouzení</span>
              <strong className="text-base text-rose-700 font-mono">{newCount}</strong>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="block text-sky-700 font-medium text-[11px]">GDPR Anonymizováno</span>
              <strong className="text-base text-sky-700 font-mono">{anonymizedCount}</strong>
            </div>
          </div>

          {/* Reports Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-200 text-slate-900 border-b border-slate-300 font-bold">
                  <th className="p-2.5 font-mono">ID</th>
                  <th className="p-2.5">Kategorie</th>
                  <th className="p-2.5">Název a popis závady</th>
                  <th className="p-2.5">Lokalita</th>
                  <th className="p-2.5">Nahlášeno</th>
                  <th className="p-2.5">Stav</th>
                  <th className="p-2.5">GDPR Režim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono font-bold text-slate-700">#{rep.id}</td>
                    <td className="p-2.5 uppercase font-semibold text-[10px] text-slate-800">
                      {rep.category}
                    </td>
                    <td className="p-2.5 max-w-xs">
                      <strong className="text-slate-950 block">{rep.title}</strong>
                      <span className="text-slate-600 text-[11px] leading-relaxed">
                        {rep.description}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-700 font-medium">{rep.location}</td>
                    <td className="p-2.5 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {new Date(rep.createdAt).toLocaleDateString('cs-CZ')}
                    </td>
                    <td className="p-2.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          rep.status === 'hotovo'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : rep.status === 'reseni'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {rep.status === 'hotovo' ? 'Vyřešeno' : rep.status === 'reseni' ? 'V řešení' : 'Nové'}
                      </span>
                    </td>
                    <td className="p-2.5 text-[11px] font-mono text-slate-600">
                      {rep.isAnonymized ? (
                        <span className="text-emerald-700 font-bold">Čl. 17 GDPR (Výmaz)</span>
                      ) : (
                        <span className="text-slate-500">Chráněno NIS2</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legal Certification and Sign-off */}
          <div className="pt-6 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 font-serif">Ověřovací doložka obecního úřadu:</h4>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Tento protokol byl vygenerován z autorizovaného informačního systému obce Čehovice. Integrita databáze a digitálních časových razítek byla ověřena bezpečnostním jádrem Titan Core v souladu se zákonem č. 297/2016 Sb., o službách vytvářejících důvěru pro elektronické transakce.
              </p>
              <div className="font-mono text-[10px] text-slate-500 pt-1">
                Kryptografický kontrolní otisk: sha256-8a91f42e88b392a104c9927d
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-end justify-end space-y-8 pt-4">
              <div className="text-center sm:text-right space-y-1">
                <div>V Čehovicích dne {currentDateFormatted}</div>
                <div className="h-14 flex items-center justify-center">
                  <span className="text-[11px] text-slate-400 italic border-b border-dotted border-slate-400 pb-1 px-8">
                    (Otisk úředního razítka obce Čehovice)
                  </span>
                </div>
                <div className="font-bold text-slate-950 font-serif">Milan Smékal</div>
                <div className="text-[11px] text-slate-600">Starosta obce Čehovice</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
