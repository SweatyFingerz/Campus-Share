import { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const addToast = useCallback((message, type = "success") => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    setToast({ message, type });

    // Auto-remove after 5 seconds
    timerRef.current = setTimeout(() => {
      setToast(null);
    }, 5000);
  }, []);

  const removeToast = useCallback(() => {
    setToast(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
