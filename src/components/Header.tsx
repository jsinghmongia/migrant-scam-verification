import React from 'react';
import { ShieldAlert, CheckCircle, HelpCircle, AlertTriangle, Menu, Award } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const navItems = [
    { id: 'verifier', label: 'Verify Job & Agent', icon: CheckCircle },
    { id: 'whatsapp', label: 'WhatsApp Bot Simulator', icon: HelpCircle },
    { id: 'reports', label: 'Reported Scams Feed', icon: ShieldAlert },
  ];

  return (
    <header id="app-header" className="sticky top-0 z-50 bg-white text-slate-800 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('verifier')}>
            <div className="bg-blue-600 text-white p-2 rounded flex items-center justify-center shadow-md shadow-blue-500/10">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display font-bold text-lg sm:text-xl tracking-tight block text-slate-800">
                Mobi<span className="text-blue-600 underline decoration-2 underline-offset-4">Verifier</span>
              </span>
              <span className="text-[9px] uppercase font-mono text-slate-400 tracking-wider font-semibold block -mt-1">
                Migrant Recruitment Protection
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 items-center text-sm font-medium text-slate-600 h-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 h-full px-1 border-b-2 transition-all duration-200 ${
                    isActive
                      ? 'border-blue-600 text-blue-600 font-bold'
                      : 'border-transparent text-slate-600 hover:text-blue-600 hover:border-blue-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Badge & Meta */}
          <div className="flex items-center space-x-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
            <Award className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
            <span className="text-xs font-mono text-slate-600">MIL Hackathon Demo</span>
          </div>
        </div>
      </div>
      
      {/* Mobile Sub-navigation Bar */}
      <div className="md:hidden bg-slate-50 border-t border-slate-200 flex overflow-x-auto whitespace-nowrap py-2 px-4 scrollbar-none">
        <div className="flex space-x-2 mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-mob-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-600 bg-white border border-slate-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
