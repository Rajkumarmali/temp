import React, { useState } from "react";
import { addUser } from "../db/queries";

export default function UserForm() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    await addUser(form);
    alert("User added to local DB!");
    setForm({ username: "", email: "", password: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" value={form.username} onChange={handleChange} placeholder="Username" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required type="email" />
      <input name="password" value={form.password} onChange={handleChange} placeholder="Password" required type="password" />
      <button type="submit">Add User</button>
    </form>
  );
}