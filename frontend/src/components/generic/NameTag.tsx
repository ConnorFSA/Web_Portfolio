import "./NameTag.css"

interface NameTagProps {
  tag: string;
  svgIcon?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function NameTag({ tag, svgIcon, size = 'md', className = '' }: NameTagProps) {
  return (
    <div className={`name-tag name-tag--${size} ${className}`.trim()}>
      {svgIcon && (
        <span
          className="icon"
          role="img"
          aria-label={`${tag} icon`}
          style={{ maskImage: `url(${svgIcon})`, WebkitMaskImage: `url(${svgIcon})` }}
        />
      )}
      <p>{tag}</p>
    </div>
  );
}

export default NameTag;