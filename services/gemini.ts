
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateSummary(jobTitle: string, yearsExperience: string, keySkills: string[]) {
  const prompt = `Write a high-impact, professional resume summary for a ${jobTitle} with ${yearsExperience} years of experience. Focus on these skills: ${keySkills.join(', ')}. Keep it under 300 characters. Return only the summary text.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text?.trim() || "";
}

export async function enhanceBulletPoint(bullet: string, role: string) {
  const prompt = `Rewrite the following resume bullet point to be more professional, results-oriented, and high-impact using action verbs for a ${role} role: "${bullet}". Keep it concise. Return only the improved bullet point.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text?.trim() || bullet;
}

export async function suggestSkills(jobTitle: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Suggest 10 relevant hard and soft skills for a ${jobTitle}. Return the result as a JSON array of strings.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  try {
    return JSON.parse(response.text?.trim() || "[]");
  } catch (e) {
    return [];
  }
}
