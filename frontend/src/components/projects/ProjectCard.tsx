import { Link } from 'react-router-dom';
import type { ProjectBrief } from "../../types/project.types.ts";
import NameTag from "../generic/NameTag.tsx";
import ImageLoader from "../generic/ImageLoader.tsx";
import "./ProjectCard.css";

function formatDisplayDate(value: string | null | undefined) {
  if (!value) {
    return 'Unknown';
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-AU', {
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);
}

function formatDateRange(startDate: string | null | undefined, endDate: string | null | undefined) {
  const start = startDate ? formatDisplayDate(startDate) : 'Unknown';
  const end = endDate ? formatDisplayDate(endDate) : 'Ongoing';

  return `${start} — ${end}`;
}

function clampSummary(summary: string, maxLength = 180) {
  if (summary.length <= maxLength) {
    return summary;
  }

  return `${summary.slice(0, maxLength).trimEnd()}…`;
}

function ProjectCard({ project }: { project: ProjectBrief }) {
  const summary = clampSummary(project.summary ?? '');
  const languageItems = project.languages.map((lang) => ({
    label: lang.language,
    icon: lang.image_url,
  }));
  const categoryItems = project.categories.map((cat) => ({
    label: cat.category,
  }));

  const visibleLanguages = languageItems.slice(0, 6);
  const visibleCategories = categoryItems.slice(0, 6);
  const hasMoreLanguages = languageItems.length > visibleLanguages.length;
  const hasMoreCategories = categoryItems.length > visibleCategories.length;

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
          <p className="project-summary">{summary}</p>

          <div className="project-date-row">
            <span className="project-date-range">{formatDateRange(project.start_date, project.end_date)}</span>
          </div>

          <div className="tag-section tag-section--type">
            <p className="tag-section-heading">Type</p>
            <NameTag tag={project.type?.type ?? 'Unknown'} size="sm" className="project-type-tag" />
          </div>

          <div className="meta-group">
            <div className="tag-section">
              <p className="tag-section-heading">Languages</p>
              <div className="tag-row">
                {visibleLanguages.map((item, index) => (
                  <NameTag key={`${item.label}-${index}`} tag={item.label} svgIcon={item.icon} size="sm" />
                ))}
                {hasMoreLanguages && <NameTag tag="..." size="sm" className="more-tag" />}
              </div>
            </div>

            <div className="tag-section">
              <p className="tag-section-heading">Categories</p>
              <div className="tag-row">
                {visibleCategories.map((item, index) => (
                  <NameTag key={`${item.label}-${index}`} tag={item.label} size="sm" />
                ))}
                {hasMoreCategories && <NameTag tag="..." size="sm" className="more-tag" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;