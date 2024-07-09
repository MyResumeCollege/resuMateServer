import Groq from 'groq-sdk';
import {
  generateResumePrompt,
  improveResumePrompt,
} from '../prompts/resumePrompts';

type ResumeData = {
  detailedCV: string;
};

type ExperiencePeriodTime = {
  month: string;
  year: string;
}

export type ExperiencePeriod = {
  id: string;
  jobTitle: string;
  employer: string;
  city: string;
  startDate: ExperiencePeriodTime;
  endDate: ExperiencePeriodTime;
  isCurrent: boolean;
  description: string;
}

type ResumeQuestionsData = {
  name: string;
  job: string;
  description: string;
  skills: Skill[];
  experiences: ExperiencePeriod[]
};

type ResumeLanguage = {
  detailedCV: string;
  resumeLanguage?: string;
};
const maxCharacterLimit = 1000;

const improveResume = async ({ detailedCV }: ResumeData) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    let requestMessages: Groq.Chat.Completions.ChatCompletionMessageParam[];
    requestMessages = [
      {
        role: 'user',
        content: improveResumePrompt,
      },
      {
        role: 'assistant',
        content: detailedCV,
      },
    ];

    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: requestMessages,
      temperature: 1,
      max_tokens: maxCharacterLimit,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const resume = response.choices[0]?.message?.content || '';

    return resume;
  } catch (error) {
    console.error('Error generating resume:', error);
    throw error;
  }
};

const translateResume = async ({ detailedCV, resumeLanguage }: ResumeLanguage) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    let requestMessages: Groq.Chat.Completions.ChatCompletionMessageParam[];
    requestMessages = [
      {
        role: 'user',
        content: `Translate this resume into ${resumeLanguage}:`,
      },
      {
        role: 'assistant',
        content: detailedCV,
      },
    ];
    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: requestMessages,
      temperature: 1,
      max_tokens: maxCharacterLimit,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const resume = response.choices[0]?.message?.content || '';

    return resume;
  } catch (error) {
    console.error('Error generating resume:', error);
    throw error;
  }
};

const generateResume = async ({
  name,
  job,
  description,
  skills,
  experiences
}: ResumeQuestionsData) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    let requestMessages: Groq.Chat.Completions.ChatCompletionMessageParam[];

    const resumeContent = `
    [Name]: ${name}
    [Job Title/Desired Position]: ${job}

    [Professional Summary]:
    ${description}

    [Career Goals/Objectives]:
    ${skills.map((skill) => `${skill.name} - ${skill.level}`).join('\n')}
    `.trim();

    requestMessages = [
      {
        role: 'user',
        content: generateResumePrompt({ name, job, description, skills, experiences }),
      },
      {
        role: 'assistant',
        content: resumeContent,
      },
    ];

    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: requestMessages,
      temperature: 1,
      max_tokens: maxCharacterLimit,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const resume = response.choices[0]?.message?.content || '';

    return resume;
  } catch (error) {
    console.error('Error generating resume:', error);
    throw error;
  }
};

export { improveResume, generateResume, translateResume };
