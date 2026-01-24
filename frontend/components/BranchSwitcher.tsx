'use client';
import React, { useState, useEffect, useRef } from 'react';
import { GitBranch, Building2, ChevronDown, Check, LayoutGrid } from 'lucide-react';

interface Branch {
    id: string;
    name: string;
}

interface CompanyProfile {
    name: string;
    brandName: string;
    branches?: Branch[];
}

const BranchSwitcher = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [company, setCompany] = useState<CompanyProfile | null>(null);
    const [activeBranchId, setActiveBranchId] = useState<string | null>(null); // null means Main Company
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadData = () => {
            const storedCompany = localStorage.getItem('artron_company_profile');
            if (storedCompany) {
                try {
                    setCompany(JSON.parse(storedCompany));
                } catch (e) {
                    console.error("Failed to parse company profile");
                }
            }

            const storedBranch = localStorage.getItem('artron_active_branch');
            setActiveBranchId(storedBranch || null);
        };

        loadData();
        window.addEventListener('storage', loadData);
        // Custom event for immediate updates within the same window
        window.addEventListener('branch-change', loadData);

        return () => {
            window.removeEventListener('storage', loadData);
            window.removeEventListener('branch-change', loadData);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSwitch = (branchId: string | null) => {
        if (branchId) {
            localStorage.setItem('artron_active_branch', branchId);
        } else {
            localStorage.removeItem('artron_active_branch');
        }
        setActiveBranchId(branchId);
        setIsOpen(false);

        // Dispatch events to notify other components
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('branch-change'));
    };

    // if (!company || !company.branches || company.branches.length === 0) {
    //     return null; // Don't show if no branches
    // }

    const displayCompany = company || { name: 'ARTRON', brandName: 'ARTRON', branches: [] };
    const branches = displayCompany.branches || [];

    const activeBranchName = activeBranchId
        ? branches.find(b => b.id === activeBranchId)?.name
        : (displayCompany.brandName || displayCompany.name);

    return (
        <div className="relative z-40" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
                <div className={`p-1.5 rounded-md ${activeBranchId ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                    {activeBranchId ? <GitBranch size={16} /> : <Building2 size={16} />}
                </div>
                <div className="text-left hidden md:block">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">
                        {activeBranchId ? 'ფილიალი' : 'მთავარი ოფისი'}
                    </p>
                    <p className="text-xs font-bold text-slate-800 leading-none truncate max-w-[120px]">
                        {activeBranchName}
                    </p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-slate-200 animate-fadeIn origin-top-right overflow-hidden">
                    <div className="p-3 bg-slate-50 border-b border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            აირჩიეთ სამართავი პანელი
                        </p>
                    </div>

                    <div className="p-2 space-y-1">
                        {/* Main Company Option */}
                        <button
                            onClick={() => handleSwitch(null)}
                            className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left ${activeBranchId === null ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${activeBranchId === null ? 'bg-white text-slate-800 shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                                    <Building2 size={16} />
                                </div>
                                <div>
                                    <p className={`text-xs font-bold ${activeBranchId === null ? 'text-slate-900' : 'text-slate-600'}`}>
                                        მთავარი ოფისი
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                        {displayCompany.brandName || displayCompany.name}
                                    </p>
                                </div>
                            </div>
                            {activeBranchId === null && <Check size={16} className="text-slate-600" />}
                        </button>

                        <div className="h-px bg-slate-100 my-1"></div>

                        {/* Branches */}
                        {branches.map(branch => {
                            const isActive = activeBranchId === branch.id;
                            return (
                                <button
                                    key={branch.id}
                                    onClick={() => handleSwitch(branch.id)}
                                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left ${isActive ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${isActive ? 'bg-white text-indigo-600 shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                                            <GitBranch size={16} />
                                        </div>
                                        <div>
                                            <p className={`text-xs font-bold ${isActive ? 'text-indigo-900' : 'text-slate-600'}`}>
                                                {branch.name}
                                            </p>
                                            <p className={`text-[10px] ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}>
                                                ფილიალი
                                            </p>
                                        </div>
                                    </div>
                                    {isActive && <Check size={16} className="text-indigo-600" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BranchSwitcher;
