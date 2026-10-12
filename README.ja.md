[Русский](README.md) · [English](README.en.md) · [Español](README.es.md) · [日本語](README.ja.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

# SubTrack — サブスク管理アプリ

Android と Windows 向けの無料・オープンソースのサブスク管理アプリです。オフラインで動作し、登録・サーバー・APIキーは不要。データはすべて端末内にのみ保存されます。

![SubTrack](docs/01-dashboard-ru-insights.png)

## 主な機能
- 料金・通貨・請求周期（週／月／年／カスタム）・請求日・カテゴリ・色・ロゴ・支払い方法・リンク・メモを登録できます。
- 月末日を正しく処理：31日開始のサブスクは短い月の末日に請求され、翌月以降は再び31日に戻ります。
- 無料トライアル：終了日を設定し、初回請求前に専用のリマインダーを表示。
- 概要：基準通貨での月額・年額合計、カテゴリ別内訳、「X を解約すると年間 Y の節約」というヒント。
- 請求カレンダー（月ごとの合計付き）。
- open.er-api.com の **全166通貨** に対応。各言語の通貨名、検索、よく使う通貨を上部に表示。オフライン時は保存済みレートまたは全通貨分の内蔵スナップショットを使用し、レートは手動でも設定できます。
- リマインダー：Android はローカル通知、Windows はシステム通知。
- 人気の70サービスを Simple Icons の実際のロゴ付きで収録。
- 30言語の UI（ヘブライ語・アラビア語は RTL）。
- JSON のエクスポート／インポート、Excel や Google スプレッドシート向け CSV エクスポート、ライト／ダークテーマ。

| | |
|---|---|
| ![](docs/03-calendar-ru.png) | ![](docs/04-currency-picker-ru.png) |
| ![](docs/06-subscriptions-he-rtl-bidi.png) | ![](docs/11-mobile-calendar-ru.png) |

## ダウンロード
[Releases](../../releases/latest) から入手できます：`SubTrack-0.3.0-debug.apk`（Android）、`SubTrack-Setup-0.3.0.exe`（Windows インストーラー）、`SubTrack-Portable-0.3.0.exe`（インストール不要）。未署名のため Windows SmartScreen の警告が出る場合があります（「詳細情報」→「実行」）。Android では提供元不明のアプリのインストールを許可してください。

## ビルド
```bash
npm install
npm run dev          # http://localhost:5173
npm test
npm run dist:win     # Windows Setup + Portable (Linux: wine)
npm run android:apk  # Android debug APK (Android SDK + JDK 21)
```

Stack: React 18, Vite, Tailwind CSS, Capacitor 7, Electron, electron-builder.

## プライバシー
アカウント、解析、広告、バックエンドは一切ありません。通信は公開為替レートの取得（open.er-api.com、キー不要）のみです。

## ライセンス
MIT。ロゴは [Simple Icons](https://simpleicons.org)（CC0）。商標は各権利者に帰属します（[NOTICE](NOTICE) を参照）。変更履歴は [CHANGELOG](CHANGELOG.md)。
