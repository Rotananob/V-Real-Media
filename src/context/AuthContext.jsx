import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdTokenResult
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check and extract admin custom claim
  const checkAdminClaim = async (currentUser) => {
    if (!currentUser) {
      setIsAdmin(false);
      return false;
    }
    try {
      const tokenResult = await getIdTokenResult(currentUser, true);
      const hasAdminClaim = Boolean(tokenResult.claims && tokenResult.claims.admin === true);
      setIsAdmin(hasAdminClaim);
      return hasAdminClaim;
    } catch (err) {
      console.error('[AuthContext] Error retrieving token claims:', err);
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await checkAdminClaim(currentUser);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setError(null);
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase is not configured in .env. Please provide VITE_FIREBASE_* variables.');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const isUserAdmin = await checkAdminClaim(userCredential.user);
      return { user: userCredential.user, isAdmin: isUserAdmin };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    setIsAdmin(false);
  };

  const refreshAdminStatus = async () => {
    if (user) {
      return await checkAdminClaim(user);
    }
    return false;
  };

  const value = {
    user,
    isAdmin,
    loading,
    error,
    login,
    logout,
    refreshAdminStatus,
    isFirebaseConfigured
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
