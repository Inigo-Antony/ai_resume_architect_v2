export enum Page {
  Home,
  Analysis,
  Results,
  Improvement,
}

// Structures for resume
export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  address: string;
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  dates: string;
  description: string[]; // Array of bullet points
}

export interface Education {
  degree: string;
  institution: string;
  dates: string;
  details: string[]; // Array for CGPA, modules etc.
}

export interface SkillSet {
    category: string;
    skills: string[];
}

export interface StructuredResume {
  contactInfo: ContactInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Experience[];
  publications: Experience[];
  skills: SkillSet[];
  // Future sections can be added here
}

// Structured cover letter
export interface StructuredCoverLetter {
    contactInfo: ContactInfo;
    date: string;
    recipientName: string;
    recipientCompany: string;
    body: string[]; // paragraphs
    closing: string;
}

// Updated AnalysisResult to use structured data
export interface AnalysisResult {
  suitabilityScore: number;
  scoreJustification: string;
  qualityScore: number;
  qualityScoreJustification: string;
  hardSkills: string[];
  softSkills: string[];
  clarifyingQuestions: string[];
  revisedResume: StructuredResume | string;
  draftCoverLetter: StructuredCoverLetter | string;
}

export type EditingField = 'resume' | 'coverLetter';

// For the improvement flow
export interface ImprovementAnswers {
  [key: number]: string;
}