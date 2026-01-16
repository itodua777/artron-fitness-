
import React, { useState, useRef, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  User, 
  Briefcase, 
  Phone, 
  Mail, 
  Save, 
  ArrowLeft, 
  Filter, 
  MoreVertical, 
  X,
  FileText,
  Clock,
  Printer,
  Archive,
  Download,
  Users,
  FileStack,
  MapPin,
  ClipboardCheck,
  CalendarDays,
  LogIn,
  LogOut,
  AlertCircle,
  FilePlus,
  Share2,
  Megaphone,
  Globe,
  Facebook,
  Linkedin,
  Rocket,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Employee, EmployeeWorkSummary } from '../types';

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

// Mock Monthly Summary Data
const mockWorkSummaries: EmployeeWorkSummary[] = [
  { employeeId: 1, fullName: 'გიორგი ბერიძე', position: 'ადმინისტრატორი', totalHours: 168, workingDays: 21, lateCount: 0, overtimeHours: 8 },
  { employeeId: 2, fullName: 'ანა კალაძე', position: 'მთავარი ბუღალტერი', totalHours: 160, workingDays: 20, lateCount: 2, overtimeHours: 0 },
  { employeeId: 3, fullName: 'ლევან დოლიძე', position: 'Head Coach', totalHours: 175, workingDays: 22, lateCount: 0, overtimeHours: 15 },
];

const EmployeesView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LIST' | 'CREATE' | 'DETAIL' | 'CREATE_DOC'>('LIST');
  const [activeTab, setActiveTab] = useState<'EMPLOYEES' | 'ORDERS' | 'ATTENDANCE' | 'VACANCIES'>('EMPLOYEES'); 
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    department: 'All',
    status: 'All'
  });

  // Vacancy Form State
  const [vacancyForm, setVacancyForm] = useState({
    title: '',
    department: '',
    position: '',
    workingHours: 'Full-time',
    salaryRange: '',
    deadline: '',
    description: '',
    requirements: '',
    platforms: {
      web: true,
      facebook: false,
      linkedin: false,
      myjobs: false
    }
  });

  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, fullName: 'გიორგი ბერიძე', position: 'ადმინისტრატორი', department: 'ოპერაციებისა და კლიენტთა მომსახურების დეპარტამენტი', phone: '555 11 22 33', email: 'giorgi@gym.ge', salary: '1200', status: 'Active', joinDate: '2023-01-15' },
    { id: 2, fullName: 'ანა კალაძე', position: 'მთავარი ბუღალტერი', department: 'ფინანსებისა და ადმინისტრაციის დეპარტამენტი', phone: '599 44 55 66', email: 'ana@gym.ge', salary: '2500', status: 'Active', joinDate: '2022-11-01' },
    { id: 3, fullName: 'ლევან დოლიძე', position: 'მთავარი მწვრთნელი (Head Coach)', department: 'ფიტნეს დეპარტამენტი', phone: '577 88 99 00', email: 'levan@gym.ge', salary: '1800', status: 'OnLeave', joinDate: '2023-03-10' }
  ]);

  const [orders, setOrders] = useState<any[]>([
    { id: 101, employeeId: 3, type: 'Vacation', startDate: '2023-11-01', endDate: '2023-11-15', orderText: 'კუთვნილი ანაზღაურებადი შვებულება', createdAt: '2023-10-25', status: 'Active' },
    { id: 102, employeeId: 1, type: 'DayOff', startDate: '2023-11-20', endDate: '2023-11-20', orderText: 'ოჯახური პირობების გამო', createdAt: '2023-11-18', status: 'Completed' },
    { id: 103, title: 'ბრძანება #45 - სამუშაო განრიგის ცვლილება', type: 'GeneralDoc', startDate: '2023-11-30', orderText: '2023 წლის 1 დეკემბრიდან იცვლება დარბაზის სამუშაო საათები...', createdAt: '2023-11-29', status: 'Archived' }
  ]);

  const attendanceLogs = [
    { id: 1, employeeName: 'გიორგი ბერიძე', role: 'ადმინისტრატორი', time: '08:55', type: 'ENTRY', isLate: false },
    { id: 2, employeeName: 'ანა კალაძე', role: 'მთავარი ბუღალტერი', time: '09:15', type: 'ENTRY', isLate: true },
    { id: 3, employeeName: 'ლევან აბაშიძე', role: 'Trainer', time: '10:00', type: 'ENTRY', isLate: false },
    { id: 4, employeeName: 'გიორგი ბერიძე', role: 'ადმინისტრატორი', time: '18:05', type: 'EXIT', isLate: false }
  ];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    personalId: '',
    phone: '',
    email: '',
    legalAddress: '',
    actualAddress: '',
    position: '',
    department: '',
    salary: '',
    joinDate: '',
    employmentType: 'Permanent',
    contractEndDate: ''
  });

  const [docForm, setDocForm] = useState({ title: '', date: new Date().toISOString().split('T')[0], content: '' });

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            emp.position.toLowerCase().includes(searchTerm.toLowerCase());
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

  const handleDepartmentChange = (dept: string) => {
    setFormData(prev => ({ ...prev, department: dept, position: '' }));
  };

  const handlePositionChange = (pos: string) => {
    const parentDept = departmentStructure.find(d => d.positions.includes(pos))?.name || '';
    setFormData(prev => ({ ...prev, position: pos, department: parentDept }));
  };

  const handleSaveAndPrepare = (e: React.FormEvent) => {
    e.preventDefault();
    setViewMode('CREATE_DOC');
  };

  const handleGeneralDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setViewMode('LIST');
    setActiveTab('ORDERS');
  };

  const handleManualPrepareDoc = () => {
    setDocForm({
      title: 'ბრძანება #',
      date: new Date().toISOString().split('T')[0],
      content: `ბრძანება #\n\nსაკითხი: \n\nაღწერა: \n\n\n\nდირექტორი: ____________________\nთარიღი: ${new Date().toLocaleDateString('ka-GE')}`
    });
    setViewMode('CREATE_DOC');
  };

  const handlePrintSummary = () => {
    window.print();
  };

  const getOrderLabel = (type: string) => {
    const labels: any = { 'BusinessTrip': 'მივლინება', 'Vacation': 'შვებულება', 'DayOff': 'Day Off', 'SickLeave': 'ბიულეტინი', 'Hiring': 'აყვანა', 'GeneralDoc': 'დოკუმენტი' };
    return labels[type] || type;
  };

  const availablePositions = useMemo(() => {
    if (!formData.department) return departmentStructure.flatMap(d => d.positions);
    return departmentStructure.find(d => d.name === formData.department)?.positions || [];
  }, [formData.department]);

  const vacancyPositions = useMemo(() => {
    if (!vacancyForm.department) return departmentStructure.flatMap(d => d.positions);
    return departmentStructure.find(d => d.name === vacancyForm.department)?.positions || [];
  }, [vacancyForm.department]);

  // --- RENDER VIEWS ---

  if (viewMode === 'CREATE') {
    return (
      <div className="max-w-5xl mx-auto animate-fadeIn pb-20">
        <button onClick={() => setViewMode('LIST')} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-6 group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">ბაზაში დაბრუნება</span>
        </button>
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-lime-400 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shadow-lime-400/20">
                  <Plus size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">ახალი თანამშრომლის რეგისტრაცია</h2>
                  <p className="text-slate-500 text-sm font-medium">შეავსეთ მონაცემები პერსონალური ბრძანების დასაგენერირებლად</p>
                </div>
              </div>
          </div>
          <form onSubmit={handleSaveAndPrepare} className="p-10 space-y-10">
            <section className="space-y-6">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center">
                  <User size={16} className="mr-2 text-lime-500" /> პირადი ინფორმაცია
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2"><label className="text-sm font-bold text-slate-700">სახელი <span className="text-red-500">*</span></label>
                    <input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-lime-500 outline-none" /></div>
                  <div className="space-y-2"><label className="text-sm font-bold text-slate-700">გვარი <span className="text-red-500">*</span></label>
                    <input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-lime-500 outline-none" /></div>
                  <div className="space-y-2"><label className="text-sm font-bold text-slate-700">პირადი ნომერი <span className="text-red-500">*</span></label>
                    <input required value={formData.personalId} onChange={e => setFormData({...formData, personalId: e.target.value})} type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-lime-500 outline-none font-mono" maxLength={11} /></div>
               </div>
            </section>
            <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                 <button type="button" onClick={() => setViewMode('LIST')} className="px-8 py-4 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl">გაუქმება</button>
                 <button type="submit" className="flex items-center space-x-3 px-12 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 group">
                    <ClipboardCheck size={20} /><span>შენახვა / დოკუმენტის მომზადება</span>
                 </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (viewMode === 'CREATE_DOC') {
    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[95vh]">
                <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <div className="flex items-center space-x-4"><div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><FileText size={24}/></div><div><h3 className="text-xl font-black text-slate-900">ბრძანების რედაქტირება</h3><p className="text-xs text-slate-400 font-bold uppercase">ოფიციალური დოკუმენტის გაფორმება</p></div></div>
                  <button onClick={() => setViewMode('LIST')} className="p-3 hover:bg-slate-200 rounded-2xl text-slate-400 transition-colors"><X size={24}/></button>
                </div>
                <div className="p-10 space-y-6 overflow-y-auto custom-scrollbar">
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">შინაარსი</label><textarea value={docForm.content} onChange={e => setDocForm({...docForm, content: e.target.value})} className="w-full px-8 py-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] font-medium text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all h-[400px] resize-none leading-relaxed" /></div>
                </div>
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <button onClick={handleGeneralDocSubmit} className="flex items-center space-x-3 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95"><Archive size={20}/><span>რეესტრში დაარქივება</span></button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">HR დეპარტამენტი</h2>
          <p className="text-slate-500 text-sm font-medium">მართვა და ადმინისტრირება</p>
        </div>
        <div className="flex items-center space-x-4">
            {activeTab === 'EMPLOYEES' && (
                <button onClick={() => setViewMode('CREATE')} className="flex items-center space-x-2 px-6 py-3 bg-lime-400 hover:bg-lime-500 text-slate-900 font-black rounded-2xl shadow-lg transition-all active:scale-95"><Plus size={22} /><span>თანამშრომლის აყვანა</span></button>
            )}
            {activeTab === 'ORDERS' && (
                <button onClick={handleManualPrepareDoc} className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"><FilePlus size={20} /><span>დოკუმენტის მომზადება</span></button>
            )}
        </div>
      </div>

      <div className="flex space-x-6 border-b border-slate-200 overflow-x-auto no-scrollbar">
         {(['EMPLOYEES', 'ORDERS', 'ATTENDANCE', 'VACANCIES'] as const).map((tab) => (
             <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 px-2 font-black text-sm transition-all border-b-4 whitespace-nowrap ${activeTab === tab ? 'border-lime-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
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
            <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="ძებნა..." className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-lime-500 outline-none transition-all font-medium" /></div>
            </div>
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                        <tr><th className="px-8 py-5">თანამშრომელი</th><th className="px-8 py-5">პოზიცია</th><th className="px-8 py-5">ხელფასი</th><th className="px-8 py-5">სტატუსი</th><th className="px-8 py-5 text-right"></th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredEmployees.map(emp => (
                            <tr key={emp.id} className="hover:bg-slate-50 cursor-pointer group transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center font-black text-slate-500 border-4 border-white shadow-sm">{emp.fullName.charAt(0)}</div>
                                        <div><div className="font-black text-slate-800 text-base">{emp.fullName}</div><div className="text-xs text-slate-400 font-bold uppercase">{emp.phone}</div></div>
                                    </div>
                                </td>
                                <td className="px-8 py-5"><div className="font-black text-slate-700">{emp.position}</div><div className="text-xs text-lime-600 font-bold">{emp.department}</div></td>
                                <td className="px-8 py-5 font-black text-slate-800">₾ {emp.salary}</td>
                                <td className="px-8 py-5"><span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase ${emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{emp.status === 'Active' ? 'აქტიური' : 'შვებულებაში'}</span></td>
                                <td className="px-8 py-5 text-right"><MoreVertical size={18} className="text-slate-300 group-hover:text-slate-600 transition-colors ml-auto" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {activeTab === 'ATTENDANCE' && (
          <div className="animate-fadeIn space-y-10">
              {/* MONTHLY SUMMARY SECTION */}
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900">თვის შემაჯამებელი რეესტრი</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase">ნოემბერი, 2023</p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                         <button onClick={handlePrintSummary} className="flex items-center space-x-2 px-5 py-2.5 bg-white border border-slate-200 text-xs font-black rounded-xl hover:bg-slate-50 transition-all text-slate-600">
                             <Printer size={16}/>
                             <span>ამობეჭდვა</span>
                         </button>
                         <button className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 text-white text-xs font-black rounded-xl hover:bg-emerald-700 transition-all">
                             <Download size={16}/>
                             <span>ექსპორტი (XLS)</span>
                         </button>
                      </div>
                  </div>

                  <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-600">
                          <thead className="bg-white text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                              <tr>
                                  <th className="px-8 py-5">თანამშრომელი</th>
                                  <th className="px-8 py-5">სამუშაო დღეები</th>
                                  <th className="px-8 py-5">ჯამური საათები</th>
                                  <th className="px-8 py-5">ზეგანაკვეთური</th>
                                  <th className="px-8 py-5">დაგვიანებები</th>
                                  <th className="px-8 py-5 text-right">სტატუსი</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                              {mockWorkSummaries.map(summary => (
                                  <tr key={summary.employeeId} className="hover:bg-slate-50/50 transition-colors">
                                      <td className="px-8 py-5">
                                          <div>
                                              <div className="font-black text-slate-800">{summary.fullName}</div>
                                              <div className="text-[10px] text-slate-400 font-bold uppercase">{summary.position}</div>
                                          </div>
                                      </td>
                                      <td className="px-8 py-5 font-bold">{summary.workingDays} დღე</td>
                                      <td className="px-8 py-5 font-black text-slate-900">{summary.totalHours} სთ</td>
                                      <td className="px-8 py-5">
                                          {summary.overtimeHours > 0 ? (
                                              <span className="text-emerald-600 font-black">+{summary.overtimeHours} სთ</span>
                                          ) : <span className="text-slate-300">0</span>}
                                      </td>
                                      <td className="px-8 py-5">
                                          {summary.lateCount > 0 ? (
                                              <span className="text-red-500 font-black">{summary.lateCount} ჯერ</span>
                                          ) : <span className="text-emerald-500 font-black">0</span>}
                                      </td>
                                      <td className="px-8 py-5 text-right">
                                          <div className="inline-flex items-center px-2 py-1 bg-lime-50 text-lime-700 rounded-lg text-[9px] font-black uppercase">გადამოწმებული</div>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>

              {/* LOGS SECTION */}
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                      <h3 className="font-black text-slate-800 flex items-center"><Clock size={20} className="mr-2 text-blue-500" /> დასწრების ისტორია (LIVE)</h3>
                      <div className="text-[10px] font-black bg-lime-100 text-lime-700 px-3 py-1 rounded-full uppercase">Live Monitor</div>
                  </div>
                  <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                          <tr><th className="px-8 py-5">თანამშრომელი</th><th className="px-8 py-5">ტიპი</th><th className="px-8 py-5">დრო</th><th className="px-8 py-5">სტატუსი</th><th className="px-8 py-5 text-right">მოქმედება</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {filteredAttendance.map(log => (
                              <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                                  <td className="px-8 py-5">
                                      <div className="flex items-center space-x-3">
                                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400">{log.employeeName.charAt(0)}</div>
                                          <div><div className="font-black text-slate-800">{log.employeeName}</div><div className="text-[10px] text-slate-400 font-bold uppercase">{log.role}</div></div>
                                      </div>
                                  </td>
                                  <td className="px-8 py-5 font-black text-xs">
                                      {log.type === 'ENTRY' ? <span className="text-emerald-600">შემოსვლა</span> : <span className="text-orange-500">გასვლა</span>}
                                  </td>
                                  <td className="px-8 py-5 font-mono text-xs font-black text-slate-600">{log.time}</td>
                                  <td className="px-8 py-5">
                                      {log.isLate ? (
                                          <span className="flex items-center text-red-500 font-black text-[10px] uppercase bg-red-50 px-2 py-1 rounded-lg w-fit">დაგვიანება</span>
                                      ) : (
                                          <span className="text-emerald-600 font-black text-[10px] uppercase bg-emerald-50 px-2 py-1 rounded-lg w-fit">დროულად</span>
                                      )}
                                  </td>
                                  <td className="px-8 py-5 text-right"><Share2 size={16} className="text-slate-300 ml-auto"/></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}
    </div>
  );
};

export default EmployeesView;
