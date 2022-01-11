const express = require('express');
const path = require('path');
const fs = require('fs');
const dbData = require('./db/db.json');
const PORT = 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => res.json(dbData));

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      // review_id: uuid(),
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.log(`Error reading file from disk: ${err}`);
      } else {
        const databases = JSON.parse(data);
        databases.push(newNote);
        const noteString = JSON.stringify(databases);
        fs.writeFile("./db/db.json", noteString, (err) =>
        err
          ? console.error(err)
          : console.log("Note has been written to JSON file")
        );
      } 
    });
  };
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});