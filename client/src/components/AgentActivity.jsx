import React, { useEffect, useRef } from 'react';
import { Terminal, Activity, CheckCircle2, AlertTriangle, Cpu, Wrench, Sparkles } from 'lucide-react';

const AgentActivity = ({ logs = [] }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogIcon = (type) => {
    switch (type) {
      case 'step_start':
        return <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />;
      case 'step_complete':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />;
      case 'tool_call':
        return <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />;
      case 'tool_result':
        return <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />;
      case 'error':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />;
      case 'finish':
        return <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />;
      default:
        return <Cpu className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden flex flex-col h-full">
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
            Agent Execution Activity Log
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50 text-cyan-300">
          {logs.length} entries
        </span>
      </div>

      <div
        ref={scrollRef}
        className="p-4 space-y-3 font-mono text-xs overflow-y-auto max-h-[420px] bg-slate-950/80"
      >
        {logs.length === 0 ? (
          <p className="text-slate-500 text-center py-6 italic text-[11px]">
            Waiting for agent logs...
          </p>
        ) : (
          logs.map((log, index) => (
            <div key={log._id || index} className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-[10px] text-slate-500 shrink-0 pt-0.5">
                {new Date(log.createdAt).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              {getLogIcon(log.type)}
              <span className={`text-[11px] ${
                log.type === 'error'
                  ? 'text-rose-300'
                  : log.type === 'step_complete' || log.type === 'finish'
                  ? 'text-emerald-300 font-medium'
                  : log.type === 'tool_call'
                  ? 'text-amber-300'
                  : 'text-slate-300'
              }`}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AgentActivity;
