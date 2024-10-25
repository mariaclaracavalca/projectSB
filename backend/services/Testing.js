import transporter from "../config/emailConfig.js";

const sendTestEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: '"Mittente Test" <test@example.com>', 
      to: 'destinatario@example.com', 
      subject: 'Email di Test', 
      text: 'Salve a tutti, questa è una email di prova.', 
      html: '<p>Salve a tutti, questa è una email di prova.</p>', 
    });

    console.log('Email inviata:', info.messageId);
  } catch (error) {
    console.error('Errore durante l\'invio della mail:', error);
  }
};

sendTestEmail();
