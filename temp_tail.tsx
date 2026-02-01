                )}
            </div>
        );
    }

    // --- RENDER BANK DETAILS VIEW ---
    if (activeSubView === 'BANK') {
        const banks = company.bankAccounts || [];

        const addBank = () => {
            const newBank: BankAccount = {
                id: Date.now().toString(),
                bankName: '',
                swift: '',
                iban: '',
                recipientName: company.recipientName || '', // Default to company name if valid
                isDefault: banks.length === 0, // Make default if it's the first one
                purposes: banks.length === 0 ? ['INVOICE'] : []
            };
            setCompany({ ...company, bankAccounts: [...banks, newBank] });
            setEditingBankIds(prev => new Set(prev).add(newBank.id));
        };

        const updateBank = (id: string, field: keyof BankAccount, value: any) => {
            setCompany(prev => ({
                ...prev,
                bankAccounts: (prev.bankAccounts || []).map(b => b.id === id ? { ...b, [field]: value } : b)
            }));
        };

        const toggleBankPurpose = (id: string, purpose: string) => {
            setCompany(prev => {
                const banks = prev.bankAccounts || [];
                return {
                    ...prev,
                    bankAccounts: banks.map(b => {
                        if (b.id === id) {
                            const currentPurposes = b.purposes || (b.isDefault ? ['INVOICE'] : []);
                            const exists = currentPurposes.includes(purpose);
                            let newPurposes = exists
                                ? currentPurposes.filter(p => p !== purpose)
                                : [...currentPurposes, purpose];

                            // Sync isDefault with INVOICE purpose for backward compatibility
                            const newIsDefault = purpose === 'INVOICE' ? !exists : b.isDefault;

                            // Ensure INVOICE is in purposes if isDefault is true (re-sync)
                            if (newIsDefault && !newPurposes.includes('INVOICE')) {
                                newPurposes.push('INVOICE');
                            } else if (!newIsDefault && newPurposes.includes('INVOICE')) {
                                newPurposes = newPurposes.filter(p => p !== 'INVOICE');
                            }

                            return { ...b, purposes: newPurposes, isDefault: newIsDefault };
                        }
                        // If we just turned ON 'INVOICE' for this bank, turn if OFF for others (single primary invoice account)
                        // Actually, maybe we allow multiple? Standard practice is usually one default for auto-generation.
                        // Let's keep strict single default for INVOICE to avoid ambiguity.
                        if (purpose === 'INVOICE') {
                            // If the target bank turned INVOICE ON, others must turn fields OFF or just isDefault OFF?
                            // Let's keeping it simple: allows multiple 'Active for Invoices' for now OR enforce single.
                            // The previous logic enforced single isDefault. Let's try to enforce single INVOICE default if enabling.
                            // BUT, user might want multiple active.
                            // Let's just update the target bank for now. User asked for expansion, likely implies multiple active contexts.
                            return b;
                        }
                        return b;
                    })
                };
            });
        };

        const toggleEditMode = (id: string) => {
            setEditingBankIds(prev => {
                const next = new Set(prev);
                if (next.has(id)) {
                    next.delete(id);
                } else {
                    next.add(id);
                }
                return next;
            });
        };

        const removeBank = (id: string) => {
            if (confirm('ნამდვილად გსურთ ანგარიშის წაშლა?')) {
                setCompany({
                    ...company,
                    bankAccounts: banks.filter(b => b.id !== id)
                });
            }
        };

        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-24">
                <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm gap-4">
                    <button onClick={() => setActiveSubView('MAIN')} className="flex items-center text-slate-500 hover:text-slate-800 font-bold transition-all group">
                        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        პარამეტრებში დაბრუნება
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-600/20">
                            <Landmark size={24} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">საბანკო რეკვიზიტები</h2>
                    </div>
                    <button
                        onClick={() => { alert('საბანკო რეკვიზიტები შენახულია!'); completeStep(4); }}
                        className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center"
                    >
                        <Save size={18} className="mr-2" />
                        შენახვა
                    </button>
                </div>

                <div className="space-y-6">
                    {banks.map((bank, index) => {
                        const isEditing = editingBankIds.has(bank.id);
                        return (
                            <div key={bank.id} className={`bg-white p-8 rounded-[3rem] border transition-all relative ${bank.isDefault ? 'border-blue-500 shadow-xl shadow-blue-500/10' : 'border-slate-100 shadow-sm'}`}>
                                {/* Header / Actions */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-black ${bank.isDefault ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                            {index + 1}
                                        </div>
                                        <span className={`text-xs font-bold uppercase transition-colors ${(bank.purposes?.length || 0) > 0 ? 'text-blue-500' : 'text-slate-400'}`}>
                                            {(bank.purposes?.length || 0) > 0 ? 'აქტიური' : 'არააქტიური'}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => toggleEditMode(bank.id)} className={`p-2 rounded-xl transition-all ${isEditing ? 'text-green-500 bg-green-50 hover:bg-green-100' : 'text-slate-300 hover:text-blue-500 hover:bg-blue-50'}`}>
                                            {isEditing ? <Check size={20} /> : <Pencil size={20} />}
                                        </button>
                                        <button onClick={() => removeBank(bank.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">ბანკის დასახელება</label>
                                        <div className="relative group">
                                            <Landmark size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                            {isEditing ? (
                                                <input
                                                    value={bank.bankName}
                                                    onChange={e => updateBank(bank.id, 'bankName', e.target.value)}
                                                    placeholder="მაგ: თიბისი ბანკი"
                                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-400 focus:bg-white transition-all"
                                                />
                                            ) : (
                                                <div className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-transparent rounded-2xl font-bold text-slate-700">
                                                    {bank.bankName || <span className="text-slate-300 italic">არ არის მითითებული</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">სვიფტ კოდი (SWIFT)</label>
                                        <div className="relative group">
                                            <Fingerprint size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                            {isEditing ? (
                                                <input
                                                    value={bank.swift}
                                                    onChange={e => updateBank(bank.id, 'swift', e.target.value)}
                                                    placeholder="TBCBGE22"
                                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-400 focus:bg-white transition-all uppercase"
                                                />
                                            ) : (
                                                <div className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-transparent rounded-2xl font-bold text-slate-700 uppercase">
                                                    {bank.swift || <span className="text-slate-300 italic">არ არის მითითებული</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mt-6">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">ანგარიშის ნომერი (IBAN)</label>
                                    <div className="relative group flex items-center">
                                        <CreditCard size={20} className="absolute left-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                        {isEditing ? (
                                            <input
                                                value={bank.iban}
                                                onChange={e => updateBank(bank.id, 'iban', e.target.value)}
                                                placeholder="GE00TB0000000000000000"
                                                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-mono font-bold text-lg outline-none focus:border-blue-400 focus:bg-white transition-all"
                                            />
                                        ) : (
                                            <div className="w-full pl-12 pr-12 py-4 bg-slate-50/50 border border-transparent rounded-2xl font-mono font-bold text-lg text-slate-700">
                                                {bank.iban || <span className="text-slate-300 italic">არ არის მითითებული</span>}
                                            </div>
                                        )}
                                        <button onClick={() => handleShare(bank.iban)} className="absolute right-3 p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                                            <Copy size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 mt-6">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">მიმღების დასახელება</label>
                                    <div className="relative group flex items-center">
                                        <UserCheck size={20} className="absolute left-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                        {isEditing ? (
                                            <input
                                                value={bank.recipientName}
                                                onChange={e => updateBank(bank.id, 'recipientName', e.target.value)}
                                                placeholder="შპს კომპანიის სახელი"
                                                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-400 focus:bg-white transition-all"
                                            />
                                        ) : (
                                            <div className="w-full pl-12 pr-12 py-4 bg-slate-50/50 border border-transparent rounded-2xl font-bold text-slate-700">
                                                {bank.recipientName || <span className="text-slate-300 italic">არ არის მითითებული</span>}
                                            </div>
                                        )}
                                        <button onClick={() => handleShare(bank.recipientName)} className="absolute right-3 p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                                            <Copy size={18} />
                                        </button>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-3 block">ანგარიშის დანიშნულება (მონიშნეთ შესაბდისი)</label>
                                        <div className="flex flex-wrap gap-3">
                                            {ACCOUNT_USAGES.map(usage => {
                                                const isActive = (bank.purposes || (bank.isDefault ? ['INVOICE'] : [])).includes(usage.key);
                                                return (
                                                    <button
                                                        key={usage.key}
                                                        onClick={() => toggleBankPurpose(bank.id, usage.key)}
                                                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border transition-all text-xs font-bold ${isActive
                                                            ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/20'
                                                            : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-500'}`}
                                                    >
                                                        {isActive && <Check size={14} className="mr-1" />}
                                                        {usage.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <button
                        onClick={addBank}
                        className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 font-bold hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center space-y-2 group"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <Plus size={24} />
                        </div>
                        <span>ახალი ანგარიშის დამატება</span>
                    </button>

                    <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-start space-x-4">
                        <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm"><Info size={24} /></div>
                        <p className="text-sm text-blue-800 font-medium leading-relaxed">
                            მონიშნული "აქტიური" ანგარიში ავტომატურად იქნება გამოყენებული ინვოისების გენერირებისთვის.
                        </p>
                    </div>
                </div>
            </div >
        );
    }

    // --- RENDER DIGITAL SETTINGS VIEW ---
    if (activeSubView === 'DIGITAL') {
        return (
            <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-24">
                <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm gap-4">
                    <button onClick={() => setActiveSubView('MAIN')} className="flex items-center text-slate-500 hover:text-slate-800 font-bold transition-all group">
                        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        პარამეტრებში დაბრუნება
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-indigo-500 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
                            <Share2 size={24} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">ციფრული პლატფორმები</h2>
                    </div>
                    <button
                        onClick={() => { alert('ციფრული პარამეტრები შენახულია!'); completeStep(3); }}
                        className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center"
                    >
                        <Save size={18} className="mr-2" />
                        შენახვა & გაგრძელება
                    </button>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
                    <div className="max-w-3xl mx-auto space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">კომპანიის იმეილი</label>
                                <div className="relative group flex items-center">
                                    <Mail size={18} className="absolute left-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        value={company.companyEmail}
                                        onChange={e => setCompany({ ...company, companyEmail: e.target.value })}
                                        placeholder="info@company.ge"
                                        className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-indigo-400 focus:bg-white transition-all"
                                    />
                                    <button onClick={() => handleShare(company.companyEmail)} className="absolute right-3 p-2 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all">
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">საჯარო ტელეფონი</label>
                                <div className="relative group flex items-center">
                                    <Phone size={18} className="absolute left-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        value={company.companyPhone}
                                        onChange={e => setCompany({ ...company, companyPhone: e.target.value })}
                                        placeholder="+995 5xx xx xx xx"
                                        className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-indigo-400 focus:bg-white transition-all"
                                    />
                                    <button onClick={() => handleShare(company.companyPhone)} className="absolute right-3 p-2 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all">
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-50 w-full"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Facebook გვერდი</label>
                                <div className="relative group flex items-center">
                                    <Facebook size={18} className="absolute left-4 text-blue-600" />
                                    <input
                                        value={company.facebookLink}
                                        onChange={e => setCompany({ ...company, facebookLink: e.target.value })}
                                        placeholder="facebook.com/..."
                                        className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-400 focus:bg-white transition-all"
                                    />
                                    <button onClick={() => handleShare(company.facebookLink)} className="absolute right-3 p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                                        <Share2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Instagram გვერდი</label>
                                <div className="relative group flex items-center">
                                    <Instagram size={18} className="absolute left-4 text-rose-500" />
                                    <input
                                        value={company.instagramLink}
                                        onChange={e => setCompany({ ...company, instagramLink: e.target.value })}
                                        placeholder="instagram.com/..."
                                        className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-rose-400 focus:bg-white transition-all"
                                    />
                                    <button onClick={() => handleShare(company.instagramLink)} className="absolute right-3 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                        <Share2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">LinkedIn პროფილი</label>
                                <div className="relative group flex items-center">
                                    <Linkedin size={18} className="absolute left-4 text-blue-700" />
                                    <input
                                        value={company.linkedinLink}
                                        onChange={e => setCompany({ ...company, linkedinLink: e.target.value })}
                                        placeholder="linkedin.com/company/..."
                                        className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-700 focus:bg-white transition-all"
                                    />
                                    <button onClick={() => handleShare(company.linkedinLink)} className="absolute right-3 p-2 text-slate-300 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all">
                                        <Share2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">TikTok პროფილი</label>
                                <div className="relative group flex items-center">
                                    <Video size={18} className="absolute left-4 text-slate-900" />
                                    <input
                                        value={company.tiktokLink}
                                        onChange={e => setCompany({ ...company, tiktokLink: e.target.value })}
                                        placeholder="tiktok.com/@..."
                                        className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-slate-800 focus:bg-white transition-all"
                                    />
                                    <button onClick={() => handleShare(company.tiktokLink)} className="absolute right-3 p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                                        <Share2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">YouTube არხი</label>
                                <div className="relative group flex items-center">
                                    <Youtube size={18} className="absolute left-4 text-red-600" />
                                    <input
                                        value={company.youtubeLink}
                                        onChange={e => setCompany({ ...company, youtubeLink: e.target.value })}
                                        placeholder="youtube.com/c/..."
                                        className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-red-400 focus:bg-white transition-all"
                                    />
                                    <button onClick={() => handleShare(company.youtubeLink)} className="absolute right-3 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                        <Share2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 flex items-start space-x-4">
                            <div className="p-3 bg-white rounded-2xl text-indigo-500 shadow-sm"><Globe size={24} /></div>
                            <p className="text-sm text-indigo-700 font-medium leading-relaxed">
                                აღნიშნული ბმულები გამოყენებული იქნება მომავალში სარეკლამო კამპანიების ავტომატური დაგზავნისა და სოციალურ ქსელებთან ინტეგრაციისთვის.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER COMPANY PROFILE VIEW ---
    if (activeSubView === 'COMPANY') {
        const logoPreview = company.logo;

        return (
            <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-24">
                <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm gap-4">
                    <button onClick={() => setActiveSubView('MAIN')} className="flex items-center text-slate-500 hover:text-slate-800 font-bold transition-all group">
                        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        პარამეტრებში დაბრუნება
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-sky-500 rounded-2xl text-white shadow-lg shadow-sky-500/20">
                            <Building2 size={24} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">კომპანიის პროფილი</h2>
                    </div>
                    <button
                        onClick={handleSaveCompanyProfile}
                        className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center"
                    >
                        <Save size={18} className="mr-2" />
                        შენახვა & გაგრძელება
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                            <div className="w-40 h-40 rounded-full bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center mb-6 relative group cursor-pointer overflow-hidden">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon size={48} className="text-slate-300" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm" onClick={() => logoInputRef.current?.click()}>
                                    <Upload size={24} className="text-white" />
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={logoInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleLogoUpload}
                            />
                            <h3 className="text-lg font-black text-slate-800 mb-1">{company.brandName || "ბრენდის სახელი"}</h3>
                            <input
                                value={company.slogan}
                                onChange={e => setCompany({ ...company, slogan: e.target.value })}
                                className="text-xs text-slate-400 font-medium italic bg-transparent text-center border-b border-dashed border-slate-300 focus:border-indigo-400 outline-none w-3/4 mb-2"
                                placeholder="სლოგანი..."
                            />
                            <p className="text-xs text-slate-400 font-bold uppercase mb-2">{company.activityField || "საქმიანობის სფერო"}</p>
                            {company.actualAddress && (
                                <p className="text-[10px] text-slate-500 font-bold bg-slate-50 px-3 py-1.5 rounded-lg flex items-center">
                                    <MapPin size={12} className="mr-1.5 text-slate-400" />
                                    {company.actualAddress}
                                </p>
                            )}
                        </div>




                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center mb-6">
                                <FileText size={16} className="mr-2" />
                                იურიდიული ინფორმაცია
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">კომპანიის სახელწოდება <span className="text-red-500">*</span></label>
                                    <input
                                        value={company.name}
                                        onChange={e => setCompany({ ...company, name: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400"
                                        placeholder="შპს არტრონი"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">საიდენტიფიკაციო კოდი <span className="text-red-500">*</span></label>
                                    <input
                                        value={company.identCode}
                                        onChange={e => setCompany({ ...company, identCode: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400"
                                        placeholder="123456789"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">იურიდიული მისამართი <span className="text-red-500">*</span></label>
                                    <input
                                        value={company.legalAddress}
                                        onChange={e => setCompany({ ...company, legalAddress: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400"
                                        placeholder="თბილისი, ჭავჭავაძის გამზ. 1"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">ფაქტობრივი მისამართი <span className="text-gray-400 text-[9px] ml-1">(ნაჩვენები იქნება პროფილზე)</span></label>
                                    <input
                                        value={company.actualAddress}
                                        onChange={e => setCompany({ ...company, actualAddress: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400"
                                        placeholder="მაგ: ქუთაისი, ლესელიძის მე-2 შესახვევი"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center mb-6">
                                <UserCheck size={16} className="mr-2" />
                                მმართველობა
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                                    <h5 className="font-black text-slate-800 flex items-center"><Briefcase size={16} className="mr-2 text-indigo-500" /> დირექტორი <span className="text-red-500 ml-1">*</span></h5>
                                    <div className="space-y-3">
                                        <input value={company.directorName} onChange={e => setCompany({ ...company, directorName: e.target.value })} placeholder="სახელი გვარი" className="w-full bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none" />
                                        <input value={company.directorId} onChange={e => setCompany({ ...company, directorId: e.target.value })} placeholder="პირადი ნომერი" className="w-full bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none" />
                                        <input value={company.directorPhone} onChange={e => setCompany({ ...company, directorPhone: e.target.value })} placeholder="ტელეფონი" className="w-full bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none" />
                                    </div>

                                    {company.directorSignature ? (
                                        <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <img src={company.directorSignature} alt="Signature" className="h-8 object-contain" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">ფაქსიმილია</span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button onClick={() => handleOpenSignature('DIRECTOR')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><Edit3 size={14} /></button>
                                                <button onClick={() => handleDeleteSignature('DIRECTOR')} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 transition-colors"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button onClick={() => handleOpenSignature('DIRECTOR')} className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-slate-400 text-[10px] font-bold hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center">
                                            <FileSignature size={14} className="mr-2" />
                                            ფაქსიმილიის დამატება
                                        </button>
                                    )}
                                </div>
                                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4 relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <h5 className="font-black text-slate-800 flex items-center relative z-10"><ShieldCheck size={16} className="mr-2 text-emerald-500" /> გენერალური მენეჯერი</h5>
                                        <label className="flex items-center space-x-3 cursor-pointer group relative z-10">
                                            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${hasGM ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${hasGM ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                            </div>
                                            <input type="checkbox" checked={hasGM} onChange={e => handleGMToggle(e.target.checked)} className="hidden" />
                                        </label>
                                    </div>
                                    {/* BRANCH TOGGLE */}
                                    <div className="flex items-center justify-between mb-2 pt-4 border-t border-slate-100">
                                        <h5 className="font-black text-slate-800 flex items-center relative z-10"><GitBranch size={16} className="mr-2 text-emerald-500" /> ფილიალი</h5>
                                        <label className="flex items-center space-x-3 cursor-pointer group relative z-10">
                                            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${hasBranches ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${hasBranches ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                            </div>
                                            <input type="checkbox" checked={hasBranches} onChange={e => setHasBranches(e.target.checked)} className="hidden" />
                                        </label>
                                    </div>

                                    {hasGM && (
                                        <div className="space-y-4 animate-fadeIn">
                                            <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-emerald-100/50 rounded-lg text-emerald-600">
                                                        <ShieldCheck size={18} />
                                                    </div>
                                                    <div>
                                                        <h6 className="text-xs font-black text-slate-800">{company.gmName || "მენეჯერი არ არის მითითებული"}</h6>
                                                        <p className="text-[10px] text-slate-400 font-bold">{company.gmPhone || "---"}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => setIsGMModalOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-500 transition-colors">
                                                    <Edit3 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* GENERAL MANAGER MODAL */}
                        {isGMModalOpen && (
                            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                                <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-scaleIn">
                                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                        <h3 className="text-xl font-black text-slate-800 flex items-center">
                                            <ShieldCheck size={24} className="mr-3 text-emerald-500" />
                                            გენერალური მენეჯერი
                                        </h3>
                                        <button onClick={() => setIsGMModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                                            <X size={24} />
                                        </button>
                                    </div>
                                    <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black text-slate-400 uppercase ml-1">სახელი გვარი</label>
                                                <input
                                                    value={company.gmName}
                                                    onChange={e => setCompany({ ...company, gmName: e.target.value })}
                                                    placeholder="გიორგი გიორგაძე"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-emerald-400"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black text-slate-400 uppercase ml-1">პირადი ნომერი</label>
                                                <input
                                                    value={company.gmId}
                                                    onChange={e => setCompany({ ...company, gmId: e.target.value })}
                                                    placeholder="01010101010"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-emerald-400"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black text-slate-400 uppercase ml-1">მობილური</label>
                                                <input
                                                    value={company.gmPhone}
                                                    onChange={e => setCompany({ ...company, gmPhone: e.target.value })}
                                                    placeholder="555..."
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-emerald-400"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black text-slate-400 uppercase ml-1">ელ.ფოსტა</label>
                                                <input
                                                    value={company.gmEmail}
                                                    onChange={e => setCompany({ ...company, gmEmail: e.target.value })}
                                                    placeholder="manager@gym.ge"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-emerald-400"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                                            <button className="py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-200 transition-all flex flex-col items-center justify-center gap-1">
                                                <Link size={16} />
                                                <span>ბმულის გაგზავნა</span>
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    await generateGMCredentials();
                                                    // Hypothetical 'send' logic here
                                                    alert('მონაცემები გაგზავნილია (სიმულაცია)');
                                                }}
                                                className="py-3 bg-emerald-500/10 text-emerald-600 font-bold rounded-xl text-xs hover:bg-emerald-500/20 transition-all flex flex-col items-center justify-center gap-1"
                                            >
                                                <Key size={16} />
                                                <span>User & OTP გაგზავნა</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                                        <button
                                            onClick={() => setIsGMModalOpen(false)}
                                            className="px-8 py-3 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all shadow-lg"
                                        >
                                            შენახვა
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Section */}
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center mb-6">
                                <ShieldCheck size={16} className="mr-2" />
                                უსაფრთხოება
                            </h4>
                            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h5 className="font-black text-slate-800 text-sm">ერთჯერადი პაროლის შეცვლა</h5>
                                    <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-2 py-1 rounded-lg">რეკომენდირებულია</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    თუ სისტემაში შესასვლელად იყენებთ დროებით პაროლს (OTP), უსაფრთხოების მიზნით გთხოვთ შეცვალოთ ის მუდმივი პაროლით.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input
                                        type="password"
                                        placeholder="ძველი პაროლი"
                                        value={security.old}
                                        onChange={e => setSecurity({ ...security, old: e.target.value })}
                                        className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-slate-400"
                                    />
                                    <input
                                        type="password"
                                        placeholder="ახალი პაროლი"
                                        value={security.new}
                                        onChange={e => setSecurity({ ...security, new: e.target.value })}
                                        className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-slate-400"
                                    />
                                    <input
                                        type="password"
                                        placeholder="გაიმეორეთ ახალი პაროლი"
                                        value={security.repeat}
                                        onChange={e => setSecurity({ ...security, repeat: e.target.value })}
                                        className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-slate-400"
                                    />
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button
                                        onClick={handleUpdatePassword}
                                        className={`px-6 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all ${passwordUpdated ? 'bg-green-500 text-white cursor-default' : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-emerald-500/20'}`}
                                    >
                                        {passwordUpdated ? 'პაროლი განახლებულია' : 'პაროლის განახლება'}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h5 className="font-black text-slate-800 text-sm">ორმაგი ავტორიზაცია (2FA)</h5>
                                    {twoFactorMethod !== 'NONE' && (
                                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-600 px-2 py-1 rounded-lg">ჩართულია</span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    დამატებითი უსაფრთხოებისთვის აირჩიეთ ავტორიზაციის მეთოდი.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div
                                        onClick={() => setTwoFactorMethod('NONE')}
                                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${twoFactorMethod === 'NONE' ? 'bg-white border-indigo-500 shadow-md transform scale-[1.02]' : 'bg-white/50 border-slate-200 hover:border-indigo-200'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${twoFactorMethod === 'NONE' ? 'border-indigo-500' : 'border-slate-300'}`}>
                                            {twoFactorMethod === 'NONE' && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>}
                                        </div>
                                        <span className={`text-xs font-bold ${twoFactorMethod === 'NONE' ? 'text-indigo-900' : 'text-slate-500'}`}>გამორთული</span>
                                    </div>

                                    <div
                                        onClick={() => setTwoFactorMethod('EMAIL')}
                                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${twoFactorMethod === 'EMAIL' ? 'bg-white border-indigo-500 shadow-md transform scale-[1.02]' : 'bg-white/50 border-slate-200 hover:border-indigo-200'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${twoFactorMethod === 'EMAIL' ? 'border-indigo-500' : 'border-slate-300'}`}>
                                            {twoFactorMethod === 'EMAIL' && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>}
                                        </div>
                                        <Mail size={16} className={twoFactorMethod === 'EMAIL' ? 'text-indigo-500' : 'text-slate-400'} />
                                        <span className={`text-xs font-bold ${twoFactorMethod === 'EMAIL' ? 'text-indigo-900' : 'text-slate-500'}`}>ელ.ფოსტა</span>
                                    </div>

                                    <div
                                        onClick={() => setTwoFactorMethod('SMS')}
                                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${twoFactorMethod === 'SMS' ? 'bg-white border-indigo-500 shadow-md transform scale-[1.02]' : 'bg-white/50 border-slate-200 hover:border-indigo-200'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${twoFactorMethod === 'SMS' ? 'border-indigo-500' : 'border-slate-300'}`}>
                                            {twoFactorMethod === 'SMS' && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>}
                                        </div>
                                        <div className="relative">
                                            <Phone size={16} className={twoFactorMethod === 'SMS' ? 'text-indigo-500' : 'text-slate-400'} />
                                        </div>
                                        <span className={`text-xs font-bold ${twoFactorMethod === 'SMS' ? 'text-indigo-900' : 'text-slate-500'}`}>SMS კოდი</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <SignatureModal
                        isOpen={isSigModalOpen}
                        onClose={() => setIsSigModalOpen(false)}
                        onSave={handleSaveSignature}
                        title={sigType === 'DIRECTOR' ? 'დირექტორის ხელმოწერა' : 'გენერალური მენეჯერის ხელმოწერა'}
                    />
                </div >
            </div >
        );
    }

    // --- RENDER GYM MODELING VIEW ---
    if (activeSubView === 'MODELING') {
        return (
            <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-24">
                <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm gap-4">
                    <button onClick={() => setActiveSubView('MAIN')} className="flex items-center text-slate-500 hover:text-slate-800 font-bold transition-all group">
                        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        პარამეტრებში დაბრუნება
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-500/20">
                            <Ruler size={24} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">დარბაზის მოდელირება</h2>
                    </div>
                    <button
                        onClick={() => {
                            if (utilizationPercent > 100) {
                                alert('შეცდომა: ოთახების ფართობი აღემატება საერთო ფართს!');
                                return;
                            }
                            alert('მოდელირება შენახულია!');
                            completeStep(1);
                        }}
                        className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center"
                    >
                        <Save size={18} className="mr-2" />
                        შენახვა & გაგრძელება
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-6">
                        {/* General Parameters */}
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                            <h3 className="font-black text-slate-800 flex items-center mb-8">
                                <Maximize size={20} className="mr-2 text-orange-500" />
                                ძირითადი პარამეტრები
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block text-center">საერთო ფართი</label>
                                    <div className="bg-slate-50 p-4 rounded-[2rem] text-center border border-slate-100">
                                        <input
                                            type="number"
                                            value={totalArea}
                                            onChange={(e) => setTotalArea(parseFloat(e.target.value))}
                                            className="w-full bg-transparent text-center text-2xl font-black text-slate-800 outline-none"
                                        />
                                        <span className="text-xs font-bold text-slate-400">კვ.მ</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block text-center">ჭერის სიმაღლე</label>
                                    <div className="bg-slate-50 p-4 rounded-[2rem] text-center border border-slate-100">
                                        <input
                                            type="number"
                                            value={ceilingHeight}
                                            onChange={(e) => setCeilingHeight(parseFloat(e.target.value))}
                                            className="w-full bg-transparent text-center text-2xl font-black text-slate-800 outline-none"
                                        />
                                        <span className="text-xs font-bold text-slate-400">მეტრი</span>
                                    </div>
                                </div>
                                <div className="col-span-2 bg-slate-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden flex flex-col justify-center items-center">
                                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-wider mb-2 relative z-10">სივრცის ათვისება</p>
                                    <div className="flex items-end space-x-2 relative z-10">
                                        <span className={`text-4xl font-black ${utilizationPercent > 100 ? 'text-red-400' : ''}`}>{utilizationPercent}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full mt-3 relative z-10 overflow-hidden">
                                        <div className={`h-full transition-all duration-500 ${utilizationPercent > 100 ? 'bg-red-500' : 'bg-lime-400'}`} style={{ width: `${Math.min(utilizationPercent, 100)}%` }}></div>
                                    </div>
                                    <Layout size={80} className="absolute -right-4 -bottom-4 text-white/5 rotate-12" />
                                </div>
                            </div>
                        </div>

                        {/* Zones */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                                <h4 className="font-black text-slate-800 flex items-center text-sm uppercase">
                                    <ShowerHead size={18} className="mr-2 text-cyan-500" />
                                    სველი წერტილები
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                        <span className="text-xs font-bold text-slate-600">გასახდელი (კაცი)</span>
                                        <div className="flex items-center space-x-3">
                                            <button onClick={() => setMaleLockerRooms(Math.max(0, maleLockerRooms - 1))} className="w-6 h-6 rounded-lg bg-white shadow flex items-center justify-center text-slate-400 hover:text-slate-800">-</button>
                                            <span className="font-black text-lg w-4 text-center">{maleLockerRooms}</span>
                                            <button onClick={() => setMaleLockerRooms(maleLockerRooms + 1)} className="w-6 h-6 rounded-lg bg-white shadow flex items-center justify-center text-slate-400 hover:text-slate-800">+</button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                        <span className="text-xs font-bold text-slate-600">კარადა (კაცი)</span>
                                        <input type="number" value={maleLockersCount} onChange={e => setMaleLockersCount(parseInt(e.target.value))} className="w-16 text-center bg-white py-1 rounded-lg text-sm font-black outline-none" />
                                    </div>
                                    <div className="h-px bg-slate-100"></div>
                                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                        <span className="text-xs font-bold text-slate-600">გასახდელი (ქალი)</span>
                                        <div className="flex items-center space-x-3">
                                            <button onClick={() => setFemaleLockerRooms(Math.max(0, femaleLockerRooms - 1))} className="w-6 h-6 rounded-lg bg-white shadow flex items-center justify-center text-slate-400 hover:text-slate-800">-</button>
                                            <span className="font-black text-lg w-4 text-center">{femaleLockerRooms}</span>
                                            <button onClick={() => setFemaleLockerRooms(femaleLockerRooms + 1)} className="w-6 h-6 rounded-lg bg-white shadow flex items-center justify-center text-slate-400 hover:text-slate-800">+</button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                        <span className="text-xs font-bold text-slate-600">კარადა (ქალი)</span>
                                        <input type="number" value={femaleLockersCount} onChange={e => setFemaleLockersCount(parseInt(e.target.value))} className="w-16 text-center bg-white py-1 rounded-lg text-sm font-black outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                                    <h4 className="font-black text-slate-800 flex items-center text-sm uppercase">
                                        <Coffee size={18} className="mr-2 text-amber-600" />
                                        კომფორტის ზონები
                                    </h4>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                        <span className="text-xs font-bold text-slate-600">საშხაპეები / WC</span>
                                        <div className="flex items-center space-x-3">
                                            <button onClick={() => setBathrooms(Math.max(0, bathrooms - 1))} className="w-6 h-6 rounded-lg bg-white shadow flex items-center justify-center text-slate-400 hover:text-slate-800">-</button>
                                            <span className="font-black text-lg w-4 text-center">{bathrooms}</span>
                                            <button onClick={() => setBathrooms(bathrooms + 1)} className="w-6 h-6 rounded-lg bg-white shadow flex items-center justify-center text-slate-400 hover:text-slate-800">+</button>
                                        </div>
                                    </div>
                                    <div className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${hasBar ? 'bg-amber-100 ring-2 ring-amber-400' : 'bg-slate-50'}`} onClick={() => setHasBar(!hasBar)}>
                                        <span className={`text-xs font-bold ${hasBar ? 'text-amber-700' : 'text-slate-600'}`}>ცალკე ბარი / კაფეტერია</span>
                                        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${hasBar ? 'bg-amber-500' : 'bg-slate-200'}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${hasBar ? 'translate-x-4' : ''}`}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl flex items-center justify-between group cursor-pointer hover:bg-slate-800 transition-colors" onClick={() => fileInputRef.current?.click()}>
                                    <div>
                                        <h4 className="font-black text-sm mb-1 flex items-center"><Upload size={16} className="mr-2" /> ატვირთე ნახაზი</h4>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">{blueprint ? blueprint.name : "აირჩიეთ ფაილი (PDF, IMG)"}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                        {blueprint?.preview ? (
                                            <img src={blueprint.preview} className="w-full h-full object-cover rounded-2xl" />
                                        ) : (
                                            <FileImage size={24} />
                                        )}
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleBlueprintUpload} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rooms List */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="font-black text-slate-800 flex items-center text-sm uppercase">
                                    <DoorOpen size={18} className="mr-2 text-indigo-500" />
                                    სივრცეები
                                </h4>
                                <div className="flex space-x-2">
                                    <button onClick={() => addRoom('group')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-500 transition-colors"><UsersRound size={16} /></button>
                                    <button onClick={() => addRoom('other')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-800 transition-colors"><Plus size={16} /></button>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
                                {rooms.map((room) => (
                                    <div key={room.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <input
                                                value={room.name}
                                                onChange={e => updateRoom(room.id, 'name', e.target.value)}
                                                className="bg-transparent font-bold text-sm text-slate-800 w-full outline-none focus:text-indigo-600"
                                            />
                                            <button onClick={() => deleteRoom(room.id)} className="text-slate-300 hover:text-red-400 transition-colors"><X size={14} /></button>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="flex-1 bg-white rounded-lg p-2 flex items-center justify-between border border-slate-100">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">კვ.მ</span>
                                                <input
                                                    type="number"
                                                    value={room.area}
                                                    onChange={e => updateRoom(room.id, 'area', parseFloat(e.target.value))}
                                                    className="w-12 text-right text-xs font-black outline-none"
                                                />
                                            </div>
                                            <div className={`p-2 rounded-lg ${room.type === 'group' ? 'bg-indigo-100 text-indigo-500' : 'bg-slate-200 text-slate-500'}`}>
                                                {room.type === 'group' ? <UsersRound size={14} /> : <Layout size={14} />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- MAIN SETTINGS DASHBOARD ---
    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn pb-24">
            {/* Header */}
            <header className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
                        <Settings className="mr-3 text-slate-300" size={32} />
                        {t('title.settings')}
                    </h1>
                    <p className="text-slate-500 font-bold mt-2 ml-1">მართეთ სისტემის პარამეტრები და კონფიგურაცია ერთ სივრცეში</p>
                </div>

                {/* Language Switcher */}
                <div className="flex items-center bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => setLanguage(lang.code as any)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${language === lang.code
                                ? 'bg-slate-900 text-white shadow-md'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            {lang.native}
                        </button>
                    ))}
                </div>
            </header>

            {/* Profile Completion Progress Bar */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/20">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-emerald-500 rounded-lg text-white shadow-lg shadow-emerald-500/30">
                                <Activity size={20} />
                            </div>
                            <h3 className="text-xl font-black tracking-tight">სისტემის მზაობა</h3>
                        </div>
                        <p className="text-slate-400 text-sm font-medium">შეავსეთ ყველა სავალდებულო ველი სისტემის გასაშვებად</p>
                    </div>

                    <div className="flex-1 max-w-md w-full">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">
                                {completionStats.completed} / {completionStats.total} ეტაპი დასრულებულია
                            </span>
                            <span className="text-2xl font-black">{completionStats.percentage}%</span>
                        </div>
                        <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-out relative"
                                style={{ width: `${completionStats.percentage}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none"></div>
            </div>

            {/* Main Navigation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {/* 1. Company Profile (Step 0) */}
                <button
                    onClick={() => setActiveSubView('COMPANY')}
                    className={`group relative p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 hover:-translate-y-1 text-left ${onboardingStep === 0 ? 'ring-4 ring-purple-500/20 shadow-2xl scale-[1.02]' : ''}`}
                >
                    <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Building2 size={28} />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-2">კომპანიის პროფილი</h3>
                    <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed">
                        საიდენტიფიკაციო მონაცემები, ლოგო და ფილიალები
                    </p>
                    {onboardingStep > 0 && (
                        <div className="absolute top-6 right-6 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Check size={16} className="text-purple-600" />
                        </div>
                    )}
                    <div className="flex items-center text-purple-500 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        <span>რედაქტირება</span>
                        <ArrowRight size={14} className="ml-2" />
                    </div>
                </button>

                {/* 2. Digital Settings Card (Step 3) */}
                <button
                    onClick={() => setActiveSubView('DIGITAL')}
                    disabled={onboardingStep < 3}
                    className={`group relative p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:border-pink-200 hover:shadow-xl hover:shadow-pink-500/5 transition-all duration-300 hover:-translate-y-1 text-left ${onboardingStep < 3 ? 'opacity-20 grayscale pointer-events-none blur-[2px]' : ''} ${onboardingStep === 3 ? 'ring-4 ring-pink-500/20 shadow-2xl scale-[1.02]' : ''}`}
                >
                    <div className="w-14 h-14 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Globe2 size={28} />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-2">ციფრული ინტეგრაცია</h3>
                    <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed">
                        სოციალური ქსელები, ვებ-გვერდი და საკონტაქტო არხები
                    </p>
                    {onboardingStep > 3 && (
                        <div className="absolute top-6 right-6 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                            <Check size={16} className="text-pink-600" />
                        </div>
                    )}
                    <div className="flex items-center text-pink-500 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        <span>დაკავშირება</span>
                        <ArrowRight size={14} className="ml-2" />
                    </div>
                </button>

                {/* 3. Bank Details Card */}
                <button
                    onClick={() => setActiveSubView('BANK')}
                    disabled={onboardingStep < 4}
                    className={`group relative p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 hover:-translate-y-1 text-left ${onboardingStep < 4 ? 'opacity-20 grayscale pointer-events-none blur-[2px]' : ''} ${onboardingStep === 4 ? 'ring-4 ring-orange-500/20 shadow-2xl scale-[1.02]' : ''}`}
                >
                    <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Landmark size={28} />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-2">საბანკო რეკვიზიტები</h3>
                    <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed">
                        ანგარიშსწორების დეტალები და ინვოისის პარამეტრები
                    </p>
                    {onboardingStep > 4 && (
                        <div className="absolute top-6 right-6 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <Check size={16} className="text-orange-600" />
                        </div>
                    )}
                    <div className="flex items-center text-orange-500 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        <span>შეცვლა</span>
                        <ArrowRight size={14} className="ml-2" />
                    </div>
                </button>

                {/* 4. Gym Modeling (Step 1) */}
                <button
                    onClick={() => setActiveSubView('MODELING')}
                    disabled={onboardingStep < 1}
                    className={`group relative p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1 text-left ${onboardingStep < 1 ? 'opacity-20 grayscale pointer-events-none blur-[2px]' : ''} ${onboardingStep === 1 ? 'ring-4 ring-emerald-500/20 shadow-2xl scale-[1.02]' : ''}`}
                >
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Ruler size={28} />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-2">დარბაზის მოდელირება</h3>
                    <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed">
                        სივრცის დაგეგმარება, ზონები და კარადათა რაოდენობა
                    </p>
                    {onboardingStep > 1 && (
                        <div className="absolute top-6 right-6 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Check size={16} className="text-emerald-600" />
                        </div>
                    )}
                    <div className="flex items-center text-emerald-500 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        <span>დაგეგმვა</span>
                        <ArrowRight size={14} className="ml-2" />
                    </div>
                </button>

                {/* 5. Sports Inventory Card (Step 2) */}
                <button
                    onClick={() => setActiveSubView('INVENTORY')}
                    disabled={onboardingStep < 2}
                    className={`group relative p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:border-sky-200 hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300 hover:-translate-y-1 text-left ${onboardingStep < 2 ? 'opacity-20 grayscale pointer-events-none blur-[2px]' : ''} ${onboardingStep === 2 ? 'ring-4 ring-sky-500/20 shadow-2xl scale-[1.02]' : ''}`}
                >
                    <div className="w-14 h-14 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Dumbbell size={28} />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-2">სპორტული ინვენტარი</h3>
                    <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed">
                        დარბაზში განთავსებული სავარჯიშო ინსტრუმენტების სია
                    </p>
                    {onboardingStep > 2 && (
                        <div className="absolute top-6 right-6 w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                            <Check size={16} className="text-sky-600" />
                        </div>
                    )}
                    <div className="flex items-center text-sky-500 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        <span>მართვა</span>
                        <ArrowRight size={14} className="ml-2" />
                    </div>
                </button>

                {/* 6. System Builder (Step 6) */}
                <button
                    onClick={() => setActiveSubView('BUILDER')}
                    disabled={onboardingStep < 6}
                    className={`group relative p-8 bg-indigo-600 rounded-[2.5rem] shadow-xl shadow-indigo-600/20 hover:shadow-2xl hover:shadow-indigo-600/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden ${onboardingStep < 6 ? 'opacity-20 grayscale pointer-events-none blur-[2px]' : ''} ${onboardingStep === 6 ? 'ring-4 ring-indigo-400 animate-pulse' : ''}`}
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <LayoutTemplate size={120} className="text-white transform rotate-12" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between space-y-8">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
                            <LayoutTemplate size={28} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-black text-white mb-2">სისტემის აწყობა</h3>
                            <p className="text-indigo-100 text-xs font-medium leading-relaxed opacity-80">
                                აირჩიეთ სასურველი მოდულები და მოარგეთ ინტერფეისი თქვენს საჭიროებებს
                            </p>
                        </div>
                        {onboardingStep > 6 && (
                            <div className="absolute top-6 right-6 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <Check size={16} className="text-white" />
                            </div>
                        )}
                        <div className="flex items-center text-white/80 text-xs font-bold uppercase tracking-wider group-hover:text-white transition-colors">
                            <span>კონფიგურაცია</span>
                            <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </button>

                {/* 7. Structure (Step 5) */}
                <button
                    onClick={() => setActiveSubView('STRUCTURE')}
                    disabled={onboardingStep < 5}
                    className={`group relative p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1 text-left ${onboardingStep < 5 ? 'opacity-20 grayscale pointer-events-none blur-[2px]' : ''} ${onboardingStep === 5 ? 'ring-4 ring-blue-500/20 shadow-2xl scale-[1.02]' : ''}`}
                >
                    <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Network size={28} />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-2">სტრუქტურა</h3>
                    <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed">
                        დეპარტამენტები, პოზიციები და თანამშრომლების იერარქია
                    </p>
                    {onboardingStep > 5 && (
                        <div className="absolute top-6 right-6 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Check size={16} className="text-blue-600" />
                        </div>
                    )}
                    <div className="flex items-center text-blue-500 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        <span>მართვა</span>
                        <ArrowRight size={14} className="ml-2" />
                    </div>
                </button>

                {/* 8. Branch Management */}
                {hasBranches && (
                    <button
                        onClick={() => setActiveSubView('BRANCHES')}
                        className="group relative p-8 bg-emerald-600 rounded-[2.5rem] shadow-xl shadow-emerald-600/20 hover:shadow-2xl hover:shadow-emerald-600/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <GitBranch size={120} className="text-white transform rotate-12" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between space-y-8">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
                                <GitBranch size={28} />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-black text-white mb-2">ფილიალის მართვა</h3>
                                <p className="text-emerald-100 text-xs font-medium leading-relaxed opacity-80">
                                    მართეთ ფილიალები და ლოკაციები
                                </p>
                            </div>
                            <div className="flex items-center text-white/80 text-xs font-bold uppercase tracking-wider group-hover:text-white transition-colors">
                                <span>გახსნა</span>
                                <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </button>
                )}

                {/* 9. Instructions */}
                <button
                    onClick={() => setActiveSubView('INSTRUCTIONS')}
                    disabled={onboardingStep < 7}
                    className={`group relative p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1 text-left ${onboardingStep < 7 ? 'opacity-20 grayscale pointer-events-none blur-[2px]' : ''}`}
                >
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <BookOpen size={28} />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-2">ინსტრუქცია</h3>
                    <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed">
                        დეტალური გზამკვლევი სისტემის სამართავად
                    </p>
                    <div className="flex items-center text-indigo-500 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        <span>ნახვა</span>
                        <ArrowRight size={14} className="ml-2" />
                    </div>
                </button>

                {/* Security Card (Placeholder) */}
                <div className="group p-8 bg-slate-50 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-rose-500/10 transition-all cursor-not-allowed opacity-60">
                    <div className="space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-white text-slate-400 flex items-center justify-center shadow-sm">
                            <Lock size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-400 mb-2">უსაფრთხოება</h3>
                            <p className="text-xs text-slate-400 font-bold leading-relaxed">პაროლების პოლიტიკა, 2FA და სესიების მართვა (In Progress)</p>
                        </div>
                    </div>
                </div>

                {/* Theme Card (Placeholder) */}
                <div className="group p-8 bg-slate-50 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-violet-500/10 transition-all cursor-not-allowed opacity-60">
                    <div className="space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-white text-slate-400 flex items-center justify-center shadow-sm">
                            <Moon size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-400 mb-2">ინტერფეისი</h3>
                            <p className="text-xs text-slate-400 font-bold leading-relaxed">ფერების პალიტრა, თემები და ვიზუალური ეფექტები (In Progress)</p>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes scaleIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
              }
              .animate-fadeIn {
                animation: fadeIn 0.4s ease-out forwards;
              }
              .animate-scaleIn {
                animation: scaleIn 0.3s ease-out forwards;
              }
              .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
              }
            `}</style>
        </div >
    );

}
