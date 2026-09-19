'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, ChevronDown, ChevronUp, Radio, BellRing } from 'lucide-react';
import Link from 'next/link';
import { VILLAGE_DATA } from '@/lib/village-data';

export default function EmergencyBanner() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  const announcement = VILLAGE_DATA.latestRadioAnnouncement;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 2.5; // ~40 steps
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      // Voice synthesis simulation of village radio
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(announcement.transcript);
        utter.lang = 'cs-CZ';
        utter.rate = 0.92;
        utter.onend = () => {
          setIsPlaying(false);
          setPlaybackProgress(0);
        };
        window.speechSynthesis.speak(utter);
      }
    } else {
      setIsPlaying(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  return (
    <div
      id="emergency-radio-banner"
      className="bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-amber-950/80 border-b border-amber-500/30 text-slate-100 backdrop-blur-xl relative z-30"
      role="alert"
      aria-label="Důležité hlášení místního rozhlasu a výstraha obce"
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Title and icon */}
          <div className="flex items-start sm:items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0 mt-0.5 sm:mt-0">
              <Radio className="w-4 h-4 animate-pulse" aria-hidden="true" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase tracking-wider font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Hlášení obecního rozhlasu
                </span>
                <span className="text-xs text-slate-400 font-mono">{announcement.recordedAt}</span>
              </div>
              <p className="text-sm font-medium text-slate-200 mt-0.5 line-clamp-1 sm:line-clamp-none">
                {announcement.title}
              </p>
            </div>
          </div>

          {/* Audio player controls & action links */}
          <div className="flex items-center gap-2.5 flex-wrap ml-auto lg:ml-0">
            {/* Waveform visualization */}
            <div className="hidden sm:flex items-center gap-1 h-5 px-2 bg-slate-950/60 rounded-md border border-slate-800">
              {[40, 75, 55, 90, 60, 80, 45, 100, 70, 50, 85, 60].map((h, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isPlaying ? 'bg-amber-400' : 'bg-slate-700'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(20, (h * (Math.sin(playbackProgress + i) + 1.2)) / 2)}%` : `${h * 0.3}%`,
                  }}
                />
              ))}
            </div>

            {/* Play/Pause Button */}
            <button
              id="radio-play-btn"
              onClick={togglePlay}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-amber-500/20 focus-visible:ring-2 focus-visible:ring-white"
              aria-label={isPlaying ? 'Pozastavit hlášení rozhlasu' : 'Přehrát poslední hlášení rozhlasu se zvukovým doprovodem'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  <span>Zastavit hlášení</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  <span>Přehrát rozhlas ({announcement.duration})</span>
                </>
              )}
            </button>

            {/* Transcript toggle */}
            <button
              id="radio-transcript-toggle"
              onClick={() => setShowTranscript(!showTranscript)}
              className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors"
              aria-expanded={showTranscript}
              aria-controls="radio-transcript-box"
            >
              <span>Přepis</span>
              {showTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Notification alert subscribe link */}
            <Link
              href="/varovani"
              id="emergency-subscribe-link"
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-200 px-2.5 py-1.5 rounded-lg border border-amber-500/30 hover:bg-amber-500/10 transition-colors"
              title="Aktivovat okamžitá krizová SMS a e-mailová varování"
            >
              <BellRing className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Odběr SMS/e-mail výstrah</span>
            </Link>
          </div>
        </div>

        {/* Collapsible Transcript */}
        {showTranscript && (
          <div
            id="radio-transcript-box"
            className="mt-2.5 pt-2.5 border-t border-amber-500/20 text-xs sm:text-sm text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed"
          >
            <p className="font-semibold text-amber-300 mb-1">Úřední doslovný přepis hlášení:</p>
            <p className="italic font-serif">„{announcement.transcript}“</p>
          </div>
        )}
      </div>
    </div>
  );
}
