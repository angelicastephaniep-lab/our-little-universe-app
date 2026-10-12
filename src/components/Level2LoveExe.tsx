import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Terminal as TerminalIcon, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Command,
  Copy,
  Check,
  CornerDownLeft,
  HelpCircle,
  Activity,
  Code2
} from 'lucide-react';
import { Language, TerminalMessage, UI_STRINGS } from '../customization';
import { soundManager } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface Level2LoveExeProps {
  messages: TerminalMessage[];
  lang: Language;
  onComplete: () => void;
  onProceedToLevel3: () => void;
  isAlreadyCompleted: boolean;
}

interface ConsoleEntry {
  id: string;
  type: 'banner' | 'prompt' | 'system' | 'info' | 'success' | 'heart' | 'special' | 'error' | 'code';
  text: string;
}

export const Level2LoveExe: React.FC<Level2LoveExeProps> = ({
  messages,
  lang,
  onComplete,
  onProceedToLevel3,
  isAlreadyCompleted,
}) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'sourceCode'>('terminal');
  const [hasCopiedCode, setHasCopiedCode] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isExecutingSequence, setIsExecutingSequence] = useState<boolean>(false);
  const [hasCompletedExecution, setHasCompletedExecution] = useState<boolean>(false);
  
  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const sequenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const strings = UI_STRINGS;
  const { isGreen } = useTheme();

  const romanticTypeScriptCode = `/**
 * @file love_universe.ts
 * @author Tu Novia 💜
 * @description Compilado con devoción infinita para mi persona favorita.
 */

interface HeartState {
  recipient: "Mi Amor";
  status: "Enamorada 100%";
  bugs: 0;
  forever: true;
}

async function executeLove(): Promise<void> {
  const love = new Universe({
    target: "Tú",
    mode: "Infinito",
  });

  while (true) {
    await love.cherishEveryMoment();
    await love.holdYourHand();
    await love.admireYourPassion();
  }
}

// Ejecución automática
executeLove().catch((err) => {
  // Error 404: Corazón no encontrado sin ti
  console.error("Solo tú tienes la clave de este sistema 💜");
});`;

  // Initial greeting lines when arriving in Level 2
  const getInitialEntries = (): ConsoleEntry[] => {
    const list: ConsoleEntry[] = [
      {
        id: 'init-1',
        type: 'banner',
        text: 'Welcome to HeartOS (GNU/Linux 6.9-romantic x86_64)',
      },
      {
        id: 'init-2',
        type: 'system',
        text: lang === 'es'
          ? 'Terminal de sentimientos • Sesión iniciada: adonys@our-universe'
          : 'Feelings terminal • Active session: adonys@our-universe',
      },
      {
        id: 'init-3',
        type: 'info',
        text: lang === 'es'
          ? 'Consola interactiva lista. Escribe "help" para ver la lista de comandos o ejecuta "love.exe".'
          : 'Interactive console ready. Type "help" to see available commands or run "love.exe".',
      },
    ];

    return list;
  };

  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>(getInitialEntries);

  // Auto scroll terminal to bottom when new entries arrive
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleEntries, isExecutingSequence]);

  // Clean up any pending sequence timers on unmount
  useEffect(() => {
    return () => {
      if (sequenceTimerRef.current) {
        clearTimeout(sequenceTimerRef.current);
      }
    };
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(romanticTypeScriptCode);
    setHasCopiedCode(true);
    soundManager.playChime();
    setTimeout(() => setHasCopiedCode(false), 2000);
  };

  // Run the special LOVE.EXE sequence progressively upon user action
  const runLoveExeSequence = () => {
    if (isExecutingSequence) return;
    setIsExecutingSequence(true);
    soundManager.playKeyClick();

    // Add starting indicator
    setConsoleEntries(prev => [
      ...prev,
      {
        id: `start-exec-${Date.now()}`,
        type: 'system',
        text: lang === 'es'
          ? 'Compilando y enlazando módulos de amor en tiempo real...'
          : 'Compiling & linking love modules in real time...',
      },
    ]);

    let step = 0;

    const playNextMessage = () => {
      if (step < messages.length) {
        const currentMsg = messages[step];
        soundManager.playKeyClick();

        setConsoleEntries(prev => [
          ...prev,
          {
            id: `msg-${step}-${Date.now()}`,
            type: currentMsg.type as ConsoleEntry['type'],
            text: currentMsg.text[lang],
          },
        ]);

        const delay = currentMsg.delayMs || 650;
        step++;
        sequenceTimerRef.current = setTimeout(playNextMessage, delay);
      } else {
        // Sequence completed!
        setIsExecutingSequence(false);
        setHasCompletedExecution(true);
        soundManager.playSuccess();

        // Celebration confetti
        try {
          confetti({
            particleCount: 65,
            spread: 70,
            origin: { y: 0.7 },
            colors: isGreen
              ? ['#2d6a4f', '#52b788', '#74c69d', '#95d5b2', '#fefae0']
              : ['#c084fc', '#d946ef', '#f472b6', '#a855f7'],
          });
        } catch {
          // safe confetti fallback
        }

        // Add finishing confirmation lines
        setConsoleEntries(prev => [
          ...prev,
          {
            id: `exit-${Date.now()}`,
            type: 'success',
            text: lang === 'es'
              ? 'Proceso finalizado con éxito [exit code: 0].'
              : 'Process finished successfully [exit code: 0].',
          },
          {
            id: `done-${Date.now()}`,
            type: 'heart',
            text: lang === 'es'
              ? 'Listo. Amor infinito en ejecución continua. ¡Nivel 2 completado! 💜✨'
              : 'Ready. Infinite love running continuously. Level 2 completed! 💜✨',
          },
        ]);

        onComplete();
        setTimeout(() => {
          if (inputRef.current) inputRef.current.focus();
        }, 100);
      }
    };

    sequenceTimerRef.current = setTimeout(playNextMessage, 500);
  };

  // Process user command
  const executeCommand = (rawCommand: string) => {
    const trimmed = rawCommand.trim();
    if (!trimmed || isExecutingSequence) return;

    soundManager.playKeyClick();

    // Save to history
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Echo command in terminal
    const cmdEntry: ConsoleEntry = {
      id: `cmd-${Date.now()}`,
      type: 'prompt',
      text: `$ ${trimmed}`,
    };

    const lower = trimmed.toLowerCase();

    // Check commands
    if (
      lower === 'love.exe' ||
      lower === './love.exe' ||
      lower === 'love.exe --run' ||
      lower === 'run' ||
      lower === 'love' ||
      lower === 'exec love.exe' ||
      lower === 'node love.js' ||
      lower === 'npm run love'
    ) {
      setConsoleEntries(prev => [...prev, cmdEntry]);
      runLoveExeSequence();
      return;
    }

    if (lower === 'help' || lower === '?' || lower === '--help' || lower === '-h' || lower === 'man' || lower === 'commands') {
      const helpEntries: ConsoleEntry[] = [
        cmdEntry,
        {
          id: `help-head-${Date.now()}`,
          type: 'system',
          text: lang === 'es' ? '📋 COMANDOS DISPONIBLES EN HEARTOS:' : '📋 AVAILABLE COMMANDS IN HEARTOS:',
        },
        {
          id: `help-1-${Date.now()}`,
          type: 'info',
          text: lang === 'es'
            ? '  • love.exe (o love.exe --run)  : Compilar y ejecutar el algoritmo de amor infinito'
            : '  • love.exe (or love.exe --run) : Compile and execute the infinite love algorithm',
        },
        {
          id: `help-2-${Date.now()}`,
          type: 'info',
          text: lang === 'es'
            ? '  • help                         : Mostrar esta lista de comandos admitidos'
            : '  • help                         : Show this list of supported commands',
        },
        {
          id: `help-3-${Date.now()}`,
          type: 'info',
          text: lang === 'es'
            ? '  • status                       : Inspeccionar el estado del sistema y del corazón'
            : '  • status                       : Inspect the state of the system and heart',
        },
        {
          id: `help-4-${Date.now()}`,
          type: 'info',
          text: lang === 'es'
            ? '  • cat love_universe.ts         : Inspeccionar el código fuente TypeScript'
            : '  • cat love_universe.ts         : Inspect the TypeScript source code',
        },
        {
          id: `help-5-${Date.now()}`,
          type: 'info',
          text: lang === 'es'
            ? '  • whoami                       : Conocer quién tiene acceso al sistema'
            : '  • whoami                       : See who has access to the system',
        },
        {
          id: `help-6-${Date.now()}`,
          type: 'info',
          text: lang === 'es'
            ? '  • clear                        : Limpiar la pantalla de la consola'
            : '  • clear                        : Clear the terminal console screen',
        },
      ];
      setConsoleEntries(prev => [...prev, ...helpEntries]);
      return;
    }

    if (lower === 'clear' || lower === 'cls') {
      soundManager.playChime();
      setConsoleEntries([
        {
          id: `clear-head-${Date.now()}`,
          type: 'banner',
          text: 'Welcome to HeartOS (GNU/Linux 6.9-romantic x86_64)',
        },
        {
          id: `clear-sub-${Date.now()}`,
          type: 'system',
          text: lang === 'es'
            ? 'Consola limpia. Escribe "help" o ejecuta "love.exe".'
            : 'Console cleared. Type "help" or run "love.exe".',
        },
      ]);
      return;
    }

    if (lower === 'status' || lower === 'top' || lower === 'htop' || lower === 'ps') {
      const isDone = hasCompletedExecution;
      const statusEntries: ConsoleEntry[] = [
        cmdEntry,
        {
          id: `st-1-${Date.now()}`,
          type: 'system',
          text: '[SYS] CPU Core: 100% pensando en Adonys',
        },
        {
          id: `st-2-${Date.now()}`,
          type: 'system',
          text: '[SYS] Memoria RAM: Inundada de recuerdos hermosos y sonrisas',
        },
        {
          id: `st-3-${Date.now()}`,
          type: 'system',
          text: '[SYS] Protocolo Heartbeat (TLS v1.3): Conexión segura activa (Latencia: 0ms)',
        },
        {
          id: `st-4-${Date.now()}`,
          type: isDone ? 'heart' : 'info',
          text: isDone
            ? (lang === 'es' ? '[STATUS] LOVE.EXE: En ejecución continua 💜 (0 bugs detectados)' : '[STATUS] LOVE.EXE: Running continuously 💜 (0 bugs detected)')
            : (lang === 'es' ? '[STATUS] LOVE.EXE: Listo para compilar (ejecuta "love.exe")' : '[STATUS] LOVE.EXE: Ready to compile (run "love.exe")'),
        },
      ];
      setConsoleEntries(prev => [...prev, ...statusEntries]);
      return;
    }

    if (
      lower === 'cat love_universe.ts' ||
      lower === 'cat' ||
      lower === 'code' ||
      lower === 'source' ||
      lower === 'view code'
    ) {
      const codeEntries: ConsoleEntry[] = [
        cmdEntry,
        {
          id: `cat-1-${Date.now()}`,
          type: 'system',
          text: lang === 'es'
            ? 'Leyendo love_universe.ts... (Abriendo también la pestaña "Ver código fuente")'
            : 'Reading love_universe.ts... (Also opening "View source code" tab)',
        },
        {
          id: `cat-2-${Date.now()}`,
          type: 'code',
          text: romanticTypeScriptCode,
        },
      ];
      setConsoleEntries(prev => [...prev, ...codeEntries]);
      setActiveTab('sourceCode');
      return;
    }

    if (lower === 'whoami') {
      setConsoleEntries(prev => [
        ...prev,
        cmdEntry,
        {
          id: `who-${Date.now()}`,
          type: 'heart',
          text: lang === 'es'
            ? 'Adonys 💜 — Dueño absoluto de este corazón y de este universo.'
            : 'Adonys 💜 — Absolute owner of this heart and this universe.',
        },
      ]);
      return;
    }

    if (lower === 'date') {
      setConsoleEntries(prev => [
        ...prev,
        cmdEntry,
        {
          id: `date-${Date.now()}`,
          type: 'info',
          text: lang === 'es'
            ? 'Tiempo: Una eternidad juntos, y apenas estamos comenzando. ✨'
            : 'Time: An eternity together, and we are just getting started. ✨',
        },
      ]);
      return;
    }

    // Unrecognized command
    setConsoleEntries(prev => [
      ...prev,
      cmdEntry,
      {
        id: `err-${Date.now()}`,
        type: 'error',
        text: lang === 'es'
          ? `bash: comando no reconocido: "${trimmed}". Escribe "help" para ver los comandos válidos o ejecuta "love.exe".`
          : `bash: command not recognized: "${trimmed}". Type "help" to see available commands or run "love.exe".`,
      },
    ]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const cmd = inputValue;
    setInputValue('');
    executeCommand(cmd);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputValue(commandHistory[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputValue('');
      } else {
        setHistoryIndex(nextIndex);
        setInputValue(commandHistory[nextIndex] || '');
      }
    }
  };

  const handleQuickCommand = (cmd: string) => {
    setInputValue('');
    executeCommand(cmd);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleRestart = () => {
    soundManager.playChime();
    setConsoleEntries([
      {
        id: `restart-1-${Date.now()}`,
        type: 'banner',
        text: 'Welcome to HeartOS (GNU/Linux 6.9-romantic x86_64)',
      },
      {
        id: `restart-2-${Date.now()}`,
        type: 'system',
        text: lang === 'es'
          ? 'Reiniciando terminal... Sesión lista: adonys@our-universe'
          : 'Restarting terminal... Session ready: adonys@our-universe',
      },
      {
        id: `restart-3-${Date.now()}`,
        type: 'info',
        text: lang === 'es'
          ? 'Escribe "help" o ejecuta "love.exe" cuando desees.'
          : 'Type "help" or run "love.exe" whenever you wish.',
      },
    ]);
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Header Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
          isGreen
            ? 'bg-[#1b4332]/60 border-[#52b788]/40 text-[#d8f3dc]'
            : 'bg-fuchsia-950/60 border-fuchsia-400/30 text-fuchsia-200'
        }`}>
          <Sparkles className={`w-3.5 h-3.5 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'}`} />
          <span>{lang === 'es' ? 'Desafío 2 de 3: Código y Corazón' : 'Challenge 2 of 3: Code & Heart'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'terminal'
                ? isGreen
                  ? 'bg-[#2d6a4f] text-[#fefae0] shadow-sm font-semibold'
                  : 'bg-purple-600 text-white shadow-sm font-semibold'
                : isGreen
                ? 'text-[#a3b18a] hover:text-white bg-[#0a2016]/60'
                : 'text-purple-300/70 hover:text-white bg-purple-950/40'
            }`}
          >
            {strings.level2.terminalTab[lang]}
          </button>
          <button
            onClick={() => setActiveTab('sourceCode')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'sourceCode'
                ? isGreen
                  ? 'bg-[#2d6a4f] text-[#fefae0] shadow-sm font-semibold'
                  : 'bg-purple-600 text-white shadow-sm font-semibold'
                : isGreen
                ? 'text-[#a3b18a] hover:text-white bg-[#0a2016]/60'
                : 'text-purple-300/70 hover:text-white bg-purple-950/40'
            }`}
          >
            {strings.level2.viewCodeTab[lang]}
          </button>
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="text-center sm:text-left mb-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-2 flex items-center justify-center sm:justify-start gap-2">
          <span>{strings.level2.title[lang]}</span>
          <TerminalIcon className={`w-7 h-7 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'}`} />
        </h2>
        <p className={`text-sm sm:text-base ${isGreen ? 'text-[#d8f3dc]' : 'text-purple-200/80'}`}>
          {strings.level2.subtitle[lang]}
        </p>
      </div>

      {/* Main Terminal Window */}
      <div 
        onClick={() => {
          if (activeTab === 'terminal' && inputRef.current && !isExecutingSequence) {
            inputRef.current.focus();
          }
        }}
        className={`rounded-2xl overflow-hidden border backdrop-blur-md mb-6 shadow-2xl transition-all ${
          isGreen
            ? 'border-[#52b788]/30 bg-[#05140d]/95 shadow-[0_0_40px_rgba(45,106,79,0.35)]'
            : 'border-purple-500/40 bg-[#0d071a]/95 shadow-[0_0_40px_rgba(147,51,234,0.3)]'
        }`}
      >
        {/* Terminal Title Bar */}
        <div className={`px-4 py-3 border-b flex items-center justify-between ${
          isGreen ? 'bg-[#0d2818] border-[#52b788]/20' : 'bg-[#190d30] border-purple-500/20'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
            <span className={`ml-3 text-xs font-mono-code font-medium hidden sm:inline ${
              isGreen ? 'text-[#a3b18a]' : 'text-purple-300/80'
            }`}>
              {strings.level2.terminalTitle[lang]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isExecutingSequence ? (
              <span className={`flex items-center gap-1.5 text-[11px] font-mono-code ${
                isGreen ? 'text-[#74c69d]' : 'text-fuchsia-300'
              }`}>
                <span className={`w-2 h-2 rounded-full animate-ping ${isGreen ? 'bg-[#52b788]' : 'bg-fuchsia-400'}`} />
                {strings.level2.runningStatus[lang]}
              </span>
            ) : hasCompletedExecution ? (
              <span className="flex items-center gap-1 text-[11px] font-mono-code text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>exit code: 0</span>
              </span>
            ) : (
              <span className={`flex items-center gap-1 text-[11px] font-mono-code ${
                isGreen ? 'text-[#a3b18a]' : 'text-purple-300/80'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isGreen ? 'bg-[#52b788]' : 'bg-purple-400'}`} />
                <span>interactive</span>
              </span>
            )}
          </div>
        </div>

        {/* Tab Content: Terminal Console or Source Code */}
        {activeTab === 'terminal' ? (
          <div className={`p-4 sm:p-6 font-mono-code text-xs sm:text-sm min-h-[350px] max-h-[480px] overflow-y-auto space-y-2.5 ${
            isGreen ? 'selection:bg-[#1b4332]' : 'selection:bg-purple-800'
          }`}>
            {/* Render executed messages and outputs */}
            {consoleEntries.map((entry) => {
              if (entry.type === 'banner') {
                return (
                  <div key={entry.id} className={`pb-2 border-b text-xs font-semibold ${
                    isGreen ? 'text-[#a3b18a]/90 border-[#1b4332]' : 'text-purple-400/90 border-purple-900/40'
                  }`}>
                    {entry.text}
                  </div>
                );
              }

              if (entry.type === 'prompt') {
                return (
                  <div key={entry.id} className="flex items-center gap-2 text-white font-semibold pt-1">
                    <span className={isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'}>
                      adonys@our-universe:~$
                    </span>
                    <span className="text-white">{entry.text.replace(/^\$\s*/, '')}</span>
                  </div>
                );
              }

              if (entry.type === 'code') {
                return (
                  <pre key={entry.id} className={`p-3 rounded-lg border my-2 overflow-x-auto text-xs ${
                    isGreen ? 'bg-[#040f09] border-[#52b788]/30 text-[#d8f3dc]' : 'bg-[#090412] border-purple-500/30 text-purple-200'
                  }`}>
                    <code>{entry.text}</code>
                  </pre>
                );
              }

              let badgeColor = isGreen
                ? 'text-[#a3b18a] border-[#52b788]/30 bg-[#0a2016]'
                : 'text-purple-300 border-purple-500/40 bg-purple-950/60';
              let badgeText = '[INFO]';
              let textColor = isGreen ? 'text-[#fbf6ee]' : 'text-purple-100';

              if (entry.type === 'system') {
                badgeColor = 'text-cyan-300 border-cyan-500/40 bg-cyan-950/60';
                badgeText = '[SYS]';
                textColor = 'text-cyan-100';
              } else if (entry.type === 'success') {
                badgeColor = 'text-emerald-300 border-emerald-500/40 bg-emerald-950/60';
                badgeText = '[OK]';
                textColor = 'text-emerald-200';
              } else if (entry.type === 'heart') {
                badgeColor = isGreen
                  ? 'text-[#95d5b2] border-[#52b788]/50 bg-[#1b4332]'
                  : 'text-fuchsia-300 border-fuchsia-500/40 bg-fuchsia-950/60';
                badgeText = '[LOVE]';
                textColor = isGreen ? 'text-[#95d5b2] font-semibold' : 'text-fuchsia-200 font-semibold';
              } else if (entry.type === 'special') {
                badgeColor = 'text-amber-300 border-amber-500/40 bg-amber-950/60';
                badgeText = '[EXEC]';
                textColor = 'text-amber-100';
              } else if (entry.type === 'error') {
                badgeColor = 'text-rose-300 border-rose-500/40 bg-rose-950/60';
                badgeText = '[ERR]';
                textColor = 'text-rose-200';
              }

              return (
                <div key={entry.id} className="flex items-start gap-2.5 leading-relaxed animate-fadeIn">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 ${badgeColor}`}>
                    {badgeText}
                  </span>
                  <span className={`${textColor} break-words whitespace-pre-line`}>
                    {entry.text}
                  </span>
                </div>
              );
            })}

            {/* Interactive Command Prompt Line */}
            <form onSubmit={handleFormSubmit} className="pt-2 flex items-center gap-2">
              <span className={`font-bold shrink-0 text-xs sm:text-sm ${
                isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'
              }`}>
                adonys@our-universe:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isExecutingSequence}
                placeholder={
                  isExecutingSequence
                    ? (lang === 'es' ? 'Compilando LOVE.EXE...' : 'Compiling LOVE.EXE...')
                    : (lang === 'es' ? 'Escribe "help" o "love.exe"...' : 'Type "help" or "love.exe"...')
                }
                className={`flex-1 bg-transparent border-none outline-none font-mono-code text-xs sm:text-sm text-white placeholder:text-opacity-40 ${
                  isGreen
                    ? 'placeholder:text-[#a3b18a]'
                    : 'placeholder:text-purple-400'
                } disabled:opacity-50`}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              <button
                type="submit"
                disabled={isExecutingSequence || !inputValue.trim()}
                title="Ejecutar comando (Enter)"
                className={`p-1.5 rounded-md transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                  isGreen
                    ? 'bg-[#1b4332] hover:bg-[#2d6a4f] text-[#d8f3dc]'
                    : 'bg-purple-800 hover:bg-purple-700 text-purple-100'
                }`}
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </form>

            <div ref={terminalEndRef} />
          </div>
        ) : (
          <div className={`p-4 sm:p-6 font-mono-code text-xs sm:text-sm min-h-[350px] max-h-[480px] overflow-y-auto relative ${
            isGreen ? 'bg-[#040f09]' : 'bg-[#090412]'
          }`}>
            <button
              onClick={handleCopyCode}
              className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                isGreen
                  ? 'bg-[#1b4332]/80 hover:bg-[#2d6a4f] border-[#52b788]/30 text-[#d8f3dc]'
                  : 'bg-purple-900/60 hover:bg-purple-800 border-purple-400/30 text-purple-200'
              }`}
            >
              {hasCopiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopiedCode ? (lang === 'es' ? '¡Copiado!' : 'Copied!') : (lang === 'es' ? 'Copiar código' : 'Copy code')}</span>
            </button>
            <pre className={`leading-relaxed overflow-x-auto ${isGreen ? 'text-[#d8f3dc]' : 'text-purple-200/90'}`}>
              <code>{romanticTypeScriptCode}</code>
            </pre>
          </div>
        )}

        {/* Terminal Bottom Action Bar */}
        <div className={`px-4 py-3 border-t flex flex-wrap items-center justify-between gap-3 ${
          isGreen ? 'bg-[#0a2016] border-[#52b788]/20' : 'bg-[#140a28] border-purple-500/20'
        }`}>
          {/* Quick command clickable buttons */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className={`text-[11px] font-mono-code flex items-center gap-1 shrink-0 ${
              isGreen ? 'text-[#a3b18a]' : 'text-purple-400/70'
            }`}>
              <Command className="w-3 h-3" />
              <span className="hidden sm:inline">{lang === 'es' ? 'Comandos:' : 'Commands:'}</span>
            </span>

            <button
              onClick={() => handleQuickCommand('love.exe')}
              disabled={isExecutingSequence}
              className={`px-2.5 py-1 rounded text-[11px] font-mono-code border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isGreen
                  ? 'bg-[#1b4332]/80 hover:bg-[#2d6a4f] text-[#d8f3dc] border-[#52b788]/40 hover:shadow-[0_0_10px_rgba(82,183,136,0.3)]'
                  : 'bg-purple-900/70 hover:bg-purple-800 text-purple-100 border-purple-400/30 hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]'
              }`}
            >
              $ love.exe
            </button>

            <button
              onClick={() => handleQuickCommand('help')}
              disabled={isExecutingSequence}
              className={`px-2.5 py-1 rounded text-[11px] font-mono-code border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 ${
                isGreen
                  ? 'bg-[#1b4332]/60 hover:bg-[#2d6a4f]/70 text-[#d8f3dc] border-[#52b788]/30'
                  : 'bg-purple-900/50 hover:bg-purple-800/70 text-purple-200 border-purple-500/20'
              }`}
            >
              <HelpCircle className="w-2.5 h-2.5" />
              <span>$ help</span>
            </button>

            <button
              onClick={() => handleQuickCommand('status')}
              disabled={isExecutingSequence}
              className={`px-2.5 py-1 rounded text-[11px] font-mono-code border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 ${
                isGreen
                  ? 'bg-[#1b4332]/60 hover:bg-[#2d6a4f]/70 text-[#d8f3dc] border-[#52b788]/30'
                  : 'bg-purple-900/50 hover:bg-purple-800/70 text-purple-200 border-purple-500/20'
              }`}
            >
              <Activity className="w-2.5 h-2.5" />
              <span>$ status</span>
            </button>

            <button
              onClick={() => handleQuickCommand('clear')}
              disabled={isExecutingSequence}
              className={`px-2.5 py-1 rounded text-[11px] font-mono-code border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isGreen
                  ? 'bg-[#1b4332]/60 hover:bg-[#2d6a4f]/70 text-[#d8f3dc] border-[#52b788]/30'
                  : 'bg-purple-900/50 hover:bg-purple-800/70 text-purple-200 border-purple-500/20'
              }`}
            >
              $ clear
            </button>
          </div>

          {/* Reset / Run Again Button */}
          <button
            onClick={handleRestart}
            disabled={isExecutingSequence}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-medium transition-all border cursor-pointer shadow-sm disabled:opacity-50 ${
              isGreen
                ? 'bg-[#1b4332] hover:bg-[#2d6a4f] border-[#52b788]/40 text-[#fefae0]'
                : 'bg-purple-800/70 hover:bg-purple-700 border-purple-400/30 text-purple-100'
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isExecutingSequence ? 'animate-spin' : ''}`} />
            <span>{strings.level2.runAgain[lang]}</span>
          </button>
        </div>
      </div>

      {/* Completion & Next Level Card */}
      {hasCompletedExecution && (
        <div className={`glass-panel p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn shadow-xl ${
          isGreen ? 'border-[#52b788]/40 bg-[#0a2016]/80' : 'border-emerald-400/40 bg-purple-950/60'
        }`}>
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-white text-base">
                {lang === 'es' ? '¡Nivel 2 Superado con Éxito!' : 'Level 2 Successfully Completed!'}
              </div>
              <div className={`text-xs ${isGreen ? 'text-[#b7c4b0]' : 'text-purple-200/80'}`}>
                {lang === 'es'
                  ? 'LOVE.EXE compilado sin errores. El universo de nuestros recuerdos te espera.'
                  : 'LOVE.EXE compiled with 0 bugs. Our gallery of memories awaits.'}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playChime();
              onProceedToLevel3();
            }}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 shrink-0 shadow-md ${
              isGreen
                ? 'bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#52b788] hover:from-[#2d6a4f] hover:to-[#74c69d] text-[#fefae0] shadow-[0_0_20px_rgba(82,183,136,0.5)]'
                : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]'
            }`}
          >
            <span>{strings.level2.nextLevel[lang]}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
