// lib/firestore.js
// ============================================================
// Couche d'accès aux données Firestore
// Toutes les opérations CRUD pour les visiteurs
// ============================================================

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Nom de la collection principale
const VISITORS_COLLECTION = 'visitors';

// ────────────────────────────────────────────────────────────
// ÉCRITURE : Ajouter un enregistrement de visiteur
// ────────────────────────────────────────────────────────────
export async function addVisitor(data) {
  try {
    const docRef = await addDoc(collection(db, VISITORS_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Erreur addVisitor:', error);
    return { success: false, error: error.message };
  }
}

// ────────────────────────────────────────────────────────────
// LECTURE : Récupérer tous les visiteurs (triés par date)
// ────────────────────────────────────────────────────────────
export async function getAllVisitors() {
  try {
    const q = query(
      collection(db, VISITORS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const visitors = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convertit le Timestamp Firestore en JS Date pour les graphiques
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    }));
    return { success: true, data: visitors };
  } catch (error) {
    console.error('Erreur getAllVisitors:', error);
    return { success: false, data: [], error: error.message };
  }
}

// ────────────────────────────────────────────────────────────
// LECTURE : Visiteurs des N derniers jours
// ────────────────────────────────────────────────────────────
export async function getRecentVisitors(days = 30) {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const q = query(
      collection(db, VISITORS_COLLECTION),
      where('createdAt', '>=', Timestamp.fromDate(cutoff)),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const visitors = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    }));
    return { success: true, data: visitors };
  } catch (error) {
    console.error('Erreur getRecentVisitors:', error);
    return { success: false, data: [], error: error.message };
  }
}

// ────────────────────────────────────────────────────────────
// ANALYTICS : Calcul des statistiques agrégées
// ────────────────────────────────────────────────────────────
export function computeStats(visitors) {
  if (!visitors || visitors.length === 0) {
    return {
      totalVisitors:    0,
      totalEntries:     0,
      avgPerDay:        0,
      byNationality:    {},
      bySex:            {},
      byActivity:       {},
      byMonth:          {},
      byDay:            {},
      estimatedRevenue: 0,
    };
  }

  const totalEntries  = visitors.length;
  const totalVisitors = visitors.reduce((sum, v) => sum + (Number(v.nombreVisiteurs) || 1), 0);

  // Répartition par nationalité
  const byNationality = {};
  visitors.forEach((v) => {
    const nat = v.nationalite || 'Inconnue';
    byNationality[nat] = (byNationality[nat] || 0) + (Number(v.nombreVisiteurs) || 1);
  });

  // Répartition par sexe
  const bySex = { Homme: 0, Femme: 0, 'Non précisé': 0 };
  visitors.forEach((v) => {
    const key = v.sexe === 'M' ? 'Homme' : v.sexe === 'F' ? 'Femme' : 'Non précisé';
    bySex[key] += Number(v.nombreVisiteurs) || 1;
  });

  // Répartition par activité
  const byActivity = {};
  visitors.forEach((v) => {
    const act = v.activiteVisitee || 'Autre';
    byActivity[act] = (byActivity[act] || 0) + (Number(v.nombreVisiteurs) || 1);
  });

  // Fréquentation par mois (12 derniers mois)
  const byMonth = {};
  visitors.forEach((v) => {
    const date  = new Date(v.createdAt);
    const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    byMonth[label] = (byMonth[label] || 0) + (Number(v.nombreVisiteurs) || 1);
  });

  // Fréquentation par jour (30 derniers jours)
  const byDay = {};
  const now   = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label = d.toISOString().split('T')[0];
    byDay[label] = 0;
  }
  visitors.forEach((v) => {
    const label = new Date(v.createdAt).toISOString().split('T')[0];
    if (label in byDay) {
      byDay[label] += Number(v.nombreVisiteurs) || 1;
    }
  });

  // Revenus estimés (1500 FCFA par visiteur — tarif fictif)
  const TARIF_MOYEN = 1500;
  const estimatedRevenue = totalVisitors * TARIF_MOYEN;

  // Moyenne journalière sur 30 jours
  const days    = Object.keys(byDay).length || 1;
  const avgPerDay = Math.round(totalVisitors / days);

  return {
    totalVisitors,
    totalEntries,
    avgPerDay,
    byNationality,
    bySex,
    byActivity,
    byMonth,
    byDay,
    estimatedRevenue,
  };
}

// ────────────────────────────────────────────────────────────
// DONNÉES MOCK : pour tests sans Firebase configuré
// ────────────────────────────────────────────────────────────
export function getMockVisitors() {
  const nationalities = ['Béninois', 'Français', 'Américain', 'Togolais', 'Nigérian', 'Allemand', 'Britannique', 'Sénégalais'];
  const activities    = ['Visite Palais Royal', 'Musée Historique', 'Route des Esclaves', 'Cour Royale de Danhomè', 'Bénin Bronze Tour', 'Palais de Ouidah'];
  const sexes         = ['M', 'F'];

  const mock = [];
  const now  = new Date();

  for (let i = 0; i < 120; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));

    mock.push({
      id:               `mock-${i}`,
      nom:              `Visiteur ${i + 1}`,
      prenom:           `Prénom ${i + 1}`,
      age:              Math.floor(Math.random() * 50) + 18,
      sexe:             sexes[Math.floor(Math.random() * sexes.length)],
      nationalite:      nationalities[Math.floor(Math.random() * nationalities.length)],
      nombreVisiteurs:  Math.floor(Math.random() * 4) + 1,
      activiteVisitee:  activities[Math.floor(Math.random() * activities.length)],
      createdAt:        date,
    });
  }

  return mock;
}
