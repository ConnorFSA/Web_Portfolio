import { NavLink, useParams } from 'react-router-dom';
import { useProjectDetail } from '../hooks/useProjectDetail';
import { useEffect, useState } from 'react';
import { getToken } from '../api/admin';
import { getProjectOptions } from '../api/admin';
import PopupMenu from '../components/generic/PopupMenu';
import CarouselEditor from '../components/projects/CarouselEditor';
import type { ProjectBlock, ProjectImage } from '../types/project.types';
import type { ProjectOptions } from '../api/admin';
import ProjectMetadataEditor from '../components/admin/ProjectMetadataEditor';
import ImageAltEditor from '../components/admin/ImageAltEditor';
import './AdminProjectEdit.css';
import './AdminDashboard.css';

type ImageRecord = ProjectImage & { pk_image?: number | string };

function getImageId(image: ImageRecord) {
  return Number(image.id ?? image.pk_image);
}

function getCarouselImages(block: ProjectBlock, images: ProjectImage[]) {
  if (block.type !== 'carousel') {
    return [];
  }

  const imageList = Array.isArray(block.config.images) ? block.config.images : [];
  const imageIds: Array<number | string> = block.config.image_ids
    ?? imageList.map((image: ImageRecord) => getImageId(image))
    ?? [];
  const imageById = new Map(images.map((image) => [getImageId(image), image]));

  return imageIds
    .map((imageId: number | string) => imageById.get(Number(imageId)))
    .filter((image: ProjectImage | undefined): image is ProjectImage => Boolean(image));
}


// This editor manages the project structure, content blocks, and image metadata in
// one place so the admin workflow remains coherent and easy to maintain.
function AdminProjectEdit() {
  const { slug } = useParams<{ slug: string }>();
  const { project, loading, error } = useProjectDetail(slug ?? '');

  const [blocks, setBlocks] = useState<ProjectBlock[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<Error | null>(null);
  const [editingCarouselId, setEditingCarouselId] = useState<number | null>(null);
  const [editingMetadata, setEditingMetadata] = useState(false);
  const [editingImageAlt, setEditingImageAlt] = useState(false);
  const [options, setOptions] = useState<ProjectOptions | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);

  useEffect(() => {
    if (project) {
      setBlocks(project.blocks.slice().sort((a, b) => a.position - b.position));
      setImages(project.images);
    }
  }, [project]);

  if (!slug) return <p>Project identifier null or invalid</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error... {error.message}</p>;
  if (!project) return <p>Project not found</p>;

  const move = (index: number, direction: -1 | 1) => {
    // Reordering blocks is done locally before saving so the user can preview the
    // sequence without committing each intermediate step.
    if (!blocks) return;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const next = blocks.slice();
    const tmp = next[newIndex];
    next[newIndex] = next[index];
    next[index] = tmp;
    // reassign positions based on order (0-based or 1-based depending on backend)
    const updated = next.map((b, i) => ({ ...b, position: i + 1 }));
    setBlocks(updated);
  };

  const addBlock = async (type: string) => {
    setSaving(true);
    setSaveError(null);
    const newBlock = {
      id: Date.now(), // temporary id, backend will assign a real id
      type,
      project_id: project.id,
      position: blocks ? blocks.length + 1 : 1,
      config: type === 'description' ? { text: '' } : type === 'carousel' ? { images: [] } : {},
    };

    try {
      // Get the JWT token from sessionstorage and set the Authorization header if present
      const token = getToken();
      // create an object with the content type and authorization headers if the token is present
      // Record is a Typescript utility type that creates an object with string keys and string values
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      // send the POST request to the backend endpoint for creating a new component
      const response = await fetch(`/api/admin/projects/${project.id}/components`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newBlock),
      });

      if (!response.ok) {
        throw new Error(`Failed to create new block: ${response.statusText}`);
      }

      const createdBlock = await response.json();
      setBlocks((currentBlocks) => [...(currentBlocks || []), createdBlock]);
    } catch (error) {
      setSaveError(error as Error);
    } finally {
      setSaving(false);
    }
  };

  const updateCarouselImages = (blockId: number, imageIds: number[]) => {
    setBlocks((currentBlocks) => currentBlocks?.map((block) => (
      block.id === blockId
        ? { ...block, config: { ...block.config, image_ids: imageIds } }
        : block
    )) ?? null);
  };

  const openMetadataEditor = async () => {
    setSaveError(null);
    try {
      setOptions(options ?? await getProjectOptions());
      setEditingMetadata(true);
    } catch (loadError) {
      setSaveError(loadError as Error);
    }
  };

  const updateImage = (updatedImage: ProjectImage) => {
    setImages((current) => current.map((image) => image.id === updatedImage.id ? updatedImage : image));
    setBlocks((currentBlocks) => currentBlocks?.map((block) => {
      if (block.type !== 'carousel' || !Array.isArray(block.config.images)) return block;
      return {
        ...block,
        config: {
          ...block.config,
          images: block.config.images.map((image: ProjectImage) => (
            image.id === updatedImage.id ? updatedImage : image
          )),
        },
      };
    }) ?? null);
  };

  const deleteBlock = async (blockId: number) => {
    setSaving(true);
    setSaveError(null);
    try {
      const token = getToken();
      const headers: Record<string, string> ={
        'Content-Type': 'application/json',
        ...(token ? {Authorization: `Bearer ${token}`} : {})
      }

      const response = await fetch(`/api/admin/projects/${project.id}/components/${blockId}`, {
        method: 'DELETE',
        headers,
      });

      if (response.ok) {
        // Remove the deleted block from the local state
        // Filter out block with the given blockId or return null if blocks is null
        setBlocks((currentBlocks) => currentBlocks?.filter((b) => b.id !== blockId) || null);
      }
    } catch (error) {
      setSaveError(error as Error);
    } finally {
      setSaving(false);
    }
  }

  // Saves the updated blocks to the backend via PATCH request
  const handleSave = async () => {
    // Save is centralised here so the same payload structure is used for all block
    // updates and the admin cannot accidentally send partial or inconsistent data.
    if (!blocks || !project) return;
    // Set saving state and clear previous errors
    // saving state is used to disable the save button and show a loading indicator
    setSaving(true);
    setSaveError(null);
    // prepare the payload for the PATHCH request
    try {
      // Get the JWT token from sessionstorage and set the Authorization header if present
      const token = getToken();
      // create an object with the content type and authorization headers if the token is present
      // Record is a Typescript utility type that creates an object with string keys and string values
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      // create the payload for the PATCH request by mapping over the blocks and extracting the id, position and config properties
      const payload = blocks.map((b) => ({ id: b.id, position: b.position, config: b.config }));
      // send the PATHCH request to the backend endpoint for updating all components of the project
      const response = await fetch(`/api/admin/projects/${project.id}/components/updateall`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to save blocks: ${response.statusText}`);
      }
    } catch (error) {
      setSaveError(error as Error);
    // finally block is executed to reset the saving state
    } finally {
      setSaving(false);
    }
  };


  return (
    <main className="admin-edit-page">
      <header className="admin-edit-header">
        <NavLink className="admin-edit-back" to="/admin">Back to Admin dashboard</NavLink>
        <h1 className="admin-edit-title">Edit project</h1>
        <div className="admin-edit-actions">
          <button type="button" onClick={openMetadataEditor}>Edit project details</button>
          <button type="button" onClick={() => setEditingImageAlt(true)}>Edit image alt text</button>
        </div>
      </header>

      <section className="admin-edit-section" aria-labelledby="project-details-title">
        <h2 className="admin-edit-section-title" id="project-details-title">Project details</h2>
        <div className="admin-edit-summary">
          <img className="admin-edit-thumbnail" src={project.thumbnail.url} alt={project.thumbnail.alt_text} />
          <dl className="admin-edit-details">
            <div className="admin-edit-detail admin-edit-detail--wide">
              <dt>Name</dt>
              <dd>{project.name}</dd>
            </div>
            <div className="admin-edit-detail">
              <dt>Slug</dt>
              <dd>{project.slug}</dd>
            </div>
            <div className="admin-edit-detail">
              <dt>Type</dt>
              <dd>{project.type || 'Not set'}</dd>
            </div>
            <div className="admin-edit-detail admin-edit-detail--wide">
              <dt>Summary</dt>
              <dd>{project.summary || 'No summary provided.'}</dd>
            </div>
            <div className="admin-edit-detail">
              <dt>Start date</dt>
              <dd>{String(project.start_date || 'Not set')}</dd>
            </div>
            <div className="admin-edit-detail">
              <dt>End date</dt>
              <dd>{String(project.end_date || 'Present')}</dd>
            </div>
            <div className="admin-edit-detail admin-edit-detail--wide">
              <dt>Categories</dt>
              <dd className="admin-edit-tags">
                {project.categories.length > 0
                  ? project.categories.map((category) => <span className="admin-edit-tag" key={category.category}>{category.category}</span>)
                  : 'None'}
              </dd>
            </div>
            <div className="admin-edit-detail admin-edit-detail--wide">
              <dt>Languages</dt>
              <dd className="admin-edit-tags">
                {project.languages.length > 0
                  ? project.languages.map((language) => <span className="admin-edit-tag" key={language.language}>{language.language}</span>)
                  : 'None'}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="admin-edit-section" aria-labelledby="content-blocks-title">
        <h2 className="admin-edit-section-title" id="content-blocks-title">Content blocks</h2>
        <div className="admin-edit-blocks">
          {blocks && blocks.map((block, i) => (
            <article className="admin-edit-block" key={block.id}>
              <div className="admin-edit-block-header">
                <h3 className="admin-edit-block-label">{block.type}</h3>
                <span className="admin-edit-block-position">Position {block.position}</span>
              </div>
          
          {block.type === 'description' && (
            <textarea
              className="admin-edit-description"
              value={typeof block.config.text === 'string' ? block.config.text : ''}
              onChange={(event) => setBlocks((currentBlocks) => currentBlocks?.map((currentBlock) => (
                currentBlock.id === block.id
                  ? { ...currentBlock, config: { ...currentBlock.config, text: event.target.value } }
                  : currentBlock
              )) ?? null)}
            />
          )}

          {block.type === 'carousel' && (
            <>
              <div className="admin-edit-carousel-preview" aria-label="Carousel image preview">
                {getCarouselImages(block, images).length > 0
                  ? getCarouselImages(block, images).map((image: ProjectImage) => (
                    <img className="admin-edit-carousel-thumb" key={image.id} src={image.image} alt={image.alt_text} />
                  ))
                  : <p className="admin-edit-empty">No images in this carousel.</p>}
              </div>
              <button type="button" onClick={() => setEditingCarouselId(block.id)}>
                Edit carousel images
              </button>
            </>
          )}

              <div className="admin-edit-block-actions">
                <button type="button" onClick={() => deleteBlock(block.id)}>Delete</button>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0}>Position up</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === blocks.length - 1}>Position down</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="admin-edit-actions admin-edit-section">
        <button type="button" onClick={() => {addBlock('description');}}>Add text block</button>
        <button type="button" onClick={() => {addBlock('carousel');}}>Add image block</button>
      </div>

      <div className="admin-edit-actions">
        <button type="button" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
        {saveError && <p className="admin-status admin-status--error">Save error: {saveError.message}</p>}
      </div>

      <PopupMenu
        isOpen={editingCarouselId !== null}
        title="Edit carousel images"
        onClose={() => setEditingCarouselId(null)}
      >
        {editingCarouselId !== null && (() => {
          const carousel = blocks?.find((block) => block.id === editingCarouselId);
          if (!carousel || carousel.type !== 'carousel') return null;
          const imageList = Array.isArray(carousel.config.images) ? carousel.config.images : [];
          const imageIds = (carousel.config.image_ids ?? imageList.map((image: ImageRecord) => getImageId(image)) ?? []).map((imageId) => Number(imageId));
          return (
            <CarouselEditor
              projectId={project.id}
              images={images}
              imageIds={imageIds}
              onChange={(nextImageIds) => updateCarouselImages(carousel.id, nextImageIds)}
            />
          );
        })()}
      </PopupMenu>
      <PopupMenu isOpen={editingMetadata && options !== null} title="Edit project details" onClose={() => setEditingMetadata(false)}>
        {options && <ProjectMetadataEditor project={project} options={options} onSaved={() => window.location.reload()} onClose={() => setEditingMetadata(false)} />}
      </PopupMenu>
      <PopupMenu isOpen={editingImageAlt} title="Edit image alt text" onClose={() => setEditingImageAlt(false)}>
        <ImageAltEditor projectId={project.id} images={images} onSaved={updateImage} onClose={() => setEditingImageAlt(false)} />
      </PopupMenu>
    </main>
  );
}

export default AdminProjectEdit;