import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Image, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    email: '',
    birthDate: '',
    avatar: ''
  });
  const [avatarFile, setAvatarFile] = useState(null); 
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); 
  const [avatarLoading, setAvatarLoading] = useState(false); 
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); 
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/authors/auth/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const result = await response.json();
        if (response.ok) {
          setUserData(result); // Popoliamo i dati dell'utente
        } else {
          setErrorMessage('Errore nel recupero dei dati utente');
        }
      } catch (error) {
        setErrorMessage('Errore durante il caricamento dei dati utente');
      } finally {
        setLoading(false); 
      }
    };

    fetchUserData();
  }, []);

  
  const handleInputChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/authors/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setSuccessMessage('Profilo aggiornato con successo!');
        // Reindirizza alla home dopo 2 secondi
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setErrorMessage('Errore durante l\'aggiornamento del profilo');
      }
    } catch (error) {
      setErrorMessage('Errore durante l\'aggiornamento del profilo');
    }
  };

 
  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  
  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      setErrorMessage('Seleziona un file avatar prima di caricare.');
      return;
    }
  
    const formData = new FormData();
    formData.append('avatar', avatarFile); 
  
    setAvatarLoading(true); 
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/authors/auth/me/avatar`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData, 
      });
  
      if (response.ok) {
        setSuccessMessage('Avatar aggiornato con successo!');
        const result = await response.json();
        setUserData({ ...userData, avatar: result.avatarUrl });
        // Reindirizza alla home dopo 2 secondi
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        const result = await response.json();
        setErrorMessage(`Errore durante l'aggiornamento dell'avatar: ${result.message}`);
      }
    } catch (error) {
      setErrorMessage('Errore durante l\'aggiornamento dell\'avatar');
    } finally {
      setAvatarLoading(false); 
    }
  };
  

  return (
    <Container className="mt-5">
      <h2>User profile</h2>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <>

          {userData.avatar && (
            <Image
            src={userData.avatar}
            roundedCircle
            className="profile-avatar mb-3"
            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
          />
          )}
          <Form.Group controlId="formAvatar">
            <Form.Label>Select a new avatar</Form.Label>
            <Form.Control type="file" onChange={handleAvatarChange} />
          </Form.Group>
          <Button variant="primary" onClick={handleAvatarUpload} className="mt-3">
            {avatarLoading ? <Spinner animation="border" size="sm" /> : 'Upload Avatar'}
          </Button>

          <hr />

          <Form onSubmit={handleProfileUpdate}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formSurname">
              <Form.Label>Surname</Form.Label>
              <Form.Control
                type="text"
                name="surname"
                value={userData.surname}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBirthDate">
              <Form.Label>Date of birth</Form.Label>
              <Form.Control
                type="date"
                name="birthDate"
                value={userData.birthDate}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Update Profile
            </Button>
          </Form>


        </>
      )}
    </Container>
  );
};

export default Profile;
