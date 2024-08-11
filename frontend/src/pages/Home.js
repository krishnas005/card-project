import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        axios.get('https://cards-dvgk.onrender.com/flashcards')
            .then(response => setFlashcards(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
    };

    const flipCard = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="container">
            <h1 className="title">Flashcards</h1>
            {flashcards.length > 0 && (
                <div
                    className={`flashcard ${isFlipped ? 'flipped' : ''}`}
                    onClick={flipCard}
                >
                    <div className="flashcard-inner">
                        <div className="flashcard-front">
                            <h3>Question: {flashcards[currentIndex].question}</h3>
                        </div>
                        <div className="flashcard-back">
                            <h3>Answer: {flashcards[currentIndex].answer}</h3>
                        </div>
                    </div>
                </div>
            )}
            <div className="buttons">
                <button
                    onClick={handlePrev}
                    disabled={flashcards.length <= 1}
                    className="button prev"
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={flashcards.length <= 1}
                    className="button next"
                >
                    Next
                </button>
            </div>
            <p className="info-text">
                Click on the card to flip and reveal the answer.
                Use the "Previous" and "Next" buttons to navigate through the flashcards.
            </p>
        </div>
    );
}

export default Home;
