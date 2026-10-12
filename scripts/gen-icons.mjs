// Renders public/icon.svg into app icons: build/icon.png (Electron/Windows) and Android launcher + splash PNGs.
// Run: node scripts/gen-icons.mjs  (uses Playwright's Chromium, dev-only)
import { chromium } from 'playwright';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
const svg = readFileSync('public/icon.svg', 'utf8');
const inner = svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const GRAD = 'linear-gradient(135deg,#6366f1,#ec4899)';
const b = await chromium.launch(); const p = await b.newPage();
async function render(file, w, h, html) { await p.setViewportSize({ width: w, height: h }); await p.setContent(`<style>html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden}</style>${html}`); await p.screenshot({ path: file, omitBackground: true }); }
const full = (s) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${s}" height="${s}">${inner}</svg>`;
// glyph only (white card) for adaptive foreground and splash
const glyph = (s) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${s}" height="${s}">${inner.replace(/<rect[^>]*fill="url\(#g\)"\/>/, '')}</svg>`;
await render('build/icon.png', 512, 512, full(512));
const dens = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
for (const [d, k] of Object.entries(dens)) {
  const dir = `android/app/src/main/res/mipmap-${d}`;
  const L = Math.round(48 * k), F = Math.round(108 * k);
  await render(`${dir}/ic_launcher.png`, L, L, full(L));
  await render(`${dir}/ic_launcher_round.png`, L, L, `<div style="width:${L}px;height:${L}px;border-radius:50%;background:${GRAD};display:flex;align-items:center;justify-content:center">${glyph(Math.round(L * 0.9))}</div>`);
  await render(`${dir}/ic_launcher_foreground.png`, F, F, `<div style="width:${F}px;height:${F}px;display:flex;align-items:center;justify-content:center">${glyph(Math.round(F * 0.62))}</div>`);
}
for (const dir of readdirSync('android/app/src/main/res').filter((x) => x.startsWith('drawable'))) {
  const f = `android/app/src/main/res/${dir}/splash.png`; if (!existsSync(f)) continue;
  const [w, h] = execSync(`python3 -c "import struct;d=open('${f}','rb').read(24);print(*struct.unpack('>II',d[16:24]))"`).toString().trim().split(' ').map(Number);
  const s = Math.round(Math.min(w, h) * 0.32);
  await render(f, w, h, `<div style="width:${w}px;height:${h}px;background:${GRAD};display:flex;align-items:center;justify-content:center">${glyph(s)}</div>`);
}
await b.close(); console.log('icons ok');
