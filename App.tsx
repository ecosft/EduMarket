
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
import { Shield, ArrowLeft, LogIn } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<'ru' | 'kk'>('ru');
  const [currentPage, setCurrentPage] = useState('landing');
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [teacherRequests, setTeacherRequests] = useState<TeacherApplication[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    notificationEmail: '',
    formspreeId: '',
    adminUsername: 'admin',
    adminPassword: 'admin123',
    footerEmail: 'info@oku.kz',
    footerPhone: '+7 (777) 000-00-00'
  });

  // Auth specific state
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const savedApps = localStorage.getItem('okukz_apps');
    if (savedApps) setApplications(JSON.parse(savedApps));

    const savedTeacherApps = localStorage.getItem('okukz_teacher_apps');
    if (savedTeacherApps) setTeacherRequests(JSON.parse(savedTeacherApps));

    const savedTeachers = localStorage.getItem('okukz_teachers');
    if (savedTeachers) setTeachers(JSON.parse(savedTeachers));

    const savedSettings = localStorage.getItem('okukz_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setAdminSettings(prev => ({
        ...prev,
        ...parsed
      }));
    }
    
    const savedUser = localStorage.getItem('okukz_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'landing';
      setCurrentPage(hash);
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('okukz_apps', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('okukz_teacher_apps', JSON.stringify(teacherRequests));
  }, [teacherRequests]);

  useEffect(() => {
    localStorage.setItem('okukz_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('okukz_settings', JSON.stringify(adminSettings));
  }, [adminSettings]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('okukz_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('okukz_user');
    }
  }, [user]);

  const handleSetLang = (newLang: 'ru' | 'kk') => setLang(newLang);

  const notifyAdmin = async (subject: string, data: any) => {
    if (adminSettings.formspreeId) {
      try {
        await fetch(`https://formspree.io/f/${adminSettings.formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            _subject: subject,
            ...data
          })
        });
      } catch (e) {
        console.error("Failed to send background email via Formspree", e);
      }
    } else if (adminSettings.notificationEmail) {
      // Improved formatting for structured objects like preferredTime
      const formattedData = Object.entries(data).map(([k, v]) => {
        if (typeof v === 'object' && v !== null) {
          return `${k}: ${JSON.stringify(v)}`;
        }
        return `${k}: ${v}`;
      }).join('\n');
      
      const body = encodeURIComponent(formattedData);
      window.open(`mailto:${adminSettings.notificationEmail}?subject=${encodeURIComponent(subject)}&body=${body}`);
    }
  };

  const handleApply = async (data: any) => {
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
    setApplications([...applications, newApp]);
    
    if (!user) {
      const newUser: User = { id: 's1', name: data.name, role: UserRole.STUDENT, email: data.email };
      setUser(newUser);
    }

    notifyAdmin(`Новая заявка на обучение: ${data.name}`, data);
  };

  const handleTeacherRegister = async (data: any) => {
    const newRequest: TeacherApplication = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      status: ApplicationStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    setTeacherRequests([...teacherRequests, newRequest]);
    notifyAdmin(`Новая анкета учителя: ${data.lastName} ${data.firstName}`, data);
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
      pricePerHour: 2000,
      bio: request.bio,
      employment: request.employment,
      status: 'active'
    };

    setTeachers([...teachers, newTeacher]);
    setTeacherRequests(teacherRequests.map(r => 
      r.id === requestId ? { ...r, status: ApplicationStatus.APPROVED } : r
    ));
  };

  const handleRejectTeacher = (requestId: string) => {
    setTeacherRequests(teacherRequests.map(r => 
      r.id === requestId ? { ...r, status: ApplicationStatus.REJECTED } : r
    ));
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

  const handleNavigate = (page: string) => {
    window.location.hash = page;
    setAuthError('');
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedUser = adminSettings.adminUsername || 'admin';
    const storedPass = adminSettings.adminPassword || 'admin123';

    if (adminCreds.username === storedUser && adminCreds.password === storedPass) {
      const adminUser: User = { id: 'a1', name: 'Администратор', role: UserRole.ADMIN, email: 'admin@example.com' };
      setUser(adminUser);
      handleNavigate('dashboard');
      setShowAdminLogin(false);
      setAdminCreds({ username: '', password: '' });
    } else {
      setAuthError(translations[lang].auth.error);
    }
  };

  const loginAs = (role: UserRole) => {
    if (role === UserRole.ADMIN) {
      setShowAdminLogin(true);
      return;
    }
    if (role === UserRole.STUDENT) setUser({ id: 's1', name: lang === 'ru' ? 'Иван Ученик' : 'Арман Оқушы', role, email: 'student@example.com' });
    if (role === UserRole.TEACHER) setUser({ id: 't1', name: 'Александр Иванов', role, email: 'teacher@example.com' });
    handleNavigate('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    handleNavigate('landing');
  };

  const renderContent = () => {
    if (activeLessonId) {
      return <LessonRoom roomId={activeLessonId} onExit={() => setActiveLessonId(null)} />;
    }

    const t = translations[lang];

    switch (currentPage) {
      case 'landing':
        return <LandingPage lang={lang} onApply={() => handleNavigate('apply')} />;
      case 'apply':
        return <ApplicationForm lang={lang} onSubmit={handleApply} />;
      case 'teacher-signup':
        return <TeacherRegistrationForm lang={lang} onSubmit={handleTeacherRegister} />;
      case 'login':
        return (
          <div className="max-w-md mx-auto py-24 px-4">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-sky-100 border border-gray-100">
              {!showAdminLogin ? (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8 tracking-tight">{t.auth.roleSelect}</h2>
                  <div className="space-y-4">
                    <button onClick={() => loginAs(UserRole.STUDENT)} className="w-full bg-gray-50 border border-gray-100 py-5 rounded-2xl font-bold hover:border-sky-500 hover:bg-sky-50 hover:text-sky-500 transition-all shadow-sm flex items-center justify-center gap-3">
                      <LogIn size={20} /> {lang === 'ru' ? 'Я ученик' : 'Мен оқушымын'}
                    </button>
                    <button onClick={() => loginAs(UserRole.TEACHER)} className="w-full bg-gray-50 border border-gray-100 py-5 rounded-2xl font-bold hover:border-sky-500 hover:bg-sky-50 hover:text-sky-500 transition-all shadow-sm flex items-center justify-center gap-3">
                      <LogIn size={20} /> {lang === 'ru' ? 'Я учитель' : 'Мен мұғаліммін'}
                    </button>
                    <div className="pt-6 border-t border-gray-100 mt-6">
                      <button 
                        onClick={() => loginAs(UserRole.ADMIN)} 
                        className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-sky-500 font-bold text-sm transition-colors py-2"
                      >
                        <Shield size={16} /> {t.auth.loginAsAdmin}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => { setShowAdminLogin(false); setAuthError(''); }}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-900 mb-8 font-bold text-sm transition-colors"
                  >
                    <ArrowLeft size={16} /> {t.auth.back}
                  </button>
                  <div className="flex justify-center mb-8">
                    <div className="bg-sky-100 text-sky-600 p-5 rounded-[2rem] shadow-lg shadow-sky-100">
                      <Shield size={40} />
                    </div>
                  </div>
                  <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8 tracking-tight">{t.auth.loginAsAdmin}</h2>
                  <form onSubmit={handleAdminLoginSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">{t.auth.username}</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-sky-100 focus:border-sky-500 outline-none transition-all"
                        value={adminCreds.username}
                        onChange={e => setAdminCreds({...adminCreds, username: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">{t.auth.password}</label>
                      <input 
                        type="password" 
                        required
                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-sky-100 focus:border-sky-500 outline-none transition-all"
                        value={adminCreds.password}
                        onChange={e => setAdminCreds({...adminCreds, password: e.target.value})}
                      />
                    </div>
                    {authError && <p className="text-red-500 text-xs font-bold text-center">{authError}</p>}
                    <button 
                      type="submit" 
                      className="w-full bg-sky-500 text-white py-5 rounded-2xl font-bold text-lg hover:bg-sky-600 transition-all shadow-xl shadow-sky-100 flex items-center justify-center gap-3"
                    >
                      <LogIn size={24} /> {t.auth.submit}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        );
      case 'dashboard':
        if (!user) return <LandingPage lang={lang} onApply={() => handleNavigate('apply')} />;
        if (user.role === UserRole.STUDENT) {
          return <StudentDashboard applications={applications} onJoinLesson={setActiveLessonId} />;
        }
        if (user.role === UserRole.TEACHER) {
          const teacher = teachers.find(t => t.id === user.id) || teachers[0];
          const available = applications.filter(app => app.status === ApplicationStatus.NEW);
          return <TeacherDashboard teacher={teacher} availableApplications={available} onAcceptApplication={() => {}} />;
        }
        if (user.role === UserRole.ADMIN) {
          return (
            <AdminDashboard 
              applications={applications} 
              teachers={teachers} 
              teacherRequests={teacherRequests}
              onAssignTeacher={handleAssignTeacher}
              onApproveTeacher={handleApproveTeacher}
              onRejectTeacher={handleRejectTeacher}
              adminSettings={adminSettings}
              onUpdateSettings={setAdminSettings}
              lang={lang}
            />
          );
        }
        return null;
      default:
        return <LandingPage lang={lang} onApply={() => handleNavigate('apply')} />;
    }
  };

  return (
    <Layout user={user} lang={lang} onNavigate={handleNavigate} onLogout={handleLogout} onSetLang={handleSetLang} adminSettings={adminSettings}>
      {renderContent()}
    </Layout>
  );
};

export default App;
