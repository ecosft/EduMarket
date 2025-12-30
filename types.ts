
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export enum ApplicationStatus {
  NEW = 'NEW',
  TEACHER_FOUND = 'TEACHER_FOUND',
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED'
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
  subjects: string[]; // Subject IDs
  experience: string;
  education: string;
  pricePerHour: number;
  bio: string;
}

export interface StudentApplication {
  id: string;
  studentId: string;
  studentName: string;
  contact: string;
  subjectId: string;
  goal: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  preferredTime: string;
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
