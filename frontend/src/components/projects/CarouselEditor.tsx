import { useState, type ChangeEvent } from 'react';
import type { ProjectImage } from '../../types/project.types';
import { uploadProjectImage } from '../../api/admin';
import './CarouselEditor.css';

type CarouselEditorProps = {
  projectId: number;
  images: ProjectImage[];
  imageIds: number[];
  onChange: (imageIds: number[]) => void;
};

type ProjectImageResponse = ProjectImage & {
  pk_image?: number | string;
};

function CarouselEditor({ projectId, images, imageIds, onChange }: CarouselEditorProps) {
  const [uploadedImages, setUploadedImages] = useState<ProjectImage[]>([]);
  const [altText, setAltText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizedImages = images.map((image) => ({
    ...image,
    id: Number(image.id ?? (image as ProjectImageResponse).pk_image),
  }));
  const normalizedUploadedImages = uploadedImages.map((image) => ({
    ...image,
    id: Number(image.id ?? (image as ProjectImageResponse).pk_image),
  }));
  const normalizedImageIds = [...new Set(
    imageIds
      .map((imageId) => Number(imageId))
      .filter((imageId) => Number.isInteger(imageId)),
  )];
  const availableImages = [...normalizedImages, ...normalizedUploadedImages.filter(
    (uploadedImage) => !normalizedImages.some((image) => image.id === uploadedImage.id),
  )];

  const moveImage = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= normalizedImageIds.length) return;

    const next = [...normalizedImageIds];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    onChange(next);
  };

  const addImage = (imageId: number) => {
    if (!normalizedImageIds.includes(imageId)) onChange([...normalizedImageIds, imageId]);
  };

  const removeImage = (imageId: number) => {
    onChange(normalizedImageIds.filter((id) => id !== imageId));
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const image = await uploadProjectImage(projectId, file, altText);
      setUploadedImages((current) => [...current, image]);
      onChange([...normalizedImageIds, image.id]);
      setAltText('');
      event.target.value = '';
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const selectedImages = normalizedImageIds
    .map((id) => availableImages.find((image) => image.id === id))
    .filter((image): image is ProjectImage => Boolean(image));
  const unusedImages = availableImages.filter((image) => !normalizedImageIds.includes(image.id));

  return (
    <div className="carousel-editor">
      <section>
        <h3>Carousel images</h3>
        {selectedImages.length === 0 && <p>No images selected.</p>}
        <ol className="carousel-editor-list">
          {selectedImages.map((image, index) => (
            <li className="carousel-editor-item" key={image.id}>
              <img src={image.image} alt={image.alt_text} />
              <span>{image.alt_text}</span>
              <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} aria-label="Move image up">Up</button>
              <button type="button" onClick={() => moveImage(index, 1)} disabled={index === selectedImages.length - 1} aria-label="Move image down">Down</button>
              <button type="button" onClick={() => removeImage(image.id)}>Remove</button>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h3>Add an existing image</h3>
        {unusedImages.length === 0 && <p>No unused project images.</p>}
        <div className="carousel-editor-available">
          {unusedImages.map((image) => (
            <div className="available-image" key={image.id}>
              <img src={image.image} alt="" />
              <span>{image.alt_text}</span>
              <button type="button" onClick={() => addImage(image.id)}>Add</button>
            </div>
          ))}
        </div>
      </section>

      <section className="carousel-editor-upload">
        <h3>Upload a new image</h3>
        <label>
          Alt text
          <input value={altText} onChange={(event) => setAltText(event.target.value)} required />
        </label>
        <label>
          Image file
          <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleUpload} disabled={uploading || !altText.trim()} />
        </label>
        {uploading && <p>Uploading...</p>}
        {error && <p role="alert">{error}</p>}
      </section>
    </div>
  );
}

export default CarouselEditor;
