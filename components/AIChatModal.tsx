import React, { useState, useEffect } from 'react';
import { editTextWithAI } from '../services/geminiService';
import { WandIcon } from '../constants';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText: string;
  documentTitle: string;
  onSaveChanges: (newText: string) => void;
}

const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  initialText,
  documentTitle,
  onSaveChanges,
}) => {
  const [currentText, setCurrentText] = useState(initialText);
  const [instruction, setInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentText(initialText);
      setError(null);
      setInstruction('');
    }
  }, [isOpen, initialText]);
  
  const handleAISubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!instruction.trim() || isLoading) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
          const revisedText = await editTextWithAI(currentText, instruction);
          setCurrentText(revisedText);
          setInstruction('');
      } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred during AI edit.');
      } finally {
          setIsLoading(false);
      }
  };

  const handleSave = () => {
    onSaveChanges(currentText);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-chat-modal-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col transform transition-all" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 id="ai-chat-modal-title" className="text-xl font-bold text-slate-800">
            Manual Edit: <span className="text-indigo-600">{documentTitle}</span>
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-6 overflow-y-auto">
          <textarea
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            className="w-full h-full p-4 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900"
            aria-label={`${documentTitle} content`}
          />
        </main>
        
        {/* Footer with Chat Input */}
        <footer className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
            {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
            <form onSubmit={handleAISubmit} className="flex items-center gap-3">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                        placeholder="e.g., 'Make this sound more professional' or 'Add a sentence about my experience with Python'"
                        className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        disabled={isLoading}
                    />
                     <button 
                        type="submit" 
                        disabled={isLoading || !instruction.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-400"
                        aria-label="Submit AI instruction"
                     >
                        {isLoading ? (
                             <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <WandIcon className="w-5 h-5" />
                        )}
                    </button>
                </div>
                <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                >
                    Save Changes
                </button>
            </form>
        </footer>
      </div>
    </div>
  );
};

export default AIChatModal;