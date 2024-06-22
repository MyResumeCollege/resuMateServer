import { Request, Response } from "express";
import { getLinkedinProfileData } from "../services/linkedin.service";

const fetchLinkedinProfileData = async (req: Request, res: Response) => {
  const { profile_link } = req.body;

  if (!profile_link) {
    return res.status(400).send("Profile link is required");
  }

  try {
    const data = await getLinkedinProfileData(profile_link);

    const { name, location, aboutSummaryText: summary, description: role, education, skills, experience } = data;

    const formattedExperience = experience.map(exp => `${exp.title} at ${exp.organisation.name} in ${exp.location}`);
    const formattedEducation = education.map(edu => `${edu.institutionName}, ${edu.fieldOfStudy}`);

    const userLinkedinData = {
      name,
      location,
      summary,
      role,
      skills,
      experience: formattedExperience,
      education: formattedEducation,
    };

    res.status(200).json(userLinkedinData);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export default {
  fetchLinkedinProfileData,
};
