
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users,
    CreditCard,
    Activity,
    TrendingUp,
    Search,
    ChevronRight,
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
    CalendarClock,
    MessageSquare,
    Send,
    AlertCircle,
    CheckSquare,
    Square,
    Check,
    Calendar,
    User as UserIcon,
    ArrowLeft,
    Filter,
    LayoutList,
    Bell
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../../components/StatCard';
import LiveLoadWidget from '../../../components/LiveLoadWidget';
import { User, VisitLog } from '../../types';

// Mock Data for Charts
const data = [
    { name: 'იან', active: 400, new: 240 },
    { name: 'თებ', active: 300, new: 139 },
    { name: 'მარ', active: 200, nnew: 980 },
    { name: 'აპრ', active: 278, new: 390 },
    { name: 'მაი', active: 189, nnew: 480 },
    { name: 'ივნ', active: 239, new: 380 },
    { name: 'ივლ', active: 349, new: 430 },
];

// Mock Data for Schedule Generator
const generateSchedule = (frame: 'TODAY' | 'TOMORROW' | 'WEEK' | 'MONTH') => {
    const base = [
        { id: 1, activity: 'CrossFit', time: '10:00 - 11:30', trainer: 'გიორგი მაისურაძე', room: 'Arena A', capacity: '12/15', status: 'In Progress' },
        { id: 2, activity: 'Yoga Flow', time: '12:00 - 13:00', trainer: 'ნინო შენგელია', room: 'Zen Studio', capacity: '8/20', status: 'Upcoming' },
        { id: 3, activity: 'Boxing Tech', time: '16:00 - 17:30', trainer: 'ლევან აბაშიძე', room: 'Combat Zone', capacity: '5/10', status: 'Upcoming' },
        { id: 4, activity: 'Zumba Party', time: '18:30 - 19:30', trainer: 'ელენე დოლიძე', room: 'Dance Floor', capacity: '18/25', status: 'Upcoming' },
        { id: 5, activity: 'Core Blaster', time: '20:00 - 21:00', trainer: 'სანდრო კუპატაძე', room: 'Arena B', capacity: '0/15', status: 'Upcoming' },
    ];

    if (frame === 'TODAY') return base;
    if (frame === 'TOMORROW') return base.map(item => ({ ...item, id: item.id + 10, status: 'Scheduled' }));
    if (frame === 'WEEK') return [...base, ...base.map(i => ({ ...i, id: i.id + 20, activity: i.activity + ' (Adv)' }))].slice(0, 8);
    return [...base, ...base, ...base].map((i, idx) => ({ ...i, id: idx + 100 })).slice(0, 12);
};

// Mock Data for Live Visits
const recentVisits: VisitLog[] = [
    { id: 1, userId: 1001, userName: 'გიორგი ბერიძე', time: '10:45', type: 'ENTRY', status: 'ALLOWED' },
    { id: 2, userId: 1005, userName: 'მარიამი ნიჟარაძე', time: '10:42', type: 'EXIT', status: 'ALLOWED' },
    { id: 3, userId: 1012, userName: 'სანდრო კუპატაძე', time: '10:38', type: 'ENTRY', status: 'ALLOWED' },
    { id: 4, userId: 1002, userName: 'ნინო კვარაცხელია', time: '10:35', type: 'ENTRY', status: 'DENIED' },
    { id: 5, userId: 1008, userName: 'ლუკა მაისურაძე', time: '10:30', type: 'EXIT', status: 'ALLOWED' },
    { id: 6, userId: 1022, userName: 'ელენე დოლიძე', time: '10:15', type: 'ENTRY', status: 'ALLOWED' },
];

const expiringData = {
    TODAY: [
        { id: 101, name: 'დავით გიორგაძე', plan: 'Gold Package', phone: '555-12-12-12', photo: null },
        { id: 102, name: 'ანა მამულაშვილი', plan: 'დილის აბონემენტი', phone: '599-00-11-22', photo: null },
        { id: 103, name: 'გიგა კობახიძე', plan: 'სტანდარტული', phone: '577-33-44-55', photo: null },
    ],
    TOMORROW: [
        { id: 201, name: 'სოფო ჭანტურია', plan: 'იოგა ჯგუფი', phone: '593-11-22-33', photo: null },
        { id: 202, name: 'ლევან დოლიძე', plan: 'Gold Package', phone: '551-99-88-77', photo: null },
    ],
    WEEK: [
        { id: 301, name: 'თამარ ბერიძე', plan: 'აუზი + ფიტნესი', phone: '568-44-55-66', photo: null },
        { id: 302, name: 'ნიკა ქავთარაძე', plan: 'სტანდარტული', phone: '598-12-12-12', photo: null },
        { id: 303, name: 'ელენე აბაშიძე', plan: 'დილის აბონემენტი', phone: '577-22-33-44', photo: null },
        { id: 304, name: 'გიორგი მაისურაძე', plan: 'Gold Package', phone: '555-00-99-88', photo: null },
    ]
};

export default function DashboardPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [expiryTab, setExpiryTab] = useState<'TODAY' | 'TOMORROW' | 'WEEK'>('TODAY');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Schedule View States
    const [isFullScheduleOpen, setIsFullScheduleOpen] = useState(false);
    const [scheduleTimeFrame, setScheduleTimeFrame] = useState<'TODAY' | 'TOMORROW' | 'WEEK' | 'MONTH'>('TODAY');

    const [activeModules, setActiveModules] = useState<any>({});
    const [onboardingStep, setOnboardingStep] = useState(0);

    useEffect(() => {
        const loadState = () => {
            const mods = localStorage.getItem('artron_active_modules');
            const step = localStorage.getItem('artron_setup_flow_step');
            if (mods) setActiveModules(JSON.parse(mods) || {});
            if (step) setOnboardingStep(parseInt(step));
        };
        loadState();
        window.addEventListener('storage', loadState);
        return () => window.removeEventListener('storage', loadState);
    }, []);

    const showStats = activeModules['statistics'];
    const showSchedule = activeModules['library']; // Schedule depends on activity definitions
    const showUsers = activeModules['registration']; // Visits, Expiry, User Table depend on users

    const isSetupComplete = onboardingStep >= 5; // Assuming 5 is complete
    const hasAnyModule = Object.values(activeModules).some(v => v);

    useEffect(() => {
        // Fetch users
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        fetch(`${apiUrl}/api/members`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Map backend Member to User type if needed, or use as is if types match
                    // Backend Member: { _id, firstName, lastName, phone, status, ... }
                    // User Type: { id, name, phone, status, ... }
                    // We need to map it.
                    const mappedUsers: User[] = data.map((m: any) => ({
                        id: m._id, // Or hash it to number if id is string. Previous app used numbers. BE uses ObjectId.
                        // This might break if logic expects number. Let's assume for now BE might return numeric id or string id.
                        // If BE uses MongoDB, _id is string.
                        // Interface says `id: number`. I should update types to `id: string | number`.
                        // For now, let's keep it loose or mock.
                        // Wait, original app had mock users or small list.
                        // Let's allow `id: any` in types for safety or update types.
                        // I will update types to string | number in step 2.

                        name: `${m.firstName} ${m.lastName}`,
                        phone: m.phone || '',
                        status: m.status || 'Inactive',
                        activePackageName: null // Needs population
                    }));
                    setUsers(mappedUsers);
                }
            })
            .catch(err => console.error("Failed to fetch members:", err));
    }, []);

    useEffect(() => {
        setSelectedIds([]);
    }, [expiryTab]);

    const handleAction = (action: string, userName: string) => {
        if (action === 'კომუნიკაცია') {
            router.push('/messages'); // Or navigate with query
        } else {
            alert(`${action} გაეგზავნა მომხმარებელს: ${userName}`);
        }
    };

    const handleSelectAll = () => {
        const currentList = expiringData[expiryTab];
        if (selectedIds.length === currentList.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(currentList.map(u => u.id));
        }
    };

    const toggleSelection = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkSend = () => {
        if (selectedIds.length === 0) return;
        alert(`შეტყობინება (პაკეტის ვადის ამოწურვა) წარმატებით გაეგზავნა ${selectedIds.length} მომხმარებელს!`);
        setSelectedIds([]);
    };

    const currentSchedule = generateSchedule(scheduleTimeFrame);

    if (!hasAnyModule || !isSetupComplete) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fadeIn">
                <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                    <LayoutList size={48} className="text-slate-300" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-800 mb-2">სისტემა მზადაა გასამართად</h2>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">თქვენი სამუშაო სივრცე ამჟამად ცარიელია. სისტემის ასამუშავებლად, გთხოვთ გადახვიდეთ პარამეტრებში და გაააქტიუროთ თქვენთვის სასურველი მოდულები.</p>
                    <button onClick={() => router.push('/settings')} className="px-8 py-4 bg-lime-400 hover:bg-lime-500 text-slate-900 font-bold rounded-xl shadow-lg shadow-lime-400/20 transition-all hover:-translate-y-1">
                        სისტემის გამართვა
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Dashboard Header Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stat Cards Grid */}
                {showStats && (
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <StatCard
                            title="ჯამური მომხმარებლები"
                            value={users.length.toString()}
                            trend="12%"
                            trendUp={true}
                            icon={<Users size={24} className="text-lime-600" />}
                            color="bg-lime-500"
                        />
                        <StatCard
                            title="აქტიური საშვები"
                            value={users.filter(u => u.status === 'Active').length.toString()}
                            trend="5.4%"
                            trendUp={true}
                            icon={<CreditCard size={24} className="text-emerald-600" />}
                            color="bg-emerald-500"
                        />
                        <StatCard
                            title="დღიური შემოსავალი"
                            value="₾ 3,450"
                            trend="2.1%"
                            trendUp={false}
                            icon={<Activity size={24} className="text-amber-600" />}
                            color="bg-amber-500"
                        />
                        <StatCard
                            title="ახალი რეგისტრაციები"
                            value="45"
                            trend="18%"
                            trendUp={true}
                            icon={<TrendingUp size={24} className="text-blue-600" />}
                            color="bg-blue-500"
                        />
                    </div>
                )}

                {/* Live Load Widget */}
                {showUsers && (
                    <div className="lg:col-span-1">
                        <LiveLoadWidget />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* SCHEDULE BOARD WIDGET */}
                {showSchedule && (
                    <div className={`lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col transition-all duration-300 ${isFullScheduleOpen ? 'ring-2 ring-lime-400' : ''}`}>
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-lime-400 rounded-lg text-slate-900 shadow-sm">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{isFullScheduleOpen ? 'სრული განრიგი' : 'დღევანდელი განრიგი'}</h3>
                                    <p className="text-slate-500 text-xs font-medium">ჯგუფური აქტივობები და დარბაზები</p>
                                </div>
                            </div>

                            {isFullScheduleOpen ? (
                                <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                                    {(['TODAY', 'TOMORROW', 'WEEK', 'MONTH'] as const).map((frame) => (
                                        <button
                                            key={frame}
                                            onClick={() => setScheduleTimeFrame(frame)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${scheduleTimeFrame === frame ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                                }`}
                                        >
                                            {frame === 'TODAY' ? 'დღეს' : frame === 'TOMORROW' ? 'ხვალ' : frame === 'WEEK' ? '1 კვირა' : '1 თვე'}
                                        </button>
                                    ))}
                                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                                    <button
                                        onClick={() => { setIsFullScheduleOpen(false); setScheduleTimeFrame('TODAY'); }}
                                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <ArrowLeft size={18} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsFullScheduleOpen(true)}
                                    className="text-xs font-bold text-lime-600 hover:text-white hover:bg-lime-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-all shadow-sm active:scale-95"
                                >
                                    სრული კალენდარი
                                </button>
                            )}
                        </div>

                        <div className={`p-0 overflow-x-auto min-h-[400px] animate-fadeIn`}>
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-white border-b border-slate-50 text-slate-400 text-[10px] uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-4">დრო / აქტივობა</th>
                                        <th className="px-6 py-4">ტრენერი</th>
                                        <th className="px-6 py-4">ლოკაცია</th>
                                        <th className="px-6 py-4">ადგილები</th>
                                        <th className="px-6 py-4">სტატუსი</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {currentSchedule.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-1 rounded">
                                                        {item.time.split(' ')[0]}
                                                    </div>
                                                    <div className="font-bold text-slate-800 group-hover:text-lime-600 transition-colors">{item.activity}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center text-xs text-slate-500">
                                                    <UserIcon size={14} className="mr-1.5 opacity-50" />
                                                    {item.trainer}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium text-slate-500">{item.room}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs font-bold text-slate-700">{item.capacity}</span>
                                                    <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-lime-400 rounded-full"
                                                            style={{ width: `${(parseInt(item.capacity.split('/')[0]) / parseInt(item.capacity.split('/')[1])) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${item.status === 'In Progress' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                                                    item.status === 'Upcoming' ? 'bg-lime-100 text-lime-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {item.status === 'In Progress' ? 'მიმდინარე' :
                                                        item.status === 'Upcoming' ? 'მალე' :
                                                            item.status === 'Scheduled' ? 'დაგეგმილი' : 'დასრულებული'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {currentSchedule.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <LayoutList size={48} className="mb-4 opacity-20" />
                                    <p className="font-medium text-sm">ამ პერიოდში აქტივობები არ არის დაგეგმილი</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Live Visits Log */}
                {showUsers && (
                    <div className="bg-white p-0 rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                        {/* ... (visits log content) ... */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-emerald-500 rounded-lg text-white shadow-sm">
                                    <Activity size={20} />
                                </div>
                                <h3 className="font-bold text-slate-800">დღევანდელი ვიზიტები</h3>
                            </div>
                            <span className="text-[10px] font-black bg-lime-100 text-lime-700 px-2 py-1 rounded-md animate-pulse">LIVE</span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-0 max-h-[400px] custom-scrollbar">
                            {recentVisits.map((visit) => (
                                <div key={visit.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${visit.status === 'DENIED' ? 'bg-red-100 text-red-600' :
                                            visit.type === 'ENTRY' ? 'bg-lime-100 text-lime-700' : 'bg-amber-100 text-amber-600'
                                            }`}>
                                            {visit.status === 'DENIED' ? (
                                                <span className="font-bold text-lg">!</span>
                                            ) : visit.type === 'ENTRY' ? (
                                                <ArrowUpRight size={20} />
                                            ) : (
                                                <ArrowDownLeft size={20} />
                                            )}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold ${visit.status === 'DENIED' ? 'text-red-500 line-through' : 'text-slate-800'}`}>
                                                {visit.userName}
                                            </p>
                                            <p className="text-xs text-slate-400">ID: {visit.userId}</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="flex items-center justify-end text-xs font-bold text-slate-600 mb-1">
                                            <Clock size={12} className="mr-1" />
                                            {visit.time}
                                        </div>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${visit.type === 'ENTRY' ? 'bg-slate-100 text-slate-500' :
                                            visit.type === 'EXIT' ? 'bg-slate-100 text-slate-400' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            {visit.type === 'ENTRY' ? 'შემოსვლა' : 'გასვლა'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full py-3 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 border-t border-slate-100 transition-colors">
                            იხილეთ სრული ისტორია
                        </button>
                    </div>
                )}
            </div>

            {/* Expiry Monitor Widget */}
            {/* ... (Kept similar to original but using router for communication) ... */}
            {/* Expiry Monitor Widget */}
            {/* ... (Kept similar to original but using router for communication) ... */}
            {showUsers && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center">
                                <CalendarClock size={20} className="mr-2 text-red-500" />
                                ვადის ამოწურვის მონიტორინგი
                            </h3>
                            <p className="text-slate-500 text-sm">მომხმარებლები, რომელთა პაკეტის ვადა იწურება</p>
                        </div>

                        <div className="flex space-x-2 bg-slate-50 p-1 rounded-xl">
                            <button onClick={() => setExpiryTab('TODAY')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center space-x-2 ${expiryTab === 'TODAY' ? 'bg-white text-red-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                                <AlertCircle size={16} />
                                <span>დღეს ({expiringData.TODAY.length})</span>
                            </button>
                            <button onClick={() => setExpiryTab('TOMORROW')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center space-x-2 ${expiryTab === 'TOMORROW' ? 'bg-white text-orange-500 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                                <Clock size={16} />
                                <span>ხვალ ({expiringData.TOMORROW.length})</span>
                            </button>
                            <button onClick={() => setExpiryTab('WEEK')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center space-x-2 ${expiryTab === 'WEEK' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                                <CalendarClock size={16} />
                                <span>1 კვირაში ({expiringData.WEEK.length})</span>
                            </button>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50/30">
                        {expiringData[expiryTab].length > 0 && (
                            <div className="flex justify-between items-center mb-4 px-1">
                                <button onClick={handleSelectAll} className="flex items-center space-x-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
                                    {selectedIds.length === expiringData[expiryTab].length && expiringData[expiryTab].length > 0 ? <CheckSquare size={20} className="text-lime-600" /> : <Square size={20} />}
                                    <span>ყველას მონიშვნა</span>
                                </button>
                                {selectedIds.length > 0 && (
                                    <button onClick={handleBulkSend} className="flex items-center space-x-2 px-4 py-2 bg-lime-400 hover:bg-lime-500 text-slate-900 font-bold rounded-lg shadow-sm transition-all animate-fadeIn">
                                        <Send size={16} />
                                        <span>ჯგუფური გაგზავნა ({selectedIds.length})</span>
                                    </button>
                                )}
                            </div>
                        )}

                        {expiringData[expiryTab].length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {expiringData[expiryTab].map((user) => {
                                    const isSelected = selectedIds.includes(user.id);
                                    return (
                                        <div key={user.id} className={`relative bg-white p-4 rounded-xl border shadow-sm transition-all group ${isSelected ? 'border-lime-500 ring-1 ring-lime-500 bg-lime-50/10' : 'border-slate-200 hover:shadow-md'}`}>
                                            <div className="absolute top-4 right-4 z-10">
                                                <button onClick={(e) => { e.stopPropagation(); toggleSelection(user.id); }} className={`text-slate-300 hover:text-lime-600 transition-colors ${isSelected ? 'text-lime-600' : ''}`}>
                                                    {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                                                </button>
                                            </div>
                                            <div className="flex items-start justify-between mb-3 pr-8" onClick={() => toggleSelection(user.id)}>
                                                <div className="flex items-center space-x-3 cursor-pointer">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-white ${expiryTab === 'TODAY' ? 'bg-red-500' : expiryTab === 'TOMORROW' ? 'bg-orange-400' : 'bg-blue-500'}`}>
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 text-sm">{user.name}</h4>
                                                        <p className="text-xs text-slate-500">{user.plan}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <div className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase ${expiryTab === 'TODAY' ? 'bg-red-100 text-red-600' : expiryTab === 'TOMORROW' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    {expiryTab === 'TODAY' ? 'იწურება დღეს' : expiryTab === 'TOMORROW' ? 'იწურება ხვალ' : '7 დღე დარჩა'}
                                                </div>
                                            </div>
                                            <div className="pt-3 border-t border-slate-100 mt-2">
                                                <button
                                                    onClick={() => handleAction('კომუნიკაცია', user.name)}
                                                    className="w-full flex justify-center items-center py-2 bg-slate-50 text-slate-700 hover:bg-lime-400 hover:text-slate-900 rounded-xl transition-all text-xs font-black uppercase tracking-wider group"
                                                >
                                                    <MessageSquare size={16} className="mr-2 group-hover:scale-110 transition-transform" />
                                                    კომუნიკაცია
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-400">ამ პერიოდში ვადაგასული აქტივობები არ იძებნება.</div>
                        )}
                    </div>
                </div>
            )}

            {/* User Table Summary (Bottom) */}
            {showUsers && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-6">
                    <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">ბოლო რეგისტრაციები</h3>
                            <p className="text-slate-500 text-sm">მომხმარებლები, რომლებმაც დღეს გაიარეს რეგისტრაცია</p>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" placeholder="ძებნა ID, სახელით..." className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 w-full sm:w-64 transition-all" />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">მომხმარებელი</th>
                                    <th className="px-6 py-4">ტელეფონი</th>
                                    <th className="px-6 py-4">სტატუსი</th>
                                    <th className="px-6 py-4">აქტიური პაკეტი</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.slice(0, 5).map((user) => (
                                    <tr key={user.id} onClick={() => router.push(`/users/${user.id}`)} className="hover:bg-lime-50/50 cursor-pointer transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-400">#{user.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">{user.name.charAt(0)}</div>
                                                <span className="font-medium text-slate-800">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{user.phone}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-600' :
                                                user.status === 'Pending' ? 'bg-amber-100 text-amber-600' :
                                                    'bg-slate-100 text-slate-500'
                                                }`}>
                                                {user.status === 'Active' ? 'აქტიური' : user.status === 'Pending' ? 'მოლოდინში' : 'არააქტიური'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-800">{user.activePackageName || <span className="text-slate-400 text-xs italic">არ აქვს</span>}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-slate-400 group-hover:text-lime-600 transition-colors bg-white border border-slate-100 rounded-lg shadow-sm">
                                                <ChevronRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
}
