
import React from 'react';
import { getSubjects, ICON_MAP } from '../constants';
import { translations } from '../translations';
import { ArrowRight, CheckCircle, Star, Users, Video, MessageCircle } from 'lucide-react';

interface LandingPageProps {
  lang: 'ru' | 'kk';
  onApply: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ lang, onApply }) => {
  const t = translations[lang];
  const subjects = getSubjects(lang);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wide text-sky-600 uppercase bg-sky-50 rounded-full border border-sky-100">
              {t.hero.badge}
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              {t.hero.title} <span className="text-sky-500">{t.hero.titleAccent}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={onApply}
                className="bg-sky-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-sky-600 transition-all shadow-lg hover:shadow-sky-200 flex items-center justify-center gap-2"
              >
                {t.hero.ctaPrimary} <ArrowRight size={20} />
              </button>
              <button className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                {t.hero.ctaSecondary}
              </button>
            </div>
          </div>
        </div>
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sky-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-200 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-sky-500">500+</p>
              <p className="text-gray-500 text-sm mt-1">{t.stats.teachers}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-sky-500">10k+</p>
              <p className="text-gray-500 text-sm mt-1">{t.stats.students}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-sky-500">4.9/5</p>
              <p className="text-gray-500 text-sm mt-1">{t.stats.rating}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-sky-500">24/7</p>
              <p className="text-gray-500 text-sm mt-1">{t.stats.support}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">{t.subjects.title}</h2>
            <p className="text-lg text-gray-600">{t.subjects.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject) => (
              <div 
                key={subject.id} 
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-sky-200 hover:shadow-md transition-all group cursor-pointer"
                onClick={onApply}
              >
                <div className="bg-sky-50 text-sky-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  {ICON_MAP[subject.icon]}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{subject.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{subject.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white relative">
         <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">{t.howItWorks.title}</h2>
            <p className="text-lg text-gray-600">{t.howItWorks.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <MessageCircle size={32} />, title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc },
              { icon: <Users size={32} />, title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc },
              { icon: <Video size={32} />, title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc },
            ].map((step, idx) => (
              <div key={idx} className="relative text-center">
                <div className="bg-sky-50 text-sky-500 w-20 h-20 rounded-2xl rotate-3 border-2 border-sky-100 flex items-center justify-center mx-auto mb-8 relative z-10">
                  <div className="-rotate-3">{step.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-sky-500 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none translate-x-1/2 -translate-y-1/2">
             <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="white"/></svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl mb-6">{lang === 'ru' ? 'Почему выбирают нас?' : 'Неліктен бізді таңдайды?'}</h2>
              <div className="space-y-6">
                {[
                  lang === 'ru' ? 'Индивидуальный подход' : 'Жеке көзқарас',
                  lang === 'ru' ? 'Проверенные преподаватели' : 'Тексерілген мұғалімдер',
                  lang === 'ru' ? 'Удобная видео-платформа' : 'Ыңғайлы видео-платформа',
                  lang === 'ru' ? 'Гибкий график обучения' : 'Оқудың икемді кестесі'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="text-yellow-400 mt-1 flex-shrink-0" size={24} />
                    <p className="text-lg text-sky-50">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-6">
              {[
                { name: 'Мария К.', text: 'Благодаря EduMarket я подготовилась к IELTS всего за 2 месяца!', rating: 5 },
                { name: 'Арман С.', text: 'Математика мұғалімі өте білімді. Сабақтар қызықты өтеді.', rating: 5 },
              ].map((review, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                  <div className="flex gap-1 mb-4 text-yellow-400">
                    {[...Array(review.rating)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-lg italic mb-4">"{review.text}"</p>
                  <p className="font-bold text-yellow-300">— {review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
