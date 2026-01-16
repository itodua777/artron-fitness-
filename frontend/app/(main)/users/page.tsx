
'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Eye, Users, Crown, Calendar, CheckCircle2, X, Plus, Building2, ShieldAlert, User as UserIcon } from 'lucide-react';
import { User } from '@/app/types';
import ReservationModal from '@/components/reservations/ReservationModal';
import WaitingList from '@/components/reservations/WaitingList';

export default function UserListPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Frozen' | 'Expired'>('All');
    const [packageFilter, setPackageFilter] = useState<string>('All');
    const [selectedModules, setSelectedModules] = useState<any>({});

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
        '12 Visits',
        'Morning Pass',
        'Yoga Class'
    ];

    // Date Filtering State
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // Reservation State
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
    const [reservations, setReservations] = useState([]);

    const fetchReservations = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        try {
            const res = await fetch(`${apiUrl}/api/reservations`);
            if (res.ok) {
                const data = await res.json();
                setReservations(data);
            }
        } catch (error) {
            console.error('Failed to fetch reservations', error);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleNotifyReservation = async (id: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        try {
            await fetch(`${apiUrl}/api/reservations/${id}/notify`, { method: 'PATCH' });
            fetchReservations();
        } catch (error) {
            console.error('Failed to notify', error);
        }
    };

    const handleDeleteReservation = async (id: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        try {
            await fetch(`${apiUrl}/api/reservations/${id}`, { method: 'DELETE' });
            fetchReservations();
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    // Fetch Users
    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        fetch(`${apiUrl}/api/members`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setUsers(data.map((m: any) => ({
                        id: m._id,
                        name: m.name || `${m.firstName || ''} ${m.lastName || ''}`.trim(),
                        phone: m.phone || '',
                        status: m.status || 'Active', // Defaulting to Active if missing
                        email: m.email || '',
                        personalId: m.personalId || '', // Mapped for search
                        joinedDate: m.joinedDate ? new Date(m.joinedDate).toLocaleDateString() : 'N/A',
                        joinedDateRaw: m.joinedDate ? new Date(m.joinedDate) : null, // For date comparison
                        isCorporate: m.isCorporate || false,
                        companyName: m.companyName || '',
                        activePackageName: m.activePackageName || (Math.random() > 0.5 ? 'Gold Membership' : '12 Visits') // Mock assignment
                    })));
                }
            })
            .catch(err => console.error("Failed to fetch members:", err));
    }, []);


    // Combined Filtering Logic
    const filteredUsers = useMemo(() => {
        return users.filter((user: any) => {
            // 1. Search Filter
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                user.name.toLowerCase().includes(term) ||
                (user.email && user.email.toLowerCase().includes(term)) ||
                (user.phone && user.phone.includes(term)) ||
                (user.personalId && user.personalId.includes(term)) ||
                String(user.id).toLowerCase().includes(term);

            // 2. Status Filter
            const matchesStatus =
                statusFilter === 'All' ||
                (statusFilter === 'Active' && user.status === 'Active') ||
                (statusFilter === 'Frozen' && user.status === 'Frozen') ||
                (statusFilter === 'Expired' && user.status === 'Inactive'); // Mapping Inactive to Expired

            // 3. Date Filter
            let matchesDate = true;
            if (dateFrom || dateTo) {
                if (!user.joinedDateRaw) {
                    matchesDate = false;
                } else {
                    const userDate = new Date(user.joinedDateRaw);
                    userDate.setHours(0, 0, 0, 0); // Normalize time

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
    }, [users, searchTerm, statusFilter, dateFrom, dateTo, packageFilter]);

    const resetDates = () => {
        setDateFrom('');
        setDateTo('');
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn text-slate-300">
            {/* Sidebar Filters */}
            <div className="w-full lg:w-72 space-y-8 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">მომხმარებელთა მართვა</h1>
                    <p className="text-slate-500 text-sm">მოძებნეთ, გაფილტრეთ და მართეთ ყველა მომხმარებლის პროფილი სისტემაში.</p>
                </div>

                <button
                    onClick={() => router.push('/users/add')}
                    className="w-full py-4 bg-[#10b981] hover:bg-[#059669] text-white font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                    <Plus size={20} strokeWidth={3} />
                    <span>ახალი მომხმარებელი</span>
                </button>

                {selectedModules['reservation'] && (
                    <button
                        onClick={() => setIsReservationModalOpen(true)}
                        className="w-full py-4 bg-[#1f2937] hover:bg-[#374151] text-blue-400 hover:text-blue-300 font-bold rounded-xl border border-blue-500/30 border-dashed transition-all active:scale-95 flex items-center justify-center space-x-2"
                    >
                        <Calendar size={20} strokeWidth={2.5} />
                        <span>ადგილის დაჯავშნა</span>
                    </button>
                )}

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="ძებნა სახელით, ID-ით, ტელეფონით..."
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
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${statusFilter === status
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

                    {/* Registration Date Filter */}
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
                        <div className="space-y-1">
                            <button
                                onClick={() => setPackageFilter('All')}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${packageFilter === 'All'
                                    ? 'bg-[#1f2937] text-blue-400 border border-blue-500/30'
                                    : 'text-slate-400 hover:bg-[#161b22] hover:text-slate-200'
                                    }`}
                            >
                                <span className="text-sm font-bold">ყველა პაკეტი</span>
                                {packageFilter === 'All' && <CheckCircle2 size={16} />}
                            </button>
                            {availablePackages.map((pkg) => (
                                <button
                                    key={pkg}
                                    onClick={() => setPackageFilter(pkg)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${packageFilter === pkg
                                        ? 'bg-[#1f2937] text-blue-400 border border-blue-500/30'
                                        : 'text-slate-400 hover:bg-[#161b22] hover:text-slate-200'
                                        }`}
                                >
                                    <span className="text-sm font-bold">{pkg}</span>
                                    {packageFilter === pkg && <CheckCircle2 size={16} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Waiting List Section */}
                <WaitingList
                    reservations={reservations}
                    onNotify={handleNotifyReservation}
                    onDelete={handleDeleteReservation}
                />
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
                                                    <div className="w-12 h-12 rounded-full bg-[#1f2937] border-2 border-slate-800 overflow-hidden flex items-center justify-center text-slate-500 font-bold">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#161b22] ${user.status === 'Active' ? 'bg-emerald-50' : 'bg-red-500'}`}></div>
                                                </div>
                                                <div>
                                                    <div className="font-black text-white">{user.name}</div>
                                                    <div className="text-xs text-slate-500 lowercase">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 font-mono text-xs text-slate-500">{typeof user.id === 'string' ? user.id.slice(-6) : user.id}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${user.status === 'Active'
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
                                                onClick={() => router.push(`/users/${user.id}`)}
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

            <style jsx>{`
        .color-scheme-dark {
          color-scheme: dark;
        }
      `}</style>

            <ReservationModal
                isOpen={isReservationModalOpen}
                onClose={() => setIsReservationModalOpen(false)}
                onSuccess={fetchReservations}
            />
        </div>
    );
};
