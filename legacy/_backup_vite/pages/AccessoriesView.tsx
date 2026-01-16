import React, { useState } from 'react';
import { Plus, Trash2, Package, Tag, DollarSign, Save, Search } from 'lucide-react';

interface AccessoryItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

const AccessoriesView: React.FC = () => {
  // State for inventory list
  const [inventory, setInventory] = useState<AccessoryItem[]>([]);
  
  // State for the form
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    price: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.quantity || !newItem.price) return;

    const item: AccessoryItem = {
      id: Date.now(),
      name: newItem.name,
      quantity: parseInt(newItem.quantity),
      price: parseFloat(newItem.price)
    };

    setInventory([item, ...inventory]);
    setNewItem({ name: '', quantity: '', price: '' }); // Reset form
  };

  const handleDelete = (id: number) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-800">აქსესუარების მართვა</h2>
           <p className="text-slate-500 text-sm">ახალი ინვენტარის დამატება და აღრიცხვა</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Add Form */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-6">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center space-x-3">
                    <div className="bg-lime-100 p-2 rounded-lg text-lime-600">
                        <Plus size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800">ახალი აქსესუარი</h3>
                </div>
                
                <form onSubmit={handleAddItem} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">დასახელება</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                name="name"
                                value={newItem.name}
                                onChange={handleInputChange}
                                placeholder="მაგ: წყლის ბოთლი" 
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all"
                                required
                            />
                            <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">რაოდენობა (ცალი)</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                name="quantity"
                                value={newItem.quantity}
                                onChange={handleInputChange}
                                placeholder="0" 
                                min="1"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all"
                                required
                            />
                            <Package size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">ერთეულის ფასი (₾)</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                name="price"
                                value={newItem.price}
                                onChange={handleInputChange}
                                placeholder="0.00" 
                                min="0"
                                step="0.01"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all"
                                required
                            />
                            <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full flex items-center justify-center space-x-2 py-3 bg-lime-400 hover:bg-lime-500 text-slate-900 font-bold rounded-xl shadow-lg shadow-lime-500/20 transition-all active:scale-95 mt-4"
                    >
                        <Save size={18} />
                        <span>დამატება</span>
                    </button>
                </form>
            </div>
        </div>

        {/* RIGHT COLUMN: Inventory List */}
        <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800">ბაზაში არსებული აქსესუარები</h3>
                    <div className="bg-white px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-500">
                        სულ: {inventory.length}
                    </div>
                </div>

                {inventory.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-white text-slate-400 text-xs uppercase font-bold border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">დასახელება</th>
                                    <th className="px-6 py-4">რაოდენობა</th>
                                    <th className="px-6 py-4">ფასი</th>
                                    <th className="px-6 py-4">ჯამი</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {inventory.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">
                                                {item.quantity} ცალი
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">₾{item.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 font-bold text-lime-600">
                                            ₾{(item.quantity * item.price).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Package size={32} className="text-slate-300" />
                        </div>
                        <h4 className="text-slate-800 font-bold mb-1">სია ცარიელია</h4>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto">
                            დაამატეთ ახალი აქსესუარები მარცხენა ფორმის გამოყენებით.
                        </p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default AccessoriesView;