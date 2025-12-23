// <script>
//   window.USER_CSS_URL = "https://example.com/path/to/your.css";
// </script>
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';


import '../src/css/Parent-Index.css';



const personalCssPath = '/src/css/index.css';
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

// Load public user CSS URL if provided  from backend or window.USER_CSS_URL)
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
