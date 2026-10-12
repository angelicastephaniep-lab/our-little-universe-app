/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  AppCustomization, 
  INITIAL_CUSTOMIZATION, 
  Language, 
  UI_STRINGS 
} from './customization';
import { soundManager } from './utils/audio';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Starfield } from './components/Starfield';
import { Header, ScreenId } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Level1Question } from './components/Level1Question';
import { Level2LoveExe } from './components/Level2LoveExe';
import { Level3Memories } from './components/Level3Memories';
import { FinalSurprise } from './components/FinalSurprise';
import { CustomizationModal } from './components/CustomizationModal';

const STORAGE_KEY_PROGRESS = 'our_little_universe_progress';
const STORAGE_KEY_CUSTOMIZATION = 'our_little_universe_custom_data';
const STORAGE_KEY_LANG = 'our_little_universe_lang';
const STORAGE_KEY_MUTED = 'our_little_universe_muted';

function AppContent() {
  const { isGreen } = useTheme();

  // 1. Language state: Spanish is default
  const [lang, setLang] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY_LANG);
      return savedLang === 'en' ? 'en' : 'es';
    } catch {
      return 'es';
    }
  });

  // 2. Screen state
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('welcome');

  // 3. Audio mute state
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_MUTED) === 'true';
    } catch {
      return false;
    }
  });

  // 4. Progress state
  const [completedLevels, setCompletedLevels] = useState<{
    level1: boolean;
    level2: boolean;
    level3: boolean;
    surpriseUnlocked: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {
      level1: false,
      level2: false,
      level3: false,
      surpriseUnlocked: false,
    };
  });

  // 5. Customization data state with resilient merge
  const [customData, setCustomData] = useState<AppCustomization>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOMIZATION);
      if (saved) {
        const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.level3Memories)) {
            parsed.level3Memories = parsed.level3Memories.map((mem: any, idx: number) => {
              const defaultMem = INITIAL_CUSTOMIZATION.level3Memories[idx];
              const isOldGenericDefault = mem.imageUrl === `/photos/foto${idx + 1}.jpg` || mem.imageUrl === `foto${idx + 1}.jpg`;
              return {
                ...defaultMem,
                ...mem,
                imageUrl: (!mem.imageUrl || isOldGenericDefault) ? defaultMem?.imageUrl : mem.imageUrl,
              };
            });
          }

          // Ensure Level 1 has all 14 updated options and exact prompt
          if (!parsed.level1 || !Array.isArray(parsed.level1.options) || parsed.level1.options.length < 14) {
            parsed.level1 = INITIAL_CUSTOMIZATION.level1;
          }

          return {
            ...INITIAL_CUSTOMIZATION,
            ...parsed,
            level1: (!parsed.level1 || !Array.isArray(parsed.level1.options) || parsed.level1.options.length < 14)
              ? INITIAL_CUSTOMIZATION.level1
              : parsed.level1,
          };
        }
      } catch {
        // fallback
      }
      return INITIAL_CUSTOMIZATION;
    });

  // 6. Customization modal state
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);

  // Sync sound manager with mute state
  useEffect(() => {
    soundManager.setMuted(isMuted);
    try {
      localStorage.setItem(STORAGE_KEY_MUTED, String(isMuted));
    } catch {
      // safe
    }
  }, [isMuted]);

  // Persist language
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
      document.documentElement.lang = lang;
    } catch {
      // safe
    }
  }, [lang]);

  // Persist progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(completedLevels));
    } catch {
      // safe
    }
  }, [completedLevels]);

  // Scroll reliably to top on every screen/level transition (Level 1 -> 2, Level 2 -> 3, etc.)
  // Handles window, documentElement, body, and root elements with immediate + next-tick execution
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
      const rootEl = document.getElementById('root');
      if (rootEl) {
        rootEl.scrollTop = 0;
      }
      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.scrollTop = 0;
      }
    };

    scrollToTop();
    // Re-verify after React finishes layout & paint of the new level component
    const timerId = setTimeout(scrollToTop, 20);
    return () => clearTimeout(timerId);
  }, [currentScreen]);

  const handleToggleLang = (newLang: Language) => {
    setLang(newLang);
  };

  const handleToggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const handleSaveCustomData = (newData: AppCustomization) => {
    setCustomData(newData);
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOMIZATION, JSON.stringify(newData));
    } catch {
      // safe
    }
  };

  const handleResetCustomData = () => {
    setCustomData(INITIAL_CUSTOMIZATION);
    try {
      localStorage.removeItem(STORAGE_KEY_CUSTOMIZATION);
    } catch {
      // safe
    }
  };

  const handleUpdateMemoryPhoto = (memoryIndex: number, newImageUrl: string) => {
    const updatedMemories = [...customData.level3Memories];
    updatedMemories[memoryIndex] = {
      ...updatedMemories[memoryIndex],
      imageUrl: newImageUrl,
    };
    const updatedData = {
      ...customData,
      level3Memories: updatedMemories,
    };
    handleSaveCustomData(updatedData);
  };

  // Level progression handlers
  const handleLevel1Complete = () => {
    setCompletedLevels(prev => ({ ...prev, level1: true }));
  };

  const handleLevel2Complete = () => {
    setCompletedLevels(prev => ({ ...prev, level2: true }));
  };

  const handleLevel3Complete = () => {
    setCompletedLevels(prev => ({ ...prev, level3: true }));
  };

  const handleSurpriseUnlock = () => {
    setCompletedLevels(prev => ({ ...prev, surpriseUnlocked: true }));
  };

  return (
    <div className={`relative min-h-screen flex flex-col font-sans select-none transition-colors duration-300 ${
      isGreen ? 'text-[#fbf6ee]' : 'text-[#f3e8ff]'
    }`}>
      {/* Dynamic Starfield & Heart particles */}
      <Starfield />

      {/* Persistent Navigation & Status Bar */}
      <Header
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        lang={lang}
        onToggleLang={handleToggleLang}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        completedLevels={completedLevels}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col justify-center">
        {currentScreen === 'welcome' && (
          <WelcomeScreen
            lang={lang}
            onStart={() => {
              setCurrentScreen('level1');
            }}
            hasStarted={completedLevels.level1}
          />
        )}

        {currentScreen === 'level1' && (
          <Level1Question
            config={customData.level1}
            lang={lang}
            onComplete={handleLevel1Complete}
            onProceedToLevel2={() => setCurrentScreen('level2')}
            isAlreadyCompleted={completedLevels.level1}
          />
        )}

        {currentScreen === 'level2' && (
          <Level2LoveExe
            messages={customData.level2Messages}
            lang={lang}
            onComplete={handleLevel2Complete}
            onProceedToLevel3={() => setCurrentScreen('level3')}
            isAlreadyCompleted={completedLevels.level2}
          />
        )}

        {currentScreen === 'level3' && (
          <Level3Memories
            memories={customData.level3Memories}
            lang={lang}
            onComplete={handleLevel3Complete}
            onProceedToSurprise={() => setCurrentScreen('surprise')}
            isAlreadyCompleted={completedLevels.level3}
            onOpenCustomizer={() => setIsCustomizerOpen(true)}
            onUpdateMemoryPhoto={handleUpdateMemoryPhoto}
          />
        )}

        {currentScreen === 'surprise' && (
          <FinalSurprise
            letter={customData.finalLetter}
            lang={lang}
            isUnlocked={completedLevels.surpriseUnlocked}
            onUnlock={handleSurpriseUnlock}
            canUnlock={completedLevels.level3}
            onGoToLevel1={() => setCurrentScreen('level1')}
          />
        )}
      </main>

      {/* Persistent subtle footer */}
      <footer className={`relative z-10 py-4 px-6 text-center text-xs border-t glass-panel transition-colors ${
        isGreen ? 'border-[#52b788]/15 text-[#a3b18a]' : 'border-purple-500/10 text-purple-300/50'
      }`}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {UI_STRINGS.appName[lang]} • {customData.boyfriendName[lang]} & {customData.girlfriendSignature[lang]}
          </span>
          <span className={`text-[11px] font-mono-code ${
            isGreen ? 'text-[#74c69d]' : 'text-purple-400/60'
          }`}>
            {'<3'} coded with infinite love {'<3'}
          </span>
        </div>
      </footer>

      {/* Customization modal */}
      <CustomizationModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        lang={lang}
        currentData={customData}
        onSaveData={handleSaveCustomData}
        onResetData={handleResetCustomData}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
