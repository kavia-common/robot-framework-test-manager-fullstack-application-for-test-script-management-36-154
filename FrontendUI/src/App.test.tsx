import { render, screen } from "@testing-library/react";
import App from "./App";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "@hooks/useAuth";
import { NotificationsProvider } from "@hooks/useNotifications";

test("renders app shell heading", () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </AuthProvider>
    </MemoryRouter>
  );
  expect(screen.getByRole("banner")).toBeInTheDocument();
});
