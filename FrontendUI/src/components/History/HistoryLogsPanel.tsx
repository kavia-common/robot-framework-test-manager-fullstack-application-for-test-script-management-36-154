import { useQuery, useMutation } from "@tanstack/react-query";
import { HistoryAPI, LogsAPI } from "@api/endpoints";
import Loading from "@components/Common/Loading";
import ErrorState from "@components/Common/ErrorState";
import { saveAs } from "./saveAs";
import React, { useState } from "react";

export default function HistoryLogsPanel() {
  const [preview, setPreview] = useState<{ id: string; content: string } | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["history", { side: true, pageSize: 10 }],
    queryFn: () => HistoryAPI.list({ pageSize: 10 })
  });

  const download = async (logId?: string) => {
    if (!logId) return;
    const blob = await LogsAPI.download(logId);
    saveAs(blob, `log-${logId}.txt`);
  };

  const openPreview = useMutation({
    mutationFn: async (logId: string) => {
      // Try inline preview first
      const log = await LogsAPI.get(logId, true);
      const content = log?.content ?? "";
      return { id: logId, content };
    },
    onSuccess: (p) => {
      setPreview(p);
    },
    onError: async (_err, logId) => {
      // Fallback: download as blob and display teaser text
      const blob = await LogsAPI.download(logId);
      const text = await blob.text().catch(() => "");
      setPreview({ id: logId, content: text.slice(0, 5000) });
    }
  });

  return (
    <div className="history-panel" role="region" aria-label="Recent runs">
      <div className="panel-header">
        <strong>Recent Runs</strong>
        <button className="btn small" onClick={() => refetch()} aria-busy={isFetching}>
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      {isLoading ? (
        <Loading label="Loading run history..." />
      ) : isError ? (
        <ErrorState message={(error as any)?.message} onRetry={() => refetch()} />
      ) : (
        <>
          <ul className="list compact">
            {(data ?? []).map((h) => (
              <li key={h.id} className="list-item">
                <div className="grow">
                  <span className={`badge ${h.status.toLowerCase()}`}>{h.status}</span>
                  <small className="muted">Case: {h.test_case_id}</small>
                </div>
                <div className="row-actions">
                  <button className="btn small" onClick={() => openPreview.mutate(h.log_id!)} disabled={!h.log_id || openPreview.isPending}>
                    {openPreview.isPending ? "Opening..." : "Preview"}
                  </button>
                  <button className="btn small" onClick={() => download(h.log_id)} disabled={!h.log_id}>
                    Download
                  </button>
                </div>
              </li>
            ))}
            {(data ?? []).length === 0 ? <li className="muted">No runs yet.</li> : null}
          </ul>
          {preview ? (
            <div className="card" style={{ marginTop: 8 }}>
              <div className="section-header">
                <strong>Log preview</strong>
                <button className="btn small" onClick={() => setPreview(null)}>Close</button>
              </div>
              <pre style={{ maxHeight: 200, overflow: "auto", whiteSpace: "pre-wrap" }}>{preview.content || "No content"}</pre>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
