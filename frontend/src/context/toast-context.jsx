import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback(({ type = 'info', message }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast: add }}>
      {children}
      <ToastList />
    </ToastContext.Provider>
  );
}

function ToastList() {
  const { toasts } = useContext(ToastContext);
  if (!toasts.length) return null;
  return (
    <div
      className="toast-list"
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={`toast toast-${t.type}`}
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            maxWidth: 360,
            background:
              t.type === 'success'
                ? '#d4edda'
                : t.type === 'error'
                  ? '#f8d7da'
                  : t.type === 'warning'
                    ? '#fff3cd'
                    : '#e2e3e5',
            color:
              t.type === 'success'
                ? '#155724'
                : t.type === 'error'
                  ? '#721c24'
                  : t.type === 'warning'
                    ? '#856404'
                    : '#383d41',
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
