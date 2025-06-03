import { getDB } from './initDB';
 
// Enable Foreign Keys
async function enableForeignKeys() {
  const db = await getDB();
  await db.execute('PRAGMA foreign_keys = ON');
}
enableForeignKeys();
 
// Static User ID
const STATIC_USER_ID = 100;
 
// Generate a unique task ID
function generateTaskId() {
  return `TASK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}
 
// Generate a unique subtask ID
function generateSubtaskId() {
  return `SUBTASK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}
 
// Add task with optional subtasks: inserts a main task and then its subtasks (which use tasks table again)
export async function addTaskWithSubtasks({ title, description, due_date, priority, is_completed, subtasks }) {
  const db = await getDB();
 
  // Insert main task; note: no user_id is required now.
  const result = await db.run(
    `INSERT INTO tasks (title, description, due_date, priority, is_completed)
     VALUES (?, ?, ?, ?, ?)`,
    [
      title,
      description,
      due_date ? new Date(due_date).toISOString() : null,
      priority,
      is_completed === "Completed" ? 1 : 0,
    ]
  );
    const idRes = await db.query(`SELECT last_insert_rowid() AS id`);
  const taskId = idRes.values?.[0]?.id; // auto-generated ID
 
  // Insert each subtask with the created taskId as parent_id
  if (Array.isArray(subtasks)) {
    for (const st of subtasks) {
      if (!st.name.trim()) continue;
      await db.run(
        `INSERT INTO tasks (parent_id, title, description, due_date, priority, is_completed)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          taskId,
          st.name,
          st.description,
          st.dateTime ? new Date(st.dateTime).toISOString() : null,
          st.priority,
          st.status === "Completed" ? 1 : 0
        ]
      );
    }
  }
  return taskId;
}
 
// Fetch all main tasks (filtering out tasks that are subtasks) and include their subtasks
export async function fetchAllTasks() {
  const db = await getDB();
  const res = await db.query(
    `SELECT * FROM tasks ORDER BY created_at DESC`
  );
  const tasks = res.values || [];
 
  // Attach subtasks to their main tasks
  const completeTasks = await Promise.all(tasks.map(async (task) => {
    // Only process if this is a main task (parent_id IS NULL)
    if (task.parent_id === null) {
      const subRes = await db.query(`SELECT * FROM tasks WHERE parent_id = ?`, [task.id]);
      task.subtasks = subRes.values || [];
      task.status = task.is_completed ? "Completed" : "Not Completed";
      task.dateTime = task.due_date;
    }
    return task;
  }));
 
  // Return only tasks with no parent_id (ignoring standalone subtasks)
  return completeTasks.filter(task => task.parent_id === null);
}
 
// Delete a task; foreign key constraints should delete its subtasks automatically
export async function deleteTaskById(taskId) {
  const db = await getDB();
  await db.run(`DELETE FROM tasks WHERE id = ?`, [taskId]);
}
 
// Register a new user
export async function registerUser({ name, email, password }) {
  const db = await getDB();
  try {
    await db.run(
      `INSERT INTO User (username, email, password) VALUES (?, ?, ?)`,
      [name, email, password]
    );
    return true;
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      throw new Error("Email already exists.");
    }
    throw error;
  }
}
 
// Login a user
export async function loginUser({ email, password }) {
  const db = await getDB();
  const res = await db.query(
    `SELECT * FROM User WHERE email = ? AND password = ?`,
    [email, password]
  );
  if (res.values && res.values.length > 0) {
    return res.values[0]; // Return user data
  } else {
    throw new Error("Invalid email or password.");
  }
}
 