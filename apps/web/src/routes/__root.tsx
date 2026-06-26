import { HeadContent, Link, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { AppProviders } from '../components/AppProviders'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'CafeZoe | Pet content with character' },
      {
        name: 'description',
        content: 'CafeZoe helps pet people turn photos, memories, and quirks into social posts and stories.',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AppProviders>
          <header className="site-header">
            <Link to="/" className="brand-mark">
              <span className="brand-dot" />
              CafeZoe
            </Link>
            <nav>
              <Link to="/app" activeProps={{ className: 'is-active' }}>
                Studio
              </Link>
              <Link to="/login" search={{ redirect: undefined }} activeProps={{ className: 'is-active' }}>
                Login
              </Link>
            </nav>
          </header>
          {children}
        </AppProviders>
        <Scripts />
      </body>
    </html>
  )
}
