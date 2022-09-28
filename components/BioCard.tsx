import Image from 'next/image'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faPodcast } from '@fortawesome/free-solid-svg-icons';
import meta from 'metadata.json';

 import Logo from '../public/images/profile-pic.jpg'

 const BioCard = () => {

   const { author, social } = meta.site;
   return (
     <div className="grid sm:grid-cols-1 sm:min-w-fit lg:grid-cols-3 my-5">
       <div className="flex justfy-start my-4 lg:col-span-2">
         <div className='mr-5'>
            <Image src={Logo} alt={author} className="rounded-full" layout='fixed' width='50' height={50} />
         </div>
         <div className='float-right'>
           Escrito por <strong>{author}</strong> <br />Informático, Emprendedor, Desarrollador y Curioso a tiempo completo.
         </div>
       </div>
       <div className='flex justify-around md:justify-end my-4'>
         <a href={`https://twitter.com/${social.twitter}`} className="shadow-none hover:text-xl">
           <FontAwesomeIcon icon={ faTwitter }  size='1x' />
         </a>
         &nbsp;
         <a href={`https://github.com/${social.github}`} className="shadow-none hover:text-xl">
           <FontAwesomeIcon icon={ faGithub }  size='1x' />
         </a>
         &nbsp;
         <a href={`https://linkedin.com/in/${social.linkedin}`} className="shadow-none hover:text-xl">
           <FontAwesomeIcon icon={ faLinkedin }  size='1x' />
         </a>
         &nbsp;
         <a href={`https://anchor.fm/${social.anchor}`} className="shadow-none hover:text-xl">
           <FontAwesomeIcon icon={ faPodcast }  size='1x' />
         </a>
       </div>
     </div>
   );
 }

 export default BioCard;
