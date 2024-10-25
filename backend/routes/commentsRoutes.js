import authorization from '../middlewares/authorization.js';
import express from 'express';
import {
  getCommentsByPostId,
  getCommentById,
  addCommentToPost,
  updateComment,
  deleteComment
} from '../controllers/commentsController.js';

const router = express.Router({ mergeParams: true });

router.get('/', getCommentsByPostId);
router.get('/:commentId', getCommentById);

router.post('/', authorization, addCommentToPost);
router.put('/:commentId', authorization, updateComment);
router.delete('/:commentId', authorization, deleteComment);

export default router; 