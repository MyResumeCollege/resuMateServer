import Groq from 'groq-sdk';
import {
  improveResumePrompt,
  generateExperiencesPrompt,
  experiencesPrompt,
  bioPrompt,
  rewritePrompt,
  generateBioPrompt,
  generateEducationsPrompt,
  educationPrompt
} from "../prompts/resumePrompts";

import {
  ResumeData,
  ResumeQuestionsData,
  ResumePromptParams
} from '../types/resumeData.type';

const maxCharacterLimit = 100;

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
      model: 'llama-3.1-8b-instant',
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
      model: 'llama-3.1-8b-instant',
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

const generateResume = async ({
  bio,
  experiences,
  educations}: ResumeQuestionsData) => {
  try {
    const bioParams: ResumePromptParams = {
      bio
    };

    const experiencesParams: ResumePromptParams = {
      experiences,
    };

    const educationsParams: ResumePromptParams = {
      educations
    }

    const requestMessagesBio: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "user",
        content: generateBioPrompt(bioParams),
      },
      {
        role: "assistant",
        content: bioPrompt
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
          content: experiencesPrompt
        },
      ];

    const requestMessagesEducations: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "user",
        content: generateEducationsPrompt(educationsParams),
      },
      {
        role: "assistant",
        content: educationPrompt
      },
    ];

    const [bioResponse, experiencesResponse, educationsResponse] =
      await Promise.all([
        requestCompletion(requestMessagesBio),
        requestCompletion(requestMessagesExperiences),
        requestCompletion(requestMessagesEducations),
      ]);

    const bioRes = bioResponse.choices[0]?.message?.content || "";
    const experiencesRes = experiencesResponse.choices[0]?.message?.content || "";
    const educationsRes = educationsResponse.choices[0]?.message?.content || ""

    return [bioRes, experiencesRes, educationsRes];
  } catch (error) {
    console.error('Error generating resume:', error);
    throw error;
  }
};

const generateSection = async (data: string) => {
  try {
    const requestMessagesSection: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "user",
        content: data,
      },
      {
        role: "assistant",
        content: rewritePrompt,
      },
    ];

    const sectionResponse = await requestCompletion(requestMessagesSection);

    const sectionRes = sectionResponse.choices[0]?.message?.content || "";

    return sectionRes;
  } catch (error) {
    console.error('Error generating section:', error);
    throw error;
  }
};

export { improveResume, generateResume, generateSection };
