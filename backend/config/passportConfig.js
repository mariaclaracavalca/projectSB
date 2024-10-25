import GoogleStrategy from "passport-google-oauth20";
import Author from "../models/Authors.js";
import jwt from "jsonwebtoken";

// config autenticazione Google
const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID, 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL, 
  },
  
  async function (accessToken, refreshToken, profile, passportNext) {
    console.log("Esecuzione strategia Google");

    try {
      const { given_name: name, family_name: surname, email, sub: googleId, picture: avatar } = profile._json;
      console.log("Dati ottenuti da Google:", { googleId, name, surname, email });

      let author = await Author.findOne({ googleId });
      console.log("Autore esistente:", author);

      if (!author) {
        console.log("Creazione nuovo autore");
        const newAuthor = new Author({ googleId, name, surname, email, avatar });
        author = await newAuthor.save();
        console.log("Autore creato:", author);
      }

      const jwtToken = jwt.sign({ id: author.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      console.log("Token JWT generato:", jwtToken);

      passportNext(null, { jwtToken });
    } catch (error) {
      console.error("Errore nella strategia Google:", error);
      passportNext(error);
    }
  }
);

export default googleStrategy;
