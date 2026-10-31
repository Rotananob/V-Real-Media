import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Lock, Mail, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { BRAND } from '../config/brand';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, isFirebaseConfigured } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg(language === 'km' ? 'សូមបញ្ចូលអ៊ីមែល និងពាក្យសម្ងាត់របស់អ្នក។' : 'Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      let message = err.message || (language === 'km' ? 'ការចូលប្រើប្រព័ន្ធមិនជោគជ័យទេ។ សូមពិនិត្យព័ត៌មានម្តងទៀត។' : 'Authentication failed.');
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        message = language === 'km' ? 'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវឡើយ។' : 'Invalid email or password.';
      } else if (err.code === 'auth/user-not-found') {
        message = language === 'km' ? 'រកមិនឃើញគណនីអ្នកគ្រប់គ្រងជាមួយអ៊ីមែលនេះឡើយ។' : 'No administrator account found with this email.';
      } else if (err.code === 'auth/too-many-requests') {
        message = language === 'km' ? 'ការប៉ុនប៉ងចូលច្រើនដងពេក។ សូមរង់ចាំមួយភ្លែត។' : 'Too many attempts. Please try again later.';
      }
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 relative font-khmer">
      
      {/* Top Bar: Back Link & Language Switcher (Zero Emojis) */}
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
            className={`px-2.5 py-1 rounded transition text-xs font-khmer ${language === 'km' ? 'bg-white text-neutral-900 font-bold shadow-xs' : 'text-neutral-600'}`}
          >
            ខ្មែរ
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded transition text-xs font-mono ${language === 'en' ? 'bg-white text-neutral-900 font-bold shadow-xs' : 'text-neutral-600'}`}
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
                  placeholder="v.real.khmer@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-neutral-900 focus:outline-none text-neutral-900 text-sm placeholder-neutral-400 transition"
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
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-neutral-900 focus:outline-none text-neutral-900 text-sm placeholder-neutral-400 transition"
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
              disabled={submitting}
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
              <span className="font-semibold">{language === 'km' ? 'សុវត្ថិភាព Firebase Authentication' : 'Firebase Authentication'}</span>
            </div>
            <p className="leading-relaxed">
              {language === 'km' 
                ? 'ប្រព័ន្ធប្រើប្រាស់ Firebase Auth ដើម្បីការពារទិន្នន័យ និងគ្រប់គ្រងសិទ្ធិដោយផ្ទាល់។'
                : 'Secured via Firebase Authentication and verified by Cloud Firestore & Storage Security Rules.'}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
