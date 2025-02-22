import React, { useState, useEffect } from 'react';
import { Quiz } from './components/Quiz';
import { QuizHistory } from './components/QuizHistory';
import { getAttempts } from './utils/db';
import type { QuizAttempt } from './types';
import { Brain } from 'lucide-react';

function App() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isQuizActive, setIsQuizActive] = useState(false);

  useEffect(() => {
    loadAttempts();
  }, []);

  async function loadAttempts() {
    const loadedAttempts = await getAttempts();
    setAttempts(loadedAttempts);
  }

  function handleQuizComplete() {
    setIsQuizActive(false);
    loadAttempts();
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Interactive Quiz Platform</h1>
          </div>
          
          {!isQuizActive && (
            <button
              onClick={() => setIsQuizActive(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 
                       transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Start New Quiz
            </button>
          )}
        </div>

        {isQuizActive ? (
          <Quiz onComplete={handleQuizComplete} />
        ) : (
          <QuizHistory attempts={attempts} />
        )}
      </div>
    </div>
  );
}

export default App;