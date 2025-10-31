/*
 * Real-Time Voice Transcriber v.25
 * SPDX-License-Identifier: MIT
 *
 * Author: Kevin Keihani
 * Company: Soroush Fanavari Co
 * Contact: yz.keihani@gmail.com
 * GitHub:  https://github.com/keihani
 * LinkedIn: https://linkedin.com/in/keihani
 */
import React, { useState, useEffect } from 'react';
import { AudioSource } from './types';
import { useTranscription } from './hooks/useTranscription';
import AudioSourceSelector from './components/AudioSourceSelector';
import ControlBar from './components/ControlBar';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import AboutModal from './components/AboutModal';
import HelpModal from './components/HelpModal';
import { LogoIcon, InformationCircleIcon, QuestionMarkCircleIcon } from './components/icons';

const App: React.FC = () => {
  const [audioSource, setAudioSource] = useState<AudioSource>('mic');
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  
  const {
    status,
    isTranscribing,
    transcriptionHistory,
    startTranscription,
    stopTranscription,
    clearTranscriptionHistory,
    error,
  } = useTranscription(audioSource);

  useEffect(() => {
    // This is a workaround for a potential browser bug where getDisplayMedia
    // can't be called without a prior getUserMedia call in some contexts.
    const warmUpPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.info("Mic permission not granted yet. Will be requested on start.");
      }
    };
    warmUpPermissions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
      <header className="w-full max-w-5xl mx-auto p-4 md:p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <LogoIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Real-Time Voice Transcriber
          </h1>
        </div>
        <div className="flex items-center space-x-2">
            <button
                onClick={() => setIsHelpModalOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 bg-gray-800 hover:bg-gray-700/80 transition-colors duration-200 border border-gray-700 text-sm font-medium"
                aria-label="Help"
            >
                <QuestionMarkCircleIcon className="w-5 h-5"/>
                <span>Help</span>
            </button>
            <button
                onClick={() => setIsAboutModalOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 bg-gray-800 hover:bg-gray-700/80 transition-colors duration-200 border border-gray-700 text-sm font-medium"
                aria-label="About this application"
            >
                <InformationCircleIcon className="w-5 h-5"/>
                <span>About</span>
            </button>
        </div>
      </header>
      <main className="flex-grow flex flex-col w-full max-w-5xl mx-auto p-4 md:p-6 pt-0">
        <div className="bg-gray-800/50 rounded-xl shadow-2xl flex-grow flex flex-col p-4 sm:p-6 border border-gray-700">
          <AudioSourceSelector
            selectedSource={audioSource}
            onSourceChange={setAudioSource}
            isDisabled={isTranscribing}
          />

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 my-4 rounded-lg text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          <TranscriptionDisplay
            history={transcriptionHistory}
            status={status}
            onClearHistory={clearTranscriptionHistory}
            isTranscribing={isTranscribing}
          />
        </div>
      </main>
      <footer className="w-full sticky bottom-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700">
         <div className="max-w-5xl mx-auto p-4 md:px-6">
            <ControlBar
                isTranscribing={isTranscribing}
                onStart={startTranscription}
                onStop={stopTranscription}
                status={status}
            />
         </div>
      </footer>
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  );
};

export default App;