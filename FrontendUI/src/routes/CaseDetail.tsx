import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addToQueue, execute, getCase } from "../api/client";
import { useAuth } from "../store/authContext";

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const [caseData, setCaseData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const canExecute = !!user && (user.roles.includes("admin") || user.roles.includes("tester"));

  useEffect(() => {
    (async () => {
      if (!id) return;
      setLoading(true);
      try {
        const c = await getCase(id);
        setCaseData(c);
      } catch (e: any) {
        setError(e?.message || "Failed to load case");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function onExecute() {
    if (!id) return;
    setBusy(true); setMsg(null); setError(null);
    try {
      await execute([id], "ad_hoc");
      setMsg("Execution triggered.");
    } catch (e: any) {
      setError(e?.message || "Failed to execute");
    } finally {
      setBusy(false);
    }
  }

  async function onQueue() {
    if (!id) return;
    setBusy(true); setMsg(null); setError(null);
    try {
      await addToQueue([id]);
      setMsg("Added to queue.");
    } catch (e: any) {
      setError(e?.message || "Failed to queue");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div role="status" aria-busy="true">Loading case…</div>;
  if (error) return <div role="alert">{error}</div>;
  if (!caseData) return <div role="alert">Case not found</div>;

  return (
    <section>
      <h1>{caseData.name || id}</h1>
      <pre aria-label="Variables" style={{ textAlign: "left", background: "var(--bg-secondary)", padding: 12, borderRadius: 8 }}>
        {JSON.stringify(caseData.variables || {}, null, 2)}
      </pre>
      {canExecute && (
        <div style={{ display: "flex", gap: 8 }}>
          <button className="theme-toggle" onClick={onExecute} disabled={busy}>Execute</button>
          <button className="theme-toggle" onClick={onQueue} disabled={busy}>Add to Queue</button>
        </div>
      )}
      {msg && <div role="status" style={{ marginTop: 8 }}>{msg}</div>}
      {!canExecute && <div role="note" style={{ marginTop: 8 }}>You have read-only access.</div>}
    </section>
  );
}
