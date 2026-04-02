import { Briefcase, BarChart3, Settings, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SidebarProps {
  onAddClick: () => void;
}

export default function Sidebar({ onAddClick }: SidebarProps) {
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // Even if signOut fails, we still want to take the user to login.
      console.error('Error signing out:', e);
    } finally {
      window.location.href = '/login';
    }
  };

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-8 h-8 text-blue-400" />
          <h1 className="text-xl font-bold">JobTracker</h1>
        </div>
        <p className="text-slate-400 text-sm">Track your career journey</p>
      </div>

      <button
        onClick={onAddClick}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 mb-6 transition-colors"
      >
        <Plus className="w-5 h-5" />
        New Application
      </button>

      <nav className="flex-1 space-y-2">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-white"
        >
          <BarChart3 className="w-5 h-5" />
          Dashboard
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Briefcase className="w-5 h-5" />
          Applications
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
          Settings
        </a>
      </nav>

      <div className="pt-6 border-t border-slate-800">
        <p className="text-slate-500 text-xs">Made with care</p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
