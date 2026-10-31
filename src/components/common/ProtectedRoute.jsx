import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';
import { useLanguage } from '../../context/LanguageContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center font-khmer">
        <Loader size="lg" text={language === 'km' ? "កំពុងផ្ទៀងផ្ទាត់សិទ្ធិអ្នកគ្រប់គ្រង..." : "Authenticating Administrator..."} />
      </div>
    );
  }

  // If not logged in -> redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated via Firebase Auth -> allow access to CMS
  return children;
}
