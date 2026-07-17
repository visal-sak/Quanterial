import type { Route } from './+types/home';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Link } from 'react-router';
import { BookOpen, Github } from 'lucide-react';
import { baseOptions } from '@/lib/layout.shared';
import { Button } from '@/components/ui/button';
import { gitConfig } from '@/lib/shared';
import { AmeroHero } from '@/components/amero-hero/demo';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Quanterial' },
    {
      name: 'description',
      content:
        'Learn by doing with Quanterial — bite-sized lessons, hands-on practice, and adaptive learning paths.',
    },
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
