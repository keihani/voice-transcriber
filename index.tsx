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
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);