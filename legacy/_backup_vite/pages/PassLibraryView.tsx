import React, { useState } from 'react';
import { Package } from '../types';
// Added QrCode to the imports from lucide-react
import { Clock, User, Users, CheckCircle, Tag, ShoppingBag, Megaphone, Smartphone, Globe, X, Plus, CreditCard, CalendarDays, Dumbbell, Gift, Save, ArrowLeft, Ticket, ArrowRight, Phone, FileText, Mail, MapPin, UserCheck, ShieldAlert, Printer, Send, QrCode } from 'lucide-react';

interface PassLibraryViewProps {
  packages: Package[];
  onPromotePackage?: (id: string, target: 'web' | 'mobile' | 'both' | 'none') => void;
  onSavePackage?: (pkg: Package) => void;
}

const PassLibraryView: React.FC<PassLibraryViewProps> = ({ packages, onPromotePackage, onSavePackage }) => {
  const [viewMode, setViewMode] = useState<'LIST' | 'ONETIME' | 'CREATE'>('LIST');
  const [promotingId, setPromotingId] = useState<string | null>(null);

  // --- FORM STATE (Package Create) ---
  const [packageName, setPackageName] = useState<string>('');
  const [packageDescription, setPackageDescription] = useState<string>('');
  const [targetAge, setTargetAge] = useState<string>('ყველა');
  const [targetStatus, setTargetStatus] = useState<string>('ყველა');
  const [durationMode, setDurationMode] = useState<'unlimited' | 'limited'>('unlimited');
  const [timeMode, setTimeMode] = useState<'full' | 'custom'>('full');
  const [customStartTime, setCustomStartTime] = useState('');
  const [customEndTime, setCustomEndTime] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(1);
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [packagePrice, setPackagePrice] = useState('');
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);

  // --- GIFT VOUCHER STATE ---
  const [isGiftVoucher, setIsGiftVoucher] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [createdVoucherData, setCreatedVoucherData] = useState<any>(null);

  // --- FORM STATE (One Time Pass) ---
  const [activity, setActivity] = useState<string>('workout');
  const [visitPrice, setVisitPrice] = useState<string>('20');
  const isGuest = activity === 'guest';

  // Benefits Data
  const benefitOptions = [
    { id: 'water', name: 'წყალი (0.5ლ)', type: 'market', icon: '💧' },
    { id: 'protein', name: 'პროტეინი', type: 'market', icon: '🥤' },
    { id: 'vitamin', name: 'ვიტამინები', type: 'market', icon: '💊' },
    { id: 'towel', name: 'პირსახოცი', type: 'service', icon: '🧖' },
    { id: 'sauna', name: 'საუნა', type: 'service', icon: '🔥' },
    { id: 'parking', name: 'პარკინგი', type: 'service', icon: '🅿️' },
  ];

  const getBenefitName = (id: string) => {
    const benefit = benefitOptions.find(b => b.id === id);
    return benefit ? benefit.name : id;
  };

  const toggleBenefit = (id: string) => {
    if (selectedBenefits.includes(id)) {
      setSelectedBenefits(selectedBenefits.filter(item => item !== id));
    } else {
      setSelectedBenefits([...selectedBenefits, id]);
    }
  };

  const handleActivityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setActivity(value);
    if (value === 'guest') {
      setVisitPrice('0');
    } else {
      if (visitPrice === '0') setVisitPrice('20');
    }
  };

  const handleCreatePackage = () => {
    const newPackage: Package = {
      id: Date.now().toString(),
      name: packageName || 'უსახელო პაკეტი',
      description: packageDescription,
      targetAge,
      targetStatus,
      durationMode,
      timeMode,
      startTime: timeMode === 'custom' ? customStartTime : undefined,
      endTime: timeMode === 'custom' ? customEndTime : undefined,
      maxParticipants,
      trainer: selectedTrainer,
      price: packagePrice || '0',
      benefits: selectedBenefits
    };

    if (isGiftVoucher) {
      setCreatedVoucherData({
        ...newPackage,
        recipient: recipientName,
        message: giftMessage,
        code: `GFT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      });
      setShowVoucherModal(true);
    } else {
      if (onSavePackage) onSavePackage(newPackage);
      alert('აქტივობა წარმატებით დაემატა ბიბლიოთეკაში!');
      setViewMode('LIST');
    }
    
    // Reset form states if not showing modal (or after modal logic)
    if (!isGiftVoucher) {
      resetForm();
    }
  };

  const resetForm = () => {
    setPackageName('');
    setPackageDescription('');
    setTargetAge('ყველა');
    setTargetStatus('ყველა');
    setPackagePrice('');
    setSelectedBenefits([]);
    setMaxParticipants(1);
    setSelectedTrainer('');
    setDurationMode('unlimited');
    setTimeMode('full');
    setIsGiftVoucher(false);
    setRecipientName('');
    setGiftMessage('');
  };

  const closeVoucherModal = () => {
    if (onSavePackage && createdVoucherData) {
      const { recipient, message, code, ...pkg } = createdVoucherData;
      onSavePackage(pkg);
    }
    setShowVoucherModal(false);
    resetForm();
    setViewMode('LIST');
  };

  const handleCreateOneTimeVisit = () => {
    alert('ვიზიტი წარმატებით გაფორმდა!');
    setViewMode('LIST');
  };

  const handlePromoteClick = (id: string) => {
    setPromotingId(id);
  };

  const handleConfirmPromotion = (target: 'web' | 'mobile' | 'both' | 'none') => {
    if (promotingId && onPromotePackage) {
      onPromotePackage(promotingId, target);
      setPromotingId(null);
    }
  };

  // --- RENDER CREATE MODE ---
  if (viewMode === 'CREATE') {
    return (
      <div className="max-w-5xl mx-auto animate-fadeIn">
        <button 
          onClick={() => setViewMode('LIST')}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">ბიბლიოთეკაში დაბრუნება</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-8">
                     <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                             <CreditCard size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">ახალი აქტივობის შექმნა</h2>
                     </div>

                     <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                        {/* 1. Name Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-700 flex items-center">
                                <Tag size={16} className="mr-2 text-slate-400" />
                                1. აქტივობის დასახელება
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <select 
                                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all text-slate-700 font-medium"
                                  onChange={(e) => setPackageName(e.target.value)}
                                  value={packageName}
                                >
                                    <option value="" disabled>აირჩიეთ ტიპი...</option>
                                    <option value="სტანდარტული (Fitness)">სტანდარტული (Fitness)</option>
                                    <option value="პრემიუმი (Fitness + Spa)">პრემიუმი (Fitness + Spa)</option>
                                    <option value="Gold (All Access)">Gold (All Access)</option>
                                    <option value="იოგა ჯგუფი">იოგა ჯგუფი</option>
                                    <option value="ბოქსი ინდივიდუალური">ბოქსი ინდივიდუალური</option>
                                </select>
                                <input 
                                    type="text" 
                                    placeholder="ან ჩაწერეთ ახალი დასახელება"
                                    value={packageName}
                                    onChange={(e) => setPackageName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Description Field */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-700 flex items-center">
                                <FileText size={16} className="mr-2 text-slate-400" />
                                აქტივობის აღწერა
                            </label>
                            <textarea 
                                placeholder="შეიყვანეთ პაკეტის დეტალური აღწერა..."
                                value={packageDescription}
                                onChange={(e) => setPackageDescription(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all h-24 resize-none"
                            />
                        </div>

                        {/* Target Age Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-700 flex items-center">
                                <Users size={16} className="mr-2 text-slate-400" />
                                ასაკობრივი კატეგორია
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <select 
                                    value={targetAge}
                                    onChange={(e) => setTargetAge(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all text-slate-700 font-medium"
                                >
                                    <option value="ყველა">ყველა ასაკი</option>
                                    <option value="18 წლამდე">18 წლამდე</option>
                                    <option value="18-60 წელი">18-60 წელი</option>
                                    <option value="60+ წელი">60+ წელი</option>
                                </select>
                                <input 
                                    type="text" 
                                    placeholder="ან ჩაწერეთ ასაკი (მაგ: 16-25)"
                                    value={targetAge}
                                    onChange={(e) => setTargetAge(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Target Status Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-700 flex items-center">
                                <UserCheck size={16} className="mr-2 text-slate-400" />
                                მიზნობრივი სტატუსი
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <select 
                                    value={targetStatus}
                                    onChange={(e) => setTargetStatus(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all text-slate-700 font-medium"
                                >
                                    <option value="ყველა">ყველა სტატუსი</option>
                                    <option value="სტანდარტული">სტანდარტული</option>
                                    <option value="სტუდენტი">სტუდენტი</option>
                                    <option value="მოსწავლე">მოსწავლე</option>
                                    <option value="დასაქმებული">დასაქმებული</option>
                                    <option value="პენსიონერი">პენსიონერი</option>
                                    <option value="კორპორატიული">კორპორატიული</option>
                                </select>
                                <input 
                                    type="text" 
                                    placeholder="ან ჩაწერეთ სტატუსი"
                                    value={targetStatus}
                                    onChange={(e) => setTargetStatus(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* 2. Duration / Validity */}
                        <div className="space-y-3 pt-4">
                            <label className="text-sm font-medium text-slate-700 flex items-center">
                                <CalendarDays size={16} className="mr-2 text-slate-400" />
                                პაკეტის ვადა
                            </label>
                            <div className="flex space-x-4 mb-4">
                                <label className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${durationMode === 'unlimited' ? 'border-lime-500 bg-lime-50 text-slate-900' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}>
                                    <input 
                                        type="radio" 
                                        name="duration" 
                                        className="hidden" 
                                        checked={durationMode === 'unlimited'} 
                                        onChange={() => setDurationMode('unlimited')}
                                    />
                                    <span className="font-medium">ულიმიტო დროით</span>
                                </label>
                                <label className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${durationMode === 'limited' ? 'border-lime-500 bg-lime-50 text-slate-900' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}>
                                    <input 
                                        type="radio" 
                                        name="duration" 
                                        className="hidden" 
                                        checked={durationMode === 'limited'} 
                                        onChange={() => setDurationMode('limited')}
                                    />
                                    <span className="font-medium">ლიმიტირებული (თარიღებით)</span>
                                </label>
                            </div>
                            
                            {durationMode === 'limited' && (
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 animate-fadeIn">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-xs text-slate-500 font-medium ml-1">დასაწყისი</span>
                                            <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 outline-none focus:border-lime-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-slate-500 font-medium ml-1">დასასრული</span>
                                            <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 outline-none focus:border-lime-500" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. Hourly Constraints */}
                         <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-700 flex items-center">
                                <Clock size={16} className="mr-2 text-slate-400" />
                                საათობრივი დაშვება
                            </label>
                            
                            <div className="flex items-center space-x-6 mb-3">
                                <label className="flex items-center cursor-pointer group">
                                    <input 
                                        type="radio" 
                                        name="timeMode" 
                                        className="w-4 h-4 text-lime-600 focus:ring-lime-500 border-gray-300"
                                        checked={timeMode === 'full'}
                                        onChange={() => setTimeMode('full')}
                                    />
                                    <span className="ml-2 text-sm text-slate-600 group-hover:text-slate-900">სრული დღე (24სთ)</span>
                                </label>
                                <label className="flex items-center cursor-pointer group">
                                    <input 
                                        type="radio" 
                                        name="timeMode" 
                                        className="w-4 h-4 text-lime-600 focus:ring-lime-500 border-gray-300"
                                        checked={timeMode === 'custom'}
                                        onChange={() => setTimeMode('custom')}
                                    />
                                    <span className="ml-2 text-sm text-slate-600 group-hover:text-slate-900">საათების არჩევა</span>
                                </label>
                            </div>

                            {timeMode === 'custom' && (
                                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="flex-1">
                                        <span className="text-xs text-slate-500 block mb-1">დან</span>
                                        <input 
                                          type="time" 
                                          className="w-full px-3 py-2 rounded border border-slate-200 bg-white outline-none focus:border-lime-500"
                                          value={customStartTime}
                                          onChange={(e) => setCustomStartTime(e.target.value)}
                                        />
                                    </div>
                                    <span className="text-slate-300 mt-4">-</span>
                                    <div className="flex-1">
                                        <span className="text-xs text-slate-500 block mb-1">მდე</span>
                                        <input 
                                          type="time" 
                                          className="w-full px-3 py-2 rounded border border-slate-200 bg-white outline-none focus:border-lime-500"
                                          value={customEndTime}
                                          onChange={(e) => setCustomEndTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 4. Participant Limit & 5. Trainer */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-700 flex items-center">
                                    <Users size={16} className="mr-2 text-slate-400" />
                                    ხალხის რაოდენობა
                                </label>
                                <input 
                                    type="number" 
                                    placeholder="მაგ: 1 (ინდივიდუალური)" 
                                    min="1"
                                    value={maxParticipants}
                                    onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 1)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all font-medium"
                                />
                                <p className="text-xs text-slate-400">მიუთითეთ რამდენი ადამიანისთვისაა პაკეტი</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-700 flex items-center">
                                    <Dumbbell size={16} className="mr-2 text-slate-400" />
                                    ტრენერი (არასავალდებულო)
                                </label>
                                <select 
                                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all text-slate-700 font-medium"
                                  value={selectedTrainer}
                                  onChange={(e) => setSelectedTrainer(e.target.value)}
                                >
                                    <option value="">ტრენერის გარეშე</option>
                                    <option value="გიორგი მაისურაძე">გიორგი მაისურაძე</option>
                                    <option value="ნინო შენგელია">ნინო შენგელია</option>
                                    <option value="ლევან აბაშიძე">ლევან აბაშიძე</option>
                                </select>
                            </div>
                        </div>

                        {/* 6. Benefits Section */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-700 flex items-center justify-between">
                                <div className="flex items-center">
                                  <Gift size={16} className="mr-2 text-slate-400" />
                                  პაკეტის ბენეფიტები
                                </div>
                                <span className="text-xs text-slate-400 font-normal">არჩეული ბენეფიტები ჩაირთვება პაკეტში</span>
                            </label>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {benefitOptions.map((benefit) => {
                                  const isSelected = selectedBenefits.includes(benefit.id);
                                  return (
                                    <div 
                                      key={benefit.id}
                                      onClick={() => toggleBenefit(benefit.id)}
                                      className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                        isSelected 
                                          ? 'border-lime-500 bg-lime-50' 
                                          : 'border-slate-100 bg-white hover:border-slate-200'
                                      }`}
                                    >
                                      <div className="flex items-center space-x-2 mb-1">
                                        <span className="text-xl">{benefit.icon}</span>
                                        <span className={`text-sm font-bold ${isSelected ? 'text-lime-700' : 'text-slate-700'}`}>
                                          {benefit.name}
                                        </span>
                                      </div>
                                      
                                      {/* Selection Indicator */}
                                      {isSelected && (
                                        <div className="absolute top-2 right-2 text-lime-500">
                                          <CheckCircle size={14} fill="currentColor" className="text-white" />
                                        </div>
                                      )}

                                      {/* Logic Badge */}
                                      {isSelected && benefit.type === 'market' && (
                                        <div className="flex items-center text-[10px] text-amber-600 bg-amber-100 px-2 py-0.5 rounded mt-2 w-fit">
                                          <ShoppingBag size={10} className="mr-1" />
                                          <span>აკლდება მარაგს</span>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                        </div>

                     </form>
                </div>
            </div>

            {/* Sidebar Summary, Pricing & Gift Voucher */}
            <div className="lg:col-span-1 space-y-6">
                {/* 1. PRICING SECTION */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">ღირებულება</h3>
                    
                    <div className="space-y-4 mb-8">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">პაკეტის ფასი</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">₾</span>
                                <input 
                                    type="number" 
                                    placeholder="0.00"
                                    value={packagePrice}
                                    onChange={(e) => setPackagePrice(e.target.value)}
                                    className="w-full pl-10 pr-4 py-4 rounded-xl border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all font-bold text-2xl text-slate-800"
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                             <div className="flex justify-between text-sm">
                                 <span className="text-slate-500">დღგ (18%)</span>
                                 <span className="text-slate-700 font-medium">-</span>
                             </div>
                             {selectedBenefits.some(id => benefitOptions.find(b => b.id === id)?.type === 'market') && (
                                <div className="flex justify-between text-sm text-amber-600">
                                   <span className="flex items-center"><ShoppingBag size={12} className="mr-1"/> მარკეტი</span>
                                   <span className="font-medium text-xs">ავტომატური ჩამოჭრა</span>
                                </div>
                             )}
                             <div className="flex justify-between text-sm">
                                 <span className="text-slate-500">საკომისიო</span>
                                 <span className="text-slate-700 font-medium">0.00 ₾</span>
                             </div>
                        </div>
                    </div>

                    {/* 2. GIFT VOUCHER SECTION */}
                    <div className="mb-8 p-4 rounded-xl border-2 border-dashed border-indigo-100 bg-indigo-50/30">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <Gift size={20} className="text-indigo-500" />
                                <span className="font-bold text-slate-800">სასაჩუქრე ვაუჩერი</span>
                            </div>
                            <button 
                                onClick={() => setIsGiftVoucher(!isGiftVoucher)}
                                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isGiftVoucher ? 'bg-indigo-500' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all transform ${isGiftVoucher ? 'translate-x-7' : 'translate-x-1'}`}></div>
                            </button>
                        </div>

                        {isGiftVoucher && (
                            <div className="space-y-4 animate-fadeIn">
                                <div>
                                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">ადრესატი</label>
                                    <input 
                                        type="text" 
                                        value={recipientName}
                                        onChange={(e) => setRecipientName(e.target.value)}
                                        placeholder="ვისთვის არის საჩუქარი?"
                                        className="w-full px-3 py-2 rounded-lg border border-indigo-100 bg-white text-sm font-bold outline-none focus:border-indigo-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">მილოცვის ტექსტი</label>
                                    <textarea 
                                        value={giftMessage}
                                        onChange={(e) => setGiftMessage(e.target.value)}
                                        placeholder="ჩაწერეთ მილოცვა..."
                                        className="w-full px-3 py-2 rounded-lg border border-indigo-100 bg-white text-xs font-medium outline-none focus:border-indigo-400 h-20 resize-none"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <button 
                          onClick={handleCreatePackage}
                          className="w-full py-4 bg-lime-400 hover:bg-lime-500 text-slate-900 font-bold rounded-xl shadow-lg shadow-lime-500/20 transition-all active:scale-95 flex items-center justify-center space-x-2"
                        >
                            <Save size={20} />
                            <span>{isGiftVoucher ? 'ვაუჩერის გენერირება' : 'აქტივობის შექმნა'}</span>
                        </button>
                        <button 
                            onClick={() => setViewMode('LIST')}
                            className="w-full py-3 text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-medium rounded-xl transition-all"
                        >
                            გაუქმება
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* --- VOUCHER PREVIEW MODAL --- */}
        {showVoucherModal && createdVoucherData && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
                <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[90vh]">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <Gift size={20} className="text-indigo-600" />
                            <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">სასაჩუქრე ვაუჩერი მზად არის!</h3>
                        </div>
                        <button onClick={closeVoucherModal} className="text-slate-400 hover:text-red-500 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                        {/* VOUCHER CARD DESIGN */}
                        <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-[2rem] p-10 text-white shadow-2xl overflow-hidden border-8 border-indigo-400/20 mb-8">
                             {/* Decorative Background Icons */}
                             <Gift size={200} className="absolute -right-20 -bottom-20 text-white/5 transform -rotate-12" />
                             <QrCode size={120} className="absolute right-10 top-10 text-white/10" />
                             
                             <div className="relative z-10 space-y-12">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-lime-400 font-black text-3xl uppercase tracking-tighter">GIFT CARD</h4>
                                        <p className="text-indigo-300 font-bold uppercase text-[10px] tracking-widest mt-1">PIXL FITNESS & SPA</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-indigo-300 text-[10px] font-black uppercase tracking-widest">Voucher Code</p>
                                        <p className="font-mono font-bold text-xl">{createdVoucherData.code}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-indigo-300 text-[10px] font-black uppercase tracking-widest">პაკეტი / აქტივობა</p>
                                            <p className="text-2xl font-black text-white">{createdVoucherData.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-indigo-300 text-[10px] font-black uppercase tracking-widest">ადრესატი</p>
                                            <p className="text-xl font-bold text-lime-400">{createdVoucherData.recipient || 'ძვირფასო სტუმარო'}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                                        <p className="text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-2">მილოცვა</p>
                                        <p className="text-sm font-medium italic leading-relaxed text-slate-200">
                                            "{createdVoucherData.message || 'გილოცავთ! გისურვებთ ჯანმრთელობას და ენერგიულ დღეებს Pixl Fitness-თან ერთად.'}"
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end border-t border-white/10 pt-6">
                                    <div>
                                        <p className="text-indigo-300 text-[10px] font-black uppercase tracking-widest">ღირებულება</p>
                                        <p className="text-3xl font-black text-white">₾ {createdVoucherData.price}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-indigo-300 text-[10px] font-black uppercase tracking-widest">ვადა</p>
                                        <p className="font-bold">{createdVoucherData.durationMode === 'unlimited' ? 'ულიმიტო' : '6 თვე გააქტიურებიდან'}</p>
                                    </div>
                                </div>
                             </div>
                        </div>

                        <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-3">
                            <ShieldAlert size={20} className="text-amber-500 shrink-0" />
                            <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                <strong>ყურადღება:</strong> ვაუჩერის გაგზავნამდე დარწმუნდით, რომ ადრესატის მონაცემები სრულია. ვაუჩერის გამოყენება შესაძლებელია ერთჯერადადPixl Fitness-ის ნებისმიერ ფილიალში.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => { window.print(); }}
                            className="flex items-center justify-center space-x-2 py-4 bg-white border border-slate-200 text-slate-800 font-black rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                        >
                            <Printer size={18} />
                            <span className="uppercase text-xs tracking-widest">ამობეჭდვა</span>
                        </button>
                        <button 
                            onClick={() => { alert('ვაუჩერი წარმატებით გაეგზავნა ადრესატს!'); closeVoucherModal(); }}
                            className="flex items-center justify-center space-x-2 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-200"
                        >
                            <Send size={18} />
                            <span className="uppercase text-xs tracking-widest">მეილზე გაგზავნა</span>
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  }

  // --- RENDER ONE TIME VISIT MODE ---
  if (viewMode === 'ONETIME') {
    return (
      <div className="max-w-4xl mx-auto mt-6 animate-fadeIn pb-12">
        <button 
          onClick={() => setViewMode('LIST')}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">ბიბლიოთეკაში დაბრუნება</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-800">ერთჯერადი ვიზიტის გაცემა</h2>
              <p className="text-slate-500 text-sm mt-1">შეავსეთ ვიზიტორის მონაცემები</p>
            </div>
            <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center text-lime-600">
              <Ticket size={20} />
            </div>
          </div>

          <div className="p-8">
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              {/* Personal Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <User size={16} className="mr-2 text-slate-400" />
                    სახელი და გვარი
                  </label>
                  <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all font-medium" placeholder="მაგ: დავით ბერიძე" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <Phone size={16} className="mr-2 text-slate-400" />
                    მობილურის ნომერი
                  </label>
                  <input type="tel" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all font-medium" placeholder="555 00 00 00" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <FileText size={16} className="mr-2 text-slate-400" />
                    პირადი ნომერი
                  </label>
                  <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all font-medium" placeholder="01000000000" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <Mail size={16} className="mr-2 text-slate-400" />
                    ელ. ფოსტა
                  </label>
                  <input type="email" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all font-medium" placeholder="email@example.com" />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <MapPin size={16} className="mr-2 text-slate-400" />
                    მისამართი
                  </label>
                  <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all font-medium" placeholder="თბილისი, ჭავჭავაძის გამზ..." />
                </div>
              </div>

              <div className="h-px bg-slate-100 my-6"></div>

              {/* Visit Details Section */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">ვიზიტის დეტალები</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">ვიზიტის ტიპი / აქტივობა</label>
                    <div className="relative">
                      <select 
                        value={activity}
                        onChange={handleActivityChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none transition-all bg-white text-slate-700 appearance-none font-medium"
                      >
                        <option value="guest">სტუმარი (უფასო)</option>
                        <option value="workout">ვარჯიში</option>
                        <option value="box">ბოქსი</option>
                        <option value="yoga">იოგა</option>
                        <option value="zumba">ზუმბა</option>
                        <option value="pilates">პილატესი</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ArrowRight size={16} className="rotate-90" />
                      </div>
                    </div>
                    {isGuest && (
                      <p className="text-xs text-emerald-600 flex items-center mt-2 font-medium">
                        <CheckCircle size={14} className="mr-1" />
                        სტუმრის ვიზიტი უფასოა
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">გადასახდელი თანხა</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₾</span>
                      <input 
                        type="number" 
                        value={visitPrice}
                        onChange={(e) => setVisitPrice(e.target.value)}
                        disabled={isGuest}
                        className={`w-full pl-8 pr-4 py-3 rounded-lg border outline-none transition-all font-bold text-lg ${
                          isGuest 
                            ? 'bg-slate-50 border-slate-200 text-slate-400' 
                            : 'bg-white border-slate-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 text-slate-800'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-6 space-x-3">
                 <button 
                  type="button"
                  onClick={() => setViewMode('LIST')}
                  className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                 >
                    გაუქმება
                 </button>
                 <button 
                  type="button"
                  onClick={handleCreateOneTimeVisit}
                  className="flex items-center space-x-2 px-8 py-3 bg-lime-400 hover:bg-lime-500 text-slate-900 font-bold rounded-xl shadow-lg shadow-lime-500/20 transition-all active:scale-95"
                 >
                    <Save size={18} />
                    <span>ვიზიტის გაფორმება</span>
                 </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER LIST MODE ---
  return (
    <div className="space-y-6 relative animate-fadeIn">
      
      {/* Top Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => setViewMode('ONETIME')} 
            className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-lime-500 hover:shadow-lg transition-all duration-200 flex items-center group text-left"
          >
             <div className="bg-lime-50 text-lime-600 p-3 rounded-xl mr-4 group-hover:bg-lime-500 group-hover:text-white transition-colors">
                <Ticket size={24} />
             </div>
             <div>
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-lime-600 transition-colors">ერთჯერადი ვიზიტი</h3>
                <p className="text-xs text-slate-500 mt-1">სწრაფი საშვის გაცემა</p>
             </div>
             <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-lime-500">
                <Plus size={20} />
             </div>
          </button>

          <button 
            onClick={() => setViewMode('CREATE')} 
            className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-emerald-500 hover:shadow-lg transition-all duration-200 flex items-center group text-left"
          >
             <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl mr-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <CreditCard size={24} />
             </div>
             <div>
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-emerald-600 transition-colors">ახალი აქტივობა</h3>
                <p className="text-xs text-slate-500 mt-1">პაკეტის / აბონემენტის შექმნა</p>
             </div>
             <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500">
                <Plus size={20} />
             </div>
          </button>
      </div>

      <div className="flex justify-between items-center pt-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800">აქტივობის ბიბლიოთეკა</h2>
          <p className="text-slate-500 text-sm">აქტიური პაკეტების ჩამონათვალი და მართვა</p>
        </div>
        <div className="bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-medium">
            სულ: {packages.length} პაკეტი
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col relative group">
            {/* Promotion Badge */}
            {pkg.promotionTarget && pkg.promotionTarget !== 'none' && (
              <div className="absolute top-0 right-0 bg-lime-400 text-slate-900 text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl z-10 flex items-center space-x-1 shadow-md">
                <Megaphone size={12} />
                <span>
                  {pkg.promotionTarget === 'web' ? 'WEB PROMO' : 
                    pkg.promotionTarget === 'mobile' ? 'APP PROMO' : 'ALL PROMO'}
                </span>
              </div>
            )}

            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-lime-50 text-lime-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {pkg.durationMode === 'unlimited' ? 'ულიმიტო' : 'ლიმიტირებული'}
                </div>
                <div className="text-xl font-bold text-emerald-600">
                  ₾{pkg.price}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-2">{pkg.name}</h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                 {pkg.targetAge && pkg.targetAge !== 'ყველა' && (
                   <span className="flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-black uppercase">
                     <Users size={10} className="mr-1" /> {pkg.targetAge}
                   </span>
                 )}
                 {pkg.targetStatus && pkg.targetStatus !== 'ყველა' && (
                   <span className="flex items-center px-2 py-0.5 rounded bg-purple-50 text-purple-600 text-[10px] font-black uppercase">
                     <UserCheck size={10} className="mr-1" /> {pkg.targetStatus}
                   </span>
                 )}
              </div>

              {pkg.description && (
                <p className="text-slate-500 text-xs mb-4 line-clamp-2 italic">{pkg.description}</p>
              )}
              
              <div className="space-y-3 mt-4">
                <div className="flex items-center text-slate-500 text-sm">
                  <Clock size={16} className="mr-2 text-slate-400" />
                  <span>
                    {pkg.timeMode === 'full' 
                      ? '24 საათიანი დაშვება' 
                      : `${pkg.startTime || '??'} - ${pkg.endTime || '??'} საათობრივი`}
                  </span>
                </div>
                
                <div className="flex items-center text-slate-500 text-sm">
                  <User size={16} className="mr-2 text-slate-400" />
                  <span>
                    {pkg.maxParticipants > 1 
                      ? `ჯგუფი (${pkg.maxParticipants} წევრი)` 
                      : 'ინდივიდუალური'}
                  </span>
                </div>

                {pkg.trainer && (
                  <div className="flex items-center text-slate-500 text-sm">
                    <User size={16} className="mr-2 text-lime-600" />
                    <span>ტრენერი: {pkg.trainer}</span>
                  </div>
                )}
              </div>

              {pkg.benefits.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">ბენეფიტები</p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.benefits.map((b) => (
                      <span key={b} className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                        {['water', 'protein', 'vitamin'].includes(b) && (
                            <ShoppingBag size={10} className="mr-1 text-amber-500" />
                        )}
                        {getBenefitName(b)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs text-slate-400">ID: {pkg.id.slice(-6)}</span>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handlePromoteClick(pkg.id)}
                    className="text-sm font-medium text-slate-500 hover:text-lime-600 flex items-center transition-colors"
                    title="რეკლამირება"
                  >
                    <Megaphone size={18} />
                  </button>
                  <button className="text-sm font-medium text-lime-600 hover:text-lime-700">რედაქტირება</button>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Promotion Modal */}
      {promotingId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    <Megaphone size={20} className="mr-2 text-lime-600" />
                    პაკეტის რეკლამირება
                 </h3>
                 <button onClick={() => setPromotingId(null)} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                 </button>
              </div>
              
              <div className="p-6">
                 <p className="text-slate-500 text-sm mb-6">აირჩიეთ პლატფორმა, სადაც გსურთ რომ გამოჩნდეს ეს პაკეტი სარეკლამო/აქციის სახით.</p>
                 
                 <div className="space-y-3">
                    <button 
                      onClick={() => handleConfirmPromotion('web')}
                      className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-lime-500 hover:bg-lime-50 transition-all group"
                    >
                       <div className="flex items-center space-x-3">
                          <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-lime-200 text-slate-600 group-hover:text-lime-900">
                            <Globe size={20} />
                          </div>
                          <span className="font-medium text-slate-700 group-hover:text-slate-900">მხოლოდ ვებ-გვერდზე</span>
                       </div>
                       <CheckCircle size={18} className="text-transparent group-hover:text-lime-600" />
                    </button>

                    <button 
                      onClick={() => handleConfirmPromotion('mobile')}
                      className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-lime-500 hover:bg-lime-50 transition-all group"
                    >
                       <div className="flex items-center space-x-3">
                          <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-lime-200 text-slate-600 group-hover:text-lime-900">
                            <Smartphone size={20} />
                          </div>
                          <span className="font-medium text-slate-700 group-hover:text-slate-900">მობილურ აპლიკაციაში</span>
                       </div>
                        <CheckCircle size={18} className="text-transparent group-hover:text-lime-600" />
                    </button>

                    <button 
                      onClick={() => handleConfirmPromotion('both')}
                      className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-lime-500 hover:bg-lime-50 transition-all group"
                    >
                       <div className="flex items-center space-x-3">
                          <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-lime-200 text-slate-600 group-hover:text-lime-900">
                            <Megaphone size={20} />
                          </div>
                          <span className="font-medium text-slate-700 group-hover:text-slate-900">ყველა პლატფორმაზე (რეკომენდირებული)</span>
                       </div>
                        <CheckCircle size={18} className="text-transparent group-hover:text-lime-600" />
                    </button>

                    <button 
                      onClick={() => handleConfirmPromotion('none')}
                      className="w-full text-center py-3 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium mt-2"
                    >
                       რეკლამის გამორთვა
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PassLibraryView;