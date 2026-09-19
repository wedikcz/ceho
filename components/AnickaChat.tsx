'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  ChevronDown,
  Trash2,
  FileCheck,
  Calendar,
  Volume2,
  VolumeX,
  Play,
  Pause,
} from 'lucide-react';
import Link from 'next/link';

interface ChatMessage {
  id: string;
  sender: 'user' | 'anicka';
  text: string;
  timestamp: string;
  actionTool?: {
    type: 'report_fault' | 'create_submission' | 'check_hours';
    label: string;
    url: string;
  };
}

export default function AnickaChat() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [proactiveNotification, setProactiveNotification] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [activeWidget, setActiveWidget] = useState<'none' | 'calendar' | 'radio'>('none');
  const [radioSpeaking, setRadioSpeaking] = useState<string | null>(null);
  const [ttsSpeaking, setTtsSpeaking] = useState<string | null>(null);

  const speakText = (text: string, id: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (ttsSpeaking === id) {
        window.speechSynthesis.cancel();
        setTtsSpeaking(null);
        return;
      }
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/\*\*|\[[^\]]+\]\([^)]+\)/g, ''); // strip markdown
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'cs-CZ';
      utterance.rate = 1.0;
      utterance.onend = () => {
        setTtsSpeaking(null);
      };
      utterance.onerror = () => {
        setTtsSpeaking(null);
      };
      setTtsSpeaking(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'anicka',
      text: 'Dobrý den! Jsem **Anička**, oficiální AI asistentka obce Čehovice. Ráda vám pomohu s informacemi o svozu odpadu, poplatcích, úředních hodinách či nahlášením závady. Na co se chcete zeptat?',
      timestamp: 'Právě teď',
    },
  ]);

  // Contextual Proactive Hint on route change
  useEffect(() => {
    let hint: string | null = null;
    if (pathname === '/nahlasit-zavadu') {
      hint = 'Jste v hlášení závad. Můžete připojit i GPS polohu a fotografii rozbité lampy!';
    } else if (pathname === '/podatelna') {
      hint = 'Potřebujete poradit se strukturou žádosti podle zákona 106 nebo kácení stromu?';
    } else if (pathname === '/zivotni-situace') {
      hint = 'Hledáte informace k poplatku za psa nebo svoz odpadu? Ráda spočítám částku.';
    } else if (pathname === '/urad') {
      hint = 'Úřední hodiny pro veřejnost jsou v Pondělí a Středu od 16:00 do 18:00.';
    }

    if (hint) {
      setProactiveNotification(hint);
      const timer = setTimeout(() => setProactiveNotification(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickQuestions = [
    'Kdy se vyváží popelnice?',
    'Kdy má otevřeno úřad?',
    'Jak zaplatit poplatek za psa?',
    'Kontakty na starostu',
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/anicka/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          currentPage: pathname,
          history: messages.slice(-4),
        }),
      });

      const data = await res.json();
      const replyText = data.reply || 'Omlouvám se, došlo k chybě při generování odpovědi.';

      // Determine if a helpful action tool should be suggested
      let actionTool: ChatMessage['actionTool'] = undefined;
      const lower = textToSend.toLowerCase();
      if (lower.includes('závad') || lower.includes('lampa') || lower.includes('výtluk')) {
        actionTool = {
          type: 'report_fault',
          label: 'Přejít na formulář Nahlásit závadu',
          url: '/nahlasit-zavadu',
        };
      } else if (lower.includes('žádost') || lower.includes('podat') || lower.includes('106')) {
        actionTool = {
          type: 'create_submission',
          label: 'Otevřít Digitální podatelnu',
          url: '/podatelna',
        };
      }

      const anickaMsg: ChatMessage = {
        id: `anicka-${Date.now()}`,
        sender: 'anicka',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }),
        actionTool,
      };

      setMessages((prev) => [...prev, anickaMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'anicka',
          text: 'Omlouvám se, dočasně se nepodařilo spojit se serverem obce. Zkuste to prosím za okamžik nebo kontaktujte úřad přímo.',
          timestamp: 'Nyní',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Simple Markdown link and bold parser
  const renderFormattedText = (content: string) => {
    // Replace [label](url) with Next.js Link
    const parts = content.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith('[') && part.includes('](')) {
        const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
          const [, label, url] = match;
          return (
            <Link
              key={index}
              href={url}
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 mx-1"
            >
              {label} <ExternalLink className="w-3 h-3" />
            </Link>
          );
        }
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {/* Proactive Speech Bubble if visible and chat closed */}
        {!isOpen && proactiveNotification && (
          <div
            onClick={() => setIsOpen(true)}
            className="mb-2 max-w-xs bg-slate-900 border border-amber-400/40 p-3 rounded-2xl shadow-xl text-xs text-slate-200 cursor-pointer animate-bounce glass-panel relative group"
            role="alert"
          >
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-400 block text-[11px] uppercase tracking-wider">
                  Anička radí
                </span>
                <p className="mt-0.5 leading-snug">{proactiveNotification}</p>
              </div>
            </div>
            <div className="absolute -bottom-2 right-6 w-3 h-3 bg-slate-900 border-r border-b border-amber-400/40 transform rotate-45" />
          </div>
        )}

        <button
          id="anicka-chat-toggle-btn"
          onClick={() => {
            setIsOpen(!isOpen);
            setProactiveNotification(null);
          }}
          className={`relative p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 flex items-center justify-center ${
            isOpen
              ? 'bg-slate-900 text-slate-300 border border-slate-700 hover:text-white'
              : 'bg-gradient-to-tr from-sky-600 via-sky-500 to-amber-500 text-slate-950 font-bold shadow-sky-500/30 hover:scale-105 border-2 border-white/20'
          }`}
          aria-label={isOpen ? 'Zavřít chat s asistentkou Aničkou' : 'Otevřít chat s asistentkou Aničkou'}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          {/* Aurora Glow Ring */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-sky-400 to-amber-400 opacity-60 blur-md animate-pulse" />
          )}

          <div className="relative z-10 flex items-center gap-2">
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <>
                <Bot className="w-6 h-6 text-slate-950" />
                <span className="hidden md:inline font-bold text-xs tracking-tight text-slate-950 uppercase pr-1">
                  Anička AI
                </span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Floating Chat Modal Panel */}
      {isOpen && (
        <div
          id="anicka-chat-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="anicka-chat-title"
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[82vh] bg-slate-950/90 border border-sky-400/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden glass-panel animate-fade-up"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-sky-950/80 via-slate-900 to-amber-950/70 border-b border-sky-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
              </div>
              <div>
                <h3 id="anicka-chat-title" className="font-bold text-sm text-white flex items-center gap-1.5">
                  Anička • Asistentka obce
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <p className="text-[11px] text-sky-300 font-sans">
                  Deterministická AI • RAG báze Čehovice 2027
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: `init-${Date.now()}`,
                      sender: 'anicka',
                      text: 'Konverzace byla vyčištěna. Čím vám mohu dnes v Čehovicích pomoci?',
                      timestamp: 'Nyní',
                    },
                  ])
                }
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Vymazat historii zpráv"
                aria-label="Vymazat konverzaci"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Minimalizovat okno chatu"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="p-2.5 bg-slate-900/50 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800/80 text-sky-200 hover:text-white hover:bg-sky-600/30 border border-sky-500/20 transition-all shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Interactive Widgets Control Bar */}
          <div className="p-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-1.5 px-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide font-mono">
              Rychlé nástroje:
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setActiveWidget(activeWidget === 'calendar' ? 'none' : 'calendar')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all border ${
                  activeWidget === 'calendar'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-950 text-amber-400 border-amber-500/20 hover:border-amber-400/50'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>Svoz odpadu</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveWidget(activeWidget === 'radio' ? 'none' : 'radio')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all border ${
                  activeWidget === 'radio'
                    ? 'bg-sky-500 text-slate-950 border-sky-400'
                    : 'bg-slate-950 text-sky-300 border-sky-500/20 hover:border-sky-400/50'
                }`}
              >
                <Volume2 className="w-3 h-3" />
                <span>Obecní rozhlas</span>
              </button>
            </div>
          </div>

          {/* Widget Panel Area */}
          {activeWidget === 'calendar' && (
            <div className="p-3 bg-slate-900 border-b border-sky-500/20 text-xs space-y-2.5 animate-fade-in shrink-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Svozový kalendář Čehovice
                </span>
                <button
                  type="button"
                  onClick={() => speakText("Svozový kalendář Čehovice. Nejbližší termíny svozu jsou: Komunální odpad v neděli dvacátého září. Bioodpad v úterý dvaadvacátého září. Žlutý popel na plasty ve čtvrtek čtyřiadvacátého září. Modrý popel na papír v pondělí osmadvacátého září.", "widget-cal")}
                  className={`p-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 ${ttsSpeaking === 'widget-cal' ? 'text-rose-400 border-rose-500/30' : 'text-slate-300'}`}
                  title="Přečíst termíny svozů nahlas"
                >
                  {ttsSpeaking === 'widget-cal' ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <div className="p-1.5 rounded-lg bg-slate-950 border-l-4 border-yellow-400 text-slate-300">
                  <span className="font-bold text-yellow-400 block">Plasty (žlutý)</span>
                  Čtvrtek 24. 9. 2026
                  <span className="text-[9px] text-slate-500 block">Za 6 dní</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950 border-l-4 border-sky-400 text-slate-300">
                  <span className="font-bold text-sky-400 block">Papír (modrý)</span>
                  Pondělí 28. 9. 2026
                  <span className="text-[9px] text-slate-500 block">Za 10 dní</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950 border-l-4 border-amber-700 text-slate-300">
                  <span className="font-bold text-amber-600 block">Bioodpad (hnědý)</span>
                  Úterý 22. 9. 2026
                  <span className="text-[9px] text-slate-500 block">Za 4 dny</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950 border-l-4 border-slate-600 text-slate-300">
                  <span className="font-bold text-slate-300 block">Komunální (černý)</span>
                  Neděle 20. 9. 2026
                  <span className="text-[9px] text-amber-400 font-bold block">Za 2 dny</span>
                </div>
              </div>
            </div>
          )}

          {activeWidget === 'radio' && (
            <div className="p-3 bg-slate-900 border-b border-sky-500/20 text-xs space-y-2 animate-fade-in shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-white flex items-center gap-1 text-[11px]">
                  <Volume2 className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                  Místní rozhlas Čehovice
                </span>
                <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">TTS audio syntéza</span>
              </div>

              <div className="space-y-1.5">
                {[
                  {
                    id: "rad-1",
                    title: "Očkování psů a koček v obci Čehovice",
                    text: "Upozorňujeme majitele, že tuto sobotu od devíti do jedenácti hodin dopoledne proběhne u budovy obecního úřadu povinné očkování psů a koček proti vzteklině."
                  },
                  {
                    id: "rad-2",
                    title: "Plánovaná odstávka pitné vody",
                    text: "Z důvodu opravy hlavního řadu proběhne v pátek pětadvacátého září od osmi do dvanácti hodin plánovaná odstávka dodávek pitné vody v horní části obce."
                  }
                ].map((item) => (
                  <div key={item.id} className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex-1 space-y-0.5 min-w-0">
                      <h4 className="font-bold text-white text-[10px] truncate">{item.title}</h4>
                      <p className="text-[9px] text-slate-400 line-clamp-1">{item.text}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakText(item.text, item.id)}
                      className={`p-1 rounded-lg border transition-all shrink-0 ${
                        ttsSpeaking === item.id
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-sky-300'
                      }`}
                      title={ttsSpeaking === item.id ? "Zastavit" : "Přehrát rozhlasové hlášení"}
                    >
                      {ttsSpeaking === item.id ? <VolumeX className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages Stream Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'anicka' && (
                  <div className="w-7 h-7 rounded-lg bg-sky-600/30 border border-sky-400/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-br-xs'
                      : 'bg-slate-900/90 border border-sky-400/20 text-slate-200 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{renderFormattedText(msg.text)}</div>

                  {/* Optional Action Tool Button */}
                  {msg.actionTool && (
                    <div className="mt-2.5 pt-2 border-t border-sky-500/20">
                      <Link
                        href={msg.actionTool.url}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 text-xs font-semibold transition-colors"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>{msg.actionTool.label}</span>
                      </Link>
                    </div>
                  )}

                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-amber-950/70' : 'text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-amber-500/30 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs italic">
                <div className="w-7 h-7 rounded-lg bg-sky-600/30 border border-sky-400/40 text-amber-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900/80 p-2.5 rounded-xl border border-sky-500/20">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Anička prohledává ověřená data obce...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-950 border-t border-sky-500/20 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Zeptejte se na svoz, starosta, poplatky..."
              className="flex-1 bg-slate-900 border border-sky-500/30 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20 shrink-0"
              aria-label="Odeslat dotaz asistentce"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
