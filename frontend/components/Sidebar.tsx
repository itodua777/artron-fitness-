
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Ticket,
    Dumbbell,
    Users,
    ShoppingBag,
    Warehouse,
    Calculator,
    BarChart2,
    Settings,
    LogOut,
    Building2,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    ClipboardList,
    MessageSquare,
    Megaphone,
    Watch,
    User,
    List,
    Calendar
} from 'lucide-react';
import { useLanguage } from '../app/contexts/LanguageContext';

const Sidebar = () => {
    const { t } = useLanguage();
    const pathname = usePathname();
    const [onboardingStep, setOnboardingStep] = useState(0);
    const [selectedModules, setSelectedModules] = useState<any>({});
    const [companyProfile, setCompanyProfile] = useState<any>(null);

    useEffect(() => {
        const loadState = () => {
            const step = localStorage.getItem('artron_setup_flow_step');
            const mods = localStorage.getItem('artron_active_modules');
            const company = localStorage.getItem('artron_company_profile');

            setOnboardingStep(step ? parseInt(step) : 0);
            setSelectedModules(mods ? (JSON.parse(mods) || {}) : {});
            setCompanyProfile(company ? JSON.parse(company) : null);
        };
        loadState();
        window.addEventListener('storage', loadState); // Listen for updates
        return () => window.removeEventListener('storage', loadState);
    }, []);

    const isOnboarding = onboardingStep < 5;
    const isModuleActive = (key: string) => !isOnboarding && selectedModules[key];

    // State for the dropdowns
    const [isActivityOpen, setIsActivityOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);


    // State for collapse
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
        if (isCollapsed) {
            // Re-open groups if needed is handled by user expanding interaction, 
            // but we don't need to force open specific groups on expand, let state persist
        } else {
            setIsActivityOpen(false);
            setIsUserOpen(false);
        }
    };

    const handleGroupClick = (group: 'user' | 'activity' | 'warehouse') => {
        if (isCollapsed) {
            setIsCollapsed(false);
            setTimeout(() => {
                if (group === 'user') setIsUserOpen(true);
                if (group === 'activity') setIsActivityOpen(true);
            }, 50); // Small delay to allow expansion
        } else {
            if (group === 'user') setIsUserOpen(!isUserOpen);
            if (group === 'activity') setIsActivityOpen(!isActivityOpen);
        }
    };

    // Auto-expand if a child view is active
    useEffect(() => {
        if (pathname.includes('/passes')) {
            setIsActivityOpen(true);
        }
        if (pathname.includes('/users')) {
            setIsUserOpen(true);
        }
    }, [pathname]);

    const menuItems = [
        { id: 'dashboard', href: '/dashboard', label: t('menu.dashboard'), icon: <LayoutDashboard size={20} /> },
        { id: 'USER_GROUP', label: t('menu.users'), icon: <User size={20} />, isGroup: true },
        { id: 'ACTIVITY_GROUP', label: t('menu.activity_group'), icon: <ClipboardList size={20} />, isGroup: true },
        { id: 'corporate', href: '/corporate', label: t('menu.corporate'), icon: <Building2 size={20} /> },
        { id: 'promotions', href: '/promotions', label: t('menu.promotions'), icon: <Megaphone size={20} /> },
        { id: 'employees', href: '/employees', label: t('menu.employees'), icon: <Users size={20} /> },
        { id: 'market', href: '/market', label: t('menu.market'), icon: <ShoppingBag size={20} /> },
        { id: 'warehouse', href: '/warehouse', label: 'საწყობი', icon: <Warehouse size={20} /> },
        { id: 'messages', href: '/messages', label: t('menu.messages'), icon: <MessageSquare size={20} /> },
        { id: 'accounting', href: '/accounting', label: t('menu.accounting'), icon: <Calculator size={20} /> },
        { id: 'statistics', href: '/statistics', label: t('menu.statistics'), icon: <BarChart2 size={20} /> },
        { id: 'settings', href: '/settings', label: t('menu.settings'), icon: <Settings size={20} /> },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-slate-900 text-white flex flex-col h-screen shadow-xl transition-all duration-300 relative`}>
            {/* Toggle Button */}
            <button
                onClick={toggleCollapse}
                className="absolute -right-3 top-9 bg-slate-800 text-slate-400 hover:text-white p-1 rounded-full shadow-lg border border-slate-700 z-50 transition-colors"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <div className={`p-6 flex items-center space-x-3 border-b border-slate-800 ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="w-10 h-10 bg-lime-400 rounded-lg flex items-center justify-center font-bold text-xl text-slate-900 shadow-lg shadow-lime-400/20 shrink-0 overflow-hidden">
                    {companyProfile?.logo ? (
                        <img src={companyProfile.logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                        "A"
                    )}
                </div>
                {!isCollapsed && (
                    <div className="animate-fadeIn overflow-hidden whitespace-nowrap">
                        <h1 className="text-lg font-bold tracking-wide text-white">ARTRON</h1>
                        <div className="flex items-center text-[10px] text-lime-400 font-medium tracking-widest uppercase truncate scrollbar-hide">
                            <span className="mr-1">FOR</span>
                            <span>{companyProfile?.brandName || 'კუნთის მასა BEEF'}</span>
                        </div>
                    </div>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-hide">
                {menuItems.map((item) => {
                    // Logic to determine visibility
                    if (isOnboarding && item.id !== 'settings') return null; // Hide everything during onboarding except Settings

                    // Module based visibility (post-onboarding)
                    if (!isOnboarding && item.id !== 'settings' && item.id !== 'dashboard') {
                        if (item.id === 'ACTIVITY_GROUP') {
                            const hasAnyActivity = selectedModules['activity_onetime'] || selectedModules['activity_individual'] || selectedModules['activity_group'] || selectedModules['activity_calendar'];
                            if (!hasAnyActivity) return null;
                        } else if (item.id === 'USER_GROUP') {
                            // Check if any user sub-module is active
                            const hasAnyUser = selectedModules['registration_new'] || selectedModules['reservation'];
                            if (!hasAnyUser) return null;
                        } else {
                            let requiredModule = '';
                            switch (item.id) {
                                // case 'USER_GROUP': handled above
                                case 'corporate': requiredModule = 'corporate'; break;
                                case 'promotions': requiredModule = 'market'; break;
                                case 'employees': requiredModule = 'hrm'; break;
                                case 'market': requiredModule = 'market'; break;
                                case 'warehouse': requiredModule = 'warehouse'; break;
                                case 'accounting': requiredModule = 'accounting'; break;
                                case 'statistics': requiredModule = 'statistics'; break;
                                case 'messages': requiredModule = 'communication'; break;
                            }
                            if (requiredModule && !selectedModules[requiredModule]) return null;
                        }
                    }

                    if (item.isGroup) {

                        // --- USER GROUP ---
                        if (item.id === 'USER_GROUP') {
                            const isUserGroupActive = pathname.startsWith('/users');
                            return (
                                <div key={item.id} className="space-y-1">
                                    <button
                                        onClick={() => handleGroupClick('user')}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group hover:-translate-y-1 ${isUserGroupActive
                                            ? 'bg-slate-800 text-white'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                            } ${isCollapsed ? 'justify-center' : ''}`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className={`${isUserGroupActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                                                {item.icon}
                                            </span>
                                            {!isCollapsed && <span className="font-medium text-sm tracking-wide animate-fadeIn">{item.label}</span>}
                                        </div>
                                        {!isCollapsed && (isUserOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                                    </button>

                                    {/* Submenu */}
                                    {isUserOpen && !isCollapsed && (
                                        <div className="ml-4 pl-4 border-l border-slate-700 space-y-1 animate-fadeIn">
                                            {selectedModules['registration_new'] && (
                                                <Link
                                                    href="/users"
                                                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm hover:-translate-y-1 ${pathname === '/users'
                                                        ? 'bg-lime-400 text-slate-900 shadow-md font-bold'
                                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                                        }`}
                                                >
                                                    <List size={16} />
                                                    <span>{t('menu.user_list')}</span>
                                                </Link>
                                            )}

                                        </div>
                                    )}
                                </div>
                            );
                        }

                        // --- ACTIVITY GROUP ---
                        if (item.id === 'ACTIVITY_GROUP') {
                            const isActiveGroup = pathname.startsWith('/passes');

                            return (
                                <div key={item.id} className="space-y-1">
                                    <button
                                        onClick={() => handleGroupClick('activity')}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group hover:-translate-y-1 ${isActiveGroup
                                            ? 'bg-slate-800 text-white'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                            } ${isCollapsed ? 'justify-center' : ''}`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className={`${isActiveGroup ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                                                {item.icon}
                                            </span>
                                            {!isCollapsed && <span className="font-medium text-sm tracking-wide animate-fadeIn">{item.label}</span>}
                                        </div>
                                        {!isCollapsed && (isActivityOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                                    </button>

                                    {/* Submenu */}
                                    {isActivityOpen && !isCollapsed && (
                                        <div className="ml-4 pl-4 border-l border-slate-700 space-y-1 animate-fadeIn">
                                            <Link
                                                href="/passes/library"
                                                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm hover:-translate-y-1 ${pathname === '/passes/library'
                                                    ? 'bg-lime-400 text-slate-900 shadow-md font-bold'
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                                    }`}
                                            >
                                                <Dumbbell size={16} />
                                                <span>{t('menu.library')}</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            );
                        }
                    }

                    // Render Normal Items
                    return (
                        <Link
                            key={item.id}
                            href={item.href || '#'}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:-translate-y-1 ${isActive(item.href || '#')
                                ? 'bg-lime-400 text-slate-900 shadow-lg shadow-lime-900/10 font-bold'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                } ${isCollapsed ? 'justify-center' : ''}`}
                        >
                            <span className={`${isActive(item.href || '#') ? 'text-slate-900' : 'text-slate-500 group-hover:text-white'}`}>
                                {item.icon}
                            </span>
                            {!isCollapsed && <span className="font-medium text-sm tracking-wide animate-fadeIn whitespace-nowrap">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className={`p-4 border-t border-slate-800 ${isCollapsed ? 'flex justify-center' : ''}`}>
                <Link href="/" className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all hover:-translate-y-1 ${isCollapsed ? 'justify-center' : ''}`}>
                    <LogOut size={20} />
                    {!isCollapsed && <span className="font-medium text-sm animate-fadeIn">{t('menu.logout')}</span>}
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
