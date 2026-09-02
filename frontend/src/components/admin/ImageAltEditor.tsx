import { useState, type FormEvent } from 'react';
import type { ProjectImage } from '../../types/project.types';
import { updateProjectImageAltText } from '../../api/admin';
import './AdminEditorForm.css';

type ImageAltEditorProps = {
  projectId: number;
  images: ProjectImage[];
  onSaved: (image: ProjectImage) => void;
  onClose: () => void;
};

function ImageAltEditor({ projectId, images, onSaved, onClose }: ImageAltEditorProps) {
  const [values, setValues] = useState<Record<number, string>>(
    Object.fromEntries(images.map((image) => [image.id, image.alt_text])),
  );
  const [saving, setSaving] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function saveImage(event: FormEvent, image: ProjectImage) {
    event.preventDefault();
    setSaving(image.id);
    setError(null);
    try {
      const saved = await updateProjectImageAltText(projectId, image.id, values[image.id] ?? '');
      onSaved(saved);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not update image');
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="admin-editor-form">
      {images.map((image) => (
        <form className="admin-image-row" key={image.id} onSubmit={(event) => saveImage(event, image)}>
          <img src={image.image} alt={image.alt_text} />
          <label>Alt text<input required value={values[image.id] ?? ''} onChange={(event) => setValues((current) => ({ ...current, [image.id]: event.target.value }))} /></label>
          <button type="submit" disabled={saving === image.id}>{saving === image.id ? 'Saving...' : 'Save'}</button>
        </form>
      ))}
      {images.length === 0 && <p>No images found.</p>}
      {error && <p className="admin-status admin-status--error">{error}</p>}
      <div className="admin-editor-form__actions">
        <button type="button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ImageAltEditor;
