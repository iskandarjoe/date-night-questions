import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const questions = {
  deep: [
    "What's your biggest dream that you've never told anyone?",
    "How has your perspective on love changed over the years?",
    "What's a childhood memory that shaped who you are today?",
    "What's the most valuable life lesson you've learned so far?",
  ],
  fun: [
    "If you could instantly master any skill, what would it be?",
    "What's the most spontaneous thing you've ever done?",
    "If we could teleport anywhere right now, where would you go?",
    "What's your idea of a perfect weekend?",
  ],
  future: [
    "Where do you see yourself in 5 years?",
    "What's one goal you'd like us to achieve together?",
    "What kind of adventure should we plan next?",
    "How do you imagine our ideal life together?",
  ],
  personal: [
    "What makes you feel most loved and appreciated?",
    "What's your favorite way to recharge after a long day?",
    "What's something you're proud of but rarely share?",
    "What's your love language and how can I better speak it?",
  ]
};

const DateNightQuestions = () => {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentCategory, setCurrentCategory] = useState('deep');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const getRandomQuestion = (category) => {
    const categoryQuestions = questions[category];
    const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
    return categoryQuestions[randomIndex];
  };

  const getRandomDifferentCategory = () => {
    const categories = Object.keys(questions);
    const filteredCategories = categories.filter(cat => cat !== currentCategory);
    return filteredCategories[Math.floor(Math.random() * filteredCategories.length)];
  };

  useEffect(() => {
    setCurrentQuestion(getRandomQuestion(currentCategory));
  }, [currentCategory]);

  const handleSwipe = (offsetX, offsetY) => {
    const threshold = 50; // minimum swipe distance
    const isHorizontal = Math.abs(offsetX) > Math.abs(offsetY);
    
    if (Math.abs(offsetX) < threshold && Math.abs(offsetY) < threshold) {
      return; // Ignore small movements
    }

    if (isHorizontal) {
      // Horizontal swipe - next/previous question
      setCurrentQuestion(getRandomQuestion(currentCategory));
    } else {
      // Vertical swipe
      if (offsetY < -threshold) {
        // Swipe up - like, stay in category
        setCurrentQuestion(getRandomQuestion(currentCategory));
      } else if (offsetY > threshold) {
        // Swipe down - change category
        const newCategory = getRandomDifferentCategory();
        setCurrentCategory(newCategory);
      }
    }
  };

  // Mouse Events
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setDragOffset({ x: 0, y: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const offsetX = e.clientX - startPos.x;
    const offsetY = e.clientY - startPos.y;
    setDragOffset({ x: offsetX, y: offsetY });
    
    if (cardRef.current) {
      const rotate = offsetX * 0.1;
      cardRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg)`;
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    handleSwipe(dragOffset.x, dragOffset.y);
    setIsDragging(false);
    
    if (cardRef.current) {
      cardRef.current.style.transform = 'none';
      cardRef.current.style.transition = 'transform 0.3s ease';
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transition = 'none';
        }
      }, 300);
    }
  };

  // Touch Events
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setStartPos({ x: touch.clientX, y: touch.clientY });
    setDragOffset({ x: 0, y: 0 });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const offsetX = touch.clientX - startPos.x;
    const offsetY = touch.clientY - startPos.y;
    setDragOffset({ x: offsetX, y: offsetY });
    
    if (cardRef.current) {
      const rotate = offsetX * 0.1;
      cardRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg)`;
    }
    
    // Prevent scrolling while swiping
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    handleSwipe(dragOffset.x, dragOffset.y);
    setIsDragging(false);
    
    if (cardRef.current) {
      cardRef.current.style.transform = 'none';
      cardRef.current.style.transition = 'transform 0.3s ease';
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transition = 'none';
        }
      }, 300);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
          setCurrentQuestion(getRandomQuestion(currentCategory));
          break;
        case 'ArrowUp':
          setCurrentQuestion(getRandomQuestion(currentCategory));
          break;
        case 'ArrowDown':
          const newCategory = getRandomDifferentCategory();
          setCurrentCategory(newCategory);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentCategory]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Date Night Questions</h1>
        <p className="text-gray-600">
          Category: {currentCategory}
        </p>
      </div>
      
      <Card 
        ref={cardRef}
        className={`w-full max-w-md p-8 shadow-lg bg-white transition-colors
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          ${Math.abs(dragOffset.y) > 50 ? 'bg-gray-50' : ''}
          ${Math.abs(dragOffset.x) > 50 ? 'bg-blue-50' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="text-center mb-8">
          <div className="text-xl font-medium select-none">
            {currentQuestion}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <ArrowUp className="w-4 h-4" />
            <span>Like</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ArrowDown className="w-4 h-4" />
            <span>Different Topic</span>
          </div>
        </div>
      </Card>

      <div className="mt-4 text-sm text-gray-500 text-center">
        <p>Swipe or use arrow keys to navigate</p>
        <p>↑ Like question | ↓ Change topic</p>
        <p>← → Next random question</p>
      </div>
    </div>
  );
};

export default DateNightQuestions;