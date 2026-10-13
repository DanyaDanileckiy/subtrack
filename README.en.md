<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:3b82f6,100:22d37a&height=140&section=header&text=SubTrack&fontSize=48&fontColor=fff&fontAlignY=35" width="100%"/>

**Offline subscription tracker for Android & Windows**

[Русский](README.md) · [English](README.en.md) · [Español](README.es.md) · [日本語](README.ja.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

[![Download Android](https://img.shields.io/badge/Download_Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://github.com/DanyaDanileckiy/subtrack/releases/download/v0.3.0/SubTrack-0.3.0-debug.apk)
[![Download Windows Setup](https://img.shields.io/badge/Download_Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/DanyaDanileckiy/subtrack/releases/download/v0.3.0/SubTrack-Setup-0.3.0.exe)
[![Portable](https://img.shields.io/badge/Portable-0078D6?style=for-the-badge)](https://github.com/DanyaDanileckiy/subtrack/releases/download/v0.3.0/SubTrack-Portable-0.3.0.exe)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## About

A free open-source app for tracking subscriptions. Works **fully offline**, no sign-up, servers or analytics. All data stays on your device.

![SubTrack](docs/08-dashboard-en.png)

## Direct download links

| Platform | File | Link |
|----------|------|------|
| **Android** | `SubTrack-0.3.0-debug.apk` | [Download APK](https://github.com/DanyaDanileckiy/subtrack/releases/download/v0.3.0/SubTrack-0.3.0-debug.apk) |
| **Windows (installer)** | `SubTrack-Setup-0.3.0.exe` | [Download Setup](https://github.com/DanyaDanileckiy/subtrack/releases/download/v0.3.0/SubTrack-Setup-0.3.0.exe) |
| **Windows (portable)** | `SubTrack-Portable-0.3.0.exe` | [Download Portable](https://github.com/DanyaDanileckiy/subtrack/releases/download/v0.3.0/SubTrack-Portable-0.3.0.exe) |

> **Windows SmartScreen:** file is unsigned → “More info” → “Run anyway”.  
> **Android:** allow installs from unknown sources.

## Features

- Subscriptions with price, currency, period, charge date, category, color, logo, payment method and notes
- Correct handling of month-end dates (the 31st)
- Free trials with reminders
- Dashboard: monthly/yearly totals, category breakdown, “Cancel X to save Y a year” tips
- Charge calendar
- **166 currencies** with offline rates and manual override
- Reminders (local on Android, system on Windows)
- 70 popular services with logos
- **30 languages** (including RTL: Hebrew, Arabic)
- JSON / CSV export, light and dark theme

| | |
|---|---|
| ![Calendar](docs/03-calendar-ru.png) | ![Currencies](docs/04-currency-picker-ru.png) |
| ![RTL](docs/06-subscriptions-he-rtl-bidi.png) | ![Mobile](docs/11-mobile-calendar-ru.png) |

## Privacy

No accounts, analytics, ads or backend. The only network request is public exchange rates (open.er-api.com, no key).

## Build

```bash
npm install
npm run dev          # http://localhost:5173
npm run dist:win     # Windows Setup + Portable
npm run android:apk  # Android APK
```

**Stack:** React 18 · Vite · Tailwind CSS · Capacitor 7 · Electron

## License

MIT. Logos — [Simple Icons](https://simpleicons.org) (CC0).  
Changelog — [CHANGELOG.md](CHANGELOG.md).

<div align="center">

**Made with ❤️ for people who want to control their subscriptions without the cloud**

</div>
