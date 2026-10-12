import test from 'node:test';
import assert from 'node:assert/strict';
import { DICTS, LANGS, KEYS } from '../src/lib/i18n.js';
import { PRESETS } from '../src/lib/presets.js';
test('30 languages, all keys non-empty', () => {
  assert.equal(LANGS.length, 30);
  for (const [c] of LANGS) for (const k of KEYS) assert.ok(DICTS[c][k]?.trim(), `${c}.${k}`);
});
test('70 presets, unique names', () => { assert.equal(PRESETS.length, 70); assert.equal(new Set(PRESETS.map((p) => p.name)).size, 70); });
