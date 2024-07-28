import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import flashcardsData from "./flashcards.json";

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    console.log("fetching flashcards from json");
    setFlashcards(flashcardsData);
  }, []);

  const handleCardClick = () => {
    setShowAnswer(!showAnswer);
    console.log("handling card click");
    incrementCounter(currentCardIndex)
    .then((updatedFlashcards) => {
      saveFlashcards(updatedFlashcards);
    })
    .catch((error) => {
      console.error('error incrementing counter')
    });
  };

  const handleNextClick = () => {
    console.log("next click");
    setShowAnswer(false);
    setCurrentCardIndex((currentCardIndex + 1) % flashcards.length);
  };

  const incrementCounter = (index) => {
    return new Promise((resolve) => {
      var counter = flashcards[index].counter + 1;
      console.log("about to increment counter");
      setFlashcards(prevFlashcards => {
        console.log("incrementing counter 1");
        const updatedFlashcards = [...prevFlashcards];
        console.log("incrementing counter 2");
        updatedFlashcards[index].counter = counter;
        resolve(updatedFlashcards);
        return updatedFlashcards;
      });
    });

    // Simulate saving updated counter to backend or JSON file
    // In a real-world scenario, you would send this data to a server
    console.log(`Updated flashcard ${flashcards[index].id} counter: ${flashcards[index].counter}`);
  };

  const saveFlashcards = (flashcards) => {
    axios.post('http://localhost:5000/saveFlashcards', flashcards)
      .then(response => {
        console.log('Flashcards saved:', response.data.message);
      })
      .catch(error => {
        console.error('Error saving flashcards:', error);
      });
  };

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
