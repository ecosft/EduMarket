
import React from 'react';
import { getSubjects, ICON_MAP } from '../constants';
import { translations } from '../translations';
import { ArrowRight, CheckCircle, Star, Users, Video, MessageCircle, ShieldCheck, Zap, Heart } from 'lucide-react';

interface LandingPageProps {
  lang: 'ru' | 'kk';
  onApply: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ lang, onApply }) => {
  const t = translations[lang];
  const subjects = getSubjects(lang);

  const benefits = [
    { icon: <ShieldCheck className="w-8 h-8 text-sky-500" />, title: lang === 'ru' ? 'Проверенные учителя' : 'Тексерілген мұғалімдер', desc: lang === 'ru' ? 'Каждый преподаватель проходит строгий отбор и подтверждает квалификацию.' : 'Әрбір мұғалім қатаң іріктеуден өтіп, біліктілігін растайды.' },
    { icon: <Zap className="w-8 h-8 text-yellow-500" />, title: lang === 'ru' ? 'Быстрый старт' : 'Жылдам бастау', desc: lang === 'ru' ? 'Найдем подходящего учителя в течение 24 часов после вашей заявки.' : 'Өтінімнен кейін 24 сағат ішінде лайықты мұғалім табамыз.' },
    { icon: <Heart className="w-8 h-8 text-rose-500" />, title: lang === 'ru' ? 'Забота об ученике' : 'Оқушыға қамқорлық', desc: lang === 'ru' ? 'Индивидуальная программа обучения под ваши цели и уровень.' : 'Сіздің мақсаттарыңыз бен деңгейіңізге арналған жеке оқу бағдарламасы.' },
  ];

  const faqs = [
    { q: lang === 'ru' ? 'Как проходит первый урок?' : 'Бірінші сабақ қалай өтеді?', a: lang === 'ru' ? 'Первый урок вводный, на нем учитель определяет ваш уровень и составляет план.' : 'Бірінші сабақ кіріспе болып табылады, онда мұғалім сіздің деңгейіңізді анықтап, жоспар құрады.' },
    { q: lang === 'ru' ? 'Можно ли сменить учителя?' : 'Мұғалімді ауыстыруға бола ма?', a: lang === 'ru' ? 'Да, вы можете сменить преподавателя в любой момент без потери прогресса.' : 'Иә, сіз кез келген уақытта мұғалімді ауыстыра аласыз.' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wide text-sky-600 uppercase bg-sky-50 rounded-full border border-sky-100">
            {t.hero.badge}
          </span>
          <h1 className="text-4xl sm:text-7xl font-black text-gray-900 tracking-tight mb-8">
            {t.hero.title} <span className="text-sky-500">{t.hero.titleAccent}</span>
          </h1>
          <p className="text-xl text-gray-500 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button 
              onClick={onApply}
              className="bg-kz-blue text-white px-10 py-5 rounded-2xl text-lg font-black hover:bg-sky-600 transition-all shadow-2xl shadow-sky-200 flex items-center justify-center gap-2"
            >
              {t.hero.ctaPrimary} <ArrowRight size={24} />
            </button>
            <button className="bg-white text-gray-700 border-2 border-gray-100 px-10 py-5 rounded-2xl text-lg font-black hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              {t.hero.ctaSecondary}
            </button>
          </div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sky-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-200 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:scale-105 transition-transform">
                <div className="mb-6">{benefit.icon}</div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{benefit.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">{t.subjects.title}</h2>
            <p className="text-lg text-gray-500 font-medium">{t.subjects.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {subjects.map((subject) => (
              <div 
                key={subject.id} 
                className="bg-white p-8 rounded-[2rem] border border-gray-100 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100 transition-all group cursor-pointer"
                onClick={onApply}
              >
                <div className="bg-sky-50 text-sky-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-sky-500 group-hover:text-white transition-all transform group-hover:rotate-6">
                  {ICON_MAP[subject.icon]}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{subject.name}</h3>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">{subject.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">{t.howItWorks.title}</h2>
            <p className="text-lg text-gray-500 font-medium">{t.howItWorks.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { icon: <MessageCircle size={40} />, title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc, num: "01" },
              { icon: <Users size={40} />, title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc, num: "02" },
              { icon: <Video size={40} />, title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc, num: "03" },
            ].map((step, idx) => (
              <div key={idx} className="relative group text-center">
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-8xl font-black text-gray-100 group-hover:text-sky-50 transition-colors -z-0">
                  {step.num}
                </span>
                <div className="bg-white text-sky-500 w-24 h-24 rounded-3xl shadow-xl shadow-sky-100 flex items-center justify-center mx-auto mb-8 relative z-10 border border-sky-50 transform group-hover:rotate-6 transition-all">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 relative z-10">{step.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center tracking-tight">FAQ</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h4 className="text-xl font-bold text-gray-900 mb-3">{faq.q}</h4>
                <p className="text-gray-500 font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-kz-blue text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-black mb-8 tracking-tight">{lang === 'ru' ? 'С нами учатся тысячи' : 'Мыңдаған адам бізбен оқиды'}</h2>
              <p className="text-sky-50 text-xl font-medium mb-10 leading-relaxed opacity-80">
                {lang === 'ru' ? 'От школьников до профессионалов — Oku.kz помогает достигать целей быстрее.' : 'Мектеп оқушыларынан бастап кәсіби мамандарға дейін — Oku.kz мақсаттарға жылдам жетуге көмектеседі.'}
              </p>
              <button onClick={onApply} className="bg-white text-sky-600 px-10 py-5 rounded-2xl font-black text-xl hover:bg-sky-50 transition-all shadow-2xl">
                {lang === 'ru' ? 'Присоединиться' : 'Қосылу'}
              </button>
            </div>
            <div className="grid gap-8">
              {[
                { name: 'Мария К.', text: 'Благодаря Oku.kz я подготовилась к IELTS всего за 2 месяца! Учитель был просто супер.', rating: 5 },
                { name: 'Арман С.', text: 'Математика мұғалімі өте білімді. Сабақтар қызықты өтеді, бәрі түсінікті.', rating: 5 },
              ].map((review, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/20">
                  <div className="flex gap-1 mb-6 text-yellow-400">
                    {[...Array(review.rating)].map((_, j) => <Star key={j} size={20} fill="currentColor" />)}
                  </div>
                  <p className="text-xl italic font-medium mb-6 leading-relaxed">"{review.text}"</p>
                  <p className="font-black text-white text-lg">— {review.name}</p>
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
