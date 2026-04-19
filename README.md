# 🏛️ SysGeS-PAT
## Système de Gestion des Statistiques du Patrimoine Touristique

> Plateforme numérique officielle de collecte et d'analyse des données de fréquentation des sites touristiques de la République du Bénin.

---

## 🚀 Démarrage rapide

### Prérequis
- Node.js ≥ 18
- npm ≥ 9
- Un projet Firebase (Auth + Firestore activés)

### Installation

```bash
# 1. Cloner / dézipper le projet
cd sysges-pat

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.local.example .env.local
# → Remplir les valeurs Firebase dans .env.local

# 4. Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 🔥 Configuration Firebase

### Étape 1 — Créer un projet Firebase
1. Aller sur [console.firebase.google.com](https://console.firebase.google.com)
2. Créer un nouveau projet
3. Activer **Authentication** → Email/Mot de passe
4. Activer **Firestore Database** → Mode production ou test

### Étape 2 — Récupérer les clés
Dans les paramètres du projet > Vos applications > Application Web :
```
Copier la configuration firebaseConfig
```

### Étape 3 — Remplir `.env.local`
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre-projet-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Étape 4 — Créer un utilisateur admin
Dans la console Firebase → Authentication → Users → Ajouter un utilisateur :
```
Email :    admin@sysges-pat.bj
Password : VotreMotDePasse!
```

### Étape 5 — Règles Firestore
Dans Firestore → Rules :
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /visitors/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📁 Structure du projet

```
sysges-pat/
├── pages/
│   ├── _app.js          # Entrée app (AuthProvider + Toast)
│   ├── _document.js     # HTML head (polices, meta)
│   ├── index.js         # Redirection automatique
│   ├── login.js         # Page d'authentification
│   ├── dashboard.js     # Tableau de bord principal
│   ├── collecte.js      # Formulaire de saisie visiteurs
│   ├── analytics.js     # Analytiques avancées + filtres
│   ├── parametres.js    # Paramètres système
│   └── 404.js           # Page erreur personnalisée
│
├── components/
│   ├── Layout.js         # Enveloppe des pages authentifiées
│   ├── Sidebar.js        # Navigation latérale
│   ├── Navbar.js         # Barre supérieure
│   ├── StatCard.js       # Carte KPI animée
│   ├── VisitorChart.js   # Tous les graphiques Recharts
│   ├── Card.js           # Carte générique réutilisable
│   ├── Form.js           # Composants de formulaire
│   └── LoadingSpinner.js # Spinners et skeletons
│
├── context/
│   └── AuthContext.js    # Contexte Firebase Auth global
│
├── lib/
│   ├── firebase.js       # Initialisation Firebase
│   └── firestore.js      # CRUD + calcul stats + mock data
│
├── styles/
│   └── globals.css       # Design system global
│
├── .env.local.example    # Template variables d'environnement
├── vercel.json           # Configuration déploiement Vercel
├── tailwind.config.js    # Design tokens Tailwind
└── next.config.js        # Configuration Next.js
```

---

## 🌐 Déploiement sur Vercel

```bash
# Option 1 : Via CLI Vercel
npm i -g vercel
vercel --prod

# Option 2 : Via GitHub
# → Connecter le repo sur vercel.com
# → Ajouter les variables d'environnement dans les settings Vercel
```

### Variables d'environnement Vercel
Dans votre projet Vercel → Settings → Environment Variables, ajouter toutes les variables du `.env.local`.

---

## 🎯 Fonctionnalités

| Module          | Description                                              |
|-----------------|----------------------------------------------------------|
| **Auth**        | Connexion Firebase email/mot de passe, sessions, protection des routes |
| **Collecte**    | Formulaire de saisie visiteurs → Firestore               |
| **Dashboard**   | KPIs animés, graphiques temps réel, tableau des entrées  |
| **Analytiques** | Filtres avancés, pagination, export CSV                  |
| **Paramètres**  | Profil, sécurité, infos système                          |
| **Mode démo**   | Données fictives si Firebase non configuré               |

---

## 🗃️ Structure Firestore

**Collection :** `visitors`

```json
{
  "id": "auto-generated",
  "nom": "AGOSSOU",
  "prenom": "Kossigan Jean",
  "trancheAge": "26–35",
  "sexe": "M",
  "nationalite": "Béninoise",
  "nombreVisiteurs": 3,
  "activiteVisitee": "Route des Esclaves — Ouidah",
  "observations": "Groupe scolaire",
  "dateVisite": "2024-07-15T10:30:00.000Z",
  "createdAt": "Timestamp Firestore"
}
```

---

## 🛠️ Stack technique

| Technologie       | Usage                          |
|-------------------|--------------------------------|
| Next.js 14        | Framework React (App Router)   |
| Firebase Auth     | Authentification               |
| Firestore         | Base de données NoSQL          |
| Tailwind CSS      | Styling utility-first          |
| Recharts          | Graphiques analytiques         |
| react-hot-toast   | Notifications                  |
| date-fns          | Manipulation des dates         |

---

## 📄 Licence

Usage officiel — Ministère du Tourisme, de la Culture et des Arts — République du Bénin.

---

*Développé avec ❤️ pour la digitalisation du patrimoine touristique béninois.*

