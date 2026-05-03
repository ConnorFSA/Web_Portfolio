import { Link } from 'react-router-dom';
import type { ProjectBrief } from "../../types/project.types.ts";
import NameTag from "../generic/NameTag.tsx";
import ImageLoader from "../generic/ImageLoader.tsx";
import "./ProjectCard.css";

function ProjectCard({ project }: { project: ProjectBrief }) {
  return (
    <Link to={`/projects/${project.slug}`} className="project-card-link">
      <div className="project-card">
        <ImageLoader
          src={project.thumbnail.url}
          alt={project.thumbnail.alt_text}
          className="thumbnail-image"
        />

        <div className="details">
          <h4 className="project-name">{project.name}</h4>
          <p className="project-summary">{project.summary}</p>

          <div className="meta-group">
            <div className="tag-section">
              <p className="tag-section-heading">Categories</p>
              <div className="tag-row">
                {project.categories.slice(0, 3).map((cat, index) => (
                  <NameTag key={index} tag={cat.category} size="sm" />
                ))}
              </div>
            </div>

            <div className="tag-section">
              <p className="tag-section-heading">Languages</p>
              <div className="tag-row">
                {project.languages.slice(0, 4).map((lang, index) => (
                  <NameTag key={index} tag={lang.language} svgIcon={lang.image_url} size="sm" />
                ))}
              </div>
            </div>

            <div className="tag-section tag-section--type">
              <p className="tag-section-heading">Type</p>
              <div className="tag-row">
                <NameTag tag={project.type?.type ?? 'Unknown'} size="sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;