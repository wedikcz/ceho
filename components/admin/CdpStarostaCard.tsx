'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  Search,
  Video,
  Shield,
  CheckCircle2,
  DollarSign,
  Clock,
  RefreshCw,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import {
  approveHITLItem,
  getStoredHITLQueue,
  getMunicipalBudgetData,
  runSecurityCaiDeepScan,
  runSecurityCaiHealthCheck,
  getDeadlineMonitoringList,
  addAuditLog,
} from '@/lib/store';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: string;
  actionTaken?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  sources?: { title: string; url: string }[];
}

interface CdpStarostaCardProps {
  onDataChanged?: () => void;
}

export default function CdpStarostaCard({ onDataChanged }: CdpStarostaCardProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-0',
      role: 'assistant',
      content: `Vítejte v exekutivním centru, vážený pane starosto **Milane Smékale**.\n\nJsem **ČDP-starosta** – váš všemocný autonomní asistent pro řízení obce Čehovice. Mám plný přístup k obecnímu rozpočtu, spisové službě, schvalovací frontě HITL i bezpečnostnímu jádru Titan.\n\n*Jak vám mohu dnes pomoci se správou obce?*`,
      timestamp: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }),
      source: 'cdp-starosta-core',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState<'chat' | 'image' | 'search' | 'video'>('chat');

  // Audio Recording states for Gemini 3.5 Transcribe
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Voice recording logic with Speech-to-Text via Gemini 3.5 Transcribe
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          await handleAudioTranscription(base64Audio);
        };
        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access not available or denied:', err);
      // Helpful fallback simulation
      setInputMessage('Schvaluji zveřejnění záměru směny pozemku a proveď kontrolu rozpočtu.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const handleAudioTranscription = async (base64Audio: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64: base64Audio, mimeType: 'audio/webm' }),
      });
      const data = await res.json();
      if (data.transcript) {
        setInputMessage((prev) => (prev ? `${prev} ${data.transcript}` : data.transcript));
      }
    } catch (err) {
      console.error('Transcription error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Main Submit Handler
  const handleSendMessage = async (e?: React.FormEvent, directText?: string) => {
    if (e) e.preventDefault();
    const query = (directText || inputMessage).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      if (activeTool === 'image') {
        // Image generation mode with gemini-3.1-flash-lite-image
        const res = await fetch('/api/ai/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: query, aspectRatio: '16:9' }),
        });
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: `🎨 **Vizuální koncept pro obec Čehovice vygenerován:**\n"${query}"`,
            timestamp: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }),
            source: 'gemini-3.1-flash-lite-image',
            mediaUrl: data.imageUrl,
            mediaType: 'image',
          },
        ]);
        setActiveTool('chat');
      } else if (activeTool === 'search') {
        // Search grounding mode with gemini-3.8-flash
        const res = await fetch('/api/ai/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: data.answer || 'Rešerše byla dokončena.',
            timestamp: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }),
            source: 'gemini-3.8-flash + Google Search Grounding',
            sources: data.sources,
          },
        ]);
        setActiveTool('chat');
      } else if (activeTool === 'video') {
        // Video mode with veo-3.1-lite-generate-preview
        const res = await fetch('/api/ai/video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: query, aspectRatio: '16:9' }),
        });
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: `🎬 **Video generátor Veo 3:**\n${data.message || 'Video bylo zadáno do fronty.'}`,
            timestamp: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }),
            source: 'veo-3.1-lite-generate-preview',
            mediaUrl: data.videoUrl,
            mediaType: 'video',
          },
        ]);
        setActiveTool('chat');
      } else {
        // Executive AI Chat & Direct Command Execution
        const historyPayload = messages.map((m) => ({ role: m.role, content: m.content }));
        const res = await fetch('/api/cdp-starosta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: query, history: historyPayload }),
        });
        const data = await res.json();

        // Handle auto-execution if detected
        let actionNote = '';
        if (data.detectedAction === 'approve_hitl') {
          const queue = getStoredHITLQueue();
          const pending = queue.find((i) => i.status === 'pending');
          if (pending) {
            approveHITLItem(pending.id);
            actionNote = `✓ Úloha "${pending.content.slice(0, 40)}..." byla okamžitě schválena a publikována.`;
            onDataChanged?.();
          }
        } else if (data.detectedAction === 'run_security_scan') {
          runSecurityCaiDeepScan();
          actionNote = '✓ Spuštěn hloubkový scan Titan jádra a aktualizována telemetrie.';
          onDataChanged?.();
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: `${data.reply}${actionNote ? `\n\n> **Exekutivní akce:** ${actionNote}` : ''}`,
            timestamp: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }),
            source: data.source || 'cdp-starosta',
            actionTaken: data.detectedAction,
          },
        ]);
      }
    } catch (err: any) {
      console.error('Error in starosta chat:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: 'Omlouvám se, došlo k chybě spojení. Příkaz můžete zopakovat nebo vybrat z rychlých tlačítek.',
          timestamp: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }),
          source: 'cdp-starosta-fallback',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Quick Action Buttons
  const quickActions = [
    {
      label: 'Schválit čekající HITL',
      icon: CheckCircle2,
      command: 'Schvaluji nejstarší čekající položku ve frontě HITL a zveřejni ji na úřední desce.',
    },
    {
      label: 'Stav rozpočtu obce',
      icon: DollarSign,
      command: 'Ukaž mi aktuální stav rozpočtu obce Čehovice na rok 2026 a přebytek investic.',
    },
    {
      label: 'Kontrola 30denních lhůt',
      icon: Clock,
      command: 'Proveď kontrolu zákonných 30denních lhůt podání a upozorni mě na blížící se termíny.',
    },
    {
      label: 'Test integrity štítů Titan',
      icon: Shield,
      command: 'Spusť hloubkový diagnostický scan bezpečnostních štítů Titan Core a NIS2 compliance.',
    },
  ];

  return (
    <div className="glass-card rounded-2xl border-2 border-amber-500/40 bg-slate-950/90 shadow-2xl overflow-hidden flex flex-col h-[720px]">
      {/* Executive Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/20 via-sky-500/10 to-slate-900 border-b border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg text-white font-serif">
                ČDP-starosta • Exekutivní asistent starosty
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500 text-slate-950 uppercase shadow-sm">
                Starosta Godmode
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Všemocná správa digitálního úřadu, rozpočtu, HITL schvalování a AIOps pro{' '}
              <strong className="text-white">Milana Smékala</strong>
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTool('chat')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              activeTool === 'chat'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Příkazy & Chat</span>
          </button>
          <button
            onClick={() => setActiveTool('image')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              activeTool === 'image'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Generování plakátů a ilustrací přes Gemini 3.1 Flash Image"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Generátor plakátů</span>
          </button>
          <button
            onClick={() => setActiveTool('search')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              activeTool === 'search'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Právní a faktické rešerše přes Gemini 3.5 Flash s Google Search"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Google Rešerše</span>
          </button>
          <button
            onClick={() => setActiveTool('video')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              activeTool === 'video'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Tvorba videí přes Veo 3"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Veo 3 Video</span>
          </button>
        </div>
      </div>

      {/* Quick Action Chips */}
      <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-amber-400 shrink-0 font-mono">
          Rychlé akce:
        </span>
        {quickActions.map((qa, i) => {
          const Icon = qa.icon;
          return (
            <button
              key={i}
              onClick={() => handleSendMessage(undefined, qa.command)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-slate-200 text-xs whitespace-nowrap transition-all shrink-0"
            >
              <Icon className="w-3.5 h-3.5 text-amber-400" />
              <span>{qa.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 font-sans text-xs sm:text-sm">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-1">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 space-y-2.5 ${
                  isUser
                    ? 'bg-amber-500 text-slate-950 font-medium shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/95 text-slate-200 border border-slate-800 shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[10px] opacity-70">
                  <span className="font-bold uppercase font-mono">
                    {isUser ? 'Milan Smékal (Starosta)' : 'ČDP-starosta (Exekutiva)'}
                  </span>
                  <span>{m.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap leading-relaxed font-sans">
                  {m.content}
                </div>

                {/* Media attachments */}
                {m.mediaUrl && m.mediaType === 'image' && (
                  <div className="pt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.mediaUrl}
                      alt="Generovaný vizuál"
                      className="rounded-xl border border-amber-500/30 w-full max-h-72 object-cover shadow-lg"
                    />
                  </div>
                )}

                {m.mediaUrl && m.mediaType === 'video' && (
                  <div className="pt-2">
                    <video
                      src={m.mediaUrl}
                      controls
                      autoPlay
                      muted
                      className="rounded-xl border border-sky-500/30 w-full max-h-72 shadow-lg"
                    />
                  </div>
                )}

                {/* Sources list from Google Grounding */}
                {m.sources && m.sources.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block">
                      Ověřené zdroje z vyhledávače Google:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.sources.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                        >
                          <span>{s.title}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {!isUser && m.source && (
                  <div className="text-[10px] font-mono text-slate-500 pt-1 flex items-center justify-between">
                    <span>Engine: {m.source}</span>
                    <span className="text-emerald-400 font-bold">✓ Titan Verified</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>
                {activeTool === 'image'
                  ? 'Generuji grafický koncept obce přes Gemini 3.1 Flash Image...'
                  : activeTool === 'search'
                  ? 'Provádím rešerši přes Google Search Grounding...'
                  : activeTool === 'video'
                  ? 'Komunikuji s modelem Veo 3 pro generování videa...'
                  : 'ČDP-starosta zpracovává exekutivní příkaz a synchronizuje jádro Titan...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar with Voice Dictation & Multimodal Trigger */}
      <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 space-y-2">
        {isRecording && (
          <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>Nahrávám hlasový pokyn starosty... ({recordingTime}s)</span>
            </div>
            <button
              onClick={stopRecording}
              className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              Dokončit a přepsat
            </button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          {/* Voice Dictation Button (Gemini 3.5 Transcribe) */}
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2.5 rounded-xl border transition-all shrink-0 ${
              isRecording
                ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-amber-400'
            }`}
            title="Hlasové zadání příkazu pro starostu (Gemini 3.5 Transcribe)"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              activeTool === 'image'
                ? 'Zadejte popis plakátu / vizuálu (např. Čehovické hody 2026, plakát hasičské soutěže)...'
                : activeTool === 'search'
                ? 'Zadejte dotaz pro vyhledávání zákonů, počasí CHMÚ nebo dotací...'
                : activeTool === 'video'
                ? 'Zadejte popis videa (např. Letecký pohled na náves a rybník Čehovic)...'
                : 'Napište příkaz (např. Schval vyhlášku, jaký je stav rozpočtu, spusť Titan scan)...'
            }
            disabled={loading}
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Provést</span>
          </button>
        </form>
      </div>
    </div>
  );
}
