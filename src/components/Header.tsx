import React from 'react';
import { 
  Heart, 
  Volume2, 
  VolumeX, 
  Settings, 
  CheckCircle2, 
  Lock, 
  Terminal, 
  Image as ImageIcon, 
  Sparkles,
  HelpCircle,
  Home
} from 'lucide-react';
import { Language, UI_STRINGS } from '../customization';
import { soundManager } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

export type ScreenId = 'welcome' | 'level1' | 'level2' | 'level3' | 'surprise';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  lang: Language;
  onToggleLang: (lang: Language) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenCustomizer: () => void;
  completedLevels: {
    level1: boolean;
    level2: boolean;
    level3: boolean;
    surpriseUnlocked: boolean;
  };
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  lang,
  onToggleLang,
  isMuted,
  onToggleMute,
  onOpenCustomizer,
  completedLevels,
}) => {
  const strings = UI_STRINGS;
  const { theme, setTheme, isGreen } = useTheme();

  // Calculate progress percentage
  let progressCount = 0;
  if (completedLevels.level1) progressCount += 33.3;
  if (completedLevels.level2) progressCount += 33.3;
  if (completedLevels.level3) progressCount += 33.4;
  const progressPercent = Math.min(100, Math.round(progressCount));

  const handleNav = (screen: ScreenId) => {
    soundManager.playChime();
    onNavigate(screen);
  };

  return (
    <header className={`sticky top-0 z-40 w-full glass-panel border-b px-4 py-3 sm:px-6 transition-colors duration-300 ${
      isGreen ? 'border-[#52b788]/25' : 'border-purple-500/20'
    }`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-3">
        {/* Top row: Brand & Primary utility controls */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand logo / title */}
          <button
            onClick={() => handleNav('welcome')}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
            title={lang === 'es' ? 'Volver al inicio' : 'Return to home'}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-md ${
              isGreen 
                ? 'bg-gradient-to-tr from-[#1b4332] via-[#2d6a4f] to-[#52b788] shadow-[0_0_15px_rgba(82,183,136,0.4)]'
                : 'bg-gradient-to-tr from-purple-700 to-fuchsia-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
            }`}>
              <Heart className="w-5 h-5 text-white fill-white animate-pulse" />
            </div>
            <div>
              <span className={`font-bold text-sm sm:text-base tracking-wide bg-clip-text text-transparent ${
                isGreen
                  ? 'bg-gradient-to-r from-emerald-100 via-[#fefae0] to-[#b7e4c7]'
                  : 'bg-gradient-to-r from-purple-200 via-white to-purple-300'
              }`}>
                OUR LITTLE UNIVERSE
              </span>
              <span className={`text-xs block font-normal hidden sm:block ${
                isGreen ? 'text-[#b7c4b0]' : 'text-purple-300/70'
              }`}>
                {strings.appTagline[lang]}
              </span>
            </div>
          </button>

          {/* Right controls: Theme Selector, Language Selector, Sound, Guide */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* THEME SELECTOR: clearly visible toggle with Morado / Verde */}
            <div 
              className={`flex items-center rounded-full p-0.5 text-xs border transition-all ${
                isGreen
                  ? 'bg-[#0a2016]/80 border-[#52b788]/40 shadow-[0_0_10px_rgba(82,183,136,0.2)]'
                  : 'bg-purple-950/70 border-purple-500/30'
              }`}
              title={lang === 'es' ? 'Cambiar tema (Morado / Verde)' : 'Switch theme (Purple / Green)'}
            >
              <button
                onClick={() => {
                  soundManager.playChime();
                  setTheme('purple');
                }}
                className={`px-2 sm:px-2.5 py-1 rounded-full transition-all flex items-center gap-1 font-medium cursor-pointer ${
                  theme === 'purple'
                    ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)] font-semibold'
                    : isGreen
                    ? 'text-[#a3b18a] hover:text-white'
                    : 'text-purple-300 hover:text-white'
                }`}
                aria-label="Tema Morado"
              >
                <span>💜</span>
                <span className="hidden md:inline">{lang === 'es' ? 'Morado' : 'Purple'}</span>
              </button>
              <button
                onClick={() => {
                  soundManager.playChime();
                  setTheme('green');
                }}
                className={`px-2 sm:px-2.5 py-1 rounded-full transition-all flex items-center gap-1 font-medium cursor-pointer ${
                  theme === 'green'
                    ? 'bg-[#2d6a4f] text-[#fefae0] shadow-[0_0_10px_rgba(45,106,79,0.7)] font-semibold border border-[#74c69d]/40'
                    : isGreen
                    ? 'text-[#a3b18a] hover:text-white'
                    : 'text-purple-300 hover:text-white'
                }`}
                aria-label="Tema Verde"
              >
                <span>🌿</span>
                <span className="hidden md:inline">{lang === 'es' ? 'Verde' : 'Green'}</span>
              </button>
            </div>

            {/* Language Selector: clearly visible toggle with flags */}
            <div className={`flex items-center rounded-full p-0.5 text-xs border transition-colors ${
              isGreen
                ? 'bg-[#0a2016]/80 border-[#52b788]/30'
                : 'bg-purple-950/70 border-purple-500/30'
            }`}>
              <button
                onClick={() => {
                  soundManager.playChime();
                  onToggleLang('es');
                }}
                className={`px-2 sm:px-2.5 py-1 rounded-full transition-all flex items-center gap-1 font-medium cursor-pointer ${
                  lang === 'es'
                    ? isGreen
                      ? 'bg-[#2d6a4f] text-[#fefae0] shadow-[0_0_10px_rgba(45,106,79,0.6)] font-semibold'
                      : 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)] font-semibold'
                    : isGreen
                    ? 'text-[#a3b18a] hover:text-white'
                    : 'text-purple-300 hover:text-white'
                }`}
                aria-label="Seleccionar idioma español"
              >
                <span>ES</span>
                <span className="text-xs">🇩🇴</span>
              </button>
              <button
                onClick={() => {
                  soundManager.playChime();
                  onToggleLang('en');
                }}
                className={`px-2 sm:px-2.5 py-1 rounded-full transition-all flex items-center gap-1 font-medium cursor-pointer ${
                  lang === 'en'
                    ? isGreen
                      ? 'bg-[#2d6a4f] text-[#fefae0] shadow-[0_0_10px_rgba(45,106,79,0.6)] font-semibold'
                      : 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)] font-semibold'
                    : isGreen
                    ? 'text-[#a3b18a] hover:text-white'
                    : 'text-purple-300 hover:text-white'
                }`}
                aria-label="Select English language"
              >
                <span>EN</span>
                <span className="text-xs">🇺🇸</span>
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={onToggleMute}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isMuted
                  ? isGreen
                    ? 'bg-[#0a2016]/60 border-[#52b788]/20 text-[#a3b18a] hover:text-white'
                    : 'bg-purple-950/40 border-purple-500/20 text-purple-400 hover:text-purple-200'
                  : isGreen
                  ? 'bg-[#2d6a4f]/30 border-[#52b788]/40 text-[#d8f3dc] hover:bg-[#2d6a4f]/50 shadow-[0_0_10px_rgba(82,183,136,0.3)]'
                  : 'bg-purple-600/20 border-purple-400/40 text-purple-200 hover:bg-purple-600/30 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
              }`}
              title={isMuted ? strings.navigation.soundOff[lang] : strings.navigation.soundOn[lang]}
              aria-label={isMuted ? strings.navigation.soundOff[lang] : strings.navigation.soundOn[lang]}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Customizer / Guide */}
            <button
              onClick={() => {
                soundManager.playChime();
                onOpenCustomizer();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
                isGreen
                  ? 'bg-[#1b4332]/60 hover:bg-[#2d6a4f]/60 border-[#52b788]/40 text-[#d8f3dc] hover:text-white shadow-[0_0_10px_rgba(82,183,136,0.2)]'
                  : 'bg-fuchsia-950/60 hover:bg-fuchsia-900/60 border border-fuchsia-500/30 text-fuchsia-200 hover:text-white shadow-[0_0_10px_rgba(217,70,239,0.2)]'
              }`}
              title={strings.navigation.customize[lang]}
            >
              <Settings className={`w-3.5 h-3.5 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'}`} />
              <span className="hidden sm:inline">{strings.navigation.customize[lang]}</span>
            </button>
          </div>
        </div>

        {/* Bottom row: Interactive Level Navigator & Progress bar */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 border-t ${
          isGreen ? 'border-[#52b788]/15' : 'border-purple-500/10'
        }`}>
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full sm:w-auto py-1 scrollbar-none">
            {/* Home button */}
            <button
              onClick={() => handleNav('welcome')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer shrink-0 ${
                currentScreen === 'welcome'
                  ? isGreen
                    ? 'bg-[#2d6a4f]/40 text-[#fefae0] border border-[#52b788]/40 shadow-[0_0_10px_rgba(82,183,136,0.2)]'
                    : 'bg-purple-600/30 text-purple-100 border border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                  : isGreen
                  ? 'text-[#a3b18a] hover:text-[#fefae0] hover:bg-[#1b4332]/30'
                  : 'text-purple-300/70 hover:text-purple-100 hover:bg-purple-900/30'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{strings.navigation.home[lang]}</span>
            </button>

            {/* Level 1: Question */}
            <button
              onClick={() => handleNav('level1')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer shrink-0 ${
                currentScreen === 'level1'
                  ? isGreen
                    ? 'bg-[#2d6a4f]/40 text-[#fefae0] border border-[#52b788]/40 shadow-[0_0_10px_rgba(82,183,136,0.2)]'
                    : 'bg-purple-600/30 text-purple-100 border border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                  : isGreen
                  ? 'text-[#a3b18a] hover:text-[#fefae0] hover:bg-[#1b4332]/30'
                  : 'text-purple-300/70 hover:text-purple-100 hover:bg-purple-900/30'
              }`}
            >
              <HelpCircle className={`w-3.5 h-3.5 ${isGreen ? 'text-[#74c69d]' : 'text-purple-400'}`} />
              <span>{strings.navigation.level1[lang]}</span>
              {completedLevels.level1 && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>

            {/* Level 2: love.exe */}
            <button
              onClick={() => handleNav('level2')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer shrink-0 ${
                currentScreen === 'level2'
                  ? isGreen
                    ? 'bg-[#2d6a4f]/40 text-[#fefae0] border border-[#52b788]/40 shadow-[0_0_10px_rgba(82,183,136,0.2)]'
                    : 'bg-purple-600/30 text-purple-100 border border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                  : isGreen
                  ? 'text-[#a3b18a] hover:text-[#fefae0] hover:bg-[#1b4332]/30'
                  : 'text-purple-300/70 hover:text-purple-100 hover:bg-purple-900/30'
              }`}
            >
              <Terminal className={`w-3.5 h-3.5 ${isGreen ? 'text-[#74c69d]' : 'text-purple-400'}`} />
              <span>{strings.navigation.level2[lang]}</span>
              {completedLevels.level2 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : !completedLevels.level1 ? (
                <Lock className={`w-3 h-3 ${isGreen ? 'text-[#588157]/60' : 'text-purple-400/50'}`} />
              ) : null}
            </button>

            {/* Level 3: Memories */}
            <button
              onClick={() => handleNav('level3')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer shrink-0 ${
                currentScreen === 'level3'
                  ? isGreen
                    ? 'bg-[#2d6a4f]/40 text-[#fefae0] border border-[#52b788]/40 shadow-[0_0_10px_rgba(82,183,136,0.2)]'
                    : 'bg-purple-600/30 text-purple-100 border border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                  : isGreen
                  ? 'text-[#a3b18a] hover:text-[#fefae0] hover:bg-[#1b4332]/30'
                  : 'text-purple-300/70 hover:text-purple-100 hover:bg-purple-900/30'
              }`}
            >
              <ImageIcon className={`w-3.5 h-3.5 ${isGreen ? 'text-[#74c69d]' : 'text-purple-400'}`} />
              <span>{strings.navigation.level3[lang]}</span>
              {completedLevels.level3 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : !completedLevels.level2 ? (
                <Lock className={`w-3 h-3 ${isGreen ? 'text-[#588157]/60' : 'text-purple-400/50'}`} />
              ) : null}
            </button>

            {/* Final Surprise */}
            <button
              onClick={() => handleNav('surprise')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                currentScreen === 'surprise'
                  ? isGreen
                    ? 'bg-gradient-to-r from-[#2d6a4f] via-[#52b788] to-[#1b4332] text-[#fefae0] shadow-[0_0_15px_rgba(82,183,136,0.5)] border border-[#74c69d]/50'
                    : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)] border border-fuchsia-300/40'
                  : completedLevels.level3
                  ? isGreen
                    ? 'text-[#d8f3dc] hover:text-white bg-[#1b4332]/50 border border-[#52b788]/40 animate-pulse'
                    : 'text-fuchsia-300 hover:text-white bg-fuchsia-950/40 border border-fuchsia-500/30 animate-pulse'
                  : isGreen
                  ? 'text-[#588157] hover:text-[#a3b18a]'
                  : 'text-purple-300/50 hover:text-purple-200'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGreen ? 'text-[#a7c957]' : 'text-fuchsia-300'}`} />
              <span>{strings.navigation.surprise[lang]}</span>
              {!completedLevels.level3 && (
                <Lock className={`w-3 h-3 ${isGreen ? 'text-[#588157]/60' : 'text-purple-400/50'}`} />
              )}
            </button>
          </nav>

          {/* Universe Progress bar */}
          <div className="flex items-center gap-2 text-xs w-full sm:w-44 shrink-0">
            <span className={`text-[11px] whitespace-nowrap ${
              isGreen ? 'text-[#a3b18a]' : 'text-purple-300/70'
            }`}>
              {progressPercent}%
            </span>
            <div className={`w-full h-2 rounded-full overflow-hidden border ${
              isGreen 
                ? 'bg-[#0a2016] border-[#52b788]/30' 
                : 'bg-purple-950/80 border-purple-500/20'
            }`}>
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  isGreen
                    ? 'bg-gradient-to-r from-[#1b4332] via-[#40916c] to-[#95d5b2] shadow-[0_0_10px_rgba(82,183,136,0.6)]'
                    : 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.7)]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
