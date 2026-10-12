import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { nextCharge, daysUntil } from './money.js';

const native = () => Capacitor.isNativePlatform();
const SENT = 'subtrack.notified';

export async function requestPermission() {
  if (native()) { const r = await LocalNotifications.requestPermissions(); return r.display === 'granted'; }
  if (!('Notification' in window)) return false;
  return (await Notification.requestPermission()) === 'granted';
}

export async function permissionState() {
  if (native()) { const r = await LocalNotifications.checkPermissions(); return r.display; }
  return 'Notification' in window ? Notification.permission : 'denied';
}

export async function testNotification(title, body) {
  if (native()) {
    await LocalNotifications.schedule({ notifications: [{ id: 999999, title, body, schedule: { at: new Date(Date.now() + 2000) } }] });
  } else if ('Notification' in window && Notification.permission === 'granted') new Notification(title, { body, icon: './icon.svg' });
}

function hashId(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h) % 2000000000; }

/**
 * Android: (re)schedule exact local notifications at 10:00, `days` before each next charge.
 * Desktop/web: while app is running, fire a system notification once per charge when inside the window.
 */
export async function syncReminders(subs, days, fmt) {
  const list = subs.filter((s) => s.active !== false && s.nextDate);
  if (native()) {
    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length) await LocalNotifications.cancel({ notifications: pending.notifications.map((n) => ({ id: n.id })) });
      const notifications = [];
      for (const s of list) {
        let date = nextCharge(s);
        const [y, m, d] = date.split('-').map(Number);
        const at = new Date(y, m - 1, d - days, 10, 0, 0);
        if (at <= new Date()) continue;
        const { title, body } = fmt(s, date, 'charge');
        notifications.push({ id: hashId(s.id + date), title, body, schedule: { at, allowWhileIdle: true } });
      }
      for (const s of list.filter((x) => x.trialEnd)) {
        const [y, m, d] = s.trialEnd.split('-').map(Number);
        const at = new Date(y, m - 1, d - Math.max(1, days), 10, 0, 0);
        if (at <= new Date()) continue;
        const { title, body } = fmt(s, s.trialEnd, 'trial');
        notifications.push({ id: hashId(s.id + 'trial' + s.trialEnd), title, body, schedule: { at, allowWhileIdle: true } });
      }
      if (notifications.length) await LocalNotifications.schedule({ notifications });
    } catch (e) { console.warn('notif', e); }
    return;
  }
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  let sent = {}; try { sent = JSON.parse(localStorage.getItem(SENT)) || {}; } catch {}
  for (const s of list) {
    const date = nextCharge(s); const left = daysUntil(date);
    const key = s.id + '@' + date;
    if (left >= 0 && left <= days && !sent[key]) {
      const { title, body } = fmt(s, date, 'charge');
      new Notification(title, { body, icon: './icon.svg' });
      sent[key] = Date.now();
    }
    if (s.trialEnd) {
      const tl = daysUntil(s.trialEnd); const tk = s.id + '@trial@' + s.trialEnd;
      if (tl >= 0 && tl <= Math.max(1, days) && !sent[tk]) { const { title, body } = fmt(s, s.trialEnd, 'trial'); new Notification(title, { body, icon: './icon.svg' }); sent[tk] = Date.now(); }
    }
  }
  localStorage.setItem(SENT, JSON.stringify(sent));
}
