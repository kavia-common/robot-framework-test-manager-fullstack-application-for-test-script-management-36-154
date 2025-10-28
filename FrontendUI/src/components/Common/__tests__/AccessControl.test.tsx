import { render, screen } from "@testing-library/react";
import AccessControl from "../AccessControl";
import { AuthProvider, useAuth } from "@hooks/useAuth";

function WithRole({ role, children }: any) {
  const { login } = useAuth();
  login(role, "pw"); // mock login: username 'admin' -> admin else tester
  return children;
}

test("hides content for unauthorized role", () => {
  render(
    <AuthProvider>
      <WithRole role="tester">
        <AccessControl roles={["admin"]} fallback={<span>no</span>}>
          <span>ok</span>
        </AccessControl>
      </WithRole>
    </AuthProvider>
  );
  expect(screen.getByText("no")).toBeInTheDocument();
});
