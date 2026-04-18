// pages/_document.js
// ============================================================
// Document HTML personnalisé Next.js
// Injection des polices Google et meta tags globaux
// ============================================================

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* Méta SEO */}
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0f0e1a" />
        <meta name="description" content="SysGeS-PAT — Système de Gestion des Statistiques du Patrimoine Touristique du Bénin" />
        <meta name="robots"      content="noindex, nofollow" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Polices Google Fonts (préconnexion pour la performance) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
