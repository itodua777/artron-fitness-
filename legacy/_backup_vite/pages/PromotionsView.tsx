import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  Calendar, 
  Tag, 
  Smartphone, 
  Bell, 
  Globe, 
  ArrowLeft, 
  Save, 
  Clock, 
  CheckCircle, 
  BarChart, 
  Users,
  Target,
  Package as PackageIcon,
  Pencil
} from 'lucide-react';
import { Package } from '../types';

interface Campaign {
  id: number;
  title: string;
  description: string;
  discount: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Scheduled' | 'Draft' | 'Ended';
  channels: ('SMS' | 'PUSH' | 'SOCIAL')[];
  reach: number;
  targetPackageId?: string; // Linked package
  targetPackageName?: string;
}

interface PromotionsViewProps {
  packages: Package[];
}

const PromotionsView: React.FC<PromotionsViewProps> = ({ packages }) => {
  const [viewMode, setViewMode] = useState<'LIST' | 'CREATE' | 'EDIT'>('LIST');
  const [editingId, setEditingId] = useState<number | null>(null);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      title: 'საახალწლო ფასდაკლება',
      description: '20% ფასდაკლება 6 თვიან აბონემენტზე ყველა ახალი წევრისთვის.',
      discount: 20,
      startDate: '2023-12-25',
      endDate: '2024-01-15',
      status: 'Scheduled',
      channels: ['SMS', 'SOCIAL'],
      reach: 0
    },
    {
      id: 2,
      title: 'შავი პარასკევი',
      description: 'ულიმიტო წლიური აბონემენტი სპეციალურ ფასად.',
      discount: 40,
      startDate: '2023-11-24',
      endDate: '2023-11-27',
      status: 'Active',
      channels: ['PUSH', 'SMS', 'SOCIAL'],
      reach: 1450
    },
    {
      id: 3,
      title: 'სტუდენტური აქცია',
      description: 'სპეციალური ტარიფი სტუდენტებისთვის 14:00 საათამდე.',
      discount: 15,
      startDate: '2023-09-01',
      endDate: '2023-12-31',
      status: 'Active',
      channels: ['SOCIAL'],
      reach: 3200
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    startDate: '',
    endDate: '',
    targetPackageId: '',
    channels: {
      sms: false,
      push: false,
      social: false
    }
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', discount: '', startDate: '', endDate: '', targetPackageId: '', channels: { sms: false, push: false, social: false } });
    setEditingId(null);
  };

  const handleEditClick = (campaign: Campaign) => {
    setEditingId(campaign.id);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      discount: campaign.discount.toString(),
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      targetPackageId: campaign.targetPackageId || '',
      channels: {
        sms: campaign.channels.includes('SMS'),
        push: campaign.channels.includes('PUSH'),
        social: campaign.channels.includes('SOCIAL'),
      }
    });
    setViewMode('EDIT');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const channels: ('SMS' | 'PUSH' | 'SOCIAL')[] = [];
    if (formData.channels.sms) channels.push('SMS');
    if (formData.channels.push) channels.push('PUSH');
    if (formData.channels.social) channels.push('SOCIAL');

    // Find linked package name if exists
    const linkedPkg = packages.find(p => p.id === formData.targetPackageId);

    if (viewMode === 'EDIT' && editingId) {
      // Update Existing
      setCampaigns(prev => prev.map(camp => {
        if (camp.id === editingId) {
          return {
            ...camp,
            title: formData.title,
            description: formData.description,
            discount: parseInt(formData.discount) || 0,
            startDate: formData.startDate,
            endDate: formData.endDate,
            channels,
            targetPackageId: formData.targetPackageId,
            targetPackageName: linkedPkg?.name
          };
        }
        return camp;
      }));
      alert('აქცია წარმატებით განახლდა!');
    } else {
      // Create New
      const newCampaign: Campaign = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        discount: parseInt(formData.discount) || 0,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: 'Active', // Default to active for demo
        channels,
        reach: 0,
        targetPackageId: formData.targetPackageId,
        targetPackageName: linkedPkg?.name
      };
      setCampaigns([newCampaign, ...campaigns]);
      alert('აქცია წარმატებით შეიქმნა და გაეშვა!');
    }

    setViewMode('LIST');
    resetForm();
  };

  const toggleChannel = (channel: 'sms' | 'push' | 'social') => {
    setFormData(prev => ({
      ...prev,
      channels: { ...prev.channels, [channel]: !prev.channels[channel] }
    }));
  };

  // --- CREATE / EDIT MODE ---
  if (viewMode === 'CREATE' || viewMode === 'EDIT') {
    return (
      <div className="max-w-4xl mx-auto animate-fadeIn">
        <button 
          onClick={() => {
            setViewMode('LIST');
            resetForm();
          }}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">აქციების დაფაზე დაბრუნება</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-lime-500 to-lime-600 text-slate-900 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">
                {viewMode === 'EDIT' ? 'აქციის რედაქტირება' : 'ახალი აქციის შექმნა'}
              </h2>
              <p className="text-slate-800 text-sm mt-1">
                {viewMode === 'EDIT' ? 'შეცვალეთ აქციის დეტალები და მიბმული პაკეტები' : 'დაგეგმეთ მარკეტინგული კამპანია'}
              </p>
            </div>
            <div className="w-10 h-10 bg-white/40 backdrop-blur rounded-full flex items-center justify-center text-slate-900">
              {viewMode === 'EDIT' ? <Pencil size={20} /> : <Megaphone size={20} />}
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Side: General Info */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">ძირითადი ინფორმაცია</h3>
                
                {/* Package Selection */}
                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700 flex items-center">
                      <PackageIcon size={16} className="mr-2 text-lime-600" />
                      აირჩიეთ სამიზნე პროდუქტი (პაკეტი)
                   </label>
                   <select 
                      value={formData.targetPackageId}
                      onChange={(e) => setFormData({...formData, targetPackageId: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all text-slate-700"
                   >
                      <option value="">ზოგადი აქცია (პაკეტის გარეშე)</option>
                      {packages.map(pkg => (
                        <option key={pkg.id} value={pkg.id}>
                           {pkg.name} - ₾{pkg.price}
                        </option>
                      ))}
                   </select>
                   <p className="text-xs text-slate-400">
                      {packages.length === 0 
                        ? 'ბიბლიოთეკაში პაკეტები არ მოიძებნა. შეიქმნება ზოგადი აქცია.' 
                        : 'მიუთითეთ რომელ პაკეტზე ვრცელდება ეს აქცია/ფასდაკლება.'}
                   </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">აქციის დასახელება</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" placeholder="მაგ: საგაზაფხულო ფასდაკლება" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">აღწერა (შეტყობინების ტექსტი)</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="მოკლე აღწერა აქციის შესახებ..." className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all h-32 resize-none" />
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">ფასდაკლების ოდენობა (%)</label>
                   <div className="relative">
                      <input type="number" min="0" max="100" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all" placeholder="20" />
                      <Tag size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   </div>
                </div>
              </div>

              {/* Right Side: Targeting & Timing */}
              <div className="space-y-6">
                 <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">გავრცელების არხები და დრო</h3>
                 
                 <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700 mb-2 block">სად გაიგზავნოს აქცია?</label>
                    
                    <div 
                      onClick={() => toggleChannel('sms')}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${formData.channels.sms ? 'border-lime-500 bg-lime-50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                       <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${formData.channels.sms ? 'bg-lime-200 text-lime-900' : 'bg-slate-100 text-slate-500'}`}>
                             <Smartphone size={20} />
                          </div>
                          <span className={`font-medium ${formData.channels.sms ? 'text-lime-900' : 'text-slate-600'}`}>SMS დაგზავნა</span>
                       </div>
                       {formData.channels.sms && <CheckCircle size={20} className="text-lime-600" />}
                    </div>

                    <div 
                      onClick={() => toggleChannel('push')}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${formData.channels.push ? 'border-lime-500 bg-lime-50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                       <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${formData.channels.push ? 'bg-lime-200 text-lime-900' : 'bg-slate-100 text-slate-500'}`}>
                             <Bell size={20} />
                          </div>
                          <span className={`font-medium ${formData.channels.push ? 'text-lime-900' : 'text-slate-600'}`}>Push ნოტიფიკაცია</span>
                       </div>
                       {formData.channels.push && <CheckCircle size={20} className="text-lime-600" />}
                    </div>

                    <div 
                      onClick={() => toggleChannel('social')}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${formData.channels.social ? 'border-lime-500 bg-lime-50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                       <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${formData.channels.social ? 'bg-lime-200 text-lime-900' : 'bg-slate-100 text-slate-500'}`}>
                             <Globe size={20} />
                          </div>
                          <span className={`font-medium ${formData.channels.social ? 'text-lime-900' : 'text-slate-600'}`}>Social Media პოსტი</span>
                       </div>
                       {formData.channels.social && <CheckCircle size={20} className="text-lime-600" />}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">დაწყება</label>
                       <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none text-slate-600" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">დასრულება</label>
                       <input required type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none text-slate-600" />
                    </div>
                 </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100 space-x-3">
                <button type="button" onClick={() => { setViewMode('LIST'); resetForm(); }} className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">
                  გაუქმება
                </button>
                <button type="submit" className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-slate-900 font-bold rounded-xl shadow-lg shadow-lime-500/20 transition-all active:scale-95">
                  <Megaphone size={18} />
                  <span>{viewMode === 'EDIT' ? 'ცვლილებების შენახვა' : 'აქციის გაშვება'}</span>
                </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 flex items-center">
             <Megaphone className="mr-3 text-lime-600" />
             აქციების მართვა
           </h2>
           <p className="text-slate-500 text-sm mt-1">მართეთ მარკეტინგული კამპანიები და ფასდაკლებები</p>
        </div>
        <button 
          onClick={() => { resetForm(); setViewMode('CREATE'); }}
          className="flex items-center space-x-2 px-6 py-3 bg-lime-400 hover:bg-lime-500 text-slate-900 font-bold rounded-xl shadow-lg shadow-lime-500/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>ახალი აქციის შექმნა</span>
        </button>
      </div>

      {/* Stats Mockup */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-lime-500 rounded-2xl p-6 text-slate-900 shadow-lg shadow-lime-500/30 relative overflow-hidden">
            <div className="relative z-10">
               <p className="text-lime-900 text-sm font-medium mb-1">მიმდინარე აქტიური კამპანიები</p>
               <h3 className="text-3xl font-bold">2</h3>
            </div>
            <Megaphone size={64} className="absolute -right-4 -bottom-4 text-lime-700/30" />
         </div>
         <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">საერთო წვდომა</p>
                  <h3 className="text-2xl font-bold text-slate-800">4,650</h3>
               </div>
               <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Users size={20}/></div>
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-2">+12% გასულ თვესთან</p>
         </div>
         <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">კონვერსია</p>
                  <h3 className="text-2xl font-bold text-slate-800">8.4%</h3>
               </div>
               <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Target size={20}/></div>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-2">საშუალო მაჩვენებელი</p>
         </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {campaigns.map((camp) => (
            <div key={camp.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col relative overflow-hidden group">
               {/* Status Badge */}
               <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  camp.status === 'Active' ? 'bg-emerald-100 text-emerald-600' :
                  camp.status === 'Scheduled' ? 'bg-amber-100 text-amber-600' :
                  'bg-slate-100 text-slate-500'
               }`}>
                  {camp.status === 'Active' ? 'აქტიური' : camp.status === 'Scheduled' ? 'დაგეგმილი' : 'დასრულებული'}
               </div>

               <div className="p-6 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center text-slate-900 font-bold text-lg mb-4 shadow-md">
                     {camp.discount}%
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-lime-600 transition-colors">{camp.title}</h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{camp.description}</p>
                  
                  {/* Linked Package Badge */}
                  {camp.targetPackageName && (
                     <div className="inline-flex items-center bg-slate-100 px-2 py-1 rounded-md text-[10px] text-slate-600 font-medium mb-3">
                        <PackageIcon size={10} className="mr-1" />
                        პროდუქტი: {camp.targetPackageName}
                     </div>
                  )}

                  <div className="flex items-center text-xs text-slate-400 mb-2">
                     <Calendar size={14} className="mr-2" />
                     {camp.startDate} - {camp.endDate}
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                     {camp.channels.map(ch => (
                        <span key={ch} className="px-2 py-1 rounded-md bg-slate-50 text-slate-500 text-[10px] font-bold border border-slate-100">
                           {ch}
                        </span>
                     ))}
                  </div>
               </div>

               <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                  <div className="flex items-center text-xs font-medium text-slate-500">
                     <BarChart size={14} className="mr-1.5" />
                     {camp.reach > 0 ? `${camp.reach} ნახვა` : 'მონაცემები არ არის'}
                  </div>
                  <button 
                    onClick={() => handleEditClick(camp)}
                    className="text-sm font-medium text-lime-600 hover:text-lime-700 flex items-center"
                  >
                    <Pencil size={14} className="mr-1" />
                    მართვა
                  </button>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default PromotionsView;