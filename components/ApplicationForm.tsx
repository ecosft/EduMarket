
import React, { useState } from 'react';
import { getSubjects } from '../constants';
import { translations } from '../translations';
import { Send, CheckCircle2 } from 'lucide-react';

interface ApplicationFormProps {
  lang: 'ru' | 'kk';
  onSubmit: (data: any) => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ lang, onSubmit }) => {
  const t = translations[lang];
  const subjects = getSubjects(lang);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    subjectId: '',
    goal: '',
    level: 'beginner',
    preferredTime: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.form.successTitle}</h2>
        <p className="text-gray-600 text-lg mb-8">{t.form.successDesc}</p>
        <button 
          onClick={() => window.location.hash = '#dashboard'}
          className="bg-sky-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-sky-600 transition-all shadow-md"
        >
          {t.form.backToDashboard}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-sky-500 p-8 text-white text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none translate-x-1/2 -translate-y-1/2">
               <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="white"/></svg>
           </div>
          <h2 className="text-3xl font-bold mb-2 relative z-10">{t.form.title}</h2>
          <p className="text-sky-50 relative z-10">{t.form.subtitle}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">{t.form.name}</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">{t.form.contact}</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                value={formData.contact}
                onChange={e => setFormData({...formData, contact: e.target.value})}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">{t.form.subject}</label>
              <select 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                value={formData.subjectId}
                onChange={e => setFormData({...formData, subjectId: e.target.value})}
              >
                <option value="">{lang === 'ru' ? 'Выберите предмет' : 'Пәнді таңдаңыз'}</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">{t.form.level}</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                value={formData.level}
                onChange={e => setFormData({...formData, level: e.target.value as any})}
              >
                <option value="beginner">{lang === 'ru' ? 'Начальный' : 'Бастапқы'}</option>
                <option value="intermediate">{lang === 'ru' ? 'Средний' : 'Орташа'}</option>
                <option value="advanced">{lang === 'ru' ? 'Продвинутый' : 'Жоғары'}</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t.form.goal}</label>
            <textarea 
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
              value={formData.goal}
              onChange={e => setFormData({...formData, goal: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t.form.time}</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
              value={formData.preferredTime}
              onChange={e => setFormData({...formData, preferredTime: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-sky-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-sky-600 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Send size={20} /> {t.form.submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
