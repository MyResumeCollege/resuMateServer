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
};

type ResumeLanguage = {
  detailedCV: string;
  resumeLanguage?: string;
};

type ResumePromptParams = {
    description?: string;
    skills?: Skill[];
    experiences?: ExperiencePeriod[];
  }

export {
    ResumeData,
    ResumeQuestionsData,
    ExperiencePeriod,
    ResumeLanguage,
    ResumePromptParams
}