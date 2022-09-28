import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo';
import meta from 'metadata.json';

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

function MyApp({ Component, pageProps }: AppProps) {
  const { site } = meta;

  return (<>
    <DefaultSeo
      openGraph={{
        type: 'website',
        locale: 'es',
        url: site.siteUrl,
        site_name: site.title,
      }}
      twitter={{
        handle: `@${site.social.twitter}`,
        site: '@site',
        cardType: 'summary_large_image',
      }}
    />
    <Component {...pageProps} />
  </>);
}

export default MyApp
