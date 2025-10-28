import { render } from "@testing-library/react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@hooks/useAuth";
import { NotificationsProvider } from "@hooks/useNotifications";

test("router renders without crashing", () => {
  const qc = new QueryClient();
  render(
    <AuthProvider>
      <NotificationsProvider>
        <QueryClientProvider client={qc}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
});
