import { createContext, useContext, useCallback, useState } from "react";

const ToastContext = createContext(null);
let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "default" }) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-100 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-toast-in w-80 rounded-xl border p-4 shadow-2xl backdrop-blur ${
              t.variant === "destructive"
                ? "border-rose-200 bg-rose-50/95 text-rose-900"
                : "border-emerald-200 bg-emerald-50/95 text-emerald-900"
            }`}
          >
            <p className="text-sm font-semibold">{t.title}</p>
            {t.description && (
              <p className="mt-0.5 text-xs opacity-80">{t.description}</p>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
