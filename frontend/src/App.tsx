import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import JobDetailPage from './pages/JobDetailPage';
import SavedJobsPage from './pages/SavedJobsPage';
import TrackerPage from './pages/TrackerPage';
import CVBuilderPage from './pages/CVBuilderPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import NotFoundPage from './pages/NotFoundPage';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import { useJobStore } from './store/jobStore';
import { api } from './lib/api';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const loadJobs = useJobStore((s) => s.loadJobs);
  useEffect(() => {
    // load jobs initially
    loadJobs?.({ limit: 20, offset: 0 });

    const existingToken = api.getToken();
    if (existingToken) {
      api.get('/auth/me')
        .then((me) => {
          useAuthStore.setState({ user: me, isAuthenticated: true });
          loadJobs?.({ limit: 20, offset: 0 });
        })
        .catch(() => {
          api.clearToken();
        });
    }

    // If redirected back from OAuth with a token in the URL, capture it
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      if (token) {
        api.setToken(token);
        // remove token from URL
        const url = new URL(window.location.href);
        url.searchParams.delete('token');
        window.history.replaceState({}, document.title, url.toString());
        // fetch user profile and populate auth store
        api.get('/auth/me').then((me) => {
          useAuthStore.setState({ user: me, isAuthenticated: true });
          // refresh jobs & saved jobs now that we're authenticated
          loadJobs?.({ limit: 20, offset: 0 });
        }).catch(() => {
          // ignore
        });
      }
    } catch (e) {
      // ignore parsing errors
    }
  }, [loadJobs]);
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            
            {/* Protected Routes */}
            <Route path="/saved" element={
              <ProtectedRoute>
                <SavedJobsPage />
              </ProtectedRoute>
            } />
            <Route path="/tracker" element={
              <ProtectedRoute>
                <TrackerPage />
              </ProtectedRoute>
            } />
            <Route path="/cv-builder" element={
              <ProtectedRoute>
                <CVBuilderPage />
              </ProtectedRoute>
            } />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>

      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </Router>
  );
}
