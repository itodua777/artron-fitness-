
'use client';
import React, { useState, useEffect } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Phone, Mail, Calendar, Briefcase, Building2, CreditCard, ShieldCheck } from 'lucide-react';

export default function EmployeeProfilePage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [employee, setEmployee] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchEmployee = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/users/${id}`);
                if (res.ok) {
                    const u = await res.json();
                    setEmployee({
                        id: u.id,
                        firstName: u.firstName,
                        lastName: u.lastName,
                        fullName: `${u.firstName} ${u.lastName}`,
                        phone: u.phone,
                        email: u.email,
                        position: u.role?.name || 'პოზიცია არ არის მითითებული',
                        department: u.role?.department?.name || u.branch?.name || '',
                        branch: u.branch?.name,
                        salary: 0, // Not exposed
                        status: 'Active', // Default
                        joinDate: new Date(u.createdAt).toLocaleDateString('ka-GE'),
                        role: u.role?.name
                    });
                } else {
                    console.error('User not found');
                }
            } catch (error) {
                console.error('Error fetching employee:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployee();
    }, [id]);

    if (loading) return <div className="p-10 text-slate-500">იტვირთება...</div>;
    if (!employee) return <div className="p-10 text-slate-500">თანამშრომელი არ მოიძებნა</div>;

    return (
        <div className="max-w-5xl mx-auto animate-fadeIn pb-20">
            <button onClick={() => router.back()} className="flex items-center text-slate-500 hover:text-white transition-colors mb-6 group">
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">უკან დაბრუნება</span>
            </button>

            <div className="bg-[#161b22] rounded-[2.5rem] shadow-xl border border-slate-800 overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b border-slate-800 bg-[#0d1117]/50">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-[#1f2937] rounded-3xl flex items-center justify-center text-slate-400 font-black text-3xl border-4 border-slate-800 shadow-sm">
                            {employee.firstName?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-2">{employee.fullName}</h2>
                            <div className="flex items-center space-x-3">
                                <span className="px-3 py-1 bg-lime-500/10 text-lime-500 rounded-xl text-xs font-black uppercase tracking-widest">{employee.position}</span>
                                <span className="text-slate-500 text-sm font-bold flex items-center"><Building2 size={14} className="mr-1" /> {employee.department}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-10 space-y-12">
                    {/* Personal Info */}
                    <section className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center">
                            <User size={16} className="mr-2 text-blue-500" /> პირადი ინფორმაცია
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="space-y-1">
                                <div className="flex items-center text-[10px] font-black text-slate-500 uppercase mb-1"><Phone size={12} className="mr-1.5" /> მობილური</div>
                                <div className="text-white font-bold text-base bg-[#0d1117] px-4 py-3 rounded-xl border border-slate-800/50">{employee.phone || '-'}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center text-[10px] font-black text-slate-500 uppercase mb-1"><Mail size={12} className="mr-1.5" /> ელ-ფოსტა</div>
                                <div className="text-white font-bold text-base bg-[#0d1117] px-4 py-3 rounded-xl border border-slate-800/50">{employee.email}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center text-[10px] font-black text-slate-500 uppercase mb-1"><Calendar size={12} className="mr-1.5" /> რეგისტრაციის თარიღი</div>
                                <div className="text-white font-bold text-base bg-[#0d1117] px-4 py-3 rounded-xl border border-slate-800/50">{employee.joinDate}</div>
                            </div>
                        </div>
                    </section>

                    {/* Work Info */}
                    <section className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center pt-6 border-t border-slate-800">
                            <Briefcase size={16} className="mr-2 text-indigo-500" /> სამსახურეობრივი ინფორმაცია
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="space-y-1">
                                <div className="flex items-center text-[10px] font-black text-slate-500 uppercase mb-1"><Building2 size={12} className="mr-1.5" /> ფილიალი</div>
                                <div className="text-white font-bold text-base bg-[#0d1117] px-4 py-3 rounded-xl border border-slate-800/50">{employee.branch || '-'}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center text-[10px] font-black text-slate-500 uppercase mb-1"><ShieldCheck size={12} className="mr-1.5" /> როლი სისტემაში</div>
                                <div className="text-white font-bold text-base bg-[#0d1117] px-4 py-3 rounded-xl border border-slate-800/50">{employee.role || '-'}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center text-[10px] font-black text-slate-500 uppercase mb-1"><CreditCard size={12} className="mr-1.5" /> ხელფასი</div>
                                <div className="text-white font-bold text-base bg-[#0d1117] px-4 py-3 rounded-xl border border-slate-800/50">₾ {employee.salary}</div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
