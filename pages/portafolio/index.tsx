import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import BioCard from 'components/BioCard';
import meta from 'metadata.json';
import { NextSeo } from 'next-seo';
import Footer from 'components/Footer';
import Header from 'components/Header';

import { allProjects, Project } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';

export async function getStaticProps() {
  const projects: Project[] = allProjects.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  );

  return { props: { projects } };
}

const Portfolio: NextPage<{ projects: Project[] }> = (props) => {
  const { site } = meta;
  const { projects } = props;
  return (
    <div className='container mx-auto'>
      <Head>
        <title>Home | {site.title}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <NextSeo
        title={site.title}
        description={site.description}
        canonical={site.siteUrl}
      />

      <main className='max-w-6xl mx-auto'>
        <Header topLevel={true}>
          <BioCard />
        </Header>

        <div className='px-2'>
          <h2 className='mb-2 grow text-xl font-bold'>Portafolio</h2>
          <div className='mx-auto py-3 grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {projects.map((project, idx) => (
              <div key={idx}>
                <h3 className='text-lg font-bold'>{project.title}</h3>
                <Image
                  src={project.galleryImage?.[0] || "/images/placeholder.png"}
                  alt={project.title}
                  placeholder="blur"
                  height={200}
                  width={320}
                  blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0SeuuBwADoQGm9h5VIAAAAABJRU5ErkJggg=='
                  style={{ objectFit: 'scale-down', overflow: 'hidden' }}
                />
                <p>{project.description}</p>
                <div>
                  {project.techStack?.map((tag, idx) => (
                    <span
                      key={idx}
                      className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mt-1 mb-1'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Portfolio;
