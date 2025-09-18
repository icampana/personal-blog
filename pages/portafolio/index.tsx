import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import BioCard from 'components/common/BioCard';
import meta from 'metadata.json';
import { NextSeo } from 'next-seo';
import Footer from 'components/Footer';
import Header from 'components/Header';

import ProjectCard from 'components/ProjectCard';

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
        <title>Portafolio | {site.title}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <NextSeo
        title={`Portafolio | ${site.title}`}
        description={site.description}
        canonical={`${site.siteUrl}/portafolio`}
      />

      <main className='max-w-6xl mx-auto'>
        <Header>
          <BioCard />
        </Header>

        <div className='px-2'>
          <h1 className='text-4xl font-bold text-center my-8'>Mi Trabajo</h1>
          <div className='mx-auto py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {projects.map((project, idx) => (
              <ProjectCard key={idx} project={project} />
            ))}
          </div>
        </div>

        <div className="text-center my-8">
          <a href="/content/sobre-el-autor" className="btn btn-primary btn-lg">
            Contáctame
          </a>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Portfolio;
