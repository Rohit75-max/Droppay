import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// --- SEO ENGINE IMPORT ---
import { HelmetProvider } from 'react-helmet-async';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrapping the App to enable dynamic <head> management */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

// 📡 Service Worker Registration (PWA Offline Cache)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('✅ [DropPay] Service Worker Registered'))
      .catch(err => console.error('❌ [DropPay] Service Worker Registration Fail', err));
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();