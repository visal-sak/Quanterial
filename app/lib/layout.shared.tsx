import { useId } from 'react';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

function LogoOrb({ size = 22 }: { size?: number }) {
  // Unique per render so multiple orbs (sidebar + mobile nav) don't
  // collide on the same gradient id — which would leave the fill empty.
  const gid = `orb-${useId().replace(/:/g, '')}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label={`${appName} logo`}
      style={{ flex: '0 0 auto' }}
    >
      <defs>
        <radialGradient id={gid} cx="36%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#bfdbfe" />
          <stop offset="40%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill={`url(#${gid})`} />
      <ellipse cx="11.5" cy="10.5" rx="5.5" ry="3.6" fill="#ffffff" opacity="0.55" />
    </svg>
  );
}

function Logo({ tagline }: { tagline?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <LogoOrb size={tagline ? 26 : 22} />
      <span style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <span style={{ fontWeight: 700, color: 'var(--color-fd-foreground)' }}>
          {appName}
        </span>
        {tagline && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 400,
              color: 'var(--color-fd-muted-foreground)',
            }}
          >
            Learn by doing with {appName}
          </span>
        )}
      </span>
    </span>
  );
}

export function baseOptions(opts?: { tagline?: boolean }): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: <Logo tagline={opts?.tagline} />,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
