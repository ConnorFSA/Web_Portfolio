import type * as ProjectTypes from '../../types/project.types';
import ImageCarousel from '../generic/ImageCarousel';

interface ProjectBlockRendererProps {
  blocks: ProjectTypes.ProjectBlock[];
}

// The ProjectBlockRenderer component takes an array of project blocks and renders them based on their type.
// currently supported types are basic text blocks and image carousel.
// unsupported types will render a placeholder message indicating the block type is unsupported.
function ProjectBlockRenderer({ blocks }: ProjectBlockRendererProps) {
  return (
    <>
      {blocks.map((block) => {
        switch (block.type) {
          case 'description': {
            const description = typeof block.config.text === 'string' ? block.config.text : '';
            return (
              <div key={block.id} className="content-spacing">
                <section className="section-panel project-text-block">
                  <div className="story-grid project-text-grid">
                    <p>{description}</p>
                  </div>
                </section>
              </div>
            );
          }
          case 'carousel': {
            const carouselImages = Array.isArray(block.config.images) ? block.config.images : [];
            return (
              <div key={block.id} className="content-spacing">
                <div className="project-carousel-block">
                  <ImageCarousel images={carouselImages} />
                </div>
              </div>
            );
          }
          default:
            return (
              <div key={block.id} className="content-spacing">
                <div className="project-block-unknown">
                  <p>Unsupported content block: {block.type}</p>
                </div>
              </div>
            );
        }
      })}
    </>
  );
}

export default ProjectBlockRenderer;
