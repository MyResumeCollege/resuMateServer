import {
  EducationPeriod,
  ExperiencePeriod,
} from "../types/resumeData.type";

type ResumePromptParams = {
  description?: string;
  experiences?: ExperiencePeriod[];
  educations?: EducationPeriod[];
};

const SKILL_LEVEL_NAME: Record<number, string> = {
  1: "Novice",
  2: "Beginner",
  3: "Skillful",
  4: "Experienced",
  5: "Expert",
};

export const rewritePrompt = "Rewrite the following description to be concise and highlight key points in two sentences: [provided description]"

export const bioPrompt =
  "Generate a professional bio summarizing achievements and qualifications based on the provided details. Highlight key accomplishments, skills, and areas of expertise in a concise and impactful manner, limited to 3-4 sentences, without introductory text.";

export const experiencesPrompt =
  "Write the experience section clearly and concisely, without using bullet points. Present each role and responsibility directly and straightforwardly"

export const educationPrompt = "Briefly describe your education, including significant projects or accomplishments, in two sentences."

export const improveResumePrompt = `
    generate a resume based solely on the provided information without adding additional details.
    Ensure the resume is professionally formatted, clear.
    Use the template provided, but ignore any sections for which no information is given.
    please dont add introduction - AS 'Here is the rewritten resume' or 'Here is the resume:'

    [Name]: [Insert name here]
    [Job Title/Desired Position]: [Specify desired job title or position]

    [Professional Summary]:
    [Compose a concise summary highlighting the individual's professional background, skills, and accomplishments]

    [Work Experience]:
    [Detail the individual's work history, including job titles, companies, dates of employment, and responsibilities]

    [Education]:
    [Provide information on the individual's educational background, including degrees earned, institutions attended, and graduation dates]

    [Skills]:
    [List the individual's key skills and competencies relevant to the desired position]

    [Achievements]:
    [Highlight any notable achievements or recognitions earned during the individual's career]

    [Career Goals/Objectives]:
    [Describe the individual's career goals and objectives, outlining aspirations for future professional development]

    [Additional Information]:
    [Include any other pertinent details, such as certifications, awards, or memberships in professional organizations]
`.trim();

export const generateBioPrompt = ({ description = '' }: ResumePromptParams) => {
  return description ? `[Professional Summary]:\n${description}` : '';
};

export const generateExperiencesPrompt = ({
  experiences = [],
}: ResumePromptParams) => {
  return experiences.length > 0
    ? experiences
        .map((experience) => {
          const endDate = experience.isCurrent
            ? "current"
            : `${experience.endDate?.year || ""}`;
          return (
            `${experience.jobTitle} at ${experience.employer}\n` +
            `  Description: ${experience.description}, City: ${experience.city}\n` +
            `  ${experience.startDate.year} - ${endDate}`
          );
        })
        .join("\n\n")
    : "";
};

export const generateEducationsPrompt = ({
  educations = [],
}: ResumePromptParams) => {
  return educations.length > 0
    ? educations
        .map((education) => {
          const endDate = education.isCurrent
            ? "current"
            : `${education.endDate?.year || ""}`;
          return (
            `${education.degree} at ${education.school}\n` +
            `  Description: ${education.description}\n` +
            `  ${education.startDate.year} - ${endDate}`
          );
        })
        .join("\n\n")
    : "";
};
