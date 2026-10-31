import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, ArrowLeft, AlertCircle, Info, Sparkles } from 'lucide-react';
import { BRAND } from '../config/brand';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await login(email, password);
      // If signed in, navigate to destination or admin panel
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      let message = err.message || 'Authentication failed. Please verify credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        message = 'Invalid email or password.';
      } else if (err.code === 'auth/user-not-found') {
        message = 'No administrator account found with this email.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Access temporarily blocked due to repeated attempts. Please try again later.';
      }
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background glow and subtle vignette */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent-red/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Back to Home Link */}
      <div className="absolute top-8 left-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-content-muted hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Site</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl overflow-hidden border border-border bg-surface shadow-rec-glow/20 flex items-center justify-center">
            <img
              src="/assets/logo.jpg"
              alt="V-Real Media"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight uppercase">
            CMS Portal
          </h2>
          <p className="text-xs text-content-secondary mt-1 font-mono tracking-wider">
            V-REAL MEDIA ADMINISTRATOR ACCESS
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl">
          
          {!isFirebaseConfigured && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <Info className="w-4 h-4 shrink-0" />
                <span>Firebase Configuration Notice</span>
              </div>
              <p>
                Firebase keys are not configured in your <code className="font-mono bg-black/40 px-1 rounded">.env</code> file yet.
                Add your <code className="font-mono">VITE_FIREBASE_*</code> credentials from Firebase Console to authenticate.
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-accent-red/10 border border-accent-red/30 text-white text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-accent-red shrink-0 mt-0.5" />
              <p className="leading-relaxed">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-heading font-medium text-content-secondary uppercase tracking-wider mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted" />
                <input
                  type="email"
                  required
                  placeholder="v.real.khmer@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background-primary border border-border focus:border-accent-red focus:outline-none text-white text-sm placeholder-content-muted transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-heading font-medium text-content-secondary uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background-primary border border-border focus:border-accent-red focus:outline-none text-white text-sm placeholder-content-muted transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-accent-red hover:bg-accent-darkRed text-white text-xs font-mono uppercase tracking-widest font-bold shadow-rec-glow transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Sign In as Admin</span>
                </>
              )}
            </button>
          </form>

          {/* Security Architecture Note */}
          <div className="mt-8 pt-6 border-t border-border/60 text-[11px] text-content-muted space-y-2">
            <div className="flex items-center gap-1.5 text-content-secondary font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-red" />
              <span>RBAC & Custom Claim Security</span>
            </div>
            <p className="leading-relaxed">
              Administrative privileges are enforced via Firebase Custom Claims (<code className="text-white font-mono">admin: true</code>) and verified by Cloud Firestore & Storage Security Rules.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
