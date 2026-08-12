import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, Play, ArrowLeft, Sliders, ShieldCheck } from 'lucide-react';

const CreateTask = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [autoRun, setAutoRun] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    try {
      const taskTitle = title.trim() || description.slice(0, 45) + '...';
      const res = await API.post('/tasks', {
        title: taskTitle,
        description,
        priority,
        autoRun,
      });

      if (res.data.success) {
        navigate(`/tasks/${res.data.task._id}`);
      }
    } catch (err) {
      console.error('Task creation failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const applyTemplate = (tTitle, tDesc) => {
    setTitle(tTitle);
    setDescription(tDesc);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="glass-panel p-8 rounded-3xl space-y-6">
        <div className="space-y-2 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
            <Bot className="w-4 h-4" />
            <span>Task Reasoning Prompt Setup</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 font-display">Create New AI Task</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Provide a natural language description. Grok will break down your goal into structured, safe steps and execute corresponding tools.
          </p>
        </div>

        {/* Templates selector */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-slate-300">Preset Templates</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() =>
                applyTemplate(
                  '14-Day Exam Study Roadmap',
                  'Create a study plan for my exams for the next 14 days. Include daily topic focus, revision blocks, daily study hours calculation, and study slot reminders.'
                )
              }
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 text-left transition-all space-y-1 group"
            >
              <span className="text-xs font-semibold text-cyan-300 group-hover:text-cyan-200 block">📚 Exam Study Plan</span>
              <span className="text-[11px] text-slate-400 line-clamp-2">14-day study schedule with topic breakdown & study reminders.</span>
            </button>

            <button
              type="button"
              onClick={() =>
                applyTemplate(
                  'Weekly Budget & Expense Calculation',
                  'Calculate total estimated monthly software subscription costs and break down weekly software expenses.'
                )
              }
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 text-left transition-all space-y-1 group"
            >
              <span className="text-xs font-semibold text-purple-300 group-hover:text-purple-200 block">🧮 Budget Calculation</span>
              <span className="text-[11px] text-slate-400 line-clamp-2">Math calculator tool execution & expense breakdown notes.</span>
            </button>

            <button
              type="button"
              onClick={() =>
                applyTemplate(
                  'Topic Research & Synthesis',
                  'Research key concepts, summarize findings, and structure quick reference notes for study.'
                )
              }
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 text-left transition-all space-y-1 group"
            >
              <span className="text-xs font-semibold text-sky-300 group-hover:text-sky-200 block">🔍 Topic Research</span>
              <span className="text-[11px] text-slate-400 line-clamp-2">Web search tool lookup & concise knowledge notes.</span>
            </button>
          </div>
        </div>

        {/* Task Form */}
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Task Title</label>
            <input
              type="text"
              placeholder="e.g. Prepare my physics study plan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Task Description & Requirements</label>
            <textarea
              rows={5}
              required
              placeholder="I have an exam in two weeks. Create a daily study plan with revision schedules and notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRun}
                  onChange={(e) => setAutoRun(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                <span className="ml-3 text-xs font-medium text-slate-300">
                  Execute Agent Immediately
                </span>
              </label>
            </div>
          </div>

          {/* Safety Architecture Disclaimer */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              All agent steps are strictly validated against registered safety tools (Calculator, Notes, WebSearch, Reminder).
            </span>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || !description.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Creating Task...' : 'Launch Grok Agent'} <Play className="w-3.5 h-3.5 fill-white" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
