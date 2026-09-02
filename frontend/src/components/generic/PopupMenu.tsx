import './PopupMenu.css';

export default function PopupMenu({ children, isOpen, title, onClose }: { children: React.ReactNode, isOpen: boolean, title: string, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="popup-menu-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>Close</button>
        </div>

        <div className="popup-body">
          {children}
        </div>
      </div>
    </div>
  )
}