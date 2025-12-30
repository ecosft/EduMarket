
import React, { useState } from 'react';
import { Teacher, StudentApplication, ApplicationStatus } from '../types';
import { SUBJECTS, getSubjects } from '../constants';
// Added Clock to the lucide-react imports
import { User, Briefcase, GraduationCap, DollarSign, List, CheckCircle, Edit, Save, X, BookOpen, Clock } from 'lucide-react';

interface TeacherDashboardProps {
  teacher: Teacher;
  availableApplications: StudentApplication[];
  onAcceptApplication: (appId: string) => void;
  onUpdateProfile: (updatedTeacher: Teacher) => void;
  lang: 'ru' | 'kk';
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ teacher, availableApplications, onAcceptApplication, onUpdateProfile, lang }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Teacher>({ ...teacher });
  const allSubjects = getSubjects(lang);

  const handleSave = () => {
    onUpdateProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({ ...teacher });
    setIsEditing(false);
  };

  const toggleSubject = (id: string) => {
    setEditForm(prev => ({
      ...prev,
      subjects: prev.subjects.includes(id) 
        ? prev.subjects.filter(sid => sid !== id) 
        : [...prev.subjects, id]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Карточка профиля */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100 sticky top-24">
            {!isEditing ? (
              <>
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <img src={teacher.photo} alt={teacher.name} className="w-32 h-32 rounded-3xl mx-auto mb-4 border-4 border-sky-50 object-cover shadow-inner" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{teacher.name}</h2>
                  <p className="text-sky-600 font-bold text-sm uppercase tracking-widest mt-1">
                    {lang === 'ru' ? 'Преподаватель' : 'Оқытушы'}
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-black mb-2 tracking-widest">{lang === 'ru' ? 'Предметы' : 'Пәндер'}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {teacher.subjects.map(sid => (
                        <span key={sid} className="bg-sky-50 text-sky-600 px-3 py-1 rounded-lg text-xs font-bold">
                          {allSubjects.find(s => s.id === sid)?.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gray-50 p-2.5 rounded-xl text-gray-400">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{lang === 'ru' ? 'Опыт' : 'Тәжірибе'}</p>
                      <p className="text-gray-900 font-bold">{teacher.experience}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gray-50 p-2.5 rounded-xl text-gray-400">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{lang === 'ru' ? 'Образование' : 'Білім'}</p>
                      <p className="text-gray-900 font-bold">{teacher.education}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-sky-50 p-2.5 rounded-xl text-sky-500">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{lang === 'ru' ? 'Цена' : 'Құны'}</p>
                      <p className="text-sky-600 font-black text-xl">{teacher.pricePerHour} ₸ <span className="text-xs text-gray-400 font-medium">/ сағ</span></p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase font-black mb-2 tracking-widest">{lang === 'ru' ? 'О себе' : 'Өзім туралы'}</p>
                    <p className="text-gray-600 text-sm leading-relaxed font-medium italic">"{teacher.bio}"</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-8 bg-white border-2 border-sky-100 text-sky-600 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-sky-50 hover:border-sky-200 transition-all flex items-center justify-center gap-2"
                >
                  <Edit size={18} /> {lang === 'ru' ? 'Изменить профиль' : 'Өңдеу'}
                </button>
              </>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">{lang === 'ru' ? 'Настройки' : 'Параметрлер'}</h3>
                  <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lang === 'ru' ? 'Имя и Фамилия' : 'Аты-жөні'}</label>
                    <input 
                      type="text" 
                      className="w-full mt-1.5 px-5 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-sky-100 focus:border-sky-500 outline-none transition-all text-sm font-bold"
                      value={editForm.name}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lang === 'ru' ? 'Предметы' : 'Пәндер'}</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {allSubjects.map(s => (
                        <button
                          key={s.id}
                          onClick={() => toggleSubject(s.id)}
                          className={`px-3 py-2 rounded-xl text-[10px] font-black border transition-all ${
                            editForm.subjects.includes(s.id)
                            ? 'bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-100'
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-sky-50'
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lang === 'ru' ? 'Опыт' : 'Тәжірибе'}</label>
                      <input 
                        type="text" 
                        className="w-full mt-1.5 px-5 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-sky-100 focus:border-sky-500 outline-none transition-all text-sm font-bold"
                        value={editForm.experience}
                        onChange={e => setEditForm({...editForm, experience: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lang === 'ru' ? 'Цена' : 'Құны'}</label>
                      <input 
                        type="number" 
                        className="w-full mt-1.5 px-5 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-sky-100 focus:border-sky-500 outline-none transition-all text-sm font-bold"
                        value={editForm.pricePerHour}
                        onChange={e => setEditForm({...editForm, pricePerHour: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lang === 'ru' ? 'Образование' : 'Білім'}</label>
                    <input 
                      type="text" 
                      className="w-full mt-1.5 px-5 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-sky-100 focus:border-sky-500 outline-none transition-all text-sm font-bold"
                      value={editForm.education}
                      onChange={e => setEditForm({...editForm, education: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lang === 'ru' ? 'О себе' : 'Өзім туралы'}</label>
                    <textarea 
                      rows={3}
                      className="w-full mt-1.5 px-5 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-sky-100 focus:border-sky-500 outline-none transition-all text-sm font-bold resize-none"
                      value={editForm.bio}
                      onChange={e => setEditForm({...editForm, bio: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button 
                    onClick={handleSave}
                    className="flex-1 bg-sky-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-sky-600 transition-all shadow-xl shadow-sky-100 flex items-center justify-center gap-2"
                  >
                    <Save size={18} /> {lang === 'ru' ? 'Сохранить' : 'Сақтау'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Лента заявок */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-sky-500 p-2.5 rounded-2xl text-white shadow-lg shadow-sky-100">
              <BookOpen size={24} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{lang === 'ru' ? 'Заявки учеников' : 'Оқушы өтінімдері'}</h2>
          </div>

          <div className="space-y-6">
            {availableApplications.length === 0 ? (
              <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-200 text-center">
                <p className="text-gray-400 font-bold text-lg italic">
                  {lang === 'ru' ? 'Пока нет новых заявок по вашим предметам' : 'Әзірге жаңа өтінімдер жоқ'}
                </p>
              </div>
            ) : (
              availableApplications.map((app) => (
                <div key={app.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 hover:border-sky-100 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 group-hover:text-sky-600 transition-colors">
                        {allSubjects.find(s => s.id === app.subjectId)?.name}
                      </h3>
                      <div className="flex gap-3 mt-2">
                        <span className="bg-sky-50 text-sky-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{app.level}</span>
                        <span className="text-gray-400 text-xs font-bold flex items-center gap-1">
                          <User size={14} /> {app.studentName}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sky-600 font-black text-sm">#{app.id.slice(0, 5).toUpperCase()}</p>
                      <p className="text-gray-300 text-[10px] font-bold uppercase mt-1">{new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">{lang === 'ru' ? 'Контакты' : 'Байланыс'}</p>
                      <p className="text-gray-700 text-sm font-bold truncate">{app.email}</p>
                      <p className="text-gray-500 text-xs font-medium mt-1">{app.phone}</p>
                    </div>
                    <div className="bg-sky-50/50 p-5 rounded-3xl border border-sky-100/50">
                      <p className="text-[10px] text-sky-400 uppercase font-black tracking-widest mb-2">{lang === 'ru' ? 'Расписание' : 'Кесте'}</p>
                      <div className="text-sky-700 text-sm font-bold">
                        <p>{app.preferredTime.date ? new Date(app.preferredTime.date).toLocaleDateString() : '—'} | {app.preferredTime.days.join(', ')}</p>
                        <p className="mt-1 flex items-center gap-1.5"><Clock size={14}/> {app.preferredTime.time} ({app.preferredTime.timezone})</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => onAcceptApplication(app.id)}
                    className="w-full bg-kz-blue text-white py-4.5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-sky-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-sky-100"
                  >
                    <CheckCircle size={20} /> {lang === 'ru' ? 'Связаться с учеником' : 'Хабарласу'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
