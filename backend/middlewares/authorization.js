import jwt from "jsonwebtoken";
import Author from "../models/Authors.js";

const JWT_SECRET = process.env.JWT_SECRET;

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Token mancante" });
  }
  
  // Verifica che il token sia nel formato "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Token malformato" });
  }

  const token = parts[1];

  try {
    // Decodifica e verifica il token con la chiave segreta
    const payload = jwt.verify(token, JWT_SECRET);
    console.log("Payload del token:", payload);

    // Trova l'autore associato al token
    const author = await Author.findById(payload.id).select("-password");
    if (!author) {
      return res.status(401).json({ error: "Autore non trovato" });
    }

    req.loggedAuthor = author;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token non valido o scaduto" });
  }
};
