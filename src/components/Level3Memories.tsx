import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Heart, 
  Calendar, 
  Eye, 
  X, 
  ArrowRight, 
  Info, 
  Camera, 
  Upload, 
  CheckCircle2
} from 'lucide-react';
import { Language, MemoryPhoto, UI_STRINGS } from '../customization';
import { soundManager } from '../utils/audio';
import { getPhotoCandidateUrls } from '../utils/photoResolver';
import { useTheme } from '../context/ThemeContext';

interface MemoryCardPhotoProps {
  memory: MemoryPhoto;
  index: number;
  lang: Language;
  className?: string;
  renderPlaceholder: () => React.ReactNode;
}

const MemoryCardPhoto: React.FC<MemoryCardPhotoProps> = ({
  memory,
  index,
  lang,
  className,
  renderPlaceholder,
}) => {
  const candidates = useMemo(
    () => getPhotoCandidateUrls(memory.id, index, memory.imageUrl),
    [memory.id, index, memory.imageUrl]
  );
  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    setCandidateIndex(0);
  }, [memory.imageUrl]);

  if (candidateIndex >= candidates.length) {
    return <>{renderPlaceholder()}</>;
  }

  const currentUrl = candidates[candidateIndex];

  return (
    <img
      src={currentUrl}
      alt={memory.title[lang]}
      onError={() => {
        setCandidateIndex(prev => prev + 1);
      }}
      className={className || "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"}
      loading="lazy"
    />
  );
};

interface Level3MemoriesProps {
  memories: MemoryPhoto[];
  lang: Language;
  onComplete: () => void;
  onProceedToSurprise: () => void;
  isAlreadyCompleted: boolean;
  onOpenCustomizer: () => void;
  onUpdateMemoryPhoto?: (memoryIndex: number, newImageUrl: string) => void;
}

export const Level3Memories: React.FC<Level3MemoriesProps> = ({
  memories,
  lang,
  onComplete,
  onProceedToSurprise,
  isAlreadyCompleted,
  onOpenCustomizer,
  onUpdateMemoryPhoto,
}) => {
  const [activeMemory, setActiveMemory] = useState<MemoryPhoto | null>(null);
  const [viewedMemoryIds, setViewedMemoryIds] = useState<Set<string>>(
    new Set(isAlreadyCompleted ? memories.map(m => m.id) : [])
  );
  const [showPhotoTips, setShowPhotoTips] = useState<boolean>(false);
  const strings = UI_STRINGS;
  const { isGreen } = useTheme();

  const handleDirectUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        soundManager.playSuccess();
        if (onUpdateMemoryPhoto) {
          onUpdateMemoryPhoto(index, reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenMemory = (memory: MemoryPhoto) => {
    soundManager.playChime();
    setActiveMemory(memory);

    const updated = new Set(viewedMemoryIds);
    updated.add(memory.id);
    setViewedMemoryIds(updated);

    if (updated.size >= Math.min(3, memories.length)) {
      onComplete();
    }
  };

  const handleCloseModal = () => {
    soundManager.playChime();
    setActiveMemory(null);
  };

  // Helper placeholder illustrations (pure SVG/gradient vectors, no fake human photos)
  const renderPlaceholderIllustration = (palette: string, index: number) => {
    if (index === 0) {
      return (
        <div className={`w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden ${
          isGreen 
            ? 'bg-gradient-to-br from-[#0c2016] via-[#1b4332] to-[#2d6a4f]' 
            : 'bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-950'
        }`}>
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#d8b4fe_1px,transparent_1px)] [background-size:16px_16px]" />
          <svg className={`w-24 h-24 drop-shadow-md ${isGreen ? 'text-[#a3b18a]' : 'text-fuchsia-300'}`} viewBox="0 0 100 100" fill="none">
            <circle cx="20" cy="30" r="3" fill="currentColor" />
            <circle cx="50" cy="20" r="4" fill="currentColor" />
            <circle cx="80" cy="35" r="3" fill="currentColor" />
            <circle cx="65" cy="70" r="4" fill="currentColor" />
            <circle cx="35" cy="75" r="3" fill="currentColor" />
            <line x1="20" y1="30" x2="50" y2="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="50" y1="20" x2="80" y2="35" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="80" y1="35" x2="65" y2="70" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="65" y1="70" x2="35" y2="75" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="35" y1="75" x2="20" y2="30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>
          <span className="text-[11px] font-mono-code text-white/90 mt-2 font-medium tracking-wider">
            {lang === 'es' ? 'Recuerdo 01' : 'Memory 01'}
          </span>
        </div>
      );
    } else if (index === 1) {
      return (
        <div className={`w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden ${
          isGreen 
            ? 'bg-gradient-to-br from-[#091a12] via-[#163824] to-[#25593c]' 
            : 'bg-gradient-to-br from-purple-950 via-violet-900 to-indigo-950'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
              isGreen ? 'bg-[#2d6a4f]/50 border-[#52b788]/40 text-[#d8f3dc]' : 'bg-purple-800/40 border-purple-400/40 text-purple-200'
            }`}>
              ☕
            </div>
            <Heart className={`w-5 h-5 fill-current animate-pulse ${isGreen ? 'text-[#74c69d]' : 'text-pink-400'}`} />
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
              isGreen ? 'bg-[#2d6a4f]/50 border-[#52b788]/40 text-[#d8f3dc]' : 'bg-purple-800/40 border-purple-400/40 text-purple-200'
            }`}>
              ☕
            </div>
          </div>
          <span className="text-[11px] font-mono-code text-white/90 mt-2 font-medium tracking-wider">
            {lang === 'es' ? 'Recuerdo 02' : 'Memory 02'}
          </span>
        </div>
      );
    } else if (index === 2) {
      return (
        <div className={`w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden ${
          isGreen 
            ? 'bg-gradient-to-br from-[#0b2418] via-[#1c4d35] to-[#2d6a4f]' 
            : 'bg-gradient-to-br from-fuchsia-950 via-purple-900 to-pink-950'
        }`}>
          <div className="font-mono-code text-xs text-white/90 bg-black/40 px-3 py-2 rounded-xl border border-white/10 mb-2">
            <code>{'<Developer novio={true} />'}</code>
          </div>
          <Heart className={`w-8 h-8 fill-current animate-bounce ${isGreen ? 'text-[#74c69d]' : 'text-pink-400'}`} />
          <span className="text-[11px] font-mono-code text-white/90 mt-2 font-medium tracking-wider">
            {lang === 'es' ? 'Recuerdo 03' : 'Memory 03'}
          </span>
        </div>
      );
    } else {
      return (
        <div className={`w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden ${
          isGreen 
            ? 'bg-gradient-to-br from-[#06150e] via-[#163824] to-[#2d6a4f]' 
            : 'bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950'
        }`}>
          <div className="relative mb-2">
            <div className={`w-16 h-16 rounded-full blur-md ${isGreen ? 'bg-[#52b788]/30' : 'bg-fuchsia-500/30'}`} />
            <Sparkles className={`w-10 h-10 absolute inset-0 m-auto ${isGreen ? 'text-[#95d5b2]' : 'text-fuchsia-300'}`} />
          </div>
          <span className="text-[11px] font-mono-code text-white/90 font-medium tracking-wider">
            {lang === 'es' ? 'Recuerdo 04' : 'Memory 04'}
          </span>
        </div>
      );
    }
  };

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Header Badge & Tips toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
          isGreen
            ? 'bg-[#1b4332]/60 border-[#52b788]/40 text-[#d8f3dc]'
            : 'bg-purple-900/60 border-purple-400/30 text-purple-200'
        }`}>
          <Sparkles className={`w-3.5 h-3.5 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'}`} />
          <span>{strings.level3.badge[lang]}</span>
        </div>

        <button
          onClick={() => {
            soundManager.playChime();
            setShowPhotoTips(!showPhotoTips);
          }}
          className={`inline-flex items-center gap-1.5 text-xs transition-colors cursor-pointer px-2.5 py-1 rounded-full border ${
            isGreen
              ? 'text-[#a3b18a] hover:text-[#fefae0] bg-[#0a2016]/60 border-[#52b788]/20'
              : 'text-purple-300 hover:text-purple-100 bg-purple-950/40 border-purple-500/20'
          }`}
        >
          <Info className={`w-3.5 h-3.5 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'}`} />
          <span>{showPhotoTips ? (lang === 'es' ? 'Ocultar guía' : 'Hide guide') : strings.level3.howToChange[lang]}</span>
        </button>
      </div>

      {/* Title & Subtitle */}
      <div className="text-center sm:text-left mb-8">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-2 flex items-center justify-center sm:justify-start gap-2">
          <span>{strings.level3.title[lang]}</span>
          <span className={isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'}>
            {isGreen ? '🌿' : '📸'}
          </span>
        </h2>
        <p className={`text-sm sm:text-base max-w-2xl ${isGreen ? 'text-[#d8f3dc]' : 'text-purple-200/80'}`}>
          {strings.level3.subtitle[lang]}
        </p>
      </div>

      {/* Helpful Photo Placement Guide if expanded */}
      {showPhotoTips && (
        <div className={`mb-8 p-5 rounded-2xl border text-xs sm:text-sm space-y-3 animate-fadeIn ${
          isGreen
            ? 'glass-panel border-[#52b788]/40 text-[#fbf6ee]'
            : 'glass-panel border-purple-400/40 text-purple-100'
        }`}>
          <div className={`font-semibold flex items-center gap-2 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-300'}`}>
            <Camera className="w-4 h-4" />
            <span>{strings.level3.howToChange[lang]}</span>
          </div>
          <p className={`leading-relaxed ${isGreen ? 'text-[#d8f3dc]' : 'text-purple-200/90'}`}>
            {strings.level3.replaceInstructions[lang]}
          </p>
          <div className={`p-3 rounded-xl border font-mono-code text-xs space-y-1 ${
            isGreen
              ? 'bg-[#0a2016]/80 border-[#52b788]/20 text-[#a3b18a]'
              : 'bg-purple-950/60 border-purple-500/20 text-purple-300'
          }`}>
            <div>💡 <strong>Opción 1:</strong> Abre el botón <span className={isGreen ? 'text-[#74c69d]' : 'text-fuchsia-300'}>"Personalizar 🛠️"</span> arriba para pegar enlaces de fotos o subir imágenes directamente.</div>
            <div>📁 <strong>Opción 2:</strong> Tus fotografías originales de WhatsApp están vinculadas en <code className={isGreen ? 'text-[#fefae0]' : 'text-fuchsia-200'}>public/photos/</code>.</div>
          </div>
          <button
            onClick={() => {
              setShowPhotoTips(false);
              onOpenCustomizer();
            }}
            className={`px-3 py-1.5 rounded-lg text-white font-medium text-xs transition-colors cursor-pointer ${
              isGreen ? 'bg-[#2d6a4f] hover:bg-[#40916c]' : 'bg-fuchsia-600 hover:bg-fuchsia-500'
            }`}
          >
            {lang === 'es' ? 'Abrir Editor de Fotos Ahora ➔' : 'Open Photo Editor Now ➔'}
          </button>
        </div>
      )}

      {/* Memories Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {memories.map((memory, index) => {
          const isExplored = viewedMemoryIds.has(memory.id);

          return (
            <div
              key={memory.id}
              onClick={() => handleOpenMemory(memory)}
              className={`group glass-panel rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 cursor-pointer shadow-lg flex flex-col ${
                isGreen
                  ? 'border-[#52b788]/30 hover:border-[#74c69d]/60 hover:shadow-[0_10px_30px_rgba(45,106,79,0.35)]'
                  : 'border-purple-500/30 hover:border-fuchsia-400/60 hover:shadow-[0_10px_30px_rgba(168,85,247,0.35)]'
              }`}
            >
              {/* Photo Frame Container (polaroid aspect ratio) */}
              <div className={`relative aspect-[4/3] w-full overflow-hidden ${
                isGreen ? 'bg-[#0a2016]' : 'bg-purple-950/40'
              }`}>
                <MemoryCardPhoto
                  memory={memory}
                  index={index}
                  lang={lang}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  renderPlaceholder={() => renderPlaceholderIllustration(memory.palette, index)}
                />

                {/* Badge top-left */}
                <div className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full backdrop-blur-md border text-[10px] font-medium ${
                  isGreen
                    ? 'bg-[#0a2016]/85 border-[#52b788]/40 text-[#d8f3dc]'
                    : 'bg-purple-950/80 border-purple-400/30 text-purple-200'
                }`}>
                  {memory.badge[lang]}
                </div>

                {/* Explored status indicator */}
                {isExplored && (
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-400/50 text-[10px] font-medium text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{strings.level3.cardExplored[lang]}</span>
                  </div>
                )}

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <span className={`px-3 py-1.5 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 shadow-md ${
                    isGreen ? 'bg-[#1b4332]/95 border border-[#52b788]/40' : 'bg-purple-900/90'
                  }`}>
                    <Eye className={`w-3.5 h-3.5 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-300'}`} />
                    <span>{strings.level3.clickToOpen[lang]}</span>
                  </span>
                </div>

                {/* Direct photo upload button */}
                <label
                  onClick={(e) => e.stopPropagation()}
                  className={`absolute bottom-2.5 right-2.5 z-20 px-2.5 py-1 rounded-xl border transition-all cursor-pointer shadow-md backdrop-blur-sm flex items-center gap-1.5 text-[11px] ${
                    isGreen
                      ? 'bg-[#0a2016]/85 hover:bg-[#1b4332]/90 text-[#d8f3dc] hover:text-white border-[#52b788]/30'
                      : 'bg-purple-950/85 hover:bg-fuchsia-900/90 text-purple-200 hover:text-white border-purple-400/30'
                  }`}
                  title={lang === 'es' ? 'Cambiar por tu foto' : 'Change photo'}
                >
                  <Camera className={`w-3.5 h-3.5 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-300'}`} />
                  <span className="font-medium">
                    {lang === 'es' ? 'Cambiar foto' : 'Change photo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleDirectUpload(e, index)}
                  />
                </label>
              </div>

              {/* Card Bottom Meta */}
              <div className={`p-4 flex-1 flex flex-col justify-between ${
                isGreen ? 'bg-[#0c2016]/95' : 'bg-[#130926]/90'
              }`}>
                <div>
                  {memory.date && (
                    <div className={`flex items-center gap-1 text-[11px] mb-1 ${
                      isGreen ? 'text-[#a3b18a]' : 'text-purple-300/70'
                    }`}>
                      <Calendar className={`w-3 h-3 ${isGreen ? 'text-[#74c69d]' : 'text-purple-400'}`} />
                      <span>{memory.date[lang]}</span>
                    </div>
                  )}
                  <h3 className={`font-bold text-sm text-white transition-colors ${
                    isGreen ? 'group-hover:text-[#b7e4c7]' : 'group-hover:text-fuchsia-200'
                  }`}>
                    {memory.title[lang]}
                  </h3>
                  <p className={`text-xs mt-1 line-clamp-2 ${
                    isGreen ? 'text-[#b7c4b0]' : 'text-purple-200/70'
                  }`}>
                    {memory.caption[lang]}
                  </p>
                </div>

                <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] ${
                  isGreen ? 'border-[#52b788]/15 text-[#74c69d]' : 'border-purple-500/15 text-purple-400'
                }`}>
                  <span className="font-medium transition-colors group-hover:text-white">
                    {lang === 'es' ? 'Leer recuerdo' : 'Read memory'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress towards final surprise */}
      <div className={`glass-panel p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isGreen ? 'border-[#52b788]/30' : 'border-fuchsia-400/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md ${
            isGreen
              ? 'bg-gradient-to-tr from-[#1b4332] via-[#2d6a4f] to-[#52b788] shadow-[0_0_15px_rgba(82,183,136,0.4)]'
              : 'bg-gradient-to-tr from-purple-600 to-fuchsia-600 shadow-[0_0_15px_rgba(217,70,239,0.5)]'
          }`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-sm sm:text-base">
              {lang === 'es'
                ? `Recuerdos explorados: ${viewedMemoryIds.size} de ${memories.length}`
                : `Memories explored: ${viewedMemoryIds.size} of ${memories.length}`}
            </div>
            <div className={`text-xs ${isGreen ? 'text-[#d8f3dc]' : 'text-purple-200/80'}`}>
              {viewedMemoryIds.size >= memories.length
                ? (lang === 'es' ? '¡Todos los recuerdos abiertos! La sorpresa final está lista.' : 'All memories opened! Your final surprise is ready.')
                : (lang === 'es' ? 'Abre los recuerdos para desbloquear el siguiente gran paso.' : 'Open memories to unlock the next big milestone.')}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playRomanticFanfare();
            try {
              confetti({
                particleCount: 70,
                spread: 80,
                origin: { y: 0.6 },
                colors: isGreen
                  ? ['#2d6a4f', '#52b788', '#74c69d', '#95d5b2', '#fefae0']
                  : ['#c084fc', '#e879f9', '#a855f7', '#f472b6', '#ffffff'],
              });
            } catch {
              // safe confetti
            }
            onProceedToSurprise();
          }}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 shrink-0 shadow-lg ${
            isGreen
              ? 'bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#52b788] hover:from-[#2d6a4f] hover:via-[#40916c] hover:to-[#74c69d] text-[#fefae0] shadow-[0_0_25px_rgba(82,183,136,0.6)]'
              : 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 text-white shadow-[0_0_25px_rgba(217,70,239,0.6)]'
          }`}
        >
          <span>{strings.level3.nextToSurprise[lang]}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Detailed Memory Modal */}
      {activeMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`relative w-full max-w-xl glass-panel-glow rounded-3xl overflow-hidden border animate-scaleUp shadow-2xl ${
            isGreen
              ? 'border-[#52b788]/50 shadow-[0_0_50px_rgba(45,106,79,0.5)]'
              : 'border-purple-400/50 shadow-[0_0_50px_rgba(168,85,247,0.4)]'
          }`}>
            {/* Modal close button */}
            <button
              onClick={handleCloseModal}
              className={`absolute top-4 right-4 z-10 p-2 rounded-full border transition-all cursor-pointer ${
                isGreen
                  ? 'bg-[#0a2016]/80 hover:bg-[#1b4332] border-[#52b788]/30 text-[#d8f3dc] hover:text-white'
                  : 'bg-purple-950/80 hover:bg-purple-900 border-purple-400/30 text-purple-200 hover:text-white'
              }`}
              title={strings.level3.closeModal[lang]}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header */}
            <div className={`relative aspect-[16/9] w-full overflow-hidden ${
              isGreen ? 'bg-[#0a2016]' : 'bg-purple-950/60'
            }`}>
              <MemoryCardPhoto
                memory={activeMemory}
                index={memories.findIndex(m => m.id === activeMemory.id)}
                lang={lang}
                className="w-full h-full object-cover"
                renderPlaceholder={() =>
                  renderPlaceholderIllustration(
                    activeMemory.palette,
                    memories.findIndex(m => m.id === activeMemory.id)
                  )
                }
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${
                isGreen ? 'from-[#0c2016] via-transparent to-transparent' : 'from-[#130926] via-transparent to-transparent'
              }`} />
            </div>

            {/* Modal Content */}
            <div className={`p-6 sm:p-8 -mt-6 relative z-10 rounded-t-3xl border-t ${
              isGreen
                ? 'bg-[#0c2016] border-[#52b788]/20'
                : 'bg-[#130926] border-purple-500/20'
            }`}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full border text-xs font-medium ${
                  isGreen
                    ? 'bg-[#1b4332]/70 border-[#52b788]/40 text-[#d8f3dc]'
                    : 'bg-purple-900/60 border-purple-400/30 text-purple-200'
                }`}>
                  {activeMemory.badge[lang]}
                </span>
                {activeMemory.date && (
                  <span className={`text-xs flex items-center gap-1 font-mono-code ${
                    isGreen ? 'text-[#a3b18a]' : 'text-purple-300/70'
                  }`}>
                    <Calendar className={`w-3.5 h-3.5 ${isGreen ? 'text-[#74c69d]' : 'text-purple-400'}`} />
                    {activeMemory.date[lang]}
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {activeMemory.title[lang]}
              </h3>

              <p className={`text-sm font-medium italic mb-4 ${
                isGreen ? 'text-[#95d5b2]' : 'text-fuchsia-300/90'
              }`}>
                "{activeMemory.caption[lang]}"
              </p>

              <div className={`p-4 rounded-2xl border text-sm leading-relaxed mb-6 ${
                isGreen
                  ? 'bg-[#081a11]/60 border-[#52b788]/25 text-[#fbf6ee]'
                  : 'bg-purple-950/50 border-purple-500/20 text-purple-100'
              }`}>
                {activeMemory.fullNote[lang]}
              </div>

              <div className={`flex items-center justify-between pt-4 border-t ${
                isGreen ? 'border-[#52b788]/20' : 'border-purple-500/20'
              }`}>
                <div className={`flex items-center gap-1.5 text-xs ${
                  isGreen ? 'text-[#a3b18a]' : 'text-purple-300/80'
                }`}>
                  <Heart className={`w-4 h-4 fill-current ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'}`} />
                  <span>{lang === 'es' ? 'Recuerdo guardado para siempre' : 'Memory kept forever'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-all shadow-sm ${
                    isGreen
                      ? 'bg-[#1b4332] hover:bg-[#2d6a4f] border-[#52b788]/40 text-[#d8f3dc] hover:text-white'
                      : 'bg-purple-900/80 hover:bg-fuchsia-900/90 border-purple-400/30 text-purple-200 hover:text-white'
                  }`}>
                    <Upload className={`w-3.5 h-3.5 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-300'}`} />
                    <span>{lang === 'es' ? 'Cambiar por tu foto' : 'Upload your photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const idx = memories.findIndex(m => m.id === activeMemory.id);
                        if (idx !== -1) handleDirectUpload(e, idx);
                      }}
                    />
                  </label>
                  <button
                    onClick={handleCloseModal}
                    className={`px-4 py-2 rounded-xl text-white text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                      isGreen ? 'bg-[#2d6a4f] hover:bg-[#40916c]' : 'bg-purple-700 hover:bg-purple-600'
                    }`}
                  >
                    {strings.level3.closeModal[lang]}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
