
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { View, Package, User, CorporateClient } from './types';
import DashboardView from './pages/DashboardView';
import UserListView from './pages/UserListView';
import AddUserView from './pages/AddUserView';
import MarketView from './pages/MarketView';
import AccessoriesView from './pages/AccessoriesView';
import PassesView from './pages/PassesView';
import PassLibraryView from './pages/PassLibraryView';
import UserDetailView from './pages/UserDetailView';
import StatisticsView from './pages/StatisticsView';
import GeneralView from './pages/GeneralView';
import EmployeesView from './pages/EmployeesView';
import AccountingView from './pages/AccountingView';
import CorporateView from './pages/CorporateView';
import MessagesView from './pages/MessagesView';
import PromotionsView from './pages/PromotionsView';
import LandingPageView from './pages/LandingPageView';
import OnboardingView from './pages/OnboardingView';
import LoginView from './pages/LoginView';
import { useLanguage } from './contexts/LanguageContext';
import { ShieldCheck, Clock, CheckCircle2, Lock, ArrowRight, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  const { t } = useLanguage();

  // App State Logic
  const [appState, setAppState] = useState<'LANDING' | 'ONBOARDING' | 'PENDING_APPROVAL' | 'DASHBOARD' | 'LOGIN'>('LANDING');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false); // For simulate approval

  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [msgNavState, setMsgNavState] = useState<{ tab: string, initialText?: string } | null>(null);

  // States maintained for dashboard content
  const [corporateClients, setCorporateClients] = useState<CorporateClient[]>([
    { id: '1', name: 'საქართველოს ბანკი', identCode: '204378869', discountPercentage: 20, contactPerson: 'ნინო ნინოშვილი', phone: '599 00 00 00', activeEmployees: 1450 },
    { id: '2', name: 'თიბისი ბანკი', identCode: '204395896', discountPercentage: 15, contactPerson: 'გიორგი მაისურაძე', phone: '599 11 11 11', activeEmployees: 1200 },
  ]);

  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Fetch Users
  const fetchUsers = () => {
    fetch('http://localhost:5001/api/members')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Failed to fetch members:", err));
  };

  // Simulate fetching current user (admin) to get Tenant Name
  // In real app this comes from Auth Context or /me endpoint
  useEffect(() => {
    // START SIMULATION
    // We assume user logged in and we have a token, or we are simulating the session
    // For demo purposes, we will fetch the FIRST tenant via a special hack or just hardcode for now if no auth logic exists fully
    // Better: Let's fetch the list of tenants and pick one to simulate "Login"

    fetch('http://localhost:5001/api/tenants')
      .then(res => res.json())
      .then(tenants => {
        if (tenants && tenants.length > 0) {
          const currentTenant = tenants[0]; // Default to first one (Pixl Fitness)
          setCurrentUser({
            id: 999,
            name: 'Admin User',
            email: 'admin@artron.ge',
            status: 'Active',
            personalId: '00000000000',
            phone: '',
            address: '',
            joinedDate: '',
            tenantName: currentTenant.name,
            tenantId: currentTenant.id
          });
          document.title = `ARTRON - ${currentTenant.name}`;
        }
      })
      .catch(err => console.error("Failed to fetch tenants for simulation", err));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOnboardingSubmit = async (data: any) => {
    try {
      const response = await fetch('http://localhost:5001/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setAppState('PENDING_APPROVAL');
      } else {
        const err = await response.json();
        alert('Registration failed: ' + (err.error || 'Unknown error'));
      }
    } catch (e) {
      console.error("Submission error", e);
      alert('Network error. Please try again.');
    }
  };

  const handleManagementApproval = () => {
    setAppState('DASHBOARD');
  };

  const handleSavePackage = (newPackage: Package) => setPackages(prev => [newPackage, ...prev]);
  const handlePromotePackage = (id: string, target: any) => setPackages(prev => prev.map(pkg => pkg.id === id ? { ...pkg, promotionTarget: target } : pkg));
  const handleAddCorporateClient = (client: CorporateClient) => setCorporateClients(prev => [...prev, client]);
  const handleUserClick = (user: User) => setSelectedUser(user);
  const handleBackToDashboard = () => setSelectedUser(null);
  const handleDashboardComm = (userName: string) => { setMsgNavState({ tab: 'COMPOSE', initialText: `გამარჯობა ${userName}...` }); setCurrentView(View.MESSAGES); };
  const handleAssignPackage = (userId: number, pkgId: string) => { /* Logic */ };

  const getTitle = () => {
    if (currentView === View.PASS_LIBRARY) return t('title.library');
    const key = `title.${currentView.toLowerCase()}`;
    return t(key);
  };

  // --- MAIN APP LOGIC RENDERING ---

  if (appState === 'LANDING') {
    return <LandingPageView onStartRegistration={() => setAppState('ONBOARDING')} onLoginClick={() => setAppState('LOGIN')} />;
  }

  if (appState === 'LOGIN') {
    return <LoginView onLoginSuccess={() => setAppState('DASHBOARD')} onBack={() => setAppState('LANDING')} />;
  }

  if (appState === 'ONBOARDING') {
    return <OnboardingView onBack={() => setAppState('LANDING')} onSubmit={handleOnboardingSubmit} onSkip={() => setAppState('DASHBOARD')} />;
  }

  if (appState === 'PENDING_APPROVAL') {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-10 font-sans">
        <div className="w-full max-w-3xl bg-[#161b22] p-16 rounded-[4rem] border border-slate-800 text-center space-y-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full -translate-y-16 translate-x-16"></div>

          <div className="flex flex-col items-center space-y-6">
            <div className="w-24 h-24 bg-amber-400/10 rounded-[2.5rem] flex items-center justify-center text-amber-500 animate-pulse">
              <Clock size={48} strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">თქვენი რეგისტრაცია <br /> <span className="text-amber-400">განხილვის პროცესშია.</span></h2>
            <p className="text-slate-500 font-medium max-w-lg leading-relaxed">
              ARTRON-ის მენეჯმენტი ამოწმებს კომპანიის მონაცემებს. დადასტურების შემდეგ თქვენს იმეილზე მიიღებთ ავტორიზაციის დეტალებს და სამართავი პანელი გააქტიურდება.
            </p>
          </div>

          <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/5 rounded-2xl text-slate-400"><Lock size={20} /></div>
              <div className="text-left"><p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">მიმდინარე სტატუსი</p><p className="text-amber-500 font-black uppercase text-xs tracking-tighter">მოლოდინის რეჟიმი</p></div>
            </div>
            <button
              onClick={handleManagementApproval}
              className="px-10 py-4 bg-white text-slate-900 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-lime-400 transition-all active:scale-95"
            >
              სიმულაცია: დადასტურება
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

  const renderContent = () => {
    if (selectedUser) return <UserDetailView user={selectedUser} packages={packages} onBack={handleBackToDashboard} onAssignPackage={handleAssignPackage} />;

    switch (currentView) {
      case View.DASHBOARD: return <DashboardView users={users} onUserClick={handleUserClick} onCommunicationClick={handleDashboardComm} />;
      case View.USER_LIST: return <UserListView users={users} onUserClick={handleUserClick} onAddUserClick={() => setCurrentView(View.ADD_USER)} />;
      case View.ADD_USER: return <AddUserView corporateClients={corporateClients} onSuccess={() => { setCurrentView(View.USER_LIST); fetchUsers(); }} />;
      case View.MARKET: return <MarketView />;
      case View.ACCESSORIES: return <AccessoriesView />;
      case View.PASSES: return <PassesView onSavePackage={handleSavePackage} />;
      case View.PASS_LIBRARY: return <PassLibraryView packages={packages} onPromotePackage={handlePromotePackage} onSavePackage={handleSavePackage} />;
      case View.EMPLOYEES: return <EmployeesView />;
      case View.STATISTICS: return <StatisticsView />;
      case View.ACCOUNTING: return <AccountingView corporateClients={corporateClients} />;
      case View.CORPORATE: return <CorporateView clients={corporateClients} onAddClient={handleAddCorporateClient} />;
      case View.MESSAGES: return <MessagesView navIntent={msgNavState} clearIntent={() => setMsgNavState(null)} />;
      case View.PROMOTIONS: return <PromotionsView packages={packages} />;
      case View.SETTINGS: return <GeneralView title={t('title.settings')} />;
      default: return <DashboardView users={users} onUserClick={handleUserClick} onCommunicationClick={handleDashboardComm} />;
    }
  };

  return (
    <div className="flex bg-slate-50 h-screen font-sans text-slate-900 overflow-hidden animate-fadeIn bg-slate-900">
      <Sidebar currentView={currentView} onChangeView={(view) => { setCurrentView(view); setSelectedUser(null); setMsgNavState(null); }} />
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Dynamic Header Title based on Tenant */}
        <Header title={getTitle()} tenantName={currentUser?.tenantName} />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
