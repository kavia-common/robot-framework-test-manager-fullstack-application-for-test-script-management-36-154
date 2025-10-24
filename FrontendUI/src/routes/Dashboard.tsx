import React, { useEffect, useState } from "react";
import { listHistory } from "../api/client";

type Run = {
  id?: string;
  run_id?: string;
  status?: string;
  started_at?: string;
  finished_at?: string;
  case_id?: string;
};

export default function Dashboard() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await listHistory({ page: 1, page_size: 10 });
        const items = Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : [];
        setRuns(items);
      } catch (e: any) {
        setError(e?.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div role="status" aria-busy="true">Loading dashboard…</div>;
  if (error) return <div role="alert">{error}</div>;

  return (
    <section aria-labelledby="dashboard-title">
      <h1 id="dashboard-title">Dashboard</h1>
      <h2>Recent Runs</h2>
      {runs.length === 0 ? <p>No recent runs.</p> : (
        <ul>
          {runs.map((r, i) => (
            <li key={(r.id || r.run_id || i).toString()}>
              <strong>{r.status || "unknown"}</strong> - {(r.started_at || "")} {r.case_id ? `(Case ${r.case_id})` : ""}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
