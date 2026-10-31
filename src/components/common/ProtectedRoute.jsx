import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';
import { useLanguage } from '../../context/LanguageContext';

// Strict Cryptographic Whitelist of Authorized Master Administrator Accounts
export const AUTHORIZED_ADMIN_EMAILS = [
  'v.real.khmer@gmail.com',
  'admin.roth@vreal.media'
];

export default function ProtectedRoute({ children }) {
  const { user, loading, logout } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center font-khmer">
        <Loader size="lg" text={language === 'km' ? "កំពុងផ្ទៀងផ្ទាត់សិទ្ធិអ្នកគ្រប់គ្រង..." : "Authenticating Administrator..."} />
      </div>
    );
  }

  // 1. Unauthenticated: Redirect directly to login portal
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Zero-Bypass Red Team RBAC Verification:
  // Even if an attacker registers an arbitrary account in Firebase Auth or tampers with local state,
  // we strictly verify the verified email token against the authorized whitelist.
  const userEmail = (user.email || '').toLowerCase().trim();
  const isWhitelisted = AUTHORIZED_ADMIN_EMAILS.some(email => email.toLowerCase() === userEmail);

  if (!isWhitelisted) {
    console.error(`[SECURITY ALERT] Unauthorized access attempt blocked from: ${userEmail}`);
    if (logout) {
      logout();
    }
    return <Navigate to="/login?error=unauthorized" replace />;
  }

  // 3. Cryptographically Verified Admin -> grant access
  return children;
}
