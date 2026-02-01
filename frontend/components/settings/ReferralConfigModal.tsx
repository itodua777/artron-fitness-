import React, { useState } from 'react';
import { X, UserPlus, Users, Gift, Percent, Calendar } from 'lucide-react';

interface ReferralConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type BenefitType = 'POINTS' | 'DISCOUNT' | 'FREE_DAYS' | 'CASHBACK';

interface BenefitConfig {
    enabled: boolean;
    value: number;
    type: BenefitType;
}

export default function ReferralConfigModal({ isOpen, onClose }: ReferralConfigModalProps) {
    const [activeTab, setActiveTab] = useState<'REFERRER' | 'INVITED'>('REFERRER');

    // Placeholder state for configuration
    const [referrerConfig, setReferrerConfig] = useState({
        points: { enabled: true, value: 100 },
        discount: { enabled: false, value: 10 },
        freeDays: { enabled: false, value: 7 },
        custom: { enabled: false, value: '' },
    });

    const [invitedConfig, setInvitedConfig] = useState({
        points: { enabled: true, value: 50 },
        discount: { enabled: true, value: 15 },
        freeDays: { enabled: false, value: 3 },
        custom: { enabled: false, value: '' },
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-fadeIn scale-100">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-xl sticky top-0 z-10">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">რეფერალ სისტემის კონფიგურაცია</h2>
                            <p className="text-xs font-bold text-slate-400">განსაზღვრეთ ბენეფიტები მომხმარებლებისთვის</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-8 pt-6 pb-2">
                    <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <button
                            onClick={() => setActiveTab('REFERRER')}
                            className={`flex-1 flex items-center justify-center py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'REFERRER'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <UserPlus size={16} className="mr-2" />
                            მომწვევი (Referrer)
                        </button>
                        <button
                            onClick={() => setActiveTab('INVITED')}
                            className={`flex-1 flex items-center justify-center py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'INVITED'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <Users size={16} className="mr-2" />
                            მოწვეული (Invited)
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 h-[500px] overflow-y-auto custom-scrollbar">
                    <div className="space-y-6">
                        <div className="p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100/50">
                            <h3 className="text-sm font-bold text-indigo-900 mb-2 flex items-center">
                                <Gift size={16} className="mr-2 text-indigo-500" />
                                {activeTab === 'REFERRER' ? 'მომწვევის ბენეფიტები' : 'მოწვეულის ბენეფიტები'}
                            </h3>
                            <p className="text-xs text-indigo-400/80 leading-relaxed max-w-lg">
                                {activeTab === 'REFERRER'
                                    ? 'განსაზღვრეთ რას მიიღებს მომწვევი, როდესაც მისი რეფერალი დარეგისტრირდება და გაიაქტიურებს ანგარიშს.'
                                    : 'განსაზღვრეთ რას მიიღებს მოწვეული, როდესაც ის დარეგისტრირდება რეფერალური ბმულით.'
                                }
                            </p>
                        </div>

                        {/* Config Fields */}
                        <div className="grid grid-cols-1 gap-4">
                            {/* Points Config */}
                            <BenefitInput
                                icon={<Gift size={18} />}
                                label="ქულები (Points)"
                                description="დაერიცხება შიდა ქულები"
                                value={activeTab === 'REFERRER' ? referrerConfig.points : invitedConfig.points}
                                onChange={(val) => activeTab === 'REFERRER'
                                    ? setReferrerConfig({ ...referrerConfig, points: val })
                                    : setInvitedConfig({ ...invitedConfig, points: val })
                                }
                            />

                            {/* Discount Config */}
                            <BenefitInput
                                icon={<Percent size={18} />}
                                label="ფასდაკლება (Discount)"
                                description="ერთჯერადი ფასდაკლება აბონემენტზე"
                                suffix="%"
                                value={activeTab === 'REFERRER' ? referrerConfig.discount : invitedConfig.discount}
                                onChange={(val) => activeTab === 'REFERRER'
                                    ? setReferrerConfig({ ...referrerConfig, discount: val })
                                    : setInvitedConfig({ ...invitedConfig, discount: val })
                                }
                            />

                            {/* Free Days Config */}
                            <BenefitInput
                                icon={<Calendar size={18} />}
                                label="უფასო დღეები (Free Days)"
                                description="დაემატება უფასო დღეები აბონემენტზე"
                                suffix="დღე"
                                value={activeTab === 'REFERRER' ? referrerConfig.freeDays : invitedConfig.freeDays}
                                onChange={(val) => activeTab === 'REFERRER'
                                    ? setReferrerConfig({ ...referrerConfig, freeDays: val })
                                    : setInvitedConfig({ ...invitedConfig, freeDays: val })
                                }
                            />

                            {/* Custom Config */}
                            <BenefitInput
                                icon={<Gift size={18} />}
                                label="სხვა ბენეფიტი (Custom)"
                                description="ხელით განსაზღვრული ბენეფიტი"
                                isText={true}
                                value={activeTab === 'REFERRER' ? referrerConfig.custom : invitedConfig.custom}
                                onChange={(val: any) => activeTab === 'REFERRER'
                                    ? setReferrerConfig({ ...referrerConfig, custom: val })
                                    : setInvitedConfig({ ...invitedConfig, custom: val })
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
                    >
                        შენახვა
                    </button>
                </div>
            </div>
        </div>
    );
}

// Sub-component for inputs
function BenefitInput({ icon, label, description, value, onChange, suffix = '', isText = false }: any) {
    return (
        <div className={`p-4 rounded-2xl border transition-all ${value.enabled ? 'bg-white border-indigo-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl ${value.enabled ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-200 text-slate-400'}`}>
                        {icon}
                    </div>
                    <div>
                        <h4 className={`text-sm font-black ${value.enabled ? 'text-slate-800' : 'text-slate-500'}`}>{label}</h4>
                        <p className="text-[10px] text-slate-400 font-bold">{description}</p>
                    </div>
                </div>

                {/* Toggle Switch */}
                <button
                    onClick={() => onChange({ ...value, enabled: !value.enabled })}
                    className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${value.enabled ? 'bg-indigo-500' : 'bg-slate-300'}`}
                >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${value.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
            </div>

            {value.enabled && (
                <div className="pl-[3.25rem]">
                    <div className="relative">
                        {isText ? (
                            <input
                                type="text"
                                value={value.value}
                                onChange={(e) => onChange({ ...value, value: e.target.value })}
                                placeholder="მაგ: უფასო ყავა, პირსახოცი..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-indigo-400 focus:bg-white transition-all placeholder:font-normal"
                            />
                        ) : (
                            <input
                                type="number"
                                value={value.value}
                                onChange={(e) => onChange({ ...value, value: parseFloat(e.target.value) || 0 })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-black text-slate-800 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                            />
                        )}
                        {!isText && suffix && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                {suffix}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
