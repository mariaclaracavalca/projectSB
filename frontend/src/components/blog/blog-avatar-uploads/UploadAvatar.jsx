import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';

const UploadAvatar = () => {
  const { id } = useParams(); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    setLoading(true); 
    setError(null); 

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/authors/auth/me/avatar`, {
        method: 'PATCH',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setSuccess("Avatar successfully uploaded!");
        setTimeout(() => {
          navigate(`/authors/${id}`);
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setError(`Errore uploading avatar: ${error.message}`);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Container fluid="sm" className="mt-5">
      <h2>Upload your avatar</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form>
        <Form.Group>
          <Form.Label>Select a picture</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
        <Button onClick={handleUpload} variant="primary" className="mt-3" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Upload avatar"}
        </Button>
      </Form>
    </Container>
  );
};

export default UploadAvatar;
