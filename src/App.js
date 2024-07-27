import React, { useState, useEffect } from 'react';
import './App.css';
const fs = require('fs');

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    console.log("fetching flashcards from json");
    // Fetching the flashcards data from the JSON file
    fetch('/flashcards.json')
      .then(response => response.json())
      .then(data => setFlashcards(data))
      .catch(error => console.error('Error fetching flashcards:', error));
  }, []);

  const handleCardClick = () => {
    setShowAnswer(!showAnswer);
    console.log("handling card click");
    incrementCounter(currentCardIndex);
  };

  const handleNextClick = () => {
    console.log("next click");
    setShowAnswer(false);
    setCurrentCardIndex((currentCardIndex + 1) % flashcards.length);
  };

  const incrementCounter = (index) => {
    var counter = flashcards[index].counter + 1;
    console.log("about to increment counter");
    setFlashcards(prevFlashcards => {
      console.log("incrementing counter 1");
      const updatedFlashcards = [...prevFlashcards];
      console.log("incrementing counter 2");
      updatedFlashcards[index].counter = counter;
      return updatedFlashcards;
    });

    // Simulate saving updated counter to backend or JSON file
    // In a real-world scenario, you would send this data to a server
    console.log(`Updated flashcard ${flashcards[index].id} counter: ${flashcards[index].counter}`);
  };

  useEffect(() => {
    console.log("writing to file");
    fs.writeFile("/flashcards.json", flashcards);
  }, [flashcards]);

  if (flashcards.length === 0) {
    return <div>Loading...</div>;
  }

  const currentCard = flashcards[currentCardIndex];

  return (
    <div className="App">
      <div className="flashcard" onClick={handleCardClick}>
        {showAnswer ? currentCard.back : currentCard.front}
      </div>
      <button onClick={handleNextClick}>Next</button>
      <div className="counter">
        Views: {currentCard.counter}
      </div>
    </div>
  );
}

export default App;
