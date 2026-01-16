
'use client';

import React, { useState, useRef, useEffect } from 'react';
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
    ArrowLeft as ArrowLeftIcon
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
    directorSignature?: string;
    gmSignature?: string;
    bankAccounts?: BankAccount[];
}

interface BankAccount {
    id: string;
    bankName: string;
    swift: string;
    iban: string;
    recipientName: string;
    isDefault: boolean;
}

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
    const [activeSubView, setActiveSubView] = useState<'MAIN' | 'MODELING' | 'COMPANY' | 'DIGITAL' | 'BANK' | 'STRUCTURE' | 'INSTRUCTIONS' | 'BUILDER' | 'INVENTORY'>('MAIN');
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
        const defaults = { showLogin: false, showBookmark: false, showSearch: false, showAlert: false };
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
    const [hasGM, setHasGM] = useState(false);

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
    const [inventoryItems, setInventoryItems] = useState<{ id: number; name: string; description: string; quantity: number }[]>([
        { id: 1, name: 'სარბენი ბილიკი', description: 'Technogym Run Excite 700', quantity: 12 },
        { id: 2, name: 'ჰანტელების ნაკრები', description: '5kg - 50kg, რეზინირებული', quantity: 4 },
        { id: 3, name: 'ელიპტიკური ტრენაჟორი', description: 'Life Fitness Cross-Trainer', quantity: 8 },
    ]);

    const addInventoryItem = () => {
        setInventoryItems([...inventoryItems, { id: Date.now(), name: '', description: '', quantity: 1 }]);
    };

    const updateInventoryItem = (id: number, field: string, value: any) => {
        setInventoryItems(inventoryItems.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const deleteInventoryItem = (id: number) => {
        setInventoryItems(inventoryItems.filter(item => item.id !== id));
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
        setRooms([...rooms, newRoom]);
    };

    const updateRoom = (id: string, field: keyof Room, value: any) => {
        setRooms(rooms.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const deleteRoom = (id: string) => {
        setRooms(rooms.filter(r => r.id !== id));
    };

    // --- Company Profile State ---
    const [editingBankIds, setEditingBankIds] = useState<Set<string>>(new Set());
    const [company, setCompany] = useState<CompanyProfile>({
        name: '', identCode: '', legalAddress: '', actualAddress: '', directorName: '', directorId: '',
        directorPhone: '', directorEmail: '', activityField: '', brandName: '', logo: null, branches: [],
        gmName: '', gmId: '', gmPhone: '', gmEmail: '', gmFullAccess: false, companyEmail: '',
        companyPhone: '', facebookLink: '', instagramLink: '', tiktokLink: '', youtubeLink: '',
        linkedinLink: '', bankName: '', bankIban: '', bankSwift: '', recipientName: '',
        directorSignature: '', gmSignature: '', bankAccounts: []
    });

    const [tenantId, setTenantId] = useState<string | null>(null);

    // --- Security State ---
    const [security, setSecurity] = useState({ old: '', new: '', repeat: '' });
    const [passwordUpdated, setPasswordUpdated] = useState(false);

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

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/auth/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
                            const mappedData = {
                                ...data,
                                companyEmail: data.contactEmail || data.companyEmail || '',
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

    const [newBranch, setNewBranch] = useState('');
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

    const addBranch = () => {
        if (newBranch.trim()) {
            setCompany({ ...company, branches: [...company.branches, newBranch.trim()] });
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
                                        <td colSpan={4} className="py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
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
                    { id: 'reservation', label: 'ადგილის დაჯავშნა', price: 30 },
                ]
            },
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
                                    <p className="text-[10px] text-center opacity-40 uppercase tracking-widest mt-2">ყოველთვიური გადასახადი</p>
                                </div>

                                <button
                                    onClick={() => completeStep(6)}
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
                isDefault: banks.length === 0 // Make default if it's the first one
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

        const toggleDefaultBank = (id: string, e: React.MouseEvent) => {
            e.stopPropagation();
            setCompany(prev => {
                const banks = prev.bankAccounts || [];
                const target = banks.find(b => b.id === id);
                const isCurrentlyDefault = target?.isDefault;

                if (isCurrentlyDefault) {
                    // Toggle Off
                    return {
                        ...prev,
                        bankAccounts: banks.map(b => b.id === id ? { ...b, isDefault: false } : b)
                    };
                } else {
                    // Toggle On (and others off)
                    return {
                        ...prev,
                        bankAccounts: banks.map(b => ({ ...b, isDefault: b.id === id }))
                    };
                }
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
                                        <button onClick={(e) => toggleDefaultBank(bank.id, e)} className="cursor-pointer group flex items-center space-x-2 select-none outline-none">
                                            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${bank.isDefault ? 'bg-blue-500' : 'bg-slate-200 group-hover:bg-slate-300'}`}>
                                                <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-sm transform ${bank.isDefault ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </div>
                                            <span className={`text-xs font-bold uppercase transition-colors ${bank.isDefault ? 'text-blue-500' : 'text-slate-400'}`}>
                                                {bank.isDefault ? 'აქტიური (ინვოისებისთვის)' : 'არააქტიური'}
                                            </span>
                                        </button>
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
                            <p className="text-xs text-slate-400 font-bold uppercase">{company.activityField || "საქმიანობის სფერო"}</p>
                        </div>

                        <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="font-black text-lg mb-6 flex items-center">
                                    <GitBranch size={18} className="mr-2 text-indigo-400" />
                                    ფილიალები
                                </h4>
                                <div className="space-y-3 mb-6">
                                    {company.branches.map((br, i) => (
                                        <div key={i} className="flex items-center justify-between bg-white/5 px-4 py-3 rounded-2xl border border-white/10">
                                            <span className="text-sm font-bold">{br}</span>
                                            <button onClick={() => setCompany({ ...company, branches: company.branches.filter((_, idx) => idx !== i) })} className="text-slate-400 hover:text-red-400 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {company.branches.length === 0 && <p className="text-xs text-slate-500 text-center py-2">ფილიალები არ არის დამატებული</p>}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        value={newBranch}
                                        onChange={e => setNewBranch(e.target.value)}
                                        placeholder="ახალი ფილიალი..."
                                        className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-indigo-400 placeholder:text-slate-600"
                                    />
                                    <button onClick={addBranch} className="p-2 bg-indigo-500 rounded-xl hover:bg-indigo-400 transition-colors">
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
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
                                {hasGM && (
                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4 relative overflow-hidden">
                                        <h5 className="font-black text-slate-800 flex items-center relative z-10"><ShieldCheck size={16} className="mr-2 text-emerald-500" /> გენერალური მენეჯერი <span className="text-red-500 ml-1">*</span></h5>
                                        <div className="space-y-3 relative z-10">
                                            <input value={company.gmName} onChange={e => setCompany({ ...company, gmName: e.target.value })} placeholder="სახელი გვარი" className="w-full bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none" />
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={generateGMCredentials}
                                                    className="flex-1 bg-slate-800 text-white py-2.5 rounded-xl text-[10px] font-black hover:bg-slate-700 transition-all flex items-center justify-center"
                                                >
                                                    <Key size={14} className="mr-1.5" /> მონაცემების გენერაცია
                                                </button>
                                            </div>
                                        </div>
                                        {generatedCredentials && (
                                            <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 animate-fadeIn relative z-10">
                                                <p className="text-[10px] font-bold text-emerald-800">User: <span className="font-mono">{generatedCredentials.user}</span></p>
                                                <p className="text-[10px] font-bold text-emerald-800">Pass: <span className="font-mono">{generatedCredentials.pass}</span></p>
                                                <button onClick={() => navigator.clipboard.writeText(`User: ${generatedCredentials.user}\nPass: ${generatedCredentials.pass}`)} className="absolute top-2 right-2 text-emerald-400 hover:text-emerald-600">
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

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
                        </div>
                    </div>

                    <SignatureModal
                        isOpen={isSigModalOpen}
                        onClose={() => setIsSigModalOpen(false)}
                        onSave={handleSaveSignature}
                        title={sigType === 'DIRECTOR' ? 'დირექტორის ხელმოწერა' : 'გენერალური მენეჯერის ხელმოწერა'}
                    />
                </div>
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

                {/* 2. Gym Modeling (Step 1) */}
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

                {/* 3. Sports Inventory Card (Step 2) */}
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

                {/* 4. Digital Settings Card (Step 3) */}
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

                {/* 5. Bank Details Card */}
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

                {/* 6. Structure (Step 5) */}
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

                {/* 7. System Builder (Step 6) */}
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

                {/* 8. Instructions */}
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
