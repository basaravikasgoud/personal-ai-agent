import React, { useState, useEffect } from 'react';
import API from '../services/api';
import TaskCard from '../components/TaskCard';
import Loading from '../components/Loading';
import { History as HistoryIcon, Search, Filter, Bot } from 'lucide-react';

const History = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/tasks?status=${statusFilter}&search=${encodeURIComponent(searchQuery)}`);
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 font-display flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-cyan-400" /> Task History & Activity
          </h1>
          <p className="text-xs text-slate-400">
            Review past agent executions, structured step plans, and synthesized outputs.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search tasks by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <Filter className="w-4 h-4 text-slate-500" />
          {['all', 'completed', 'running', 'failed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl capitalize font-medium transition-all ${
                statusFilter === status
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Task Grid */}
      {loading ? (
        <Loading message="Loading task history..." />
      ) : tasks.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-3">
          <Bot className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-200">No tasks found</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search query or status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((t) => (
            <TaskCard key={t._id} task={t} />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
