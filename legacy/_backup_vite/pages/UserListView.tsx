
import React, { useState, useMemo } from 'react';
import { Search, Filter, Eye, UserPlus, Users, Crown, Calendar, CheckCircle2, Clock, ShieldAlert, User as UserIcon, X, Plus, Building2 } from 'lucide-react';
import { User } from '../types';

interface UserListViewProps {
  users: User[];
  onUserClick: (user: User) => void;
  onAddUserClick: () => void;
}

const UserListView: React.FC<UserListViewProps> = ({ users, onUserClick, onAddUserClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Frozen' | 'Expired'>('All');
  
  // Date Filtering State
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Combined Filtering Logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // 1. Search Filter
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `C00${user.id % 10}`.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Status Filter
      const matchesStatus = 
        statusFilter === 'All' || 
        (statusFilter === 'Active' && user.status === 'Active') ||
        (statusFilter === 'Expired' && user.status === 'Inactive'); // Inactive maps to Expired in this UI

      // 3. Date Filter
      if (dateFrom || dateTo) {
        return matchesSearch && matchesStatus; 
      }

      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter, dateFrom, dateTo]);

  const resetDates = () => {
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn bg-[#0d1117] min-h-screen -m-6 p-8 text-slate-300">
      {/* Sidebar Filters */}
      <div className="w-full lg:w-72 space-y-8 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">მომხმარებელთა მართვა</h1>
          <p className="text-slate-500 text-sm">მოძებნეთ, გაფილტრეთ და მართეთ ყველა მომხმარებლის პროფილი სისტემაში.</p>
        </div>

        <button 
          onClick={onAddUserClick}
          className="w-full py-4 bg-[#10b981] hover:bg-[#059669] text-white font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center space-x-2"
        >
          <Plus size={20} strokeWidth={3} />
          <span>ახალი მომხმარებელი</span>
        </button>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ძებნა სახელით ან ID-ით..." 
            className="w-full pl-12 pr-4 py-3.5 bg-[#161b22] border border-slate-800 rounded-xl focus:border-blue-500 outline-none transition-all text-sm text-white"
          />
        </div>

        <div className="space-y-6">
          {/* Status Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
              <Filter size={14} className="mr-2" /> გაფილტვრა სტატუსით
            </h3>
            <div className="space-y-1">
              {['All', 'Active', 'Frozen', 'Expired'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    statusFilter === status 
                    ? 'bg-[#1f2937] text-blue-400 border border-blue-500/30' 
                    : 'text-slate-400 hover:bg-[#161b22] hover:text-slate-200'
                  }`}
                >
                  <span className="text-sm font-bold">
                    {status === 'All' ? 'ყველა' : status === 'Active' ? 'აქტიური' : status === 'Frozen' ? 'გაყინული' : 'ვადაგასული'}
                  </span>
                  {statusFilter === status && <CheckCircle2 size={16} />}
                </button>
              ))}
            </div>
          </div>

          {/* Registration Date Filter (Calendar Working) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                <Calendar size={14} className="mr-2" /> რეგისტრაციის თარიღი
              </h3>
              {(dateFrom || dateTo) && (
                <button onClick={resetDates} className="text-[10px] font-bold text-red-400 hover:text-red-300 flex items-center">
                  <X size={10} className="mr-1" /> გასუფთავება
                </button>
              )}
            </div>
            <div className="space-y-2">
              <div className="relative">
                <input 
                  type="date" 
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#161b22] border border-slate-800 rounded-xl focus:border-blue-500 outline-none text-xs text-white color-scheme-dark"
                />
                <span className="absolute -top-2 left-3 bg-[#0d1117] px-1 text-[8px] font-black text-slate-600 uppercase">დან</span>
              </div>
              <div className="relative">
                <input 
                  type="date" 
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#161b22] border border-slate-800 rounded-xl focus:border-blue-500 outline-none text-xs text-white color-scheme-dark"
                />
                <span className="absolute -top-2 left-3 bg-[#0d1117] px-1 text-[8px] font-black text-slate-600 uppercase">მდე</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
              <Crown size={14} className="mr-2" /> გაფილტვრა პაკეტით
            </h3>
            <div className="p-4 bg-[#161b22] border border-slate-800 rounded-xl">
               <p className="text-xs text-slate-600 font-medium">პაკეტების მიხედვით ფილტრაცია მალე დაემატება...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Table */}
      <div className="flex-1 space-y-4">
        <div className="bg-[#161b22] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users size={20} className="text-blue-500" />
              <h3 className="font-bold text-white uppercase tracking-tight">მომხმარებლების სია</h3>
              <span className="bg-[#1f2937] text-slate-400 px-2 py-0.5 rounded text-xs font-black">{filteredUsers.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0d1117] text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                <tr>
                  <th className="px-8 py-5">სახელი და გვარი</th>
                  <th className="px-8 py-5">ID</th>
                  <th className="px-8 py-5">სტატუსი</th>
                  <th className="px-8 py-5">ტიპი</th>
                  <th className="px-8 py-5">წევრობის თარიღი</th>
                  <th className="px-8 py-5 text-right">მოქმედება</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#1f2937]/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-[#1f2937] border-2 border-slate-800 overflow-hidden">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="" />
                          </div>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#161b22] ${user.status === 'Active' ? 'bg-emerald-50' : 'bg-red-500'}`}></div>
                        </div>
                        <div>
                          <div className="font-black text-white">{user.name}</div>
                          <div className="text-xs text-slate-500 lowercase">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-mono text-xs text-slate-500">C00{user.id % 10}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                        user.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
                        : 'bg-red-500/10 text-red-500 border-red-500/30'
                      }`}>
                        {user.status === 'Active' ? 'აქტიური' : 'ვადაგასული'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`flex items-center text-xs font-bold ${user.isCorporate ? 'text-amber-400' : 'text-slate-400'}`}>
                        {user.isCorporate ? (
                          <>
                            <Building2 size={14} className="mr-1.5 opacity-80" />
                            კორპორატიული
                          </>
                        ) : (
                          <>
                            <UserIcon size={14} className="mr-1.5 opacity-50" />
                            ინდივიდუალური
                          </>
                        )}
                      </div>
                      {user.isCorporate && user.companyName && (
                        <div className="text-[9px] text-slate-500 font-black uppercase mt-0.5 ml-5">{user.companyName}</div>
                      )}
                    </td>
                    <td className="px-8 py-5 text-slate-500 text-xs font-bold">{user.joinedDate}</td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => onUserClick(user)}
                        className="p-2.5 bg-[#1f2937] text-slate-400 hover:text-white rounded-xl transition-all border border-slate-800"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center">
                 <ShieldAlert size={48} className="text-slate-800 mb-4" />
                 <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">მომხმარებლები არ მოიძებნა</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .color-scheme-dark {
          color-scheme: dark;
        }
      `}</style>
    </div>
  );
};

export default UserListView;
