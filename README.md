<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:3b82f6,100:22d37a&height=140&section=header&text=SubTrack&fontSize=48&fontColor=fff&fontAlignY=35" width="100%"/>

**Оффлайн-трекер подписок для Android и Windows**

[Русский](README.md) · [English](README.en.md) · [Español](README.es.md) · [日本語](README.ja.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

[![Download Android](https://img.shields.io/badge/Скачать_Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://github.com/DanyaDanileckiy/subtrack/releases/download/v0.3.0/SubTrack-0.3.0-debug.apk)
[![Download Windows Setup](https://img.shields.io/badge/Скачать_Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/DanyaDanileckiy/subtrack/releases/download/v0.3.0/SubTrack-Setup-0.3.0.exe)
[![Portable](https://img.shields.io/badge/Портативная_версия-0078D6?style=for-the-badge)](https://github.com/DanyaDanileckiy/subtrack/releases/download/v0.3.0/SubTrack-Portable-0.3.0.exe)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## О приложении

Бесплатное open-source приложение для учёта подписок. Работает **полностью оффлайн**, без регистрации, серверов и аналитики. Все данные хранятся только на вашем устройстве.

![SubTrack](docs/01-dashboard-ru-insights.png)

## Прямые ссылки для скачивания

| Платформа | Файл | Ссылка |
|-----------|------|--------|
| **Android** | `SubTrack-0.3.0-debug.apk` | [Скачать APK](https://github.com/DanyaDanileckiy/subtrack/releases/download/v0.3.0/SubTrack-0.3.0-debug.apk) |
| **Windows (установщик)** | `SubTrack-Setup-0.3.0.exe` | [Скачать Setup](https://github.com/DanyaDanileckiy/subtrack/releases/download/v0.3.0/SubTrack-Setup-0.3.0.exe) |
| **Windows (портативная)** | `SubTrack-Portable-0.3.0.exe` | [Скачать Portable](https://github.com/DanyaDanileckiy/subtrack/releases/download/v0.3.0/SubTrack-Portable-0.3.0.exe) |

> **Windows SmartScreen:** файл не подписан → «Подробнее» → «Выполнить в любом случае».  
> **Android:** разрешите установку из неизвестных источников.

## Возможности

- Подписки с ценой, валютой, периодом, датой списания, категорией, цветом, логотипом, способом оплаты и заметками
- Правильная обработка дат в конце месяца (31-е число)
- Пробный период с напоминанием
- Обзор: сумма в месяц/год, разбивка по категориям, подсказки «Отмените X — сэкономите Y в год»
- Календарь списаний
- **166 валют** с оффлайн-курсами и возможностью задать свой
- Напоминания (локальные на Android, системные на Windows)
- 70 популярных сервисов с логотипами
- **30 языков** (включая RTL: иврит, арабский)
- Экспорт JSON / CSV, светлая и тёмная тема

| | |
|---|---|
| ![Calendar](docs/03-calendar-ru.png) | ![Currencies](docs/04-currency-picker-ru.png) |
| ![RTL](docs/06-subscriptions-he-rtl-bidi.png) | ![Mobile](docs/11-mobile-calendar-ru.png) |

## Приватность

Нет аккаунтов, аналитики, рекламы и бэкенда. Единственный сетевой запрос — публичные курсы валют (open.er-api.com, без ключа).

## Сборка

```bash
npm install
npm run dev          # http://localhost:5173
npm run dist:win     # Windows Setup + Portable
npm run android:apk  # Android APK
```

**Stack:** React 18 · Vite · Tailwind CSS · Capacitor 7 · Electron

## Лицензия

MIT. Логотипы — [Simple Icons](https://simpleicons.org) (CC0).  
История изменений — [CHANGELOG.md](CHANGELOG.md).

<div align="center">

**Сделано с ❤️ для тех, кто хочет контролировать подписки без облака**

</div>
