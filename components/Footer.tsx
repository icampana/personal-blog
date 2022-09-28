interface FooterProps {

}

const Footer = (props: FooterProps) => {
    return (<footer className='bg-gray-800 mt-3 p-4 text-white'>
    © {new Date().getFullYear()}, Hecho con <a href="https://nextjs.org/">NextJS</a> +<a href="https://netlify.com/">Netlify</a> y <a href="https://www.contentlayer.dev/">ContentLayer</a>
  </footer>);
}

export default Footer;