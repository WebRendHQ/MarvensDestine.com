"use client";

import { onAuthStateChanged, User } from 'firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '@/lib/firebase';

type AuthContextValue = {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue>({ user: null, isAdmin: false, isLoading: true });

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      const allow = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      setIsAdmin(!!u?.email && allow.includes(u.email!));
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const value = useMemo(() => ({ user, isAdmin, isLoading }), [user, isAdmin, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


