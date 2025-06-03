import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import "../styles/DeleteTaskStyle.css";
import { fetchAllTasks, deleteTaskById } from "../db/queries";

export default function DeleteTaskPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [status, setStatus] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch tasks from DB on mount & after delete
  const reloadTasks = () => {
    fetchAllTasks()
      .then(setTasks)
      .catch(err => {
        setStatus('❌ Error fetching tasks: ' + (err.message || err));
        console.error("Fetch error:", err);
      });
  };

  useEffect(() => {
    reloadTasks();
    // eslint-disable-next-line
  }, []);

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  const handleSelectTask = (e) => {
    setSelectedTaskId(e.target.value);
    setStatus('');
    setShowConfirm(false);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (!selectedTaskId) {
      setStatus('⚠️ Please select a task to delete.');
      return;
    }
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTaskById(selectedTaskId);
      setStatus(`✅ Task "${selectedTask?.name}" has been deleted.`);
      setShowConfirm(false);
      setSelectedTaskId('');
      reloadTasks();
    } catch (err) {
      console.error("Delete error:", err);
      setStatus('❌ Error deleting task: ' + (err.message || err));
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setStatus('');
  };

  return (
    <Layout>
      <div className="delete-task-card">
        <h1 className="delete-task-title">🗑️ Delete Task</h1>
        <div className="delete-task-subtitle">
          Select a task below to view its details and delete it.<br/>
          <span className="delete-task-warning">Warning:</span> This action cannot be undone.
        </div>
        <form className="delete-task-form" onSubmit={handleDelete} autoComplete="off">
          <label className="delete-task-label" htmlFor="task-select">Task</label>
          <select
            id="task-select"
            value={selectedTaskId}
            onChange={handleSelectTask}
            className="delete-task-select"
          >
            <option value="">-- Choose a task --</option>
            {tasks.map(task => (
              <option key={task.id} value={task.id}>{task.name} ({task.id})</option>
            ))}
          </select>
          {selectedTask && (
            <div className="delete-task-details">
              <div><b>Description:</b> {selectedTask.description}</div>
              <div><b>Date &amp; Time:</b> {selectedTask.dateTime ? new Date(selectedTask.dateTime).toLocaleString() : ''}</div>
              <div><b>Priority:</b> {selectedTask.priority}</div>
              <div><b>Status:</b> {selectedTask.status}</div>
              {selectedTask.subtasks.length > 0 && (
                <div className="delete-task-subtask-list">
                  <b>Subtasks:</b>
                  <ul>
                    {selectedTask.subtasks.map(st => (
                      <li key={st.id}>
                        <span className="delete-task-subtask-name">{st.name}</span>
                        <span className="delete-task-subtask-info">
                          (Priority: {st.priority}, Status: {st.status})
                        </span>
                        <div className="delete-task-subtask-desc">
                          {st.description} | {st.dateTime ? new Date(st.dateTime).toLocaleString() : ''}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          <button type="submit" className="delete-task-btn">
            Delete Selected Task
          </button>
        </form>
        {showConfirm && (
          <div className="delete-task-confirm-modal">
            <div className="delete-task-confirm-content">
              <div>⚠️ Are you sure you want to delete <b>{selectedTask?.name}</b>?</div>
              <div className="delete-task-confirm-actions">
                <button className="delete-task-confirm-btn" onClick={confirmDelete}>Yes, Delete</button>
                <button className="delete-task-cancel-btn" onClick={cancelDelete}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        {status && <div className="delete-task-status">{status}</div>}
      </div>
    </Layout>
  );
}