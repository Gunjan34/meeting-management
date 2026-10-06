
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>_\-]/.test(password),
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");

    // Name validation
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    // Email validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address, for example abc@gmail.com.");
      return;
    }

    // Password validation
    const passwordRules = validatePassword(password);

    if (!passwordRules.length) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!passwordRules.uppercase) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!passwordRules.lowercase) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }

    if (!passwordRules.number) {
      setError("Password must contain at least one number.");
      return;
    }

    if (!passwordRules.special) {
      setError("Password must contain at least one special character.");
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role: "user",
      });

      alert("Registration successful!");

      navigate("/login");
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordRules = validatePassword(password);

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Create Account</h1>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email (abc@gmail.com)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="password-toggle"
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {showPassword ? (
                <>
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                  <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.3 4.5 9 7-.3 1.1-1.1 2.3-2.2 3.4" />
                  <path d="M6.2 6.2C4.4 7.4 3.3 9.4 3 12c.7 2.5 4 7 9 7 1.3 0 2.4-.3 3.4-.8" />
                </>
              ) : (
                <>
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        </div>

        {password && (
          <div className="password-rules">
            <p>Password must contain:</p>

            <p className={passwordRules.length ? "valid" : "invalid"}>
              {passwordRules.length ? "✓" : "✗"} At least 8 characters
            </p>

            <p className={passwordRules.uppercase ? "valid" : "invalid"}>
              {passwordRules.uppercase ? "✓" : "✗"} One uppercase letter
            </p>

            <p className={passwordRules.lowercase ? "valid" : "invalid"}>
              {passwordRules.lowercase ? "✓" : "✗"} One lowercase letter
            </p>

            <p className={passwordRules.number ? "valid" : "invalid"}>
              {passwordRules.number ? "✓" : "✗"} One number
            </p>

            <p className={passwordRules.special ? "valid" : "invalid"}>
              {passwordRules.special ? "✓" : "✗"} One special character
            </p>
          </div>
        )}

        <div className="password-field">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            className="password-toggle"
            type="button"
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
            aria-pressed={showConfirmPassword}
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {showConfirmPassword ? (
                <>
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                  <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.3 4.5 9 7-.3 1.1-1.1 2.3-2.2 3.4" />
                  <path d="M6.2 6.2C4.4 7.4 3.3 9.4 3 12c.7 2.5 4 7 9 7 1.3 0 2.4-.3 3.4-.8" />
                </>
              ) : (
                <>
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>

        <p>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
