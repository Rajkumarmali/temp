import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import '../styles/AddTaskStyle.css';
import { addTaskWithSubtasks } from '../db/queries';
 
export default function AddTaskPage() {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Not Completed');
  const [subtasks, setSubtasks] = useState([
    { name: '', description: '', dateTime: '', priority: 'Medium', status: 'Not Completed' }
  ]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
 
  const priorities = ['High', 'Medium', 'Low'];
  const statuses = ['Completed', 'Not Completed'];
 
  const handleSubtaskChange = (index, field, value) => {
    const updated = [...subtasks];
    updated[index][field] = value;
    setSubtasks(updated);
  };
 
  const addSubtask = () => {
    setSubtasks([...subtasks, { name: '', description: '', dateTime: '', priority: 'Medium', status: 'Not Completed' }]);
  };
 
  const removeSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!taskName.trim()) {
      setError('Task name is required.');
      return;
    }
    if (!dateTime) {
      setError('Task date and time is required.');
      return;
    }
    try {
      await addTaskWithSubtasks({
        title: taskName,
        description,
        due_date: dateTime,
        priority,
        is_completed: status,
        subtasks,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/home');
      }, 1200);
      setTaskName('');
      setDescription('');
      setDateTime('');
      setPriority('Medium');
      setStatus('Not Completed');
      setSubtasks([{ name: '', description: '', dateTime: '', priority: 'Medium', status: 'Not Completed' }]);
    } catch (err) {
      setError('Failed to add task: ' + (err.message || err));
    }
  };
 
  return (
    <Layout>
      <div className="addtask-container">
        <h1 className="addtask-title">Add Task</h1>
        <form onSubmit={handleSubmit} className="addtask-form" autoComplete="off">
          <div className="addtask-section">
            <label className="addtask-label">Task Name</label>
            <input
              className="addtask-input"
              type="text"
              placeholder="e.g. Project Meeting"
              value={taskName}
              onChange={e => setTaskName(e.target.value)}
              required
            />
          </div>
          <div className="addtask-section">
            <label className="addtask-label">Task Description</label>
            <textarea
              className="addtask-input"
              placeholder="Describe your task"
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="addtask-row">
            <div style={{ flex: 1, marginRight: 8 }}>
              <label className="addtask-label">Priority</label>
              <select
                className="addtask-dropdown"
                value={priority}
                onChange={e => setPriority(e.target.value)}
                required
              >
                {priorities.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1, marginLeft: 8 }}>
              <label className="addtask-label">Status</label>
              <select
                className="addtask-dropdown"
                value={status}
                onChange={e => setStatus(e.target.value)}
                required
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="addtask-section">
            <label className="addtask-label">Date & Time</label>
            <input
              className="addtask-input"
              type="datetime-local"
              value={dateTime}
              onChange={e => setDateTime(e.target.value)}
              required
            />
          </div>
          <div style={{ marginTop: 10, marginBottom: 6 }}>
            <label className="addtask-label">Subtasks</label>
          </div>
          {subtasks.map((subtask, index) => (
            <div key={index} className="addtask-subtask">
              <input
                className="addtask-input"
                type="text"
                placeholder="Subtask Name"
                value={subtask.name}
                onChange={e =>
                  handleSubtaskChange(index, 'name', e.target.value)
                }
                required
              />
              <textarea
                className="addtask-input"
                placeholder="Subtask Description"
                value={subtask.description}
                rows={2}
                onChange={e =>
                  handleSubtaskChange(index, 'description', e.target.value)
                }
                required
              />
              <div className="addtask-row">
                <div style={{ flex: 1, marginRight: 8 }}>
                  <label className="addtask-sublabel">Priority</label>
                  <select
                    className="addtask-dropdown"
                    value={subtask.priority}
                    onChange={e =>
                      handleSubtaskChange(index, 'priority', e.target.value)
                    }
                    required
                  >
                    {priorities.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1, marginLeft: 8 }}>
                  <label className="addtask-sublabel">Status</label>
                  <select
                    className="addtask-dropdown"
                    value={subtask.status}
                    onChange={e =>
                      handleSubtaskChange(index, 'status', e.target.value)
                    }
                    required
                  >
                    {statuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <input
                className="addtask-input"
                type="datetime-local"
                value={subtask.dateTime}
                onChange={e =>
                  handleSubtaskChange(index, 'dateTime', e.target.value)
                }
                required
              />
              {subtasks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSubtask(index)}
                  className="addtask-removebtn"
                  title="Remove subtask"
                >
                  <span aria-label="Delete" role="img">🗑️</span>
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addSubtask} className="addtask-addbtn">
            <span aria-label="Add" role="img">➕</span> Add Subtask
          </button>
          <button type="submit" className="addtask-submitbtn">
            <span aria-label="Submit" role="img">✅</span> Submit Task
          </button>
          {error && (
            <div className="addtask-errormsg">{error}</div>
          )}
          {success && (
            <div className="addtask-successmsg">Task Submitted Successfully!</div>
          )}
        </form>
      </div>
    </Layout>
  );
}
 
 
 
 
 
 
 
 
 
 
 
 
 
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Layout from './Layout';
// import '../styles/AddTaskStyle.css';
 
// export default function AddTaskPage() {
//   const [taskName, setTaskName] = useState('');
//   const [description, setDescription] = useState('');
//   const [dateTime, setDateTime] = useState('');
//   const [priority, setPriority] = useState('Medium');
//   const [status, setStatus] = useState('Not Completed');
//   const [subtasks, setSubtasks] = useState([
//     {
//       name: '',
//       description: '',
//       dateTime: '',
//       priority: 'Medium',
//       status: 'Not Completed',
//     },
//   ]);
//   const [success, setSuccess] = useState(false);
//   const navigate = useNavigate();
 
//   const priorities = ['High', 'Medium', 'Low'];
//   const statuses = ['Completed', 'Not Completed'];
 
//   const handleSubtaskChange = (index, field, value) => {
//     const updated = [...subtasks];
//     updated[index][field] = value;
//     setSubtasks(updated);
//   };
 
//   const addSubtask = () => {
//     setSubtasks([
//       ...subtasks,
//       {
//         name: '',
//         description: '',
//         dateTime: '',
//         priority: 'Medium',
//         status: 'Not Completed',
//       },
//     ]);
//   };
 
//   const removeSubtask = (index) => {
//     const updated = subtasks.filter((_, i) => i !== index);
//     setSubtasks(updated);
//   };
 
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const task = {
//       taskName,
//       description,
//       dateTime,
//       priority,
//       status,
//       subtasks,
//     };
//     // Here, replace with your backend logic as needed.
//     console.log("Submitted Task:", task);
//     setSuccess(true);
//     setTimeout(() => {
//       setSuccess(false);
//       navigate('/home');
//     }, 1200);
 
//     setTaskName('');
//     setDescription('');
//     setDateTime('');
//     setPriority('Medium');
//     setStatus('Not Completed');
//     setSubtasks([
//       {
//         name: '',
//         description: '',
//         dateTime: '',
//         priority: 'Medium',
//         status: 'Not Completed',
//       },
//     ]);
//   };
 
//   return (
//     <Layout>
//       <div className="addtask-container">
//         <h1 className="addtask-title">
//           Add Task
//         </h1>
//         <form onSubmit={handleSubmit} className="addtask-form" autoComplete="off">
//           <div className="addtask-section">
//             <label className="addtask-label">Task Name</label>
//             <input
//               className="addtask-input"
//               type="text"
//               placeholder="e.g. Project Meeting"
//               value={taskName}
//               onChange={(e) => setTaskName(e.target.value)}
//               required
//             />
//           </div>
 
//           <div className="addtask-section">
//             <label className="addtask-label">Task Description</label>
//             <textarea
//               className="addtask-input"
//               placeholder="Describe your task"
//               rows={2}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               required
//             />
//           </div>
 
//           <div className="addtask-row">
//             <div style={{ flex: 1, marginRight: 8 }}>
//               <label className="addtask-label">Priority</label>
//               <select
//                 className="addtask-dropdown"
//                 value={priority}
//                 onChange={e => setPriority(e.target.value)}
//                 required
//               >
//                 {priorities.map((p) => (
//                   <option key={p} value={p}>{p}</option>
//                 ))}
//               </select>
//             </div>
//             <div style={{ flex: 1, marginLeft: 8 }}>
//               <label className="addtask-label">Status</label>
//               <select
//                 className="addtask-dropdown"
//                 value={status}
//                 onChange={e => setStatus(e.target.value)}
//                 required
//               >
//                 {statuses.map((s) => (
//                   <option key={s} value={s}>{s}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
 
//           <div className="addtask-section">
//             <label className="addtask-label">Date & Time</label>
//             <input
//               className="addtask-input"
//               type="datetime-local"
//               value={dateTime}
//               onChange={(e) => setDateTime(e.target.value)}
//               required
//             />
//           </div>
 
//           <div style={{ marginTop: 10, marginBottom: 6 }}>
//             <label className="addtask-label">Subtasks</label>
//           </div>
//           {subtasks.map((subtask, index) => (
//             <div key={index} className="addtask-subtask">
//               <input
//                 className="addtask-input"
//                 type="text"
//                 placeholder="Subtask Name"
//                 value={subtask.name}
//                 onChange={(e) =>
//                   handleSubtaskChange(index, 'name', e.target.value)
//                 }
//                 required
//               />
//               <textarea
//                 className="addtask-input"
//                 placeholder="Subtask Description"
//                 value={subtask.description}
//                 rows={2}
//                 onChange={(e) =>
//                   handleSubtaskChange(index, 'description', e.target.value)
//                 }
//                 required
//               />
//               <div className="addtask-row">
//                 <div style={{ flex: 1, marginRight: 8 }}>
//                   <label className="addtask-sublabel">Priority</label>
//                   <select
//                     className="addtask-dropdown"
//                     value={subtask.priority}
//                     onChange={e =>
//                       handleSubtaskChange(index, 'priority', e.target.value)
//                     }
//                     required
//                   >
//                     {priorities.map((p) => (
//                       <option key={p} value={p}>{p}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div style={{ flex: 1, marginLeft: 8 }}>
//                   <label className="addtask-sublabel">Status</label>
//                   <select
//                     className="addtask-dropdown"
//                     value={subtask.status}
//                     onChange={e =>
//                       handleSubtaskChange(index, 'status', e.target.value)
//                     }
//                     required
//                   >
//                     {statuses.map((s) => (
//                       <option key={s} value={s}>{s}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <input
//                 className="addtask-input"
//                 type="datetime-local"
//                 value={subtask.dateTime}
//                 onChange={(e) =>
//                   handleSubtaskChange(index, 'dateTime', e.target.value)
//                 }
//                 required
//               />
//               {subtasks.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeSubtask(index)}
//                   className="addtask-removebtn"
//                   title="Remove subtask"
//                 >
//                   <span aria-label="Delete" role="img">🗑️</span>
//                 </button>
//               )}
//             </div>
//           ))}
 
//           <button type="button" onClick={addSubtask} className="addtask-addbtn">
//             <span aria-label="Add" role="img">➕</span> Add Subtask
//           </button>
 
//           <button type="submit" className="addtask-submitbtn">
//             <span aria-label="Submit" role="img">✅</span> Submit Task
//           </button>
//           {success && (
//             <div className="addtask-successmsg">Task Submitted Successfully!</div>
//           )}
//         </form>
//       </div>
//     </Layout>
//   );
// }