'use client';

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Nis2Policy } from '@/lib/types';
import { Shield, AlertCircle } from 'lucide-react';

// Tooltip formatter
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs font-sans shadow-xl">
        <p className="font-semibold text-white">{data.name}</p>
        <p className="text-slate-300 font-mono mt-0.5">
          Počet: <span className="font-bold text-white">{data.value}</span> ({data.percent}%)
        </p>
      </div>
    );
  }
  return null;
};

interface SecurityComplianceChartProps {
  policies: Nis2Policy[];
}

export default function SecurityComplianceChart({ policies }: SecurityComplianceChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-slate-500 font-mono">
        Načítám graf souladu...
      </div>
    );
  }

  // Calculate stats
  const activeCount = policies.filter((p) => p.status === 'aktivni').length;
  const reviewCount = policies.filter((p) => p.status === 've_schvalovani' || p.status === 'revize').length;
  const total = policies.length || 1;

  const activePercent = Math.round((activeCount / total) * 100);
  const reviewPercent = Math.round((reviewCount / total) * 100);

  const data = [
    { name: 'Aktivní (V souladu)', value: activeCount, percent: activePercent, color: '#10b981' }, // emerald-500
    { name: 'V revizi / Ke schválení', value: reviewCount, percent: reviewPercent, color: '#f59e0b' }, // amber-500
  ];

  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Security Compliance Status
          </h4>
          <p className="text-[10px] text-slate-400">
            Aktuální status NIS2 směrnice a prováděcích předpisů
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {activePercent}% Soulad
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Pie Chart */}
        <div className="h-44 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={68}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Central Percentage */}
          <div className="absolute text-center">
            <span className="block text-xl font-extrabold text-white font-mono">{activePercent}%</span>
            <span className="block text-[8px] text-slate-400 uppercase tracking-widest font-mono">OK</span>
          </div>
        </div>

        {/* Legend & Stats Details */}
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-slate-950 border border-slate-900">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate-300 font-semibold">V souladu (Aktivní)</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">{activeCount} / {total}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-slate-950 border border-slate-900">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-300 font-semibold">V revizi / schvalování</span>
              </div>
              <span className="font-mono font-bold text-amber-400">{reviewCount} / {total}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-900 text-[10px] text-slate-400 leading-relaxed flex gap-2">
            {reviewCount > 0 ? (
              <>
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Pro dosažení 100% souladu je vyžadována revize a schválení zbývajících prováděcích směrnic v radě obce.
                </span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Všechny sledované bezpečnostní politiky jsou v plném souladu s požadavky NÚKIB a směrnice NIS2.
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
