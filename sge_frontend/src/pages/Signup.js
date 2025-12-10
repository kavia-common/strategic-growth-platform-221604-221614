import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Building, Eye, EyeOff, ArrowLeft, Sparkles, CheckCircle, XCircle } from 'lucide-react';

// PUBLIC_INTERFACE
/**
 * Signup component - User registration page
 * Features split layout on desktop, centered card on mobile
 * Includes password visibility toggle and live validation
 */
const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Live password mismatch validation
  useEffect(() => {
    if (confirmPasswordTouched && confirmPassword.length > 0) {
      setPasswordMismatch(password !== confirmPassword);
    }
  }, [password, confirmPassword, confirmPasswordTouched]);

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Sign up with Supabase
      const { data, error } = await signUp(email, password, {
        organization_name: orgName
      });

      if (error) throw error;
      
      if (data.user) {
        // Step 2: Call onboarding endpoint to create organization and profile
        try {
          // Get the session to retrieve access token
          const { data: sessionData } = await supabase.auth.getSession();
          const accessToken = sessionData?.session?.access_token;

          if (!accessToken) {
            console.warn('No access token available, skipping onboarding call');
            navigate('/dashboard');
            return;
          }

          // Call the onboarding endpoint
          const apiBase = process.env.REACT_APP_API_BASE || 'http://localhost:3001';
          const onboardingUrl = `${apiBase}/api/onboarding/complete`;

          const response = await fetch(onboardingUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              organization_name: orgName || 'Default Organization'
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Onboarding failed:', errorData);
            // Don't block navigation - user can complete onboarding later
            setError(`Account created but onboarding incomplete: ${errorData.error || 'Unknown error'}`);
          } else {
            const result = await response.json();
            console.log('Onboarding completed:', result);
          }
        } catch (onboardingError) {
          console.error('Onboarding error:', onboardingError);
          // Don't block navigation - gracefully handle onboarding failure
          setError('Account created successfully. You may need to complete setup in your profile.');
        }

        // Navigate to dashboard regardless of onboarding outcome
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Back to Home Link */}
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
              <h1 className="login-brand-title">Join Strategic Growth Engine</h1>
              <p className="login-brand-subtitle">
                Start your journey with powerful AI-driven insights and intelligent collaboration tools
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
                <span>Free 14-day trial</span>
              </div>
              <div className="login-feature-item">
                <div className="login-feature-icon">✓</div>
                <span>No credit card required</span>
              </div>
              <div className="login-feature-item">
                <div className="login-feature-icon">✓</div>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="login-form-panel">
          <div className="login-form-container">
            <div className="login-form-header">
              <h2 className="login-form-title">Create Your Account</h2>
              <p className="login-form-subtitle">Get started with SGE Platform today</p>
            </div>

            {error && (
              <div className="login-error-alert" role="alert">
                <strong>Error:</strong> {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="login-form">
              <div className="login-form-group">
                <label htmlFor="signup-email" className="login-label">
                  Email Address
                </label>
                <div className="login-input-wrapper">
                  <Mail className="login-input-icon" size={18} aria-hidden="true" />
                  <input
                    id="signup-email"
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
                <label htmlFor="signup-org" className="login-label">
                  Organization Name <span style={{ color: 'var(--text-secondary)', fontWeight: 'normal' }}>(Optional)</span>
                </label>
                <div className="login-input-wrapper">
                  <Building className="login-input-icon" size={18} aria-hidden="true" />
                  <input
                    id="signup-org"
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="login-input"
                    placeholder="Acme Corp"
                    aria-label="Organization Name"
                    autoComplete="organization"
                  />
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.375rem' }}>
                  You can set up your organization later
                </p>
              </div>

              <div className="login-form-group">
                <label htmlFor="signup-password" className="login-label">
                  Password
                </label>
                <div className="login-input-wrapper">
                  <Lock className="login-input-icon" size={18} aria-hidden="true" />
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setPasswordTouched(true)}
                    className="login-input login-input-password"
                    placeholder="••••••••"
                    aria-label="Password"
                    aria-invalid={passwordTouched && password.length > 0 && password.length < 6}
                    aria-describedby="password-helper"
                    autoComplete="new-password"
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
                <p id="password-helper" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.375rem' }}>
                  At least 6 characters
                </p>
              </div>

              <div className="login-form-group">
                <label htmlFor="signup-confirm-password" className="login-label">
                  Confirm Password
                </label>
                <div className="login-input-wrapper">
                  <Lock className="login-input-icon" size={18} aria-hidden="true" />
                  <input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => setConfirmPasswordTouched(true)}
                    className="login-input login-input-password"
                    placeholder="••••••••"
                    aria-label="Confirm Password"
                    aria-invalid={passwordMismatch}
                    aria-describedby="confirm-password-helper"
                    autoComplete="new-password"
                    style={{
                      borderColor: confirmPasswordTouched && confirmPassword.length > 0 
                        ? (passwordMismatch ? 'var(--error-color)' : 'var(--success-color)')
                        : undefined
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="login-password-toggle"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    tabIndex={0}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPasswordTouched && confirmPassword.length > 0 && (
                  <div 
                    id="confirm-password-helper"
                    style={{ 
                      fontSize: '0.8125rem', 
                      marginTop: '0.375rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      color: passwordMismatch ? 'var(--error-color)' : 'var(--success-color)'
                    }}
                  >
                    {passwordMismatch ? (
                      <>
                        <XCircle size={14} />
                        <span>Passwords do not match</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={14} />
                        <span>Passwords match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || passwordMismatch}
                className="login-submit-btn"
                aria-busy={loading}
                style={{ marginTop: '1rem' }}
              >
                {loading ? (
                  <>
                    <span className="login-spinner" aria-hidden="true"></span>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="login-form-footer">
              <p className="login-footer-text">
                Already have an account?{' '}
                <Link to="/login" className="login-footer-link">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
