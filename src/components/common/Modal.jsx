import React, { useEffect } from 'react';

export const Modal = ({ isOpen, onClose, title, description, confirmLabel = 'Confirm', confirmVariant = 'btn-danger', onConfirm, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {title && <h3 className="modal-title">{title}</h3>}
        {description && <p className="modal-desc">{description}</p>}
        {children}
        {onConfirm && (
          <div className="modal-actions">
            <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
            <button className={`btn ${confirmVariant} btn-sm`} onClick={onConfirm}>{confirmLabel}</button>
          </div>
        )}
      </div>
    </div>
  );
};
