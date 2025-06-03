import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../db/queries";
import "../styles/SignupStyle.css";
 
// Updated palette (no gradients)
const palette = {
  primary: "#582F0E",
  secondary: "#A68A64",
  accent: "#582F0E",
  bg: "#A68A64",
  label: "#A68A64",
  input: "#A68A64",
  error: "#ef4444",
  border: "#A68A64",
  success: "#A68A64",
};
 
function Field({ label, type, name, value, onChange, onFocus, onBlur, autoComplete, error }) {
  const [focus, setFocus] = useState(false);
  return (
    <div className="signup-field">
      <label
        htmlFor={name}
        className="signup-label"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={onChange}
        onFocus={(e) => { setFocus(true); onFocus && onFocus(e); }}
        onBlur={(e) => { setFocus(false); onBlur && onBlur(e); }}
        className={`signup-input${focus ? " focus" : ""}${error ? " error" : ""}`}
      />
    </div>
  );
}
 
function Signup({ onLoginClick }) {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();
 
  function validate() {
    if (!inputs.name.trim()) return "Name is required.";
    if (!inputs.email.trim()) return "Email is required.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inputs.email)) return "Invalid email address.";
    if (!inputs.password) return "Password is required.";
    if (inputs.password.length < 6) return "Password must be at least 6 characters.";
    if (!inputs.confirmPassword) return "Please confirm your password.";
    if (inputs.password !== inputs.confirmPassword) return "Passwords do not match.";
    return "";
  }
 
  const handleInput = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };
 
  const handleFocus = (e) => setTouched({ ...touched, [e.target.name]: true });
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });
 
 
const handleSubmit = async (e) => {
  e.preventDefault();
  setTouched({ name: true, email: true, password: true, confirmPassword: true });
  const err = validate();
  if (err) {
    setError(err);
    setMessage("");
    return;
  }
 
  try {
    setLoading(true);
    await registerUser({
      name: inputs.name,
      email: inputs.email,
      password: inputs.password,
    });
    setMessage("Account created successfully!");
    setError("");
    setTimeout(() => {
      navigate("/login");
    }, 750);
  } catch (err) {
    setError(err.message || "Signup failed.");
  } finally {
    setLoading(false);
  }
};
 
  return (
    <>
      <div className="signup-header">Sign Up</div>
      <form autoComplete="off" onSubmit={handleSubmit} noValidate>
        <Field
          label="Name"
          type="text"
          name="name"
          value={inputs.name}
          onChange={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="name"
          error={touched.name && !inputs.name}
        />
        <Field
          label="Email"
          type="email"
          name="email"
          value={inputs.email}
          onChange={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="email"
          error={touched.email && (!inputs.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inputs.email))}
        />
        <Field
          label="Password"
          type="password"
          name="password"
          value={inputs.password}
          onChange={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="new-password"
          error={touched.password && (!inputs.password || inputs.password.length < 6)}
        />
        <Field
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={inputs.confirmPassword}
          onChange={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="new-password"
          error={touched.confirmPassword && (inputs.password !== inputs.confirmPassword)}
        />
        {error && <div className="signup-error">{error}</div>}
        {message && <div className="signup-message">{message}</div>}
        <button
          type="submit"
          className="signup-button"
          disabled={loading}
          style={{
            background: loading ? palette.accent : palette.primary,
          }}
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>
      <div className="signup-helper">
        Already have an account?{" "}
        <button
          type="button"
          className="signup-login-link"
          onClick={onLoginClick}
        >
          Login
        </button>
      </div>
    </>
  );
}
 
export default Signup;
 