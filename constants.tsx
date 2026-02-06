
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

// Exported SUBJECTS constant to resolve import errors in StudentDashboard, TeacherDashboard, and AdminDashboard
export const SUBJECTS = getSubjects('ru');

export const MOCK_TEACHERS: Teacher[] = [
  {
    id: 't1',
    name: 'Александр Иванов',
    photo: 'https://picsum.photos/seed/t1/200/200',
    subjects: ['1', '7'],
    experience: '8 лет',
    education: 'МГУ',
    pricePerHour: 1500,
    bio: 'Специализируюсь на подготовке к IELTS.',
    // Added missing status property as per Teacher type definition
    status: 'active'
  },
  {
    id: 't2',
    name: 'Елена Смирнова',
    photo: 'https://picsum.photos/seed/t2/200/200',
    subjects: ['2', '6'],
    experience: '5 лет',
    education: 'МФТИ',
    pricePerHour: 1200,
    bio: 'Помогаю полюбить математику.',
    // Added missing status property as per Teacher type definition
    status: 'active'
  }
];

export const ICON_MAP: Record<string, React.ReactNode> = {
  Languages: <Languages className="w-6 h-6" />,
  Calculator: <Calculator className="w-6 h-6" />,
  BrainCircuit: <BrainCircuit className="w-6 h-6" />,
  FlaskConical: <FlaskConical className="w-6 h-6" />,
  Book: <Book className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  Globe: <Globe className="w-6 h-6" />,
  Music: <Music className="w-6 h-6" />,
};