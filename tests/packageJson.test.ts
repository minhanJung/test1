/**
 * Test framework note:
 * - This suite uses global describe/it/expect, compatible with Jest and Vitest (with globals enabled).
 * - No new dev dependencies are introduced.
 * - We read package.json via fs to avoid relying on resolveJsonModule.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type StringMap = Record<string, string>;

interface PackageJson {
  name: string;
  version: string;
  private?: boolean;
  scripts?: StringMap;
  dependencies?: StringMap;
  devDependencies?: StringMap;
}

function loadPackageJson(): PackageJson {
  const p = resolve(__dirname, "..", "package.json");
  const raw = readFileSync(p, "utf8");
  return JSON.parse(raw) as PackageJson;
}

const allowedLatest = new Set([
  "@radix-ui/react-radio-group",
  "@radix-ui/react-slider",
  "@radix-ui/react-tabs",
]);

// Accepts exact, ^ or ~ ranges with 1-3 numeric segments and optional prerelease
const semverLike = /^(?:\^|~)?\d+(?:\.\d+){0,2}(?:-[0-9A-Za-z-.]+)?$/;

function isValidVersionSpec(pkg: string, spec: string): boolean {
  if (spec === "latest") {
    return allowedLatest.has(pkg);
  }
  return semverLike.test(spec);
}

function majorFrom(spec?: string): number | null {
  if (!spec || spec === "latest") return null;
  const cleaned = spec.replace(/^[^\d]*/, ""); // strip ^ ~ etc
  const m = cleaned.match(/^\d+/);
  return m ? parseInt(m[0], 10) : null;
}

const expectedScripts: StringMap = {
  build: "next build",
  dev: "next dev",
  lint: "next lint",
  start: "next start",
};

// Full dependency expectations based on the provided diff/content.
const expectedDependencies: StringMap = {
  "@hookform/resolvers": "^3.9.1",
  "@radix-ui/react-accordion": "1.2.2",
  "@radix-ui/react-alert-dialog": "1.1.4",
  "@radix-ui/react-aspect-ratio": "1.1.1",
  "@radix-ui/react-avatar": "1.1.2",
  "@radix-ui/react-checkbox": "1.1.3",
  "@radix-ui/react-collapsible": "1.1.2",
  "@radix-ui/react-context-menu": "2.2.4",
  "@radix-ui/react-dialog": "1.1.4",
  "@radix-ui/react-dropdown-menu": "2.1.4",
  "@radix-ui/react-hover-card": "1.1.4",
  "@radix-ui/react-label": "2.1.1",
  "@radix-ui/react-menubar": "1.1.4",
  "@radix-ui/react-navigation-menu": "1.2.3",
  "@radix-ui/react-popover": "1.1.4",
  "@radix-ui/react-progress": "1.1.1",
  "@radix-ui/react-radio-group": "latest",
  "@radix-ui/react-scroll-area": "1.2.2",
  "@radix-ui/react-select": "2.1.4",
  "@radix-ui/react-separator": "1.1.1",
  "@radix-ui/react-slider": "latest",
  "@radix-ui/react-slot": "1.1.1",
  "@radix-ui/react-switch": "1.1.2",
  "@radix-ui/react-tabs": "latest",
  "@radix-ui/react-toast": "1.2.4",
  "@radix-ui/react-toggle": "1.1.1",
  "@radix-ui/react-toggle-group": "1.1.1",
  "@radix-ui/react-tooltip": "1.1.6",
  autoprefixer: "^10.4.20",
  "class-variance-authority": "^0.7.1",
  clsx: "^2.1.1",
  cmdk: "1.0.4",
  "date-fns": "4.1.0",
  "embla-carousel-react": "8.5.1",
  "input-otp": "1.4.1",
  "lucide-react": "^0.454.0",
  next: "15.4.5",
  "next-themes": "^0.4.4",
  react: "^19",
  "react-day-picker": "8.10.1",
  "react-dom": "^19",
  "react-hook-form": "^7.54.1",
  "react-resizable-panels": "^2.1.7",
  recharts: "2.15.0",
  sonner: "^1.7.1",
  "tailwind-merge": "^2.5.5",
  "tailwindcss-animate": "^1.0.7",
  vaul: "^0.9.6",
  zod: "^3.24.1",
};

const expectedDevDependencies: StringMap = {
  "@types/node": "^22",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  postcss: "^8.5",
  tailwindcss: "^3.4.17",
  typescript: "^5",
};

describe("package.json configuration", () => {
  const pkg = loadPackageJson();
  const deps = pkg.dependencies ?? {};
  const devDeps = pkg.devDependencies ?? {};

  it("has correct basic metadata", () => {
    expect(pkg.name).toBe("my-v0-project");
    expect(pkg.version).toBe("0.1.0");
    expect(pkg.private).toBe(true);
  });

  it("includes required scripts with expected commands", () => {
    expect(pkg.scripts).toBeDefined();
    for (const [k, v] of Object.entries(expectedScripts)) {
      expect(pkg.scripts?.[k]).toBe(v);
    }
  });

  it("has no duplicate entries between dependencies and devDependencies", () => {
    const d = new Set(Object.keys(deps));
    const dupes = Object.keys(devDeps).filter((k) => d.has(k));
    expect(dupes).toEqual([]);
  });

  it("only uses 'latest' on the explicit allowlist", () => {
    const latestPkgs = Object.entries(deps)
      .filter(([, v]) => v === "latest")
      .map(([k]) => k)
      .sort();

    const allowed = Array.from(allowedLatest).sort();
    expect(latestPkgs).toEqual(allowed);
  });

  it("uses valid version specs for all dependency and devDependency entries", () => {
    const all: [string, string][] = [
      ...Object.entries(deps),
      ...Object.entries(devDeps),
    ];
    const invalid = all.filter(([name, spec]) => !isValidVersionSpec(name, spec));
    expect(invalid).toEqual([]);
  });

  it("matches expected dependency versions for all provided packages", () => {
    for (const [name, version] of Object.entries(expectedDependencies)) {
      expect(deps[name]).toBeDefined();
      expect(deps[name]).toBe(version);
    }
  });

  it("matches expected devDependency versions for all provided packages", () => {
    for (const [name, version] of Object.entries(expectedDevDependencies)) {
      expect(devDeps[name]).toBeDefined();
      expect(devDeps[name]).toBe(version);
    }
  });

  it("aligns React major versions across runtime and types", () => {
    const reactMajor = majorFrom(deps["react"]);
    const reactDomMajor = majorFrom(deps["react-dom"]);
    const typesReactMajor = majorFrom(devDeps["@types/react"]);
    const typesReactDomMajor = majorFrom(devDeps["@types/react-dom"]);

    expect(reactMajor).toBe(19);
    expect(reactDomMajor).toBe(19);
    expect(typesReactMajor).toBe(19);
    expect(typesReactDomMajor).toBe(19);
  });

  it("uses Next.js 15.x and matches exact version from diff", () => {
    expect(deps["next"]).toBe("15.4.5");
    expect(majorFrom(deps["next"])).toBe(15);
  });

  it("pins critical ecosystem versions (TypeScript, PostCSS, Tailwind)", () => {
    expect(majorFrom(devDeps["typescript"])).toBe(5);
    expect(majorFrom(devDeps["postcss"])).toBe(8);
    expect(devDeps["tailwindcss"]).toMatch(/^(\^|~)?3(\.|$)/);
  });

  it("ensures commonly error-prone packages are exactly/semver pinned (no 'x' ranges)", () => {
    const scrutinize = [
      "date-fns",
      "recharts",
      "embla-carousel-react",
      "@radix-ui/react-select",
      "@radix-ui/react-popover",
      "clsx",
      "class-variance-authority",
      "lucide-react",
      "react-hook-form",
      "zod",
    ];
    for (const name of scrutinize) {
      const spec = deps[name];
      expect(spec).toBeDefined();
      expect(spec).not.toMatch(/[xX]|\*/); // disallow wildcard ranges
      expect(isValidVersionSpec(name, spec)).toBe(true);
    }
  });
});