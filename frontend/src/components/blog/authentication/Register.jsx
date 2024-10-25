import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './authentication.css'

const Register = () => {
  const [registerData, setRegisterData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    birthDate: ''
  });

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);  // Stato per mostrare l'alert di successo
  const navigate = useNavigate();

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/authors/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const result = await response.json();
      if (response.ok) {
        setShowSuccessAlert(true);  // Mostra l'alert di successo
        setTimeout(() => {
          navigate('/login');  // Reindirizza alla pagina di login dopo 2 secondi
        }, 2000);  // Aspetta 2 secondi prima di reindirizzare
      } else {
        console.error('Registration failed:', result);
        // Gestisci l'errore come necessario
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <Container className='mt-5'>
      <h2>Register</h2>
      
      {showSuccessAlert && (
        <Alert variant="success">
          Registration successful! You will be redirected to the login.
        </Alert>
      )}

      <Form onSubmit={handleRegisterSubmit}>
        <Form.Group controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter name"
            value={registerData.name}
            onChange={handleRegisterChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicSurname">
          <Form.Label>Surname</Form.Label>
          <Form.Control
            type="text"
            name="surname"
            placeholder="Enter surname"
            value={registerData.surname}
            onChange={handleRegisterChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={registerData.email}
            onChange={handleRegisterChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter password"
            value={registerData.password}
            onChange={handleRegisterChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicBirthDate">
          <Form.Label>Birth Date</Form.Label>
          <Form.Control
            type="date"
            name="birthDate"
            value={registerData.birthDate}
            onChange={handleRegisterChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className='mt-3'>
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
