import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, ImprovementAnswers, StructuredResume, StructuredCoverLetter } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const resumeAndCoverLetterSchema = {
    contactInfo: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "User's full name." },
            email: { type: Type.STRING, description: "User's email address." },
            phone: { type: Type.STRING, description: "User's phone number." },
            linkedin: { type: Type.STRING, description: "URL for user's LinkedIn profile." },
            address: { type: Type.STRING, description: "User's city and state/country." },
        },
        required: ["name", "email", "phone", "linkedin", "address"]
    },
    summary: { type: Type.STRING, description: "A 2-4 sentence professional summary tailored to the job." },
    experience: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                company: { type: Type.STRING },
                location: { type: Type.STRING },
                dates: { type: Type.STRING },
                description: { type: Type.ARRAY, items: { type: Type.STRING, description: "Bullet points describing achievements. Start with action verbs. Use **bold** markdown to highlight changes." } },
            },
            required: ["title", "company", "location", "dates", "description"]
        }
    },
    education: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                degree: { type: Type.STRING },
                institution: { type: Type.STRING },
                dates: { type: Type.STRING },
                details: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Details like GPA, relevant modules, etc. Use **bold** markdown to highlight changes." },
            },
            required: ["degree", "institution", "dates", "details"]
        }
    },
    projects: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                company: { type: Type.STRING, description: "Can be University, Personal, etc." },
                location: {type: Type.STRING},
                dates: { type: Type.STRING },
                description: { type: Type.ARRAY, items: { type: Type.STRING, description: "Bullet points. Use **bold** markdown to highlight changes." } },
            },
             required: ["title", "company", "location", "dates", "description"]
        }
    },
     publications: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "Title of the publication." },
                company: { type: Type.STRING, description: "Journal or conference name." },
                location: {type: Type.STRING},
                dates: { type: Type.STRING, description: "Publication date." },
                description: { type: Type.ARRAY, items: { type: Type.STRING }, description: ["Full citation or link. Use **bold** markdown to highlight changes."] },
            },
             required: ["title", "company", "location", "dates", "description"]
        }
    },
    skills: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                category: { type: Type.STRING, description: "e.g., 'Technical Skills', 'Soft Skills'" },
                skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of skills. Use **bold** markdown to highlight changes." },
            },
            required: ["category", "skills"]
        }
    }
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    suitabilityScore: { type: Type.INTEGER, description: "A percentage score of how well the resume matches the job description." },
    scoreJustification: { type: Type.STRING, description: "One-sentence justification for the suitability score." },
    qualityScore: { type: Type.INTEGER, description: "A percentage score for resume quality based on grammar, tone, formatting, etc." },
    qualityScoreJustification: { type: Type.STRING, description: "One-sentence justification for the quality score." },
    hardSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 5-10 hard skills from the job description." },
    softSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 5-10 soft skills from the job description." },
    clarifyingQuestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-3 questions to elicit more information from the user." },
    revisedResume: {
        type: Type.OBJECT,
        properties: resumeAndCoverLetterSchema,
        required: Object.keys(resumeAndCoverLetterSchema),
    },
    draftCoverLetter: {
        type: Type.OBJECT,
        properties: {
            contactInfo: resumeAndCoverLetterSchema.contactInfo,
            date: { type: Type.STRING, description: "Today's date." },
            recipientName: { type: Type.STRING, description: "e.g., 'Hiring Manager'." },
            recipientCompany: { type: Type.STRING, description: "Company name from job description." },
            body: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Paragraphs of the cover letter. Use **bold** markdown to highlight changes." },
            closing: { type: Type.STRING, description: "e.g., 'Sincerely,'." },
        },
        required: ["contactInfo", "date", "recipientName", "recipientCompany", "body", "closing"]
    }
  },
  required: ["suitabilityScore", "scoreJustification", "qualityScore", "qualityScoreJustification", "hardSkills", "softSkills", "clarifyingQuestions", "revisedResume", "draftCoverLetter"]
};


const createFullPrompt = (systemPrompt: string, resume: string, jobDesc: string, answers?: ImprovementAnswers) => {
    let prompt = `${systemPrompt}\n\n**Input Data:**\n\n*   **USER_RESUME:**\n    \`\`\`\n    ${resume}\n    \`\`\`\n\n*   **JOB_DESCRIPTION:**\n    \`\`\`\n    ${jobDesc}\n    \`\`\``;

    if (answers && Object.keys(answers).length > 0) {
        const answerString = Object.entries(answers).map(([key, value]) => `${parseInt(key) + 1}. ${value}`).join('\n');
        prompt += `\n\n*   **USER_ANSWERS:**\n    \`\`\`\n    ${answerString}\n    \`\`\``;
    }

    prompt += `\n\n**Task:**\n\nExecute your core task based on the provided data. Adhere strictly to the requested JSON output format defined by the schema. Ensure all changes in the revised documents are highlighted using **bold** markdown.`;
    return prompt;
};


const SYSTEM_PROMPT_INITIAL_ANALYSIS = `
You are an elite, professional career coach named 'Coach AI'. Your purpose is to help users secure their target job by critically re-engineering their application materials into a structured JSON format.

**Your Persona & Tone:**
*   **Critical and Direct:** Your feedback is sharp, honest, and actionable.
*   **Analytical and Data-Driven:** Base all recommendations on the resume and job description.
*   **Expert:** You are an authority on resume design, keyword optimization, and professional communication.

**Core Task & Workflow:**

1.  **Analyze Resume and Job Description:** Critically analyze the user's resume and the target job description.

2.  **Calculate Scores:**
    *   **Suitability Score:** Provide a percentage score based on the alignment of the user's skills and experience with the job requirements. Justify it in one sentence.
    *   **Quality Score:** Provide a percentage score assessing the resume's overall quality based on the following criteria: Perfect grammar/spelling, professional tone, conciseness, action verb usage, quantifiable achievements, and consistent formatting. Justify it in one sentence.

3.  **Extract Keywords:** List the top 5-10 essential "Hard Skills" and "Soft Skills" from the job description.

4.  **Ask Clarifying Questions:** Ask 2-3 targeted questions to uncover quantifiable achievements or missing experiences relevant to the job.

5.  **Generate Structured Resume:**
    *   Revise the user's resume, making minimal, surgical changes.
    *   Inject keywords naturally. Rephrase bullets to be action-oriented and results-focused.
    *   **CRITICAL:** Highlight every single change using \`**bold text**\` markdown.
    *   Format the entire resume into the specified JSON structure.

6.  **Generate Structured Cover Letter:**
    *   Draft a concise, professional cover letter.
    *   Directly reference 1-2 specific experiences from the revised resume.
    *   Leave a placeholder like \`[State where you saw the advert]\` for the user to fill in.
    *   Format the cover letter into the specified JSON structure, using the user's name from their resume for the closing.
`;

const SYSTEM_PROMPT_REGENERATION = `
You are 'Coach AI'. The user has provided answers to your clarifying questions. Your task is to regenerate the structured resume and cover letter, incorporating this new information.

**Core Task & Workflow:**

1.  **Incorporate Answers:** Carefully integrate the user's answers into the resume and cover letter. The original resume is provided for context.
2.  **Re-analyze and Refine:** Re-evaluate the entire application. You may make additional minor tweaks for flow and keyword optimization.
3.  **Update Scores:** Recalculate the Suitability and Quality scores and update their justifications based on the improved content.
4.  **Generate New Questions (Optional):** If the new information opens up further opportunities for improvement, you can generate 1-2 new clarifying questions. Otherwise, provide an empty array for clarifyingQuestions.
5.  **Generate Structured JSON:** Output the complete, updated analysis, resume, and cover letter in the specified JSON format. Highlight all new changes with **bold** markdown.
`;

const callGeminiAPI = async (prompt: string): Promise<AnalysisResult> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedResult = JSON.parse(jsonText);
        
        if (!parsedResult.revisedResume || !parsedResult.draftCoverLetter) {
            throw new Error("AI response is missing required structured data.");
        }

        return parsedResult as AnalysisResult;

    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to get a valid response from the AI. It might be experiencing high load. Please try again later.");
    }
};

export const analyzeAndGenerate = async (resumeText: string, jobDescription: string): Promise<AnalysisResult> => {
    const prompt = createFullPrompt(SYSTEM_PROMPT_INITIAL_ANALYSIS, resumeText, jobDescription);
    return callGeminiAPI(prompt);
};

export const regenerateWithAnswers = async (originalResumeText: string, jobDescription: string, answers: ImprovementAnswers): Promise<AnalysisResult> => {
    const prompt = createFullPrompt(SYSTEM_PROMPT_REGENERATION, originalResumeText, jobDescription, answers);
    return callGeminiAPI(prompt);
};

export const editTextWithAI = async (currentText: string, instruction: string): Promise<string> => {
    const prompt = `
        You are a helpful writing assistant. The user wants to revise a document.
        
        **INSTRUCTION:** "${instruction}"
        
        **DOCUMENT:**
        ---
        ${currentText}
        ---
        
        **TASK:**
        Rewrite the document based on the user's instruction. Output only the revised text, without any additional commentary.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text.trim();
};
