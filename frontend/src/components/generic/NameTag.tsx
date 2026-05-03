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
      {svgIcon && <img className="icon" src={svgIcon} alt={`${tag} icon`} />}
      <p>{tag}</p>
    </div>
  );
}

export default NameTag;