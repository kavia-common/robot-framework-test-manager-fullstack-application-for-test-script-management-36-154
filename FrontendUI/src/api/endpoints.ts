import api from "./client";
import type { Test, TestCase, QueueItem, RunHistory, Log } from "./types";

/**
 * Tests API client: supports search and pagination via q, page, pageSize params.
 */
export const TestsAPI = {
  list: async (params?: { q?: string; page?: number; pageSize?: number }) => {
    const res = await api.get<Test[]>("/tests", { params });
    return res.data;
  },
  create: async (payload: Partial<Test>) => {
    const res = await api.post<Test>("/tests", payload);
    return res.data;
  },
  get: async (id: string) => {
    const res = await api.get<Test>(`/tests/${id}`);
    return res.data;
  },
  update: async (id: string, payload: Partial<Test>) => {
    const res = await api.put<Test>(`/tests/${id}`, payload);
    return res.data;
  },
  delete: async (id: string) => {
    await api.delete(`/tests/${id}`);
  }
};

/**
 * Cases API client: supports filtering by test_id, q and pagination params.
 */
export const CasesAPI = {
  list: async (params?: { test_id?: string; q?: string; page?: number; pageSize?: number }) => {
    const res = await api.get<TestCase[]>("/cases", { params });
    return res.data;
  },
  create: async (payload: Partial<TestCase>) => {
    const res = await api.post<TestCase>("/cases", payload);
    return res.data;
  },
  get: async (id: string) => {
    const res = await api.get<TestCase>(`/cases/${id}`);
    return res.data;
  },
  update: async (id: string, payload: Partial<TestCase>) => {
    const res = await api.put<TestCase>(`/cases/${id}`, payload);
    return res.data;
  },
  delete: async (id: string) => {
    await api.delete(`/cases/${id}`);
  }
};

/**
 * Execute API client: trigger execution for one or more case ids.
 */
export const ExecuteAPI = {
  run: async (test_case_ids: string[]) => {
    await api.post("/execute", { test_case_ids });
  }
};

/**
 * Queue API client: retrieve queue and manage items.
 */
export const QueueAPI = {
  list: async (params?: { page?: number; pageSize?: number; status?: string }) => {
    const res = await api.get<QueueItem[]>("/queue", { params });
    return res.data;
  },
  add: async (test_case_ids: string[]) => {
    await api.post("/queue", { test_case_ids });
  },
  remove: async (id: string) => {
    await api.delete(`/queue/${id}`);
  }
};

/**
 * History API client: supports filtering by status, q and pagination.
 */
export const HistoryAPI = {
  list: async (params?: { status?: string; q?: string; page?: number; pageSize?: number }) => {
    const res = await api.get<RunHistory[]>("/history", { params });
    return res.data;
  },
  get: async (id: string) => {
    const res = await api.get<RunHistory>(`/history/${id}`);
    return res.data;
  },
  delete: async (id: string) => {
    await api.delete(`/history/${id}`);
  }
};

/**
 * Logs API client: supports inline preview (JSON/text) via Accept header, and download (blob).
 */
export const LogsAPI = {
  list: async (params?: { run_history_id?: string; q?: string; page?: number; pageSize?: number }) => {
    const res = await api.get<Log[]>("/logs", { params });
    return res.data;
  },
  get: async (id: string, inline: boolean = true) => {
    // Attempt inline JSON/text preview when inline=true by setting Accept header
    const res = await api.get<Log>(`/logs/${id}`, {
      headers: inline ? { Accept: "application/json, text/plain;q=0.9, */*;q=0.8" } : undefined
    });
    return res.data;
  },
  download: async (id: string) => {
    // For presigned URL download, many backends respond with redirect or file stream.
    // We request blob to force browser download via saveAs utility.
    const res = await api.get(`/logs/${id}`, { responseType: "blob" });
    return res.data as Blob;
  }
};
