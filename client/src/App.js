import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    getFlashcards()
    .then((data) => {
      setFlashcards(data);
    });
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
      setFlashcards(prevFlashcards => {
        const updatedFlashcards = [...prevFlashcards];
        updatedFlashcards[index].counter = counter;
        resolve(updatedFlashcards);
        return updatedFlashcards;
      });
    });
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

  const getFlashcards = (flashcards) => {
    return axios.get('http://localhost:5000/getFlashcards')
    .then(response => {
      console.log('Success getFlashcards:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error('Error getting flashcards:', error);
      throw error;
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
