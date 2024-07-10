import { ExperiencePeriod } from "../services/GroqAI.service";

type ResumePromptParams = {
  name: string;
  job: string;
  description: string;
  skills: Skill[];
  experiences: ExperiencePeriod[]
};

const SKILL_LEVEL_NAME: Record<number, string> = {
  1: 'Novice',
  2: 'Beginner',
  3: 'Skillful',
  4: 'Experienced',
  5: 'Expert',
};

export const generateResumePrompt = ({
  name,
  job,
  description,
  skills,
  experiences
}: ResumePromptParams) =>
  `
    generate a resume based solely on the provided information without adding additional details.
    Ensure the resume is professionally formatted, clear.
    Please don't add an intro line : 'Here is the generated..'
    [Name]: ${name}
    [Job Title/Desired Position]: ${job}

    [Professional Summary]:
    ${description}

    [Skills]:
    ${skills
      .map((skill) => `${skill.name}: ${SKILL_LEVEL_NAME[skill.level]}`)
      .join('\n')}

    [Experiences]:
    ${experiences.map((experience) => {
        const endDate = experience.isCurrent ? "current" : `${experience.endDate.year}`
        return `${experience.jobTitle} at ${experience.employer} .Description Job - ${experience.description}, ${experience.city}.
        ${experience.startDate.year} - ${endDate}
        `;
      }).join('\n')}
    `.trim();

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
