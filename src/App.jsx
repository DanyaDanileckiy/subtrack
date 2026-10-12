import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutDashboard, List, Settings as SettingsIcon, Plus, Pencil, Trash2, Moon, Sun, X, Bell, Download, Upload, RefreshCw, CalendarClock, Search, Wallet } from 'lucide-react';
import { DICTS } from './lib/i18n.js';
import { CURRENCIES, convert, monthlyCost, nextCharge, daysUntil, totals, formatMoney, fmtISO } from './lib/money.js';
import { PRESETS, CATEGORIES, COLORS } from './lib/presets.js';
import { load, save, exportJson, validateImport } from './lib/storage.js';
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
  const t = DICTS[settings.lang] || DICTS.ru;
  const locale = settings.lang === 'en' ? 'en-US' : 'ru-RU';
  const rates = useMemo(() => {
    const m = {}; for (const [k, v] of Object.entries(settings.manualRates || {})) if (Number(v) > 0) m[k] = Number(v);
    return { ...rateInfo.rates, ...m };
  }, [rateInfo, settings.manualRates]);
  const fmt = (v, c) => formatMoney(v, c, locale);

  useEffect(() => { save(subs, settings); }, [subs, settings]);
  useEffect(() => { document.documentElement.classList.toggle('dark', settings.theme === 'dark'); document.documentElement.lang = settings.lang; }, [settings.theme, settings.lang]);
  const refreshRates = () => fetchRates().then(setRateInfo).catch(() => setRateInfo(loadCachedRates()));
  useEffect(() => { refreshRates(); }, []);
  useEffect(() => {
    const run = () => syncReminders(subs, Number(settings.remindDays) || 0, (s, date) => ({
      title: `${t.notifTitle}: ${s.name}`,
      body: t.notifBody(s.name, fmt(Number(s.price), s.currency), new Date(date).toLocaleDateString(locale, { day: 'numeric', month: 'long' })),
    }));
    run(); const i = setInterval(run, 3600e3); return () => clearInterval(i);
  }, [subs, settings.remindDays, settings.lang]);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };
  const upsert = (s) => { setSubs((p) => (p.some((x) => x.id === s.id) ? p.map((x) => (x.id === s.id ? s : x)) : [...p, s])); setEditing(null); };
  const remove = (id) => { if (confirm(t.confirmDelete)) { setSubs((p) => p.filter((x) => x.id !== id)); setEditing(null); } };
  const set = (patch) => setSettings((s) => ({ ...s, ...patch }));

  const tabs = [['dashboard', t.dashboard, LayoutDashboard], ['subs', t.subs, List], ['settings', t.settings, SettingsIcon]];
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
          <button className="btn-ghost !px-2" onClick={() => set({ lang: settings.lang === 'ru' ? 'en' : 'ru' })} title={t.language}>{settings.lang === 'ru' ? 'EN' : 'RU'}</button>
          <button className="btn-ghost !px-2" onClick={() => set({ theme: settings.theme === 'dark' ? 'light' : 'dark' })} title={t.theme}>{settings.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
          <span className="hidden sm:block"><button className="btn-primary" onClick={() => setEditing({})}><Plus size={16} />{t.add}</button></span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5">
        {tab === 'dashboard' && <Dashboard {...{ subs, settings, rates, t, fmt, locale, setEditing }} />}
        {tab === 'subs' && <SubList {...{ subs, settings, rates, t, fmt, locale, setEditing }} />}
        {tab === 'settings' && <SettingsView {...{ subs, setSubs, settings, set, t, rateInfo, refreshRates, flash, locale }} />}
      </main>

      <button className="sm:hidden fixed right-4 bottom-20 z-30 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-xl flex items-center justify-center" onClick={() => setEditing({})} aria-label={t.add}><Plus /></button>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 flex" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {tabs.map(([id, label, I]) => (
          <button key={id} onClick={() => setTab(id)} className={`flex-1 py-2.5 flex flex-col items-center text-xs gap-0.5 ${tab === id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}><I size={20} />{label}</button>
        ))}
      </nav>

      {editing && <Editor sub={editing} t={t} onSave={upsert} onDelete={remove} onClose={() => setEditing(null)} base={settings.base} />}
      {toast && <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm px-4 py-2 rounded-xl shadow-lg">{toast}</div>}
    </div>
  );
}

function Avatar({ s, size = 44 }) {
  return <div className="rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-sm" style={{ background: s.color, width: size, height: size, fontSize: size * 0.36 }}>{s.icon || s.name?.[0]}</div>;
}

function periodLabel(s, t) {
  if (s.period === 'week') return t.perWeek;
  if (s.period === 'year') return t.perYearS;
  if (s.period === 'custom') return ` / ${s.customCount} ${t[{ day: 'day', week: 'weekU', month: 'monthU', year: 'yearU' }[s.customUnit]]}`;
  return t.perMonthS;
}
function whenLabel(iso, t, locale) {
  const d = daysUntil(iso);
  const date = new Date(iso + 'T00:00').toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  return { rel: d === 0 ? t.today : d === 1 ? t.tomorrow : t.inDays(d), date, d };
}

function Dashboard({ subs, settings, rates, t, fmt, locale, setEditing }) {
  const active = subs.filter((s) => s.active !== false);
  const { monthly, yearly } = totals(subs, settings.base, rates);
  const upcoming = active.map((s) => ({ s, date: nextCharge(s) })).filter((x) => x.date && daysUntil(x.date) <= 30).sort((a, b) => a.date.localeCompare(b.date));
  const byCat = {};
  for (const s of active) byCat[s.category || 'other'] = (byCat[s.category || 'other'] || 0) + convert(monthlyCost(s), s.currency, settings.base, rates);
  const cats = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const catColors = { video: '#ef4444', music: '#10b981', cloud: '#0ea5e9', ai: '#8b5cf6', work: '#64748b', social: '#06b6d4', games: '#f59e0b', news: '#f97316', health: '#84cc16', other: '#a855f7' };
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

      {subs.length === 0 && <Presets t={t} setEditing={setEditing} />}

      <div className="grid md:grid-cols-5 gap-4">
        <section className="card p-4 md:col-span-3">
          <h2 className="font-bold flex items-center gap-2 mb-3"><CalendarClock size={18} className="text-indigo-500" />{t.upcoming}</h2>
          {upcoming.length === 0 && <p className="text-sm text-slate-500 py-6 text-center">{t.noUpcoming}</p>}
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {upcoming.map(({ s, date }) => { const w = whenLabel(date, t, locale); return (
              <li key={s.id} className="py-2.5 flex items-center gap-3 cursor-pointer" onClick={() => setEditing(s)}>
                <Avatar s={s} size={38} />
                <div className="flex-1 min-w-0"><div className="font-semibold truncate">{s.name}</div><div className="text-xs text-slate-500">{w.date}</div></div>
                <div className="text-right"><div className="font-semibold">{fmt(Number(s.price), s.currency)}</div>
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
        </section>
      </div>
    </div>
  );
}

function Presets({ t, setEditing }) {
  return (
    <section className="card p-4">
      <p className="text-sm text-slate-500 mb-3">{t.empty}</p>
      <h2 className="font-bold mb-3">{t.presets}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {PRESETS.map((p) => (
          <button key={p.name} onClick={() => setEditing({ ...p, preset: true })} className="flex items-center gap-2 p-2 rounded-xl ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 text-left transition">
            <Avatar s={p} size={32} /><span className="text-sm font-medium truncate">{p.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function SubList({ subs, settings, rates, t, fmt, locale, setEditing }) {
  const [q, setQ] = useState(''); const [sort, setSort] = useState('date');
  const list = subs.filter((s) => s.name.toLowerCase().includes(q.toLowerCase())).map((s) => ({ s, date: nextCharge(s), m: convert(monthlyCost(s), s.currency, settings.base, rates) }));
  list.sort((a, b) => sort === 'price' ? b.m - a.m : sort === 'name' ? a.s.name.localeCompare(b.s.name) : (a.date || '9').localeCompare(b.date || '9'));
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1"><Search size={16} className="absolute left-3 top-2.5 text-slate-400" /><input className="input !pl-9" placeholder={t.search} value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select className="input !w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="date">{t.sortDate}</option><option value="price">{t.sortPrice}</option><option value="name">{t.sortName}</option>
        </select>
      </div>
      {subs.length === 0 && <Presets t={t} setEditing={setEditing} />}
      <div className="grid sm:grid-cols-2 gap-3">
        {list.map(({ s, date, m }) => (
          <div key={s.id} className={`card p-4 flex items-center gap-3 ${s.active === false ? 'opacity-60' : ''}`}>
            <Avatar s={s} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{s.name}</div>
              <div className="text-xs text-slate-500">{t.cat[s.category] || s.category} · {date ? whenLabel(date, t, locale).date : '—'}{s.active === false ? ` · ${t.paused}` : ''}</div>
            </div>
            <div className="text-right">
              <div className="font-bold">{fmt(Number(s.price), s.currency)}<span className="text-xs font-normal text-slate-500">{periodLabel(s, t)}</span></div>
              {s.currency !== settings.base || s.period !== 'month' ? <div className="text-xs text-slate-500">≈ {fmt(m, settings.base)}{t.perMonthS}</div> : null}
            </div>
            <button className="btn-ghost !p-2" onClick={() => setEditing(s)} aria-label={t.edit}><Pencil size={16} /></button>
          </div>
        ))}
      </div>
      {subs.length > 0 && <details className="card p-4"><summary className="cursor-pointer font-semibold">{t.presets}</summary><div className="mt-3"><PresetsGrid setEditing={setEditing} /></div></details>}
    </div>
  );
}
function PresetsGrid({ setEditing }) {
  return <div className="flex flex-wrap gap-2">{PRESETS.map((p) => <button type="button" key={p.name} onClick={() => setEditing({ ...p, preset: true })} className="flex items-center gap-2 pr-3 rounded-xl ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-indigo-400 text-sm"><Avatar s={p} size={28} />{p.name}</button>)}</div>;
}

function Editor({ sub, t, onSave, onDelete, onClose, base }) {
  const isNew = !sub.id;
  const [f, setF] = useState({ name: '', price: '', currency: base, period: 'month', customCount: 3, customUnit: 'month', nextDate: fmtISO(new Date()), category: 'other', color: COLORS[0], icon: '', active: true, ...sub });
  const u = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const submit = (e) => { e.preventDefault(); if (!f.name.trim()) return; const { preset, ...rest } = f; onSave({ ...rest, id: f.id || crypto.randomUUID(), price: Number(f.price) || 0, icon: f.icon || f.name.trim()[0].toUpperCase() }); };
  return (
    <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-5 max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <Avatar s={{ ...f, icon: f.icon || f.name[0] || '?' }} />
          <h2 className="font-bold text-lg flex-1">{isNew ? t.add : t.edit}</h2>
          <button type="button" className="btn-ghost !p-2" onClick={onClose}><X size={18} /></button>
        </div>
        {isNew && !sub.preset && <div className="mb-4"><div className="label">{t.presets}</div><PresetsGrid setEditing={(p) => setF({ ...f, ...p })} /></div>}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><label className="label">{t.name}</label><input className="input" required value={f.name} onChange={u('name')} autoFocus /></div>
          <div><label className="label">{t.price}</label><input className="input" type="number" step="0.01" min="0" required value={f.price} onChange={u('price')} /></div>
          <div><label className="label">{t.currency}</label><select className="input" value={f.currency} onChange={u('currency')}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label">{t.period}</label><select className="input" value={f.period} onChange={u('period')}>{['week', 'month', 'year', 'custom'].map((p) => <option key={p} value={p}>{t[p]}</option>)}</select></div>
          <div><label className="label">{t.nextDate}</label><input className="input" type="date" value={f.nextDate || ''} onChange={u('nextDate')} /></div>
          {f.period === 'custom' && <div className="col-span-2 flex items-center gap-2 text-sm"><span>{t.every}</span><input className="input !w-20" type="number" min="1" value={f.customCount} onChange={u('customCount')} />
            <select className="input !w-auto" value={f.customUnit} onChange={u('customUnit')}>{[['day', 'day'], ['week', 'weekU'], ['month', 'monthU'], ['year', 'yearU']].map(([v, k]) => <option key={v} value={v}>{t[k]}</option>)}</select></div>}
          <div><label className="label">{t.category}</label><select className="input" value={f.category} onChange={u('category')}>{CATEGORIES.map((c) => <option key={c} value={c}>{t.cat[c]}</option>)}</select></div>
          <div><label className="label">{t.icon}</label><input className="input" maxLength={3} value={f.icon} onChange={u('icon')} placeholder={f.name[0] || '★'} /></div>
          <div className="col-span-2"><label className="label">{t.color}</label><div className="flex flex-wrap gap-2">{COLORS.concat(sub.color && !COLORS.includes(sub.color) ? [sub.color] : []).map((c) => (
            <button type="button" key={c} onClick={() => setF({ ...f, color: c })} className={`w-8 h-8 rounded-full ring-offset-2 dark:ring-offset-slate-900 ${f.color === c ? 'ring-2 ring-indigo-500' : ''}`} style={{ background: c }} />))}
            <input type="color" value={f.color} onChange={u('color')} className="w-8 h-8 rounded-full overflow-hidden cursor-pointer" /></div></div>
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

function SettingsView({ subs, setSubs, settings, set, t, rateInfo, refreshRates, flash, locale }) {
  const fileRef = useRef();
  const [perm, setPerm] = useState('default');
  useEffect(() => { permissionState().then(setPerm).catch(() => {}); }, []);
  const doImport = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    try { const obj = JSON.parse(await file.text()); const list = validateImport(obj); setSubs(list); if (obj.settings) set({ ...obj.settings }); flash(t.importOk + list.length); }
    catch { flash(t.importErr); } e.target.value = '';
  };
  const used = [...new Set([settings.base, ...subs.map((s) => s.currency)])].filter((c) => c !== 'USD');
  const status = rateInfo.source === 'online' ? `${t.ratesOnline}: ${new Date(rateInfo.time).toLocaleString(locale)}` : rateInfo.source === 'cached' ? `${t.ratesCached} ${new Date(rateInfo.time).toLocaleString(locale)}` : t.ratesFallback;
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <section className="card p-4 space-y-3">
        <h2 className="font-bold">{t.rates}</h2>
        <div><label className="label">{t.baseCurrency}</label><select className="input" value={settings.base} onChange={(e) => set({ base: e.target.value })}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select></div>
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
          <button className="btn-ghost ring-1 ring-slate-200 dark:ring-slate-700" onClick={() => fileRef.current.click()}><Upload size={16} />{t.importJson}</button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={doImport} />
        </div>
        <h2 className="font-bold pt-2">{t.theme} / {t.language}</h2>
        <div className="flex gap-2">
          <select className="input" value={settings.theme} onChange={(e) => set({ theme: e.target.value })}><option value="light">{t.light}</option><option value="dark">{t.dark}</option></select>
          <select className="input" value={settings.lang} onChange={(e) => set({ lang: e.target.value })}><option value="ru">Русский</option><option value="en">English</option></select>
        </div>
      </section>
    </div>
  );
}
