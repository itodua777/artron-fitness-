'use client';
import React, { useState } from 'react';
import {
    Plus, Box, Trash2, Utensils,
    CheckCircle, XCircle, Truck, Watch, Package, Tag, DollarSign
} from 'lucide-react';
import { MarketItem } from '@/app/types';

// Mock Interfaces and Data
interface Supplier {
    id: number;
    name: string;
    contactPerson: string;
    phone: string;
    category: string;
    status: 'Active' | 'Inactive';
}

interface AccessoryItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

const initialGroceries: MarketItem[] = [
    { id: 1, name: 'ენერგეტიკული სასმელი', price: 5.00, stock: 45, category: 'სასმელები', image: 'https://picsum.photos/400/400?random=10' },
    { id: 2, name: 'პროტეინის ბატონი', price: 8.50, stock: 30, category: 'კვება', image: 'https://picsum.photos/400/400?random=11' },
    { id: 3, name: 'წყალი (0.5ლ)', price: 2.00, stock: 120, category: 'სასმელები', image: 'https://picsum.photos/400/400?random=12' },
    { id: 4, name: 'ესპრესო', price: 4.00, stock: 500, category: 'ყავა', image: 'https://picsum.photos/400/400?random=13' },
];

const initialMaterials = [
    { id: 1, name: 'ბარის სკამი', quantity: 12, condition: 'კარგი', note: 'შავი ტყავის' },
    { id: 2, name: 'ყავის აპარატი', quantity: 1, condition: 'ახალი', note: 'La Marzocco' },
    { id: 3, name: 'შუშის ჭიქა (დიდი)', quantity: 45, condition: 'კარგი', note: 'თარო 2' },
];

const initialSuppliers: Supplier[] = [
    { id: 1, name: 'Coca-Cola Georgia', contactPerson: 'გიორგი მენეჯერი', phone: '599 11 22 33', category: 'სასმელები', status: 'Active' },
    { id: 2, name: 'Food Service LTD', contactPerson: 'ანა დისტრიბუტორი', phone: '577 44 55 66', category: 'კვება', status: 'Active' },
    { id: 3, name: 'Coffee World', contactPerson: 'ლევან ყავა', phone: '555 99 88 77', category: 'ყავა', status: 'Inactive' },
];

export default function WarehousePage() {
    // Tabs: PRODUCT (Grocery), ASSETS (Material), ACCESSORIES, SUPPLIERS
    const [activeWarehouseSubTab, setActiveWarehouseSubTab] = useState<'PRODUCT' | 'ASSETS' | 'ACCESSORIES' | 'SUPPLIERS'>('PRODUCT');

    // Data States
    const [groceries, setGroceries] = useState<any[]>([]);
    const [materials, setMaterials] = useState<any[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [accessories, setAccessories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Forms State
    const [newGrocery, setNewGrocery] = useState({ name: '', price: '', stock: '', category: 'სასმელები' });
    const [newMaterial, setNewMaterial] = useState({ name: '', quantity: '', condition: 'კარგი', note: '' });
    const [newSupplier, setNewSupplier] = useState({ name: '', contactPerson: '', phone: '', category: 'სასმელები' });
    const [newAccessory, setNewAccessory] = useState({ name: '', quantity: '', price: '' });

    // --- API HELPER ---
    const fetchItems = async (cat: string) => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const res = await fetch(`${apiUrl}/api/warehouse?category=${cat}`);
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        } catch (e) {
            console.error("Failed to fetch", e);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createItem = async (payload: any) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const res = await fetch(`${apiUrl}/api/warehouse`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            return await res.json();
        } catch (e) {
            console.error("Failed to create", e);
            alert('სერვერის შეცდომა');
            return null;
        }
    };

    const deleteItem = async (id: string) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            await fetch(`${apiUrl}/api/warehouse/${id}`, { method: 'DELETE' });
            return true;
        } catch (e) {
            console.error("Failed to delete", e);
            return false;
        }
    };

    // --- EFFECTS ---
    React.useEffect(() => {
        const load = async () => {
            if (activeWarehouseSubTab === 'PRODUCT') setGroceries(await fetchItems('GROCERY'));

            // LOAD ASSETS FROM SHARED COMPANY PROFILE (Inventory from Settings)
            if (activeWarehouseSubTab === 'ASSETS') {
                try {
                    const profileStr = localStorage.getItem('artron_company_profile');
                    const activeBranchId = localStorage.getItem('artron_active_branch');

                    if (profileStr) {
                        const company = JSON.parse(profileStr);
                        let inventory = [];

                        // 1. Try to get from active branch
                        if (activeBranchId && company.branches) {
                            const branch = company.branches.find((b: any) => b.id === activeBranchId);
                            if (branch && branch.inventoryItems) {
                                inventory = branch.inventoryItems;
                            }
                        }

                        // 2. Fallback to main company inventory (if we decide to store it there too, mostly it's on branches now)
                        // But wait, the Settings logic saves inventory to the active context (Branch or Company).
                        // If no branch selected, it might be on company.inventoryItems (if we added it there).
                        // Looking at SettingsPage, 'inventoryItems' is local state, but saved to 'activeContext'.
                        // If type is COMPANY (no branch), we haven't explicitly seen where it saves to 'company' root field in the snippets.
                        // Let's assume for now we look at the active branch or fallback to empty if usage involves branches.

                        // Filter items that are IN WAREHOUSE (Total > InUse)
                        const warehouseItems = inventory.filter((item: any) => {
                            const inUse = item.inUse || 0;
                            return (item.quantity - inUse) > 0;
                        }).map((item: any) => ({
                            id: item.id,
                            name: item.name,
                            quantity: item.quantity - (item.inUse || 0), // Show only remaining stock
                            condition: 'კარგი', // Default, as Settings doesn't track condition per item yet
                            note: item.description
                        }));

                        setMaterials(warehouseItems);
                    }
                } catch (e) {
                    console.error("Failed to load local inventory", e);
                }
            }

            if (activeWarehouseSubTab === 'ACCESSORIES') setAccessories(await fetchItems('ACCESSORY'));
            if (activeWarehouseSubTab === 'SUPPLIERS') setSuppliers(await fetchItems('SUPPLIER'));
        };
        load();

        // Listen for storage changes to update immediately if settings change in another tab/window or same session
        const handleStorageChange = () => {
            if (activeWarehouseSubTab === 'ASSETS') load();
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [activeWarehouseSubTab]);


    // --- Handlers ---
    const handleAddGrocery = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: newGrocery.name,
            price: parseFloat(newGrocery.price),
            quantity: parseInt(newGrocery.stock),
            category: 'GROCERY', // Main Category
            unit: 'pc', // Default
            // Custom fields stored in loose schema or mapped
            // We can reuse 'category' field for 'Type' (drink, food) if we want, OR use extended schema.
            // For now, let's store sub-category in 'note' or specific field if schema allows.
            // Schema has 'category', let's stick to strict ENUM for Tab Category, and maybe append sub-cat to name or add 'subCategory' field?
            // User schema has 'category' string. Let's use it for 'GROCERY' but we lose the 'Drinks/Food' distinction unless we store it elsewhere.
            // Hack: Store sub-category in 'note' or 'condition' or just mix it?
            // Ideally schema should have 'type' or 'subCategory'.
            // Let's us 'note' for sub-category for now to avoid schema drift from plan.
            note: newGrocery.category
        };

        const saved = await createItem(payload);
        if (saved) {
            setGroceries([saved, ...groceries]);
            setNewGrocery({ name: '', price: '', stock: '', category: 'სასმელები' });
            alert('✅ პროდუქტი დაემატა!');
        }
    };

    const handleAddMaterial = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            category: 'MATERIAL',
            name: newMaterial.name,
            quantity: parseInt(newMaterial.quantity),
            condition: newMaterial.condition,
            note: newMaterial.note
        };
        const saved = await createItem(payload);
        if (saved) {
            setMaterials([saved, ...materials]);
            setNewMaterial({ name: '', quantity: '', condition: 'კარგი', note: '' });
            alert('✅ ინვენტარი დაემატა!');
        }
    };

    const handleAddSupplier = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            category: 'SUPPLIER',
            name: newSupplier.name,
            contactPerson: newSupplier.contactPerson,
            phone: newSupplier.phone,
            status: 'Active'
        };
        const saved = await createItem(payload);
        if (saved) {
            setSuppliers([saved, ...suppliers]);
            setNewSupplier({ name: '', contactPerson: '', phone: '', category: 'სასმელები' });
            alert('✅ მომწოდებელი დაემატა!');
        }
    };

    const handleAddAccessory = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            category: 'ACCESSORY',
            name: newAccessory.name,
            quantity: parseInt(newAccessory.quantity),
            price: parseFloat(newAccessory.price)
        };
        const saved = await createItem(payload);
        if (saved) {
            setAccessories([saved, ...accessories]);
            setNewAccessory({ name: '', quantity: '', price: '' });
            alert('✅ აქსესუარი დაემატა!');
        }
    };

    const handleDeleteGrocery = async (id: string) => {
        if (confirm('ნამდვილად გსურთ წაშლა?')) {
            if (await deleteItem(id)) setGroceries(groceries.filter(g => g._id !== id));
        }
    };
    const handleDeleteMaterial = async (id: string) => {
        if (confirm('ნამდვილად გსურთ წაშლა?')) {
            if (await deleteItem(id)) setMaterials(materials.filter(m => m._id !== id));
        }
    };
    const handleDeleteSupplier = async (id: string) => {
        if (confirm('ნამდვილად გსურთ წაშლა?')) {
            if (await deleteItem(id)) setSuppliers(suppliers.filter(s => s._id !== id));
        }
    };
    const handleDeleteAccessory = async (id: string) => {
        if (confirm('ნამდვილად გსურთ წაშლა?')) {
            if (await deleteItem(id)) setAccessories(accessories.filter(a => a._id !== id));
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex-1 flex flex-col min-h-0 space-y-6 animate-fadeIn">
                {/* Warehouse Sub-Navigation */}
                <div className="flex space-x-4 border-b border-slate-800 shrink-0 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveWarehouseSubTab('PRODUCT')}
                        className={`pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all border-b-4 whitespace-nowrap flex items-center space-x-2 ${activeWarehouseSubTab === 'PRODUCT' ? 'border-orange-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Utensils size={16} />
                        <span>პროდუქციის საწყობი</span>
                    </button>
                    <button
                        onClick={() => setActiveWarehouseSubTab('ASSETS')}
                        className={`pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all border-b-4 whitespace-nowrap flex items-center space-x-2 ${activeWarehouseSubTab === 'ASSETS' ? 'border-blue-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Box size={16} />
                        <span>ძირითადი საშუალებები</span>
                    </button>
                    <button
                        onClick={() => setActiveWarehouseSubTab('ACCESSORIES')}
                        className={`pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all border-b-4 whitespace-nowrap flex items-center space-x-2 ${activeWarehouseSubTab === 'ACCESSORIES' ? 'border-lime-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Watch size={16} />
                        <span>აქსესუარები</span>
                    </button>
                    <button
                        onClick={() => setActiveWarehouseSubTab('SUPPLIERS')}
                        className={`pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all border-b-4 whitespace-nowrap flex items-center space-x-2 ${activeWarehouseSubTab === 'SUPPLIERS' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Truck size={16} />
                        <span>მომწოდებლები</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    {/* 1. PRODUCT WAREHOUSE (Formerly Grocery) */}
                    {activeWarehouseSubTab === 'PRODUCT' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
                            <div className="lg:col-span-4">
                                <div className="bg-[#161b22] rounded-[2.5rem] shadow-sm border border-slate-800 p-8 sticky top-0">
                                    <h3 className="font-black text-white mb-8 flex items-center text-sm uppercase tracking-widest">
                                        <Plus size={20} className="mr-3 text-orange-500" />
                                        პროდუქტის მიღება
                                    </h3>
                                    <form onSubmit={handleAddGrocery} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">დასახელება</label>
                                            <input required value={newGrocery.name} onChange={e => setNewGrocery({ ...newGrocery, name: e.target.value })} className="w-full px-5 py-3.5 bg-[#0d1117] border border-slate-700 text-white rounded-2xl font-bold outline-none focus:border-orange-500 transition-all" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ფასი (₾)</label>
                                                <input type="number" step="0.01" required value={newGrocery.price} onChange={e => setNewGrocery({ ...newGrocery, price: e.target.value })} className="w-full px-5 py-3.5 bg-[#0d1117] border border-slate-700 text-white rounded-2xl font-bold outline-none focus:border-orange-500 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">რაოდენობა</label>
                                                <input type="number" required value={newGrocery.stock} onChange={e => setNewGrocery({ ...newGrocery, stock: e.target.value })} className="w-full px-5 py-3.5 bg-[#0d1117] border border-slate-700 text-white rounded-2xl font-bold outline-none focus:border-orange-500 transition-all" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">კატეგორია</label>
                                            <select value={newGrocery.category} onChange={e => setNewGrocery({ ...newGrocery, category: e.target.value })} className="w-full px-5 py-3.5 bg-[#0d1117] border border-slate-700 text-white rounded-2xl font-bold outline-none ">
                                                <option>სასმელები</option><option>კვება</option><option>ყავა</option><option>ალკოჰოლი</option><option>სხვა</option>
                                            </select>
                                        </div>
                                        <button type="submit" className="w-full py-4 bg-lime-500 text-slate-900 font-black rounded-2xl shadow-xl shadow-lime-500/10 transition-all hover:bg-lime-400 active:scale-95 uppercase text-xs tracking-widest">დამატება</button>
                                    </form>
                                </div>
                            </div>
                            <div className="lg:col-span-8">
                                <div className="bg-[#161b22] rounded-[2.5rem] shadow-sm border border-slate-800 overflow-hidden">
                                    <table className="w-full text-left text-sm text-slate-400">
                                        <thead className="bg-[#0d1117] text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                                            <tr><th className="px-8 py-5">პროდუქტი</th><th className="px-8 py-5">კატეგორია</th><th className="px-8 py-5">ფასი</th><th className="px-8 py-5">ნაშთი</th><th className="px-8 py-5 text-right"></th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {Array.isArray(groceries) && groceries.map(g => (
                                                <tr key={g._id || g.id} className="hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-8 py-5 font-black text-white">{g.name}</td>
                                                    <td className="px-8 py-5"><span className="px-3 py-1 bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-tighter text-slate-300">{g.category}</span></td>
                                                    <td className="px-8 py-5 font-bold">₾ {g.price?.toFixed(2)}</td>
                                                    <td className="px-8 py-5 font-mono font-black text-white">{g.quantity || g.stock}</td>
                                                    <td className="px-8 py-5 text-right"><button onClick={() => handleDeleteGrocery(g._id || g.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. ASSETS WAREHOUSE (Formerly Material) */}
                    {activeWarehouseSubTab === 'ASSETS' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
                            <div className="lg:col-span-4">
                                <div className="bg-[#161b22] rounded-[2.5rem] shadow-sm border border-slate-800 p-8 sticky top-0">
                                    <h3 className="font-black text-white mb-8 flex items-center text-sm uppercase tracking-widest">
                                        <Plus size={20} className="mr-3 text-blue-500" />
                                        ინვენტარის დამატება
                                    </h3>
                                    <form onSubmit={handleAddMaterial} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ნივთის დასახელება</label>
                                            <input required value={newMaterial.name} onChange={e => setNewMaterial({ ...newMaterial, name: e.target.value })} className="w-full px-5 py-3.5 bg-[#0d1117] border border-slate-700 text-white rounded-2xl font-bold outline-none focus:border-blue-500 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">რაოდენობა</label>
                                            <input type="number" required value={newMaterial.quantity} onChange={e => setNewMaterial({ ...newMaterial, quantity: e.target.value })} className="w-full px-5 py-3.5 bg-[#0d1117] border border-slate-700 text-white rounded-2xl font-bold outline-none focus:border-blue-500 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">მდგომარეობა</label>
                                            <select value={newMaterial.condition} onChange={e => setNewMaterial({ ...newMaterial, condition: e.target.value })} className="w-full px-5 py-3.5 bg-[#0d1117] border border-slate-700 text-white rounded-2xl font-bold outline-none">
                                                <option>ახალი</option><option>კარგი</option><option>დაზიანებული</option><option>ჩამოსაწერი</option>
                                            </select>
                                        </div>
                                        <button type="submit" className="w-full py-4 bg-lime-500 text-slate-900 font-black rounded-2xl shadow-xl transition-all hover:bg-lime-400 active:scale-95 uppercase text-xs tracking-widest">დამატება</button>
                                    </form>
                                </div>
                            </div>
                            <div className="lg:col-span-8">
                                <div className="bg-[#161b22] rounded-[2.5rem] shadow-sm border border-slate-800 overflow-hidden">
                                    <table className="w-full text-left text-sm text-slate-400">
                                        <thead className="bg-[#0d1117] text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                                            <tr><th className="px-8 py-5">ნივთი</th><th className="px-8 py-5">რაოდენობა</th><th className="px-8 py-5">მდგომარეობა</th><th className="px-8 py-5">შენიშვნა</th><th className="px-8 py-5 text-right"></th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {Array.isArray(materials) && materials.map(m => (
                                                <tr key={m._id || m.id} className="hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-8 py-5 font-black text-white">{m.name}</td>
                                                    <td className="px-8 py-5 font-mono font-black text-white">{m.quantity}</td>
                                                    <td className="px-8 py-5"><span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase ${m.condition === 'ახალი' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>{m.condition}</span></td>
                                                    <td className="px-8 py-5 text-xs text-slate-500 font-medium">{m.note || '-'}</td>
                                                    <td className="px-8 py-5 text-right"><button onClick={() => handleDeleteMaterial(m._id || m.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. ACCESSORIES (New Tab) */}
                    {activeWarehouseSubTab === 'ACCESSORIES' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
                            <div className="lg:col-span-4">
                                <div className="bg-[#161b22] rounded-[2.5rem] shadow-sm border border-slate-800 p-8 sticky top-0">
                                    <h3 className="font-black text-white mb-8 flex items-center text-sm uppercase tracking-widest">
                                        <Plus size={20} className="mr-3 text-lime-500" />
                                        აქსესუარის დამატება
                                    </h3>
                                    <form onSubmit={handleAddAccessory} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">დასახელება</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={newAccessory.name}
                                                    onChange={e => setNewAccessory({ ...newAccessory, name: e.target.value })}
                                                    placeholder="მაგ: წყლის ბოთლი"
                                                    className="w-full pl-10 pr-5 py-3.5 bg-[#0d1117] border border-slate-700 text-white rounded-2xl font-bold outline-none focus:border-lime-500 transition-all placeholder:text-slate-600"
                                                    required
                                                />
                                                <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">რაოდენობა</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={newAccessory.quantity}
                                                    onChange={e => setNewAccessory({ ...newAccessory, quantity: e.target.value })}
                                                    placeholder="0"
                                                    min="1"
                                                    className="w-full pl-10 pr-5 py-3.5 bg-[#0d1117] border border-slate-700 text-white rounded-2xl font-bold outline-none focus:border-lime-500 transition-all placeholder:text-slate-600"
                                                    required
                                                />
                                                <Package size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ერთეულის ფასი (₾)</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={newAccessory.price}
                                                    onChange={e => setNewAccessory({ ...newAccessory, price: e.target.value })}
                                                    placeholder="0.00"
                                                    min="0"
                                                    className="w-full pl-10 pr-5 py-3.5 bg-[#0d1117] border border-slate-700 text-white rounded-2xl font-bold outline-none focus:border-lime-500 transition-all placeholder:text-slate-600"
                                                    required
                                                />
                                                <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full py-4 bg-lime-500 text-slate-900 font-black rounded-2xl shadow-xl hover:bg-lime-400 transition-all active:scale-95 uppercase text-xs tracking-widest">დამატება</button>
                                    </form>
                                </div>
                            </div>
                            <div className="lg:col-span-8">
                                <div className="bg-[#161b22] rounded-[2.5rem] shadow-sm border border-slate-800 overflow-hidden">
                                    <table className="w-full text-left text-sm text-slate-400">
                                        <thead className="bg-[#0d1117] text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                                            <tr><th className="px-8 py-5">დასახელება</th><th className="px-8 py-5">რაოდენობა</th><th className="px-8 py-5">ფასი</th><th className="px-8 py-5">ჯამი</th><th className="px-8 py-5 text-right"></th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {Array.isArray(accessories) && accessories.map((item) => (
                                                <tr key={item._id || item.id} className="hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-8 py-5 font-black text-white">{item.name}</td>
                                                    <td className="px-8 py-5">
                                                        <span className="bg-[#0d1117] text-slate-300 px-3 py-1 rounded-xl text-[10px] font-black uppercase border border-slate-700">
                                                            {item.quantity} ცალი
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 font-bold">₾{item.price?.toFixed(2)}</td>
                                                    <td className="px-8 py-5 font-black text-lime-500">
                                                        ₾{(item.quantity * (item.price || 0)).toFixed(2)}
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <button onClick={() => handleDeleteAccessory(item._id || item.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {accessories.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-8 py-12 text-center text-slate-500">
                                                        <div className="flex flex-col items-center">
                                                            <Package size={32} className="mb-3 opacity-50" />
                                                            <span className="text-xs font-bold uppercase tracking-widest">სია ცარიელია</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. SUPPLIERS */}
                    {activeWarehouseSubTab === 'SUPPLIERS' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
                            <div className="lg:col-span-4">
                                <div className="bg-[#161b22] rounded-[2.5rem] shadow-sm border border-slate-800 p-8 sticky top-0">
                                    <h3 className="font-black text-white mb-8 flex items-center text-sm uppercase tracking-widest">
                                        <Plus size={20} className="mr-3 text-indigo-500" />
                                        მომწოდებლის დამატება
                                    </h3>
                                    <form onSubmit={handleAddSupplier} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">კომპანია</label>
                                            <input required value={newSupplier.name} onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })} className="w-full px-5 py-3.5 bg-[#0d1117] border border-slate-700 text-white rounded-2xl font-bold outline-none focus:border-indigo-500 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">საკონტაქტო პირი</label>
                                            <input required value={newSupplier.contactPerson} onChange={e => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })} className="w-full px-5 py-3.5 bg-[#0d1117] border border-slate-700 text-white rounded-2xl font-bold outline-none focus:border-indigo-500 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ტელეფონი</label>
                                            <input required value={newSupplier.phone} onChange={e => setNewSupplier({ ...newSupplier, phone: e.target.value })} className="w-full px-5 py-3.5 bg-[#0d1117] border border-slate-700 text-white rounded-2xl font-bold outline-none focus:border-indigo-500 transition-all" />
                                        </div>
                                        <button type="submit" className="w-full py-4 bg-lime-500 text-slate-900 font-black rounded-2xl shadow-xl transition-all hover:bg-lime-400 active:scale-95 uppercase text-xs tracking-widest">დამატება</button>
                                    </form>
                                </div>
                            </div>
                            <div className="lg:col-span-8">
                                <div className="bg-[#161b22] rounded-[2.5rem] shadow-sm border border-slate-800 overflow-hidden">
                                    <table className="w-full text-left text-sm text-slate-400">
                                        <thead className="bg-[#0d1117] text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                                            <tr><th className="px-8 py-5">კომპანია</th><th className="px-8 py-5">საკონტაქტო</th><th className="px-8 py-5">ტელეფონი</th><th className="px-8 py-5">სტატუსი</th><th className="px-8 py-5 text-right"></th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {Array.isArray(suppliers) && suppliers.map(s => (
                                                <tr key={s._id || s.id} className="hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-8 py-5 font-black text-white">{s.name}</td>
                                                    <td className="px-8 py-5 font-bold text-slate-500">{s.contactPerson}</td>
                                                    <td className="px-8 py-5 font-mono text-xs font-black">{s.phone}</td>
                                                    <td className="px-8 py-5">
                                                        <span className={`flex items-center space-x-1.5 font-black text-[10px] uppercase ${s.status === 'Active' ? 'text-emerald-500' : 'text-slate-500'}`}>
                                                            {s.status === 'Active' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                            <span>{s.status === 'Active' ? 'აქტიური' : 'არააქტიური'}</span>
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-right"><button onClick={() => handleDeleteSupplier(s._id || s.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
