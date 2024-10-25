import React, { useState, useContext } from 'react';
import { Container, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';

const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);  // Visualizzare il modale

  const handleLogout = () => {
    // Esegui il logout solo quando l'utente clicca "OK" nel modale
    logout();
    setShowModal(false);  // Chiudi il modale
    navigate('/login');  // Reindirizza alla pagina di login
  };

  const handleClose = () => {
    setShowModal(false);
    navigate('/login');
  };

  return (
    <Container fluid="sm" className='mt-5'>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have successfylly logged out.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleLogout}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Logout;

