
import React, { useState, useMemo } from 'react';
import { User as UserType, Package } from '../types';
import { 
  ArrowLeft, Phone, Mail, MapPin, Calendar, CreditCard, 
  Save, CheckCircle, AlertCircle, ShieldAlert, FileText, 
  Upload, History, Heart, Star, Lock, Smartphone, MoreHorizontal,
  Plus, X, Search, ChevronRight, FileCheck, Eye, Download, Trash2,
  Ban, CheckCircle2, RefreshCw, Key
} from 'lucide-react';

interface UserDetailViewProps {
  user: UserType;
  packages: Package[];
  onBack: () => void;
  onAssignPackage: (userId: number, packageId: string) => void;
}

// Mock Access Logs
const mockAccessLogs = [
  { id: 1, location: 'მთავარი ტურნიკეტი', time: '2023-10-21 18:15:02', status: 'Failure', reason: 'Membership Expired' },
  { id: 2, location: 'პარკინგის ჭიშკარი', time: '2023-10-20 09:00:00', status: 'Success' },
  { id: 3, location: 'მთავარი ტურნიკეტი', time: '2023-10-20 09:05:12', status: 'Success' },
];

const UserDetailView: React.FC<UserDetailViewProps> = ({ user, packages, onBack, onAssignPackage }) => {
  const [activeTab, setActiveTab] = useState('PROFILE');
  const [notes, setNotes] = useState('');
  
  // Access Logs Filtering
  const [accessDateFrom, setAccessDateFrom] = useState('');
  const [accessDateTo, setAccessDateTo] = useState('');

  // Mock Uploaded Documents
  const mockDocs = [
    { id: 1, name: 'ID_CARD_SCAN.pdf', type: 'ID / პასპორტი', date: '2023-10-25' },
    { id: 2, name: 'HEALTH_CERT.jpg', type: 'ჯანმრთელობის ცნობა', date: '2023-11-01' },
    { id: 3, name: 'BIRTH_CERTIFICATE.pdf', type: 'დაბადების მოწმობა', date: '2023-11-05', isConditional: true }
  ];

  const tabs = [
    { id: 'PROFILE', label: 'პროფილი', icon: <UserIcon size={16} /> },
    { id: 'MEMBERSHIPS', label: 'აბონემენტები', icon: <CreditCard size={16} /> },
    { id: 'FINANCE', label: 'ფინანსები', icon: <Dollar size={16} /> },
    { id: 'ACTIVITY', label: 'აქტივობა', icon: <History size={16} /> },
    { id: 'HEALTH', label: 'ჯანმრთელობა', icon: <Heart size={16} /> },
    { id: 'LOYALTY', label: 'ლოიალობა', icon: <Star size={16} /> },
    { id: 'ACCESS', label: 'დაშვება და მოწყობილობები', icon: <Smartphone size={16} /> },
  ];

  const filteredLogs = useMemo(() => {
    return mockAccessLogs.filter(log => {
      if (!accessDateFrom && !accessDateTo) return true;
      const logDate = log.time.split(' ')[0];
      if (accessDateFrom && logDate < accessDateFrom) return false;
      if (accessDateTo && logDate > accessDateTo) return false;
      return true;
    });
  }, [accessDateFrom, accessDateTo]);

  const handleEditProfile = () => {
    alert('პროფილის რედაქტირების რეჟიმი გააქტიურებულია');
  };

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn bg-[#0d1117] min-h-screen -m-6 p-10 text-slate-300">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-white transition-colors mb-10 group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold uppercase tracking-widest text-xs">უკან დაბრუნება</span>
      </button>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <div className="relative">
          <div className="w-32 h-32 rounded-[2.5rem] bg-[#161b22] border-4 border-slate-800 p-1">
             <img 
               src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} 
               alt="" 
               className="w-full h-full rounded-[2.2rem] object-cover bg-slate-900" 
             />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-[#0d1117] rounded-full flex items-center justify-center text-white">
             <CheckCircle size={20} />
          </div>
        </div>
        
        <div className="text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <h1 className="text-4xl font-black text-white tracking-tight">{user.name}</h1>
            <span className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg text-[10px] font-black uppercase flex items-center">
              <ShieldAlert size={12} className="mr-1.5" /> სამედიცინო გაფრთხილება
            </span>
          </div>
          <p className="text-slate-500 font-bold">წევრია: {user.joinedDate}</p>
        </div>

        <div className="ml-auto flex items-center gap-3">
           <button 
             onClick={handleEditProfile}
             className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95"
           >
             პროფილის რედაქტირება
           </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-1 bg-[#161b22] p-1.5 rounded-2xl mb-12 overflow-x-auto no-scrollbar border border-slate-800 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-[#1f2937] text-blue-400 shadow-md ring-1 ring-blue-500/20' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          
          {activeTab === 'PROFILE' && (
            <>
              <div className="bg-[#161b22] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-8 border-b border-slate-800 bg-slate-900/30">
                   <h3 className="font-black text-white uppercase tracking-tight flex items-center">
                     <UserIcon size={18} className="mr-2 text-blue-500" /> პერსონალური დეტალები
                   </h3>
                </div>
                <div className="p-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-12">
                    <DetailItem label="სრული სახელი" value={user.name} />
                    <DetailItem label="დაბადების თარიღი" value="1994-05-20" />
                    <DetailItem label="სტატუსი" value="აქტიური" isStatus />
                    <DetailItem label="ელ.ფოსტა" value={user.email} />
                    <DetailItem label="ტელეფონი" value={user.phone} />
                    <DetailItem label="მისამართი" value={user.address} />
                    <DetailItem label="წევრობის დონე" value="Gold" isTier />
                  </div>
                </div>
              </div>

              <div className="bg-[#161b22] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-8 border-b border-slate-800 bg-slate-900/30 flex justify-between items-center">
                   <h3 className="font-black text-white uppercase tracking-tight flex items-center">
                     <FileText size={18} className="mr-2 text-blue-500" /> დოკუმენტები
                   </h3>
                   <button className="flex items-center space-x-2 px-4 py-2 bg-[#1f2937] hover:bg-slate-700 text-xs font-black rounded-xl border border-slate-700 transition-all">
                     <Plus size={14} />
                     <span>ატვირთვა</span>
                   </button>
                </div>
                <div className="p-10">
                   {mockDocs.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockDocs.map((doc) => (
                           <div key={doc.id} className="p-5 bg-[#0d1117] rounded-3xl border border-slate-800 flex items-center justify-between group hover:border-blue-500 transition-all">
                              <div className="flex items-center space-x-4">
                                 <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center">
                                    <FileText size={24} />
                                 </div>
                                 <div>
                                    <h4 className="text-sm font-black text-white truncate max-w-[150px]">{doc.name}</h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{doc.type}</p>
                                 </div>
                              </div>
                              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"><Eye size={18} /></button>
                                 <button className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"><Download size={18} /></button>
                                 <button className="p-2 hover:bg-red-500/10 rounded-xl text-slate-400 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                              </div>
                           </div>
                        ))}
                     </div>
                   ) : (
                     <div className="py-12 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center text-center">
                        <FileText size={48} className="text-slate-800 mb-4" />
                        <p className="text-slate-500 font-bold">დოკუმენტები არ არის ატვირთული</p>
                     </div>
                   )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'ACCESS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
               <div className="space-y-6">
                  {/* Mobile App Access Card (Added per screenshot request) */}
                  <div className="bg-[#161b22] rounded-[2.5rem] border border-slate-800 overflow-hidden p-8 shadow-xl">
                     <div className="flex items-center space-x-3 mb-6">
                        <Smartphone size={24} className="text-blue-400" />
                        <h3 className="font-black text-white text-lg tracking-tight">Mobile App Access</h3>
                     </div>
                     
                     <div className="flex justify-between items-start mb-8">
                        <div>
                           <p className="text-base font-bold text-white mb-1">{user.email}</p>
                           <div className="flex items-center text-emerald-500 text-xs font-black uppercase">
                              <CheckCircle2 size={14} className="mr-1.5" />
                              Active
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-xs text-slate-500 font-medium">Last Login: Today, 09:15</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-3">
                        <button className="flex-1 px-4 py-3 bg-[#0d1117] border border-slate-800 text-white text-xs font-black uppercase rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 group">
                           <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                           Resend Invite
                        </button>
                        <button className="flex-1 px-4 py-3 bg-transparent border border-slate-700 text-slate-300 text-xs font-black uppercase rounded-xl hover:text-white hover:border-slate-500 transition-all flex items-center justify-center gap-2">
                           <Key size={14} />
                           Send Password Reset
                        </button>
                        <button className="p-3 border border-red-500/30 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                           <Ban size={18} />
                        </button>
                     </div>
                  </div>

                  <div className="bg-[#161b22] rounded-[2.5rem] border border-slate-800 overflow-hidden p-8">
                     <div className="flex items-center justify-between mb-8">
                        <h3 className="font-black text-white uppercase tracking-tight">ფიზიკური დაშვება</h3>
                        <button className="text-[10px] font-black uppercase text-blue-400 hover:text-blue-300">+ დამატება</button>
                     </div>
                     <div className="space-y-4">
                        <DeviceItem label="სამაჯური" id="0A1B2C3D" status="Active" />
                        <DeviceItem label="ბარათი" id="LOST-99" status="Lost" isLost />
                     </div>
                  </div>
               </div>

               <div className="bg-[#161b22] rounded-[2.5rem] border border-slate-800 overflow-hidden flex flex-col">
                  <div className="p-8 border-b border-slate-800 bg-slate-900/30">
                    <div className="flex items-center justify-between mb-4">
                       <h3 className="font-black text-white uppercase tracking-tight">ტურნიკეტის ლოგები</h3>
                       <div className="flex space-x-2">
                          <input 
                            type="date" 
                            value={accessDateFrom}
                            onChange={(e) => setAccessDateFrom(e.target.value)}
                            className="bg-[#0d1117] border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-white color-scheme-dark"
                          />
                          <input 
                            type="date" 
                            value={accessDateTo}
                            onChange={(e) => setAccessDateTo(e.target.value)}
                            className="bg-[#0d1117] border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-white color-scheme-dark"
                          />
                       </div>
                    </div>
                  </div>
                  <div className="p-8 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                     {filteredLogs.map(log => (
                        <div key={log.id} className="p-4 bg-[#0d1117] rounded-2xl border border-slate-800 flex justify-between items-center group hover:border-slate-600 transition-all">
                           <div className="flex items-center space-x-4">
                              <div className={`w-2 h-2 rounded-full ${log.status === 'Success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                              <div>
                                 <h4 className="text-xs font-black text-white">{log.location}</h4>
                                 <p className="text-[10px] text-slate-500 font-bold">{log.time}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <span className={`text-[9px] font-black uppercase ${log.status === 'Success' ? 'text-emerald-500' : 'text-red-500'}`}>{log.status}</span>
                              {log.reason && <p className="text-[8px] text-slate-600 font-bold">{log.reason}</p>}
                           </div>
                        </div>
                     ))}
                     {filteredLogs.length === 0 && (
                       <div className="py-20 text-center">
                          <ShieldAlert size={32} className="text-slate-800 mx-auto mb-2" />
                          <p className="text-xs text-slate-500 font-bold">ლოგები ვერ მოიძებნა</p>
                       </div>
                     )}
                  </div>
               </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== 'PROFILE' && activeTab !== 'ACCESS' && (
            <div className="bg-[#161b22] rounded-[2.5rem] border border-slate-800 p-20 text-center animate-fadeIn">
                <AlertCircle size={48} className="text-slate-800 mx-auto mb-4" />
                <h3 className="text-xl font-black text-white">{tabs.find(t => t.id === activeTab)?.label}</h3>
                <p className="text-slate-500 mt-2">მონაცემები დამუშავების პროცესშია...</p>
            </div>
          )}

        </div>

        {/* Sidebar Cards */}
        <div className="lg:col-span-4 space-y-8">
           {/* Internal Notes */}
           <div className="bg-[#161b22] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-8 border-b border-slate-800 bg-slate-900/30">
                 <h3 className="font-black text-white uppercase tracking-tight">შიდა ჩანაწერები</h3>
              </div>
              <div className="p-8 space-y-6">
                 <textarea 
                   value={notes}
                   onChange={e => setNotes(e.target.value)}
                   placeholder="დაამატეთ შენიშვნა მომხმარებლის პრეფერენციებზე, სამედიცინო გაფრთხილებებზე ან გაყიდვის შესაძლებლობებზე..."
                   className="w-full h-40 bg-[#0d1117] border border-slate-800 rounded-2xl p-6 text-sm font-medium text-slate-300 focus:border-blue-500 outline-none transition-all resize-none leading-relaxed"
                 />
                 <button className="w-full py-4 bg-[#1f2937] hover:bg-slate-700 text-white font-black rounded-2xl transition-all shadow-lg active:scale-95 uppercase text-xs tracking-widest">ჩანაწერის შენახვა</button>
              </div>
           </div>

           {/* Quick Actions Card */}
           <div className="bg-gradient-to-br from-blue-600/10 to-transparent p-8 rounded-[2.5rem] border border-blue-500/20 shadow-xl">
              <h4 className="text-white font-black text-lg mb-6 flex items-center">
                <AlertCircle size={20} className="mr-2 text-blue-400" /> სწრაფი მოქმედებები
              </h4>
              <div className="space-y-3">
                 <QuickActionButton label="აბონემენტის გაყინვა" />
                 <QuickActionButton label="ბალანსის შევსება" />
                 <QuickActionButton label="საშვის დაბლოკვა" isDanger />
              </div>
           </div>
        </div>
      </div>
      
      <style>{`
        .color-scheme-dark { color-scheme: dark; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
};

const DetailItem = ({ label, value, isStatus, isTier }: { label: string, value: string, isStatus?: boolean, isTier?: boolean }) => (
  <div className="space-y-1.5">
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
    <p className={`text-base font-black ${
      isStatus ? 'text-emerald-500' : 
      isTier ? 'text-amber-400 flex items-center gap-1.5' : 
      'text-white'
    }`}>
      {isTier && <Star size={14} fill="currentColor" />}
      {value}
    </p>
  </div>
);

const DeviceItem = ({ label, id, status, isLost }: { label: string, id: string, status: string, isLost?: boolean }) => (
  <div className={`p-4 bg-[#0d1117] border border-slate-800 rounded-2xl flex justify-between items-center ${isLost ? 'border-red-500/30 bg-red-500/5' : ''}`}>
     <div>
        <h4 className="text-xs font-black text-white">{label}</h4>
        <p className="text-[10px] text-slate-500 font-mono">{id}</p>
     </div>
     <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${isLost ? 'bg-red-500 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>{status}</span>
  </div>
);

const QuickActionButton = ({ label, isDanger }: { label: string, isDanger?: boolean }) => (
  <button className={`w-full text-left px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-tighter transition-all border ${
    isDanger ? 'bg-red-500/5 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10 hover:text-white'
  }`}>
    {label}
  </button>
);

const UserIcon = ({ size, className }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const Dollar = ({ size, className }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;

export default UserDetailView;
