import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';


import '../src/css/index.css';



// 1. Load local user CSS if exists
const personalCssPath = '/src/css/user-index.css';
fetch(personalCssPath, { method: 'HEAD' })
  .then((res) => {
    if (res.ok) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = personalCssPath;
      document.head.appendChild(link);
    }
  })
  .catch(() => {});

// 2. Load public user CSS URL if provided (e.g., from backend or window.USER_CSS_URL)
const userCssUrl = (window as any).USER_CSS_URL;
if (userCssUrl && typeof userCssUrl === 'string') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = userCssUrl;
  document.head.appendChild(link);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
