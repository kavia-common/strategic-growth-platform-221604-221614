import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react';
import '../styles/Login.css';

// PUBLIC_INTERFACE
/**
 * Login page for users to authenticate using Supabase email/password.
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Back to Home Link - Mobile */}
      <div className="login-back-link">
        <Link to="/" className="login-back-btn">
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="login-wrapper">
        {/* Left Panel - Brand/Illustration (Desktop Only) */}
        <div className="login-brand-panel">
          <div className="login-brand-content">
            <div className="login-brand-header">
              <div className="login-brand-logo">
                <span className="login-logo-icon">
                  <Sparkles size={28} />
                </span>
                <span className="login-logo-text">SGE</span>
              </div>
              <h1 className="login-brand-title">Strategic Growth Engine</h1>
              <p className="login-brand-subtitle">
                Empowering organizations with AI-driven insights and intelligent collaboration
              </p>
            </div>
            
            <div className="login-illustration">
              <div className="login-illustration-circle login-circle-1"></div>
              <div className="login-illustration-circle login-circle-2"></div>
              <div className="login-illustration-circle login-circle-3"></div>
            </div>

            <div className="login-brand-features">
              <div className="login-feature-item">
                <div className="login-feature-icon">✓</div>
                <span>Enterprise-grade security</span>
              </div>
              <div className="login-feature-item">
                <div className="login-feature-icon">✓</div>
                <span>AI-powered analytics</span>
              </div>
              <div className="login-feature-item">
                <div className="login-feature-icon">✓</div>
                <span>Real-time collaboration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="login-form-panel">
          <div className="login-form-container">
            <div className="login-form-header">
              <h2 className="login-form-title">Welcome Back</h2>
              <p className="login-form-subtitle">Sign in to your account to continue</p>
            </div>

            {error && (
              <div className="login-error-alert" role="alert">
                <strong>Error:</strong> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
              <div className="login-form-group">
                <label htmlFor="email" className="login-label">
                  Email Address
                </label>
                <div className="login-input-wrapper">
                  <Mail className="login-input-icon" size={18} aria-hidden="true" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                    placeholder="you@company.com"
                    aria-label="Email Address"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="login-form-group">
                <label htmlFor="password" className="login-label">
                  Password
                </label>
                <div className="login-input-wrapper">
                  <Lock className="login-input-icon" size={18} aria-hidden="true" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input login-input-password"
                    placeholder="••••••••"
                    aria-label="Password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login-password-toggle"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="login-form-options">
                <label className="login-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="login-checkbox"
                    aria-label="Remember me"
                  />
                  <span className="login-checkbox-text">Remember me</span>
                </label>
                <Link to="/forgot-password" className="login-forgot-link">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="login-submit-btn"
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span className="login-spinner" aria-hidden="true"></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="login-form-footer">
              <p className="login-footer-text">
                Don't have an account?{' '}
                <Link to="/signup" className="login-footer-link">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
