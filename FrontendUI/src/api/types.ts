export type ISODate = string;

export interface Test {
  id: string;
  name: string;
  description?: string;
  created_at?: ISODate;
  updated_at?: ISODate;
}

export interface TestCase {
  id: string;
  test_id: string;
  name: string;
  description?: string;
  variables?: Record<string, unknown>;
  created_at?: ISODate;
  updated_at?: ISODate;
}

export interface QueueItem {
  id: string;
  test_case_id: string;
  status: string;
  priority?: number;
  queued_at?: ISODate;
}

export interface RunHistory {
  id: string;
  test_case_id: string;
  status: string;
  started_at?: ISODate;
  finished_at?: ISODate;
  log_id?: string;
}

export interface Log {
  id: string;
  run_history_id: string;
  content?: string;
  created_at?: ISODate;
}
