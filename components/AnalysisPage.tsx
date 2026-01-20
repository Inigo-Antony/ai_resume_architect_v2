import React, { useState } from 'react';

interface AnalysisPageProps {
  resumeText: string;
  onAnalyze: (jobDescription: string) => void;
  isLoading: boolean;
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({ resumeText, onAnalyze, isLoading }) => {
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobDescription.trim()) {
      onAnalyze(jobDescription);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Job Description Input */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Paste Job Description</h2>
        <p className="text-slate-600 mb-4">
            Paste the full job description below. Our AI will analyze it to find keywords and tailor your application.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description here..."
            className="w-full flex-grow p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-white text-slate-900"
            required
            rows={15}
          />
          <button
            type="submit"
            disabled={isLoading || !jobDescription.trim()}
            className="mt-4 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Analyze & Generate'
            )}
          </button>
        </form>
      </div>

      {/* Right Column: Resume Preview */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Resume</h2>
        <div className="prose prose-slate max-w-none h-[60vh] overflow-y-auto p-4 border rounded-md bg-slate-50">
            <pre className="whitespace-pre-wrap font-sans text-sm">{resumeText}</pre>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;