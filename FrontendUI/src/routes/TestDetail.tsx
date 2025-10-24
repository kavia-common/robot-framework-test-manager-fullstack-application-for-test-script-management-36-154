import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTest, listCases } from "../api/client";

export default function TestDetail() {
  const { id } = useParams<{ id: string }>();
  const [test, setTest] = useState<any | null>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!id) return;
      setLoading(true);
      try {
        const t = await getTest(id);
        setTest(t);
        const cs = await listCases({ test_script_id: id });
        // Normalize to array; backend may return an array or a pagination object.
        const items = Array.isArray(cs) ? cs : (cs && typeof cs === "object" && Array.isArray((cs as any).items) ? (cs as any).items : []);
        setCases(items);
      } catch (e: any) {
        setError(e?.message || "Failed to load test details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div role="status" aria-busy="true">Loading test…</div>;
  if (error) return <div role="alert">{error}</div>;
  if (!test) return <div role="alert">Test not found</div>;

  return (
    <section>
      <h1>{test.name || test.id}</h1>
      <p>{test.description || "No description"}</p>
      <h2>Cases</h2>
      {cases.length === 0 ? <p>No cases found.</p> : (
        <ul>
          {cases.map((c, i) => (
            <li key={(c.id || i).toString()}>
              <Link to={`/cases/${c.id}`} className="App-link">{c.name || c.id}</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
