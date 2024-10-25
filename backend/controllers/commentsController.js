import BlogPost from '../models/BlogPosts.js';
import Comment from '../models/Comments.js';

export const getCommentsByPostId = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id).populate({
      path: 'comments',
      populate: { path: 'author', select: 'name surname' } // Popola i campi name e surname dell'autore
    });

    if (!blogPost) {
      return res.status(404).json({ message: 'Post non trovato' });
    }

    res.json(blogPost.comments);
  } catch (error) {
    res.status(500).json({ message: 'Errore del server: ' + error.message });
  }
};


// GET a specific comment by commentId
export const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Commento non trovato' });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Errore del server: ' + error.message });
  }
};

//AGGIUNGERE COMMENTO - UTENTE IDENTIFICATO
export const addCommentToPost = async (req, res) => {
  try {
    // Recupera il post tramite l'ID
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Post non trovato' });
    }

    const { content } = req.body;
    const author = req.loggedAuthor; // L'autore autenticato recuperato dal middleware

    if (!author) {
      return res.status(401).json({ message: 'Utente non autenticato' });
    }

    // Crea il nuovo commento con il content e l'autore
    const newComment = new Comment({
      content,
      author: author._id, // Associa l'autore autenticato al commento
    });

    // Salva il commento e aggiornalo nel post
    await newComment.save();
    blogPost.comments.push(newComment._id); // Aggiungi il commento al post
    await blogPost.save();

    // Popola il campo author con i dettagli
    const populatedComment = await Comment.findById(newComment._id).populate('author', 'name surname');

    // Rispondi con il commento popolato
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Errore del server: ' + error.message });
  }
};





//UPDATE COMMENTO - UTENTE  IDENTIFICATO
export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;

    // Trova il commento per ID
    const comment = await Comment.findById(req.params.commentId);

    // Verifica se il commento esiste
    if (!comment) {
      return res.status(404).json({ message: 'Commento non trovato' });
    }

    // Verifica se l'autore del commento è lo stesso dell'utente autenticato
    if (comment.author.toString() !== req.loggedAuthor._id.toString()) {
      return res.status(403).json({ message: 'Non hai il permesso di modificare questo commento.' });
    }

    // Aggiorna il contenuto del commento
    comment.content = content;
    await comment.save();

    res.json(comment); // Restituisci il commento aggiornato
  } catch (error) {
    res.status(500).json({ message: 'Errore del server: ' + error.message });
  }
};



//CANCELLAZIONE COMMENTO - UTENTE IDENTIFICATO
export const deleteComment = async (req, res) => {
  try {
    // Trova il commento per ID
    const comment = await Comment.findById(req.params.commentId);
    
    // Verifica se il commento esiste
    if (!comment) {
      return res.status(404).json({ message: 'Commento non trovato' });
    }

    // Verifica se l'autore del commento è lo stesso dell'utente autenticato
    if (comment.author.toString() !== req.loggedAuthor._id.toString()) {
      return res.status(403).json({ message: 'Non hai il permesso di eliminare questo commento.' });
    }

    await Comment.deleteOne({ _id: comment._id });

    await BlogPost.findByIdAndUpdate(req.params.id, {
      $pull: { comments: req.params.commentId }, // Rimuove il commento dall'array dei commenti del post
    });

    res.json({ message: 'Commento eliminato' });
  } catch (error) {
    res.status(500).json({ message: 'Errore del server: ' + error.message });
  }
};



