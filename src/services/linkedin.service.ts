import axios from "axios";


export const getLinkedinProfileData = async (profileLink: string) => {
  try {
    const headers = {
        'Authorization': `${process.env.LINKEDIN_API_KEY}`
      };

    const response = await axios.get("https://api.lix-it.com/v1/person", {
      params: {
        profile_link: profileLink,
      },
      headers: headers,
    });    

    return response.data;
  } catch (error) {
    console.error("Error fetching LinkedIn profile data:", error);
  }
};
