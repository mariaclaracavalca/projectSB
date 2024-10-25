import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './authors-list.css'

const BlogAuthorsList = () => {
  const [authors, setAuthors] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); 
  const limit = 10;

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/authors?_page=${page}&_limit=${limit}`);
        const data = await response.json();

        //RIMUOVO DUPLICATI
        setAuthors((prevAuthors) => {
          const existingIds = new Set(prevAuthors.map(author => author._id));
          const newAuthors = data.filter(author => !existingIds.has(author._id));
          return [...prevAuthors, ...newAuthors];
        });

        
        if (data.length < limit) {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };

    fetchAuthors();
  }, [page]); 

  const loadMoreAuthors = () => {
    setPage((prevPage) => prevPage + 1);
  };

  
  const filteredAuthors = authors.filter(author =>
    `${author.name} ${author.surname}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container className='mt-5'>
      <Row className="justify-content-center mb-4">
        <Col md={6}>
          <input
            type="text"
            placeholder="Search authors by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control text-center"
          />
        </Col>
      </Row>

      <Row className="blog-author-row">
        {filteredAuthors.length > 0 ? (
          filteredAuthors.map((author) => (
            <Col sm={6} md={4} xl={3} key={author._id}>
              <Link to={`/authors/${author._id}`} style={{ textDecoration: 'none' }}>
                <Card className="author-card">
                  <div className="image-container">
                    <Card.Img variant="top" src={author.avatar} />
                  </div>
                  <Card.Body>
                    <Card.Title>{`${author.name} ${author.surname}`}</Card.Title>
                    <Card.Text>{author.email}</Card.Text>
                    <Card.Text>
                      <strong>Birth Date:</strong> {author.birthDate}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))
        ) : (
          <Col>
            <p>No authors found with these search terms.</p>
          </Col>
        )}
      </Row>

      {hasMore && (
        <div className="d-flex justify-content-center my-4">
          <Button onClick={loadMoreAuthors}>Load More</Button>
        </div>
      )}
    </Container>
  );
};

export default BlogAuthorsList;
