import React from 'react';
import { Bot } from 'lucide-react';

const Loading = ({ message = 'Loading agent environment...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[300px] text-center">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 animate-pulse">
          <Bot className="w-6 h-6 animate-bounce" />
        </div>
        <div className="absolute inset-0 rounded-2xl bg-cyan-500/20 blur-xl -z-10 animate-pulse"></div>
      </div>
      <p className="text-sm font-medium text-slate-300 font-display">{message}</p>
    </div>
  );
};

export default Loading;
