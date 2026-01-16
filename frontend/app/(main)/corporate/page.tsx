
'use client';
import React, { useState, useRef } from 'react';
import {
    Building2,
    Plus,
    FileSpreadsheet,
    Upload,
    Search,
    CheckCircle,
    XCircle,
    Save,
    ArrowLeft,
    Users,
    Percent,
    Trash2,
    FileText,
    FileCheck,
    ShieldCheck,
    User,
    Phone,
    Handshake,
    ExternalLink,
    Shield,
    Briefcase,
    Star
} from 'lucide-react';
import { CorporateClient } from '@/app/types';

interface PartnerCompany {
    id: string;
    name: string;
    type: string; // e.g., "სადაზღვევო", "საცალო ვაჭრობა", "მედია"
    contactPerson: string;
    phone: string;
    status: 'Active' | 'Pending';
    logoText: string;
    benefits?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function CorporatePage() {
    const [clients, setClients] = useState<CorporateClient[]>([]);
    const [viewMode, setViewMode] = useState<'LIST' | 'CREATE'>('LIST');
    const [formType, setFormType] = useState<'CLIENT' | 'PARTNER'>('CLIENT');
    const [activeTab, setActiveTab] = useState<'CLIENTS' | 'PARTNERS'>('CLIENTS');

    // Verification State
    const [verifyCompanyId, setVerifyCompanyId] = useState<string>('');
    const [verifyName, setVerifyName] = useState<string>('');
    const [verificationResult, setVerificationResult] = useState<'IDLE' | 'FOUND' | 'NOT_FOUND'>('IDLE');

    // Partners State
    const [partners, setPartners] = useState<PartnerCompany[]>([]);

    React.useEffect(() => {
        const fetchCorporate = async () => {
            try {
                const clientRes = await fetch(`${API_URL}/api/corporate?category=CLIENT`);
                const clientData = await clientRes.json();
                setClients(clientData.map((c: any) => ({ ...c, id: c._id })));

                const partnerRes = await fetch(`${API_URL}/api/corporate?category=PARTNER`);
                const partnerData = await partnerRes.json();
                setPartners(partnerData.map((p: any) => ({ ...p, id: p._id })));
            } catch (error) {
                console.error("Failed to fetch corporate data:", error);
            }
        };
        fetchCorporate();
    }, []);

    // Form State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const contractInputRef = useRef<HTMLInputElement>(null);
    const representationInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: '',
        identCode: '',
        discount: '',
        type: '', // for partner
        customType: '', // for manual partner type
        benefits: '', // for partner benefits
        contactPerson: '',
        contactEmail: '',
        phone: '',
        fileName: '',
        contractFileName: '',
        repDocFileName: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'fileName' | 'contractFileName' | 'repDocFileName') => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, [field]: e.target.files![0].name }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formType === 'CLIENT') {
            const newClient = {
                category: 'CLIENT',
                name: formData.name,
                identCode: formData.identCode,
                discountPercentage: parseInt(formData.discount) || 0,
                contactPerson: formData.contactPerson,
                contactEmail: formData.contactEmail,
                phone: formData.phone,
                employeeFile: formData.fileName || undefined,
                activeEmployees: Math.floor(Math.random() * 50) + 10 // Mock number
            };

            try {
                const res = await fetch(`${API_URL}/api/corporate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newClient)
                });
                if (res.ok) {
                    const savedClient = await res.json();
                    setClients(prev => [...prev, { ...savedClient, id: savedClient._id }]);
                    alert('კორპორატიული კლიენტი დაემატა, დოკუმენტაცია და თანამშრომელთა ბაზა განახლებულია.');
                }
            } catch (error) {
                console.error("Failed to save client:", error);
            }

        } else {
            const finalType = formData.type === 'სხვა' ? formData.customType : (formData.type || 'პარტნიორი');
            const newPartner = {
                category: 'PARTNER',
                name: formData.name,
                type: finalType,
                contactPerson: formData.contactPerson,
                phone: formData.phone,
                status: 'Pending',
                logoText: formData.name.charAt(0).toUpperCase(),
                benefits: formData.benefits
            };

            try {
                const res = await fetch(`${API_URL}/api/corporate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newPartner)
                });
                if (res.ok) {
                    const savedPartner = await res.json();
                    setPartners(prev => [...prev, { ...savedPartner, id: savedPartner._id }]);
                    alert('პარტნიორი კომპანია დაემატა.');
                }
            } catch (error) {
                console.error("Failed to save partner:", error);
            }
        }

        setViewMode('LIST');
        setFormData({ name: '', identCode: '', discount: '', type: '', customType: '', benefits: '', contactPerson: '', contactEmail: '', phone: '', fileName: '', contractFileName: '', repDocFileName: '' });
    };

    const handleVerify = () => {
        if (!verifyCompanyId || !verifyName) return;
        setVerificationResult('IDLE');
        setTimeout(() => {
            const isFound = verifyName.toLowerCase().includes('გიორგი') || verifyName.toLowerCase().includes('ანა');
            setVerificationResult(isFound ? 'FOUND' : 'NOT_FOUND');
        }, 600);
    };

    if (viewMode === 'CREATE') {
        return (
            <div className="max-w-5xl mx-auto animate-fadeIn pb-12">
                <button
                    onClick={() => setViewMode('LIST')}
                    className="flex items-center text-slate-500 hover:text-white transition-colors mb-6 group"
                >
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase text-xs tracking-widest">სიაში დაბრუნება</span>
                </button>

                <div className="bg-[#161b22] rounded-[2.5rem] shadow-xl border border-slate-800 overflow-hidden">
                    <div className="p-8 border-b border-slate-800 bg-[#0d1117] flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                <Building2 size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">
                                    {formType === 'CLIENT' ? 'კორპორატიული კლიენტის რეგისტრაცია' : 'პარტნიორი კომპანიის რეგისტრაცია'}
                                </h2>
                                <p className="text-slate-500 text-sm font-medium">კომპანიის დეტალები და ოფიციალური დოკუმენტაცია</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* General Info */}
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-slate-800 pb-3">კომპანიის მონაცემები</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase ml-1">კომპანიის დასახელება</label>
                                        <input required name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="მაგ: შპს კომპანია" className="w-full px-5 py-3.5 rounded-2xl border border-slate-700 bg-[#0d1117] focus:border-blue-500 outline-none transition-all font-bold text-white placeholder:text-slate-600" />
                                    </div>
                                    {formType === 'CLIENT' ? (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase ml-1">საიდენტიფიკაციო კოდი</label>
                                                <input required name="identCode" value={formData.identCode} onChange={handleInputChange} type="text" className="w-full px-5 py-3.5 rounded-2xl border border-slate-700 bg-[#0d1117] focus:border-blue-500 outline-none transition-all font-mono font-bold text-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase ml-1">ფასდაკლება (%)</label>
                                                <div className="relative">
                                                    <input required name="discount" value={formData.discount} onChange={handleInputChange} type="number" min="0" max="100" className="w-full px-5 py-3.5 rounded-2xl border border-slate-700 bg-[#0d1117] focus:border-blue-500 outline-none transition-all font-black text-lg text-white" placeholder="20" />
                                                    <Percent size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500" />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase ml-1">კომპანიის ტიპი</label>
                                                <select required name="type" value={formData.type} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl border border-slate-700 bg-[#0d1117] focus:border-blue-500 outline-none transition-all font-bold text-white">
                                                    <option value="">აირჩიეთ...</option>
                                                    <option value="სადაზღვევო">სადაზღვევო</option>
                                                    <option value="აფთიაქი / რითეილი">აფთიაქი / რითეილი</option>
                                                    <option value="მედია">მედია</option>
                                                    <option value="ბიზნეს ჰაბი">ბიზნეს ჰაბი</option>
                                                    <option value="სხვა">სხვა (მიუთითეთ ხელით)</option>
                                                </select>
                                            </div>
                                            {formData.type === 'სხვა' && (
                                                <div className="space-y-2 animate-fadeIn">
                                                    <label className="text-xs font-black text-slate-500 uppercase ml-1">მიუთითეთ ტიპი</label>
                                                    <input required name="customType" value={formData.customType} onChange={handleInputChange} type="text" placeholder="მაგ: IT კომპანია" className="w-full px-5 py-3.5 rounded-2xl border border-amber-500/50 bg-[#0d1117] focus:border-amber-500 outline-none transition-all font-bold text-white placeholder:text-slate-600" />
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase ml-1">ბენეფიტები (მოკლე აღწერა)</label>
                                                <textarea name="benefits" value={formData.benefits} onChange={handleInputChange as any} rows={3} placeholder="მაგ: 20% ფასდაკლება, უფასო კონსულტაცია..." className="w-full px-5 py-3.5 rounded-2xl border border-slate-700 bg-[#0d1117] focus:border-blue-500 outline-none transition-all font-bold text-white placeholder:text-slate-600 resize-none" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Contact Person Info */}
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-slate-800 pb-3">საკონტაქტო პირი</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase ml-1">სახელი და გვარი</label>
                                        <input name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} type="text" className="w-full px-5 py-3.5 rounded-2xl border border-slate-700 bg-[#0d1117] focus:border-blue-500 outline-none transition-all font-bold text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase ml-1">ელ-ფოსტა</label>
                                        <input name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} type="email" placeholder="mail@company.ge" className="w-full px-5 py-3.5 rounded-2xl border border-slate-700 bg-[#0d1117] focus:border-blue-500 outline-none transition-all font-bold text-white placeholder:text-slate-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase ml-1">ტელეფონი</label>
                                        <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full px-5 py-3.5 rounded-2xl border border-slate-700 bg-[#0d1117] focus:border-blue-500 outline-none transition-all font-bold text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-slate-800 pb-3 flex items-center">
                                <FileText size={16} className="mr-2" /> დოკუმენტაცია
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* 1. Employee List (Only for Clients) */}
                                {formType === 'CLIENT' && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">თანამშრომელთა სია</label>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${formData.fileName ? 'bg-emerald-500/10 border-emerald-500' : 'bg-[#0d1117] border-slate-700 hover:border-blue-400'}`}
                                        >
                                            <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e, 'fileName')} className="hidden" accept=".xlsx, .xls, .csv" />
                                            {formData.fileName ? (
                                                <div className="text-center">
                                                    <FileCheck size={32} className="mx-auto text-emerald-500 mb-2" />
                                                    <p className="text-[10px] font-black text-emerald-500 truncate max-w-full">{formData.fileName}</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <FileSpreadsheet size={32} className="text-slate-500 mb-2" />
                                                    <span className="text-[10px] font-black text-slate-500 uppercase">Excel ატვირთვა</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* 2. Contract Upload */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">ხელშეკრულება</label>
                                    <div
                                        onClick={() => contractInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${formData.contractFileName ? 'bg-blue-500/10 border-blue-500' : 'bg-[#0d1117] border-slate-700 hover:border-blue-400'}`}
                                    >
                                        <input type="file" ref={contractInputRef} onChange={(e) => handleFileChange(e, 'contractFileName')} className="hidden" />
                                        {formData.contractFileName ? (
                                            <div className="text-center">
                                                <FileCheck size={32} className="mx-auto text-blue-500 mb-2" />
                                                <p className="text-[10px] font-black text-blue-500 truncate max-w-full">{formData.contractFileName}</p>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload size={32} className="text-slate-500 mb-2" />
                                                <span className="text-[10px] font-black text-slate-500 uppercase">ხელშეკრულების ატვირთვა</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* 3. Representation Proof */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">წარმომადგენლობის საბუთი</label>
                                    <div
                                        onClick={() => representationInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${formData.repDocFileName ? 'bg-purple-500/10 border-purple-500' : 'bg-[#0d1117] border-slate-700 hover:border-blue-400'}`}
                                    >
                                        <input type="file" ref={representationInputRef} onChange={(e) => handleFileChange(e, 'repDocFileName')} className="hidden" />
                                        {formData.repDocFileName ? (
                                            <div className="text-center">
                                                <ShieldCheck size={32} className="mx-auto text-purple-500 mb-2" />
                                                <p className="text-[10px] font-black text-purple-500 truncate max-w-full">{formData.repDocFileName}</p>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload size={32} className="text-slate-500 mb-2" />
                                                <span className="text-[10px] font-black text-slate-500 uppercase">საბუთის ატვირთვა</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-10 border-t border-slate-800">
                            <button
                                type="submit"
                                className="flex items-center space-x-4 px-12 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-3xl shadow-2xl transition-all active:scale-95 group"
                            >
                                <Save size={20} />
                                <span className="uppercase text-xs tracking-widest">რეგისტრაციის დასრულება</span>
                            </button>
                        </div>
                    </form>
                </div >
            </div >
        );
    }

    // --- RENDER: List & Tabs View ---
    return (
        <div className="space-y-8 animate-fadeIn pb-12">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-white tracking-tight">კორპორატიული მართვა</h2>
                    <div className="flex space-x-1 bg-[#161b22] p-1 rounded-xl w-fit border border-slate-800">
                        <button
                            onClick={() => setActiveTab('CLIENTS')}
                            className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'CLIENTS' ? 'bg-[#0d1117] text-white shadow-sm border border-slate-700' : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            კორპორატიული კლიენტები
                        </button>
                        <button
                            onClick={() => setActiveTab('PARTNERS')}
                            className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'PARTNERS' ? 'bg-[#0d1117] text-white shadow-sm border border-slate-700' : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            პარტნიორი კომპანიები
                        </button>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setFormType(activeTab === 'CLIENTS' ? 'CLIENT' : 'PARTNER');
                        setViewMode('CREATE');
                    }}
                    className="flex items-center space-x-3 px-8 py-3.5 bg-lime-500 hover:bg-lime-400 text-slate-900 font-black rounded-2xl shadow-xl shadow-lime-500/20 transition-all active:scale-95 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    <span className="uppercase text-xs tracking-widest">
                        {activeTab === 'CLIENTS' ? 'ახალი კლიენტი' : 'ახალი პარტნიორი'}
                    </span>
                </button>
            </div>

            {activeTab === 'CLIENTS' ? (
                // --- EXISTING CLIENTS VIEW ---
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Verification Tool */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#161b22] rounded-[2.5rem] shadow-lg shadow-lime-500/10 border border-slate-800 p-8 sticky top-6">
                            <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-slate-800">
                                <div className="p-3 bg-lime-500/10 rounded-2xl text-lime-500">
                                    <CheckCircle size={24} />
                                </div>
                                <h3 className="font-black text-white text-lg">ფასდაკლების ვალიდაცია</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">კომპანია</label>
                                    <select
                                        value={verifyCompanyId}
                                        onChange={(e) => {
                                            setVerifyCompanyId(e.target.value);
                                            setVerificationResult('IDLE');
                                        }}
                                        className="w-full px-5 py-3.5 rounded-2xl border border-slate-700 bg-[#0d1117] focus:border-lime-500 outline-none font-bold text-white"
                                    >
                                        <option value="">აირჩიეთ...</option>
                                        {clients.map(client => (
                                            <option key={client.id} value={client.id}>{client.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">თანამშრომლის სახელი</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            placeholder="მაგ: გიორგი ბერიძე"
                                            value={verifyName}
                                            onChange={(e) => {
                                                setVerifyName(e.target.value);
                                                setVerificationResult('IDLE');
                                            }}
                                            className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-slate-700 bg-[#0d1117] focus:border-lime-500 outline-none font-bold transition-all text-white placeholder:text-slate-600"
                                        />
                                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-lime-500" />
                                    </div>
                                </div>

                                <button
                                    onClick={handleVerify}
                                    disabled={!verifyCompanyId || !verifyName}
                                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-white rounded-2xl font-black transition-all flex items-center justify-center shadow-xl active:scale-95 uppercase text-xs tracking-widest"
                                >
                                    შემოწმება
                                </button>
                            </div>

                            {/* Verification Result */}
                            {verificationResult !== 'IDLE' && (
                                <div className={`mt-8 p-6 rounded-[2rem] border-2 animate-fadeIn ${verificationResult === 'FOUND' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                                    <div className="flex items-start">
                                        {verificationResult === 'FOUND' ? (
                                            <CheckCircle size={28} className="text-emerald-500 mt-0.5 mr-4 shrink-0" />
                                        ) : (
                                            <XCircle size={28} className="text-red-500 mt-0.5 mr-4 shrink-0" />
                                        )}
                                        <div>
                                            <h4 className={`font-black text-lg ${verificationResult === 'FOUND' ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {verificationResult === 'FOUND' ? 'დადასტურებულია' : 'ვერ მოიძებნა'}
                                            </h4>
                                            <p className={`text-xs mt-2 font-bold leading-relaxed ${verificationResult === 'FOUND' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {verificationResult === 'FOUND'
                                                    ? `თანამშრომელი იძებნება ბაზაში. ეკუთვნის ფასდაკლება.`
                                                    : `აღნიშნული პიროვნება არ ფიქსირდება ატვირთულ ექსელის ფაილში.`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Client List */}
                    <div className="lg:col-span-2 space-y-4">
                        {clients.map((client) => (
                            <div key={client.id} className="bg-[#161b22] p-8 rounded-[2.5rem] border border-slate-800 shadow-sm hover:border-lime-500/50 transition-all group overflow-hidden relative">
                                <div className="absolute right-0 top-0 w-2 h-full bg-lime-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-5">
                                        <div className="w-16 h-16 bg-[#0d1117] rounded-2xl flex items-center justify-center text-blue-500 border border-slate-800 shadow-sm">
                                            <Building2 size={32} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-xl text-white">{client.name}</h3>
                                            <div className="flex items-center space-x-3 mt-1">
                                                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">ID: {client.identCode}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                                <span className="text-xs text-lime-500 font-black uppercase tracking-tighter">კორპორატიული</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="bg-lime-500/10 text-lime-500 px-4 py-2 rounded-2xl font-black text-lg shadow-sm border border-lime-500/20">
                                            -{client.discountPercentage}%
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-5 bg-[#0d1117] rounded-[1.5rem] border border-slate-800 space-y-1">
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2 flex items-center"><User size={12} className="mr-1" /> საკონტაქტო</p>
                                        <p className="text-base font-black text-slate-300">{client.contactPerson}</p>
                                        <p className="text-xs font-bold text-blue-500 mb-1">{client.contactEmail}</p>
                                        <p className="text-sm font-bold text-slate-500 flex items-center"><Phone size={12} className="mr-1.5" />{client.phone}</p>
                                    </div>
                                    <div className="p-5 bg-[#0d1117] rounded-[1.5rem] border border-slate-800 space-y-1">
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2 flex items-center"><Users size={12} className="mr-1" /> პორტფოლიო</p>
                                        <div className="flex items-center text-base font-black text-slate-300 mb-1">
                                            {client.activeEmployees} თანამშრომელი
                                        </div>
                                        {client.employeeFile && (
                                            <div className="flex items-center text-xs text-emerald-500 font-bold truncate">
                                                <FileSpreadsheet size={14} className="mr-1.5" />
                                                {client.employeeFile}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between items-center">
                                    <button className="text-xs font-black uppercase text-blue-500 hover:text-blue-400 tracking-widest flex items-center transition-all">
                                        დეტალების ნახვა
                                        <ArrowLeft size={16} className="ml-2 rotate-180" />
                                    </button>
                                    <button className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // --- NEW PARTNER COMPANIES VIEW ---
                <div className="animate-fadeIn space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {partners.map((partner) => (
                            <div key={partner.id} className="bg-[#161b22] rounded-[2.5rem] border border-slate-800 p-8 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${partner.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                        }`}>
                                        {partner.status === 'Active' ? 'აქტიური' : 'მოლოდინში'}
                                    </span>
                                </div>

                                <div className="flex flex-col items-center text-center space-y-4 pt-4">
                                    <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl shadow-2xl group-hover:bg-blue-600 transition-colors">
                                        {partner.logoText}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl text-white tracking-tight">{partner.name}</h3>
                                        <p className="text-blue-500 text-xs font-black uppercase tracking-[0.2em] mt-1">{partner.type}</p>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-3 pt-6 border-t border-slate-800">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 font-bold">საკონტაქტო:</span>
                                        <span className="text-slate-300 font-black">{partner.contactPerson}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 font-bold">ტელეფონი:</span>
                                        <span className="text-white font-black font-mono">{partner.phone}</span>
                                    </div>
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center space-x-2 py-3 bg-[#0d1117] border border-slate-800 text-slate-400 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all">
                                        <FileText size={14} />
                                        <span>ხელშეკრულება</span>
                                    </button>
                                    <button className="flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-blue-500 shadow-lg shadow-blue-500/30 transition-all">
                                        {partner.benefits ? (
                                            <span className="truncate max-w-[80%]">{partner.benefits}</span>
                                        ) : (
                                            <>
                                                <Star size={14} />
                                                <span>ბენეფიტები</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}


                    </div>

                    {/* Quick Stats for Partners */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                        <div className="bg-[#161b22] p-6 rounded-[2rem] border border-slate-800 shadow-sm flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500"><Handshake size={24} /></div>
                            <div><p className="text-[10px] font-black text-slate-500 uppercase">ჯამური პარტნიორი</p><p className="text-xl font-black text-white">{partners.length}</p></div>
                        </div>
                        <div className="bg-[#161b22] p-6 rounded-[2rem] border border-slate-800 shadow-sm flex items-center space-x-4">
                            <div className="w-12 h-12 bg-lime-500/10 rounded-2xl flex items-center justify-center text-lime-500"><Shield size={24} /></div>
                            <div><p className="text-[10px] font-black text-slate-500 uppercase">სადაზღვევო</p><p className="text-xl font-black text-white">2</p></div>
                        </div>
                        <div className="bg-[#161b22] p-6 rounded-[2rem] border border-slate-800 shadow-sm flex items-center space-x-4">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500"><Briefcase size={24} /></div>
                            <div><p className="text-[10px] font-black text-slate-500 uppercase">ბიზნეს ჰაბი</p><p className="text-xl font-black text-white">1</p></div>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-[2rem] flex items-center justify-between text-white group cursor-pointer hover:bg-slate-800 transition-colors border border-slate-700">
                            <div><p className="text-[10px] font-black text-blue-400 uppercase">ინტეგრაცია</p><p className="text-sm font-black">API კონექტორი</p></div>
                            <ExternalLink size={20} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
