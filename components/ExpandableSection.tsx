'use client';

import React, { useState } from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';

interface ExpandableSectionProps {
  id: string;
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: 'azure' | 'amber' | 'live' | 'neutral';
  };
  kpiSummary?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
}

export default function ExpandableSection({
  id,
  icon: Icon,
  title,
  subtitle,
  badge,
  kpiSummary,
  defaultOpen = false,
  children,
  headerAction,
  className = '',
}: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const getBadgeStyle = (variant: string = 'neutral') => {
    switch (variant) {
      case 'azure':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      case 'amber':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'live':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div
      id={id}
      className={`glass-card rounded-2xl overflow-hidden border transition-all duration-300 ${
        isOpen ? 'border-sky-400/40 shadow-xl' : 'border-sky-500/15 hover:border-sky-400/30'
      } ${className}`}
    >
      {/* Clickable Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left cursor-pointer select-none group hover:bg-sky-500/5 transition-colors"
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className="flex items-center gap-3.5">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-sky-400/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:border-amber-400/50 transition-colors">
              <Icon className="w-5 h-5" aria-hidden="true" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors font-serif">
                {title}
              </h3>
              {badge && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${getBadgeStyle(
                    badge.variant
                  )}`}
                >
                  {badge.text}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {/* Right side: KPI summary + chevron */}
        <div className="flex items-center gap-3 self-end sm:self-center ml-auto">
          {kpiSummary && <div className="text-xs sm:text-sm font-medium">{kpiSummary}</div>}
          {headerAction && <div onClick={(e) => e.stopPropagation()}>{headerAction}</div>}
          <div
            className={`w-8 h-8 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-transform duration-300 ${
              isOpen ? 'transform rotate-180 text-amber-400 border-amber-500/40' : ''
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Collapsible Content using smooth CSS grid transition */}
      <div
        id={`${id}-content`}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 sm:p-6 pt-0 border-t border-sky-500/15 mt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
