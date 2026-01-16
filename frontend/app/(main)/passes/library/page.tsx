
'use client';
import React, { useState, useEffect } from 'react';
import { Package } from '@/app/types';
import { MOCK_EMPLOYEES } from '@/app/mock-data';
import {
    Ticket, CreditCard, Plus, ArrowLeft, User, Phone, MapPin, Mail,
    FileText, CheckCircle, Calendar, Clock, Users, Dumbbell, Tag,
    CalendarDays, Gift, ShoppingBag, UserCheck, Megaphone, Smartphone,
    Globe, X, Search, Filter
} from 'lucide-react';

// Helper for benefit names
const getBenefitName = (id: string): string => {
    const map: Record<string, string> = {
        'water': 'წყალი',
        'protein': 'პროტეინი',
        'vitamin': 'ვიტამინები',
        'towel': 'პირსახოცი',
        'sauna': 'საუნა',
        'parking': 'პარკინგი'
    };
    return map[id] || id;
};

export default function PassLibraryPage() {
    const [viewMode, setViewMode] = useState<'LIST' | 'ONETIME' | 'CREATE' | 'TYPE_SELECT'>('LIST');
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedModules, setSelectedModules] = useState<Record<string, boolean>>({});

    // Load active modules
    useEffect(() => {
        const loadModules = () => {
            const stored = localStorage.getItem('artron_active_modules');
            if (stored) {
                try {
                    setSelectedModules(JSON.parse(stored));
                } catch (e) {
                    console.error('Failed to parse active modules', e);
                }
            }
        };
        loadModules();
        window.addEventListener('storage', loadModules);
        return () => window.removeEventListener('storage', loadModules);
    }, []);

    // Promotion Modal State
    const [promotingId, setPromotingId] = useState<string | null>(null);

    // Form States (duplicated from PassesPage for independence)
    // One Time
    // One Time
    const [activity, setActivity] = useState<string>('workout');
    const [visitPrice, setVisitPrice] = useState<string>('20');
    // New Fields
    const [oneTimeMobile, setOneTimeMobile] = useState('');
    const [oneTimeEmail, setOneTimeEmail] = useState('');
    const [customActivity, setCustomActivity] = useState('');

    // ... (rest of state) ...





    // Create Package
    const [packageName, setPackageName] = useState<string>('');
    const [packageDescription, setPackageDescription] = useState<string>('');
    const [targetAge, setTargetAge] = useState<string>('ყველა');
    const [targetStatus, setTargetStatus] = useState<string>('ყველა');
    const [customStatus, setCustomStatus] = useState('');
    const [durationMode, setDurationMode] = useState<'unlimited' | 'limited' | 'days'>('unlimited');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [timeMode, setTimeMode] = useState<'full' | 'custom'>('full');
    const [maxParticipants, setMaxParticipants] = useState(1);
    const [packagePrice, setPackagePrice] = useState('');
    const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Additional Detailed State
    const [customStartTime, setCustomStartTime] = useState('09:00');
    const [customEndTime, setCustomEndTime] = useState('22:00');
    const [selectedTrainer, setSelectedTrainer] = useState('');
    const [trainerFee, setTrainerFee] = useState('');

    const benefitOptions = [
        { id: 'water', name: 'წყალი', icon: '💧', type: 'market' },
        { id: 'protein', name: 'პროტეინი', icon: '🥤', type: 'market' },
        { id: 'vitamin', name: 'ვიტამინები', icon: '💊', type: 'market' },
        { id: 'towel', name: 'პირსახოცი', icon: '🧖', type: 'service' },
        { id: 'sauna', name: 'საუნა', icon: '🔥', type: 'service' },
        { id: 'parking', name: 'პარკინგი', icon: '🅿️', type: 'service' }
    ];

    const toggleBenefit = (id: string) => {
        setSelectedBenefits(prev =>
            prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
        );
    };

    // Activity Type Selection
    const [selectedActivityType, setSelectedActivityType] = useState<'INDIVIDUAL' | 'GROUP' | 'CALENDAR' | null>(null);

    // Auto-fill logic based on selected type
    useEffect(() => {
        if (selectedActivityType === 'INDIVIDUAL') {
            setMaxParticipants(1);
            setPackageName('სტანდარტული (Fitness)');
        } else if (selectedActivityType === 'GROUP') {
            setMaxParticipants(10);
            setPackageName('იოგა ჯგუფი');
        } else if (selectedActivityType === 'CALENDAR') {
            setMaxParticipants(20);
            setPackageName('სემინარი');
        }
    }, [selectedActivityType]);

    useEffect(() => {
        fetchPackages();
    }, []); // Fetch immediately to populate dropdowns

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const res = await fetch(`${apiUrl}/api/passes`);
            if (res.ok) {
                const data = await res.json();
                // Since backend might return different shape, we adapt if needed.
                // Assuming backend returns array of Package-like objects.
                setPackages(data);
            }
        } catch (error) {
            console.error('Failed to fetch packages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePromoteClick = (id: string) => {
        setPromotingId(id);
    };

    const handleConfirmPromotion = (target: 'web' | 'mobile' | 'both' | 'none') => {
        // Optimistic update
        setPackages(prev => prev.map(p =>
            (p.id === promotingId || (p as any)._id === promotingId) ? { ...p, promotionTarget: target } : p
        ));
        // In real app, would call API here
        setPromotingId(null);
    };

    // Edit State
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleEditClick = (pkg: any) => {
        setEditingId(pkg.id || pkg._id);
        setPackageName(pkg.title || pkg.name);
        setPackageDescription(pkg.description || '');
        setPackagePrice(pkg.price?.toString() || '');
        setDurationMode(pkg.duration === 365 ? 'unlimited' : 'limited'); // Simplification
        setSelectedActivityType(pkg.type || 'INDIVIDUAL');

        // Populate benefits if available
        if (pkg.features) {
            setSelectedBenefits(pkg.features.split(','));
        }

        setViewMode('CREATE');
    };

    const handleCreatePackage = async () => {
        if (!packageName) return alert('სახელი სავალდებულოა');

        setIsSubmitting(true);
        const newPackage = {
            title: packageName,
            description: packageDescription,
            price: parseFloat(packagePrice || '0'),
            duration: durationMode === 'unlimited' ? 365 : 30, // simplification
            features: selectedBenefits.join(','),
            // mock other fields if backend doesn't support them yet or adaptation needed
            targetAge,
            targetStatus,
            durationMode,
            timeMode,
            maxParticipants,
            startTime: timeMode === 'custom' ? customStartTime : undefined,
            endTime: timeMode === 'custom' ? customEndTime : undefined,
            trainer: selectedTrainer,
            type: selectedActivityType // Pass the selected type if backend supports it
        };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

            let res;
            if (editingId) {
                res = await fetch(`${apiUrl}/api/passes/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newPackage)
                });
            } else {
                res = await fetch(`${apiUrl}/api/passes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newPackage)
                });
            }

            if (res.ok) {
                alert(editingId ? 'პაკეტი განახლდა' : 'პაკეტი შეიქმნა');
                setViewMode('LIST');
                // Reset
                setEditingId(null);
                setPackageName('');
                setPackagePrice('');
                setSelectedActivityType(null);
            } else {
                alert('შეცდომა');
            }
        } catch (e) {
            console.error(e);
            alert('ვერ უკავშირდება სერვერს');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- CHECK-IN LOGIC ---
    const handleCheckIn = async () => {
        // Find selected package to validate
        const selectedPkg = packages.find(p => (p.id || (p as any)._id) === activity);

        if (!selectedPkg && activity !== 'guest' && activity !== 'custom') {
            // Allow custom for now, but prioritize ID selection
        }

        const payload = {
            passId: activity === 'custom' || activity === 'guest' ? null : activity,
            guestName: 'Guest User', // Mock for now, should come from inputs
            guestPhone: oneTimeMobile
        };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const res = await fetch(`${apiUrl}/api/visits/check-in`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('✅ ვიზიტი გაცემულია წარმატებით!');
                setViewMode('LIST');
            } else {
                const err = await res.json();
                alert(`⛔️ შეცდომა: ${err.message || 'დაფიქსირდა პრობლემა'}`);
            }
        } catch (e) {
            console.error(e);
            alert('სერვერთან კავშირის შეცდომა');
        }
    };

    // --- RENDER: ONETIME ---
    if (viewMode === 'ONETIME') {
        return (
            <div className="max-w-4xl mx-auto mt-6 animate-fadeIn">
                <button
                    onClick={() => setViewMode('LIST')}
                    className="flex items-center text-slate-500 hover:text-white transition-colors mb-6 group"
                >
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">ბიბლიოთეკაში დაბრუნება</span>
                </button>

                <div className="bg-[#161b22] rounded-2xl shadow-xl border border-slate-800 p-8 text-center">
                    {/* Detailed One Time Visit Form */}
                    <div className="space-y-6 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-slate-400 text-sm mb-1 block">სახელი</label>
                                <input type="text" className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-slate-700 text-white focus:border-lime-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-slate-400 text-sm mb-1 block">გვარი</label>
                                <input type="text" className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-slate-700 text-white focus:border-lime-500 outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="text-slate-400 text-sm mb-1 block">პირადი ნომერი</label>
                            <input type="text" className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-slate-700 text-white focus:border-lime-500 outline-none" />
                        </div>

                        {/* New Contact Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-slate-400 text-sm mb-1 block">მობილურის ნომერი</label>
                                <input
                                    type="tel"
                                    value={oneTimeMobile}
                                    onChange={(e) => setOneTimeMobile(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-slate-700 text-white focus:border-lime-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-slate-400 text-sm mb-1 block">Email</label>
                                <input
                                    type="email"
                                    value={oneTimeEmail}
                                    onChange={(e) => setOneTimeEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-slate-700 text-white focus:border-lime-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-slate-400 text-sm mb-1 block">აქტივობა</label>
                                <div className="space-y-2">
                                    <select
                                        className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-slate-700 text-white focus:border-lime-500 outline-none appearance-none font-medium"
                                        value={activity}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setActivity(val);
                                            // Auto-set price if package found
                                            const pkg = packages.find(p => (p.id || (p as any)._id) === val);
                                            if (pkg) {
                                                setVisitPrice(pkg.price.toString());
                                            } else if (val === 'guest') {
                                                setVisitPrice('0');
                                            }
                                        }}
                                    >
                                        <option value="" disabled>აირჩიეთ...</option>
                                        <optgroup label="აქტიური პაკეტები">
                                            {packages.map(p => (
                                                <option key={p.id || (p as any)._id} value={p.id || (p as any)._id}>
                                                    {p.name || p.title} ({p.type === 'GROUP' ? `ჯგუფი` : 'ინდ.'})
                                                </option>
                                            ))}
                                        </optgroup>
                                        <optgroup label="სხვა">
                                            <option value="guest">სტუმარი</option>
                                            <option value="custom">სხვა... (ხელით შეყვანა)</option>
                                        </optgroup>
                                    </select>

                                    {/* Custom Activity Input */}
                                    {activity === 'custom' && (
                                        <input
                                            type="text"
                                            placeholder="ჩაწერეთ აქტივობის დასახელება"
                                            value={customActivity}
                                            onChange={(e) => setCustomActivity(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-lime-500 text-white focus:ring-1 focus:ring-lime-500 outline-none animate-fadeIn"
                                            autoFocus
                                        />
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="text-slate-400 text-sm mb-1 block">ფასი</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₾</span>
                                    <input
                                        type="number"
                                        value={visitPrice}
                                        onChange={(e) => setVisitPrice(e.target.value)}
                                        className="w-full pl-8 pr-4 py-3 rounded-lg bg-[#0d1117] border border-slate-700 text-white focus:border-lime-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-slate-400 text-sm mb-1 block">კომენტარი</label>
                            <textarea className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-slate-700 text-white focus:border-lime-500 outline-none h-20 resize-none" />
                        </div>

                        <button
                            onClick={handleCheckIn}
                            className="w-full py-4 bg-lime-500 text-slate-900 font-bold rounded-xl hover:bg-lime-400 transition-colors shadow-lg shadow-lime-500/20"
                        >
                            ვიზიტის გაცემა
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER: LIST ---
    if (viewMode === 'LIST') {
        return (
            <div className="space-y-6 relative animate-fadeIn">
                {/* Top Action Cards */}
                {/* Top Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {selectedModules['activity_onetime'] && (
                        <button
                            onClick={() => setViewMode('ONETIME')}
                            className="bg-[#161b22] p-5 rounded-2xl border border-slate-800 hover:border-lime-500 hover:shadow-lg transition-all duration-200 flex flex-col items-start group text-left h-full"
                        >
                            <div className="flex w-full justify-between items-start mb-3">
                                <div className="bg-lime-500/10 text-lime-500 p-3 rounded-xl group-hover:bg-lime-500 group-hover:text-slate-900 transition-colors">
                                    <Ticket size={24} />
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-lime-500">
                                    <Plus size={20} />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg group-hover:text-lime-400 transition-colors">ერთჯერადი</h3>
                                <p className="text-xs text-slate-500 mt-1 leading-snug">სწრაფი საშვის გაცემა</p>
                            </div>
                        </button>
                    )}

                    {selectedModules['activity_individual'] && (
                        <button
                            onClick={() => {
                                setSelectedActivityType('INDIVIDUAL');
                                setViewMode('CREATE');
                            }}
                            className="bg-[#161b22] p-5 rounded-2xl border border-slate-800 hover:border-emerald-500 hover:shadow-lg transition-all duration-200 flex flex-col items-start group text-left h-full"
                        >
                            <div className="flex w-full justify-between items-start mb-3">
                                <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                    <User size={24} />
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500">
                                    <Plus size={20} />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors">ინდივიდუალური</h3>
                                <p className="text-xs text-slate-500 mt-1 leading-snug">აბონემენტის შექმნა</p>
                            </div>
                        </button>
                    )}

                    {selectedModules['activity_group'] && (
                        <button
                            onClick={() => {
                                setSelectedActivityType('GROUP');
                                setViewMode('CREATE');
                            }}
                            className="bg-[#161b22] p-5 rounded-2xl border border-slate-800 hover:border-purple-500 hover:shadow-lg transition-all duration-200 flex flex-col items-start group text-left h-full"
                        >
                            <div className="flex w-full justify-between items-start mb-3">
                                <div className="bg-purple-500/10 text-purple-500 p-3 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                    <Users size={24} />
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-500">
                                    <Plus size={20} />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg group-hover:text-purple-400 transition-colors">ჯგუფური</h3>
                                <p className="text-xs text-slate-500 mt-1 leading-snug">ჯგუფური ვარჯიში</p>
                            </div>
                        </button>
                    )}

                    {selectedModules['activity_calendar'] && (
                        <button
                            onClick={() => {
                                setSelectedActivityType('CALENDAR');
                                setViewMode('CREATE');
                            }}
                            className="bg-[#161b22] p-5 rounded-2xl border border-slate-800 hover:border-amber-500 hover:shadow-lg transition-all duration-200 flex flex-col items-start group text-left h-full"
                        >
                            <div className="flex w-full justify-between items-start mb-3">
                                <div className="bg-amber-500/10 text-amber-500 p-3 rounded-xl group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
                                    <Calendar size={24} />
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-500">
                                    <Plus size={20} />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg group-hover:text-amber-400 transition-colors">კალენდარული</h3>
                                <p className="text-xs text-slate-500 mt-1 leading-snug">ღონისძიება / სემინარი</p>
                            </div>
                        </button>
                    )}
                </div>

                <div className="flex justify-between items-center pt-2">
                    <div>
                        <h2 className="text-xl font-bold text-white">აქტივობის ბიბლიოთეკა</h2>
                        <p className="text-slate-500 text-sm">აქტიური პაკეტების ჩამონათვალი და მართვა</p>
                    </div>
                    <div className="bg-[#161b22] border border-slate-700 text-slate-400 px-4 py-2.5 rounded-xl text-sm font-medium">
                        სულ: {packages.length} პაკეტი
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packages.map((pkg) => (
                            <div key={pkg.id || (pkg as any)._id} className="bg-[#161b22] rounded-2xl border border-slate-800 overflow-hidden hover:shadow-lg hover:border-slate-700 transition-all duration-300 flex flex-col relative group">

                                {/* Promotion Badge */}
                                {pkg.promotionTarget && pkg.promotionTarget !== 'none' && (
                                    <div className="absolute top-0 right-0 bg-lime-400 text-slate-900 text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl z-10 flex items-center space-x-1 shadow-md">
                                        <Megaphone size={12} />
                                        <span>
                                            {pkg.promotionTarget === 'web' ? 'WEB PROMO' :
                                                pkg.promotionTarget === 'mobile' ? 'APP PROMO' : 'ALL PROMO'}
                                        </span>
                                    </div>
                                )}

                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-lime-500/10 text-lime-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                            {pkg.durationMode === 'unlimited' ? 'ულიმიტო' : 'ლიმიტირებული'}
                                        </div>
                                        <div className="text-xl font-bold text-emerald-500">
                                            ₾{pkg.price}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2">{pkg.name || pkg.title}</h3>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {pkg.targetAge && pkg.targetAge !== 'ყველა' && (
                                            <span className="flex items-center px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase">
                                                <Users size={10} className="mr-1" /> {pkg.targetAge}
                                            </span>
                                        )}
                                        {pkg.targetStatus && pkg.targetStatus !== 'ყველა' && (
                                            <span className="flex items-center px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase">
                                                <UserCheck size={10} className="mr-1" /> {pkg.targetStatus}
                                            </span>
                                        )}
                                    </div>

                                    {pkg.description && (
                                        <p className="text-slate-500 text-xs mb-4 line-clamp-2 italic">{pkg.description}</p>
                                    )}

                                    <div className="space-y-3 mt-4">
                                        <div className="flex items-center text-slate-500 text-sm">
                                            <Clock size={16} className="mr-2 text-slate-600" />
                                            <span>
                                                {pkg.timeMode === 'full'
                                                    ? '24 საათიანი დაშვება'
                                                    : `${pkg.startTime || '??'} - ${pkg.endTime || '??'} საათობრივი`}
                                            </span>
                                        </div>

                                        <div className="flex items-center text-slate-500 text-sm">
                                            <User size={16} className="mr-2 text-slate-600" />
                                            <span>
                                                {pkg.maxParticipants > 1
                                                    ? `ჯგუფი (${pkg.maxParticipants} წევრი)`
                                                    : 'ინდივიდუალური'}
                                            </span>
                                        </div>
                                    </div>

                                    {pkg.benefits && pkg.benefits.length > 0 && (
                                        <div className="mt-6 pt-4 border-t border-slate-800">
                                            <p className="text-xs font-bold text-slate-600 uppercase mb-2">ბენეფიტები</p>
                                            <div className="flex flex-wrap gap-2">
                                                {pkg.benefits.map((b) => (
                                                    <span key={b} className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 text-xs font-medium">
                                                        {['water', 'protein', 'vitamin'].includes(b) && (
                                                            <ShoppingBag size={10} className="mr-1 text-amber-500" />
                                                        )}
                                                        {getBenefitName(b)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-[#0d1117] px-6 py-4 border-t border-slate-800 flex justify-between items-center">
                                    <span className="text-xs text-slate-600">ID: {(pkg.id || (pkg as any)._id || '').slice(-6)}</span>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handlePromoteClick(pkg.id || (pkg as any)._id)}
                                            className="text-sm font-medium text-slate-500 hover:text-lime-400 flex items-center transition-colors"
                                            title="რეკლამირება"
                                        >
                                            <Megaphone size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleEditClick(pkg)}
                                            className="text-sm font-medium text-lime-600 hover:text-lime-500"
                                        >
                                            რედაქტირება
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Promotion Modal */}
                {promotingId && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                        <div className="bg-[#161b22] rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-700">
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#0d1117]">
                                <h3 className="text-lg font-bold text-white flex items-center">
                                    <Megaphone size={20} className="mr-2 text-lime-500" />
                                    პაკეტის რეკლამირება
                                </h3>
                                <button onClick={() => setPromotingId(null)} className="text-slate-500 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6">
                                <p className="text-slate-400 text-sm mb-6">აირჩიეთ პლატფორმა, სადაც გსურთ რომ გამოჩნდეს ეს პაკეტი სარეკლამო/აქციის სახით.</p>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleConfirmPromotion('web')}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-700 hover:border-lime-500 hover:bg-lime-500/10 transition-all group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-lime-500 group-hover:text-slate-900 text-slate-400 transition-colors">
                                                <Globe size={20} />
                                            </div>
                                            <span className="font-medium text-slate-300 group-hover:text-white">მხოლოდ ვებ-გვერდზე</span>
                                        </div>
                                        <CheckCircle size={18} className="text-transparent group-hover:text-lime-500" />
                                    </button>

                                    <button
                                        onClick={() => handleConfirmPromotion('mobile')}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-700 hover:border-lime-500 hover:bg-lime-500/10 transition-all group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-lime-500 group-hover:text-slate-900 text-slate-400 transition-colors">
                                                <Smartphone size={20} />
                                            </div>
                                            <span className="font-medium text-slate-300 group-hover:text-white">მობილურ აპლიკაციაში</span>
                                        </div>
                                        <CheckCircle size={18} className="text-transparent group-hover:text-lime-500" />
                                    </button>

                                    <button
                                        onClick={() => handleConfirmPromotion('both')}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-700 hover:border-lime-500 hover:bg-lime-500/10 transition-all group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-lime-500 group-hover:text-slate-900 text-slate-400 transition-colors">
                                                <Megaphone size={20} />
                                            </div>
                                            <span className="font-medium text-slate-300 group-hover:text-white">ყველა პლატფორმაზე</span>
                                        </div>
                                        <CheckCircle size={18} className="text-transparent group-hover:text-lime-500" />
                                    </button>

                                    <button
                                        onClick={() => handleConfirmPromotion('none')}
                                        className="w-full text-center py-3 text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-medium mt-2"
                                    >
                                        რეკლამის გამორთვა
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // --- RENDER: ACTIVITY TYPE SELECTION ---
    if (viewMode === 'TYPE_SELECT') {
        return (
            <div className="max-w-4xl mx-auto mt-6 animate-fadeIn">
                <button
                    onClick={() => setViewMode('LIST')}
                    className="flex items-center text-slate-500 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">ბიბლიოთეკაში დაბრუნება</span>
                </button>

                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold text-white mb-2">აირჩიეთ აქტივობის ტიპი</h2>
                    <p className="text-slate-500">როგორი სახის აქტივობის დამატება გსურთ?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Individual */}
                    <button
                        onClick={() => {
                            setSelectedActivityType('INDIVIDUAL');
                            setViewMode('CREATE');
                        }}
                        className="group bg-[#161b22] border border-slate-800 p-8 rounded-3xl hover:border-emerald-500 hover:bg-emerald-500/5 transition-all duration-300 text-center flex flex-col items-center hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20"
                    >
                        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-slate-400 mb-6 group-hover:bg-emerald-500 group-hover:text-slate-900 transition-all">
                            <User size={36} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">ინდივიდუალური</h3>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                            სტანდარტული აბონემენტი ერთი მომხმარებლისთვის
                        </p>
                    </button>

                    {/* Group */}
                    <button
                        onClick={() => {
                            setSelectedActivityType('GROUP');
                            setViewMode('CREATE');
                        }}
                        className="group bg-[#161b22] border border-slate-800 p-8 rounded-3xl hover:border-purple-500 hover:bg-purple-500/5 transition-all duration-300 text-center flex flex-col items-center hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20"
                    >
                        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-slate-400 mb-6 group-hover:bg-purple-500 group-hover:text-white transition-all">
                            <Users size={36} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">ჯგუფური</h3>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                            ჯგუფური ვარჯიშები, იოგა, პილატესი და ა.შ.
                        </p>
                    </button>

                    {/* Calendar */}
                    <button
                        onClick={() => {
                            setSelectedActivityType('CALENDAR');
                            setViewMode('CREATE');
                        }}
                        className="group bg-[#161b22] border border-slate-800 p-8 rounded-3xl hover:border-amber-500 hover:bg-amber-500/5 transition-all duration-300 text-center flex flex-col items-center hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/20"
                    >
                        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-slate-400 mb-6 group-hover:bg-amber-500 group-hover:text-slate-900 transition-all">
                            <Calendar size={36} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">კალენდარული</h3>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                            ღონისძიებები, სემინარები და დროებითი აქტივობები
                        </p>
                    </button>
                </div>
            </div>
        );
    }

    // --- RENDER: ONETIME & CREATE ---
    // For brevity, we render simplified versions or reuse components if extracted.
    // Given user wants "migration" of PassLibraryView, and it contained these forms, we interpret this as needing them.
    // Since I already wrote them in PassesPage, I am essentially maintaining two similar pages as per request.

    if (viewMode === 'CREATE') {
        return (
            <div className="max-w-4xl mx-auto mt-6 animate-fadeIn">
                <button
                    onClick={() => setViewMode('TYPE_SELECT')}
                    className="flex items-center text-slate-500 hover:text-white transition-colors mb-6 group"
                >
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">უკან დაბრუნება</span>
                </button>

                <div className="bg-[#161b22] rounded-2xl shadow-xl border border-slate-800 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">{editingId ? 'აქტივობის რედაქტირება' : 'ახალი აქტივობის დამატება'}</h2>

                        {selectedActivityType && (
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2
                                ${selectedActivityType === 'INDIVIDUAL' ? 'bg-emerald-500/10 text-emerald-500' :
                                    selectedActivityType === 'GROUP' ? 'bg-purple-500/10 text-purple-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                {selectedActivityType === 'INDIVIDUAL' && <User size={12} />}
                                {selectedActivityType === 'GROUP' && <Users size={12} />}
                                {selectedActivityType === 'CALENDAR' && <Calendar size={12} />}
                                <span>{
                                    selectedActivityType === 'INDIVIDUAL' ? 'ინდივიდუალური' :
                                        selectedActivityType === 'GROUP' ? 'ჯგუფური' : 'კალენდარული'
                                }</span>
                            </div>
                        )}
                    </div>

                    {/* Detailed Creation Form */}
                    <div className="space-y-8">
                        {/* 1. Name Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-400 flex items-center">
                                <Tag size={16} className="mr-2 text-slate-500" />
                                1. აქტივობის დასახელება
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <select
                                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-all font-medium appearance-none"
                                    onChange={(e) => setPackageName(e.target.value)}
                                    value={packageName}
                                >
                                    <option value="" disabled>აირჩიეთ ტიპი...</option>
                                    <option value="სტანდარტული (Fitness)">სტანდარტული (Fitness)</option>
                                    <option value="პრემიუმი (Fitness + Spa)">პრემიუმი (Fitness + Spa)</option>
                                    <option value="Gold (All Access)">Gold (All Access)</option>
                                    <option value="იოგა ჯგუფი">იოგა ჯგუფი</option>
                                    <option value="ბოქსი ინდივიდუალური">ბოქსი ინდივიდუალური</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="ან ჩაწერეთ ახალი დასახელება"
                                    value={packageName}
                                    onChange={(e) => setPackageName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Description Field */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-400 flex items-center">
                                <FileText size={16} className="mr-2 text-slate-500" />
                                აქტივობის აღწერა
                            </label>
                            <textarea
                                placeholder="შეიყვანეთ პაკეტის დეტალური აღწერა..."
                                value={packageDescription}
                                onChange={e => setPackageDescription(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-all h-24 resize-none"
                            />
                        </div>

                        {/* Target Age and Status Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-400 flex items-center">
                                    <Users size={16} className="mr-2 text-slate-500" />
                                    ასაკობრივი კატეგორია
                                </label>
                                <select
                                    value={targetAge}
                                    onChange={(e) => setTargetAge(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-all appearance-none font-medium"
                                >
                                    <option value="ყველა">ყველა ასაკი</option>
                                    <option value="18 წლამდე">18 წლამდე</option>
                                    <option value="18-60 წელი">18-60 წელი</option>
                                    <option value="60+ წელი">60+ წელი</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-400 flex items-center">
                                    <UserCheck size={16} className="mr-2 text-slate-500" />
                                    მიზნობრივი სტატუსი
                                </label>
                                <select
                                    value={targetStatus}
                                    onChange={(e) => setTargetStatus(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-all appearance-none font-medium"
                                >
                                    <option value="ყველა">ყველა სტატუსი</option>
                                    <option value="სტანდარტული">სტანდარტული</option>
                                    <option value="სტუდენტი">სტუდენტი</option>
                                    <option value="მოსწავლე">მოსწავლე</option>
                                    <option value="დასაქმებული">დასაქმებული</option>
                                    <option value="პენსიონერი">პენსიონერი</option>
                                    <option value="კორპორატიული">კორპორატიული</option>
                                    <option value="custom">სხვა (მითითება...)</option>
                                </select>
                                {targetStatus === 'custom' && (
                                    <input
                                        type="text"
                                        placeholder="მიუთითეთ სტატუსი"
                                        value={customStatus}
                                        onChange={(e) => setCustomStatus(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none animate-fadeIn"
                                    />
                                )}
                            </div>
                        </div>

                        {/* 2. Duration / Validity */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-400 flex items-center">
                                <CalendarDays size={16} className="mr-2 text-slate-500" />
                                2. პაკეტის ვადა
                            </label>
                            <div className="flex space-x-4 mb-4">
                                {selectedActivityType !== 'CALENDAR' && (
                                    <label className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${durationMode === 'unlimited' ? 'border-lime-500 bg-lime-500/10 text-white' : 'border-slate-800 hover:border-slate-700 text-slate-500'}`}>
                                        <input
                                            type="radio"
                                            name="duration"
                                            className="hidden"
                                            checked={durationMode === 'unlimited'}
                                            onChange={() => setDurationMode('unlimited')}
                                        />
                                        <span className="font-medium">ულიმიტო დროით</span>
                                    </label>
                                )}
                                <label className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${durationMode === 'limited' ? 'border-lime-500 bg-lime-500/10 text-white' : 'border-slate-800 hover:border-slate-700 text-slate-500'}`}>
                                    <input
                                        type="radio"
                                        name="duration"
                                        className="hidden"
                                        checked={durationMode === 'limited'}
                                        onChange={() => setDurationMode('limited')}
                                    />
                                    <span className="font-medium">ლიმიტირებული (თარიღებით)</span>
                                </label>
                                {selectedActivityType === 'CALENDAR' && (
                                    <label className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${durationMode === 'days' ? 'border-lime-500 bg-lime-500/10 text-white' : 'border-slate-800 hover:border-slate-700 text-slate-500'}`}>
                                        <input
                                            type="radio"
                                            name="duration"
                                            className="hidden"
                                            checked={durationMode === 'days'}
                                            onChange={() => setDurationMode('days')}
                                        />
                                        <span className="font-medium">ლიმიტირებული (დღეებით)</span>
                                    </label>
                                )}
                            </div>

                            {durationMode === 'limited' && (
                                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 animate-fadeIn">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-xs text-slate-500 font-medium ml-1">დასაწყისი</span>
                                            <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-[#0d1117] text-white outline-none focus:border-lime-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-slate-500 font-medium ml-1">დასასრული</span>
                                            <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-[#0d1117] text-white outline-none focus:border-lime-500" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {durationMode === 'days' && (
                                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 animate-fadeIn">
                                    <label className="text-xs text-slate-500 font-medium block mb-3">აირჩიეთ დღეები</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვი'].map((day) => (
                                            <button
                                                key={day}
                                                onClick={() => setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedDays.includes(day)
                                                    ? 'bg-lime-500 text-slate-900'
                                                    : 'bg-[#0d1117] border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                                                    }`}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. Hourly Constraints */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-400 flex items-center">
                                <Clock size={16} className="mr-2 text-slate-500" />
                                3. საათობრივი დაშვება
                            </label>

                            <div className="flex items-center space-x-6 mb-3">
                                <label className="flex items-center cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="timeMode"
                                        className="w-4 h-4 text-lime-500 focus:ring-lime-500 border-gray-600 bg-transparent"
                                        checked={timeMode === 'full'}
                                        onChange={() => setTimeMode('full')}
                                    />
                                    <span className="ml-2 text-sm text-slate-500 group-hover:text-white">სრული დღე (24სთ)</span>
                                </label>
                                <label className="flex items-center cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="timeMode"
                                        className="w-4 h-4 text-lime-500 focus:ring-lime-500 border-gray-600 bg-transparent"
                                        checked={timeMode === 'custom'}
                                        onChange={() => setTimeMode('custom')}
                                    />
                                    <span className="ml-2 text-sm text-slate-500 group-hover:text-white">საათების არჩევა</span>
                                </label>
                            </div>

                            {timeMode === 'custom' && (
                                <div className="flex items-center space-x-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                    <div className="flex-1">
                                        <span className="text-xs text-slate-500 block mb-1">დან</span>
                                        <input
                                            type="time"
                                            className="w-full px-3 py-2 rounded border border-slate-700 bg-[#0d1117] text-white outline-none focus:border-lime-500"
                                            value={customStartTime}
                                            onChange={(e) => setCustomStartTime(e.target.value)}
                                        />
                                    </div>
                                    <span className="text-slate-600 mt-4">-</span>
                                    <div className="flex-1">
                                        <span className="text-xs text-slate-500 block mb-1">მდე</span>
                                        <input
                                            type="time"
                                            className="w-full px-3 py-2 rounded border border-slate-700 bg-[#0d1117] text-white outline-none focus:border-lime-500"
                                            value={customEndTime}
                                            onChange={(e) => setCustomEndTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 4. Participant Limit & 5. Trainer */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-400 flex items-center">
                                    <Users size={16} className="mr-2 text-slate-500" />
                                    4. ხალხის რაოდენობა
                                </label>
                                <input
                                    type="number"
                                    placeholder="მაგ: 1 (ინდივიდუალური)"
                                    min={selectedActivityType === 'GROUP' ? "2" : "1"}
                                    value={selectedActivityType === 'INDIVIDUAL' ? 1 : maxParticipants}
                                    onChange={(e) => {
                                        if (selectedActivityType !== 'INDIVIDUAL') {
                                            const minVal = selectedActivityType === 'GROUP' ? 2 : 1;
                                            setMaxParticipants(parseInt(e.target.value) || minVal);
                                        }
                                    }}
                                    disabled={selectedActivityType === 'INDIVIDUAL'}
                                    className={`w-full px-4 py-3 rounded-lg border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-all font-medium ${selectedActivityType === 'INDIVIDUAL' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                                <p className="text-xs text-slate-500">
                                    {selectedActivityType === 'INDIVIDUAL' ? 'ინდივიდუალური პაკეტი (1 წევრი)' : 'მიუთითეთ რამდენი ადამიანისთვისაა პაკეტი'}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-400 flex items-center">
                                    <Dumbbell size={16} className="mr-2 text-slate-500" />
                                    5. ტრენერი (არასავალდებულო)
                                </label>
                                <select
                                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-all appearance-none font-medium"
                                    value={selectedTrainer}
                                    onChange={(e) => setSelectedTrainer(e.target.value)}
                                >
                                    <option value="">ტრენერის გარეშე</option>
                                    {MOCK_EMPLOYEES
                                        .filter(emp => emp.department.includes('ფიტნეს') || emp.position.includes('Mწვრთნელი') || emp.position.includes('Coach') || emp.position.includes('ტრენერი') || emp.position.includes('ინსტრუქტორი'))
                                        .map(trainer => (
                                            <option key={trainer.id} value={trainer.fullName}>{trainer.fullName} - {trainer.position}</option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        {/* 6. Benefits Section */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-400 flex items-center justify-between">
                                <div className="flex items-center">
                                    <Gift size={16} className="mr-2 text-slate-500" />
                                    6. პაკეტის ბენეფიტები
                                </div>
                                <span className="text-xs text-slate-500 font-normal">არჩეული ბენეფიტები ჩაირთვება პაკეტში</span>
                            </label>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {benefitOptions.map((benefit) => {
                                    const isSelected = selectedBenefits.includes(benefit.id);
                                    return (
                                        <div
                                            key={benefit.id}
                                            onClick={() => toggleBenefit(benefit.id)}
                                            className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                                ? 'border-lime-500 bg-lime-500/10'
                                                : 'border-slate-800 bg-[#0d1117] hover:border-slate-700'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="text-xl">{benefit.icon}</span>
                                                <span className={`text-sm font-bold ${isSelected ? 'text-lime-500' : 'text-slate-400'}`}>
                                                    {benefit.name}
                                                </span>
                                            </div>

                                            {/* Selection Indicator */}
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 text-lime-500">
                                                    <CheckCircle size={14} fill="currentColor" className="text-white" />
                                                </div>
                                            )}

                                            {/* Logic Badge */}
                                            {isSelected && benefit.type === 'market' && (
                                                <div className="flex items-center text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded mt-2 w-fit">
                                                    <ShoppingBag size={10} className="mr-1" />
                                                    <span>აკლდება მარაგს</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 7. Price Section */}
                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">პაკეტის ფასი</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xl">₾</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={packagePrice}
                                        onChange={(e) => setPackagePrice(e.target.value)}
                                        className="w-full pl-10 pr-4 py-4 rounded-xl border border-slate-700 bg-[#0d1117] focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-all font-bold text-2xl text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between text-sm">
                            </div>
                            {selectedBenefits.some(id => benefitOptions.find(b => b.id === id)?.type === 'market') && (
                                <div className="flex justify-between text-sm text-amber-500">
                                    <span className="flex items-center"><ShoppingBag size={12} className="mr-1" /> მარკეტი</span>
                                    <span className="font-medium text-xs">ავტომატური ჩამოჭრა</span>
                                </div>
                            )}
                        </div>
                        {selectedTrainer && (
                            <div className="p-4 bg-lime-500/10 rounded-xl border border-lime-500/20 flex justify-between items-center animate-fadeIn">
                                <div>
                                    <span className="text-xs font-bold text-lime-500 uppercase tracking-wider block">სრული ღირებულება</span>
                                    <span className="text-[10px] text-slate-400">პაკეტი + ტრენერი</span>
                                </div>
                                <div className="text-2xl font-black text-lime-500">
                                    ₾{((parseFloat(packagePrice) || 0) + (parseFloat(trainerFee) || 0)).toFixed(2)}
                                </div>
                            </div>
                        )}
                    </div>


                    <button
                        onClick={handleCreatePackage}
                        disabled={isSubmitting}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl mt-4"
                    >
                        {isSubmitting ? 'ემატება...' : 'დამატება'}
                    </button>
                </div>
            </div>

        );
    }

    if (viewMode === 'ONETIME') {
        return (
            <div className="max-w-4xl mx-auto mt-6 animate-fadeIn">
                <button
                    onClick={() => setViewMode('LIST')}
                    className="flex items-center text-slate-500 hover:text-white transition-colors mb-6 group"
                >
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">ბიბლიოთეკაში დაბრუნება</span>
                </button>

                <div className="bg-[#161b22] rounded-2xl shadow-xl border border-slate-800 p-8 text-center">
                    {/* Detailed One Time Visit Form */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-slate-400 text-sm mb-1 block">სახელი</label>
                                <input type="text" className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-slate-700 text-white focus:border-lime-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-slate-400 text-sm mb-1 block">გვარი</label>
                                <input type="text" className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-slate-700 text-white focus:border-lime-500 outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="text-slate-400 text-sm mb-1 block">პირადი ნომერი</label>
                            <input type="text" className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-slate-700 text-white focus:border-lime-500 outline-none" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-slate-400 text-sm mb-1 block">აქტივობა</label>
                                <select
                                    className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-slate-700 text-white focus:border-lime-500 outline-none appearance-none"
                                    value={activity}
                                    onChange={(e) => setActivity(e.target.value)}
                                >
                                    <option value="workout">ეულჯერადი ვარჯიში</option>
                                    <option value="pool">აუზი</option>
                                    <option value="sauna">საუნა</option>
                                    <option value="solarium">სოლარიუმი</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-slate-400 text-sm mb-1 block">ფასი</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₾</span>
                                    <input
                                        type="number"
                                        value={visitPrice}
                                        onChange={(e) => setVisitPrice(e.target.value)}
                                        className="w-full pl-8 pr-4 py-3 rounded-lg bg-[#0d1117] border border-slate-700 text-white focus:border-lime-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-slate-400 text-sm mb-1 block">კომენტარი</label>
                            <textarea className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-slate-700 text-white focus:border-lime-500 outline-none h-20 resize-none" />
                        </div>

                        <button className="w-full py-4 bg-lime-500 text-slate-900 font-bold rounded-xl hover:bg-lime-400 transition-colors shadow-lg shadow-lime-500/20">
                            ვიზიტის გაცემა
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
