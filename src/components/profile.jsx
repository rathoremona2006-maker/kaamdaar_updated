import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './profile.css';

// FUTURE API INTEGRATION — COMMENTED FOR NOW
// import { API_ROUTES } from '../api/api.jsx';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [draft, setDraft] = useState(null);
  const [verificationToken, setVerificationToken] = useState('');
  const [verificationMethod, setVerificationMethod] = useState('mobile');
  const [previewMode, setPreviewMode] = useState(false);

  const [form, setForm] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // ==========================================
  // LOAD REGISTRATION DETAILS
  // Accept preview navigation without an API token.
  // ==========================================

  useEffect(() => {
    let savedDraft = location.state?.draft;

    if (!savedDraft) {
      try {
        savedDraft = JSON.parse(
          sessionStorage.getItem('kaamdaar_registration_draft') || 'null'
        );
      } catch {
        savedDraft = null;
      }
    }

    const isPreview = location.state?.previewMode === true;

    const token = location.state?.verificationToken || '';

    const method =
      location.state?.verificationMethod ||
      savedDraft?.verificationMethod ||
      'mobile';

    // No registration draft means the signup flow
    // was not completed properly.
    if (!savedDraft) {
      navigate('/signup', { replace: true });
      return;
    }

    // In preview mode, no real verification token is needed.
    // In dynamic mode, a verified token is required.
    if (!isPreview && !token) {
      navigate('/signup', { replace: true });
      return;
    }

    setDraft(savedDraft);
    setVerificationToken(token);
    setVerificationMethod(method);
    setPreviewMode(isPreview);
  }, [location.state, navigate]);

  // ==========================================
  // FORM INPUT HANDLING
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
  };

  // ==========================================
  // COMPLETE REGISTRATION
  // PREVIEW MODE — ACTIVE
  // No API call will be made.
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.address.trim()) {
      setError('Please enter your house or street address.');
      return;
    }

    if (!form.city.trim()) {
      setError('Please enter your city.');
      return;
    }

    if (!form.state.trim()) {
      setError('Please enter your state.');
      return;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      setError('Please enter a valid 6-digit PIN code.');
      return;
    }

    // PREVIEW MODE
    // Save no account to the database.
    // Only show the success screen for UI testing.

    if (previewMode) {
      sessionStorage.removeItem('kaamdaar_registration_draft');
      setSuccess(true);
      return;
    }

    // ==========================================
    // DYNAMIC API MODE — COMMENTED FOR NOW
    // Enable when the backend is ready.
    // ==========================================

    /*
    setLoading(true);

    try {
      const response = await fetch(
        API_ROUTES.auth.registerCustomer,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${verificationToken}`,
          },
          body: JSON.stringify({
            ...draft,
            ...form,
            verification_method: verificationMethod,
            verification_token: verificationToken,
          }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || 'Registration could not be completed.'
        );
      }

      sessionStorage.removeItem('kaamdaar_registration_draft');
      setSuccess(true);
    } catch (err) {
      setError(
        err.message || 'Unable to complete registration. Please try again.'
      );
    } finally {
      setLoading(false);
    }
    */
  };

  // Wait until registration details have been loaded.
  if (!draft) {
    return null;
  }

  // ==========================================
  // SUCCESS SCREEN
  // ==========================================

  if (success) {
    return (
      <div className="profile-page">
        <header className="signup-header">
          <Link to="/" className="signup-brand" aria-label="Kaamdaar home">
            <span className="signup-brand-mark">K</span>
            <span>
              Kaam<span className="signup-brand-accent">daar</span>
            </span>
          </Link>

          <Link to="/signup" className="signup-header-link">
            Sign Up
          </Link>
        </header>

        <main className="profile-main">
          <section className="profile-card profile-success-card">
            <div className="profile-success-icon" aria-hidden="true">
              ✓
            </div>

            <p className="profile-step">REGISTRATION COMPLETE</p>

            <h1>Welcome to Kaamdaar!</h1>

            <p className="profile-intro">
              Your registration flow is complete. Thank you for joining
              Kaamdaar.
            </p>

            <Link to="/" className="profile-submit profile-home-link">
              Go to Home <span aria-hidden="true">→</span>
            </Link>
          </section>
        </main>

        <footer className="signup-footer">
          © {new Date().getFullYear()} Kaamdaar. All rights reserved.
        </footer>
      </div>
    );
  }

  // ==========================================
  // PROFILE FORM
  // ==========================================

  return (
    <div className="profile-page">
      <header className="signup-header">
        <Link to="/" className="signup-brand" aria-label="Kaamdaar home">
          <span className="signup-brand-mark">K</span>
          <span>
            Kaam<span className="signup-brand-accent">daar</span>
          </span>
        </Link>

        <Link to="/signup" className="signup-header-link">
          Sign Up
        </Link>
      </header>

      <main className="profile-main">
        <section className="profile-card">
          <div className="profile-progress">
            <span className="profile-progress-done" />
            <span className="profile-progress-done" />
            <span className="profile-progress-current" />
          </div>

          <p className="profile-step">STEP 3 OF 3</p>

          <h1>Complete your profile</h1>

          <p className="profile-intro">
            Just a few more details so we can serve you better.
          </p>

          <div className="profile-verified">
            <span className="profile-verified-check">✓</span>

            <div>
              <strong>
                {previewMode
                  ? 'Verification preview'
                  : verificationMethod === 'email'
                    ? 'Email verified'
                    : 'Mobile verified'}
              </strong>

              <p>
                {verificationMethod === 'email'
                  ? draft.email
                  : draft.mobile}
              </p>
            </div>
          </div>

          <div className="profile-personal-summary">
            <span className="profile-avatar">
              {(draft.full_name || draft.fullName || 'K')
                .trim()
                .charAt(0)
                .toUpperCase()}
            </span>

            <div>
              <strong>{draft.full_name || draft.fullName || 'Your name'}</strong>
              <p>{draft.email || draft.mobile || 'Account details'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="profile-field">
              <label htmlFor="address">
                House / Street Address <span>*</span>
              </label>

              <input
                id="address"
                name="address"
                type="text"
                placeholder="House no., street, area"
                value={form.address}
                onChange={handleChange}
                maxLength={250}
                autoComplete="street-address"
                required
              />
            </div>

            <div className="profile-form-row">
              <div className="profile-field">
                <label htmlFor="city">
                  City <span>*</span>
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Your city"
                  value={form.city}
                  onChange={handleChange}
                  maxLength={100}
                  autoComplete="address-level2"
                  required
                />
              </div>

              <div className="profile-field">
                <label htmlFor="state">
                  State <span>*</span>
                </label>

                <input
                  id="state"
                  name="state"
                  type="text"
                  placeholder="Your state"
                  value={form.state}
                  onChange={handleChange}
                  maxLength={100}
                  autoComplete="address-level1"
                  required
                />
              </div>
            </div>

            <div className="profile-field">
              <label htmlFor="pincode">
                PIN Code <span>*</span>
              </label>

              <input
                id="pincode"
                name="pincode"
                type="text"
                inputMode="numeric"
                placeholder="6-digit PIN code"
                value={form.pincode}
                onChange={(event) => {
                  const value = event.target.value
                    .replace(/\D/g, '')
                    .slice(0, 6);

                  setForm((previous) => ({
                    ...previous,
                    pincode: value,
                  }));

                  setError('');
                }}
                autoComplete="postal-code"
                maxLength={6}
                required
              />
            </div>

            {error && (
              <p className="profile-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="profile-submit"
              disabled={loading || (!previewMode && !verificationToken)}
            >
              {loading ? 'Creating your account...' : 'Complete Registration'}
              {!loading && <span aria-hidden="true">→</span>}
            </button>

            <p className="profile-privacy-note">
              Your details will be used to help provide home services at your
              location.
            </p>
          </form>
        </section>
      </main>

      <footer className="signup-footer">
        © {new Date().getFullYear()} Kaamdaar. All rights reserved.
      </footer>
    </div>
  );
};

export default Profile;