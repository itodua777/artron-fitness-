'use client';

import React, { useState, useEffect } from 'react';
import {
    ShoppingCart,
    Check,
    ArrowRight,
    Plus,
    Star,
    Zap,
    Layout,
    Calendar,
    MessageSquare,
    Building2,
    ShoppingBag,
    Warehouse,
    Calculator,
    BarChart2,
    Users,
    CreditCard
} from 'lucide-react';
import Link from 'next/link';

const MODULES_CONFIG = [
    {
        id: 'registration',
        label: 'მომხმარებლების რეგისტრაცია',
        price: 0,
        subModules: [
            { id: 'registration_new', label: 'ახალი მომხმარებლის რეგისტრაცია', price: 50, description: 'მარტივი და სწრაფი რეგისტრაციის პროცესი ახალი წევრებისთვის.' },
        ]
    },
    { id: 'reservation', label: 'ადგილის დაჯავშნა', price: 30, description: 'ონლაინ დაჯავშნის სისტემა დარბაზისთვის და ჯგუფური ვარჯიშებისთვის.', icon: <Calendar /> },
    { id: 'schedule', label: 'განრიგის მართვა', price: 40, description: 'მოქნილი განრიგის სისტემა მწვრთნელებისა და დარბაზებისთვის.', icon: <Calendar /> },
    {
        id: 'library',
        label: 'აქტივობების ბიბლიოთეკა',
        price: 0,
        subModules: [
            { id: 'activity_onetime', label: 'ერთჯერადი ვიზიტები', price: 30, description: 'ერთჯერადი ვიზიტების აღრიცხვა და მართვა.' },
            { id: 'activity_individual', label: 'ინდივიდუალური აქტივობები', price: 40, description: 'პერსონალური ვარჯიშების გრაფიკი და აღრიცხვა.' },
            { id: 'activity_group', label: 'ჯგუფური აქტივობები', price: 50, description: 'ჯგუფური ვარჯიშების მართვა და წევრების აღრიცხვა.' },
            { id: 'activity_calendar', label: 'კალენდარული აქტივობები', price: 40, description: 'სეზონური და კალენდარზე მიბმული აქტივობები.' },
        ]
    },
    { id: 'communication', label: 'კომუნიკაცია მომხმარებელთან', price: 60, description: 'SMS და Email შეტყობინებები, ავტომატური შეხსენებები.', icon: <MessageSquare /> },
    { id: 'corporate', label: 'კორპორატიული სერვისი', price: 80, description: 'კორპორატიული კლიენტების მართვა, სპეციალური პაკეტები.', icon: <Building2 /> },
    { id: 'pos', label: 'Point of Sale (POS)', price: 50, description: 'გაყიდვების ტერმინალი, პროდუქციის გაყიდვა ადგილზე.', icon: <CreditCard /> },
    { id: 'market', label: 'ქარვასლა (მარკეტი/ბარი)', price: 60, description: 'შიდა მაღაზიის და ბარის მართვა, მარაგების კონტროლი.', icon: <ShoppingBag /> },
    { id: 'warehouse', label: 'საწყობის მართვა', price: 40, description: 'ინვენტარის და მარაგების დეტალური აღრიცხვა.', icon: <Warehouse /> },
    { id: 'accounting', label: 'ბუღალტერია (ინვოისები/ხარჯები)', price: 70, description: 'ფინანსური აღრიცხვა, ინვოისების გენერაცია, ხარჯების კონტროლი.', icon: <Calculator /> },
    { id: 'statistics', label: 'სტატისტიკა და რეპორტინგი', price: 30, description: 'დეტალური ანალიტიკა და რეპორტები ბიზნესის ზრდისთვის.', icon: <BarChart2 /> },
    { id: 'hrm', label: 'HRM - თანამშრომლების მართვა', price: 50, description: 'თანამშრომლების გრაფიკი, ხელფასები და დასწრება.', icon: <Users /> },
];

export default function POSPage() {
    const [selectedModules, setSelectedModules] = useState<any>({});
    const [availableUpgrades, setAvailableUpgrades] = useState<any[]>([]);
    const [activePlanModules, setActivePlanModules] = useState<any[]>([]);

    useEffect(() => {
        // Load selected modules from local storage
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('artron_active_modules');
            const parsed = saved ? JSON.parse(saved) : {};
            setSelectedModules(parsed);

            // Calculate upgrades
            // Calculate upgrades and active
            const upgrades: any[] = [];
            const active: any[] = [];

            MODULES_CONFIG.forEach(mod => {
                // Check main module
                if (!mod.subModules) {
                    if (!parsed[mod.id]) {
                        upgrades.push({ ...mod, type: 'main' });
                    } else {
                        active.push({ ...mod, type: 'main' });
                    }
                } else {
                    // Check submodules
                    mod.subModules.forEach(sub => {
                        if (!parsed[sub.id]) {
                            upgrades.push({ ...sub, parentLabel: mod.label, type: 'sub' });
                        } else {
                            active.push({ ...sub, parentLabel: mod.label, type: 'sub' });
                        }
                    });
                }
            });
            setAvailableUpgrades(upgrades);
            setActivePlanModules(active);
        }
    }, []);

    return (
        <div className="p-8 space-y-8 animate-fadeIn pb-24">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
                        <ShoppingCart size={32} className="mr-3 text-indigo-500" />
                        Point of Sale
                    </h1>
                </div>
            </div>

            {/* Active Plan Section - De-emphasized */}
            {activePlanModules.length > 0 && (
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 opacity-60 hover:opacity-100 transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                        <div className="flex items-center space-x-3 shrink-0">
                            <div className="w-8 h-8 bg-slate-200 text-slate-500 rounded-lg flex items-center justify-center">
                                <Check size={16} strokeWidth={3} />
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-slate-700 uppercase tracking-wide">აქტიური პაკეტი</h2>
                                <p className="text-xs text-slate-400 font-bold">{activePlanModules.length} მოდული</p>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap gap-2">
                                {activePlanModules.map((mod) => (
                                    <span key={mod.id} className="inline-flex items-center px-2.5 py-1 bg-white border border-slate-200 rounded-md text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                                        <Check size={10} className="mr-1.5 text-lime-500" />
                                        {mod.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {availableUpgrades.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableUpgrades.map((upgrade, index) => {
                        const gradients = [
                            'bg-gradient-to-br from-orange-400 to-pink-600 shadow-orange-500/20 text-white',
                            'bg-gradient-to-br from-blue-400 to-indigo-600 shadow-blue-500/20 text-white',
                            'bg-gradient-to-br from-emerald-400 to-cyan-600 shadow-emerald-500/20 text-white',
                            'bg-gradient-to-br from-violet-400 to-purple-600 shadow-violet-500/20 text-white',
                            'bg-gradient-to-br from-rose-400 to-red-600 shadow-rose-500/20 text-white',
                        ];
                        const theme = gradients[index % gradients.length];

                        return (
                            <div key={upgrade.id} className={`${theme} p-6 rounded-[2rem] shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden ring-1 ring-white/20`}>
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Zap size={100} className="rotate-12" />
                                </div>

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white">
                                            {upgrade.icon || <Layout size={24} />}
                                        </div>
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/10 text-xs font-black rounded-lg uppercase tracking-wider">
                                            {upgrade.price} ₾/თვე
                                        </span>
                                    </div>

                                    <div className="mb-6 flex-1">
                                        {upgrade.type === 'sub' && (
                                            <p className="text-[10px] uppercase font-black text-white/60 mb-1">{upgrade.parentLabel}</p>
                                        )}
                                        <h3 className="text-xl font-black text-white mb-2 leading-tight drop-shadow-sm">{upgrade.label}</h3>
                                        <p className="text-sm text-white/80 font-medium leading-relaxed">
                                            {upgrade.description || `${upgrade.label}-ის მართვის სრული ფუნქციონალი.`}
                                        </p>
                                    </div>

                                    <Link href="/settings" className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer mt-auto shadow-lg shadow-black/10">
                                        <Plus size={18} className="mr-2" />
                                        დამატება
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                    <div className="w-20 h-20 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">თქვენს ყველა მოდულს იყენებთ!</h3>
                    <p className="text-slate-400 font-bold">ამ მომენტისთვის დამატებითი შეთავაზებები არ არის.</p>
                </div>
            )}
        </div>
    );
}
