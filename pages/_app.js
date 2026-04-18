// pages/_app.js
// ============================================================
// Point d'entrée Next.js — enveloppe AuthProvider + Toaster
// ============================================================

import { AuthProvider } from '../context/AuthContext';
import { Toaster }      from 'react-hot-toast';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      {/* Notifications toast globales */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background:  '#16152a',
            color:       '#f1f0ff',
            border:      '1px solid #2a2845',
            borderRadius:'12px',
            fontSize:    '14px',
            fontFamily:  'DM Sans, sans-serif',
          },
          success: {
            iconTheme: { primary: '#fbbf24', secondary: '#0f0e1a' },
          },
          error: {
            iconTheme: { primary: '#f43f5e', secondary: '#0f0e1a' },
          },
        }}
      />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
