import React, { useState, useEffect } from 'react';
import './index.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const taskTypes = ['Personal', 'Work', 'Study', 'Health', 'Finance', 'Other'];
const filters = ['All', 'Active', 'Completed'];

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [deadline, setDeadline] = useState('');
  const [type, setType] = useState('Personal');
  const [filter, setFilter] = useState('All');
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);


  const addOrUpdateTask = () => {
    if (!input.trim()) return;
    const newTask = {
      text: input,
      deadline,
      type,
      completed: false,
    };
    const updated = [...tasks];
    if (editIndex !== null) {
      updated[editIndex] = { ...updated[editIndex], ...newTask };
      setEditIndex(null);
    } else {
      updated.push(newTask);
    }
    setTasks(updated);
    setInput('');
    setDeadline('');
    setType('Personal');
  };

  const toggleComplete = (i) => {
    const updated = [...tasks];
    updated[i].completed = !updated[i].completed;
    setTasks(updated);
  };

  const confirmDelete = (i) => {
    setDeleteIndex(i);
    setShowModal(true);
  };

  const deleteTask = () => {
    const updated = tasks.filter((_, i) => i !== deleteIndex);
    setTasks(updated);
    setShowModal(false);
    setDeleteIndex(null);
  };

  const editTask = (i) => {
    const t = tasks[i];
    setInput(t.text);
    setDeadline(t.deadline);
    setType(t.type);
    setEditIndex(i);
  };
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'All') return true;
    return filter === 'Completed' ? t.completed : !t.completed;
  });

  const today = new Date().toISOString().split('T')[0];
  const completionRate = tasks.length
    ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)
    : 0;

  return (
    <div className="app">
      <h1>✅ Tick-It-Off</h1>

      <div className="form">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Task..." />
        <input type="date" value={deadline} min={today} onChange={(e) => setDeadline(e.target.value)} />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {taskTypes.map((t) => <option key={t}>{t}</option>)}
        </select>
        <button onClick={addOrUpdateTask}>{editIndex !== null ? 'Update' : 'Add'} Task</button>
      </div>

      <div className="filters">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={filter === f ? 'active' : ''}>
            {f}
          </button>
        ))}
      </div>

      <div className="progress-bar">
        <div style={{ width: `${completionRate}%` }}>{completionRate}% Done</div>
      </div>

      {filteredTasks.map((task, i) => {
        const isOverdue = task.deadline && new Date(task.deadline) < new Date();
        const isSoon = task.deadline && new Date(task.deadline) - new Date() < 2 * 86400000;

        return (
          <div key={i} className={`task ${task.completed ? 'done' : ''}`}>
            <div>
              <strong>{task.text}</strong> <span className={`tag ${task.type.toLowerCase()}`}>{task.type}</span><br />
              {task.deadline && (
                <span className={isOverdue ? 'overdue' : isSoon ? 'soon' : ''}>
                  ⏰ {task.deadline}
                </span>
              )}
            </div>
            <div className="actions">
              <button onClick={() => toggleComplete(i)}>✔</button>
              <button onClick={() => editTask(i)}>✏️</button>
              <button onClick={() => confirmDelete(i)}>🗑</button>
            </div>
          </div>
        );
      })}

      <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)} className="modal">
        <h3>Are you sure you want to delete this task?</h3>
        <button onClick={deleteTask}>Yes, Delete</button>
        <button onClick={() => setShowModal(false)}>Cancel</button>
      </Modal>
    </div>
  );
}

export default App;
