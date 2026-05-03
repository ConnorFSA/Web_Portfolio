import { useParams } from 'react-router-dom';
import NameTag from "../components/generic/NameTag.tsx";
import "./ProjectDetailPage.css";
import ImageCarousel from '../components/generic/ImageCarousel.tsx';
import TitleBanner from '../components/generic/TitleBanner.tsx';

import { useProjectDetail } from "../hooks/useProjectDetail.ts";

function ProjectDetailPage() {

  const { slug } = useParams<{ slug: string }>();

  if (!slug) return <p>Project identifier null or invalid</p>;

  const { project, loading, error } = useProjectDetail(slug);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error... {error.message}</p>;
  if (!project) return <p>Project not found</p>;

  project

  { console.log(project.descriptions) };
  return (
    <div>
      <TitleBanner title={project.name} subtitle={project.summary} imageUrl={project.thumbnail.url} imageAlt={project.thumbnail.alt_text} />

      {project.descriptions.map((desc) => (
        <div className="description-container">
          <TitleBanner description={desc.description} />
        </div>
      ))}

      <div className="carousel-container">
        <ImageCarousel images={project.images} />
      </div>

      <div className="meta-card-row">
        <section className="meta-card">
          <h3>Categories</h3>
          <div className="tag-row">
            {project.categories.map((cat, index) => (
              <NameTag key={index} tag={cat.category} />
            ))}
          </div>
        </section>

        <section className="meta-card">
          <h3>Languages</h3>
          <div className="tag-row">
            {project.languages.map((lang, index) => (
              <NameTag key={index} tag={lang.language} svgIcon={lang.image_url} />
            ))}
          </div>
        </section>
      </div>

      <div className="project-type-card">
        <p>Type</p>
        <NameTag tag={project.type} />
      </div>
    </div>
  )
}

export default ProjectDetailPage;