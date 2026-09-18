'use client';

import React from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Building,
  CreditCard,
  Key,
  Clock,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { VILLAGE_DATA } from '@/lib/village-data';

export default function KontaktyPage() {
  const { contacts, officeHours, address, registry, mayor, viceMayor, district, region } =
    VILLAGE_DATA;

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
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
          Kontaktní spojení a úřední hodiny
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Oficiální kontakty Obecního úřadu Čehovice, bankovní spojení, datová schránka a mapa pro orientaci.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Office Info */}
        <div className="glass-card rounded-2xl p-6 border border-sky-400/20 space-y-4">
          <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-400" />
            <span>Sídlo obecního úřadu</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm">
                  {address.street}, {address.zip} {address.municipality}
                </strong>
                <span className="text-slate-400">
                  okres {district}, {region}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[11px]">Pevná linka kanceláře:</span>
                <a
                  href={`tel:${contacts.phone.replace(/\s+/g, '')}`}
                  className="text-white font-mono hover:text-amber-400"
                >
                  {contacts.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[11px]">Mobil starosty:</span>
                <a
                  href={`tel:${contacts.mobile.replace(/\s+/g, '')}`}
                  className="text-white font-mono hover:text-amber-400"
                >
                  {contacts.mobile}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[11px]">Oficiální e-mail:</span>
                <a href={`mailto:${contacts.email}`} className="text-sky-300 font-mono hover:underline">
                  {contacts.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Key className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[11px]">ID datové schránky (ISDS):</span>
                <span className="text-amber-400 font-mono font-bold text-sm bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  {registry.dataBoxId}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Leadership Contact */}
        <div className="glass-card rounded-2xl p-6 border border-sky-400/20 space-y-4">
          <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Starosta a místostarosta</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] block">
                Starosta obce
              </span>
              <p className="text-sm font-bold text-white">{mayor}</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-300 font-mono">{contacts.mobile}</span>
                <a
                  href={`tel:${contacts.mobile.replace(/\s+/g, '')}`}
                  className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/40"
                >
                  Zavolat
                </a>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-sky-400 font-bold uppercase tracking-wider text-[11px] block">
                Místostarosta obce
              </span>
              <p className="text-sm font-bold text-white">{viceMayor}</p>
              <p className="text-slate-400">{contacts.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial & Registry Identifiers */}
      <div className="glass-panel rounded-2xl p-6 border border-sky-500/20 space-y-4">
        <h2 className="text-base font-bold text-white font-serif flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-amber-400" />
          <span>Fakturační a bankovní údaje</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block mb-1">Bankovní účet (Komerční banka):</span>
            <span className="font-mono text-sm font-bold text-amber-400">{registry.bankAccount}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block mb-1">Identifikační číslo (IČO):</span>
            <span className="font-mono text-sm font-bold text-white">{registry.ico}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block mb-1">Daňové identifikační číslo (DIČ):</span>
            <span className="font-mono text-sm font-bold text-white">{registry.dic}</span>
          </div>
        </div>
      </div>

      {/* Orientation Map Link */}
      <div className="glass-card rounded-2xl p-6 border border-sky-400/20 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-serif flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <span>Kde nás najdete (GPS navigace)</span>
          </h2>
          <span className="text-xs font-mono text-sky-300">GPS: {address.gps}</span>
        </div>

        <p className="text-xs text-slate-300">
          Budova obecního úřadu se nachází v centru obce Čehovice vedle kostela sv. Prokopa a místní knihovny.
        </p>

        <div className="pt-2">
          <a
            href="https://mapy.cz/zakladni?q=Čehovice+80"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 text-xs font-bold border border-sky-400/40 transition-colors"
          >
            <span>Otevřít v Mapy.cz</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
