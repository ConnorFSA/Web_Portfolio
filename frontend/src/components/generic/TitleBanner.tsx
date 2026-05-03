
import ImageLoader from './ImageLoader';
import './TitleBanner.css';

interface TitleBannerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  imagePosition?: 'left' | 'right';
}

function TitleBanner({ title, subtitle, description, imageUrl, imageAlt, imagePosition }: TitleBannerProps) {
  
  if (!title && !subtitle && !description && !imageUrl) return null;
  return (
    // The component renders a title banner with optional subtitle, description and image
    // the image can be positioned either left or right based on the image position prop
    <div className={`title-banner title-banner--${imagePosition || "right"}`}>
      <div className="text-content">
        {title && <h1 className="title">{title}</h1>}
        {subtitle && <h2 className="subtitle">{subtitle}</h2>}
        {description && <p className="description">{description}</p>}
      </div>
      {imageUrl && <ImageLoader src={imageUrl} alt={imageAlt} className="title-image" />}
    </div>
  );
};

export default TitleBanner;