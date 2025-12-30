
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export enum ApplicationStatus {
  NEW = 'NEW',
  TEACHER_FOUND = 'TEACHER_FOUND',
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Teacher {
  id: string;
  name: string;
  photo: string;
  subjects: string[]; // Массив ID предметов
  experience: string;
  education: string;
  pricePerHour: number;
  bio: string;
  employment?: string;
  status: 'active' | 'inactive';
}

export interface TeacherApplication {
  id: string;
  firstName: string;
  lastName: string;
  experience: string;
  employment: string;
  subjectIds: string[];
  bio: string;
  contact: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface PreferredTime {
  date?: string;
  days: string[];
  time: string;
  timezone: 'MSK' | 'ALMT';
}

export interface StudentApplication {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  phone: string;
  subjectId: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  preferredTime: PreferredTime;
  status: ApplicationStatus;
  assignedTeacherId?: string;
  lessonRoomId?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface AdminSettings {
  notificationEmail: string;
  formspreeId: string;
  adminUsername?: string;
  adminPassword?: string;
  footerEmail: string;
  footerPhone: string;
}
