import React, { useState } from 'react';
import { X, Calendar, Droplet, Accessibility } from 'lucide-react';



interface UserFilterPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
    onReset: () => void;
    availableCountries?: string[];
}

export default function UserFilterPanel({ isOpen, onClose, onApply, onReset, availableCountries = [] }: UserFilterPanelProps) {
    if (!isOpen) return null;

    // Local State for filters
    const [filters, setFilters] = useState({
        email: '',
        phone: '',
        personalId: '',
        program: 'All Programs',
        rank: 'All',
        paymentMethod: 'All',
        documents: 'All',
        joinedAfter: '',
        membershipEndDate: '',
        birthdayMonth: 'All',
        gender: 'All',
        membership: 'All',
        billingStatus: 'All',
        weightClass: 'All',
        uniformSize: '',
        ageFrom: '',
        ageTo: '',
        scoreFrom: '',
        scoreTo: '',
        activityCount: '',
        citizenship: 'All',
        bloodGroup: 'All',
        isPwd: 'All',
        experience: 'All',
        mainGoal: 'All',
        referralSource: 'All',
        isCorporate: 'All',
        referralInvite: '',
        status: 'All', // Active or Paused
        groupType: 'All'
    });

    const handleChange = (field: string, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    return (

        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[40] bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            ></div>

            {/* Panel */}
            <div className="absolute top-full left-0 mt-3 w-[700px] lg:w-[840px] bg-[#161b22] rounded-2xl shadow-[0_0_40px_-10px_rgba(132,204,22,0.3)] border border-lime-500/30 z-[50] animate-scaleIn origin-top-left animated-border">
                {/* Arrow Pointer */}
                <div className="absolute -top-2 left-8 w-4 h-4 bg-[#161b22] transform rotate-45 border-t border-l border-lime-500 z-[60]"></div>

                {/* Content Wrapper */}
                <div className="p-5 max-h-[80vh] overflow-y-auto custom-scrollbar rounded-2xl relative z-[55]">
                    <div className="space-y-4">

                        {/* Section 1: Personal Info & Contact */}
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 mr-2 shadow-[0_0_10px_rgba(132,204,22,0.5)]"></span>
                                პირადი ინფორმაცია
                            </h4>

                            <div className="grid grid-cols-4 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">ელ. ფოსტა</label>
                                    <input
                                        type="text"
                                        value={filters.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        className="w-full px-3 py-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                                        placeholder="..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">ტელეფონი</label>
                                    <input
                                        type="text"
                                        value={filters.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        className="w-full px-3 py-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                                        placeholder="..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">პირადი ნომერი</label>
                                    <input
                                        type="text"
                                        value={filters.personalId}
                                        onChange={(e) => handleChange('personalId', e.target.value)}
                                        className="w-full px-3 py-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                                        placeholder="..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">მოქალაქეობა</label>
                                    <select
                                        value={filters.citizenship}
                                        onChange={(e) => handleChange('citizenship', e.target.value)}
                                        className="w-full px-3 py-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-xs text-slate-300 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="All">ყველა</option>
                                        {availableCountries && availableCountries.length > 0 ? (
                                            availableCountries.map((country) => (
                                                <option key={country} value={country}>
                                                    {country === 'GE' || country === 'Georgia' ? 'საქართველო' : country}
                                                </option>
                                            ))
                                        ) : (
                                            <>
                                                <option value="Georgia">საქართველო</option>
                                                <option value="Other">უცხო ქვეყანა</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Demographics */}
                        <div className="border-t border-slate-800 pt-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                                დემოგრაფია
                            </h4>
                            <div className="grid grid-cols-4 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">ასაკი</label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="number"
                                            value={filters.ageFrom}
                                            onChange={(e) => handleChange('ageFrom', e.target.value)}
                                            className="w-full px-2 py-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-emerald-500 transition-all text-center placeholder:text-slate-600"
                                            placeholder="დან"
                                        />
                                        <input
                                            type="number"
                                            value={filters.ageTo}
                                            onChange={(e) => handleChange('ageTo', e.target.value)}
                                            className="w-full px-2 py-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-emerald-500 transition-all text-center placeholder:text-slate-600"
                                            placeholder="მდე"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">სქესი</label>
                                    <select
                                        value={filters.gender}
                                        onChange={(e) => handleChange('gender', e.target.value)}
                                        className="w-full px-3 py-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-xs text-slate-300 outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="All">ყველა</option>
                                        <option value="Male">მამრობითი</option>
                                        <option value="Female">მდედრობითი</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                                        <Droplet className="w-3 h-3 text-red-500" />
                                        სისხლის ჯგუფი
                                    </label>

                                    <select
                                        value={filters.bloodGroup}
                                        onChange={(e) => handleChange('bloodGroup', e.target.value)}
                                        className="w-full px-3 py-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-xs text-slate-300 outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="All">ყველა</option>
                                        <option value="Unknown">1 - არ ვიცი</option>
                                        <option value="O_POS">2 - O (I) Rh+</option>
                                        <option value="O_NEG">3 - O (I) Rh-</option>
                                        <option value="A_POS">4 - A (II) Rh+</option>
                                        <option value="A_NEG">5 - A (II) Rh-</option>
                                        <option value="B_POS">6 - B (III) Rh+</option>
                                        <option value="B_NEG">7 - B (III) Rh-</option>
                                        <option value="AB_POS">8 - AB (IV) Rh+</option>
                                        <option value="AB_NEG">9 - AB (IV) Rh-</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                                        <Accessibility className="w-3 h-3 text-sky-500" />
                                        შშმ პირი
                                    </label>


                                    <select
                                        value={filters.isPwd}
                                        onChange={(e) => handleChange('isPwd', e.target.value)}
                                        className="w-full px-3 py-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-xs text-slate-300 outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="All">ყველა</option>
                                        <option value="Yes">დიახ</option>
                                        <option value="No">არა</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Status & Activity */}
                        <div className="border-t border-slate-800 pt-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>
                                სტატუსი და აქტივობა
                            </h4>
                            <div className="grid grid-cols-4 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">სტატუსი</label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => handleChange('status', e.target.value)}
                                        className="w-full px-3 py-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-xs text-slate-300 outline-none focus:border-purple-500 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="All">ყველა</option>
                                        <option value="Active">აქტიური</option>
                                        <option value="Paused">დაპაუზებული</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">რეიტინგი (Min-Max)</label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="number"
                                            value={filters.scoreFrom}
                                            onChange={(e) => handleChange('scoreFrom', e.target.value)}
                                            className="w-full px-2 py-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-purple-500 transition-all text-center placeholder:text-slate-600"
                                            placeholder="0"
                                        />
                                        <input
                                            type="number"
                                            value={filters.scoreTo}
                                            onChange={(e) => handleChange('scoreTo', e.target.value)}
                                            className="w-full px-2 py-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-purple-500 transition-all text-center placeholder:text-slate-600"
                                            placeholder="100"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">ვიზიტები</label>
                                    <input
                                        type="number"
                                        value={filters.activityCount}
                                        onChange={(e) => handleChange('activityCount', e.target.value)}
                                        className="w-full px-3 py-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-purple-500 transition-all placeholder:text-slate-600"
                                        placeholder="..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">ჯგუფი</label>
                                    <select
                                        value={filters.groupType}
                                        onChange={(e) => handleChange('groupType', e.target.value)}
                                        className="w-full px-3 py-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-xs text-slate-300 outline-none focus:border-purple-500 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="All">ყველა</option>
                                        <option value="Group">ჯგუფური</option>
                                        <option value="Individual">ინდივიდუალური</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Additional Info */}
                        <div className="border-t border-slate-800 pt-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></span>
                                დამატებითი
                            </h4>
                            <div className="grid grid-cols-4 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">მთავარი მიზანი</label>
                                    <select
                                        value={filters.mainGoal}
                                        onChange={(e) => handleChange('mainGoal', e.target.value)}
                                        className="w-full px-3 py-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-xs text-slate-300 outline-none focus:border-amber-500 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="All">ყველა</option>
                                        <option value="General">ზოგადი (General)</option>
                                        <option value="Weight Loss">წონის კლება</option>
                                        <option value="Muscle Gain">კუნთის მასა</option>
                                        <option value="Rehabilitation">რეაბილიტაცია</option>
                                        <option value="Other">სხვა (მითითება...)</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">გამოცდილება</label>
                                    <select
                                        value={filters.experience}
                                        onChange={(e) => handleChange('experience', e.target.value)}
                                        className="w-full px-3 py-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-xs text-slate-300 outline-none focus:border-amber-500 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="All">ყველა</option>
                                        <option value="Beginner">დამწყები (Beginner)</option>
                                        <option value="Intermediate">საშუალო</option>
                                        <option value="Athlete">სპორტსმენი</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">კორპორატიული</label>
                                    <select
                                        value={filters.isCorporate}
                                        onChange={(e) => handleChange('isCorporate', e.target.value)}
                                        className="w-full px-3 py-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-xs text-slate-300 outline-none focus:border-amber-500 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="All">ყველა</option>
                                        <option value="Yes">კი</option>
                                        <option value="No">არა</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400">რეფერალი</label>
                                    <div className="flex space-x-2">
                                        <select
                                            value={filters.referralSource}
                                            onChange={(e) => handleChange('referralSource', e.target.value)}
                                            className="w-1/2 px-2 py-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-xs text-slate-300 outline-none focus:border-amber-500 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="All">წყარო</option>
                                            <option value="Social">Social</option>
                                            <option value="Friend">მეგობარი</option>
                                        </select>
                                        <input
                                            type="text"
                                            value={filters.referralInvite}
                                            onChange={(e) => handleChange('referralInvite', e.target.value)}
                                            className="w-1/2 px-2 py-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-amber-500 transition-all placeholder:text-slate-600"
                                            placeholder="კოდი"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
                        <button
                            onClick={onReset}
                            className="px-4 py-1.5 text-slate-500 hover:text-slate-300 font-bold text-xs transition-colors"
                        >
                            გასუფთავება
                        </button>
                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold text-xs rounded-xl transition-all border border-slate-700"
                            >
                                გაუქმება
                            </button>
                            <button
                                onClick={() => onApply(filters)}
                                className="px-8 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center"
                            >
                                <span className="mr-2">ძებნა</span>
                            </button>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scaleIn {
                    animation: scaleIn 0.2s ease-out forwards;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #0d1117;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #30363d;
                    border-radius: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #58a6ff;
                }
                /* Moving Border Effect */
                @keyframes borderRotate {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animated-border {
                    position: relative;
                    z-index: 50;
                }
                .animated-border::before {
                    content: "";
                    position: absolute;
                    inset: -2px;
                    border-radius: 18px; 
                    padding: 2px; 
                    background: linear-gradient(45deg, transparent 40%, #84cc16 50%, transparent 60%);
                    background-size: 300% 300%;
                    -webkit-mask: 
                       linear-gradient(#fff 0 0) content-box, 
                       linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    animation: borderRotate 3s linear infinite;
                    pointer-events: none;
                    z-index: 51;
                }
            `}</style>
            </div>
        </>
    );
}
