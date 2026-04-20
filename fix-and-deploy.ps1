# ================================================================
# SysGeS-PAT — Script de correction et déploiement automatique
# Lance ce script depuis le dossier : C:\Users\PC\Downloads\sysges-pat1
# ================================================================

Write-Host "`n=== SysGeS-PAT Fix & Deploy ===" -ForegroundColor Cyan

# ── 1. Corriger globals.css (bug Tailwind) ──────────────────────
Write-Host "`n[1/4] Correction de styles/globals.css..." -ForegroundColor Yellow

$cssPath = "styles\globals.css"
$css = Get-Content $cssPath -Raw -Encoding UTF8

$css = $css -replace 'text-text-secondary', 'text-navy-300'
$css = $css -replace 'hover:text-text-primary', 'hover:text-white'

Set-Content -Path $cssPath -Value $css -Encoding UTF8 -NoNewline
Write-Host "   OK - Classes Tailwind corrigees" -ForegroundColor Green

# ── 2. Corriger AuthContext.js (bug mode demo) ──────────────────
Write-Host "`n[2/4] Correction de context/AuthContext.js (mode demo)..." -ForegroundColor Yellow

$authContent = @'
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
'@

Set-Content -Path "context\AuthContext.js" -Value $authContent -Encoding UTF8
Write-Host "   OK - Mode demo corrige (bypass Firebase)" -ForegroundColor Green

# ── 3. Verifier les fichiers modifies ──────────────────────────
Write-Host "`n[3/4] Verification..." -ForegroundColor Yellow
$check = Select-String -Path "styles\globals.css" -Pattern "text-text-secondary"
if ($check) {
  Write-Host "   ERREUR - text-text-secondary toujours present !" -ForegroundColor Red
} else {
  Write-Host "   OK - globals.css propre" -ForegroundColor Green
}

# ── 4. Git commit et push ───────────────────────────────────────
Write-Host "`n[4/4] Commit et push vers GitHub..." -ForegroundColor Yellow

git add styles/globals.css context/AuthContext.js
git status --short
git commit -m "fix: tailwind classes + demo mode bypass firebase"
git push

Write-Host "`n=== TERMINE ===" -ForegroundColor Cyan
Write-Host "Attends 30 secondes puis verifie l'onglet Deployments sur Vercel." -ForegroundColor White
Write-Host "Le build doit durer 3-5 minutes avec npm install + next build." -ForegroundColor White
