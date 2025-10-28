import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueueAPI } from "@api/endpoints";
import Loading from "@components/Common/Loading";
import ErrorState from "@components/Common/ErrorState";

export default function QueueBar() {
  const qc = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["queue"],
    queryFn: () => QueueAPI.list(),
    refetchInterval: 5000
  });

  const remove = useMutation({
    mutationFn: (id: string) => QueueAPI.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["queue"] })
  });

  return (
    <div className="queuebar" role="region" aria-label="Execution queue">
      <div className="queue-header">
        <strong>Queue</strong>
        <button className="btn small" onClick={() => refetch()} aria-label="Refresh queue">
          Refresh
        </button>
      </div>
      {isLoading ? (
        <Loading label="Loading queue..." />
      ) : isError ? (
        <ErrorState message={(error as any)?.message} onRetry={() => refetch()} />
      ) : (
        <ul className="queue-list">
          {(data ?? []).map((q) => (
            <li key={q.id}>
              <span className={`status ${q.status.toLowerCase()}`} aria-label={`Status ${q.status}`}>
                ●
              </span>
              <span className="qid">{q.test_case_id}</span>
              <button className="icon-btn" aria-label="Remove from queue" onClick={() => remove.mutate(q.id)}>
                ×
              </button>
            </li>
          ))}
          {(data ?? []).length === 0 ? <li className="muted">Queue is empty</li> : null}
        </ul>
      )}
    </div>
  );
}
