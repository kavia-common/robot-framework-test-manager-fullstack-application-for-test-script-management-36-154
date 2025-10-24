import api from "../src/api/client";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("API client", () => {
  beforeEach(() => {
    localStorage.clear();
    (mockedAxios.create as any).mockReturnValue({
      interceptors: {
        request: { use: (fn: any) => { (api as any)._req = fn; } },
        response: { use: (_succ: any, fn: any) => { (api as any)._err = fn; } }
      },
      get: jest.fn(),
      post: jest.fn()
    });
  });

  test("injects Authorization header if token exists", async () => {
    localStorage.setItem("rf_tm_token", "abc");
    const instance: any = (axios.create as any).mock.results[0].value;
    const cfg = await (instance as any).interceptors.request.use((c: any) => c) || (api as any)._req({ headers: {} });
    const res = await (api as any)._req({ headers: {} });
    expect(res.headers.Authorization).toBe("Bearer abc");
  });

  test("on 401 clears token", async () => {
    localStorage.setItem("rf_tm_token", "abc");
    const err = { response: { status: 401 } };
    try {
      await (api as any)._err(err);
    } catch {
      // expected rethrow
    }
    expect(localStorage.getItem("rf_tm_token")).toBeNull();
  });
});
