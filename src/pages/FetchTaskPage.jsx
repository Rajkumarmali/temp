import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import "../styles/FetchTaskStyle.css";
import { fetchAllTasks } from "../db/queries";
 
function badgeClass(type, value) {
  return `fetch-task-badge fetch-task-badge-${type}-${value.replace(/\s+/g, "-").toLowerCase()}`;
}
 
export default function FetchTaskPage() {
  const [expanded, setExpanded] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
 
  useEffect(() => {
    async function loadTasks() {
      try {
        const ts = await fetchAllTasks();
        setTasks(ts);
      } catch (e) {
        console.error(e);
        setError("Failed to load tasks");
      }
    }
    loadTasks();
  }, []);
 
  if (error) return <div>{error}</div>;
 
  return (
    <Layout>
      <div className="fetch-task-container scrollable-fetch-task">
        <h2 className="fetch-task-title">All Tasks</h2>
        <div className="fetch-task-subtitle">
          Click a task card to expand and view subtasks.
        </div>
        {tasks.length === 0 && (
          <div className="fetch-task-empty">
            🎉 You have no tasks!
          </div>
        )}
        {tasks.map(task => (
          <div
            key={task.id}
            className={`fetch-task-card${expanded === task.id ? " expanded" : ""}`}
            onClick={() => setExpanded(expanded === task.id ? null : task.id)}
          >
            <div className="fetch-task-row">
              <span className="fetch-task-icon">📝</span>
              <div className="fetch-task-main">
                <span className="fetch-task-name">{task.title}</span>
                <div className="fetch-task-badges">
                  <span className={badgeClass("priority", task.priority)}>{task.priority}</span>
                  <span className={badgeClass("status", task.status)}>{task.status}</span>
                </div>
              </div>
              <button
                type="button"
                className="fetch-task-expand-btn"
                aria-label={expanded === task.id ? "Collapse" : "Expand"}
                title={expanded === task.id ? "Collapse" : "Expand"}
                onClick={e => { e.stopPropagation(); setExpanded(expanded === task.id ? null : task.id); }}
              >
                {expanded === task.id ? "▲" : "▼"}
              </button>
            </div>
            {expanded === task.id && task.subtasks && task.subtasks.length > 0 && (
              <div className="fetch-task-subtasks">
                <div className="fetch-task-subtasks-title">Subtasks</div>
                {task.subtasks.map(st => (
                  <div key={st.id} className="fetch-task-subtask-detail">
                    <div className="fetch-task-subtask-detail-row">
                      <span className="fetch-task-subtask-detail-name">{st.title}</span>
                      <span className={badgeClass("priority", st.priority)}>{st.priority}</span>
                      <span className={badgeClass("status", st.is_completed ? "Completed" : "Not Completed")}>
                        {st.is_completed ? "Completed" : "Not Completed"}
                      </span>
                    </div>
                    <span className="fetch-task-subtask-desc">{st.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}
 