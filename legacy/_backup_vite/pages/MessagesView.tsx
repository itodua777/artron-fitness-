
import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  MessageSquare,
  Mail,
  Bell,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Smartphone,
  Plus,
  ArrowLeft,
  Users,
  Filter,
  Calendar,
  Video,
  Upload,
  Trash2,
  PlayCircle,
  Cake,
  Wallet,
  Zap,
  Activity,
  UserRound,
  Eye,
  User,
  Save,
  FileText,
  ChevronDown,
  CalendarDays,
  LayoutGrid,
  History,
  SmartphoneNfc,
  Info,
  QrCode,
  ShoppingBag,
  Flame,
  Image as ImageIcon,
  Paperclip,
  FileVideo,
  X,
  CalendarClock,
  AlertCircle,
  Square,
  CheckSquare,
  Settings2,
  Sparkles,
  Lock,
  CalendarRange,
  ChevronRight
} from 'lucide-react';

interface FilteredUser {
  id: number;
  name: string;
  phone: string;
  lastVisit: string;
  hasApp: boolean;
  spendLevel: 'low' | 'mid' | 'high';
  age: number;
  gender: 'male' | 'female' | 'all';
  socialStatus: string;
}

interface Template {
  id: number;
  title: string;
  text: string;
}

interface MessagesViewProps {
  navIntent?: { tab: string, initialText?: string } | null;
  clearIntent?: () => void;
}

const socialStatuses = [
  'სტუდენტი', 'დასაქმებული', 'უმუშევარი', 'პენსიონერი',
  'ვეტერანი', 'დიასახლისი', 'ტრენერი', 'მოსწავლე', 'სხვა'
];

// Mock Expiry Data for Monitoring Tab
const expiringUsersData = {
  TODAY: [
    { id: 101, name: 'დავით გიორგაძე', plan: 'Gold Package', phone: '555-12-12-12' },
    { id: 102, name: 'ანა მამულაშვილი', plan: 'დილის აბონემენტი', phone: '599-00-11-22' },
    { id: 103, name: 'გიგა კობახიძე', plan: 'სტანდარტული', phone: '577-33-44-55' },
  ],
  TOMORROW: [
    { id: 201, name: 'სოფო ჭანტურია', plan: 'იოგა ჯგუფი', phone: '593-11-22-33' },
    { id: 202, name: 'ლევან დოლიძე', plan: 'Gold Package', phone: '551-99-88-77' },
  ],
  WEEK: [
    { id: 301, name: 'თამარ ბერიძე', plan: 'აუზი + ფიტნესი', phone: '568-44-55-66' },
    { id: 302, name: 'ნიკა ქავთარაძე', plan: 'სტანდარტული', phone: '598-12-12-12' },
    { id: 303, name: 'ელენე აბაშიძე', plan: 'დილის აბონემენტი', phone: '577-22-33-44' },
    { id: 304, name: 'გიორგი მაისურაძე', plan: 'Gold Package', phone: '555-00-99-88' },
  ]
};

const MobileSimulator = ({ activeFeatures }: { activeFeatures: any }) => {
  const mobileSchedule = [
    { id: 1, name: 'CrossFit', time: '10:00', intensity: 'High', color: 'bg-red-500' },
    { id: 2, name: 'Yoga Flow', time: '12:00', intensity: 'Low', color: 'bg-blue-400' },
    { id: 3, name: 'Boxing Tech', time: '16:00', intensity: 'Medium', color: 'bg-amber-500' },
  ];

  return (
    <div className="relative mx-auto border-slate-900 bg-slate-900 border-[12px] rounded-[3rem] h-[640px] w-[320px] shadow-2xl overflow-hidden animate-fadeIn">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center">
        <div className="w-10 h-1 bg-slate-800 rounded-full"></div>
      </div>
      <div className="rounded-[2.2rem] overflow-hidden w-full h-full bg-white flex flex-col font-sans select-none relative">
        <div className="h-10 w-full flex justify-between items-end px-8 pb-1 text-[10px] font-bold text-slate-800 bg-white z-10">
          <span>9:41</span>
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-sm border border-slate-800"></div>
            <div className="w-3 h-3 rounded-sm bg-slate-800"></div>
          </div>
        </div>
        <div className="p-6 pt-2 bg-white flex justify-between items-center shrink-0 border-b border-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full bg-lime-400 flex items-center justify-center font-bold text-slate-900 border-4 border-lime-50 shadow-sm overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full" />
            </div>
            <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter leading-none">გამარჯობა,</p><h4 className="text-sm font-black text-slate-800">გიორგი ბერიძე</h4></div>
          </div>
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <Bell size={18} />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50">
          <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-lime-400 rounded-full opacity-10 group-hover:scale-150 transition-transform"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">თქვენი პაკეტი</p><h3 className="text-lg font-black text-lime-400 leading-tight">Gold Unlimited</h3></div>
                <Zap size={20} className="text-lime-400 animate-pulse" />
              </div>
              <div className="mt-6 flex justify-between items-end">
                <div><p className="text-[10px] text-slate-400">ვადა იწურება</p><p className="text-sm font-bold">12 დეკ 2023</p></div>
                <div className="bg-lime-400 text-slate-900 px-3 py-1.5 rounded-xl text-[10px] font-black shadow-lg shadow-lime-400/20">აქტიური</div>
              </div>
            </div>
          </div>
          {activeFeatures[1].active && (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between px-1 mb-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">განრიგი (დღეს)</h4>
                <button className="text-[9px] font-black text-lime-600 uppercase">ყველა</button>
              </div>
              <div className="flex space-x-3 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                {mobileSchedule.map((item) => (
                  <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 min-w-[140px] flex flex-col justify-between shrink-0">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-800 shadow-sm"><Clock size={16} strokeWidth={2.5} /></div>
                        <span className="text-[10px] font-black text-slate-300">{item.time}</span>
                      </div>
                      <h5 className="text-xs font-black text-slate-800 truncate">{item.name}</h5>
                    </div>
                    <div className="mt-4 flex items-center space-x-1">
                      <Flame size={10} className={item.intensity === 'High' ? 'text-red-500' : item.intensity === 'Medium' ? 'text-orange-400' : 'text-blue-400'} />
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{item.intensity} Int.</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeFeatures[0].active && (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col items-center text-center animate-fadeIn">
              <div className="w-full flex justify-between items-center mb-4"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">სწრაფი საშვი</span><span className="text-slate-300"><Info size={14} /></span></div>
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 mb-3 group hover:border-lime-400 transition-colors cursor-pointer text-slate-800"><QrCode size={120} strokeWidth={1.5} /></div>
              <p className="text-[10px] text-slate-400 font-medium">მიიტანეთ ტერმინალთან გასახსნელად</p>
            </div>
          )}
        </div>
        <div className="bg-white/80 backdrop-blur-md border-t border-slate-100 px-8 py-5 flex justify-between items-center shrink-0">
          <div className="text-lime-600"><LayoutGrid size={22} strokeWidth={2.5} /></div>
          <div className="text-slate-300"><History size={22} strokeWidth={2.5} /></div>
          <div className="text-slate-300"><Calendar size={22} strokeWidth={2.5} /></div>
          <div className="text-slate-300"><User size={22} strokeWidth={2.5} /></div>
        </div>
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-200 rounded-full"></div>
      </div>
    </div>
  );
};

const MessagesView: React.FC<MessagesViewProps> = ({ navIntent, clearIntent }) => {
  const [activeTab, setActiveTab] = useState<'HISTORY' | 'COMPOSE' | 'MOBILE' | 'EXPIRY'>('HISTORY');
  const [expiryMonitorTab, setExpiryMonitorTab] = useState<'TODAY' | 'TOMORROW' | 'WEEK'>('TODAY');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedExpiringIds, setSelectedExpiringIds] = useState<number[]>([]);
  const [isAutoSendEnabled, setIsAutoSendEnabled] = useState(false);
  const [autoSettings, setAutoSettings] = useState({
    channels: { sms: true, email: false, push: true },
    frequency: 1,
    daysBefore: [2],
    templateId: null as number | null
  });

  const [selectedChannels, setSelectedChannels] = useState({ SMS: true, EMAIL: false, PUSH: false });
  const [filters, setFilters] = useState({
    activityStatus: 'active',
    period: 'all',
    appUser: 'all',
    upcomingBirthday: false,
    marketSpend: 'all',
    isMinor: false,
    gender: 'all',
    socialStatus: 'all',
  });
  const [messageText, setMessageText] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ file: File, preview: string, type: 'image' | 'video' } | null>(null);
  const [sendMode, setSendMode] = useState<'NOW' | 'SCHEDULE'>('NOW');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState('');

  const [templates, setTemplates] = useState<Template[]>([
    { id: 1, title: 'მისალმება', text: 'გამარჯობა, კეთილი იყოს თქვენი მობრძანება ჩვენს დარბაზში!' },
    { id: 2, title: 'ვადის ამოწურვა', text: 'შეგახსენებთ, რომ თქვენს აბონემენტს ვადა ეწურება 3 დღეში.' },
    { id: 3, title: 'ახალი აქცია', text: 'მხოლოდ ამ უქმეებზე! -20% ფასდაკლება ყველა ჯგურუფურ ვარჯიშზე.' }
  ]);

  useEffect(() => {
    if (navIntent) {
      setActiveTab(navIntent.tab as any);
      if (navIntent.initialText) setMessageText(navIntent.initialText);
      if (clearIntent) clearIntent();
    }
  }, [navIntent, clearIntent]);

  useEffect(() => { setSelectedExpiringIds([]); }, [expiryMonitorTab]);

  const [mobileFeatures, setMobileFeatures] = useState([
    { id: 0, title: 'QR ციფრული საშვი', desc: 'ნება დართეთ მომხმარებლებს გამოიყენონ QR კოდი ტურნიკეტზე', active: true },
    { id: 1, title: 'ჯგუფური განრიგი', desc: 'მომხმარებელი ხედავს დღის ვარჯიშებს და იჯავშნის ადგილს', active: true },
    { id: 2, title: 'Smart Push ნოტიფიკაციები', desc: 'ავტომატური შეხსენებები ვადის ამოწურვაზე და აქციებზე', active: true },
    { id: 3, title: 'ვარჯიშის ისტორია', desc: 'ვიზიტების და აქტივობების გრაფიკული მონიტორინგი', active: true },
  ]);

  const toggleFeature = (id: number) => setMobileFeatures(prev => prev.map(f => f.id === id ? { ...f, active: !f.active } : f));

  // Mock Database
  const mockDb: FilteredUser[] = [
    { id: 1, name: 'გიორგი ბერიძე', phone: '555-11-22-33', lastVisit: '2 დღის წინ', hasApp: true, spendLevel: 'high', age: 25, gender: 'male', socialStatus: 'დასაქმებული' },
    { id: 2, name: 'ნინო კვარაცხელია', phone: '599-00-11-22', lastVisit: '1 თვის წინ', hasApp: false, spendLevel: 'low', age: 17, gender: 'female', socialStatus: 'მოსწავლე' },
    { id: 3, name: 'სანდრო კუპატაძე', phone: '577-33-44-55', lastVisit: '5 დღის წინ', hasApp: true, spendLevel: 'mid', age: 20, gender: 'male', socialStatus: 'სტუდენტი' },
  ];

  const filteredUsers = mockDb.filter(user => {
    if (filters.appUser === 'with_app' && !user.hasApp) return false;
    if (filters.appUser === 'without_app' && user.hasApp) return false;
    if (filters.isMinor && user.age >= 18) return false;
    if (filters.gender !== 'all' && user.gender !== filters.gender) return false;
    if (filters.socialStatus !== 'all' && user.socialStatus !== filters.socialStatus) return false;
    return true;
  });

  const handleSend = () => {
    const when = sendMode === 'NOW' ? 'ახლავე' : `${scheduleDate} ${scheduleTime}-ზე`;
    alert(`შეტყობინება გაიგზავნება ${when}, ${filteredUsers.length} მომხმარებელთან! ${attachedFile ? '(მედია ფაილით)' : ''}`);
    setActiveTab('HISTORY');
  };

  const handleQuickCommunicate = (userName: string) => {
    setMessageText(`გამარჯობა ${userName}, შეგახსენებთ რომ თქვენს აბონემენტს ვადა ეწურება...`);
    setActiveTab('COMPOSE');
  };

  const handleBulkCommunicate = () => {
    const selectedCount = selectedExpiringIds.length;
    setMessageText(`გამარჯობა, შეგახსენებთ რომ თქვენს აბონემენტს ვადა ეწურება...`);
    setActiveTab('COMPOSE');
    alert(`გადაყვანილი ხართ ${selectedCount} მომხმარებლისთვის შეტყობინების გაგზავნის რეჟიმში.`);
  };

  const handleSaveTemplate = () => {
    if (!newTemplateTitle || !messageText) return;
    setTemplates([...templates, { id: Date.now(), title: newTemplateTitle, text: messageText }]);
    setShowTemplateModal(false);
    setNewTemplateTitle('');
  };

  const deleteTemplate = (id: number) => {
    if (isAutoSendEnabled && autoSettings.templateId === id) {
      alert("ამ შაბლონის წაშლა შეუძლებელია, რადგან ის გამოყენებულია აქტიურ ავტომატიზაციაში!");
      return;
    }
    setTemplates(templates.filter(t => t.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) return;
    const reader = new FileReader();
    reader.onload = () => setAttachedFile({ file, preview: reader.result as string, type: isImage ? 'image' : 'video' });
    reader.readAsDataURL(file);
  };

  const removeFile = () => { setAttachedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

  const toggleSelectUser = (id: number) => setSelectedExpiringIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const toggleSelectAll = () => {
    const currentTabUsers = expiringUsersData[expiryMonitorTab];
    if (selectedExpiringIds.length === currentTabUsers.length) setSelectedExpiringIds([]);
    else setSelectedExpiringIds(currentTabUsers.map(u => u.id));
  };

  const handleAutoFreqChange = (freq: number) => {
    const newDays = Array(freq).fill(0).map((_, i) => i + 1);
    setAutoSettings({ ...autoSettings, frequency: freq, daysBefore: newDays });
  };

  const handleDayChange = (index: number, val: string) => {
    const newDays = [...autoSettings.daysBefore];
    newDays[index] = parseInt(val) || 1;
    setAutoSettings({ ...autoSettings, daysBefore: newDays });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* Header Tabs Navigation */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex space-x-1 bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('HISTORY')} className={`flex-none flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'HISTORY' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <History size={18} /><span>ისტორია</span>
          </button>
          <button onClick={() => setActiveTab('COMPOSE')} className={`flex-none flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'COMPOSE' ? 'bg-lime-400 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <Plus size={18} /><span>ახალი დაგზავნა</span>
          </button>
          <button onClick={() => setActiveTab('EXPIRY')} className={`flex-none flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'EXPIRY' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <CalendarClock size={18} /><span>ვადის მონიტორინგი</span>
          </button>
          <button onClick={() => setActiveTab('MOBILE')} className={`flex-none flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'MOBILE' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <Smartphone size={18} /><span>აპლიკაციის ვიზუალიზაცია</span>
          </button>
        </div>
      </div>

      {/* 1. HISTORY TAB */}
      {activeTab === 'HISTORY' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <tr><th className="px-8 py-5">ტიპი</th><th className="px-8 py-5">ადრესატი</th><th className="px-8 py-5">შინაარსი</th><th className="px-8 py-5">სტატუსი</th><th className="px-8 py-5">თარიღი</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[{ id: 1, type: 'SMS', recipient: '555-11-22-33', content: 'გამარჯობა, თქვენი აბონემენტის ვადა...', status: 'Sent', date: '2023-11-25 10:30' }].map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5"><div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-100 text-purple-600"><Smartphone size={16} /></div></td>
                    <td className="px-8 py-5 font-bold text-slate-800">{msg.recipient}</td>
                    <td className="px-8 py-5 text-slate-500 truncate max-w-xs">{msg.content}</td>
                    <td className="px-8 py-5"><span className="inline-flex px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase">Sent</span></td>
                    <td className="px-8 py-5 text-slate-400 text-xs font-medium">{msg.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. COMPOSE TAB (RESTORED ALL FUNCTIONS) */}
      {activeTab === 'COMPOSE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          {/* Filtering Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden sticky top-24">
              <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center space-x-2"><Filter size={18} className="text-lime-600" /><h3 className="font-bold text-slate-800">დეტალური ფილტრაცია</h3></div>
              <div className="p-6 space-y-6 max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar">
                <div className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><User size={14} className="mr-2" /> სქესი</label>
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                    {['all', 'male', 'female'].map(g => (<button key={g} onClick={() => setFilters({ ...filters, gender: g as any })} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${filters.gender === g ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500'}`}>{g === 'all' ? 'ყველა' : g === 'male' ? 'კაცი' : 'ქალი'}</button>))}
                  </div>
                </div>
                <div className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><Activity size={14} className="mr-2" /> სოციალური სტატუსი</label>
                  <select value={filters.socialStatus} onChange={e => setFilters({ ...filters, socialStatus: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold outline-none appearance-none"><option value="all">ყველა სტატუსი</option>{socialStatuses.map(s => <option key={s} value={s}>{s}</option>)}</select>
                </div>
                <div className="space-y-3 pt-2 border-t border-slate-50"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">აქტივობა და პერიოდი</label>
                  <div className="grid grid-cols-2 gap-2"><button onClick={() => setFilters({ ...filters, activityStatus: 'active' })} className={`py-2 rounded-xl text-xs font-bold ${filters.activityStatus === 'active' ? 'bg-lime-400 text-slate-900 shadow-sm' : 'bg-slate-100 text-slate-500'}`}>აქტიური</button><button onClick={() => setFilters({ ...filters, activityStatus: 'passive' })} className={`py-2 rounded-xl text-xs font-bold ${filters.activityStatus === 'passive' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-500'}`}>პასიური</button></div>
                  <select value={filters.period} onChange={e => setFilters({ ...filters, period: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none bg-white"><option value="all">ყველა</option><option value="1_week">ბოლო 1 კვირა</option><option value="1_month">ბოლო 1 თვე</option></select>
                </div>
                <div className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><Smartphone size={14} className="mr-2" /> აპლიკაცია</label>
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200"><button onClick={() => setFilters({ ...filters, appUser: 'all' })} className={`flex-1 py-1.5 text-[9px] font-black rounded-lg ${filters.appUser === 'all' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>ყველა</button><button onClick={() => setFilters({ ...filters, appUser: 'with_app' })} className={`flex-1 py-1.5 text-[9px] font-black rounded-lg ${filters.appUser === 'with_app' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>აქვს აპი</button></div>
                </div>
                <div className="space-y-2"><button onClick={() => setFilters({ ...filters, upcomingBirthday: !filters.upcomingBirthday })} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${filters.upcomingBirthday ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-100'}`}><div className="flex items-center space-x-3"><Cake size={16} className={filters.upcomingBirthday ? 'text-amber-500' : 'text-slate-400'} /><span className="text-xs font-bold text-slate-700">დაბადების დღე</span></div></button><button onClick={() => setFilters({ ...filters, isMinor: !filters.isMinor })} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${filters.isMinor ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100'}`}><div className="flex items-center space-x-3"><UserRound size={16} className={filters.isMinor ? 'text-blue-500' : 'text-slate-400'} /><span className="text-xs font-bold text-slate-700">18 წლამდე</span></div></button></div>
              </div>
              <div className="bg-slate-900 p-6"><div className="flex items-end justify-between text-white"><div><p className="text-[10px] text-lime-400 font-black uppercase mb-1">სამიზნე აუდიტორია</p><div className="text-4xl font-black">{filteredUsers.length}</div></div></div></div>
            </div>
          </div>
          {/* Composition Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col min-h-[500px]">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4"><div className="flex items-center space-x-3"><MessageSquare size={20} /><h3 className="font-bold text-slate-800">შეტყობინების ფორმირება</h3></div>
                <div className="flex bg-slate-200/50 p-1 rounded-xl">{(['SMS', 'EMAIL', 'PUSH'] as const).map(ch => (<button key={ch} onClick={() => setSelectedChannels(prev => ({ ...prev, [ch]: !prev[ch] }))} className={`px-4 py-2 text-[10px] font-black rounded-lg transition-all ${selectedChannels[ch] ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'}`}>{ch}</button>))}</div>
              </div>
              <div className="p-8 flex-1 space-y-8">
                <div className="space-y-3"><label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center"><ImageIcon size={14} className="mr-2" /> მედია ფაილის მიბმა</label>
                  <div className="flex items-center space-x-4">
                    {!attachedFile ? (<button onClick={() => fileInputRef.current?.click()} className="px-6 py-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-lime-500 hover:bg-lime-50 transition-all flex flex-col items-center justify-center text-slate-400 group w-40"><Upload size={24} className="mb-2" /><span className="text-[10px] font-black uppercase">ატვირთვა</span><input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,video/*" className="hidden" /></button>) : (
                      <div className="relative group rounded-2xl overflow-hidden border-2 border-lime-400 w-40 h-40">{attachedFile.type === 'image' ? <img src={attachedFile.preview} alt="preview" className="w-full h-full object-cover" /> : <video src={attachedFile.preview} className="w-full h-full object-cover" />}<button onClick={removeFile} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button></div>
                    )}
                  </div>
                </div>
                <div className="space-y-3"><label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center justify-between"><span>შეტყობინების შაბლონები</span><button onClick={() => setShowTemplateModal(true)} className="text-lime-600 hover:text-lime-700 flex items-center font-bold"><Save size={14} className="mr-1" /> შენახვა</button></label>
                  <div className="flex flex-wrap gap-2">
                    {templates.map(tpl => {
                      const isLocked = isAutoSendEnabled && autoSettings.templateId === tpl.id;
                      return (<div key={tpl.id} className="group relative flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden hover:border-lime-300"><button onClick={() => setMessageText(tpl.text)} className="px-3 py-2 text-xs font-bold text-slate-600 flex items-center"><FileText size={14} className="mr-2 text-slate-400" />{tpl.title}</button><button onClick={() => deleteTemplate(tpl.id)} className={`px-2 py-2 text-slate-300 transition-colors ${isLocked ? 'cursor-not-allowed opacity-50' : 'hover:text-red-500'}`}>{isLocked ? <Lock size={12} className="text-amber-500" /> : <Trash2 size={12} />}</button></div>);
                    })}
                  </div>
                </div>
                <textarea value={messageText} onChange={e => setMessageText(e.target.value)} className="w-full h-48 px-6 py-6 rounded-2xl border border-slate-200 bg-white focus:border-lime-500 outline-none transition-all resize-none text-slate-700 font-medium text-lg" placeholder="აკრიფეთ ტექსტი..."></textarea>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4"><div className="flex items-center justify-between"><label className="text-xs font-black text-slate-400 uppercase tracking-widest">გაგზავნის დრო</label><div className="flex bg-white p-1 rounded-lg border border-slate-200"><button onClick={() => setSendMode('NOW')} className={`px-4 py-1.5 text-[10px] font-black rounded-md ${sendMode === 'NOW' ? 'bg-lime-400 text-slate-900 shadow-sm' : 'text-slate-400'}`}>ახლავე</button><button onClick={() => setSendMode('SCHEDULE')} className={`px-4 py-1.5 text-[10px] font-black rounded-md ${sendMode === 'SCHEDULE' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400'}`}>დაგეგმვა</button></div></div>
                  {sendMode === 'SCHEDULE' && (<div className="grid grid-cols-2 gap-4 animate-fadeIn"><div className="relative"><CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="w-full pl-9 py-2 rounded-xl border text-sm font-bold outline-none" /></div><div className="relative"><Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="w-full pl-9 py-2 rounded-xl border text-sm font-bold outline-none" /></div></div>)}
                </div>
              </div>
              <div className="p-8 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-4"><div><p className="text-[10px] text-slate-400 font-black uppercase mb-1">სავარაუდო ხარჯი</p><div className="text-2xl font-black">₾ {(filteredUsers.length * 0.05).toFixed(2)}</div></div><div className="w-px h-10 bg-slate-200"></div><div className="flex items-center space-x-2 text-emerald-600"><Zap size={18} fill="currentColor" /><span className="text-[10px] font-black uppercase">Express Delivery</span></div></div>
                <button onClick={handleSend} className="flex items-center space-x-3 px-10 py-4 bg-lime-400 hover:bg-lime-500 text-slate-900 font-black rounded-xl shadow-xl transition-all active:scale-95 group"><span className="uppercase text-xs tracking-widest">{sendMode === 'NOW' ? 'დაგზავნა' : 'დაგეგმვა'}</span><Send size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. EXPIRY MONITORING TAB */}
      {activeTab === 'EXPIRY' && (
        <div className="animate-fadeIn space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div><h2 className="text-2xl font-black text-slate-800 flex items-center"><CalendarClock size={28} className="mr-3 text-orange-500" />ვადის ამოწურვის მონიტორინგი</h2><p className="text-slate-500 font-medium mt-1">მართეთ მომხმარებლები, რომელთაც ეწურებათ აბონემენტი</p></div>
              <div className="flex space-x-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">{(['TODAY', 'TOMORROW', 'WEEK'] as const).map((tab) => (<button key={tab} onClick={() => setExpiryMonitorTab(tab)} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${expiryMonitorTab === tab ? 'bg-white text-orange-600 shadow-md ring-1 ring-orange-100' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'}`}>{tab === 'TODAY' ? 'დღეს' : tab === 'TOMORROW' ? 'ხვალ' : '1 კვირაში'}</button>))}</div>
            </div>
            <div className={`rounded-3xl border-2 transition-all duration-500 overflow-hidden mb-8 ${isAutoSendEnabled ? 'bg-slate-900 border-lime-500' : 'bg-orange-50/50 border-orange-100'}`}>
              <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5">
                <div className="flex items-center space-x-5"><div className={`p-4 rounded-2xl transition-all duration-500 ${isAutoSendEnabled ? 'bg-lime-500 text-slate-900 shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}><Sparkles size={28} className={isAutoSendEnabled ? 'animate-pulse' : ''} /></div><div><h3 className={`font-black text-lg flex items-center ${isAutoSendEnabled ? 'text-white' : 'text-slate-800'}`}>ავტომატური დაგზავნა{isAutoSendEnabled && <span className="ml-3 px-2 py-0.5 bg-lime-400 text-slate-900 text-[9px] font-black rounded uppercase tracking-tighter animate-pulse">Active</span>}</h3><p className={`${isAutoSendEnabled ? 'text-slate-400' : 'text-slate-500'} text-sm font-medium`}>დაგეგმეთ შეხსენებები ვადის ამოწურვამდე</p></div></div>
                <button onClick={() => setIsAutoSendEnabled(!isAutoSendEnabled)} className={`relative w-20 h-10 rounded-full transition-all duration-500 ease-in-out ${isAutoSendEnabled ? 'bg-lime-500 shadow-lg shadow-lime-500/30' : 'bg-slate-200'}`}><div className={`absolute top-1 left-1 w-8 h-8 bg-white rounded-full shadow-md transition-all duration-500 transform ${isAutoSendEnabled ? 'translate-x-10' : 'translate-x-0'} flex items-center justify-center`}><Settings2 size={16} className={isAutoSendEnabled ? 'text-lime-600' : 'text-slate-400'} /></div></button>
              </div>
              <div className={`p-8 transition-all duration-700 grid grid-cols-1 lg:grid-cols-3 gap-10 ${isAutoSendEnabled ? 'opacity-100 translate-y-0' : 'opacity-60 grayscale pointer-events-none'}`}>
                <div className="space-y-4"><label className={`text-[10px] font-black uppercase tracking-widest flex items-center ${isAutoSendEnabled ? 'text-lime-400' : 'text-slate-400'}`}><SmartphoneNfc size={14} className="mr-2" /> 1. გავრცელების არხი</label>
                  {/* <div className="space-y-2">{(['sms', 'email', 'push'] as const).map(ch => (<button key={ch} onClick={() => setAutoSettings({ ...autoSettings, channels: { ...autoSettings.channels, [ch]: !autoSettings.channels[ch] } })} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${autoSettings.channels[ch] ? 'bg-lime-400/10 border-lime-500 text-lime-400' : 'bg-white/5 border-white/10 text-slate-500'}`}><div className="flex items-center space-x-3">{ch === 'sms' ? <Smartphone size={16} /> : ch === 'email' ? <Mail size={16} /> : <Bell size={16}/><span className="text-xs font-bold uppercase">{ch}</span>}</div><div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${autoSettings.channels[ch] ? 'bg-lime-500 border-lime-500' : 'border-slate-700'}`}>{autoSettings.channels[ch] && <CheckCircle size={12} className="text-slate-900" />}</div></button>))}</div> */}
                </div>
                <div className="space-y-4"><label className={`text-[10px] font-black uppercase tracking-widest flex items-center ${isAutoSendEnabled ? 'text-lime-400' : 'text-slate-400'}`}><CalendarRange size={14} className="mr-2" /> 2. გაგზავნის განრიგი</label>
                  <div className="space-y-5"><div><p className="text-[10px] text-slate-500 font-bold mb-2 uppercase">გაგზავნის რაოდენობა</p><div className="flex space-x-2">{[1, 2, 3].map(f => (<button key={f} onClick={() => handleAutoFreqChange(f)} className={`flex-1 py-2 rounded-lg text-xs font-black border transition-all ${autoSettings.frequency === f ? 'bg-lime-500 border-lime-500 text-slate-900' : 'bg-white/5 border-white/10 text-slate-400'}`}>{f}x</button>))}</div></div>
                    <div className="space-y-3"><p className="text-[10px] text-slate-500 font-bold uppercase">დროები (დღით ადრე)</p>{autoSettings.daysBefore.map((day, idx) => (<div key={idx} className="flex items-center space-x-3 animate-fadeIn"><div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-lime-500">{idx + 1}</div><input type="number" value={day} onChange={(e) => handleDayChange(idx, e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-bold focus:border-lime-500 outline-none" /><span className="text-[10px] text-slate-500 font-bold uppercase whitespace-nowrap">დღით ადრე</span></div>))}</div>
                  </div>
                </div>
                <div className="space-y-4"><label className={`text-[10px] font-black uppercase tracking-widest flex items-center ${isAutoSendEnabled ? 'text-lime-400' : 'text-slate-400'}`}><FileText size={14} className="mr-2" /> 3. შაბლონის მიბმა</label>
                  <div className="space-y-3"><select value={autoSettings.templateId || ''} onChange={(e) => setAutoSettings({ ...autoSettings, templateId: parseInt(e.target.value) || null })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold focus:border-lime-500 outline-none appearance-none cursor-pointer"><option value="" className="bg-slate-800">აირჩიეთ შაბლონი...</option>{templates.map(t => (<option key={t.id} value={t.id} className="bg-slate-800">{t.title}</option>))}</select>
                    {autoSettings.templateId && (<div className="p-4 rounded-xl bg-lime-400/5 border border-lime-500/20 text-xs text-slate-400 leading-relaxed italic animate-fadeIn">"{templates.find(t => t.id === autoSettings.templateId)?.text.substring(0, 80)}..."</div>)}
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start space-x-3"><Lock size={16} className="text-amber-500 shrink-0 mt-0.5" /><p className="text-[10px] text-amber-500/80 font-medium">აქტიური ავტომატიზაციის დროს მიბმული შაბლონის წაშლა დაბლოკილია.</p></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center px-2 gap-4"><button onClick={toggleSelectAll} className="flex items-center space-x-3 text-sm font-black text-slate-600 hover:text-slate-900">{selectedExpiringIds.length === expiringUsersData[expiryMonitorTab].length && expiringUsersData[expiryMonitorTab].length > 0 ? <CheckSquare size={22} className="text-orange-500" /> : <Square size={22} />}<span>ყველას მონიშვნა</span></button>{selectedExpiringIds.length > 0 && (<button onClick={handleBulkCommunicate} className="w-full sm:w-auto px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-xl transition-all"><span>ჯგუფური კომუნიკაცია ({selectedExpiringIds.length})</span></button>)}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expiringUsersData[expiryMonitorTab].map((user) => {
                const isSelected = selectedExpiringIds.includes(user.id);
                return (<div key={user.id} onClick={() => toggleSelectUser(user.id)} className={`relative group bg-slate-50 hover:bg-white p-6 rounded-3xl border-2 transition-all cursor-pointer ${isSelected ? 'border-orange-500 bg-white ring-4 ring-orange-50' : 'border-slate-100 hover:border-orange-200'}`}><div className="absolute top-4 right-4">{isSelected ? <CheckSquare size={24} className="text-orange-500" /> : <Square size={24} className="text-slate-300" />}</div><div className="flex items-center space-x-4 mb-6"><div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-white ${expiryMonitorTab === 'TODAY' ? 'bg-red-500' : 'bg-orange-500'}`}>{user.name.charAt(0)}</div><div><h4 className="font-black text-slate-800">{user.name}</h4><p className="text-xs text-slate-400 font-bold uppercase">{user.plan}</p></div></div><button onClick={(e) => { e.stopPropagation(); handleQuickCommunicate(user.name); }} className="w-full py-3 bg-white group-hover:bg-slate-900 group-hover:text-white border-2 border-slate-200 group-hover:border-slate-900 rounded-2xl transition-all text-xs font-black uppercase">კომუნიკაცია</button></div>);
              })}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE APP TAB */}
      {activeTab === 'MOBILE' && (
        <div className="max-w-7xl mx-auto py-10 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"><div className="lg:col-span-7 space-y-8"><h2 className="text-4xl font-black text-slate-900">მობილური აპლიკაცია</h2><div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 space-y-2">{mobileFeatures.map((f) => (<div key={f.id} onClick={() => toggleFeature(f.id)} className="flex items-center justify-between p-5 rounded-3xl hover:bg-slate-50 cursor-pointer transition-all"><div><h4 className="font-black text-slate-800">{f.title}</h4><p className="text-sm text-slate-400">{f.desc}</p></div><div className={`w-14 h-8 rounded-full relative ${f.active ? 'bg-lime-400' : 'bg-slate-200'}`}><div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all transform ${f.active ? 'translate-x-7' : 'translate-x-1'}`}></div></div></div>))}</div></div><div className="lg:col-span-5 flex justify-center sticky top-28"><MobileSimulator activeFeatures={mobileFeatures} /></div></div>
        </div>
      )}

      {/* Modal for Templates */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50"><h3 className="font-bold text-slate-800 flex items-center"><Save size={18} className="mr-2 text-lime-600" /> შაბლონად შენახვა</h3><button onClick={() => setShowTemplateModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={20} /></button></div>
            <div className="p-8 space-y-6"><input type="text" value={newTemplateTitle} onChange={e => setNewTemplateTitle(e.target.value)} placeholder="მაგ: საახალწლო მილოცვა" className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none font-bold" /><button onClick={handleSaveTemplate} className="w-full py-4 bg-lime-400 hover:bg-lime-500 text-slate-900 font-black rounded-2xl shadow-xl transition-all">შენახვა</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesView;
