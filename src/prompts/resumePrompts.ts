interface ResumePromptParams {
    name: string;
    job: string;
    description: string;
    goals: string;
  }

export const generateResumePrompt = ({ name, job, description, goals }: ResumePromptParams) => `
    generate a resume based solely on the provided information without adding additional details:
    [Name]: ${name}
    [Job Title/Desired Position]: ${job}

    [Professional Summary]:
    ${description}

    [Career Goals/Objectives]:
    ${goals}
`.trim();

export const improveResumePrompt = `
    Improve the following resume by making it more concise, highlighting relevant skills and experience, and adding industry-specific keywords. 
    Ensure the resume is professionally formatted, clear, and limited to one page. Do not include any images.
    Use the template provided, but ignore any sections for which no information is given. Provide only the updated CV. 
    Please make sure your response is without an introduction sentence 'Here is the revised resume'.

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
