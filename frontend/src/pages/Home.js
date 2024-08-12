import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';
import './Home.css';

function Home() {
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFlashcards, setFilteredFlashcards] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        axios.get('https://cards-dvgk.onrender.com/flashcards')
            .then(response => {
                setFlashcards(response.data);
                setFilteredFlashcards(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        const filtered = flashcards.filter(flashcard =>
            flashcard.question.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredFlashcards(filtered);
        setCurrentIndex(0);
        setIsFlipped(false);
    }, [searchTerm, flashcards]);

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredFlashcards.length);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredFlashcards.length) % filteredFlashcards.length);
    };

    const flipCard = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="container">
            <h1 className="title">Flashcards</h1>
            <input
                type="text"
                placeholder="Search for a question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />
            {isLoading ? (
                <div className="loader-container">
                    <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
                </div>
            ) : (
                <>
                    {filteredFlashcards.length > 0 ? (
                        <div
                            className={`flashcard ${isFlipped ? 'flipped' : ''}`}
                            onClick={flipCard}
                        >
                            <div className="flashcard-inner">
                                <div className="flashcard-front">
                                    <h3>Question: {filteredFlashcards[currentIndex].question}</h3>
                                </div>
                                <div className="flashcard-back">
                                    <h3>Answer: {filteredFlashcards[currentIndex].answer}</h3>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="no-flashcards">
                            <p>No flashcards found. Please try a different search term or add new flashcards in the <a href="/dashboard">Dashboard</a>.</p>
                        </div>
                    )}
                    <div className="buttons">
                        <button
                            onClick={handlePrev}
                            disabled={filteredFlashcards.length <= 1}
                            className="button prev"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={filteredFlashcards.length <= 1}
                            className="button next"
                        >
                            Next
                        </button>
                    </div>
                    <p className="info-text">
                        Click on the card to flip and reveal the answer.
                        Use the "Previous" and "Next" buttons to navigate through the flashcards.
                    </p>
                </>
            )}
        </div>
    );
}

export default Home;
