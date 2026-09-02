import { useState, type FormEvent } from 'react';
import type { Project } from '../../types/project.types';
import type { ProjectMetadataPayload, ProjectOptions } from '../../api/admin';
import { createProject, updateProjectMetadata } from '../../api/admin';
import './AdminEditorForm.css';
import ImageSelectionPopup from './ImageSelectionPopup';

type ProjectMetadataEditorProps = {
  project?: Project;
  options: ProjectOptions;
  onSaved: (project: Project) => void;
  onClose: () => void;
};

function ProjectMetadataEditor({ project, options, onSaved, onClose }: ProjectMetadataEditorProps) {
  const isNew = !project;
  const [form, setForm] = useState<ProjectMetadataPayload>({
    name: project?.name ?? '', slug: project?.slug ?? '', summary: project?.summary ?? '',
    start_date: project?.start_date ? String(project.start_date) : '',
    end_date: project?.end_date ? String(project.end_date) : null,
    thumbnail_image: project?.thumbnail.url ?? '', url: project?.url ?? '',
    category_ids: project?.categories.map((item) => item.id).filter((id): id is number => id !== undefined) ?? [],
    language_ids: project?.languages.map((item) => item.id).filter((id): id is number => id !== undefined) ?? [],
    tool_ids: project?.tools.map((item) => item.id).filter((id): id is number => id !== undefined) ?? [],
    type_ids: project?.type_ids ?? (project?.type ? options.types.filter((item) => item.type === project.type).map((item) => item.id) : []),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isThumbnailPickerOpen, setIsThumbnailPickerOpen] = useState(false);

  const setField = <K extends keyof ProjectMetadataPayload>(field: K, value: ProjectMetadataPayload[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleId = (field: 'category_ids' | 'language_ids' | 'tool_ids' | 'type_ids', id: number) => {
    setField(field, form[field].includes(id) ? form[field].filter((value) => value !== id) : [...form[field], id]);
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const saved = isNew ? await createProject(form) : await updateProjectMetadata(project.id, form);
      onSaved(saved);
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save project');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-editor-form" onSubmit={handleSubmit}>
      <label>Name<input required value={form.name} onChange={(event) => setField('name', event.target.value)} /></label>
      <label>Slug<input required value={form.slug} onChange={(event) => setField('slug', event.target.value)} /></label>
      <label>Summary<textarea value={form.summary} onChange={(event) => setField('summary', event.target.value)} /></label>
      <div className="admin-editor-form-row">
        <label>Start date<input required type="text" inputMode="numeric" placeholder="DD-MM-YYYY" pattern="\d{2}-\d{2}-\d{4}" value={form.start_date} onChange={(event) => setField('start_date', event.target.value)} /></label>
        <label>End date<input type="text" inputMode="numeric" placeholder="DD-MM-YYYY" pattern="\d{2}-\d{2}-\d{4}" value={form.end_date ?? ''} onChange={(event) => setField('end_date', event.target.value || null)} /></label>
      </div>
      <div className="admin-editor-field">
        <span className="admin-editor-label">Thumbnail image</span>
        {form.thumbnail_image && <img className="admin-selected-image" src={form.thumbnail_image} alt="Selected thumbnail" />}
        <button type="button" onClick={() => setIsThumbnailPickerOpen(true)} disabled={!project?.images.length}>
          {form.thumbnail_image ? 'Change thumbnail' : 'Select thumbnail'}
        </button>
        {!project?.images.length && <span>No associated images available.</span>}
      </div>
      <label>Project URL<input type="url" value={form.url} onChange={(event) => setField('url', event.target.value)} /></label>
      <OptionGroup title="Types" options={options.types} labelKey="type" selected={form.type_ids} onToggle={(id) => toggleId('type_ids', id)} />
      <OptionGroup title="Categories" options={options.categories} labelKey="category" selected={form.category_ids} onToggle={(id) => toggleId('category_ids', id)} />
      <OptionGroup title="Languages" options={options.languages} labelKey="language" selected={form.language_ids} onToggle={(id) => toggleId('language_ids', id)} />
      <OptionGroup title="Tools" options={options.tools} labelKey="tool" selected={form.tool_ids} onToggle={(id) => toggleId('tool_ids', id)} />
      {error && <p className="admin-status admin-status--error">{error}</p>}
      <div className="admin-editor-form-actions">
        <button type="button" onClick={onClose}>Cancel</button>
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : isNew ? 'Create project' : 'Save changes'}</button>
      </div>
      <ImageSelectionPopup
        isOpen={isThumbnailPickerOpen}
        title="Select thumbnail image"
        images={project?.images ?? []}
        selectedImageUrl={form.thumbnail_image}
        onSelect={(image) => setField('thumbnail_image', image.image)}
        onClose={() => setIsThumbnailPickerOpen(false)}
      />
    </form>
  );
}

type OptionGroupProps = { title: string; options: Array<{ id: number; [key: string]: string | number | undefined }>; labelKey: string; selected: number[]; onToggle: (id: number) => void };
function OptionGroup({ title, options, labelKey, selected, onToggle }: OptionGroupProps) {
  return (
    <fieldset className="admin-editor-options">
      <legend>{title}</legend>
      <div className="admin-editor-option-list">
        {options.map((option) => (
          <label key={option.id}><input type="checkbox" checked={selected.includes(option.id)} onChange={() => onToggle(option.id)} />{option[labelKey]}</label>
        ))}
      </div>
    </fieldset>
  );
}

export default ProjectMetadataEditor;
