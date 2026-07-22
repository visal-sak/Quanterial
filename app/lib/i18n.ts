import { defineI18n } from 'fumadocs-core/i18n';

// Supported UI/content languages. `en` is the default (unprefixed) locale,
// `km` (ខ្មែរ / Khmer) is served under the `/km` path prefix.
export const languages = ['en', 'km'] as const;
export type Lang = (typeof languages)[number];
export const defaultLanguage: Lang = 'en';

// Core i18n config consumed by the fumadocs `loader()` in `source.ts`.
// - `parser: 'dot'` → Khmer files are named `page.km.mdx` / `meta.km.json`.
// - `hideLocale: 'default-locale'` → English stays at `/docs`, Khmer at `/km/docs`.
// - `fallbackLanguage: 'en'` → any page without a Khmer translation renders the
//   English version, so the switcher works across the whole site immediately.
export const i18n = defineI18n({
  defaultLanguage,
  languages: [...languages],
  hideLocale: 'default-locale',
  fallbackLanguage: 'en',
});

/** Human-readable name shown in the language switcher. */
export const localeNames: Record<Lang, string> = {
  en: 'English',
  km: 'ខ្មែរ',
};

/**
 * Detect the active locale from a URL pathname.
 *
 * React Router's single-fetch requests loaders at `<path>.data` (e.g. `/km.data`,
 * `/km/docs/qubit.data`), so strip that suffix before matching — otherwise the
 * `/km` home loader would see `/km.data` and wrongly fall back to English.
 */
export function localeFromPath(pathname: string): Lang {
  const p = pathname.replace(/\.data$/, '');
  return p === '/km' || p.startsWith('/km/') ? 'km' : 'en';
}

/** Strip a leading `/km` locale prefix, returning the locale-agnostic path. */
export function stripLocale(pathname: string): string {
  if (pathname === '/km') return '/';
  if (pathname.startsWith('/km/')) return pathname.slice(3);
  return pathname;
}

/** Rewrite a pathname to a target locale (respecting `hideLocale`). */
export function withLocale(pathname: string, target: Lang): string {
  const base = stripLocale(pathname);
  if (target === 'en') return base;
  return base === '/' ? '/km' : `/km${base}`;
}