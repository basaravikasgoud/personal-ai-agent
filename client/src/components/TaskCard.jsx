import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, AlertCircle, PlayCircle, XCircle, ArrowRight, Wrench } from 'lucide-react';

const TaskCard = ({ task }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/70 border border-emerald-800/60 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'running':
      case 'planning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-950/70 border border-cyan-800/60 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span> Executing
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-950/70 border border-rose-800/60 text-rose-400">
            <AlertCircle className="w-3.5 h-3.5" /> Failed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-700 text-slate-400">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950/70 border border-amber-800/60 text-amber-400">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  const getPriorityBadge = (priority) => {
    const p = (priority || 'medium').toLowerCase();
    if (p === 'high') return <span className="text-[11px] font-mono uppercase text-rose-400 font-semibold">High</span>;
    if (p === 'low') return <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Low</span>;
    return <span className="text-[11px] font-mono uppercase text-amber-400 font-semibold">Med</span>;
  };

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          {getStatusBadge(task.status)}
          {getPriorityBadge(task.priority)}
        </div>

        <h3 className="text-base font-semibold text-slate-100 line-clamp-1 group-hover:text-cyan-400 transition-colors">
          {task.title}
        </h3>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
          {task.plan?.totalSteps > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded-md border border-cyan-800/40">
              <Wrench className="w-3 h-3" /> {task.plan.totalSteps} steps
            </span>
          )}
        </div>

        <Link
          to={`/tasks/${task._id}`}
          className="inline-flex items-center gap-1 font-medium text-cyan-400 hover:text-cyan-300 hover:translate-x-0.5 transition-all text-xs"
        >
          Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default TaskCard;
