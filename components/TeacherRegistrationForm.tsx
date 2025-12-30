
import React, { useState } from 'react';
import { getSubjects } from '../constants';
import { translations } from '../translations';
import { UserCheck, CheckCircle2, ChevronRight, Briefcase, GraduationCap, Phone } from 'lucide-react';

interface TeacherRegistrationFormProps {
  lang: 'ru' | 'kk';
  onSubmit: (data: any) => void;
}

const TeacherRegistrationForm: React.FC<TeacherRegistrationFormProps> = ({ lang, onSubmit }) => {
  const t = translations[lang];
  const subjects = getSubjects(lang);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    experience: '',
    employment: '',
    subjectIds: [] as string[],
    bio: '',
    contact: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setIsSubmitted(true);
  };

  const toggleSubject = (id: string) => {
    setFormData(prev => ({
      ...prev,
      subjectIds: prev.subjectIds.includes(id) 
        ? prev.subjectIds.filter(sid => sid !== id) 
        : [...prev.subjectIds, id]
    }));
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-sky-100 text-sky-600 rounded-3xl mb-8 rotate-3">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.teacherForm.successTitle}</h2>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-md mx-auto">{t.teacherForm.successDesc}</p>
        <button 
          onClick={() => window.location.hash = '#landing'}
          className="bg-sky-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-sky-600 transition-all shadow-lg hover:shadow-sky-200"
        >
          {lang === 'ru' ? 'Вернуться на главную' : 'Басты бетке қайту'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-sky-100 overflow-hidden border border-gray-100">
        <div className="bg-kz-blue p-10 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4">
               <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="white"/>
               </svg>
           </div>
          <div className="relative z-10 flex items-center gap-6">
            <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
              <UserCheck size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-1">{t.teacherForm.title}</h2>
              <p className="text-sky-50 opacity-90">{t.teacherForm.subtitle}</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                {t.teacherForm.firstName}
              </label>
              <input 
                required
                type="text" 
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-sky-100 focus:border-sky-500 outline-none transition-all text-gray-800"
                value={formData.firstName}
                onChange={e => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">{t.teacherForm.lastName}</label>
              <input 
                required
                type="text" 
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-sky-100 focus:border-sky-500 outline-none transition-all text-gray-800"
                value={formData.lastName}
                onChange={e => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Briefcase size={16} /> {t.teacherForm.experience}
              </label>
              <input 
                required
                type="number" 
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-sky-100 focus:border-sky-500 outline-none transition-all text-gray-800"
                value={formData.experience}
                onChange={e => setFormData({...formData, experience: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <GraduationCap size={16} /> {t.teacherForm.employment}
              </label>
              <input 
                required
                type="text" 
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-sky-100 focus:border-sky-500 outline-none transition-all text-gray-800"
                value={formData.employment}
                onChange={e => setFormData({...formData, employment: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-700 block">{t.teacherForm.subjects}</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {subjects.map(s => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => toggleSubject(s.id)}
                  className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all ${
                    formData.subjectIds.includes(s.id)
                    ? 'bg-sky-500 border-sky-500 text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-sky-300 hover:bg-sky-50'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block">{t.teacherForm.bio}</label>
            <textarea 
              required
              rows={4}
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-sky-100 focus:border-sky-500 outline-none transition-all text-gray-800 resize-none"
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Phone size={16} /> {t.teacherForm.contact}
            </label>
            <input 
              required
              type="text" 
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-sky-100 focus:border-sky-500 outline-none transition-all text-gray-800"
              value={formData.contact}
              onChange={e => setFormData({...formData, contact: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-kz-blue text-white py-5 rounded-[1.5rem] font-bold text-xl hover:bg-sky-600 transition-all shadow-xl shadow-sky-100 flex items-center justify-center gap-3 mt-6"
          >
            {t.teacherForm.submit} <ChevronRight size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherRegistrationForm;
