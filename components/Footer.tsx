import Image from 'next/image'
interface FooterProps {

}

const Footer = (props: FooterProps) => {
    return (<footer className='bg-gray-800 mt-3 p-4 text-white'>
      <div>
        <a href="https://www.buymeacoffee.com/icampana" target="_blank" rel="noreferrer">
          <Image src={"https://cdn.buymeacoffee.com/buttons/v2/default-red.png"} alt="Buy Me A Coffee" width={217} height={60} layout="fixed" />
        </a>
      </div>
      <p>
        © {new Date().getFullYear()}, Hecho con <a href="https://nextjs.org/">NextJS</a> +<a href="https://netlify.com/">Netlify</a> y <a href="https://www.contentlayer.dev/">ContentLayer</a>
      </p>
  </footer>);
}

export default Footer;