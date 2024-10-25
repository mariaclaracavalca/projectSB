import React from "react";
import { Container } from "react-bootstrap";
import "./home.css";
import BlogPosts from "../../components/blog/blog-posts/BlogPosts";

const Home = () => {
  return (
    <Container>
      <h1 className="blog-main-title pb-0 mb-0">Benvenuto sullo Strive Blog!</h1>
      <BlogPosts></BlogPosts>
    </Container>
  );
};

export default Home;
