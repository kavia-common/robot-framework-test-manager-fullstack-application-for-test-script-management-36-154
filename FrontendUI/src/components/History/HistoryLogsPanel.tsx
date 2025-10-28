import { useQuery } from "@tanstack/react-query";
import { HistoryAPI, LogsAPI } from "@api/endpoints";
import Loading from "@components/Common/Loading";
import ErrorState from "@components/Common/ErrorState";
import { saveAs } from "./saveAs";

export default function HistoryLogsPanel() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["history", { side: true }],
    queryFn: () => HistoryAPI.list({ pageSize: 10 })
  });

  const download = async (logId?: string) => {
    if (!logId) return;
    const blob = await LogsAPI.download(logId);
    saveAs(blob, `log-${logId}.txt`);
  };

  return (
    <div className="history-panel" role="region" aria-label="Recent runs">
      <div className="panel-header">
        <strong>Recent Runs</strong>
        <button className="btn small" onClick={() => refetch()}>Refresh</button>
      </div>
      {isLoading ? (
        <Loading label="Loading run history..." />
      ) : isError ? (
        <ErrorState message={(error as any)?.message} onRetry={() => refetch()} />
      ) : (
        <ul className="list compact">
          {(data ?? []).map((h) => (
            <li key={h.id} className="list-item">
              <div className="grow">
                <span className={`badge ${h.status.toLowerCase()}`}>{h.status}</span>
                <small className="muted">Case: {h.test_case_id}</small>
              </div>
              <div className="row-actions">
                <button className="btn small" onClick={() => download(h.log_id)}>
                  Download log
                </button>
              </div>
            </li>
          ))}
          {(data ?? []).length === 0 ? <li className="muted">No runs yet.</li> : null}
        </ul>
      )}
    </div>
  );
}
