
import React from 'react';
import {
  Zap,
  Users,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Smartphone,
  LayoutDashboard,
  Calculator,
  Briefcase
} from 'lucide-react';

interface LandingPageProps {
  onStartRegistration: () => void;
  onLoginClick: () => void;
}

const LandingPageView: React.FC<LandingPageProps> = ({ onStartRegistration, onLoginClick }) => {
  return (
    <div className="bg-[#0d1117] text-slate-300 font-sans min-h-screen">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-10 py-8 sticky top-0 bg-[#0d1117]/80 backdrop-blur-md z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-lime-400 rounded-xl flex items-center justify-center font-black text-slate-900 shadow-lg shadow-lime-400/20">A</div>
          <span className="text-xl font-black text-white tracking-tighter">ARTRON</span>
        </div>
        <div className="hidden md:flex space-x-8 text-xs font-black uppercase tracking-widest text-slate-500">
          <a href="#features" className="hover:text-white transition-colors">უპირატესობები</a>
          <a href="#solutions" className="hover:text-white transition-colors">გადაწყვეტილებები</a>
          <a href="#pricing" className="hover:text-white transition-colors">ფასები</a>
          <button onClick={onLoginClick} className="hover:text-white transition-colors">შესვლა</button>
        </div>
        <button
          onClick={onStartRegistration}
          className="px-8 py-3 bg-white text-slate-900 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-lime-400 transition-all active:scale-95 shadow-xl"
        >
          შემოუერთდით
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative px-10 py-32 flex flex-col items-center text-center space-y-10 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img src="/landing_bg.png" alt="Background" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117]/80 via-[#0d1117]/50 to-[#0d1117] z-10"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center space-y-10">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-lime-400/10 border border-lime-400/20 rounded-full text-lime-400 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
            <Sparkles size={14} />
            <span>The Future of Fitness Management</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight max-w-5xl">
            მართეთ თქვენი სპორტული ბიზნესი <br /> <span className="text-lime-400">ჭკვიანურად.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl font-medium leading-relaxed">
            სრული ეკოსისტემა სპორტული დარბაზებისთვის: რეგისტრაციიდან ფინანსურ ანალიტიკამდე.
            გაზარდეთ ეფექტურობა ARTRON-ის ინოვაციური მართვის პანელით.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 pt-6">
            <button
              onClick={onStartRegistration}
              className="px-12 py-5 bg-lime-400 text-slate-900 font-black rounded-[2rem] text-sm uppercase tracking-widest hover:bg-white transition-all shadow-2xl shadow-lime-400/20 flex items-center group"
            >
              დაიწყეთ ახლავე
              <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
            </button>
            <button className="px-12 py-5 bg-slate-800 text-white font-black rounded-[2rem] text-sm uppercase tracking-widest border border-slate-700 hover:bg-slate-700 transition-all">
              დემო ვერსია
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-10 py-32 bg-slate-900/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard
            icon={<Users className="text-blue-500" />}
            title="CRM & მომხმარებლები"
            desc="პროფილების სრული მართვა, დასწრების ისტორია და ლოიალობის სისტემა."
          />
          <FeatureCard
            icon={<Calculator className="text-lime-500" />}
            title="ფინანსური აღრიცხვა"
            desc="ინვოისების გენერირება, ORIS-თან ინტეგრაცია და გაყიდვების ანალიზი."
          />
          <FeatureCard
            icon={<Smartphone className="text-purple-500" />}
            title="მობილური აპლიკაცია"
            desc="მომხმარებლისთვის განკუთვნილი აპი: QR საშვი, განრიგი და შეტყობინებები."
          />
          <FeatureCard
            icon={<Briefcase className="text-amber-500" />}
            title="HR & თანამშრომლები"
            desc="სამუშაო საათების აღრიცხვა, ბრძანებების გენერირება და სახელფასო უწყისი."
          />
          <FeatureCard
            icon={<LayoutDashboard className="text-emerald-500" />}
            title="POS ტერმინალი"
            desc="ინტეგრირებული მარკეტი და საწყობის მართვა რეალურ დროში."
          />
          <FeatureCard
            icon={<BarChart3 className="text-rose-500" />}
            title="Big Data სტატისტიკა"
            desc="დეტალური გრაფიკები და პროგნოზირება თქვენი ბიზნესის ზრდისთვის."
          />
        </div>
      </section>

      {/* Footer Simulation */}
      <footer className="p-20 text-center border-t border-slate-800/50">
        <p className="text-slate-600 text-xs font-black uppercase tracking-widest">&copy; 2024 PIXL ARTRON - All Rights Reserved</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="bg-[#161b22] p-10 rounded-[3rem] border border-slate-800 hover:border-lime-400/50 transition-all hover:shadow-2xl hover:shadow-lime-400/5 group">
    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl">
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <h3 className="text-xl font-black text-white mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
  </div>
);

const Sparkles = ({ size, className }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>;

export default LandingPageView;
