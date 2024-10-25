import express from 'express';
import upload from '../config/multerConfig.js';
import authorization from '../middlewares/authorization.js';

import {
  getAuthors,
  getAuthorById,
  registerAuthor,
  loginAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  deleteAllAuthors,
  uploadAuthorAvatar,
  updateProfile,
  deleteProfile,
  me
} from '../controllers/authorsController.js';

const router = express.Router();

// Rotte pubbliche (non richiedono autenticazione)
router.get('/', getAuthors); 
router.get('/:id', getAuthorById); 
router.post('/register', registerAuthor); 
router.post('/login', loginAuthor);     

// Rotte per il backend (senza autenticazione, usate per test o setup)
router.post('/', createAuthor); 
router.put('/:id', updateAuthor); 
router.delete('/:id', deleteAuthor); 
router.delete('/', deleteAllAuthors); 

// Rotte protette (richiedono autenticazione)
router.put('/auth/me', authorization, updateProfile); // Aggiorna il profilo dell'autore autenticato
router.delete('/auth/me', authorization, deleteProfile); // Cancella il profilo dell'autore autenticato
router.patch('/auth/me/avatar', authorization, upload.single('avatar'), uploadAuthorAvatar); // Carica l'avatar
router.get('/auth/me', authorization, me); // Ottieni i dati dell'autore autenticato

export default router;
