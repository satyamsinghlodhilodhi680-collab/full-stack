
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const [isOtpVerification, setIsOtpVerification] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      // 1. Verify registration OTP
      if (isOtpVerification) {
        const response = await api.post("/auth/verify-otp", {
          email: form.email,
          otp
        });

        if (response.data.success) {
          setIsOtpVerification(false);
          setIsRegister(false);
          setOtp("");
          setForm((prev) => ({
            ...prev,
            firstName: "",
            lastName: "",
            password: ""
          }));

          setSuccess("Email verified successfully! Ab login karo.");
        }
      }

      // 2. Request password reset OTP
      else if (isForgotPassword) {
        const response = await api.post("/auth/forgot-password", {
          email: form.email
        });

        if (response.data.success) {
          setIsForgotPassword(false);
          setIsResetPassword(true);
          setOtp("");
          setNewPassword("");
          setConfirmPassword("");

          setSuccess(
            response.data.message ||
              "Agar verified account hai, toh reset OTP email par bheja jayega."
          );
        }
      }

      // 3. Reset password using OTP
      else if (isResetPassword) {
        const response = await api.post("/auth/reset-password", {
          email: form.email,
          otp,
          newPassword,
          confirmPassword
        });

        if (response.data.success) {
          setIsResetPassword(false);
          setIsRegister(false);
          setIsOtpVerification(false);
          setOtp("");
          setNewPassword("");
          setConfirmPassword("");
          setForm((prev) => ({
            ...prev,
            password: ""
          }));

          setSuccess("Password reset successful! Ab naye password se login karo.");
        }
      }

      // 4. Register or login
      else {
        const endpoint = isRegister
          ? "/auth/register"
          : "/auth/login";

        const payload = isRegister
          ? form
          : { email: form.email, password: form.password };

        const response = await api.post(endpoint, payload);

        if (response.data.success) {
          if (isRegister) {
            setIsOtpVerification(true);
            setOtp("");
            setSuccess(
              "OTP tumhare email par bhej diya gaya hai. Inbox aur Spam check karo."
            );
          } else {
            navigate("/");
          }
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Request failed. Backend check karo."
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend registration verification OTP
  const handleResendOtp = async () => {
    clearMessages();
    setResending(true);

    try {
      const response = await api.post("/auth/resend-otp", {
        email: form.email
      });

      if (response.data.success) {
        setSuccess(response.data.message || "New OTP sent to your email.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "OTP resend nahi ho paya."
      );
    } finally {
      setResending(false);
    }
  };

  const isRecoveryMode = isForgotPassword || isResetPassword;

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-brand">
          <span className="auth-logo">G</span>
          <span>Gao-Connect</span>
        </div>

        <div className="auth-hero-text">
          <span className="auth-tag">YOUR VILLAGE, CONNECTED</span>
          <h1>Apne Gaon Se,<br />Apno Ke Liye.</h1>
          <p>
            Gaon ki khabrein, rojgaar, kheti aur zaroori
            sevaayein — sab ek hi jagah.
          </p>
        </div>

        <div className="auth-visual-footer">
          Connecting people. Empowering villages.
        </div>
      </div>

      <div className="auth-form-side">
        <form className="auth-form" onSubmit={handleSubmit}>
          <span className="auth-mobile-brand">GAO-CONNECT</span>

          <span className="auth-welcome">
            {isOtpVerification
              ? "EMAIL VERIFICATION"
              : isForgotPassword
                ? "ACCOUNT RECOVERY"
                : isResetPassword
                  ? "RESET PASSWORD"
                  : isRegister
                    ? "GET STARTED"
                    : "WELCOME BACK"}
          </span>

          <h2>
            {isOtpVerification
              ? "Verify your email"
              : isForgotPassword
                ? "Forgot password?"
                : isResetPassword
                  ? "Create new password"
                  : isRegister
                    ? "Create your account"
                    : "Login to your account"}
          </h2>

          <p className="auth-subtitle">
            {isOtpVerification
              ? `Enter the 6-digit OTP sent to ${form.email}.`
              : isForgotPassword
                ? "Enter your registered email to request a reset OTP."
                : isResetPassword
                  ? `Enter the reset OTP sent to ${form.email} and choose a new password.`
                  : isRegister
                    ? "Join your village community today."
                    : "Access your village services in one place."}
          </p>

          {!isOtpVerification &&
            !isResetPassword &&
            isRegister && (
              <div className="auth-name-row">
                <input
                  name="firstName"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                />
                <input
                  name="lastName"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                />
              </div>
            )}

          {!isOtpVerification && (
            <>
              <label htmlFor="auth-email">Email address</label>
              <input
                id="auth-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
                readOnly={isResetPassword}
              />
            </>
          )}

          {(isOtpVerification || isResetPassword) && (
            <>
              <label htmlFor="auth-otp">
                {isResetPassword ? "Password reset OTP" : "Email OTP"}
              </label>
              <input
                id="auth-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
                pattern="[0-9]{6}"
                required
              />
            </>
          )}

          {!isForgotPassword &&
            !isOtpVerification &&
            !isResetPassword && (
              <>
                <label htmlFor="auth-password">Password</label>

                <div className="auth-password-wrapper">
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete={
                      isRegister ? "new-password" : "current-password"
                    }
                    minLength={isRegister ? 6 : undefined}
                    required
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </>
            )}

          {isResetPassword && (
            <>
              <label htmlFor="new-password">New password</label>
              <div className="auth-password-wrapper">
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <label htmlFor="confirm-password">Confirm new password</label>
              <div className="auth-password-wrapper">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </>
          )}

          {!isRegister &&
            !isOtpVerification &&
            !isRecoveryMode && (
              <p className="auth-switch">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(true);
                    clearMessages();
                  }}
                >
                  Forgot Password?
                </button>
              </p>
            )}

          {error && <p className="auth-error">{error}</p>}

          {success && (
            <p className="auth-success" role="status">
              {success}
            </p>
          )}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isOtpVerification
                ? "Verify Email →"
                : isForgotPassword
                  ? "Send Reset OTP →"
                  : isResetPassword
                    ? "Reset Password →"
                    : isRegister
                      ? "Create Account →"
                      : "Login Securely →"}
          </button>

          {isOtpVerification && (
            <p className="auth-switch">
              Didn't receive the OTP?
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resending || loading}
              >
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            </p>
          )}

          {isRecoveryMode && (
            <p className="auth-switch">
              Already remember your password?
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setIsResetPassword(false);
                  setOtp("");
                  setNewPassword("");
                  setConfirmPassword("");
                  clearMessages();
                }}
              >
                Back to Login
              </button>
            </p>
          )}

          {!isOtpVerification &&
            !isRecoveryMode && (
              <p className="auth-switch">
                {isRegister ? "Already registered?" : "New to Gao-Connect?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    clearMessages();
                  }}
                >
                  {isRegister ? "Login" : "Create account"}
                </button>
              </p>
            )}

          <p className="auth-security">
            🔒 Your account is protected by secure authentication.
          </p>
        </form>
      </div>
    </div>
  );
}

export default Auth;
