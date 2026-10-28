import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// This is a lightweight, client-side gate meant to hide edit controls from
// casual visitors — it is NOT real security. The password lives in the
// browser's JS bundle and can be found by anyone who really goes looking
// for it. True protection would require a real backend with server-side
// authentication (e.g. Firebase Auth) checking every write.
//
// CHANGE THIS before you deploy:
const ADMIN_PASSWORD = "password";

const SESSION_KEY = "portfolio_admin";

interface AdminContextValue {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  // Persisted to sessionStorage (not localStorage) so it clears when the
  // browser tab/window closes — you have to log in again next visit,
  // rather than staying "logged in" on a shared or public computer forever.
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(SESSION_KEY) === "true";
  });

  useEffect(() => {
    if (isAdmin) {
      sessionStorage.setItem(SESSION_KEY, "true");
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }, [isAdmin]);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAdmin(false);

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return ctx;
}