import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './otp_mobile.css';

const OtpMobile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  const [draft, setDraft] = useState(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [seconds, setSeconds] = useState(30);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

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

    if (!savedDraft?.mobile) {
      navigate('/signup', { replace: true });
      return;
    }

    setDraft(savedDraft);
  }, [location.state, navigate]);

  useEffect(() => {
    if (seconds <= 0) return undefined;

    const timer = window.setTimeout(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [seconds]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    setOtp((previous) =>
      previous.map((digit, i) => (i === index ? value : digit))
    );

    setError('');
    setMessage('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);

    if (!pasted) return;

    event.preventDefault();

    setOtp(
      Array.from({ length: 6 }, (_, index) => pasted[index] || '')
    );

    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    setError('');
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const otpValue = otp.join('');

    if (!/^\d{6}$/.test(otpValue)) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }

    // ==========================================
    // PREVIEW MODE — ACTIVE
    // Any six digits work for UI testing.
    // No API call and no real OTP verification.
    // ==========================================

    navigate('/signup/profile', {
      state: {
        draft,
        verificationMethod: 'mobile',
        previewMode: true,
      },
    });

    // ==========================================
    // DYNAMIC API MODE — COMMENTED FOR NOW
    // Enable only when the backend is ready.
    // ==========================================

    /*
    setLoading(true);

    try {
      const response = await fetch(API_ROUTES.auth.verifyOtp, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: draft.mobile,
          otp: otpValue,
          purpose: 'registration',
          verification_method: 'mobile',
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(result.message || 'OTP verification failed.');
      }

      const verificationToken =
        result.verification_token ||
        result.registration_token ||
        result.verification_proof;

      if (!verificationToken) {
        throw new Error('The server did not return a verification token.');
      }

      navigate('/signup/profile', {
        state: {
          draft,
          verificationMethod: 'mobile',
          verificationToken,
          previewMode: false,
        },
      });
    } catch (err) {
      setError(err.message || 'Unable to verify OTP.');
    } finally {
      setLoading(false);
    }
    */
  };

  const handleResend = async () => {
    if (seconds > 0 || resending) return;

    setError('');
    setMessage('');

    // PREVIEW MODE — fake resend, no network request.
    setResending(true);
    setOtp(['', '', '', '', '', '']);
    setSeconds(30);
    setMessage('Preview: OTP resend button is working.');
    setResending(false);
    inputRefs.current[0]?.focus();

    // DYNAMIC API MODE — COMMENTED FOR NOW
    /*
    setResending(true);

    try {
      const response = await fetch(API_ROUTES.auth.requestOtp, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: draft.mobile,
          purpose: 'registration',
          verification_method: 'mobile',
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(result.message || 'Unable to resend OTP.');
      }

      setOtp(['', '', '', '', '', '']);
      setSeconds(30);
      setMessage('A new OTP has been requested.');
    } catch (err) {
      setError(err.message || 'Unable to resend OTP.');
    } finally {
      setResending(false);
    }
    */
  };

  if (!draft) return null;

  const maskedMobile =
    location.state?.maskedDestination ||
    `${String(draft.mobile).slice(0, -4).replace(/\d/g, '•')}${String(
      draft.mobile
    ).slice(-4)}`;

  return (
    <div className="mobile-otp-page">
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

      <main className="mobile-otp-main">
        <section className="mobile-otp-card">
          <div className="mobile-otp-icon" aria-hidden="true">
            <span>☎</span>
          </div>

          <p className="mobile-otp-eyebrow">STEP 2 OF 3</p>
          <h1>Verify your mobile</h1>

          <p className="mobile-otp-description">
            Enter the 6-digit verification code for
          </p>

          <p className="mobile-otp-destination">{maskedMobile}</p>

          <form onSubmit={handleVerify}>
            <label className="mobile-otp-label" htmlFor="mobile-otp-0">
              Enter 6-digit OTP
            </label>

            <div className="mobile-otp-inputs" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  id={`mobile-otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  aria-label={`OTP digit ${index + 1}`}
                  maxLength={1}
                  value={digit}
                  onChange={(event) =>
                    handleChange(event.target.value, index)
                  }
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  required
                />
              ))}
            </div>

            {error && (
              <p className="mobile-otp-error" role="alert">
                {error}
              </p>
            )}

            {message && (
              <p className="mobile-otp-success" role="status">
                {message}
              </p>
            )}

            <button
              className="mobile-otp-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
              {!loading && <span aria-hidden="true">→</span>}
            </button>
          </form>

          <div className="mobile-otp-resend">
            <span>Didn't receive the code?</span>{' '}
            {seconds > 0 ? (
              <span className="mobile-otp-countdown">
                Resend in 00:{String(seconds).padStart(2, '0')}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
              >
                {resending ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </div>


          <Link to="/signup" className="mobile-otp-back">
            ← Back to basic details
          </Link>
        </section>
      </main>

      <footer className="signup-footer">
        © {new Date().getFullYear()} Kaamdaar. All rights reserved.
      </footer>
    </div>
  );
};

export default OtpMobile;