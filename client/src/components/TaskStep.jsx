import React, { useState } from 'react';
import { CheckCircle2, Clock, Loader2, AlertCircle, Wrench, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

const TaskStep = ({ step, onRetry }) => {
  const [expanded, setExpanded] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    setRetrying(true);
    await onRetry(step._id);
    setRetrying(false);
  };

  const getStepIcon = () => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'running':
      case 'planning':
        return <Loader2 className="w-5 h-5 text-cyan-400 animate-spin shrink-0" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      default:
        return <Clock className="w-5 h-5 text-slate-500 shrink-0" />;
    }
  };

  const getToolBadgeClass = (tool) => {
    switch (tool) {
      case 'calculator':
        return 'bg-purple-950/70 border-purple-800/60 text-purple-300';
      case 'webSearch':
        return 'bg-sky-950/70 border-sky-800/60 text-sky-300';
      case 'reminder':
        return 'bg-amber-950/70 border-amber-800/60 text-amber-300';
      default:
        return 'bg-indigo-950/70 border-indigo-800/60 text-indigo-300';
    }
  };

  return (
    <div className={`rounded-xl border transition-all ${
      step.status === 'running'
        ? 'bg-cyan-950/20 border-cyan-500/50 shadow-md shadow-cyan-950/50'
        : step.status === 'failed'
        ? 'bg-rose-950/20 border-rose-800/50'
        : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
    }`}>
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="pt-0.5">{getStepIcon()}</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-slate-400">Step {step.order}</span>
              <h4 className="text-sm font-semibold text-slate-100">{step.title}</h4>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono border flex items-center gap-1 ${getToolBadgeClass(step.tool)}`}>
                <Wrench className="w-2.5 h-2.5" />
                {step.tool}
              </span>
            </div>
            {step.description && <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {step.status === 'failed' && (
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="px-2.5 py-1 rounded-lg bg-rose-900/40 hover:bg-rose-800/60 border border-rose-700/50 text-rose-200 text-xs flex items-center gap-1 transition-colors"
            >
              <RotateCcw className={`w-3 h-3 ${retrying ? 'animate-spin' : ''}`} /> Retry
            </button>
          )}

          {(step.input || step.output || step.error) && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded tool details drawer */}
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 space-y-3 text-xs">
          {step.error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300">
              <span className="font-semibold block mb-1">Error Trace:</span>
              <p className="font-mono text-[11px]">{step.error}</p>
            </div>
          )}

          {step.input && Object.keys(step.input).length > 0 && (
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400">Tool Input:</span>
              <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-[11px] overflow-x-auto">
                {JSON.stringify(step.input, null, 2)}
              </pre>
            </div>
          )}

          {step.output && (
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400">Tool Output:</span>
              <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-[11px] overflow-x-auto max-h-40">
                {JSON.stringify(step.output, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskStep;
