import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ChatAssistant } from './components/ChatAssistant';
import { PolicyAnalyzer } from './components/PolicyAnalyzer';
import { LayoutDashboard, MessageSquare, FileBarChart, Settings, Bell, UserCircle } from 'lucide-react';

enum View {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  POLICY = 'POLICY'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard />;
      case View.CHAT:
        return <ChatAssistant />;
      case View.POLICY:
        return <PolicyAnalyzer />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">F</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">FiscusAI</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Ministry of Finance</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setCurrentView(View.DASHBOARD)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === View.DASHBOARD ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Overview</span>
          </button>

          <button
            onClick={() => setCurrentView(View.POLICY)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === View.POLICY ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileBarChart size={20} />
            <span className="font-medium">Policy Simulation</span>
          </button>

          <button
            onClick={() => setCurrentView(View.CHAT)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === View.CHAT ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MessageSquare size={20} />
            <span className="font-medium">AI Assistant</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center md:hidden">
            <span className="font-bold text-slate-900">FiscusAI</span>
          </div>
          
          <div className="hidden md:flex items-center text-sm text-slate-500">
            <span className="font-medium text-slate-900">Fiscal Year 2024</span>
            <span className="mx-2 text-slate-300">|</span>
            <span>Q3 Report Active</span>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-900">Hon. J. Doe</p>
                <p className="text-xs text-slate-500">Senior Analyst</p>
              </div>
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <UserCircle size={24} />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto h-full">
             {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
