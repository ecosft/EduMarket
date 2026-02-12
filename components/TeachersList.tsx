
import React from 'react';
import { Teacher, Subject } from '../types';
import { Search, GraduationCap, Clock, Award, ArrowLeft } from 'lucide-react';

interface TeachersListProps {
  teachers: Teacher[];
  subjects: Subject[];
  lang: 'ru' | 'kk';
  onBack: () => void;
  onApply: () => void;
}

const TeachersList: React.FC<TeachersListProps> = ({ teachers, subjects, lang, onBack, onApply }) => {
  const getSubjectNames = (subjectIds: string[]) => {
    return subjectIds
      .map(id => subjects.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-sky-500 font-bold text-sm transition-colors mb-4"
          >
            <ArrowLeft size={16} /> {lang === 'ru' ? 'Назад' : 'Артқа'}
          </button>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            {lang === 'ru' ? 'Наши преподаватели' : 'Біздің мұғалімдер'}
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            {lang === 'ru' ? 'Лучшие эксперты Казахстана в одном месте' : 'Қазақстанның үздік сарапшылары бір жерде'}
          </p>
        </div>
        
        <button 
          onClick={onApply}
          className="bg-kz-blue text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-sky-600 transition-all shadow-xl shadow-sky-100"
        >
          {lang === 'ru' ? 'Подобрать учителя' : 'Мұғалімді таңдау'}
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                <th className="px-8 py-6">{lang === 'ru' ? 'ФИО Преподавателя' : 'Мұғалімнің аты-жөні'}</th>
                <th className="px-8 py-6">{lang === 'ru' ? 'Возраст' : 'Жасы'}</th>
                <th className="px-8 py-6">{lang === 'ru' ? 'Предметы' : 'Пәндер'}</th>
                <th className="px-8 py-6">{lang === 'ru' ? 'Опыт работы' : 'Жұмыс тәжірибесі'}</th>
                <th className="px-8 py-6">{lang === 'ru' ? 'Образование' : 'Білімі'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img 
                        src={teacher.photo} 
                        alt={teacher.name} 
                        className="w-12 h-12 rounded-2xl object-cover shadow-sm group-hover:scale-110 transition-transform"
                      />
                      <div>
                        <p className="font-black text-gray-900 text-sm">{teacher.name}</p>
                        <p className="text-[10px] text-sky-500 font-bold uppercase mt-0.5 tracking-tight">Active Mentor</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-gray-700 font-bold text-sm">
                      {teacher.age} {lang === 'ru' ? 'лет' : 'жаста'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map(sid => (
                        <span key={sid} className="bg-sky-50 text-sky-600 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                          {subjects.find(s => s.id === sid)?.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-gray-700 font-bold text-sm">
                      <Clock size={16} className="text-sky-400" />
                      {teacher.experience}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-gray-500 font-medium text-xs">
                      <GraduationCap size={16} className="text-gray-300" />
                      {teacher.education}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 text-center bg-sky-50 p-8 rounded-[2rem] border border-sky-100">
        <p className="text-sky-700 font-bold mb-4">
          {lang === 'ru' ? 'Не нашли подходящего учителя?' : 'Сәйкес мұғалімді таппадыңыз ба?'}
        </p>
        <p className="text-sky-600/70 text-sm mb-6 max-w-lg mx-auto">
          {lang === 'ru' 
            ? 'Оставьте заявку, и наш методист бесплатно подберет преподавателя под ваши цели и уровень знаний.' 
            : 'Өтінім қалдырыңыз, біздің әдіскер мақсаттарыңыз бен білім деңгейіңізге сәйкес мұғалімді тегін таңдап береді.'}
        </p>
        <button 
          onClick={onApply}
          className="bg-white text-sky-600 px-10 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:shadow-lg transition-all border-2 border-sky-200"
        >
          {lang === 'ru' ? 'Оставить заявку' : 'Өтінім қалдыру'}
        </button>
      </div>
    </div>
  );
};

export default TeachersList;
