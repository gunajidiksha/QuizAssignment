import React, { useState, useCallback, useEffect } from 'react';
import { Timer } from './Timer';
import { questions } from '../data/questions';
import type { QuizState } from '../types';
import { saveAttempt } from '../utils/db';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import clsx from 'clsx';

const SECONDS_PER_QUESTION = 30;

export function Quiz({ onComplete }: { onComplete: () => void }) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: [],
    timePerQuestion: [],
    isComplete: false,
  });
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentQuestion = questions[quizState.currentQuestionIndex];

  const handleAnswer = useCallback((answerIndex: number) => {
    if (showCorrectAnswer) return; // Prevent multiple answers

    setShowCorrectAnswer(true);
    
    // Show correct answer for 1.5 seconds before moving to next question
    setTimeout(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setQuizState((prev) => {
          const newAnswers = [...prev.answers, answerIndex];
          const newTimePerQuestion = [...prev.timePerQuestion, SECONDS_PER_QUESTION];
          
          const isLastQuestion = prev.currentQuestionIndex === questions.length - 1;
          
          if (isLastQuestion) {
            const score = newAnswers.reduce((acc, answer, index) => 
              answer === questions[index].correctAnswer ? acc + 1 : acc, 0
            );
            
            saveAttempt({
              id: Date.now().toString(),
              date: Date.now(),
              score,
              totalQuestions: questions.length,
              timePerQuestion: newTimePerQuestion,
            });
          }

          return {
            ...prev,
            answers: newAnswers,
            timePerQuestion: newTimePerQuestion,
            currentQuestionIndex: isLastQuestion ? prev.currentQuestionIndex : prev.currentQuestionIndex + 1,
            isComplete: isLastQuestion,
          };
        });

        setShowCorrectAnswer(false);
        setIsTransitioning(false);
      }, 300); // Transition duration
    }, 1500);
  }, [showCorrectAnswer]);

  const handleTimeout = useCallback(() => {
    if (!showCorrectAnswer) {
      setShowCorrectAnswer(true);
      setTimeout(() => handleAnswer(-1), 1500);
    }
  }, [handleAnswer, showCorrectAnswer]);

  useEffect(() => {
    if (quizState.isComplete) {
      onComplete();
    }
  }, [quizState.isComplete, onComplete]);

  if (!currentQuestion) return null;

  return (
    <div className={clsx(
      "w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md transition-opacity duration-300",
      isTransitioning && "opacity-0"
    )}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          Question {quizState.currentQuestionIndex + 1} of {questions.length}
        </h2>
        <Timer
          duration={SECONDS_PER_QUESTION}
          onTimeout={handleTimeout}
          isActive={!quizState.isComplete && !showCorrectAnswer}
        />
      </div>

      <div className="mb-8">
        <p className="text-lg mb-4">{currentQuestion.question}</p>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isCorrect = index === currentQuestion.correctAnswer;
            const isSelected = quizState.answers[quizState.currentQuestionIndex] === index;
            const shouldShowCorrect = showCorrectAnswer && isCorrect;
            
            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showCorrectAnswer}
                className={clsx(
                  "w-full p-4 text-left rounded-lg transition-all duration-300",
                  "hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
                  shouldShowCorrect && "bg-green-100 ring-2 ring-green-500",
                  isSelected && !shouldShowCorrect && (isCorrect ? "bg-green-100" : "bg-red-100"),
                  showCorrectAnswer && !isCorrect && "opacity-50"
                )}
              >
                <div className="flex items-center gap-2">
                  {(isSelected || shouldShowCorrect) && (
                    isCorrect ? 
                      <CheckCircle className="w-5 h-5 text-green-600" /> :
                      <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showCorrectAnswer && quizState.answers[quizState.currentQuestionIndex] === -1 && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-800">
            <Clock className="w-5 h-5" />
            <span>Time's up! The correct answer is highlighted above.</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="h-2 bg-gray-200 rounded-full flex-1 mr-4">
          <div
            className="h-2 bg-blue-500 rounded-full transition-all duration-300"
            style={{
              width: `${((quizState.currentQuestionIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}