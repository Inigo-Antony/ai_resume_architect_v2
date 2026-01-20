import React, { useCallback, useState } from 'react';
import { UploadIcon } from '../constants';

// Import libraries for file parsing
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import mammoth from 'mammoth';

// Set worker source for pdf.js, required for it to work in a browser environment.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs`;

interface HomePageProps {
  onResumeUpload: (fileContent: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onResumeUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File | undefined) => {
    if (!file) return;

    setParseError(null);
    setIsParsing(true);

    try {
      let text = '';
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const pageTexts = await Promise.all(
          Array.from({ length: pdf.numPages }, (_, i) => i + 1).map(async (pageNumber) => {
            const page = await pdf.getPage(pageNumber);
            const textContent = await page.getTextContent();
            return textContent.items.map((item: any) => item.str).join(' ');
          })
        );
        text = pageTexts.join('\n\n');
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        text = await file.text();
      } else {
        throw new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
      }
      
      if (!text.trim()) {
        throw new Error('Could not extract text from the file. It might be empty or scanned as an image.');
      }

      onResumeUpload(text);

    } catch (error) {
      console.error("Error parsing file:", error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while parsing the file.';
      setParseError(errorMessage);
    } finally {
      setIsParsing(false);
    }
  }, [onResumeUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
  };
  
  const handleDragEvents = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  }, [handleFile]);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-extrabold text-slate-800 sm:text-5xl md:text-6xl">
          Build Your Winning Application
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          Upload your resume to get started. Our AI coach will analyze it against your target job and help you craft the perfect resume and cover letter.
        </p>
      </div>
      <div 
        className={`mt-10 w-full max-w-lg p-8 border-2 border-dashed rounded-xl transition-colors ${isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300 bg-white hover:border-indigo-500'}`}
        onDragEnter={handleDragEvents}
        onDragLeave={handleDragEvents}
        onDragOver={handleDragEvents}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          {isParsing ? (
             <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="font-semibold text-slate-600">Parsing your resume...</p>
             </div>
          ) : (
            <>
              <div className="bg-indigo-100 p-4 rounded-full">
                  <UploadIcon className="w-10 h-10 text-indigo-600" />
              </div>
              <p className="text-slate-600">
                <label htmlFor="file-upload" className="font-semibold text-indigo-600 cursor-pointer hover:underline">
                  Click to upload
                </label>
                {' '}or drag and drop
              </p>
              <p className="text-sm text-slate-500">PDF, DOCX, or TXT file</p>
              <input 
                id="file-upload" 
                name="file-upload" 
                type="file" 
                className="sr-only" 
                onChange={handleFileChange} 
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                disabled={isParsing}
              />
            </>
          )}
        </div>
         {parseError && (
            <p className="mt-4 text-sm text-red-600">{parseError}</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;