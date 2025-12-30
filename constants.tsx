
import React from 'react';
import { Book, Calculator, FlaskConical, Globe, Code, Music, Languages, BrainCircuit } from 'lucide-react';
import { Subject, Teacher } from './types';

export const getSubjects = (lang: 'ru' | 'kk'): Subject[] => [
  { id: '1', name: lang === 'ru' ? 'Английский язык' : 'Ағылшын тілі', description: lang === 'ru' ? 'Разговорный и бизнес' : 'Ауызекі сөйлеу және бизнес', icon: 'Languages' },
  { id: '2', name: lang === 'ru' ? 'Математика' : 'Математика', description: lang === 'ru' ? 'Алгебра и геометрия' : 'Алгебра және геометрия', icon: 'Calculator' },
  { id: '3', name: lang === 'ru' ? 'Физика' : 'Физика', description: lang === 'ru' ? 'Школьная программа' : 'Мектеп бағдарламасы', icon: 'BrainCircuit' },
  { id: '4', name: lang === 'ru' ? 'Химия' : 'Химия', description: lang === 'ru' ? 'Органическая химия' : 'Органикалық химия', icon: 'FlaskConical' },
  { id: '5', name: lang === 'ru' ? 'Биология' : 'Биология', description: lang === 'ru' ? 'Анатомия и генетика' : 'Анатомия және генетика', icon: 'Book' },
  { id: '6', name: lang === 'ru' ? 'Информатика' : 'Информатика', description: lang === 'ru' ? 'Программирование' : 'Бағдарламалау', icon: 'Code' },
  { id: '7', name: lang === 'ru' ? 'IELTS' : 'IELTS', description: lang === 'ru' ? 'Подготовка к тестам' : 'Тесттерге дайындық', icon: 'Globe' },
  { id: '8', name: lang === 'ru' ? 'Музыка' : 'Музыка', description: lang === 'ru' ? 'Теория и вокал' : 'Теория және вокал', icon: 'Music' },
];

export const MOCK_TEACHERS: Teacher[] = [
  {
    id: 't1',
    name: 'Александр Иванов',
    photo: 'https://ui-avatars.com/api/?name=Alex+Ivanov&background=00afca&color=fff&size=200',
    subjects: ['1', '7'],
    experience: '8 лет',
    education: 'МГУ им. Ломоносова, Филологический факультет',
    pricePerHour: 4500,
    bio: 'Специализируюсь на ускоренной подготовке к IELTS и TOEFL. Мои ученики получают в среднем 7.5 баллов.',
    status: 'active'
  },
  {
    id: 't2',
    name: 'Елена Смирнова',
    photo: 'https://ui-avatars.com/api/?name=Elena+Smirnova&background=f8cc46&color=fff&size=200',
    subjects: ['2', '6'],
    experience: '5 лет',
    education: 'МФТИ, Кафедра высшей математики',
    pricePerHour: 3500,
    bio: 'Помогаю полюбить математику и информатику. Готовлю к олимпиадам и вступительным экзаменам.',
    status: 'active'
  }
];

export const ICON_MAP: Record<string, React.ReactNode> = {
  Languages: <Languages className="w-full h-full" />,
  Calculator: <Calculator className="w-full h-full" />,
  BrainCircuit: <BrainCircuit className="w-full h-full" />,
  FlaskConical: <FlaskConical className="w-full h-full" />,
  Book: <Book className="w-full h-full" />,
  Code: <Code className="w-full h-full" />,
  Globe: <Globe className="w-full h-full" />,
  Music: <Music className="w-full h-full" />,
};

// Exported SUBJECTS constant based on default language
export const SUBJECTS = getSubjects('ru');
