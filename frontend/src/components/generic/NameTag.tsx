import "./NameTag.css"

interface NameTagProps {
  tag: string;
  svgIcon?: string;
}

function NameTag({ tag, svgIcon }: NameTagProps) {
  return (
    <div className="name-tag">
      {svgIcon && <img className="icon" src={svgIcon} alt={`${tag} icon`} />}
      <p>{tag}</p>
    </div>
  );
}

export default NameTag;