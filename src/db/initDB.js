// import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
 
// const sqlite = new SQLiteConnection(CapacitorSQLite);
// let db = null;
 
// // Helper for enabling foreign key support after DB open
// async function enableForeignKeys(database) {
//   await database.execute('PRAGMA foreign_keys = ON');
// }
 
// export async function getDB() {
//   if (db) return db;
 
//   db = await sqlite.createConnection('appdb', false, 'no-encryption', 1);
//   await db.open();
 
//   // Always enable foreign key support as the first statement after open
//   await enableForeignKeys(db);
 
//   // Users table with static user
//   await db.execute(`
//     CREATE TABLE IF NOT EXISTS Users (
//       id INTEGER PRIMARY KEY,
//       username TEXT,
//       email TEXT,
//       password TEXT
//     );
//   `);
 
//   const userCheck = await db.query('SELECT id FROM Users WHERE id = 100');
//   if (!userCheck.values || userCheck.values.length === 0) {
//     await db.run(
//       `INSERT INTO Users (id, username, email, password) VALUES (?, ?, ?, ?)`,
//       [100, 'staticuser', 'static@example.com', 'password']
//     );
//   }
 
//   // Drop dependent tables for a clean dev reset (order matters)
//   await db.execute(`
//     DROP TABLE IF EXISTS completed_tasks;
//     DROP TABLE IF EXISTS subtasks;
//     DROP TABLE IF EXISTS tasks;
//   `);
 
//   // Recreate tables with correct types and foreign key relationships
//   await db.execute(`
//     CREATE TABLE IF NOT EXISTS tasks (
//       id TEXT PRIMARY KEY,
//       user_id INTEGER NOT NULL,
//       title TEXT NOT NULL,
//       description TEXT,
//       is_completed INTEGER DEFAULT 0,
//       due_date DATETIME,
//       priority TEXT NOT NULL,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
//     );
 
//     CREATE TABLE IF NOT EXISTS subtasks (
//       id TEXT PRIMARY KEY,
//       task_id TEXT NOT NULL,
//       title TEXT NOT NULL,
//       description TEXT,
//       due_date DATETIME,
//       priority TEXT NOT NULL,
//       is_completed INTEGER DEFAULT 0,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
//     );
//     CREATE TABLE IF NOT EXISTS notifications (
//       notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
//       id INTEGER REFERENCES Users(id),
//       message TEXT NOT NULL,
//       type TEXT NOT NULL,
//       related_id INTEGER,
//       read_status INTEGER DEFAULT 0,
//       scheduled_for DATETIME,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     );
//     CREATE TABLE IF NOT EXISTS completed_tasks (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       task_id TEXT NOT NULL,
//       completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
//     );
//   `);
 
//   return db;
// }
 
 
 
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
 
const sqlite = new SQLiteConnection(CapacitorSQLite);
let db = null;
 
// Helper for enabling foreign key support after DB open
async function enableForeignKeys(database) {
  await database.execute('PRAGMA foreign_keys = ON');
}
 
// export async function getDB() {
//   if (db) return db;
 
//   db = await sqlite.createConnection('appdb', false, 'no-encryption', 1);
//   await db.open();
 
//   // Always enable foreign key support as the first statement after open
//   await enableForeignKeys(db);
 
//   // Users table with static user
//   await db.execute(`
//     CREATE TABLE IF NOT EXISTS Users (
//       id INTEGER PRIMARY KEY,
//       username TEXT,
//       email TEXT,
//       password TEXT
//     );
//   `);
 
//   const userCheck = await db.query('SELECT id FROM Users WHERE id = 100');
//   if (!userCheck.values || userCheck.values.length === 0) {
//     await db.run(
//       `INSERT INTO Users (id, username, email, password) VALUES (?, ?, ?, ?)`,
//       [100, 'staticuser', 'static@example.com', 'password']
//     );
//   }
 
//   await db.execute(`
//     CREATE TABLE IF NOT EXISTS tasks (
//       id TEXT PRIMARY KEY,
//       user_id INTEGER NOT NULL,
//       title TEXT NOT NULL,
//       description TEXT,
//       is_completed INTEGER DEFAULT 0,
//       due_date DATETIME,
//       priority TEXT NOT NULL,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       vector_embedding BLOB,                                            // ******NEW ADDITION*******
//       FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
//     );
 
//     CREATE TABLE IF NOT EXISTS subtasks (
//       id TEXT PRIMARY KEY,
//       task_id TEXT NOT NULL,
//       title TEXT NOT NULL,
//       description TEXT,
//       due_date DATETIME,
//       priority TEXT NOT NULL,
//       is_completed INTEGER DEFAULT 0,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       vector_embedding BLOB,                                            // ******NEW ADDITION*******
//       FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
//     );
 
//     CREATE TABLE IF NOT EXISTS notifications (
//       notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
//       id TEXT REFERENCES Users(id),
//       message TEXT NOT NULL,
//       type TEXT NOT NULL,
//       related_id INTEGER,
//       read_status INTEGER DEFAULT 0,
//       scheduled_for DATETIME,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     );
 
//     CREATE TABLE IF NOT EXISTS completed_tasks (
//     id INTEGER PRIMARY KEY,
//     user_id INTEGER REFERENCES Users(id),
//     due_date DATETIME REFERENCES tasks(due_date),
//     title TEXT,
//     description TEXT,
//     priority TEXT, -- e.g., 'low', 'medium', 'high'                         // ******NEW ADDITION*******
//     due_date DATETIME,                                                     // ******NEW ADDITION*******
//     completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     source_task_id INTEGER,
//     parent_task_id INTEGER,
//     created_at DATETIME REFERENCES tasks(created_at),
//     vector_embedding BLOB,
//     FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
//   );
 
//     CREATE VIRTUAL TABLE task_embeddings USING vss0(
//         id integer PRIMARY KEY,
//         embedding(1536),  -- for example, if using Ada embeddings (1536 dimensions)
//         type TEXT,  -- 'task' or 'historic_task'
//     );
//   `);
 
//   return db;
// }
 
 
export async function getDB() {
  if (db) return db;
 
  db = await sqlite.createConnection('appdb', false, 'no-encryption', 1);
  await db.open();
 
  await enableForeignKeys(db);
 
  // Create tables and virtual tables individually
  // await db.execute(`
  //   DROP TABLE IF EXISTS User;
  // `);
 
  await db.execute(`
    CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar_url TEXT DEFAULT 'default.png',
      quote TEXT DEFAULT 'East or West, You are the best' CHECK (length(quote) <= 100),
      theme TEXT DEFAULT 'light'
    )
  `);
 
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parent_id INTEGER DEFAULT NULL,
      title TEXT NOT NULL,
      description TEXT,
      is_completed INTEGER DEFAULT 0,
      due_date DATETIME,
      priority TEXT NOT NULL,
      recurrence_rule_id INTEGER DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      category TEXT DEFAULT 'personal',  -- personal, work, family, other
      vector_embedding BLOB,
      FOREIGN KEY (parent_id) REFERENCES tasks(id) ON DELETE CASCADE,
      FOREIGN KEY (recurrence_rule_id) REFERENCES recurrence_rules(id) ON DELETE SET NULL
    )
  `);
 
  await db.execute(`
    CREATE TABLE IF NOT EXISTS recurrence_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      frequency TEXT NOT NULL,
      interval INTEGER DEFAULT 1,
      byweekday TEXT,
      until DATETIME,
      count INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
 
  await db.execute(`
    CREATE TABLE IF NOT EXISTS notifications (
      notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      related_id INTEGER,
      read_status INTEGER DEFAULT 0,
      scheduled_for DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
 
  await db.execute(`
    CREATE VIRTUAL TABLE task_embeddings USING vss0 (
      id INTEGER PRIMARY KEY,
      embedding(1536),
      type TEXT
    )
  `);
 
  return db;
}
 