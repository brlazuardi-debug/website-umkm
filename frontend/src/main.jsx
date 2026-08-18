import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Fungsi untuk mengaktifkan Mock Service Worker di mode development
async function enableMocking() {
  // Hanya aktifkan MSW jika di mode development
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import('./mocks/browser');

  // Mulai worker MSW untuk meng-intercept request API ke /api/v1/* secara lokal
  return worker.start({
    onUnhandledRequest: 'bypass', // Lewatkan request aset statis non-API
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
