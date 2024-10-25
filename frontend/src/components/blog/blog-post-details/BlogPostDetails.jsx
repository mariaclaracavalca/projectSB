import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./BlogPostDetails.css";
import Comments from '../blog-comments/Comments';
import { Row, Container } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';


const BlogPostDetails = () => {
    const { id } = useParams(); // OTTENIAMO ID POST DALLA ROTTA
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null); // STATO PER UTENTE LOGGATO 

    // FETCH DEI POST
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/blogposts/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPost(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);


    // OTTENIAMO DATI UTENTE LOGGATO
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                //DECODIFICA TOKEN 
                jwtDecode(token);

                //FETCH AL BACKEND PER OTTENERE DATI UTENTE
                fetch(`${process.env.REACT_APP_API_URL}/authors/auth/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        setUser(data); //IMPOSTIAMO DATI UTENTE NELLO STATO USER
                    })
                    .catch(error => {
                        console.error('Error in getting user information', error);
                    });

            } catch (error) {console.error('Error while decoding token', error);} //DEBUG
        }
    }, []);

    console.log("Post ID from useParams:", id); // DEBUG PER VERIFICARE SE VIENE PASSATO ID URL

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!post) return <p>Post not found.</p>;

    return (
        <Container className="mt-5">
            <Row className="blog-post-details">
                <>
                <h2>{post.title}</h2>
                <img src={post.cover} alt={post.title} />
                <p><strong>Category:</strong> {post.category}</p>

                {/* CONTROLLO PER FARE IL RENDERING CORRETTO DELL'AUTORE */}
                {post.author ? (
                    <p><strong>Author:</strong> {post.author.name} {post.author.surname}</p>
                ) : (
                    <p><strong>Author:</strong> Unknown</p>
                )}

                <p><strong>Read Time:</strong> {post.readTime.value} {post.readTime.unit}</p>
                <div className="post-content">
                    {post.content}
                </div>

                {/* PASSIAMO PROPS ID POST E DATI UTENTE LOGGATO */}
                <Comments postId={id} user={user} />
                </>
            </Row>
        </Container>
    );
};

export default BlogPostDetails;
