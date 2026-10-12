import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Sparkles, 
  Unlock, 
  Mail, 
  RotateCcw, 
  Copy, 
  Check, 
  Download, 
  Calendar, 
  Feather
} from 'lucide-react';
import { FinalLetterConfig, Language, UI_STRINGS } from '../customization';
import { soundManager } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface FinalSurpriseProps {
  letter: FinalLetterConfig;
  lang: Language;
  isUnlocked: boolean;
  onUnlock: () => void;
  canUnlock: boolean;
  onGoToLevel1: () => void;
}

export const FinalSurprise: React.FC<FinalSurpriseProps> = ({
  letter,
  lang,
  isUnlocked,
  onUnlock,
  canUnlock,
  onGoToLevel1,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(isUnlocked);
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const strings = UI_STRINGS;
  const { isGreen } = useTheme();

  const triggerConfettiCelebration = () => {
    try {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        colors: isGreen
          ? ['#2d6a4f', '#52b788', '#74c69d', '#95d5b2', '#fefae0', '#fdf8f0']
          : ['#a855f7', '#d946ef', '#f472b6', '#e879f9', '#ffffff', '#c084fc'],
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    } catch {
      // safe fallback
    }
  };

  const handleUnlockClick = () => {
    soundManager.playRomanticFanfare();
    triggerConfettiCelebration();
    setIsOpen(true);
    onUnlock();
  };

  const handleReadAgain = () => {
    soundManager.playRomanticFanfare();
    triggerConfettiCelebration();
    setIsOpen(false);
    setTimeout(() => {
      setIsOpen(true);
    }, 300);
  };

  const handleCopyLetter = () => {
    soundManager.playChime();
    const fullText = `${letter.salutation[lang]}\n\n${letter.paragraphs
      .map(p => p[lang])
      .join('\n\n')}\n\n${letter.closing[lang]}\n${letter.signature[lang]}\n(${letter.date[lang]})`;
    navigator.clipboard.writeText(fullText);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2200);
  };

  const handleDownloadKeepsake = () => {
    soundManager.playChime();
    const fullText = `OUR LITTLE UNIVERSE 💜\n====================\n${letter.salutation[lang]}\n\n${letter.paragraphs
      .map(p => p[lang])
      .join('\n\n')}\n\n${letter.closing[lang]}\n${letter.signature[lang]}\n${letter.date[lang]}\n\n-- Con amor eterno --`;

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carta_de_amor_${lang}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-14 flex flex-col items-center text-center">
      {/* Header Pill */}
      <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs sm:text-sm font-medium mb-6 shadow-md border ${
        isGreen
          ? 'bg-[#1b4332]/70 border-[#52b788]/40 text-[#d8f3dc] shadow-[0_0_20px_rgba(82,183,136,0.3)]'
          : 'bg-fuchsia-950/70 border border-fuchsia-400/40 text-fuchsia-200 shadow-[0_0_20px_rgba(217,70,239,0.3)]'
      }`}>
        <Sparkles className={`w-4 h-4 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'}`} />
        <span>{strings.finalSurprise.title[lang]}</span>
      </div>

      <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
        <span className={`bg-clip-text text-transparent drop-shadow-md ${
          isGreen
            ? 'bg-gradient-to-r from-emerald-100 via-[#fefae0] to-[#b7e4c7] drop-shadow-[0_0_25px_rgba(82,183,136,0.4)]'
            : 'bg-gradient-to-r from-purple-100 via-fuchsia-200 to-pink-200 drop-shadow-[0_0_25px_rgba(168,85,247,0.4)]'
        }`}>
          {letter.title[lang]}
        </span>
        <span className="inline-block text-2xl sm:text-4xl ml-2">
          {isGreen ? '💌🌿' : '💌'}
        </span>
      </h2>

      <p className={`text-sm sm:text-lg max-w-xl mb-8 ${isGreen ? 'text-[#d8f3dc]' : 'text-purple-200/80'}`}>
        {strings.finalSurprise.subtitle[lang]}
      </p>

      {/* State A: Locked or waiting to be opened */}
      {!isOpen ? (
        <div className={`glass-panel-glow p-8 sm:p-12 rounded-3xl border max-w-lg w-full flex flex-col items-center animate-pulse-glow shadow-2xl ${
          isGreen
            ? 'border-[#52b788]/40 shadow-[0_0_40px_rgba(45,106,79,0.4)]'
            : 'border-fuchsia-400/40 shadow-[0_0_40px_rgba(217,70,239,0.3)]'
        }`}>
          {/* Animated Envelope Icon with wax seal */}
          <div className="relative mb-6">
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-white shadow-lg ${
              isGreen
                ? 'bg-gradient-to-tr from-[#1b4332] via-[#2d6a4f] to-[#52b788] shadow-[0_0_30px_rgba(82,183,136,0.6)]'
                : 'bg-gradient-to-tr from-purple-700 via-fuchsia-600 to-pink-500 shadow-[0_0_30px_rgba(217,70,239,0.6)]'
            }`}>
              <Mail className="w-12 h-12 text-white animate-bounce" />
            </div>
            <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white shadow-md ${
              isGreen ? 'bg-[#2d6a4f]' : 'bg-fuchsia-700'
            }`}>
              <Heart className="w-5 h-5 fill-white" />
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {lang === 'es' ? 'Tu carta está lista' : 'Your letter is ready'}
          </h3>
          <p className={`text-xs sm:text-sm text-center mb-8 ${isGreen ? 'text-[#b7c4b0]' : 'text-purple-200/80'}`}>
            {lang === 'es'
              ? 'Has desbloqueado el rincón más especial de nuestro universo con tu inteligencia y cariño.'
              : 'You have unlocked the most special corner of our universe with your wit and warmth.'}
          </p>

          {/* Unlock Button */}
          <button
            onClick={handleUnlockClick}
            className={`w-full group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-lg sm:text-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg ${
              isGreen
                ? 'bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#52b788] hover:from-[#2d6a4f] hover:via-[#40916c] hover:to-[#74c69d] text-[#fefae0] shadow-[0_0_35px_rgba(82,183,136,0.6)] hover:shadow-[0_0_50px_rgba(116,198,157,0.8)]'
                : 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 shadow-[0_0_35px_rgba(217,70,239,0.6)] hover:shadow-[0_0_50px_rgba(236,72,153,0.8)]'
            }`}
          >
            <Unlock className={`w-5 h-5 group-hover:rotate-12 transition-transform ${isGreen ? 'text-[#d8f3dc]' : 'text-fuchsia-200'}`} />
            <span>{strings.finalSurprise.unlockButton[lang]}</span>
          </button>
        </div>
      ) : (
        /* State B: Unlocked Digital Letter */
        <div className="w-full max-w-2xl animate-fadeIn space-y-6">
          {/* Elegant Parchment Letter Card */}
          <div className={`relative glass-panel-glow p-8 sm:p-12 rounded-3xl border text-left overflow-hidden shadow-2xl ${
            isGreen
              ? 'border-[#52b788]/40 shadow-[0_0_50px_rgba(45,106,79,0.4)]'
              : 'border-fuchsia-300/40 shadow-[0_0_50px_rgba(217,70,239,0.35)]'
          }`}>
            {/* Soft decorative background glows */}
            <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
              isGreen ? 'bg-[#52b788]/20' : 'bg-fuchsia-600/15'
            }`} />
            <div className={`absolute -bottom-12 -left-12 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
              isGreen ? 'bg-[#2d6a4f]/20' : 'bg-purple-600/15'
            }`} />

            {/* Top letter meta stamp */}
            <div className={`flex items-center justify-between pb-6 mb-6 border-b text-xs ${
              isGreen ? 'border-[#52b788]/20 text-[#a3b18a]' : 'border-purple-500/20 text-purple-300/80'
            }`}>
              <div className="flex items-center gap-2">
                <Feather className={`w-4 h-4 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'}`} />
                <span className="font-semibold uppercase tracking-wider">
                  {lang === 'es' ? 'Mensaje del Corazón' : 'Heartfelt Letter'}
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono-code text-[11px]">
                <Calendar className={`w-3.5 h-3.5 ${isGreen ? 'text-[#74c69d]' : 'text-purple-400'}`} />
                <span>{letter.date[lang]}</span>
              </div>
            </div>

            {/* Salutation */}
            <div className={`font-handwriting text-3xl sm:text-4xl mb-6 font-bold ${
              isGreen ? 'text-[#fefae0]' : 'text-fuchsia-200'
            }`}>
              {letter.salutation[lang]}
            </div>

            {/* Paragraphs in clean, warm romantic typography */}
            <div className={`space-y-4 text-base sm:text-lg leading-relaxed font-light ${
              isGreen ? 'text-[#fbf6ee]' : 'text-purple-100/95'
            }`}>
              {letter.paragraphs.map((paragraph, idx) => (
                <p key={idx} className={isGreen ? 'first-letter:text-2xl first-letter:font-bold first-letter:text-[#74c69d]' : 'first-letter:text-2xl first-letter:font-bold first-letter:text-fuchsia-300'}>
                  {paragraph[lang]}
                </p>
              ))}
            </div>

            {/* Closing & Signature */}
            <div className={`mt-8 pt-6 border-t flex flex-col items-end text-right ${
              isGreen ? 'border-[#52b788]/20' : 'border-purple-500/20'
            }`}>
              <span className={`text-sm italic mb-1 ${isGreen ? 'text-[#a3b18a]' : 'text-purple-300/80'}`}>
                {letter.closing[lang]}
              </span>
              <span className={`font-handwriting text-2xl sm:text-3xl font-bold flex items-center gap-2 ${
                isGreen ? 'text-[#d8f3dc]' : 'text-fuchsia-300'
              }`}>
                {letter.signature[lang]}
              </span>
            </div>

            {/* Wax seal in bottom center */}
            <div className="mt-6 flex items-center justify-center">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs ${
                isGreen
                  ? 'bg-[#0a2016]/80 border-[#52b788]/30 text-[#d8f3dc]'
                  : 'bg-purple-950/80 border-purple-500/30 text-purple-300'
              }`}>
                <Heart className={`w-3.5 h-3.5 fill-current animate-pulse ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'}`} />
                <span>{strings.finalSurprise.shareLove[lang]}</span>
              </div>
            </div>
          </div>

          {/* Action buttons: Read Again, Copy, Download */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Read again button */}
            <button
              onClick={handleReadAgain}
              className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 ${
                isGreen
                  ? 'bg-[#1b4332]/70 hover:bg-[#2d6a4f] border-[#52b788]/40 text-[#d8f3dc] hover:text-white'
                  : 'bg-purple-900/60 hover:bg-purple-800/80 border-purple-400/30 text-purple-200 hover:text-white'
              }`}
            >
              <RotateCcw className={`w-4 h-4 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-300'}`} />
              <span>{strings.finalSurprise.readAgain[lang]}</span>
            </button>

            {/* Copy letter */}
            <button
              onClick={handleCopyLetter}
              className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 ${
                isGreen
                  ? 'bg-[#1b4332]/70 hover:bg-[#2d6a4f] border-[#52b788]/40 text-[#d8f3dc] hover:text-white'
                  : 'bg-purple-900/60 hover:bg-purple-800/80 border-purple-400/30 text-purple-200 hover:text-white'
              }`}
            >
              {hasCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className={`w-4 h-4 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-300'}`} />}
              <span>{hasCopied ? strings.finalSurprise.copiedSuccess[lang] : strings.finalSurprise.copyLetter[lang]}</span>
            </button>

            {/* Download Keepsake */}
            <button
              onClick={handleDownloadKeepsake}
              className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 ${
                isGreen
                  ? 'bg-[#1b4332]/70 hover:bg-[#2d6a4f] border-[#52b788]/40 text-[#d8f3dc] hover:text-white'
                  : 'bg-purple-900/60 hover:bg-purple-800/80 border-purple-400/30 text-purple-200 hover:text-white'
              }`}
            >
              <Download className={`w-4 h-4 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-300'}`} />
              <span>{strings.finalSurprise.downloadKeepsake[lang]}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
