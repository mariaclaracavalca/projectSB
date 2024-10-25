import express from 'express';
import { googleLogin, googleCallback  } from '../controllers/authController.js'
import passport from 'passport';
const router = express.Router();

router.get('/auth/login-google', googleLogin);

router.get('/auth/google/callback', passport.authenticate('google', { session: false }), googleCallback);

  

export default router;

