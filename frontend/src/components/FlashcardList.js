import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Flashcard from './Flashcard';
import './FlashcardList.css';

const FlashcardList = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:5000/flashcards')
            .then(response => {
                setFlashcards(response.data);
            })
            .catch(error => console.error(error));
    }, []);

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="flashcard-list">
            {flashcards.length > 0 ? (
                <Flashcard
                    question={flashcards[currentIndex].question}
                    answer={flashcards[currentIndex].answer}
                />
            ) : (
                <p>Loading flashcards...</p>
            )}
            <div className="navigation">
                <button onClick={handlePrevious} disabled={currentIndex === 0}>Previous</button>
                <button onClick={handleNext} disabled={currentIndex === flashcards.length - 1}>Next</button>
            </div>
        </div>
    );
};

export default FlashcardList;
