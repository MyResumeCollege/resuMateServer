type ResumeData = {
  detailedCV: string;
};

type ExperiencePeriodTime = {
  month: string;
  year: string;
};

type ExperiencePeriod = {
  id: string;
  jobTitle: string;
  employer: string;
  city: string;
  startDate: ExperiencePeriodTime;
  endDate: ExperiencePeriodTime;
  isCurrent: boolean;
  description: string;
};

type ResumeQuestionsData = {
  bio: string;
  experiences: string[];
  resumeLanguage?: string;
  educations: string[];
};

type ResumePromptParams = {
  bio?: string;
  experiences?: string[];
  educations?: string[];
};

type EducationPeriodTime = {
  month: string;
  year: string;
};

type EducationPeriod = {
  id: string;
  degree: string;
  school: string;
  startDate: EducationPeriodTime;
  endDate: EducationPeriodTime;
  isCurrent: boolean;
  description: string;
};

type ResumeResponse = {
  fullName: string;
  phoneNumber: string;
  email: string;
  jobTitle: string;
  bio: string;
  skills: string;
  experiences: ExperiencePeriod[];
  educations: EducationPeriod[];
  languages: string;
  template: number;
  resumeLanguage: string;
};

export {
  ResumeData,
  ResumeQuestionsData,
  ExperiencePeriod,
  ResumePromptParams,
  EducationPeriod,
  ResumeResponse
};
