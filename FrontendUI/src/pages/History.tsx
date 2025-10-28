import { useQuery } from "@tanstack/react-query";
import { HistoryAPI, LogsAPI } from "@api/endpoints";
import Loading from "@components/Common/Loading";
import ErrorState from "@components/Common/ErrorState";
import React, { useState } from "react";
import { saveAs } from "@components/History/saveAs";

export default function History() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const pageSize = 20;

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["history", { q, status, page, pageSize }],
    queryFn: () => HistoryAPI.list({ q, status, page, pageSize })
  });

  const onDownload = async (logId?: string) => {
    if (!logId) return;
    const blob = await LogsAPI.download(logId);
    saveAs(blob, `log-${logId}.txt`);
  };

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
        <button className="btn" onClick={() => refetch()} aria-busy={isFetching}>
          {isFetching ? "Applying..." : "Apply"}
        </button>
      </div>

      {isLoading ? (
        <Loading label="Loading history..." />
      ) : isError ? (
        <ErrorState message={(error as any)?.message} onRetry={() => refetch()} />
      ) : (
        <>
          <table className="table" aria-label="Run history">
            <thead>
              <tr>
                <th>Status</th>
                <th>Test Case</th>
                <th>Started</th>
                <th>Finished</th>
                <th>Log</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((h) => (
                <tr key={h.id}>
                  <td><span className={`badge ${h.status.toLowerCase()}`}>{h.status}</span></td>
                  <td>{h.test_case_id}</td>
                  <td>{h.started_at ?? "-"}</td>
                  <td>{h.finished_at ?? "-"}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn small" onClick={() => onDownload(h.log_id)} disabled={!h.log_id}>
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(data ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="muted">No results</td>
                </tr>
              ) : null}
            </tbody>
          </table>
          <div className="toolbar" role="navigation" aria-label="Pagination">
            <button className="btn small" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </button>
            <span style={{ padding: "0 8px" }}>Page {page}</span>
            <button className="btn small" onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
