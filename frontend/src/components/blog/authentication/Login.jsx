import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../../../context/AuthContext';
import './authentication.css'

const Login = () => {
  const { login } = useContext(AuthContext); //USO FUNZIONE LOGIN DA CONTESTO
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/authors/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (response.ok) {
        // Usa la funzione login del contesto per aggiornare lo stato di autenticazione
        login(result.token, result.author._id);

        setShowSuccessAlert(true);  // Mostra l'alert di successo
        setTimeout(() => {
          navigate('/');  // Reindirizza alla homepage dopo 2 secondi
        }, 2000);
      } else {
        setErrorMessage(result.message);  // Mostra l'errore se il login fallisce
      }
    } catch (error) {
      setErrorMessage('Error during login, please try again.');
    }
  };

  return (
    <Container fluid="sm">
      <h1>Login if you want to see the content!</h1>
      <Row>
        <Col lg={6}>
          <h2 className='mt-5'>Login</h2>

          {showSuccessAlert && (
            <Alert variant="success">
              Login successful! You will be redirected to the Homepage.
            </Alert>
          )}

          {errorMessage && (
            <Alert variant="danger">
              {errorMessage}
            </Alert>
          )}

          <Form onSubmit={handleLoginSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className='mt-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className='mt-3'>
              Login
            </Button>
          </Form>
        </Col>
        <Col lg={6}>
          <h2 className='mt-5'>...or Login with Google</h2>
          <Button variant="primary" className='mt-3' onClick={() => window.location.href = `${process.env.REACT_APP_API_URL}/auth/login-google`}>
          <i className="bi bi-google"></i> oogle Login
          </Button>

          <h2 className='mt-5'>Not registered yet?</h2>
          <Link to={'/register'}>
          <Button variant="primary" className='mt-3'>
            Click here
          </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
