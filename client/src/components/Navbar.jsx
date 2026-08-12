import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bot, Sparkles, LogOut, User, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between">
      {/* Brand logo & tagline */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="relative p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
          <Bot className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
        </div>
        <div>
          <span className="text-xl font-bold font-display grok-text-gradient tracking-tight">
            Personal AI Agent
          </span>
          <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-mono tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 rounded-full">
            Grok Powered
          </span>
        </div>
      </Link>

      {/* User profile & API status badge */}
      {user && (
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Grok Engine:</span>
            {user.hasGrokApiKey ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Live API
              </span>
            ) : (
              <span className="text-amber-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Local Agent Mode
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-xs">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
