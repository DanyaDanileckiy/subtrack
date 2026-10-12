import { FALLBACK_RATES } from './money.js';
const KEY = 'subtrack.rates';
// Free, keyless endpoint (https://www.exchangerate-api.com/docs/free).
const URL = 'https://open.er-api.com/v6/latest/USD';

export function loadCachedRates() {
  try { const c = JSON.parse(localStorage.getItem(KEY)); if (c && c.rates) return { ...c, source: 'cached' }; } catch {}
  return { rates: FALLBACK_RATES, time: null, source: 'fallback' };
}

export async function fetchRates() {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 8000);
  try {
    const r = await fetch(URL, { signal: ctl.signal });
    const j = await r.json();
    if (j.result !== 'success' || !j.rates) throw new Error('bad response');
    const data = { rates: j.rates, time: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(data));
    return { ...data, source: 'online' };
  } finally { clearTimeout(timer); }
}
