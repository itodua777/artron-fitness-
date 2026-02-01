import React, { useState } from 'react';
import { X, Calculator, Clock, Footprints, Coins, Coffee, ShoppingBag, Users, Info } from 'lucide-react';

interface RatingCalculationConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface PointRule {
    enabled: boolean;
    ratio: number; // How many points per 1 unit (visit, hour, GEL)
}

export default function RatingCalculationConfigModal({ isOpen, onClose }: RatingCalculationConfigModalProps) {
    // State for configuration
    const [visitRule, setVisitRule] = useState<PointRule>({ enabled: true, ratio: 10 });
    const [durationRule, setDurationRule] = useState<PointRule>({ enabled: true, ratio: 5 });

    // Financials
    const [activitySpendRule, setActivitySpendRule] = useState<PointRule>({ enabled: true, ratio: 1 }); // 1 GEL = 1 Point
    const [baristaSpendRule, setBaristaSpendRule] = useState<PointRule>({ enabled: true, ratio: 2 }); // 1 GEL = 2 Points
    const [shopSpendRule, setShopSpendRule] = useState<PointRule>({ enabled: false, ratio: 1 });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-fadeIn scale-100 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-xl sticky top-0 z-10">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500">
                            <Calculator size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">ქულების დაგროვების სისტემა</h2>
                            <p className="text-xs font-bold text-slate-400">განსაზღვრეთ კოეფიციენტები ქულების დასაგროვებლად</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">

                    {/* Activity Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <Footprints size={14} className="mr-2" />
                            აქტივობა და დრო
                        </h3>

                        <ConfigRow
                            icon={<Footprints size={18} />}
                            title="ვიზიტი (Visit)"
                            description="ქულები თითოეულ ვიზიტზე"
                            rule={visitRule}
                            onChange={setVisitRule}
                            unitLabel="ქულა / ვიზიტზე"
                        />

                        <ConfigRow
                            icon={<Clock size={18} />}
                            title="დრო (Duration)"
                            description="ქულები დარბაზში გატარებულ 1 საათზე"
                            rule={durationRule}
                            onChange={setDurationRule}
                            unitLabel="ქულა / საათში"
                        />
                    </div>

                    {/* Financial Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <Coins size={14} className="mr-2" />
                            ფინანსები და ხარჯვა
                        </h3>

                        <ConfigRow
                            icon={<ShoppingBag size={18} />}
                            title="აქტივობის შეძენა"
                            description="აბონემენტის ან პაკეტის შეძენისას"
                            rule={activitySpendRule}
                            onChange={setActivitySpendRule}
                            unitLabel="ქულა / 1 ₾-ზე"
                        />

                        <ConfigRow
                            icon={<Coffee size={18} />}
                            title="ბარისტა / ბარი"
                            description="ბარში დახარჯული თანხა"
                            rule={baristaSpendRule}
                            onChange={setBaristaSpendRule}
                            unitLabel="ქულა / 1 ₾-ზე"
                        />

                        <ConfigRow
                            icon={<ShoppingBag size={18} />}
                            title="მაღაზია / პროდუქტები"
                            description="სხვა პროდუქტების შეძენა"
                            rule={shopSpendRule}
                            onChange={setShopSpendRule}
                            unitLabel="ქულა / 1 ₾-ზე"
                        />
                    </div>

                    {/* Referral Info Block */}
                    <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-start gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 shrink-0">
                            <Users size={16} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-indigo-900 mb-1">რეფერალური ქულები</h4>
                            <p className="text-xs text-indigo-700/70 font-medium leading-relaxed">
                                რეფერალური პროგრამით მიღებული ქულები დაემატება მომხმარებლის საერთო ბალანსს.
                                ამ პარამეტრების კონფიგურაცია ხდება "რეფერალ სისტემის პარამეტრებში".
                            </p>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end mt-auto">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-bold shadow-lg shadow-slate-900/20 transition-all active:scale-95"
                    >
                        შენახვა
                    </button>
                </div>
            </div>
        </div>
    );
}

function ConfigRow({ icon, title, description, rule, onChange, unitLabel }: {
    icon: React.ReactNode,
    title: string,
    description: string,
    rule: PointRule,
    onChange: (r: PointRule) => void,
    unitLabel: string
}) {
    return (
        <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between group ${rule.enabled ? 'bg-white border-indigo-100 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-70'}`}>
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-colors ${rule.enabled ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
                    {icon}
                </div>
                <div>
                    <h4 className={`text-sm font-black ${rule.enabled ? 'text-slate-800' : 'text-slate-500'}`}>{title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold">{description}</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {rule.enabled && (
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-indigo-400 focus-within:bg-white transition-all">
                        <input
                            type="number"
                            value={rule.ratio}
                            onChange={(e) => onChange({ ...rule, ratio: parseFloat(e.target.value) || 0 })}
                            className="w-12 bg-transparent font-black text-sm text-slate-800 outline-none text-right mr-2"
                        />
                        <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{unitLabel}</span>
                    </div>
                )}

                {/* Toggle */}
                <button
                    onClick={() => onChange({ ...rule, enabled: !rule.enabled })}
                    className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${rule.enabled ? 'bg-indigo-500' : 'bg-slate-300'}`}
                >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${rule.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
            </div>
        </div>
    )
}
