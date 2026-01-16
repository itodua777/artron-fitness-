
import React, { useState, useRef, useEffect } from 'react';
import {
   Save, X, User, Phone, Mail, MapPin, Calendar,
   FileText, Activity, Users, Info, Camera, ShieldAlert,
   ChevronRight, ArrowRight, UserCheck, HeartPulse,
   Smartphone, Upload, FileCheck, Baby, Trash2, Plus,
   RefreshCw, Fingerprint, Target, Sparkles, Building2,
   CheckCircle2
} from 'lucide-react';
import { CorporateClient } from '../types';

interface GroupMember {
   id: string;
   firstName: string;
   lastName: string;
   personalId: string;
   dob: string;
   age: number | null;
   gender: string;
   idCardFile: File | null;
   birthCertFile: File | null;
   healthCertFile: File | null;
   photo: string | null;
}

interface AddUserViewProps {
   corporateClients?: CorporateClient[];
   onSuccess?: () => void;
}

const AddUserView: React.FC<AddUserViewProps> = ({ corporateClients = [], onSuccess }) => {
   const [regType, setRegType] = useState<'INDIVIDUAL' | 'GROUP'>('INDIVIDUAL');
   const [groupType, setGroupType] = useState('Family');
   const [isHealthDeclared, setIsHealthDeclared] = useState(false);

   // Corporate linking state
   const [isCorporateUser, setIsCorporateUser] = useState(false);
   const [selectedCompanyId, setSelectedCompanyId] = useState('');

   // Group Members State
   const [groupSize, setGroupSize] = useState<number>(2);
   const [members, setMembers] = useState<GroupMember[]>([
      { id: '1', firstName: '', lastName: '', personalId: '', dob: '', age: null, gender: 'Male', idCardFile: null, birthCertFile: null, healthCertFile: null, photo: null },
      { id: '2', firstName: '', lastName: '', personalId: '', dob: '', age: null, gender: 'Male', idCardFile: null, birthCertFile: null, healthCertFile: null, photo: null },
   ]);

   // Shared contact info
   const [contactInfo, setContactInfo] = useState({
      phone: '',
      email: '',
      address: ''
   });

   // Sync group size with members array
   useEffect(() => {
      if (regType === 'GROUP') {
         if (members.length < groupSize) {
            const diff = groupSize - members.length;
            const newMembers = Array.from({ length: diff }).map((_, i) => ({
               id: (members.length + i + 1).toString(),
               firstName: '',
               lastName: '',
               personalId: '',
               dob: '',
               age: null,
               gender: 'Male',
               idCardFile: null,
               birthCertFile: null,
               healthCertFile: null,
               photo: null
            }));
            setMembers([...members, ...newMembers]);
         } else if (members.length > groupSize) {
            setMembers(members.slice(0, groupSize));
         }
      }
   }, [groupSize, regType]);

   const calculateAge = (dobString: string) => {
      if (!dobString) return null;
      const birthDate = new Date(dobString);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
         age--;
      }
      return age;
   };

   const handleMemberChange = (index: number, field: keyof GroupMember, value: any) => {
      const updatedMembers = [...members];
      updatedMembers[index] = { ...updatedMembers[index], [field]: value };

      if (field === 'dob') {
         updatedMembers[index].age = calculateAge(value);
      }

      setMembers(updatedMembers);
   };

   const selectedCompany = corporateClients.find(c => c.id === selectedCompanyId);

   const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

   const [loading, setLoading] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
         const payloadMembers = members.map(member => ({
            name: `${member.firstName} ${member.lastName}`,
            email: contactInfo.email || null, // Shared email for group for now, or could be individual if UI allowed
            phone: contactInfo.phone || null,
            personalId: member.personalId,
            address: contactInfo.address,
            status: 'Active',
            joinedDate: new Date().toLocaleDateString('ka-GE', { day: 'numeric', month: 'short', year: 'numeric' }),
            isCorporate: isCorporateUser,
            companyName: isCorporateUser ? selectedCompany?.name : null,
            photo: member.photo // Base64 string from camera or upload
         }));

         if (regType === 'INDIVIDUAL') {
            const response = await fetch('http://localhost:5001/api/members', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(payloadMembers[0])
            });

            if (response.ok) {
               if (onSuccess) onSuccess();
            } else {
               alert('Failed to add user');
            }
         } else {
            // GROUP REGISTRATION
            const response = await fetch('http://localhost:5001/api/members/batch', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                  members: payloadMembers,
                  groupType: groupType
               })
            });

            if (response.ok) {
               if (onSuccess) onSuccess();
            } else {
               const err = await response.json();
               alert('Group registration failed: ' + (err.error || 'Unknown error'));
            }
         }
      } catch (err) {
         console.error(err);
         alert('Error processing registration');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="max-w-screen-xl mx-auto animate-fadeIn bg-[#0d1117] min-h-screen -m-6 p-10 text-slate-300">
         <div className="bg-[#161b22] rounded-[3rem] shadow-2xl border border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="p-10 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center bg-slate-900/40 gap-6">
               <div className="space-y-1 text-center md:text-left">
                  <h2 className="text-3xl font-black text-white tracking-tight">ახალი მომხმარებლის რეგისტრაცია</h2>
                  <p className="text-slate-500 text-sm font-black uppercase tracking-widest">სისტემაში დამატება</p>
               </div>
               <div className="flex bg-[#0d1117] p-1.5 rounded-2xl border border-slate-800 shrink-0">
                  <button
                     onClick={() => setRegType('INDIVIDUAL')}
                     className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${regType === 'INDIVIDUAL' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                        }`}
                  >
                     <User size={14} strokeWidth={3} />
                     <span>ინდივიდუალური</span>
                  </button>
                  <button
                     onClick={() => {
                        setRegType('GROUP');
                        if (members.length === 0) setGroupSize(2);
                     }}
                     className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${regType === 'GROUP' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                        }`}
                  >
                     <Users size={14} strokeWidth={3} />
                     <span>ჯგუფი</span>
                  </button>
               </div>
            </div>

            <div className="p-12">
               {/* GROUP CONFIGURATION HEADER */}
               {regType === 'GROUP' && (
                  <div className="mb-12 p-8 bg-blue-500/5 border border-blue-500/20 rounded-[2.5rem] animate-fadeIn">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                           <h3 className="text-blue-400 text-sm font-black uppercase tracking-widest flex items-center">
                              <Users size={18} className="mr-2" /> ჯგუფის პარამეტრები
                           </h3>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-slate-500 ml-1">ჯგუფის ტიპი</label>
                                 <select value={groupType} onChange={e => setGroupType(e.target.value)} className="w-full px-4 py-3 bg-[#0d1117] border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-blue-500 transition-all">
                                    <option>ოჯახი (Family)</option>
                                    <option>წყვილი (Couple)</option>
                                    <option>მეგობრები (Friends)</option>
                                 </select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-slate-500 ml-1">წევრების რაოდენობა</label>
                                 <div className="flex items-center space-x-3 bg-[#0d1117] p-1 rounded-xl border border-slate-800">
                                    <button
                                       type="button"
                                       onClick={() => setGroupSize(Math.max(2, groupSize - 1))}
                                       className="w-10 h-10 flex items-center justify-center bg-slate-900 rounded-lg hover:bg-slate-800 transition-all text-white font-black"
                                    >-</button>
                                    <input
                                       type="number"
                                       value={groupSize}
                                       onChange={(e) => setGroupSize(Math.min(15, Math.max(2, parseInt(e.target.value) || 2)))}
                                       className="flex-1 bg-transparent text-center font-black text-white outline-none"
                                    />
                                    <button
                                       type="button"
                                       onClick={() => setGroupSize(Math.min(15, groupSize + 1))}
                                       className="w-10 h-10 flex items-center justify-center bg-slate-900 rounded-lg hover:bg-slate-800 transition-all text-white font-black"
                                    >+</button>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="hidden md:block p-6 bg-blue-500/10 rounded-2xl border border-blue-500/10">
                           <p className="text-xs text-blue-300 font-medium leading-relaxed">
                              ჯგუფური რეგისტრაციისას შეგიძლიათ განსაზღვროთ წევრების რაოდენობა (2-15). სისტემა ავტომატურად დააგენერირებს ფორმებს თითოეული წევრისთვის.
                           </p>
                        </div>
                     </div>
                  </div>
               )}

               <form className="space-y-16" onSubmit={handleSubmit}>
                  <div className={`grid grid-cols-1 ${regType === 'INDIVIDUAL' ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-12`}>

                     {/* MEMBER FORMS COLUMN */}
                     <div className={`${regType === 'INDIVIDUAL' ? '' : 'lg:col-span-8'} space-y-12`}>
                        {regType === 'INDIVIDUAL' ? (
                           <div className="animate-fadeIn space-y-12">
                              <MemberForm
                                 index={0}
                                 member={members[0]}
                                 onChange={(f, v) => handleMemberChange(0, f, v)}
                                 fileRefs={fileInputRefs}
                                 isIndividual={true}
                              />

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                 {/* Shared Contact Section Integrated for Individuals */}
                                 <div className="space-y-8 bg-slate-900/20 p-8 rounded-[2.5rem] border border-slate-800/50">
                                    <h3 className="text-blue-500 text-sm font-black uppercase tracking-[0.2em] flex items-center">
                                       <Phone size={18} className="mr-2" /> საკონტაქტო ინფორმაცია
                                    </h3>
                                    <div className="space-y-4">
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-1.5">
                                             <label className="text-[10px] font-black uppercase text-slate-500 ml-1">მობილური</label>
                                             <div className="relative">
                                                <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                   type="tel"
                                                   value={contactInfo.phone}
                                                   onChange={e => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                                   placeholder="+995..."
                                                   className="w-full pl-10 pr-4 py-3 bg-[#0d1117] border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-blue-500"
                                                />
                                             </div>
                                          </div>
                                          <div className="space-y-1.5">
                                             <label className="text-[10px] font-black uppercase text-slate-500 ml-1">იმეილი</label>
                                             <div className="relative">
                                                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                   type="email"
                                                   value={contactInfo.email}
                                                   onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })}
                                                   placeholder="@example.com"
                                                   className="w-full pl-10 pr-4 py-3 bg-[#0d1117] border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-blue-500"
                                                />
                                             </div>
                                          </div>
                                       </div>
                                       <div className="space-y-1.5">
                                          <label className="text-[10px] font-black uppercase text-slate-500 ml-1">მისამართი</label>
                                          <div className="relative">
                                             <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                             <input
                                                type="text"
                                                value={contactInfo.address}
                                                onChange={e => setContactInfo({ ...contactInfo, address: e.target.value })}
                                                placeholder="ქუჩა, ქალაქი..."
                                                className="w-full pl-10 pr-4 py-3 bg-[#0d1117] border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-blue-500"
                                             />
                                          </div>
                                       </div>
                                    </div>
                                 </div>

                                 {/* Profiling and Corporate Section */}
                                 <div className="space-y-8 bg-slate-900/20 p-8 rounded-[2.5rem] border border-slate-800/50">
                                    <h3 className="text-blue-500 text-sm font-black uppercase tracking-[0.2em] flex items-center">
                                       <Target size={18} className="mr-2" /> პროფილირება და ტიპი
                                    </h3>
                                    <div className="space-y-6">
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-1.5">
                                             <label className="text-[10px] font-black uppercase text-slate-500 ml-1">გამოცდილება</label>
                                             <select className="w-full px-4 py-3 bg-[#0d1117] border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-blue-500 appearance-none">
                                                <option>დამწყები (Beginner)</option>
                                                <option>საშუალო</option>
                                                <option>სპორტსმენი</option>
                                             </select>
                                          </div>
                                          <div className="space-y-1.5">
                                             <label className="text-[10px] font-black uppercase text-slate-500 ml-1">მთავარი მიზანი</label>
                                             <select className="w-full px-4 py-3 bg-[#0d1117] border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-blue-500 appearance-none">
                                                <option>ზოგადი (General)</option>
                                                <option>წონის კლება</option>
                                                <option>კუნთის მასა</option>
                                                <option>რეაბილიტაცია</option>
                                             </select>
                                          </div>
                                       </div>

                                       <div className="h-px bg-slate-800"></div>

                                       {/* NEW: Corporate Membership Integration */}
                                       <div className="p-6 bg-[#0d1117] border border-slate-800 rounded-[1.8rem] space-y-4">
                                          <div className="flex items-center justify-between">
                                             <div className="flex items-center space-x-3">
                                                <div className={`p-2 rounded-xl ${isCorporateUser ? 'bg-amber-400 text-slate-900' : 'bg-slate-800 text-slate-500'}`}>
                                                   <Building2 size={18} />
                                                </div>
                                                <div>
                                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">ტიპი</p>
                                                   <p className="text-sm font-black text-white">კორპორატიული წევრი</p>
                                                </div>
                                             </div>
                                             <button
                                                type="button"
                                                onClick={() => {
                                                   setIsCorporateUser(!isCorporateUser);
                                                   if (isCorporateUser) setSelectedCompanyId('');
                                                }}
                                                className={`w-12 h-6 rounded-full relative transition-all ${isCorporateUser ? 'bg-amber-400' : 'bg-slate-800'}`}
                                             >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all transform ${isCorporateUser ? 'translate-x-7' : 'translate-x-1'}`}></div>
                                             </button>
                                          </div>

                                          {isCorporateUser && (
                                             <div className="space-y-4 animate-fadeIn">
                                                <div className="space-y-1.5">
                                                   <label className="text-[10px] font-black uppercase text-slate-500 ml-1">აირჩიეთ კომპანია</label>
                                                   <select
                                                      value={selectedCompanyId}
                                                      onChange={e => setSelectedCompanyId(e.target.value)}
                                                      className="w-full px-4 py-3 bg-[#161b22] border border-slate-700 rounded-xl font-bold text-white outline-none focus:border-amber-400 appearance-none"
                                                   >
                                                      <option value="">აირჩიეთ სიიდან...</option>
                                                      {corporateClients.map(client => (
                                                         <option key={client.id} value={client.id}>{client.name}</option>
                                                      ))}
                                                   </select>
                                                </div>

                                                {selectedCompany && (
                                                   <div className="p-4 bg-amber-400/10 border border-amber-400/20 rounded-2xl flex items-center justify-between">
                                                      <div className="flex items-center space-x-3">
                                                         <CheckCircle2 size={18} className="text-amber-400" />
                                                         <div>
                                                            <p className="text-[9px] font-black text-amber-400/60 uppercase">სისტემური ვერიფიკაცია</p>
                                                            <p className="text-xs font-bold text-amber-100">{selectedCompany.name} - იდენტიფიცირებულია</p>
                                                         </div>
                                                      </div>
                                                      <div className="bg-amber-400 text-slate-900 px-2.5 py-1 rounded-lg font-black text-xs shadow-lg shadow-amber-400/20">
                                                         -{selectedCompany.discountPercentage}% ფასდაკლება
                                                      </div>
                                                   </div>
                                                )}
                                             </div>
                                          )}
                                       </div>

                                       <div className="p-4 bg-blue-500/5 rounded-2xl flex items-center justify-between">
                                          <span className="text-[10px] font-black text-blue-400 uppercase">ჯანმრთელობის დეკლარაცია</span>
                                          <button
                                             type="button"
                                             onClick={() => setIsHealthDeclared(!isHealthDeclared)}
                                             className={`w-10 h-5 rounded-full relative transition-all ${isHealthDeclared ? 'bg-blue-500' : 'bg-slate-700'}`}
                                          >
                                             <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all transform ${isHealthDeclared ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ) : (
                           members.map((member, idx) => (
                              <div key={member.id} className="animate-fadeIn relative">
                                 <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-600/30 rounded-full"></div>
                                 <div className="mb-6 flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-blue-600/20">
                                       {idx + 1}
                                    </div>
                                    <h3 className="text-white font-black text-lg uppercase tracking-tight">წევრი #{idx + 1}</h3>
                                 </div>
                                 <MemberForm
                                    index={idx}
                                    member={member}
                                    onChange={(f, v) => handleMemberChange(idx, f, v)}
                                    fileRefs={fileInputRefs}
                                 />
                              </div>
                           ))
                        )}
                     </div>

                     {/* SHARED SETTINGS COLUMN (ONLY FOR GROUP) */}
                     {regType === 'GROUP' && (
                        <div className="lg:col-span-4 space-y-12">
                           <div className="space-y-8 bg-slate-900/20 p-8 rounded-[2.5rem] border border-slate-800/50">
                              <h3 className="text-blue-500 text-sm font-black uppercase tracking-[0.2em] flex items-center">
                                 <Phone size={18} className="mr-2" /> საკონტაქტო პირი
                              </h3>
                              <div className="space-y-4">
                                 <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">მთავარი ტელეფონი</label>
                                    <div className="relative">
                                       <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                       <input
                                          type="tel"
                                          value={contactInfo.phone}
                                          onChange={e => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                          placeholder="+995..."
                                          className="w-full pl-10 pr-4 py-3 bg-[#0d1117] border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-blue-500"
                                       />
                                    </div>
                                 </div>
                                 <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">იმეილი</label>
                                    <div className="relative">
                                       <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                       <input
                                          type="email"
                                          value={contactInfo.email}
                                          onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })}
                                          placeholder="@example.com"
                                          className="w-full pl-10 pr-4 py-3 bg-[#0d1117] border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-blue-500"
                                       />
                                    </div>
                                 </div>
                                 <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">მისამართი</label>
                                    <div className="relative">
                                       <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                       <input
                                          type="text"
                                          value={contactInfo.address}
                                          onChange={e => setContactInfo({ ...contactInfo, address: e.target.value })}
                                          placeholder="ქუჩა, ქალაქი..."
                                          className="w-full pl-10 pr-4 py-3 bg-[#0d1117] border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-blue-500"
                                       />
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-8 bg-slate-900/20 p-8 rounded-[2.5rem] border border-slate-800/50">
                              <h3 className="text-blue-500 text-sm font-black uppercase tracking-[0.2em] flex items-center">
                                 <Activity size={18} className="mr-2" /> პროფილირება
                              </h3>
                              <div className="space-y-4">
                                 <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">გამოცდილება</label>
                                    <select className="w-full px-4 py-3 bg-[#0d1117] border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-blue-500 appearance-none">
                                       <option>დამწყები (Beginner)</option>
                                       <option>საშუალო</option>
                                       <option>სპორტსმენი</option>
                                    </select>
                                 </div>
                                 <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">მთავარი მიზანი</label>
                                    <select className="w-full px-4 py-3 bg-[#0d1117] border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-blue-500 appearance-none">
                                       <option>ზოგადი (General)</option>
                                       <option>წონის კლება</option>
                                       <option>კუნთის მასა</option>
                                       <option>რეაბილიტაცია</option>
                                    </select>
                                 </div>
                                 <div className="p-4 bg-slate-900/40 rounded-2xl flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">ჯანმრთელობის დეკლარაცია</span>
                                    <button
                                       type="button"
                                       onClick={() => setIsHealthDeclared(!isHealthDeclared)}
                                       className={`w-10 h-5 rounded-full relative transition-all ${isHealthDeclared ? 'bg-blue-500' : 'bg-slate-700'}`}
                                    >
                                       <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all transform ${isHealthDeclared ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                     <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                        <Sparkles size={14} className="text-lime-500" />
                        <span>ყველა მონაცემი დაცულია და ინახება უსაფრთხოდ</span>
                     </div>
                     <div className="flex items-center space-x-4 w-full md:w-auto">
                        <button
                           type="button"
                           onClick={() => window.location.reload()}
                           className="flex-1 md:flex-none px-10 py-4 text-slate-500 font-bold hover:text-white transition-colors"
                        >გაუქმება</button>
                        <button
                           type="button"
                           className="flex-1 md:flex-none flex items-center justify-center space-x-3 px-12 py-4 bg-[#10b981] hover:bg-[#059669] text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95 group"
                        >
                           <span>{regType === 'INDIVIDUAL' ? 'რეგისტრაციის დასრულება' : `ჯგუფის რეგისტრაცია (${groupSize} წევრი)`}</span>
                           <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                     </div>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

// Sub-component for individual member form sections with Photo/Camera support
const MemberForm = ({ index, member, onChange, fileRefs, isIndividual }: any) => {
   const isMinor = member.age !== null && member.age < 18;
   const [isCameraActive, setIsCameraActive] = useState(false);
   const videoRef = useRef<HTMLVideoElement>(null);
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const photoUploadRef = useRef<HTMLInputElement>(null);

   const startCamera = async () => {
      try {
         setIsCameraActive(true);
         const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 400, height: 400 } });
         if (videoRef.current) {
            videoRef.current.srcObject = stream;
         }
      } catch (err) {
         console.error("Error accessing camera:", err);
         alert("კამერასთან წვდომა ვერ მოხერხდა.");
         setIsCameraActive(false);
      }
   };

   const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
         const stream = videoRef.current.srcObject as MediaStream;
         stream.getTracks().forEach(track => track.stop());
         videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
   };

   const capturePhoto = () => {
      if (videoRef.current && canvasRef.current) {
         const video = videoRef.current;
         const canvas = canvasRef.current;
         const context = canvas.getContext('2d');
         if (context) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png');
            onChange('photo', dataUrl);
            stopCamera();
         }
      }
   };

   const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onload = (event) => {
            onChange('photo', event.target?.result as string);
         };
         reader.readAsDataURL(file);
      }
   };

   return (
      <div className="space-y-8 bg-slate-900/20 p-8 rounded-[2.5rem] border border-slate-800/50">
         <div className="flex gap-8 items-start">
            {/* Photo Section */}
            <div className="relative shrink-0">
               <div className="w-32 h-32 bg-[#0d1117] border-2 border-dashed border-slate-800 rounded-[2rem] flex items-center justify-center text-slate-600 overflow-hidden relative group">
                  {member.photo ? (
                     <>
                        <img src={member.photo} alt="Profile" className="w-full h-full object-cover" />
                        <button
                           type="button"
                           onClick={() => onChange('photo', null)}
                           className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        >
                           <RefreshCw size={24} />
                        </button>
                     </>
                  ) : isCameraActive ? (
                     <div className="w-full h-full">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-1 flex justify-center">
                           <button
                              type="button"
                              onClick={capturePhoto}
                              className="bg-lime-50 text-slate-900 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                           >
                              <Camera size={18} />
                           </button>
                        </div>
                     </div>
                  ) : (
                     <div className="flex flex-col items-center">
                        <Camera size={40} className="group-hover:text-blue-500 transition-colors" />
                        <span className="text-[8px] font-black uppercase text-slate-500 mt-2">სურათი</span>
                     </div>
                  )}
               </div>

               {/* Interaction Controls */}
               {!member.photo && !isCameraActive && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 animate-fadeIn">
                     <button
                        type="button"
                        onClick={startCamera}
                        className="bg-slate-800 text-white p-2 rounded-xl border border-slate-700 shadow-xl hover:bg-blue-600 transition-colors"
                        title="კამერით გადაღება"
                     >
                        <Camera size={14} />
                     </button>
                     <button
                        type="button"
                        onClick={() => photoUploadRef.current?.click()}
                        className="bg-slate-800 text-white p-2 rounded-xl border border-slate-700 shadow-xl hover:bg-emerald-600 transition-colors"
                        title="ფაილის ატვირთვა"
                     >
                        <Upload size={14} />
                     </button>
                     <input
                        type="file"
                        ref={photoUploadRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                     />
                  </div>
               )}

               {isCameraActive && (
                  <button
                     type="button"
                     onClick={stopCamera}
                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                  >
                     <X size={12} />
                  </button>
               )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">სახელი</label>
                  <input
                     type="text"
                     value={member.firstName}
                     onChange={e => onChange('firstName', e.target.value)}
                     placeholder="მაგ: გიორგი"
                     className="w-full px-5 py-3 bg-[#0d1117] border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-blue-500 transition-all"
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">გვარი</label>
                  <input
                     type="text"
                     value={member.lastName}
                     onChange={e => onChange('lastName', e.target.value)}
                     placeholder="მაგ: ბერიძე"
                     className="w-full px-5 py-3 bg-[#0d1117] border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-blue-500 transition-all"
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">პირადი ნომერი</label>
                  <div className="relative">
                     <Fingerprint size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                     <input
                        type="text"
                        value={member.personalId}
                        onChange={e => onChange('personalId', e.target.value)}
                        placeholder="11 ციფრი"
                        className="w-full pl-11 pr-4 py-3 bg-[#0d1117] border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-blue-500 transition-all"
                     />
                  </div>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase text-slate-500 ml-1 flex justify-between">
                  <span>დაბადების თარიღი</span>
                  {member.age !== null && <span className={`px-2 rounded text-[9px] font-black ${isMinor ? 'bg-orange-500 text-white' : 'bg-blue-500/20 text-blue-400'}`}>{member.age} წლის</span>}
               </label>
               <div className="relative">
                  <input
                     type="date"
                     value={member.dob}
                     onChange={e => onChange('dob', e.target.value)}
                     className="w-full pl-5 pr-10 py-3 bg-[#0d1117] border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-blue-500 transition-all appearance-none"
                  />
                  <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
               </div>
            </div>
            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase text-slate-500 ml-1">სქესი</label>
               <select
                  value={member.gender}
                  onChange={e => onChange('gender', e.target.value)}
                  className="w-full px-5 py-3 bg-[#0d1117] border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-blue-500 appearance-none"
               >
                  <option value="Male">მამრობითი</option>
                  <option value="Female">მდედრობითი</option>
               </select>
            </div>
            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase text-slate-500 ml-1">ID ბარათი / პასპორტი</label>
               <input
                  type="file"
                  ref={el => { if (el) fileRefs.current[`id-${member.id}`] = el; }}
                  className="hidden"
                  onChange={(e) => onChange('idCardFile', e.target.files?.[0] || null)}
               />
               <button
                  type="button"
                  onClick={() => fileRefs.current[`id-${member.id}`]?.click()}
                  className={`w-full py-3 border-2 border-dashed rounded-xl flex items-center justify-center space-x-2 text-xs font-black uppercase transition-all ${member.idCardFile ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' : 'border-slate-800 text-slate-500 hover:border-blue-500 hover:text-blue-400'}`}
               >
                  {member.idCardFile ? <FileCheck size={16} /> : <Smartphone size={16} />}
                  <span>{member.idCardFile ? 'ატვირთულია' : 'ატვირთვა'}</span>
               </button>
            </div>
            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase text-slate-500 ml-1">ჯანმრთელობის ცნობა</label>
               <input
                  type="file"
                  ref={el => { if (el) fileRefs.current[`health-${member.id}`] = el; }}
                  className="hidden"
                  onChange={(e) => onChange('healthCertFile', e.target.files?.[0] || null)}
               />
               <button
                  type="button"
                  onClick={() => fileRefs.current[`health-${member.id}`]?.click()}
                  className={`w-full py-3 border-2 border-dashed rounded-xl flex items-center justify-center space-x-2 text-xs font-black uppercase transition-all ${member.healthCertFile ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' : 'border-slate-800 text-slate-500 hover:border-blue-500 hover:text-blue-400'}`}
               >
                  {member.healthCertFile ? <FileCheck size={16} /> : <HeartPulse size={16} />}
                  <span>{member.healthCertFile ? 'ატვირთულია' : 'ატვირთვა'}</span>
               </button>
            </div>
         </div>

         {isMinor && (
            <div className="p-6 bg-orange-500/5 border border-orange-500/20 rounded-3xl space-y-4 animate-fadeIn">
               <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center">
                     <ShieldAlert size={14} className="mr-2" /> არასრულწლოვანის დამატებითი საბუთი
                  </h4>
               </div>
               <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-1">
                     <label className="text-[9px] font-black text-slate-500 uppercase ml-1">დაბადების მოწმობა</label>
                     <input
                        type="file"
                        ref={el => { if (el) fileRefs.current[`birth-${member.id}`] = el; }}
                        className="hidden"
                        onChange={(e) => onChange('birthCertFile', e.target.files?.[0] || null)}
                     />
                     <button
                        type="button"
                        onClick={() => fileRefs.current[`birth-${member.id}`]?.click()}
                        className={`w-full py-3 border-2 border-dashed rounded-xl flex items-center justify-center space-x-2 text-xs font-black uppercase transition-all ${member.birthCertFile ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' : 'border-orange-500/30 text-orange-400 hover:border-orange-500'}`}
                     >
                        {member.birthCertFile ? <FileCheck size={16} /> : <Baby size={16} />}
                        <span>{member.birthCertFile ? 'ატვირთულია' : 'დაბადების მოწმობის ატვირთვა'}</span>
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default AddUserView;
