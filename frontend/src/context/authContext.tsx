/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

import {
  loginAdmin,
  logoutAdmin,
  verifyAdmin,
  setToken,
  clearToken,
} from "../api/admin";

import type { AuthContextType, LoginCredentials } from "../types/auth.types";


const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children}: {children: ReactNode}) {
  // Authentication state is kept in one provider so protected routes and the
  // header can react consistently to login and logout events.
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // The app validates any persisted token on first render so the UI reflects the
  // server's current auth state before the user interacts with protected routes.
  useEffect(() => {
    verifyAdmin()
      .then((valid) => setIsAdmin(valid))
      .finally(() => setLoading(false));
  }, []);

  // login function that calls the loginAdmin API function and sets the token in sessionstorage if successful
  const login = useCallback(
    async ( credentials: LoginCredentials) => {
      try {
        const token =await loginAdmin(credentials);
        setToken(token);
        setIsAdmin(true);
        return true;
      } catch {
        return false;
      }
    },
    [] 
  );

  // logout function that calls the logoutAdmin API function and clears the token from sessionStorage
  const logout = useCallback(async (): Promise<void> => {
    await logoutAdmin();
    clearToken();
    setIsAdmin(false);
  }, []);

  // Exposing the auth state and handlers through context keeps the component tree
  // decoupled from direct localStorage and API logic.
  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout}}>
      {children}
    </AuthContext.Provider>
  );

}

// custom hook to use the auth context
// instead of using useContext(AuthContext) directly we can use this hook to get the auth state and functions
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
