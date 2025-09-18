import { Project } from 'contentlayer/generated';
import Image from 'next/image';

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <figure>
        <Image
          src={project.galleryImage?.[0] || '/images/placeholder.png'}
          alt={project.title}
          width={400}
          height={250}
          className="object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{project.title}</h2>
        <p>{project.description}</p>
        <div className="card-actions justify-start">
          {project.techStack?.map((tag, idx) => (
            <div key={idx} className="badge badge-outline">
              {tag}
            </div>
          ))}
        </div>
        <div className="card-actions justify-end">
          {project.liveUrl && (
            <a href={project.liveUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              Ver Proyecto
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
              Ver Código
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
