import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';


import '../src/css/index.css';


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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
