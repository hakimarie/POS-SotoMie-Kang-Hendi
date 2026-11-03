import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const html = fs.readFileSync('index.html', 'utf8');
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
const serviceWorker = fs.readFileSync('sw.js', 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL:', message);
    process.exitCode = 1;
  } else {
    console.log('PASS:', message);
  }
}

const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .filter(source => source.trim().length > 0);

assert(scripts.length > 0, 'index.html contains an inline JavaScript application');
assert(manifest.display === 'standalone', 'PWA manifest uses standalone display');
assert(typeof manifest.start_url === 'string' && manifest.start_url.length > 0, 'PWA manifest has start_url');
assert(typeof manifest.scope === 'string' && manifest.scope.length > 0, 'PWA manifest has scope');

const appChecks = [
  ['local persistence', /localStorage/.test(html)],
  ['cash payment flow', /cash/i.test(html)],
  ['QRIS payment flow', /qris/i.test(html)],
  ['transaction void flow', /void/i.test(html)],
  ['backup and restore controls', /backup/i.test(html) && /restore/i.test(html)],
  ['PIN hashing implementation', /async function hashPin\s*\\(/.test(html)],
  ['PIN verification implementation', /async function verifyPin\s*\\(/.test(html)],
  ['persistent PIN throttling', /function readPinThrottle\s*\\(/.test(html) && /function writePinThrottle\s*\\(/.test(html)],
  ['service worker registration', /serviceWorker/.test(html)]
];
for (const [label, ok] of appChecks) assert(ok, label);

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'soto-kh-qa-'));
const files = scripts.map((source, index) => {
  const file = path.join(tempDir, `inline-${index}.js`);
  fs.writeFileSync(file, source);
  return file;
});
files.push(path.join(process.cwd(), 'sw.js'));

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    console.error('FAIL: JavaScript syntax check:', file);
    process.stderr.write(result.stderr || result.stdout || '');
    process.exitCode = 1;
  } else {
    console.log('PASS: JavaScript syntax:', path.basename(file));
  }
}

if (process.exitCode) process.exit(process.exitCode);
console.log('Static QA completed. Browser/device behavior is not covered by this workflow.');
