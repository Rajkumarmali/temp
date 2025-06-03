import React from "react";
import Layout from "../pages/Layout";
import "../styles/NotificationPageStyle.css";

// --- COLOR PALETTE (used in icon SVGs only, not for layout) ---
const notificationPalette = {
  accent: "#F3C623",
  accent2: "#FFB22C",
  accent3: "#FA812F",
  unreadBg: "#FFF7E0",
  readBg: "#EAEFEF",
  border: "#EAEFEF",
  dot: "#FA812F",
  text: "#333446",
  textLight: "#8A857A",
};

// --- DUMMY NOTIFICATIONS ---
const dummyNotifications = [
  {
    id: 1,
    title: "Task Due Today",
    message: "Your assignment 'Complete Assignment' is due today.",
    time: "10:00 AM",
    read: false,
    type: "reminder",
  },
  {
    id: 2,
    title: "Subtask Completed",
    message: "You completed the subtask 'Solve Problems 1-5'. Great job!",
    time: "9:30 AM",
    read: true,
    type: "success",
  },
  {
    id: 3,
    title: "Meeting Reminder",
    message: "Don't forget your team meeting at 11:00 AM.",
    time: "8:00 AM",
    read: false,
    type: "reminder",
  },
  {
    id: 4,
    title: "All Caught Up!",
    message: "You have no pending tasks for today. Enjoy your day!",
    time: "Yesterday",
    read: true,
    type: "info",
  },
];

// --- NOTIFICATION ICON ---
function NotifTypeIcon({ type }) {
  if (type === "reminder")
    return (
      <span className={`notification-type-icon ${type}`} title="Reminder">
        <svg width="26" height="27" fill="none">
          <circle cx="13" cy="13" r="13" fill={notificationPalette.accent + "33"} />
          <path d="M13 7v7l5 3" stroke={notificationPalette.accent3} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </span>
    );
  if (type === "success")
    return (
      <span className={`notification-type-icon ${type}`} title="Success">
        <svg width="26" height="27" fill="none">
          <circle cx="13" cy="13" r="13" fill={notificationPalette.accent2 + "33"} />
          <path d="M8 13l4 4 6-7" stroke={notificationPalette.accent2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    );
  return (
    <span className={`notification-type-icon ${type}`} title="Info">
      <svg width="26" height="27" fill="none">
        <circle cx="13" cy="13" r="13" fill={notificationPalette.accent3 + "22"} />
        <circle cx="13" cy="17.5" r="1.3" fill={notificationPalette.accent3} />
        <rect x="12" y="8" width="2" height="7" rx="1" fill={notificationPalette.accent3}/>
      </svg>
    </span>
  );
}

export default function NotificationPage() {
  // Responsive padding for the notification main content
  React.useEffect(() => {
    const main = document.getElementById("main-notification");
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
    <Layout>
      <main id="main-notification" className="notification-main">
        <h1 className="notification-title">Notifications</h1>
        <div className="notification-list">
          {dummyNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-card${notif.read ? " read" : " unread"}`}
            >
              <div className={`notification-dot${notif.read ? " read" : ""}`} />
              <NotifTypeIcon type={notif.type} />
              <div className="notification-content">
                <span className="notification-title-text">{notif.title}</span>
                <span className="notification-msg">{notif.message}</span>
                <span className="notification-time">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}