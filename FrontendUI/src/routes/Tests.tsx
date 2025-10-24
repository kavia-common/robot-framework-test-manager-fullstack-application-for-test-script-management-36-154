import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listTests } from "../api/client";

export default function Tests() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await listTests();
        const items = Array.isArray(data) ? data : (data && typeof data === "object" && Array.isArray((data as any).items) ? (data as any).items : []);
        setTests(items);
      } catch (e: any) {
        setError(e?.message || "Failed to load tests");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div role="status" aria-busy="true">Loading tests…</div>;
  if (error) return <div role="alert">{error}</div>;

  return (
    <section aria-labelledby="tests-title">
      <h1 id="tests-title">Tests</h1>
      {tests.length === 0 ? <p>No tests found.</p> : (
        <div role="list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {tests.map((t, i) => (
            <article key={(t.id || i).toString()} role="listitem" className="card" aria-label={`Test ${t.name || t.id}`}>
              <h3>{t.name || t.id}</h3>
              <p>{t.description || "No description"}</p>
              <Link to={`/tests/${t.id}`} className="App-link">View details</Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
