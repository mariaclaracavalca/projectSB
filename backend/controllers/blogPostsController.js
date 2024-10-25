import BlogPost from '../models/BlogPosts.js';
import Author from '../models/Authors.js';
import { sendPostPublishedEmail } from '../services/Email.js';

export const getBlogPosts = async (req, res) => {
  try {
    const { _page = 1, _limit = 10 } = req.query;
    const skip = (parseInt(_page) - 1) * parseInt(_limit);

    const totalPosts = await BlogPost.countDocuments();
    const posts = await BlogPost.find()
      .populate('author', 'name surname') 
      .skip(skip)
      .limit(parseInt(_limit));

    res.json({
      totalPosts,
      totalPages: Math.ceil(totalPosts / _limit),
      currentPage: parseInt(_page),
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ottieni un singolo post per ID
export const getBlogPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'name surname');
    if (!post) return res.status(404).json({ message: 'Post non trovato' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBlogPost = async (req, res) => {
  try {
    const { category, title, cover, readTime, content } = req.body;
    const defaultAuthorId = '66d9c8459f9a4567c7da80c4';

    const author = await Author.findById(defaultAuthorId);
    if (!author) {
      return res.status(404).json({ message: 'Autore non trovato' });
    }

    const newPost = new BlogPost({
      category,
      title,
      cover,
      readTime,
      content,
      author: defaultAuthorId,
    });

    await newPost.save();

    author.blogPosts.push(newPost._id);
    await author.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Errore durante la creazione del post:', error);
    res.status(400).json({ message: error.message });
  }
};

export const updateBlogPost = async (req, res) => {
  try {
    const { category, title, cover, readTime, content } = req.body;

    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { category, title, cover, readTime, content },
      { new: true }
    );

    if (!updatedPost) return res.status(404).json({ message: 'Post non trovato' });
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cancella un post specifico
export const deleteBlogPost = async (req, res) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: 'Post non trovato' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAllBlogPosts = async (req, res) => {
  try {
    await BlogPost.deleteMany({});
    res.json({ message: 'Tutti i post sono stati cancellati' });
  } catch (error) {
    res.status(500).json({ message: 'Errore del server: ' + error.message });
  }
};

// Crea un nuovo post per l'autore autenticato
export const createOwnBlogPost = async (req, res) => {
  try {
    const { category, title, cover, readTime, content } = req.body;

    const newPost = new BlogPost({
      category,
      title,
      cover,
      readTime,
      content,
      author: req.loggedAuthor._id,
    });

    const savedPost = await newPost.save();

    await Author.findByIdAndUpdate(req.loggedAuthor._id, {
      $push: { blogPosts: savedPost._id }
    });

    await sendPostPublishedEmail(Author, savedPost);

    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Errore durante la creazione del post:', error);
    res.status(400).json({ message: error.message });
  }
};

// Modifica post per l'autore autenticato
export const updateOwnBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trovato' });

    if (post.author.toString() !== req.loggedAuthor._id.toString()) {
      return res.status(403).json({ message: 'Non hai il permesso di modificare questo post' });
    }

    const { category, title, cover, readTime, content } = req.body;

    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { category, title, cover, readTime, content },
      { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancella un post per l'autore autenticato
export const deleteOwnBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trovato' });

    if (post.author.toString() !== req.loggedAuthor._id.toString()) {
      return res.status(403).json({ message: 'Non hai il permesso di cancellare questo post' });
    }

    await BlogPost.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Carica la copertina di un post
export const uploadBlogPostCover = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trovato' });

    post.cover = req.file.path;
    await post.save();

    res.json({ message: 'Cover caricata con successo', coverImage: post.cover });
  } catch (error) {
    res.status(500).json({ message: 'Errore del server: ' + error.message });
  }
};
