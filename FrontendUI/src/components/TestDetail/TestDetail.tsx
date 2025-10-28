import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CasesAPI, ExecuteAPI } from "@api/endpoints";
import { Link, useParams } from "react-router-dom";
import Loading from "@components/Common/Loading";
import ErrorState from "@components/Common/ErrorState";
import ConfirmDialog from "@components/Common/ConfirmDialog";
import AccessControl from "@components/Common/AccessControl";
import React, { useState } from "react";

export default function TestDetail() {
  const { id: testId } = useParams();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const qc = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["cases", { test_id: testId }],
    queryFn: () => CasesAPI.list({ test_id: testId })
  });

  const del = useMutation({
    mutationFn: (id: string) => CasesAPI.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cases"] })
  });

  const run = useMutation({
    mutationFn: (id: string) => ExecuteAPI.run([id])
  });

  if (isLoading) return <Loading label="Loading test cases..." />;
  if (isError) return <ErrorState message={(error as any)?.message} onRetry={() => refetch()} />;

  return (
    <section aria-label="Test cases list">
      <div className="section-header">
        <h2>Test Cases</h2>
        <AccessControl roles={["admin", "tester"]}>
          <Link to={`/cases/new?test_id=${testId}`} className="btn">New Case</Link>
        </AccessControl>
      </div>
      <ul className="list">
        {(data ?? []).map((c) => (
          <li key={c.id} className="list-item">
            <div className="grow">
              <strong>{c.name}</strong>
              {c.description ? <p className="muted">{c.description}</p> : null}
            </div>
            <div className="row-actions" role="group" aria-label={`${c.name} actions`}>
              <Link to={`/cases/${c.id}`} className="btn">Configure</Link>
              <button className="btn" onClick={() => run.mutate(c.id)} disabled={run.isPending}>
                {run.isPending ? "Queuing..." : "Run"}
              </button>
              <AccessControl roles={["admin"]}>
                <button className="btn danger" onClick={() => setConfirmId(c.id)}>Delete</button>
              </AccessControl>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={!!confirmId}
        title="Delete test case?"
        description="This action cannot be undone."
        onConfirm={() => {
          if (confirmId) del.mutate(confirmId);
          setConfirmId(null);
        }}
        onCancel={() => setConfirmId(null)}
      />
    </section>
  );
}
