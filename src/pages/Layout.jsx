import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/LayoutStyle.css";

// --- ICONS ---
const BellIcon = () => (
  <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
    <path d="M15 18.5c0 1.38-1.12 2.5-2.5 2.5s-2.5-1.12-2.5-2.5m8.5-2h-13c-.55 0-1-.45-1-1 0-.29.13-.56.34-.75A7.97 7.97 0 0 0 6 10.5V9c0-3.03 2.16-5.5 6-5.5s6 2.47 6 5.5v1.5c0 1.77.77 3.37 2 4.75.21.19.34.46.34.75 0 .55-.45 1-1 1z" stroke="#DAD7CD" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HomeIcon = ({ active }) => (
  <svg width="24" height="24" className={`layout-nav-icon${active ? " active" : ""}`} fill="none">
    <path d="M4 11.5V19a1 1 0 0 0 1 1h3.5V16a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4H19a1 1 0 0 0 1-1v-7.5M3 12.38l8.32-7.4a1.5 1.5 0 0 1 1.95 0l8.32 7.4" stroke={active ? "#C2C5AA" : "#7F4F24"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AIIcon = ({ active }) => (
  <svg width="24" height="24" className={`layout-nav-icon${active ? " active" : ""}`} fill="none">
    <circle cx="12" cy="12" r="10" stroke={active ? "#C2C5AA" : "#7F4F24"} strokeWidth="1.5"/>
    <path d="M8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" stroke={active ? "#C2C5AA" : "#7F4F24"} strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="1.2" fill={active ? "#C2C5AA" : "#7F4F24"}/>
  </svg>
);

const CalendarIcon = ({ active }) => (
  <svg width="24" height="24" className={`layout-nav-icon${active ? " active" : ""}`} fill="none">
    <rect x="3" y="5" width="18" height="16" rx="3" stroke={active ? "#C2C5AA" : "#7F4F24"} strokeWidth="1.5"/>
    <path d="M16 3v4M8 3v4M3 9h18" stroke={active ? "#C2C5AA" : "#7F4F24"} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Responsive main padding
  React.useEffect(() => {
    const main = document.getElementById("main-content");
    if (main) {
      if (window.innerWidth <= 480) {
        main.style.paddingLeft = "0.15rem";
        main.style.paddingRight = "0.15rem";
      } else {
        main.style.paddingLeft = "0.5rem";
        main.style.paddingRight = "0.5rem";
      }
    }
    const handleResize = () => {
      if (main) {
        if (window.innerWidth <= 480) {
          main.style.paddingLeft = "0.15rem";
          main.style.paddingRight = "0.15rem";
        } else {
          main.style.paddingLeft = "0.5rem";
          main.style.paddingRight = "0.5rem";
        }
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="layout-root">
      {/* Header */}
      <header className="layout-header">
        <span className="layout-app-name">Taskify</span>
        <span
          className="layout-bell"
          title="Notifications"
          onClick={() => navigate("/notification")}
        >
          <BellIcon />
        </span>
      </header>
      {/* Main */}
      <main
        id="main-content"
        className="layout-main"
      >
        {children}
      </main>
      {/* Footer Navigation */}
      <footer className="layout-footer">
        <button
          className={`layout-nav-btn${isActive("/home") ? " active" : ""}`}
          onClick={() => navigate("/home")}
        >
          <HomeIcon active={isActive("/home")} />
          Home
        </button>
        <button
          className={`layout-nav-btn${isActive("/ai") ? " active" : ""}`}
          onClick={() => navigate("/ai")}
        >
          <AIIcon active={isActive("/ai")} />
          AI
        </button>
        <button
          className={`layout-nav-btn${isActive("/calendar") ? " active" : ""}`}
          onClick={() => navigate("/calendar")}
        >
          <CalendarIcon active={isActive("/calendar")} />
          Calendar
        </button>
      </footer>
    </div>
  );
}