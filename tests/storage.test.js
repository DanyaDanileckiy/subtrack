import test from 'node:test';
import assert from 'node:assert/strict';
globalThis.localStorage = { getItem: () => null, setItem() {} };
const { toCsv, validateImport } = await import('../src/lib/storage.js');
test('csv escapes and guards formulas', () => {
  const csv = toCsv([{ name: '=HACK()', price: 10, currency: 'USD', period: 'month', nextDate: '2030-01-01', category: 'ai', notes: 'a,"b"' }], 'USD', {});
  assert.ok(csv.includes(`"'=HACK()"`)); assert.ok(csv.includes('"a,""b"""')); assert.ok(csv.includes('120.00'));
});
test('import sanitizes link', () => { const [s] = validateImport([{ name: 'X', link: 'javascript:alert(1)' }]); assert.equal(s.link, ''); });
