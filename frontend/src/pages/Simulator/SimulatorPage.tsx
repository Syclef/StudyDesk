import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNextQuestion, recordResponse, startStudySession } from '../../data/studySessions';
import { ChevronLeft, ChevronRight, XCircle, Info, Flag, CheckCircle2 } from 'lucide-react';

interface Question {
  id: string;
  index: number;
  total: number;
  stem: string;
  choices: Record<string, string>;
  correctAnswer: string;
  explanation: string;
}

const SimulatorPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  
  // Ref for the progress bar to avoid inline-style errors
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (taskId) {
      const id = startStudySession(taskId);
      setSessionId(id);
      const firstQ = getNextQuestion(id);
      setCurrentQuestion(firstQ as unknown as Question);
    }
  }, [taskId]);

  // Update progress bar without inline styles
  useEffect(() => {
    if (progressRef.current && currentQuestion) {
      const percentage = (currentQuestion.index / currentQuestion.total) * 100;
      progressRef.current.style.width = `${percentage}%`;
    }
  }, [currentQuestion]);

  const handleCheckAnswer = () => {
    if (!sessionId || !currentQuestion || !selectedOption) return;
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    recordResponse(sessionId, currentQuestion.id, selectedOption, isCorrect);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (!sessionId) return;
    const next = getNextQuestion(sessionId);
    if (next) {
      setCurrentQuestion(next as unknown as Question);
      setSelectedOption(null);
      setShowExplanation(false);
      setEliminatedOptions([]);
    } else {
      navigate('/');
    }
  };

  const toggleEliminate = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    if (showExplanation) return;
    setEliminatedOptions(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  if (!currentQuestion) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <button 
          onClick={() => navigate('/')} 
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="Close Session"
          aria-label="Close Session"
        >
          <XCircle size={24} />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
            Question {currentQuestion.index} of {currentQuestion.total}
          </span>
          <div className="w-48 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
            {/* Progress Bar with ref instead of inline style */}
            <div ref={progressRef} className="h-full bg-blue-600 transition-all duration-500 ease-out" />
          </div>
        </div>
        
        <button className="text-gray-400" title="Flag Question" aria-label="Flag Question">
          <Flag size={20} />
        </button>
      </header>

      <main className="flex-grow max-w-3xl mx-auto w-full p-6 md:p-12 pb-32">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight mb-12">
          {currentQuestion.stem}
        </h2>

        <div className="space-y-4">
          {Object.entries(currentQuestion.choices).map(([key, value]) => {
            const isSelected = selectedOption === key;
            const isCorrect = key === currentQuestion.correctAnswer;
            const isEliminated = eliminatedOptions.includes(key);

            let containerClasses = "border-gray-200 bg-white hover:border-blue-300";
            if (isSelected) containerClasses = "border-blue-600 bg-blue-50 z-10 shadow-md";
            if (showExplanation && isCorrect) containerClasses = "border-green-500 bg-green-50 z-10";
            if (showExplanation && isSelected && !isCorrect) containerClasses = "border-red-500 bg-red-50 z-10";
            if (isEliminated && !showExplanation) containerClasses = "opacity-30 grayscale scale-[0.98] border-gray-100 bg-gray-50";

            return (
              <div
                key={key}
                onClick={() => !showExplanation && setSelectedOption(key)}
                className={`relative group flex items-start p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${containerClasses}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold mr-4 mt-0.5 transition-colors
                  ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'}
                  ${showExplanation && isCorrect ? 'bg-green-500 border-green-500 text-white' : ''}
                `}>
                  {showExplanation && isCorrect ? <CheckCircle2 size={18} /> : key}
                </div>
                
                <span className={`text-lg font-medium leading-snug flex-grow ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                  {value}
                </span>

                {!showExplanation && (
                  <button 
                    onClick={(e) => toggleEliminate(e, key)}
                    className="ml-2 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminate Option"
                    aria-label={`Eliminate Option ${key}`}
                  >
                    <XCircle size={20} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-10 p-8 bg-slate-900 rounded-3xl text-white shadow-2xl animate-in fade-in slide-in-from-bottom-6">
            <div className="flex items-center gap-3 mb-4">
              <Info size={20} className="text-blue-400" />
              <span className="font-black text-xs uppercase tracking-[0.2em] text-blue-400">Rationalization</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-lg">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 p-6 z-20">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <button 
            className="flex items-center gap-2 text-gray-400 font-bold px-4 py-2"
            disabled={currentQuestion.index === 1 || showExplanation}
            title="Previous Question"
          >
            <ChevronLeft size={20} /> <span className="hidden md:inline">Previous</span>
          </button>

          {!showExplanation ? (
            <button
              onClick={handleCheckAnswer}
              disabled={!selectedOption}
              className={`px-12 py-4 rounded-2xl font-black uppercase tracking-widest transition-all
                ${selectedOption ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}
              `}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-12 py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest shadow-xl shadow-slate-200"
            >
              Next Question
            </button>
          )}

          <button 
            className="flex items-center gap-2 text-blue-600 font-bold px-4 py-2"
            onClick={handleNext}
            title="Skip Question"
          >
            <span className="hidden md:inline">Skip</span> <ChevronRight size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default SimulatorPage;