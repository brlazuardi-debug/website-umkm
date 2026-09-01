import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Aktifkan Mock Service Worker untuk simulasi REST API lokal & Vercel deployment
async function enableMocking() {
  try {
    const { worker } = await import('./mocks/browser');
    return await worker.start({
      onUnhandledRequest: 'bypass',
    });
  } catch (err) {
    console.warn('[MSW] Mocking service worker could not start, falling back to direct API clients:', err);
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
