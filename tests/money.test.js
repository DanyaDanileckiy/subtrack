import test from 'node:test';
import assert from 'node:assert/strict';
import { convert, monthlyCost, nextCharge, totals, addPeriod } from '../src/lib/money.js';
test('convert', () => { assert.equal(convert(90, 'RUB', 'USD', { RUB: 90 }), 1); assert.equal(convert(5, 'EUR', 'EUR'), 5); });
test('monthly cost', () => { assert.ok(Math.abs(monthlyCost({ price: 120, period: 'year' }) - 10) < 1e-9); assert.ok(Math.abs(monthlyCost({ price: 30, period: 'custom', customCount: 3, customUnit: 'month' }) - 10) < 1e-9); });
test('next charge rolls forward', () => {
  assert.equal(nextCharge({ nextDate: '2026-01-31', period: 'month' }, new Date(2026, 2, 5)), '2026-03-31');
  assert.equal(nextCharge({ nextDate: '2026-01-31', period: 'month' }, new Date(2026, 1, 2)), '2026-02-28');
  assert.equal(nextCharge({ nextDate: '2024-02-29', period: 'year' }, new Date(2025, 0, 1)), '2025-02-28');
  assert.equal(nextCharge({ nextDate: '2024-02-29', period: 'year' }, new Date(2027, 11, 1)), '2028-02-29');
  assert.equal(nextCharge({ nextDate: '2026-10-20', period: 'month' }, new Date(2026, 9, 12)), '2026-10-20');
});
test('totals', () => { const r = totals([{ price: 10, currency: 'USD', period: 'month' }, { price: 900, currency: 'RUB', period: 'month', active: false }], 'USD', { RUB: 90 }); assert.equal(r.monthly, 10); assert.equal(r.yearly, 120); });
test('add period clamps', () => { const d = addPeriod(new Date(2026, 0, 31), { period: 'month' }); assert.equal(d.getMonth(), 1); assert.equal(d.getDate(), 28); });
import { chargesBetween } from '../src/lib/money.js';
test('charges in a month', () => {
  assert.deepEqual(chargesBetween({ nextDate: '2026-10-05', period: 'week' }, new Date(2026, 9, 1), new Date(2026, 9, 31)), ['2026-10-05', '2026-10-12', '2026-10-19', '2026-10-26']);
  assert.deepEqual(chargesBetween({ nextDate: '2026-01-31', period: 'month' }, new Date(2026, 3, 1), new Date(2026, 3, 30)), ['2026-04-30']);
});
