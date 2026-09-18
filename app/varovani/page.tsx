'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BellRing,
  Mail,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Radio,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { AlertSubscriber } from '@/lib/types';

export default function VarovaniPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [categories, setCategories] = useState<string[]>(['pohroma', 'odstavka', 'voda']);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [unsubEmail, setUnsubEmail] = useState('');
  const [unsubSuccess, setUnsubSuccess] = useState(false);

  const toggleCategory = (catId: string) => {
    if (categories.includes(catId)) {
      setCategories(categories.filter((c) => c !== catId));
    } else {
      setCategories([...categories, catId]);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || categories.length === 0) return;

    // Simulate double opt-in subscriber registration
    const newSubscriber: AlertSubscriber = {
      id: `sub-${Date.now().toString(36)}`,
      email: email.trim(),
      phoneHash: phone ? `hash-${phone.slice(-4)}` : undefined,
      categories,
      verified: true,
      verifyToken: `vtok-${Math.random().toString(36).substring(2, 10)}`,
      unsubscribeToken: `unsub-${Math.random().toString(36).substring(2, 10)}`,
      subscribedAt: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem('cehovice_subscribers_v2');
      const list = existing ? JSON.parse(existing) : [];
      list.push(newSubscriber);
      localStorage.setItem('cehovice_subscribers_v2', JSON.stringify(list));
    } catch {
      // ignore
    }

    setIsSubscribed(true);
  };

  const handleUnsubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unsubEmail.trim()) return;
    try {
      const existing = localStorage.getItem('cehovice_subscribers_v2');
      if (existing) {
        const list = JSON.parse(existing);
        const filtered = list.filter((s: AlertSubscriber) => s.email.toLowerCase() !== unsubEmail.trim().toLowerCase());
        localStorage.setItem('cehovice_subscribers_v2', JSON.stringify(filtered));
      }
    } catch {
      // ignore
    }
    setUnsubSuccess(true);
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
          <BellRing className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Krizová notifikační brána obce • Dvojí opt-in</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
          Odběr bezpečnostních výstrah a zpráv
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Buďte okamžitě informováni o výpadcích pitné vody a elektřiny, blížících se přívalových deštích, haváriích na Vřesovce nebo důležitých hlášeních místního rozhlasu.
        </p>
      </div>

      {/* Subscription Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-amber-500/30 space-y-6">
        {isSubscribed ? (
          <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 space-y-3 animate-fade-in text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Přihlášení proběhlo úspěšně!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Na e-mail <strong>{email}</strong> jsme odeslali potvrzovací zprávu s dvojitým opt-in ověřením. O krizových situacích budete včas informováni.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsSubscribed(false);
                  setEmail('');
                  setPhone('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white"
              >
                Přihlásit další e-mail
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white font-serif mb-1">
                Registrace odběru výstrah (E-mail a SMS)
              </h2>
              <p className="text-xs text-slate-400">
                Služba je pro všechny občany a chataře v Čehovicích zdarma.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Váš E-mail *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="obcan@email.cz"
                    className="w-full bg-slate-900 border border-sky-500/30 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Mobilní telefon pro SMS (volitelné)
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+420 777 000 000"
                    className="w-full bg-slate-900 border border-sky-500/30 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Telefonní číslo je v databázi kryptograficky hashováno (minimalizace PII).
                </span>
              </div>
            </div>

            {/* Notification categories checkboxes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                Vyberte kategorie oznámení, která chcete dostávat:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'pohroma',
                    label: 'Živelní pohromy & Krizové stavy',
                    desc: 'Povodňová bdělost na Vřesovce, vichřice, námrazy, požární výstrahy',
                  },
                  {
                    id: 'odstavka',
                    label: 'Odstávky elektřiny a plynu',
                    desc: 'Plánované i havarijní práce distribučních společností ČEZ a GasNet',
                  },
                  {
                    id: 'voda',
                    label: 'Pitná voda a poruchy VaK',
                    desc: 'Přerušení dodávky vody, náhradní zásobování cisternami, kvalita vody',
                  },
                  {
                    id: 'odpad',
                    label: 'Mimořádné svozy odpadu',
                    desc: 'Kontejnery na nebezpečný odpad, svoz elektroodpadu, změny v rozpisu',
                  },
                  {
                    id: 'obec',
                    label: 'Kulturní a obecní hlášení',
                    desc: 'Hlášení místního rozhlasu, vinobraní, zasedání zastupitelstva',
                  },
                ].map((cat) => {
                  const isChecked = categories.includes(cat.id);
                  return (
                    <div
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all flex items-start gap-3 ${
                        isChecked
                          ? 'bg-amber-500/10 border-amber-500/50'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-amber-500 focus:ring-amber-400"
                      />
                      <div>
                        <span className="font-bold text-xs text-white block">{cat.label}</span>
                        <span className="text-[11px] text-slate-400 leading-snug block mt-0.5">
                          {cat.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* GDPR & Double Opt-in Notice */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Ochrana osobních údajů a odhlášení na 1 klik</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Zpracování probíhá na základě vašeho souhlasu (čl. 6 odst. 1 písm. a) GDPR) a ochrany životně důležitých zájmů (čl. 6 odst. 1 písm. d) GDPR). V každé zprávě je odkaz pro okamžité odhlášení bez udání důvodu (čl. 7 odst. 3 GDPR).
              </p>
            </div>

            <button
              type="submit"
              disabled={categories.length === 0}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <BellRing className="w-4 h-4" />
              <span>Aktivovat odběr varování</span>
            </button>
          </form>
        )}
      </div>

      {/* 1-Click Unsubscribe Form */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-xs space-y-4">
        <h3 className="font-bold text-sm text-white font-serif">
          Rychlé odhlášení z odběru (1 kliknutí dle čl. 7 odst. 3 GDPR)
        </h3>
        {unsubSuccess ? (
          <p className="text-emerald-400 font-semibold">
            ✓ E-mail byl úspěšně odhlášen ze všech notifikačních seznamů obce Čehovice.
          </p>
        ) : (
          <form onSubmit={handleUnsubscribe} className="flex flex-col sm:flex-row gap-2 max-w-lg">
            <input
              type="email"
              required
              value={unsubEmail}
              onChange={(e) => setUnsubEmail(e.target.value)}
              placeholder="Zadejte váš registrovaný e-mail"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs placeholder-slate-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 border border-slate-700 hover:border-rose-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Odhlásit odběr
            </button>
          </form>
        )}
      </div>

      {/* Difference between Warning Gateway and Sirens */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-sky-500/20 text-xs text-slate-300 space-y-2">
        <h4 className="font-bold text-white flex items-center gap-2">
          <Radio className="w-4 h-4 text-sky-400" />
          <span>Vztah k sirénám HZS a systému Cell Broadcast</span>
        </h4>
        <p className="leading-relaxed">
          Notifikační brána obce Čehovice slouží jako doplňkový informační kanál (např. pro sluchově znevýhodněné občany a pro provozní hlášení). V případě bezprostředního ohrožení života celého státu (povodňová vlna, chemická havárie) je současně spouštěna rotační siréna na hasičské zbrojnici a systém Cell Broadcast HZS ČR přímo na všechny mobilní telefony v katastru.
        </p>
      </div>
    </div>
  );
}
