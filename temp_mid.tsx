<div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-[3rem] shadow-2xl max-w-4xl w-full relative animate-fadeIn max-h-[85vh] flex flex-col overflow-hidden">
        <div className="p-8 pb-0">
            <button
                onClick={() => setIsActivationModalOpen(false)}
                className="absolute top-6 right-6 p-2 bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors z-10"
            >
                <X size={20} />
            </button>

            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">დაადასტურეთ შეკვეთა</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">გთხოვთ გადაამოწმოთ დეტალები</p>
            </div>
        </div>

        <div className="flex-1 overflow-hidden p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Features List */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 overflow-y-auto custom-scrollbar">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 sticky top-0 bg-slate-50 z-10 pb-2 border-b border-slate-100">
                    არჩეული ფუნქციონალი
                </p>
                <ul className="space-y-3">
                    {modules.map((m) => {
                        const isActive = selectedModules[m.id];
                        const activeSubModules = m.subModules ? m.subModules.filter((sm: any) => selectedModules[sm.id]) : [];

                        if (!isActive && activeSubModules.length === 0) return null;

                        return (
                            <li key={m.id} className="text-sm font-bold text-slate-700 flex items-start">
                                <CheckCircle2 size={16} className="text-lime-500 mr-3 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <span className="leading-tight block">{m.label}</span>
                                    {activeSubModules.length > 0 && (
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {activeSubModules.map((sm: any) => (
                                                <span key={sm.id} className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-500 font-medium">
                                                    {sm.label}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Right Column: Summary & Actions */}
            <div className="flex flex-col space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden flex-1 flex flex-col justify-center">
                    <div className="relative z-10">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">ჯამური ღირებულება</p>
                        <div className="flex items-end space-x-2">
                            <span className="text-5xl font-black text-white tracking-tighter">
                                {Math.round(totalCost * paymentInterval * (1 - (paymentInterval === 3 ? 0.1 : paymentInterval === 6 ? 0.15 : paymentInterval === 12 ? 0.2 : 0)))}
                                <span className="text-2xl align-top ml-1">₾</span>
                            </span>
                        </div>
                        <span className="text-xs font-bold text-white/40 mt-2 block">
                            {paymentInterval} თვე / -{paymentInterval === 3 ? '10' : paymentInterval === 6 ? '15' : paymentInterval === 12 ? '20' : '0'}% ფასდაკლება
                        </span>
                    </div>
                    <LayoutTemplate size={120} className="absolute -bottom-6 -right-6 text-white/5 rotate-12" />
                </div>

                <div className="text-xs text-slate-500 font-medium space-y-3 bg-blue-50 p-5 rounded-3xl border border-blue-100">
                    <p className="flex items-center">
                        <Clock size={16} className="text-blue-500 mr-3 shrink-0" />
                        <span>გადახდისთვის გაქვთ <b>3 სამუშაო დღე</b>.</span>
                    </p>
                    <p className="flex items-center">
                        <Mail size={16} className="text-blue-500 mr-3 shrink-0" />
                        <span>ინვოისი გაგზავნილია: <b className="break-all">{company.companyEmail || 'თქვენს მეილზე'}</b></span>
                    </p>
                </div>

                <button
                    onClick={() => { setIsActivationModalOpen(false); completeStep(6); }}
                    className="w-full py-5 bg-lime-400 text-slate-900 font-black rounded-2xl hover:bg-lime-300 transition-colors shadow-lg shadow-lime-400/20 flex items-center justify-center arrow-animation text-lg"
                >
                    <span>შეკვეთის დადასტურება</span>
                    <ArrowRight size={20} className="ml-2" />
                </button>
            </div>
        </div>
    </div>
</div>
