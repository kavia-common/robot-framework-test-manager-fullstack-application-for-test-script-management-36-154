import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

// PUBLIC_INTERFACE
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel
}: Props) {
  /** Accessible confirmation dialog with focus trapping (simple). */
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="cd-title">
      <div className="modal" tabIndex={-1} ref={ref}>
        <h3 id="cd-title">{title}</h3>
        {description ? <p>{description}</p> : null}
        <div className="modal-actions">
          <button className="btn danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
          <button className="btn" onClick={onCancel}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
