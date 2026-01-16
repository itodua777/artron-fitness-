
import React, { useState } from 'react';
import { Ticket, CreditCard, Plus, ArrowRight, ArrowLeft, Save, User, Phone, MapPin, Mail, FileText, CheckCircle, Calendar, Clock, Users, Dumbbell, Tag, CalendarDays, Gift, ShoppingBag, UserCheck } from 'lucide-react';
import { Package } from '../types';

interface PassesViewProps {
  onSavePackage?: (pkg: Package) => void;
}

const PassesView: React.FC<PassesViewProps> = ({ onSavePackage }) => {
  const [viewMode, setViewMode] = useState<'MENU' | 'ONETIME_FORM' | 'PACKAGE_FORM'>('MENU');

  // State for One Time Pass
  const [activity, setActivity] = useState<string>('workout');
  const [visitPrice, setVisitPrice] = useState<string>('20');

  // State for Package Formation
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

  const handleActivityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setActivity(value);
    if (value === 'guest') {
      setVisitPrice('0');
    } else {
      if (visitPrice === '0') setVisitPrice('20');
    }
  };

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

  const toggleBenefit = (id: string) => {
    if (selectedBenefits.includes(id)) {
      setSelectedBenefits(selectedBenefits.filter(item => item !== id));
    } else {
      setSelectedBenefits([...selectedBenefits, id]);
    }
  };

  const handleCreatePackage = async () => {
    // Basic validation
    if (!packageName) {
      alert('გთხოვთ მიუთითოთ აქტივობის სახელი');
      return;
    }

    const newPackage = {
      title: packageName,
      description: packageDescription || '',
      price: packagePrice || '0',
      duration: durationMode === 'unlimited' ? 365 : 30, // Default logic simplification for demo
      features: selectedBenefits.join(',')
    };

    try {
      const response = await fetch('http://localhost:5001/api/passes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPackage)
      });

      if (response.ok) {
        const savedPass = await response.json();
        // Map back to frontend Package type if needed, or trigger refresh
        alert('აქტივობა წარმატებით დაემატა ბიბლიოთეკაში!');
        setViewMode('MENU');
        // Reset form
        setPackageName('');
        setPackageDescription('');
        setTargetAge('ყველა');
        setTargetStatus('ყველა');
        setPackagePrice('');
        setSelectedBenefits([]);

        // Notify parent if needed (optional finding)
        // if (onSavePackage) onSavePackage(savedPass); 
      } else {
        alert('შეცდომა აქტივობის დამატებისას');
      }
    } catch (error) {
      console.error('Error creating package:', error);
      alert('სერვერთან დაკავშირების შეცდომა');
    }
  };

  const handleOneTimeSubmit = () => {
    alert('ვიზიტი წარმატებით გაფორმდა!');
    setViewMode('MENU');
  };

  // --- RENDER: One Time Visit Form ---
  if (viewMode === 'ONETIME_FORM') {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <button
          onClick={() => setViewMode('MENU')}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">უკან დაბრუნება</span>
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
              <div className="space-y-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">ვიზიტის დეტალები</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-6">
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
                          className={`w-full pl-8 pr-4 py-3 rounded-lg border outline-none transition-all font-bold text-lg ${isGuest
                              ? 'bg-slate-50 border-slate-200 text-slate-400'
                              : 'bg-white border-slate-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 text-slate-800'
                            }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => setViewMode('MENU')}
                  className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                >
                  გაუქმება
                </button>
                <button
                  type="button"
                  onClick={handleOneTimeSubmit}
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

  // --- RENDER: Package Formation Form ---
  if (viewMode === 'PACKAGE_FORM') {
    return (
      <div className="max-w-5xl mx-auto mt-6">
        <button
          onClick={() => setViewMode('MENU')}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">უკან დაბრუნება</span>
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

                {/* Target Age and Status Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700 flex items-center">
                      <Users size={16} className="mr-2 text-slate-400" />
                      ასაკობრივი კატეგორია
                    </label>
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
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700 flex items-center">
                      <UserCheck size={16} className="mr-2 text-slate-400" />
                      მიზნობრივი სტატუსი
                    </label>
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
                  </div>
                </div>

                {/* 2. Duration / Validity */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <CalendarDays size={16} className="mr-2 text-slate-400" />
                    2. პაკეტის ვადა
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
                    3. საათობრივი დაშვება
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
                      4. ხალხის რაოდენობა
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
                      5. ტრენერი (არასავალდებულო)
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
                      6. პაკეტის ბენეფიტები
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
                          className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all ${isSelected
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

          {/* Sidebar Summary & Pricing */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">7. ღირებულება</h3>

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
                      <span className="flex items-center"><ShoppingBag size={12} className="mr-1" /> მარკეტი</span>
                      <span className="font-medium text-xs">ავტომატური ჩამოჭრა</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">საკომისიო</span>
                    <span className="text-slate-700 font-medium">0.00 ₾</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCreatePackage}
                  className="w-full py-4 bg-lime-400 hover:bg-lime-500 text-slate-900 font-bold rounded-xl shadow-lg shadow-lime-500/20 transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                  <Save size={20} />
                  <span>აქტივობის შექმნა</span>
                </button>
                <button
                  onClick={() => setViewMode('MENU')}
                  className="w-full py-3 text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-medium rounded-xl transition-all"
                >
                  გაუქმება
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: Main Menu ---
  return (
    <div className="max-w-5xl mx-auto mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* One-time Visit Button */}
        <button
          onClick={() => setViewMode('ONETIME_FORM')}
          className="group relative bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-lime-200 transition-all duration-300 text-left overflow-hidden"
        >
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-lime-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
          <div className="absolute right-8 top-8 opacity-10 group-hover:opacity-20 transition-opacity z-0">
            <Ticket size={100} className="text-lime-600" />
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center text-lime-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Ticket size={32} />
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-lime-600 transition-colors">ერთჯერადი ვიზიტი</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-xs">
              სწრაფი საშვის გენერირება დღიური ვიზიტორებისთვის. QR კოდის ან დროებითი ID-ის გაცემა.
            </p>

            <div className="flex items-center text-lime-600 font-bold text-sm bg-lime-50 w-fit px-4 py-2 rounded-lg group-hover:bg-lime-400 group-hover:text-slate-900 transition-all">
              <span>ვიზიტის დამატება</span>
              <Plus size={18} className="ml-2 group-hover:rotate-90 transition-transform duration-300" />
            </div>
          </div>
        </button>

        {/* Subscription/Package Button */}
        <button
          onClick={() => setViewMode('PACKAGE_FORM')}
          className="group relative bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 text-left overflow-hidden"
        >
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
          <div className="absolute right-8 top-8 opacity-10 group-hover:opacity-20 transition-opacity z-0">
            <CreditCard size={100} className="text-emerald-600" />
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <CreditCard size={32} />
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-emerald-700 transition-colors">აქტივობის შექმნა</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-xs">
              ახალი აბონემენტის რეგისტრაცია, პაკეტის არჩევა და მომხმარებელზე მიბმა.
            </p>

            <div className="flex items-center text-emerald-600 font-bold text-sm bg-emerald-50 w-fit px-4 py-2 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <span>აქტივობის შექმნა</span>
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PassesView;
