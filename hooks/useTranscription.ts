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
import { useState, useRef, useCallback, useEffect } from 'react';
// FIX: Removed `LiveSession` as it is not an exported member of `@google/genai`.
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { AudioSource, TranscriptionStatus, TranscriptionEntry } from '../types';

// Helper to encode raw audio data to base64
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper to create a Blob for the Gemini API
function createPcmBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const useTranscription = (audioSource: AudioSource) => {
  const [status, setStatus] = useState<TranscriptionStatus>('idle');
  const [transcriptionHistory, setTranscriptionHistory] = useState<TranscriptionEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  // FIX: Replaced `LiveSession` with `any` as it is not an exported type.
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const mediaStreamsRef = useRef<MediaStream[]>([]);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  
  const isTranscribing = status === 'listening' || status === 'connecting';

  const clearTranscriptionHistory = useCallback(() => {
    setTranscriptionHistory([]);
  }, []);

  const stopTranscription = useCallback(() => {
    setStatus('stopped');
    setError(null);

    // Close Gemini session
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close());
        sessionPromiseRef.current = null;
    }

    // Stop audio processing
    if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current.onaudioprocess = null;
        scriptProcessorRef.current = null;
    }

    // Stop all media tracks
    mediaStreamsRef.current.forEach(stream => {
        stream.getTracks().forEach(track => track.stop());
    });
    mediaStreamsRef.current = [];
    
    // Close AudioContext
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
    }
    audioContextRef.current = null;
    
    // Finalize any partial transcription
    setTranscriptionHistory(prev => prev.map(entry => ({ ...entry, isPartial: false })));

  }, []);

  const startTranscription = useCallback(async () => {
    if (isTranscribing) return;
    
    setError(null);
    setStatus('connecting');
    // Removed setTranscriptionHistory([]) to persist history across sessions.
    let currentTranscriptionText = '';
    let nextId = transcriptionHistory.length > 0 ? Math.max(...transcriptionHistory.map(t => t.id)) + 1 : 0;

    try {
      const streams: MediaStream[] = [];
      if (audioSource === 'mic') {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streams.push(micStream);
      }
      if (audioSource === 'system') {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        // We only need the audio track
        const audioTracks = displayStream.getAudioTracks();
        if (audioTracks.length === 0) {
            throw new Error("No audio track found in the selected display media. Please ensure you share system audio.");
        }
        const audioStream = new MediaStream(audioTracks);
        streams.push(audioStream);

        // Stop the video track as it's not needed
        displayStream.getVideoTracks().forEach(track => track.stop());
      }
      mediaStreamsRef.current = streams;

      const context = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = context;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      // FIX: Per guideline, create sessionPromise locally to be used in callbacks, avoiding potential stale refs.
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
             setStatus('listening');
             const sourceNodes = streams.map(stream => context.createMediaStreamSource(stream));
             const scriptProcessor = context.createScriptProcessor(4096, 1, 1);
             scriptProcessorRef.current = scriptProcessor;

             scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                const pcmBlob = createPcmBlob(inputData);
                // FIX: Per guideline, solely rely on promise resolution and do not add extra condition checks.
                sessionPromise.then((session) => {
                   session.sendRealtimeInput({ media: pcmBlob });
                });
             };

             // Mute the audio output to prevent feedback loops. The script processor
             // needs to be connected to a destination for `onaudioprocess` to fire.
             // We connect it to a GainNode with gain=0, which is then connected to the context destination.
             const gainNode = context.createGain();
             gainNode.gain.setValueAtTime(0, context.currentTime);

             sourceNodes.forEach(node => node.connect(scriptProcessor));
             scriptProcessor.connect(gainNode);
             gainNode.connect(context.destination);
          },
          onmessage: (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              currentTranscriptionText += text;
              setTranscriptionHistory(prev => {
                const lastEntry = prev.find(e => e.id === nextId);
                if (lastEntry) {
                   return prev.map(e => e.id === nextId ? { ...e, text: currentTranscriptionText } : e);
                } else {
                  return [...prev, { id: nextId, text: currentTranscriptionText, isPartial: true }];
                }
              });
            }

            if (message.serverContent?.turnComplete) {
              setTranscriptionHistory(prev => prev.map(entry => 
                entry.id === nextId ? { ...entry, isPartial: false } : entry
              ));
              currentTranscriptionText = '';
              nextId++;
            }
          },
          onerror: (e: any) => {
            console.error('Gemini API Error:', e);
            setError(`Connection error: ${e.message || 'An unknown error occurred'}`);
            stopTranscription();
          },
          onclose: () => {
            // Check if status is not 'stopped' to avoid calling stopTranscription again.
            if(status !== 'stopped'){
               stopTranscription();
            }
          },
        },
      });
      sessionPromiseRef.current = sessionPromise;

      // Handle the case where the promise itself rejects (e.g., auth error)
      sessionPromise.catch(err => {
          console.error("Failed to connect to Gemini:", err);
          setError(`Failed to connect: ${err.message}`);
          stopTranscription();
      });

    } catch (err: any) {
      console.error('Error starting transcription:', err);
      setError(err.message || 'Failed to start transcription.');
      stopTranscription();
    }
  }, [audioSource, isTranscribing, stopTranscription, status, transcriptionHistory]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTranscription();
    };
  }, [stopTranscription]);

  return {
    status,
    isTranscribing,
    transcriptionHistory,
    startTranscription,
    stopTranscription,
    clearTranscriptionHistory,
    error,
  };
};