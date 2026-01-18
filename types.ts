
export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  graduationDate: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert' | 'None';
}

export type TemplateType = 'classic' | 'modern' | 'standard' | 'minimal';

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  template: TemplateType;
}

export type Section = 'contact' | 'summary' | 'experience' | 'education' | 'skills';
