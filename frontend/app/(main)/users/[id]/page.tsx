
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Phone, Mail, Calendar, MapPin, Building2, CreditCard, ShieldCheck, Activity, CreditCard as CardIcon, Tag, Smartphone, CheckCircle2, RefreshCw, Key, Ban, ShieldAlert, AlertCircle, FileText, Plus, Eye, Download, Trash2, CheckCircle } from 'lucide-react';


export default function MemberProfilePage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [member, setMember] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'მთავარი' },
        { id: 'access', label: 'დაშვება' },
        { id: 'finances', label: 'ფინანსები' },
        { id: 'health', label: 'ჯანმრთელობა' },
        { id: 'loyalty', label: 'ლოიალობა' },
    ];

    const [notes, setNotes] = useState('');
    const [accessDateFrom, setAccessDateFrom] = useState('');
    const [accessDateTo, setAccessDateTo] = useState('');

    // Mock Access Logs
    const mockAccessLogs = [
        { id: 1, location: 'მთავარი ტურნიკეტი', time: '2023-10-21 18:15:02', status: 'Failure', reason: 'Membership Expired' },
        { id: 2, location: 'პარკინგის ჭიშკარი', time: '2023-10-20 09:00:00', status: 'Success' },
        { id: 3, location: 'მთავარი ტურნიკეტი', time: '2023-10-20 09:05:12', status: 'Success' },
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



    useEffect(() => {
        if (!id) return;
        const fetchMember = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/members/${id}`);
                if (res.ok) {
                    const m = await res.json();
                    setMember({
                        ...m,
                        joinedDate: m.joinedDate ? new Date(m.joinedDate).toLocaleDateString('ka-GE') : 'N/A'
                    });
                } else {
                    console.error('Member not found');
                }
            } catch (error) {
                console.error('Error fetching member:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMember();
    }, [id]);

    if (loading) return <div className="p-10 text-slate-500">იტვირთება...</div>;
    if (!member) return <div className="p-10 text-slate-500">მომხმარებელი არ მოიძებნა</div>;

    return (
        <div className="max-w-6xl mx-auto animate-fadeIn pb-20">
            <button onClick={() => router.back()} className="flex items-center text-slate-500 hover:text-white transition-colors mb-6 group">
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">სიაში დაბრუნება</span>
            </button>

            <div className="bg-[#161b22] rounded-[2.5rem] shadow-xl border border-slate-800 overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b border-slate-800 bg-[#0d1117]/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center space-x-6">
                            <div className="w-24 h-24 bg-[#1f2937] rounded-3xl flex items-center justify-center text-slate-400 font-black text-4xl border-4 border-slate-800 shadow-sm overflow-hidden">
                                {member.photo ? (
                                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    member.name?.charAt(0)
                                )}
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-2">{member.name}</h2>
                                <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                                    <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest ${member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {member.status === 'Active' ? 'აქტიური' : member.status}
                                    </span>
                                    {member.isCorporate && (
                                        <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-xl text-xs font-black uppercase tracking-widest flex items-center">
                                            <Building2 size={12} className="mr-1" /> კორპორატიული
                                        </span>
                                    )}
                                    <span className="text-slate-500 text-sm font-bold flex items-center"><Tag size={14} className="mr-1" /> {member.activePackageName || 'პაკეტი არაა აქტიური'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button onClick={() => {/* Edit Logic */ }} className="px-6 py-3 bg-[#1f2937] hover:bg-slate-700 text-white font-bold rounded-2xl transition-colors border border-slate-700">
                                რედაქტირება
                            </button>
                            <button onClick={() => {/* Delete Logic */ }} className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-2xl transition-colors border border-red-500/20">
                                წაშლა
                            </button>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex items-center space-x-1 mt-10 overflow-x-auto pb-2 scrollbar-none">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-500/20'
                                    : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Main Content (Cols 8) */}
                        <div className="lg:col-span-8 space-y-8">

                            {/* General Section */}
                            {activeTab === 'general' && (
                                <div className="animate-fadeIn space-y-8">
                                    {/* Personal Info Card */}
                                    <div className="bg-[#0d1117] rounded-3xl border border-slate-800 overflow-hidden">
                                        <div className="p-6 border-b border-slate-800 bg-slate-800/20">
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center">
                                                <User size={16} className="mr-2 text-blue-500" /> პირადი ინფორმაცია
                                            </h3>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">სრული სახელი</span>
                                                    <p className="text-white font-bold">{member.name}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">პირადი ნომერი</span>
                                                    <p className="text-white font-mono font-bold">{member.personalId || '-'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">მობილური</span>
                                                    <p className="text-white font-mono font-bold">{member.phone || '-'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ელ-ფოსტა</span>
                                                    <p className="text-white font-bold">{member.email || '-'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">მისამართი</span>
                                                    <p className="text-white font-bold truncate">{member.address || '-'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">რეგისტრაციის თარიღი</span>
                                                    <p className="text-white font-bold">{member.joinedDate}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Other Info Card */}
                                    <div className="bg-[#0d1117] rounded-3xl border border-slate-800 overflow-hidden">
                                        <div className="p-6 border-b border-slate-800 bg-slate-800/20">
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center">
                                                <Activity size={16} className="mr-2 text-indigo-500" /> სხვა მონაცემები
                                            </h3>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            {member.isCorporate && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 pb-4 border-b border-slate-800/50">
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">კომპანია</span>
                                                        <p className="text-white font-bold">{member.companyName}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ჯგუფი ID</span>
                                                        <p className="text-white font-mono font-bold">{member.groupId || '-'}</p>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ბარათის კოდი</span>
                                                    <p className="text-white font-mono font-bold">{member.cardCode || '-'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">სამაჯურის კოდი</span>
                                                    <p className="text-white font-mono font-bold">{member.braceletCode || '-'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Access Section (Legacy Restore) */}
                            {activeTab === 'access' && (
                                <div className="grid grid-cols-1 gap-8 animate-fadeIn">
                                    <div className="space-y-6">
                                        {/* Mobile App Access Card */}
                                        <div className="bg-[#0d1117] rounded-[2.5rem] border border-slate-800 overflow-hidden p-8 shadow-xl">
                                            <div className="flex items-center space-x-3 mb-6">
                                                <Smartphone size={24} className="text-blue-400" />
                                                <h3 className="font-black text-white text-lg tracking-tight">Mobile App Access</h3>
                                            </div>

                                            <div className="flex justify-between items-start mb-8">
                                                <div>
                                                    <p className="text-base font-bold text-white mb-1">{member.email || 'No Email'}</p>
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
                                                <button className="flex-1 px-4 py-3 bg-[#161b22] border border-slate-700 text-white text-xs font-black uppercase rounded-xl hover:bg-slate-700 transition-all shadow-lg flex items-center justify-center gap-2 group">
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

                                        {/* Physical Access */}
                                        <div className="bg-[#0d1117] rounded-[2.5rem] border border-slate-800 overflow-hidden p-8">
                                            <div className="flex items-center justify-between mb-8">
                                                <h3 className="font-black text-white uppercase tracking-tight">ფიზიკური დაშვება</h3>
                                                <button className="text-[10px] font-black uppercase text-blue-400 hover:text-blue-300">+ დამატება</button>
                                            </div>
                                            <div className="space-y-4">
                                                <div className={`p-4 bg-[#161b22] border border-slate-800 rounded-2xl flex justify-between items-center`}>
                                                    <div>
                                                        <h4 className="text-xs font-black text-white">სამაჯური</h4>
                                                        <p className="text-[10px] text-slate-500 font-mono">{member.braceletCode || 'N/A'}</p>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${member.braceletCode ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>{member.braceletCode ? 'Active' : 'Not Linked'}</span>
                                                </div>
                                                <div className={`p-4 bg-[#161b22] border border-slate-800 rounded-2xl flex justify-between items-center`}>
                                                    <div>
                                                        <h4 className="text-xs font-black text-white">ბარათი</h4>
                                                        <p className="text-[10px] text-slate-500 font-mono">{member.cardCode || 'N/A'}</p>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${member.cardCode ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>{member.cardCode ? 'Active' : 'Not Linked'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Access Logs */}
                                    <div className="bg-[#0d1117] rounded-[2.5rem] border border-slate-800 overflow-hidden flex flex-col">
                                        <div className="p-8 border-b border-slate-800 bg-slate-800/20">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-black text-white uppercase tracking-tight">ტურნიკეტის ლოგები</h3>
                                                <div className="flex space-x-2">
                                                    <input
                                                        type="date"
                                                        value={accessDateFrom}
                                                        onChange={(e) => setAccessDateFrom(e.target.value)}
                                                        className="bg-[#161b22] border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-8 space-y-4 flex-1 overflow-y-auto max-h-[400px]">
                                            {filteredLogs.map(log => (
                                                <div key={log.id} className="p-4 bg-[#161b22] rounded-2xl border border-slate-800 flex justify-between items-center group hover:border-slate-600 transition-all">

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
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Finances Section */}
                            {activeTab === 'finances' && (
                                <div className="flex flex-col items-center justify-center py-20 animate-fadeIn space-y-4">
                                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-600 mb-4">
                                        <CreditCard size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">ფინანსური ისტორია ცარიელია</h3>
                                    <p className="text-slate-500 max-w-md text-center">
                                        მომხმარებელს არ უფიქსირდება აქტიური ინვოისები ან გადახდების ისტორია.
                                    </p>
                                </div>
                            )}

                            {/* Health Section */}
                            {activeTab === 'health' && (
                                <div className="animate-fadeIn space-y-8">
                                    <section>
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center border-b border-slate-800 pb-4 mb-6">
                                            <ShieldCheck size={16} className="mr-2 text-emerald-500" /> სამედიცინო დოკუმენტაცია
                                        </h3>
                                        <div className="bg-[#0d1117] p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${member.healthCert ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
                                                    <Activity size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-lg">ჯანმრთელობის ცნობა</h4>
                                                    <p className="text-slate-500 text-sm">{member.healthCert ? 'დოკუმენტი ატვირთულია და აქტიურია' : 'დოკუმენტი არ არის წარმოდგენილი'}</p>
                                                </div>
                                            </div>
                                            <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${member.healthCert ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
                                                {member.healthCert ? 'აქტიური' : 'არ არის'}
                                            </span>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center border-b border-slate-800 pb-4 mb-6">
                                            <Activity size={16} className="mr-2 text-blue-500" /> ანთროპომეტრიული მონაცემები
                                        </h3>
                                        <div className="flex flex-col items-center justify-center py-10 border border-dashed border-slate-800 rounded-3xl bg-[#0d1117]/50">
                                            <p className="text-slate-500 font-medium">გაზომვების ისტორია არ მოიძებნა</p>
                                        </div>
                                    </section>
                                </div>
                            )}

                            {/* Loyalty Section */}
                            {activeTab === 'loyalty' && (
                                <div className="flex flex-col items-center justify-center py-20 animate-fadeIn space-y-4">
                                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-600 mb-4">
                                        <Tag size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">ლოიალობის პროგრამა</h3>
                                    <p className="text-slate-500 max-w-md text-center">
                                        მომხმარებელს არ აქვს დაგროვებული ქულები ან აქტიური ბონუსები.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar (Cols 4) */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* Internal Notes */}
                            <div className="bg-[#0d1117] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-xl">
                                <div className="p-8 border-b border-slate-800 bg-slate-800/20">
                                    <h3 className="font-black text-white uppercase tracking-tight">შიდა ჩანაწერები</h3>
                                </div>
                                <div className="p-8 space-y-6">
                                    <textarea
                                        value={notes}
                                        onChange={e => setNotes(e.target.value)}
                                        placeholder="დაამატეთ შენიშვნა მომხმარებლის პრეფერენციებზე, სამედიცინო გაფრთხილებებზე ან გაყიდვის შესაძლებლობებზე..."
                                        className="w-full h-40 bg-[#161b22] border border-slate-800 rounded-2xl p-6 text-sm font-medium text-slate-300 focus:border-blue-500 outline-none transition-all resize-none leading-relaxed"
                                    />
                                    <button className="w-full py-4 bg-[#1f2937] hover:bg-slate-700 text-white font-black rounded-2xl transition-all shadow-lg active:scale-95 uppercase text-xs tracking-widest">
                                        ჩანაწერის შენახვა
                                    </button>
                                </div>
                            </div>

                            {/* Quick Actions Card */}
                            <div className="bg-gradient-to-br from-blue-600/10 to-transparent p-8 rounded-[2.5rem] border border-blue-500/20 shadow-xl">
                                <h4 className="text-white font-black text-lg mb-6 flex items-center">
                                    <AlertCircle size={20} className="mr-2 text-blue-400" /> სწრაფი მოქმედებები
                                </h4>
                                <div className="space-y-3">
                                    <button className="w-full text-left px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-tighter transition-all border bg-white/5 text-slate-300 border-white/5 hover:bg-white/10 hover:text-white">
                                        აბონემენტის გაყინვა
                                    </button>
                                    <button className="w-full text-left px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-tighter transition-all border bg-white/5 text-slate-300 border-white/5 hover:bg-white/10 hover:text-white">
                                        ბალანსის შევსება
                                    </button>
                                    <button className="w-full text-left px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-tighter transition-all border bg-red-500/5 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white">
                                        საშვის დაბლოკვა
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


}
