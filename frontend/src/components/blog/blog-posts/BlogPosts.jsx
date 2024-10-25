import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Container, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import './BlogPosts.css';


const BlogPost = ({ post }) => (
  <div className="card blog-post-card mb-3">
    <img src={post.cover} className="card-img" alt={post.title} />
    <div className="card-img-overlay">
      <h5 className="card-title">{post.title}</h5>
      <p className="card-text category">
        {post.category}
      </p>
      <p className="card-text author">
        {post.author ? (
          <>By <strong>{post.author.name} {post.author.surname}</strong></>
        ) : (
          <><strong>Author:</strong> Unknown</>
        )}
      </p>
      <p className="card-text time d-none d-lg-block">
        Reading Time: {post.readTime.value} {post.readTime.unit}
      </p>
      <div className="card-text content mb-2">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
      <Link to={`/blogposts/${post._id}`} className="btn mt-2">Read More</Link>
    </div>
  </div>
);

const useFetchAndShufflePosts = (currentPage, postsPerPage) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Scambio degli elementi
    }
    return array;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/blogposts?_page=${currentPage}&_limit=${postsPerPage}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const shuffledPosts = shuffleArray(data.posts); // Mescolare i post subito dopo il caricamento

        setPosts((prevPosts) => {
          const newPosts = shuffledPosts.filter(post => !prevPosts.some(prevPost => prevPost._id === post._id));
          return [...prevPosts, ...newPosts];
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, postsPerPage]);

  return { posts, loading, error };
};

const BlogPosts = () => {
  const postsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { posts, loading, error } = useFetchAndShufflePosts(currentPage, postsPerPage);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadMorePosts = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <Container className='mt-5'>
      <Row className="justify-content-center mb-4">
        <Col md={6}>
          <input
            type="text"
            placeholder="Search posts by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control text-center"
          />
        </Col>
      </Row>

      <Row className="blog-post-row text-center mt-3">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <Col md={6} lg={4} key={post._id} className="blog-post-container">
              <BlogPost key={post._id} post={post} />
            </Col>
          ))
        ) : (
          <p>No posts available with that title.</p>
        )}
      </Row>

      {!loading && (
        <div className="d-flex justify-content-center my-4">
          <Button onClick={loadMorePosts}>Load More</Button>
        </div>
      )}
      {loading && <p>Loading...</p>}
    </Container>
  );
};

export default BlogPosts;

