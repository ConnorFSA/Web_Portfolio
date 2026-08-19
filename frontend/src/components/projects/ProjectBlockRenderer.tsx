import type * as ProjectTypes from '../../types/project.types';
import TitleBanner from '../generic/TitleBanner';
import ImageCarousel from '../generic/ImageCarousel';

interface ProjectBlockRendererProps {
  blocks: ProjectTypes.ProjectBlock[];
}

function ProjectBlockRenderer({ blocks }: ProjectBlockRendererProps) {
  return (
    <>
      {blocks.map((block) => {
        switch (block.type) {
          case 'description':
            return (
              <div key={block.id} className="description-container">
                <TitleBanner description={block.config.text} />
              </div>
            );
          case 'carousel':
            return (
              <div key={block.id} className="carousel-container">
                <ImageCarousel images={block.config.images ?? []} />
              </div>
            );
          default:
            return (
              <div key={block.id} className="project-block-unknown">
                <p>Unsupported content block: {block.type}</p>
              </div>
            );
        }
      })}
    </>
  );
}

export default ProjectBlockRenderer;
