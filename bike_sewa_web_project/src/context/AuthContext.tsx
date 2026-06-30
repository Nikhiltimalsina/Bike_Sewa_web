"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { AuthUser } from "@/api/auth.api";
import { whoamiApi } from "@/api/user.api";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
   const [user, setUser] = useState<AuthUser | null>(null);
   const [isLoading, setIsLoading] = useState<boolean>(true);

   const refreshUser = useCallback(async () => {
     const hasToken = Boolean(Cookies.get("auth_token"));
     if (!hasToken) {
       setUser(null);
       setIsLoading(false);
       return;
     }

     try {
       const { user: freshUser } = await whoamiApi();
       setUser(freshUser);
     } catch {
       setUser(null);
     } finally {
       setIsLoading(false);
     }
   }, [setUser, setIsLoading]);

useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshUser();
  }, [refreshUser]);

  const logout = useCallback(() => {
    Cookies.remove("auth_token");
    Cookies.remove("user_info");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      refreshUser,
      setUser,
      logout,
    }),
    [user, isLoading, refreshUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}