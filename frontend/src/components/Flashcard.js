import React, { useState } from 'react';
import './Flashcard.css';

const Flashcard = ({ question, answer }) => {
    const [flipped, setFlipped] = useState(false);

    return (
        <div className="flashcard" onClick={() => setFlipped(!flipped)}>
            <div className={flipped ? "flipped" : ""}>
                <div className="front">
                    <p>{question}</p>
                </div>
                <div className="back">
                    <p>{answer}</p>
                </div>
            </div>
        </div>
    );
};

export default Flashcard;
