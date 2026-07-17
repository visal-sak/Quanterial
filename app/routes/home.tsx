import type { Route } from './+types/home';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Link } from 'react-router';
import { BookOpen, Github } from 'lucide-react';
import { baseOptions } from '@/lib/layout.shared';
import { Button } from '@/components/ui/button';
import { gitConfig } from '@/lib/shared';
import { AmeroHero } from '@/components/amero-hero/demo';

export function meta({}: Route.MetaArgs) {
  const title = 'Quanterial';
  const description =
    'Learn by doing with Quanterial — bite-sized lessons, hands-on practice, and adaptive learning paths.';
  const url = 'https://quanterial.vercel.app/';
  const image = 'https://quanterial.vercel.app/images/og/og.png';

  return [
    { title },
    { name: 'description', content: description },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Quanterial' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1548' },
    { property: 'og:image:height', content: '932' },
    { property: 'og:image:alt', content: 'Quanterial — Learn by doing' },
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ];
}

export default function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="relative">
        <div className="absolute bottom-10 left-1/2 z-50 flex -translate-x-1/2 gap-2">
          <Button asChild size="sm">
            <Link to="/docs">
              <BookOpen />
              Docs
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a
              href={`https://github.com/${gitConfig.user}/${gitConfig.repo}`}
              target="_blank"
              rel="noreferrer"
            >
              <Github />
              GitHub
            </a>
          </Button>
        </div>
        <AmeroHero />
      </div>
    </HomeLayout>
  );
}
