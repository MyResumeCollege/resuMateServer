import { Request, Response } from "express";
import { getLinkedinProfileData } from "../services/linkedin.service";
import { uniqueId } from "lodash";
import { Skill } from "../types/skill.type";
import { EducationPeriod, ExperiencePeriod } from "../types/resumeData.type";

const fetchLinkedinProfileData = async (req: Request, res: Response) => {
  const { profile_link } = req.body;

  if (!profile_link) {
    return res.status(400).send("Profile link is required");
  }

  try {
    const data = await getLinkedinProfileData(profile_link);

    const {
      name,
      aboutSummaryText: summary,
      education,
      skills,
      experience,
    } = data;

    const experiencePeriods: ExperiencePeriod[] = experience.map((exp) => ({
      id: uniqueId("periodid"),
      jobTitle: exp.title,
      employer: exp.organisation.name || "",
      city: exp.location,
      startDate: {month: exp.timePeriod.startedOn.month ?? 1, year: exp.timePeriod.startOn.year ?? new Date().getFullYear()},
      endDate: {month: exp.timePeriod.endedOn.month ?? 1, year: exp.timePeriod.endedOn.year ??  new Date().getFullYear()},
      isCurrent: exp.dateEnded === "Present" ? true : false,
      description: "",
    }));

    const educationPeriods: EducationPeriod[] = education.map((edu) => ({
      id: uniqueId("periodid"),
      degree: edu.fieldOfStudy,
      school: edu.institutionName,
      description: "",
      startDate: {month: edu.timePeriod.startedOn.month ?? 1, year: edu.timePeriod.startOn.year ?? new Date().getFullYear()},
      endDate: {month: edu.timePeriod.endedOn.month ?? 1, year: edu.timePeriod.endedOn.year ??  new Date().getFullYear()},
      isCurrent: false
    }));

    const linkedinSkills: Skill[] = skills.map((skill) => ({
      id: uniqueId("skillid"),
      name: skill.name,
      level: 3,
    }));

    const userLinkedinData = {
      name,
      bio: summary,
      skills: linkedinSkills.slice(0, 10),
      experiencePeriods,
      educationPeriods,
    };

    res.status(200).json(userLinkedinData);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export default {
  fetchLinkedinProfileData,
};
