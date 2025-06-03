import React, { useState } from "react";
import { addTask } from "../db/queries";

export default function TaskForm({ userId }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "medium"
  });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    await addTask({ ...form, user_id: userId });
    alert("Task added to local DB!");
    setForm({ title: "", description: "", due_date: "", priority: "medium" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
      <input name="description" value={form.description} onChange={handleChange} placeholder="Description" />
      <input name="due_date" value={form.due_date} onChange={handleChange} placeholder="Due Date" type="datetime-local" />
      <select name="priority" value={form.priority} onChange={handleChange}>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
}