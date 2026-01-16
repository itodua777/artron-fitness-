
'use client';
import React, { useState, useMemo } from 'react';
import {
    Printer,
    FileText,
    Share2,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    ShoppingBag,
    Ticket,
    CreditCard,
    Download,
    PieChart as PieIcon,
    BarChart2,
    Banknote,
    Landmark,
    Coins,
    Wallet,
    ArrowLeft,
    Search,
    Plus,
    Send,
    Trash2,
    CheckCircle2,
    Save,
    Building2,
    ArrowRight,
    Clock,
    Briefcase,
    Check
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { CorporateClient, EmployeeWorkSummary } from '@/app/types';

interface InvoiceItem {
    id: string;
    description: string;
    qty: number;
    price: number;
}

interface Invoice {
    id: string;
    clientName: string;
    date: string;
    dueDate: string;
    amount: number;
    status: 'Paid' | 'Unpaid' | 'Overdue';
}

const mockWorkSummaries: EmployeeWorkSummary[] = [
    { employeeId: 1, fullName: 'გიორგი ბერიძე', position: 'ადმინისტრატორი', totalHours: 168, workingDays: 21, lateCount: 0, overtimeHours: 8 },
    { employeeId: 2, fullName: 'ანა კალაძე', position: 'მთავარი ბუღალტერი', totalHours: 160, workingDays: 20, lateCount: 2, overtimeHours: 0 },
    { employeeId: 3, fullName: 'ლევან დოლიძე', position: 'Head Coach', totalHours: 175, workingDays: 22, lateCount: 0, overtimeHours: 15 },
];

export default function AccountingPage({ corporateClients = [] }: { corporateClients?: CorporateClient[] }) {
    const [dateFilter, setDateFilter] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Month');
    const [activeTab, setActiveTab] = useState<'SALES' | 'GENERAL' | 'INVOICES' | 'PAYROLL'>('SALES');
    const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

    // Selection/Filtering state for Invoices
    const [clientSearchTerm, setClientSearchTerm] = useState('');
    const [selectedCorporate, setSelectedCorporate] = useState<CorporateClient | null>(null);

    // Invoices Registry
    const [invoices, setInvoices] = useState<Invoice[]>([
        { id: 'INV-2023-001', clientName: 'საქართველოს ბანკი', date: '2023-11-20', dueDate: '2023-12-05', amount: 3450, status: 'Paid' },
        { id: 'INV-2023-002', clientName: 'შპს ალტა', date: '2023-11-22', dueDate: '2023-12-10', amount: 1200, status: 'Unpaid' },
        { id: 'INV-2023-003', clientName: 'გიორგი მაისურაძე', date: '2023-10-15', dueDate: '2023-10-30', amount: 250, status: 'Overdue' },
    ]);

    // Invoice Form State
    const [newInvoiceData, setNewInvoiceData] = useState({
        clientName: '',
        clientType: 'Corporate' as 'Individual' | 'Corporate',
        items: [{ id: '1', description: '', qty: 1, price: 0 }] as InvoiceItem[],
        vatEnabled: true,
        notes: ''
    });

    // --- Calculations for UI ---
    const multiplier = useMemo(() => {
        switch (dateFilter) {
            case 'Day': return 0.03;
            case 'Week': return 0.25;
            case 'Month': return 1;
            case 'Year': return 12;
            default: return 1;
        }
    }, [dateFilter]);

    const sourceData = [
        { name: 'პაკეტები', value: 65, color: '#a3e635' },
        { name: 'ერთჯერადი', value: 15, color: '#10b981' },
        { name: 'მარკეტი', value: 20, color: '#f59e0b' },
    ];

    const incomeExpenseData = [
        { name: 'ორშ', income: 4000 * multiplier, expense: 2400 * multiplier },
        { name: 'სამ', income: 3000 * multiplier, expense: 1398 * multiplier },
        { name: 'ოთხ', income: 9800 * multiplier, expense: 2000 * multiplier },
        { name: 'ხუთ', income: 3908 * multiplier, expense: 2780 * multiplier },
        { name: 'პარ', income: 4800 * multiplier, expense: 1890 * multiplier },
        { name: 'შაბ', income: 3800 * multiplier, expense: 2390 * multiplier },
        { name: 'კვი', income: 4300 * multiplier, expense: 3490 * multiplier },
    ];

    const paymentMethods = [
        { id: 'Cash', name: 'ნაღდი ფული', amount: Math.round(4500 * multiplier), percentage: '18%', icon: <Banknote size={24} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        { id: 'Card', name: 'ტერმინალი', amount: Math.round(12300 * multiplier), percentage: '50%', icon: <CreditCard size={24} />, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { id: 'Transfer', name: 'გადმორიცხვა', amount: Math.round(6200 * multiplier), percentage: '25%', icon: <Landmark size={24} />, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        { id: 'Coins', name: 'ქულები', amount: Math.round(1500 * multiplier), percentage: '7%', icon: <Coins size={24} />, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    ];

    // --- Handlers ---
    const handleInvoiceItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
        setNewInvoiceData(prev => ({
            ...prev,
            items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    };

    const addInvoiceItem = () => {
        setNewInvoiceData(prev => ({
            ...prev,
            items: [...prev.items, { id: Date.now().toString(), description: '', qty: 1, price: 0 }]
        }));
    };

    const removeInvoiceItem = (id: string) => {
        if (newInvoiceData.items.length === 1) return;
        setNewInvoiceData(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id)
        }));
    };

    const subtotal = newInvoiceData.items.reduce((acc, curr) => acc + (curr.qty * curr.price), 0);
    const vat = newInvoiceData.vatEnabled ? subtotal * 0.18 : 0;
    const totalInvoiceAmount = subtotal + vat;

    const handleGenerateInvoice = () => {
        const newInv: Invoice = {
            id: `INV-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(3, '0')}`,
            clientName: newInvoiceData.clientName || selectedCorporate?.name || 'სტუმარი',
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            amount: totalInvoiceAmount,
            status: 'Unpaid'
        };
        setInvoices([newInv, ...invoices]);
        setIsCreatingInvoice(false);
        alert('ინვოისი წარმატებით დაგენერირდა!');
    };

    const filteredCorporates = corporateClients.filter(c =>
        c.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
        c.identCode.includes(clientSearchTerm)
    );

    return (
        <div className="space-y-6 animate-fadeIn pb-10">

            {/* Header Area */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#161b22] p-6 rounded-[2rem] shadow-sm border border-slate-800">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center">
                        <DollarSign className="mr-2 text-lime-500" />
                        ბუღალტერია
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">ფინანსური ანალიზი, ინვოისები და სახელფასო უწყისი</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value as any)}
                        className="px-4 py-2 bg-[#0d1117] border border-slate-700 rounded-xl text-sm font-bold outline-none text-white focus:border-lime-500"
                    >
                        <option value="Day">დღეს</option>
                        <option value="Week">ამ კვირაში</option>
                        <option value="Month">ამ თვეში</option>
                        <option value="Year">წელს</option>
                    </select>
                    <button onClick={() => window.print()} className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl border border-slate-700 transition-colors"><Printer size={20} /></button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-black hover:bg-slate-700 transition-all"><Share2 size={18} /><span>ORIS ექსპორტი</span></button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex space-x-1 bg-[#161b22] p-1.5 rounded-2xl w-fit border border-slate-800 overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveTab('SALES')} className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'SALES' ? 'bg-[#0d1117] text-white shadow-sm border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}>
                    <PieIcon size={18} /><span>გაყიდვები</span>
                </button>
                <button onClick={() => setActiveTab('GENERAL')} className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'GENERAL' ? 'bg-[#0d1117] text-white shadow-sm border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}>
                    <BarChart2 size={18} /><span>მიმოხილვა</span>
                </button>
                <button onClick={() => setActiveTab('INVOICES')} className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'INVOICES' ? 'bg-[#0d1117] text-white shadow-sm border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}>
                    <FileText size={18} /><span>ინვოისის გენერირება</span>
                </button>
                <button onClick={() => setActiveTab('PAYROLL')} className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'PAYROLL' ? 'bg-[#0d1117] text-white shadow-sm border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}>
                    <Clock size={18} /><span>ხელფასები და დასწრება</span>
                </button>
            </div>

            {/* 1. SALES ANALYSIS TAB */}
            {activeTab === 'SALES' && (
                <div className="animate-fadeIn space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Income Sources Pie Chart */}
                        <div className="lg:col-span-1 bg-[#161b22] p-8 rounded-[2.5rem] shadow-sm border border-slate-800 flex flex-col h-full">
                            <h3 className="text-lg font-black text-white mb-6">შემოსავლის წყაროები</h3>
                            <div className="flex-1 min-h-[250px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={sourceData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                                            {sourceData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                    <span className="text-xs font-black text-slate-500 uppercase tracking-tighter">სულ წილი</span>
                                    <span className="block text-3xl font-black text-white">100%</span>
                                </div>
                            </div>
                            <div className="space-y-3 mt-6">
                                {sourceData.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-[#0d1117] rounded-2xl border border-slate-800">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-sm font-bold text-slate-400">{item.name}</span>
                                        </div>
                                        <span className="font-black text-white">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sales Type Cards */}
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-[#161b22] p-8 rounded-[2.5rem] border border-slate-800 shadow-sm flex flex-col justify-between hover:border-lime-500/50 transition-all group">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="p-4 bg-lime-500/10 text-lime-500 rounded-2xl shadow-sm group-hover:bg-lime-500 group-hover:text-slate-900 transition-all"><CreditCard size={28} /></div>
                                    <span className="text-[10px] font-black text-lime-500 bg-lime-500/10 px-3 py-1.5 rounded-full uppercase">65% წილი</span>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-black uppercase tracking-widest mb-1">აბონემენტები</p>
                                    <h4 className="text-4xl font-black text-white mb-2">₾ {(15925 * multiplier).toLocaleString()}</h4>
                                    <p className="text-xs text-slate-500 font-medium">ჯამში გაყიდული: {Math.round(145 * multiplier)}</p>
                                </div>
                            </div>

                            <div className="bg-[#161b22] p-8 rounded-[2.5rem] border border-slate-800 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition-all group">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all"><Ticket size={28} /></div>
                                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full uppercase">15% წილი</span>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-black uppercase tracking-widest mb-1">ერთჯერადი ვიზიტები</p>
                                    <h4 className="text-4xl font-black text-white mb-2">₾ {(4600 * multiplier).toLocaleString()}</h4>
                                    <p className="text-xs text-slate-500 font-medium">ჯამში გაყიდული: {Math.round(230 * multiplier)}</p>
                                </div>
                            </div>

                            <div className="bg-[#161b22] p-8 rounded-[2.5rem] border border-slate-800 shadow-sm flex flex-col justify-between hover:border-amber-500/50 transition-all group">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-all"><ShoppingBag size={28} /></div>
                                    <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full uppercase">20% წილი</span>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-black uppercase tracking-widest mb-1">მარკეტის გაყიდვები</p>
                                    <h4 className="text-4xl font-black text-white mb-2">₾ {(3975 * multiplier).toLocaleString()}</h4>
                                    <p className="text-xs text-slate-500 font-medium">ჯამში გაყიდული: {Math.round(412 * multiplier)}</p>
                                </div>
                            </div>

                            {/* Cash Register Breakdown */}
                            <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white flex flex-col justify-between relative overflow-hidden group border border-slate-800">
                                <Wallet size={120} className="absolute -right-8 -bottom-8 text-white/5 transform -rotate-12 group-hover:scale-110 transition-transform" />
                                <div className="relative z-10">
                                    <h3 className="text-lg font-black text-lime-500 uppercase tracking-widest mb-6">სალაროს ანალიზი</h3>
                                    <div className="space-y-4">
                                        {paymentMethods.slice(0, 3).map(m => (
                                            <div key={m.id} className="flex items-center justify-between border-b border-white/10 pb-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="text-slate-400">{m.icon}</div>
                                                    <span className="text-sm font-bold">{m.name}</span>
                                                </div>
                                                <span className="text-sm font-black">₾ {m.amount.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. GENERAL OVERVIEW TAB */}
            {activeTab === 'GENERAL' && (
                <div className="animate-fadeIn space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#161b22] p-8 rounded-[2.5rem] shadow-sm border border-slate-800 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
                            <div className="absolute right-0 top-0 h-full w-2 bg-emerald-500"></div>
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">მთლიანი შემოსავალი</p>
                                <ArrowUpRight className="text-emerald-500" size={24} />
                            </div>
                            <h3 className="text-4xl font-black text-white tracking-tighter">₾ {(24500 * multiplier).toLocaleString()}</h3>
                        </div>
                        <div className="bg-[#161b22] p-8 rounded-[2.5rem] shadow-sm border border-slate-800 relative overflow-hidden group hover:border-red-500/50 transition-all">
                            <div className="absolute right-0 top-0 h-full w-2 bg-red-500"></div>
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">მთლიანი გასავალი</p>
                                <ArrowDownRight className="text-red-500" size={24} />
                            </div>
                            <h3 className="text-4xl font-black text-white tracking-tighter">₾ {(8240 * multiplier).toLocaleString()}</h3>
                        </div>
                        <div className="bg-[#161b22] p-8 rounded-[2.5rem] shadow-sm border border-slate-800 relative overflow-hidden group hover:border-lime-500/50 transition-all">
                            <div className="absolute right-0 top-0 h-full w-2 bg-lime-500"></div>
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">წმინდა მოგება</p>
                                <Check className="text-lime-500" size={24} />
                            </div>
                            <h3 className="text-4xl font-black text-white tracking-tighter">₾ {(16260 * multiplier).toLocaleString()}</h3>
                        </div>
                    </div>

                    {/* Income Trend Chart */}
                    <div className="bg-[#161b22] p-8 rounded-[3rem] border border-slate-800 shadow-sm">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-xl font-black text-white">ფულადი ნაკადების დინამიკა</h3>
                                <p className="text-sm text-slate-500 font-medium uppercase tracking-tighter mt-1">შემოსავლები vs გასავლები</p>
                            </div>
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-lime-500 rounded-full"></div><span className="text-xs font-black text-slate-500 uppercase">შემოსავალი</span></div>
                                <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-slate-600 rounded-full"></div><span className="text-xs font-black text-slate-500 uppercase">გასავალი</span></div>
                            </div>
                        </div>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={incomeExpenseData}>
                                    <defs>
                                        <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a3e635" stopOpacity={0.2} /><stop offset="95%" stopColor="#a3e635" stopOpacity={0} /></linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} stroke="#1f2937" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }} />
                                    <Area type="monotone" dataKey="income" stroke="#a3e635" strokeWidth={4} fill="url(#colorInc)" />
                                    <Area type="monotone" dataKey="expense" stroke="#475569" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. INVOICE GENERATION TAB */}
            {activeTab === 'INVOICES' && (
                <div className="animate-fadeIn space-y-6">
                    {!isCreatingInvoice ? (
                        <>
                            <div className="flex justify-between items-center bg-[#161b22] p-8 rounded-[2.5rem] shadow-sm border border-slate-800">
                                <div>
                                    <h3 className="text-xl font-black text-white tracking-tight">ინვოისების რეესტრი</h3>
                                    <p className="text-slate-500 text-sm font-medium">კორპორატიული და კერძო ანგარიშფაქტურების მართვა</p>
                                </div>
                                <button
                                    onClick={() => setIsCreatingInvoice(true)}
                                    className="flex items-center space-x-3 px-8 py-4 bg-lime-500 hover:bg-lime-400 text-slate-900 font-black rounded-2xl shadow-xl shadow-lime-500/20 transition-all active:scale-95 group"
                                >
                                    <Plus size={22} className="group-hover:rotate-90 transition-transform" />
                                    <span className="uppercase text-xs tracking-widest">ახალი ინვოისი</span>
                                </button>
                            </div>

                            <div className="bg-[#161b22] rounded-[2.5rem] shadow-sm border border-slate-800 overflow-hidden">
                                <table className="w-full text-left text-sm text-slate-400">
                                    <thead className="bg-[#0d1117] text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                                        <tr><th className="px-8 py-5">ინვოისის #</th><th className="px-8 py-5">კლიენტი</th><th className="px-8 py-5">თარიღი</th><th className="px-8 py-5">ჯამი</th><th className="px-8 py-5">სტატუსი</th><th className="px-8 py-5 text-right">მოქმედება</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {invoices.map(inv => (
                                            <tr key={inv.id} className="hover:bg-slate-800/50 transition-colors group">
                                                <td className="px-8 py-5 font-mono font-bold text-slate-500 group-hover:text-blue-500">{inv.id}</td>
                                                <td className="px-8 py-5 font-black text-white">{inv.clientName}</td>
                                                <td className="px-8 py-5 font-bold text-slate-500">{inv.date}</td>
                                                <td className="px-8 py-5 font-black text-white">₾ {inv.amount.toLocaleString()}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase ${inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' :
                                                            inv.status === 'Unpaid' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                                                        }`}>{inv.status === 'Paid' ? 'გადახდილი' : inv.status === 'Unpaid' ? 'გადაუხდელი' : 'ვადაგასული'}</span>
                                                </td>
                                                <td className="px-8 py-5 text-right space-x-2">
                                                    <button className="p-2 text-slate-500 hover:text-blue-500 transition-colors"><Download size={18} /></button>
                                                    <button className="p-2 text-slate-500 hover:text-indigo-500 transition-colors"><Send size={18} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        // Invoice Creation Form with Corporate Selection
                        <div className="max-w-6xl mx-auto space-y-6">
                            <button onClick={() => { setIsCreatingInvoice(false); setSelectedCorporate(null); }} className="flex items-center text-slate-500 hover:text-white font-bold group transition-all">
                                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                                რეესტრში დაბრუნება
                            </button>

                            <div className="bg-[#161b22] rounded-[3rem] shadow-2xl border border-slate-800 overflow-hidden">
                                <div className="p-8 border-b border-slate-800 bg-[#0d1117] flex items-center space-x-4">
                                    <div className="w-14 h-14 bg-slate-800 text-white rounded-2xl flex items-center justify-center shadow-lg"><FileText size={28} /></div>
                                    <div><h2 className="text-2xl font-black text-white tracking-tight">ინვოისის ფორმირება</h2><p className="text-slate-500 text-sm font-medium uppercase">შეავსეთ კლიენტის და სერვისის მონაცემები</p></div>
                                </div>

                                <div className="p-10 space-y-10">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                        {/* Client Selection Logic */}
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">კლიენტის ტიპი</label>
                                                <div className="flex space-x-1 bg-[#0d1117] p-1.5 rounded-2xl w-fit border border-slate-800">
                                                    <button onClick={() => setNewInvoiceData({ ...newInvoiceData, clientType: 'Corporate' })} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${newInvoiceData.clientType === 'Corporate' ? 'bg-[#161b22] text-white shadow-sm border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}>კორპორატიული</button>
                                                    <button onClick={() => { setNewInvoiceData({ ...newInvoiceData, clientType: 'Individual' }); setSelectedCorporate(null); }} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${newInvoiceData.clientType === 'Individual' ? 'bg-[#161b22] text-white shadow-sm border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}>ინდივიდუალური</button>
                                                </div>
                                            </div>

                                            {newInvoiceData.clientType === 'Corporate' ? (
                                                <div className="space-y-4 animate-fadeIn">
                                                    <div className="relative group">
                                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                                                        <input value={clientSearchTerm} onChange={e => setClientSearchTerm(e.target.value)} placeholder="მოძებნეთ კომპანია სახელით ან კოდით..." className="w-full pl-12 pr-4 py-4 bg-[#0d1117] border border-slate-700 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all text-white placeholder:text-slate-600" />
                                                    </div>
                                                    <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                                                        {filteredCorporates.map(client => (
                                                            <div key={client.id} onClick={() => { setSelectedCorporate(client); setClientSearchTerm(''); }} className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${selectedCorporate?.id === client.id ? 'bg-blue-900/20 border-blue-500/50' : 'bg-[#0d1117] border-slate-800 hover:border-slate-700'}`}>
                                                                <div className="flex items-center space-x-3"><div className={`p-2 rounded-xl ${selectedCorporate?.id === client.id ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'}`}><Building2 size={18} /></div><div><p className="text-sm font-black text-white">{client.name}</p><p className="text-[10px] text-slate-500 font-bold font-mono tracking-widest">{client.identCode}</p></div></div>
                                                                {selectedCorporate?.id === client.id ? <CheckCircle2 size={20} className="text-blue-500" /> : <ArrowRight size={16} className="text-slate-500 group-hover:translate-x-1 transition-transform" />}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-2 animate-fadeIn">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">მომხმარებლის სახელი</label>
                                                    <input value={newInvoiceData.clientName} onChange={e => setNewInvoiceData({ ...newInvoiceData, clientName: e.target.value })} className="w-full px-5 py-4 bg-[#0d1117] border border-slate-700 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all text-white placeholder:text-slate-600" placeholder="მაგ: გიორგი ბერიძე" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-6">
                                            {selectedCorporate && (
                                                <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden animate-scaleIn">
                                                    <Building2 size={120} className="absolute -right-8 -bottom-8 opacity-10 transform -rotate-12" />
                                                    <div className="relative z-10 space-y-4">
                                                        <div><p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">არჩეული კლიენტი</p><h4 className="text-2xl font-black">{selectedCorporate.name}</h4></div>
                                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-500/30">
                                                            <div><p className="text-[9px] font-black text-blue-200 uppercase">ს/კ</p><p className="text-sm font-bold font-mono">{selectedCorporate.identCode}</p></div>
                                                            <div><p className="text-[9px] font-black text-blue-200 uppercase">კორპ. ფასდაკლება</p><p className="text-sm font-black">{selectedCorporate.discountPercentage}%</p></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">შენიშვნა / რეკვიზიტები</label><textarea value={newInvoiceData.notes} onChange={e => setNewInvoiceData({ ...newInvoiceData, notes: e.target.value })} className="w-full h-32 px-6 py-4 bg-[#0d1117] border border-slate-700 rounded-[2rem] outline-none focus:border-blue-500 text-sm font-medium resize-none transition-all text-white placeholder:text-slate-600" /></div>
                                        </div>
                                    </div>

                                    {/* Service Items Table */}
                                    <div className="space-y-6 border-t border-slate-800 pt-10">
                                        <div className="flex justify-between items-center px-2">
                                            <h3 className="text-sm font-black text-white uppercase flex items-center"><ShoppingBag size={18} className="mr-2 text-blue-500" /> სერვისები და პროდუქტები</h3>
                                            <button onClick={addInvoiceItem} className="flex items-center space-x-2 text-xs font-black text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2.5 rounded-xl transition-all"><Plus size={16} /><span>ხაზის დამატება</span></button>
                                        </div>
                                        <div className="space-y-3">
                                            {newInvoiceData.items.map((item) => (
                                                <div key={item.id} className="grid grid-cols-12 gap-3 animate-fadeIn">
                                                    <div className="col-span-6"><input value={item.description} onChange={e => handleInvoiceItemChange(item.id, 'description', e.target.value)} placeholder="აღწერა..." className="w-full px-5 py-4 bg-[#0d1117] border border-slate-700 rounded-2xl outline-none focus:border-blue-500 text-sm font-bold text-white placeholder:text-slate-600" /></div>
                                                    <div className="col-span-2"><input type="number" value={item.qty} onChange={e => handleInvoiceItemChange(item.id, 'qty', parseInt(e.target.value) || 0)} className="w-full px-4 py-4 bg-[#0d1117] border border-slate-700 rounded-2xl outline-none text-center font-bold text-white" /></div>
                                                    <div className="col-span-3 relative"><input type="number" value={item.price} onChange={e => handleInvoiceItemChange(item.id, 'price', parseFloat(e.target.value) || 0)} className="w-full px-5 py-4 bg-[#0d1117] border border-slate-700 rounded-2xl outline-none font-black text-white" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">₾</span></div>
                                                    <div className="col-span-1 flex items-center justify-center"><button onClick={() => removeInvoiceItem(item.id)} className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={20} /></button></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row justify-end gap-10 pt-10 border-t border-slate-800">
                                        <div className="w-full md:w-96 bg-[#0d1117] p-8 rounded-[2.5rem] space-y-4 border border-slate-800">
                                            <div className="flex justify-between items-center text-sm font-bold text-slate-500"><span>ჯამი (დღგ-ს გარეშე)</span><span>₾ {subtotal.toLocaleString()}</span></div>
                                            <div className="flex justify-between items-center"><div className="flex items-center space-x-2"><span className="text-sm font-bold text-slate-500">დღგ (18%)</span><button onClick={() => setNewInvoiceData({ ...newInvoiceData, vatEnabled: !newInvoiceData.vatEnabled })} className={`w-8 h-4 rounded-full relative transition-all ${newInvoiceData.vatEnabled ? 'bg-blue-500' : 'bg-slate-700'}`}><div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all transform ${newInvoiceData.vatEnabled ? 'translate-x-4' : 'translate-x-0.5'}`}></div></button></div><span className="text-sm font-bold text-slate-500">₾ {vat.toLocaleString()}</span></div>
                                            <div className="h-px bg-slate-800 my-2"></div>
                                            <div className="flex justify-between items-center"><span className="text-lg font-black text-slate-300 uppercase tracking-tighter">სულ</span><span className="text-3xl font-black text-blue-500">₾ {totalInvoiceAmount.toLocaleString()}</span></div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-4 pt-6">
                                        <button onClick={() => { setIsCreatingInvoice(false); setSelectedCorporate(null); }} className="px-8 py-4 text-slate-500 font-bold hover:text-white transition-colors">გაუქმება</button>
                                        <button onClick={handleGenerateInvoice} disabled={newInvoiceData.clientType === 'Corporate' && !selectedCorporate} className="flex items-center space-x-4 px-14 py-5 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-[2rem] shadow-2xl shadow-slate-900/20 transition-all active:scale-95 disabled:bg-slate-900 disabled:text-slate-600 group"><Save size={22} className="group-hover:scale-110 transition-transform" /><span className="uppercase text-xs tracking-widest">გენერირება</span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 4. PAYROLL & ATTENDANCE TAB */}
            {activeTab === 'PAYROLL' && (
                <div className="animate-fadeIn space-y-6">
                    <div className="bg-[#161b22] p-8 rounded-[2.5rem] shadow-sm border border-slate-800 overflow-hidden">
                        <div className="flex justify-between items-center mb-8">
                            <div><h3 className="text-xl font-black text-white tracking-tight">HR შემაჯამებელი რეესტრი</h3><p className="text-sm text-slate-500 font-medium">სამუშაო საათების აღრიცხვა სახელფასო უწყისისთვის</p></div>
                            <div className="bg-blue-500/10 text-blue-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-500/20">ნოემბერი, 2023</div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-[#0d1117] text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                                    <tr><th className="px-8 py-5">თანამშრომელი</th><th className="px-8 py-5">სამუშაო დღეები</th><th className="px-8 py-5">ნამუშევარი საათები</th><th className="px-8 py-5">ზეგანაკვეთური</th><th className="px-8 py-5">დაგვიანებები</th><th className="px-8 py-5 text-right">მოქმედება</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {mockWorkSummaries.map(summary => (
                                        <tr key={summary.employeeId} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-8 py-5"><div className="font-black text-white">{summary.fullName}</div><div className="text-[10px] text-slate-500 font-bold uppercase">{summary.position}</div></td>
                                            <td className="px-8 py-5 font-bold text-slate-300">{summary.workingDays} დღე</td>
                                            <td className="px-8 py-5 font-black text-white">{summary.totalHours} სთ</td>
                                            <td className="px-8 py-5 font-bold text-emerald-500">{summary.overtimeHours > 0 ? `+${summary.overtimeHours} სთ` : '-'}</td>
                                            <td className="px-8 py-5 font-bold text-red-500">{summary.lateCount > 0 ? `${summary.lateCount} ჯერ` : '0'}</td>
                                            <td className="px-8 py-5 text-right"><button className="text-xs font-black text-blue-500 hover:text-blue-400 hover:underline uppercase tracking-tighter">ხელფასის გათვლა</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white flex justify-between items-center overflow-hidden relative group border border-slate-800">
                            <div className="relative z-10"><p className="text-[10px] font-black text-lime-500 uppercase tracking-widest mb-1">ჯამური სახელფასო ფონდი</p><h4 className="text-4xl font-black tracking-tighter">₾ 5,500</h4></div>
                            <Briefcase size={80} className="absolute -right-4 -bottom-4 text-white/5 transform -rotate-12 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="bg-[#161b22] p-8 rounded-[2.5rem] border border-slate-800 shadow-sm flex justify-between items-center group hover:border-lime-500/50 transition-all">
                            <div><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">სამუშაო დროის ეფექტურობა</p><h4 className="text-4xl font-black text-white tracking-tighter">98.2%</h4></div>
                            <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl group-hover:scale-110 transition-transform"><CheckCircle2 size={32} /></div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </div>
    );
};
