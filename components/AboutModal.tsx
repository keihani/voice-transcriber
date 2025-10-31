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
import { LogoIcon, GithubIcon, LinkedinIcon, CloseIcon } from './icons';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
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
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md m-4 text-gray-300 transform transition-all duration-300 ease-out scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
             <LogoIcon className="w-6 h-6 text-cyan-400" />
             <h2 className="text-xl font-bold text-white">About Voice Transcriber</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm">
            Real-Time Voice Transcriber v.25
          </p>
          <div className="space-y-2 pt-2">
              <h3 className="font-semibold text-gray-400 text-xs uppercase tracking-wider">Author Information</h3>
              <p><strong>Author:</strong> Kevin Keihani</p>
              <p><strong>Company:</strong> Soroush Fanavari Co</p>
              <p><strong>Contact:</strong> yz.keihani@gmail.com</p>
          </div>
          <div className="flex items-center space-x-4 pt-2">
            <a href="https://github.com/keihani" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors">
              <GithubIcon className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <a href="https://linkedin.com/in/keihani" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors">
              <LinkedinIcon className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
         <div className="bg-gray-900/50 px-6 py-3 rounded-b-xl text-right">
             <button
                onClick={onClose}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm font-semibold"
            >
                Close
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

export default AboutModal;