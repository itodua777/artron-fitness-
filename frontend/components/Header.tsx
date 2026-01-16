
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, LogIn, LogOut, ClipboardPen, Plus, Trash2, Clock, X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Mail, Settings, AlertCircle, Check } from 'lucide-react';
import { useLanguage } from '../app/contexts/LanguageContext';

interface HeaderProps {
    title?: string;
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

const Header: React.FC<HeaderProps> = ({ title = "Dashboard", tenantName }) => {
    const { t } = useLanguage();

    // Note Board State
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNoteText, setNewNoteText] = useState('');
    const [newNoteTime, setNewNoteTime] = useState('');

    // Config State
    const [brandName, setBrandName] = useState('კუნთის მასა BEEF');
    const [headerConfig, setHeaderConfig] = useState({
        showLogin: false,
        showBookmark: false,
        showSearch: false,
        showAlert: false
    });

    useEffect(() => {
        const loadConfig = () => {
            const savedConfig = localStorage.getItem('artron_header_config');
            if (savedConfig) setHeaderConfig(JSON.parse(savedConfig) || {});

            const savedProfile = localStorage.getItem('artron_company_profile');
            if (savedProfile) {
                try {
                    const parsed = JSON.parse(savedProfile);
                    if (parsed && parsed.brandName) setBrandName(parsed.brandName);
                } catch (e) {
                    // ignore
                }
            }
        };
        loadConfig();
        window.addEventListener('storage', loadConfig);
        return () => window.removeEventListener('storage', loadConfig);
    }, []);

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
        // ... more notification mocks
    ]);

    // Calendar State
    const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date()); // For navigation
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // For selection (YYYY-MM-DD)

    // Animation State
    const [isRinging, setIsRinging] = useState(false);
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from local storage");
            }
        }
    }, []);
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
        // Use toast or similar in real app
        console.log(`ტურნიკეტი გაიღო: ${action} დაფიქსირებულია.`);
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
                <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">ARTRON</h2>
                    {brandName && <span className="text-xl font-medium text-slate-500 uppercase tracking-tight">{brandName}</span>}
                </div>
                {tenantName && <span className="text-[10px] font-bold text-lime-600 uppercase tracking-widest leading-none">for {tenantName}</span>}
            </div>

            <div className="flex items-center space-x-6">

                {/* Manual Turnstile Controls */}
                {headerConfig.showLogin && (
                    <div className="hidden lg:flex items-center space-x-3 mr-4">
                        <button onClick={() => handleManualTrigger('ENTRY')} className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-600 font-bold text-xs rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-all active:scale-95 uppercase tracking-wide">
                            <LogIn size={16} /><span>{t('header.manual_entry')}</span>
                        </button>
                        <button onClick={() => handleManualTrigger('EXIT')} className="flex items-center space-x-2 px-4 py-2 bg-orange-50 text-orange-600 font-bold text-xs rounded-lg border border-orange-100 hover:bg-orange-100 transition-all active:scale-95 uppercase tracking-wide">
                            <LogOut size={16} /><span>{t('header.manual_exit')}</span>
                        </button>
                    </div>
                )}

                {/* Note Board Toggle */}
                {headerConfig.showBookmark && (
                    <div className="relative" ref={notePanelRef}>
                        <button onClick={() => { setIsNotesOpen(!isNotesOpen); setIsNotificationsOpen(false); }} className={`p-2 transition-colors ${isNotesOpen ? 'text-lime-600 bg-lime-50 rounded-lg' : 'text-slate-400 hover:text-lime-600'}`}>
                            <ClipboardPen size={20} />
                        </button>
                        {isNotesOpen && (
                            <div className="absolute right-0 top-12 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 animate-fadeIn origin-top-right overflow-hidden flex flex-col">
                                {/* Similar content to original note board */}
                                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                    <h3 className="font-bold text-slate-800 flex items-center"><ClipboardPen size={16} className="mr-2 text-lime-600" />{t('header.notes')}</h3>
                                    <button onClick={() => setIsNotesOpen(false)} className="text-slate-400 hover:text-red-500"><X size={18} /></button>
                                </div>

                                {/* Calendar in Note Board */}
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
                                            return (
                                                <button key={d} onClick={() => handleDateClick(d)} className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-all relative ${isSelected ? 'bg-lime-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
                                                    {d}{notes.some(n => n.date === dateStr) && !isSelected && <span className="absolute bottom-1 w-1 h-1 bg-lime-500 rounded-full"></span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50/50">
                                    <form onSubmit={handleAddNote} className="mb-2 space-y-2">
                                        <input type="text" placeholder="ჩანაწერი ამ დღისთვის..." value={newNoteText} onChange={(e) => setNewNoteText(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-lime-500 outline-none" />
                                        <div className="flex space-x-2">
                                            <div className="relative flex-1"><Clock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="time" value={newNoteTime} onChange={(e) => setNewNoteTime(e.target.value)} className="w-full pl-8 pr-2 py-2 rounded-lg border border-slate-200 text-sm focus:border-lime-500 outline-none text-slate-600" /></div>
                                            <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors flex items-center"><Plus size={16} /></button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {headerConfig.showSearch && (
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder={t('header.search')} className="pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-500 w-64 transition-all" />
                    </div>
                )}

                {/* Bell Icon */}
                {headerConfig.showAlert && (
                    <div className="relative" ref={notificationPanelRef}>
                        <button
                            onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsNotesOpen(false); }}
                            className={`relative p-2 transition-colors rounded-lg ${isNotificationsOpen ? 'text-lime-600 bg-lime-50' : 'text-slate-400 hover:text-lime-600'} ${isRinging ? 'animate-[wiggle_0.3s_ease-in-out_infinite]' : ''}`}
                        >
                            <Bell size={20} className={unreadCount > 0 ? 'fill-current' : ''} />
                            {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">{unreadCount}</span>}
                        </button>
                        {isNotificationsOpen && (
                            <div className="absolute right-0 top-12 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 animate-fadeIn origin-top-right overflow-hidden flex flex-col max-h-[80vh]">
                                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                    <h3 className="font-bold text-slate-800 flex items-center"><Bell size={16} className="mr-2 text-lime-600" />{t('header.Alerts')}</h3>
                                    <div className="flex space-x-2">
                                        <button onClick={markAllRead} className="text-[10px] font-bold text-lime-600 hover:text-lime-700 uppercase tracking-wider">{t('header.mark_all_read')}</button>
                                    </div>
                                </div>
                                <div className="overflow-y-auto p-2 space-y-2">
                                    {notifications.length === 0 ? (
                                        <div className="text-center py-8 text-slate-400 text-xs">შეტყობინებები არ არის</div>
                                    ) : (
                                        notifications.map(n => (
                                            <div key={n.id} className={`p-3 rounded-xl border transition-all relative group ${n.isRead ? 'bg-white border-slate-100' : 'bg-lime-50/10 border-lime-100 shadow-sm'}`}>
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${n.type === 'EMAIL' ? 'bg-blue-100 text-blue-600' : n.type === 'SYSTEM' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>{n.type}</span>
                                                    <span className="text-[10px] text-slate-400">{n.time}</span>
                                                </div>
                                                <h4 className={`text-xs font-bold mb-1 ${n.isRead ? 'text-slate-700' : 'text-slate-900'}`}>{n.subject}</h4>
                                                <p className="text-[11px] text-slate-500 leading-relaxed mb-2 line-clamp-2">{n.content}</p>
                                                <button onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }} className="absolute -top-1 -right-1 p-1 bg-white border border-slate-100 rounded-full text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center space-x-3 pl-6 border-l border-slate-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800">{user?.name || 'მომხმარებელი'}</p>
                        <p className="text-xs text-slate-500">{user?.role === 'DIRECTOR' ? 'დირექტორი' : user?.role || t('header.admin')}</p>
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
