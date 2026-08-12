import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Cpu, ShieldCheck, User, Wrench, Check, Save } from 'lucide-react';

const Settings = () => {
  const { user, updatePreferences } = useAuth();

  const [autoRun, setAutoRun] = useState(user?.preferences?.autoRunAgent ?? true);
  const [priority, setPriority] = useState(user?.preferences?.defaultPriority || 'medium');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await updatePreferences({
      autoRunAgent: autoRun,
      defaultPriority: priority,
    });
    setSaving(false);

    if (res.success) {
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 font-display flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-cyan-400" /> Agent & System Settings
        </h1>
        <p className="text-xs text-slate-400">
          Configure Grok integration parameters, safety execution policies, and user preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grok Engine Status Card */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100 font-display">Grok API Configuration</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-slate-400 block text-[11px]">API Key Status:</span>
              {user?.hasGrokApiKey ? (
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  GROK_API_KEY Active (xAI Grok-2)
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    Local Agent Fallback Active
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Add <code className="text-cyan-300">GROK_API_KEY=your_key</code> to <code className="text-slate-300">server/.env</code> to enable direct xAI Grok API calls.
                  </p>
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">Target Endpoint:</span>
              <p className="text-xs font-mono text-cyan-300">https://api.x.ai/v1/chat/completions</p>
            </div>
          </div>
        </div>

        {/* Safety Tools Overview */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-100 font-display">Registered Safety Tools</h2>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-mono text-slate-200">calculator</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                Authorized
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-mono text-slate-200">notes</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                Authorized
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-mono text-slate-200">webSearch</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                Authorized
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-slate-200">reminder</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                Authorized
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Form */}
      <form onSubmit={handleSave} className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        <h2 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
          <User className="w-4 h-4 text-cyan-400" /> User & Execution Preferences
        </h2>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div>
              <span className="font-semibold text-slate-200 block text-sm">Auto-run AI Agent</span>
              <span className="text-slate-400">Automatically trigger step planning and execution upon task creation</span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoRun}
                onChange={(e) => setAutoRun(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div>
              <span className="font-semibold text-slate-200 block text-sm">Default Priority</span>
              <span className="text-slate-400">Default priority assigned to new tasks</span>
            </div>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-medium"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedMsg ? (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-4 h-4" /> Preferences saved!
            </span>
          ) : (
            <span></span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
