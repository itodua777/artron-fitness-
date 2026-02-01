
'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
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

    MessageSquare,
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
    LayoutTemplate,
    BookOpen,
    ArrowRight,
    Activity,
    CheckCircle2, Search, ChevronsUpDown, Dumbbell,
    PlusSquare,
    Edit3,
    ShieldAlert,
    FileSignature,
    Minus,
    Pencil,
    GripVertical,
    ArrowRight as ArrowRightIcon,
    ArrowLeft as ArrowLeftIcon,
    User,
    Link,
    Clock
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import SignatureModal from '../../../components/settings/SignatureModal';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ModulePermission {
    view: boolean;
    create: boolean; // Create
    manage: boolean; // Edit
    del: boolean;    // Delete
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
    warehouse: ModulePermission;
}

interface InventoryItem {
    id: number;
    name: string;
    description: string;
    quantity: number;
    inUse?: number;
}

const PREDEFINED_EQUIPMENT = [
    // Cardio
    "სარბენი ბილიკი (Treadmill) – სტანდარტული ან მექანიკური (Curved)",
    "ელიპტიკური ტრენაჟორი / ორბიტრეკი (Elliptical / Cross Trainer)",
    "სტაციონარული ველოტრენაჟორი (Upright Bike)",
    "ჰორიზონტალური ველოტრენაჟორი (Recumbent Bike) – საზურგიანი სკამით",
    "სპინინგის ბაიკი (Spin Bike / Indoor Cycle)",
    "აერო ბაიკი (Air Bike / Assault Bike) – ვენტილატორიანი დატვირთვით",
    "ნიჩბოსნობის ტრენაჟორი (Rowing Machine)",
    "კიბის იმიტატორი / სტეპერი (Stair Climber / Stepmill)",
    "თხილამურის იმიტატორი (SkiErg)",
    "იაკობის კიბე (Jacob’s Ladder) – უსასრულო კიბეზე ცოცვა",

    // Free Weights
    "ჰანტელები (Dumbbells)",
    "რეზინის ჰანტელები (Rubber Hex)",
    "მრგვალი ჰანტელები (Urethane Round)",
    "რეგულირებადი ჰანტელები (Adjustable)",
    "შტანგები / ღერძები (Barbells)",
    "ოლიმპიური ღერძი/გრიფი (Olympic Barbell - 20კგ)",
    "ქალის ოლიმპიური ღერძი (Women’s Olympic Barbell - 15კგ)",
    "Z-ღერძი / EZ გრიფი (EZ Curl Bar) – ბიცეფსისთვის",
    "ტრაპეციული ღერძი (Trap Bar / Hex Bar)",
    "სიმძიმის დისკოები / \"ბლინები\" (Weight Plates)",
    "რკინის დისკოები (Iron Plates)",
    "ბამპერები / რეზინის დისკოები (Bumper Plates)",
    "გირები (Kettlebells)",

    // Racks & Benches
    "ძალოვანი ჩარჩო (Power Rack / Cage)",
    "ნახევარი ჩარჩო (Half Rack)",
    "ჩაჯდომის სადგამი (Squat Stand)",
    "სმიტის მანქანა (Smith Machine)",
    "სწორი სკამი (Flat Bench)",
    "რეგულირებადი სკამი (Adjustable Bench) – დახრილობის შეცვლით",
    "უარყოფითი დახრილობის სკამი (Decline Bench)",
    "სკოტის სკამი (Preacher Curl Bench) – ბიცეფსისთვის",
    "შტანგის პრესის სკამი (Olympic Bench Press Station)",
    "სისი სკვატი (Sissy Squat Bench)",

    // Pin-Loaded
    "მკერდის პრესი (Chest Press Machine)",
    "პეპელა / უკანა დელტა (Pec Fly / Rear Delt Machine)",
    "მხრების პრესი (Shoulder Press Machine)",
    "ზურგის ვერტიკალური წევა (Lat Pulldown Machine)",
    "ზურგის ჰორიზონტალური წევა (Seated Row Machine)",
    "აზიდვების დამხმარე ტრენაჟორი (Assisted Dip / Chin-Up)",
    "ფეხის გაშლის ტრენაჟორი (Leg Extension) – კვადრიცეფსი",
    "ფეხის მოხრის ტრენაჟორი (Seated / Lying Leg Curl) – ბარძაყის უკანა კუნთი",
    "ფეხის პრესი (Leg Press) – ბლოკური",
    "ფეხის განზიდვა / მოზიდვა (Hip Abductor / Adductor)",
    "პრესი / მუცლის ტრენაჟორი (Abdominal Crunch)",

    // Plate-Loaded
    "ფეხის პრესი 45 გრადუსიანი (Leg Press Linear)",
    "ჰაკ-სკვატი / ჰაკ-ჩაჯდომა (Hack Squat Machine)",
    "V-სკვატი (V-Squat)",
    "T-წევის ტრენაჟორი (T-Bar Row)",
    "მკერდის იზოლატერალური პრესი (Iso-Lateral Chest Press)",
    "მხრების იზოლატერალური პრესი (Iso-Lateral Shoulder Press)",
    "ზურგის იზოლატერალური წევა (Iso-Lateral Row)",
    "წვივების ტრენაჟორი (Calf Raise)",

    // Cable Machines
    "ფუნქციონალური ტრენაჟორი (Functional Trainer) – ორმაგი ჭოჭონაქით",
    "კროსოვერი (Cable Crossover Station)",
    "ცალი ჭოჭონაქი (Single Pulley Station)",
    "მრავალფუნქციური სადგური (Jungle Gym / 4-Stack) – რამდენიმე მხრიდან სავარჯიშო",

    // Functional & CrossFit
    "მედიცინბოლი (Medicine Balls)",
    "დასანარცხებელი ბურთი (Slam Balls)",
    "საბრძოლო თოკები (Battle Ropes)",
    "პლიომეტრიული ყუთები / ტუმბოები (Plyometric Boxes)",
    "საკიდი სისტემები (TRX / Suspension Trainers)",
    "ციგა (Sleds / Prowlers) – სათრევი ან მისაწოლი",
    "\"ფერმერის\" სახელურები (Farmers Walk Handles)",
    "სენდბეგი / ქვიშის ტომარა (Sandbags)",
    "საკრივე ტომარა / \"გრუშა\" (Punching Bag)",

    // Bodyweight
    "ტურნიკი (Pull-Up Bar)",
    "ორძელი (Dip Station)",
    "მუცლის პრესის სკამი / აწევები (Captain’s Chair / Knee Raise)",
    "GHD სკამი (Glute Ham Developer)",
    "ჰიპერექსტენზიის სკამი (Roman Chair / Hyperextension)",
    "პრესის გორგოლაჭი (Ab Roller)",

    // Accessories
    "სავარჯიშო რეზინები / ესპანდერები (Resistance Bands)",
    "ძალოსნობის ქამრები (Lifting Belts)",
    "შტანგის მომჭერები / საკეტები (Barbell Collars)",
    "იოგას / ვარჯიშის ხალიჩები (Yoga Mats)",
    "მასაჟის როლიკები (Foam Rollers)",
    "ფიტბოლი / დიდი ბურთი (Swiss Balls)",
    "მაგნეზიის სადგამი (Chalk Stand)",
    "ჰანტელების თარო (Dumbbell Rack)",
    "დისკოების სადგამი (Weight Plate Tree)",
    "რეზინის იატაკი (Rubber Gym Flooring)"
];

// Sub-component for Smart Inventory Input
const InventoryItemRow = ({ item, updateItem, deleteItem }: { item: InventoryItem, updateItem: (id: number, field: keyof InventoryItem, value: any) => void, deleteItem: (id: number) => void }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLTableDataCellElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNameChange = (val: string) => {
        updateItem(item.id, 'name', val);
        if (val.trim().length > 0) {
            const filtered = PREDEFINED_EQUIPMENT.filter(eq =>
                eq.toLowerCase().includes(val.toLowerCase())
            ).slice(0, 8); // Limit to 8 suggestions
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            // If empty, show full list of items
            setSuggestions(PREDEFINED_EQUIPMENT);
            setShowSuggestions(true);
        }
    };

    const handleSelectSuggestion = (suggestion: string) => {
        updateItem(item.id, 'name', suggestion);
        setShowSuggestions(false);
    };

    return (
        <tr className="group hover:bg-slate-50/50 transition-colors relative">
            <td className="py-4 pl-4 relative" ref={wrapperRef}>
                <div className="relative">
                    <input
                        value={item.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        onFocus={() => {
                            if (item.name.trim().length > 0) {
                                const filtered = PREDEFINED_EQUIPMENT.filter(eq =>
                                    eq.toLowerCase().includes(item.name.toLowerCase())
                                ).slice(0, 8);
                                setSuggestions(filtered);
                                setShowSuggestions(filtered.length > 0);
                            } else {
                                // Show full list on focus if empty
                                setSuggestions(PREDEFINED_EQUIPMENT);
                                setShowSuggestions(true);
                            }
                        }}
                        className="bg-transparent font-bold text-xs text-slate-700 outline-none w-full focus:text-sky-600 placeholder:text-slate-300 relative z-10"
                        placeholder="ნივთის სახელი"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 w-[150%] max-w-[400px] bg-white rounded-xl shadow-xl border border-slate-100 mt-2 z-50 overflow-hidden animate-scaleIn origin-top-left">
                            <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                {suggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSelectSuggestion(s)}
                                        className="w-full text-left px-4 py-3 text-xs font-bold text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-colors border-b border-slate-50 last:border-0 flex items-center"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mr-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <div className="bg-slate-50 px-3 py-1.5 border-t border-slate-100 text-[10px] font-bold text-slate-400 text-center">
                                აირჩიეთ სიიდან ან განაგრძეთ წერა
                            </div>
                        </div>
                    )}
                </div>
            </td>
            <td className="py-4">
                <input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="bg-transparent text-sm font-medium text-slate-500 outline-none w-full focus:text-sky-600 placeholder:text-slate-300"
                    placeholder="მოკლე აღწერა"
                />
            </td>
            <td className="py-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                    <button onClick={() => updateItem(item.id, 'quantity', Math.max(0, item.quantity - 1))} className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm font-black text-slate-700">{item.quantity}</span>
                    <button onClick={() => updateItem(item.id, 'quantity', item.quantity + 1)} className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"><Plus size={14} /></button>
                </div>
            </td>
            <td className="py-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                    <button onClick={() => updateItem(item.id, 'inUse', Math.max(0, (item.inUse || 0) - 1))} className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-emerald-600 transition-colors"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm font-black text-emerald-600">{item.inUse || 0}</span>
                    <button onClick={() => updateItem(item.id, 'inUse', Math.min(item.quantity, (item.inUse || 0) + 1))} className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-emerald-600 transition-colors"><Plus size={14} /></button>
                </div>
            </td>
            <td className="py-4 text-center">
                <span className={`text-sm font-black ${(item.quantity - (item.inUse || 0)) > 0 ? 'text-slate-500' : 'text-slate-200'}`}>
                    {Math.max(0, item.quantity - (item.inUse || 0))}
                </span>
            </td>
            <td className="py-4 text-right pr-4">
                <button onClick={() => deleteItem(item.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 size={18} />
                </button>
            </td>
        </tr>
    );
};

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
    warehouse: ModulePermission;
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
    staffCount: number; // Keeping for legacy/compatibility if needed, or remove if confident
    positions: Position[];
    subDepartments?: Department[]; // For hierarchy
    isExpanded?: boolean; // For UI toggle
}

interface Branch {
    id: string;
    name: string;
    address: string;
    email: string;
    phone: string;
    managerName?: string;
    managerEmail?: string;
    managerPhone?: string;
    credentials?: { user: string; pass: string };

    // Branch Specific Settings
    rooms?: Room[];
    inventoryItems?: { id: number; name: string; description: string; quantity: number }[];
    bankAccounts?: BankAccount[];
    socialLinks?: {
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        tiktok?: string;
        youtube?: string;
        website?: string;
    };
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
    slogan: string;
    logo: string | null;
    branches: Branch[];
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
    directorSignature?: string;
    gmSignature?: string;
    bankAccounts?: BankAccount[];
    hasBranches?: boolean;
}

interface BankAccount {
    id: string;
    bankName: string;
    swift: string;
    iban: string;
    recipientName: string;
    isDefault: boolean;
    purposes?: string[]; // 'INVOICE', 'APP', 'TERMINAL', 'SALARY', 'UTILITIES', 'OTHER'
}

const ACCOUNT_USAGES = [
    { key: 'INVOICE', label: 'ინვოისები' },
    { key: 'APP', label: 'მობილური აპლიკაცია' },
    { key: 'TERMINAL', label: 'ტერმინალი' },
    { key: 'SALARY', label: 'ხელფასები' },
    { key: 'UTILITIES', label: 'კომუნალურები' },
    { key: 'OTHER', label: 'სხვა' }
];

// Helper component for Sortable Item
const SortableDepartmentItem = ({
    dep,
    idx,
    actions,
    depth = 0
}: {
    dep: Department;
    idx: number;
    actions: any;
    depth?: number;
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: dep.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        marginLeft: `${depth * 20}px` // Visual indentation
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group mb-6">
            {/* Connector Lines for Hierarchy */}
            {depth > 0 && (
                <div className="absolute -left-6 top-8 bottom-0 w-0.5 bg-indigo-100"></div>
            )}
            {depth > 0 && (
                <div className="absolute -left-6 top-8 w-6 h-0.5 bg-indigo-100"></div>
            )}

            <div className={`bg-slate-50 p-6 rounded-[2rem] border transition-all ${isDragging ? 'border-indigo-500 shadow-2xl rotate-1 z-50' : 'border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-xl'}`}>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            {/* Drag Handle */}
                            <button {...attributes} {...listeners} className="p-2 text-slate-300 hover:text-indigo-500 cursor-grab active:cursor-grabbing touch-none focus:outline-none">
                                <GripVertical size={20} />
                            </button>

                            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xs shrink-0">
                                {idx + 1}
                            </div>
                            <input
                                value={dep.name}
                                onChange={e => actions.updateDepartment(dep.id, 'name', e.target.value)}
                                className={`bg-transparent font-black text-lg outline-none w-full transition-all ${dep.name === 'ახალი დეპარტამენტი' ? 'text-indigo-500 animate-pulse' : 'text-slate-800 focus:text-indigo-600'}`}
                            />
                            <div className="shrink-0 px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase flex items-center shadow-sm">
                                <UsersRound size={14} className="mr-1.5 text-indigo-500" />
                                {dep.positions.length} პოზიცია
                            </div>

                            {/* Hierarchy Controls */}
                            <div className="flex items-center space-x-1">
                                {depth > 0 && (
                                    <button onClick={() => actions.outdent(dep.id)} title="Outdent" className="p-2 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all">
                                        <ArrowLeftIcon size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={() => actions.indent(dep.id)}
                                    title="Indent"
                                    disabled={idx === 0}
                                    className={`p-2 rounded-xl transition-all ${idx === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-indigo-500 hover:bg-indigo-50'}`}
                                >
                                    <ArrowRightIcon size={18} />
                                </button>
                            </div>

                            <button onClick={() => actions.deleteDepartment(dep.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0">
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ხელმძღვანელი</label>
                            <input
                                value={dep.manager}
                                onChange={e => actions.updateDepartment(dep.id, 'manager', e.target.value)}
                                placeholder="სახელი გვარი"
                                className="w-full px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-indigo-400"
                            />
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
                                        onClick={() => actions.setEditingPosition({ depId: dep.id, posId: pos.id })}
                                        className={`px-3 py-1.5 rounded-lg text-[11px] font-black flex items-center transition-all shadow-sm border ${pos.permissions.fullAccess
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
                                    onClick={() => actions.addPosition(dep.id)}
                                    className="px-3 py-1.5 border-2 border-dashed border-slate-200 rounded-lg text-[10px] font-black text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all"
                                >
                                    + პოზიცია
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recursively render sub-departments */}
            {dep.subDepartments && dep.subDepartments.length > 0 && (
                <SortableContext items={dep.subDepartments.map(d => d.id)} strategy={verticalListSortingStrategy}>
                    <div className="mt-4">
                        {dep.subDepartments.map((subDep, subIdx) => (
                            <SortableDepartmentItem
                                key={subDep.id}
                                dep={subDep}
                                idx={subIdx}
                                actions={actions}
                                depth={depth + 1}
                            />
                        ))}
                    </div>
                </SortableContext>
            )}
        </div>
    );
};

const defaultPermissions: Permissions = {
    fullAccess: false,
    dashboard: { view: true, create: false, manage: false, del: false },
    users: { view: false, create: false, manage: false, del: false },
    activities: { view: false, create: false, manage: false, del: false },
    corporate: { view: false, create: false, manage: false, del: false },
    employees: { view: false, create: false, manage: false, del: false },
    market: { view: false, create: false, manage: false, del: false },
    accounting: { view: false, create: false, manage: false, del: false },
    statistics: { view: false, create: false, manage: false, del: false },
    settings: { view: false, create: false, manage: false, del: false },
    warehouse: { view: false, create: false, manage: false, del: false },
};

export default function SettingsPage() {
    const { language, setLanguage, t } = useLanguage();
    const [activeSubView, setActiveSubView] = useState<'MAIN' | 'MODELING' | 'COMPANY' | 'DIGITAL' | 'BANK' | 'STRUCTURE' | 'INSTRUCTIONS' | 'BUILDER' | 'INVENTORY' | 'BRANCHES'>('MAIN');
    const [onboardingStep, setOnboardingStep] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('artron_setup_flow_step');
            return saved ? parseInt(saved) : 0;
        }
        return 0;
    });
    const [selectedModules, setSelectedModules] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('artron_active_modules');
            if (saved) {
                try {
                    return JSON.parse(saved) || {};
                } catch (e) {
                    return {};
                }
            }
        }
        return {
            registration: false, library: false, corporate: false, market: false,
            warehouse: false, accounting: false, statistics: false, hrm: false
        };
    });
    const [headerConfig, setHeaderConfig] = useState(() => {
        const defaults = { showLogin: false, showBookmark: false, showSearch: false, showAlert: false, showControlPanel: true };
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('artron_header_config');
            if (saved) {
                try {
                    return JSON.parse(saved) || defaults;
                } catch (e) {
                    return defaults;
                }
            }
        }
        return defaults;
    });
    const [paymentInterval, setPaymentInterval] = useState(1);
    const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
    const [hasGM, setHasGM] = useState(false);
    const [hasBranches, setHasBranches] = useState(false);
    const [isGMModalOpen, setIsGMModalOpen] = useState(false);

    const handleGMToggle = (checked: boolean) => {
        if (checked) {
            setIsGMModalOpen(true);
            setHasGM(true);
        } else {
            setHasGM(false);
            setCompany(prev => ({ ...prev, gmName: '', gmId: '', gmPhone: '', gmEmail: '', gmFullAccess: false }));
        }
    };



    useEffect(() => {
        localStorage.setItem('artron_setup_flow_step', onboardingStep.toString());
        localStorage.setItem('artron_active_modules', JSON.stringify(selectedModules));
        localStorage.setItem('artron_header_config', JSON.stringify(headerConfig));
        // Dispatch custom event for Sidebar to pick up
        window.dispatchEvent(new Event('storage'));
    }, [onboardingStep, selectedModules, headerConfig]);

    const isOnboarding = onboardingStep < 6;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    const completeStep = (step: number) => {
        if (onboardingStep === step) {
            setOnboardingStep(step + 1);
        }
        setActiveSubView('MAIN');
    };

    // --- Organizational Structure State ---
    const [departments, setDepartments] = useState<Department[]>([]);

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

    const deleteDepartment = (id: string) => {
        // Recursive delete
        const deleteRecursive = (deps: Department[]): Department[] => {
            return deps.filter(d => d.id !== id).map(d => ({
                ...d,
                subDepartments: d.subDepartments ? deleteRecursive(d.subDepartments) : []
            }));
        };
        setDepartments(deleteRecursive(departments));
    };

    const updateDepartment = (id: string, field: keyof Department, value: any) => {
        const updateRecursive = (deps: Department[]): Department[] => {
            return deps.map(d => {
                if (d.id === id) return { ...d, [field]: value };
                if (d.subDepartments) return { ...d, subDepartments: updateRecursive(d.subDepartments) };
                return d;
            });
        };
        setDepartments(updateRecursive(departments));
    };

    // --- DnD & Hierarchy Logic ---

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Find a department and its parent
    const findDepartment = (id: string, deps: Department[], parent: Department | null = null): { node: Department, parent: Department | null } | null => {
        for (const dep of deps) {
            if (dep.id === id) return { node: dep, parent };
            if (dep.subDepartments) {
                const found = findDepartment(id, dep.subDepartments, dep);
                if (found) return found;
            }
        }
        return null;
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeInfo = findDepartment(active.id as string, departments);
        const overInfo = findDepartment(over.id as string, departments);

        if (activeInfo && overInfo && activeInfo.parent === overInfo.parent) {
            // Same level reorder
            const parentSubDeps = activeInfo.parent ? activeInfo.parent.subDepartments! : departments;
            const oldIndex = parentSubDeps.findIndex(d => d.id === active.id);
            const newIndex = parentSubDeps.findIndex(d => d.id === over.id);

            const newSubDeps = arrayMove(parentSubDeps, oldIndex, newIndex);

            if (activeInfo.parent) {
                const updateParent = (deps: Department[]): Department[] => {
                    return deps.map(d => {
                        if (d.id === activeInfo.parent!.id) return { ...d, subDepartments: newSubDeps };
                        if (d.subDepartments) return { ...d, subDepartments: updateParent(d.subDepartments) };
                        return d;
                    });
                };
                setDepartments(updateParent(departments));
            } else {
                setDepartments(newSubDeps);
            }
        }
    };

    const handleIndent = (id: string) => {
        const info = findDepartment(id, departments);
        if (!info) return;
        const { node, parent } = info;
        const siblings = parent ? parent.subDepartments! : departments;
        const index = siblings.findIndex(d => d.id === id);

        if (index > 0) {
            const prevSibling = siblings[index - 1];
            // Remove from current list
            const newSiblings = siblings.filter(d => d.id !== id);
            // Add to prevSibling's subDepartments
            const updatedPrev = {
                ...prevSibling,
                subDepartments: [...(prevSibling.subDepartments || []), node]
            };

            // Reconstruct tree
            if (parent) {
                const updateTree = (deps: Department[]): Department[] => {
                    return deps.map(d => {
                        if (d.id === parent.id) return { ...d, subDepartments: newSiblings.map(s => s.id === prevSibling.id ? updatedPrev : s) };
                        if (d.subDepartments) return { ...d, subDepartments: updateTree(d.subDepartments) };
                        return d;
                    });
                }
                setDepartments(updateTree(departments));
            } else {
                setDepartments(newSiblings.map(s => s.id === prevSibling.id ? updatedPrev : s));
            }
        }
    };

    const handleOutdent = (id: string) => {
        const info = findDepartment(id, departments);
        if (!info || !info.parent) return; // Can't outdent from root
        const { node, parent } = info;

        // Find parent's parent (grandparent)
        const parentInfo = findDepartment(parent.id, departments);
        const grandparent = parentInfo ? parentInfo.parent : null;
        const parentSiblings = grandparent ? grandparent.subDepartments! : departments;

        // Remove node from parent
        const newParentSubs = parent.subDepartments!.filter(d => d.id !== id);
        const updatedParent = { ...parent, subDepartments: newParentSubs };

        // Add node after parent in parentSiblings
        const parentIndex = parentSiblings.findIndex(d => d.id === parent.id);
        const newSiblings = [
            ...parentSiblings.slice(0, parentIndex + 1),
            node,
            ...parentSiblings.slice(parentIndex + 1)
        ];

        // Reconstruct
        if (grandparent) {
            const updateTree = (deps: Department[]): Department[] => {
                return deps.map(d => {
                    if (d.id === grandparent.id) return { ...d, subDepartments: newSiblings.map(s => s.id === parent.id ? updatedParent : s) };
                    if (d.subDepartments) return { ...d, subDepartments: updateTree(d.subDepartments) };
                    return d;
                });
            }
            setDepartments(updateTree(departments));
        } else {
            // Root update
            setDepartments(newSiblings.map(s => s.id === parent.id ? updatedParent : s));
        }
    };

    const addPosition = (depId: string) => {
        const newPos: Position = {
            id: Date.now().toString(),
            title: 'ახალი პოზიცია',
            authorities: '',
            jobDescription: '',
            permissions: { ...defaultPermissions }
        };
        const updateRecursive = (deps: Department[]): Department[] => {
            return deps.map(d => {
                if (d.id === depId) return { ...d, positions: [...d.positions, newPos] };
                if (d.subDepartments) return { ...d, subDepartments: updateRecursive(d.subDepartments) };
                return d;
            });
        };
        setDepartments(updateRecursive(departments));
    };

    const updatePositionDetails = (depId: string, posId: string, field: keyof Position, value: any) => {
        const updateRecursive = (deps: Department[]): Department[] => {
            return deps.map(d => {
                if (d.id === depId) {
                    return {
                        ...d,
                        positions: d.positions.map(p => p.id === posId ? { ...p, [field]: value } : p)
                    };
                }
                if (d.subDepartments) return { ...d, subDepartments: updateRecursive(d.subDepartments) };
                return d;
            });
        };
        setDepartments(updateRecursive(departments));
    };

    const updatePermission = (depId: string, posId: string, module: keyof Permissions, type: 'view' | 'create' | 'manage' | 'del' | 'fullAccess', value: boolean) => {
        const updateRecursive = (deps: Department[]): Department[] => {
            return deps.map(d => {
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
                if (d.subDepartments) return { ...d, subDepartments: updateRecursive(d.subDepartments) };
                return d;
            });
        };
        setDepartments(updateRecursive(departments));
    };

    const depActions = {
        updateDepartment,
        deleteDepartment,
        addPosition: (id: string) => addPosition(id),
        setEditingPosition,
        indent: handleIndent,
        outdent: handleOutdent
    };

    const deletePosition = (depId: string, posId: string) => {
        setDepartments(departments.map(d => d.id === depId ? { ...d, positions: d.positions.filter(p => p.id !== posId) } : d));
    };

    // --- Gym Modeling State ---
    const [totalArea, setTotalArea] = useState<number>(0);
    const [ceilingHeight, setCeilingHeight] = useState<number>(0);
    const [maleLockerRooms, setMaleLockerRooms] = useState<number>(0);
    const [maleLockersCount, setMaleLockersCount] = useState<number>(0);
    const [femaleLockerRooms, setFemaleLockerRooms] = useState<number>(0);
    const [femaleLockersCount, setFemaleLockersCount] = useState<number>(0);
    const [bathrooms, setBathrooms] = useState<number>(0);
    const [hasBar, setHasBar] = useState<boolean>(false);
    const [blueprint, setBlueprint] = useState<{ name: string; size: string; preview: string | null } | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);

    // --- Inventory State ---
    const [inventoryItems, setInventoryItems] = useState<{ id: number; name: string; description: string; quantity: number, inUse: number }[]>([
        { id: 1, name: 'სარბენი ბილიკი', description: 'Technogym Run Excite 700', quantity: 12, inUse: 12 },
        { id: 2, name: 'ჰანტელების ნაკრები', description: '5kg - 50kg, რეზინირებული', quantity: 4, inUse: 4 },
        { id: 3, name: 'ელიპტიკური ტრენაჟორი', description: 'Life Fitness Cross-Trainer', quantity: 8, inUse: 6 },
    ]);

    const addInventoryItem = () => {
        const newItem = { id: Date.now(), name: '', description: '', quantity: 1, inUse: 0 };
        const newItems = [...inventoryItems, newItem];
        setInventoryItems(newItems);

        if (activeContext.type === 'BRANCH') {
            setCompany(prev => ({
                ...prev,
                branches: prev.branches.map(b => b.id === activeContext.id ? { ...b, inventoryItems: newItems } : b)
            }));
        }
    };

    // ... (updateInventoryItem and deleteInventoryItem remain same logic, just pass through)

    const updateInventoryItem = (id: number, field: string, value: any) => {
        const newItems = inventoryItems.map(item => item.id === id ? { ...item, [field]: value } : item);
        setInventoryItems(newItems);

        if (activeContext.type === 'BRANCH') {
            setCompany(prev => ({
                ...prev,
                branches: prev.branches.map(b => b.id === activeContext.id ? { ...b, inventoryItems: newItems } : b)
            }));
        }
    };

    const deleteInventoryItem = (id: number) => {
        const newItems = inventoryItems.filter(item => item.id !== id);
        setInventoryItems(newItems);

        if (activeContext.type === 'BRANCH') {
            setCompany(prev => ({
                ...prev,
                branches: prev.branches.map(b => b.id === activeContext.id ? { ...b, inventoryItems: newItems } : b)
            }));
        }
    };

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
            area: 0,
            type
        };
        const newRooms = [...rooms, newRoom];
        setRooms(newRooms);

        if (activeContext.type === 'BRANCH') {
            setCompany(prev => ({
                ...prev,
                branches: prev.branches.map(b => b.id === activeContext.id ? { ...b, rooms: newRooms } : b)
            }));
        }
    };

    const updateRoom = (id: string, field: keyof Room, value: any) => {
        const newRooms = rooms.map(r => r.id === id ? { ...r, [field]: value } : r);
        setRooms(newRooms);

        if (activeContext.type === 'BRANCH') {
            setCompany(prev => ({
                ...prev,
                branches: prev.branches.map(b => b.id === activeContext.id ? { ...b, rooms: newRooms } : b)
            }));
        }
    };

    const deleteRoom = (id: string) => {
        const newRooms = rooms.filter(r => r.id !== id);
        setRooms(newRooms);

        if (activeContext.type === 'BRANCH') {
            setCompany(prev => ({
                ...prev,
                branches: prev.branches.map(b => b.id === activeContext.id ? { ...b, rooms: newRooms } : b)
            }));
        }
    };

    // --- Company Profile State ---
    const [editingBankIds, setEditingBankIds] = useState<Set<string>>(new Set());
    const [company, setCompany] = useState<CompanyProfile>({
        name: '', identCode: '', legalAddress: '', actualAddress: '', directorName: '', directorId: '',
        directorPhone: '', directorEmail: '', activityField: '', brandName: '', slogan: '', logo: null, branches: [],
        gmName: '', gmId: '', gmPhone: '', gmEmail: '', gmFullAccess: false, companyEmail: '',
        companyPhone: '', facebookLink: '', instagramLink: '', tiktokLink: '', youtubeLink: '',
        linkedinLink: '', bankName: '', bankIban: '', bankSwift: '', recipientName: '',
        directorSignature: '', gmSignature: '', bankAccounts: [], hasBranches: false
    });

    // --- BRANCH CONTEXT ---
    const [activeBranchId, setActiveBranchId] = useState<string | null>(null);

    useEffect(() => {
        const loadBranch = () => {
            const storedBranch = localStorage.getItem('artron_active_branch');
            setActiveBranchId(storedBranch || null);
        };
        loadBranch();
        window.addEventListener('branch-change', loadBranch);
        return () => window.removeEventListener('branch-change', loadBranch);
    }, []);

    // Completion Statistics for Progress Bar
    const completionStats = useMemo(() => {
        let completedSteps = 0;
        let totalSteps = 7;

        // 1. Company Profile (Name, ID, Address, Contact)
        const hasProfile = !!(company.name && company.identCode && company.actualAddress && company.companyPhone);
        if (hasProfile) completedSteps++;

        // 2. Digital Identity (Socials OR Email)
        const hasDigital = !!(company.companyEmail || company.facebookLink || company.instagramLink);
        if (hasDigital) completedSteps++;

        // 3. Banking (At least one active account)
        const hasBank = company.bankAccounts && company.bankAccounts.length > 0;
        if (hasBank) completedSteps++;

        // 4. Modeling (Rooms exist)
        const hasRooms = rooms.length > 0;
        if (hasRooms) completedSteps++;

        // 5. Structure (Departments exist)
        const hasStructure = departments.length > 0;
        if (hasStructure) completedSteps++;

        // 6. Inventory (Items exist)
        const hasInventory = inventoryItems.length > 0;
        if (hasInventory) completedSteps++;

        // 7. System (Modules Selected)
        // Check if any module is selected in selectedModules state
        const hasModules = Object.values(selectedModules).some(Boolean);
        if (hasModules) completedSteps++;

        return {
            percentage: Math.round((completedSteps / totalSteps) * 100),
            completed: completedSteps,
            total: totalSteps,
            missing: []
        };
    }, [company, rooms, departments, inventoryItems, selectedModules]);

    // Helper to get active context data
    // Returns key pointers to saving functions
    const activeContext = useMemo(() => {
        if (activeBranchId && company.branches) {
            const branch = company.branches.find(b => b.id === activeBranchId);
            if (branch) return { type: 'BRANCH' as const, data: branch, id: activeBranchId };
        }
        return { type: 'COMPANY' as const, data: company, id: 'main' };
    }, [activeBranchId, company]);

    // --- EFFECT: Load Branch Specific Data when Switch Happens ---
    useEffect(() => {
        if (activeContext.type === 'BRANCH') {
            const branch = activeContext.data as Branch;
            setRooms(branch.rooms || []);
            setInventoryItems((branch.inventoryItems as any) || []);

            // Sync Profile-like fields for viewing/editing
            if (branch.socialLinks) {
                setCompany(prev => ({
                    ...prev,
                    facebookLink: branch.socialLinks?.facebook || '',
                    instagramLink: branch.socialLinks?.instagram || '',
                    linkedinLink: branch.socialLinks?.linkedin || '',
                    tiktokLink: branch.socialLinks?.tiktok || '',
                    youtubeLink: branch.socialLinks?.youtube || '',
                    bankAccounts: branch.bankAccounts || [],
                }));
            }
        }
    }, [activeContext]);

    // --- EFFECT: Persist Company State to LocalStorage for BranchSwitcher ---
    useEffect(() => {
        if (company) {
            localStorage.setItem('artron_company_profile', JSON.stringify(company));
            // Dispatch event for BranchSwitcher to pick up immediately
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new Event('branch-change'));
        }
    }, [company]);

    const [tenantId, setTenantId] = useState<string | null>(null);

    // --- Security State ---
    const [security, setSecurity] = useState({ old: '', new: '', repeat: '' });
    const [passwordUpdated, setPasswordUpdated] = useState(false);
    const [twoFactorMethod, setTwoFactorMethod] = useState<'NONE' | 'EMAIL' | 'SMS'>('NONE');

    const handleUpdatePassword = async () => {
        if (!security.old || !security.new || !security.repeat) {
            alert('გთხოვთ შეავსოთ ყველა ველი');
            return;
        }
        if (security.new !== security.repeat) {
            alert('ახალი პაროლები არ ემთხვევა ერთმანეთს');
            return;
        }
        if (security.old === security.new) {
            alert('ახალი პაროლი უნდა განსხვავდებოდეს ძველისგან');
            return;
        }

        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) throw new Error('User not found');
            const userObj = JSON.parse(storedUser);
            const userId = userObj.id || userObj._id;

            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId,
                    oldPassword: security.old,
                    newPassword: security.new
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'შეცდომა პაროლის განახლებისას');
            }

            setPasswordUpdated(true);
            alert('პაროლი წარმატებით შეიცვალა!');
            setSecurity({ old: '', new: '', repeat: '' });
        } catch (e: any) {
            console.error('Password update failed:', e);
            alert(e.message || 'ვერ მოხერხდა პაროლის განახლება');
        }
    };

    useEffect(() => {
        const initTenant = async () => {
            try {
                // 1. Get Tenant ID from User Session
                let activeId: string | null = null;
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    try {
                        const userObj = JSON.parse(storedUser);
                        if (userObj.tenantId) {
                            activeId = userObj.tenantId;
                        }
                    } catch (e) {
                        console.error('Failed to parse user from local storage');
                    }
                }

                if (!activeId) {
                    // Fallback to fetch all tenants if no user session (dev mode safety)
                    // FIXED: Use port 5001 to match backend default
                    const tenantsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/tenants`);
                    if (tenantsRes.ok) {
                        const tenants = await tenantsRes.json();
                        if (tenants.length > 0) activeId = tenants[0]._id;
                    }
                }

                if (activeId) {
                    setTenantId(activeId);
                    // 2. Fetch specific profile for this tenant
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/tenants/${activeId}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data) {
                            // Map backend fields to frontend state if names differ
                            // e.g. Backend 'contactEmail' -> Frontend 'companyEmail'

                            // PRESERVE LOCAL BRANCHES:
                            // Since branches might be client-side only for now, we must not wipe them with backend data
                            const localProfile = localStorage.getItem('artron_company_profile');
                            let localBranches: Branch[] = [];
                            if (localProfile) {
                                try {
                                    const parsed = JSON.parse(localProfile);
                                    if (Array.isArray(parsed.branches)) {
                                        localBranches = parsed.branches;
                                    }
                                } catch (e) { }
                            }

                            const mappedData = {
                                ...data,
                                companyEmail: data.contactEmail || data.companyEmail || '',
                                branches: data.branches || localBranches || [],
                                hasBranches: data.hasBranches || localBranches.length > 0
                            };

                            // MIGRATION: If having legacy bank data but no accounts, create default one
                            if ((!mappedData.bankAccounts || mappedData.bankAccounts.length === 0) && mappedData.bankName) {
                                mappedData.bankAccounts = [{
                                    id: Date.now().toString(),
                                    bankName: mappedData.bankName,
                                    swift: mappedData.bankSwift,
                                    iban: mappedData.bankIban,
                                    recipientName: mappedData.recipientName,
                                    isDefault: true
                                }];
                            }

                            setCompany(prev => ({ ...prev, ...mappedData }));
                            // STRICT CHECK: Only show GM if name exists AND is different from Director
                            const gmNameFromBackend = data.generalManager?.name || data.gmName;
                            const dirNameFromBackend = data.directorName;

                            const hasValidGM = gmNameFromBackend && gmNameFromBackend.trim().length > 0;
                            const isDifferentPerson = gmNameFromBackend?.trim() !== dirNameFromBackend?.trim();

                            setHasGM(!!(hasValidGM && isDifferentPerson));
                            setHasBranches(!!mappedData.hasBranches);

                            // Automatically update localStorage to keep branding in sync immediately
                            localStorage.setItem('artron_company_profile', JSON.stringify(mappedData));
                            window.dispatchEvent(new Event('storage'));
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to init tenant:', error);
            }
        };
        initTenant();
    }, []);

    const [generatedCredentials, setGeneratedCredentials] = useState<{ user: string, pass: string } | null>(null);

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
            reader.onload = () => setCompany({ ...company, logo: reader.result as string });
            reader.readAsDataURL(file);
        }
    };

    // --- BRANCH MANAGEMENT ---
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const [branchForm, setBranchForm] = useState<Branch>({
        id: '', name: '', address: '', email: '', phone: '', managerName: '', managerEmail: '', managerPhone: ''
    });

    const openBranchModal = (branch?: Branch) => {
        if (branch) {
            setBranchForm(branch);
            setEditingBranch(branch);
        } else {
            setBranchForm({
                id: Date.now().toString(),
                name: '', address: '', email: '', phone: '', managerName: '', managerEmail: '', managerPhone: ''
            });
            setEditingBranch(null);
        }
        setIsBranchModalOpen(true);
    };

    const handleSaveBranch = () => {
        if (!branchForm.name) {
            alert('ფილიალის სახელი სავალდებულოა');
            return;
        }

        if (editingBranch) {
            // Update
            setCompany({
                ...company,
                branches: company.branches.map(b => b.id === branchForm.id ? branchForm : b)
            });
        } else {
            // Create
            setCompany({
                ...company,
                branches: [...company.branches, branchForm]
            });
        }
        setIsBranchModalOpen(false);
    };

    const handleDeleteBranch = (id: string) => {
        if (confirm('ნამდვილად გსურთ ფილიალის წაშლა?')) {
            setCompany({
                ...company,
                branches: company.branches.filter(b => b.id !== id)
            });
        }
    };

    const generateBranchManagerCredentials = () => {
        if (!branchForm.managerName) {
            alert("ჯერ მიუთითეთ მენეჯერის სახელი");
            return;
        }
        const user = branchForm.managerName.toLowerCase().replace(/\s/g, '.') + Math.floor(Math.random() * 100);
        const pass = Math.random().toString(36).slice(-8).toUpperCase();
        setBranchForm({ ...branchForm, credentials: { user, pass } });
        alert(`მონაცემები გენერირებულია და "გაეგზავნა" ${branchForm.managerEmail || 'ელ.ფოსტაზე'}`);
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

    // --- SIGNATURE LOGIC ---
    const [isSigModalOpen, setIsSigModalOpen] = useState(false);
    const [sigType, setSigType] = useState<'DIRECTOR' | 'GM'>('DIRECTOR');

    const handleOpenSignature = (type: 'DIRECTOR' | 'GM') => {
        if (type === 'GM' && !company.gmName) {
            alert('ჯერ მიუთითეთ გენერალური მენეჯერის სახელი და გვარი');
            return;
        }
        setSigType(type);
        setIsSigModalOpen(true);
    };

    const handleSaveSignature = (signatureData: string) => {
        if (sigType === 'DIRECTOR') {
            setCompany({ ...company, directorSignature: signatureData });
        } else {
            setCompany({ ...company, gmSignature: signatureData });
        }
    };

    const handleDeleteSignature = (type: 'DIRECTOR' | 'GM') => {
        if (confirm('ნამდვილად გსურთ ხელმოწერის წაშლა?')) {
            if (type === 'DIRECTOR') {
                setCompany({ ...company, directorSignature: '' });
            } else {
                setCompany({ ...company, gmSignature: '' });
            }
        }
    };

    const handleSaveCompanyProfile = async () => {
        // Validation: Verify password update
        if (!passwordUpdated) {
            alert('უსაფრთხოების მიზნით, გთხოვთ ჯერ განაახლოთ პაროლი!');
            return;
        }

        if (!tenantId) {
            alert('შეცდომა: კომპანიის ID ვერ მოიძებნა');
            return;
        }

        // Save to Backend
        try {
            // FIXED: Use port 5001
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/tenants/${tenantId}`, {
                method: 'POST', // Using POST as update as per backend controller
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(company)
            });

            // FIXED: Update localStorage and notify other components
            localStorage.setItem('artron_company_profile', JSON.stringify(company));
            window.dispatchEvent(new Event('storage'));

            alert('პროფილი წარმატებით განახლდა!');

        } catch (error) {
            console.error('Error saving company profile:', error);
            alert('შეცდომა პროფილის შენახვისას');
            return;
        }

        // Automatic Order Creation for GM
        if (company.gmName && company.gmSignature) {
            try {
                // Check if order already exists logic could implement here, but for now we just create one
                // In a real app, verify against existing orders to avoid duplicates
                const orderData = {
                    title: `ბრძანება # - გენერალური მენეჯერის დანიშვნის შესახებ`,
                    date: new Date().toLocaleDateString('ka-GE'),
                    type: 'ORDER',
                    content: `ბრძანება გენერალური მენეჯერის, ${company.gmName}-ის დანიშვნის შესახებ 3 თვის გამოსაცდელი ვადით.`,
                    tenantId: tenantId
                };

                // FIXED: Use port 5001
                await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/documents`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
                console.log('GM Appointment Order Created');
            } catch (error) {
                console.error('Error creating GM order:', error);
            }
        }

        localStorage.setItem('artron_company_profile', JSON.stringify(company));
        window.dispatchEvent(new Event('storage')); // Notify Sidebar
        alert('კომპანიის პროფილი და ხელმოწერები შენახულია!');
        completeStep(0);
    };

    const utilizedArea = rooms.reduce((acc, r) => acc + r.area, 0);
    const utilizationPercent = totalArea > 0 ? Math.round((utilizedArea / totalArea) * 100) : 0;



    // --- RENDER INVENTORY VIEW ---
    if (activeSubView === 'INVENTORY') {
        return (
            <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-24 relative">
                <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm gap-4">
                    <button onClick={() => setActiveSubView('MAIN')} className="flex items-center text-slate-500 hover:text-slate-800 font-bold transition-all group">
                        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        პარამეტრებში დაბრუნება
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-sky-600 rounded-2xl text-white shadow-lg shadow-sky-600/20">
                            <Dumbbell size={24} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">სპორტული ინვენტარის სია</h2>
                    </div>
                    <button
                        onClick={() => {
                            alert('ინვენტარი შენახულია!');
                            completeStep(2);
                        }}
                        className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center"
                    >
                        <Save size={18} className="mr-2" />
                        შენახვა & გაგრძელება
                    </button>
                </div>

                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-black text-slate-800 text-sm uppercase flex items-center">
                            <Dumbbell size={18} className="mr-2 text-sky-500" />
                            ინვენტარის ჩამონათვალი
                        </h4>
                        <button onClick={addInventoryItem} className="px-4 py-2 bg-sky-50 text-sky-600 font-bold rounded-xl hover:bg-sky-500 hover:text-white transition-all flex items-center text-xs">
                            <Plus size={14} className="mr-2" />
                            დაამატე ნივთი
                        </button>
                    </div>
                    <div className="">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                                    <th className="pb-4 pl-4">დასახელება</th>
                                    <th className="pb-4">აღწერა</th>
                                    <th className="pb-4 text-center">რაოდენობა</th>
                                    <th className="pb-4 text-center">ექსპლუატაციაში</th>
                                    <th className="pb-4 text-center">საწყობში</th>
                                    <th className="pb-4 text-right pr-4">მოქმედება</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {inventoryItems.map((item) => (
                                    <InventoryItemRow
                                        key={item.id}
                                        item={item}
                                        updateItem={updateInventoryItem}
                                        deleteItem={deleteInventoryItem}
                                    />
                                ))}
                                {inventoryItems.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                                            ინვენტარი ცარიელია
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }


    // --- RENDER BRANCH MANAGEMENT VIEW ---
    if (activeSubView === 'BRANCHES') {
        return (
            <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-24 relative">
                <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm gap-4">
                    <button
                        onClick={() => setActiveSubView('MAIN')}
                        className="flex items-center text-slate-500 hover:text-slate-800 transition-colors group"
                    >
                        <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-sm">უკან დაბრუნება</span>
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
                            <GitBranch size={24} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">ფილიალების მართვა</h2>
                    </div>
                    <div className="w-24"></div> {/* Spacer for balance */}
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 grid grid-cols-1 gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {company.branches.map((br) => (
                            <div key={br.id} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 hover:shadow-lg hover:border-emerald-200 transition-all group relative">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-black text-slate-800">{br.name}</h3>
                                    <div className="flex space-x-2">
                                        <button onClick={() => openBranchModal(br)} className="p-2 bg-white rounded-xl shadow-sm hover:text-emerald-500 hover:shadow-md transition-all">
                                            <Edit3 size={16} />
                                        </button>
                                        <button onClick={() => handleDeleteBranch(br.id)} className="p-2 bg-white rounded-xl shadow-sm hover:text-red-500 hover:shadow-md transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center text-slate-500 text-xs font-bold">
                                        <MapPin size={14} className="mr-2 text-emerald-500" />
                                        {br.address}
                                    </div>
                                    <div className="flex items-center text-slate-500 text-xs font-bold">
                                        <Mail size={14} className="mr-2 text-emerald-500" />
                                        {br.email || '---'}
                                    </div>
                                    <div className="flex items-center text-slate-500 text-xs font-bold">
                                        <Phone size={14} className="mr-2 text-emerald-500" />
                                        {br.phone || '---'}
                                    </div>
                                    {br.managerName && (
                                        <div className="pt-3 border-t border-slate-100 mt-3">
                                            <p className="text-[10px] text-slate-400 font-black uppercase mb-1">მენეჯერი</p>
                                            <div className="flex items-center text-slate-700 font-bold text-sm">
                                                <UserCheck size={16} className="mr-2 text-emerald-500" />
                                                {br.managerName}
                                            </div>
                                            {br.managerPhone && (
                                                <p className="text-[10px] text-slate-400 mt-1 pl-6">{br.managerPhone}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => openBranchModal()}
                            className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 font-black p-8 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-all group min-h-[200px]"
                        >
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                <Plus size={24} />
                            </div>
                            <span className="text-sm">ფილიალის დამატება</span>
                        </button>
                    </div>
                </div>
                {/* BRANCH MODAL */}
                {isBranchModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                        <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-scaleIn">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-xl font-black text-slate-800 flex items-center">
                                    <GitBranch size={24} className="mr-3 text-indigo-500" />
                                    {editingBranch ? 'ფილიალის რედაქტირება' : 'ახალი ფილიალი'}
                                </h3>
                                <button onClick={() => setIsBranchModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase ml-1">ფილიალის დასახელება <span className="text-red-500">*</span></label>
                                        <input
                                            value={branchForm.name}
                                            onChange={e => setBranchForm({ ...branchForm, name: e.target.value })}
                                            placeholder="მაგ: ბათუმის ფილიალი"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-indigo-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase ml-1">ფაქტობრივი მისამართი</label>
                                        <input
                                            value={branchForm.address}
                                            onChange={e => setBranchForm({ ...branchForm, address: e.target.value })}
                                            placeholder="ქუჩა, ნომერი..."
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-indigo-400"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase ml-1">ელ.ფოსტა</label>
                                        <input
                                            value={branchForm.email}
                                            onChange={e => setBranchForm({ ...branchForm, email: e.target.value })}
                                            placeholder="branch@gym.ge"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-indigo-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase ml-1">ტელეფონი</label>
                                        <input
                                            value={branchForm.phone}
                                            onChange={e => setBranchForm({ ...branchForm, phone: e.target.value })}
                                            placeholder="555..."
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-indigo-400"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <h4 className="text-sm font-black text-slate-800 mb-4 flex items-center">
                                        <UserCheck size={16} className="mr-2 text-emerald-500" />
                                        ფილიალის მენეჯერი
                                    </h4>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">სახელი გვარი</label>
                                            <input
                                                value={branchForm.managerName}
                                                onChange={e => setBranchForm({ ...branchForm, managerName: e.target.value })}
                                                placeholder="გიორგი გიორგაძე"
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-emerald-400"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">მენეჯერის ელ.ფოსტა</label>
                                            <input
                                                value={branchForm.managerEmail}
                                                onChange={e => setBranchForm({ ...branchForm, managerEmail: e.target.value })}
                                                placeholder="manager@gym.ge"
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-emerald-400"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-slate-400 uppercase ml-1">მობილური</label>
                                            <input
                                                value={branchForm.managerPhone || ''}
                                                onChange={e => setBranchForm({ ...branchForm, managerPhone: e.target.value })}
                                                placeholder="555..."
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-emerald-400"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 pt-2">
                                            <button className="py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-200 transition-all flex flex-col items-center justify-center gap-1">
                                                <Link size={16} />
                                                <span>ბმულის გაგზავნა</span>
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    await generateBranchManagerCredentials();
                                                    alert(`მონაცემები გენერირებულია და "გაეგზავნა" ${branchForm.managerPhone ? 'ნომერზე: ' + branchForm.managerPhone : branchForm.managerEmail ? 'ელ.ფოსტაზე: ' + branchForm.managerEmail : 'მითითებულ არხზე'}`);
                                                }}
                                                className="py-3 bg-emerald-500/10 text-emerald-600 font-bold rounded-xl text-xs hover:bg-emerald-500/20 transition-all flex flex-col items-center justify-center gap-1"
                                            >
                                                <Key size={16} />
                                                <span>User & OTP გაგზავნა</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={handleSaveBranch}
                                    className="px-8 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    შენახვა
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // --- RENDER ORGANIZATIONAL STRUCTURE VIEW ---
    if (activeSubView === 'STRUCTURE') {
        const selectedPosData = editingPosition
            ? findDepartment(editingPosition.depId, departments)?.node.positions.find(p => p.id === editingPosition.posId)
            : null;

        const moduleKeys: (keyof Permissions)[] = ['dashboard', 'users', 'activities', 'corporate', 'employees', 'market', 'warehouse', 'accounting', 'statistics', 'settings'];

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
                        onClick={() => { alert('სტრუქტურა შენახულია!'); completeStep(5); }}
                        className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center"
                    >
                        <Save size={18} className="mr-2" />
                        შენახვა & გაგრძელება
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

                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={departments.map(d => d.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {departments.map((dep, idx) => (
                                            <SortableDepartmentItem
                                                key={dep.id}
                                                dep={dep}
                                                idx={idx}
                                                actions={depActions}
                                            />
                                        ))}
                                    </SortableContext>
                                </DndContext>
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
                                                {departments.reduce((acc, curr) => acc + curr.positions.length, 0)}
                                            </h4>
                                            <p className="text-slate-400 text-[10px] font-bold uppercase">სულ პოზიცია</p>
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
                                    <PlusSquare size={12} className="text-emerald-500" /> <span>შექმნა</span>
                                    <div className="w-px h-3 bg-slate-200 mx-1"></div>
                                    <Edit3 size={12} className="text-lime-600" /> <span>რედაქტირება</span>
                                    <div className="w-px h-3 bg-slate-200 mx-1"></div>
                                    <Trash2 size={12} className="text-red-500" /> <span>წაშლა</span>
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
                                        <input
                                            value={selectedPosData.title}
                                            onChange={(e) => updatePositionDetails(editingPosition.depId, editingPosition.posId, 'title', e.target.value)}
                                            className="text-xs text-slate-500 font-bold uppercase bg-transparent border-b border-dashed border-slate-300 focus:border-indigo-500 outline-none w-full"
                                        />
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
                                <div className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between ${selectedPosData.permissions.fullAccess ? 'bg-slate-900 border-slate-900 text-white' : 'bg-lime-50 border-lime-200 text-slate-900'
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
                                                    settings: 'პარამეტრები',
                                                    warehouse: 'საწყობი'
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
                                                            <div className="flex items-center space-x-2 pt-2 border-t border-slate-200/50 animate-fadeIn justify-between">
                                                                <label className="flex items-center cursor-pointer group">
                                                                    <div
                                                                        onClick={() => updatePermission(editingPosition.depId, editingPosition.posId, mod, 'create', !modPerms.create)}
                                                                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${modPerms.create ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300'}`}
                                                                    >
                                                                        {modPerms.create && <Check size={12} className="text-white" />}
                                                                    </div>
                                                                    <span className="ml-2 text-[10px] font-black text-slate-500 uppercase tracking-tighter">შექმნა</span>
                                                                </label>

                                                                <label className="flex items-center cursor-pointer group">
                                                                    <div
                                                                        onClick={() => updatePermission(editingPosition.depId, editingPosition.posId, mod, 'manage', !modPerms.manage)}
                                                                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${modPerms.manage ? 'bg-lime-500 border-lime-500' : 'bg-white border-slate-300'}`}
                                                                    >
                                                                        {modPerms.manage && <Check size={12} className="text-white" />}
                                                                    </div>
                                                                    <span className="ml-2 text-[10px] font-black text-slate-500 uppercase tracking-tighter">რედაქტირება</span>
                                                                </label>

                                                                <label className="flex items-center cursor-pointer group">
                                                                    <div
                                                                        onClick={() => updatePermission(editingPosition.depId, editingPosition.posId, mod, 'del', !modPerms.del)}
                                                                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${modPerms.del ? 'bg-red-500 border-red-500' : 'bg-white border-slate-300'}`}
                                                                    >
                                                                        {modPerms.del && <Check size={12} className="text-white" />}
                                                                    </div>
                                                                    <span className="ml-2 text-[10px] font-black text-slate-500 uppercase tracking-tighter">წაშლა</span>
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
                )
                }
            </div >
        );
    }

    // --- RENDER SYSTEM BUILDER VIEW ---
    if (activeSubView === 'BUILDER') {
        const modules = [
            {
                id: 'registration',
                label: 'მომხმარებლების რეგისტრაცია',
                price: 0,
                subModules: [
                    { id: 'registration_new', label: 'ახალი მომხმარებლის რეგისტრაცია', price: 50 },
                ]
            },
            { id: 'reservation', label: 'ადგილის დაჯავშნა', price: 30 },
            { id: 'schedule', label: 'განრიგის მართვა', price: 40 },
            {
                id: 'library',
                label: 'აქტივობების ბიბლიოთეკა',
                price: 0,
                subModules: [
                    { id: 'activity_onetime', label: 'ერთჯერადი ვიზიტები', price: 30 },
                    { id: 'activity_individual', label: 'ინდივიდუალური აქტივობები', price: 40 },
                    { id: 'activity_group', label: 'ჯგუფური აქტივობები', price: 50 },
                    { id: 'activity_calendar', label: 'კალენდარული აქტივობები', price: 40 },
                ]
            },
            { id: 'communication', label: 'კომუნიკაცია მომხმარებელთან', price: 60 },
            { id: 'corporate', label: 'კორპორატიული სერვისი', price: 80 },
            { id: 'pos', label: 'Point of Sale (POS)', price: 50 },
            { id: 'market', label: 'ქარვასლა (მარკეტი/ბარი)', price: 60 },
            { id: 'warehouse', label: 'საწყობის მართვა', price: 40 },
            { id: 'accounting', label: 'ბუღალტერია (ინვოისები/ხარჯები)', price: 70 },
            { id: 'statistics', label: 'სტატისტიკა და რეპორტინგი', price: 30 },
            { id: 'hrm', label: 'HRM - თანამშრომლების მართვა', price: 50 },
        ];

        // Recursive function to calculate total cost
        const calculateTotal = (mods: any[]): number => {
            return mods.reduce((acc, mod) => {
                let cost = 0;
                if (mod.subModules) {
                    cost = calculateTotal(mod.subModules);
                } else if (selectedModules[mod.id]) {
                    cost = mod.price;
                }
                return acc + cost;
            }, 0);
        };

        const totalCost = calculateTotal(modules);

        // Recursive render function for modules
        const renderModules = (mods: any[], level = 0) => {
            return mods.map((mod) => (
                <div key={mod.id} className={`${level > 0 ? 'ml-8 mt-2' : 'mt-4'}`}>
                    <div
                        className={`flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer ${mod.subModules ? 'bg-slate-100/50' : ''}`}
                        onClick={() => {
                            if (!mod.subModules) {
                                setSelectedModules({ ...selectedModules, [mod.id]: !selectedModules[mod.id] });
                            }
                        }}
                    >
                        <div className="flex items-center space-x-3">
                            {!mod.subModules && (
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${selectedModules[mod.id] ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                    {selectedModules[mod.id] && <Check size={14} />}
                                </div>
                            )}
                            {mod.subModules && <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>}
                            <span className={`text-sm font-bold ${selectedModules[mod.id] || mod.subModules ? 'text-slate-800' : 'text-slate-500'}`}>{mod.label}</span>
                        </div>
                        {mod.price > 0 && <span className="text-xs font-black text-slate-400">{mod.price} ₾/თვე</span>}
                    </div>
                    {mod.subModules && renderModules(mod.subModules, level + 1)}
                </div>
            ));
        };


        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-24">
                <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm gap-4">
                    <button onClick={() => setActiveSubView('MAIN')} className="flex items-center text-slate-500 hover:text-slate-800 font-bold transition-all group">
                        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        დაბრუნება
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
                            <LayoutTemplate size={24} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">სისტემის აწყობა</h2>
                    </div>
                    <div className="w-24"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                            <h3 className="font-black text-slate-800 mb-6 flex items-center">
                                <PlusSquare size={20} className="mr-2 text-indigo-500" />
                                აირჩიეთ მოდულები
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    {renderModules(modules)}
                                </div>
                            </div>
                        </div>

                        {/* Header Configuration */}
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                            <h3 className="font-black text-slate-800 mb-6 flex items-center">
                                <Settings size={20} className="mr-2 text-indigo-500" />
                                ინტერფეისის კონფიგურაცია (Header)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer"
                                    onClick={() => setHeaderConfig({ ...headerConfig, showLogin: !headerConfig.showLogin })}>
                                    <span className="text-sm font-bold text-slate-700">შესვლა/გამოსვლა (Login)</span>
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${headerConfig.showLogin ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${headerConfig.showLogin ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer"
                                    onClick={() => setHeaderConfig({ ...headerConfig, showBookmark: !headerConfig.showBookmark })}>
                                    <span className="text-sm font-bold text-slate-700">ბუკმარკები (Bookmark)</span>
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${headerConfig.showBookmark ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${headerConfig.showBookmark ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer"
                                    onClick={() => setHeaderConfig({ ...headerConfig, showSearch: !headerConfig.showSearch })}>
                                    <span className="text-sm font-bold text-slate-700">ძებნა (Search)</span>
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${headerConfig.showSearch ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${headerConfig.showSearch ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer"
                                    onClick={() => setHeaderConfig({ ...headerConfig, showAlert: !headerConfig.showAlert })}>
                                    <span className="text-sm font-bold text-slate-700">შეტყობინებები (Alert)</span>
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${headerConfig.showAlert ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${headerConfig.showAlert ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer"
                                    onClick={() => setHeaderConfig({ ...headerConfig, showControlPanel: !headerConfig.showControlPanel })}>
                                    <span className="text-sm font-bold text-slate-700">სამართავი პანელი (Control Panel)</span>
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${headerConfig.showControlPanel ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${headerConfig.showControlPanel ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-black text-lg mb-6 flex items-center text-indigo-300">
                                    <FileText size={20} className="mr-2" />
                                    ინვოისი
                                </h3>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-sm opacity-60">
                                        <span>არჩეული მოდულები</span>
                                        <span className="font-mono">{Object.values(selectedModules).filter(Boolean).length}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm opacity-60">
                                        <span>საბაზისო პაკეტი</span>
                                        <span className="font-mono">0 ₾</span>
                                    </div>
                                    <div className="w-full h-px bg-white/10"></div>
                                    <div className="flex justify-between items-center text-2xl font-black text-white">
                                        <span>ჯამი:</span>
                                        <span>{totalCost} ₾</span>
                                    </div>
                                    <p className="text-[10px] text-center opacity-40 uppercase tracking-widest mt-2 mb-6">ყოველთვიური გადასახადი</p>

                                    {/* Payment Interval Selector */}
                                    <div className="bg-white/5 rounded-2xl p-1 mb-6 flex">
                                        {[1, 3, 6, 12].map((interval) => {
                                            const discount = interval === 3 ? 10 : interval === 6 ? 15 : interval === 12 ? 20 : 0;
                                            return (
                                                <button
                                                    key={interval}
                                                    onClick={() => setPaymentInterval(interval)}
                                                    className={`flex-1 py-1.5 rounded-xl text-[10px] font-black transition-all ${paymentInterval === interval ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                                >
                                                    {interval} თვე
                                                    {discount > 0 && <span className="block text-[8px] opacity-70">-{discount}%</span>}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Final Calculation */}
                                    {paymentInterval > 1 && (
                                        <div className="space-y-2 mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
                                            <div className="flex justify-between text-xs text-slate-400">
                                                <span>ღირებულება ({paymentInterval} თვე):</span>
                                                <span>{totalCost * paymentInterval} ₾</span>
                                            </div>
                                            <div className="flex justify-between text-xs text-green-400 font-bold">
                                                <span>ფასდაკლება ({paymentInterval === 3 ? '10' : paymentInterval === 6 ? '15' : '20'}%):</span>
                                                <span>-{Math.round(totalCost * paymentInterval * (paymentInterval === 3 ? 0.1 : paymentInterval === 6 ? 0.15 : 0.2))} ₾</span>
                                            </div>
                                            <div className="w-full h-px bg-white/10 my-2"></div>
                                            <div className="flex justify-between text-lg font-black text-white">
                                                <span>სულ გადასახდელი:</span>
                                                <span>{Math.round(totalCost * paymentInterval * (1 - (paymentInterval === 3 ? 0.1 : paymentInterval === 6 ? 0.15 : 0.2)))} ₾</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setIsActivationModalOpen(true)}
                                    className="w-full py-4 bg-lime-400 text-slate-900 font-black rounded-2xl hover:bg-lime-300 transition-colors shadow-lg shadow-lime-400/20 flex items-center justify-center"
                                >
                                    <Check size={18} className="mr-2" />
                                    სისტემის აქტივაცია
                                </button>
                            </div>
                            <LayoutTemplate size={200} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
                        </div>
                    </div>
                </div>

                {/* Activation Confirmation Modal */}
                {isActivationModalOpen && (
