# Changelog

All notable changes to SubTrack. Format: [Keep a Changelog](https://keepachangelog.com/), versions follow [SemVer](https://semver.org/).

## [0.3.0] — 2026-10-12
### Added
- All 166 currencies supported by open.er-api.com, for both the base currency and each subscription. Names are localized with `Intl.DisplayNames`, the picker is searchable, and popular currencies are pinned on top.
- An offline snapshot of exchange rates for every currency (`scripts/gen-currencies.mjs`).
- A calendar view of charges with a total for the month.
- A free-trial end date with its own reminder (Android local notifications and desktop notifications).
- Payment method/card label, link and notes fields.
- "Cancel X to save Y a year" savings insights on the dashboard.
- CSV export (UTF-8 BOM, Excel-friendly, formula-injection safe).
- Real app icons: Windows exe and installer, Android launcher (adaptive and round) and splash screen.
- READMEs in 6 languages (ru, en, es, ja, fr, de).
### Fixed
- Month-end dates: billing keeps the original day of month (the 31st means the last day of shorter months; Feb 29 yearly plans fall back to Feb 28).
- Prices inside right-to-left text (Hebrew and Arabic) are now bidi-isolated and display in the right order.
- Presets in the Books and Education groups (Audible, Duolingo, Coursera, Strava, Headspace) were not shown in the picker.
- The currency dropdown no longer overflows the edit dialog.

## [0.2.0] — 2026-10-12
### Added
- 30 UI languages with RTL layout for Hebrew and Arabic; `Intl` formatting for numbers, dates and units.
- 70 searchable, grouped service presets, including Russian services.
- Offline service logos from Simple Icons (CC0), plus a NOTICE file.

## [0.1.0] — 2026-10-12
### Added
- First release: subscriptions CRUD, dashboard totals in a base currency, upcoming charges, reminders, presets, JSON import/export, light/dark theme, Russian and English UI, Android APK and Windows Setup/Portable builds.
