import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';



const UploadCover = () => {
  const { id } = useParams(); // Ottieni l'ID dal parametro della rotta
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('coverImage', file);

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/blogposts/${id}/cover`, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      setSuccess('Cover uploaded successfully!');
      setTimeout(() => {
        navigate(`/blogposts/${id}`); // Reindirizza alla pagina dei dettagli del post
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container fluid="sm" className="mt-5">
      <h2>Carica la Copertina del Blog Post</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form>
        <Form.Group>
          <Form.Label>Seleziona un'immagine</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
        <Button onClick={handleUpload} variant="primary" className="mt-3" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Carica Copertina'}
        </Button>
      </Form>
    </Container>
  );
};

export default UploadCover;
