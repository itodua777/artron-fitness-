
'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Package } from '@/app/types';
import {
    ArrowLeft, Phone, Mail, MapPin, Calendar, CreditCard,
    Save, CheckCircle, AlertCircle, ShieldAlert, FileText,
    Upload, History, Heart, Star, Lock, Smartphone, MoreHorizontal,
    Plus, X, Search, ChevronRight, FileCheck, Eye, Download, Trash2,
    Ban, CheckCircle2, RefreshCw, Key, User as UserIcon, DollarSign, ShoppingBag
} from 'lucide-react';

interface UserDetailViewProps {
    params: { id: string };
}



export default function UserDetailPage({ params }: UserDetailViewProps) {
    const router = useRouter();
    const userId = params.id;
    const [user, setUser] = useState<User | null>(null);
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState('PROFILE');
    const [notes, setNotes] = useState('');

    // Purchase Tab State
    const [selectedActivity, setSelectedActivity] = useState<any>(null);
    const [includeBracelet, setIncludeBracelet] = useState(false);
    const [includeCard, setIncludeCard] = useState(false);

    // Mock Data
    const mockHistory = [
        { id: 1, date: '2023-11-01', item: 'Gold Membership', type: 'აბონემენტი', amount: 150, status: 'გადახდილი' },
        { id: 2, date: '2023-10-15', item: 'Bracelet', type: 'ინვენტარი', amount: 15, status: 'გადახდილი' },
        { id: 3, date: '2023-10-15', item: 'Protein Bar', type: 'ბარი', amount: 5, status: 'გადახდილი' },
        { id: 4, date: '2023-09-20', item: 'Daily Visit', type: 'ერთჯერადი', amount: 20, status: 'გადახდილი' },
    ];

    const mockActivities = [
        { id: 1, name: '1 თვიანი შეუზღუდავი', price: 120, type: 'აბონემენტი' },
        { id: 2, name: '12 ვიზიტი', price: 90, type: 'აბონემენტი' },
        { id: 3, name: 'ლიმიტირებული (დილის)', price: 70, type: 'აბონემენტი' },
        { id: 4, name: 'დღიური ვიზიტი', price: 20, type: 'ერთჯერადი' },
        { id: 5, name: 'იოგა - ჯგუფური', price: 15, type: 'ჯგუფური' },
        { id: 6, name: 'პერსონალური ვარჯიშები', price: 300, type: 'პერსონალური' },
    ];

    // Access Logs Filtering
    const [accessDateFrom, setAccessDateFrom] = useState('');
    const [accessDateTo, setAccessDateTo] = useState('');

    // Access Control State
    const [accessMobile, setAccessMobile] = useState(false);
    const [accessBracelet, setAccessBracelet] = useState(false);
    const [accessCard, setAccessCard] = useState(false);
    const [braceletCode, setBraceletCode] = useState('');
    const [cardCode, setCardCode] = useState('');
    const [savingAccess, setSavingAccess] = useState(false);

    // Mock Uploaded Documents
    const mockDocs = [
        { id: 1, name: 'ID_CARD_SCAN.pdf', type: 'ID / პასპორტი', date: '2023-10-25' },
        { id: 2, name: 'HEALTH_CERT.jpg', type: 'ჯანმრთელობის ცნობა', date: '2023-11-01' },
        { id: 3, name: 'BIRTH_CERTIFICATE.pdf', type: 'დაბადების მოწმობა', date: '2023-11-05', isConditional: true }
    ];

    const tabs = [
        { id: 'PROFILE', label: 'პროფილი', icon: <UserIcon size={16} /> },
        { id: 'PURCHASE', label: 'დაშვება/აქტივობის გაყიდვა', icon: <ShoppingBag size={16} /> },
        { id: 'HISTORY', label: 'ისტორია', icon: <History size={16} /> },
        { id: 'HEALTH', label: 'ჯანმრთელობა', icon: <Heart size={16} /> },
        { id: 'LOYALTY', label: 'ლოიალობა', icon: <Star size={16} /> },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch User
                // Note: Our mock backend might not have single user endpoint yet or logic might need filter.
                // Let's rely on retrieving all members and finding one for now if /:id is not ready,
                // or ideally we implement /:id in backend. 
                // In my backend task, I created MembersController. Let's check if it has Get One.
                // I created: findAll, create, createBatch. 
                // I did NOT create GetById. So I must fetch all and find client-side or add endpoint.
                // For speed, I'll fetch all and find.
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                const userRes = await fetch(`${apiUrl}/api/members`);
                const data = await userRes.json();
                if (Array.isArray(data)) {
                    // Try to match by _id or mapped ID.
                    // The backend uses MongoDB _id. The URL will have _id.
                    const found = data.find((u: any) => u._id === userId || u.id === userId);
                    if (found) {
                        setUser({
                            id: found._id,
                            name: found.name || `${found.firstName || ''} ${found.lastName || ''}`.trim(),
                            email: found.email,
                            phone: found.phone,
                            status: found.status || 'Active',
                            address: found.address,
                            joinedDate: found.joinedDate ? new Date(found.joinedDate).toLocaleDateString() : 'N/A',
                            tenantName: 'Pixl Fitness', // Mock
                            isCorporate: found.isCorporate,
                            companyName: found.companyName,
                            guardianFirstName: found.guardianFirstName,
                            guardianLastName: found.guardianLastName,
                            guardianPersonalId: found.guardianPersonalId,
                            guardianPhone: found.guardianPhone,
                            guardianEmail: found.guardianEmail,
                            guardianType: found.guardianType || 'parent'
                        });

                        // Set Access fields
                        setAccessMobile(found.accessMobile || false);
                        setAccessBracelet(found.accessBracelet || false);
                        setAccessCard(found.accessCard || false);
                        setBraceletCode(found.braceletCode || '');
                        setCardCode(found.cardCode || '');
                    }
                }

                // Fetch Packages (Passes)
                const apiUrl2 = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                const passesRes = await fetch(`${apiUrl2}/api/passes`);
                const passesData = await passesRes.json();
                if (Array.isArray(passesData)) {
                    setPackages(passesData.map((p: any) => ({
                        id: p._id,
                        title: p.title,
                        price: p.price,
                        duration: p.duration,
                        description: p.description
                    })));
                }
            } catch (e) {
                console.error("Failed to load user data", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);



    const handleEditProfile = () => {
        alert('პროფილის რედაქტირების რეჟიმი გააქტიურებულია');
    };

    const handleSaveAccess = async () => {
        setSavingAccess(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const res = await fetch(`${apiUrl}/api/members/${user?.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accessMobile,
                    accessBracelet,
                    accessCard,
                    braceletCode,
                    cardCode
                })
            });

            if (res.ok) {
                alert('დაშვების პარამეტრები შენახულია');
            } else {
                alert('შეცდომა შენახვისას');
            }
        } catch (error) {
            console.error('Error saving access settings:', error);
            alert('შეცდომა შენახვისას');
        } finally {
            setSavingAccess(false);
        }
    };

    if (loading) {
        return <div className="p-10 text-center text-slate-500">იტვირთება...</div>;
    }

    if (!user) {
        return <div className="p-10 text-center text-red-500 font-bold">მომხმარებელი ვერ მოიძებნა</div>;
    }

    return (
        <div className="max-w-7xl mx-auto animate-fadeIn text-slate-300">
            <button
                onClick={() => router.back()}
                className="flex items-center text-slate-500 hover:text-white transition-colors mb-10 group"
            >
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold uppercase tracking-widest text-xs">უკან დაბრუნება</span>
            </button>

            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                <div className="relative">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-[#161b22] border-4 border-slate-800 p-1">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                            alt=""
                            className="w-full h-full rounded-[2.2rem] object-cover bg-slate-900"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-[#0d1117] rounded-full flex items-center justify-center text-white">
                        <CheckCircle size={20} />
                    </div>
                </div>

                <div className="text-center md:text-left space-y-2">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <h1 className="text-4xl font-black text-white tracking-tight">{user.name}</h1>
                        <span className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg text-[10px] font-black uppercase flex items-center">
                            <ShieldAlert size={12} className="mr-1.5" /> სამედიცინო გაფრთხილება
                        </span>
                    </div>
                    <p className="text-slate-500 font-bold">წევრია: {user.joinedDate}</p>
                </div>

                <div className="ml-auto flex items-center gap-3">
                    <button
                        onClick={handleEditProfile}
                        className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                    >
                        პროფილის რედაქტირება
                    </button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex space-x-1 bg-[#161b22] p-1.5 rounded-2xl mb-12 overflow-x-auto no-scrollbar border border-slate-800 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-[#1f2937] text-blue-400 shadow-md ring-1 ring-blue-500/20'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">

                    {activeTab === 'PROFILE' && (
                        <>
                            <div className="bg-[#161b22] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-xl">
                                <div className="p-8 border-b border-slate-800 bg-slate-900/30">
                                    <h3 className="font-black text-white uppercase tracking-tight flex items-center">
                                        <UserIcon size={18} className="mr-2 text-blue-500" /> პერსონალური დეტალები
                                    </h3>
                                </div>
                                <div className="p-10">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-12">
                                        <DetailItem label="სრული სახელი" value={user.name} />
                                        <DetailItem label="დაბადების თარიღი" value="1994-05-20" />
                                        <DetailItem label="სტატუსი" value={user.status} isStatus />
                                        <DetailItem label="ელ.ფოსტა" value={user.email || 'N/A'} />
                                        <DetailItem label="ტელეფონი" value={user.phone} />
                                        <DetailItem label="მისამართი" value={user.address || 'N/A'} />
                                        <DetailItem label="წევრობის დონე" value="Gold" isTier />
                                        {user.guardianFirstName && (
                                            <>
                                                <div className="md:col-span-3 border-t border-slate-800 my-4"></div>
                                                <div className="md:col-span-3 mb-2 flex items-center justify-between">
                                                    <h4 className="text-sm font-black text-blue-400 uppercase tracking-widest">
                                                        {user.guardianType === 'guardian' ? 'მეურვის ინფორმაცია' : 'მშობლის ინფორმაცია'}
                                                    </h4>
                                                    <div className="bg-[#0d1117] p-1 rounded-lg flex gap-1">
                                                        <button
                                                            className={`text-[10px] uppercase font-black px-3 py-1 rounded-md transition-all ${user.guardianType === 'parent' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
                                                            onClick={(e) => { e.stopPropagation(); setUser({ ...user, guardianType: 'parent' }) }}
                                                        >
                                                            მშობელი
                                                        </button>
                                                        <button
                                                            className={`text-[10px] uppercase font-black px-3 py-1 rounded-md transition-all ${user.guardianType === 'guardian' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
                                                            onClick={(e) => { e.stopPropagation(); setUser({ ...user, guardianType: 'guardian' }) }}
                                                        >
                                                            მეურვე
                                                        </button>
                                                    </div>
                                                </div>
                                                <DetailItem label={user.guardianType === 'guardian' ? 'მეურვის სახელი' : 'მშობლის სახელი'} value={`${user.guardianFirstName} ${user.guardianLastName}`} />
                                                <DetailItem label="პირადი ნომერი" value={user.guardianPersonalId || 'N/A'} />
                                                <DetailItem label="საკონტაქტო" value={user.guardianPhone || 'N/A'} />
                                                <DetailItem label="ელ.ფოსტა" value={user.guardianEmail || 'N/A'} />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#161b22] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-xl">
                                <div className="p-8 border-b border-slate-800 bg-slate-900/30 flex justify-between items-center">
                                    <h3 className="font-black text-white uppercase tracking-tight flex items-center">
                                        <FileText size={18} className="mr-2 text-blue-500" /> დოკუმენტები
                                    </h3>
                                    <button className="flex items-center space-x-2 px-4 py-2 bg-[#1f2937] hover:bg-slate-700 text-xs font-black rounded-xl border border-slate-700 transition-all">
                                        <Plus size={14} />
                                        <span>ატვირთვა</span>
                                    </button>
                                </div>
                                <div className="p-10">
                                    {mockDocs.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {mockDocs.map((doc) => (
                                                <div key={doc.id} className="p-5 bg-[#0d1117] rounded-3xl border border-slate-800 flex items-center justify-between group hover:border-blue-500 transition-all">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center">
                                                            <FileText size={24} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-black text-white truncate max-w-[150px]">{doc.name}</h4>
                                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{doc.type}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"><Eye size={18} /></button>
                                                        <button className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"><Download size={18} /></button>
                                                        <button className="p-2 hover:bg-red-500/10 rounded-xl text-slate-400 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-12 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center text-center">
                                            <FileText size={48} className="text-slate-800 mb-4" />
                                            <p className="text-slate-500 font-bold">დოკუმენტები არ არის ატვირთული</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'PURCHASE' && (
                        <React.Fragment>
                            {/* Access Control Sections (Moved to Top) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn mb-8">
                                <div className="space-y-6">
                                    {/* Mobile App Access Card */}
                                    <div className="bg-[#161b22] rounded-[2.5rem] border border-slate-800 overflow-hidden p-8 shadow-xl">
                                        <div className="flex items-center space-x-3 mb-6">
                                            <Smartphone size={24} className="text-blue-400" />
                                            <h3 className="font-black text-white text-lg tracking-tight">მობილური აპლიკაციის დაშვება</h3>
                                        </div>

                                        {accessMobile ? (
                                            <>
                                                <div className="flex justify-between items-start mb-8">
                                                    <div>
                                                        <p className="text-base font-bold text-white mb-1">{user.email}</p>
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
                                                    <div className="relative group/invite flex-1">
                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                                                                    const res = await fetch(`${apiUrl}/api/members/${user?.id}/invite`, { method: 'POST' });
                                                                    if (res.ok) alert('გამშვები ლინკი გაიგზავნა');
                                                                } catch (e) {
                                                                    console.error(e);
                                                                    alert('შეცდომა გაგზავნისას');
                                                                }
                                                            }}
                                                            className="w-full h-full px-4 py-3 bg-[#0d1117] border border-slate-800 text-white text-xs font-black uppercase rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
                                                        >
                                                            <RefreshCw size={14} className="group-hover/invite:rotate-180 transition-transform duration-500" />
                                                            გამშვები ლინკი
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                                                                const res = await fetch(`${apiUrl}/api/members/${user?.id}/otp`, { method: 'POST' });
                                                                if (res.ok) alert('ერთჯერადი პაროლი გაიგზავნა');
                                                            } catch (e) {
                                                                console.error(e);
                                                                alert('შეცდომა გაგზავნისას');
                                                            }
                                                        }}
                                                        className="flex-1 px-4 py-3 bg-transparent border border-slate-700 text-slate-300 text-xs font-black uppercase rounded-xl hover:text-white hover:border-slate-500 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Key size={14} />
                                                        ერთჯერადი პაროლი
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="py-8 text-center border-2 border-dashed border-slate-800 rounded-2xl">
                                                <p className="text-slate-500 font-bold text-xs uppercase">აპლიკაციაზე წვდომა გამორთულია</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-[#161b22] rounded-[2.5rem] border border-slate-800 overflow-hidden p-8">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="font-black text-white uppercase tracking-tight">ფიზიკური დაშვება</h3>
                                            {savingAccess && <span className="text-[10px] text-emerald-500 uppercase font-black">ინახება...</span>}
                                        </div>
                                        <div className="space-y-6">

                                            {/* Selection Checkboxes */}
                                            <div className="flex flex-wrap gap-2">
                                                <label className={`flex items-center space-x-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${accessMobile ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-[#0d1117] border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                                                    <input type="checkbox" checked={accessMobile} onChange={(e) => setAccessMobile(e.target.checked)} className="hidden" />
                                                    <Smartphone size={16} className={accessMobile ? 'text-blue-400' : ''} />
                                                    <span className="text-xs font-black uppercase">მობ. აპლიკაცია</span>
                                                </label>

                                                <label className={`flex items-center space-x-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${accessBracelet ? 'bg-purple-600/10 border-purple-500 text-white' : 'bg-[#0d1117] border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                                                    <input type="checkbox" checked={accessBracelet} onChange={(e) => setAccessBracelet(e.target.checked)} className="hidden" />
                                                    <div className={`w-4 h-4 rounded-full border-2 ${accessBracelet ? 'border-purple-500' : 'border-slate-600'}`}></div>
                                                    <span className="text-xs font-black uppercase">სამაჯური</span>
                                                </label>

                                                <label className={`flex items-center space-x-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${accessCard ? 'bg-emerald-600/10 border-emerald-500 text-white' : 'bg-[#0d1117] border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                                                    <input type="checkbox" checked={accessCard} onChange={(e) => setAccessCard(e.target.checked)} className="hidden" />
                                                    <CreditCard size={16} className={accessCard ? 'text-emerald-400' : ''} />
                                                    <span className="text-xs font-black uppercase">ბარათი</span>
                                                </label>
                                            </div>

                                            {/* Inputs Logic */}
                                            <div className="space-y-4 pt-4 border-t border-slate-800">
                                                {accessBracelet && (
                                                    <div className="animate-fadeIn">
                                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">სამაჯურის კოდი</label>
                                                        <input
                                                            type="text"
                                                            value={braceletCode}
                                                            onChange={(e) => setBraceletCode(e.target.value)}
                                                            placeholder="SCANNED-CODE-123"
                                                            className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-white focus:border-purple-500 outline-none transition-all placeholder:text-slate-700"
                                                        />
                                                    </div>
                                                )}

                                                {accessCard && (
                                                    <div className="animate-fadeIn">
                                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">ბარათის კოდი</label>
                                                        <input
                                                            type="text"
                                                            value={cardCode}
                                                            onChange={(e) => setCardCode(e.target.value)}
                                                            placeholder="CARD-CODE-999"
                                                            className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-white focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700"
                                                        />
                                                    </div>
                                                )}

                                                {!accessBracelet && !accessCard && (
                                                    <p className="text-[10px] text-slate-600 font-bold uppercase text-center py-4">აირჩიეთ ფიზიკური დაშვების მეთოდი</p>
                                                )}
                                            </div>

                                            <button
                                                onClick={handleSaveAccess}
                                                disabled={savingAccess}
                                                className="w-full py-4 bg-[#1f2937] hover:bg-slate-700 text-white font-black rounded-2xl transition-all shadow-lg active:scale-95 uppercase text-xs tracking-widest flex items-center justify-center gap-2"
                                            >
                                                <Save size={16} />
                                                შენახვა
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 animate-fadeIn pt-8 border-t border-slate-800">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Activity Library */}
                                    <div className="lg:col-span-2 space-y-4">
                                        <h3 className="font-black text-white uppercase tracking-tight flex items-center mb-4">
                                            <ShoppingBag size={18} className="mr-2 text-blue-500" /> აქტივობების ბიბლიოთეკა
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {mockActivities.map((activity) => (
                                                <button
                                                    key={activity.id}
                                                    onClick={() => setSelectedActivity(activity)}
                                                    className={`p-6 rounded-[2rem] border text-left transition-all relative overflow-hidden group ${selectedActivity?.id === activity.id
                                                        ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-500/20'
                                                        : 'bg-[#161b22] border-slate-800 hover:border-slate-600 hover:bg-[#1c222c]'
                                                        }`}
                                                >
                                                    <div className="relative z-10">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest mb-2 block ${selectedActivity?.id === activity.id ? 'text-blue-200' : 'text-slate-500'}`}>
                                                            {activity.type}
                                                        </span>
                                                        <h4 className={`font-black text-lg mb-1 ${selectedActivity?.id === activity.id ? 'text-white' : 'text-white'}`}>
                                                            {activity.name}
                                                        </h4>
                                                        <div className={`text-xl font-black ${selectedActivity?.id === activity.id ? 'text-white' : 'text-emerald-400'}`}>
                                                            {activity.price} ₾
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="lg:col-span-1 space-y-4">
                                        <h3 className="font-black text-white uppercase tracking-tight flex items-center mb-4">
                                            <CreditCard size={18} className="mr-2 text-emerald-500" /> შეკვეთის დეტალები
                                        </h3>
                                        <div className="bg-[#161b22] rounded-[2.5rem] border border-slate-800 p-6 space-y-6">
                                            {/* Physical Access Add-ons */}
                                            <div>
                                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">დამატებითი ინვენტარი</h4>
                                                <div className="space-y-2">
                                                    <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${includeBracelet ? 'bg-purple-600/10 border-purple-500' : 'bg-[#0d1117] border-slate-800 hover:border-slate-600'}`}>
                                                        <div className="flex items-center space-x-2">
                                                            <input type="checkbox" checked={includeBracelet} onChange={(e) => setIncludeBracelet(e.target.checked)} className="hidden" />
                                                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${includeBracelet ? 'bg-purple-500 border-purple-500' : 'border-slate-600'}`}>
                                                                {includeBracelet && <CheckCircle size={10} className="text-white" />}
                                                            </div>
                                                            <span className={`text-xs font-bold ${includeBracelet ? 'text-white' : 'text-slate-400'}`}>სამაჯური</span>
                                                        </div>
                                                        <span className="text-xs font-black text-white">15 ₾</span>
                                                    </label>

                                                    <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${includeCard ? 'bg-emerald-600/10 border-emerald-500' : 'bg-[#0d1117] border-slate-800 hover:border-slate-600'}`}>
                                                        <div className="flex items-center space-x-2">
                                                            <input type="checkbox" checked={includeCard} onChange={(e) => setIncludeCard(e.target.checked)} className="hidden" />
                                                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${includeCard ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                                                                {includeCard && <CheckCircle size={10} className="text-white" />}
                                                            </div>
                                                            <span className={`text-xs font-bold ${includeCard ? 'text-white' : 'text-slate-400'}`}>ბარათი</span>
                                                        </div>
                                                        <span className="text-xs font-black text-white">10 ₾</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="border-t border-slate-800 pt-4 space-y-2">
                                                {selectedActivity && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-400">{selectedActivity.name}</span>
                                                        <span className="text-white font-bold">{selectedActivity.price} ₾</span>
                                                    </div>
                                                )}
                                                {includeBracelet && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-400">სამაჯური</span>
                                                        <span className="text-white font-bold">15 ₾</span>
                                                    </div>
                                                )}
                                                {includeCard && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-400">ბარათი</span>
                                                        <span className="text-white font-bold">10 ₾</span>
                                                    </div>
                                                )}
                                                <div className="border-t border-slate-800 pt-4 flex justify-between items-end">
                                                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">სულ გადასახდელი</span>
                                                    <span className="text-3xl font-black text-white">
                                                        {(selectedActivity ? selectedActivity.price : 0) + (includeBracelet ? 15 : 0) + (includeCard ? 10 : 0)} ₾
                                                    </span>
                                                </div>
                                            </div>

                                            <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 uppercase text-xs tracking-widest">
                                                ყიდვა / გააქტიურება
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    )}

                    {activeTab === 'HISTORY' && (
                        <div className="bg-[#161b22] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-xl animate-fadeIn">
                            <div className="p-8 border-b border-slate-800 bg-slate-900/30">
                                <h3 className="font-black text-white uppercase tracking-tight flex items-center">
                                    <History size={18} className="mr-2 text-slate-400" /> ისტორია
                                </h3>
                            </div>
                            <div className="p-0">
                                <table className="w-full">
                                    <thead className="bg-[#0d1117] border-b border-slate-800">
                                        <tr>
                                            <th className="px-8 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">თარიღი</th>
                                            <th className="px-8 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">დასახელება</th>
                                            <th className="px-8 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">ტიპი</th>
                                            <th className="px-8 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">თანხა</th>
                                            <th className="px-8 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">სტატუსი</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {mockHistory.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                                                <td className="px-8 py-5 text-sm font-bold text-slate-400">{item.date}</td>
                                                <td className="px-8 py-5 text-sm font-black text-white">{item.item}</td>
                                                <td className="px-8 py-5">
                                                    <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-[10px] font-black uppercase tracking-wider">{item.type}</span>
                                                </td>
                                                <td className="px-8 py-5 text-sm font-black text-white text-right">{item.amount} ₾</td>
                                                <td className="px-8 py-5 text-right">
                                                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded text-[10px] font-black uppercase tracking-wider">{item.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}


                    {/* Placeholder for other tabs */}
                    {activeTab !== 'PROFILE' && activeTab !== 'PURCHASE' && activeTab !== 'HISTORY' && (
                        <div className="bg-[#161b22] rounded-[2.5rem] border border-slate-800 p-20 text-center animate-fadeIn">
                            <AlertCircle size={48} className="text-slate-800 mx-auto mb-4" />
                            <h3 className="text-xl font-black text-white">{tabs.find(t => t.id === activeTab)?.label}</h3>
                            <p className="text-slate-500 mt-2">მონაცემები დამუშავების პროცესშია...</p>
                        </div>
                    )}

                </div>

                {/* Sidebar Cards */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Internal Notes */}
                    {activeTab === 'PROFILE' && (
                        <div className="bg-[#161b22] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-xl">
                            <div className="p-8 border-b border-slate-800 bg-slate-900/30">
                                <h3 className="font-black text-white uppercase tracking-tight">შიდა ჩანაწერები</h3>
                            </div>
                            <div className="p-8 space-y-6">
                                <textarea
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="დაამატეთ შენიშვნა მომხმარებლის პრეფერენციებზე..."
                                    className="w-full h-40 bg-[#0d1117] border border-slate-800 rounded-2xl p-6 text-sm font-medium text-slate-300 focus:border-blue-500 outline-none transition-all resize-none leading-relaxed"
                                />
                                <button className="w-full py-4 bg-[#1f2937] hover:bg-slate-700 text-white font-black rounded-2xl transition-all shadow-lg active:scale-95 uppercase text-xs tracking-widest">ჩანაწერის შენახვა</button>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions Card */}
                    <div className="bg-gradient-to-br from-blue-600/10 to-transparent p-8 rounded-[2.5rem] border border-blue-500/20 shadow-xl">
                        <h4 className="text-white font-black text-lg mb-6 flex items-center">
                            <AlertCircle size={20} className="mr-2 text-blue-400" /> სწრაფი მოქმედებები
                        </h4>
                        <div className="space-y-3">
                            <QuickActionButton label="აბონემენტის გაყინვა" />
                            <QuickActionButton label="ბალანსის შევსება" />
                            <QuickActionButton label="საშვის დაბლოკვა" isDanger />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .color-scheme-dark { color-scheme: dark; }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
            `}</style>
        </div>
    );
};

const DetailItem = ({ label, value, isStatus, isTier }: { label: string, value: string, isStatus?: boolean, isTier?: boolean }) => (
    <div className="space-y-1.5">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
        <p className={`text-base font-black ${isStatus ? 'text-emerald-500' :
            isTier ? 'text-amber-400 flex items-center gap-1.5' :
                'text-white'
            }`}>
            {isTier && <Star size={14} fill="currentColor" />}
            {value}
        </p>
    </div>
);

const QuickActionButton = ({ label, isDanger }: { label: string, isDanger?: boolean }) => (
    <button className={`w-full text-left px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-tighter transition-all border ${isDanger ? 'bg-red-500/5 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10 hover:text-white'
        }`}>
        {label}
    </button>
);
