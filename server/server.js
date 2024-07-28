const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, './flashcards.json');
// const DATA_FILE = path.join(__dirname, './../client/src/flashcards.json');

app.use(bodyParser.json());
app.use(cors());

// Endpoint to save flashcards
app.post('/saveFlashcards', (req, res) => {
  const flashcards = req.body;

  fs.writeFile(DATA_FILE, JSON.stringify(flashcards, null, 2), (err) => {
    if (err) {
      console.error('Error saving flashcards:', err);
      return res.status(500).json({ error: 'Failed to save flashcards' });
    }
    res.json({ message: 'Flashcards saved successfully' });
  });
});

// Endpoint to read flashcards
app.get('/getFlashcards', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) { 
      console.error('Server failed to read flashcards');
      throw err;
    }
    console.log('server read flashcard data:', data);
    res.json(data);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
