import passport from 'passport';

// processo di autenticazione
export const googleLogin = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

// callback di Google
export const googleCallback = (req, res) => {
  console.log("JWT Token ricevuto:", req.user.jwtToken);
  res.redirect(`${process.env.FRONTEND_URL}/?token=${req.user.jwtToken}`);
};
