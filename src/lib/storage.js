import { Capacitor } from '@capacitor/core';
import { LEGACY_CAT } from './presets.js';
const fixCat = (c) => LEGACY_CAT[c] || c || 'other';
const KEY = 'subtrack.data.v1';
export const DEFAULT_SETTINGS = { lang: 'ru', theme: 'light', base: 'RUB', remindDays: 2, manualRates: {} };

export function load() {
  try { const d = JSON.parse(localStorage.getItem(KEY)); if (d) return { subs: (d.subs || []).map((s) => ({ ...s, category: fixCat(s.category) })), settings: { ...DEFAULT_SETTINGS, ...d.settings } }; } catch {}
  return { subs: [], settings: DEFAULT_SETTINGS };
}
export function save(subs, settings) { localStorage.setItem(KEY, JSON.stringify({ subs, settings })); }

export function validateImport(obj) {
  const subs = Array.isArray(obj) ? obj : obj && Array.isArray(obj.subscriptions) ? obj.subscriptions : null;
  if (!subs) throw new Error('format');
  return subs.filter((s) => s && typeof s.name === 'string').map((s) => ({
    id: s.id || crypto.randomUUID(), name: s.name, price: Number(s.price) || 0, currency: s.currency || 'USD',
    period: ['week', 'month', 'year', 'custom'].includes(s.period) ? s.period : 'month',
    customCount: s.customCount || 1, customUnit: s.customUnit || 'month', nextDate: s.nextDate || null,
    category: fixCat(s.category), color: s.color || '#6366f1', icon: s.icon ?? (s.slug ? '' : s.name.slice(0, 1).toUpperCase()), slug: s.slug || null, active: s.active !== false,
  }));
}

export async function exportJson(subs, settings) {
  const text = JSON.stringify({ app: 'subtrack', version: 1, exportedAt: new Date().toISOString(), settings, subscriptions: subs }, null, 2);
  const name = `subtrack-${new Date().toISOString().slice(0, 10)}.json`;
  if (Capacitor.isNativePlatform()) {
    const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
    const { Share } = await import('@capacitor/share');
    const r = await Filesystem.writeFile({ path: name, data: text, directory: Directory.Cache, encoding: Encoding.UTF8 });
    await Share.share({ title: name, url: r.uri });
    return;
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
