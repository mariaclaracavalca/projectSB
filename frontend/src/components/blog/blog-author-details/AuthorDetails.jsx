import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Row, Col } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import "../blog-posts/BlogPosts.css"


const AuthorDetails = () => {
  const { id } = useParams(); //PRENDO ID DA URL
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/authors/${id}`);
        const data = await response.json();
        console.log('Dati dell\'autore:', data);
        setAuthor(data);
      } catch (error) {
        console.error('Error fetching author:', error);
      }
    };

    fetchAuthor();
  }, [id]);

  if (!author) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-5">
      <Card className="author-card details-page-card">
        <div className="image-container">
          <Card.Img variant="top" src={author.avatar} />
        </div>
        <Card.Body>
          <Card.Title>{`${author.name} ${author.surname}`}</Card.Title>
          <Card.Text>
            <strong>Email:</strong> {author.email}
          </Card.Text>
        </Card.Body>
      </Card>

      <h3 className="mt-2">Blog Posts</h3>
      <Row>
        {author.blogPosts && author.blogPosts.length > 0 ? (
          author.blogPosts.map(post => {
            console.log('Post:', post);
            return (
              <Col md={4}>
                <div className="card blog-post-card mb-3">
                  <img src={post.cover} className="card-img" alt={post.title} />
                  <div className="card-img-overlay">
                    <h5 className="card-title text-center">{post.title}</h5>
                    <p className="card-text category">
                      {post.category}
                    </p>
                    <div className="card-text content mb-2">
                      <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>
                    <Link to={`/blogposts/${post._id}`} className="btn mt-2">Read More</Link>
                  </div>
                </div>
              </Col>
            );
          })
        ) : (
          <p>No posts available.</p>
        )}
      </Row>
    </Container>
  );
};


export default AuthorDetails;
