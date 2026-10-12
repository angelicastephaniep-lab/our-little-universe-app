import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Edit3, 
  Image as ImageIcon, 
  Save, 
  RotateCcw, 
  Check, 
  Heart, 
  Upload,
  Palette
} from 'lucide-react';
import { AppCustomization, Language, UI_STRINGS } from '../customization';
import { soundManager } from '../utils/audio';
import { getPhotoCandidateUrls } from '../utils/photoResolver';
import { useTheme } from '../context/ThemeContext';

const ThumbnailPreview: React.FC<{
  memoryId: string;
  index: number;
  imageUrl?: string;
  title: string;
  lang: Language;
}> = ({ memoryId, index, imageUrl, title, lang }) => {
  const candidates = React.useMemo(
    () => getPhotoCandidateUrls(memoryId, index, imageUrl),
    [memoryId, index, imageUrl]
  );
  const [candidateIdx, setCandidateIdx] = React.useState(0);

  React.useEffect(() => {
    setCandidateIdx(0);
  }, [imageUrl]);

  if (candidateIdx >= candidates.length) {
    return (
      <div className="text-xs text-purple-300/60 flex items-center gap-1.5">
        <ImageIcon className="w-4 h-4" />
        <span>{lang === 'es' ? 'Ilustración por defecto' : 'Default illustration'}</span>
      </div>
    );
  }

  return (
    <img
      src={candidates[candidateIdx]}
      alt={title}
      onError={() => setCandidateIdx(prev => prev + 1)}
      className="w-full h-full object-cover"
    />
  );
};

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  currentData: AppCustomization;
  onSaveData: (newData: AppCustomization) => void;
  onResetData: () => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  lang,
  currentData,
  onSaveData,
  onResetData,
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'editor' | 'photos'>('guide');
  const [formData, setFormData] = useState<AppCustomization>(currentData);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const strings = UI_STRINGS.customizerModal;
  const { theme, setTheme, isGreen } = useTheme();

  if (!isOpen) return null;

  const handleSave = () => {
    soundManager.playSuccess();
    onSaveData(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleReset = () => {
    soundManager.playChime();
    onResetData();
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, memoryIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const updatedMemories = [...formData.level3Memories];
        updatedMemories[memoryIndex] = {
          ...updatedMemories[memoryIndex],
          imageUrl: reader.result,
        };
        setFormData({
          ...formData,
          level3Memories: updatedMemories,
        });
        soundManager.playChime();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-3xl max-h-[90vh] glass-panel-glow rounded-3xl overflow-hidden border flex flex-col shadow-2xl ${
        isGreen
          ? 'border-[#52b788]/40 bg-[#0a1e15] shadow-[0_0_50px_rgba(45,106,79,0.5)]'
          : 'border-purple-400/40 bg-[#110724] shadow-[0_0_50px_rgba(168,85,247,0.4)]'
      }`}>
        {/* Modal Header */}
        <div className={`p-4 sm:p-6 border-b flex items-center justify-between ${
          isGreen ? 'bg-[#0f2c1f] border-[#52b788]/20' : 'bg-[#190c33] border-purple-500/20'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              isGreen
                ? 'bg-[#1b4332] border-[#52b788]/40 text-[#d8f3dc]'
                : 'bg-purple-600/30 border-purple-400/30 text-purple-200'
            }`}>
              <Heart className={`w-5 h-5 fill-current ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'}`} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {strings.modalTitle[lang]}
              </h2>
              <p className={`text-xs ${isGreen ? 'text-[#a3b18a]' : 'text-purple-200/70'}`}>
                {strings.modalDescription[lang]}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playChime();
              onClose();
            }}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isGreen
                ? 'bg-[#0a2016] hover:bg-[#1b4332] text-[#a3b18a] hover:text-white'
                : 'bg-purple-900/40 hover:bg-purple-800 text-purple-300 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className={`flex border-b px-4 ${
          isGreen ? 'bg-[#0c2217] border-[#52b788]/20' : 'bg-[#14092b] border-purple-500/20'
        }`}>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'guide'
                ? isGreen
                  ? 'border-[#52b788] text-[#fefae0] bg-[#1b4332]/40'
                  : 'border-fuchsia-400 text-white bg-purple-900/20'
                : isGreen
                ? 'border-transparent text-[#a3b18a] hover:text-white'
                : 'border-transparent text-purple-300/70 hover:text-white'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'}`} />
            <span>{strings.tabGuide[lang]}</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'photos'
                ? isGreen
                  ? 'border-[#52b788] text-[#fefae0] bg-[#1b4332]/40'
                  : 'border-fuchsia-400 text-white bg-purple-900/20'
                : isGreen
                ? 'border-transparent text-[#a3b18a] hover:text-white'
                : 'border-transparent text-purple-300/70 hover:text-white'
            }`}
          >
            <ImageIcon className={`w-4 h-4 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'}`} />
            <span>{strings.tabPhotoHelper[lang]}</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'editor'
                ? isGreen
                  ? 'border-[#52b788] text-[#fefae0] bg-[#1b4332]/40'
                  : 'border-fuchsia-400 text-white bg-purple-900/20'
                : isGreen
                ? 'border-transparent text-[#a3b18a] hover:text-white'
                : 'border-transparent text-purple-300/70 hover:text-white'
            }`}
          >
            <Edit3 className={`w-4 h-4 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'}`} />
            <span>{strings.tabLiveEditor[lang]}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm ${
          isGreen ? 'text-[#fbf6ee]' : 'text-purple-100'
        }`}>
          {/* TAB 1: BEGINNER GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              {/* Theme Selector Section inside Guide */}
              <div className={`glass-panel p-4 rounded-2xl border ${
                isGreen ? 'border-[#52b788]/30 bg-[#0d2818]/60' : 'border-purple-500/30'
              }`}>
                <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                  <Palette className={`w-4 h-4 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'}`} />
                  <span>{lang === 'es' ? 'Temas de color disponibles' : 'Available Color Themes'}</span>
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed mb-3 ${
                  isGreen ? 'text-[#d8f3dc]' : 'text-purple-200/80'
                }`}>
                  {lang === 'es'
                    ? 'Puedes alternar entre el diseño morado original y el nuevo tema verde salvia y bosque en cualquier momento con este botón:'
                    : 'You can switch between the original purple design and the new sage/forest green theme at any time with this button:'}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      soundManager.playChime();
                      setTheme('purple');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                      theme === 'purple'
                        ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                        : 'bg-purple-950/60 border-purple-500/30 text-purple-300 hover:text-white'
                    }`}
                  >
                    <span>💜</span>
                    <span>{lang === 'es' ? 'Tema Morado' : 'Purple Theme'}</span>
                    {theme === 'purple' && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playChime();
                      setTheme('green');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                      theme === 'green'
                        ? 'bg-[#2d6a4f] text-[#fefae0] border-[#74c69d] shadow-[0_0_15px_rgba(82,183,136,0.6)]'
                        : 'bg-[#0a2016]/80 border-[#52b788]/30 text-[#a3b18a] hover:text-white'
                    }`}
                  >
                    <span>🌿</span>
                    <span>{lang === 'es' ? 'Tema Verde' : 'Green Theme'}</span>
                    {theme === 'green' && <Check className="w-3.5 h-3.5 text-[#a7c957]" />}
                  </button>
                </div>
              </div>

              {/* Code Organization Box */}
              <div className={`glass-panel p-4 rounded-2xl border ${
                isGreen ? 'border-[#52b788]/30' : 'border-purple-500/30'
              }`}>
                <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                  <span>✨ {lang === 'es' ? '¿Cómo está organizado el proyecto?' : 'How is the project organized?'}</span>
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed mb-3 ${
                  isGreen ? 'text-[#d8f3dc]' : 'text-purple-200/80'
                }`}>
                  {lang === 'es'
                    ? 'Todo el contenido editable se encuentra centralizado en un solo archivo principal: '
                    : 'All editable content is centralized in one main file: '}
                  <code className={`px-1.5 py-0.5 rounded font-mono-code font-bold ${
                    isGreen ? 'text-[#a7c957] bg-[#0a2016]' : 'text-fuchsia-300 bg-purple-950'
                  }`}>src/customization.ts</code>.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className={isGreen ? 'text-[#74c69d] font-bold' : 'text-fuchsia-400 font-bold'}>•</span>
                    <div><strong>Nombres y firma:</strong> <code className={isGreen ? 'text-[#95d5b2]' : 'text-purple-300'}>boyfriendName</code> y <code className={isGreen ? 'text-[#95d5b2]' : 'text-purple-300'}>girlfriendSignature</code>.</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className={isGreen ? 'text-[#74c69d] font-bold' : 'text-fuchsia-400 font-bold'}>•</span>
                    <div><strong>Nivel 1 (Pregunta):</strong> <code className={isGreen ? 'text-[#95d5b2]' : 'text-purple-300'}>level1</code>.</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className={isGreen ? 'text-[#74c69d] font-bold' : 'text-fuchsia-400 font-bold'}>•</span>
                    <div><strong>Nivel 2 (love.exe):</strong> <code className={isGreen ? 'text-[#95d5b2]' : 'text-purple-300'}>level2Messages</code>.</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className={isGreen ? 'text-[#74c69d] font-bold' : 'text-fuchsia-400 font-bold'}>•</span>
                    <div><strong>Nivel 3 (Recuerdos y fotos):</strong> <code className={isGreen ? 'text-[#95d5b2]' : 'text-purple-300'}>level3Memories</code> con tus 4 fotografías.</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className={isGreen ? 'text-[#74c69d] font-bold' : 'text-fuchsia-400 font-bold'}>•</span>
                    <div><strong>Carta Final:</strong> <code className={isGreen ? 'text-[#95d5b2]' : 'text-purple-300'}>finalLetter</code>.</div>
                  </div>
                </div>
              </div>

              <div className={`glass-panel p-4 rounded-2xl border ${
                isGreen ? 'border-[#52b788]/30' : 'border-purple-500/30'
              }`}>
                <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                  <ImageIcon className={`w-5 h-5 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-400'}`} />
                  <span>{lang === 'es' ? 'Tus cuatro fotografías originales' : 'Your four original photographs'}</span>
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed mb-3 ${
                  isGreen ? 'text-[#d8f3dc]' : 'text-purple-200/80'
                }`}>
                  {lang === 'es'
                    ? 'Las cuatro fotos están vinculadas en la carpeta public/photos/ con sus nombres reales de WhatsApp y respaldos automáticos.'
                    : 'All four photos are linked in the public/photos/ folder with their real WhatsApp names and automatic fallbacks.'}
                </p>
                <ol className={`list-decimal list-inside space-y-2 text-xs ${
                  isGreen ? 'text-[#b7c4b0]' : 'text-purple-200'
                }`}>
                  <li><strong>Recuerdo 1:</strong> WhatsApp Image 2026-10-07 at 7.32.01 PM.jpeg</li>
                  <li><strong>Recuerdo 2:</strong> WhatsApp Image 2026-09-18 at 4.40.44 PM.jpeg</li>
                  <li><strong>Recuerdo 3:</strong> WhatsApp Image 2026-10-08 at 11.44.18 PM.jpeg</li>
                  <li><strong>Recuerdo 4:</strong> WhatsApp Image 2026-09-21 at 2.49.27 PM.jpeg</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: PHOTO HELPER */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <p className={`text-xs ${isGreen ? 'text-[#d8f3dc]' : 'text-purple-200/80'}`}>
                {lang === 'es'
                  ? 'Puedes subir fotos desde tu dispositivo o pegar una URL de imagen para cada recuerdo. Los cambios se guardarán en tu navegador.'
                  : 'You can upload photos from your device or paste an image URL for each memory. Changes will be saved in your browser.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.level3Memories.map((mem, idx) => (
                  <div key={mem.id} className={`p-4 rounded-2xl border space-y-3 ${
                    isGreen ? 'bg-[#0a2016]/70 border-[#52b788]/25' : 'bg-purple-950/40 border-purple-500/20'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">
                        {mem.badge[lang]} • {mem.title[lang]}
                      </span>
                    </div>

                    {/* Preview box */}
                    <div className={`relative aspect-video rounded-xl overflow-hidden border flex items-center justify-center ${
                      isGreen ? 'bg-[#06150e] border-[#52b788]/20' : 'bg-purple-900/30 border-purple-500/20'
                    }`}>
                      <ThumbnailPreview
                        memoryId={mem.id}
                        index={idx}
                        imageUrl={mem.imageUrl}
                        title={mem.title[lang]}
                        lang={lang}
                      />
                    </div>

                    {/* URL Input */}
                    <div>
                      <label className={`block text-[11px] mb-1 font-medium ${
                        isGreen ? 'text-[#a3b18a]' : 'text-purple-300/80'
                      }`}>
                        {lang === 'es' ? 'Ruta o URL de la imagen:' : 'Image path or URL:'}
                      </label>
                      <input
                        type="text"
                        value={mem.imageUrl || ''}
                        onChange={(e) => {
                          const updated = [...formData.level3Memories];
                          updated[idx] = { ...updated[idx], imageUrl: e.target.value };
                          setFormData({ ...formData, level3Memories: updated });
                        }}
                        className={`w-full px-3 py-1.5 rounded-xl border text-xs focus:outline-none ${
                          isGreen
                            ? 'bg-[#0c2016] border-[#52b788]/30 text-white focus:border-[#74c69d]'
                            : 'bg-purple-900/40 border-purple-500/30 text-white focus:border-fuchsia-400'
                        }`}
                        placeholder="/photos/WhatsApp Image..."
                      />
                    </div>

                    {/* Upload from device */}
                    <label className={`w-full py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      isGreen
                        ? 'bg-[#1b4332] hover:bg-[#2d6a4f] border-[#52b788]/30 text-[#d8f3dc]'
                        : 'bg-purple-900/60 hover:bg-purple-800 border-purple-400/30 text-purple-200'
                    }`}>
                      <Upload className={`w-3.5 h-3.5 ${isGreen ? 'text-[#74c69d]' : 'text-fuchsia-300'}`} />
                      <span>{lang === 'es' ? 'Subir desde dispositivo' : 'Upload from device'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, idx)}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE EDITOR */}
          {activeTab === 'editor' && (
            <div className="space-y-6">
              {/* Names */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isGreen ? 'bg-[#0a2016]/70 border-[#52b788]/25' : 'bg-purple-950/40 border-purple-500/20'
              }`}>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                  {lang === 'es' ? '1. Nombres y Firma' : '1. Names & Signature'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs mb-1 ${isGreen ? 'text-[#a3b18a]' : 'text-purple-300'}`}>
                      {lang === 'es' ? 'Nombre o apodo de tu novio:' : "Your boyfriend's name:"}
                    </label>
                    <input
                      type="text"
                      value={formData.boyfriendName[lang]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          boyfriendName: { ...formData.boyfriendName, [lang]: e.target.value },
                        })
                      }
                      className={`w-full px-3 py-2 rounded-xl border text-white text-xs focus:outline-none ${
                        isGreen
                          ? 'bg-[#0c2016] border-[#52b788]/30 focus:border-[#74c69d]'
                          : 'bg-purple-900/40 border-purple-500/30 focus:border-fuchsia-400'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs mb-1 ${isGreen ? 'text-[#a3b18a]' : 'text-purple-300'}`}>
                      {lang === 'es' ? 'Tu firma cariñosa:' : 'Your signature:'}
                    </label>
                    <input
                      type="text"
                      value={formData.girlfriendSignature[lang]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          girlfriendSignature: { ...formData.girlfriendSignature, [lang]: e.target.value },
                        })
                      }
                      className={`w-full px-3 py-2 rounded-xl border text-white text-xs focus:outline-none ${
                        isGreen
                          ? 'bg-[#0c2016] border-[#52b788]/30 focus:border-[#74c69d]'
                          : 'bg-purple-900/40 border-purple-500/30 focus:border-fuchsia-400'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Letter */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isGreen ? 'bg-[#0a2016]/70 border-[#52b788]/25' : 'bg-purple-950/40 border-purple-500/20'
              }`}>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                  {lang === 'es' ? '2. Carta de Amor' : '2. Love Letter'}
                </h4>
                <div>
                  <label className={`block text-xs mb-1 ${isGreen ? 'text-[#a3b18a]' : 'text-purple-300'}`}>
                    {lang === 'es' ? 'Saludo inicial:' : 'Salutation:'}
                  </label>
                  <input
                    type="text"
                    value={formData.finalLetter.salutation[lang]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        finalLetter: {
                          ...formData.finalLetter,
                          salutation: { ...formData.finalLetter.salutation, [lang]: e.target.value },
                        },
                      })
                    }
                    className={`w-full px-3 py-2 rounded-xl border text-white text-xs focus:outline-none ${
                      isGreen
                        ? 'bg-[#0c2016] border-[#52b788]/30 focus:border-[#74c69d]'
                        : 'bg-purple-900/40 border-purple-500/30 focus:border-fuchsia-400'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`block text-xs font-medium ${isGreen ? 'text-[#a3b18a]' : 'text-purple-300'}`}>
                    {lang === 'es' ? 'Párrafos de la carta:' : 'Letter paragraphs:'}
                  </label>
                  {formData.finalLetter.paragraphs.map((p, idx) => (
                    <div key={idx}>
                      <textarea
                        rows={2}
                        value={p[lang]}
                        onChange={(e) => {
                          const updated = [...formData.finalLetter.paragraphs];
                          updated[idx] = { ...updated[idx], [lang]: e.target.value };
                          setFormData({
                            ...formData,
                            finalLetter: { ...formData.finalLetter, paragraphs: updated },
                          });
                        }}
                        className={`w-full p-2.5 rounded-xl border text-white text-xs focus:outline-none ${
                          isGreen
                            ? 'bg-[#0c2016] border-[#52b788]/30 focus:border-[#74c69d]'
                            : 'bg-purple-900/40 border-purple-500/30 focus:border-fuchsia-400'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className={`p-4 sm:p-5 border-t flex flex-wrap items-center justify-between gap-3 ${
          isGreen ? 'bg-[#0c2217] border-[#52b788]/20' : 'bg-[#160c30] border-purple-500/20'
        }`}>
          <button
            onClick={handleReset}
            className={`px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              isGreen
                ? 'bg-[#0a2016] hover:bg-[#1b4332] border-[#52b788]/30 text-[#a3b18a]'
                : 'bg-purple-950/80 hover:bg-purple-900 border-purple-500/30 text-purple-300'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{strings.resetDefaults[lang]}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                isGreen
                  ? 'bg-[#1b4332]/50 hover:bg-[#1b4332] text-[#d8f3dc]'
                  : 'bg-purple-900/50 hover:bg-purple-900 text-purple-200'
              }`}
            >
              {strings.close[lang]}
            </button>
            <button
              onClick={handleSave}
              className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                isGreen
                  ? 'bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#52b788] hover:from-[#2d6a4f] hover:to-[#74c69d] text-[#fefae0] shadow-[0_0_15px_rgba(82,183,136,0.5)]'
                  : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]'
              }`}
            >
              {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{saveSuccess ? strings.savedAlert[lang] : strings.saveChanges[lang]}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
