import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { BTTN_AGAIN, BTTN_GOOD, setTimeoutDate } from './review'
import { shuffleDeck } from './shuffleDeck';


function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    getFlashcards()
    .then((data) => {
      setFlashcards(data);
    });
  }, []);

  const handleCardClick = () => {
    setShowAnswer(!showAnswer);
  };

  const handleNextClick = () => {
    saveFlashcards(flashcards);
    console.log("next click");
    setShowAnswer(false);
    setFlashcards(shuffleDeck(flashcards));
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

  const handleAgain = () => {
    console.log('inside handleAgain');
    setTimeoutDate(currentCard, BTTN_AGAIN);
    console.log('inside after setTimeoutDate');
    handleNextClick();
    console.log('inside after handleNextClick');
  };

  const handleGood = () => {
    console.log('inside handleGood');
    setTimeoutDate(currentCard, BTTN_GOOD);
    console.log('inside after setTimeoutDate');
    handleNextClick();
    console.log('inside after handleNextClick');
  };


  if (flashcards.length === 0) {
    return <div>Loading...</div>;
  }

  const currentCard = flashcards[0];

  return (
    <div className="App">
      <div className="flashcard" onClick={handleCardClick}>
        {showAnswer ? currentCard.back : currentCard.front}
      </div>
      {
        showAnswer === true ? 
       <div>
        <button onClick={handleAgain}>Again</button>
        <button onClick={handleGood}>Good</button>
        </div>
        : ''
     }
      <div className="counter">
        Views: {currentCard.counter}
      </div>
    </div>
  );
}

export default App;
