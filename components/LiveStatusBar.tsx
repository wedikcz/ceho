'use client';

import React, { useState } from 'react';
import { CloudSun, Wind, Droplets, QrCode, Shield, Check, Smartphone, CreditCard, Sparkles, X } from 'lucide-react';
import { VILLAGE_DATA } from '@/lib/village-data';

export default function LiveStatusBar() {
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrType, setQrType] = useState<'pwa' | 'payment'>('pwa');

  return (
    <>
      <div
        id="live-status-bar"
        className="bg-slate-950/70 border-t border-sky-900/30 text-xs text-slate-300 py-2.5 px-4 backdrop-blur-md"
        role="complementary"
        aria-label="Aktuální stav obce Čehovice, počasí a rychlé platby"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Weather and Environment */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span className="font-medium text-slate-200">Čehovice: 18 °C</span>
              <span className="text-slate-400">Polojasno</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <Wind className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
              <span>Vítr: JZ 3,2 m/s</span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-slate-400">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
              <span>Ovzduší: Výborné (AQI 1)</span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-dot" />
              <span>Hladina Vřesovky: 42 cm (normál)</span>
            </div>
          </div>

          {/* Quick QR Links (PWA install & Payments) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setQrType('pwa');
                setShowQrModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-sky-300 border border-sky-500/20 hover:border-sky-400/50 transition-colors text-xs"
              title="Zobrazit QR kód pro instalaci mobilní aplikace Čehovice PWA"
            >
              <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
              <span>PWA Aplikace</span>
            </button>

            <button
              onClick={() => {
                setQrType('payment');
                setShowQrModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors text-xs font-medium"
              title="Zobrazit QR kód pro platbu poplatků za psa a odpad"
            >
              <CreditCard className="w-3.5 h-3.5" aria-hidden="true" />
              <span>QR Platba poplatků</span>
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Modal Dialog */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-modal-title"
        >
          <div className="bg-slate-900 border border-sky-400/30 rounded-2xl max-w-sm w-full p-6 text-center glass-panel relative shadow-2xl">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              aria-label="Zavřít"
            >
              <X className="w-5 h-5" />
            </button>

            {qrType === 'pwa' ? (
              <>
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 text-sky-400 mx-auto flex items-center justify-center mb-3">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 id="qr-modal-title" className="text-lg font-bold text-white mb-1">
                  Aplikace Obec Čehovice PWA
                </h3>
                <p className="text-xs text-slate-300 mb-4">
                  Naskenujte fotoaparátem telefonu pro instalaci do mobilu bez nutnosti stahování z App Store / Google Play.
                </p>

                {/* Simulated High-Res QR Matrix */}
                <div className="bg-white p-4 rounded-xl inline-block shadow-lg mx-auto mb-3">
                  <div className="w-40 h-40 bg-slate-950 p-2 rounded flex flex-col justify-between items-center relative overflow-hidden">
                    {/* SVG Stylized QR Code */}
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                      <rect x="0" y="0" width="30" height="30" fill="white" />
                      <rect x="5" y="5" width="20" height="20" fill="black" />
                      <rect x="10" y="10" width="10" height="10" fill="white" />

                      <rect x="70" y="0" width="30" height="30" fill="white" />
                      <rect x="75" y="5" width="20" height="20" fill="black" />
                      <rect x="80" y="10" width="10" height="10" fill="white" />

                      <rect x="0" y="70" width="30" height="30" fill="white" />
                      <rect x="5" y="75" width="20" height="20" fill="black" />
                      <rect x="10" y="80" width="10" height="10" fill="white" />

                      {/* Random QR elements */}
                      <rect x="35" y="10" width="10" height="10" fill="white" />
                      <rect x="50" y="10" width="15" height="5" fill="white" />
                      <rect x="35" y="25" width="5" height="15" fill="white" />
                      <rect x="45" y="35" width="20" height="10" fill="white" />
                      <rect x="70" y="45" width="15" height="15" fill="white" />
                      <rect x="10" y="45" width="15" height="10" fill="white" />
                      <rect x="35" y="60" width="25" height="10" fill="white" />
                      <rect x="45" y="75" width="10" height="15" fill="white" />
                      <rect x="65" y="75" width="20" height="20" fill="white" />
                    </svg>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Podporuje offline režim, nouzové notifikace a rychlá hlášení.
                </p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 mx-auto flex items-center justify-center mb-3">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 id="qr-modal-title" className="text-lg font-bold text-white mb-1">
                  Rychlá QR Platba poplatků
                </h3>
                <p className="text-xs text-slate-300 mb-2">
                  Číslo účtu obce: <strong className="text-amber-400 font-mono">15024761/0100</strong>
                </p>
                <div className="bg-white p-4 rounded-xl inline-block shadow-lg mx-auto mb-3">
                  {/* Stylized QR Payment Matrix */}
                  <div className="w-40 h-40 bg-slate-950 p-2 rounded flex flex-col justify-between items-center relative overflow-hidden">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                      <rect x="0" y="0" width="30" height="30" fill="white" />
                      <rect x="5" y="5" width="20" height="20" fill="black" />
                      <rect x="10" y="10" width="10" height="10" fill="white" />

                      <rect x="70" y="0" width="30" height="30" fill="white" />
                      <rect x="75" y="5" width="20" height="20" fill="black" />
                      <rect x="80" y="10" width="10" height="10" fill="white" />

                      <rect x="0" y="70" width="30" height="30" fill="white" />
                      <rect x="5" y="75" width="20" height="20" fill="black" />
                      <rect x="10" y="80" width="10" height="10" fill="white" />

                      <circle cx="50" cy="50" r="12" fill="white" />
                      <rect x="40" y="20" width="20" height="5" fill="white" />
                      <rect x="70" y="50" width="10" height="20" fill="white" />
                    </svg>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300">
                  Jako variabilní symbol uveďte <strong className="text-white">číslo popisné vašeho domu</strong>.
                </p>
              </>
            )}

            <button
              onClick={() => setShowQrModal(false)}
              className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Zavřít okno
            </button>
          </div>
        </div>
      )}
    </>
  );
}
