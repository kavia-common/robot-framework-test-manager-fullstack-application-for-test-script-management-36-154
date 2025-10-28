import React from "react";

/**
 * PUBLIC_INTERFACE
 */
export default function NotFound() {
  /** Simple 404 fallback route component. */
  return (
    <div className="page">
      <h2>Page not found</h2>
      <p className="muted">The page you are looking for does not exist.</p>
    </div>
  );
}
