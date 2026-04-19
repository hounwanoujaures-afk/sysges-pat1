// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const DEMO_EMAIL    = 'admin@sysges-pat.bj';
const DEMO_PASSWORD = 'Demo@2024';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (email.trim() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const demoUser = {
        uid:         'demo-user-001',
        email:       DEMO_EMAIL,
        displayName: 'Administrateur Demo',
        isDemo:      true,
      };
      setUser(demoUser);
      setLoading(false);
      return { user: demoUser };
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (user?.isDemo) { setUser(null); return; }
    return signOut(auth);
  };

  const value = { user, loading, login, logout, isAuthenticated: !!user };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit etre utilise dans AuthProvider");
  return context;
}
