
'use client';
import React, { useState, useMemo } from 'react';
import {
    Plus, Search, User, ArrowLeft, Filter,
    MoreVertical, X, FileText, Clock, Printer, Archive, Download,
    Users, FileStack, ClipboardCheck, Calendar, FilePlus, Share2, Megaphone,
    MapPin, ChevronsUpDown, CheckCircle2, Fingerprint, FileCheck, Smartphone, HeartPulse, ShieldAlert, Award
} from 'lucide-react';
import { Employee, EmployeeWorkSummary } from '@/app/types';
import { COUNTRIES } from '@/app/countries';

// Department and Position Structure
const departmentStructure = [
    {
        name: 'ადმინისტრაცია',
        positions: ['დირექტორი', 'HR მენეჯერი']
    },
    {
        name: 'ფიტნეს დეპარტამენტი',
        positions: ['მთავარი მწვრთნელი (Head Coach)', 'წვრთნელი დონე 2 (სენიორი)', 'წვრთნელი დონე 1 (ჯუნიორი)', 'ჯგუფური კლასების ინსტრუქტორი']
    },
    {
        name: 'ოპერაციებისა და კლიენტთა მომსახურების დეპარტამენტი',
        positions: ['ადმინისტრატორი', 'ბარისტა']
    },
    {
        name: 'ტექნიკური და მომსახურების დეპარტამენტი',
        positions: ['ტექნიკური სამსახურის უფროსი', 'დასუფთავების სამსახურის თანამშრომელი', 'IT მენეჯერი (ან - გარე პარტნიორი)']
    },
    {
        name: 'ფინანსებისა და ადმინისტრაციის დეპარტამენტი',
        positions: ['მთავარი ბუღალტერი']
    }
];

// Mock Data
const mockWorkSummaries: EmployeeWorkSummary[] = [
    { employeeId: 1, fullName: 'გიორგი ბერიძე', position: 'ადმინისტრატორი', totalHours: 168, workingDays: 21, lateCount: 0, overtimeHours: 8 },
    { employeeId: 2, fullName: 'ანა კალაძე', position: 'მთავარი ბუღალტერი', totalHours: 160, workingDays: 20, lateCount: 2, overtimeHours: 0 },
    { employeeId: 3, fullName: 'ლევან დოლიძე', position: 'Head Coach', totalHours: 175, workingDays: 22, lateCount: 0, overtimeHours: 15 },
];

export default function EmployeesPage() {
    const [viewMode, setViewMode] = useState<'LIST' | 'CREATE' | 'DETAIL' | 'CREATE_DOC'>('LIST');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [activeTab, setActiveTab] = useState<'EMPLOYEES' | 'ORDERS' | 'ATTENDANCE' | 'VACANCIES'>('EMPLOYEES');

    const [searchTerm, setSearchTerm] = useState('');
    const [attendanceSearch, setAttendanceSearch] = useState('');
    const [filters, setFilters] = useState({
        department: 'All',
        status: 'All'
    });

    const [employees, setEmployees] = useState<Employee[]>([]);

    const fetchEmployees = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/users`);
            if (res.ok) {
                const data = await res.json();
                // Map User to Employee type
                const mapped = data.map((u: any) => ({
                    id: u.id,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    fullName: `${u.firstName} ${u.lastName}`,
                    phone: u.phone,
                    email: u.email,
                    position: u.role?.name || 'სხვა',
                    department: u.role?.department?.name || u.branch?.name || '',
                    salary: 0, // Not exposed in User model yet
                    status: 'Active',
                    joinDate: new Date(u.createdAt).toLocaleDateString('ka-GE')
                }));
                setEmployees(mapped);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const [documents, setDocuments] = useState<any[]>([]);

    const fetchDocuments = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/documents`);
            if (res.ok) {
                const data = await res.json();
                setDocuments(data);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    React.useEffect(() => {
        fetchEmployees();
        fetchDocuments();
    }, []);

    const [attendanceLogs] = useState([
        { id: 1, employeeName: 'გიორგი ბერიძე', role: 'ადმინისტრატორი', time: '08:55', type: 'ENTRY', isLate: false },
        { id: 2, employeeName: 'ანა კალაძე', role: 'მთავარი ბუღალტერი', time: '09:15', type: 'ENTRY', isLate: true },
        { id: 3, employeeName: 'ლევან აბაშიძე', role: 'Trainer', time: '10:00', type: 'ENTRY', isLate: false },
        { id: 4, employeeName: 'გიორგი ბერიძე', role: 'ადმინისტრატორი', time: '18:05', type: 'EXIT', isLate: false }
    ]);

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', personalId: '', phone: '', email: '',
        position: '', department: '', salary: '',
        joinDate: '',
        // New Fields
        address: '', zipCode: '', citizenship: 'GE', passportNumber: '',
        idCardFile: null as File | null,
        criminalRecordFile: null as File | null,
        healthCertFile: null as File | null,
        certificateFile: null as File | null,
        contractFile: null as File | null
    });

    // Citizenship & Files State
    const [citizenshipSearch, setCitizenshipSearch] = useState('');
    const [isCitizenshipOpen, setIsCitizenshipOpen] = useState(false);
    const citizenshipRef = React.useRef<HTMLDivElement>(null);
    const fileRefs = React.useRef<{ [key: string]: HTMLInputElement | null }>({});

    // Filter countries
    const filteredCountries = useMemo(() => {
        return COUNTRIES.filter(c => c.name.toLowerCase().includes(citizenshipSearch.toLowerCase()));
    }, [citizenshipSearch]);

    // Click outside for citizenship dropdown
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (citizenshipRef.current && !citizenshipRef.current.contains(event.target as Node)) {
                setIsCitizenshipOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const [docForm, setDocForm] = useState({ title: '', date: new Date().toISOString().split('T')[0], content: '' });

    // --- VACANCY STATE ---
    const [vacancies, setVacancies] = useState([
        { id: 1, title: 'უფროსი მწვრთნელი', department: 'ფიტნეს დეპარტამენტი', salaryRange: '1500 - 2500', status: 'Active', applicants: 12 },
        { id: 2, title: 'ადმინისტრატორი', department: 'ოპერაციები', salaryRange: '800 - 1000', status: 'Closed', applicants: 45 }
    ]);
    const [vacancyForm, setVacancyForm] = useState({
        title: '',
        department: '',
        location: '',
        workingHours: '',
        salaryFrom: '',
        salaryTo: '',
        description: '',
        requirements: ''
    });

    const handleCreateVacancy = (e: React.FormEvent) => {
        e.preventDefault();
        const newVacancy = {
            id: vacancies.length + 1,
            title: vacancyForm.title,
            department: vacancyForm.department,
            location: vacancyForm.location,
            workingHours: vacancyForm.workingHours,
            salaryRange: `${vacancyForm.salaryFrom} - ${vacancyForm.salaryTo}`,
            status: 'Active',
            applicants: 0
        };
        setVacancies([newVacancy, ...vacancies]);
        setVacancyForm({ title: '', department: '', location: '', workingHours: '', salaryFrom: '', salaryTo: '', description: '', requirements: '' });
        alert('ვაკანსია გამოქვეყნდა წარმატებით!');
    };

    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            const matchesSearch = (emp.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (emp.position || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = filters.department === 'All' || emp.department === filters.department;
            return matchesSearch && matchesDept;
        });
    }, [employees, searchTerm, filters]);

    const filteredAttendance = useMemo(() => {
        return attendanceLogs.filter(log =>
            log.employeeName.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
            log.role.toLowerCase().includes(attendanceSearch.toLowerCase())
        );
    }, [attendanceLogs, attendanceSearch]);

    const handleSaveAndPrepare = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key.includes('File') && formData[key as keyof typeof formData]) {
                    data.append(key, formData[key as keyof typeof formData] as File);
                } else if (formData[key as keyof typeof formData]) {
                    data.append(key, formData[key as keyof typeof formData] as string);
                }
            });

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/employees`, {
                method: 'POST',
                body: data
            });

            if (res.ok) {
                const newEmp = await res.json();
                fetchEmployees(); // Refresh list

                setViewMode('CREATE_DOC');
                setDocForm({
                    title: 'ბრძანება # - ახალი თანამშრომლის აყვანის შესახებ',
                    date: new Date().toISOString().split('T')[0],
                    content: `ბრძანება #\n\nსაკითხი: თანამშრომლის აყვანა\n\nაღწერა: ვბრძანებ, დაინიშნოს ${formData.firstName} ${formData.lastName} (პ/ნ ${formData.personalId}) ${formData.position || '......'} პოზიციაზე.\n\n\n\nდირექტორი: ____________________\nთარიღი: ${new Date().toLocaleDateString('ka-GE')}`
                });
            } else {
                const errorData = await res.json().catch(() => ({}));
                console.error('Save failed:', res.status, errorData);
                alert(`შეცდომა შენახვისას: ${res.status} ${errorData.message || ''}`);
            }
        } catch (error: any) {
            console.error('Error saving employee:', error);
            alert(`შეცდომა შენახვისას (ქსელი/სხვა): ${error.message}`);
        }
    };

    const handleGeneralDocSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/documents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(docForm)
            });
            if (res.ok) {
                alert('დოკუმენტი დაარქივდა');
                fetchDocuments();
                setViewMode('LIST');
                setActiveTab('ORDERS');
            } else {
                alert('შეცდომა დოკუმენტის შენახვისას');
            }
        } catch (error) {
            console.error('Error saving document:', error);
            alert('შეცდომა დოკუმენტის შენახვისას');
        }
    };

    const handleManualPrepareDoc = () => {
        setDocForm({
            title: 'ბრძანება #',
            date: new Date().toISOString().split('T')[0],
            content: `ბრძანება #\n\nსაკითხი: \n\nაღწერა: \n\n\n\nდირექტორი: ____________________\nთარიღი: ${new Date().toLocaleDateString('ka-GE')}`
        });
        setViewMode('CREATE_DOC');
    };

    // --- RENDER VIEWS ---

    if (viewMode === 'CREATE') {
        return (
            <div className="max-w-5xl mx-auto animate-fadeIn pb-20">
                <button onClick={() => setViewMode('LIST')} className="flex items-center text-slate-500 hover:text-white transition-colors mb-6 group">
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">ბაზაში დაბრუნება</span>
                </button>
                <div className="bg-[#161b22] rounded-[2.5rem] shadow-xl border border-slate-800 overflow-hidden">
                    <div className="p-8 border-b border-slate-800 bg-[#0d1117]/50">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-lime-500 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shadow-lime-500/20">
                                <Plus size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">ახალი თანამშრომლის რეგისტრაცია</h2>
                                <p className="text-slate-500 text-sm font-medium">შეავსეთ მონაცემები პერსონალური ბრძანების დასაგენერირებლად</p>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSaveAndPrepare} className="p-10 space-y-10">
                        <section className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center">
                                <User size={16} className="mr-2 text-lime-500" /> პირადი ინფორმაცია
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="space-y-2"><label className="text-sm font-bold text-slate-400">სახელი <span className="text-red-500">*</span></label>
                                    <input required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} type="text" className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none" /></div>
                                <div className="space-y-2"><label className="text-sm font-bold text-slate-400">გვარი <span className="text-red-500">*</span></label>
                                    <input required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} type="text" className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none" /></div>

                                {/* Citizenship */}
                                <div className="space-y-2" ref={citizenshipRef}>
                                    <label className="text-sm font-bold text-slate-400">მოქალაქეობა <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="აირჩიეთ ქვეყანა..."
                                            value={citizenshipSearch}
                                            onChange={(e) => {
                                                setCitizenshipSearch(e.target.value);
                                                setIsCitizenshipOpen(true);
                                            }}
                                            onFocus={() => setIsCitizenshipOpen(true)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none"
                                        />
                                        <ChevronsUpDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                        {isCitizenshipOpen && (
                                            <div className="absolute z-50 w-full mt-1 bg-[#161b22] border border-slate-800 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                                                {filteredCountries.length > 0 ? (
                                                    filteredCountries.map(country => (
                                                        <div
                                                            key={country.code}
                                                            onClick={() => {
                                                                setFormData({ ...formData, citizenship: country.code });
                                                                setCitizenshipSearch(country.name);
                                                                setIsCitizenshipOpen(false);
                                                            }}
                                                            className="px-4 py-3 hover:bg-slate-800 cursor-pointer flex items-center justify-between group"
                                                        >
                                                            <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{country.name}</span>
                                                            {formData.citizenship === country.code && <CheckCircle2 size={14} className="text-lime-500" />}
                                                        </div>
                                                    ))
                                                ) : <div className="px-4 py-3 text-slate-500 text-xs font-medium">შედეგი არ მოიძებნა</div>}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">{formData.citizenship === 'GE' ? 'პირადი ნომერი' : 'პასპორტის ნომერი'} <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        value={formData.citizenship === 'GE' ? formData.personalId : formData.passportNumber}
                                        onChange={e => {
                                            if (formData.citizenship === 'GE') setFormData({ ...formData, personalId: e.target.value });
                                            else setFormData({ ...formData, passportNumber: e.target.value });
                                        }}
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none font-mono"
                                        maxLength={formData.citizenship === 'GE' ? 11 : 20}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center pt-6 border-t border-slate-800">
                                <Users size={16} className="mr-2 text-lime-500" /> საკონტაქტო და სამსახურეობრივი ინფორმაცია
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">მობილური <span className="text-red-500">*</span></label>
                                    <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">ელ-ფოსტა <span className="text-red-500">*</span></label>
                                    <input required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} type="email" className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">მისამართი</label>
                                    <div className="relative">
                                        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none" placeholder="ქუჩა, ქალაქი" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">საფოსტო კოდი</label>
                                    <input value={formData.zipCode} onChange={e => setFormData({ ...formData, zipCode: e.target.value })} type="text" className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none" />
                                </div>

                                {/* Department Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">დეპარტამენტი <span className="text-red-500">*</span></label>
                                    <select
                                        required
                                        value={formData.department}
                                        onChange={e => setFormData({ ...formData, department: e.target.value, position: '' })} // Reset position when dept changes
                                        className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="">აირჩიეთ დეპარტამენტი</option>
                                        {departmentStructure.map((dept, idx) => (
                                            <option key={idx} value={dept.name}>{dept.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Position Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">პოზიცია <span className="text-red-500">*</span></label>
                                    <select
                                        required
                                        value={formData.position}
                                        onChange={e => setFormData({ ...formData, position: e.target.value })}
                                        disabled={!formData.department}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">{formData.department ? 'აირჩიეთ პოზიცია' : 'ჯერ აირჩიეთ დეპარტამენტი'}</option>
                                        {formData.department && departmentStructure.find(d => d.name === formData.department)?.positions.map((pos, idx) => (
                                            <option key={idx} value={pos}>{pos}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">აყვანის თარიღი <span className="text-red-500">*</span></label>
                                    <input required value={formData.joinDate} onChange={e => setFormData({ ...formData, joinDate: e.target.value })} type="date" className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">ხელფასი (GEL) <span className="text-red-500">*</span></label>
                                    <input required value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} type="number" className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none" />
                                </div>
                            </div>
                        </section>

                        {/* Documents Section */}
                        <section className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center pt-6 border-t border-slate-800">
                                <FileText size={16} className="mr-2 text-lime-500" /> აუცილებელი დოკუმენტაცია
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">პირადობის / პასპორტის ასლი</label>
                                    <input
                                        type="file"
                                        ref={el => { if (el) fileRefs.current['idCard'] = el; }}
                                        className="hidden"
                                        onChange={e => setFormData({ ...formData, idCardFile: e.target.files?.[0] || null })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileRefs.current['idCard']?.click()}
                                        className={`w-full py-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center space-y-2 text-xs font-black uppercase transition-all ${formData.idCardFile ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' : 'border-slate-800 text-slate-500 hover:border-lime-500 hover:text-lime-400'}`}
                                    >
                                        {formData.idCardFile ? <FileCheck size={24} /> : <Smartphone size={24} />}
                                        <span>{formData.idCardFile ? 'ატვირთულია' : 'ატვირთვა'}</span>
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">ცნობა ნასამართლეობის შესახებ</label>
                                    <input
                                        type="file"
                                        ref={el => { if (el) fileRefs.current['criminalRecord'] = el; }}
                                        className="hidden"
                                        onChange={e => setFormData({ ...formData, criminalRecordFile: e.target.files?.[0] || null })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileRefs.current['criminalRecord']?.click()}
                                        className={`w-full py-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center space-y-2 text-xs font-black uppercase transition-all ${formData.criminalRecordFile ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' : 'border-slate-800 text-slate-500 hover:border-lime-500 hover:text-lime-400'}`}
                                    >
                                        {formData.criminalRecordFile ? <FileCheck size={24} /> : <ShieldAlert size={24} />}
                                        <span>{formData.criminalRecordFile ? 'ატვირთულია' : 'ატვირთვა'}</span>
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">ჯანმრთელობის ცნობა</label>
                                    <input
                                        type="file"
                                        ref={el => { if (el) fileRefs.current['healthCert'] = el; }}
                                        className="hidden"
                                        onChange={e => setFormData({ ...formData, healthCertFile: e.target.files?.[0] || null })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileRefs.current['healthCert']?.click()}
                                        className={`w-full py-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center space-y-2 text-xs font-black uppercase transition-all ${formData.healthCertFile ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' : 'border-slate-800 text-slate-500 hover:border-lime-500 hover:text-lime-400'}`}
                                    >
                                        {formData.healthCertFile ? <FileCheck size={24} /> : <HeartPulse size={24} />}
                                        <span>{formData.healthCertFile ? 'ატვირთულია' : 'ატვირთვა'}</span>
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">სერტიფიკატი</label>
                                    <input
                                        type="file"
                                        ref={el => { if (el) fileRefs.current['certificate'] = el; }}
                                        className="hidden"
                                        onChange={e => setFormData({ ...formData, certificateFile: e.target.files?.[0] || null })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileRefs.current['certificate']?.click()}
                                        className={`w-full py-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center space-y-2 text-xs font-black uppercase transition-all ${formData.certificateFile ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' : 'border-slate-800 text-slate-500 hover:border-lime-500 hover:text-lime-400'}`}
                                    >
                                        {formData.certificateFile ? <FileCheck size={24} /> : <Award size={24} />}
                                        <span>{formData.certificateFile ? 'ატვირთულია' : 'ატვირთვა'}</span>
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">ხელშეკრულება</label>
                                    <input
                                        type="file"
                                        ref={el => { if (el) fileRefs.current['contract'] = el; }}
                                        className="hidden"
                                        onChange={e => setFormData({ ...formData, contractFile: e.target.files?.[0] || null })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileRefs.current['contract']?.click()}
                                        className={`w-full py-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center space-y-2 text-xs font-black uppercase transition-all ${formData.contractFile ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' : 'border-slate-800 text-slate-500 hover:border-lime-500 hover:text-lime-400'}`}
                                    >
                                        {formData.contractFile ? <FileCheck size={24} /> : <FileText size={24} />}
                                        <span>{formData.contractFile ? 'ატვირთულია' : 'ატვირთვა'}</span>
                                    </button>
                                </div>
                            </div>
                        </section>
                        <div className="flex justify-between items-center pt-8 border-t border-slate-800">
                            <button type="button" onClick={() => setViewMode('LIST')} className="px-8 py-4 text-slate-500 font-bold hover:bg-slate-800 rounded-2xl">გაუქმება</button>
                            <button type="submit" className="flex items-center space-x-3 px-12 py-4 bg-lime-500 hover:bg-lime-400 text-slate-900 font-black rounded-2xl shadow-xl transition-all active:scale-95 group">
                                <ClipboardCheck size={20} /><span>შენახვა / დოკუმენტის მომზადება</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    if (viewMode === 'DETAIL' && selectedEmployee) {
        return (
            <div className="max-w-5xl mx-auto animate-fadeIn pb-20">
                <button onClick={() => setViewMode('LIST')} className="flex items-center text-slate-500 hover:text-white transition-colors mb-6 group">
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">ბაზაში დაბრუნება</span>
                </button>
                <div className="bg-[#161b22] rounded-[2.5rem] shadow-xl border border-slate-800 overflow-hidden">
                    <div className="p-8 border-b border-slate-800 bg-[#0d1117]/50">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-[#1f2937] rounded-2xl flex items-center justify-center text-slate-400 font-black text-2xl border-4 border-slate-800 shadow-sm">
                                {(selectedEmployee.fullName || selectedEmployee.firstName || '?').charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-1">{selectedEmployee.fullName || `${selectedEmployee.firstName || ''} ${selectedEmployee.lastName || ''}`}</h2>
                                <p className="text-lime-500 text-sm font-bold uppercase">{selectedEmployee.position}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-10 space-y-10">
                        <section className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center">
                                <User size={16} className="mr-2 text-lime-500" /> პირადი ინფორმაცია
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-slate-500 uppercase">მობილური</div>
                                    <div className="text-white font-bold text-lg">{selectedEmployee.phone}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-slate-500 uppercase">ელ-ფოსტა</div>
                                    <div className="text-white font-bold text-lg">{selectedEmployee.email}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-slate-500 uppercase">დეპარტამენტი</div>
                                    <div className="text-white font-bold text-lg">{selectedEmployee.department}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-slate-500 uppercase">აყვანის თარიღი</div>
                                    <div className="text-white font-bold text-lg">{selectedEmployee.joinDate}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-slate-500 uppercase">ხელფასი</div>
                                    <div className="text-white font-bold text-lg">₾ {selectedEmployee.salary}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-slate-500 uppercase">სტატუსი</div>
                                    <span className={`inline-flex px-3 py-1 rounded-xl text-xs font-black uppercase ${selectedEmployee.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                        {selectedEmployee.status === 'Active' ? 'აქტიური' : 'შვებულებაში'}
                                    </span>
                                </div>
                            </div>
                        </section>
                        <div className="pt-8 border-t border-slate-800 flex justify-end">
                            <button onClick={() => alert('რედაქტირება ჯერ არ არის აქტიური')} className="px-6 py-3 bg-[#1f2937] hover:bg-slate-700 text-white font-bold rounded-xl transition-colors">
                                რედაქტირება
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (viewMode === 'CREATE_DOC') {
        return (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="bg-[#161b22] w-full max-w-4xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[95vh] border border-slate-700">
                    <div className="p-8 border-b border-slate-800 bg-[#0d1117] flex justify-between items-center">
                        <div className="flex items-center space-x-4"><div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><FileText size={24} /></div><div><h3 className="text-xl font-black text-white">ბრძანების რედაქტირება</h3><p className="text-xs text-slate-500 font-bold uppercase">ოფიციალური დოკუმენტის გაფორმება</p></div></div>
                        <button onClick={() => setViewMode('LIST')} className="p-3 hover:bg-slate-800 rounded-2xl text-slate-500 transition-colors"><X size={24} /></button>
                    </div>
                    <div className="p-10 space-y-6 overflow-y-auto custom-scrollbar">
                        <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500">შინაარსი</label><textarea value={docForm.content} onChange={e => setDocForm({ ...docForm, content: e.target.value })} className="w-full px-8 py-8 bg-[#0d1117] border border-slate-700 rounded-[2.5rem] font-medium text-slate-300 outline-none focus:border-blue-500 transition-all h-[400px] resize-none leading-relaxed" /></div>
                    </div>
                    <div className="p-8 bg-[#0d1117] border-t border-slate-800 flex justify-end">
                        <button onClick={handleGeneralDocSubmit} className="flex items-center space-x-3 px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95"><Archive size={20} /><span>რეესტრში დაარქივება</span></button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">HR დეპარტამენტი</h2>
                    <p className="text-slate-500 text-sm font-medium">მართვა და ადმინისტრირება</p>
                </div>
                <div className="flex items-center space-x-4">
                    {activeTab === 'EMPLOYEES' && (
                        <button onClick={() => setViewMode('CREATE')} className="flex items-center space-x-2 px-6 py-3 bg-lime-500 hover:bg-lime-400 text-slate-900 font-black rounded-2xl shadow-lg transition-all active:scale-95"><Plus size={22} /><span>თანამშრომლის აყვანა</span></button>
                    )}
                    {activeTab === 'ORDERS' && (
                        <button onClick={handleManualPrepareDoc} className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"><FilePlus size={20} /><span>დოკუმენტის მომზადება</span></button>
                    )}
                </div>
            </div>

            <div className="flex space-x-6 border-b border-slate-800 overflow-x-auto no-scrollbar">
                {(['EMPLOYEES', 'ORDERS', 'ATTENDANCE', 'VACANCIES'] as const).map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 px-2 font-black text-sm transition-all border-b-4 whitespace-nowrap ${activeTab === tab ? 'border-lime-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                        <div className="flex items-center space-x-2 uppercase tracking-widest">
                            {tab === 'EMPLOYEES' ? <Users size={18} /> :
                                tab === 'ORDERS' ? <FileStack size={18} /> :
                                    tab === 'ATTENDANCE' ? <Clock size={18} /> :
                                        <Megaphone size={18} />}
                            <span>
                                {tab === 'EMPLOYEES' ? 'თანამშრომლები' :
                                    tab === 'ORDERS' ? 'ბრძანებების რეესტრი' :
                                        tab === 'ATTENDANCE' ? 'დასწრების რეესტრი' :
                                            'ვაკანსიის ფორმირება'}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {activeTab === 'EMPLOYEES' && (
                <div className="animate-fadeIn space-y-6">
                    <div className="bg-[#161b22] p-5 rounded-[2.5rem] shadow-sm border border-slate-800 flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="ძებნა..." className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none transition-all font-medium" /></div>
                    </div>
                    <div className="bg-[#161b22] rounded-[2.5rem] shadow-sm border border-slate-800 overflow-hidden">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-[#0d1117] text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                                <tr><th className="px-8 py-5">თანამშრომელი</th><th className="px-8 py-5">პოზიცია</th><th className="px-8 py-5">ხელფასი</th><th className="px-8 py-5">სტატუსი</th><th className="px-8 py-5 text-right"></th></tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredEmployees.map(emp => (
                                    <tr key={emp.id} onClick={() => window.location.href = `/employees/${emp.id}`} className="hover:bg-slate-800/50 cursor-pointer group transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-2xl bg-[#0d1117] flex items-center justify-center font-black text-slate-500 border-4 border-slate-800 shadow-sm">{(emp.fullName || emp.firstName || '').charAt(0)}</div>
                                                <div><div className="font-black text-white text-base">{emp.fullName || `${emp.firstName} ${emp.lastName}`}</div><div className="text-xs text-slate-500 font-bold uppercase">{emp.phone}</div></div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5"><div className="font-black text-slate-300">{emp.position}</div><div className="text-xs text-lime-500 font-bold">{emp.department}</div></td>
                                        <td className="px-8 py-5 font-black text-white">₾ {emp.salary}</td>
                                        <td className="px-8 py-5"><span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase ${emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{emp.status === 'Active' ? 'აქტიური' : 'შვებულებაში'}</span></td>
                                        <td className="px-8 py-5 text-right"><MoreVertical size={18} className="text-slate-500 group-hover:text-white transition-colors ml-auto" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}


            {activeTab === 'ORDERS' && (
                <div className="animate-fadeIn space-y-6">
                    <div className="bg-[#161b22] rounded-[2.5rem] shadow-sm border border-slate-800 overflow-hidden">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-[#0d1117] text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                                <tr>
                                    <th className="px-8 py-5">სათაური</th>
                                    <th className="px-8 py-5">თარიღი</th>
                                    <th className="px-8 py-5">ტიპი</th>
                                    <th className="px-8 py-5 text-right">მოქმედება</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {documents.length > 0 ? documents.map((doc: any) => (
                                    <tr key={doc._id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-8 py-5 font-black text-white">{doc.title}</td>
                                        <td className="px-8 py-5 font-bold">{doc.date}</td>
                                        <td className="px-8 py-5"><span className="px-3 py-1 rounded-xl bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase">{doc.type}</span></td>
                                        <td className="px-8 py-5 text-right"><FileText size={18} className="text-slate-500 hover:text-white transition-colors ml-auto cursor-pointer" /></td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={4} className="px-8 py-10 text-center text-slate-500">დოკუმენტები არ მოიძებნა</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'ATTENDANCE' && (
                <div className="animate-fadeIn space-y-10">
                    {/* MONTHLY SUMMARY SECTION */}
                    <div className="bg-[#161b22] rounded-[2.5rem] shadow-sm border border-slate-800 overflow-hidden">
                        <div className="p-8 border-b border-slate-800 bg-[#0d1117]/50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-lime-500 text-slate-900 rounded-2xl flex items-center justify-center">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white">თვის შემაჯამებელი რეესტრი</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase">ნოემბერი, 2023</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button className="flex items-center space-x-2 px-5 py-2.5 bg-[#0d1117] border border-slate-700 text-xs font-black rounded-xl hover:bg-slate-800 transition-all text-slate-400">
                                    <Printer size={16} />
                                    <span>ამობეჭდვა</span>
                                </button>
                                <button className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 text-white text-xs font-black rounded-xl hover:bg-emerald-500 transition-all">
                                    <Download size={16} />
                                    <span>ექსპორტი (XLS)</span>
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-[#0d1117] text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                                    <tr>
                                        <th className="px-8 py-5">თანამშრომელი</th>
                                        <th className="px-8 py-5">სამუშაო დღეები</th>
                                        <th className="px-8 py-5">ჯამური საათები</th>
                                        <th className="px-8 py-5">ზეგანაკვეთური</th>
                                        <th className="px-8 py-5">დაგვიანებები</th>
                                        <th className="px-8 py-5 text-right">სტატუსი</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {mockWorkSummaries.map(summary => (
                                        <tr key={summary.employeeId} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <div>
                                                    <div className="font-black text-white">{summary.fullName}</div>
                                                    <div className="text-[10px] text-slate-500 font-bold uppercase">{summary.position}</div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 font-bold">{summary.workingDays} დღე</td>
                                            <td className="px-8 py-5 font-black text-white">{summary.totalHours} სთ</td>
                                            <td className="px-8 py-5">
                                                {summary.overtimeHours > 0 ? (
                                                    <span className="text-emerald-500 font-black">+{summary.overtimeHours} სთ</span>
                                                ) : <span className="text-slate-600">0</span>}
                                            </td>
                                            <td className="px-8 py-5">
                                                {summary.lateCount > 0 ? (
                                                    <span className="text-red-500 font-black">{summary.lateCount} ჯერ</span>
                                                ) : <span className="text-emerald-500 font-black">0</span>}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="inline-flex items-center px-2 py-1 bg-lime-500/10 text-lime-500 rounded-lg text-[9px] font-black uppercase">გადამოწმებული</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* LOGS SECTION */}
                    <div className="bg-[#161b22] rounded-[2.5rem] shadow-sm border border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-800 bg-[#0d1117]/30 flex justify-between items-center">
                            <h3 className="font-black text-white flex items-center"><Clock size={20} className="mr-2 text-blue-500" /> დასწრების ისტორია (LIVE)</h3>
                            <div className="text-[10px] font-black bg-lime-500/10 text-lime-500 px-3 py-1 rounded-full uppercase">Live Monitor</div>
                        </div>
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-[#0d1117] text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                                <tr><th className="px-8 py-5">თანამშრომელი</th><th className="px-8 py-5">ტიპი</th><th className="px-8 py-5">დრო</th><th className="px-8 py-5">სტატუსი</th><th className="px-8 py-5 text-right">მოქმედება</th></tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredAttendance.map(log => (
                                    <tr key={log.id} className="hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-xl bg-[#0d1117] flex items-center justify-center font-black text-slate-500">{log.employeeName.charAt(0)}</div>
                                                <div><div className="font-black text-white">{log.employeeName}</div><div className="text-[10px] text-slate-500 font-bold uppercase">{log.role}</div></div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 font-black text-xs">
                                            {log.type === 'ENTRY' ? <span className="text-emerald-500">შემოსვლა</span> : <span className="text-orange-500">გასვლა</span>}
                                        </td>
                                        <td className="px-8 py-5 font-mono text-xs font-black text-slate-300">{log.time}</td>
                                        <td className="px-8 py-5">
                                            {log.isLate ? (
                                                <span className="flex items-center text-red-500 font-black text-[10px] uppercase bg-red-500/10 px-2 py-1 rounded-lg w-fit">დაგვიანება</span>
                                            ) : (
                                                <span className="text-emerald-500 font-black text-[10px] uppercase bg-emerald-500/10 px-2 py-1 rounded-lg w-fit">დროულად</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-right"><Share2 size={16} className="text-slate-600 ml-auto" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {activeTab === 'VACANCIES' && (
                <div className="animate-fadeIn grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT: CREATE VACANCY */}
                    <div className="lg:col-span-1 bg-[#161b22] rounded-[2.5rem] shadow-sm border border-slate-800 p-8 h-fit">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="w-12 h-12 bg-lime-500 text-slate-900 rounded-2xl flex items-center justify-center font-black">
                                <Megaphone size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white leading-none">ახალი ვაკანსია</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase mt-1">ფორმირება და გამოქვეყნება</p>
                            </div>
                        </div>

                        <form onSubmit={handleCreateVacancy} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase">პოზიციის დასახელება</label>
                                <input required value={vacancyForm.title} onChange={e => setVacancyForm({ ...vacancyForm, title: e.target.value })} type="text" className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none transition-all font-bold" placeholder="მაგ: მენეჯერი" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase">დეპარტამენტი</label>
                                <select required value={vacancyForm.department} onChange={e => setVacancyForm({ ...vacancyForm, department: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none appearance-none font-bold">
                                    <option value="">აირჩიეთ...</option>
                                    {departmentStructure.map((dept, idx) => (
                                        <option key={idx} value={dept.name}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase">მდებარეობა</label>
                                    <div className="relative">
                                        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input required value={vacancyForm.location} onChange={e => setVacancyForm({ ...vacancyForm, location: e.target.value })} type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none font-bold" placeholder="ქალაქი/ფილიალი" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase">სამუშაო საათები</label>
                                    <div className="relative">
                                        <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input required value={vacancyForm.workingHours} onChange={e => setVacancyForm({ ...vacancyForm, workingHours: e.target.value })} type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none font-bold" placeholder="მაგ: 10:00 - 19:00" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase">ხელფასი (-დან)</label>
                                    <input required value={vacancyForm.salaryFrom} onChange={e => setVacancyForm({ ...vacancyForm, salaryFrom: e.target.value })} type="number" className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase">(-მდე)</label>
                                    <input required value={vacancyForm.salaryTo} onChange={e => setVacancyForm({ ...vacancyForm, salaryTo: e.target.value })} type="number" className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none font-bold" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase">მოკლე აღწერა</label>
                                <textarea required value={vacancyForm.description} onChange={e => setVacancyForm({ ...vacancyForm, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#0d1117] text-white focus:border-lime-500 outline-none font-medium h-24 resize-none" placeholder="მოვალეობები..." />
                            </div>

                            <button type="submit" className="w-full py-4 bg-lime-500 hover:bg-lime-400 text-slate-900 font-black rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2">
                                <CheckCircle2 size={20} />
                                <span>გამოქვეყნება</span>
                            </button>
                        </form>
                    </div>

                    {/* RIGHT: ACTIVE VACANCIES LIST */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#161b22] rounded-[2.5rem] shadow-sm border border-slate-800 overflow-hidden">
                            <div className="p-6 border-b border-slate-800 bg-[#0d1117]/30 flex justify-between items-center">
                                <h3 className="font-black text-white flex items-center"><Share2 size={20} className="mr-2 text-blue-500" /> აქტიური ვაკანსიები</h3>
                                <div className="text-[10px] font-black bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full uppercase">{vacancies.length} პოზიცია</div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-400">
                                    <thead className="bg-[#0d1117] text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                                        <tr>
                                            <th className="px-8 py-5">პოზიცია</th>
                                            <th className="px-8 py-5">დეპარტამენტი</th>
                                            <th className="px-8 py-5">ანაზღაურება</th>
                                            <th className="px-8 py-5">აპლიკანტი</th>
                                            <th className="px-8 py-5 text-right">სტატუსი</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {vacancies.map(vac => (
                                            <tr key={vac.id} className="hover:bg-slate-800/50 transition-colors group">
                                                <td className="px-8 py-5 font-black text-white">{vac.title}</td>
                                                <td className="px-8 py-5 text-xs font-bold text-slate-500">{vac.department}</td>
                                                <td className="px-8 py-5 font-mono text-xs font-black text-slate-300">₾ {vac.salaryRange}</td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center space-x-2">
                                                        <Users size={14} className="text-slate-600" />
                                                        <span className="font-bold">{vac.applicants}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase ${vac.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-700 text-slate-400'}`}>
                                                        {vac.status === 'Active' ? 'აქტიური' : 'დახურული'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
