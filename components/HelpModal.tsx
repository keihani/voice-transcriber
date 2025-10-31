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
import React, { useEffect } from 'react';
import { QuestionMarkCircleIcon, CloseIcon } from './icons';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg m-4 text-gray-300 transform transition-all duration-300 ease-out scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
             <QuestionMarkCircleIcon className="w-6 h-6 text-cyan-400" />
             <h2 className="text-xl font-bold text-white">How to Use</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6 text-sm">
          <div>
            <h3 className="font-bold text-base text-white mb-2">1. Select an Audio Source</h3>
            <ul className="list-disc list-inside space-y-1 pl-2 text-gray-400">
                <li><strong className="text-gray-300">Microphone:</strong> Captures audio from your microphone.</li>
                <li><strong className="text-gray-300">System Audio:</strong> Captures any sound playing on your computer (e.g., from a video, game, or music player).</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-base text-white mb-2">2. Start Transcription</h3>
            <p className="text-gray-400">Click the <strong className="text-gray-300">"Start Transcription"</strong> button. Your browser will ask for permissions.</p>
          </div>
          <div>
            <h3 className="font-bold text-base text-white mb-2">3. Grant Permissions <span className="text-red-400 font-bold">(Important!)</span></h3>
            <ul className="list-disc list-inside space-y-2 pl-2 text-gray-400">
                <li>
                    <strong className="text-gray-300">For Microphone:</strong> A prompt will appear. Click <strong className="text-cyan-400">"Allow"</strong> to grant access to your microphone.
                </li>
                <li>
                    <strong className="text-gray-300">For System Audio:</strong> A screen sharing dialog will appear. You must choose a screen, window, or tab to share. <strong className="text-yellow-300">Crucially, you must also check the "Share system audio" or "Share tab audio" checkbox</strong> at the bottom of this dialog. If you don't, no audio will be captured.
                </li>
            </ul>
          </div>
           <div>
            <h3 className="font-bold text-base text-white mb-2">Common Issues</h3>
            <p className="text-gray-400"><strong className="text-gray-300">No transcription for System Audio?</strong> Stop the transcription and start again. Make sure you explicitly check the "Share system audio" or "Share tab audio" box in the permission prompt.</p>
           </div>
        </div>
         <div className="bg-gray-900/50 px-6 py-3 rounded-b-xl text-right">
             <button
                onClick={onClose}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm font-semibold"
            >
                Got it!
            </button>
         </div>
         <style>{`
            @keyframes fadeInScale {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in-scale {
              animation: fadeInScale 0.2s ease-out forwards;
            }
         `}</style>
      </div>
    </div>
  );
};

export default HelpModal;