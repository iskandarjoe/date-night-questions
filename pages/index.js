import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';

const questionData = {
  romantic: {
    color: '#FF6B6B',
    questions: [
      "What was your first impression of me?",
      "What's your favorite memory of us together?",
      "Where do you see us in five years?",
      "What makes you feel most loved?",
      "What's your ideal date night?",
    ]
  },
  deep: {
    color: '#4ECDC4',
    questions: [
      "What's your biggest fear?",
      "What's a dream you've never told anyone?",
      "How has your childhood shaped you?",
      "What's the most important life lesson you've learned?",
      "What do you want to be remembered for?",
    ]
  },
  fun: {
    color: '#FFD93D',
    questions: [
      "If you could have any superpower, what would it be?",
      "What's the most spontaneous thing you've done?",
      "If we could teleport anywhere right now, where would we go?",
      "What's the silliest thing you've done for love?",
      "What's your perfect weekend?",
    ]
  },
  future: {
    color: '#6C5CE7',
    questions: [
      "What's your biggest goal right now?",
      "What adventure should we plan next?",
      "How do you want to grow together?",
      "What's on your bucket list?",
      "What new thing would you like us to try together?",
    ]
  }
};

const DateNightQuestions = () => {
  const [questionHistory, setQuestionHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [points, setPoints] = useState({});
  const [showStats, setShowStats] = useState(false);
  const cardRef = useRef(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Initialize points
  useEffect(() => {
    const initialPoints = Object.keys(questionData).reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {});
    setPoints(initialPoints);
  }, []);

  // Get random question
  const getRandomQuestion = () => {
    const categories = Object.keys(questionData);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const questions = questionData[category].questions;
    const question = questions[Math.floor(Math.random() * questions.length)];
    return { category, question };
  };

  // Add new question
  const addNewQuestion = () => {
    const newQuestion = getRandomQuestion();
    setQuestionHistory(prev => [...prev, newQuestion]);
    setCurrentIndex(prev => prev + 1);
  };

  // Initialize first question
  useEffect(() => {
    if (currentIndex === -1) {
      addNewQuestion();
    }
  }, []);

  const handleDragStart = (e) => {
    const point = e.touches ? e.touches[0] : e;
    setIsDragging(true);
    setDragStart({ x: point.clientX, y: point.clientY });
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const point = e.touches ? e.touches[0] : e;
    
    const offset = {
      x: point.clientX - dragStart.x,
      y: point.clientY - dragStart.y
    };
    
    setDragOffset(offset);

    if (cardRef.current) {
      const rotate = offset.x * 0.1;
      cardRef.current.style.transform = 
        `translate(${offset.x}px, ${offset.y}px) rotate(${rotate}deg)`;
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const swipeThreshold = 100;
    const currentQuestion = questionHistory[currentIndex];

    if (Math.abs(dragOffset.x) > swipeThreshold) {
      // Horizontal swipe
      if (dragOffset.x > 0) {
        // Right swipe - next question
        if (currentIndex < 24) {
          addNewQuestion();
        } else {
          setShowStats(true);
        }
      } else {
        // Left swipe - previous question
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
        }
      }
    } else if (Math.abs(dragOffset.y) > swipeThreshold) {
      // Vertical swipe
      const pointChange = dragOffset.y > 0 ? -1 : 1; // up is positive, down is negative
      setPoints(prev => ({
        ...prev,
        [currentQuestion.category]: prev[currentQuestion.category] + pointChange
      }));
    }

    // Reset card position
    if (cardRef.current) {
      cardRef.current.style.transform = 'none';
      cardRef.current.style.transition = 'transform 0.3s ease';
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transition = 'none';
        }
      }, 300);
    }
    setDragOffset({ x: 0, y: 0 });
  };

  if (showStats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Category Points</h2>
          <div className="space-y-4">
            {Object.entries(points).map(([category, score]) => (
              <div 
                key={category}
                className="flex justify-between items-center p-3 rounded"
                style={{ backgroundColor: `${questionData[category].color}22` }}
              >
                <span className="capitalize">{category}</span>
                <span className="font-bold">{score}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setShowStats(false);
              setQuestionHistory([]);
              setCurrentIndex(-1);
              setPoints(Object.keys(questionData).reduce((acc, category) => {
                acc[category] = 0;
                return acc;
              }, {}));
            }}
            className="mt-8 w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Start Over
          </button>
        </Card>
      </div>
    );
  }

  const currentQuestion = questionHistory[currentIndex];
  if (!currentQuestion) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card
        ref={cardRef}
        className="w-full max-w-md aspect-[3/4] m-4 cursor-grab active:cursor-grabbing"
        style={{
          backgroundColor: questionData[currentQuestion.category].color,
          color: 'white',
          touchAction: 'none'
        }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div className="flex items-center justify-center h-full p-8 text-center">
          <p className="text-2xl font-light leading-relaxed">
            {currentQuestion.question}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default DateNightQuestions;