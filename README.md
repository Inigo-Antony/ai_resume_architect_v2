# AI Resume Architect 🚀

AI Resume Architect is a sophisticated, AI-powered career assistant designed to transform generic resumes into high-impact, job-specific application materials. Powered by the Google Gemini 2.5 Flash model, it acts as an elite "Coach AI" to help candidates beat Applicant Tracking Systems (ATS) and impress hiring managers.

## ✨ Key Features

-   **Multi-Format Parsing**: Seamlessly extract text from **PDF**, **DOCX**, and **TXT** resumes using `pdfjs-dist` and `mammoth`.
-   **ATS Suitability Analysis**: Receive a percentage score indicating how well your profile matches a specific Job Description (JD).
-   **Quality Benchmarking**: Get feedback on grammar, tone, formatting, and the usage of quantifiable achievements.
-   **Keyword Optimization**: Automatically extracts and highlights critical Hard and Soft skills required for the role.
-   **Surgical Resume Revision**: Generates a structured, re-engineered resume that maintains your core history while optimizing for keywords and impact.
-   **Change Transparency**: Every AI-driven edit is automatically **bolded** in the preview, allowing you to review exactly what was improved.
-   **Tailored Cover Letters**: Drafts professional cover letters that bridge the gap between your experience and the specific requirements of the JD.
-   **Iterative "Coach" Loop**: The AI identifies gaps in your resume and asks clarifying questions (e.g., "Can you quantify your sales growth?") to refine the results further.
-   **Interactive AI Editor**: Fine-tune specific sections of your documents using natural language instructions (e.g., "Make this sound more professional" or "Focus more on my leadership skills").
-   **Export to Word**: Download your polished resume and cover letter directly as editable `.doc` files.

## 🛠️ Tech Stack

-   **Framework**: [React 19](https://react.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Intelligence**: [Google Gemini API](https://ai.google.dev/) (Model: `gemini-2.5-flash`)
-   **File Processing**:
    -   `pdfjs-dist`: For robust client-side PDF text extraction.
    -   `mammoth`: For converting `.docx` files to raw text.
-   **Icons**: Custom SVG icons integrated into a consistent UI system.

## 🧠 How it Works

1.  **Upload**: Upload your existing resume. The app parses it locally in your browser.
2.  **Job Context**: Paste the job description for your target role.
3.  **Deep Analysis**: Gemini 2.5 Flash performs a comparative analysis, evaluating your resume against the JD's specific requirements.
4.  **Initial Result**: The system provides scores, keyword lists, a revised resume, and a draft cover letter in a structured JSON format.
5.  **Refinement**: If the AI detects missing data, it presents "Clarifying Questions" to help you uncover your best achievements.
6.  **Regeneration**: Your answers are integrated back into the documents, significantly boosting your Suitability and Quality scores.
7.  **Final Polish**: Use the "Manual Edit" modal to prompt the AI for specific stylistic or content adjustments.
8.  **Download**: Export your final, winning application materials.

## 📁 Project Structure

-   `components/`: Reusable UI components including `ScoreGauge`, `AIChatModal`, and specific page views.
-   `services/`: Houses the `geminiService.ts`, which manages complex prompt engineering and structured JSON communication with the Gemini API.
-   `types.ts`: TypeScript interfaces defining the `StructuredResume`, `StructuredCoverLetter`, and `AnalysisResult` schemas.
-   `constants.tsx`: Global UI constants and SVG icon components.
-   `App.tsx`: The main application controller managing state transitions and navigation.

## 📝 Configuration

The application requires a valid Gemini API Key, expected to be available via `process.env.API_KEY`. It utilizes a strictly defined `responseSchema` to ensure the AI always returns valid, structured data that the UI can render reliably.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Author
Inigo Antony

---

