import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from 'react-router';
import { RootProvider } from 'fumadocs-ui/provider/react-router';
import type { Route } from './+types/root';
import './app.css';
import SearchDialog from '@/components/search';
import NotFound from './routes/not-found';
import { provider } from '@/lib/i18n-ui';
import { localeFromPath, withLocale, type Lang } from '@/lib/i18n';

/**
 * Build the fumadocs i18n provider props for the active locale, wiring the
 * language switcher to navigate between the English (`/…`) and Khmer (`/km/…`)
 * versions of whatever page the user is currently on.
 */
function useI18nProps() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const locale = localeFromPath(pathname);
  return {
    ...provider(locale),
    onLocaleChange: (next: string) => {
      navigate(withLocale(pathname, next as Lang));
      // The language popover lives in the persistent layout, so client-side
      // navigation doesn't unmount it. Dismiss it once the choice is made —
      // Radix's Popover closes on Escape.
      if (typeof document !== 'undefined') {
        requestAnimationFrame(() => {
          document.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
          );
        });
      }
    },
  };
}

export const links: Route.LinksFunction = () => [
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Kantumruy+Pro:wght@100..700&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const i18n = useI18nProps();

  return (
    <html lang={localeFromPath(pathname)} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider search={{ SearchDialog }} i18n={i18n}>
          {children}
        </RootProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return <NotFound />;
    message = 'Error';
    details = error.statusText;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 w-full max-w-[1400px] mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
