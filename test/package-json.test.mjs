/**
 * Tests for package.json (focus on PR changes to dependencies/scripts).
 * Testing framework: Node's built-in test runner (node:test) + node:assert/strict.
 * No external testing libraries are introduced to keep repository lean and consistent.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const pkgPath = path.join(process.cwd(), 'package.json');
const pkgRaw = await fs.readFile(pkgPath, 'utf8');
let pkg;
test('package.json should be valid JSON', () => {
  assert.doesNotThrow(() => { pkg = JSON.parse(pkgRaw); }, 'package.json must parse as valid JSON');
});

describe('package.json: top-level fields', () => {
  test('basic metadata', () => {
    assert.equal(pkg.name, 'my-v0-project', 'name should match project slug');
    assert.equal(pkg.private, true, 'private should be true');
    assert.match(pkg.version, /^\d+\.\d+\.\d+$/, 'version should be strict semver (e.g., 0.1.0)');
  });
});

describe('package.json: scripts', () => {
  test('required scripts exist with expected commands', () => {
    const s = pkg.scripts ?? {};
    // Ensure presence
    for (const key of ['build','dev','lint','start','test']) {
      assert.ok(typeof s[key] === 'string' && s[key].trim().length > 0, `scripts.${key} should exist and be non-empty`);
    }
    // Exact values (aligns with Next.js project defaults and PR expectations)
    assert.equal(s.build, 'next build');
    assert.equal(s.dev, 'next dev');
    assert.equal(s.lint, 'next lint');
    assert.equal(s.start, 'next start');
    assert.equal(s.test, 'node --test');
  });
});

function isVersionStringAcceptable(v) {
  // Accept: "latest" (only for whitelisted packages), or semver-like patterns such as:
  // "1", "^1", "1.2", "~1.2", "1.2.3", "^1.2.3", "~1.2.3", with optional pre-release
  return v === 'latest' || /^(?:\^|~)?\d+(?:\.\d+){0,2}(?:-[0-9A-Za-z.-]+)?$/.test(v);
}
function majorOf(v) {
  const m = String(v).match(/\d+/);
  return m ? Number(m[0]) : NaN;
}

describe('package.json: dependencies', () => {
  const allowedLatest = new Set([
    '@radix-ui/react-radio-group',
    '@radix-ui/react-slider',
    '@radix-ui/react-tabs',
  ]);

  test('dependencies object exists and versions look valid', () => {
    assert.ok(pkg.dependencies && typeof pkg.dependencies === 'object', 'dependencies should be an object');
    for (const [name, ver] of Object.entries(pkg.dependencies)) {
      assert.ok(isVersionStringAcceptable(ver), `Dependency "${name}" has an invalid version string "${ver}"`);
      if (ver === 'latest') {
        assert.ok(allowedLatest.has(name), `"${name}" should not use "latest" (only allowed for a small whitelist)`);
      }
    }
  });

  test('critical runtime packages pinned to expected majors', () => {
    const deps = pkg.dependencies;
    // Next.js should be on v15.x (exact pin preferred)
    assert.ok(deps.next, 'next must be present');
    assert.match(deps.next, /^\d+\.\d+\.\d+$/, 'next should be pinned to exact x.y.z (no ^ or ~)');
    assert.equal(majorOf(deps.next), 15, 'next major should be 15');

    // React 19 alignment
    assert.equal(majorOf(deps.react), 19, 'react major should be 19');
    assert.equal(majorOf(deps['react-dom']), 19, 'react-dom major should be 19');

    // Spot-check several other key libs
    if (deps['date-fns']) assert.equal(majorOf(deps['date-fns']), 4, 'date-fns major should be 4');
    if (deps.recharts) assert.equal(majorOf(deps.recharts), 2, 'recharts major should be 2');
    if (deps['lucide-react']) assert.equal(majorOf(deps['lucide-react']), 0, 'lucide-react major should be 0');
    if (deps.zod) assert.equal(majorOf(deps.zod), 3, 'zod major should be 3');
  });
});

describe('package.json: devDependencies', () => {
  test('devDependencies exist and majors align', () => {
    assert.ok(pkg.devDependencies && typeof pkg.devDependencies === 'object', 'devDependencies should be an object');
    const dev = pkg.devDependencies;

    if (dev.typescript) assert.equal(majorOf(dev.typescript), 5, 'TypeScript major should be 5');
    if (dev.postcss) assert.equal(majorOf(dev.postcss), 8, 'PostCSS major should be 8');
    if (dev.tailwindcss) assert.equal(majorOf(dev.tailwindcss), 3, 'Tailwind CSS major should be 3');

    if (dev['@types/node']) assert.ok(majorOf(dev['@types/node']) >= 18, '@types/node should target a modern Node major (>=18)');
    if (dev['@types/react']) assert.equal(majorOf(dev['@types/react']), 19, '@types/react major should be 19');
    if (dev['@types/react-dom']) assert.equal(majorOf(dev['@types/react-dom']), 19, '@types/react-dom major should be 19');

    // All devDependency versions should be acceptable semver-like strings
    for (const [name, ver] of Object.entries(dev)) {
      assert.ok(isVersionStringAcceptable(ver), `Dev dependency "${name}" has an invalid version string "${ver}"`);
    }
  });

  test('no overlap between dependencies and devDependencies', () => {
    const deps = new Set(Object.keys(pkg.dependencies ?? {}));
    const dev = new Set(Object.keys(pkg.devDependencies ?? {}));
    const overlap = [...deps].filter((d) => dev.has(d));
    assert.deepEqual(overlap, [], `Packages should not appear in both dependencies and devDependencies: ${overlap.join(', ')}`);
  });
});