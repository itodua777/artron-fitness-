
'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserCheck,
  MapPin,
  Briefcase,
  Upload,
  ArrowLeft,
  ShieldCheck,
  Send,
  ArrowRight,
  Clock,
  Lock,
  ShieldAlert
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasGeneralManager, setHasGeneralManager] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [company, setCompany] = useState({
    name: '', identCode: '', legalAddress: '', actualAddress: '', directorName: '', directorId: '',
    directorPhone: '', directorEmail: '', activityField: '', brandName: '', logo: null as string | null,
    gmName: '', gmId: '', gmPhone: '', gmEmail: ''
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setCompany({ ...company, logo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSkip = () => {
    // For demo, just go to dashboard or similar
    router.push('/dashboard');
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissionGranted) {
      alert("გთხოვთ დაადასტუროთ რეგისტრაციის გაგრძელების ნებართვა.");
      return;
    }

    try {
      const payload = { ...company };
      // Map Director info to GM info if no separate GM is specified
      if (!hasGeneralManager) {
        payload.gmName = company.directorName;
        payload.gmEmail = company.directorEmail;
        payload.gmPhone = company.directorPhone;
        // gmId is not strictly required by schema but good to have consistency if needed, 
        // though schema only requires name/email for user creation usually.
        payload.gmId = company.directorId;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsPending(true); // Show pending state
      } else {
        const err = await response.json();
        alert('Registration failed: ' + (err.error || 'Unknown error'));
      }
    } catch (e) {
      console.error("Submission error", e);
      alert('Network error. Please try again.');
    }
  };

  // Pending Approval View
  if (isPending) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-10 font-sans">
        <div className="w-full max-w-3xl bg-[#161b22] p-16 rounded-[4rem] border border-slate-800 text-center space-y-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 rounded-full -translate-y-16 translate-x-16"></div>

          <div className="flex flex-col items-center space-y-6">
            <div className="w-24 h-24 bg-amber-400/10 rounded-[2.5rem] flex items-center justify-center text-amber-500 animate-pulse">
              <Clock size={48} strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">რეგისტრაცია წარმატებით <br /> <span className="text-amber-400">დასრულდა!</span></h2>
            <p className="text-slate-500 font-medium max-w-lg leading-relaxed">
              თქვენს მიერ მითითებულ ელ-ფოსტაზე გამოგზავნილია აქტივაციის ბმული და ერთჯერადი კოდი. გთხოვთ შეამოწმოთ მეილი.
            </p>
          </div>

          <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/5 rounded-2xl text-slate-400"><Lock size={20} /></div>
              <div className="text-left"><p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">სტატუსი</p><p className="text-lime-500 font-black uppercase text-xs tracking-tighter">ელოდება აქტივაციას</p></div>
            </div>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-10 py-4 bg-white text-slate-900 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-lime-400 transition-all active:scale-95"
            >
              ავტორიზაცია
            </button>
          </div>

          <div className="flex items-center justify-center space-x-3 text-[10px] font-black uppercase text-slate-600 tracking-widest">
            <ShieldAlert size={14} />
            <span>ჩვეულებრივ განხილვას სჭირდება 2-4 სამუშაო საათი</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-300 font-sans p-10 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-[#161b22] rounded-[3.5rem] shadow-2xl border border-slate-800 overflow-hidden animate-fadeIn">

        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-800 flex">
          <div className={`h-full bg-lime-400 transition-all duration-700 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`}></div>
        </div>

        <div className="p-12 md:p-16">
          <div className="flex justify-between items-center mb-12">
            <button onClick={() => router.push('/')} className="flex items-center text-slate-500 hover:text-white font-bold transition-all group">
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1" />
              უკან
            </button>
            <div className="text-right flex flex-col items-end">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">რეგისტრაცია</h2>
              <div className="flex items-center space-x-4 mt-1">
                <button onClick={handleSkip} className="text-[10px] text-lime-400 font-black uppercase tracking-widest hover:underline">გამოტოვება (დემო)</button>
                <span className="text-xs text-slate-500 font-black uppercase tracking-widest">|</span>
                <p className="text-xs text-slate-500 font-black uppercase tracking-widest">ნაბიჯი {step} / 3</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitRequest} className="space-y-12">

            {step === 1 && (
              <div className="animate-fadeIn space-y-10">
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="shrink-0 space-y-4 text-center">
                    <div
                      onClick={() => logoInputRef.current?.click()}
                      className="w-40 h-40 bg-slate-900 border-2 border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:border-lime-400 transition-all group relative overflow-hidden"
                    >
                      <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                      {company.logo ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={company.logo} alt="Logo" className="w-full h-full object-contain p-4" />
                      ) : (
                        <>
                          <Upload size={32} className="text-slate-700 group-hover:text-lime-400 transition-colors" />
                          <span className="text-[10px] font-black text-slate-600 mt-2 uppercase">ლოგო</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">ბრენდის იდენტობა</h3>
                  </div>
                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">ბრენდული დასახელება</label>
                        <input value={company.brandName} onChange={e => setCompany({ ...company, brandName: e.target.value })} placeholder="მაგ: PIXL Fitness" className="w-full px-5 py-4 bg-slate-900 border border-slate-800 rounded-2xl outline-none focus:border-lime-500 font-bold text-white transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">საქმიანობის სფერო</label>
                        <div className="relative">
                          <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl min-h-[56px] flex flex-wrap gap-2 p-2 focus-within:border-lime-500 transition-all">
                            {company.activityField.split(',').filter(Boolean).map((tag, index) => (
                              <span key={index} className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center">
                                {tag.trim()}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentTags = company.activityField.split(',').filter(Boolean).map(t => t.trim());
                                    const newTags = currentTags.filter((_, i) => i !== index);
                                    setCompany({ ...company, activityField: newTags.join(',') });
                                  }}
                                  className="ml-2 hover:text-red-400"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                              </span>
                            ))}
                            <input
                              className="bg-transparent outline-none flex-1 min-w-[120px] text-white font-bold p-2"
                              placeholder={company.activityField ? "" : "აირჩიეთ ან ჩაწერეთ..."}
                              onFocus={() => setIsDropdownOpen(true)}
                              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const val = e.currentTarget.value.trim();
                                  if (val) {
                                    const currentTags = company.activityField.split(',').filter(Boolean).map(t => t.trim());
                                    if (!currentTags.includes(val)) {
                                      setCompany({ ...company, activityField: [...currentTags, val].join(',') });
                                    }
                                    e.currentTarget.value = '';
                                  }
                                }
                              }}
                            />
                            <div className={`absolute top-full left-0 w-full bg-[#161b22] border border-slate-700 rounded-xl mt-2 p-2 shadow-xl z-50 grid grid-cols-1 gap-1 max-h-60 overflow-y-auto ${isDropdownOpen ? 'block' : 'hidden'}`}>
                              {[
                                'ფიტნეს დარბაზი', 'იოგა', 'ზუმბა და პილატესის კლუბი',
                                'ბოქსის კლუბი', 'საცურაო აუზი', 'ცეკვის სტუდია',
                                'საუნა და გამაჯანსაღებელი ცენტრი', 'სტადიონი',
                                'სპორტული გადამზადების ცენტრი', 'სპორტული კომპლექსი'
                              ].filter(option => !company.activityField.includes(option)).map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => {
                                    const currentTags = company.activityField.split(',').filter(Boolean).map(t => t.trim());
                                    setCompany({ ...company, activityField: [...currentTags, option].join(',') });
                                  }}
                                  className="text-left px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm font-bold transition-colors"
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1.5 ml-1">აირჩიეთ სიიდან ან ჩაწერეთ და დააჭირეთ Enter-ს</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-500 ml-1">კომპანიის სრული დასახელება</label>
                      <div className="relative">
                        <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" />
                        <input value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} className="w-full pl-12 pr-5 py-4 bg-slate-900 border border-slate-800 rounded-2xl outline-none focus:border-lime-500 font-bold text-white transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={() => setStep(2)} className="px-12 py-4 bg-white text-slate-900 font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-lime-400 transition-all shadow-xl active:scale-95 flex items-center">
                    შემდეგი <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fadeIn space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
                    <h3 className="text-sm font-black text-white flex items-center"><UserCheck size={18} className="mr-2 text-blue-500" /> დირექტორი</h3>
                    <div className="space-y-4">
                      <input value={company.directorName} onChange={e => setCompany({ ...company, directorName: e.target.value })} placeholder="სახელი გვარი" className="w-full px-5 py-3 bg-[#0d1117] border border-slate-800 rounded-xl outline-none font-bold" />
                      <input value={company.directorId} onChange={e => setCompany({ ...company, directorId: e.target.value })} placeholder="პირადი ნომერი" className="w-full px-5 py-3 bg-[#0d1117] border border-slate-800 rounded-xl outline-none font-bold" />
                      <input value={company.directorPhone} onChange={e => setCompany({ ...company, directorPhone: e.target.value })} placeholder="პირადი მობილური" className="w-full px-5 py-3 bg-[#0d1117] border border-slate-800 rounded-xl outline-none font-bold" />
                      <input value={company.directorEmail} onChange={e => setCompany({ ...company, directorEmail: e.target.value })} placeholder="პირადი მეილი" className="w-full px-5 py-3 bg-[#0d1117] border border-slate-800 rounded-xl outline-none font-bold" />
                    </div>
                  </div>
                  <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 space-y-6 text-left">
                    <h3 className="text-sm font-black text-white flex items-center"><MapPin size={18} className="mr-2 text-blue-500" /> ლოკაცია</h3>
                    <div className="space-y-4">
                      <input value={company.legalAddress} onChange={e => setCompany({ ...company, legalAddress: e.target.value })} placeholder="იურიდიული მისამართი" className="w-full px-5 py-3 bg-[#0d1117] border border-slate-800 rounded-xl outline-none font-bold" />
                      <input value={company.identCode} onChange={e => setCompany({ ...company, identCode: e.target.value })} placeholder="ს/კოდი" className="w-full px-5 py-3 bg-[#0d1117] border border-slate-800 rounded-xl outline-none font-mono font-bold" />
                    </div>
                  </div>
                  {/* General Manager Checkbox REMOVED as per request */}
                </div>

                {!hasGeneralManager && (
                  <div className="animate-fadeIn">
                    <div className="p-10 bg-slate-900 rounded-[3rem] border-2 border-slate-800 relative overflow-hidden group mb-10">
                      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center space-x-6">
                          <div className={`p-5 rounded-[2rem] transition-all duration-500 ${permissionGranted ? 'bg-lime-400 text-slate-900 shadow-lg shadow-lime-400/20' : 'bg-slate-800 text-slate-500'}`}>
                            <Send size={32} />
                          </div>
                          <div className="text-left">
                            <h3 className="text-xl font-black text-white tracking-tight">რეგისტრაციის გაგრძელების ნებართვა</h3>
                            <p className="text-sm text-slate-500 font-medium max-w-md mt-2 leading-relaxed">
                              დადასტურების ღილაკზე დაჭერით, თქვენი მონაცემები გადაეგზავნება ARTRON-ის მენეჯმენტს განსახილველად.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPermissionGranted(!permissionGranted)}
                          className={`px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${permissionGranted ? 'bg-lime-400 text-slate-900 shadow-2xl' : 'bg-slate-800 text-slate-500 border border-slate-700 hover:text-white'}`}
                        >
                          {permissionGranted ? 'მოთხოვნა გააქტიურებულია' : 'ნებართვის მიცემა'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <button type="button" onClick={() => setStep(1)} className="text-slate-500 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors">უკან დაბრუნება</button>
                  {hasGeneralManager ? (
                    <button type="button" onClick={() => setStep(3)} className="px-12 py-4 bg-white text-slate-900 font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-lime-400 transition-all shadow-xl active:scale-95 flex items-center">
                      შემდეგი <ArrowRight size={16} className="ml-2" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!permissionGranted}
                      className="px-16 py-5 bg-lime-400 text-slate-900 font-black rounded-[2.2rem] uppercase text-sm tracking-widest hover:scale-105 transition-all shadow-2xl shadow-lime-400/20 disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none"
                    >
                      რეგისტრაციის დასრულება
                    </button>
                  )}
                </div>
              </div>
            )}

            {step === 3 && hasGeneralManager && (
              <div className="animate-fadeIn space-y-10">
                <div className="p-8 bg-purple-500/5 border border-purple-500/20 rounded-[2.5rem] space-y-8">
                  <div className="flex items-center space-x-3 border-b border-purple-500/10 pb-6">
                    <div className="p-3 bg-purple-600 text-white rounded-2xl"><ShieldCheck size={24} /></div>
                    <div>
                      <h3 className="font-black text-white">პასუხისმგებელი პირი (მენეჯერი)</h3>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">ეს მომხმარებელი მიიღებს პანელზე სრულ წვდომას</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input value={company.gmName} onChange={e => setCompany({ ...company, gmName: e.target.value })} placeholder="მენეჯერის სახელი გვარი" className="w-full px-5 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl outline-none font-bold" />
                    <input value={company.gmId} onChange={e => setCompany({ ...company, gmId: e.target.value })} placeholder="პირადი ნომერი" className="w-full px-5 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl outline-none font-bold" />
                    <input value={company.gmPhone} onChange={e => setCompany({ ...company, gmPhone: e.target.value })} placeholder="მობილური" className="w-full px-5 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl outline-none font-bold" />
                    <input value={company.gmEmail} onChange={e => setCompany({ ...company, gmEmail: e.target.value })} placeholder="სამუშაო იმეილი" className="w-full px-5 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl outline-none font-bold" />
                  </div>
                </div>

                {/* Permission Control (Shared Logic) */}
                <div className="p-10 bg-slate-900 rounded-[3rem] border-2 border-slate-800 relative overflow-hidden group">
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center space-x-6">
                      <div className={`p-5 rounded-[2rem] transition-all duration-500 ${permissionGranted ? 'bg-lime-400 text-slate-900 shadow-lg shadow-lime-400/20' : 'bg-slate-800 text-slate-500'}`}>
                        <Send size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white tracking-tight">რეგისტრაციის გაგრძელების ნებართვა</h3>
                        <p className="text-sm text-slate-500 font-medium max-w-md mt-2 leading-relaxed">
                          დადასტურების ღილაკზე დაჭერით, თქვენი მონაცემები გადაეგზავნება ARTRON-ის მენეჯმენტს განსახილველად.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPermissionGranted(!permissionGranted)}
                      className={`px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${permissionGranted ? 'bg-lime-400 text-slate-900 shadow-2xl' : 'bg-slate-800 text-slate-500 border border-slate-700 hover:text-white'}`}
                    >
                      {permissionGranted ? 'მოთხოვნა გააქტიურებულია' : 'ნებართვის მიცემა'}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button type="button" onClick={() => setStep(2)} className="text-slate-500 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors">უკან დაბრუნება</button>
                  <button
                    type="submit"
                    disabled={!permissionGranted}
                    className="px-16 py-5 bg-lime-400 text-slate-900 font-black rounded-[2.2rem] uppercase text-sm tracking-widest hover:scale-105 transition-all shadow-2xl shadow-lime-400/20 disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none"
                  >
                    რეგისტრაციის დასრულება
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>
      </div >
    </div >
  );
};
