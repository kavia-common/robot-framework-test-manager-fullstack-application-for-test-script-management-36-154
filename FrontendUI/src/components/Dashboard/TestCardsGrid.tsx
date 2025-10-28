import { useQuery } from "@tanstack/react-query";
import { TestsAPI } from "@api/endpoints";
import { Link } from "react-router-dom";
import Loading from "@components/Common/Loading";
import ErrorState from "@components/Common/ErrorState";
import type { Test } from "@api/types";

type Props = { query?: string };

function TestCard({ test }: { test: Test }) {
  return (
    <article className="card" tabIndex={0} aria-labelledby={`test-${test.id}-title`}>
      <h3 id={`test-${test.id}-title`}>{test.name}</h3>
      {test.description ? <p className="muted">{test.description}</p> : null}
      <div className="card-actions">
        <Link to={`/tests/${test.id}`} className="btn" aria-label={`View ${test.name}`}>
          View
        </Link>
      </div>
    </article>
  );
}

// PUBLIC_INTERFACE
export default function TestCardsGrid({ query }: Props) {
  /** Grid of test cards with search query support */
  const { data, isLoading, isError, refetch, error } = useQuery({
    queryKey: ["tests", { query }],
    queryFn: () => TestsAPI.list({ q: query }),
  });

  if (isLoading) return <Loading label="Loading tests..." />;
  if (isError) return <ErrorState message={(error as any)?.message} onRetry={() => refetch()} />;

  const tests = data ?? [];
  return (
    <section aria-label="Tests grid" className="grid">
      {tests.length === 0 ? <p>No tests available.</p> : tests.map((t) => <TestCard key={t.id} test={t} />)}
    </section>
  );
}
