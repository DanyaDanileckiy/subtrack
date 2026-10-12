import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Languages, LayoutDashboard, CalendarDays, ChevronLeft, ChevronRight, ChevronDown, ExternalLink, CreditCard, Lightbulb, Gift, FileSpreadsheet, List, Settings as SettingsIcon, Plus, Pencil, Trash2, Moon, Sun, X, Bell, Download, Upload, RefreshCw, CalendarClock, Search, Wallet } from 'lucide-react';
import { DICTS, LANGS, RTL, localeOf, relDays, unitLabel } from './lib/i18n.js';
import { LOGOS } from './lib/logos.generated.js';
import { CURRENCIES, POPULAR_CURRENCIES, convert, monthlyCost, nextCharge, daysUntil, totals, formatMoney, fmtISO, chargesBetween } from './lib/money.js';
import { PRESETS, CATEGORIES, COLORS, GROUPS } from './lib/presets.js';
import { load, save, exportJson, exportCsv, validateImport } from './lib/storage.js';
import { loadCachedRates, fetchRates } from './lib/rates.js';
import { requestPermission, permissionState, syncReminders, testNotification } from './lib/notify.js';

const initial = load();

export default function App() {
  const [subs, setSubs] = useState(initial.subs);
  const [settings, setSettings] = useState(initial.settings);
  const [tab, setTab] = useState('dashboard');
  const [editing, setEditing] = useState(null);
  const [rateInfo, setRateInfo] = useState(loadCachedRates());
  const [toast, setToast] = useState('');
  const t = { ...(DICTS[settings.lang] || DICTS.ru), _lang: settings.lang };
  const locale = localeOf(settings.lang);
  const rates = useMemo(() => {
    const m = {}; for (const [k, v] of Object.entries(settings.manualRates || {})) if (Number(v) > 0) m[k] = Number(v);
    return { ...rateInfo.rates, ...m };
  }, [rateInfo, settings.manualRates]);
  const fmt = (v, c) => '\u2068' + formatMoney(v, c, locale) + '\u2069';

  useEffect(() => { save(subs, settings); }, [subs, settings]);
  useEffect(() => { document.documentElement.classList.toggle('dark', settings.theme === 'dark'); document.documentElement.lang = settings.lang; document.documentElement.dir = RTL.has(settings.lang) ? 'rtl' : 'ltr'; }, [settings.theme, settings.lang]);
  const refreshRates = () => fetchRates().then(setRateInfo).catch(() => setRateInfo(loadCachedRates()));
  useEffect(() => { refreshRates(); }, []);
  useEffect(() => {
    const run = () => syncReminders(subs, Number(settings.remindDays) || 0, (s, date, kind) => ({
      title: `${kind === 'trial' ? t.trialNotif : t.notifTitle}: ${s.name}`,
      body: `${s.name}: ${fmt(Number(s.price), s.currency)} — ${new Date(date + 'T00:00').toLocaleDateString(locale, { day: 'numeric', month: 'long' })}`,
    }));
    run(); const i = setInterval(run, 3600e3); return () => clearInterval(i);
  }, [subs, settings.remindDays, settings.lang]);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };
  const upsert = (s) => { setSubs((p) => (p.some((x) => x.id === s.id) ? p.map((x) => (x.id === s.id ? s : x)) : [...p, s])); setEditing(null); };
  const remove = (id) => { if (confirm(t.confirmDelete)) { setSubs((p) => p.filter((x) => x.id !== id)); setEditing(null); } };
  const set = (patch) => setSettings((s) => ({ ...s, ...patch }));

  const tabs = [['dashboard', t.dashboard, LayoutDashboard], ['subs', t.subs, List], ['calendar', t.calendar, CalendarDays], ['settings', t.settings, SettingsIcon]];
  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 pb-24 md:pb-8" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <header className="sticky top-0 z-20 backdrop-blur bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/60 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <img src="./icon.svg" className="w-9 h-9" alt="" />
          <div className="flex-1 min-w-0">
            <div className="font-extrabold text-lg leading-tight bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">SubTrack</div>
            <div className="text-xs text-slate-500 truncate">{t.appTagline}</div>
          </div>
          <nav className="hidden md:flex gap-1">
            {tabs.map(([id, label, I]) => (
              <button key={id} onClick={() => setTab(id)} className={`btn ${tab === id ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300' : 'btn-ghost'}`}><I size={16} />{label}</button>
            ))}
          </nav>
          <label className="btn-ghost !px-2 relative" title={t.language}><Languages size={18} /><span className="hidden lg:inline text-xs">{settings.lang.toUpperCase()}</span>
            <select aria-label={t.language} data-testid="lang" className="absolute inset-0 opacity-0 cursor-pointer" value={settings.lang} onChange={(e) => set({ lang: e.target.value })}>{LANGS.map(([c, n]) => <option key={c} value={c}>{n}</option>)}</select></label>
          <button className="btn-ghost !px-2" onClick={() => set({ theme: settings.theme === 'dark' ? 'light' : 'dark' })} title={t.theme}>{settings.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
          <span className="hidden sm:block"><button className="btn-primary" onClick={() => setEditing({})}><Plus size={16} />{t.add}</button></span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5">
        {tab === 'dashboard' && <Dashboard {...{ subs, settings, rates, t, fmt, locale, setEditing }} />}
        {tab === 'subs' && <SubList {...{ subs, settings, rates, t, fmt, locale, setEditing }} />}
        {tab === 'calendar' && <CalendarView {...{ subs, settings, rates, t, fmt, locale, setEditing }} />}
        {tab === 'settings' && <SettingsView {...{ subs, setSubs, settings, set, t, rateInfo, rates, refreshRates, flash, locale }} />}
      </main>

      <button className="sm:hidden fixed end-4 bottom-20 z-30 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-xl flex items-center justify-center" onClick={() => setEditing({})} aria-label={t.add}><Plus /></button>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 flex" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {tabs.map(([id, label, I]) => (
          <button key={id} onClick={() => setTab(id)} className={`flex-1 py-2.5 flex flex-col items-center text-xs gap-0.5 ${tab === id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}><I size={20} />{label}</button>
        ))}
      </nav>

      {editing && <Editor sub={editing} t={t} onSave={upsert} onDelete={remove} onClose={() => setEditing(null)} base={settings.base} locale={locale} />}
      {toast && <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm px-4 py-2 rounded-xl shadow-lg">{toast}</div>}
    </div>
  );
}

function Avatar({ s, size = 44 }) {
  const logo = s.slug && !s.icon && LOGOS[s.slug];
  if (logo) return <div className="rounded-xl flex items-center justify-center shrink-0 shadow-sm" title={logo.t} style={{ background: s.color || '#' + logo.h, width: size, height: size }}>
    <svg viewBox="0 0 24 24" width={size * 0.56} height={size * 0.56} fill="#fff" aria-hidden="true"><path d={logo.p} /></svg></div>;
  return <div className="rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-sm" style={{ background: s.color, width: size, height: size, fontSize: size * 0.36 }}>{s.icon || s.name?.[0]}</div>;
}

function periodLabel(s, t, locale) {
  if (s.period === 'custom') return ` / ${unitLabel(Number(s.customCount) || 1, s.customUnit || 'month', locale)}`;
  { const w = t[s.period] || t.month; return ` / ${locale.startsWith('de') ? w : w.toLocaleLowerCase(locale)}`; }
}
function whenLabel(iso, t, locale) {
  const d = daysUntil(iso);
  const date = new Date(iso + 'T00:00').toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  return { rel: relDays(d, locale), date, d };
}

function Dashboard({ subs, settings, rates, t, fmt, locale, setEditing }) {
  const active = subs.filter((s) => s.active !== false);
  const { monthly, yearly } = totals(subs, settings.base, rates);
  const upcoming = [
    ...active.map((s) => ({ s, date: nextCharge(s), kind: 'charge' })),
    ...active.filter((s) => s.trialEnd && daysUntil(s.trialEnd) >= 0).map((s) => ({ s, date: s.trialEnd, kind: 'trial' })),
  ].filter((x) => x.date && daysUntil(x.date) <= 30).sort((a, b) => a.date.localeCompare(b.date));
  const insights = active.map((s) => ({ s, y: convert(monthlyCost(s), s.currency, settings.base, rates) * 12 })).sort((a, b) => b.y - a.y).slice(0, 3);
  const byCat = {};
  for (const s of active) byCat[s.category || 'other'] = (byCat[s.category || 'other'] || 0) + convert(monthlyCost(s), s.currency, settings.base, rates);
  const cats = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const catColors = { streaming: '#ef4444', music: '#10b981', cloud: '#0ea5e9', ai: '#8b5cf6', software: '#64748b', gaming: '#f59e0b', news: '#f97316', vpn: '#14b8a6', education: '#eab308', books: '#d946ef', social: '#06b6d4', health: '#84cc16', shopping: '#f43f5e', other: '#a855f7' };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 shadow-lg shadow-indigo-500/25 sm:col-span-2">
          <div className="flex items-center gap-2 text-white/80 text-sm"><Wallet size={16} />{t.perMonth}</div>
          <div className="text-4xl font-extrabold mt-1 tracking-tight">{fmt(monthly, settings.base)}</div>
          <div className="mt-3 text-white/85 text-sm">{t.perYear}: <b className="text-white">{fmt(yearly, settings.base)}</b></div>
        </div>
        <div className="card p-5 flex flex-col justify-center">
          <div className="text-sm text-slate-500">{t.active}</div>
          <div className="text-4xl font-extrabold">{active.length}</div>
          <div className="text-xs text-slate-400 mt-1">{t.baseCurrency}: {settings.base}</div>
        </div>
      </div>

      {subs.length === 0 && <section className="card p-4"><p className="text-sm text-slate-500 mb-3">{t.empty}</p><PresetPicker t={t} onPick={(p) => setEditing({ ...p, preset: true })} /></section>}

      <div className="grid md:grid-cols-5 gap-4">
        <section className="card p-4 md:col-span-3">
          <h2 className="font-bold flex items-center gap-2 mb-3"><CalendarClock size={18} className="text-indigo-500" />{t.upcoming}</h2>
          {upcoming.length === 0 && <p className="text-sm text-slate-500 py-6 text-center">{t.noUpcoming}</p>}
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {upcoming.map(({ s, date, kind }) => { const w = whenLabel(date, t, locale); return (
              <li key={s.id + kind} className="py-2.5 flex items-center gap-3 cursor-pointer" onClick={() => setEditing(s)}>
                <Avatar s={s} size={38} />
                <div className="flex-1 min-w-0"><div className="font-semibold truncate">{s.name}</div><div className="text-xs text-slate-500">{w.date}{kind === 'trial' && <span className="ms-1.5 inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 px-1.5"><Gift size={11} />{t.trialEnd}</span>}</div></div>
                <div className="text-end"><div className="font-semibold">{kind === 'trial' ? '—' : fmt(Number(s.price), s.currency)}</div>
                  <div className={`text-xs font-medium ${w.d <= settings.remindDays ? 'text-pink-500' : 'text-slate-500'}`}>{w.rel}</div></div>
              </li>); })}
          </ul>
        </section>
        <section className="card p-4 md:col-span-2">
          <h2 className="font-bold mb-3">{t.byCategory}</h2>
          {cats.length === 0 && <p className="text-sm text-slate-500 py-6 text-center">—</p>}
          <div className="space-y-3">
            {cats.map(([c, v]) => (
              <div key={c}>
                <div className="flex justify-between text-sm mb-1"><span>{t.cat[c] || c}</span><span className="font-semibold">{fmt(v, settings.base)}</span></div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(v / (monthly || 1)) * 100}%`, background: catColors[c] || '#6366f1' }} /></div>
              </div>
            ))}
          </div>
          {insights.length > 1 && <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h2 className="font-bold mb-2 flex items-center gap-2"><Lightbulb size={18} className="text-amber-500" />{t.insights}</h2>
            <ul className="space-y-2">{insights.map(({ s, y }) => (
              <li key={s.id} className="flex items-center gap-2 text-sm"><Avatar s={s} size={26} />
                <span>{t.cancelToSave.split(/(\{name\}|\{amount\})/).map((part, i) => part === '{name}' ? <b key={i}>{s.name}</b> : part === '{amount}' ? <b key={i} className="text-emerald-600 dark:text-emerald-400">{fmt(y, settings.base)}</b> : part)}</span></li>))}</ul>
          </div>}
        </section>
      </div>
    </div>
  );
}

function CalendarView({ subs, settings, rates, t, fmt, locale, setEditing }) {
  const now = new Date();
  const [ym, setYm] = useState([now.getFullYear(), now.getMonth()]);
  const [y, m] = ym;
  const first = new Date(y, m, 1), last = new Date(y, m + 1, 0);
  const byDay = {}; let total = 0;
  for (const s of subs.filter((x) => x.active !== false)) {
    for (const d of chargesBetween(s, first, last)) { (byDay[d] ||= []).push({ s, kind: 'charge' }); total += convert(Number(s.price) || 0, s.currency, settings.base, rates); }
    if (s.trialEnd && s.trialEnd >= fmtISO(first) && s.trialEnd <= fmtISO(last)) (byDay[s.trialEnd] ||= []).push({ s, kind: 'trial' });
  }
  // week starts on Monday except for locales that start on Sunday
  const sundayFirst = /^(en-US|ja|ko|zh|he|ar|hi|th|pt-BR)/.test(locale);
  const lead = (first.getDay() - (sundayFirst ? 0 : 1) + 7) % 7;
  const wd = [...Array(7)].map((_, i) => new Date(2024, 0, (sundayFirst ? 7 : 1) + i).toLocaleDateString(locale, { weekday: 'short' }));
  const cells = [...Array(lead).fill(null), ...[...Array(last.getDate())].map((_, i) => i + 1)];
  const today = fmtISO(now);
  return (
    <section className="card p-4" data-testid="calendar">
      <div className="flex items-center gap-2 mb-4">
        <button className="btn-ghost !p-2" onClick={() => setYm(m === 0 ? [y - 1, 11] : [y, m - 1])} aria-label="prev"><ChevronLeft size={18} className="rtl:rotate-180" /></button>
        <h2 className="font-bold text-lg flex-1 text-center capitalize">{first.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}</h2>
        <button className="btn-ghost !p-2" onClick={() => setYm(m === 11 ? [y + 1, 0] : [y, m + 1])} aria-label="next"><ChevronRight size={18} className="rtl:rotate-180" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-1">{wd.map((d) => <div key={d}>{d}</div>)}</div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => { if (!d) return <div key={'e' + i} />; const iso = fmtISO(new Date(y, m, d)); const items = byDay[iso] || []; return (
          <div key={iso} className={`min-h-[64px] sm:min-h-[84px] rounded-xl p-1 ring-1 ${iso === today ? 'ring-indigo-400 bg-indigo-50/60 dark:bg-indigo-500/10' : 'ring-slate-100 dark:ring-slate-800'}`}>
            <div className="text-xs font-semibold text-slate-500 text-start ps-1">{d}</div>
            <div className="flex flex-wrap gap-0.5 mt-0.5">{items.map(({ s, kind }) => (
              <button key={s.id + kind} title={`${s.name}${kind === 'trial' ? ' — ' + t.trialEnd : ''}`} onClick={() => setEditing(s)} className={`relative ${kind === 'trial' ? 'opacity-70' : ''}`}>
                <Avatar s={s} size={22} />{kind === 'trial' && <Gift size={10} className="absolute -top-1 -end-1 text-amber-500 bg-white rounded-full" />}
              </button>))}</div>
            {items.some((x) => x.kind === 'charge') && <div className="hidden sm:block text-[10px] text-slate-500 truncate mt-0.5">{fmt(items.filter((x) => x.kind === 'charge').reduce((a, { s }) => a + convert(Number(s.price) || 0, s.currency, settings.base, rates), 0), settings.base)}</div>}
          </div>); })}
      </div>
      <div className="mt-4 text-sm text-end">{t.monthTotal}: <b>{fmt(total, settings.base)}</b></div>
    </section>
  );
}

function CurrencyPicker({ value, onChange, locale, t, testid }) {
  const [open, setOpen] = useState(false); const [q, setQ] = useState('');
  const names = useMemo(() => { let dn; try { dn = new Intl.DisplayNames([locale, 'en'], { type: 'currency' }); } catch {} return (c) => { try { return dn ? dn.of(c) : c; } catch { return c; } }; }, [locale]);
  const ql = q.trim().toLowerCase();
  const match = (c) => !ql || c.toLowerCase().includes(ql) || names(c).toLowerCase().includes(ql);
  const pop = POPULAR_CURRENCIES.filter((c) => CURRENCIES.includes(c) && match(c));
  const rest = CURRENCIES.filter((c) => !POPULAR_CURRENCIES.includes(c) && match(c)).sort((a, b) => names(a).localeCompare(names(b), locale));
  const pick = (c) => { onChange(c); setOpen(false); setQ(''); };
  const Row = ({ c }) => <button type="button" onClick={() => pick(c)} className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm text-start hover:bg-indigo-50 dark:hover:bg-indigo-500/10 ${c === value ? 'font-semibold text-indigo-600 dark:text-indigo-300' : ''}`}><span className="w-11 font-mono text-xs text-slate-500">{c}</span><span className="truncate">{names(c)}</span></button>;
  return (
    <div className="relative">
      <button type="button" data-testid={testid} className="input flex items-center gap-2 text-start" onClick={() => setOpen(!open)}><span className="font-semibold">{value}</span><span className="truncate text-slate-500 flex-1">{names(value)}</span><ChevronDown size={16} className="text-slate-400" /></button>
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
      {open && <div onKeyDown={(e) => e.key === 'Escape' && setOpen(false)} className="absolute end-0 z-50 mt-1 w-[min(300px,85vw)] rounded-xl bg-white dark:bg-slate-800 shadow-xl ring-1 ring-slate-200 dark:ring-slate-700">
        <div className="p-2"><input autoFocus className="input" placeholder={t.searchCurrency} value={q} onChange={(e) => setQ(e.target.value)} data-testid={testid + '-search'} /></div>
        <div className="max-h-64 overflow-y-auto pb-1">
          {pop.length > 0 && <div className="px-3 pt-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">{t.popularCur}</div>}
          {pop.map((c) => <Row key={c} c={c} />)}
          {rest.length > 0 && <div className="px-3 pt-2 text-[11px] uppercase tracking-wide font-semibold text-slate-400">{t.allCur} ({CURRENCIES.length})</div>}
          {rest.map((c) => <Row key={c} c={c} />)}
        </div>
      </div>}
    </div>
  );
}


function SubList({ subs, settings, rates, t, fmt, locale, setEditing }) {
  const [q, setQ] = useState(''); const [sort, setSort] = useState('date');
  const list = subs.filter((s) => s.name.toLowerCase().includes(q.toLowerCase())).map((s) => ({ s, date: nextCharge(s), m: convert(monthlyCost(s), s.currency, settings.base, rates) }));
  list.sort((a, b) => sort === 'price' ? b.m - a.m : sort === 'name' ? a.s.name.localeCompare(b.s.name) : (a.date || '9').localeCompare(b.date || '9'));
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1"><Search size={16} className="absolute start-3 top-2.5 text-slate-400" /><input className="input !ps-9" placeholder={t.search} value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select className="input !w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="date">{t.sortDate}</option><option value="price">{t.sortPrice}</option><option value="name">{t.sortName}</option>
        </select>
      </div>
      {subs.length === 0 && <section className="card p-4"><p className="text-sm text-slate-500 mb-3">{t.empty}</p><PresetPicker t={t} onPick={(p) => setEditing({ ...p, preset: true })} /></section>}
      <div className="grid sm:grid-cols-2 gap-3">
        {list.map(({ s, date, m }) => (
          <div key={s.id} className={`card p-4 flex items-center gap-3 ${s.active === false ? 'opacity-60' : ''}`}>
            <Avatar s={s} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{s.name}</div>
              <div className="text-xs text-slate-500">{t.cat[s.category] || s.category} · {date ? whenLabel(date, t, locale).date : '—'}{s.active === false ? ` · ${t.paused}` : ''}</div>
              {(s.trialEnd || s.payment || s.link) && <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px]">
                {s.trialEnd && daysUntil(s.trialEnd) >= 0 && <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 px-1.5"><Gift size={11} />{t.trial}: {whenLabel(s.trialEnd, t, locale).date}</span>}
                {s.payment && <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-1.5 text-slate-600 dark:text-slate-300"><CreditCard size={11} />{s.payment}</span>}
                {s.link && /^https?:\/\//.test(s.link) && <a href={s.link} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400"><ExternalLink size={11} />{t.openLink}</a>}
              </div>}
            </div>
            <div className="text-end">
              <div className="font-bold">{fmt(Number(s.price), s.currency)}<span className="text-xs font-normal text-slate-500">{periodLabel(s, t, locale)}</span></div>
              {s.currency !== settings.base || s.period !== 'month' ? <div className="text-xs text-slate-500">≈ {fmt(m, settings.base)}{periodLabel({ period: 'month' }, t, locale)}</div> : null}
            </div>
            <button className="btn-ghost !p-2" onClick={() => setEditing(s)} aria-label={t.edit}><Pencil size={16} /></button>
          </div>
        ))}
      </div>
      {subs.length > 0 && <details className="card p-4"><summary className="cursor-pointer font-semibold">{t.presets} ({PRESETS.length})</summary><div className="mt-3"><PresetPicker t={t} onPick={(p) => setEditing({ ...p, preset: true })} /></div></details>}
    </div>
  );
}
function PresetPicker({ t, onPick }) {
  const [q, setQ] = useState('');
  const ql = q.trim().toLowerCase();
  const found = PRESETS.filter((p) => !ql || p.name.toLowerCase().includes(ql) || (t.cat[p.category] || '').toLowerCase().includes(ql));
  return (
    <div>
      <div className="relative mb-3"><Search size={16} className="absolute start-3 top-2.5 text-slate-400" />
        <input className="input !ps-9" data-testid="preset-search" placeholder={t.searchPresets} value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <div className="space-y-3 max-h-[46vh] overflow-y-auto pe-1">
        {GROUPS.map((g) => { const items = found.filter((p) => p.group === g); if (!items.length) return null; return (
          <div key={g}>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">{g === 'ru' ? t.grpRu : t.cat[g]}</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {items.map((p) => (
                <button type="button" key={p.name} onClick={() => onPick(p)} className="flex items-center gap-2 p-1.5 rounded-xl ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 text-start transition">
                  <Avatar s={{ ...p, icon: '' , ...(p.slug && LOGOS[p.slug] ? {} : { icon: p.name[0] }) }} size={30} /><span className="text-sm font-medium truncate">{p.name}</span>
                </button>))}
            </div>
          </div>); })}
      </div>
    </div>
  );
}

function Editor({ sub, t, onSave, onDelete, onClose, base, locale }) {
  const isNew = !sub.id;
  const [f, setF] = useState({ name: '', price: '', currency: base, period: 'month', customCount: 3, customUnit: 'month', nextDate: fmtISO(new Date()), category: 'other', color: COLORS[0], icon: '', active: true, trialEnd: '', payment: '', notes: '', link: '', ...sub });
  const u = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const submit = (e) => { e.preventDefault(); if (!f.name.trim()) return; const { preset, ...rest } = f; onSave({ ...rest, id: f.id || crypto.randomUUID(), price: Number(f.price) || 0, icon: f.icon || (f.slug && LOGOS[f.slug] ? '' : f.name.trim()[0].toUpperCase()) }); };
  return (
    <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-5 max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <Avatar s={{ ...f, icon: f.icon || (f.slug && LOGOS[f.slug] ? '' : f.name[0] || '?') }} />
          <h2 className="font-bold text-lg flex-1">{isNew ? t.add : t.edit}</h2>
          <button type="button" className="btn-ghost !p-2" onClick={onClose}><X size={18} /></button>
        </div>
        {isNew && !sub.preset && <div className="mb-4"><div className="label">{t.presets}</div><PresetPicker t={t} onPick={(p) => setF({ ...f, ...p, icon: '' })} /></div>}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><label className="label">{t.name}</label><input className="input" required value={f.name} onChange={u('name')} autoFocus /></div>
          <div><label className="label">{t.price}</label><input className="input" type="number" step="0.01" min="0" required value={f.price} onChange={u('price')} /></div>
          <div><label className="label">{t.currency}</label><CurrencyPicker value={f.currency} onChange={(c) => setF({ ...f, currency: c })} locale={locale} t={t} testid="sub-currency" /></div>
          <div><label className="label">{t.period}</label><select className="input" value={f.period} onChange={u('period')}>{['week', 'month', 'year', 'custom'].map((p) => <option key={p} value={p}>{t[p]}</option>)}</select></div>
          <div><label className="label">{t.nextDate}</label><input className="input" type="date" value={f.nextDate || ''} onChange={u('nextDate')} /></div>
          {f.period === 'custom' && <div className="col-span-2 flex items-center gap-2 text-sm"><span>{t.every}</span><input className="input !w-20" type="number" min="1" value={f.customCount} onChange={u('customCount')} />
            <select className="input !w-auto" value={f.customUnit} onChange={u('customUnit')}>{['day', 'week', 'month', 'year'].map((v) => <option key={v} value={v}>{unitLabel(Number(f.customCount) || 1, v, localeOf(t._lang))}</option>)}</select></div>}
          <div><label className="label">{t.category}</label><select className="input" value={f.category} onChange={u('category')}>{CATEGORIES.map((c) => <option key={c} value={c}>{t.cat[c]}</option>)}</select></div>
          <div><label className="label">{t.icon}</label><input className="input" maxLength={3} value={f.icon} onChange={u('icon')} placeholder={f.name[0] || '★'} /></div>
          <div className="col-span-2"><label className="label">{t.color}</label><div className="flex flex-wrap gap-2">{COLORS.concat(sub.color && !COLORS.includes(sub.color) ? [sub.color] : []).map((c) => (
            <button type="button" key={c} onClick={() => setF({ ...f, color: c })} className={`w-8 h-8 rounded-full ring-offset-2 dark:ring-offset-slate-900 ${f.color === c ? 'ring-2 ring-indigo-500' : ''}`} style={{ background: c }} />))}
            <input type="color" value={f.color} onChange={u('color')} className="w-8 h-8 rounded-full overflow-hidden cursor-pointer" /></div></div>
          <div><label className="label">{t.trialEnd}</label><input className="input" type="date" value={f.trialEnd || ''} onChange={u('trialEnd')} /></div>
          <div><label className="label">{t.payment}</label><input className="input" maxLength={40} value={f.payment || ''} onChange={u('payment')} placeholder="Visa •• 4242" /></div>
          <div className="col-span-2"><label className="label">{t.link}</label><input className="input" type="url" value={f.link || ''} onChange={u('link')} placeholder="https://" /></div>
          <div className="col-span-2"><label className="label">{t.notes}</label><textarea className="input min-h-[64px]" maxLength={1000} value={f.notes || ''} onChange={u('notes')} /></div>
          <label className="col-span-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={f.active !== false} onChange={u('active')} className="w-4 h-4 accent-indigo-500" />{t.isActive}</label>
        </div>
        <div className="flex gap-2 mt-5">
          {!isNew && <button type="button" className="btn text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10" onClick={() => onDelete(f.id)}><Trash2 size={16} />{t.delete}</button>}
          <div className="flex-1" />
          <button type="button" className="btn-ghost" onClick={onClose}>{t.cancel}</button>
          <button className="btn-primary">{t.save}</button>
        </div>
      </form>
    </div>
  );
}

function SettingsView({ subs, setSubs, settings, set, t, rateInfo, rates, refreshRates, flash, locale }) {
  const fileRef = useRef();
  const [perm, setPerm] = useState('default');
  useEffect(() => { permissionState().then(setPerm).catch(() => {}); }, []);
  const doImport = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    try { const obj = JSON.parse(await file.text()); const list = validateImport(obj); setSubs(list); if (obj.settings) set({ ...obj.settings }); flash(`${t.importOk}: ${list.length}`); }
    catch { flash(t.importErr); } e.target.value = '';
  };
  const used = [...new Set([settings.base, ...subs.map((s) => s.currency)])].filter((c) => c !== 'USD');
  const status = rateInfo.source === 'online' ? `${t.ratesOnline}: ${new Date(rateInfo.time).toLocaleString(locale)}` : rateInfo.source === 'cached' ? `${t.ratesCached} ${new Date(rateInfo.time).toLocaleString(locale)}` : t.ratesFallback;
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <section className="card p-4 space-y-3">
        <h2 className="font-bold">{t.rates}</h2>
        <div><label className="label">{t.baseCurrency}</label><CurrencyPicker value={settings.base} onChange={(c) => set({ base: c })} locale={locale} t={t} testid="base-currency" /></div>
        <div className="flex items-center gap-2 text-xs text-slate-500"><span className={`w-2 h-2 rounded-full ${rateInfo.source === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`} /><span className="flex-1">{status}</span><button className="btn-ghost !py-1" onClick={refreshRates}><RefreshCw size={14} />{t.refresh}</button></div>
        <div className="label">{t.manualRate}</div>
        <div className="grid grid-cols-2 gap-2">{used.map((c) => (
          <label key={c} className="flex items-center gap-2 text-sm"><span className="w-10 font-semibold">{c}</span>
            <input className="input" type="number" step="any" min="0" placeholder={(rateInfo.rates[c] || '').toString().slice(0, 8)} value={settings.manualRates?.[c] ?? ''} onChange={(e) => set({ manualRates: { ...settings.manualRates, [c]: e.target.value } })} /></label>))}</div>
        <p className="text-xs text-slate-400">{t.manualHint}</p>
      </section>
      <section className="card p-4 space-y-3">
        <h2 className="font-bold">{t.reminders}</h2>
        <div><label className="label">{t.remindDays}</label><input className="input" type="number" min="0" max="30" value={settings.remindDays} onChange={(e) => set({ remindDays: Number(e.target.value) })} /></div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn-primary" onClick={async () => { const ok = await requestPermission(); setPerm(ok ? 'granted' : 'denied'); flash(ok ? t.notifOk : t.notifDenied); }}><Bell size={16} />{t.enableNotif}</button>
          <button className="btn-ghost" onClick={() => testNotification('SubTrack', t.notifOk)}>{t.testNotif}</button>
          <span className="text-xs text-slate-500">{perm === 'granted' ? '✓ ' + t.notifOk : perm === 'denied' ? t.notifDenied : ''}</span>
        </div>
        <h2 className="font-bold pt-2">{t.data}</h2>
        <p className="text-xs text-slate-500">{t.dataLocal}</p>
        <div className="flex flex-wrap gap-2">
          <button className="btn-ghost ring-1 ring-slate-200 dark:ring-slate-700" onClick={() => exportJson(subs, settings)}><Download size={16} />{t.exportJson}</button>
          <button className="btn-ghost ring-1 ring-slate-200 dark:ring-slate-700" onClick={() => exportCsv(subs, settings.base, rates)}><FileSpreadsheet size={16} />{t.exportCsv}</button>
          <button className="btn-ghost ring-1 ring-slate-200 dark:ring-slate-700" onClick={() => fileRef.current.click()}><Upload size={16} />{t.importJson}</button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={doImport} />
        </div>
        <h2 className="font-bold pt-2">{t.theme} / {t.language}</h2>
        <div className="flex gap-2">
          <select className="input" value={settings.theme} onChange={(e) => set({ theme: e.target.value })}><option value="light">{t.light}</option><option value="dark">{t.dark}</option></select>
          <select className="input" value={settings.lang} onChange={(e) => set({ lang: e.target.value })}>{LANGS.map(([c, n]) => <option key={c} value={c}>{n}</option>)}</select>
        </div>
      </section>
    </div>
  );
}
