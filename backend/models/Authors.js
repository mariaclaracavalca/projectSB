import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AuthorSchema = new Schema(
  {
    googleId: { type: String, index: true}, //AGGIUNTA IDENTIFICAZIONE CON GOOGLE
    email: { type: String, required: true, unique: true },
    password: { type: String, /*required: false*/ },
    name: { type: String, required: true },
    surname: { type: String /*required: false*/ }, //SURNAME NON REQUIRED PERCHÈ GOOGLE A VOLTE NON LO RESTITUISCE
    birthDate: { type: String, /*required: false*/ },
    blogPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }], // REFERENCING POST
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // REFERENCING COMMENTI
    avatar: { type: String },
  },
  { timestamps: true }
); 

const Author = model("Author", AuthorSchema, "authors");

export default Author;
