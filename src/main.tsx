import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initStaticApiFallback } from './utils/staticApiFallback';

// Initialize offline/GitHub Pages fallback interceptor safely
try {
  initStaticApiFallback();
} catch (e) {
  // Ignore fallback initialization in strict environments
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
