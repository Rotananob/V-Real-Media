import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Lock, Mail, ArrowLeft, AlertCircle, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { BRAND } from '../config/brand';
import { AUTHORIZED_ADMIN_EMAILS } from '../components/common/ProtectedRoute';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lockoutUntil, setLockoutUntil] = useState(0);

  const { login } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  // Check for unauthorized redirect error
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('error') === 'unauthorized') {
      setErrorMsg(
        language === 'km'
          ? 'ការចូលប្រើប្រាស់ត្រូវបានបដិសេធ៖ គណនីនេះមិនមានឈ្មោះក្នុងបញ្ជីអ្នកគ្រប់គ្រងឡើយ។'
          : 'Access denied: Your account is not on the authorized administrator whitelist.'
      );
    }
  }, [location.search, language]);

  // Load lockout state from sessionStorage
  useEffect(() => {
    const savedLockout = sessionStorage.getItem('admin_login_lockout');
    if (savedLockout) {
      const lockTime = parseInt(savedLockout, 10);
      if (lockTime > Date.now()) {
        setLockoutUntil(lockTime);
      } else {
        sessionStorage.removeItem('admin_login_lockout');
      }
    }
  }, []);

  const isLockedOut = lockoutUntil > Date.now();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isLockedOut) {
      const remainingSeconds = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setErrorMsg(
        language === 'km'
          ? `ប្រព័ន្ធសុវត្ថិភាពបានចាក់សោបណ្តោះអាសន្ន។ សូមរង់ចាំ ${remainingSeconds} វិនាទីទៀត។`
          : `Security lockout active. Please wait ${remainingSeconds} seconds.`
      );
      return;
    }

    const cleanEmail = (email || '').toLowerCase().trim();
    if (!cleanEmail || !password) {
      setErrorMsg(
        language === 'km'
          ? 'សូមបញ្ចូលអ៊ីមែល និងពាក្យសម្ងាត់របស់អ្នក។'
          : 'Please enter both email and password.'
      );
      return;
    }

    // Zero-Bypass Pre-Validation:
    // Reject any email not on the authorized admin whitelist without leaking existence
    const isWhitelisted = AUTHORIZED_ADMIN_EMAILS.some(
      (adminEmail) => adminEmail.toLowerCase() === cleanEmail
    );

    if (!isWhitelisted) {
      recordFailedAttempt();
      setErrorMsg(
        language === 'km'
          ? 'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវឡើយ។'
          : 'Invalid credentials. Access restricted to authorized personnel only.'
      );
      return;
    }

    setSubmitting(true);
    try {
      await login(cleanEmail, password);
      sessionStorage.removeItem('admin_failed_attempts');
      sessionStorage.removeItem('admin_login_lockout');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Authentication failure:', err.code);
      recordFailedAttempt();

      let message =
        language === 'km'
          ? 'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវឡើយ។'
          : 'Invalid email or password.';

      if (err.code === 'auth/too-many-requests') {
        message =
          language === 'km'
            ? 'ការប៉ុនប៉ងចូលច្រើនដងពេក។ ប្រព័ន្ធត្រូវបានចាក់សោជាបណ្តោះអាសន្ន។'
            : 'Too many failed attempts. Temporary lockout engaged.';
      }
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  const recordFailedAttempt = () => {
    const attempts = parseInt(sessionStorage.getItem('admin_failed_attempts') || '0', 10) + 1;
    sessionStorage.setItem('admin_failed_attempts', attempts.toString());

    if (attempts >= MAX_FAILED_ATTEMPTS) {
      const lockTime = Date.now() + LOCKOUT_DURATION_MS;
      sessionStorage.setItem('admin_login_lockout', lockTime.toString());
      setLockoutUntil(lockTime);
      setErrorMsg(
        language === 'km'
          ? 'ការប៉ុនប៉ងមិនជោគជ័យលើសកំណត់ ៥ ដង។ ប្រព័ន្ធត្រូវបានចាក់សោសុវត្ថិភាព ៥ នាទី។'
          : 'Exceeded 5 failed attempts. Security lockout active for 5 minutes.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 relative font-khmer">
      {/* Top Bar: Back Link & Language Switcher */}
      <div className="absolute top-8 left-8 right-8 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'km' ? 'ត្រឡប់ទៅគេហទំព័រ' : 'Back to Site'}</span>
        </Link>

        {/* Clean Language Segmented Control */}
        <div className="flex items-center bg-neutral-100 border border-neutral-200 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setLanguage('km')}
            className={`px-2.5 py-1 rounded transition text-xs font-khmer ${
              language === 'km' ? 'bg-white text-neutral-900 font-bold shadow-xs' : 'text-neutral-600'
            }`}
          >
            ខ្មែរ
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded transition text-xs font-mono ${
              language === 'en' ? 'bg-white text-neutral-900 font-bold shadow-xs' : 'text-neutral-600'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl overflow-hidden border border-neutral-200 bg-white shadow-sm flex items-center justify-center p-0.5">
            <img
              src="/assets/logo.jpg"
              alt="V-Real Media"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            {t.admin.portalTitle}
          </h2>
          <p className="text-xs text-neutral-500 mt-1 font-mono tracking-wider">
            {t.admin.portalSub}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {isLockedOut && (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-semibold">
                {language === 'km'
                  ? 'គណនីស្ថិតក្នុងការការពារចាក់សោ។ សូមរង់ចាំការកំណត់ឡើងវិញ។'
                  : 'Account lockout in effect. Brute-force protection engaged.'}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                {t.admin.loginEmail}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  disabled={isLockedOut || submitting}
                  placeholder="v.real.khmer@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-neutral-900 focus:outline-none text-neutral-900 text-sm placeholder-neutral-400 transition disabled:bg-neutral-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  {t.admin.loginPassword}
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isLockedOut || submitting}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-neutral-900 focus:outline-none text-neutral-900 text-sm placeholder-neutral-400 transition disabled:bg-neutral-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || isLockedOut}
              className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.admin.loginVerify}</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>{t.admin.loginSubmit}</span>
                </>
              )}
            </button>
          </form>

          {/* Security Information */}
          <div className="mt-8 pt-6 border-t border-neutral-100 text-xs text-neutral-500 space-y-1.5">
            <div className="flex items-center gap-1.5 text-neutral-700">
              <span className="w-2 h-2 rounded-full bg-accent-red" />
              <span className="font-semibold">
                {language === 'km' ? 'សុវត្ថិភាព Zero-Bypass RBAC' : 'Zero-Bypass RBAC Protection'}
              </span>
            </div>
            <p className="leading-relaxed">
              {language === 'km'
                ? 'ការពារដោយ Firebase Auth, Cloud Firestore Rules និងការកម្រិតការប៉ុនប៉ង Brute-Force ដោយស្វ័យប្រវត្តិ។'
                : 'Secured via Firebase Authentication, strict Cloud Firestore Rules, and automated anti-brute force rate limiting.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
