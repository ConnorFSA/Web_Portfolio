import type { ProjectImage } from '../../types/project.types';
import PopupMenu from '../generic/PopupMenu';
import './AdminEditorForm.css';

type ImageSelectionPopupProps = {
  isOpen: boolean;
  title: string;
  images: ProjectImage[];
  selectedImageUrl: string;
  onSelect: (image: ProjectImage) => void;
  onClose: () => void;
};

function ImageSelectionPopup({
  isOpen,
  title,
  images,
  selectedImageUrl,
  onSelect,
  onClose,
}: ImageSelectionPopupProps) {
  return (
    <PopupMenu isOpen={isOpen} title={title} onClose={onClose}>
      <div className="admin-image-picker">
        {images.length === 0 && <p>No images are associated with this project.</p>}
        {images.map((image) => (
          <button
            className={`admin-image-picker-option${image.image === selectedImageUrl ? ' admin-image-picker-option--selected' : ''}`}
            type="button"
            key={image.id}
            onClick={() => {
              onSelect(image);
              onClose();
            }}
          >
            <img src={image.image} alt={image.alt_text} />
            <span>{image.alt_text}</span>
          </button>
        ))}
      </div>
    </PopupMenu>
  );
}

export default ImageSelectionPopup;
