import { useQuery } from "@tanstack/react-query";
import { HistoryAPI } from "@api/endpoints";
import Loading from "@components/Common/Loading";
import ErrorState from "@components/Common/ErrorState";
import React, { useState } from "react";

export default function History() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("");
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["history", { q, status }],
    queryFn: () => HistoryAPI.list({ q, status })
  });

  return (
    <div className="page">
      <div className="toolbar" role="search">
        <input placeholder="Search..." aria-label="Search history" value={q} onChange={(e) => setQ(e.target.value)} />
        <select aria-label="Status filter" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="PASSED">PASSED</option>
          <option value="FAILED">FAILED</option>
          <option value="ERROR">ERROR</option>
          <option value="RUNNING">RUNNING</option>
        </select>
        <button className="btn" onClick={() => refetch()}>Apply</button>
      </div>

      {isLoading ? (
        <Loading label="Loading history..." />
      ) : isError ? (
        <ErrorState message={(error as any)?.message} onRetry={() => refetch()} />
      ) : (
        <table className="table" aria-label="Run history">
          <thead>
            <tr>
              <th>Status</th>
              <th>Test Case</th>
              <th>Started</th>
              <th>Finished</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((h) => (
              <tr key={h.id}>
                <td><span className={`badge ${h.status.toLowerCase()}`}>{h.status}</span></td>
                <td>{h.test_case_id}</td>
                <td>{h.started_at ?? "-"}</td>
                <td>{h.finished_at ?? "-"}</td>
              </tr>
            ))}
            {(data ?? []).length === 0 ? (
              <tr>
                <td colSpan={4} className="muted">No results</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      )}
    </div>
  );
}
