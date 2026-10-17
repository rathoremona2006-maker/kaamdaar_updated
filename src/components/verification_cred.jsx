import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './verification_cred.css';

const VerificationCred = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: '',
    mobile: '',
    country_code: '+91',
    email: '',
    termsAccepted: false,
    privacyAccepted: false,
  });

  const [verificationMethod, setVerificationMethod] = useState('mobile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateField = (event) => {
    const { name, value, checked, type } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const fullName = form.full_name.trim();
    const email = form.email.trim().toLowerCase();
    const mobile = form.mobile.replace(/\D/g, '');

    if (fullName.length < 2 || fullName.length > 100) {
      setError('Name must contain 2–100 characters.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!form.termsAccepted || !form.privacyAccepted) {
      setError('Please accept the Terms and Privacy Policy.');
      return;
    }

    const registrationDraft = {
      full_name: fullName,
      mobile: `${form.country_code}${mobile}`,
      email,
      verificationMethod,
    };

    // PREVIEW MODE — ACTIVE
    // Abhi API call nahi hogi.

    try {
      sessionStorage.setItem(
        'kaamdaar_registration_draft',
        JSON.stringify(registrationDraft)
      );
    } catch {
      setError('Unable to save details in this browser.');
      return;
    }

    const destination =
      verificationMethod === 'mobile'
        ? '/signup/verify-mobile'
        : '/signup/verify-email';

    const maskedDestination =
      verificationMethod === 'mobile'
        ? `${form.country_code}••••••${mobile.slice(-4)}`
        : email.replace(/^(.{2}).*(@.*)$/, '$1***$2');

    navigate(destination, {
      state: {
        draft: registrationDraft,
        verificationMethod,
        maskedDestination,
        previewMode: true,
      },
    });

    // DYNAMIC API MODE — COMMENTED FOR NOW
    // Backend ready hone par preview navigation disable karke
    // ye API request enable karna.

    /*
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/otp/request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mobile: registrationDraft.mobile,
            email: registrationDraft.email,
            purpose: 'registration',
            verification_method: verificationMethod,
          }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || 'Unable to send OTP. Please try again.'
        );
      }

      navigate(destination, {
        state: {
          draft: registrationDraft,
          verificationMethod,
          maskedDestination,
          previewMode: false,
        },
      });
    } catch (err) {
      setError(
        err.message || 'Could not connect to the server.'
      );
    } finally {
      setLoading(false);
    }
    */
  };
    return (
    <div className="signup-page">
      <header className="signup-header">
        <Link to="/" className="signup-logo" aria-label="Kaamdaar home">
          Kaam<span>da</span>ar
        </Link>

        <button
          className="signup-header-button"
          type="button"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        >
          Sign Up
        </button>
      </header>

      <main className="signup-main">
        <section className="signup-intro">
          <span className="signup-eyebrow">JOIN KAAMDAAR</span>

          <h1>
            Create your <span>account</span>
          </h1>

          <p>
            A few simple steps to get started and book trusted home services.
          </p>

          <div className="signup-benefits">
            <div>
              <span className="benefit-icon">✓</span>
              <span>Quick registration</span>
            </div>

            <div>
              <span className="benefit-icon">◇</span>
              <span>Secure OTP verification</span>
            </div>

            <div>
              <span className="benefit-icon">♙</span>
              <span>Personalized experience</span>
            </div>
          </div>
        </section>

        <section className="signup-card">
          <div className="signup-progress">
            <div className="progress-step active">
              <span>1</span>
              <small>Basic Details</small>
            </div>

            <div className="progress-line" />

            <div className="progress-step">
              <span>2</span>
              <small>OTP Verification</small>
            </div>

            <div className="progress-line" />

            <div className="progress-step">
              <span>3</span>
              <small>Profile</small>
            </div>
          </div>

          <div className="signup-card-heading">
            <h2>Basic Details</h2>
            <p>Enter your information to continue.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="full_name">
              Full Name <b>*</b>
            </label>

            <input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="Enter your full name"
              value={form.full_name}
              onChange={updateField}
              minLength={2}
              maxLength={100}
              autoComplete="name"
              required
            />

            <label htmlFor="mobile">
              Mobile Number <b>*</b>
            </label>

            <div className="signup-mobile-field">
              <select
                name="country_code"
                aria-label="Country calling code"
                value={form.country_code}
                onChange={updateField}
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+971">🇦🇪 +971</option>
              </select>

              <input
                id="mobile"
                name="mobile"
                type="tel"
                placeholder="Enter mobile number"
                value={form.mobile}
                onChange={updateField}
                autoComplete="tel-national"
                inputMode="numeric"
                maxLength={15}
                required
              />
            </div>

            <label htmlFor="email">
              Email Address <b>*</b>
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={form.email}
              onChange={updateField}
              autoComplete="email"
              required
            />

            <div className="signup-consents">
              <label className="consent-row">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={form.termsAccepted}
                  onChange={updateField}
                  required
                />

                <span>
                  I agree to the{' '}
                  <Link to="/terms">Terms and Conditions</Link>.
                </span>
              </label>

              <label className="consent-row">
                <input
                  type="checkbox"
                  name="privacyAccepted"
                  checked={form.privacyAccepted}
                  onChange={updateField}
                  required
                />

                <span>
                  I acknowledge the{' '}
                  <Link to="/privacy">Privacy Policy</Link>.
                </span>
              </label>
            </div>

            <fieldset className="verification-choice">
              <legend>Verify your account using</legend>

              <label
                className={`verification-option ${
                  verificationMethod === 'mobile' ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="verificationMethod"
                  value="mobile"
                  checked={verificationMethod === 'mobile'}
                  onChange={(event) =>
                    setVerificationMethod(event.target.value)
                  }
                />

                <span className="verification-option-icon">☎</span>

                <span>
                  <strong>Mobile OTP</strong>
                  <small>Receive a code on your phone</small>
                </span>
              </label>

              <label
                className={`verification-option ${
                  verificationMethod === 'email' ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="verificationMethod"
                  value="email"
                  checked={verificationMethod === 'email'}
                  onChange={(event) =>
                    setVerificationMethod(event.target.value)
                  }
                />

                <span className="verification-option-icon">✉</span>

                <span>
                  <strong>Email OTP</strong>
                  <small>Receive a code in your inbox</small>
                </span>
              </label>
            </fieldset>

            {error && (
              <p className="signup-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="signup-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Sending OTP...'
                : `Continue with ${
                    verificationMethod === 'mobile' ? 'Mobile' : 'Email'
                  } OTP →`}
            </button>

            <p className="signup-login-note">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
};

export default VerificationCred;