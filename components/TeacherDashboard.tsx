
import React, { useState } from 'react';
import { Teacher, StudentApplication, ApplicationStatus } from '../types';
import { SUBJECTS, getSubjects } from '../constants';
import { User, Briefcase, GraduationCap, DollarSign, List, CheckCircle, Edit, Save, X, BookOpen, Clock, Video, Calendar, AlertCircle } from 'lucide-react';

interface TeacherDashboardProps {
  teacher: Teacher;
  availableApplications: StudentApplication[];
  myLessons: StudentApplication[];
  onAcceptApplication: (appId: string) => void;
  onConfirmLesson: (appId: string) => void;
  onJoinLesson: (roomId: string) => void;
  onUpdateProfile: (updatedTeacher: Teacher) => void;
  lang: 'ru' | 'kk';
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  teacher, 
  availableApplications, 
  myLessons,
  onAcceptApplication, 
  onConfirmLesson,
  onJoinLesson,
  onUpdateProfile, 
  lang 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'lessons' | 'requests'>('lessons');
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
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Профиль учителя */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100 sticky top-24">
            {!isEditing ? (
              <>
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <img src={teacher.photo} alt={teacher.name} className="w-28 h-28 rounded-3xl mx-auto mb-4 border-4 border-sky-50 object-cover shadow-inner" />
                  </div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">{teacher.name}</h2>
                  <p className="text-sky-500 font-bold text-[10px] uppercase tracking-widest mt-1">
                    {lang === 'ru' ? 'Преподаватель' : 'Оқытушы'}
                  </p>
                </div>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="bg-gray-50 p-2 rounded-xl text-gray-400"><Briefcase size={16} /></div>
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">{lang === 'ru' ? 'Опыт' : 'Тәжірибе'}</p>
                      <p className="text-gray-900 font-bold text-xs">{teacher.experience}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-sky-50 p-2 rounded-xl text-sky-500"><DollarSign size={16} /></div>
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">{lang === 'ru' ? 'Ставка' : 'Құны'}</p>
                      <p className="text-sky-600 font-black text-sm">{teacher.pricePerHour} ₸</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-8 bg-gray-50 text-gray-500 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-sky-50 hover:text-sky-600 transition-all border border-transparent hover:border-sky-100 flex items-center justify-center gap-2"
                >
                  <Edit size={14} /> {lang === 'ru' ? 'Настройки' : 'Параметрлер'}
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Профиль</h3>
                  <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                </div>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-sky-500 outline-none transition-all text-xs font-bold"
                  value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  placeholder="Имя"
                />
                <textarea 
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-sky-500 outline-none transition-all text-xs font-bold resize-none"
                  value={editForm.bio}
                  onChange={e => setEditForm({...editForm, bio: e.target.value})}
                  placeholder="О себе"
                />
                <button 
                  onClick={handleSave}
                  className="w-full bg-sky-500 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-sky-600 transition-all shadow-lg shadow-sky-100 flex items-center justify-center gap-2"
                >
                  <Save size={14} /> {lang === 'ru' ? 'Сохранить' : 'Сақтау'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Основной контент */}
        <div className="lg:col-span-3">
          <div className="flex bg-gray-200 p-1 rounded-2xl mb-8 w-fit shadow-inner">
            <button 
              onClick={() => setActiveTab('lessons')}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'lessons' ? 'bg-white text-sky-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Calendar size={14} className="inline mr-2" />
              {lang === 'ru' ? 'Мои уроки' : 'Менің сабақтарым'}
              {myLessons.length > 0 && <span className="ml-2 bg-sky-500 text-white px-1.5 py-0.5 rounded-md text-[8px]">{myLessons.length}</span>}
            </button>
            <button 
              onClick={() => setActiveTab('requests')}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'requests' ? 'bg-white text-sky-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List size={14} className="inline mr-2" />
              {lang === 'ru' ? 'Новые заявки' : 'Жаңа өтінімдер'}
              {availableApplications.length > 0 && <span className="ml-2 bg-amber-500 text-white px-1.5 py-0.5 rounded-md text-[8px]">{availableApplications.length}</span>}
            </button>
          </div>

          {activeTab === 'lessons' ? (
            <div className="grid md:grid-cols-2 gap-6">
              {myLessons.length === 0 ? (
                <div className="col-span-2 bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
                  <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                    <Calendar size={40} />
                  </div>
                  <p className="text-gray-400 font-bold italic">
                    {lang === 'ru' ? 'Запланированных уроков пока нет' : 'Жоспарланған сабақтар әлі жоқ'}
                  </p>
                </div>
              ) : (
                myLessons.map((app) => (
                  <div key={app.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 hover:border-sky-100 transition-all flex flex-col h-full group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500">
                          <User size={24} />
                        </div>
                        <div>
                          <h3 className="font-black text-gray-900 group-hover:text-sky-600 transition-colors">
                            {app.studentName}
                          </h3>
                          <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                            {allSubjects.find(s => s.id === app.subjectId)?.name}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        app.status === ApplicationStatus.SCHEDULED ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {app.status === ApplicationStatus.SCHEDULED ? 'Подтвержден' : 'Ожидает'}
                      </span>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 mb-6 flex-grow">
                      <div className="flex items-center gap-3 text-gray-600 font-bold text-xs mb-3">
                        <Clock size={16} className="text-sky-400" />
                        {app.preferredTime.date ? new Date(app.preferredTime.date).toLocaleDateString() : 'Дата уточняется'} • {app.preferredTime.time}
                      </div>
                      <div className="flex items-center gap-3 text-gray-400 font-medium text-[10px]">
                        <AlertCircle size={14} className="text-gray-300" />
                        Уровень: {app.level === 'beginner' ? 'Начальный' : app.level === 'intermediate' ? 'Средний' : 'Продвинутый'}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {app.status !== ApplicationStatus.SCHEDULED ? (
                        <button 
                          onClick={() => onConfirmLesson(app.id)}
                          className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={16} /> Подтвердить
                        </button>
                      ) : (
                        <button 
                          onClick={() => onJoinLesson(app.lessonRoomId || `room-${app.id}`)}
                          className="flex-1 bg-sky-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-sky-600 transition-all shadow-xl shadow-sky-100 flex items-center justify-center gap-2"
                        >
                          <Video size={16} /> Войти в класс
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {availableApplications.length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
                  <p className="text-gray-400 font-bold italic">
                    {lang === 'ru' ? 'Пока нет новых запросов на обучение' : 'Әзірге оқуға жаңа сұраныстар жоқ'}
                  </p>
                </div>
              ) : (
                availableApplications.map((app) => (
                  <div key={app.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 hover:border-sky-100 transition-all group">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-6">
                        <div className="bg-sky-50 p-4 rounded-3xl text-sky-500">
                          <BookOpen size={30} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-gray-900">
                            {allSubjects.find(s => s.id === app.subjectId)?.name}
                          </h3>
                          <div className="flex gap-3 mt-1">
                            <span className="bg-sky-50 text-sky-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{app.level}</span>
                            <span className="text-gray-400 text-xs font-bold flex items-center gap-1">
                              <User size={14} /> {app.studentName}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => onAcceptApplication(app.id)}
                        className="bg-kz-blue text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-600 transition-all shadow-xl shadow-sky-100 flex items-center gap-2"
                      >
                        Принять заявку
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
