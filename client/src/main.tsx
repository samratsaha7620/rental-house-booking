import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import React from 'react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoilRoot>
      <React.Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.Suspense>
    </RecoilRoot>
  </StrictMode>,
)
