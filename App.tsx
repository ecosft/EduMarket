
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import ApplicationForm from './components/ApplicationForm';
import TeacherRegistrationForm from './components/TeacherRegistrationForm';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import LessonRoom from './components/LessonRoom';
import { UserRole, StudentApplication, ApplicationStatus, User, Teacher, TeacherApplication, AdminSettings } from './types';
import { MOCK_TEACHERS } from './constants';
import { translations } from './translations';
import { Shield, ArrowLeft, LogIn, UserPlus } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<'ru' | 'kk'>('ru');
  const [currentPage, setCurrentPage] = useState('landing');
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [teacherRequests, setTeacherRequests] = useState<TeacherApplication[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('okukz_settings');
    return saved ? JSON.parse(saved) : {
      notificationEmail: '',
      formspreeId: '',
      adminUsername: 'admin',
      adminPassword: 'admin123',
      footerEmail: 'info@oku.kz',
      footerPhone: '+7 (777) 000-00-00'
    };
  });

  // Auth/Login state
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  // Initialization & Persistence
  useEffect(() => {
    const savedApps = localStorage.getItem('okukz_apps');
    if (savedApps) setApplications(JSON.parse(savedApps));

    const savedTeacherApps = localStorage.getItem('okukz_teacher_apps');
    if (savedTeacherApps) setTeacherRequests(JSON.parse(savedTeacherApps));

    const savedTeachers = localStorage.getItem('okukz_teachers');
    if (savedTeachers) setTeachers(JSON.parse(savedTeachers));
    
    const savedUser = localStorage.getItem('okukz_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'landing';
      setCurrentPage(hash);
      window.scrollTo(0, 0);
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync state to LocalStorage
  useEffect(() => { localStorage.setItem('okukz_apps', JSON.stringify(applications)); }, [applications]);
  useEffect(() => { localStorage.setItem('okukz_teacher_apps', JSON.stringify(teacherRequests)); }, [teacherRequests]);
  useEffect(() => { localStorage.setItem('okukz_teachers', JSON.stringify(teachers)); }, [teachers]);
  useEffect(() => { localStorage.setItem('okukz_settings', JSON.stringify(adminSettings)); }, [adminSettings]);
  useEffect(() => { 
    if (user) localStorage.setItem('okukz_user', JSON.stringify(user));
    else localStorage.removeItem('okukz_user');
  }, [user]);

  const handleSetLang = (newLang: 'ru' | 'kk') => setLang(newLang);
  const handleNavigate = (page: string) => { window.location.hash = page; };

  const handleApply = (data: any) => {
    const newApp: StudentApplication = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: user?.id || 'guest',
      studentName: data.name,
      email: data.email,
      phone: data.phone,
      subjectId: data.subjectId,
      level: data.level,
      preferredTime: data.preferredTime,
      status: ApplicationStatus.NEW,
      createdAt: new Date().toISOString()
    };
    setApplications([newApp, ...applications]);
    if (!user) setUser({ id: 's1', name: data.name, role: UserRole.STUDENT, email: data.email });
  };

  const handleTeacherRegister = (data: any) => {
    const newRequest: TeacherApplication = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      status: ApplicationStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    setTeacherRequests([newRequest, ...teacherRequests]);
  };

  const handleApproveTeacher = (requestId: string) => {
    const request = teacherRequests.find(r => r.id === requestId);
    if (!request) return;
    const newTeacher: Teacher = {
      id: `t_${request.id}`,
      name: `${request.firstName} ${request.lastName}`,
      photo: `https://ui-avatars.com/api/?name=${request.firstName}+${request.lastName}&background=random`,
      subjects: request.subjectIds,
      experience: `${request.experience} лет`,
      education: request.employment,
      pricePerHour: 3000,
      bio: request.bio,
      status: 'active'
    };
    setTeachers([...teachers, newTeacher]);
    setTeacherRequests(teacherRequests.map(r => r.id === requestId ? { ...r, status: ApplicationStatus.APPROVED } : r));
  };

  const handleAssignTeacher = (appId: string, teacherId: string) => {
    setApplications(applications.map(app => 
      app.id === appId ? { 
        ...app, 
        status: ApplicationStatus.SCHEDULED, 
        assignedTeacherId: teacherId, 
        lessonRoomId: `room-${appId}` 
      } : app
    ));
  };

  const loginAs = (role: UserRole) => {
    if (role === UserRole.ADMIN) { setShowAdminLogin(true); return; }
    if (role === UserRole.STUDENT) setUser({ id: 's1', name: lang === 'ru' ? 'Иван Ученик' : 'Арман Оқушы', role, email: 'student@example.com' });
    if (role === UserRole.TEACHER) setUser({ id: teachers[0].id, name: teachers[0].name, role, email: 'teacher@example.com' });
    handleNavigate('dashboard');
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCreds.username === adminSettings.adminUsername && adminCreds.password === adminSettings.adminPassword) {
      setUser({ id: 'a1', name: 'Admin', role: UserRole.ADMIN, email: 'admin@oku.kz' });
      handleNavigate('dashboard');
      setShowAdminLogin(false);
    } else {
      setAuthError(translations[lang].auth.error);
    }
  };

  const renderContent = () => {
    if (activeLessonId) return <LessonRoom roomId={activeLessonId} onExit={() => setActiveLessonId(null)} />;
    const t = translations[lang];

    switch (currentPage) {
      case 'landing': return <LandingPage lang={lang} onApply={() => handleNavigate('apply')} />;
      case 'apply': return <ApplicationForm lang={lang} onSubmit={handleApply} />;
      case 'teacher-signup': return <TeacherRegistrationForm lang={lang} onSubmit={handleTeacherRegister} />;
      case 'login': return (
        <div className="max-w-md mx-auto py-24 px-4">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-sky-100/50 border border-gray-100">
            {!showAdminLogin ? (
              <>
                <h2 className="text-3xl font-black text-gray-900 text-center mb-10 tracking-tight">{t.auth.roleSelect}</h2>
                <div className="space-y-4">
                  <button onClick={() => loginAs(UserRole.STUDENT)} className="w-full bg-gray-50 border-2 border-transparent py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:border-sky-500 hover:bg-sky-50 hover:text-sky-500 transition-all flex items-center justify-center gap-3">
                    <LogIn size={20} /> {lang === 'ru' ? 'Я ученик' : 'Мен оқушымын'}
                  </button>
                  <button onClick={() => loginAs(UserRole.TEACHER)} className="w-full bg-gray-50 border-2 border-transparent py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:border-sky-500 hover:bg-sky-50 hover:text-sky-500 transition-all flex items-center justify-center gap-3">
                    <LogIn size={20} /> {lang === 'ru' ? 'Я учитель' : 'Мен мұғаліммін'}
                  </button>
                  <div className="pt-8 border-t border-gray-100 mt-8 flex flex-col gap-4">
                    <button onClick={() => loginAs(UserRole.ADMIN)} className="flex items-center justify-center gap-2 text-gray-400 hover:text-sky-500 font-black text-[10px] uppercase tracking-widest transition-colors py-2">
                      <Shield size={14} /> {t.auth.loginAsAdmin}
                    </button>
                    <button onClick={() => handleNavigate('teacher-signup')} className="flex items-center justify-center gap-2 text-sky-500 hover:text-sky-600 font-black text-[10px] uppercase tracking-widest transition-colors py-2 bg-sky-50 rounded-2xl">
                      <UserPlus size={14} /> {lang === 'ru' ? 'Стать учителем' : 'Мұғалім болу'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <form onSubmit={handleAdminLoginSubmit} className="space-y-6">
                <button onClick={() => setShowAdminLogin(false)} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 mb-8 font-black text-[10px] uppercase tracking-widest transition-colors"><ArrowLeft size={14} /> {t.auth.back}</button>
                <h2 className="text-3xl font-black text-gray-900 text-center mb-10 tracking-tight">{t.auth.loginAsAdmin}</h2>
                <div className="space-y-4">
                  <input type="text" placeholder={t.auth.username} required className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-sky-500 outline-none transition-all font-bold" value={adminCreds.username} onChange={e => setAdminCreds({...adminCreds, username: e.target.value})} />
                  <input type="password" placeholder={t.auth.password} required className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-sky-500 outline-none transition-all font-bold" value={adminCreds.password} onChange={e => setAdminCreds({...adminCreds, password: e.target.value})} />
                </div>
                {authError && <p className="text-red-500 text-xs font-black text-center uppercase tracking-tighter">{authError}</p>}
                <button type="submit" className="w-full bg-kz-blue text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-sky-600 transition-all shadow-xl shadow-sky-100 flex items-center justify-center gap-3"><LogIn size={20} /> {t.auth.submit}</button>
              </form>
            )}
          </div>
        </div>
      );
      case 'dashboard':
        if (!user) return null;
        if (user.role === UserRole.STUDENT) return <StudentDashboard applications={applications.filter(a => a.studentId === user.id || a.studentId === 'guest')} onJoinLesson={setActiveLessonId} />;
        if (user.role === UserRole.TEACHER) {
          const teacher = teachers.find(t => t.id === user.id) || teachers[0];
          return <TeacherDashboard teacher={teacher} availableApplications={applications.filter(a => a.status === ApplicationStatus.NEW && teacher.subjects.includes(a.subjectId))} onAcceptApplication={(id) => handleAssignTeacher(id, teacher.id)} onUpdateProfile={(t) => setTeachers(prev => prev.map(old => old.id === t.id ? t : old))} lang={lang} />;
        }
        if (user.role === UserRole.ADMIN) return <AdminDashboard applications={applications} teachers={teachers} teacherRequests={teacherRequests} lang={lang} adminSettings={adminSettings} onUpdateSettings={setAdminSettings} onAssignTeacher={handleAssignTeacher} onApproveTeacher={handleApproveTeacher} onRejectTeacher={(id) => setTeacherRequests(prev => prev.map(r => r.id === id ? {...r, status: ApplicationStatus.REJECTED} : r))} />;
        return null;
      default: return <LandingPage lang={lang} onApply={() => handleNavigate('apply')} />;
    }
  };

  return (
    <Layout user={user} lang={lang} onNavigate={handleNavigate} onLogout={() => { setUser(null); handleNavigate('landing'); }} onSetLang={handleSetLang} adminSettings={adminSettings}>
      {renderContent()}
    </Layout>
  );
};

export default App;
