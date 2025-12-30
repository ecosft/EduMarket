
import React, { useState } from 'react';
import { StudentApplication, ApplicationStatus, Teacher, TeacherApplication, AdminSettings } from '../types';
import { SUBJECTS } from '../constants';
import { translations } from '../translations';
import { Shield, Settings, Users, BookOpen, CheckCircle, Mail, Key, Clock, XCircle, Calendar, Phone, Smartphone } from 'lucide-react';

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
      <div className="flex items-center gap-4 mb-12">
        <div className="bg-red-500 text-white p-4 rounded-[1.5rem] shadow-xl shadow-red-100">
          <Shield size={36} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">{lang === 'ru' ? 'Консоль' : 'Консоль'}</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Oku.kz Administrator Panel</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100 flex flex-col items-center">
          <Users className="text-sky-500 mb-3" size={32} />
          <p className="text-4xl font-black text-gray-900">{applications.length}</p>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{lang === 'ru' ? 'Студенты' : 'Студенттер'}</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100 flex flex-col items-center">
          <BookOpen className="text-sky-500 mb-3" size={32} />
          <p className="text-4xl font-black text-gray-900">{teachers.length}</p>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{lang === 'ru' ? 'Учителя' : 'Мұғалімдер'}</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100 flex flex-col items-center">
          <Clock className="text-amber-500 mb-3" size={32} />
          <p className="text-4xl font-black text-gray-900">{teacherRequests.filter(r => r.status === ApplicationStatus.PENDING).length}</p>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{lang === 'ru' ? 'Заявки' : 'Өтінімдер'}</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100 flex flex-col items-center">
          <Settings className="text-sky-500 mb-3" size={32} />
          <p className="text-4xl font-black text-gray-900">{SUBJECTS.length}</p>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{lang === 'ru' ? 'Курсы' : 'Курстар'}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Переключатель табов */}
          <div className="flex bg-gray-200 p-1.5 rounded-2xl mb-8 w-fit shadow-inner">
            <button 
              onClick={() => setActiveTab('student')}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'student' ? 'bg-white text-sky-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {lang === 'ru' ? 'Студенты' : 'Студенттер'}
            </button>
            <button 
              onClick={() => setActiveTab('teacher')}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'teacher' ? 'bg-white text-sky-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {lang === 'ru' ? 'Преподаватели' : 'Мұғалімдер'}
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100 overflow-hidden">
            {activeTab === 'student' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                      <th className="px-10 py-6">Студент</th>
                      <th className="px-10 py-6">Предмет</th>
                      <th className="px-10 py-6">Расписание</th>
                      <th className="px-10 py-6">Статус</th>
                      <th className="px-10 py-6">Действие</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-10 py-8">
                          <p className="font-black text-gray-900 text-sm">{app.studentName}</p>
                          <p className="text-[10px] text-sky-500 font-bold uppercase mt-1">{app.email}</p>
                        </td>
                        <td className="px-10 py-8">
                          <p className="text-gray-700 font-bold text-xs">{SUBJECTS.find(s => s.id === app.subjectId)?.name}</p>
                          <p className="text-[10px] text-gray-300 font-black uppercase mt-1 tracking-tighter">{app.level}</p>
                        </td>
                        <td className="px-10 py-8">
                          <div className="text-[10px] font-bold text-gray-500 leading-relaxed">
                            <div className="flex items-center gap-1.5"><Calendar size={12} className="text-sky-400"/> {app.preferredTime.date || '—'}</div>
                            <div className="flex items-center gap-1.5 mt-1"><Clock size={12} className="text-sky-400"/> {app.preferredTime.time} ({app.preferredTime.timezone})</div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            app.status === ApplicationStatus.NEW ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-10 py-8">
                          {app.status === ApplicationStatus.NEW ? (
                            <select 
                              onChange={(e) => onAssignTeacher(app.id, e.target.value)}
                              className="bg-white border-2 border-gray-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none focus:border-sky-500 transition-all cursor-pointer"
                            >
                              <option value="">{lang === 'ru' ? 'Выбрать...' : 'Таңдау...'}</option>
                              {teachers.filter(t => t.subjects.includes(app.subjectId)).map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                              ))}
                            </select>
                          ) : (
                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase">
                              <CheckCircle size={14} className="text-green-500" />
                              {teachers.find(t => t.id === app.assignedTeacherId)?.name}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                      <th className="px-10 py-6">Учитель</th>
                      <th className="px-10 py-6">Опыт / Образование</th>
                      <th className="px-10 py-6">Предметы</th>
                      <th className="px-10 py-6">Действие</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {teacherRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-10 py-8">
                          <p className="font-black text-gray-900 text-sm">{req.lastName} {req.firstName}</p>
                          <p className="text-[10px] text-sky-500 font-bold uppercase mt-1">{req.contact}</p>
                        </td>
                        <td className="px-10 py-8">
                          <p className="text-gray-700 font-bold text-xs">{req.experience} {lang === 'ru' ? 'лет' : 'жыл'}</p>
                          <p className="text-[10px] text-gray-300 font-black uppercase mt-1 tracking-tighter">{req.employment}</p>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex flex-wrap gap-1">
                            {req.subjectIds.map(sid => (
                              <span key={sid} className="bg-sky-50 text-sky-500 px-2 py-0.5 rounded text-[8px] font-black uppercase">
                                {SUBJECTS.find(s => s.id === sid)?.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          {req.status === ApplicationStatus.PENDING ? (
                            <div className="flex gap-2">
                              <button onClick={() => onApproveTeacher(req.id)} className="bg-green-500 text-white p-2.5 rounded-xl shadow-lg shadow-green-100 hover:scale-110 transition-transform"><CheckCircle size={18} /></button>
                              <button onClick={() => onRejectTeacher(req.id)} className="bg-red-500 text-white p-2.5 rounded-xl shadow-lg shadow-red-100 hover:scale-110 transition-transform"><XCircle size={18} /></button>
                            </div>
                          ) : (
                            <span className={`text-[10px] font-black uppercase tracking-widest ${req.status === ApplicationStatus.APPROVED ? 'text-green-500' : 'text-red-500'}`}>
                              {req.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Настройки футера и сайта */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-sky-50 p-2.5 rounded-xl text-sky-500"><Smartphone size={20} /></div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">{t.admin.footerSettingsTitle}</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.admin.footerEmailLabel}</label>
                <input 
                  type="email" 
                  className="w-full mt-2 px-5 py-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-sm font-bold"
                  value={adminSettings.footerEmail}
                  onChange={e => onUpdateSettings({ ...adminSettings, footerEmail: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.admin.footerPhoneLabel}</label>
                <input 
                  type="text" 
                  className="w-full mt-2 px-5 py-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-sm font-bold"
                  value={adminSettings.footerPhone}
                  onChange={e => onUpdateSettings({ ...adminSettings, footerPhone: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-sky-50 p-2.5 rounded-xl text-sky-500"><Mail size={20} /></div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">{t.admin.settingsTitle}</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.admin.emailLabel}</label>
                <input 
                  type="email" 
                  className="w-full mt-2 px-5 py-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-sm font-bold"
                  value={adminSettings.notificationEmail}
                  onChange={e => onUpdateSettings({ ...adminSettings, notificationEmail: e.target.value })}
                />
              </div>
              <button 
                onClick={() => alert(t.admin.settingsSaved)}
                className="w-full bg-kz-blue text-white py-4.5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-sky-600 transition-all shadow-xl shadow-sky-100 flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} /> {t.admin.saveSettings}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
