import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  Ticket, 
  Dumbbell, 
  Users, 
  ShoppingBag, 
  Calculator, 
  BarChart2, 
  Settings,
  LogOut,
  Building2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  MessageSquare,
  Megaphone,
  Watch,
  User,
  List
} from 'lucide-react';
import { View } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const { t } = useLanguage();
  
  // State for the dropdowns
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  // Auto-expand if a child view is active
  useEffect(() => {
    if (currentView === View.PASSES || currentView === View.PASS_LIBRARY) {
      setIsActivityOpen(true);
    }
    if (currentView === View.ADD_USER || currentView === View.USER_LIST) {
      setIsUserOpen(true);
    }
  }, [currentView]);

  const menuItems = [
    { id: View.DASHBOARD, label: t('menu.dashboard'), icon: <LayoutDashboard size={20} /> },
    // Grouped User Item
    { id: 'USER_GROUP', label: t('menu.users'), icon: <User size={20} />, isGroup: true },
    // Grouped Activity Item
    { id: 'ACTIVITY_GROUP', label: t('menu.activity_group'), icon: <ClipboardList size={20} />, isGroup: true },
    { id: View.CORPORATE, label: t('menu.corporate'), icon: <Building2 size={20} /> },
    { id: View.PROMOTIONS, label: t('menu.promotions'), icon: <Megaphone size={20} /> },
    { id: View.EMPLOYEES, label: t('menu.employees'), icon: <Users size={20} /> },
    { id: View.MARKET, label: t('menu.market'), icon: <ShoppingBag size={20} /> },
    { id: View.ACCESSORIES, label: t('menu.accessories'), icon: <Watch size={20} /> },
    { id: View.MESSAGES, label: t('menu.messages'), icon: <MessageSquare size={20} /> },
    { id: View.ACCOUNTING, label: t('menu.accounting'), icon: <Calculator size={20} /> },
    { id: View.STATISTICS, label: t('menu.statistics'), icon: <BarChart2 size={20} /> },
    { id: View.SETTINGS, label: t('menu.settings'), icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col h-screen shadow-xl transition-all duration-300">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
        <div className="w-10 h-10 bg-lime-400 rounded-lg flex items-center justify-center font-bold text-xl text-slate-900 shadow-lg shadow-lime-400/20">
          A
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-wide text-white">ARTRON</h1>
          <p className="text-[10px] text-lime-400 font-medium tracking-widest uppercase">for PIXL FITNESS</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          if (item.isGroup) {
            
            // --- USER GROUP ---
            if (item.id === 'USER_GROUP') {
               const isUserGroupActive = currentView === View.ADD_USER || currentView === View.USER_LIST;
               return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => setIsUserOpen(!isUserOpen)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group hover:-translate-y-1 ${
                        isUserGroupActive
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`${isUserGroupActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                          {item.icon}
                        </span>
                        <span className="font-medium text-sm tracking-wide">{item.label}</span>
                      </div>
                      {isUserOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    {/* Submenu */}
                    {isUserOpen && (
                      <div className="ml-4 pl-4 border-l border-slate-700 space-y-1 animate-fadeIn">
                         <button
                            onClick={() => onChangeView(View.USER_LIST)}
                            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm hover:-translate-y-1 ${
                              currentView === View.USER_LIST || currentView === View.ADD_USER
                                ? 'bg-lime-400 text-slate-900 shadow-md font-bold'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
                          >
                            <List size={16} />
                            <span>{t('menu.user_list')}</span>
                          </button>
                      </div>
                    )}
                  </div>
               );
            }

            // --- ACTIVITY GROUP ---
            if (item.id === 'ACTIVITY_GROUP') {
              const isActiveGroup = currentView === View.PASSES || currentView === View.PASS_LIBRARY;
              
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => setIsActivityOpen(!isActivityOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group hover:-translate-y-1 ${
                      isActiveGroup
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`${isActiveGroup ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                        {item.icon}
                      </span>
                      <span className="font-medium text-sm tracking-wide">{item.label}</span>
                    </div>
                    {isActivityOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {/* Submenu */}
                  {isActivityOpen && (
                    <div className="ml-4 pl-4 border-l border-slate-700 space-y-1 animate-fadeIn">
                        <button
                          onClick={() => onChangeView(View.PASS_LIBRARY)}
                          className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm hover:-translate-y-1 ${
                            currentView === View.PASS_LIBRARY
                              ? 'bg-lime-400 text-slate-900 shadow-md font-bold'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                          }`}
                        >
                          <Dumbbell size={16} />
                          <span>{t('menu.library')}</span>
                        </button>
                    </div>
                  )}
                </div>
              );
            }
          }

          // Render Normal Items
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as View)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:-translate-y-1 ${
                currentView === item.id
                  ? 'bg-lime-400 text-slate-900 shadow-lg shadow-lime-900/10 font-bold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className={`${currentView === item.id ? 'text-slate-900' : 'text-slate-500 group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span className="font-medium text-sm tracking-wide">{item.label}</span>
              {currentView === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-900 shadow-sm" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all hover:-translate-y-1">
          <LogOut size={20} />
          <span className="font-medium text-sm">{t('menu.logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;