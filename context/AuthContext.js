// context/AuthContext.js
// ============================================================
// Contexte d'authentification global
// Fournit l'état de session à toute l'application
// ============================================================

import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

// Création du contexte
const AuthContext = createContext({});

// ────────────────────────────────────────────────────────────
// Provider : enveloppe l'application entière
// ────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Écoute les changements d'état d'authentification Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    // Nettoyage de l'écouteur au démontage
    return () => unsubscribe();
  }, []);

  // Connexion email/mot de passe
  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Déconnexion
  const logout = async () => {
    return signOut(auth);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ────────────────────────────────────────────────────────────
// Hook personnalisé pour consommer le contexte
// ────────────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur de AuthProvider');
  }
  return context;
}
