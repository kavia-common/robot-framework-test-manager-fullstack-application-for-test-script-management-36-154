import React, { useState } from "react";
import TestCardsGrid from "@components/Dashboard/TestCardsGrid";
import TestDetail from "@components/TestDetail/TestDetail";
import TestWizard from "@components/TestWizard";
import { useParams } from "react-router-dom";
import AccessControl from "@components/Common/AccessControl";

export default function Tests() {
  const [search, setSearch] = useState("");
  const { id } = useParams();

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
            <TestWizard onCreated={() => { /* could refetch list via invalidation event bus */ }} />
          </details>
        </AccessControl>
      </div>
      <div className="columns">
        <div className="col">{!id ? <TestCardsGrid query={search} /> : <TestDetail />}</div>
      </div>
    </div>
  );
}
