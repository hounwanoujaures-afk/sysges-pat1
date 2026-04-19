// pages/_app.js
import { AuthProvider } from '../context/AuthContext';
import { Toaster }      from 'react-hot-toast';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background:   '#0c2818',
            color:        '#e8f5ed',
            border:       '1px solid #1e4a2e',
            borderRadius: '12px',
            fontSize:     '13px',
            fontFamily:   'DM Sans, sans-serif',
            boxShadow:    '0 8px 32px rgba(5,15,9,0.4)',
          },
          success: { iconTheme: { primary: '#fbbf24', secondary: '#0c2818' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#0c2818' } },
        }}
      />
      <Component {...pageProps} />
    </AuthProvider>
  );
}