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
import { TranscriptionStatus } from '../types';
import { MicrophoneIcon, StopIcon, ConnectingIcon } from './icons';

interface ControlBarProps {
  isTranscribing: boolean;
  onStart: () => void;
  onStop: () => void;
  status: TranscriptionStatus;
}

const StatusIndicator: React.FC<{ status: TranscriptionStatus }> = ({ status }) => {
    let text, color, icon;
  
    switch (status) {
      case 'listening':
        text = 'Listening...';
        color = 'text-green-400';
        icon = <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>;
        break;
      case 'connecting':
        text = 'Connecting...';
        color = 'text-yellow-400';
        icon = <ConnectingIcon className="w-4 h-4 animate-spin" />;
        break;
      case 'error':
        text = 'Error';
        color = 'text-red-400';
        icon = <div className="w-2 h-2 rounded-full bg-red-400"></div>;
        break;
      default:
        text = 'Idle';
        color = 'text-gray-400';
        icon = <div className="w-2 h-2 rounded-full bg-gray-400"></div>;
        break;
    }
  
    return (
      <div className={`flex items-center space-x-2 text-sm font-medium ${color}`}>
        {icon}
        <span>{text}</span>
      </div>
    );
};

const ControlBar: React.FC<ControlBarProps> = ({ isTranscribing, onStart, onStop, status }) => {
  const ButtonIcon = isTranscribing ? StopIcon : MicrophoneIcon;
  const buttonText = isTranscribing ? 'Stop Transcription' : 'Start Transcription';
  const buttonClass = isTranscribing
    ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500'
    : 'bg-cyan-600 hover:bg-cyan-700 focus-visible:ring-cyan-500';

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex-1 text-center sm:text-left">
         <StatusIndicator status={status} />
      </div>
      <button
        onClick={isTranscribing ? onStop : onStart}
        disabled={status === 'connecting'}
        className={`flex items-center justify-center gap-2 px-6 py-3 w-full sm:w-auto text-base font-semibold text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 ${buttonClass} ${status === 'connecting' ? 'opacity-50 cursor-wait' : ''}`}
      >
        <ButtonIcon className="w-6 h-6" />
        <span>{buttonText}</span>
      </button>
      <div className="flex-1"></div>
    </div>
  );
};

export default ControlBar;