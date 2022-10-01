import Image from 'next/image'
interface FooterProps {

}

const Footer = (props: FooterProps) => {
    return (<footer className='bg-gray-800 mt-3 p-4 text-white'>
      <div className="grid sm:grid-cols-1 sm:min-w-fit lg:grid-cols-3 my-1">
        <div className="justfy-start py-6 lg:col-span-2 align-middle">
          © {new Date().getFullYear()}, Hecho con <a href="https://nextjs.org/">NextJS</a>
          &nbsp; + &nbsp;<a href="https://netlify.com/">Netlify</a>&nbsp; y
          &nbsp; <a href="https://www.contentlayer.dev/">ContentLayer</a>
        </div>

        <div className='text-center md:justify-end my-4'>
          <div>Si algo de lo que lees aquí te resulta útil, puedes invitarme un café :D</div>
          <div className='text-center mt-1'>
            <a href="https://www.buymeacoffee.com/icampana" target="_blank" rel="noreferrer">
              <picture className='inline-block'>
                <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width={217} height={60} />
              </picture>
            </a>
          </div>
        </div>
      </div>
  </footer>);
}

export default Footer;