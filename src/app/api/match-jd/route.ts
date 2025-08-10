
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import axios from 'axios';
import OpenAI from 'openai';
import resumeData from '@/data/resume.json';const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Extracts technical skills from text using OpenAI.
const extractTechSkillsWithOpenAI = async (text: string): Promise<string[]> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert at identifying technical skills from job descriptions. List only the technical skills, separated by commas. Do not include any other text or explanations. If no technical skills are found, return an empty string.",
        },
        {
          role: "user",
          content: `Extract technical skills from the following job description:\n\n${text}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 150,
    });

    const skillsString = completion.choices[0].message.content?.trim() || '';
    if (!skillsString) {
      return [];
    }
    return skillsString.split(',').map(skill => skill.trim());
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Failed to extract skills using AI.");
  }
};export async function POST(request: Request) {
  try {
    const { jobDescription, url } = await request.json();
    let textToProcess = jobDescription;

    if (url) {
      try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        textToProcess = $('body').text(); // Extract all text from the body
      } catch (error) {
        console.error('Error fetching or parsing URL:', error);
        return NextResponse.json({ error: 'Failed to fetch or parse URL' }, { status: 400 });
      }
    }

    if (!textToProcess) {
      return NextResponse.json({ error: 'No job description provided' }, { status: 400 });
    }

    // Use OpenAI to extract skills from the job description
    const jdSkillsRaw = await extractTechSkillsWithOpenAI(textToProcess);
    console.log('JD Skills Raw:', jdSkillsRaw);
    console.log('Resume Data Skills:', resumeData.skills);

    const resumeSkills = resumeData.skills.map(s => s.name); // Keep original casing for OpenAI

    const matchingPrompt = `Given the following technical skills extracted from a Job Description (JD) and a list of skills from a candidate's resume, perform an intelligent skill match. Do not rely solely on exact string matching; consider semantic similarity, common abbreviations (e.g., 'JS' for 'JavaScript', 'TS' for 'TypeScript'), and related concepts.

    JD Skills: ${JSON.stringify(jdSkillsRaw)}
    Resume Skills: ${JSON.stringify(resumeSkills)}

    Your output should be a JSON object with three properties:
    1. "matchedSkills": An array of skills from the JD that semantically match skills in the resume.
    2. "missingSkills": An array of skills from the JD that do NOT semantically match skills in the resume.
    3. "score": A number representing the percentage of JD skills that were matched (matchedSkills.length / jdSkills.length * 100), rounded to two decimal places.

    Example output:
    {
      "matchedSkills": ["JavaScript", "React"],
      "missingSkills": ["Node.js"],
      "score": 66.67
    }`;

    const matchingCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview", // Or gpt-3.5-turbo, depending on desired intelligence vs cost
      messages: [
        {
          role: "system",
          content: "You are an expert at semantically matching technical skills. Provide your response in JSON format only.",
        },
        {
          role: "user",
          content: matchingPrompt,
        },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const matchingResult = JSON.parse(matchingCompletion.choices[0].message.content || '{}');

    return NextResponse.json({
      score: matchingResult.score,
      matchedSkills: matchingResult.matchedSkills,
      missingSkills: matchingResult.missingSkills,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
