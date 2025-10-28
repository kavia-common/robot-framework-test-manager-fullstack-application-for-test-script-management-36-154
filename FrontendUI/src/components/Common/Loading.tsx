type Props = { label?: string };

// PUBLIC_INTERFACE
export default function Loading({ label = "Loading..." }: Props) {
  /** Accessible loading indicator component */
  return (
    <div role="status" aria-live="polite" className="loading">
      <span className="spinner" aria-hidden="true" /> {label}
    </div>
  );
}
