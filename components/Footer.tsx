import Image from "next/image"
interface FooterProps {

}

const Footer = (props: FooterProps) => {
    return (<footer className='bg-gray-800 mt-3 p-4 text-white'>
      <div className="grid sm:grid-cols-1 sm:min-w-fit lg:grid-cols-4 my-1">
        <div className="justify-start py-6 lg:col-span-2 align-middle text-center lg:text-left">
          © {new Date().getFullYear()}, Hecho con <a href="https://nextjs.org/">NextJS</a>
          &nbsp; + &nbsp;<a href="https://netlify.com/">Netlify</a>&nbsp; y
          &nbsp; <a href="https://www.contentlayer.dev/">ContentLayer</a>
        </div>

        <div className='text-center my-4'>
          <a href="https://www.codementor.io/@ivncampaanaranjo?refer=badge" target="_blank" rel="noreferrer">
            <picture className='inline-block'>
              <img src="https://www.codementor.io/m-badges/ivncampaanaranjo/find-me-on-cm-b.svg" alt="Codementor badge" />
            </picture>
          </a>
        </div>

        <div className='text-center md:justify-end my-4'>
          <div className='text-center mt-1'>
            <a href="https://www.buymeacoffee.com/icampana" target="_blank" rel="noreferrer">
              <picture className='inline-block'>
                <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width={217} height={60} />
              </picture>
            </a>
          </div>
          <div className='text-xs'>Si algo de lo que lees aquí te resulta útil, puedes invitarme un café :D</div>
        </div>
      </div>
  </footer>);
}

export default Footer;