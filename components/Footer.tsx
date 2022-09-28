import Script from 'next/script'

interface FooterProps {

}

const Footer = (props: FooterProps) => {
    const propertyID = 'UA-275823-1';
    return (<footer className='bg-gray-800 mt-3 p-4 text-white'>
    © {new Date().getFullYear()}, Hecho con <a href="https://nextjs.org/">NextJS</a> +<a href="https://netlify.com/">Netlify</a> y <a href="https://www.contentlayer.dev/">ContentLayer</a>

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
  </footer>);
}

export default Footer;