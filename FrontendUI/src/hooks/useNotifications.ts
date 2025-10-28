import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export interface Toast {
  id: string;
  message: string;
  variant?: "info" | "success" | "warning" | "error";
}

interface NotificationsContextValue {
  toasts: Toast[];
  notify: (message: string, variant?: Toast["variant"]) => void;
  removeToast: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

// PUBLIC_INTERFACE
export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  /** Provider for in-app toasts with aria-live region in App.tsx. */
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, variant: Toast["variant"] = "info") => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((t) => [...t, { id, message, variant }]);
      // Auto-dismiss after 5s
      setTimeout(() => removeToast(id), 5000);
    },
    [removeToast]
  );

  const ctxValue: NotificationsContextValue = useMemo(
    () => ({ toasts, notify, removeToast }),
    [toasts, notify, removeToast]
  );

  return React.createElement(NotificationsContext.Provider, { value: ctxValue }, children);
}

// PUBLIC_INTERFACE
export function useNotifications(): NotificationsContextValue {
  /** Hook returning notifications state and actions. */
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}
