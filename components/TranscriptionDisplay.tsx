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
import React, { useRef, useEffect, useState } from 'react';
import { TranscriptionEntry, TranscriptionStatus } from '../types';
import { TrashIcon, SaveIcon } from './icons';

interface TranscriptionDisplayProps {
  history: TranscriptionEntry[];
  status: TranscriptionStatus;
  onClearHistory: () => void;
  isTranscribing: boolean;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ history, status, onClearHistory, isTranscribing }) => {
  const scrollRef = useRef<HTMLTextAreaElement>(null);
  const [currentText, setCurrentText] = useState('');

  const historyText = history.map(entry => entry.text).join('\n\n');

  useEffect(() => {
    // Syncs the textarea content with the transcription history.
    // NOTE: This will overwrite manual edits if a new transcription starts.
    setCurrentText(historyText);
  }, [historyText]);

  useEffect(() => {
    // Auto-scroll to the bottom on new content
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentText]);

  const handleSave = () => {
    if (!currentText) return;

    const blob = new Blob([currentText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transcription.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setCurrentText('');
    onClearHistory();
  };

  const isEmpty = currentText.trim().length === 0;

  return (
    <div className="relative flex-grow my-4 flex flex-col">
      <div className="absolute top-2 right-2 z-10 flex items-center space-x-1">
        {!isEmpty && (
            <>
                <button
                    onClick={handleSave}
                    disabled={isTranscribing}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-700/80 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Save transcription to a file"
                    title="Save as .txt"
                >
                    <SaveIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={handleClear}
                    disabled={isTranscribing}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-700/80 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Clear transcription history"
                    title="Clear transcription"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </>
        )}
      </div>
      
      <textarea
        ref={scrollRef}
        value={currentText}
        onChange={(e) => setCurrentText(e.target.value)}
        readOnly={isTranscribing}
        className="flex-grow bg-gray-900/70 rounded-lg p-4 pr-20 overflow-y-auto min-h-[200px] md:min-h-[300px] border border-gray-700 transition-all duration-300 w-full text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-transparent focus-visible:ring-cyan-500 placeholder:text-gray-500"
        placeholder={
            (status === 'idle' || status === 'stopped')
            ? 'Press "Start Transcription" to begin.'
            : 'Waiting for audio...'
        }
        aria-label="Transcription Output"
      />
    </div>
  );
};

export default TranscriptionDisplay;