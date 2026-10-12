import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Lightbulb, 
  Heart,
  AlertCircle,
  Eye,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { Language, Level1Config, QuestionOption, UI_STRINGS } from '../customization';
import { soundManager } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface Level1QuestionProps {
  config: Level1Config;
  lang: Language;
  onComplete: () => void;
  onProceedToLevel2: () => void;
  isAlreadyCompleted: boolean;
}

export const Level1Question: React.FC<Level1QuestionProps> = ({
  config,
  lang,
  onComplete,
  onProceedToLevel2,
  isAlreadyCompleted,
}) => {
  // Always start with no option selected upon entering so the answer is never revealed in advance
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Progressive romantic message state
  const totalParagraphs = config.celebrationMessage?.paragraphs?.length || 4;
  const [revealedParagraphsCount, setRevealedParagraphsCount] = useState<number>(0);
  const [isRevealingDone, setIsRevealingDone] = useState<boolean>(false);

  const strings = UI_STRINGS;
  const { isGreen } = useTheme();
  const celebrationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedOption = config.options.find(o => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect ?? false;
  const isIndividual = selectedOption?.category === 'individual' || ((selectedOption?.number ?? 0) <= 10);

  // Progressive message revelation effect when option 11 is picked
  useEffect(() => {
    if (isCorrect && !isRevealingDone) {
      if (revealedParagraphsCount < totalParagraphs) {
        celebrationTimerRef.current = setTimeout(() => {
          setRevealedParagraphsCount(prev => {
            const next = prev + 1;
            if (next >= totalParagraphs) {
              setIsRevealingDone(true);
              soundManager.playChime();
            }
            return next;
          });
        }, 1500);
      }
    }
    return () => {
      if (celebrationTimerRef.current) {
        clearTimeout(celebrationTimerRef.current);
      }
    };
  }, [isCorrect, revealedParagraphsCount, isRevealingDone, totalParagraphs]);

  const handleSelectOption = (option: QuestionOption) => {
    if (celebrationTimerRef.current) {
      clearTimeout(celebrationTimerRef.current);
    }

    setSelectedOptionId(option.id);
    setHasSubmitted(true);

    if (option.isCorrect) {
      soundManager.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: isGreen
            ? ['#2d6a4f', '#52b788', '#74c69d', '#95d5b2', '#fefae0', '#d8f3dc']
            : ['#a855f7', '#d946ef', '#f472b6', '#c084fc', '#ffffff', '#e879f9'],
        });
      } catch {
        // safe confetti fallback
      }
      // Start progressive revelation
      setRevealedParagraphsCount(1);
      setIsRevealingDone(false);
      onComplete();
    } else {
      soundManager.playChime();
      setRevealedParagraphsCount(0);
      setIsRevealingDone(false);
    }
  };

  const handleRevealAllNow = () => {
    if (celebrationTimerRef.current) {
      clearTimeout(celebrationTimerRef.current);
    }
    setRevealedParagraphsCount(totalParagraphs);
    setIsRevealingDone(true);
    soundManager.playChime();
  };

  const handleReplayCelebration = () => {
    soundManager.playSuccess();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: isGreen
          ? ['#2d6a4f', '#52b788', '#74c69d', '#fefae0']
          : ['#a855f7', '#d946ef', '#f472b6', '#ffffff'],
      });
    } catch {
      // safe
    }
    setRevealedParagraphsCount(1);
    setIsRevealingDone(false);
  };

  const handleRetry = () => {
    soundManager.playChime();
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setRevealedParagraphsCount(0);
    setIsRevealingDone(false);
  };

  // Group options into 1-10 (individual) and 11-14 (combined)
  const individualOptions = config.options.filter(
    o => o.category === 'individual' || ((o.number ?? 0) >= 1 && (o.number ?? 0) <= 10)
  );
  const combinedOptions = config.options.filter(
    o => o.category === 'combined' || ((o.number ?? 0) >= 11)
  );

  return (
    <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Header Badge & Hint Switcher */}
      <div className="flex items-center justify-between mb-4">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
          isGreen
            ? 'bg-[#1b4332]/60 border-[#52b788]/40 text-[#d8f3dc]'
            : 'bg-purple-900/60 border-purple-400/30 text-purple-200'
        }`}>
          <Sparkles className={`w-3.5 h-3.5 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'}`} />
          <span>{strings.level1.badge[lang]}</span>
        </div>
        <button
          onClick={() => {
            soundManager.playChime();
            setShowHint(!showHint);
          }}
          className={`inline-flex items-center gap-1 text-xs transition-colors cursor-pointer px-2.5 py-1 rounded-full border ${
            isGreen
              ? 'text-[#a3b18a] hover:text-[#fefae0] bg-[#0a2016]/60 hover:bg-[#1b4332]/50 border-[#52b788]/20'
              : 'text-purple-300 hover:text-purple-100 bg-purple-950/40 hover:bg-purple-900/50 border-purple-500/20'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
          <span>{showHint ? strings.level1.hideHint[lang] : strings.level1.showHint[lang]}</span>
        </button>
      </div>

      {/* Level Title & Subtitle */}
      <div className="text-center sm:text-left mb-8">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-2 flex items-center justify-center sm:justify-start gap-2">
          <span>{config.title[lang]}</span>
          <span className={isGreen ? 'text-[#74c69d]' : 'text-purple-400'}>
            {isGreen ? '🌿' : '✨'}
          </span>
        </h2>
        <p className={`text-sm sm:text-base ${isGreen ? 'text-[#d8f3dc]' : 'text-purple-200/80'}`}>
          {config.subtitle[lang]}
        </p>
      </div>

      {/* Hint Alert Box if opened */}
      {showHint && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex items-start gap-3 animate-fadeIn shadow-lg">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{config.hint[lang]}</div>
        </div>
      )}

      {/* Main Question Card */}
      <div className={`glass-panel p-6 sm:p-8 rounded-3xl border mb-6 ${
        isGreen
          ? 'border-[#52b788]/30 shadow-[0_0_35px_rgba(45,106,79,0.35)]'
          : 'border-purple-400/30 shadow-[0_0_35px_rgba(168,85,247,0.25)]'
      }`}>
        {/* Question Header */}
        <div className="flex items-start gap-3 sm:gap-4 mb-6">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ${
            isGreen
              ? 'bg-gradient-to-tr from-[#1b4332] to-[#52b788] shadow-[0_0_15px_rgba(82,183,136,0.4)]'
              : 'bg-gradient-to-tr from-purple-700 to-fuchsia-600 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
          }`}>
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              isGreen ? 'text-[#a3b18a]' : 'text-purple-300/70'
            }`}>
              {lang === 'es' ? 'Pregunta para ti:' : 'Question for you:'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5 leading-relaxed">
              {config.prompt[lang]}
            </h3>
          </div>
        </div>

        {/* SECTION 1: MOMENTOS INDIVIDUALES (1 AL 10) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 border-b pb-2 border-white/10">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span>{strings.level1.individualSectionTitle[lang]}</span>
              </h4>
              <p className={`text-[11px] ${isGreen ? 'text-[#a3b18a]' : 'text-purple-300/70'}`}>
                {strings.level1.individualSectionSubtitle[lang]}
              </p>
            </div>
            <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${
              isGreen ? 'border-[#52b788]/30 text-[#74c69d]' : 'border-purple-400/30 text-purple-300'
            }`}>
              1 – 10
            </span>
          </div>

          <div className="space-y-2.5">
            {individualOptions.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const numLabel = option.number ?? '';

              let buttonStyles = '';
              let badgeStyles = '';

              if (hasSubmitted && isSelected) {
                // Individual options are NOT correct, so give clear visual feedback
                buttonStyles = isGreen
                  ? 'bg-amber-950/60 border-amber-400/70 text-amber-100 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                  : 'bg-amber-950/60 border-amber-400/70 text-amber-100 shadow-[0_0_15px_rgba(251,191,36,0.25)]';
                badgeStyles = 'bg-amber-500 text-black font-extrabold border-amber-300';
              } else {
                buttonStyles = isGreen
                  ? 'bg-[#0a2016]/45 hover:bg-[#1b4332]/50 border-[#52b788]/20 hover:border-[#52b788]/40 text-[#fbf6ee]'
                  : 'bg-purple-950/35 hover:bg-purple-900/50 border-purple-500/20 hover:border-purple-400/50 text-purple-200/90';
                badgeStyles = isGreen
                  ? 'bg-[#1b4332]/70 border-[#52b788]/40 text-[#d8f3dc] group-hover:bg-[#2d6a4f] group-hover:text-white'
                  : 'bg-purple-900/60 border-purple-400/40 text-purple-200 group-hover:bg-purple-700 group-hover:text-white';
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl transition-all duration-200 border cursor-pointer flex items-center justify-between gap-3 group ${buttonStyles}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 border transition-colors ${badgeStyles}`}
                    >
                      {numLabel}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed">
                      {option.text[lang]}
                    </span>
                  </div>

                  <div className="shrink-0">
                    {hasSubmitted && isSelected && (
                      <Info className="w-4 h-4 text-amber-300 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: RESPUESTAS COMBINADAS (11 AL 14) */}
        <div>
          <div className="flex items-center justify-between mb-3 border-b pb-2 border-white/10">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span>{strings.level1.combinedSectionTitle[lang]}</span>
                <span className="text-xs">✨</span>
              </h4>
              <p className={`text-[11px] ${isGreen ? 'text-[#a3b18a]' : 'text-purple-300/70'}`}>
                {strings.level1.combinedSectionSubtitle[lang]}
              </p>
            </div>
            <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${
              isGreen ? 'border-[#52b788]/30 text-[#74c69d]' : 'border-purple-400/30 text-purple-300'
            }`}>
              11 – 14
            </span>
          </div>

          <div className="space-y-3">
            {combinedOptions.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const showSuccess = hasSubmitted && isSelected && option.isCorrect;
              const showIncorrect = hasSubmitted && isSelected && !option.isCorrect;
              const numLabel = option.number ?? '';

              let buttonStyles = '';
              let badgeStyles = '';

              if (showSuccess) {
                buttonStyles = isGreen
                  ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-[0_0_25px_rgba(82,183,136,0.4)] ring-2 ring-emerald-400/40'
                  : 'bg-emerald-950/80 border-emerald-400 text-white shadow-[0_0_25px_rgba(52,211,153,0.4)] ring-2 ring-emerald-400/40';
                badgeStyles = 'bg-emerald-500 text-white font-extrabold border-emerald-300';
              } else if (showIncorrect) {
                buttonStyles = 'bg-rose-950/60 border-rose-400/70 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.25)]';
                badgeStyles = 'bg-rose-500 text-white font-extrabold border-rose-300';
              } else {
                buttonStyles = isGreen
                  ? 'bg-[#0a2016]/45 hover:bg-[#1b4332]/50 border-[#52b788]/20 hover:border-[#52b788]/40 text-[#fbf6ee]'
                  : 'bg-purple-950/35 hover:bg-purple-900/50 border-purple-500/20 hover:border-purple-400/50 text-purple-200/90';
                badgeStyles = isGreen
                  ? 'bg-[#1b4332]/70 border-[#52b788]/40 text-[#d8f3dc] group-hover:bg-[#2d6a4f] group-hover:text-white'
                  : 'bg-purple-900/60 border-purple-400/40 text-purple-200 group-hover:bg-purple-700 group-hover:text-white';
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl transition-all duration-200 border cursor-pointer flex items-center justify-between gap-3 group ${buttonStyles}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 border transition-colors ${badgeStyles}`}
                    >
                      {numLabel}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed">
                      {option.text[lang]}
                    </span>
                  </div>

                  <div className="shrink-0">
                    {showSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />}
                    {showIncorrect && <AlertCircle className="w-5 h-5 text-rose-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* FEEDBACK DISPLAY BOX FOR INCORRECT SELECTIONS (1-10 individual or 12-14 combined) */}
        {hasSubmitted && selectedOption && !isCorrect && (
          <div
            className={`mt-6 p-4 sm:p-5 rounded-2xl border transition-all animate-fadeIn ${
              isIndividual
                ? 'bg-amber-950/60 border-amber-400/50 text-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
                : 'bg-rose-950/60 border-rose-400/50 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
            }`}
          >
            <div className="flex items-start gap-3">
              {isIndividual ? (
                <Info className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              ) : (
                <RotateCcw className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1.5">
                {isIndividual && (
                  <div className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    {strings.level1.individualBadgeNote[lang]}
                  </div>
                )}
                <div className="text-xs sm:text-sm leading-relaxed">
                  {selectedOption.feedback[lang]}
                </div>
              </div>
            </div>

            {/* Action to retry or choose another option */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-end">
              <button
                onClick={handleRetry}
                className={`px-4 py-2 rounded-xl text-white text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                  isGreen
                    ? 'bg-[#1b4332] hover:bg-[#2d6a4f]'
                    : 'bg-purple-800/80 hover:bg-purple-700'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>{strings.level1.retry[lang]}</span>
              </button>
            </div>
          </div>
        )}

        {/* CELEBRACIÓN ESPECIAL Y MENSAJE ROMÁNTICO PROGRESIVO (SOLO CON OPCIÓN 11) */}
        {hasSubmitted && isCorrect && selectedOption && (
          <div className={`mt-8 p-6 sm:p-8 rounded-3xl border transition-all animate-fadeIn ${
            isGreen
              ? 'bg-[#0d2a1c]/90 border-[#52b788]/50 shadow-[0_0_40px_rgba(82,183,136,0.35)]'
              : 'bg-[#1b0b30]/90 border-purple-400/50 shadow-[0_0_40px_rgba(168,85,247,0.35)]'
          }`}>
            {/* Header of the celebration */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                  isGreen
                    ? 'bg-[#1b4332] border-[#52b788]/50 text-[#74c69d]'
                    : 'bg-purple-900/80 border-purple-400/40 text-fuchsia-300'
                }`}>
                  <Heart className="w-5 h-5 fill-current animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white">
                    {config.celebrationMessage.title[lang]}
                  </h3>
                  <p className={`text-xs ${isGreen ? 'text-[#a3b18a]' : 'text-purple-200/70'}`}>
                    {isRevealingDone
                      ? strings.level1.revelationComplete[lang]
                      : strings.level1.revealingProgress[lang]}
                  </p>
                </div>
              </div>

              {/* Fast-forward or replay button */}
              {!isRevealingDone ? (
                <button
                  onClick={handleRevealAllNow}
                  className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 cursor-pointer transition-all ${
                    isGreen
                      ? 'bg-[#1b4332]/80 hover:bg-[#2d6a4f] border-[#52b788]/40 text-[#d8f3dc]'
                      : 'bg-purple-900/70 hover:bg-purple-800 border-purple-400/40 text-purple-200'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>{strings.level1.revealAll[lang]}</span>
                </button>
              ) : (
                <button
                  onClick={handleReplayCelebration}
                  className={`text-xs px-2.5 py-1 rounded-xl border flex items-center gap-1 cursor-pointer transition-colors opacity-70 hover:opacity-100 ${
                    isGreen
                      ? 'border-[#52b788]/30 text-[#d8f3dc]'
                      : 'border-purple-400/30 text-purple-200'
                  }`}
                  title="Rebobinar revelación"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Replay</span>
                </button>
              )}
            </div>

            {/* Progressive Revelation Progress Bar */}
            {!isRevealingDone && (
              <div className="mb-6 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className={isGreen ? 'text-[#a3b18a]' : 'text-purple-300/80'}>
                    {lang === 'es'
                      ? `Revelando párrafo ${revealedParagraphsCount} de ${totalParagraphs}...`
                      : `Revealing paragraph ${revealedParagraphsCount} of ${totalParagraphs}...`}
                  </span>
                  <span className="font-mono text-amber-300 animate-pulse">
                    {Math.round((revealedParagraphsCount / totalParagraphs) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ease-out ${
                      isGreen
                        ? 'bg-gradient-to-r from-[#2d6a4f] to-[#74c69d]'
                        : 'bg-gradient-to-r from-purple-500 to-fuchsia-400'
                    }`}
                    style={{ width: `${(revealedParagraphsCount / totalParagraphs) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* ROMANTIC MESSAGE PARAGRAPHS - Revealed progressively */}
            <div className="space-y-4">
              {config.celebrationMessage.paragraphs.map((p, idx) => {
                const isRevealed = idx < revealedParagraphsCount;
                if (!isRevealed) return null;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all duration-700 animate-fadeIn ${
                      isGreen
                        ? 'bg-[#123825]/60 border-[#52b788]/30 text-[#fbf6ee]'
                        : 'bg-purple-950/50 border-purple-400/30 text-purple-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`text-base shrink-0 mt-0.5 ${
                        isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'
                      }`}>
                        💜
                      </span>
                      <p className="text-xs sm:text-sm leading-relaxed sm:leading-loose font-normal">
                        {p[lang]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ONLY ONCE REVELATION IS COMPLETE: SHOW THE PROCEED BUTTON */}
            {isRevealingDone && (
              <div className="mt-8 pt-5 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {lang === 'es'
                      ? '¡Has completado el Nivel 1! Ahora puedes avanzar.'
                      : 'You completed Level 1! You can now proceed.'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    soundManager.playChime();
                    onProceedToLevel2();
                  }}
                  className={`w-full sm:w-auto px-6 py-3 rounded-2xl text-white text-sm font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:scale-105 shadow-xl ${
                    isGreen
                      ? 'bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#52b788] hover:from-[#2d6a4f] hover:to-[#74c69d] text-[#fefae0] shadow-[0_0_25px_rgba(82,183,136,0.6)] ring-2 ring-[#74c69d]/40'
                      : 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-[0_0_25px_rgba(217,70,239,0.6)] ring-2 ring-fuchsia-400/40'
                  }`}
                >
                  <span>{strings.level1.nextLevel[lang]}</span>
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status banner if already cleared and viewing screen */}
      {isAlreadyCompleted && !hasSubmitted && (
        <div className={`glass-panel p-4 rounded-2xl border flex items-center justify-between gap-3 text-sm animate-fadeIn ${
          isGreen ? 'border-[#52b788]/40 text-[#d8f3dc]' : 'border-emerald-400/30 text-emerald-200'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              {lang === 'es' ? '¡Nivel 1 completado con éxito!' : 'Level 1 successfully completed!'}
            </span>
          </div>
          <button
            onClick={() => {
              soundManager.playChime();
              onProceedToLevel2();
            }}
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              isGreen
                ? 'bg-[#1b4332] border-[#52b788]/40 text-[#fefae0] hover:bg-[#2d6a4f]'
                : 'bg-purple-900 border-purple-400/40 text-purple-100 hover:bg-purple-800'
            }`}
          >
            {strings.level1.nextLevel[lang]}
          </button>
        </div>
      )}
    </div>
  );
};
