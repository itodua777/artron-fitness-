
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, AreaChart, Area } from 'recharts';
import { 
  Ticket, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar, 
  Zap, 
  Activity, 
  Info, 
  Megaphone, 
  MousePointerClick, 
  ShoppingBag, 
  ArrowLeft, 
  Search, 
  Download,
  Filter,
  MessageSquare,
  Sparkles,
  UserCheck,
  AlertTriangle,
  UserX,
  Clock,
  Briefcase,
  GraduationCap,
  Baby
} from 'lucide-react';

interface MarketingConversion {
  id: number;
  userName: string;
  campaignName: string;
  purchasedService: string;
  date: string;
  amount: number;
}

const StatisticsView: React.FC = () => {
  const [drillDown, setDrillDown] = useState<'NONE' | 'MARKETING'>('NONE');
  const [marketingSearch, setMarketingSearch] = useState('');
  
  // Gym Load State
  const [gymArea, setGymArea] = useState(500);
  const [currentOccupancy, setCurrentOccupancy] = useState(142);
  const maxCapacity = gymArea;
  const loadPercentage = Math.round((currentOccupancy / maxCapacity) * 100);

  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentOccupancy(prev => {
            const change = Math.floor(Math.random() * 3) - 1;
            return Math.min(Math.max(0, prev + change), maxCapacity);
        });
    }, 5000);
    return () => clearInterval(interval);
  }, [maxCapacity]);

  const getLoadColor = () => {
    if (loadPercentage < 50) return 'text-emerald-500';
    if (loadPercentage < 80) return 'text-orange-500';
    return 'text-red-500';
  };

  // --- MOCK DATA FOR USER SEGMENTATION ---
  
  // 1. Status Data
  const statusSummary = {
    total: 1250,
    active: 840,
    passive: 210,
    expired: 145,
    expiringSoon: 55
  };

  // 2. Gender Data
  const genderData = [
    { name: 'კაცი', value: 720, color: '#2563eb' },
    { name: 'ქალი', value: 530, color: '#db2777' }
  ];

  // 3. Social & Employment Status
  const socialData = [
    { name: 'დასაქმებული', value: 580, color: '#a3e635' },
    { name: 'სტუდენტი', value: 340, color: '#0ea5e9' },
    { name: 'უმუშევარი', value: 180, color: '#94a3b8' },
    { name: 'არასრულწლოვანი', value: 150, color: '#f59e0b' }
  ];

  // 4. Age Distribution
  const ageData = [
    { range: '18-მდე', count: 150 },
    { range: '18-25', count: 420 },
    { range: '26-40', count: 480 },
    { range: '40+', count: 200 }
  ];

  // Marketing Effectiveness Data
  const campaignROI = [
    { name: 'Black Friday', sales: 12500, reach: 5000, conversion: 8.5 },
    { name: 'New Year Sale', sales: 8400, reach: 3200, conversion: 12.2 },
    { name: 'Student Promo', sales: 3200, reach: 1500, conversion: 15.1 },
    { name: 'Night Owl', sales: 2100, reach: 900, conversion: 5.4 },
  ];

  const conversionDetails: MarketingConversion[] = [
    { id: 1, userName: 'გიორგი ბერიძე', campaignName: 'Black Friday', purchasedService: 'Gold Unlimited', date: '2023-11-24', amount: 250 },
    { id: 2, userName: 'ანა კალაძე', campaignName: 'New Year Sale', purchasedService: 'იოგა ჯგუფი', date: '2023-12-01', amount: 120 },
    { id: 3, userName: 'ლევან დოლიძე', campaignName: 'Student Promo', purchasedService: 'დილის პაკეტი', date: '2023-11-15', amount: 85 },
    { id: 4, userName: 'სოფო ჭანტურია', campaignName: 'Black Friday', purchasedService: 'პრემიუმი (Fitness + Spa)', date: '2023-11-25', amount: 180 },
    { id: 5, userName: 'დავით მაისურაძე', campaignName: 'Night Owl', purchasedService: 'სტანდარტული', date: '2023-11-26', amount: 100 },
  ];

  const filteredConversions = useMemo(() => {
    return conversionDetails.filter(c => 
        c.userName.toLowerCase().includes(marketingSearch.toLowerCase()) ||
        c.campaignName.toLowerCase().includes(marketingSearch.toLowerCase()) ||
        c.purchasedService.toLowerCase().includes(marketingSearch.toLowerCase())
    );
  }, [marketingSearch]);

  if (drillDown === 'MARKETING') {
    return (
      <div className="space-y-6 animate-fadeIn pb-10">
         <button onClick={() => setDrillDown('NONE')} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors group mb-4">
           <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
           <span className="font-black">სტატისტიკაზე დაბრუნება</span>
         </button>

         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                    <UserCheck size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">კონვერსიის დეტალური რეესტრი</h2>
                    <p className="text-slate-500 text-sm font-medium">აქციების შედეგად განხორციელებული გაყიდვების ისტორია</p>
                </div>
            </div>
            <div className="flex items-center space-x-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        value={marketingSearch}
                        onChange={e => setMarketingSearch(e.target.value)}
                        placeholder="ძებნა..." 
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm font-bold"
                    />
                </div>
                <button className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"><Download size={20}/></button>
            </div>
         </div>

         <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                    <tr><th className="px-8 py-5">მომხმარებელი</th><th className="px-8 py-5">კამპანია</th><th className="px-8 py-5">შეძენილი სერვისი</th><th className="px-8 py-5">თარიღი</th><th className="px-8 py-5 text-right">თანხა</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredConversions.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-5 font-black text-slate-800">{c.userName}</td>
                            <td className="px-8 py-5"><span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-lg uppercase">{c.campaignName}</span></td>
                            <td className="px-8 py-5 font-bold text-slate-600">{c.purchasedService}</td>
                            <td className="px-8 py-5 font-mono text-xs text-slate-400">{c.date}</td>
                            <td className="px-8 py-5 text-right font-black text-emerald-600">₾ {c.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">დეტალური სტატისტიკა</h2>
          <p className="text-slate-500 text-sm font-medium">მომხმარებელთა სეგმენტაციისა და ქცევის ანალიზი</p>
        </div>
        <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all">
                <Download size={16}/>
                <span>რეპორტის ჩამოტვირთვა</span>
            </button>
        </div>
      </div>

      {/* NEW: USER STATUS SUMMARY ROW */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2">სულ</p>
              <div className="flex items-center justify-between">
                <h4 className="text-2xl font-black text-slate-800">{statusSummary.total}</h4>
                <Users size={20} className="text-slate-300" />
              </div>
          </div>
          <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100 shadow-sm">
              <p className="text-[10px] font-black text-emerald-600 uppercase mb-2">აქტიური</p>
              <div className="flex items-center justify-between">
                <h4 className="text-2xl font-black text-emerald-700">{statusSummary.active}</h4>
                <UserCheck size={20} className="text-emerald-500" />
              </div>
          </div>
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-2">პასიური</p>
              <div className="flex items-center justify-between">
                <h4 className="text-2xl font-black text-slate-600">{statusSummary.passive}</h4>
                <Activity size={20} className="text-slate-400" />
              </div>
          </div>
          <div className="bg-red-50 p-5 rounded-3xl border border-red-100 shadow-sm">
              <p className="text-[10px] font-black text-red-600 uppercase mb-2">ვადაგასული</p>
              <div className="flex items-center justify-between">
                <h4 className="text-2xl font-black text-red-700">{statusSummary.expired}</h4>
                <UserX size={20} className="text-red-500" />
              </div>
          </div>
          <div className="bg-amber-50 p-5 rounded-3xl border border-amber-100 shadow-sm">
              <p className="text-[10px] font-black text-amber-600 uppercase mb-2">მალე იწურება</p>
              <div className="flex items-center justify-between">
                <h4 className="text-2xl font-black text-amber-700">{statusSummary.expiringSoon}</h4>
                <Clock size={20} className="text-amber-500" />
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LIVE GYM LOAD CARD (MAINTAINED) */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
                <div>
                   <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">დატვირთულობა (LIVE)</h3>
                   <p className="text-xs text-slate-400 font-medium">გათვლილი 1 ადამიანი 1 $m^2$-ზე</p>
                </div>
                <div className={`p-2 rounded-lg bg-slate-50 animate-pulse ${getLoadColor()}`}>
                    <Activity size={20} />
                </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-8 relative z-10">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={552.92} strokeDashoffset={552.92 - (552.92 * loadPercentage) / 100} strokeLinecap="round" className={`${getLoadColor()} transition-all duration-1000 ease-out`} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-5xl font-black ${getLoadColor()}`}>{loadPercentage}%</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">Full Load</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50 relative z-10">
                <div className="bg-slate-50/50 p-3 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">ახლა შიგნით</p>
                    <p className="text-lg font-black text-slate-800">{currentOccupancy}</p>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">მაქს. ტევადობა</p>
                    <p className="text-lg font-black text-slate-800">{maxCapacity}</p>
                </div>
            </div>
            <Zap size={150} className="absolute -right-16 -bottom-16 text-slate-50 group-hover:scale-110 transition-transform duration-700" />
        </div>

        {/* NEW: GENDER & SOCIAL STATUS BREAKDOWN */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">სქესობრივი განაწილება</h3>
                <div className="flex-1 min-h-[200px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {genderData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <Users size={24} className="text-slate-200 mb-1" />
                        <span className="text-[9px] font-black text-slate-400 uppercase">Gender</span>
                    </div>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                    {genderData.map(g => (
                        <div key={g.name} className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: g.color}}></div>
                            <span className="text-xs font-bold text-slate-600">{g.name}: {g.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">სტატუსი და დასაქმება</h3>
                <div className="space-y-4">
                    {socialData.map(item => (
                        <div key={item.name} className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-600 flex items-center">
                                    {item.name === 'დასაქმებული' && <Briefcase size={12} className="mr-1 text-lime-500" />}
                                    {item.name === 'სტუდენტი' && <GraduationCap size={12} className="mr-1 text-blue-500" />}
                                    {item.name === 'არასრულწლოვანი' && <Baby size={12} className="mr-1 text-amber-500" />}
                                    {item.name}
                                </span>
                                <span className="font-black text-slate-900">{item.value}</span>
                            </div>
                            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-1000" style={{width: `${(item.value / statusSummary.total) * 100}%`, backgroundColor: item.color}}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* NEW: AGE DISTRIBUTION CHART */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">ასაკობრივი ჯგუფები</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageData}>
                        <CartesianGrid vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                        <YAxis hide />
                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="count" radius={[10, 10, 10, 10]} barSize={40}>
                            {ageData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#f59e0b' : '#bef264'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
             </div>
             <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-3">
                <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                   <strong>ყურადღება:</strong> 18-მდე ასაკის (არასრულწლოვანი) პირების რეგისტრაცია მოითხოვს მშობლის თანხმობის დოკუმენტს.
                </p>
             </div>
        </div>

        {/* MARKETING ANALYTICS CARD (MAINTAINED) */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <div>
                   <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">მარკეტინგული ეფექტურობა</h3>
                   <p className="text-xs text-slate-400 font-medium">დაგზავნილი აქციების და შეტყობინებების კონვერსია</p>
                </div>
                <button onClick={() => setDrillDown('MARKETING')} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-200 transition-all active:scale-95">დეტალური რეპორტი</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                    <p className="text-[10px] font-black text-blue-400 uppercase mb-1">საერთო წვდომა</p>
                    <div className="flex items-center justify-between">
                        <h4 className="text-2xl font-black text-blue-900">10,650</h4>
                        <MessageSquare size={18} className="text-blue-300" />
                    </div>
                </div>
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">საშუალო კონვერსია</p>
                    <div className="flex items-center justify-between">
                        <h4 className="text-2xl font-black text-emerald-900">9.2%</h4>
                        <MousePointerClick size={18} className="text-emerald-300" />
                    </div>
                </div>
                <div className="p-5 bg-lime-50 rounded-2xl border border-lime-100">
                    <p className="text-[10px] font-black text-lime-400 uppercase mb-1">შემოსავალი აქციებიდან</p>
                    <div className="flex items-center justify-between">
                        <h4 className="text-2xl font-black text-lime-900">₾ 26.2K</h4>
                        <ShoppingBag size={18} className="text-lime-400" />
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={campaignROI} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 900}} />
                        <Tooltip 
                            cursor={{fill: '#f8fafc'}}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="sales" name="გაყიდვები (₾)" radius={[0, 4, 4, 0]} barSize={20}>
                            {campaignROI.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#2563eb' : '#94a3b8'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsView;
