import React, { useState, useContext } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext"; 
import { useNavigate } from 'react-router-dom';
import './New.css'

const NewBlogPost = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Science");
  const [content, setContent] = useState(""); 
  const [cover, setCover] = useState("");
  const [readTime, setReadTime] = useState({ value: 5, unit: "min" });

  const handleSubmit = async (e) => {
    e.preventDefault();  //PER EVITARE IL REFRESH

    if (!isAuthenticated) {
      alert("You have to be logged in to create a post");
      return;
    }

    const userId = localStorage.getItem('userId');  //PRENDIAMO ID PREVIAMENTE SALVATO AL LOGIN

    const postData = {
      title,
      category,
      cover,
      readTime,
      content, 
      authorId: userId  //USIAMO ID UTENTE LOGGATO 
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/blogposts/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        navigate('/blogposts');
      } else {
        const error = await response.json();
        console.error("Error during the post creation:", error.message);
      }
    } catch (error) {console.error("Network error:", error);}
  };

  return (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={handleSubmit}>
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            size="lg"
            as="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Science</option>
            <option>Technology</option>
            <option>Innovation</option>
            <option>Guides and Tutorials</option>
            <option>News</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="blog-cover" className="mt-3">
          <Form.Label>Cover Image</Form.Label>
          <Form.Control
            type="text"
            placeholder="Image Url"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="blog-readtime" className="mt-3">
          <Form.Label>Reading time in minutes</Form.Label>
          <Form.Control
            type="number"
            placeholder="Reading time (in minutes)"
            value={readTime.value}
            onChange={(e) => setReadTime({ ...readTime, value: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Content of the post</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            placeholder="Write your post"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark">
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="dark"
            style={{ marginLeft: "1em" }}
          >
            Send
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default NewBlogPost;
