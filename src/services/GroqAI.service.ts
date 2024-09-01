import Groq from "groq-sdk";
import {
  improveResumePrompt,
  experiencesPrompt,
  bioPrompt,
  rewritePrompt,
  generateBioPrompt,
  educationPrompt,
} from "../prompts/resumePrompts";

import { ResumeData, ResumeQuestionsData } from "../types/resumeData.type";

const maxCharacterLimit = 40;

const improveResume = async ({ detailedCV }: ResumeData) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    let requestMessages: Groq.Chat.Completions.ChatCompletionMessageParam[];
    requestMessages = [
      {
        role: "user",
        content: improveResumePrompt,
      },
      {
        role: "assistant",
        content: detailedCV,
      },
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: requestMessages,
      temperature: 1,
      max_tokens: maxCharacterLimit,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const resume = response.choices[0]?.message?.content || "";

    return resume;
  } catch (error) {
    throw error;
  }
};

const requestCompletion = async (
  messages: Groq.Chat.Completions.ChatCompletionMessageParam[]
) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 1,
      max_tokens: maxCharacterLimit,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

const generateResume = async ({
  bio,
  experiences,
  educations,
}: ResumeQuestionsData) => {
  try {
    const requestMessagesBio: Groq.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: "user",
          content: generateBioPrompt(bio),
        },
        {
          role: "assistant",
          content: bioPrompt,
        },
      ];

    const nonEmptyExperiences = experiences.filter((exp) => exp.trim() !== "");
    const requestMessagesExperiences: Groq.Chat.Completions.ChatCompletionMessageParam[][] =
      nonEmptyExperiences.map((experience) => [
        {
          role: "user",
          content: experience,
        },
        {
          role: "assistant",
          content: experiencesPrompt,
        },
      ]);

    const nonEmptyEducations = educations.filter((edu) => edu.trim() !== "");
    const requestMessagesEducations: Groq.Chat.Completions.ChatCompletionMessageParam[][] =
      nonEmptyEducations.map((education) => [
        {
          role: "user",
          content: education,
        },
        {
          role: "assistant",
          content: educationPrompt,
        },
      ]);

    const [bioResponse, experiencesResponses, educationsResponses] =
      await Promise.all([
        requestCompletion(requestMessagesBio),
        Promise.all(requestMessagesExperiences.map(requestCompletion)),
        Promise.all(requestMessagesEducations.map(requestCompletion)),
      ]);

    const bioRes = bioResponse.choices[0]?.message?.content || "";

    const experiencesRes = experiences.map((exp) => {
      const index = nonEmptyExperiences.indexOf(exp);
      return index >= 0
        ? experiencesResponses[index]?.choices[0]?.message?.content || ""
        : "";
    });

    const educationsRes = educations.map((edu) => {
      const index = nonEmptyEducations.indexOf(edu);
      return index >= 0
        ? educationsResponses[index]?.choices[0]?.message?.content || ""
        : "";
    });

    return {
      bio: bioRes,
      experiences: experiencesRes,
      educations: educationsRes,
    };
  } catch (error) {
    throw error;
  }
};

const generateSection = async (data: string) => {
  try {
    const requestMessagesSection: Groq.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: "user",
          content: data,
        },
        {
          role: "assistant",
          content: rewritePrompt,
        },
      ];

    if (data != "") {
      const sectionResponse = await requestCompletion(requestMessagesSection);

      const sectionRes = sectionResponse.choices[0]?.message?.content || "";
      return sectionRes;
    }
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export { improveResume, generateResume, generateSection };