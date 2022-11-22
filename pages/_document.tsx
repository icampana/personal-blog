import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import Script from 'next/script'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    const propertyID = 'UA-275823-1';

    return (
      <Html lang='es'>
        <Head>
          <meta charSet="utf-8" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true' />
          <link href="https://fonts.googleapis.com/css2?family=Ubuntu&display=swap" rel="stylesheet" />
          <meta name="google-site-verification" content="b5jnO_8lDhyKJ6m0nMqj0ZD0DMuvGkgBA0JSwUTcTf8" />
        </Head>
        <body>
          <Main />
          <NextScript />

          {/* Global site tag (gtag.js) - Google Analytics */}
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${propertyID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${propertyID}');
            `}
          </Script>
        </body>
      </Html>
    )
  }
}

export default MyDocument