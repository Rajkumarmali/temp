import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../pages/Layout";
import "../styles/HomePageStyle.css";

// --- ICONS ---
const PlusIcon = () => (
  <svg className="homepage-action-icon" width="22" height="22" fill="none">
    <circle cx="11" cy="11" r="11" fill="#7F4F24" opacity="0.40"/>
    <path d="M11 7v7M7 11h7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const FetchIcon = () => (
  <svg className="homepage-action-icon" width="22" height="22" fill="none">
    <rect x="3" y="6" width="16" height="10" rx="3" fill="#fff" stroke="#fff" strokeWidth="0"/>
    <rect x="3" y="6" width="16" height="10" rx="3" stroke="#7F4F24" strokeWidth="0"/>
    <path d="M8 12h8M8 9h8" stroke="#7F4F24" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="7" cy="10.5" r="1" fill="#7F4F24" />
    <circle cx="7" cy="13.5" r="1" fill="#7F4F24"/>
    <rect x="3" y="6" width="16" height="10" rx="3" stroke="#7F4F24" strokeWidth="2" opacity="0.40"/>
  </svg>
);

const DeleteIcon = () => (
  <svg className="homepage-action-icon" width="22" height="22" fill="none">
    <rect x="5" y="7" width="12" height="10" rx="2" fill="#fff" stroke="#7F4F24" strokeWidth="0"/>
    <path d="M8 10v4M11 10v4M14 10v4" stroke="#7F4F24" strokeWidth="2" strokeLinecap="round"/>
    <rect x="5" y="7" width="12" height="10" rx="2" stroke="#7F4F24" strokeWidth="2" opacity="0.40"/>
    <path d="M3 7h16" stroke="#7F4F24" strokeWidth="2" strokeLinecap="round" opacity="0.40"/>
    <path d="M8 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="#7F4F24" strokeWidth="2" opacity="0.40"/>
  </svg>
);

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="homepage-header">
        <h1 className="homepage-title">Welcome Home! 🏡</h1>
        <div className="homepage-subtitle">
          This is your beautiful dashboard.<br />
          Manage your tasks with style and ease.
        </div>
      </div>
      <div className="homepage-btn-group">
        <button
          className="homepage-action-btn homepage-action-add"
          onClick={() => navigate("/add-task")}
        >
          <PlusIcon />
          Add Task
        </button>
        <button
          className="homepage-action-btn homepage-action-fetch"
          onClick={() => navigate("/fetch-task")}
        >
          <FetchIcon />
          Fetch Task
        </button>
        <button
          className="homepage-action-btn homepage-action-delete"
          onClick={() => navigate("/delete-task")}
        >
          <DeleteIcon />
          Delete Task
        </button>
      </div>
    </Layout>
  );
}