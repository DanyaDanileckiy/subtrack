[Русский](README.md) · [English](README.en.md) · [Español](README.es.md) · [日本語](README.ja.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

# SubTrack — suivi des abonnements

Une application gratuite et open source pour suivre vos abonnements sur Android et Windows. Elle fonctionne hors ligne, sans inscription, sans serveur et sans clé d'API. Toutes les données restent sur votre appareil.

![SubTrack](docs/01-dashboard-ru-insights.png)

## Fonctionnalités
- Abonnements avec prix, devise, période (semaine / mois / an / personnalisée), date de prélèvement, catégorie, couleur, logo, moyen de paiement, lien et notes.
- Fins de mois gérées correctement : un abonnement du 31 est prélevé le dernier jour des mois courts, puis de nouveau le 31.
- Essais gratuits : date de fin avec son propre rappel avant le premier prélèvement.
- Aperçu : totaux mensuel et annuel dans votre devise principale, répartition par catégorie et conseils « Résiliez X pour économiser Y par an ».
- Calendrier mensuel des prélèvements avec le total du mois.
- **Les 166 devises** d'open.er-api.com, avec noms localisés, recherche et devises populaires en tête. Hors ligne, l'appli utilise les taux enregistrés ou un instantané intégré pour toutes les devises ; chaque taux peut être saisi à la main.
- Rappels : notifications locales sur Android, notifications système sur Windows.
- 70 services populaires avec de vrais logos Simple Icons.
- 30 langues, avec RTL pour l'hébreu et l'arabe.
- Export et import JSON, export CSV pour Excel ou Google Sheets, thème clair et sombre.

| | |
|---|---|
| ![](docs/03-calendar-ru.png) | ![](docs/04-currency-picker-ru.png) |
| ![](docs/06-subscriptions-he-rtl-bidi.png) | ![](docs/11-mobile-calendar-ru.png) |

## Télécharger
Fichiers dans [Releases](../../releases/latest) : `SubTrack-0.3.0-debug.apk` (Android), `SubTrack-Setup-0.3.0.exe` (installateur Windows) et `SubTrack-Portable-0.3.0.exe` (sans installation). Ils ne sont pas signés : Windows SmartScreen peut afficher un avertissement (« Informations complémentaires » → « Exécuter quand même ») et Android demande d'autoriser les sources inconnues.

## Compilation
```bash
npm install
npm run dev          # http://localhost:5173
npm test
npm run dist:win     # Windows Setup + Portable (Linux: wine)
npm run android:apk  # Android debug APK (Android SDK + JDK 21)
```

Stack: React 18, Vite, Tailwind CSS, Capacitor 7, Electron, electron-builder.

## Confidentialité
Aucun compte, aucune analyse, aucune publicité, aucun backend. La seule requête réseau récupère des taux de change publics (open.er-api.com, sans clé).

## Licence
MIT. Logos issus de [Simple Icons](https://simpleicons.org) (CC0) ; les marques appartiennent à leurs propriétaires, voir [NOTICE](NOTICE). Historique : [CHANGELOG](CHANGELOG.md).
