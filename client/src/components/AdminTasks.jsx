import React, { useState, useEffect } from 'react';
import { Plus, Trash2, LayoutDashboard, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminTasks() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchTasks(selectedClient);
    } else {
      setTasks([]);
    }
  }, [selectedClient]);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      setClients(data);
      if (data.length > 0) setSelectedClient(data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async (clientId) => {
    try {
      const res = await fetch(`/api/tasks?client_id=${clientId}`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!selectedClient || !newTask.title) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTask, client_id: selectedClient })
      });
      if (res.ok) {
        toast.success('Task created');
        setNewTask({ title: '', description: '' });
        fetchTasks(selectedClient);
      }
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`/api/tasks/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchTasks(selectedClient);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const deleteTask = async (id) => {
    if(!window.confirm('Delete this task?')) return;
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      fetchTasks(selectedClient);
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const columns = [
    { id: 'todo', title: 'To Do', icon: <LayoutDashboard size={18} className="text-slate-400" /> },
    { id: 'in-progress', title: 'In Progress', icon: <Clock size={18} className="text-blue-400" /> },
    { id: 'review', title: 'In Review', icon: <Clock size={18} className="text-orange-400" /> },
    { id: 'done', title: 'Done', icon: <CheckCircle size={18} className="text-emerald-400" /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Project Tracker (Kanban)</h2>
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none"
        >
          <option value="">Select a Client...</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.name} ({c.username})</option>
          ))}
        </select>
      </div>

      {selectedClient && (
        <form onSubmit={handleCreateTask} className="bg-slate-800 p-4 rounded-xl flex gap-4">
          <input
            type="text"
            placeholder="New Task Title..."
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
            required
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
            <Plus size={18} /> Add Task
          </button>
        </form>
      )}

      {selectedClient ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {columns.map(col => (
            <div key={col.id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex flex-col h-[600px]">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-700">
                {col.icon}
                <h3 className="font-bold text-slate-200">{col.title}</h3>
                <span className="ml-auto bg-slate-700 text-xs px-2 py-1 rounded-full">
                  {tasks.filter(t => t.status === col.id).length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {tasks.filter(t => t.status === col.id).map(task => (
                  <div key={task.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700 group">
                    <h4 className="text-sm font-medium text-white mb-2">{task.title}</h4>
                    <div className="flex justify-between items-center mt-4">
                      <select
                        value={task.status}
                        onChange={(e) => updateStatus(task.id, e.target.value)}
                        className="bg-slate-900 text-xs text-slate-300 border border-slate-700 rounded px-2 py-1 outline-none"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                      </select>
                      <button onClick={() => deleteTask(task.id)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          Please select a client to view and manage their tasks.
        </div>
      )}
    </div>
  );
}
