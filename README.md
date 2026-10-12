[Русский](README.md) · [English](README.en.md) · [Español](README.es.md) · [日本語](README.ja.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

# SubTrack — трекер подписок

Бесплатное open-source приложение для учёта подписок на Android и Windows. Работает офлайн, без регистрации, серверов и ключей API — все данные хранятся только на вашем устройстве.

![SubTrack](docs/01-dashboard-ru-insights.png)

## Возможности
- Подписки с ценой, валютой, периодом (неделя / месяц / год / свой), датой списания, категорией, цветом, логотипом, способом оплаты, ссылкой и заметками.
- Даты в конце месяца считаются правильно: подписка от 31-го списывается в последний день короткого месяца и снова 31-го.
- Пробный период: дата окончания и отдельное напоминание до первого списания.
- Обзор: сумма в месяц и в год в основной валюте, разбивка по категориям и подсказки «Отмените X — сэкономите Y в год».
- Календарь списаний по месяцам с суммой за месяц.
- **Все 166 валют** open.er-api.com с локализованными названиями, поиском и популярными валютами сверху. Офлайн работают сохранённые курсы или встроенный снимок курсов для всех валют; любой курс можно задать вручную.
- Напоминания: локальные уведомления на Android, системные на Windows.
- 70 популярных сервисов (в т.ч. Яндекс Плюс, Кинопоиск, VK Музыка, Okko, Иви, Start, Литрес) с настоящими логотипами Simple Icons.
- 30 языков интерфейса с RTL для иврита и арабского.
- Экспорт и импорт JSON, экспорт CSV для Excel / Google Таблиц, светлая и тёмная тема.

| | |
|---|---|
| ![](docs/03-calendar-ru.png) | ![](docs/04-currency-picker-ru.png) |
| ![](docs/06-subscriptions-he-rtl-bidi.png) | ![](docs/11-mobile-calendar-ru.png) |

## Скачать
Готовые файлы — в [Releases](../../releases/latest): `SubTrack-0.3.0-debug.apk` (Android), `SubTrack-Setup-0.3.0.exe` (установщик Windows) и `SubTrack-Portable-0.3.0.exe` (без установки). Файлы не подписаны: Windows SmartScreen может предупредить («Подробнее» → «Выполнить в любом случае»), на Android разрешите установку из неизвестных источников.

## Сборка
```bash
npm install
npm run dev          # http://localhost:5173
npm test
npm run dist:win     # Windows Setup + Portable (Linux: wine)
npm run android:apk  # Android debug APK (Android SDK + JDK 21)
```

Stack: React 18, Vite, Tailwind CSS, Capacitor 7, Electron, electron-builder.

## Приватность
Нет аккаунтов, аналитики, рекламы и бэкенда. Единственный сетевой запрос — публичные курсы валют (open.er-api.com, без ключа).

## Лицензия
MIT. Логотипы — [Simple Icons](https://simpleicons.org) (CC0); товарные знаки принадлежат их владельцам, см. [NOTICE](NOTICE). История изменений — [CHANGELOG](CHANGELOG.md).
