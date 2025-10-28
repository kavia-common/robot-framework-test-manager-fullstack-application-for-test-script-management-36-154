import api from "./client";
import type { Test, TestCase, QueueItem, RunHistory, Log } from "./types";

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

export const ExecuteAPI = {
  run: async (test_case_ids: string[]) => {
    await api.post("/execute", { test_case_ids });
  }
};

export const QueueAPI = {
  list: async () => {
    const res = await api.get<QueueItem[]>("/queue");
    return res.data;
  },
  add: async (test_case_ids: string[]) => {
    await api.post("/queue", { test_case_ids });
  },
  remove: async (id: string) => {
    await api.delete(`/queue/${id}`);
  }
};

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

export const LogsAPI = {
  list: async (params?: { run_history_id?: string; q?: string }) => {
    const res = await api.get<Log[]>("/logs", { params });
    return res.data;
  },
  get: async (id: string) => {
    const res = await api.get<Log>(`/logs/${id}`);
    return res.data;
  },
  download: async (id: string) => {
    const res = await api.get(`/logs/${id}`, { responseType: "blob" });
    return res.data as Blob;
  }
};
