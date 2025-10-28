import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import Login from "@pages/Login";
import Tests from "@pages/Tests";
import TestCase from "@pages/TestCase";
import History from "@pages/History";
import NotFound from "@pages/NotFound";
import { useAuth } from "@hooks/useAuth";
import Loading from "@components/Common/Loading";

function Protected({ children }: { children: JSX.Element }) {
  const { isAuthenticated, bootstrapped } = useAuth();
  if (!bootstrapped) return <Loading label="Initializing..." />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <App />
      </Protected>
    ),
    children: [
      { index: true, element: <Navigate to="/tests" replace /> },
      { path: "tests", element: <Tests /> },
      { path: "tests/:id", element: <Tests /> },
      { path: "cases/:id", element: <TestCase /> },
      { path: "history", element: <History /> },
      { path: "*", element: <NotFound /> }
    ]
  },
  { path: "/login", element: <Login /> }
]);
