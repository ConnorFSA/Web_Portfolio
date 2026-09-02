import type { Project } from '../../types/project.types';
import NameTag from '../generic/NameTag';

interface ProjectMetadataCardProps {
  project: Project;
}

function ProjectMetadataCard({ project }: ProjectMetadataCardProps) {
  const startDate = project.start_date ? String(project.start_date) : null;
  const endDate = project.end_date ? String(project.end_date) : 'Ongoing';
  const hasCategories = project.categories.length > 0;
  const hasLanguages = project.languages.length > 0;
  const hasType = Boolean(project.type);
  const hasTools = project.tools.length > 0;
  const hasUrl = Boolean(project.url);

  return (
    <section className="section-panel project-metadata-card">
      <dl className="project-metadata-list">
        <div className="project-metadata-column">
          {startDate && (
            <div className="project-metadata-detail project-metadata-detail--inline">
              <dt>Start date</dt>
              <dd>{startDate}</dd>
            </div>
          )}

          {project.end_date || project.start_date ? (
            <div className="project-metadata-detail project-metadata-detail--inline">
              <dt>End date</dt>
              <dd>{endDate}</dd>
            </div>
          ) : null}

          {hasUrl && (
            <div className="project-metadata-detail project-metadata-detail--wide">
              <dt>URL</dt>
              <dd>
                <a className="project-link" href={project.url} target="_blank" rel="noreferrer">
                  {project.url}
                </a>
              </dd>
            </div>
          )}

          {hasType && (
            <div className="project-metadata-detail project-metadata-detail--wide">
              <dt>Type</dt>
              <dd><NameTag tag={project.type ?? 'Unknown'} /></dd>
            </div>
          )}
        </div>

        <div className="project-metadata-column">
          {hasCategories && (
            <div className="project-metadata-detail project-metadata-detail--wide">
              <dt>Categories</dt>
              <dd className="metadata-tags">
                {project.categories.map((cat, index) => (
                  <NameTag key={index} tag={cat.category} />
                ))}
              </dd>
            </div>
          )}

          {hasLanguages && (
            <div className="project-metadata-detail project-metadata-detail--wide">
              <dt>Languages</dt>
              <dd className="metadata-tags">
                {project.languages.map((lang, index) => (
                  <NameTag key={index} tag={lang.language} svgIcon={lang.image_url} />
                ))}
              </dd>
            </div>
          )}

          {hasTools && (
            <div className="project-metadata-detail project-metadata-detail--wide">
              <dt>Tools</dt>
              <dd className="metadata-tags">
                {project.tools.map((tool, index) => (
                  <NameTag key={index} tag={tool.tool} svgIcon={tool.image_url} />
                ))}
              </dd>
            </div>
          )}
        </div>
      </dl>
    </section>
  );
}

export default ProjectMetadataCard;
