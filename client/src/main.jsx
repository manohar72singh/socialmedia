import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Intercept global fetch to prepend VITE_API_URL for relative API calls
const originalFetch = window.fetch;
window.fetch = async (url, options) => {
  if (typeof url === 'string' && url.startsWith('/api')) {
    url = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + url;
  }
  return originalFetch(url, options);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
