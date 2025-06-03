import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Login from "./LoginPage";
import Signup from "./SignupPage";
import "../styles/AuthLayoutStyle.css";

export default function AuthLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine initial tab based on route
  const getTabFromPath = (path) => {
    if (path === "/signup") return "signup";
    // Default to login for "/" or "/login" or anything else
    return "login";
  };

  const [tab, setTab] = useState(getTabFromPath(location.pathname));

  // Sync tab with route changes (including browser nav)
  useEffect(() => {
    setTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const handleTab = (tabName) => {
    setTab(tabName);
    // Navigate to correct route for browser nav/bookmarking
    navigate(tabName === "signup" ? "/signup" : "/login", { replace: true });
  };

  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-welcome">Welcome</div>
        <div className="auth-tab-row">
          <button
            className={`auth-tab${tab === "login" ? " active" : ""}`}
            aria-selected={tab === "login"}
            onClick={() => handleTab("login")}
            type="button"
            tabIndex={tab === "login" ? 0 : -1}
          >
            Login
          </button>
          <button
            className={`auth-tab${tab === "signup" ? " active" : ""}`}
            aria-selected={tab === "signup"}
            onClick={() => handleTab("signup")}
            type="button"
            tabIndex={tab === "signup" ? 0 : -1}
          >
            Sign Up
          </button>
        </div>
        {tab === "login" ? (
          <Login onSignupClick={() => handleTab("signup")} />
        ) : (
          <Signup onLoginClick={() => handleTab("login")} />
        )}
      </div>
    </div>
  );
}