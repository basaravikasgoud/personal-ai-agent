import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import TaskCard from '../components/TaskCard';
import Loading from '../components/Loading';
import { Sparkles, Play, Plus, Activity, CheckCircle2, Clock, Bot, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickDesc, setQuickDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickRun = async (e) => {
    e.preventDefault();
    if (!quickDesc.trim()) return;

    setSubmitting(true);
    try {
      const title = quickTitle.trim() || quickDesc.slice(0, 45) + '...';
      const res = await API.post('/tasks', {
        title,
        description: quickDesc,
        priority: 'medium',
        autoRun: true,
      });

      if (res.data.success) {
        navigate(`/tasks/${res.data.task._id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const setExamplePrompt = (promptTitle, promptDesc) => {
    setQuickTitle(promptTitle);
    setQuickDesc(promptDesc);
  };

  const activeTasks = tasks.filter((t) => t.status === 'running' || t.status === 'planning' || t.status === 'pending');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Hero */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs mb-1">
                <Sparkles className="w-4 h-4" />
                <span>AI Agent Control Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-display">
                {getTimeOfDayGreeting()}, {user?.name || 'User'}!
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                What goal would you like your Grok AI agent to accomplish today?
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 text-xs">
                <div className="text-right">
                  <span className="text-slate-400 block">Agent Status</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Ready to execute
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Task Entry Card */}
          <form onSubmit={handleQuickRun} className="space-y-3">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Optional Task Title e.g. 'Physics Study Plan'"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
              />

              <div className="relative">
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your task in natural language... e.g. 'Create a study plan for my exams for the next 14 days, including daily hours breakdown and revision reminders.'"
                  value={quickDesc}
                  onChange={(e) => setQuickDesc(e.target.value)}
                  className="w-full p-4 pr-32 rounded-2xl bg-slate-950/90 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600 resize-none shadow-inner"
                />

                <button
                  type="submit"
                  disabled={submitting || !quickDesc.trim()}
                  className="absolute bottom-3.5 right-3.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-cyan-500/30 hover:opacity-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? (
                    'Initializing...'
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" /> Run AI Agent
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Example Prompt Chips */}
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
              <span className="text-[11px] font-mono text-slate-500">Quick Prompts:</span>
              <button
                type="button"
                onClick={() =>
                  setExamplePrompt(
                    'Physics Exam Prep Plan',
                    'Create a study plan for my exams for the next 14 days with daily hours breakdown and notes.'
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors text-[11px]"
              >
                📚 14-Day Study Plan
              </button>

              <button
                type="button"
                onClick={() =>
                  setExamplePrompt(
                    'Code Refactoring Plan',
                    'Analyze legacy codebase components, suggest modular architecture, and set up automated unit test tasks.'
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors text-[11px]"
              >
                💻 Code Refactor Strategy
              </button>

              <button
                type="button"
                onClick={() =>
                  setExamplePrompt(
                    'Weekly Goal Schedule',
                    'Organize weekly priorities, calculate daily study time allocations, and generate daily reminder notes.'
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors text-[11px]"
              >
                ⏰ Weekly Productivity Setup
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-100 font-display">{activeTasks.length}</span>
            <span className="text-xs text-slate-400 block">Active Tasks</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-100 font-display">{completedTasks.length}</span>
            <span className="text-xs text-slate-400 block">Completed Tasks</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-100 font-display">{tasks.length}</span>
            <span className="text-xs text-slate-400 block">Total Created</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-800/60 text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-100 font-display">4 Tools</span>
            <span className="text-xs text-slate-400 block">Safety Architecture</span>
          </div>
        </div>
      </div>

      {/* Task Sections */}
      <div className="space-y-6">
        {/* Active Tasks Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 font-display flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" /> Active & Running Tasks
            </h2>
            <span className="text-xs text-slate-400 font-mono">{activeTasks.length} active</span>
          </div>

          {loading ? (
            <Loading message="Fetching active agent tasks..." />
          ) : activeTasks.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-center space-y-2 border border-slate-800">
              <Bot className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-medium text-slate-300">No active tasks executing</p>
              <p className="text-xs text-slate-500">
                Enter a task above or click "Create Task" to start a new Grok AI plan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTasks.map((t) => (
                <TaskCard key={t._id} task={t} />
              ))}
            </div>
          )}
        </div>

        {/* Recently Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-100 font-display flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recently Completed Tasks
              </h2>
              <button
                onClick={() => navigate('/history')}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium"
              >
                View full history <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedTasks.slice(0, 3).map((t) => (
                <TaskCard key={t._id} task={t} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
