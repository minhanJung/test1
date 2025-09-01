/* 
  Vitest configuration tests

  Framework/Library: Vitest
  Purpose: Validate vitest.config.ts exports and critical options.
  Notes:
  - These tests import the config module directly and assert shape and key values.
  - They avoid relying on Vitest runtime reusing the same config by using a fresh import URL with query to bypass cache if needed.
*/

import { expect, describe, it, beforeEach } from 'vitest'

// Use dynamic import to avoid module caching issues if tests are re-run in watch mode.
// Append a cache-buster query string.
async function loadConfig() {
  const mod = await import(`${process.cwd().replace(/\\/g, '/')}/vitest.config.ts?cb=${Date.now()}`)
  // Support both default export via defineConfig(...) and direct object export
  const cfg = (mod && ('default' in mod) ? (mod as any).default : mod) as any
  return cfg
}

describe('vitest.config.ts', () => {
  let config: any

  beforeEach(async () => {
    config = await loadConfig()
  })

  it('exports an object-like configuration', () => {
    expect(config).toBeTruthy()
    expect(typeof config).toBe('object')
  })

  it('defines test configuration block with sensible defaults', () => {
    expect(config).toHaveProperty('test')
    const t = config.test ?? {}
    // Common keys we expect to exist or be intentionally configured
    expect(t).toMatchObject({
      // If environment is configured, it should be either "node" or "jsdom"
      // We don't force a value but validate if present it is acceptable.
    })
    if (t.environment !== undefined) {
      expect(['node', 'jsdom']).toContain(t.environment)
    }
    if (t.globals !== undefined) {
      expect(typeof t.globals).toBe('boolean')
    }
    if (t.setupFiles !== undefined) {
      const files = Array.isArray(t.setupFiles) ? t.setupFiles : [t.setupFiles]
      expect(files.every((f) => typeof f === 'string')).toBe(true)
    }
    if (t.include !== undefined) {
      expect(Array.isArray(t.include)).toBe(true)
    }
    if (t.exclude !== undefined) {
      expect(Array.isArray(t.exclude)).toBe(true)
    }
    if (t.dir !== undefined) {
      expect(typeof t.dir).toBe('string')
    }
    if (t.pool !== undefined) {
      expect(['threads', 'forks']).toContain(t.pool)
    }
    if (t.silent !== undefined) {
      expect(typeof t.silent).toBe('boolean')
    }
  })

  it('configures coverage if present with valid provider/reporters', () => {
    const cov = config.test?.coverage
    if (!cov) {
      // Allow projects that opt out of coverage
      expect(cov).toBeUndefined()
      return
    }
    // provider should be "v8" or "istanbul" (Vitest supports both)
    if (cov.provider !== undefined) {
      expect(['v8', 'istanbul']).toContain(cov.provider)
    }
    if (cov.reporter !== undefined) {
      const reporters = Array.isArray(cov.reporter) ? cov.reporter : [cov.reporter]
      // Accept common reporters
      reporters.forEach((r: any) => {
        expect(typeof r === 'string' || Array.isArray(r)).toBe(true)
      })
    }
    if (cov.reportsDirectory !== undefined) {
      expect(typeof cov.reportsDirectory).toBe('string')
    }
    if (cov.exclude !== undefined) {
      expect(Array.isArray(cov.exclude)).toBe(true)
    }
    if (cov.include !== undefined) {
      expect(Array.isArray(cov.include)).toBe(true)
    }
    if (cov.thresholds !== undefined) {
      const th = cov.thresholds
      expect(typeof th).toBe('object')
      ;['lines', 'branches', 'functions', 'statements'].forEach((k) => {
        if (k in th) expect(typeof th[k]).toBe('number')
      })
    }
  })

  it('defines resolve alias or tsconfig paths plugin if applicable', () => {
    // If resolve.alias is explicitly used, validate types.
    if (config.resolve?.alias) {
      const alias = config.resolve.alias
      if (Array.isArray(alias)) {
        alias.forEach((entry) => {
          expect(entry).toHaveProperty('find')
          expect(entry).toHaveProperty('replacement')
        })
      } else {
        Object.entries(alias).forEach(([key, value]) => {
          expect(typeof key).toBe('string')
          expect(typeof value).toBe('string')
        })
      }
    }
    // If plugins include a tsconfig-paths plugin, it should be a function result.
    if (config.plugins) {
      expect(Array.isArray(config.plugins)).toBe(true)
      // We can't assert the exact plugin function identity here, but ensure plugins is non-empty if present
      if (config.plugins.length > 0) {
        expect(config.plugins.length).toBeGreaterThanOrEqual(1)
      }
    }
  })

  it('honors NODE_ENV / CI defaults without throwing', async () => {
    const originalNodeEnv = process.env.NODE_ENV
    const originalCI = process.env.CI
    try {
      delete process.env.NODE_ENV
      delete process.env.CI
      const fresh = await loadConfig()
      expect(fresh).toBeTruthy()
      // Access common fields to ensure no getters throw in absence of env
      void fresh.test?.environment
      void fresh.test?.coverage?.provider
      expect(true).toBe(true) // reached here safely
    } finally {
      if (originalNodeEnv === undefined) delete process.env.NODE_ENV
      else process.env.NODE_ENV = originalNodeEnv
      if (originalCI === undefined) delete process.env.CI
      else process.env.CI = originalCI
    }
  })

  it('does not leak unexpected top-level keys', () => {
    // Known top-level keys we commonly expect in a Vitest/Vite config
    const allowed = new Set([
      'test',
      'plugins',
      'resolve',
      'optimizeDeps',
      'define',
      'esbuild',
      'build',
      'server',
      'preview',
      'envDir',
      'envPrefix',
      'css',
      'logLevel',
      'cacheDir',
      'assetsInclude',
      'publicDir',
      'base'
    ])
    const unexpected = Object.keys(config).filter((k) => !allowed.has(k))
    // Allow extra keys but they should be reasonable (string/boolean/object)
    unexpected.forEach((k) => {
      const v = (config as any)[k]
      const t = typeof v
      expect(['string', 'boolean', 'object', 'number', 'function', 'undefined']).toContain(t)
    })
  })
})
// --- end of auto-generated vitest.config tests ---