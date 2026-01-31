import React, { useEffect, useState } from 'react';
import { useTina } from 'tinacms/dist/react';
import { formatDate } from '../utils/client';

interface TinaPreviewProps {
  query: string;
  variables: Record<string, unknown>;
  data: unknown;
}

export default function TinaPreview({
  query,
  variables,
  data,
}: TinaPreviewProps) {
  const { data: tinaData } = useTina({
    query,
    variables,
    data,
  });

  const [content, setContent] = useState<any>(tinaData);

  useEffect(() => {
    setContent(tinaData);
  }, [tinaData]);

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading preview...</h2>
        </div>
      </div>
    );
  }

  // Determine content type
  const isPost = content.posts || content.post;
  const isPage = content.pages || content.page;
  const isProject = content.projects || content.project;

  const item =
    content.posts ||
    content.post ||
    content.pages ||
    content.page ||
    content.projects ||
    content.project;

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No content to preview</h2>
        </div>
      </div>
    );
  }

  const renderPost = () => {
    const { title, description, featuredImage, tags, date, body } = item;
    const postDate = date ? new Date(date) : new Date();
    const imagePath = featuredImage?.startsWith('/')
      ? featuredImage
      : `/photos/${featuredImage}`;

    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Featured Image */}
        {featuredImage && (
          <div className="mb-8">
            <img
              src={imagePath}
              alt={title}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <time dateTime={postDate.toISOString()}>
              {formatDate(postDate)}
            </time>
          </div>

          {description && (
            <p className="text-lg text-gray-700 mb-6">{description}</p>
          )}

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string, index: number) => (
                <span key={index} className="badge badge-outline">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Post Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </div>
    );
  };

  const renderPage = () => {
    const { title, description, date, body } = item;
    const pageDate = date ? new Date(date) : new Date();

    return (
      <div className="max-w-4xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <time dateTime={pageDate.toISOString()}>
              {formatDate(pageDate)}
            </time>
          </div>

          {description && (
            <p className="text-lg text-gray-700 mb-6">{description}</p>
          )}
        </header>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </div>
    );
  };

  const renderProject = () => {
    const {
      title,
      description,
      galleryImage,
      techStack,
      liveUrl,
      repoUrl,
      date,
      body,
    } = item;
    const projectDate = date ? new Date(date) : new Date();

    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Project Images */}
        {galleryImage && galleryImage.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {galleryImage.map((img: string, index: number) => {
              const imgPath = img.startsWith('/') ? img : `/photos/${img}`;
              return (
                <img
                  key={index}
                  src={imgPath}
                  alt={`${title} - Image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg shadow-lg"
                />
              );
            })}
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <time dateTime={projectDate.toISOString()}>
              {formatDate(projectDate)}
            </time>
          </div>

          {description && (
            <p className="text-lg text-gray-700 mb-6">{description}</p>
          )}

          {techStack && techStack.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Tech Stack:</h3>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech: string, index: number) => (
                  <span key={index} className="badge badge-primary">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(liveUrl || repoUrl) && (
            <div className="flex gap-4">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  View Live
                </a>
              )}
              {repoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  View Code
                </a>
              )}
            </div>
          )}
        </header>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="preview-banner bg-primary text-primary-content p-2 text-center text-sm font-semibold">
        TinaCMS Preview Mode
      </div>
      {isPost && renderPost()}
      {isPage && renderPage()}
      {isProject && renderProject()}
    </div>
  );
}
