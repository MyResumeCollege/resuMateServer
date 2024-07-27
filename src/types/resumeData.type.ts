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
  description: string;
  skills: Skill[];
  experiences: ExperiencePeriod[];
  resumeLanguage?: string;
  educations: EducationPeriod[];
  languages: LanguageKnowledge[]
};

type ResumeLanguage = {
  detailedCV: string;
  resumeLanguage?: string;
};

type ResumePromptParams = {
  description?: string;
  skills?: Skill[];
  experiences?: ExperiencePeriod[];
  educations?: EducationPeriod[];
  languages?: LanguageKnowledge[];
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

enum LanguageKnowledgeLevel {
  Advanced,
  Native,
}

type LanguageKnowledge = {
  id: string;
  lang: string;
  level: LanguageKnowledgeLevel;
}

type ResumeResponse = {
  fullName: string,
  jobTitle: string,
  bio: string,
  skills: string,
  experiences: string,
  educations: string,
  languages: string 
}

export {
  ResumeData,
  ResumeQuestionsData,
  ExperiencePeriod,
  ResumeLanguage,
  ResumePromptParams,
  EducationPeriod,
  LanguageKnowledge,
  ResumeResponse
};
