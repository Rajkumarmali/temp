import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./pages/AuthLayout";
import HomePage from "./pages/HomePage";
import Addtask from "./pages/AddTaskPage";
import Deletetask from "./pages/DeleteTaskPage";
import Fetchtask from "./pages/FetchTaskPage";
import CalendarPage  from "./pages/CalendarPage";
import NotificationPage  from "./pages/NotificationPage";
import AIPage  from "./pages/AIPage";
// You can add more pages like AddTask, FetchTask, DeleteTask as needed.

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth layout handles login/signup switching */}
        <Route path="/" element={<AuthLayout />} />
        <Route path="/login" element={<AuthLayout />} />
        <Route path="/signup" element={<AuthLayout />} />

        {/* Main Home/Dashboard page */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/add-task" element={<Addtask />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/delete-task" element={<Deletetask />} />
        <Route path="/fetch-task" element={<Fetchtask />} />
         <Route path="/ai" element={<AIPage />} />
        {/* Example task routes for navigation */}
        {/* <Route path="/add-task" element={<AddTaskPage />} />
        <Route path="/fetch-task" element={<FetchTaskPage />} />
        <Route path="/delete-task" element={<DeleteTaskPage />} /> */}

        {/* Catch-all: redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
