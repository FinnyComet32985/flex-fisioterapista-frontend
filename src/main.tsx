import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@/components/utils/theme-provider';
import { AuthProvider } from './contexts/AuthContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <ThemeProvider defaultTheme="system">
      <App />
    </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
