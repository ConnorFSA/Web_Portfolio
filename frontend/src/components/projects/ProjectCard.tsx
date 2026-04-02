import { Link } from 'react-router-dom';
import type { ProjectBrief } from "../../types/project.types.ts";
import NameTag from "../generic/NameTag.tsx";
import "./ProjectCard.css";

function ProjectCard({ project }: { project: ProjectBrief }) {
  return (
    <Link to={`/projects/${project.slug}`} className="project-card-link">
      <div className="card">
        <img
          className="thumbnail-image"
          src={project.thumbnail.url}
          alt={project.thumbnail.alt_text}
        />

        <div className="details">
          <h4 className="project-name">{project.name}</h4>
          <p className="project-summary">{project.summary}</p>

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
      </div>
    </Link>
  );
}

export default ProjectCard;