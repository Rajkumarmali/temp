import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginStyle.css";
import { loginUser } from "../db/queries";
 
const palette = {
  primary: "#582F0E",
  secondary: "#A68A64",
  accent: "#582F0E",
  bg: "#EAEFEF",
  label: "#A68A64",
  input: "#A68A64",
  error: "#ef4444",
  border: "#B8CFCE",
  success: "#A68A64",
};
 
function Field({
  label,
  type,
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  autoComplete,
  error,
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div className="login-field">
      <label htmlFor={name} className="login-label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={onChange}
        onFocus={(e) => {
          setFocus(true);
          onFocus && onFocus(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          onBlur && onBlur(e);
        }}
        className={`login-input${focus ? " focus" : ""}${
          error ? " error" : ""
        }`}
      />
    </div>
  );
}
 
function Login({ onSignupClick }) {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();
 
  function validate() {
    if (!inputs.email.trim()) return "Email is required.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inputs.email))
      return "Invalid email address.";
    if (!inputs.password) return "Password is required.";
    if (inputs.password.length < 6)
      return "Password must be at least 6 characters.";
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
    const err = validate();
    if (err) {
      setError(err);
      setMessage("");
      return;
    }
 
    try {
      setLoading(true);
      const user = await loginUser({
        email: inputs.email,
        password: inputs.password,
      });
      setMessage("Logged in successfully!");
      setError("");
      setTimeout(() => {
        navigate("/home");
      }, 750);
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <>
      <div className="login-header">Login</div>
      <form autoComplete="off" onSubmit={handleSubmit} noValidate>
        <Field
          label="Email"
          type="email"
          name="email"
          value={inputs.email}
          onChange={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="email"
          error={
            touched.email &&
            (!inputs.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inputs.email))
          }
        />
        <Field
          label="Password"
          type="password"
          name="password"
          value={inputs.password}
          onChange={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="current-password"
          error={
            touched.password && (!inputs.password || inputs.password.length < 6)
          }
        />
        {error && <div className="login-error">{error}</div>}
        {message && <div className="login-message">{message}</div>}
        <button
          type="submit"
          className="login-button"
          disabled={loading}
          style={{
            background: loading ? palette.accent : palette.primary,
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="login-helper">
        Don’t have an account?{" "}
        <button
          type="button"
          className="login-signup-link"
          onClick={onSignupClick}
        >
          Sign Up
        </button>
      </div>
    </>
  );
}
 
export default Login;
 
 