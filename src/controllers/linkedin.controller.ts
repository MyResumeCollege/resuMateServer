import { Request, Response } from "express";
import { getLinkedinProfileData } from "../services/linkedin.service";

const fetchLinkedinProfileData = async (req: Request, res: Response) => {
  const { profile_link } = req.body;

  if (!profile_link) {
    return res.status(400).send("Profile link is required");
  }

  try {
    const data = await getLinkedinProfileData(profile_link);

    const {
      name,
      location,
      aboutSummaryText: summary,
      description: role,
      education,
      skills,
      experience,
    } = data;

    const formattedExperience: string[] = experience.map((exp) => {
      const expTitle = exp.title || "";
      const expOrgName = exp.organisation?.name || "";
      const expLocation = exp.location || "";

      return [expTitle, expOrgName, expLocation].filter(Boolean).join(" at ");
    });

    const formattedEducation: string[] = education
      .map((edu) => {
        const eduInstitution = edu.institutionName || "";
        const eduFieldOfStudy = edu.fieldOfStudy || "";

        return eduInstitution && eduFieldOfStudy
          ? `${eduInstitution}, ${eduFieldOfStudy}`
          : eduInstitution || eduFieldOfStudy;
      })
      .filter(Boolean);

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
