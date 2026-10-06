
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      setError("Name is required");
      return;
    }

    // Email validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Password validation
    const passwordRules = validatePassword(password);

    if (!passwordRules.length) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!passwordRules.uppercase) {
      setError(
        "Password must contain at least one uppercase letter"
      );
      return;
    }

    if (!passwordRules.lowercase) {
      setError(
        "Password must contain at least one lowercase letter"
      );
      return;
    }

    if (!passwordRules.number) {
      setError(
        "Password must contain at least one number"
      );
      return;
    }

    if (!passwordRules.special) {
      setError(
        "Password must contain at least one special character"
      );
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
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordRules = validatePassword(password);

  return (
    <div className="auth-container">
      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <h1>Create Account</h1>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {password && (
          <div className="password-rules">
            <p>Password must contain:</p>

            <p className={passwordRules.length ? "valid" : "invalid"}>
              {passwordRules.length ? "✓" : "✗"} At least 8 characters
            </p>

            <p
              className={
                passwordRules.uppercase
                  ? "valid"
                  : "invalid"
              }
            >
              {passwordRules.uppercase ? "✓" : "✗"} One uppercase letter
            </p>

            <p
              className={
                passwordRules.lowercase
                  ? "valid"
                  : "invalid"
              }
            >
              {passwordRules.lowercase ? "✓" : "✗"} One lowercase letter
            </p>

            <p
              className={
                passwordRules.number
                  ? "valid"
                  : "invalid"
              }
            >
              {passwordRules.number ? "✓" : "✗"} One number
            </p>

            <p
              className={
                passwordRules.special
                  ? "valid"
                  : "invalid"
              }
            >
              {passwordRules.special ? "✓" : "✗"} One special character
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Register"}
        </button>

        <p>
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

