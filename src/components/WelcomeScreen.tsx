import React from 'react';
import { Sparkles, Heart, Terminal, Compass, ArrowRight, ShieldCheck, Cpu, Code2 } from 'lucide-react';
import { Language, UI_STRINGS } from '../customization';
import { soundManager } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface WelcomeScreenProps {
  lang: Language;
  onStart: () => void;
  hasStarted: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  lang,
  onStart,
  hasStarted,
}) => {
  const strings = UI_STRINGS;
  const { isGreen } = useTheme();

  const handleStartClick = () => {
    soundManager.playChime();
    onStart();
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-16 flex flex-col items-center text-center">
      {/* Top glowing tech pill badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-6 backdrop-blur-sm animate-float-gentle transition-colors ${
        isGreen
          ? 'bg-[#1b4332]/60 border border-[#52b788]/40 text-[#d8f3dc] shadow-[0_0_20px_rgba(82,183,136,0.3)]'
          : 'bg-purple-900/50 border border-purple-400/40 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
      }`}>
        <Sparkles className={`w-4 h-4 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'}`} />
        <span>{strings.badges.madeWithLove[lang]}</span>
        <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isGreen ? 'bg-[#52b788]' : 'bg-fuchsia-400'}`} />
      </div>

      {/* Hero Title */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4">
        <span className={`block bg-clip-text text-transparent drop-shadow-md ${
          isGreen
            ? 'bg-gradient-to-r from-emerald-100 via-[#fefae0] to-[#b7e4c7] drop-shadow-[0_0_35px_rgba(82,183,136,0.4)]'
            : 'bg-gradient-to-r from-purple-100 via-fuchsia-200 to-purple-300 drop-shadow-[0_0_35px_rgba(168,85,247,0.4)]'
        }`}>
          Our Little Universe
        </span>
        <span className="inline-block text-3xl sm:text-5xl ml-2 animate-bounce">
          {isGreen ? '🌿' : '💜'}
        </span>
      </h1>

      {/* Subtitle */}
      <p className={`text-lg sm:text-2xl max-w-2xl font-light mb-3 ${
        isGreen ? 'text-[#d8f3dc]' : 'text-purple-200/90'
      }`}>
        {strings.welcomeSubtitle[lang]}
      </p>

      {/* Tagline */}
      <p className={`text-sm sm:text-base max-w-lg mb-8 italic ${
        isGreen ? 'text-[#a3b18a]' : 'text-purple-300/70'
      }`}>
        "{strings.appTagline[lang]}"
      </p>

      {/* Tech Status Metrics Pill Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl mb-10 text-left">
        <div className={`glass-panel p-3 rounded-xl border flex items-center gap-3 ${
          isGreen ? 'border-[#52b788]/20' : 'border-purple-500/20'
        }`}>
          <div className={`p-2 rounded-lg ${
            isGreen ? 'bg-[#2d6a4f]/30 text-[#74c69d]' : 'bg-purple-600/20 text-purple-300'
          }`}>
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className={`text-[10px] uppercase tracking-wider font-semibold ${
              isGreen ? 'text-[#a3b18a]' : 'text-purple-300/60'
            }`}>
              {lang === 'es' ? 'Estado' : 'Status'}
            </div>
            <div className={`text-xs font-medium ${isGreen ? 'text-[#fefae0]' : 'text-purple-100'}`}>
              {strings.badges.uptime[lang]}
            </div>
          </div>
        </div>

        <div className={`glass-panel p-3 rounded-xl border flex items-center gap-3 ${
          isGreen ? 'border-[#52b788]/20' : 'border-purple-500/20'
        }`}>
          <div className={`p-2 rounded-lg ${
            isGreen ? 'bg-[#40916c]/30 text-[#95d5b2]' : 'bg-fuchsia-600/20 text-fuchsia-300'
          }`}>
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <div className={`text-[10px] uppercase tracking-wider font-semibold ${
              isGreen ? 'text-[#a3b18a]' : 'text-purple-300/60'
            }`}>
              {lang === 'es' ? 'Compilación' : 'Build'}
            </div>
            <div className={`text-xs font-medium ${isGreen ? 'text-[#fefae0]' : 'text-purple-100'}`}>
              {strings.badges.version[lang]}
            </div>
          </div>
        </div>

        <div className={`glass-panel p-3 rounded-xl border flex items-center gap-3 col-span-2 sm:col-span-1 ${
          isGreen ? 'border-[#52b788]/20' : 'border-purple-500/20'
        }`}>
          <div className={`p-2 rounded-lg ${
            isGreen ? 'bg-[#52b788]/20 text-[#d8f3dc]' : 'bg-pink-600/20 text-pink-300'
          }`}>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className={`text-[10px] uppercase tracking-wider font-semibold ${
              isGreen ? 'text-[#a3b18a]' : 'text-purple-300/60'
            }`}>
              {lang === 'es' ? 'Seguridad' : 'Security'}
            </div>
            <div className={`text-xs font-medium ${isGreen ? 'text-[#fefae0]' : 'text-purple-100'}`}>
              {lang === 'es' ? 'Protegido con amor' : 'Protected with love'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Start Adventure CTA Button */}
      <button
        onClick={handleStartClick}
        className={`group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold text-lg sm:text-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-lg ${
          isGreen
            ? 'bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#52b788] hover:from-[#2d6a4f] hover:via-[#40916c] hover:to-[#74c69d] shadow-[0_0_30px_rgba(45,106,79,0.6)] hover:shadow-[0_0_45px_rgba(82,183,136,0.7)] text-[#fefae0]'
            : 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_45px_rgba(217,70,239,0.7)]'
        }`}
      >
        <span className="relative z-10 flex items-center gap-2">
          {hasStarted ? strings.continueAdventure[lang] : strings.startButton[lang]}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
        </span>
        <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      {/* Level preview roadmap cards */}
      <div className="mt-14 w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        {/* Card 1 */}
        <div className={`glass-panel p-4 rounded-2xl border transition-all hover:-translate-y-1 ${
          isGreen
            ? 'border-[#52b788]/20 hover:border-[#52b788]/40'
            : 'border-purple-500/20 hover:border-purple-400/40'
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${
            isGreen ? 'bg-[#2d6a4f]/30 text-[#74c69d]' : 'bg-purple-500/20 text-purple-300'
          }`}>
            <Compass className="w-4 h-4" />
          </div>
          <div className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
            isGreen ? 'text-[#74c69d]' : 'text-purple-300'
          }`}>
            {lang === 'es' ? 'Paso 1' : 'Step 1'}
          </div>
          <h2 className="text-base font-semibold text-white mb-1">
            {lang === 'es' ? '¿Cuánto recuerdas?' : 'How much do you remember?'}
          </h2>
          <p className={`text-xs leading-relaxed ${isGreen ? 'text-[#b7c4b0]' : 'text-purple-200/70'}`}>
            {lang === 'es'
              ? 'Un desafío interactivo sobre lo que hace único cada momento juntos.'
              : 'An interactive challenge about what makes every moment together unique.'}
          </p>
        </div>

        {/* Card 2 */}
        <div className={`glass-panel p-4 rounded-2xl border transition-all hover:-translate-y-1 ${
          isGreen
            ? 'border-[#52b788]/20 hover:border-[#52b788]/40'
            : 'border-purple-500/20 hover:border-purple-400/40'
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${
            isGreen ? 'bg-[#40916c]/30 text-[#95d5b2]' : 'bg-fuchsia-500/20 text-fuchsia-300'
          }`}>
            <Terminal className="w-4 h-4" />
          </div>
          <div className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
            isGreen ? 'text-[#95d5b2]' : 'text-fuchsia-300'
          }`}>
            {lang === 'es' ? 'Paso 2' : 'Step 2'}
          </div>
          <h2 className="text-base font-semibold text-white mb-1">
            LOVE.EXE
          </h2>
          <p className={`text-xs leading-relaxed ${isGreen ? 'text-[#b7c4b0]' : 'text-purple-200/70'}`}>
            {lang === 'es'
              ? 'Una consola de programación con comandos y mensajes hechos a tu medida.'
              : 'A coding console with commands and custom logs crafted for you.'}
          </p>
        </div>

        {/* Card 3 */}
        <div className={`glass-panel p-4 rounded-2xl border transition-all hover:-translate-y-1 ${
          isGreen
            ? 'border-[#52b788]/20 hover:border-[#52b788]/40'
            : 'border-purple-500/20 hover:border-purple-400/40'
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${
            isGreen ? 'bg-[#52b788]/30 text-[#d8f3dc]' : 'bg-pink-500/20 text-pink-300'
          }`}>
            <Heart className="w-4 h-4" />
          </div>
          <div className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
            isGreen ? 'text-[#d8f3dc]' : 'text-pink-300'
          }`}>
            {lang === 'es' ? 'Paso 3' : 'Step 3'}
          </div>
          <h2 className="text-base font-semibold text-white mb-1">
            {lang === 'es' ? 'Recuerdos y Carta' : 'Memories & Letter'}
          </h2>
          <p className={`text-xs leading-relaxed ${isGreen ? 'text-[#b7c4b0]' : 'text-purple-200/70'}`}>
            {lang === 'es'
              ? 'Nuestra galería de instantes y la carta secreta que espera al final.'
              : 'Our gallery of moments and the secret letter waiting at the very end.'}
          </p>
        </div>
      </div>
    </div>
  );
};
