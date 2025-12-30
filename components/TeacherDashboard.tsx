
import React, { useState } from 'react';
import { Teacher, StudentApplication, ApplicationStatus } from '../types';
import { SUBJECTS, getSubjects } from '../constants';
import { User, Briefcase, GraduationCap, DollarSign, List, CheckCircle, Edit, Save, X } from 'lucide-react';

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
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
            {!isEditing ? (
              <>
                <div className="text-center mb-8">
                  <img src={teacher.photo} alt={teacher.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-sky-50 object-cover" />
                  <h2 className="text-2xl font-bold text-gray-900">{teacher.name}</h2>
                  <p className="text-sky-600 font-medium">{lang === 'ru' ? 'Преподаватель' : 'Оқытушы'}</p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {teacher.subjects.map(sid => (
                      <span key={sid} className="bg-sky-50 text-sky-600 px-2 py-0.5 rounded text-[10px] font-bold">
                        {SUBJECTS.find(s => s.id === sid)?.name}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-start gap-3">
                    <Briefcase className="text-gray-400 mt-1" size={20} />
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold">{lang === 'ru' ? 'Опыт' : 'Тәжірибе'}</p>
                      <p className="text-gray-900 font-medium">{teacher.experience}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <GraduationCap className="text-gray-400 mt-1" size={20} />
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold">{lang === 'ru' ? 'Образование' : 'Білім'}</p>
                      <p className="text-gray-900 font-medium">{teacher.education}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="text-gray-400 mt-1" size={20} />
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold">{lang === 'ru' ? 'Стоимость урока' : 'Сабақ құны'}</p>
                      <p className="text-gray-900 font-medium">{teacher.pricePerHour} {lang === 'ru' ? '₸ / час' : '₸ / сағат'}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-50">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-2">{lang === 'ru' ? 'О себе' : 'Өзім туралы'}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{teacher.bio}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-8 border-2 border-sky-50 py-3 rounded-xl font-bold text-sky-600 hover:bg-sky-50 hover:border-sky-100 transition-all flex items-center justify-center gap-2"
                >
                  <Edit size={18} /> {lang === 'ru' ? 'Редактировать профиль' : 'Профильді өңдеу'}
                </button>
              </>
            ) : (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{lang === 'ru' ? 'Редактирование' : 'Өңдеу'}</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">{lang === 'ru' ? 'Имя и Фамилия' : 'Аты-жөні'}</label>
                    <input 
                      type="text" 
                      className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm"
                      value={editForm.name}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">{lang === 'ru' ? 'Предметы' : 'Пәндер'}</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {allSubjects.map(s => (
                        <button
                          key={s.id}
                          onClick={() => toggleSubject(s.id)}
                          className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                            editForm.subjects.includes(s.id)
                            ? 'bg-sky-500 border-sky-500 text-white'
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-sky-50'
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">{lang === 'ru' ? 'Опыт' : 'Тәжірибе'}</label>
                    <input 
                      type="text" 
                      className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm"
                      value={editForm.experience}
                      onChange={e => setEditForm({...editForm, experience: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">{lang === 'ru' ? 'Образование' : 'Білім'}</label>
                    <input 
                      type="text" 
                      className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm"
                      value={editForm.education}
                      onChange={e => setEditForm({...editForm, education: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">{lang === 'ru' ? 'Стоимость (₸ / час)' : 'Құны (₸ / сағат)'}</label>
                    <input 
                      type="number" 
                      className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm"
                      value={editForm.pricePerHour}
                      onChange={e => setEditForm({...editForm, pricePerHour: parseInt(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">{lang === 'ru' ? 'О себе' : 'Өзім туралы'}</label>
                    <textarea 
                      rows={3}
                      className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm resize-none"
                      value={editForm.bio}
                      onChange={e => setEditForm({...editForm, bio: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button 
                    onClick={handleSave}
                    className="flex-1 bg-sky-500 text-white py-3 rounded-xl font-bold hover:bg-sky-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={18} /> {lang === 'ru' ? 'Сохранить' : 'Сақтау'}
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="bg-gray-100 text-gray-500 p-3 rounded-xl hover:bg-gray-200 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Applications Feed */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-8">
            <List className="text-sky-600" />
            <h2 className="text-2xl font-bold text-gray-900">{lang === 'ru' ? 'Доступные заявки' : 'Қолжетімді өтінімдер'}</h2>
          </div>

          <div className="space-y-6">
            {availableApplications.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
                <p className="text-gray-500 font-medium">
                  {lang === 'ru' ? 'Пока нет подходящих заявок в вашем регионе' : 'Қазіргі уақытта сіздің өңіріңізде қолайлы өтінімдер жоқ'}
                </p>
              </div>
            ) : (
              availableApplications.map((app) => (
                <div key={app.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:border-sky-100 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {SUBJECTS.find(s => s.id === app.subjectId)?.name}
                      </h3>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-0.5 rounded uppercase font-bold tracking-tight text-[10px]">{app.level}</span>
                        <span>{lang === 'ru' ? 'Ученик' : 'Оқушы'}: {app.studentName}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sky-600 font-bold">{lang === 'ru' ? 'Заявка' : 'Өтінім'} #{app.id.slice(0, 5)}</p>
                      <p className="text-gray-400 text-xs">{new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">{lang === 'ru' ? 'Сведения' : 'Мәліметтер'}</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{lang === 'ru' ? 'Уровень' : 'Деңгей'}: {app.level}</p>
                      <p className="text-gray-700 text-sm leading-relaxed">Email: {app.email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">{lang === 'ru' ? 'Желаемое время' : 'Қалаулы уақыт'}</p>
                      <div className="text-gray-700 text-sm leading-relaxed">
                        <p>{app.preferredTime.date ? new Date(app.preferredTime.date).toLocaleDateString() : '—'} | {app.preferredTime.days.join(', ')}</p>
                        <p>{app.preferredTime.time} ({app.preferredTime.timezone})</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => onAcceptApplication(app.id)}
                    className="w-full bg-sky-500 text-white py-4 rounded-xl font-bold hover:bg-sky-600 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <CheckCircle size={20} /> {lang === 'ru' ? 'Принять заявку и связаться' : 'Өтінімді қабылдау және байланысу'}
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
