import type { Route } from './+types/home';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Link } from 'react-router';
import { BookOpen, Github } from 'lucide-react';
import { baseOptions } from '@/lib/layout.shared';
import { Button } from '@/components/ui/button';
import { gitConfig } from '@/lib/shared';
import { AmeroHero } from '@/components/amero-hero/demo';
import { localeFromPath, withLocale, type Lang } from '@/lib/i18n';

// Per-locale copy for the landing page.
const HOME_CONTENT = {
  en: {
    title: 'Quanterial',
    description:
      'Learn by doing with Quanterial — bite-sized lessons, hands-on practice, and adaptive learning paths.',
    hero: {
      headingTop: 'Learn by doing with',
      headingBottom: 'Quanterial',
      subtitle: 'Guides, core concepts, and hands-on lessons to get you started.',
      phrases: [
        'What is a qubit?',
        'How do learning paths work?',
        'Superposition, explained',
        'Getting started guide',
        'Quantum gates basics',
      ],
    },
    docs: 'Docs',
    github: 'GitHub',
  },
  km: {
    title: 'Quanterial',
    description:
      'រៀនតាមរយៈការអនុវត្តជាមួយ Quanterial — មេរៀនខ្លីៗ ការអនុវត្តផ្ទាល់ដៃ និងផ្លូវសិក្សាដែលបត់បែនតាមអ្នក។',
    hero: {
      headingTop: 'រៀនតាមរយៈការអនុវត្តជាមួយ',
      headingBottom: 'Quanterial',
      subtitle: 'មគ្គុទ្ទេសក៍ គោលគំនិតស្នូល និងមេរៀនផ្ទាល់ដៃ ដើម្បីជួយអ្នកចាប់ផ្ដើម។',
      phrases: [
        'តើ qubit ជាអ្វី?',
        'តើផ្លូវសិក្សាដំណើរការយ៉ាងណា?',
        'ការពន្យល់អំពី Superposition',
        'មគ្គុទ្ទេសក៍ចាប់ផ្ដើម',
        'មូលដ្ឋាន Quantum gates',
      ],
    },
    docs: 'ឯកសារ',
    github: 'GitHub',
  },
} satisfies Record<Lang, unknown>;

export function loader({ request }: Route.LoaderArgs) {
  return { lang: localeFromPath(new URL(request.url).pathname) };
}

export function meta({ location }: Route.MetaArgs) {
  const lang: Lang = localeFromPath(location.pathname);
  const c = HOME_CONTENT[lang];
  const url = 'https://quanterial.vercel.app/';
  const image = 'https://quanterial.vercel.app/images/og/og.png';

  return [
    { title: c.title },
    { name: 'description', content: c.description },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Quanterial' },
    { property: 'og:title', content: c.title },
    { property: 'og:description', content: c.description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1548' },
    { property: 'og:image:height', content: '932' },
    { property: 'og:image:alt', content: 'Quanterial — Learn by doing' },
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: c.title },
    { name: 'twitter:description', content: c.description },
    { name: 'twitter:image', content: image },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const lang = loaderData.lang;
  const c = HOME_CONTENT[lang];
  const docsHref = withLocale('/docs', lang);

  return (
    <HomeLayout {...baseOptions()}>
      <AmeroHero
        text={c.hero}
        actions={
          <div className="flex flex-wrap items-center justify-center gap-2 px-4">
            <Button asChild size="sm">
              <Link to={docsHref}>
                <BookOpen />
                {c.docs}
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a
                href={`https://github.com/${gitConfig.user}/${gitConfig.repo}`}
                target="_blank"
                rel="noreferrer"
              >
                <Github />
                {c.github}
              </a>
            </Button>
          </div>
        }
      />
    </HomeLayout>
  );
}