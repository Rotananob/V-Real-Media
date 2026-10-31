import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';
import { ShieldAlert, RefreshCw, LogOut } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { user, isAdmin, loading, logout, refreshAdminStatus } = useAuth();
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <Loader size="lg" text="Authenticating Administrator..." />
      </div>
    );
  }

  // Not logged in -> send to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but not an administrator (no custom claim { admin: true })
  if (!isAdmin) {
    const handleRefresh = async () => {
      setIsRefreshing(true);
      setRefreshMessage('');
      try {
        const hasAdmin = await refreshAdminStatus();
        if (hasAdmin) {
          setRefreshMessage('Admin claim detected! Reloading dashboard...');
        } else {
          setRefreshMessage('No admin claim found yet on this Firebase token. Please run the admin claim script.');
        }
      } catch (err) {
        setRefreshMessage('Failed to refresh token claims: ' + err.message);
      } finally {
        setIsRefreshing(false);
      }
    };

    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center p-6">
        <div className="max-w-lg w-full p-8 bg-surface border border-accent-red/30 rounded-2xl shadow-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-accent-red/10 border border-accent-red/30 flex items-center justify-center text-accent-red">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-heading font-bold text-white mb-2">
            Administrator Access Required
          </h2>

          <p className="text-sm text-content-secondary mb-6 leading-relaxed">
            Signed in as <span className="text-white font-mono">{user.email}</span>, but this account has not been granted the <code className="bg-surface-elevated px-2 py-0.5 rounded text-accent-red text-xs">admin: true</code> Firebase Custom Claim.
          </p>

          <div className="p-4 bg-background-primary/80 border border-border rounded-xl text-left text-xs space-y-2 mb-6">
            <p className="font-semibold text-content-primary">To grant administrator access to your email:</p>
            <p className="text-content-muted font-mono bg-surface p-2 rounded border border-border/60 select-all">
              node scripts/setAdminClaim.js {user.email}
            </p>
            <p className="text-content-secondary">
              After running this script with your Firebase Service Account, click the button below to refresh your credentials.
            </p>
          </div>

          {refreshMessage && (
            <p className="text-xs text-amber-400 mb-4 font-mono">{refreshMessage}</p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-accent-red text-white text-sm font-semibold hover:bg-accent-darkRed transition flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Token Claim
            </button>
            <button
              onClick={logout}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-surface-elevated text-content-secondary hover:text-white border border-border text-sm font-medium transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
