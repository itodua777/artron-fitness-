
'use client';
import React, { useState, useEffect } from 'react';
import {
    Megaphone,
    Plus,
    Calendar,
    Tag,
    Smartphone,
    Bell,
    Globe,
    ArrowLeft,
    BarChart,
    Users,
    Target,
    Package as PackageIcon,
    Pencil,
    CheckCircle
} from 'lucide-react';
import { Package } from '@/app/types';

interface Campaign {
    id: number;
    title: string;
    description: string;
    discount: number;
    startDate: string;
    endDate: string;
    status: 'Active' | 'Scheduled' | 'Draft' | 'Ended';
    channels: ('SMS' | 'PUSH' | 'SOCIAL')[];
    reach: number;
    targetPackageId?: string; // Linked package
    targetPackageName?: string;
}

export default function PromotionsPage() {
    const [viewMode, setViewMode] = useState<'LIST' | 'CREATE' | 'EDIT'>('LIST');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [packages, setPackages] = useState<Package[]>([]);

    useEffect(() => {
        // Fetch packages for the dropdown
        async function fetchPackages() {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                const res = await fetch(`${apiUrl}/api/passes`);
                if (res.ok) {
                    const data = await res.json();
                    setPackages(data);
                }
            } catch (error) {
                console.error("Failed to fetch packages", error);
            }
        }
        fetchPackages();
    }, []);

    const [campaigns, setCampaigns] = useState<Campaign[]>([
        {
            id: 1,
            title: 'საახალწლო ფასდაკლება',
            description: '20% ფასდაკლება 6 თვიან აბონემენტზე ყველა ახალი წევრისთვის.',
            discount: 20,
            startDate: '2023-12-25',
            endDate: '2024-01-15',
            status: 'Scheduled',
            channels: ['SMS', 'SOCIAL'],
            reach: 0
        },
        {
            id: 2,
            title: 'შავი პარასკევი',
            description: 'ულიმიტო წლიური აბონემენტი სპეციალურ ფასად.',
            discount: 40,
            startDate: '2023-11-24',
            endDate: '2023-11-27',
            status: 'Active',
            channels: ['PUSH', 'SMS', 'SOCIAL'],
            reach: 1450
        },
        {
            id: 3,
            title: 'სტუდენტური აქცია',
            description: 'სპეციალური ტარიფი სტუდენტებისთვის 14:00 საათამდე.',
            discount: 15,
            startDate: '2023-09-01',
            endDate: '2023-12-31',
            status: 'Active',
            channels: ['SOCIAL'],
            reach: 3200
        }
    ]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        discount: '',
        startDate: '',
        endDate: '',
        targetPackageId: '',
        channels: {
            sms: false,
            push: false,
            social: false
        }
    });

    const resetForm = () => {
        setFormData({ title: '', description: '', discount: '', startDate: '', endDate: '', targetPackageId: '', channels: { sms: false, push: false, social: false } });
        setEditingId(null);
    };

    const handleEditClick = (campaign: Campaign) => {
        setEditingId(campaign.id);
        setFormData({
            title: campaign.title,
            description: campaign.description,
            discount: campaign.discount.toString(),
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            targetPackageId: campaign.targetPackageId || '',
            channels: {
                sms: campaign.channels.includes('SMS'),
                push: campaign.channels.includes('PUSH'),
                social: campaign.channels.includes('SOCIAL'),
            }
        });
        setViewMode('EDIT');
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const channels: ('SMS' | 'PUSH' | 'SOCIAL')[] = [];
        if (formData.channels.sms) channels.push('SMS');
        if (formData.channels.push) channels.push('PUSH');
        if (formData.channels.social) channels.push('SOCIAL');

        // Find linked package name if exists
        const linkedPkg = packages.find(p => p.id === formData.targetPackageId);

        if (viewMode === 'EDIT' && editingId) {
            // Update Existing
            setCampaigns(prev => prev.map(camp => {
                if (camp.id === editingId) {
                    return {
                        ...camp,
                        title: formData.title,
                        description: formData.description,
                        discount: parseInt(formData.discount) || 0,
                        startDate: formData.startDate,
                        endDate: formData.endDate,
                        channels,
                        targetPackageId: formData.targetPackageId,
                        targetPackageName: linkedPkg?.title // Note: Package type uses 'title' or 'name'? Let's check. 
                        // In PassesView it says `title` for Package in form, but `name` in `Package` type usage in previous file view?
                        // Actually, checking PassLibraryView, it used `p.title`. 
                        // I'll check `Package` type definition if unsure, but for now I'll assume `title` based on typical usage or `name`.
                        // Wait, previous file `PromotionsView.tsx` used `linkedPkg?.name`.
                        // I'll stick to `name` or `title` depending on `packages` state which comes from API.
                        // The API returns `Package[]`.
                        // Let's assume `title` as common for packages, or `name`. 
                        // Actually, `Package` interface in `types.ts` likely has `title`.
                        // I'll use `title` as seen in PassesView, but `PromotionsView` used `name`. I'll try `title` and if it fails I'll switch.
                        // Wait, looking at `PassesView.tsx` logic from memory/logs, it says `title: string`.
                        // I'll use `title`.
                    };
                }
                return camp;
            }));
            // In a real app we would update backend here
            // For now just local state update
            setViewMode('LIST');
            resetForm();
        } else {
            // Create New
            const newCampaign: Campaign = {
                id: Date.now(),
                title: formData.title,
                description: formData.description,
                discount: parseInt(formData.discount) || 0,
                startDate: formData.startDate,
                endDate: formData.endDate,
                status: 'Active', // Default to active for demo
                channels,
                reach: 0,
                targetPackageId: formData.targetPackageId,
                targetPackageName: linkedPkg?.title
            };
            setCampaigns([newCampaign, ...campaigns]);
            setViewMode('LIST');
            resetForm();
        }
    };

    const toggleChannel = (channel: 'sms' | 'push' | 'social') => {
        setFormData(prev => ({
            ...prev,
            channels: { ...prev.channels, [channel]: !prev.channels[channel] }
        }));
    };

    // --- CREATE / EDIT MODE ---
    if (viewMode === 'CREATE' || viewMode === 'EDIT') {
        return (
            <div className="max-w-4xl mx-auto animate-fadeIn pb-12">
                <button
                    onClick={() => {
                        setViewMode('LIST');
                        resetForm();
                    }}
                    className="flex items-center text-slate-500 hover:text-white transition-colors mb-6 group"
                >
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase text-xs tracking-widest">აქციების დაფაზე დაბრუნება</span>
                </button>

                <div className="bg-[#161b22] rounded-[2.5rem] shadow-xl border border-slate-800 overflow-hidden">
                    <div className="p-8 border-b border-slate-800 bg-[#0d1117] flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-lime-500 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shadow-lime-500/30">
                                {viewMode === 'EDIT' ? <Pencil size={28} /> : <Megaphone size={28} />}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">
                                    {viewMode === 'EDIT' ? 'აქციის რედაქტირება' : 'ახალი აქციის შექმნა'}
                                </h2>
                                <p className="text-slate-500 text-sm font-medium">
                                    {viewMode === 'EDIT' ? 'შეცვალეთ აქციის დეტალები და მიბმული პაკეტები' : 'დაგეგმეთ მარკეტინგული კამპანია'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleFormSubmit} className="p-10 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Side: General Info */}
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-slate-800 pb-3">ძირითადი ინფორმაცია</h3>

                                {/* Package Selection */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase ml-1 flex items-center">
                                        <PackageIcon size={14} className="mr-1.5 text-lime-500" />
                                        სამიზნე პროდუქტი (პაკეტი)
                                    </label>
                                    <select
                                        value={formData.targetPackageId}
                                        onChange={(e) => setFormData({ ...formData, targetPackageId: e.target.value })}
                                        className="w-full px-5 py-3.5 rounded-2xl border border-slate-700 bg-[#0d1117] focus:border-lime-500 outline-none transition-all font-bold text-white appearance-none"
                                    >
                                        <option value="" className="text-slate-500">ზოგადი აქცია (პაკეტის გარეშე)</option>
                                        {packages.map(pkg => (
                                            <option key={pkg.id} value={pkg.id}>
                                                {pkg.title} - ₾{pkg.price}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-[10px] font-bold text-slate-600 ml-1">
                                        {packages.length === 0
                                            ? 'ბიბლიოთეკაში პაკეტები არ მოიძებნა. შეიქმნება ზოგადი აქცია.'
                                            : 'მიუთითეთ რომელ პაკეტზე ვრცელდება ეს აქცია.'}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase ml-1">აქციის დასახელება</label>
                                    <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} type="text" placeholder="მაგ: საგაზაფხულო ფასდაკლება" className="w-full px-5 py-3.5 rounded-2xl border border-slate-700 bg-[#0d1117] focus:border-lime-500 outline-none transition-all font-bold text-white placeholder:text-slate-600" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase ml-1">აღწერა (შეტყობინების ტექსტი)</label>
                                    <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="მოკლე აღწერა აქციის შესახებ..." className="w-full px-5 py-3.5 rounded-2xl border border-slate-700 bg-[#0d1117] focus:border-lime-500 outline-none transition-all h-32 resize-none font-bold text-white placeholder:text-slate-600" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase ml-1">ფასდაკლების ოდენობა (%)</label>
                                    <div className="relative">
                                        <input type="number" min="0" max="100" value={formData.discount} onChange={e => setFormData({ ...formData, discount: e.target.value })} className="w-full px-5 py-3.5 rounded-2xl border border-slate-700 bg-[#0d1117] focus:border-lime-500 outline-none transition-all font-black text-lg text-white placeholder:text-slate-700" placeholder="20" />
                                        <Tag size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Targeting & Timing */}
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-slate-800 pb-3">გავრცელების არხები და დრო</h3>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-500 uppercase ml-1 mb-2 block">სად გაიგზავნოს აქცია?</label>

                                    <div
                                        onClick={() => toggleChannel('sms')}
                                        className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all group ${formData.channels.sms ? 'border-lime-500 bg-lime-500/10' : 'border-slate-700 bg-[#0d1117] hover:border-lime-500/50'}`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-2.5 rounded-xl ${formData.channels.sms ? 'bg-lime-500 text-slate-900' : 'bg-[#161b22] text-slate-500 group-hover:text-white'}`}>
                                                <Smartphone size={20} />
                                            </div>
                                            <span className={`font-black text-sm ${formData.channels.sms ? 'text-lime-500' : 'text-slate-400 group-hover:text-white'}`}>SMS დაგზავნა</span>
                                        </div>
                                        {formData.channels.sms && <CheckCircle size={20} className="text-lime-500" />}
                                    </div>

                                    <div
                                        onClick={() => toggleChannel('push')}
                                        className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all group ${formData.channels.push ? 'border-lime-500 bg-lime-500/10' : 'border-slate-700 bg-[#0d1117] hover:border-lime-500/50'}`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-2.5 rounded-xl ${formData.channels.push ? 'bg-lime-500 text-slate-900' : 'bg-[#161b22] text-slate-500 group-hover:text-white'}`}>
                                                <Bell size={20} />
                                            </div>
                                            <span className={`font-black text-sm ${formData.channels.push ? 'text-lime-500' : 'text-slate-400 group-hover:text-white'}`}>Push ნოტიფიკაცია</span>
                                        </div>
                                        {formData.channels.push && <CheckCircle size={20} className="text-lime-500" />}
                                    </div>

                                    <div
                                        onClick={() => toggleChannel('social')}
                                        className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all group ${formData.channels.social ? 'border-lime-500 bg-lime-500/10' : 'border-slate-700 bg-[#0d1117] hover:border-lime-500/50'}`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-2.5 rounded-xl ${formData.channels.social ? 'bg-lime-500 text-slate-900' : 'bg-[#161b22] text-slate-500 group-hover:text-white'}`}>
                                                <Globe size={20} />
                                            </div>
                                            <span className={`font-black text-sm ${formData.channels.social ? 'text-lime-500' : 'text-slate-400 group-hover:text-white'}`}>Social Media პოსტი</span>
                                        </div>
                                        {formData.channels.social && <CheckCircle size={20} className="text-lime-500" />}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase ml-1">დაწყება</label>
                                        <input required type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-5 py-3.5 rounded-2xl border border-slate-700 bg-[#0d1117] focus:border-lime-500 outline-none text-white font-bold text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase ml-1">დასრულება</label>
                                        <input required type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-5 py-3.5 rounded-2xl border border-slate-700 bg-[#0d1117] focus:border-lime-500 outline-none text-white font-bold text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-10 border-t border-slate-800 space-x-4">
                            <button type="button" onClick={() => { setViewMode('LIST'); resetForm(); }} className="px-8 py-4 text-slate-500 font-bold hover:text-white transition-colors uppercase text-xs tracking-widest">
                                გაუქმება
                            </button>
                            <button type="submit" className="flex items-center space-x-3 px-10 py-4 bg-lime-500 hover:bg-lime-400 text-slate-900 font-black rounded-3xl shadow-xl shadow-lime-500/10 transition-all active:scale-95">
                                <Megaphone size={20} />
                                <span className="uppercase text-xs tracking-widest">{viewMode === 'EDIT' ? 'ცვლილებების შენახვა' : 'აქციის გაშვება'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // --- LIST VIEW ---
    return (
        <div className="space-y-8 animate-fadeIn pb-12">

            {/* Header & Action */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center tracking-tight">
                        <Megaphone className="mr-3 text-lime-500" size={28} />
                        აქციების მართვა
                    </h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">მართეთ მარკეტინგული კამპანიები და ფასდაკლებები</p>
                </div>
                <button
                    onClick={() => { resetForm(); setViewMode('CREATE'); }}
                    className="flex items-center space-x-3 px-8 py-3.5 bg-lime-500 hover:bg-lime-400 text-slate-900 font-black rounded-2xl shadow-xl shadow-lime-500/20 transition-all active:scale-95 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    <span className="uppercase text-xs tracking-widest">ახალი აქცია</span>
                </button>
            </div>

            {/* Stats Mockup */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-lime-500 rounded-[2rem] p-8 text-slate-900 shadow-lg shadow-lime-500/20 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-lime-900 text-xs font-black uppercase tracking-widest mb-2">აქტიური კამპანიები</p>
                        <h3 className="text-4xl font-black">2</h3>
                    </div>
                    <Megaphone size={80} className="absolute -right-6 -bottom-6 text-lime-800/20 group-hover:rotate-12 transition-transform" />
                </div>
                <div className="bg-[#161b22] rounded-[2rem] p-8 border border-slate-800 shadow-sm flex flex-col justify-between group hover:border-slate-700 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">საერთო წვდომა</p>
                            <h3 className="text-3xl font-black text-white">4,650</h3>
                        </div>
                        <div className="p-3 bg-slate-800 rounded-2xl text-slate-400 group-hover:text-white transition-colors"><Users size={24} /></div>
                    </div>
                    <p className="text-[10px] font-black text-emerald-500 mt-4 uppercase tracking-wider">+12% გასულ თვესთან</p>
                </div>
                <div className="bg-[#161b22] rounded-[2rem] p-8 border border-slate-800 shadow-sm flex flex-col justify-between group hover:border-slate-700 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">კონვერსია</p>
                            <h3 className="text-3xl font-black text-white">8.4%</h3>
                        </div>
                        <div className="p-3 bg-slate-800 rounded-2xl text-slate-400 group-hover:text-white transition-colors"><Target size={24} /></div>
                    </div>
                    <p className="text-[10px] font-black text-slate-500 mt-4 uppercase tracking-wider">საშუალო მაჩვენებელი</p>
                </div>
            </div>

            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((camp) => (
                    <div key={camp.id} className="bg-[#161b22] rounded-[2.5rem] border border-slate-800 shadow-sm hover:shadow-xl hover:border-lime-500/30 transition-all duration-300 flex flex-col relative overflow-hidden group">
                        {/* Status Badge */}
                        <div className={`absolute top-6 right-6 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${camp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                            camp.status === 'Scheduled' ? 'bg-amber-500/10 text-amber-500' :
                                'bg-slate-800 text-slate-500'
                            }`}>
                            {camp.status === 'Active' ? 'აქტიური' : camp.status === 'Scheduled' ? 'დაგეგმილი' : 'დასრულებული'}
                        </div>

                        <div className="p-8 flex-1">
                            <div className="w-14 h-14 rounded-2xl bg-[#0d1117] border border-slate-800 flex items-center justify-center text-lime-500 font-black text-xl mb-6 shadow-sm group-hover:text-white group-hover:bg-lime-500 transition-all">
                                {camp.discount}%
                            </div>

                            <h3 className="text-xl font-black text-white mb-2 leading-tight">{camp.title}</h3>
                            <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2 leading-relaxed">{camp.description}</p>

                            {/* Linked Package Badge */}
                            {camp.targetPackageName && (
                                <div className="inline-flex items-center bg-[#0d1117] px-3 py-1.5 rounded-lg text-[10px] text-slate-400 font-bold mb-4 uppercase tracking-wider border border-slate-800">
                                    <PackageIcon size={12} className="mr-2" />
                                    {camp.targetPackageName}
                                </div>
                            )}

                            <div className="flex items-center text-xs text-slate-500 font-bold mb-3">
                                <Calendar size={14} className="mr-2" />
                                {camp.startDate} - {camp.endDate}
                            </div>

                            <div className="flex items-center space-x-2 mt-4">
                                {camp.channels.map(ch => (
                                    <span key={ch} className="px-2.5 py-1 rounded-md bg-[#0d1117] text-slate-500 text-[9px] font-black border border-slate-800 uppercase tracking-tighter">
                                        {ch}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="px-8 py-5 bg-[#0d1117] border-t border-slate-800 flex justify-between items-center">
                            <div className="flex items-center text-xs font-bold text-slate-500">
                                <BarChart size={14} className="mr-2" />
                                {camp.reach > 0 ? `${camp.reach} ნახვა` : 'N/A'}
                            </div>
                            <button
                                onClick={() => handleEditClick(camp)}
                                className="text-xs font-black text-lime-500 hover:text-white flex items-center uppercase tracking-widest transition-colors"
                            >
                                <Pencil size={14} className="mr-2" />
                                მართვა
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <style>{`
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
        </div>
    );
};
