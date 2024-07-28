const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, './flashcards1.json');

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
