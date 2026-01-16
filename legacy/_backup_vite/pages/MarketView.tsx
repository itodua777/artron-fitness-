
import React, { useState } from 'react';
import { 
  Plus, 
  ShoppingCart, 
  Box, 
  ArrowLeft, 
  Trash2, 
  Utensils,
  Minus,
  Truck,
  Phone,
  User,
  CheckCircle,
  XCircle,
  Store,
  Warehouse,
  Package,
  LayoutGrid
} from 'lucide-react';
import { MarketItem } from '../types';

// Interface for Supplier
interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  phone: string;
  category: string;
  status: 'Active' | 'Inactive';
}

// Mock Initial Data for Grocery (Sellable items)
const initialGroceries: MarketItem[] = [
  { id: 1, name: 'ენერგეტიკული სასმელი', price: 5.00, stock: 45, category: 'სასმელები', image: 'https://picsum.photos/400/400?random=10' },
  { id: 2, name: 'პროტეინის ბატონი', price: 8.50, stock: 30, category: 'კვება', image: 'https://picsum.photos/400/400?random=11' },
  { id: 3, name: 'წყალი (0.5ლ)', price: 2.00, stock: 120, category: 'სასმელები', image: 'https://picsum.photos/400/400?random=12' },
  { id: 4, name: 'ესპრესო', price: 4.00, stock: 500, category: 'ყავა', image: 'https://picsum.photos/400/400?random=13' },
];

// Mock Initial Data for Materials (Non-sellable assets)
const initialMaterials = [
  { id: 1, name: 'ბარის სკამი', quantity: 12, condition: 'კარგი', note: 'შავი ტყავის' },
  { id: 2, name: 'ყავის აპარატი', quantity: 1, condition: 'ახალი', note: 'La Marzocco' },
  { id: 3, name: 'შუშის ჭიქა (დიდი)', quantity: 45, condition: 'კარგი', note: 'თარო 2' },
];

// Mock Initial Data for Suppliers
const initialSuppliers: Supplier[] = [
  { id: 1, name: 'Coca-Cola Georgia', contactPerson: 'გიორგი მენეჯერი', phone: '599 11 22 33', category: 'სასმელები', status: 'Active' },
  { id: 2, name: 'Food Service LTD', contactPerson: 'ანა დისტრიბუტორი', phone: '577 44 55 66', category: 'კვება', status: 'Active' },
  { id: 3, name: 'Coffee World', contactPerson: 'ლევან ყავა', phone: '555 99 88 77', category: 'ყავა', status: 'Inactive' },
];

const MarketView: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<'TERMINAL' | 'WAREHOUSE'>('TERMINAL');
  const [activeWarehouseSubTab, setActiveWarehouseSubTab] = useState<'GROCERY' | 'MATERIAL' | 'SUPPLIERS'>('GROCERY');
  
  const [selectedCategory, setSelectedCategory] = useState('ყველა');
  
  // Data States
  const [groceries, setGroceries] = useState<MarketItem[]>(initialGroceries);
  const [materials, setMaterials] = useState(initialMaterials);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [cart, setCart] = useState<{item: MarketItem, qty: number}[]>([]);

  // Forms State
  const [newGrocery, setNewGrocery] = useState({ name: '', price: '', stock: '', category: 'სასმელები' });
  const [newMaterial, setNewMaterial] = useState({ name: '', quantity: '', condition: 'კარგი', note: '' });
  const [newSupplier, setNewSupplier] = useState({ name: '', contactPerson: '', phone: '', category: 'სასმელები' });

  // --- Handlers ---

  const handleAddGrocery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrocery.name || !newGrocery.price || !newGrocery.stock) return;
    
    const item: MarketItem = {
      id: Date.now(),
      name: newGrocery.name,
      price: parseFloat(newGrocery.price),
      stock: parseInt(newGrocery.stock),
      category: newGrocery.category,
      image: `https://picsum.photos/400/400?random=${Date.now()}`
    };
    
    setGroceries([item, ...groceries]);
    setNewGrocery({ name: '', price: '', stock: '', category: 'სასმელები' });
    alert('პროდუქტი დაემატა სასურსათო საწყობში!');
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterial.name || !newMaterial.quantity) return;

    const item = {
      id: Date.now(),
      name: newMaterial.name,
      quantity: parseInt(newMaterial.quantity),
      condition: newMaterial.condition,
      note: newMaterial.note
    };

    setMaterials([item, ...materials]);
    setNewMaterial({ name: '', quantity: '', condition: 'კარგი', note: '' });
    alert('ნივთი დაემატა მატერიალურ საწყობში!');
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.name || !newSupplier.contactPerson || !newSupplier.phone) return;

    const supplier: Supplier = {
      id: Date.now(),
      name: newSupplier.name,
      contactPerson: newSupplier.contactPerson,
      phone: newSupplier.phone,
      category: newSupplier.category,
      status: 'Active'
    };

    setSuppliers([supplier, ...suppliers]);
    setNewSupplier({ name: '', contactPerson: '', phone: '', category: 'სასმელები' });
    alert('მომწოდებელი წარმატებით დაემატა ბაზაში!');
  };

  const handleDeleteGrocery = (id: number) => {
    setGroceries(groceries.filter(g => g.id !== id));
  };

  const handleDeleteMaterial = (id: number) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const handleDeleteSupplier = (id: number) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
  };

  const addToCart = (product: MarketItem) => {
    const existing = cart.find(x => x.item.id === product.id);
    if (existing) {
        setCart(cart.map(x => x.item.id === product.id ? { ...x, qty: x.qty + 1 } : x));
    } else {
        setCart([...cart, { item: product, qty: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
     setCart(cart.filter(x => x.item.id !== id));
  };

  const adjustQty = (id: number, delta: number) => {
    setCart(cart.map(x => {
        if (x.item.id === id) {
            return { ...x, qty: Math.max(1, x.qty + delta) };
        }
        return x;
    }));
  };

  const calculateTotal = () => {
      return cart.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0).toFixed(2);
  };

  const filteredGroceries = selectedCategory === 'ყველა' 
    ? groceries 
    : groceries.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6 animate-fadeIn h-[calc(100vh-8rem)] flex flex-col">
      {/* Primary Tab Navigation */}
      <div className="flex space-x-1 bg-slate-200/50 p-1.5 rounded-[1.5rem] w-full max-w-md shrink-0">
        <button 
          onClick={() => setActiveMainTab('TERMINAL')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-2xl font-black text-sm transition-all ${
            activeMainTab === 'TERMINAL' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Store size={18} />
          <span>გაყიდვის ტერმინალი</span>
        </button>
        <button 
          onClick={() => setActiveMainTab('WAREHOUSE')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-2xl font-black text-sm transition-all ${
            activeMainTab === 'WAREHOUSE' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Warehouse size={18} />
          <span>საწყობი</span>
        </button>
      </div>

      {/* TERMINAL VIEW */}
      {activeMainTab === 'TERMINAL' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0 animate-fadeIn">
          {/* Product Grid Area */}
          <div className="lg:col-span-3 flex flex-col min-h-0">
            {/* Filter Tabs */}
            <div className="flex space-x-3 pb-4 overflow-x-auto shrink-0 no-scrollbar">
              {['ყველა', 'სასმელები', 'კვება', 'ყავა', 'ალკოჰოლი'].map((cat, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all shadow-sm border ${
                    selectedCategory === cat 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Scrollable Grid */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredGroceries.map((product) => (
                  <div 
                    key={product.id} 
                    onClick={() => addToCart(product)}
                    className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden cursor-pointer hover:shadow-xl hover:border-lime-400 transition-all duration-300 group flex flex-col h-72"
                  >
                    <div className="relative h-40 overflow-hidden bg-slate-100">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-black text-slate-900 shadow-lg">
                        ₾ {product.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{product.category}</div>
                        <h3 className="font-black text-slate-800 text-sm leading-tight line-clamp-2">{product.name}</h3>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className={`text-[10px] font-black uppercase ${product.stock < 10 ? 'text-red-500' : 'text-slate-400'}`}>
                          ნაშთი: {product.stock}
                        </span>
                        <div className="w-9 h-9 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-lime-400 group-hover:text-slate-900 group-hover:rotate-90 transition-all duration-300">
                          <Plus size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Panel */}
          <div className="lg:col-span-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center space-x-3">
              <div className="p-2 bg-white rounded-xl shadow-sm text-slate-400"><ShoppingCart size={20} /></div>
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">მიმდინარე შეკვეთა</h3>
            </div>
            
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 opacity-40">
                <ShoppingCart size={48} strokeWidth={1} className="mb-4" />
                <p className="text-sm font-black uppercase tracking-tighter">კალათა ცარიელია</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.item.id} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 group animate-fadeIn">
                    <div className="flex-1">
                      <h4 className="text-xs font-black text-slate-800 line-clamp-1">{item.item.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400">₾{item.item.price} / ერთ.</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button onClick={() => adjustQty(item.item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all active:scale-90"><Minus size={14} /></button>
                      <span className="text-xs font-black w-4 text-center">{item.qty}</span>
                      <button onClick={() => adjustQty(item.item.id, 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all active:scale-90"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.item.id)} className="ml-3 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            )}

            <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">ჯამური თანხა</span>
                <span className="font-black text-slate-900 text-2xl">₾ {calculateTotal()}</span>
              </div>
              <button 
                disabled={cart.length === 0}
                onClick={() => { alert('გადახდა წარმატებით შესრულდა!'); setCart([]); }}
                className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed uppercase text-xs tracking-widest"
              >
                გადახდა
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WAREHOUSE VIEW */}
      {activeMainTab === 'WAREHOUSE' && (
        <div className="flex-1 flex flex-col min-h-0 space-y-6 animate-fadeIn">
          {/* Warehouse Sub-Navigation */}
          <div className="flex space-x-4 border-b border-slate-100 shrink-0 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveWarehouseSubTab('GROCERY')}
              className={`pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all border-b-4 whitespace-nowrap flex items-center space-x-2 ${
                activeWarehouseSubTab === 'GROCERY' ? 'border-orange-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Utensils size={16} />
              <span>სასურსათო საწყობი</span>
            </button>
            <button 
              onClick={() => setActiveWarehouseSubTab('MATERIAL')}
              className={`pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all border-b-4 whitespace-nowrap flex items-center space-x-2 ${
                activeWarehouseSubTab === 'MATERIAL' ? 'border-blue-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Box size={16} />
              <span>მატერიალური საწყობი</span>
            </button>
            <button 
              onClick={() => setActiveWarehouseSubTab('SUPPLIERS')}
              className={`pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all border-b-4 whitespace-nowrap flex items-center space-x-2 ${
                activeWarehouseSubTab === 'SUPPLIERS' ? 'border-indigo-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Truck size={16} />
              <span>მომწოდებლები</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            {/* 1. GROCERY WAREHOUSE */}
            {activeWarehouseSubTab === 'GROCERY' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
                <div className="lg:col-span-4">
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 sticky top-0">
                    <h3 className="font-black text-slate-800 mb-8 flex items-center text-sm uppercase tracking-widest">
                      <Plus size={20} className="mr-3 text-orange-500" />
                      პროდუქტის მიღება
                    </h3>
                    <form onSubmit={handleAddGrocery} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">დასახელება</label>
                        <input required value={newGrocery.name} onChange={e => setNewGrocery({...newGrocery, name: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:bg-white focus:border-orange-500 transition-all" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ფასი (₾)</label>
                          <input type="number" step="0.01" required value={newGrocery.price} onChange={e => setNewGrocery({...newGrocery, price: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:bg-white focus:border-orange-500 transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">რაოდენობა</label>
                          <input type="number" required value={newGrocery.stock} onChange={e => setNewGrocery({...newGrocery, stock: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:bg-white focus:border-orange-500 transition-all" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">კატეგორია</label>
                        <select value={newGrocery.category} onChange={e => setNewGrocery({...newGrocery, category: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none bg-white">
                          <option>სასმელები</option><option>კვება</option><option>ყავა</option><option>ალკოჰოლი</option><option>სხვა</option>
                        </select>
                      </div>
                      <button type="submit" className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-100 transition-all hover:bg-slate-800 active:scale-95 uppercase text-xs tracking-widest">დამატება</button>
                    </form>
                  </div>
                </div>
                <div className="lg:col-span-8">
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                        <tr><th className="px-8 py-5">პროდუქტი</th><th className="px-8 py-5">კატეგორია</th><th className="px-8 py-5">ფასი</th><th className="px-8 py-5">ნაშთი</th><th className="px-8 py-5 text-right"></th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {groceries.map(g => (
                          <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-5 font-black text-slate-800">{g.name}</td>
                            <td className="px-8 py-5"><span className="px-3 py-1 bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-tighter">{g.category}</span></td>
                            <td className="px-8 py-5 font-bold">₾ {g.price.toFixed(2)}</td>
                            <td className="px-8 py-5 font-mono font-black text-slate-800">{g.stock}</td>
                            <td className="px-8 py-5 text-right"><button onClick={() => handleDeleteGrocery(g.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. MATERIAL WAREHOUSE */}
            {activeWarehouseSubTab === 'MATERIAL' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
                <div className="lg:col-span-4">
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 sticky top-0">
                    <h3 className="font-black text-slate-800 mb-8 flex items-center text-sm uppercase tracking-widest">
                      <Plus size={20} className="mr-3 text-blue-500" />
                      ინვენტარის დამატება
                    </h3>
                    <form onSubmit={handleAddMaterial} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ნივთის დასახელება</label>
                        <input required value={newMaterial.name} onChange={e => setNewMaterial({...newMaterial, name: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:bg-white focus:border-blue-500 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">რაოდენობა</label>
                        <input type="number" required value={newMaterial.quantity} onChange={e => setNewMaterial({...newMaterial, quantity: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:bg-white focus:border-blue-500 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">მდგომარეობა</label>
                        <select value={newMaterial.condition} onChange={e => setNewMaterial({...newMaterial, condition: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none bg-white">
                          <option>ახალი</option><option>კარგი</option><option>დაზიანებული</option><option>ჩამოსაწერი</option>
                        </select>
                      </div>
                      <button type="submit" className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl transition-all hover:bg-slate-800 active:scale-95 uppercase text-xs tracking-widest">დამატება</button>
                    </form>
                  </div>
                </div>
                <div className="lg:col-span-8">
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                        <tr><th className="px-8 py-5">ნივთი</th><th className="px-8 py-5">რაოდენობა</th><th className="px-8 py-5">მდგომარეობა</th><th className="px-8 py-5">შენიშვნა</th><th className="px-8 py-5 text-right"></th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {materials.map(m => (
                          <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-5 font-black text-slate-800">{m.name}</td>
                            <td className="px-8 py-5 font-mono font-black text-slate-800">{m.quantity}</td>
                            <td className="px-8 py-5"><span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase ${m.condition === 'ახალი' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{m.condition}</span></td>
                            <td className="px-8 py-5 text-xs text-slate-400 font-medium">{m.note || '-'}</td>
                            <td className="px-8 py-5 text-right"><button onClick={() => handleDeleteMaterial(m.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SUPPLIERS */}
            {activeWarehouseSubTab === 'SUPPLIERS' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
                <div className="lg:col-span-4">
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 sticky top-0">
                    <h3 className="font-black text-slate-800 mb-8 flex items-center text-sm uppercase tracking-widest">
                      <Plus size={20} className="mr-3 text-indigo-500" />
                      მომწოდებლის დამატება
                    </h3>
                    <form onSubmit={handleAddSupplier} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">კომპანია</label>
                        <input required value={newSupplier.name} onChange={e => setNewSupplier({...newSupplier, name: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:bg-white focus:border-indigo-500 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">საკონტაქტო პირი</label>
                        <input required value={newSupplier.contactPerson} onChange={e => setNewSupplier({...newSupplier, contactPerson: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:bg-white focus:border-indigo-500 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ტელეფონი</label>
                        <input required value={newSupplier.phone} onChange={e => setNewSupplier({...newSupplier, phone: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:bg-white focus:border-indigo-500 transition-all" />
                      </div>
                      <button type="submit" className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl transition-all hover:bg-slate-800 active:scale-95 uppercase text-xs tracking-widest">დამატება</button>
                    </form>
                  </div>
                </div>
                <div className="lg:col-span-8">
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                        <tr><th className="px-8 py-5">კომპანია</th><th className="px-8 py-5">საკონტაქტო</th><th className="px-8 py-5">ტელეფონი</th><th className="px-8 py-5">სტატუსი</th><th className="px-8 py-5 text-right"></th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {suppliers.map(s => (
                          <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-5 font-black text-slate-800">{s.name}</td>
                            <td className="px-8 py-5 font-bold text-slate-500">{s.contactPerson}</td>
                            <td className="px-8 py-5 font-mono text-xs font-black">{s.phone}</td>
                            <td className="px-8 py-5">
                              <span className={`flex items-center space-x-1.5 font-black text-[10px] uppercase ${s.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {s.status === 'Active' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                <span>{s.status === 'Active' ? 'აქტიური' : 'არააქტიური'}</span>
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right"><button onClick={() => handleDeleteSupplier(s.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></td>
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
      )}
    </div>
  );
};

export default MarketView;
