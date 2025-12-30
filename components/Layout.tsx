
import React, { useState } from 'react';
import { UserRole, AdminSettings } from '../types';
import { GraduationCap, LogOut, LayoutDashboard, Home, Users, Phone, Mail, MapPin, Menu, X } from 'lucide-react';
import { translations } from '../translations';

interface LayoutProps {
  children: React.ReactNode;
  user: { name: string; role: UserRole } | null;
  lang: 'ru' | 'kk';
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onSetLang: (lang: 'ru' | 'kk') => void;
  adminSettings: AdminSettings;
}

const Layout: React.FC<LayoutProps> = ({ children, user, lang, onNavigate, onLogout, onSetLang, adminSettings }) => {
  const t = translations[lang];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = (page: string) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 selection:bg-sky-100 selection:text-sky-600">
      <nav className="bg-white/80 border-b border-gray-100 sticky top-0 z-[60] backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex items-center cursor-pointer group" onClick={() => navigate('landing')}>
              <div className="bg-kz-blue p-2.5 rounded-2xl mr-3 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-sky-100">
                <GraduationCap className="text-white w-7 h-7" />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tighter">{t.brand}</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex space-x-10 items-center">
              <button onClick={() => navigate('landing')} className="text-gray-500 hover:text-sky-600 font-bold text-sm transition-colors flex items-center gap-2">
                <Home size={18} /> {t.nav.home}
              </button>
              {user && (
                <button onClick={() => navigate('dashboard')} className="text-gray-500 hover:text-sky-600 font-bold text-sm transition-colors flex items-center gap-2">
                  <LayoutDashboard size={18} /> {t.nav.dashboard}
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center p-1 bg-gray-50 rounded-xl border border-gray-100">
                <button onClick={() => onSetLang('ru')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${lang === 'ru' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>RU</button>
                <button onClick={() => onSetLang('kk')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${lang === 'kk' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>KZ</button>
              </div>

              {!user ? (
                <div className="flex items-center gap-4">
                  <button onClick={() => navigate('login')} className="text-gray-500 hover:text-sky-600 font-bold text-sm px-2 transition-colors">{t.nav.login}</button>
                  <button onClick={() => navigate('apply')} className="bg-kz-blue text-white px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-sky-600 transition-all shadow-xl shadow-sky-100">{t.nav.becomeStudent}</button>
                </div>
              ) : (
                <div className="flex items-center gap-4 bg-gray-50 pl-4 pr-2 py-2 rounded-2xl border border-gray-100">
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900 leading-none mb-1">{user.name}</p>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{user.role}</p>
                  </div>
                  <button onClick={onLogout} className="bg-white p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:shadow-md transition-all border border-gray-100">
                    <LogOut size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden p-2 text-gray-500" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 p-6 space-y-6 animate-in slide-in-from-top duration-300">
             <div className="flex flex-col gap-4">
               <button onClick={() => navigate('landing')} className="flex items-center gap-3 text-lg font-bold text-gray-700"><Home size={20}/> {t.nav.home}</button>
               {user && <button onClick={() => navigate('dashboard')} className="flex items-center gap-3 text-lg font-bold text-gray-700"><LayoutDashboard size={20}/> {t.nav.dashboard}</button>}
             </div>
             <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                <button onClick={() => onSetLang('ru')} className={`flex-1 py-3 rounded-xl font-bold ${lang === 'ru' ? 'bg-sky-500 text-white' : 'bg-gray-50 text-gray-400'}`}>Русский</button>
                <button onClick={() => onSetLang('kk')} className={`flex-1 py-3 rounded-xl font-bold ${lang === 'kk' ? 'bg-sky-500 text-white' : 'bg-gray-50 text-gray-400'}`}>Қазақша</button>
             </div>
             {!user ? (
               <div className="flex flex-col gap-3 pt-4 border-t border-gray-50">
                 <button onClick={() => navigate('login')} className="w-full py-4 text-center font-bold text-gray-500">{t.nav.login}</button>
                 <button onClick={() => navigate('apply')} className="w-full py-4 bg-kz-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-sky-100">{t.nav.becomeStudent}</button>
               </div>
             ) : (
               <button onClick={onLogout} className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3"><LogOut size={20}/> {t.nav.logout}</button>
             )}
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2">
              <div className="flex items-center mb-8">
                <div className="bg-kz-blue p-2.5 rounded-2xl mr-3 shadow-lg shadow-sky-100">
                  <GraduationCap className="text-white w-6 h-6" />
                </div>
                <span className="text-3xl font-black text-gray-900 tracking-tighter">{t.brand}</span>
              </div>
              <p className="text-gray-500 max-w-sm font-medium leading-relaxed text-lg">
                {lang === 'ru' 
                  ? 'Современная образовательная платформа для связи лучших учителей с амбициозными учениками по всему Казахстану.' 
                  : 'Үздік мұғалімдерді амбициялы оқушылармен байланыстыратын заманауи білім беру платформасы.'}
              </p>
            </div>
            <div>
              <h4 className="font-black text-gray-900 mb-8 uppercase tracking-widest text-[10px]">{lang === 'ru' ? 'Навигация' : 'Навигация'}</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-400">
                <li><button onClick={() => navigate('landing')} className="hover:text-sky-500 transition-colors">{t.nav.home}</button></li>
                <li><button onClick={() => navigate('apply')} className="hover:text-sky-500 transition-colors">{t.nav.becomeStudent}</button></li>
                <li><button onClick={() => navigate('teacher-signup')} className="hover:text-sky-500 transition-colors">{t.nav.becomeTeacher}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-gray-900 mb-8 uppercase tracking-widest text-[10px]">{lang === 'ru' ? 'Связаться' : 'Байланыс'}</h4>
              <ul className="space-y-6 text-sm font-bold text-gray-500">
                <li className="flex items-center gap-3"><div className="p-2 bg-sky-50 rounded-lg text-sky-500"><Mail size={18} /></div> {adminSettings.footerEmail}</li>
                <li className="flex items-center gap-3"><div className="p-2 bg-sky-50 rounded-lg text-sky-500"><Phone size={18} /></div> {adminSettings.footerPhone}</li>
                <li className="flex items-center gap-3"><div className="p-2 bg-sky-50 rounded-lg text-sky-500"><MapPin size={18} /></div> Almaty, Kazakhstan</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
              © 2024 Oku.kz Educational Marketplace. All Rights Reserved.
            </p>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
               <a href="#" className="hover:text-sky-500 transition-colors">Privacy</a>
               <a href="#" className="hover:text-sky-500 transition-colors">Terms</a>
               <a href="#" className="hover:text-sky-500 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
