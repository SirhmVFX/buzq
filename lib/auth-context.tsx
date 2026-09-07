"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth, firebaseConfigured } from "./firebase";
import { createUserProfile, getUserProfile, updateUserProfile } from "./db";
import type { ThemeMode, UserProfile } from "./types";

interface AuthContextType {
  user: UserProfile | null;
  uid: string | null;
  loading: boolean;
  configured: boolean;
  signup: (opts: { email: string; password: string; displayName: string }) => Promise<UserProfile>;
  login: (email: string, password: string) => Promise<UserProfile>;
  loginWithGoogle: () => Promise<UserProfile>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfileFields: (patch: { displayName?: string; photoURL?: string | null; theme?: ThemeMode }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function authErrorMessage(err: unknown): string {
  const code = err instanceof FirebaseError ? err.code : "";
  switch (code) {
    case "auth/email-already-in-use":
      return "That email is already registered. Try signing in.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Email or password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a moment and try again.";
    case "auth/network-request-failed":
      return "Could not reach the server. Check your connection.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled in Firebase Authentication.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed.";
    default:
      return err instanceof Error ? err.message : "Something went wrong. Please try again.";
  }
}

async function ensureProfile(uid: string, fallback: { email: string; displayName: string; photoURL?: string | null }) {
  const existing = await getUserProfile(uid);
  if (existing) return existing;
  await createUserProfile(uid, fallback);
  const created = await getUserProfile(uid);
  if (!created) throw new Error("Could not create profile");
  return created;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (!fbUser) {
          setUser(null);
          setUid(null);
          return;
        }
        setUid(fbUser.uid);
        const profile = await ensureProfile(fbUser.uid, {
          email: fbUser.email || "",
          displayName: fbUser.displayName || fbUser.email?.split("@")[0] || "Member",
          photoURL: fbUser.photoURL,
        });
        setUser(profile);
      } catch (e) {
        console.error("session restore error:", e);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const signup = useCallback(async (opts: { email: string; password: string; displayName: string }) => {
    const cred = await createUserWithEmailAndPassword(auth, opts.email, opts.password);
    await updateProfile(cred.user, { displayName: opts.displayName });
    const profile = await ensureProfile(cred.user.uid, {
      email: opts.email,
      displayName: opts.displayName,
    });
    setUser(profile);
    setUid(cred.user.uid);
    return profile;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const profile = await ensureProfile(cred.user.uid, {
      email: cred.user.email || email,
      displayName: cred.user.displayName || email.split("@")[0],
      photoURL: cred.user.photoURL,
    });
    setUser(profile);
    setUid(cred.user.uid);
    return profile;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const profile = await ensureProfile(cred.user.uid, {
      email: cred.user.email || "",
      displayName: cred.user.displayName || cred.user.email?.split("@")[0] || "Member",
      photoURL: cred.user.photoURL,
    });
    setUser(profile);
    setUid(cred.user.uid);
    return profile;
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const continueUrl = typeof window !== "undefined" ? `${window.location.origin}/login` : "";
    await sendPasswordResetEmail(auth, email, continueUrl ? { url: continueUrl } : undefined);
  }, []);

  const logout = useCallback(async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setUid(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!uid) return;
    const profile = await getUserProfile(uid);
    if (profile) setUser(profile);
  }, [uid]);

  const updateProfileFields = useCallback(
    async (patch: { displayName?: string; photoURL?: string | null; theme?: ThemeMode }) => {
      if (!uid) return;
      await updateUserProfile(uid, patch);
      await refreshUser();
    },
    [uid, refreshUser]
  );

  const value = useMemo(
    () => ({
      user,
      uid,
      loading,
      configured: firebaseConfigured,
      signup,
      login,
      loginWithGoogle,
      resetPassword,
      logout,
      refreshUser,
      updateProfileFields,
    }),
    [user, uid, loading, signup, login, loginWithGoogle, resetPassword, logout, refreshUser, updateProfileFields]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
