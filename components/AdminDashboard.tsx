
import React, { useState } from 'react';
import { StudentApplication, ApplicationStatus, Teacher, TeacherApplication, AdminSettings } from '../types';
import { SUBJECTS } from '../constants';
import { translations } from '../translations';
import { Shield, Settings, Users, BookOpen, CheckCircle, Mail, Key, Clock, UserPlus, XCircle, MapPin, Calendar, Phone } from 'lucide-react';

interface AdminDashboardProps {
  applications: StudentApplication[];
  teachers: Teacher[];
  teacherRequests: TeacherApplication[];
  lang: 'ru' | 'kk';
  adminSettings: AdminSettings;
  onUpdateSettings: (settings: AdminSettings) => void;
  onAssignTeacher: (appId: string, teacherId: string) => void;
  onApproveTeacher: (requestId: string) => void;
  onRejectTeacher: (requestId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  applications, 
  teachers, 
  teacherRequests,
  lang,
  adminSettings, 
  onUpdateSettings,
  onAssignTeacher,
  onApproveTeacher,
  onRejectTeacher
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-red-100 text-red-600 p-3 rounded-2xl shadow-sm">
          <Shield size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{lang === 'ru' ? 'Админ-панель' : 'Админ-панелі'}</h1>
          <p className="text-gray-500 text-sm">{lang === 'ru' ? 'Управление платформой и пользователями' : 'Платформа мен пайдаланушыларды басқару'}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
          <Users className="mx-auto text-sky-600 mb-2" />
          <p className="text-3xl font-bold">{applications.length}</p>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{lang === 'ru' ? 'Студенты' : 'Студенттер'}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
          <BookOpen className="mx-auto text-sky-600 mb-2" />
          <p className="text-3xl font-bold">{teachers.length}</p>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{lang === 'ru' ? 'Оқытушылар' : 'Оқытушылар'}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
          <Clock className="mx-auto text-amber-500 mb-2" />
          <p className="text-3xl font-bold">{teacherRequests.filter(r => r.status === ApplicationStatus.PENDING).length}</p>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{lang === 'ru' ? 'Новые учителя' : 'Жаңа мұғалімдер'}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
          <Settings className="mx-auto text-sky-600 mb-2" />
          <p className="text-3xl font-bold">{SUBJECTS.length}</p>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{lang === 'ru' ? 'Предметы' : 'Пәндер'}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-6 w-fit">
            <button 
              onClick={() => setActiveTab('student')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'student' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {lang === 'ru' ? 'Заявки учеников' : 'Оқушы өтінімдері'}
            </button>
            <button 
              onClick={() => setActiveTab('teacher')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'teacher' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t.admin.teacherRequests}
            </button>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-8">
            {activeTab === 'student' ? (
              <>
                <div className="p-8 border-b border-gray-100">
                  <h2 className="text-xl font-bold">{lang === 'ru' ? 'Все заявки учеников' : 'Барлық оқушы өтінімдері'}</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        <th className="px-8 py-4">Ученик</th>
                        <th className="px-8 py-4">Предмет / Уровень</th>
                        <th className="px-8 py-4">Удобное время</th>
                        <th className="px-8 py-4">Статус</th>
                        <th className="px-8 py-4">Учитель</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {applications.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-8 py-10 text-center text-gray-400 italic">
                            {lang === 'ru' ? 'Заявок пока нет' : 'Әзірге өтінімдер жоқ'}
                          </td>
                        </tr>
                      ) : (
                        applications.map((app) => (
                          <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-6">
                              <p className="font-bold text-gray-900">{app.studentName}</p>
                              <p className="text-[10px] text-sky-600 font-bold">{app.email}</p>
                              <p className="text-[10px] text-gray-400">{app.phone}</p>
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-gray-700 font-bold text-sm">{SUBJECTS.find(s => s.id === app.subjectId)?.name}</p>
                              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{app.level}</span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-xs text-gray-600 font-bold">
                                  <Calendar size={12} className="text-sky-400" />
                                  {app.preferredTime.date ? new Date(app.preferredTime.date).toLocaleDateString() : '—'}
                                  <span className="text-gray-300">|</span>
                                  {app.preferredTime.days.join(', ')}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-600 font-bold">
                                  <Clock size={12} className="text-sky-400" />
                                  {app.preferredTime.time}
                                  <span className="bg-sky-100 text-sky-600 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
                                    {app.preferredTime.timezone}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight ${
                                app.status === ApplicationStatus.NEW ? 'bg-blue-100 text-blue-600' :
                                app.status === ApplicationStatus.SCHEDULED ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              {app.status === ApplicationStatus.NEW ? (
                                <select 
                                  onChange={(e) => onAssignTeacher(app.id, e.target.value)}
                                  className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-sky-500 shadow-sm w-full"
                                >
                                  <option value="">{lang === 'ru' ? 'Назначить...' : 'Тағайындау...'}</option>
                                  {teachers.filter(t => t.subjects.includes(app.subjectId)).map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                  ))}
                                </select>
                              ) : (
                                <div className="flex items-center gap-2 text-xs text-gray-600 font-bold">
                                  <div className="bg-green-100 text-green-600 p-1 rounded-full">
                                    <CheckCircle size={10} />
                                  </div>
                                  {teachers.find(t => t.id === app.assignedTeacherId)?.name}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <div className="p-8 border-b border-gray-100">
                  <h2 className="text-xl font-bold">{t.admin.teacherRequests}</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        <th className="px-8 py-4">Преподаватель</th>
                        <th className="px-8 py-4">Опыт / Работа</th>
                        <th className="px-8 py-4">Предметы</th>
                        <th className="px-8 py-4">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {teacherRequests.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-8 py-10 text-center text-gray-400 italic">
                            {lang === 'ru' ? 'Нет новых анкет учителей' : 'Жаңа мұғалім сауалнамалары жоқ'}
                          </td>
                        </tr>
                      ) : (
                        teacherRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-6">
                              <p className="font-bold text-gray-900">{req.lastName} {req.firstName}</p>
                              <p className="text-xs text-gray-400">{req.contact}</p>
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-gray-700 font-medium">{req.experience} {lang === 'ru' ? 'лет' : 'жыл'}</p>
                              <p className="text-xs text-gray-400">{req.employment}</p>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex flex-wrap gap-1">
                                {req.subjectIds.map(sid => (
                                  <span key={sid} className="bg-sky-50 text-sky-600 px-2 py-0.5 rounded text-[10px] font-bold">
                                    {SUBJECTS.find(s => s.id === sid)?.name}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              {req.status === ApplicationStatus.PENDING ? (
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => onApproveTeacher(req.id)}
                                    className="bg-green-500 text-white p-2 rounded-xl hover:bg-green-600 transition-colors shadow-sm"
                                    title={t.admin.approve}
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                  <button 
                                    onClick={() => onRejectTeacher(req.id)}
                                    className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition-colors shadow-sm"
                                    title={t.admin.reject}
                                  >
                                    <XCircle size={16} />
                                  </button>
                                </div>
                              ) : (
                                <span className={`text-xs font-bold uppercase ${req.status === ApplicationStatus.APPROVED ? 'text-green-500' : 'text-red-500'}`}>
                                  {req.status}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-1 space-y-8">
          {/* Footer Contact Settings Card */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-sky-50 p-2 rounded-xl">
                <Users className="text-sky-500" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{t.admin.footerSettingsTitle}</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">{t.admin.footerEmailLabel}</label>
                <input 
                  type="email" 
                  placeholder="info@oku.kz"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-sm"
                  value={adminSettings.footerEmail}
                  onChange={e => onUpdateSettings({ ...adminSettings, footerEmail: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">{t.admin.footerPhoneLabel}</label>
                <input 
                  type="text" 
                  placeholder="+7 (777) 000-00-00"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-sm"
                  value={adminSettings.footerPhone}
                  onChange={e => onUpdateSettings({ ...adminSettings, footerPhone: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Notification Settings Card */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-sky-50 p-2 rounded-xl">
                <Mail className="text-sky-500" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{t.admin.settingsTitle}</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">{t.admin.emailLabel}</label>
                <input 
                  type="email" 
                  placeholder={t.admin.emailPlaceholder}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-sm"
                  value={adminSettings.notificationEmail}
                  onChange={e => onUpdateSettings({ ...adminSettings, notificationEmail: e.target.value })}
                />
                <p className="text-[10px] text-gray-400 italic">Сюда будут приходить заявки по email</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">{t.admin.formspreeLabel}</label>
                <input 
                  type="text" 
                  placeholder="e.g. xnqyvrbw"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-sm font-mono"
                  value={adminSettings.formspreeId}
                  onChange={e => onUpdateSettings({ ...adminSettings, formspreeId: e.target.value })}
                />
                <p className="text-[10px] text-gray-500 leading-tight">
                  {t.admin.formspreeHint}. <a href="https://formspree.io" target="_blank" className="text-sky-600 font-bold hover:underline">formspree.io</a>
                </p>
              </div>
            </div>
          </div>

          {/* Security Settings Card */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-amber-50 p-2 rounded-xl">
                <Key className="text-amber-500" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{t.admin.securityTitle}</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">{t.admin.usernameLabel}</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-sm"
                  value={adminSettings.adminUsername}
                  onChange={e => onUpdateSettings({ ...adminSettings, adminUsername: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">{t.admin.passwordLabel}</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-sm font-mono"
                  value={adminSettings.adminPassword}
                  onChange={e => onUpdateSettings({ ...adminSettings, adminPassword: e.target.value })}
                />
              </div>

              <div className="pt-4">
                 <button 
                  onClick={() => alert(t.admin.settingsSaved)}
                  className="w-full bg-kz-blue text-white py-4 rounded-2xl font-bold hover:bg-sky-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-100"
                >
                  <CheckCircle size={18} /> {t.admin.saveSettings}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
