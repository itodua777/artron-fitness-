
import React, { useState, useRef } from 'react';
import { 
  Globe, 
  Check, 
  Settings, 
  Shield, 
  Moon,
  Ruler,
  Maximize,
  Layout,
  Coffee,
  ShowerHead,
  UsersRound,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  ChevronRight,
  Warehouse,
  Construction,
  X,
  DoorOpen,
  Binary,
  Upload,
  FileImage,
  Image as ImageIcon,
  Building2,
  Fingerprint,
  MapPin,
  UserCheck,
  Phone,
  Mail,
  Briefcase,
  Key,
  ShieldCheck,
  Globe2,
  PlusCircle,
  Facebook,
  Instagram,
  Youtube,
  Video,
  Share2,
  Linkedin,
  Copy,
  Landmark,
  CreditCard,
  Info,
  Network,
  GitBranch,
  Users,
  ChevronDown,
  FileText,
  Lock,
  Eye,
  Edit3,
  ShieldAlert
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ModulePermission {
  view: boolean;
  manage: boolean; // Create/Edit/Delete
}

interface Permissions {
  fullAccess: boolean;
  dashboard: ModulePermission;
  users: ModulePermission;
  activities: ModulePermission;
  corporate: ModulePermission;
  employees: ModulePermission;
  market: ModulePermission;
  accounting: ModulePermission;
  statistics: ModulePermission;
  settings: ModulePermission;
}

interface Position {
  id: string;
  title: string;
  authorities: string;
  jobDescription: string;
  permissions: Permissions;
}

interface Room {
  id: string;
  name: string;
  area: number;
  type: 'group' | 'other';
}

interface Department {
  id: string;
  name: string;
  manager: string;
  staffCount: number;
  positions: Position[];
}

interface CompanyProfile {
  name: string;
  identCode: string;
  legalAddress: string;
  actualAddress: string;
  directorName: string;
  directorId: string;
  directorPhone: string;
  directorEmail: string;
  activityField: string;
  brandName: string;
  logo: string | null;
  branches: string[];
  gmName: string;
  gmId: string;
  gmPhone: string;
  gmEmail: string;
  gmFullAccess: boolean;
  companyEmail: string;
  companyPhone: string;
  facebookLink: string;
  instagramLink: string;
  tiktokLink: string;
  youtubeLink: string;
  linkedinLink: string;
  bankName: string;
  bankIban: string;
  bankSwift: string;
  recipientName: string;
}

const defaultPermissions: Permissions = {
  fullAccess: false,
  dashboard: { view: true, manage: false },
  users: { view: false, manage: false },
  activities: { view: false, manage: false },
  corporate: { view: false, manage: false },
  employees: { view: false, manage: false },
  market: { view: false, manage: false },
  accounting: { view: false, manage: false },
  statistics: { view: false, manage: false },
  settings: { view: false, manage: false },
};

interface GeneralViewProps {
  title: string;
}

const GeneralView: React.FC<GeneralViewProps> = ({ title }) => {
  const { language, setLanguage, t } = useLanguage();
  const [activeSubView, setActiveSubView] = useState<'MAIN' | 'MODELING' | 'COMPANY' | 'DIGITAL' | 'BANK' | 'STRUCTURE'>('MAIN');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // --- Organizational Structure State ---
  const [departments, setDepartments] = useState<Department[]>([
    { 
      id: '1', 
      name: 'ადმინისტრაცია', 
      manager: 'გიორგი ბერიძე', 
      staffCount: 5, 
      positions: [
        { 
            id: 'p1', 
            title: 'დირექტორი', 
            authorities: 'სრული ფინანსური და იურიდიული წარმომადგენლობა', 
            jobDescription: 'კომპანიის სტრატეგიული მართვა და განვითარება',
            permissions: { ...defaultPermissions, fullAccess: true }
        },
        { 
            id: 'p2', 
            title: 'HR მენეჯერი', 
            authorities: 'კადრების აყვანა, განთავისუფლება, სახელფასო უწყისები', 
            jobDescription: 'თანამშრომელთა შერჩევა და შიდა კორპორატიული კულტურის მართვა',
            permissions: { ...defaultPermissions, employees: { view: true, manage: true }, users: { view: true, manage: false } }
        }
      ] 
    },
    { 
      id: '2', 
      name: 'ფიტნეს დეპარტამენტი', 
      manager: 'ლევან დოლიძე', 
      staffCount: 25, 
      positions: [
        { 
            id: 'p3', 
            title: 'მთავარი მწვრთნელი (Head Coach)', 
            authorities: 'მწვრთნელთა გუნდის მართვა, ვარჯიშის მეთოდოლოგიის შემუშავება', 
            jobDescription: 'მთლიანი ფიტნეს მიმართულების ხარისხის კონტროლი და სტრატეგიული დაგეგმვა',
            permissions: { ...defaultPermissions, activities: { view: true, manage: true }, statistics: { view: true, manage: false } }
        }
      ] 
    },
    { 
      id: '3', 
      name: 'ოპერაციების დეპარტამენტი', 
      manager: 'ნინო კვარაცხელია', 
      staffCount: 12, 
      positions: [
        { 
            id: 'p4', 
            title: 'ბარისტა', 
            authorities: 'ბარის მარაგების მართვა, მომხმარებელთა სწრაფი მომსახურება', 
            jobDescription: 'სასმელების და საკვები პროდუქტების რეალიზაცია, სალარო ოპერაციები',
            permissions: { ...defaultPermissions, market: { view: true, manage: true } }
        }
      ] 
    },
    { 
      id: '4', 
      name: 'ფინანსური დეპარტამენტი', 
      manager: 'ანა კალაძე', 
      staffCount: 3, 
      positions: [
        { 
            id: 'p5', 
            title: 'ბუღალტერი', 
            authorities: 'ფინანსური დოკუმენტაციის წარმოება, საგადასახადო ანგარიშგება', 
            jobDescription: 'კომპანიის ფინანსური ნაკადების აღრიცხვა და ანალიზი',
            permissions: { ...defaultPermissions, accounting: { view: true, manage: true }, statistics: { view: true, manage: true } }
        }
      ] 
    }
  ]);

  const [editingPosition, setEditingPosition] = useState<{ depId: string, posId: string } | null>(null);

  const addDepartment = () => {
    const newDep: Department = {
      id: Date.now().toString(),
      name: 'ახალი დეპარტამენტი',
      manager: '',
      staffCount: 0,
      positions: []
    };
    setDepartments([...departments, newDep]);
  };

  const updateDepartment = (id: string, field: keyof Department, value: any) => {
    setDepartments(departments.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const deleteDepartment = (id: string) => {
    setDepartments(departments.filter(d => d.id !== id));
  };

  const addPosition = (depId: string) => {
    const newPos: Position = {
      id: Date.now().toString(),
      title: 'ახალი პოზიცია',
      authorities: '',
      jobDescription: '',
      permissions: { ...defaultPermissions }
    };
    setDepartments(departments.map(d => d.id === depId ? { ...d, positions: [...d.positions, newPos] } : d));
  };

  const updatePositionDetails = (depId: string, posId: string, field: keyof Position, value: any) => {
    setDepartments(departments.map(d => {
      if (d.id === depId) {
        return {
          ...d,
          positions: d.positions.map(p => p.id === posId ? { ...p, [field]: value } : p)
        };
      }
      return d;
    }));
  };

  const updatePermission = (depId: string, posId: string, module: keyof Permissions, type: 'view' | 'manage' | 'fullAccess', value: boolean) => {
    setDepartments(departments.map(d => {
      if (d.id === depId) {
        return {
          ...d,
          positions: d.positions.map(p => {
            if (p.id === posId) {
               if (type === 'fullAccess') {
                   return { ...p, permissions: { ...p.permissions, fullAccess: value } };
               }
               const moduleData = p.permissions[module] as ModulePermission;
               return {
                 ...p,
                 permissions: {
                   ...p.permissions,
                   [module]: { ...moduleData, [type]: value }
                 }
               };
            }
            return p;
          })
        };
      }
      return d;
    }));
  };

  const deletePosition = (depId: string, posId: string) => {
    setDepartments(departments.map(d => d.id === depId ? { ...d, positions: d.positions.filter(p => p.id !== posId) } : d));
  };

  // --- Gym Modeling State ---
  const [totalArea, setTotalArea] = useState<number>(500);
  const [ceilingHeight, setCeilingHeight] = useState<number>(3.5);
  const [maleLockerRooms, setMaleLockerRooms] = useState<number>(1);
  const [maleLockersCount, setMaleLockersCount] = useState<number>(25);
  const [femaleLockerRooms, setFemaleLockerRooms] = useState<number>(1);
  const [femaleLockersCount, setFemaleLockersCount] = useState<number>(25);
  const [bathrooms, setBathrooms] = useState<number>(4);
  const [hasBar, setHasBar] = useState<boolean>(true);
  const [blueprint, setBlueprint] = useState<{ name: string; size: string; preview: string | null } | null>(null);
  const [rooms, setRooms] = useState<Room[]>([
    { id: '1', name: 'იოგას დარბაზი', area: 60, type: 'group' },
    { id: '2', name: 'სპინინგის ოთახი', area: 45, type: 'group' },
    { id: '3', name: 'მისაღები ზონა', area: 30, type: 'other' }
  ]);

  // --- Gym Modeling Handlers ---
  const handleBlueprintUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBlueprint({
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          preview: file.type.startsWith('image/') ? reader.result as string : null
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const addRoom = (type: 'group' | 'other') => {
    const newRoom: Room = {
      id: Date.now().toString(),
      name: type === 'group' ? 'ახალი ჯგუფური დარბაზი' : 'ახალი ოთახი',
      area: 20,
      type
    };
    setRooms([...rooms, newRoom]);
  };

  const updateRoom = (id: string, field: keyof Room, value: any) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const deleteRoom = (id: string) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  // --- Company Profile State ---
  const [company, setCompany] = useState<CompanyProfile>({
    name: '', identCode: '', legalAddress: '', actualAddress: '', directorName: '', directorId: '',
    directorPhone: '', directorEmail: '', activityField: '', brandName: '', logo: null, branches: [],
    gmName: '', gmId: '', gmPhone: '', gmEmail: '', gmFullAccess: false, companyEmail: '',
    companyPhone: '', facebookLink: '', instagramLink: '', tiktokLink: '', youtubeLink: '',
    linkedinLink: '', bankName: '', bankIban: '', bankSwift: '', recipientName: ''
  });

  const [newBranch, setNewBranch] = useState('');
  const [generatedCredentials, setGeneratedCredentials] = useState<{user: string, pass: string} | null>(null);

  const handleShare = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert('მონაცემი კოპირებულია!');
  };

  const languages = [
    { code: 'ka', label: 'ქართული', native: 'Georgian' },
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ru', label: 'Русский', native: 'Russian' },
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setCompany({...company, logo: reader.result as string});
      reader.readAsDataURL(file);
    }
  };

  const addBranch = () => {
    if (newBranch.trim()) {
      setCompany({...company, branches: [...company.branches, newBranch.trim()]});
      setNewBranch('');
    }
  };

  const generateGMCredentials = () => {
    if (!company.gmName) {
        alert("გთხოვთ მიუთითოთ გენერალური მენეჯერის სახელი და გვარი.");
        return;
    }
    const username = company.gmName.toLowerCase().replace(/\s/g, '_') + Math.floor(Math.random() * 100);
    const password = Math.random().toString(36).slice(-8).toUpperCase();
    setGeneratedCredentials({ user: username, pass: password });
  };

  const utilizedArea = rooms.reduce((acc, r) => acc + r.area, 0);
  const utilizationPercent = Math.min(Math.round((utilizedArea / totalArea) * 100), 100);

  // --- RENDER ORGANIZATIONAL STRUCTURE VIEW ---
  if (activeSubView === 'STRUCTURE') {
    const selectedPosData = editingPosition 
      ? departments.find(d => d.id === editingPosition.depId)?.positions.find(p => p.id === editingPosition.posId)
      : null;

    const moduleKeys: (keyof Permissions)[] = ['dashboard', 'users', 'activities', 'corporate', 'employees', 'market', 'accounting', 'statistics', 'settings'];

    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-24 relative">
        <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm gap-4">
           <button onClick={() => setActiveSubView('MAIN')} className="flex items-center text-slate-500 hover:text-slate-800 font-bold transition-all group">
             <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
             პარამეტრებში დაბრუნება
           </button>
           <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
                <Network size={24} />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">ორგანიზაციული სტრუქტურა</h2>
           </div>
           <button 
             onClick={() => { alert('სტრუქტურა შენახულია!'); setActiveSubView('MAIN'); }}
             className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center"
           >
              <Save size={18} className="mr-2" />
              შენახვა
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-slate-800 flex items-center">
                            <GitBranch size={20} className="mr-2 text-indigo-500" />
                            დეპარტამენტების იერარქია
                        </h3>
                        <button 
                            onClick={addDepartment}
                            className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black hover:bg-indigo-600 hover:text-white transition-all"
                        >
                            <Plus size={16} />
                            <span>დეპარტამენტის დამატება</span>
                        </button>
                    </div>

                    <div className="space-y-6">
                        {departments.map((dep, idx) => (
                            <div key={dep.id} className="relative pl-8 group">
                                {idx < departments.length - 1 && (
                                    <div className="absolute left-3.5 top-8 bottom-0 w-0.5 bg-slate-100 group-hover:bg-indigo-100 transition-colors"></div>
                                )}
                                <div className="absolute left-0 top-3.5 w-7 h-0.5 bg-slate-100 group-hover:bg-indigo-200"></div>

                                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xs">
                                                    {idx + 1}
                                                </div>
                                                <input 
                                                    value={dep.name} 
                                                    onChange={e => updateDepartment(dep.id, 'name', e.target.value)}
                                                    className="bg-transparent font-black text-slate-800 text-lg outline-none focus:text-indigo-600 w-full"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ხელმძღვანელი</label>
                                                    <input 
                                                        value={dep.manager} 
                                                        onChange={e => updateDepartment(dep.id, 'manager', e.target.value)}
                                                        placeholder="სახელი გვარი"
                                                        className="w-full px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-indigo-400"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">შტატი (მაქს)</label>
                                                    <div className="flex items-center space-x-3">
                                                        <input 
                                                            type="number"
                                                            value={dep.staffCount} 
                                                            onChange={e => updateDepartment(dep.id, 'staffCount', parseInt(e.target.value))}
                                                            className="w-full px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-indigo-400"
                                                        />
                                                        <button onClick={() => deleteDepartment(dep.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 flex justify-between">
                                                  <span>აქტიური პოზიციები</span>
                                                  <span className="text-[9px] lowercase opacity-50">დააჭირეთ პოზიციას უფლებების სამართავად</span>
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {dep.positions.map((pos) => (
                                                        <button 
                                                            key={pos.id} 
                                                            onClick={() => setEditingPosition({ depId: dep.id, posId: pos.id })}
                                                            className={`px-3 py-1.5 rounded-lg text-[11px] font-black flex items-center transition-all shadow-sm border ${
                                                                pos.permissions.fullAccess 
                                                                ? 'bg-slate-900 border-slate-900 text-lime-400' 
                                                                : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
                                                            }`}
                                                        >
                                                            {pos.permissions.fullAccess && <Shield size={12} className="mr-1.5" />}
                                                            {pos.title}
                                                            <ChevronRight size={12} className="ml-1.5 opacity-40" />
                                                        </button>
                                                    ))}
                                                    <button 
                                                      onClick={() => addPosition(dep.id)}
                                                      className="px-3 py-1.5 border-2 border-dashed border-slate-200 rounded-lg text-[10px] font-black text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all"
                                                    >
                                                        + პოზიცია
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">შტატების რეზიუმე</p>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <h4 className="text-3xl font-black">{departments.length}</h4>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase">დეპარტამენტი</p>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-full"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <h4 className="text-3xl font-black">
                                        {departments.reduce((acc, curr) => acc + curr.staffCount, 0)}
                                    </h4>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase">მაქს. თანამშრომელი</p>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-lime-400 w-3/4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Network size={160} className="absolute -right-12 -bottom-12 text-white/5 transform -rotate-12" />
                </div>

                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-4">
                    <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider flex items-center">
                        <ShieldAlert size={16} className="mr-2 text-red-500" />
                        წვდომის მართვა
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        პოზიციაზე მინიჭებული უფლებამოსილება ავტომატურად გავრცელდება ყველა იმ თანამშრომელზე, რომელიც აღნიშნულ პოზიციას იკავებს.
                    </p>
                    <div className="pt-2">
                        <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase bg-slate-50 p-2 rounded-lg">
                           <Eye size={12} className="text-blue-500" /> <span>ხილვადობა</span>
                           <div className="w-px h-3 bg-slate-200 mx-1"></div>
                           <Edit3 size={12} className="text-lime-600" /> <span>რედაქტირება / შექმნა</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Position Detail & Permissions Modal */}
        {editingPosition && selectedPosData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[90vh]">
                  <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center shrink-0">
                      <div className="flex items-center space-x-4">
                          <div className="p-3 bg-indigo-600 text-white rounded-2xl">
                              <Shield size={24} />
                          </div>
                          <div>
                              <h3 className="text-xl font-black text-slate-900 tracking-tight">პოზიცია და უფლებები</h3>
                              <p className="text-xs text-slate-500 font-bold uppercase">{selectedPosData.title}</p>
                          </div>
                      </div>
                      <button 
                        onClick={() => setEditingPosition(null)}
                        className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                      >
                          <X size={24} />
                      </button>
                  </div>

                  <div className="p-8 space-y-10 overflow-y-auto custom-scrollbar flex-1">
                      {/* Top Action: Full Access */}
                      <div className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between ${
                        selectedPosData.permissions.fullAccess ? 'bg-slate-900 border-slate-900 text-white' : 'bg-lime-50 border-lime-200 text-slate-900'
                      }`}>
                         <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-2xl ${selectedPosData.permissions.fullAccess ? 'bg-lime-400 text-slate-900' : 'bg-white text-lime-600 shadow-sm'}`}>
                               <Lock size={24} />
                            </div>
                            <div>
                               <h4 className="font-black text-lg">სრული წვდომა (Full Access)</h4>
                               <p className={`text-xs font-bold uppercase ${selectedPosData.permissions.fullAccess ? 'text-lime-400' : 'text-slate-400'}`}>
                                 დირექტორის და გენ. მენეჯერის უფლებამოსილება
                               </p>
                            </div>
                         </div>
                         <button 
                           onClick={() => updatePermission(editingPosition.depId, editingPosition.posId, 'fullAccess' as any, 'fullAccess', !selectedPosData.permissions.fullAccess)}
                           className={`w-14 h-8 rounded-full relative transition-all duration-300 ${selectedPosData.permissions.fullAccess ? 'bg-lime-400' : 'bg-slate-200'}`}
                         >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all transform ${selectedPosData.permissions.fullAccess ? 'translate-x-7' : 'translate-x-1'}`}></div>
                         </button>
                      </div>

                      {!selectedPosData.permissions.fullAccess ? (
                          <div className="space-y-6 animate-fadeIn">
                             <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
                                <GitBranch size={16} className="mr-2" /> მოდულების მართვა
                             </h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {moduleKeys.map((mod) => {
                                    const modPerms = selectedPosData.permissions[mod] as ModulePermission;
                                    const labels: any = {
                                        dashboard: 'მთავარი პანელი',
                                        users: 'მომხმარებლების მართვა',
                                        activities: 'აქტივობები / საშვები',
                                        corporate: 'კორპორატიული',
                                        employees: 'თანამშრომლები (HR)',
                                        market: 'ქარვასლა (ბარი/POS)',
                                        accounting: 'ბუღალტერია',
                                        statistics: 'სტატისტიკა',
                                        settings: 'პარამეტრები'
                                    };
                                    return (
                                        <div key={mod} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-black text-slate-700">{labels[mod]}</span>
                                                <button 
                                                    onClick={() => updatePermission(editingPosition.depId, editingPosition.posId, mod, 'view', !modPerms.view)}
                                                    className={`w-10 h-5 rounded-full relative transition-all ${modPerms.view ? 'bg-indigo-500' : 'bg-slate-200'}`}
                                                >
                                                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all transform ${modPerms.view ? 'translate-x-5.5' : 'translate-x-0.5'}`}></div>
                                                </button>
                                            </div>
                                            {modPerms.view && (
                                                <div className="flex items-center space-x-2 pt-2 border-t border-slate-200/50 animate-fadeIn">
                                                    <label className="flex items-center cursor-pointer group">
                                                        <div 
                                                            onClick={() => updatePermission(editingPosition.depId, editingPosition.posId, mod, 'manage', !modPerms.manage)}
                                                            className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${modPerms.manage ? 'bg-lime-500 border-lime-500' : 'bg-white border-slate-300'}`}
                                                        >
                                                            {modPerms.manage && <Check size={12} className="text-white" />}
                                                        </div>
                                                        <span className="ml-2 text-[10px] font-black text-slate-500 uppercase tracking-tighter">რედაქტირება / შექმნა</span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                             </div>
                          </div>
                      ) : (
                          <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                             <ShieldCheck size={64} className="text-lime-500" />
                             <div>
                                <h4 className="text-lg font-black text-slate-800">ყველა უფლება ჩართულია</h4>
                                <p className="text-xs text-slate-400 font-bold uppercase mt-1">ამ პოზიციას აქვს წვდომა მთლიან სისტემაზე შეზღუდვების გარეშე</p>
                             </div>
                          </div>
                      )}

                      <div className="space-y-6 pt-6 border-t border-slate-100">
                          <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">აღწერილობა</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase ml-1">სამუშაო აღწერა</label>
                                <textarea 
                                    value={selectedPosData.jobDescription}
                                    onChange={e => updatePositionDetails(editingPosition.depId, editingPosition.posId, 'jobDescription', e.target.value)}
                                    placeholder="აკრიფეთ თანამშრომლის ფუნქცია-მოვალეობების ჩამონათვალი..."
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-indigo-400 focus:bg-white transition-all h-32 resize-none"
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase ml-1">იურიდიული უფლებამოსილება</label>
                                <textarea 
                                    value={selectedPosData.authorities}
                                    onChange={e => updatePositionDetails(editingPosition.depId, editingPosition.posId, 'authorities', e.target.value)}
                                    placeholder="მიუთითეთ რა სპეციალური უფლებები აქვს აღნიშნულ პოზიციას..."
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-indigo-400 focus:bg-white transition-all h-32 resize-none"
                                />
                             </div>
                          </div>
                      </div>
                  </div>

                  <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
                      <button 
                        onClick={() => { deletePosition(editingPosition.depId, editingPosition.posId); setEditingPosition(null); }}
                        className="flex items-center text-red-400 hover:text-red-600 font-bold text-sm transition-colors"
                      >
                          <Trash2 size={18} className="mr-2" /> პოზიციის წაშლა
                      </button>
                      <button 
                        onClick={() => setEditingPosition(null)}
                        className="px-12 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center shadow-xl shadow-slate-900/10"
                      >
                          <Save size={18} className="mr-2" /> მონაცემების შენახვა
                      </button>
                  </div>
              </div>
          </div>
        )}
      </div>
    );
  }

  // --- RENDER BANK DETAILS VIEW ---
  if (activeSubView === 'BANK') {
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
             onClick={() => { alert('საბანკო რეკვიზიტები შენახულია!'); setActiveSubView('MAIN'); }}
             className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center"
           >
              <Save size={18} className="mr-2" />
              შენახვა
           </button>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
           <div className="max-w-2xl mx-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">ბანკის დასახელება</label>
                    <div className="relative group">
                        <Landmark size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            value={company.bankName} 
                            onChange={e => setCompany({...company, bankName: e.target.value})} 
                            placeholder="მაგ: თიბისი ბანკი" 
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-400 focus:bg-white transition-all" 
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">სვიფტ კოდი (SWIFT)</label>
                    <div className="relative group">
                        <Fingerprint size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            value={company.bankSwift} 
                            onChange={e => setCompany({...company, bankSwift: e.target.value})} 
                            placeholder="TBCBGE22" 
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-400 focus:bg-white transition-all uppercase" 
                        />
                    </div>
                </div>
              </div>

              <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">ანგარიშის ნომერი (IBAN)</label>
                  <div className="relative group flex items-center">
                      <CreditCard size={20} className="absolute left-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                          value={company.bankIban} 
                          onChange={e => setCompany({...company, bankIban: e.target.value})} 
                          placeholder="GE00TB0000000000000000" 
                          className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-mono font-bold text-lg outline-none focus:border-blue-400 focus:bg-white transition-all" 
                      />
                      <button onClick={() => handleShare(company.bankIban)} className="absolute right-3 p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                        <Copy size={18} />
                      </button>
                  </div>
              </div>

              <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">მიმღების დასახელება</label>
                  <div className="relative group flex items-center">
                      <UserCheck size={20} className="absolute left-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                          value={company.recipientName} 
                          onChange={e => setCompany({...company, recipientName: e.target.value})} 
                          placeholder="შპს კომპანიის სახელი" 
                          className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-400 focus:bg-white transition-all" 
                      />
                      <button onClick={() => handleShare(company.recipientName)} className="absolute right-3 p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                        <Copy size={18} />
                      </button>
                  </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-start space-x-4">
                 <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm"><Info size={24}/></div>
                 <p className="text-sm text-blue-800 font-medium leading-relaxed">
                    აღნიშნული რეკვიზიტები გამოყენებული იქნება ინვოისების გენერირებისთვის და კორპორატიული კლიენტებისთვის გადასაგზავნად.
                 </p>
              </div>
           </div>
        </div>
      </div>
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
             onClick={() => { alert('ციფრული პარამეტრები შენახულია!'); setActiveSubView('MAIN'); }}
             className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center"
           >
              <Save size={18} className="mr-2" />
              შენახვა
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
                          onChange={e => setCompany({...company, companyEmail: e.target.value})} 
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
                          onChange={e => setCompany({...company, companyPhone: e.target.value})} 
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
                          onChange={e => setCompany({...company, facebookLink: e.target.value})} 
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
                          onChange={e => setCompany({...company, instagramLink: e.target.value})} 
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
                          onChange={e => setCompany({...company, linkedinLink: e.target.value})} 
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
                          onChange={e => setCompany({...company, tiktokLink: e.target.value})} 
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
                          onChange={e => setCompany({...company, youtubeLink: e.target.value})} 
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
               <div className="p-3 bg-white rounded-2xl text-indigo-500 shadow-sm"><Globe size={24}/></div>
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
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn pb-24">
        <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm gap-4">
           <button onClick={() => setActiveSubView('MAIN')} className="flex items-center text-slate-500 hover:text-slate-800 font-bold transition-all group">
             <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
             პარამეტრებში დაბრუნება
           </button>
           <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-500 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                <Building2 size={24} />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">კომპანიის პროფილი</h2>
           </div>
           <button 
             onClick={() => { alert('კომპანიის ინფორმაცია შენახულია!'); setActiveSubView('MAIN'); }}
             className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center"
           >
              <Save size={18} className="mr-2" />
              ინფორმაციის შენახვა
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                    <div 
                        onClick={() => logoInputRef.current?.click()}
                        className="w-40 h-40 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group relative overflow-hidden"
                    >
                        <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                        {company.logo ? (
                            <img src={company.logo} alt="Logo" className="w-full h-full object-contain p-4" />
                        ) : (
                            <div className="flex flex-col items-center">
                                <Upload className="text-slate-300 group-hover:text-blue-500 transition-colors" size={32} />
                                <span className="text-[10px] font-black text-slate-400 mt-2 uppercase">ლოგოს ატვირთვა</span>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 space-y-2 w-full">
                        <h3 className="font-black text-slate-800">ბრენდული დასახელება</h3>
                        <input 
                            value={company.brandName}
                            onChange={e => setCompany({...company, brandName: e.target.value})}
                            placeholder="მაგ: ARTRON Fitness"
                            className="w-full text-center px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 font-bold"
                        />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <Briefcase size={14} className="mr-2" /> კომპანიის დასახელება
                        </label>
                        <input 
                            value={company.name}
                            onChange={e => setCompany({...company, name: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <Fingerprint size={14} className="mr-2" /> საიდენტიფიკაციო კოდი
                        </label>
                        <input 
                            value={company.identCode}
                            onChange={e => setCompany({...company, identCode: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 font-mono font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <Globe2 size={14} className="mr-2" /> საქმიანობის სფერო
                        </label>
                        <input 
                            value={company.activityField}
                            onChange={e => setCompany({...company, activityField: e.target.value})}
                            placeholder="მაგ: სპორტულ-გამაჯანსაღებელი"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 font-bold"
                        />
                    </div>
                </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <h3 className="font-black text-slate-800 flex items-center text-sm uppercase tracking-wider mb-2">
                            <UserCheck size={18} className="mr-2 text-blue-500" /> დირექტორი
                        </h3>
                        <div className="space-y-4">
                            <input value={company.directorName} onChange={e => setCompany({...company, directorName: e.target.value})} placeholder="სახელი გვარი" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold" />
                            <input value={company.directorId} onChange={e => setCompany({...company, directorId: e.target.value})} placeholder="პირადი ნომერი" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold" />
                            <div className="flex gap-2">
                                <input value={company.directorPhone} onChange={e => setCompany({...company, directorPhone: e.target.value})} placeholder="ტელეფონი" className="w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold" />
                                <input value={company.directorEmail} onChange={e => setCompany({...company, directorEmail: e.target.value})} placeholder="იმეილი" className="w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <h3 className="font-black text-slate-800 flex items-center text-sm uppercase tracking-wider mb-2">
                            <MapPin size={18} className="mr-2 text-blue-500" /> ლოკაციები
                        </h3>
                        <div className="space-y-4">
                            <input value={company.legalAddress} onChange={e => setCompany({...company, legalAddress: e.target.value})} placeholder="იურიდიული მისამართი" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold" />
                            <input value={company.actualAddress} onChange={e => setCompany({...company, actualAddress: e.target.value})} placeholder="ფაქტიური მისამართი" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold" />
                            
                            <div className="pt-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">ფილიალები</label>
                                <div className="flex gap-2 mb-3">
                                    <input value={newBranch} onChange={e => setNewBranch(e.target.value)} placeholder="დაამატეთ ფილიალი" className="flex-1 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs" />
                                    <button onClick={addBranch} className="p-2 bg-blue-500 text-white rounded-lg"><Plus size={16}/></button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {company.branches.map((b, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black flex items-center">
                                            {b}
                                            <button onClick={() => setCompany({...company, branches: company.branches.filter((_, idx) => idx !== i)})} className="ml-2 text-slate-400 hover:text-red-500"><X size={12}/></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><ShieldCheck size={20}/></div>
                            <div>
                                <h3 className="font-black text-slate-800">გენერალური მენეჯერი</h3>
                                <p className="text-xs text-slate-400 font-medium">მართვის უფლებამოსილება და წვდომა</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                             <span className="text-xs font-black text-slate-600">პანელის სრული წვდომა</span>
                             <button 
                                onClick={() => setCompany({...company, gmFullAccess: !company.gmFullAccess})}
                                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${company.gmFullAccess ? 'bg-purple-600' : 'bg-slate-300'}`}
                             >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all transform ${company.gmFullAccess ? 'translate-x-7' : 'translate-x-1'}`}></div>
                             </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">სახელი გვარი</label>
                                <input value={company.gmName} onChange={e => setCompany({...company, gmName: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">პირადი ნომერი</label>
                                <input value={company.gmId} onChange={e => setCompany({...company, gmId: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">მობილურის ნომერი</label>
                                <input value={company.gmPhone} onChange={e => setCompany({...company, gmPhone: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">პირადი იმეილი</label>
                                <input value={company.gmEmail} onChange={e => setCompany({...company, gmEmail: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold" />
                            </div>
                        </div>
                    </div>

                    {company.gmFullAccess && (
                        <div className="pt-8 border-t border-dashed border-slate-100 animate-fadeIn">
                             <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-slate-900 rounded-[2rem] text-white">
                                 <div className="flex items-center space-x-4">
                                     <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-lime-400"><Key size={24}/></div>
                                     <div>
                                         <h4 className="font-black text-sm">მენეჯერის ავტორიზაცია</h4>
                                         <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">პანელზე წვდომის მონაცემები</p>
                                     </div>
                                 </div>
                                 
                                 {generatedCredentials ? (
                                     <div className="flex items-center space-x-6">
                                         <div className="text-center">
                                             <p className="text-[9px] text-slate-400 uppercase font-black">მომხმარებელი</p>
                                             <p className="font-mono text-lime-400 font-black">{generatedCredentials.user}</p>
                                         </div>
                                         <div className="text-center">
                                             <p className="text-[9px] text-slate-400 uppercase font-black">ერთჯერადი პაროლი</p>
                                             <p className="font-mono text-white font-black">{generatedCredentials.pass}</p>
                                         </div>
                                         <button onClick={() => setGeneratedCredentials(null)} className="p-2 hover:bg-white/10 rounded-lg text-slate-500"><X size={16}/></button>
                                     </div>
                                 ) : (
                                     <button 
                                        onClick={generateGMCredentials}
                                        className="px-6 py-2.5 bg-lime-400 text-slate-900 font-black rounded-xl hover:bg-lime-300 transition-all text-xs uppercase"
                                     >
                                         გენერირება
                                     </button>
                                 )}
                             </div>
                             <p className="text-[10px] text-slate-400 mt-4 text-center">ერთჯერადი პაროლის გაცემის შემდეგ მენეჯერი ვალდებული იქნება შეცვალოს იგი პირველივე შესვლისას.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- RENDER MODELING VIEW ---
  if (activeSubView === 'MODELING') {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn pb-20">
        <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm gap-4">
           <button 
            onClick={() => setActiveSubView('MAIN')}
            className="flex items-center text-slate-500 hover:text-slate-800 transition-colors group"
           >
             <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
             <span className="font-bold">უკან</span>
           </button>
           <div className="flex items-center space-x-3">
              <div className="p-2 bg-lime-400 rounded-xl text-slate-900 shadow-lg shadow-lime-400/20">
                <Construction size={24} />
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">დარბაზის ციფრული მოდელირება</h2>
           </div>
           <button 
             onClick={() => { alert('მოდელი წარმატებით შეინახა!'); setActiveSubView('MAIN'); }}
             className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center shadow-lg"
           >
              <Save size={18} className="mr-2" />
              მოდელის შენახვა
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                       <Warehouse size={16} className="mr-2" /> შენობის პარამეტრები
                    </h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-xs font-black text-slate-500 uppercase flex justify-between">საერთო ფართობი ($m^2$)</label>
                           <div className="relative">
                              <Maximize size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input type="number" value={totalArea} onChange={(e) => setTotalArea(Number(e.target.value))} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-black text-lg transition-all focus:border-lime-500 focus:bg-white" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black text-slate-500 uppercase flex justify-between">ჭერის სიმაღლე (მეტრი)</label>
                           <div className="relative">
                              <Ruler size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input type="number" step="0.1" value={ceilingHeight} onChange={(e) => setCeilingHeight(Number(e.target.value))} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-black text-lg transition-all focus:border-lime-500 focus:bg-white" />
                           </div>
                        </div>
                    </div>
                    <div className="h-px bg-slate-50"></div>
                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center"><DoorOpen size={16} className="mr-2" /> გასახდელების კონფიგურაცია</h3>
                        <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 space-y-4">
                            <div className="flex items-center justify-between"><span className="text-sm font-black text-blue-700">კაცის გასახდელი</span><div className="flex items-center space-x-3 bg-white p-1 rounded-lg border border-blue-200 shadow-sm"><button onClick={() => setMaleLockerRooms(Math.max(0, maleLockerRooms - 1))} className="w-7 h-7 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded">-</button><span className="w-6 text-center font-black text-blue-900">{maleLockerRooms}</span><button onClick={() => setMaleLockerRooms(maleLockerRooms + 1)} className="w-7 h-7 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded">+</button></div></div>
                            <div className="relative"><Binary size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" /><input type="number" value={maleLockersCount} onChange={(e) => setMaleLockersCount(Number(e.target.value))} className="w-full pl-9 pr-4 py-2.5 bg-white border border-blue-200 rounded-xl outline-none focus:border-blue-500 text-sm font-bold text-blue-900" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-blue-300 uppercase">კარადა</span></div>
                        </div>
                        <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100 space-y-4">
                            <div className="flex items-center justify-between"><span className="text-sm font-black text-rose-700">ქალის გასახდელი</span><div className="flex items-center space-x-3 bg-white p-1 rounded-lg border border-blue-200 shadow-sm"><button onClick={() => setFemaleLockerRooms(Math.max(0, femaleLockerRooms - 1))} className="w-7 h-7 flex items-center justify-center text-rose-600 hover:bg-rose-50 rounded">-</button><span className="w-6 text-center font-black text-rose-900">{femaleLockerRooms}</span><button onClick={() => setFemaleLockerRooms(femaleLockerRooms + 1)} className="w-7 h-7 flex items-center justify-center text-rose-600 hover:bg-rose-50 rounded">+</button></div></div>
                            <div className="relative"><Binary size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400" /><input type="number" value={femaleLockersCount} onChange={(e) => setFemaleLockersCount(Number(e.target.value))} className="w-full pl-9 pr-4 py-2.5 bg-white border border-blue-200 rounded-xl outline-none focus:border-blue-500 text-sm font-bold text-blue-900" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-blue-300 uppercase">კარადა</span></div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-slate-50 space-y-4">
                        <div className="flex items-center justify-between"><div className="flex items-center space-x-3"><div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ShowerHead size={18}/></div><span className="text-sm font-bold text-slate-700">სველი წერტილები</span></div><div className="flex items-center space-x-3 bg-slate-100 p-1 rounded-lg"><button onClick={() => setBathrooms(Math.max(0, bathrooms - 1))} className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-600">-</button><span className="w-6 text-center font-black">{bathrooms}</span><button onClick={() => setBathrooms(bathrooms + 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-600">+</button></div></div>
                        <div className="flex items-center justify-between"><div className="flex items-center space-x-3"><div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Coffee size={18}/></div><span className="text-sm font-bold text-slate-700">ბარი / მარკეტი</span></div><button onClick={() => setHasBar(!hasBar)} className={`w-12 h-6 rounded-full relative transition-all duration-300 ${hasBar ? 'bg-lime-400' : 'bg-slate-200'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all transform ${hasBar ? 'translate-x-7' : 'translate-x-1'}`}></div></button></div>
                    </div>
                </div>
                <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10"><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">ფართობის ათვისება</p><div className="flex items-end justify-between mb-4"><h4 className="text-4xl font-black">{utilizationPercent}%</h4><p className="text-slate-400 text-xs font-bold">{utilizedArea} / {totalArea} $m^2$</p></div><div className="h-3 w-full bg-white/10 rounded-full overflow-hidden"><div className={`h-full transition-all duration-1000 ${utilizationPercent > 90 ? 'bg-red-500' : 'bg-lime-400'}`} style={{ width: `${utilizationPercent}%` }}></div></div></div>
                    <Construction size={120} className="absolute -right-8 -bottom-8 text-white/5 transform -rotate-12" />
                </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center space-x-3 mb-6"><div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><FileImage size={20}/></div><h3 className="font-black text-slate-800">შენობის ნახაზი / პროექტი</h3></div>
                    {!blueprint ? (
                        <div onClick={() => fileInputRef.current?.click()} className="border-4 border-dashed border-slate-50 rounded-[2.5rem] p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all group"><input type="file" ref={fileInputRef} onChange={handleBlueprintUpload} className="hidden" accept="image/*,.pdf,.dwg" /><div className="w-20 h-20 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Upload size={32} /></div><h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">ატვირთეთ პროექტის ფაილი</h4><p className="text-slate-400 text-sm font-medium mt-2">JPG, PNG, PDF ან DWG ფორმატი</p></div>
                    ) : (
                        <div className="relative bg-slate-900 rounded-[2.5rem] p-8 text-white overflow-hidden group">
                            {blueprint.preview && (<img src={blueprint.preview} alt="preview" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700" />)}
                            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6"><div className="flex items-center space-x-6"><div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-lime-400"><ImageIcon size={32} /></div><div><h4 className="font-black text-lg truncate max-w-[200px] sm:max-w-md">{blueprint.name}</h4><p className="text-slate-400 text-sm font-bold">{blueprint.size}</p></div></div><div className="flex items-center space-x-3"><button onClick={() => setBlueprint(null)} className="p-3 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={20} /></button><button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 bg-white text-slate-900 font-black rounded-xl hover:bg-lime-400 transition-all">შეცვლა</button></div></div>
                        </div>
                    )}
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8"><div className="flex items-center space-x-3"><div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><UsersRound size={20}/></div><h3 className="font-black text-slate-800">ჯგუფური ვარჯიშის ოთახები</h3></div><button onClick={() => addRoom('group')} className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl text-xs font-black hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all"><Plus size={16} /><span>დამატება</span></button></div>
                    <div className="space-y-4">{rooms.filter(r => r.type === 'group').map(room => (<div key={room.id} className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 group animate-fadeIn"><div className="flex-1 w-full"><input value={room.name} onChange={(e) => updateRoom(room.id, 'name', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-purple-300 outline-none font-bold text-slate-700 px-2 py-1" /></div><div className="flex items-center space-x-4 w-full sm:w-auto"><div className="relative flex-1 sm:w-40"><input type="number" value={room.area} onChange={(e) => updateRoom(room.id, 'area', Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 pr-10 text-sm font-bold outline-none focus:border-purple-500" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">$m^2$</span></div><button onClick={() => deleteRoom(room.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button></div></div>))}</div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- MAIN SETTINGS VIEW ---
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn pb-20">
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-white to-slate-50">
           <div className="flex items-center space-x-8">
              <div className="w-20 h-20 bg-lime-400 rounded-[2rem] flex items-center justify-center text-slate-900 shadow-xl shadow-lime-400/30 transform -rotate-6">
                <Settings size={40} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('title.settings')}</h2>
                <p className="text-slate-500 font-medium text-lg">სისტემის კონფიგურაცია და პარამეტრები</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6 transition-all duration-700 ease-in-out">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  onClick={() => setActiveSubView('COMPANY')} 
                  className="group bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 cursor-pointer hover:border-blue-400 transition-all hover:shadow-xl hover:shadow-blue-400/5 relative overflow-hidden"
                >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center">
                          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mr-6 group-hover:bg-blue-500 group-hover:text-white transition-all">
                              <Building2 size={32} />
                          </div>
                          <div>
                              <h3 className="text-xl font-black text-slate-800">კომპანიის პროფილი</h3>
                              <p className="text-slate-500 font-medium mt-1">რეკვიზიტები, დირექცია.</p>
                          </div>
                      </div>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                      <Building2 size={120} />
                    </div>
                </div>

                <div 
                  onClick={() => setActiveSubView('STRUCTURE')} 
                  className="group bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 cursor-pointer hover:border-indigo-400 transition-all hover:shadow-xl hover:shadow-indigo-400/5 relative overflow-hidden"
                >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center">
                          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mr-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                              <Network size={32} />
                          </div>
                          <div>
                              <h3 className="text-xl font-black text-slate-800">ორგანიზაციული სტრუქტურა</h3>
                              <p className="text-slate-500 font-medium mt-1">დეპარტამენტების და შტატების ფორმირება.</p>
                          </div>
                      </div>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                      <Network size={120} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  onClick={() => setActiveSubView('BANK')} 
                  className="group bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 cursor-pointer hover:border-blue-600 transition-all hover:shadow-xl hover:shadow-blue-600/5 relative overflow-hidden"
                >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center">
                          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mr-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                              <Landmark size={32} />
                          </div>
                          <div>
                              <h3 className="text-xl font-black text-slate-800">საბანკო რეკვიზიტები</h3>
                              <p className="text-slate-500 font-medium mt-1">IBAN, SWIFT და ბანკის მონაცემები.</p>
                          </div>
                      </div>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                      <Landmark size={120} />
                    </div>
                </div>

                <div 
                  onClick={() => setActiveSubView('DIGITAL')} 
                  className="group bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 cursor-pointer hover:border-indigo-400 transition-all hover:shadow-xl hover:shadow-indigo-400/5 relative overflow-hidden"
                >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center">
                          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mr-6 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                              <Share2 size={32} />
                          </div>
                          <div>
                              <h3 className="text-xl font-black text-slate-800">ციფრული პლატფორმები</h3>
                              <p className="text-slate-500 font-medium mt-1">სოციალური ქსელები.</p>
                          </div>
                      </div>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                      <Globe size={120} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  onClick={() => setActiveSubView('MODELING')} 
                  className="group bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 cursor-pointer hover:border-lime-400 transition-all hover:shadow-xl hover:shadow-lime-400/5 relative overflow-hidden"
                >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center">
                          <div className="w-16 h-16 bg-lime-50 text-lime-600 rounded-2xl flex items-center justify-center mr-6 group-hover:bg-lime-400 group-hover:text-slate-900 transition-all">
                              <Construction size={32} />
                          </div>
                          <div>
                              <h3 className="text-xl font-black text-slate-800">დარბაზის მოდელირება</h3>
                              <p className="text-slate-500 font-medium mt-1">ფართობის და ოთახების აღწერა.</p>
                          </div>
                      </div>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                      <Construction size={120} />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100"><h3 className="text-xl font-black text-slate-800 flex items-center"><Globe size={24} className="mr-3 text-lime-500" />ენის არჩევა / Language Selection</h3></div>
                <div className="p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {languages.map((lang) => (
                            <button key={lang.code} onClick={() => setLanguage(lang.code as any)} className={`relative flex items-center justify-between p-6 rounded-2xl border-4 transition-all group ${language === lang.code ? 'border-lime-400 bg-lime-50 shadow-lg shadow-lime-400/10' : 'border-slate-50 hover:border-slate-200 bg-white hover:shadow-md'}`}>
                            <div className="flex flex-col text-left"><span className={`text-lg font-black ${language === lang.code ? 'text-slate-900' : 'text-slate-600'}`}>{lang.label}</span><span className="text-sm text-slate-400 font-bold group-hover:text-slate-500">{lang.native}</span></div>
                            {language === lang.code && (<div className="bg-lime-500 rounded-full p-1.5 text-white shadow-md"><Check size={18} strokeWidth={3} /></div>)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 group hover:border-blue-400 transition-colors cursor-pointer">
                <div className="flex items-center mb-6"><div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mr-4 group-hover:bg-blue-500 group-hover:text-white transition-all"><Shield size={24} /></div><h3 className="font-black text-slate-800 text-lg">უსაფრთხოება</h3></div>
                <p className="text-slate-500 font-medium">ორმაგი აუთენტიფიკაცია და წვდომის ლოგები.</p>
            </div>
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 group hover:border-purple-400 transition-colors cursor-pointer">
                <div className="flex items-center mb-6"><div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 mr-4 group-hover:bg-purple-500 group-hover:text-white transition-all"><Moon size={24} /></div><h3 className="font-black text-slate-800 text-lg">ინტერფეისის თემები</h3></div>
                <p className="text-slate-500 font-medium">Dark Mode და ბრენდირებული ფერების მართვა.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralView;
