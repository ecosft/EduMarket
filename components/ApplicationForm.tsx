
import React, { useState } from 'react';
import { getSubjects } from '../constants';
import { translations } from '../translations';
import { Send, CheckCircle2, Calendar as CalendarIcon, Clock as ClockIcon, MapPin } from 'lucide-react';

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
    email: '',
    phone: '',
    subjectId: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    preferredTime: {
      date: '',
      days: [] as string[],
      time: '',
      timezone: 'ALMT' as 'MSK' | 'ALMT'
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setIsSubmitted(true);
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      preferredTime: {
        ...prev.preferredTime,
        days: prev.preferredTime.days.includes(day)
          ? prev.preferredTime.days.filter(d => d !== day)
          : [...prev.preferredTime.days, day]
      }
    }));
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
        <div className="bg-kz-blue p-8 text-white text-center relative overflow-hidden">
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
              <label className="text-sm font-semibold text-gray-700">{t.form.email}</label>
              <input 
                required
                type="email" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">{t.form.phone}</label>
              <input 
                required
                type="tel" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
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

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ClockIcon size={20} className="text-sky-500" /> {t.form.time}
            </h3>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <CalendarIcon size={14} /> {t.form.date}
                </label>
                <input 
                  required
                  type="date" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                  value={formData.preferredTime.date}
                  onChange={e => setFormData({
                    ...formData, 
                    preferredTime: { ...formData.preferredTime, date: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <ClockIcon size={14} /> {lang === 'ru' ? 'Удобное время (например, 18:00 - 20:00)' : 'Ыңғайлы уақыт'}
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="18:00 - 20:00"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                  value={formData.preferredTime.time}
                  onChange={e => setFormData({
                    ...formData, 
                    preferredTime: { ...formData.preferredTime, time: e.target.value }
                  })}
                />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-sm font-semibold text-gray-700">{t.form.days}</label>
              <div className="flex flex-wrap gap-2">
                {t.form.weekdays.map((day, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`w-12 h-12 rounded-xl border text-sm font-bold transition-all ${
                      formData.preferredTime.days.includes(day)
                        ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-100'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-sky-200 hover:bg-sky-50'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin size={14} /> {t.form.timezone}
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    preferredTime: { ...formData.preferredTime, timezone: 'ALMT' }
                  })}
                  className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                    formData.preferredTime.timezone === 'ALMT'
                      ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-100'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-sky-200 hover:bg-sky-50'
                  }`}
                >
                  {t.form.astanaTime}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    preferredTime: { ...formData.preferredTime, timezone: 'MSK' }
                  })}
                  className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                    formData.preferredTime.timezone === 'MSK'
                      ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-100'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-sky-200 hover:bg-sky-50'
                  }`}
                >
                  {t.form.moscowTime}
                </button>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-kz-blue text-white py-5 rounded-2xl font-bold text-lg hover:bg-sky-600 transition-all shadow-xl shadow-sky-100 flex items-center justify-center gap-2 mt-8"
          >
            <Send size={20} /> {t.form.submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
