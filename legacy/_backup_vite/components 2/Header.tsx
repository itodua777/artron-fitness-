
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, LogIn, LogOut, ClipboardPen, Plus, Trash2, Clock, X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Mail, Check, Settings, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  title: string;
  tenantName?: string;
}

interface Note {
  id: number;
  text: string;
  time: string;
  date: string; // YYYY-MM-DD
  reminded: boolean;
}

interface Notification {
  id: number;
  type: 'EMAIL' | 'SYSTEM' | 'ALERT';
  sender: string;
  subject: string;
  content: string;
  time: string;
  isRead: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, tenantName }) => {
  const { t } = useLanguage();

  // Note Board State
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteTime, setNewNoteTime] = useState('');

  // Notification State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'EMAIL',
      sender: 'sales@partner.ge',
      subject: 'ინვოისი #8822',
      content: 'გამარჯობა, გიგზავნით გასული თვის ინვენტარიზაციის ინვოისს.',
      time: '10 წუთის წინ',
      isRead: false
    },
    {
      id: 2,
      type: 'SYSTEM',
      sender: 'ARTRON System',
      subject: 'სარეზერვო ასლი',
      content: 'მონაცემთა ბაზის სარეზერვო ასლი წარმატებით შეიქმნა.',
      time: '1 საათის წინ',
      isRead: false
    },
    {
      id: 3,
      type: 'EMAIL',
      sender: 'hr@corporation.com',
      subject: 'ახალი CV',
      content: 'შემოსულია ახალი განაცხადი ფიტნეს ინსტრუქტორის პოზიციაზე.',
      time: '3 საათის წინ',
      isRead: true
    },
    {
      id: 4,
      type: 'ALERT',
      sender: 'Security Portal',
      subject: 'ავტორიზაცია',
      content: 'ახალი ავტორიზაცია დაფიქსირდა უცნობი მოწყობილობიდან.',
      time: '5 საათის წინ',
      isRead: true
    }
  ]);

  // Calendar State
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date()); // For navigation
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // For selection (YYYY-MM-DD)

  // Animation State
  const [isRinging, setIsRinging] = useState(false);
  const notePanelRef = useRef<HTMLDivElement>(null);
  const notificationPanelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (unreadCount > 0) {
      setIsRinging(true);
      const timer = setTimeout(() => setIsRinging(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  // Manual Turnstile Trigger
  const handleManualTrigger = (type: 'ENTRY' | 'EXIT') => {
    const action = type === 'ENTRY' ? 'შესვლა' : 'გასვლა';
    alert(`ტურნიკეტი გაიღო: ${action} დაფიქსირებულია.`);
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // --- Calendar Helpers ---
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentCalendarDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentCalendarDate(newDate);
  };

  const handleDateClick = (day: number) => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(formattedDate);
  };

  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ka-GE', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  // Add Note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText) return;
    const newNote: Note = { id: Date.now(), text: newNoteText, time: newNoteTime, date: selectedDate, reminded: false };
    setNotes([...notes, newNote]);
    setNewNoteText('');
    setNewNoteTime('');
  };

  // Delete Note
  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  // Check Time for Notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentDateStr = now.toISOString().split('T')[0];
      const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      setNotes(prevNotes => {
        let hasUpdates = false;
        const updatedNotes = prevNotes.map(note => {
          if (note.date === currentDateStr && note.time === currentTime && !note.reminded) {
            hasUpdates = true;
            setIsRinging(true);
            setTimeout(() => setIsRinging(false), 5000);
            return { ...note, reminded: true };
          }
          return note;
        });
        return hasUpdates ? updatedNotes : prevNotes;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Close panels when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notePanelRef.current && !notePanelRef.current.contains(event.target as Node)) {
        setIsNotesOpen(false);
      }
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);
  const monthNames = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოებმერი', 'დეკემბერი'];
  const weekDays = ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვი'];
  const filteredNotes = notes.filter(n => n.date === selectedDate);

  return (
    <header className="bg-white h-20 px-8 flex items-center justify-between border-b border-slate-100 sticky top-0 z-30">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        {tenantName && <span className="text-xs font-bold text-lime-600 uppercase tracking-widest leading-none mt-1">ARTRON for {tenantName}</span>}
      </div>

      <div className="flex items-center space-x-6">

        {/* Manual Turnstile Controls */}
        <div className="hidden lg:flex items-center space-x-3 mr-4">
          <button onClick={() => handleManualTrigger('ENTRY')} className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-600 font-bold text-xs rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-all active:scale-95 uppercase tracking-wide">
            <LogIn size={16} /><span>{t('header.manual_entry')}</span>
          </button>
          <button onClick={() => handleManualTrigger('EXIT')} className="flex items-center space-x-2 px-4 py-2 bg-orange-50 text-orange-600 font-bold text-xs rounded-lg border border-orange-100 hover:bg-orange-100 transition-all active:scale-95 uppercase tracking-wide">
            <LogOut size={16} /><span>{t('header.manual_exit')}</span>
          </button>
        </div>

        {/* Note Board Toggle */}
        <div className="relative" ref={notePanelRef}>
          <button onClick={() => { setIsNotesOpen(!isNotesOpen); setIsNotificationsOpen(false); }} className={`p-2 transition-colors ${isNotesOpen ? 'text-lime-600 bg-lime-50 rounded-lg' : 'text-slate-400 hover:text-lime-600'}`}>
            <ClipboardPen size={20} />
          </button>
          {isNotesOpen && (
            <div className="absolute right-0 top-12 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 animate-fadeIn origin-top-right overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center"><ClipboardPen size={16} className="mr-2 text-lime-600" />{t('header.notes')}</h3>
                <button onClick={() => setIsNotesOpen(false)} className="text-slate-400 hover:text-red-500"><X size={18} /></button>
              </div>
              <div className="p-4 border-b border-slate-100">
                <div className="flex justify-between items-center mb-3">
                  <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronLeft size={16} /></button>
                  <span className="font-bold text-sm text-slate-700">{monthNames[month]} {year}</span>
                  <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronRight size={16} /></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">{weekDays.map(d => <div key={d} className="text-[10px] text-slate-400 font-medium">{d}</div>)}</div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const d = i + 1;
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    const isSelected = selectedDate === dateStr;
                    const isToday = new Date().toISOString().split('T')[0] === dateStr;
                    return (
                      <button key={d} onClick={() => handleDateClick(d)} className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-all relative ${isSelected ? 'bg-lime-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'} ${isToday && !isSelected ? 'border border-lime-500 text-lime-600' : ''}`}>
                        {d}{notes.some(n => n.date === dateStr) && !isSelected && <span className="absolute bottom-1 w-1 h-1 bg-lime-500 rounded-full"></span>}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="p-4 bg-slate-50/50">
                <div className="flex items-center text-xs font-bold text-slate-500 uppercase mb-3"><CalendarIcon size={12} className="mr-1.5" />{formatDateLabel(selectedDate)}</div>
                <form onSubmit={handleAddNote} className="mb-2 space-y-2">
                  <input type="text" placeholder="ჩანაწერი ამ დღისთვის..." value={newNoteText} onChange={(e) => setNewNoteText(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-lime-500 outline-none" />
                  <div className="flex space-x-2">
                    <div className="relative flex-1"><Clock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="time" value={newNoteTime} onChange={(e) => setNewNoteTime(e.target.value)} className="w-full pl-8 pr-2 py-2 rounded-lg border border-slate-200 text-sm focus:border-lime-500 outline-none text-slate-600" /></div>
                    <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors flex items-center"><Plus size={16} /></button>
                  </div>
                </form>
              </div>
              <div className="flex-1 overflow-y-auto max-h-48 p-4 custom-scrollbar bg-white border-t border-slate-100">
                {filteredNotes.length > 0 ? (
                  <div className="space-y-2">{filteredNotes.map(note => (
                    <div key={note.id} className={`p-3 rounded-xl border flex justify-between items-start group animate-fadeIn ${note.reminded ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100 hover:border-lime-200 hover:shadow-sm'}`}>
                      <div><p className={`text-sm font-medium leading-snug ${note.reminded ? 'text-red-700' : 'text-slate-700'}`}>{note.text}</p>{note.time && <div className="flex items-center mt-1 text-xs text-slate-400"><Clock size={12} className="mr-1" />{note.time}{note.reminded && <span className="ml-2 font-bold text-red-500 uppercase">დასრულდა</span>}</div>}</div>
                      <button onClick={() => handleDeleteNote(note.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                    </div>
                  ))}</div>
                ) : <div className="text-center py-4 text-slate-400 text-xs">ამ თარიღზე ჩანაწერები არ არის</div>}
              </div>
            </div>
          )}
        </div>

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder={t('header.search')} className="pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 w-64 transition-all" />
        </div>

        {/* Bell Icon with Dropdown */}
        <div className="relative" ref={notificationPanelRef}>
          <button
            onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsNotesOpen(false); }}
            className={`relative p-2 transition-colors rounded-lg ${isNotificationsOpen ? 'text-lime-600 bg-lime-50' : 'text-slate-400 hover:text-lime-600'} ${isRinging ? 'animate-[wiggle_0.3s_ease-in-out_infinite]' : ''}`}
          >
            <Bell size={20} className={unreadCount > 0 ? 'fill-current' : ''} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 top-12 w-80 md:w-[400px] bg-white rounded-2xl shadow-xl border border-slate-200 z-50 animate-fadeIn origin-top-right overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Bell size={18} className="text-lime-600" />
                  <h3 className="font-bold text-slate-800">შეტყობინებები</h3>
                </div>
                <button
                  onClick={markAllRead}
                  className="text-[10px] font-black uppercase text-lime-600 hover:text-lime-700 bg-white border border-lime-100 px-2.5 py-1.5 rounded-lg shadow-sm active:scale-95 transition-all"
                >
                  ყველას წაკითხვა
                </button>
              </div>

              <div className="max-h-[450px] overflow-y-auto custom-scrollbar bg-white">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-slate-50">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-4 hover:bg-slate-50 transition-colors flex gap-4 group relative ${!n.isRead ? 'bg-lime-50/20' : ''}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'EMAIL' ? 'bg-blue-100 text-blue-600' :
                          n.type === 'SYSTEM' ? 'bg-lime-100 text-lime-600' : 'bg-red-100 text-red-600'
                          }`}>
                          {n.type === 'EMAIL' ? <Mail size={20} /> :
                            n.type === 'SYSTEM' ? <Settings size={20} /> : <AlertCircle size={20} />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-black uppercase text-slate-400 truncate pr-2">{n.sender}</span>
                            <span className="text-[9px] font-bold text-slate-300 whitespace-nowrap">{n.time}</span>
                          </div>
                          <h4 className={`text-sm font-bold truncate ${!n.isRead ? 'text-slate-900' : 'text-slate-600'}`}>{n.subject}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{n.content}</p>

                          <div className="mt-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-[10px] font-black uppercase text-lime-600 flex items-center hover:underline">
                              ნახვა <ChevronRight size={12} className="ml-1" />
                            </button>
                            <button
                              onClick={() => deleteNotification(n.id)}
                              className="text-slate-300 hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        {!n.isRead && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-lime-500 rounded-full group-hover:hidden"></div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                    <Check size={48} strokeWidth={1} className="mb-4 opacity-20" />
                    <p className="font-bold text-sm">ახალი შეტყობინებები არ არის</p>
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                <button className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">
                  ყველა შეტყობინების ნახვა
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3 pl-6 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">გიორგი ბერიძე</p>
            <p className="text-xs text-slate-500">{t('header.admin')}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
            <User size={20} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(15deg); }
        }
      `}</style>
    </header>
  );
};

export default Header;
