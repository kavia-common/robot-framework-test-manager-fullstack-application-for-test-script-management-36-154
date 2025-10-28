import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../Login";
import { AuthProvider } from "@hooks/useAuth";
import { NotificationsProvider } from "@hooks/useNotifications";
import { MemoryRouter } from "react-router-dom";

test("renders login form and submits", async () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <NotificationsProvider>
          <Login />
        </NotificationsProvider>
      </AuthProvider>
    </MemoryRouter>
  );
  expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "tester" } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "secret" } });
  fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
  expect(await screen.findByText(/signing in/i)).toBeInTheDocument();
});
