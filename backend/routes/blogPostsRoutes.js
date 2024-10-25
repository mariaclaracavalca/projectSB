import express from 'express';
import upload from '../config/multerConfig.js';
import authorization from '../middlewares/authorization.js';

import {
  getBlogPosts,
  getBlogPostById,
  createBlogPost,
  createOwnBlogPost,
  updateBlogPost,
  updateOwnBlogPost,
  deleteBlogPost,
  deleteOwnBlogPost,
  deleteAllBlogPosts,
  uploadBlogPostCover,
} from '../controllers/blogPostsController.js';

const router = express.Router();

// Rotte pubbliche (incluse per test e setup)
router.get('/', getBlogPosts);
router.get('/:id', getBlogPostById);
router.post('/', createBlogPost); 
router.put('/:id', updateBlogPost);
router.delete('/:id', deleteBlogPost);
router.delete('/', deleteAllBlogPosts);
router.patch('/:id/cover', upload.single('coverImage'), uploadBlogPostCover);

// Rotte protette (richiedono autenticazione)
router.post('/auth', authorization, createOwnBlogPost); // Crea post autenticato
router.put('/auth/:id', authorization, updateOwnBlogPost); // Aggiorna post autenticato
router.delete('/auth/:id', authorization, deleteOwnBlogPost); // Cancella post autenticato

export default router;
