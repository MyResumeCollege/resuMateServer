import Groq from 'groq-sdk';
import {
  generateBioPrompt,
  improveResumePrompt,
  generateSkillsPrompt,
  generateExperiencesPrompt,
  experiencesPrompt,
  bioPrompt,
  skillsPrompt,
} from '../prompts/resumePrompts';

import {
  ResumeData,
  ResumeQuestionsData,
  ResumeLanguage,
  ResumePromptParams,
} from '../types/resumeData.type';

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

const requestCompletion = async (
  messages: Groq.Chat.Completions.ChatCompletionMessageParam[]
) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages,
      temperature: 1,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return response;
  } catch (error) {
    console.error('Error making completion request:', error);
    throw error;
  }
};
const translateResume = async ({
  description,
  skills,
  experiences,
  resumeLanguage,
}: ResumeQuestionsData) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    let requestMessages: Groq.Chat.Completions.ChatCompletionMessageParam[];

    const requestMessagesBio: Groq.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: 'user',
          content: `${description}`,
        },
        {
          role: 'assistant',
          content: `${bioPrompt} ,do it and give me all in ${resumeLanguage}:`,
        },
      ];
    const requestMessagesExperiences: Groq.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: 'user',
          content: `${skills}`,
        },
        {
          role: 'assistant',
          content: `${experiencesPrompt} ,do it and give me all in ${resumeLanguage}:`,
        },
      ];

    const requestMessagesSkills: Groq.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: 'user',
          content: `${experiences}`,
        },
        {
          role: 'assistant',
          content: `${skillsPrompt} ,do it and give me all in ${resumeLanguage}:`,
        },
      ];
    const [bioResponse, skillsResponse, experiencesResponse] =
      await Promise.all([
        requestCompletion(requestMessagesBio),
        requestCompletion(requestMessagesExperiences),
        requestCompletion(requestMessagesSkills),
      ]);

    const bioRes = bioResponse.choices[0]?.message?.content || '';
    const experiencesRes =
      experiencesResponse.choices[0]?.message?.content || '';
    const skillsRes = skillsResponse.choices[0]?.message?.content || '';

    return [bioRes, experiencesRes, skillsRes];
  } catch (error) {
    console.error('Error generating resume:', error);
    throw error;
  }
};
const generateResume = async ({
  description,
  skills,
  experiences,
}: ResumeQuestionsData) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const bioParams: ResumePromptParams = {
      description,
    };

    const skillsParams: ResumePromptParams = {
      skills,
    };

    const experiencesParams: ResumePromptParams = {
      experiences,
    };

    const requestMessagesBio: Groq.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: 'user',
          content: generateBioPrompt(bioParams),
        },
        {
          role: 'assistant',
          content: bioPrompt,
        },
      ];

    const requestMessagesExperiences: Groq.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: 'user',
          content: generateExperiencesPrompt(experiencesParams),
        },
        {
          role: 'assistant',
          content: experiencesPrompt,
        },
      ];

    const requestMessagesSkills: Groq.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: 'user',
          content: generateSkillsPrompt(skillsParams),
        },
        {
          role: 'assistant',
          content: skillsPrompt,
        },
      ];

    const [bioResponse, skillsResponse, experiencesResponse] =
      await Promise.all([
        requestCompletion(requestMessagesBio),
        requestCompletion(requestMessagesExperiences),
        requestCompletion(requestMessagesSkills),
      ]);

    const bioRes = bioResponse.choices[0]?.message?.content || '';
    const experiencesRes =
      experiencesResponse.choices[0]?.message?.content || '';
    const skillsRes = skillsResponse.choices[0]?.message?.content || '';

    return [bioRes, experiencesRes, skillsRes];
  } catch (error) {
    console.error('Error generating resume:', error);
    throw error;
  }
};

export { improveResume, generateResume, translateResume };
