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
export type AudioSource = 'mic' | 'system';

export type TranscriptionStatus = 'idle' | 'connecting' | 'listening' | 'error' | 'stopped';

export interface TranscriptionEntry {
  id: number;
  text: string;
  isPartial: boolean;
}