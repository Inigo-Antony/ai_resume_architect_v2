import React, { useState } from 'react';
import type { ImprovementAnswers } from '../types';

interface ImprovementPageProps {
  questions: string[];
  onSubmit: (answers: ImprovementAnswers) => void;
  isLoading: boolean;
}

const ImprovementPage: React.FC<ImprovementPageProps> = ({ questions, onSubmit, isLoading }) => {
    const [answers, setAnswers] = useState<ImprovementAnswers>({});

    const handleAnswerChange = (index: number, value: string) => {
        setAnswers(prev => ({ ...prev, [index]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(answers);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Let's Improve Your Application</h2>
            <p className="text-slate-600 mb-6">Answer these questions to provide more detail. Our AI will use this to enhance your resume and cover letter, improving your scores.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                {questions.map((q, index) => (
                    <div key={index}>
                        <label htmlFor={`question-${index}`} className="block text-md font-semibold text-slate-700 mb-2">{index + 1}. {q}</label>
                        <textarea
                            id={`question-${index}`}
                            rows={3}
                            className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-slate-50"
                            placeholder="Your answer here..."
                            value={answers[index] || ''}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                        />
                    </div>
                ))}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Regenerating...
                        </>
                    ) : (
                        'Submit & Regenerate'
                    )}
                </button>
            </form>
        </div>
    );
};

export default ImprovementPage;
