import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configura il trasportatore per invio email
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST, 
  port: process.env.MAILTRAP_PORT, 
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export default transporter;
