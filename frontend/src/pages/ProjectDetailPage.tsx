import { useParams } from 'react-router-dom';
import NameTag from "../components/generic/NameTag.tsx";
import "./ProjectDetailPage.css";

import { useProjectDetail } from "../hooks/useProjectDetail.ts";

function ProjectDetailPage() {

  const { slug } = useParams<{ slug: string }>();

  if (!slug) return <p>Project identifier null or invalid</p>;

  const { project, loading, error } = useProjectDetail(slug);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error... {error.message}</p>;
  if (!project) return <p>Project not found</p>;

  project

  {console.log(project.descriptions)};
  return (
    <div>
      <img
        className="thumbnail-image"
        src={project.thumbnail.url}
        alt={project.thumbnail.alt_text}
      />

      <h1>{project.name}</h1>
      <p>{project.summary}</p>

      <div>
        {project.images.map((image, index)=>(
          <img
            className="project-image"
            src={image.image}
            alt={image.alt_text}
          />
        ))};
      </div>

      {project.descriptions.map((desc) => (
        <p>{desc.description}</p>
      ))}

      <div className="meta-group">
        <div className="categories-list">
          <p>Categories</p>
          <div className="tag-row">
            {project.categories.slice(0, 3).map((cat, index) => (
              <NameTag key={index} tag={cat.category} />
            ))}
          </div>
        </div>

        <div className="languages-list">
          <p>Languages</p>
          <div className="tag-row">
            {project.languages.slice(0, 4).map((lang, index) => (
              <NameTag key={index} tag={lang.language} svgIcon={lang.image_url} />
            ))}
          </div>
        </div>

        <div className="project-type">
          <p>Type</p>
          <NameTag tag={project.type?.type ?? 'Unknown'} />
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailPage;