import transporter from "../config/emailConfig.js";

// email di benvenuto
const sendWelcomeEmail = async (author) => {
  const mailOptions = {
    from: '"Strive Blog" <strive@blog.com>',
    to: author.email,
    subject: 'Benvenuto su Strive Blog!',
    text: `Ciao ${author.name}, siamo felici di averti con noi su Strive Blog!`,
    html: `<p>Ciao ${author.name}, siamo felici di averti con noi su Strive Blog!</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email di benvenuto inviata');
  } catch (error) {
    console.error('Errore nell\'invio della mail di benvenuto:', error);
  }
};

const sendPostPublishedEmail = async (author, blogPost) => {
  const mailOptions = {
    from: '"Strive Blog" <strive@blog.com>',
    to: author.email,
    subject: 'Il tuo post è stato pubblicato!',
    text: `Congratulazioni, ${author.name}! Il tuo post "${blogPost.title}" è ora online.`,
    html: `<p>Congratulazioni, ${author.name}! Il tuo post "${blogPost.title}" è ora online.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email di notifica post pubblicato inviata');
  } catch (error) {
    console.error('Errore nell\'invio della mail di post pubblicato:', error);
  }
};

export { sendWelcomeEmail, sendPostPublishedEmail };
