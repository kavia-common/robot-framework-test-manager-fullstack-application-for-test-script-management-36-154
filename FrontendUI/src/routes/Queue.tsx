import React, { useEffect, useState } from "react";
import { listQueue, removeFromQueue } from "../api/client";
import { useAuth } from "../store/authContext";

export default function Queue() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { user } = useAuth();
  const canManage = !!user && (user.roles.includes("admin") || user.roles.includes("tester"));

  async function load() {
    setLoading(true);
    try {
      const data = await listQueue();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Failed to load queue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onRemove(id: string) {
    setBusyId(id);
    try {
      await removeFromQueue(id);
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to remove from queue");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <div role="status" aria-busy="true">Loading queue…</div>;
  if (error) return <div role="alert">{error}</div>;

  return (
    <section>
      <h1>Queue</h1>
      {items.length === 0 ? <p>No items queued.</p> : (
        <ul>
          {items.map((q, i) => {
            const id = (q.id || q.case_id || i).toString();
            return (
              <li key={id}>
                {q.test_case_id || q.case_id || id} — {q.status || "pending"}
                {canManage && (
                  <button
                    className="theme-toggle"
                    style={{ marginLeft: 8 }}
                    onClick={() => onRemove(q.case_id || q.id)}
                    disabled={busyId === (q.case_id || q.id)}
                    aria-label={`Remove ${q.case_id || q.id} from queue`}
                  >
                    Remove
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
