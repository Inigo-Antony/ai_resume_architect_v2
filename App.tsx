import React, { useState, useCallback } from 'react';
import { Page, AnalysisResult, EditingField, StructuredResume, StructuredCoverLetter, Experience, Education, ImprovementAnswers } from './types';
import HomePage from './components/HomePage';
import AnalysisPage from './components/AnalysisPage';
import ResultsPage from './components/ResultsPage';
import AIChatModal from './components/AIChatModal';
import ImprovementPage from './components/ImprovementPage';
import { analyzeAndGenerate, regenerateWithAnswers } from './services/geminiService';
import { HomeIcon, WandIcon } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [resumeText, setResumeText] = useState<string>('');
  const [originalResumeText, setOriginalResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [editingField, setEditingField] = useState<EditingField | null>(null);
  const [textToEdit, setTextToEdit] = useState('');

  const handleGoHome = () => {
    setCurrentPage(Page.Home);
    setResumeText('');
    setOriginalResumeText('');
    setJobDescription('');
    setAnalysisResult(null);
    setError(null);
  };

  const handleResumeUpload = useCallback((fileContent: string) => {
    setResumeText(fileContent);
    setOriginalResumeText(fileContent); // Save original for regeneration
    setCurrentPage(Page.Analysis);
    setError(null);
  }, []);

  const handleAnalysis = useCallback(async (jd: string) => {
    if (!originalResumeText) {
      setError("Resume is missing. Please go back and upload it.");
      return;
    }
    setJobDescription(jd);
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeAndGenerate(originalResumeText, jd);
      setAnalysisResult(result);
      setCurrentPage(Page.Results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [originalResumeText]);
  
  const handleStartImprovement = useCallback(() => {
    setCurrentPage(Page.Improvement);
  }, []);

  const handleImprovementSubmit = useCallback(async (answers: ImprovementAnswers) => {
    if (!originalResumeText || !jobDescription || !analysisResult) {
        setError("Missing data for improvement. Please start over.");
        setCurrentPage(Page.Home);
        return;
    }
    setIsLoading(true);
    setError(null);
    setCurrentPage(Page.Results); // Go back to results to show loading state there
    try {
        const result = await regenerateWithAnswers(originalResumeText, jobDescription, answers);
        setAnalysisResult(result);
    } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred during improvement.");
    } finally {
        setIsLoading(false);
    }
  }, [originalResumeText, jobDescription, analysisResult]);


  const convertResumeToString = (resume: StructuredResume): string => {
      let str = `${resume.contactInfo.name}\n${resume.contactInfo.email} | ${resume.contactInfo.phone} | ${resume.contactInfo.linkedin}\n${resume.contactInfo.address}\n\n`;
      str += `SUMMARY\n${resume.summary}\n\n`;
      const createSection = (title: string, items: any[], formatter: (item: any) => string) => {
          if (!items || items.length === 0) return '';
          let sectionStr = `${title.toUpperCase()}\n-----------------\n`;
          sectionStr += items.map(formatter).join('\n');
          return sectionStr + '\n\n';
      }
      str += createSection('WORK EXPERIENCE', resume.experience, (item: Experience) => `* ${item.title} at ${item.company}, ${item.location} (${item.dates})\n  - ${item.description.join('\n  - ')}`);
      str += createSection('PROJECTS', resume.projects, (item: Experience) => `* ${item.title} (${item.dates})\n  - ${item.description.join('\n  - ')}`);
      str += createSection('EDUCATION', resume.education, (item: Education) => `* ${item.degree}, ${item.institution} (${item.dates})\n  - ${item.details.join('\n  - ')}`);
      if(resume.publications && resume.publications.length > 0) {
        str += createSection('PUBLICATIONS', resume.publications, (item: Experience) => `* ${item.title} - ${item.company} (${item.dates})\n  ${item.description.join('\n')}`);
      }
      str += `SKILLS\n-----------------\n` + resume.skills.map(s => `${s.category}: ${s.skills.join(', ')}`).join('\n');
      return str;
  }
  
  const convertCoverLetterToString = (cl: StructuredCoverLetter): string => {
      let str = `${cl.contactInfo.name}\n${cl.contactInfo.address}\n\n`;
      str += `${cl.date}\n\n`;
      str += `${cl.recipientName}\n${cl.recipientCompany}\n\n`;
      str += `Dear ${cl.recipientName},\n\n`;
      str += cl.body.join('\n\n');
      str += `\n\n${cl.closing}\n${cl.contactInfo.name}`;
      return str;
  }

  const handleOpenAIEdit = useCallback((field: EditingField) => {
    setEditingField(field);
    if (!analysisResult) return;
    
    const content = field === 'resume' ? analysisResult.revisedResume : analysisResult.draftCoverLetter;
    let textToEditText = '';
    if (typeof content === 'string') {
        textToEditText = content;
    } else if (field === 'resume') {
        textToEditText = convertResumeToString(content as StructuredResume);
    } else {
        textToEditText = convertCoverLetterToString(content as StructuredCoverLetter);
    }
    setTextToEdit(textToEditText);
    setIsChatOpen(true);
  }, [analysisResult]);

  const handleSaveChanges = useCallback((newText: string) => {
    if (analysisResult && editingField) {
        setAnalysisResult(prev => prev ? {
            ...prev,
            ...(editingField === 'resume' && { revisedResume: newText }),
            ...(editingField === 'coverLetter' && { draftCoverLetter: newText }),
        } : null);
    }
    setIsChatOpen(false);
    setEditingField(null);
  }, [analysisResult, editingField]);
  
  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage onResumeUpload={handleResumeUpload} />;
      case Page.Analysis:
        return (
          <AnalysisPage
            resumeText={resumeText}
            onAnalyze={handleAnalysis}
            isLoading={isLoading}
          />
        );
      case Page.Results:
        return analysisResult ? (
          isLoading ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)] text-center">
              <svg className="animate-spin h-12 w-12 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <h2 className="text-2xl font-bold text-slate-700">Regenerating with your feedback...</h2>
            </div>
          ) : (
            <ResultsPage
              result={analysisResult}
              onEditManually={handleOpenAIEdit}
              onImproveWithAI={handleStartImprovement}
            />
          )
        ) : (
          <div className="text-center p-8">
            <p className="text-red-500">Could not display results. Please try again.</p>
          </div>
        );
       case Page.Improvement:
         return analysisResult ? (
            <ImprovementPage
                questions={analysisResult.clarifyingQuestions}
                onSubmit={handleImprovementSubmit}
                isLoading={isLoading}
             />
         ) : (
            <div className="text-center p-8">
                <p className="text-red-500">Could not display questions. Please start over.</p>
            </div>
         );
      default:
        return <HomePage onResumeUpload={handleResumeUpload} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
       <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-3">
            <div className="bg-slate-800 p-2 rounded-lg">
                <WandIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">AI Resume Architect</h1>
        </div>
        {currentPage !== Page.Home && (
          <button
            onClick={handleGoHome}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Start Over</span>
          </button>
        )}
      </header>
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        )}
        {renderPage()}
      </main>
      <AIChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialText={textToEdit}
        documentTitle={editingField === 'resume' ? 'Resume' : 'Cover Letter'}
        onSaveChanges={handleSaveChanges}
       />
    </div>
  );
};

export default App;