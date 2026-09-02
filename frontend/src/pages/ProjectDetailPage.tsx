import { useParams } from 'react-router-dom';
import ProjectBlockRenderer from '../components/projects/ProjectBlockRenderer.tsx';
import ProjectMetadataCard from '../components/projects/ProjectMetadataCard.tsx';
import './ProjectDetailPage.css';
import './PageLayout.css';
import TitleBanner from '../components/generic/TitleBanner.tsx';

import { useProjectDetail } from '../hooks/useProjectDetail.ts';

function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { project, loading, error } = useProjectDetail(slug ?? '');

  if (!slug) return <p>Project identifier null or invalid</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error... {error.message}</p>;
  if (!project) return <p>Project not found</p>;

  return (
    <div className="page page--project-detail">
      <div className="content-spacing content-spacing--hero">
        <TitleBanner
          title={project.name}
          subtitle={project.summary}
          imageUrl={project.thumbnail.url}
          imageAlt={project.thumbnail.alt_text}
        />
      </div>

      <div className="content-spacing">
        <ProjectMetadataCard project={project} />
      </div>

      <ProjectBlockRenderer blocks={project.blocks} />
    </div>
  );
}

export default ProjectDetailPage;