'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Eye, Users, Crown, Calendar, CheckCircle2, X, Plus, Building2, ShieldAlert, User as UserIcon, Database, Upload, FileSpreadsheet, Mail, Phone, Edit2, LogOut, ChevronDown, ChevronUp, Printer, FileDown, MoreHorizontal, AlertTriangle } from 'lucide-react';
import { User } from '@/app/types';
import UserFilterPanel from '@/components/users/UserFilterPanel';


export default function UserListPage() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Frozen' | 'Deleted' | 'Expired'>('Active');
    const [packageFilter, setPackageFilter] = useState<string>('All');
    const [selectedModules, setSelectedModules] = useState<any>({});
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        const loadModules = () => {
            const mods = localStorage.getItem('artron_active_modules');
            if (mods) {
                setSelectedModules(JSON.parse(mods));
            }
        };
        loadModules();
        window.addEventListener('storage', loadModules);
        return () => window.removeEventListener('storage', loadModules);
    }, []);

    // Mock Available Packages
    const availablePackages = [
        'Gold Membership',
        'Silver Membership',
        'Adults Monthly',
        'Morning Pass',
        'Yoga Class'
    ];

    // Date Filtering State
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // Import Modal State
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    // Delete Confirmation State
    const [deleteModalUser, setDeleteModalUser] = useState<any | null>(null);

    const handleDeleteUser = () => {
        if (deleteModalUser) {
            // Soft Delete: Update status to 'Deleted'
            setUsers(users.map(u => u.id === deleteModalUser.id ? { ...u, status: 'Deleted' } : u));
            setDeleteModalUser(null);
        }
    };

    const handleDrag = function (e: any) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = function (e: any) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = function (e: any) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };



    // Fetch Users
    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

        // Load Ranking Configuration
        let rankingConfig = { criteria: 'TIME', ranks: [] };
        try {
            const savedConfig = localStorage.getItem('artron_ranking_config');
            if (savedConfig) {
                rankingConfig = JSON.parse(savedConfig);
            }
        } catch (e) {
            console.error("Failed to load ranking config", e);
        }

        const rankingCriteria = rankingConfig?.criteria || 'TIME';
        const ranksList = (rankingConfig.ranks && rankingConfig.ranks.length > 0) ? rankingConfig.ranks : [
            { id: '1', name: 'BRONZE', min: 0, max: 32, color: '#f97316' },
            { id: '2', name: 'SILVER', min: 32, max: 50, color: '#94a3b8' },
            { id: '3', name: 'GOLD', min: 50, max: 90, color: '#facc15' },
            { id: '4', name: 'PLATINUM', min: 90, max: 9999, color: '#22d3ee' }
        ];

        fetch(`${apiUrl}/api/members`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setUsers(data.map((m: any) => {
                        // Mock Data Generation for Visuals
                        const randomAge = Math.floor(Math.random() * (50 - 18) + 18);
                        const registrationTypes = ['INDIVIDUAL', 'FAMILY', 'COUPLE', 'FRIENDS'];
                        const randomRegistrationType = registrationTypes[Math.floor(Math.random() * registrationTypes.length)];
                        const dobYear = new Date().getFullYear() - randomAge;
                        const dob = `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/${dobYear}`;

                        // Generate Mock Stats for Ranking Calculation
                        const mockStats = {
                            TIME: Math.floor(Math.random() * 200), // Hours
                            VISITS: Math.floor(Math.random() * 100), // Visits
                            SPEND: Math.floor(Math.random() * 5000) // Currency
                        };

                        const score = mockStats[rankingCriteria as 'TIME' | 'VISITS' | 'SPEND'] || 0;

                        // Calculate Rank based on Config
                        let userRank = { name: 'UNRANKED', level: 0, score: 0, max: 100, color: '#cbd5e1', criteria: rankingCriteria };

                        const matchingRankIndex = ranksList.findIndex((r: any) => score >= r.min && score < r.max);

                        if (matchingRankIndex !== -1) {
                            const rank = ranksList[matchingRankIndex];
                            userRank = {
                                name: rank.name,
                                level: matchingRankIndex + 1,
                                score: score,
                                max: rank.max,
                                color: rank.color || '#cbd5e1',
                                criteria: rankingCriteria
                            };
                        } else {
                            // Check if above highest rank
                            const lastRank = ranksList[ranksList.length - 1];
                            if (lastRank && score >= lastRank.max) {
                                userRank = {
                                    name: lastRank.name,
                                    level: ranksList.length,
                                    score: score,
                                    max: Math.floor(score * 1.2), // Dynamic max for top tier
                                    color: lastRank.color || '#cbd5e1',
                                    criteria: rankingCriteria
                                };
                            }
                        }

                        const billingStatuses = [
                            { amount: 81.00, date: '01/04/2021', status: 'paid', overdueDays: 0, nextPaymentDate: '01/05/2021' },
                            { amount: 130.00, date: '02/04/2021', status: 'overdue', overdueDays: Math.floor(Math.random() * 15) + 1, nextPaymentDate: '' },
                            { amount: 25.00, date: '01/04/2021', status: 'paid', overdueDays: 0, nextPaymentDate: '01/05/2021' },
                        ];
                        const randomBilling = billingStatuses[Math.floor(Math.random() * billingStatuses.length)];

                        return {
                            id: m.id,
                            name: m.name || `${m.firstName || ''} ${m.lastName || ''}`.trim(),
                            phone: m.phone || '(232) 239-4958',
                            status: m.status || 'Active',
                            email: m.email || 'user@example.com',
                            personalId: m.personalId || '',
                            citizenship: m.citizenship || 'GE',
                            joinedDate: m.joinedDate ? new Date(m.joinedDate).toLocaleDateString() : 'Apr 11, 2021',
                            joinedDateRaw: m.joinedDate ? new Date(m.joinedDate) : new Date(),
                            isCorporate: m.isCorporate || Math.random() > 0.7, // Randomize for demo
                            hasMissingFields: true, // Force true for demo to show the icon
                            companyName: m.companyName || '',
                            activePackageName: m.activePackageName || 'Adults Monthly',
                            cardNumber: m.cardNumber || `100${Math.floor(Math.random() * 9000) + 1000}`, // Mock card number

                            // Visual Mock Data
                            registrationType: m.registrationType || randomRegistrationType,
                            age: randomAge,
                            dob: dob,
                            rank: userRank,
                            billing: randomBilling,
                            lastVisit: 'Apr 11, 2021',
                            expiryText: 'Expires in 8 months',
                            photo: m.photo,
                            visits: mockStats.VISITS
                        };
                    }));
                }
            })
            .catch(err => console.error("Failed to fetch members:", err));
    }, []);


    // Sorting State
    const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Combined Filtering & Sorting Logic
    const filteredUsers = useMemo(() => {
        let result = users.filter((user: any) => {
            // 1. Search Filter
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                user.name.toLowerCase().includes(term) ||
                (user.email && user.email.toLowerCase().includes(term)) ||
                (user.phone && user.phone.includes(term)) ||
                (user.personalId && user.personalId.includes(term)) ||
                (user.cardNumber && user.cardNumber.includes(term)) ||
                String(user.id).toLowerCase().includes(term);

            // 2. Status Filter
            const matchesStatus =
                statusFilter === 'All' ||
                (statusFilter === 'Active' && user.status === 'Active') ||
                (statusFilter === 'Frozen' && user.status === 'Frozen') ||
                (statusFilter === 'Deleted' && user.status === 'Deleted') ||
                (statusFilter === 'Expired' && user.status === 'Inactive');

            // 3. Date Filter
            let matchesDate = true;
            if (dateFrom || dateTo) {
                if (!user.joinedDateRaw) {
                    matchesDate = false;
                } else {
                    const userDate = new Date(user.joinedDateRaw);
                    userDate.setHours(0, 0, 0, 0);

                    if (dateFrom) {
                        const from = new Date(dateFrom);
                        from.setHours(0, 0, 0, 0);
                        if (userDate < from) matchesDate = false;
                    }
                    if (dateTo) {
                        const to = new Date(dateTo);
                        to.setHours(23, 59, 59, 999);
                        if (userDate > to) matchesDate = false;
                    }
                }
            }

            // 4. Package Filter
            const matchesPackage =
                packageFilter === 'All' ||
                (user.activePackageName === packageFilter);

            return matchesSearch && matchesStatus && matchesDate && matchesPackage;
        });

        // 5. Sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue = a[sortConfig.key!];
                let bValue = b[sortConfig.key!];

                // Handle nested properties & Special Cases
                if (sortConfig.key === 'rank.score') {
                    aValue = a.rank?.score || 0;
                    bValue = b.rank?.score || 0;
                } else if (sortConfig.key === 'billing.amount') {
                    aValue = a.billing?.amount || 0;
                    bValue = b.billing?.amount || 0;
                } else if (sortConfig.key === 'lastVisit') {
                    // Parse date string "Apr 11, 2021" to timestamp
                    aValue = a.lastVisit ? new Date(a.lastVisit).getTime() : 0;
                    bValue = b.lastVisit ? new Date(b.lastVisit).getTime() : 0;
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return result;
    }, [users, searchTerm, statusFilter, dateFrom, dateTo, packageFilter, sortConfig]);

    // Calculate Counts for Tabs
    const statusCounts = useMemo(() => {
        return {
            active: users.filter(u => u.status === 'Active').length,
            frozen: users.filter(u => u.status === 'Frozen').length,
            deleted: users.filter(u => u.status === 'Deleted').length,
            visitors: users.filter(u => u.activePackageName === 'One Day Pass').length // Assuming logic for visitors
        };
    }, [users]);

    // Unique Countries for Filter
    const uniqueCountries = useMemo(() => {
        const countries = new Set(users.map(u => u.citizenship).filter(Boolean));
        return Array.from(countries) as string[];
    }, [users]);

    const resetDates = () => {
        setDateFrom('');
        setDateTo('');
    };

    return (
        <div className="flex flex-col space-y-6 animate-fadeIn text-slate-300 h-full">
            {/* Header / Toolbar */}
            <div className="bg-[#161b22] p-4 rounded-2xl border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-xl">
                {/* Left: Search & Filter */}
                <div className="flex items-center space-x-3 w-full lg:w-auto flex-1">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ძებნა: სახელი, პირადობა, ბარათი..."
                            className="w-full pl-12 pr-4 py-2.5 bg-[#0d1117] border border-slate-700 rounded-xl focus:border-lime-500 outline-none transition-all text-sm text-white placeholder:text-slate-600 shadow-inner"
                        />
                    </div>
                    <div className="relative z-50">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all border font-bold text-xs uppercase tracking-wider ${isFilterOpen ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'}`}
                        >
                            <Filter size={16} />
                            <span>ფილტრი</span>
                        </button>
                        <UserFilterPanel
                            isOpen={isFilterOpen}
                            onClose={() => setIsFilterOpen(false)}
                            onApply={(filters) => {
                                console.log("Applying filters:", filters);
                                setIsFilterOpen(false);
                            }}
                            onReset={() => {
                                console.log("Resetting filters");
                                // Add logic to reset filters if needed
                            }}
                            availableCountries={uniqueCountries}
                        />
                    </div>
                </div>

                {/* Center: Actions */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => router.push('/users/add')}
                        className="px-6 py-2.5 bg-lime-500 hover:bg-lime-400 text-slate-900 font-bold rounded-xl shadow-lg shadow-lime-500/20 transition-all active:scale-95 flex items-center text-sm uppercase tracking-wide">
                        <Plus size={18} className="mr-2" />
                        ახალი მომხმარებელი
                    </button>
                    <div className="flex items-center space-x-2 px-1 bg-slate-800 rounded-xl p-1 border border-slate-700">
                        <button
                            onClick={() => setIsImportModalOpen(true)}
                            className="px-4 py-1.5 text-slate-400 hover:text-white rounded-lg text-xs font-bold transition-colors">ძველი ბაზის გამოყენება</button>
                    </div>
                </div>

                {/* Right: Export/Print */}
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-xs font-bold px-3 py-2 rounded-lg hover:bg-slate-800">
                        <Printer size={16} />
                        <span>Print</span>
                    </button>
                    <button className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-xs font-bold px-3 py-2 rounded-lg hover:bg-slate-800">
                        <FileDown size={16} />
                        <span>Export</span>
                        <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            {/* Stats Bar (Interactive) */}
            <div className="flex items-center space-x-8 px-2 overflow-x-auto scrollbar-hide">
                <button
                    onClick={() => setStatusFilter('Active')}
                    className={`pb-3 border-b-2 font-bold text-sm whitespace-nowrap flex items-center space-x-2 transition-colors ${statusFilter === 'Active' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                    <span>წევრები</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${statusFilter === 'Active' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>{statusCounts.active}</span>
                </button>
                <button
                    // Future implementation for Visitors
                    className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-300 font-bold text-sm whitespace-nowrap flex items-center space-x-2 transition-colors"
                >
                    <span>ერთჯერადი ვიზიტები</span>
                    <span className="bg-slate-800 text-slate-500 px-2 py-0.5 rounded text-xs">{statusCounts.visitors}</span>
                </button>
                <button
                    onClick={() => setStatusFilter('Frozen')}
                    className={`pb-3 border-b-2 font-bold text-sm whitespace-nowrap flex items-center space-x-2 transition-colors ${statusFilter === 'Frozen' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                    <span>დაპაუზებული</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${statusFilter === 'Frozen' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>{statusCounts.frozen}</span>
                </button>
                <button
                    onClick={() => setStatusFilter('Deleted')}
                    className={`pb-3 border-b-2 font-bold text-sm whitespace-nowrap flex items-center space-x-2 transition-colors ${statusFilter === 'Deleted' ? 'border-red-500 text-red-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                    <span>წაშლილი</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${statusFilter === 'Deleted' ? 'bg-red-500/10 text-red-500' : 'bg-slate-800 text-slate-500'}`}>{statusCounts.deleted}</span>
                </button>
            </div>

            {/* Main Table */}
            <div className="flex-1 bg-[#161b22] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto custom-scrollbar h-[calc(100vh-280px)]">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#0d1117] text-slate-500 text-[10px] font-black uppercase tracking-widest sticky top-0 z-10 shadow-md">
                            <tr>
                                <th onClick={() => handleSort('name')} className="px-6 py-4 font-bold border-b border-slate-800 w-64 cursor-pointer hover:text-slate-300 transition-colors group select-none">
                                    <div className="flex items-center space-x-2">
                                        <span>წევრი/სტატუსი</span>
                                        <div className={`transition-opacity ${sortConfig.key === 'name' ? 'opacity-100 text-blue-500' : 'opacity-0 group-hover:opacity-100'}`}>
                                            {sortConfig.key === 'name' && sortConfig.direction === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                                        </div>
                                    </div>
                                </th>
                                <th onClick={() => handleSort('phone')} className="px-6 py-4 font-bold border-b border-slate-800 w-56 cursor-pointer hover:text-slate-300 transition-colors group select-none">
                                    <div className="flex items-center space-x-2">
                                        <span>საკონტაქტო ინფორმაცია</span>
                                        <div className={`transition-opacity ${sortConfig.key === 'phone' ? 'opacity-100 text-blue-500' : 'opacity-0 group-hover:opacity-100'}`}>
                                            {sortConfig.key === 'phone' && sortConfig.direction === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                                        </div>
                                    </div>
                                </th>
                                <th onClick={() => handleSort('registrationType')} className="px-6 py-4 font-bold border-b border-slate-800 w-32 cursor-pointer hover:text-slate-300 transition-colors group select-none">
                                    <div className="flex items-center space-x-2">
                                        <span>ჯგუფი/ტიპი</span>
                                        <div className={`transition-opacity ${sortConfig.key === 'registrationType' ? 'opacity-100 text-blue-500' : 'opacity-0 group-hover:opacity-100'}`}>
                                            {sortConfig.key === 'registrationType' && sortConfig.direction === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                                        </div>
                                    </div>
                                </th>
                                <th onClick={() => handleSort('age')} className="px-6 py-4 font-bold border-b border-slate-800 w-32 cursor-pointer hover:text-slate-300 transition-colors group select-none">
                                    <div className="flex items-center space-x-2">
                                        <span>ასაკი</span>
                                        <div className={`transition-opacity ${sortConfig.key === 'age' ? 'opacity-100 text-blue-500' : 'opacity-0 group-hover:opacity-100'}`}>
                                            {sortConfig.key === 'age' && sortConfig.direction === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                                        </div>
                                    </div>
                                </th>
                                <th onClick={() => handleSort('rank.score')} className="px-6 py-4 font-bold border-b border-slate-800 w-64 cursor-pointer hover:text-slate-300 transition-colors group select-none">
                                    <div className="flex items-center space-x-2">
                                        <span>რეიტინგი/ქულა</span>
                                        <div className={`transition-opacity ${sortConfig.key === 'rank.score' ? 'opacity-100 text-blue-500' : 'opacity-0 group-hover:opacity-100'}`}>
                                            {sortConfig.key === 'rank.score' && sortConfig.direction === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                                        </div>
                                    </div>
                                </th>
                                <th onClick={() => handleSort('activePackageName')} className="px-6 py-4 font-bold border-b border-slate-800 w-56 cursor-pointer hover:text-slate-300 transition-colors group select-none">
                                    <div className="flex items-center space-x-2">
                                        <span>აქტივობა</span>
                                        <div className={`transition-opacity ${sortConfig.key === 'activePackageName' ? 'opacity-100 text-blue-500' : 'opacity-0 group-hover:opacity-100'}`}>
                                            {sortConfig.key === 'activePackageName' && sortConfig.direction === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                                        </div>
                                    </div>
                                </th>
                                <th onClick={() => handleSort('lastVisit')} className="px-6 py-4 font-bold border-b border-slate-800 w-40 cursor-pointer hover:text-slate-300 transition-colors group select-none">
                                    <div className="flex items-center space-x-2">
                                        <span>უკანასკნელი ვიზიტი</span>
                                        <div className={`transition-opacity ${sortConfig.key === 'lastVisit' ? 'opacity-100 text-blue-500' : 'opacity-0 group-hover:opacity-100'}`}>
                                            {sortConfig.key === 'lastVisit' && sortConfig.direction === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                                        </div>
                                    </div>
                                </th>
                                <th onClick={() => handleSort('billing.amount')} className="px-6 py-4 font-bold border-b border-slate-800 w-48 cursor-pointer hover:text-slate-300 transition-colors group select-none">
                                    <div className="flex items-center space-x-2">
                                        <span>გადახდის სტატუსი</span>
                                        <div className={`transition-opacity ${sortConfig.key === 'billing.amount' ? 'opacity-100 text-blue-500' : 'opacity-0 group-hover:opacity-100'}`}>
                                            {sortConfig.key === 'billing.amount' && sortConfig.direction === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                                        </div>
                                    </div>
                                </th>
                                <th className="px-6 py-4 font-bold border-b border-slate-800 w-24"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-[#1f2937]/40 transition-colors group">
                                    {/* Member Column */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="relative shrink-0">
                                                    {user.photo ? (
                                                        <img src={user.photo} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-700" />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-400 font-bold text-lg shadow-inner">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#161b22] ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                                    {user.hasMissingFields && (
                                                        <div className="absolute -top-1 -right-1 z-20 group/tooltip">
                                                            <div className="bg-[#161b22] rounded-full p-[1px] cursor-help">
                                                                <AlertTriangle size={12} className="text-red-500 fill-red-500/20" />
                                                            </div>
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#161b22] border border-slate-700 text-slate-300 text-[10px] font-medium text-center p-2 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 delay-0 group-hover/tooltip:delay-1000 pointer-events-none z-50">
                                                                შესავსები გაქვთ მომხმარებლის პირადი ინფორმაციის ველი
                                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#161b22] border-r border-b border-slate-700 rotate-45"></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-500 opacity-70 whitespace-nowrap">{user.joinedDate}</span>
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm hover:text-blue-400 cursor-pointer transition-colors" onClick={() => router.push(`/users/${user.id}`)}>{user.name}</div>
                                                <div className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md w-fit mt-1 ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {user.status}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Contact Column */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center space-x-2 text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors group/mail">
                                                <span className="truncate max-w-[140px]">Email</span>
                                                <Mail size={12} className="group-hover/mail:scale-110 transition-transform" />
                                            </div>
                                            <div className="flex items-center space-x-2 text-xs text-slate-400">
                                                <span>{user.phone}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Group Column */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex flex-col gap-1.5 items-start">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wide ${user.registrationType === 'INDIVIDUAL' ? 'bg-slate-800 text-slate-400 border-slate-700' :
                                                user.registrationType === 'FAMILY' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                    user.registrationType === 'COUPLE' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
                                                        'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                                }`}>
                                                {user.registrationType === 'INDIVIDUAL' && 'ინდივიდუალური'}
                                                {user.registrationType === 'FAMILY' && 'ოჯახი'}
                                                {user.registrationType === 'COUPLE' && 'წყვილი'}
                                                {user.registrationType === 'FRIENDS' && 'მეგობარი'}
                                            </span>
                                            {user.isCorporate && (
                                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md border border-blue-500/20 bg-blue-500/10 text-blue-400 uppercase tracking-wide flex items-center gap-1">
                                                    <Building2 size={10} />
                                                    <span>კორპორატიული</span>
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Age Column */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-sm">{user.age || 25}</span>
                                            <span className="text-slate-500 text-[10px]">{user.dob || '10/04/1996'}</span>
                                        </div>
                                    </td>

                                    {/* Rank / Level Column */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-black w-10 h-10 rounded-xl border border-slate-700 flex flex-col items-center justify-center space-y-0.5 shrink-0 overflow-hidden shadow-lg relative">
                                                {/* Dynamic Rank Icon based on Color */}
                                                <div
                                                    className="w-full h-full relative flex items-center justify-center opacity-80"
                                                    style={{ backgroundColor: user.rank?.color || '#333' }}
                                                >
                                                    <span className="font-bold text-white text-xs drop-shadow-md">
                                                        {user.rank?.level || 0}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[10px] text-slate-500 uppercase font-bold text-right mb-1">{user.rank?.name || 'UNRANKED'}</div>
                                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                                                        style={{
                                                            width: `${Math.min(((user.rank?.score || 0) / (user.rank?.max || 100)) * 100, 100)}%`,
                                                            backgroundColor: user.rank?.color || '#3b82f6'
                                                        }}></div>
                                                </div>
                                                <div className="mt-1 flex flex-col items-end">
                                                    <div className="text-[11px] font-bold text-slate-300 leading-none">
                                                        <span>{user.rank?.score || 0}</span>
                                                        <span className="opacity-50 text-[9px] ml-1 uppercase">
                                                            {user.rank?.criteria === 'TIME' ? 'სთ' : user.rank?.criteria === 'VISITS' ? 'ვიზიტი' : '₾'}
                                                        </span>
                                                    </div>
                                                    <div className="text-[9px] text-slate-500 font-medium mt-0.5">
                                                        {user.visits || 0} ვიზიტი
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Membership Column */}
                                    <td className="px-6 py-4 align-top">
                                        <div>
                                            <div className="text-slate-300 font-bold text-xs mb-0.5">{user.activePackageName}</div>
                                            <div className="text-slate-500 text-[10px]">{user.expiryText || 'Expires in 1 year'}</div>
                                        </div>
                                    </td>

                                    {/* Last Visit Column */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="text-slate-400 text-xs font-medium">{user.lastVisit || 'Apr 11, 2021'}</div>
                                    </td>

                                    {/* Billing Status Column */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative group/tooltip">
                                                {user.billing?.status === 'paid' ? (
                                                    // Green (Paid) Icon
                                                    <div className="cursor-help">
                                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] bg-[#161b22] border border-slate-700 text-slate-300 text-[10px] font-medium text-center p-2 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 delay-0 group-hover/tooltip:delay-1000 pointer-events-none z-50">
                                                            შემდეგი გადახდა: <span className="text-white font-bold block">{user.billing?.nextPaymentDate}</span>
                                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#161b22] border-r border-b border-slate-700 rotate-45"></div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // Red (Overdue) Icon
                                                    <div className="cursor-help">
                                                        <ShieldAlert size={16} className="text-red-500" />
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] bg-[#161b22] border border-slate-700 text-slate-300 text-[10px] font-medium text-center p-2 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 delay-0 group-hover/tooltip:delay-1000 pointer-events-none z-50">
                                                            ვადაგადაცილება: <span className="text-red-400 font-bold block">{user.billing?.overdueDays} დღე</span>
                                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#161b22] border-r border-b border-slate-700 rotate-45"></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className={`text-sm font-bold ${user.billing?.status === 'paid' ? 'text-emerald-500' : 'text-red-500'}`}>
                                                    ${user.billing?.amount?.toFixed(2) || '0.00'}
                                                </div>
                                                <div className="text-[10px] text-slate-500">{user.billing?.date || '01/04/2021'}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <div className="flex items-center space-x-2 justify-end opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setDeleteModalUser(user); }}
                                            className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-400 text-white flex items-center justify-center shadow-lg shadow-red-500/20 transition-all active:scale-95"
                                        >
                                            <LogOut size={14} className="ml-0.5" />
                                        </button>
                                    </div>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="py-20 text-center flex flex-col items-center">
                            <ShieldAlert size={48} className="text-slate-800 mb-4" />
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No members found</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 8px;
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #0d1117;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #30363d;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #58a6ff;
                }
            `}</style>

            {/* Delete Confirmation Modal */}
            {
                deleteModalUser && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4">
                        <div className="bg-white rounded-[2rem] p-6 max-w-sm w-full shadow-2xl animate-scaleIn relative overflow-hidden">

                            {/* Status Warning Banner if Active */}
                            {(deleteModalUser.status === 'Active' || deleteModalUser.activePackageName) && (
                                <div className="absolute top-0 left-0 w-full bg-amber-100 border-b border-amber-200 px-6 py-2 flex items-center justify-center">
                                    <ShieldAlert size={14} className="text-amber-600 mr-2" />
                                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">
                                        აქტიური სერვისი: {deleteModalUser.activePackageName}
                                    </span>
                                </div>
                            )}

                            <div className="mt-6 text-center">
                                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <UserIcon size={32} />
                                    <div className="absolute bg-red-500 text-white rounded-full p-1 -translate-x-3 translate-y-3 border-2 border-white">
                                        <LogOut size={12} />
                                    </div>
                                </div>

                                <h3 className="text-lg font-black text-slate-800 mb-2 leading-tight">
                                    ნამდვილად გსურთ მომხმარებლის წაშლა?
                                </h3>

                                <p className="text-xs text-slate-500 font-medium leading-relaxed px-4">
                                    თქვენ აპირებთ წაშალოთ <span className="font-bold text-slate-800">{deleteModalUser.name}</span>.
                                    {(deleteModalUser.status === 'Active' || deleteModalUser.activePackageName) ? (
                                        <span className="block mt-2 text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100">
                                            ყურადღება! მომხმარებელზე ფიქსირდება აქტიური აქტივობა.
                                        </span>
                                    ) : (
                                        <span className="block mt-1">ეს მოქმედება შეუქცევადია.</span>
                                    )}
                                </p>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setDeleteModalUser(null)}
                                    className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    გაუქმება
                                </button>
                                <button
                                    onClick={handleDeleteUser}
                                    className="flex-1 py-3 bg-red-500 text-white font-bold text-xs rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all flex items-center justify-center group"
                                >
                                    <span>კი, წაშალე</span>
                                    <LogOut size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Import Modal */}
            {
                isImportModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn p-4">
                        <div className="bg-[#161b22] border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden">

                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-700 flex justify-between items-start">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20">
                                        <Database size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-2">მონაცემების იმპორტი</h2>
                                        <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                                            იმისათვის რომ მოვახდინოთ თქვენთან რეგისტრირებული მომხმარებლების გადმოტანა ახალ სამართავ პანელში საჭიროა ატვირთულ იქნას ექსელის ფაილი.
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setIsImportModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6">
                                <div
                                    className={`h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-[#0d1117] hover:bg-[#1f2937]'
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="file-upload"
                                        accept=".xlsx, .xls"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
                                        {file ? (
                                            <>
                                                <FileSpreadsheet size={40} className="text-emerald-500 mb-4" />
                                                <p className="text-white font-bold text-sm mb-1">{file.name}</p>
                                                <p className="text-slate-500 text-xs">{(file.size / 1024).toFixed(2)} KB</p>
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={40} className="text-slate-500 mb-4" />
                                                <p className="text-slate-300 font-bold text-sm mb-1">Click to upload or drag and drop</p>
                                                <p className="text-slate-500 text-xs">Excel files (XLSX, XLS)</p>
                                            </>
                                        )}
                                    </label>
                                </div>

                                {file && (
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center"
                                            onClick={() => {
                                                // TODO: Implement actual upload logic
                                                console.log("Uploading:", file);
                                                setIsImportModalOpen(false);
                                                setFile(null);
                                            }}
                                        >
                                            <Upload size={18} className="mr-2" />
                                            ატვირთვა
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
