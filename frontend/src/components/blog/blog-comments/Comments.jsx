import React, { useState, useEffect } from 'react';
import "./Comments.css"

const Comments = ({ postId, user }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editedComment, setEditedComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null); // Gestisce l'ID del commento in modifica
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/blogposts/${postId}/comments`);
                if (!response.ok) { throw new Error('Error fetching comments'); }
                const data = await response.json();
                setComments(data);
            } catch (error) { setError(error.message); }
        };

        fetchComments();
    }, [postId]);

    // AGGIUNTA COMMENTO
    const handleAddComment = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("JWT Token not found");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/blogposts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ content: newComment }),
            });

            if (!response.ok) {
                throw new Error('Failed to add comment');
            }

            const addedComment = await response.json();
            setComments([...comments, addedComment]);
            setNewComment('');
        } catch (error) {
            console.error("Error:", error);
            setError(error.message);
        }
    };

    // ELIMINAZIONE COMMENTO
    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/blogposts/${postId}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // JWT Token
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }
            setComments(comments.filter(comment => comment._id !== commentId)); // Rimuovi il commento dall'array
        } catch (error) {
            setError(error.message);
        }
    };

    // GESTIONE MODIFICA COMMENTO
    const handleEditComment = (commentId, content) => {
        setEditingCommentId(commentId); // Imposta il commento da modificare
        setEditedComment(content); // Imposta il contenuto del commento da modificare
    };

    // AGGIORNA COMMENTO
    const handleUpdateComment = async (commentId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("JWT Token not found");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/blogposts/${postId}/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ content: editedComment }), // Invia il commento aggiornato
            });

            if (!response.ok) {
                throw new Error('Failed to update comment');
            }

            const updatedComment = await response.json();
            setComments(comments.map(comment => comment._id === commentId ? updatedComment : comment)); // Aggiorna il commento nell'array
            setEditingCommentId(null);
            setEditedComment('');
        } catch (error) {
            console.error("Error:", error);
            setError(error.message);
        }
    };

    return (
        <div className="comments-section mt-5">
            <h5>Comments Section</h5>
            {error && <p>Error: {error}</p>}
            {comments.length > 0 ? (comments.map(comment => (
                <div key={comment._id} className="comment-container">
                    {editingCommentId === comment._id ? (
                        <div className="edit-comment">
                            <textarea
                                value={editedComment}
                                onChange={(e) => setEditedComment(e.target.value)}
                                rows="3"
                            />
                            <button
                                onClick={() => handleUpdateComment(comment._id)}
                                className='btn'>Save</button>
                            <button
                                onClick={() => setEditingCommentId(null)}
                                className='btn'>Cancel</button>
                        </div>
                    ) : (
                        <div className="single-comment">
                            <p className="author-name"><strong>{comment.author.name} {comment.author.surname}</strong></p>
                            <p className="comment-content">{comment.content}</p>
                            {user && user._id === comment.author._id && ( //VERIFICO SE L'UTENTE E' L'AUTORE DEL COMMENTO
                                <div className="comment-actions">
                                    <button
                                        onClick={() => handleEditComment(comment._id, comment.content)}
                                        className='btn'>Edit</button>
                                    <button
                                        onClick={() => handleDeleteComment(comment._id)}
                                        className='btn'>Delete</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))) : (
                <p>No comments yet.</p>
            )}

            {user ? (
                <div className="add-comment">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment"
                        rows="3"
                    />
                    <button
                        onClick={handleAddComment}
                        className="btn">
                        Add comment
                    </button>
                </div>
            ) : (
                <p>You can only comment if you are logged in</p>
            )}
        </div>

    );
};

export default Comments;
