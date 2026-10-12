// Pure helpers: periods, dates, currency conversion. No DOM, testable in Node.
export const CURRENCIES = ['RUB', 'USD', 'EUR', 'GBP', 'KZT', 'UAH', 'BYN', 'TRY', 'CNY', 'JPY', 'INR', 'PLN', 'GEL', 'AMD', 'UZS'];

// Approximate fallback rates: units of currency per 1 USD (used offline when nothing cached).
export const FALLBACK_RATES = {
  USD: 1, RUB: 90, EUR: 0.92, GBP: 0.79, KZT: 480, UAH: 41, BYN: 3.3, TRY: 34,
  CNY: 7.2, JPY: 150, INR: 84, PLN: 4, GEL: 2.7, AMD: 390, UZS: 12700,
};

/** Convert amount from one currency to another using USD-based rates. */
export function convert(amount, from, to, rates) {
  if (from === to) return amount;
  const r = { ...FALLBACK_RATES, ...(rates || {}) };
  if (!r[from] || !r[to]) return amount;
  return (amount / r[from]) * r[to];
}

/** Length of a billing period in days. custom: {customCount, customUnit: day|week|month|year} */
export function periodDays(sub) {
  switch (sub.period) {
    case 'week': return 7;
    case 'month': return 365.25 / 12;
    case 'year': return 365.25;
    case 'custom': {
      const n = Math.max(1, Number(sub.customCount) || 1);
      const unit = { day: 1, week: 7, month: 365.25 / 12, year: 365.25 }[sub.customUnit || 'month'];
      return n * unit;
    }
    default: return 365.25 / 12;
  }
}

export function monthlyCost(sub) {
  return (Number(sub.price) || 0) * ((365.25 / 12) / periodDays(sub));
}

function parseDate(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
export function fmtISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addMonthsClamped(d, n) {
  const day = d.getDate();
  const r = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate();
  r.setDate(Math.min(day, last));
  return r;
}

/** Advance one billing period. */
export function addPeriod(date, sub) {
  const d = new Date(date);
  switch (sub.period) {
    case 'week': d.setDate(d.getDate() + 7); return d;
    case 'month': return addMonthsClamped(d, 1);
    case 'year': return addMonthsClamped(d, 12);
    case 'custom': {
      const n = Math.max(1, Number(sub.customCount) || 1);
      const u = sub.customUnit || 'month';
      if (u === 'day') { d.setDate(d.getDate() + n); return d; }
      if (u === 'week') { d.setDate(d.getDate() + 7 * n); return d; }
      if (u === 'month') return addMonthsClamped(d, n);
      return addMonthsClamped(d, 12 * n);
    }
    default: return addMonthsClamped(d, 1);
  }
}

/** Next charge date on or after `today` (rolls past dates forward). Returns ISO string. */
export function nextCharge(sub, today = new Date()) {
  if (!sub.nextDate) return null;
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let d = parseDate(sub.nextDate);
  let guard = 0;
  while (d < t && guard++ < 5000) d = addPeriod(d, sub);
  return fmtISO(d);
}

export function daysUntil(iso, today = new Date()) {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((parseDate(iso) - t) / 86400000);
}

export function totals(subs, base, rates) {
  let monthly = 0;
  for (const s of subs) if (s.active !== false) monthly += convert(monthlyCost(s), s.currency, base, rates);
  return { monthly, yearly: monthly * 12 };
}

export function formatMoney(v, cur, locale) {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: cur, maximumFractionDigits: v >= 1000 ? 0 : 2 }).format(v);
  } catch { return `${v.toFixed(2)} ${cur}`; }
}
