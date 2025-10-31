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
import React from 'react';
import { AudioSource } from '../types';
import { MicrophoneIcon, SystemAudioIcon } from './icons';

interface AudioSourceSelectorProps {
  selectedSource: AudioSource;
  onSourceChange: (source: AudioSource) => void;
  isDisabled: boolean;
}

const AudioSourceSelector: React.FC<AudioSourceSelectorProps> = ({
  selectedSource,
  onSourceChange,
  isDisabled,
}) => {
  // FIX: Changed icon type from JSX.Element to React.ReactNode to fix "Cannot find namespace 'JSX'" error.
  const options: { id: AudioSource; label: string; icon: React.ReactNode }[] = [
    { id: 'mic', label: 'Microphone', icon: <MicrophoneIcon className="w-5 h-5" /> },
    { id: 'system', label: 'System Audio', icon: <SystemAudioIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="mb-4">
      <h2 className="text-sm font-semibold text-gray-400 mb-2">Audio Source</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <label
            key={option.id}
            className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedSource === option.id
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input
              type="radio"
              name="audio-source"
              value={option.id}
              checked={selectedSource === option.id}
              onChange={() => onSourceChange(option.id)}
              disabled={isDisabled}
              className="hidden"
            />
            {option.icon}
            <span className="font-medium text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default AudioSourceSelector;