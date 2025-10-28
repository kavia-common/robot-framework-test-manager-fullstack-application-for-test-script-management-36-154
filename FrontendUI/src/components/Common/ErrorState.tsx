type Props = { title?: string; message?: string; onRetry?: () => void };

// PUBLIC_INTERFACE
export default function ErrorState({ title = "Something went wrong", message, onRetry }: Props) {
  /** Generic error presentation with optional retry action. */
  return (
    <div role="alert" className="error-state">
      <h3>{title}</h3>
      {message ? <p>{message}</p> : null}
      {onRetry ? (
        <button type="button" className="btn" onClick={onRetry} aria-label="Retry action">
          Retry
        </button>
      ) : null}
    </div>
  );
}
