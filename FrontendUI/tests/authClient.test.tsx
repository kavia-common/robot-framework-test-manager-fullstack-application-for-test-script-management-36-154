import { act, render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { AuthProvider } from "../src/store/authContext";
import Login from "../src/routes/Login";
import * as client from "../src/api/client";

jest.mock("../src/api/client");

describe("Auth flow", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.resetAllMocks();
  });

  test("successful login stores token and navigates", async () => {
    (client.login as jest.Mock).mockResolvedValue({ access_token: "abc", token_type: "bearer" });
    (client.me as jest.Mock).mockResolvedValue({ user_id: "1", username: "u", roles: ["tester"] });

    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "user" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "pass" } });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: /sign in/i }).closest("form")!);
    });

    expect(localStorage.getItem("rf_tm_token")).toBe("abc");
  });
});
