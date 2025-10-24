import React, { useEffect, useState } from "react";
import { getLog, getRun, listHistory } from "../api/client";

export default function History() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logUrl, setLogUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await listHistory({ page: 1, page_size: 25 });
        const list = Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : [];
        setItems(list);
      } catch (e: any) {
        setError(e?.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function showLog(id: string) {
    setError(null);
    setLogUrl(null);
    try {
      // Some backends expose logs under /logs/{run_id}, some via /history/{run_id}
      const logData = await getLog(id).catch(async () => {
        const run = await getRun(id);
        return { log_url: run?.log_url };
      });
      const url = (logData && (logData.log_url || logData.url)) || null;
      setLogUrl(url);
    } catch (e: any) {
      setError(e?.message || "Failed to load log");
    }
  }

  if (loading) return <div role="status" aria-busy="true">Loading history…</div>;
  if (error) return <div role="alert">{error}</div>;

  return (
    <section>
      <h1>Run History</h1>
      {items.length === 0 ? <p>No runs.</p> : (
        <table role="table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Status</th>
              <th>Case</th>
              <th>Started</th>
              <th>Finished</th>
              <th>Log</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r, i) => {
              const id = (r.id || r.run_id || i).toString();
              return (
                <tr key={id}>
                  <td>{r.status || "unknown"}</td>
                  <td>{r.test_case_id || r.case_id || "-"}</td>
                  <td>{r.started_at || "-"}</td>
                  <td>{r.finished_at || "-"}</td>
                  <td>
                    <button className="theme-toggle" onClick={() => showLog(id)}>Get Log</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {logUrl && (
        <p style={{ marginTop: 12 }}>
          Log URL: <a className="App-link" href={logUrl} target="_blank" rel="noreferrer">Open</a>
        </p>
      )}
    </section>
  );
}
