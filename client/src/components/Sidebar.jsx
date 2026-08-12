import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, Settings, Sparkles } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Create Task', path: '/create', icon: PlusCircle },
    { label: 'Task History', path: '/history', icon: History },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 min-h-[calc(100vh-61px)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600/30 to-indigo-600/30 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-950/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Quick Info Box */}
      <div className="p-4 rounded-xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 text-xs space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Grok Agent Engine</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          Autonomous step reasoning, controlled tool execution, and real-time logging.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
