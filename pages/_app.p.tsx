import Head from 'next/head';
import vhCheck from 'vh-check';
import Script from 'next/script';
import darkMode from './darkMode';
import NProgress from 'nprogress';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import { BlogLayout, AdminLayout } from 'components';
import { SessionProvider, SessionProviderProps } from 'next-auth/react';

import 'focus-visible/dist/focus-visible.min.js';
import 'styles/nprogress.css';
import 'styles/globals.css';

interface LayoutProps {
  children?: React.ReactNode;
}
function Layout({ children }: LayoutProps) {
  const router = useRouter();
  if (router.route.indexOf('/admin') === 0) {
    return <AdminLayout>{children}</AdminLayout>;
  }
  return <BlogLayout>{children}</BlogLayout>;
}
function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<Pick<SessionProviderProps, 'session'>>) {
  const router = useRouter();
  useEffect(() => {
    vhCheck();

    router.events.on('routeChangeStart', () => {
      NProgress.start();
    });
    router.events.on('routeChangeComplete', () => {
      NProgress.done();
    });
    router.events.on('routeChangeError', () => {
      NProgress.done();
    });

    return () => {
      // router.events.off('routeChangeComplete', handleRouteChange)
    };
  }, []);
  return (
    <SessionProvider session={session}>
      <Layout>
        <Head>
          <title>{process.env.title}</title>
        </Head>
        <Script id="darkMode" dangerouslySetInnerHTML={{ __html: darkMode }} />
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
