const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware per servire file statici (es. index.html)
app.use(express.static('public'));

// Route di esempio
app.get('/', (req, res) => {
  res.send('Ciao, mondo da Express!');
});

// Avvio del server
app.listen(port, () => {
  console.log(`Il server è in esecuzione su http://localhost:${port}`);
});
