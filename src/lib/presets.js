// ~70 popular subscription services. Prices are APPROXIMATE base-tier list prices (2026) — users should check their own.
// slug = Simple Icons slug (bundled offline in logos.generated.js); null => colored initial badge.
// group = preset picker section; category = subscription category.
const P = (name, price, currency, category, color, slug, group = category, period = 'month') => ({ name, price, currency, category, color, slug, group, period });
export const PRESETS = [
  // Streaming / video
  P('Netflix', 7.99, 'USD', 'streaming', '#E50914', 'netflix'),
  P('YouTube Premium', 13.99, 'USD', 'streaming', '#FF0000', 'youtube'),
  P('Disney+', 9.99, 'USD', 'streaming', '#113CCF', null),
  P('Prime Video', 8.99, 'USD', 'streaming', '#00A8E1', null),
  P('HBO Max', 10.99, 'USD', 'streaming', '#002BE7', 'hbomax'),
  P('Apple TV+', 9.99, 'USD', 'streaming', '#000000', 'appletv'),
  P('Hulu', 9.99, 'USD', 'streaming', '#1CE783', null),
  P('Paramount+', 7.99, 'USD', 'streaming', '#0064FF', 'paramountplus'),
  P('Crunchyroll', 7.99, 'USD', 'streaming', '#FF5E00', 'crunchyroll'),
  // Music & audio
  P('Spotify', 11.99, 'USD', 'music', '#1DB954', 'spotify'),
  P('Apple Music', 10.99, 'USD', 'music', '#FA243C', 'applemusic'),
  P('YouTube Music', 10.99, 'USD', 'music', '#FF0000', 'youtubemusic'),
  P('Deezer', 11.99, 'USD', 'music', '#A238FF', 'deezer'),
  P('Tidal', 10.99, 'USD', 'music', '#000000', 'tidal'),
  P('Amazon Music Unlimited', 10.99, 'USD', 'music', '#25D1DA', null),
  P('SoundCloud Go+', 10.99, 'USD', 'music', '#FF5500', 'soundcloud'),
  P('Audible', 14.95, 'USD', 'books', '#F8991C', 'audible'),
  // Cloud
  P('iCloud+', 0.99, 'USD', 'cloud', '#3693F3', 'icloud'),
  P('Google One', 1.99, 'USD', 'cloud', '#4285F4', null),
  P('Dropbox Plus', 11.99, 'USD', 'cloud', '#0061FF', 'dropbox'),
  P('MEGA', 5.49, 'EUR', 'cloud', '#D9272E', 'mega'),
  P('Proton Drive', 4.99, 'USD', 'cloud', '#6D4AFF', 'protondrive'),
  P('Microsoft 365', 9.99, 'USD', 'software', '#D83B01', null, 'cloud'),
  // AI
  P('ChatGPT Plus', 20, 'USD', 'ai', '#10A37F', null),
  P('Claude Pro', 20, 'USD', 'ai', '#D97757', 'claude'),
  P('Gemini Advanced', 19.99, 'USD', 'ai', '#8E75B2', 'googlegemini'),
  P('Perplexity Pro', 20, 'USD', 'ai', '#1FB8CD', 'perplexity'),
  P('Midjourney', 10, 'USD', 'ai', '#000000', null),
  P('GitHub Copilot', 10, 'USD', 'ai', '#000000', 'githubcopilot'),
  P('Cursor Pro', 20, 'USD', 'ai', '#000000', 'cursor'),
  P('X Premium', 8, 'USD', 'social', '#000000', 'x', 'ai'),
  // Software & productivity
  P('Adobe Creative Cloud', 59.99, 'USD', 'software', '#DA1F26', null),
  P('Canva Pro', 14.99, 'USD', 'software', '#00C4CC', null),
  P('Notion Plus', 12, 'USD', 'software', '#000000', 'notion'),
  P('Figma Professional', 16, 'USD', 'software', '#F24E1E', 'figma'),
  P('1Password', 2.99, 'USD', 'software', '#3B66BC', '1password'),
  P('Bitwarden Premium', 10, 'USD', 'software', '#175DDC', 'bitwarden', 'software', 'year'),
  P('JetBrains All Products', 28.9, 'USD', 'software', '#000000', 'jetbrains'),
  P('Evernote Personal', 14.99, 'USD', 'software', '#00A82D', 'evernote'),
  P('Todoist Pro', 5, 'USD', 'software', '#E44332', 'todoist'),
  P('Grammarly Premium', 12, 'USD', 'software', '#15C39A', 'grammarly'),
  P('Zoom Pro', 15.99, 'USD', 'software', '#0B5CFF', 'zoom'),
  // Gaming
  P('Xbox Game Pass', 19.99, 'USD', 'gaming', '#107C10', null),
  P('PlayStation Plus', 9.99, 'USD', 'gaming', '#0070D1', 'playstation'),
  P('Nintendo Switch Online', 19.99, 'USD', 'gaming', '#E60012', null, 'gaming', 'year'),
  P('EA Play', 5.99, 'USD', 'gaming', '#FF4747', 'ea'),
  P('Apple Arcade', 6.99, 'USD', 'gaming', '#000000', 'applearcade'),
  P('Discord Nitro', 9.99, 'USD', 'social', '#5865F2', 'discord', 'gaming'),
  // News, creators & learning
  P('The New York Times', 4, 'USD', 'news', '#000000', 'newyorktimes'),
  P('Medium', 5, 'USD', 'news', '#000000', 'medium'),
  P('Patreon', 5, 'USD', 'social', '#000000', 'patreon', 'news'),
  P('Duolingo Super', 12.99, 'USD', 'education', '#58CC02', 'duolingo'),
  P('Coursera Plus', 59, 'USD', 'education', '#0056D2', 'coursera'),
  P('Strava', 11.99, 'USD', 'health', '#FC4C02', 'strava', 'education'),
  P('Headspace', 12.99, 'USD', 'health', '#F47D31', 'headspace', 'education'),
  // VPN
  P('NordVPN', 12.99, 'USD', 'vpn', '#4687FF', 'nordvpn'),
  P('ExpressVPN', 12.95, 'USD', 'vpn', '#DA3940', 'expressvpn'),
  P('Surfshark', 15.45, 'USD', 'vpn', '#1EBFBF', 'surfshark'),
  P('Proton VPN', 9.99, 'USD', 'vpn', '#66DEB1', 'protonvpn'),
  P('Mullvad VPN', 5, 'EUR', 'vpn', '#294D73', 'mullvad'),
  // Russian services
  P('Яндекс Плюс', 399, 'RUB', 'music', '#FC3F1D', null, 'ru'),
  P('Кинопоиск', 399, 'RUB', 'streaming', '#FF5500', 'kinopoisk', 'ru'),
  P('VK Музыка', 199, 'RUB', 'music', '#0077FF', 'vk', 'ru'),
  P('Okko', 399, 'RUB', 'streaming', '#5B2BE0', null, 'ru'),
  P('Иви', 399, 'RUB', 'streaming', '#EA003D', null, 'ru'),
  P('Start', 299, 'RUB', 'streaming', '#FF4F12', null, 'ru'),
  P('Литрес', 399, 'RUB', 'books', '#FF4C00', null, 'ru'),
  P('Telegram Premium', 299, 'RUB', 'social', '#26A5E4', 'telegram', 'ru'),
  P('Wink', 349, 'RUB', 'streaming', '#FF5C00', null, 'ru'),
  P('Boosty', 300, 'RUB', 'social', '#F15F2C', 'boosty', 'ru'),
];
export const CATEGORIES = ['streaming', 'music', 'cloud', 'ai', 'software', 'gaming', 'news', 'vpn', 'education', 'books', 'social', 'health', 'shopping', 'other'];
export const GROUPS = ['streaming', 'music', 'cloud', 'ai', 'software', 'gaming', 'news', 'vpn', 'ru'];
export const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#8b5cf6', '#14b8a6', '#f97316', '#0ea5e9', '#84cc16', '#64748b'];
// Map v0.1 categories to v0.2 ones on import/load.
export const LEGACY_CAT = { video: 'streaming', work: 'software', games: 'gaming' };
