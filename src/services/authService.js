import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdTokenResult
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';

/**
 * Sign in admin user with email and password
 */
export async function loginWithEmail(email, password) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase credentials are not configured in your .env file.');
  }

  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const tokenResult = await getIdTokenResult(userCredential.user, true);
  
  const isAdmin = Boolean(tokenResult.claims && tokenResult.claims.admin === true);

  return {
    user: userCredential.user,
    isAdmin,
    claims: tokenResult.claims
  };
}

/**
 * Sign out current user
 */
export async function logoutUser() {
  if (!auth) return;
  await signOut(auth);
}

/**
 * Verify whether the given user has administrator custom claims
 */
export async function verifyAdminClaim(user, forceRefresh = true) {
  if (!user) return false;
  try {
    const tokenResult = await getIdTokenResult(user, forceRefresh);
    return Boolean(tokenResult.claims && tokenResult.claims.admin === true);
  } catch (error) {
    console.error('[authService] Error verifying admin claim:', error);
    return false;
  }
}

/**
 * Listen to auth state changes and verify admin status
 */
export function subscribeToAuth(callback) {
  if (!auth) {
    callback(null, false, false);
    return () => {};
  }

  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const isAdmin = await verifyAdminClaim(user);
      callback(user, isAdmin, false);
    } else {
      callback(null, false, false);
    }
  });
}
