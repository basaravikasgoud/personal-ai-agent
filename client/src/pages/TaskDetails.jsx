import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import TaskStep from '../components/TaskStep';
import AgentActivity from '../components/AgentActivity';
import Loading from '../components/Loading';
import {
  ArrowLeft,
  Play,
  XCircle,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Wrench,
  Bot,
  Copy,
  Check,
  Sparkles,
  FileText,
} from 'lucide-react';

import MarkdownRenderer from '../components/MarkdownRenderer';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [steps, setSteps] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchTaskDetails = async () => {
    try {
      const res = await API.get(`/tasks/${id}`);
      if (res.data.success) {
        setTask(res.data.task);
        setSteps(res.data.steps || []);
        setLogs(res.data.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
    // Poll for status updates while task is running or planning
    const interval = setInterval(() => {
      fetchTaskDetails();
    }, 2000);

    return () => clearInterval(interval);
  }, [id]);

  const handleRunAgent = async () => {
    setActionLoading(true);
    try {
      await API.post(`/tasks/${id}/run`);
      await fetchTaskDetails();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelTask = async () => {
    setActionLoading(true);
    try {
      await API.post(`/tasks/${id}/cancel`);
      await fetchTaskDetails();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRetryStep = async (stepId) => {
    try {
      await API.post(`/tasks/${id}/steps/${stepId}/retry`);
      await fetchTaskDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const copyResultToClipboard = () => {
    if (task?.result?.output) {
      navigator.clipboard.writeText(task.result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading && !task) {
    return <Loading message="Loading task activity..." />;
  }

  if (!task) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center space-y-4 max-w-lg mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-100">Task Not Found</h2>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isExecuting = task.status === 'running' || task.status === 'planning';

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          {isExecuting && (
            <button
              onClick={handleCancelTask}
              disabled={actionLoading}
              className="px-3.5 py-1.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-medium hover:bg-rose-900 transition-colors flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" /> Cancel Task
            </button>
          )}

          {!isExecuting && task.status !== 'completed' && (
            <button
              onClick={handleRunAgent}
              disabled={actionLoading}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold hover:opacity-95 transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Run Agent Execution
            </button>
          )}
        </div>
      </div>

      {/* Task Overview Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 relative overflow-hidden">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                Task ID: {task._id.slice(-6)}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">
                Created {new Date(task.createdAt).toLocaleString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-display">
              {task.title}
            </h1>
          </div>

          <div>
            {task.status === 'completed' && (
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-700/80 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Completed
              </span>
            )}
            {isExecuting && (
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-700/80 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                Executing Agent ({task.status})
              </span>
            )}
            {task.status === 'failed' && (
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-950/80 border border-rose-700/80 text-rose-400">
                <AlertCircle className="w-4 h-4" /> Execution Failed
              </span>
            )}
            {task.status === 'cancelled' && (
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-400">
                <XCircle className="w-4 h-4" /> Cancelled
              </span>
            )}
          </div>
        </div>

        {/* Goal Card */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
          <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold block">Goal</span>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {task.plan?.goal || task.description}
          </p>
        </div>
      </div>

      {/* Main Grid: Steps & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Structured Steps (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <Wrench className="w-4 h-4 text-cyan-400" /> Agent Activity Steps
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {steps.filter((s) => s.status === 'completed').length} / {steps.length} completed
            </span>
          </div>

          <div className="space-y-3">
            {steps.length === 0 ? (
              <div className="glass-panel p-6 rounded-2xl text-center text-xs text-slate-400 italic">
                {isExecuting ? 'Grok is generating structured step plan...' : 'No steps generated.'}
              </div>
            ) : (
              steps.map((step) => (
                <TaskStep key={step._id} step={step} onRetry={handleRetryStep} />
              ))
            )}
          </div>
        </div>

        {/* Right Column: Live Log Stream Terminal (5 cols) */}
        <div className="lg:col-span-5 h-[480px]">
          <AgentActivity logs={logs} />
        </div>
      </div>

      {/* Result Card Section */}
      {task.result?.output && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border border-emerald-900/40">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-100 font-display">Agent Final Deliverable</h2>
            </div>

            <button
              onClick={copyResultToClipboard}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Result'}
            </button>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed font-sans">
            <MarkdownRenderer content={task.result.output} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
