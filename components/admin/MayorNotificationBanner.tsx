'use client';

import React, { useState } from 'react';
import { Mail, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { MayorNotification } from '@/lib/types';
import { markMayorNotificationRead, approveHITLItem } from '@/lib/store';

interface MayorNotificationBannerProps {
  notifications: MayorNotification[];
  onRefresh: () => void;
}

export default function MayorNotificationBanner({
  notifications,
  onRefresh,
}: MayorNotificationBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id: string) => {
    markMayorNotificationRead(id);
    onRefresh();
  };

  const handleDirectApprove = (notif: MayorNotification) => {
    if (notif.referenceId) {
      approveHITLItem(notif.referenceId);
    }
    markMayorNotificationRead(notif.id);
    onRefresh();
  };

  if (notifications.length === 0) return null;

  return (
    <div className="glass-panel rounded-2xl border border-amber-500/30 overflow-hidden bg-slate-950/80">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3.5 sm:p-4 cursor-pointer flex items-center justify-between gap-3 hover:bg-slate-900/60 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-white font-serif">
                Automatická pošta starosty (obec@cehovice.cz)
              </span>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 animate-pulse">
                  {unreadCount} nových upozornění ke schválení
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                  Vše vyřízeno
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Při každém novém HITL požadavku nebo podání je automaticky generován e-mail na adresu starosty
            </p>
          </div>
        </div>

        <button className="text-slate-400 hover:text-white p-1">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-slate-800 space-y-2.5 bg-slate-900/40 text-xs">
          <div className="divide-y divide-slate-800">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  !n.read ? 'bg-amber-500/5 px-2.5 rounded-xl border border-amber-500/20' : ''
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{n.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(n.timestamp).toLocaleTimeString('cs-CZ')}
                    </span>
                    {!n.read && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        ČEKÁ NA REAKCI
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{n.message}</p>
                  <div className="text-[10px] font-mono text-slate-500">
                    Příjemce: <strong>{n.recipientEmail}</strong> • Odesláno automatickou bránou Titan
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {n.type === 'hitl_pending' && !n.read && (
                    <button
                      onClick={() => handleDirectApprove(n)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[11px] inline-flex items-center gap-1 shadow-sm"
                    >
                      <Check className="w-3 h-3" />
                      <span>Schválit ihned</span>
                    </button>
                  )}

                  {!n.read && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                    >
                      Označit jako přečtené
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
