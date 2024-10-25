import Author from '../models/Authors.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendWelcomeEmail } from '../services/Email.js';

dotenv.config();

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token non valido' });
      } else {
        req.authorId = decoded.authorId;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: 'Autenticazione richiesta' });
  }
};

// Recupera tutti gli autori
export const getAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero degli autori: ' + error.message });
  }
};

// Recupera un autore specifico per ID
export const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id).populate('blogPosts');
    if (!author) {
      return res.status(404).json({ message: 'Autore non trovato' });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero dell\'autore: ' + error.message });
  }
};

// Crea un nuovo autore
export const createAuthor = async (req, res) => {
  try {
    const { name, surname, email, password, birthDate, avatar } = req.body;

    if (!name || !surname || !email || !password) {
      return res.status(400).json({ message: 'Campi obbligatori mancanti' });
    }

    const existingAuthor = await Author.findOne({ $or: [{ email }] });
    if (existingAuthor) {
      return res.status(409).json({ message: 'Autore già esistente' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAuthor = new Author({ name, surname, email, password: hashedPassword, birthDate, avatar });

    const savedAuthor = await newAuthor.save();
    res.status(201).json({ author: savedAuthor });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la creazione dell\'autore: ' + error.message });
  }
};

// Aggiorna i dati di un autore esistente
export const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, surname, email, birthDate, avatar } = req.body;

    const updatedAuthor = await Author.findByIdAndUpdate(
      id,
      { name, surname, email, birthDate, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedAuthor) {
      return res.status(404).json({ message: 'Autore non trovato' });
    }

    res.json(updatedAuthor);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante l\'aggiornamento dell\'autore: ' + error.message });
  }
};

// Cancella un autore esistente
export const deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Autore non trovato' });
    }
    res.status(200).json({ message: 'Autore eliminato' });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la cancellazione dell\'autore: ' + error.message });
  }
};

// Cancella tutti gli autori
export const deleteAllAuthors = async (req, res) => {
  try {
    await Author.deleteMany();
    res.status(200).json({ message: 'Tutti gli autori sono stati cancellati' });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la cancellazione degli autori: ' + error.message });
  }
};

// Registra un nuovo autore e invia email di benvenuto
export const registerAuthor = async (req, res) => {
  try {
    const { name, surname, email, password, birthDate } = req.body;

    if (!name || !surname || !email || !password || !birthDate) {
      return res.status(400).json({ message: 'Campi obbligatori mancanti' });
    }

    const existingAuthor = await Author.findOne({ email });
    if (existingAuthor) {
      return res.status(409).json({ message: 'Autore già esistente' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAuthor = new Author({ name, surname, email, password: hashedPassword, birthDate });

    const savedAuthor = await newAuthor.save();
    await sendWelcomeEmail(savedAuthor);

    const token = jwt.sign({ id: savedAuthor._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });
    res.status(201).json({ token, author: savedAuthor });
  } catch (error) {
    res.status(500).json({ message: 'Errore nella registrazione: ' + error.message });
  }
};

// Login per un autore esistente
export const loginAuthor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e password sono obbligatorie' });
    }

    const author = await Author.findOne({ email });
    if (!author) {
      return res.status(401).json({ message: 'Credenziali errate' });
    }

    const isMatch = await bcrypt.compare(password, author.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenziali errate' });
    }

    const token = jwt.sign({ id: author._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });
    res.json({ token, author });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il login: ' + error.message });
  }
};

// Aggiorna il profilo dell'autore autenticato
export const updateProfile = async (req, res) => {
  try {
    const { name, surname, email, birthDate, avatar } = req.body;

    const updatedAuthor = await Author.findByIdAndUpdate(
      req.loggedAuthor._id,
      { name, surname, email, birthDate, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedAuthor) {
      return res.status(404).json({ message: 'Autore non trovato' });
    }

    res.json(updatedAuthor);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante l\'aggiornamento del profilo: ' + error.message });
  }
};

// Cancella il profilo dell'autore autenticato
export const deleteProfile = async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.id);
    if (!author) {
      return res.status(404).json({ message: 'Autore non trovato' });
    }
    res.status(200).json({ message: 'Profilo dell\'autore eliminato' });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la cancellazione del profilo: ' + error.message });
  }
};

// Carica l'avatar dell'autore autenticato
export const uploadAuthorAvatar = async (req, res) => {
  try {
    const author = await Author.findById(req.loggedAuthor._id);
    if (!author) {
      return res.status(404).json({ message: 'Autore non trovato' });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'Errore durante il caricamento del file.' });
    }

    author.avatar = req.file.path;
    await author.save();

    res.json({ message: 'Avatar caricato con successo', avatar: author.avatar });
  } catch (error) {
    console.error('Errore durante il caricamento dell\'avatar:', error);
    res.status(500).json({ message: 'Errore del server durante il caricamento dell\'avatar', error: error.toString() });
  }
};

// Recupera i dati dell'autore autenticato
export const me = async (req, res) => {
  try {
    const author = req.loggedAuthor;

    if (!author) {
      return res.status(404).json({ message: 'Autore non trovato' });
    }

    res.json(author);
  } catch (error) {
    res.status(500).json({ message: 'Errore del server: ' + error.message });
  }
};
