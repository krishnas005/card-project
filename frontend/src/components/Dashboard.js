import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchFlashcards();
    }, []);

    const fetchFlashcards = () => {
        axios.get('http://localhost:5000/flashcards')
            .then(response => {
                setFlashcards(response.data);
            })
            .catch(error => console.error(error));
    };

    const handleAddFlashcard = () => {
        if (editId) {
            axios.put(`http://localhost:5000/flashcards/${editId}`, { question, answer })
                .then(() => {
                    fetchFlashcards();
                    setEditId(null);
                });
        } else {
            axios.post('http://localhost:5000/flashcards', { question, answer })
                .then(() => {
                    fetchFlashcards();
                });
        }
        setQuestion('');
        setAnswer('');
    };

    const handleEditFlashcard = (id, question, answer) => {
        setEditId(id);
        setQuestion(question);
        setAnswer(answer);
    };

    const handleDeleteFlashcard = (id) => {
        axios.delete(`http://localhost:5000/flashcards/${id}`)
            .then(() => {
                fetchFlashcards();
            });
    };

    return (
        <div className="dashboard">
            <h2>Flashcards Dashboard</h2>
            <div className="form">
                <input
                    type="text"
                    placeholder="Question"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Answer"
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                />
                <button onClick={handleAddFlashcard}>
                    {editId ? 'Update Flashcard' : 'Add Flashcard'}
                </button>
            </div>
            <ul className="flashcards-list">
                {flashcards.map(card => (
                    <li key={card.id}>
                        <p>Q: {card.question}</p>
                        <p>A: {card.answer}</p>
                        <button onClick={() => handleEditFlashcard(card.id, card.question, card.answer)}>Edit</button>
                        <button onClick={() => handleDeleteFlashcard(card.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
