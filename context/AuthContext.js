// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const AuthContext = createContext({});

// Compte démo — bypass Firebase (aucun compte réel requis)
const DEMO_EMAIL    = 'admin@sysges-pat.bj';
const DEMO_PASSWORD = 'Demo@2024';
const DEMO_USER     = {
  uid:         'demo-user-001',
  email:       DEMO_EMAIL,
  displayName: 'Administrateur Démo',
  isDemo:      true,
};

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // Conserver le user démo si présent en session
      if (!firebaseUser) {
        const demoSession = sessionStorage.getItem('demo_session');
        setUser(demoSession ? DEMO_USER : null);
      } else {
        setUser(firebaseUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    // ── Mode démo : bypass Firebase ──────────────────────
    if (email.trim() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      sessionStorage.setItem('demo_session', 'true');
      setUser(DEMO_USER);
      return { user: DEMO_USER };
    }
    // ── Authentification Firebase normale ─────────────────
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    sessionStorage.removeItem('demo_session');
    setUser(null);
    try { await signOut(auth); } catch (_) {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return context;
}