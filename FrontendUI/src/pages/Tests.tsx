import React, { useEffect, useState } from "react";
import TestCardsGrid from "@components/Dashboard/TestCardsGrid";
import TestDetail from "@components/TestDetail/TestDetail";
import TestWizard from "@components/TestWizard";
import { useParams } from "react-router-dom";
import AccessControl from "@components/Common/AccessControl";

export default function Tests() {
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const handler = () => setRefreshKey((k) => k + 1);
    window.addEventListener("tests:changed", handler);
    return () => window.removeEventListener("tests:changed", handler);
  }, []);

  return (
    <div className="page page-tests">
      <div className="toolbar" role="search">
        <input
          placeholder="Search tests..."
          aria-label="Search tests"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AccessControl roles={["admin", "tester"]}>
          <details>
            <summary className="btn">New Test</summary>
            <TestWizard onCreated={() => { /* event dispatched for list refetch */ }} />
          </details>
        </AccessControl>
      </div>
      <div className="columns">
        <div className="col">{!id ? <TestCardsGrid key={refreshKey} query={search} /> : <TestDetail />}</div>
      </div>
    </div>
  );
}
