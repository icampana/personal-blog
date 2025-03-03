import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faLinkedin,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';
import { faPodcast } from '@fortawesome/free-solid-svg-icons';
import meta from 'metadata.json';

import Logo from '../public/images/profile-pic.jpg';

const BioCard = () => {
  const { author, social } = meta.site;
  return (
    <div className='grid sm:grid-cols-1 sm:min-w-fit lg:grid-cols-3 my-5'>
      <div className='flex justfy-start my-4 lg:col-span-2'>
        <div className='mr-5'>
          <div className='avatar'>
            <div className='w-24 rounded'>
              <Image
                src={Logo}
                alt={author}
                className='rounded-full'
                width='50'
                height='50'
              />
            </div>
          </div>
        </div>
        <div className='float-right'>
          Escrito por <strong>{author}</strong> <br />
          Informático, Emprendedor, Desarrollador y Curioso a tiempo completo.
        </div>
      </div>

      <div className='flex justify-around md:justify-end my-4'>
        <a
          href={`https://twitter.com/${social.twitter}`}
          className='btn btn-link'
          aria-label='Twitter Profile'>
          <FontAwesomeIcon icon={faTwitter} size='1x' />
        </a>
        &nbsp;
        <a
          href={`https://github.com/${social.github}`}
          className='btn btn-link'
          aria-label='Github Profile'>
          <FontAwesomeIcon icon={faGithub} size='1x' />
        </a>
        &nbsp;
        <a
          href={`https://linkedin.com/in/${social.linkedin}`}
          className='btn btn-link'
          aria-label='Linkedin Profile'>
          <FontAwesomeIcon icon={faLinkedin} size='1x' />
        </a>
        &nbsp;
        <a
          href={`https://anchor.fm/${social.anchor}`}
          className='btn btn-link'
          aria-label='Podcast Link'>
          <FontAwesomeIcon icon={faPodcast} size='1x' />
        </a>
      </div>
    </div>
  );
};

export default BioCard;
