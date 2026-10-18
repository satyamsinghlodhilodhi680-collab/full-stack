
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const [isOtpVerification, setIsOtpVerification] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
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
      } else {
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
              : isRegister
                ? "GET STARTED"
                : "WELCOME BACK"}
          </span>

          <h2>
            {isOtpVerification
              ? "Verify your email"
              : isRegister
                ? "Create your account"
                : "Login to your account"}
          </h2>

          <p className="auth-subtitle">
            {isOtpVerification
              ? `Enter the 6-digit OTP sent to ${form.email}.`
              : isRegister
                ? "Join your village community today."
                : "Access your village services in one place."}
          </p>

          {!isOtpVerification && isRegister && (
            <div className="auth-name-row">
              <input
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <input
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {isOtpVerification ? (
            <>
              <label htmlFor="auth-otp">Email OTP</label>
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
          ) : (
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
              />

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
                : isRegister
                  ? "Create Account →"
                  : "Login Securely →"}
          </button>

          {isOtpVerification ? (
            <p className="auth-switch">
              Wrong email?
              <button
                type="button"
                onClick={() => {
                  setIsOtpVerification(false);
                  setIsRegister(true);
                  setOtp("");
                  setError("");
                  setSuccess("");
                }}
              >
                Go back
              </button>
            </p>
          ) : (
            <p className="auth-switch">
              {isRegister ? "Already registered?" : "New to Gao-Connect?"}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                  setSuccess("");
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
