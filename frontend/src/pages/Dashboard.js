import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    IconButton,
    Grid
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import ClipLoader from 'react-spinners/ClipLoader';

function Dashboard() {
    const [flashcards, setFlashcards] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editId, setEditId] = useState(null);
    const [editedQuestion, setEditedQuestion] = useState('');
    const [editedAnswer, setEditedAnswer] = useState('');
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        axios
            .get('https://cards-dvgk.onrender.com/flashcards')
            .then((response) => {
                setFlashcards(response.data.reverse());
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    }, []);

    const handleDelete = (id) => {
        axios
            .delete(`https://cards-dvgk.onrender.com/flashcards/${id}`)
            .then(() => {
                setFlashcards(flashcards.filter((flashcard) => flashcard.id !== id));
            })
            .catch((error) => console.error(error));
    };

    const handleEdit = (id) => {
        setEditId(id);
        const flashcard = flashcards.find((card) => card.id === id);
        setEditedQuestion(flashcard.question);
        setEditedAnswer(flashcard.answer);
    };

    const handleUpdate = () => {
        axios
            .put(`https://cards-dvgk.onrender.com/flashcards/${editId}`, {
                question: editedQuestion,
                answer: editedAnswer
            })
            .then(() => {
                setFlashcards(
                    flashcards.map((card) =>
                        card.id === editId
                            ? { ...card, question: editedQuestion, answer: editedAnswer }
                            : card
                    )
                );
                setEditId(null);
                setEditedQuestion('');
                setEditedAnswer('');
            })
            .catch((error) => console.error(error));
    };

    const handleAddFlashcard = () => {
        setIsAdding(true);
        axios
            .post('https://cards-dvgk.onrender.com/flashcards', {
                question: newQuestion,
                answer: newAnswer
            })
            .then((response) => {
                setFlashcards([...flashcards, response.data]);
                setNewQuestion('');
                setNewAnswer('');
                setIsAdding(false);
                alert('Flashcard added successfully!');
                window.location.reload();
            })
            .catch((error) => {
                console.error(error);
                setIsAdding(false);
                alert('Failed to add flashcard. Please try again.');
            });
    };

    const filteredFlashcards = flashcards.filter(
        (flashcard) =>
            (flashcard.question &&
                flashcard.question.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (flashcard.answer &&
                flashcard.answer.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Container style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <TextField
                label="Search Flashcards"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '1rem' }}
            />
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100px' }}>
                    <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
                </div>
            ) : (
                <>
                    {filteredFlashcards.length > 0 ? (
                        <Grid container spacing={2}>
                            {filteredFlashcards.slice(0, 3).map((flashcard) => (
                                <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                                    <Card style={{ minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <CardContent>
                                            <Typography variant="h6">{flashcard.question}</Typography>
                                            <Typography variant="body2">{flashcard.answer}</Typography>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEdit(flashcard.id)}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                color="secondary"
                                                onClick={() => handleDelete(flashcard.id)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography variant="body1" style={{ textAlign: 'center', marginTop: '2rem' }}>
                            No flashcards available. Please add new flashcards below.
                        </Typography>
                    )}
                </>
            )}
            {editId && (
                <div style={{ marginTop: '2rem' }}>
                    <Typography variant="h6">Edit Flashcard</Typography>
                    <TextField
                        label="Question"
                        variant="outlined"
                        fullWidth
                        value={editedQuestion}
                        onChange={(e) => setEditedQuestion(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        label="Answer"
                        variant="outlined"
                        fullWidth
                        value={editedAnswer}
                        onChange={(e) => setEditedAnswer(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                    />
                    <Button variant="contained" color="primary" onClick={handleUpdate}>
                        Update Flashcard
                    </Button>
                </div>
            )}
            <div style={{ marginTop: '2rem' }}>
                <Typography variant="h6">Add New Flashcard</Typography>
                <TextField
                    label="Question"
                    variant="outlined"
                    fullWidth
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    style={{ marginBottom: '1rem' }}
                />
                <TextField
                    label="Answer"
                    variant="outlined"
                    fullWidth
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    style={{ marginBottom: '1rem' }}
                />
                <Button variant="contained" color="primary" onClick={handleAddFlashcard} disabled={isAdding}>
                    {isAdding ? <ClipLoader size={20} color={"#fff"} /> : 'Add Flashcard'}
                </Button>
            </div>
        </Container>
    );
}

export default Dashboard;
