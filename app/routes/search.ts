import { createFromSource } from 'fumadocs-core/search/server';
import { source } from '@/lib/source';

const server = createFromSource(source, {
  language: 'english',
  // Orama has no Khmer (`km`) tokenizer, so map it to the English analyzer.
  // Khmer pages stay searchable; tokenization just uses the default splitter.
  localeMap: {
    km: { language: 'english' },
  },
});

export async function loader() {
  return server.staticGET();
}
