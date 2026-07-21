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
  // track if a user is logged in as an admin and if the auth state is still loading
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // check if the user has a valid admin JWT token on initial load
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

  // provide the auth state and functions to the rest of the app
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
