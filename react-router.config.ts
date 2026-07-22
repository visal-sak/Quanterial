import type { Config } from '@react-router/dev/config';
import { glob } from 'node:fs/promises';
import { createGetUrl, getSlugs } from 'fumadocs-core/source';

const getUrl = createGetUrl('/docs');

export default {
  ssr: false,
  async prerender({ getStaticPaths }) {
    const paths: string[] = [];
    const excluded: string[] = [];

    for (const path of getStaticPaths()) {
      if (!excluded.includes(path)) paths.push(path);
    }

    // Ensure the Khmer landing page is prerendered (falls back to English copy
    // where not translated). Guard against duplicates from getStaticPaths().
    if (!paths.includes('/km')) paths.push('/km');

    for await (const entry of glob('**/*.mdx', { cwd: 'content/docs' })) {
      // Normalize Windows backslashes so nested folders map to the right URL.
      const normalized = entry.replaceAll('\\', '/');
      // Skip locale-variant files (e.g. `qubit.km.mdx`) — they share the base
      // slug of their English counterpart, so we enumerate slugs once below.
      if (/\.km\.mdx$/.test(normalized)) continue;

      const slugs = getSlugs(normalized);
      // English routes.
      paths.push(getUrl(slugs), `/llms.mdx/docs/${[...slugs, 'content.md'].join('/')}`);
      // Khmer route — same slugs under the `/km` prefix (Khmer content when a
      // `*.km.mdx` translation exists, English fallback otherwise).
      paths.push(`/km${getUrl(slugs)}`);
    }

    return paths;
  },
} satisfies Config;
