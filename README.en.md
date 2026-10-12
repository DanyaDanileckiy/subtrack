[Русский](README.md) · [English](README.en.md) · [Español](README.es.md) · [日本語](README.ja.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

# SubTrack — subscription tracker

A free, open-source subscription tracker for Android and Windows. It works offline, with no sign-up, no servers and no API keys. All data stays on your device.

![SubTrack](docs/08-dashboard-en.png)

## Features
- Subscriptions with price, currency, billing period (week / month / year / custom), charge date, category, color, logo, payment method, link and notes.
- Month-end dates are handled correctly: a subscription started on the 31st is charged on the last day of shorter months, then on the 31st again.
- Free trials: an end date with its own reminder before the first charge.
- Dashboard: monthly and yearly totals in your base currency, a per-category breakdown, and "Cancel X to save Y a year" tips.
- A monthly calendar of charges with a total for the month.
- **All 166 currencies** from open.er-api.com, with localized names, search and popular currencies pinned on top. Offline, the app uses cached rates or a built-in snapshot for every currency, and you can override any rate manually.
- Reminders: local notifications on Android, system notifications on Windows.
- 70 popular services with real Simple Icons logos.
- 30 UI languages, with RTL for Hebrew and Arabic.
- JSON export and import, CSV export for Excel or Google Sheets, light and dark theme.

| | |
|---|---|
| ![](docs/03-calendar-ru.png) | ![](docs/04-currency-picker-ru.png) |
| ![](docs/06-subscriptions-he-rtl-bidi.png) | ![](docs/11-mobile-calendar-ru.png) |

## Download
Get the files from [Releases](../../releases/latest): `SubTrack-0.3.0-debug.apk` (Android), `SubTrack-Setup-0.3.0.exe` (Windows installer) and `SubTrack-Portable-0.3.0.exe` (no install). The files are unsigned, so Windows SmartScreen may warn you ("More info" → "Run anyway"), and Android needs installs from unknown sources allowed.

## Build
```bash
npm install
npm run dev          # http://localhost:5173
npm test
npm run dist:win     # Windows Setup + Portable (Linux: wine)
npm run android:apk  # Android debug APK (Android SDK + JDK 21)
```

Stack: React 18, Vite, Tailwind CSS, Capacitor 7, Electron, electron-builder.

## Privacy
No accounts, analytics, ads or backend. The only network request fetches public exchange rates (open.er-api.com, no key).

## License
MIT. Logos come from [Simple Icons](https://simpleicons.org) (CC0); trademarks belong to their owners, see [NOTICE](NOTICE). See the [CHANGELOG](CHANGELOG.md) for release history.
