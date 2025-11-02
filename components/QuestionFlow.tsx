'use client';

import { useState } from 'react';

interface Question {
  id: string;
  question: string;
  type: 'text' | 'select' | 'multi-select';
  options?: string[];
  key: string;
}

interface QuestionFlowProps {
  onComplete: (answers: Record<string, any>) => void;
  onCancel: () => void;
}

const questions: Question[] = [
  {
    id: '1',
    question: "What's your Warplet's personality?",
    type: 'select',
    options: ['Confident', 'Playful', 'Mysterious', 'Energetic', 'Calm', 'Bold', 'Creative'],
    key: 'personality',
  },
  {
    id: '2',
    question: 'What genre fits your Warplet?',
    type: 'select',
    options: ['Electronic', 'Hip-Hop', 'Rock', 'Pop', 'Jazz', 'Ambient', 'Experimental'],
    key: 'genre',
  },
  {
    id: '3',
    question: 'What mood should the song have?',
    type: 'select',
    options: ['Energetic', 'Melancholic', 'Uplifting', 'Dark', 'Dreamy', 'Powerful', 'Chill'],
    key: 'mood',
  },
  {
    id: '4',
    question: 'Any specific themes or topics?',
    type: 'text',
    key: 'themes',
  },
];

export default function QuestionFlow({ onComplete, onCancel }: QuestionFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  const handleAnswer = (value: any) => {
    setAnswers({
      ...answers,
      [currentQuestion.key]: value,
    });
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete(answers);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">
            Question {currentStep + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 mb-6 border border-purple-500/30">
        <h2 className="text-2xl font-bold text-white mb-6">{currentQuestion.question}</h2>

        {/* Answer Input */}
        {currentQuestion.type === 'select' && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                  answers[currentQuestion.key] === option
                    ? 'border-purple-400 bg-purple-500/20 text-white'
                    : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-purple-500'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'text' && (
          <textarea
            value={answers[currentQuestion.key] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Enter themes or topics..."
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            rows={4}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={currentStep === 0 ? onCancel : handlePrevious}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          {currentStep === 0 ? 'Cancel' : 'Previous'}
        </button>
        <button
          onClick={handleNext}
          disabled={!answers[currentQuestion.key]}
          className={`px-6 py-3 rounded-lg transition-colors ${
            answers[currentQuestion.key]
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLastStep ? 'Generate Music' : 'Next'}
        </button>
      </div>
    </div>
  );
}

